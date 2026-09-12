(function () {
  var DATE_RE = /^(date|datetime|trade.?date|timestamp|time|settlement)$/i;
  var OPEN = /^(open|o|opening)$/i;
  var HIGH = /^(high|h)$/i;
  var LOW = /^(low|l)$/i;
  var CLOSE = /^(close|c|last|adj.?close|closing)$/i;
  var PRICE = /^(price|t\.?\s*price|fill|avg.?price|consideration)$/i;
  var QTY = /^(qty|quantity|size|volume|shares|units)$/i;
  var SIDE = /^(side|action|type|buy.?sell|bs)$/i;
  var SYMBOL = /^(symbol|ticker|security|code|market|instrument)$/i;

  function splitCsvLine(line) {
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

  function has(headers, re) {
    return headers.some(function (h) {
      return re.test(h.trim());
    });
  }

  function detectKind(headers) {
    var date = headers.some(function (h) {
      return DATE_RE.test(h.trim());
    });
    if (!date) return null;
    if (has(headers, OPEN) && has(headers, HIGH) && has(headers, LOW) && has(headers, CLOSE))
      return "ohlcv";
    if (has(headers, PRICE) && (has(headers, QTY) || has(headers, SIDE))) return "fills";
    if (has(headers, SYMBOL) && (has(headers, PRICE) || has(headers, QTY))) return "broker";
    if (has(headers, CLOSE) || has(headers, PRICE)) return "broker";
    return null;
  }

  var KIND_COPY = {
    ohlcv: "OHLCV bars mapped. This is the preferred file.",
    fills: "Fills file mapped. Trade stats will run. Bars still needed for the equity window.",
    broker: "Broker-style export mapped. We will attempt one mapping pass.",
  };

  function inspectCsv(fileName, text) {
    var cleaned = text.replace(/^\uFEFF/, "");
    var lines = cleaned.split(/\r?\n/).filter(function (l) {
      return l.trim().length > 0;
    });
    if (!lines.length) return { ok: false, fileName: fileName, message: "Empty file." };

    var headerIdx = 0;
    var headers = splitCsvLine(lines[0]).map(function (h) {
      return h.replace(/^['"]|['"]$/g, "");
    });
    if (
      headers.every(function (h) {
        return !/[a-zA-Z]/.test(h);
      }) &&
      lines.length > 1
    ) {
      headerIdx = 1;
      headers = splitCsvLine(lines[1]);
    }

    var kind = detectKind(headers);
    var dataRows = lines.slice(headerIdx + 1);
    if (!kind) {
      return {
        ok: false,
        fileName: fileName,
        message:
          "Unrecognised header. Need a Date column plus OHLCV, or a fills file (datetime, side, qty, price). CommSec / IG / IBKR exports are accepted if they can be mapped.",
      };
    }
    if (!dataRows.length) {
      return { ok: false, fileName: fileName, message: "Headers only — no bars or fills." };
    }
    return {
      ok: true,
      kind: kind,
      fileName: fileName,
      rows: dataRows.length,
      headers: headers,
      message: KIND_COPY[kind],
    };
  }

  function render(el, v) {
    el.hidden = false;
    el.className = "status-box " + (v.ok ? "ok" : "bad");
    var extra = v.ok
      ? "<p class='fine' style='margin:8px 0 0'>" +
        v.rows.toLocaleString("en-AU") +
        " rows · " +
        v.kind +
        " · " +
        v.headers.slice(0, 6).join(", ") +
        (v.headers.length > 6 ? "…" : "") +
        "</p>"
      : "";
    var pay = v.ok
      ? '<p class="actions"><a class="btn" href="https://buy.stripe.com/cNibJ108S6q4aKc9Fqes002">Proceed — A$199</a></p>'
      : "";
    el.innerHTML =
      "<p><strong>" +
      v.fileName +
      "</strong></p><p>" +
      v.message +
      "</p>" +
      extra +
      pay;
  }

  function bind(root) {
    if (!root) return;
    var input = root.querySelector('input[type="file"]');
    var out = root.querySelector("[data-verdict]");
    var drop = root.querySelector(".drop") || root;
    if (!input || !out) return;

    function run(file) {
      if (!file) return;
      if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
        render(out, {
          ok: false,
          fileName: file.name,
          message: "Send a .csv — not a screenshot, PDF, or platform export zip.",
        });
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        render(out, {
          ok: false,
          fileName: file.name,
          message: "File is over 8 MB. Split to one market.",
        });
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        render(out, inspectCsv(file.name, String(reader.result || "")));
      };
      reader.readAsText(file);
    }

    input.addEventListener("change", function () {
      if (input.files && input.files[0]) run(input.files[0]);
    });
    drop.addEventListener("dragover", function (e) {
      e.preventDefault();
      drop.classList.add("over");
    });
    drop.addEventListener("dragleave", function () {
      drop.classList.remove("over");
    });
    drop.addEventListener("drop", function (e) {
      e.preventDefault();
      drop.classList.remove("over");
      if (e.dataTransfer && e.dataTransfer.files[0]) run(e.dataTransfer.files[0]);
    });
  }

  document.querySelectorAll("[data-csv-preflight]").forEach(bind);
})();
