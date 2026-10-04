/* Builds the walk-forward HTML in the browser. The CSV never leaves the device. */
(function (root) {
  function splitLine(line) {
    var out = [];
    var cur = "";
    var q = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (ch === '"') {
        q = !q;
        continue;
      }
      if (ch === "," && !q) {
        out.push(cur.trim());
        cur = "";
        continue;
      }
      cur += ch;
    }
    out.push(cur.trim());
    return out;
  }

  function col(headers, re) {
    for (var i = 0; i < headers.length; i++) {
      if (re.test(String(headers[i] || "").trim())) return i;
    }
    return -1;
  }

  function num(value) {
    var n = parseFloat(String(value || "").replace(/[$,\s]/g, ""));
    return Number.isFinite(n) ? n : null;
  }

  function parse(text) {
    var lines = String(text || "")
      .replace(/^\uFEFF/, "")
      .split(/\r?\n/)
      .filter(function (line) {
        return line.trim().length > 0;
      });
    if (lines.length < 2) throw new Error("The file has no data rows.");
    var headers = splitLine(lines[0]).map(function (h) {
      return h.replace(/^\uFEFF/, "");
    });
    var dateI = col(headers, /^(date|datetime|trade.?date|timestamp|time)$/i);
    var closeI = col(headers, /^(adj.?close|close|closing|last|price)$/i);
    var sideI = col(headers, /^(side|action|buy.?sell|bs)$/i);
    var qtyI = col(headers, /^(qty|quantity|size|shares|units)$/i);
    if (dateI < 0) throw new Error("No Date column. Use date,open,high,low,close.");
    var rows = [];
    for (var r = 1; r < lines.length; r++) {
      var cells = splitLine(lines[r]);
      var date = cells[dateI];
      if (!date) continue;
      rows.push({
        date: date,
        close: closeI >= 0 ? num(cells[closeI]) : null,
        side: sideI >= 0 ? String(cells[sideI] || "").toLowerCase() : "",
        qty: qtyI >= 0 ? num(cells[qtyI]) : null,
      });
    }
    rows.sort(function (a, b) {
      return String(a.date).localeCompare(String(b.date));
    });
    return { headers: headers, rows: rows, hasClose: closeI >= 0, hasFills: sideI >= 0 && qtyI >= 0 };
  }

  function maxDd(values) {
    var peak = values[0];
    var dd = 0;
    for (var i = 0; i < values.length; i++) {
      if (values[i] > peak) peak = values[i];
      if (peak > 0) {
        var d = (values[i] / peak - 1) * 100;
        if (d < dd) dd = d;
      }
    }
    return dd;
  }

  function analyse(text, fileName) {
    var parsed = parse(text);
    var points = [];
    var kind = "close";
    if (parsed.hasClose) {
      parsed.rows.forEach(function (row) {
        if (row.close !== null && row.close > 0) points.push({ date: row.date, value: row.close });
      });
    } else if (parsed.hasFills) {
      kind = "fills";
      var cash = 0;
      var pos = 0;
      parsed.rows.forEach(function (row) {
        if (row.qty === null || row.close === null) return;
        var buy = /buy|bot|b/.test(row.side) && !/sell/.test(row.side);
        var sell = /sell|sld|s/.test(row.side);
        if (buy) {
          cash -= row.qty * row.close;
          pos += row.qty;
        } else if (sell) {
          cash += row.qty * row.close;
          pos -= row.qty;
        }
        points.push({ date: row.date, value: cash + pos * row.close });
      });
    }
    if (points.length < 20) {
      throw new Error(fileName + " needs at least 20 dated rows with a close or a price.");
    }
    var base = points[0].value;
    if (!base) throw new Error(fileName + " starts at zero, so a percent split is not meaningful.");
    var equity = points.map(function (p) {
      return (p.value / base) * 100;
    });
    var cut = Math.max(1, Math.floor(equity.length * 0.7));
    if (cut >= equity.length) cut = equity.length - 1;
    function ret(a, b) {
      return (b / a - 1) * 100;
    }
    var step = Math.max(1, Math.ceil(equity.length / 80));
    var spark = [];
    for (var i = 0; i < equity.length; i += step) spark.push(equity[i]);
    spark.push(equity[equity.length - 1]);
    return {
      fileName: fileName,
      kind: kind,
      bars: equity.length,
      start: points[0].date,
      end: points[points.length - 1].date,
      isBars: cut,
      oosBars: equity.length - cut,
      isReturn: ret(equity[0], equity[cut - 1]),
      oosReturn: ret(equity[cut - 1], equity[equity.length - 1]),
      maxDd: maxDd(equity),
      isDd: maxDd(equity.slice(0, cut)),
      oosDd: maxDd(equity.slice(cut - 1)),
      spark: spark,
      cutAt: Math.round(((cut - 1) / (equity.length - 1)) * (spark.length - 1)),
    };
  }

  function fmt(n) {
    var sign = n > 0 ? "+" : "";
    return sign + n.toFixed(1) + "%";
  }

  function svg(stats) {
    var w = 640;
    var h = 180;
    var min = Math.min.apply(null, stats.spark);
    var max = Math.max.apply(null, stats.spark);
    if (max === min) max = min + 1;
    var pts = stats.spark
      .map(function (v, i) {
        var x = (i / (stats.spark.length - 1)) * (w - 16) + 8;
        var y = h - 16 - ((v - min) / (max - min)) * (h - 32);
        return x.toFixed(1) + "," + y.toFixed(1);
      })
      .join(" ");
    var splitX = (stats.cutAt / (stats.spark.length - 1)) * (w - 16) + 8;
    return (
      '<svg viewBox="0 0 ' +
      w +
      " " +
      h +
      '" width="100%" role="img" aria-label="Equity split">' +
      '<line x1="' +
      splitX.toFixed(1) +
      '" y1="8" x2="' +
      splitX.toFixed(1) +
      '" y2="' +
      (h - 8) +
      '" stroke="#c9a45c" stroke-dasharray="4 4"/>' +
      '<polyline fill="none" stroke="#ead7a8" stroke-width="2" points="' +
      pts +
      '"/>' +
      "</svg>"
    );
  }

  function section(stats) {
    var note =
      stats.kind === "fills"
        ? "Built from fills (cash plus open position marked at the last fill price)."
        : "Built from the close column. This is the price path, split in time. It is not a signal.";
    return (
      "<section><h2>" +
      escapeHtml(stats.fileName) +
      "</h2><p>" +
      note +
      "</p><p>" +
      escapeHtml(stats.start) +
      " → " +
      escapeHtml(stats.end) +
      " · " +
      stats.bars +
      " rows</p>" +
      svg(stats) +
      "<table><tr><th></th><th>In-sample 70%</th><th>Out-of-sample 30%</th></tr>" +
      "<tr><td>Return</td><td>" +
      fmt(stats.isReturn) +
      "</td><td>" +
      fmt(stats.oosReturn) +
      "</td></tr>" +
      "<tr><td>Max drawdown</td><td>" +
      stats.isDd.toFixed(1) +
      "%</td><td>" +
      stats.oosDd.toFixed(1) +
      "%</td></tr>" +
      "<tr><td>Rows</td><td>" +
      stats.isBars +
      "</td><td>" +
      stats.oosBars +
      "</td></tr></table>" +
      "<p>Full-path max drawdown " +
      stats.maxDd.toFixed(1) +
      "%.</p></section>"
    );
  }

  function escapeHtml(value) {
    var amp = String.fromCharCode(38);
    return String(value)
      .split(amp).join(amp + "amp;")
      .split("<").join(amp + "lt;")
      .split(">").join(amp + "gt;");
  }

  function documentHtml(list, receipt) {
    var body = list.map(section).join("");
    return (
      "<!DOCTYPE html><html lang=\"en-AU\"><head><meta charset=\"utf-8\"><title>Sovereign Quant split</title>" +
      "<style>body{margin:0;background:#070806;color:#f3efe3;font-family:Georgia,serif}main{width:min(760px,calc(100% - 32px));margin:32px auto}h1,h2{font-weight:500}p,td,th{color:#c8c2b2;font-family:system-ui,sans-serif}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #2c2f24;text-align:left;padding:8px 0}th{color:#ead7a8;font-weight:500}</style></head><body><main>" +
      "<p>Sovereign Quant · research file · not advice · not a forecast</p><h1>The curve, split</h1>" +
      (receipt ? "<p>Receipt noted: " + escapeHtml(receipt) + "</p>" : "") +
      body +
      "<p>Figures are calculated on this device from the file you chose. They are not a live track record and they are not a buy or sell list.</p></main></body></html>"
    );
  }

  root.SQReport = {
    analyse: analyse,
    documentHtml: documentHtml,
  };
})(typeof window !== "undefined" ? window : globalThis);
