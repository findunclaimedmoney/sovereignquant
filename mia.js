(function () {
  var KEY = "sq-mia-v2";
  var STRIPE199 = "https://buy.stripe.com/cNibJ108S6q4aKc9Fqes002";
  var STRIPE799 = "https://buy.stripe.com/9B64gz4p8cOs7y02cYes004";
  var STRIPEV1 = "https://buy.stripe.com/fZucN58Fo29O5pSbNyes005";
  var STRIPEV2 = "https://buy.stripe.com/14AdR9f3M4hWdWo6tees006";
  var STRIPEPRO = "https://buy.stripe.com/14A8wPdZI7u86tW18Ues003";
  var STRIPEINST = "https://buy.stripe.com/eVq14n9Js3dS19CcRCes000";
  var MAIL = "mailto:reports@sovereignquant.com.au";
  var A199 = '<a href="' + STRIPE199 + '">A$199</a>';
  var A799 = '<a href="' + STRIPE799 + '">A$799 pack</a>';
  var V1 = '<a href="' + STRIPEV1 + '">Volume I A$19.90</a>';
  var V2 = '<a href="' + STRIPEV2 + '">Volume II A$19.90</a>';
  var PRO = '<a href="' + STRIPEPRO + '">Professional US$499/yr</a>';
  var INST = '<a href="' + STRIPEINST + '">Institutional US$1,999/yr</a>';
  var SAMPLE = '<a href="sample.html">sample report</a>';
  var SPEC = '<a href="work.html">file spec</a>';
  var AFTER = '<a href="after.html">after you pay</a>';
  var CSV = '<a href="/#csv">CSV check</a>';
  var BUY = '<a href="/#buy">why three markets</a>';
  var DESK = '<a href="' + MAIL + '">reports@sovereignquant.com.au</a>';

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || localStorage.getItem("sq-mia-v1") || "{}");
    } catch (e) {
      return {};
    }
  }
  function save(m) {
    try {
      localStorage.setItem(KEY, JSON.stringify(m));
    } catch (e) {}
  }

  var mem = load();
  if (!mem.topics) mem.topics = [];
  if (!mem.turns) mem.turns = [];
  if (!mem.visits) mem.visits = 0;
  mem.visits += 1;
  save(mem);

  function mark(t) {
    if (mem.topics.indexOf(t) === -1) mem.topics.push(t);
    save(mem);
  }
  function name() {
    return mem.name || "";
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&")
      .replace(/</g, "<")
      .replace(/>/g, ">");
  }

  var PAGE = (location.pathname || "/").toLowerCase();
  function pageHint() {
    if (PAGE.indexOf("sample") !== -1)
      return "You are on the " + SAMPLE + ". Hypothetical. MIXED: IS +12.4%, OOS −3.1%. Not your account.";
    if (PAGE.indexOf("books") !== -1)
      return "Books page. Volume I and II are A$19.90 each — Stripe or Google Play. Doctrine, not a signal.";
    if (PAGE.indexOf("work") !== -1)
      return "This is the " + SPEC + ". Date + OHLCV, or fills. One market per file.";
    if (PAGE.indexOf("after") !== -1)
      return "After Stripe: email the CSV to " + DESK + " with the receipt number.";
    return "";
  }

  var STOP = " a an the is it to for of and or my me you we do does can i im ive id what how why when where who on in at be this that with from if so just like about your our their they them then than also too very really please could would should get got want need help hi hey hello ".split(" ");
  var DOMAIN = (
    "sovereign quant backtest walkforward walk-forward sample csv report oos " +
    "out-of-sample insample in-sample stripe 199 799 commsec ibkr ig ohlc ohlcv " +
    "split drawdown robustness html refund workstation volume book fills fill " +
    "market pack turnaround gst invoice email receipt equity curve strategy " +
    "broker export mapping preflight artefact artifact tearsheet comparative " +
    "notes custody signal advice afsl login api checkout fulfilment fulfillment " +
    "price cost pay order buy file spec column header date bars tick mt4 mt5 " +
    "crypto asx nasdaq forex futures options portfolio upgrade three one " +
    "business days monday weekend human desk australia gst invoice abn"
  ).split(" ");

  var KB = [
    {
      id: "what",
      q: "what do you sell what is this product what is sovereign quant what do i get what is a robustness report",
      a:
        "Sovereign Quant sells research HTML, two PDFs, and an offline workstation licence. Not a trade.<br><br>" +
        "One market " + A199 + ". Three markets " + A799 + ".<br>" +
        "Books " + V1 + " · " + V2 + ".<br>" +
        "Workstation " + PRO + " or " + INST + ".<br><br>" +
        "Start with the " + SAMPLE + ".",
    },
    {
      id: "walkforward",
      q: "what is walk forward walk-forward analysis in sample out of sample oos split fitted curve overfitting curve fit lucky curve",
      a:
        "Walk-forward splits the file in time.<br><br>" +
        "<strong>In-sample</strong> is the window the story was fitted on. <strong>Out-of-sample</strong> is data the rules did not see. The OOS is the one that trades.<br><br>" +
        "Most pretty equity curves are one lucky in-sample. The report is the split, not a trophy. See the " + SAMPLE + " — this one is MIXED: IS +12.4%, OOS −3.1%.",
    },
    {
      id: "contains",
      q: "what is in the report html contents deliverable artefact tearsheet equity drawdown stats trades numbers",
      a:
        "The paid artefact is one HTML file per market:<br>• in-sample vs out-of-sample split<br>• equity curve<br>• drawdown / underwater<br>• trade stats only if fills exist<br><br>Never included: a buy/sell list, a broker login, advice, or a forecast. Numbers on the " + SAMPLE + " are hypothetical layout — your file will differ and may be worse.",
    },
    {
      id: "sample",
      q: "sample example demo look like show me try before buy free report public data mixed",
      a:
        "The " + SAMPLE + " is a hypothetical walk-forward on public-style data. Classification on that file: MIXED (IS +12.4%, OOS −3.1%, max DD −9.8%, 84 trades). Not a track record, not your account, not a forecast.<br><br>" +
        "If that HTML is not the work you wanted, do not pay. Open it before Stripe.",
    },
    {
      id: "price199",
      q: "price cost how much 199 single one market one file fee cheap expensive aud dollar",
      a:
        "<strong>A$199</strong> — one CSV, one Robustness Report HTML. Two business days after a readable file arrives.<br><br>" +
        "No subscription. No account. Pay Stripe, email the CSV with the receipt.<br><br>" +
        A199 + " · " + CSV + " first if you want to know the header maps.",
    },
    {
      id: "price799",
      q: "799 three market pack multi market why three comparative notes cross market upgrade 597 202",
      a:
        "A$199 kills the fitted story. It does not kill the tape. One OOS window can still be a lucky market.<br><br>" +
        "Three CSVs, same rules, three withheld windows:<br>" +
        "• fail on all three — the idea was the curve-fit<br>" +
        "• hold on one, die on two — a market, not a method<br>" +
        "• three agree — a research finding. Still not a trade.<br><br>" +
        "Three separate 199s is A$597 and you line them up. The pack is A$799 because the comparison is the work.<br><br>" +
        "Do not start here with one export. " + A799 + " · " + BUY,
    },
    {
      id: "who-for",
      q: "who is this for who should buy trader quant smsf researcher amateur beginner professional",
      a:
        "For someone who already has a backtest or a broker export and wants an independent walk-forward — not a signal, not a managed account.<br><br>" +
        "If you only have one file, buy " + A199 + ". If you already run the same rules on three markets, " + A799 + ".<br><br>" +
        "If you want someone to tell you what to buy tomorrow, this desk will refuse the job.",
    },
    {
      id: "csv",
      q: "csv file format columns header upload drop commsec ibkr ig interactive brokers metatrader mt4 mt5 excel ohlc ohlcv date",
      a:
        "Send a <strong>.csv</strong>. Minimum: <code>date,open,high,low,close</code>. Optional volume and symbol. Fills file: <code>datetime,side,qty,price</code>. Date as YYYY-MM-DD or a broker export we can map.<br><br>" +
        "CommSec, IG, IBKR accepted if they map. One market per file. Three files for the pack.<br><br>" +
        "Test the header on this site first — mapping stays in your browser, nothing is uploaded. " + CSV + " · " + SPEC,
    },
    {
      id: "donotsend",
      q: "password api key secret 2fa screenshot pdf zip platform login",
      a:
        "Do not send passwords, 2FA codes, API secrets, screenshots, PDFs, or zips. A CSV. If the header does not map after one attempt, that unit is refunded. We do not invent bars.",
    },
    {
      id: "preflight",
      q: "check file before pay preflight test header mapping browser upload privacy",
      a:
        "The " + CSV + " on the homepage is free. It runs in your browser. A green tick means the file can be mapped — not that the strategy survived. I cannot see your file from this chat. That is deliberate.",
    },
    {
      id: "pay",
      q: "how to pay stripe checkout order buy process steps email receipt fulfilment fulfillment after payment",
      a:
        "No account.<br>1. Pay " + A199 + " or " + A799 + " on Stripe.<br>2. Keep the receipt number.<br>3. Email the CSV(s) to " + DESK + " with that number in the subject.<br>4. Two business days. HTML back.<br><br>" +
        AFTER + ".",
    },
    {
      id: "turnaround",
      q: "how long turnaround days when ready weekend urgent fast sla business days",
      a:
        "Two <strong>business days</strong> after a readable file lands. Australian desk. Friday night and weekend emails wait for Monday. This is not an instant generator. If you need an hour, this is the wrong shop.",
    },
    {
      id: "refund",
      q: "refund money back cancel unreadable wrong file dislike oos negative",
      a:
        "Unreadable file after one mapping attempt: that unit refunded. We do not invent bars.<br><br>If we delivered the HTML and you dislike a negative out-of-sample, that is the product working — not a refund.",
    },
    {
      id: "guard",
      q: "signal advice afsl trade login api broker custody account buy list sell licence asic managed fund",
      a:
        "Hard limits for this desk:<br>No broker login. No API keys. No custody. No buy/sell list. Not AFSL advice. We do not place trades and we do not hold funds.<br><br>You get a research HTML. What you do after that is yours, including losing money.",
    },
    {
      id: "gst",
      q: "gst tax invoice abn australia overseas international usd foreign",
      a:
        "Prices on the buttons are A$199 and A$799 via Stripe. For an invoice or GST question after payment, email " + DESK + " with the Stripe receipt. The desk is Australia. Overseas cards on Stripe are fine; the work is still research HTML, not a fund.",
    },
    {
      id: "crypto",
      q: "crypto btc eth bitcoin binance coinbase parquet tick data futures options fx forex",
      a:
        "If it is a CSV with a date column and OHLCV (or fills), we will attempt one mapping pass. Tick dumps, raw parquet, and platform zips are out of spec. One market per file. Crypto is not a signal service here — same walk-forward artefact. " + SPEC,
    },
    {
      id: "history",
      q: "how much data years history length bars daily weekly 1 minute",
      a:
        "Send what you have as one market in one CSV. Daily bars are the usual job. Intraday is acceptable if it is still a readable CSV and one market. A few months is a weak walk-forward; several years is more useful. We will not invent missing history.",
    },
    {
      id: "upgrade",
      q: "upgrade from 199 to 799 already paid one want three credit",
      a:
        "If you already paid A$199 and now have two more files, email " + DESK + " with the first receipt. The desk can set off the single against the pack rather than making you buy three singles. Do not assume it is automatic — write.",
    },
    {
      id: "books",
      q: "book volume pdf philosophy method education free read volume i volume ii 19.90 19 1990 doctrine",
      a:
        "The books are paid. A$19.90 each. Volume I is the judgement behind the split. Volume II is the architecture. Not a signal, not a free download on this site — the sample HTML is the free look.<br><br>" +
        V1 + " · " + V2 +
        '<br><br>Google Play: <a href="https://play.google.com/store/books/details?id=9JUHEgAAQBAJ">Volume I</a> · <a href="https://play.google.com/store/books/details?id=X_8HEgAAQBAJ">Volume II</a>',
    },
    {
      id: "workstation",
      q: "workstation offline machine license licence pro professional hmac desktop software key yearly 499 1999 institutional capital",
      a:
        "The workstation is software you run locally. HMAC licence key by email after Stripe. Not a fund, not custody, not a cloud desk.<br><br>" +
        PRO + " — US$1,000,000 capital gate, 3 strategies, walk-forward + branded HTML.<br>" +
        INST + " — US$50,000,000 capital gate, 10 strategies, Monte Carlo / multi-account.<br><br>" +
        "The ceiling is a licence gate, not money we hold. Start with the " + SAMPLE + " if you have not seen the artefact.",
    },
    {
      id: "compare",
      q: "tradingview quantconnect amibroker backtesting software vs difference why not do it myself",
      a:
        "Those tools will fit a curve. This desk's job is the withheld window and a report you can read without us holding an account. You can do walk-forward yourself. You are paying for the artefact done to this spec, in two business days, with the guardrails in writing.",
    },
    {
      id: "negative",
      q: "negative oos bad result fail loss losing strategy",
      a:
        "A negative out-of-sample is a valid report. The sample itself is MIXED. You are paying to see the split, not to be told you were right. If the idea dies on unseen data, that is cheaper than trading it.",
    },
    {
      id: "privacy",
      q: "privacy data security who sees my csv stored cloud",
      a:
        "The on-site " + CSV + " never leaves your browser. After you pay, you email the file to the desk. It is used to produce your HTML. We do not need a broker login and we do not want API keys. Do not send secrets.",
    },
    {
      id: "human",
      q: "human person someone call phone talk operator desk contact email",
      a:
        "Email the desk: " + DESK + ". There is no phone queue and no account portal. Stripe receipt + CSV in the email is the whole job ticket.",
    },
    {
      id: "who-mia",
      q: "who are you mia bot ai sales customer service",
      a:
        "Mia — sales and customer service for <strong>this website only</strong>. I know the product, the files, the prices, fulfilment, and the refusals. I remember this browser, not a cloud login. I am not a trader. For a human: " + DESK + ".",
    },
  ];

  var OFF = [
    "missing cash", "unclaimed", "lost super", "stratton", "car loan", "car finance",
    "personal loan", "mortgage", "dating", "girlfriend", "intimacy", "sexy",
    "which stock", "what coin", "weather", "recipe", "homework", "write me code",
    "robinhood", "etoro", "webull", "canva",
  ];

  function tokens(s) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9$+\-]+/g, " ")
      .split(/\s+/)
      .filter(function (w) {
        return w.length > 1 && STOP.indexOf(w) === -1;
      })
      .map(function (w) {
        if (w === "walk-forward" || w === "walkforward") return "walkforward";
        if (w === "out-of-sample" || w === "oos") return "oos";
        if (w === "in-sample" || w === "insample") return "insample";
        if (w === "csvs" || w === "files") return "csv";
        if (w === "reports") return "report";
        if (w === "markets") return "market";
        if (w === "dollars" || w === "aud") return "price";
        if (w === "$199" || w === "199") return "199";
        if (w === "$799" || w === "799") return "799";
        return w;
      });
  }

  function inDomain(toks) {
    var n = 0;
    for (var i = 0; i < toks.length; i++) if (DOMAIN.indexOf(toks[i]) !== -1) n++;
    return n;
  }

  function kbScore(query, item) {
    var qt = tokens(query);
    var it = tokens(item.q + " " + item.id);
    var hit = 0;
    var seen = {};
    for (var i = 0; i < qt.length; i++) {
      var w = qt[i];
      if (seen[w]) continue;
      seen[w] = 1;
      if (it.indexOf(w) !== -1) hit += w.length > 3 ? 3 : 2;
      if (item.q.indexOf(w) !== -1) hit += 1;
    }
    var qlow = query.toLowerCase();
    if (item.id === "price799" && (qlow.indexOf("799") !== -1 || qlow.indexOf("three") !== -1)) hit += 6;
    if (item.id === "price199" && qlow.indexOf("199") !== -1 && qlow.indexOf("799") === -1) hit += 6;
    if (item.id === "sample" && qlow.indexOf("sample") !== -1) hit += 5;
    return hit;
  }

  function extractName(text) {
    var m =
      text.match(/(?:i(?:['’]m| am)|my name is|call me)\s+([A-Z][a-z]{1,20})/) ||
      text.match(/^i(?:['’]m| am)\s+([a-z]{2,20})$/i);
    if (!m) return;
    var n = m[1].replace(/[^A-Za-z]/g, "");
    if (!n || /^(mia|here|just|the|looking|trying|good|not|interested)$/i.test(n)) return;
    mem.name = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
    save(mem);
  }

  function greet() {
    var n = name();
    var hint = pageHint();
    if (n && mem.visits > 1)
      return "Welcome back" + (n ? ", " + n : "") + ". Product, file, order, or after-pay?";
    if (hint) return "Mia, Sovereign Quant — product and customer service. " + hint;
    return (
      "Hello" +
      (n ? " " + n : "") +
      ". Mia — sales and customer service for this desk. I can answer any product question: what you get, the sample, CSV spec, A$199 vs A$799, Stripe, fulfilment, refunds, and what we refuse. What do you need?"
    );
  }

  function reply(raw) {
    var text = raw.trim();
    if (!text) return "Ask a product question — sample, file, price, or after you pay.";
    extractName(text);
    var t = text.toLowerCase();

    for (var i = 0; i < OFF.length; i++) {
      if (t.indexOf(OFF[i]) !== -1)
        return "I only handle Sovereign Quant on this website: research reports, files, pricing, and customer service. Other industries are out of scope.";
    }
    if (/\b(buy|sell|long|short)\b.+\b(now|today|asx|btc|eth)\b/.test(t) || /what should i (buy|trade)/.test(t)) {
      mark("guard");
      return "That is a signal request. This desk does not give them. Research HTML only.";
    }
    if (/^(hi|hey|hello|g'day|gday|howdy|good (morning|afternoon|evening))\b/.test(t) && tokens(t).length < 4)
      return greet();
    if (/\b(thanks|thank you|cheers)\b/.test(t) && tokens(t).length < 5)
      return "You're welcome" + (name() ? ", " + name() : "") + ". Next step is usually the " + SAMPLE + ", then " + CSV + ", then Stripe.";

    var ranked = KB.map(function (item) {
      return { item: item, n: kbScore(text, item) };
    }).sort(function (a, b) {
      return b.n - a.n;
    });

    var top = ranked[0];
    var toks = tokens(t);
    if (top.n === 0 && inDomain(toks) === 0) {
      return (
        "I answer product and service questions for this desk only.<br><br>" +
        "Try: what you get · " + SAMPLE + " · CSV format · A$199 · three-market A$799 · how to pay · refunds · turnaround.<br><br>" +
        "Human: " + DESK
      );
    }
    if (top.n === 0) {
      return (
        "Closest I can take that is the product itself. " +
        KB[0].a +
        "<br><br>If that missed, ask one of: sample, file spec, A$199, A$799, or after Stripe."
      );
    }

    mark(top.item.id);
    var out = top.item.a;
    if (ranked[1] && ranked[1].n >= top.n - 2 && ranked[1].n >= 4 && ranked[1].item.id !== top.item.id) {
      out += "<br><br><em>Also:</em> " + ranked[1].item.a;
    }
    return (name() && mem.turns.length < 3 ? name() + " — " : "") + out;
  }

  function injectCss() {
    var s = document.createElement("style");
    s.textContent =
      "#mia-root{position:fixed;right:18px;bottom:18px;z-index:9999;font-family:ui-sans-serif,system-ui,sans-serif}" +
      "#mia-btn{border:1px solid #c9a45c;background:#c9a45c;color:#070806;letter-spacing:.14em;text-transform:uppercase;font-size:11px;padding:12px 16px;cursor:pointer}" +
      "#mia-panel{display:none;width:min(400px,calc(100vw - 28px));height:min(540px,72vh);background:#0c0e0a;border:1px solid #2c2f24;flex-direction:column;margin-bottom:10px;box-shadow:0 12px 40px rgba(0,0,0,.45)}" +
      "#mia-root.open #mia-panel{display:flex}" +
      "#mia-head{padding:12px 14px;border-bottom:1px solid #2c2f24;display:flex;justify-content:space-between;align-items:center;color:#c9a45c;letter-spacing:.16em;font-size:11px;text-transform:uppercase}" +
      "#mia-head button{background:none;border:0;color:#ead7a8;cursor:pointer;font-size:16px}" +
      "#mia-log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}" +
      ".mia-msg{max-width:94%;padding:10px 12px;line-height:1.45;font-size:14px}" +
      ".mia-msg.bot{background:#161910;border:1px solid #2c2f24;color:#f3efe3;align-self:flex-start;font-family:Georgia,Palatino,serif}" +
      ".mia-msg.bot code{font-size:12px;color:#ead7a8}" +
      ".mia-msg.me{background:#c9a45c;color:#070806;align-self:flex-end}" +
      ".mia-msg a{color:#ead7a8}" +
      ".mia-msg.me a{color:#3a2a10}" +
      "#mia-form{display:flex;border-top:1px solid #2c2f24}" +
      "#mia-form input{flex:1;min-height:48px;border:0;background:#070806;color:#f3efe3;padding:0 12px;font-size:14px}" +
      "#mia-form input:focus{outline:none}" +
      "#mia-form button{border:0;background:#c9a45c;color:#070806;padding:0 16px;letter-spacing:.1em;text-transform:uppercase;font-size:11px;cursor:pointer}" +
      "@media (max-width:600px){#mia-root{right:10px;bottom:10px}}";
    document.head.appendChild(s);
  }

  function bubble(log, who, html) {
    var d = document.createElement("div");
    d.className = "mia-msg " + who;
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
  }

  function boot() {
    injectCss();
    var root = document.createElement("div");
    root.id = "mia-root";
    root.innerHTML =
      '<div id="mia-panel" role="dialog" aria-label="Mia">' +
      '<div id="mia-head"><span>Mia · product desk</span><button type="button" id="mia-x" aria-label="Close">×</button></div>' +
      '<div id="mia-log"></div>' +
      '<form id="mia-form"><input id="mia-in" autocomplete="off" maxlength="600" placeholder="Ask any product question" /><button type="submit">Send</button></form>' +
      "</div>" +
      '<button type="button" id="mia-btn">Ask Mia</button>';
    document.body.appendChild(root);

    var log = root.querySelector("#mia-log");
    var form = root.querySelector("#mia-form");
    var input = root.querySelector("#mia-in");
    bubble(log, "bot", greet());

    root.querySelector("#mia-btn").addEventListener("click", function () {
      root.classList.toggle("open");
      if (root.classList.contains("open")) input.focus();
    });
    root.querySelector("#mia-x").addEventListener("click", function () {
      root.classList.remove("open");
    });
    document.querySelectorAll("[data-mia]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        root.classList.add("open");
        input.focus();
      });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      input.value = "";
      bubble(log, "me", esc(text));
      mem.turns.push({ role: "user", text: text, t: Date.now() });
      if (mem.turns.length > 50) mem.turns = mem.turns.slice(-50);
      save(mem);
      var out = reply(text);
      setTimeout(function () {
        bubble(log, "bot", out);
        mem.turns.push({ role: "mia", text: out, t: Date.now() });
        save(mem);
      }, 180);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
