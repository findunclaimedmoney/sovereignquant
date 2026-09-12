(function () {
  var KEY = "sq-mia-v1";
  var STRIPE199 = "https://buy.stripe.com/cNibJ108S6q4aKc9Fqes002";
  var STRIPE799 = "https://buy.stripe.com/9B64gz4p8cOs7y02cYes004";
  var MAIL = "mailto:reports@sovereignquant.com.au";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
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

  function mark(topic) {
    if (mem.topics.indexOf(topic) === -1) mem.topics.push(topic);
    save(mem);
  }
  function saw(topic) {
    return mem.topics.indexOf(topic) !== -1;
  }
  function name() {
    return mem.name || "";
  }
  function hey() {
    return name() ? name() + ", " : "";
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
      return "You're on the sample report. Hypothetical. MIXED — in-sample up, out-of-sample down. That's the point, not a score on your account.";
    if (PAGE.indexOf("work") !== -1)
      return "This is the file spec. Date plus OHLCV, or a fills file. CommSec, IG, IBKR exports if we can map them.";
    if (PAGE.indexOf("after") !== -1)
      return "After Stripe: email the CSV to reports@sovereignquant.com.au with the receipt number. One file for A$199. Three for A$799.";
    return "";
  }

  var INTENTS = [
    {
      id: "price",
      keys: ["price", "cost", "how much", "199", "799", "$", "aud", "cheap", "expensive", "fee"],
      fn: function () {
        mark("price");
        return (
          hey() +
          "Two cheques, not a subscription.<br><br>" +
          "<strong>A$199</strong> — one CSV, one HTML robustness report. In-sample vs out-of-sample, equity, drawdown. Two business days.<br><br>" +
          "<strong>A$799</strong> — three files, three reports, plus comparative notes. That's the pack if one tape isn't enough.<br><br>" +
          (saw("pack")
            ? "We already covered why three markets. Short version: one surviving OOS can still be a lucky market."
            : "Don't start at 799 if you only have one export.") +
          '<br><br><a href="' +
          STRIPE199 +
          '">Pay A$199</a> · <a href="' +
          STRIPE799 +
          '">Pay A$799</a>'
        );
      },
    },
    {
      id: "pack",
      keys: ["799", "three market", "3 market", "multi", "pack", "why three", "comparative", "cross-market"],
      fn: function () {
        mark("pack");
        mark("price");
        return (
          "A$199 kills the fitted story. It does not kill the tape.<br><br>" +
          "One out-of-sample window can still be a lucky market. Three withheld windows, same rules:<br>" +
          "• fail on all three — the idea was the curve-fit<br>" +
          "• hold on one, die on two — you had a market, not a method<br>" +
          "• three agree — a research finding. Still not a trade.<br><br>" +
          "Three separate 199s is A$597 and you line them up. The pack is A$799 because the comparison is the work.<br><br>" +
          '<a href="' +
          STRIPE799 +
          '">Three-market pack</a> · <a href="/#buy">Why A$799 on the page</a>'
        );
      },
    },
    {
      id: "sample",
      keys: ["sample", "example", "demo", "look like", "show me", "split", "oos", "in-sample", "walk-forward", "report"],
      fn: function () {
        mark("sample");
        return (
          "Open the sample first. It's hypothetical public-style data, stamped MIXED: IS +12.4%, OOS −3.1%, max DD −9.8%. Not a track record, not your account, not a forecast.<br><br>" +
          "That's the artefact you buy — HTML, walk-forward, the split drawn. If that isn't the work you wanted, don't send a file.<br><br>" +
          '<a href="sample.html">Open the sample</a>'
        );
      },
    },
    {
      id: "csv",
      keys: ["csv", "file", "upload", "commsec", "ibkr", "ig ", "ohlc", "column", "header", "excel", "broker", "export", "mt4", "mt5"],
      fn: function () {
        mark("csv");
        return (
          "Drop a CSV on this page first. Mapping stays in your browser. A green tick means we can read it — not that the strategy survived. I can't see your file from here, which is the point.<br><br>" +
          "Need: a Date column, plus OHLCV, or fills (datetime, side, qty, price). CommSec, IG, IBKR if they map. One market per file. Not a screenshot, not a PDF, not a zip.<br><br>" +
          "Nothing is emailed until you pay and send it yourself.<br><br>" +
          '<a href="/#csv">CSV check</a> · <a href="work.html">File spec</a>'
        );
      },
    },
    {
      id: "pay",
      keys: ["pay", "stripe", "checkout", "email", "receipt", "after", "fulfil", "fulfill", "how do i buy", "order", "send"],
      fn: function () {
        mark("pay");
        return (
          "No account. Stripe, then email.<br><br>" +
          "1. Pay the link.<br>" +
          "2. Keep the receipt.<br>" +
          "3. Email the CSV to reports@sovereignquant.com.au with that receipt number.<br>" +
          "4. Two business days. HTML back. No buy list.<br><br>" +
          "Unreadable file after one mapping attempt: that unit refunded. We do not invent bars.<br><br>" +
          '<a href="' +
          STRIPE199 +
          '">A$199</a> · <a href="after.html">After you pay</a> · <a href="' +
          MAIL +
          '">Email the desk</a>'
        );
      },
    },
    {
      id: "guard",
      keys: ["signal", "trade", "advice", "afsl", "login", "api", "broker", "custody", "account", "buy list", "sell", "licence", "asic"],
      fn: function () {
        mark("guard");
        return (
          "Hard no on the fun stuff, " +
          (name() || "mate") +
          ".<br><br>" +
          "No broker login. No API keys. No custody. No buy/sell list. Not AFSL advice. We do not place trades and we do not hold funds.<br><br>" +
          "You get a research HTML. What you do after that is yours, including losing money."
        );
      },
    },
    {
      id: "time",
      keys: ["how long", "turnaround", "days", "when", "fast", "urgent", "weekend"],
      fn: function () {
        return "Two business days after a readable file lands. Australian desk. Weekend emails wait for Monday. If you need it in an hour, this isn't that shop.";
      },
    },
    {
      id: "books",
      keys: ["book", "volume", "pdf", "read", "philosophy", "method", "guide"],
      fn: function () {
        return (
          "Volume I and II are the free read — the judgement behind the split, not a signal. Education first, then the sample, then a file if you still care.<br><br>" +
          '<a href="/book/Sovereign_Quant_Volume_I_Black_and_Gold.pdf">Vol. I</a> · <a href="/book/Sovereign_Quant_Volume_II_Architecture.pdf">Vol. II</a>'
        );
      },
    },
    {
      id: "workstation",
      keys: ["workstation", "offline", "machine", "license", "licence", "pro", "desktop", "hmac", "agent"],
      fn: function () {
        return "The workstation is the same judgement, offline, after you've bought at least one paid report. Don't start there. Sample, then one file. If that HTML is the work you wanted, ask the desk about a yearly key. It is software licensing, not a fund.";
      },
    },
    {
      id: "refund",
      keys: ["refund", "money back", "cancel", "wrong file"],
      fn: function () {
        return "If the file is unreadable after one mapping attempt, that unit is refunded. We don't invent bars. If we delivered the HTML and you just didn't like the OOS, that's the product working — not a refund.";
      },
    },
    {
      id: "who",
      keys: ["who are you", "your name", "mia", "bot", "ai", "human", "real", "sales"],
      fn: function () {
        return "Mia — sales and customer service for this site only. Quant research reports, not a broker, not a fund, not another industry. I know the sample, the file spec, A$199, the three-market pack, Stripe, email fulfilment, refunds, and the guardrails. I remember this browser. For a human: reports@sovereignquant.com.au";
      },
    },
    {
      id: "hello",
      keys: ["hello", "hi ", "hey", "g'day", "gday", "morning", "afternoon", "howdy"],
      fn: function () {
        var n = name();
        if (n && mem.visits > 1)
          return "Welcome back, " + n + ". Product, file spec, or an order in progress?";
        if (n) return "Hello " + n + ". I can help with the sample, CSV, pricing, or after you pay. Where are you up to?";
        return "Hello. Mia, Sovereign Quant. I handle product questions and customer service on this site — walk-forward reports, files, A$199 and A$799. What do you need?";
      },
    },
    {
      id: "thanks",
      keys: ["thanks", "thank you", "cheers", "ta "],
      fn: function () {
        return "You're welcome" + (name() ? ", " + name() : "") + ". If you're ready: sample first, then the CSV check, then Stripe. Or email reports@sovereignquant.com.au";
      },
    },
    {
      id: "help",
      keys: ["help", "what can you", "menu", "options", "enquire", "inquiry", "enquiry"],
      fn: function () {
        return "Product enquiry and customer service for this desk only.<br><br>• What the report is (sample)<br>• What file to send (CSV spec)<br>• A$199 one market vs A$799 three markets<br>• How to pay and what happens after Stripe<br>• Turnaround, refunds, what we refuse to do<br><br>I don't cover other industries, signals, or general chat.";
      },
    },
  ];

  function extractName(text) {
    var m =
      text.match(/(?:i(?:['’]m| am)|my name is|call me|it(?:['’]s| is))\s+([A-Z][a-z]{1,20})/) ||
      text.match(/^(?:i(?:['’]m| am))\s+([a-z]{2,20})$/i);
    if (!m) return;
    var n = m[1].replace(/[^A-Za-z]/g, "");
    if (!n || /^(mia|here|just|the|looking|trying|good|not)$/i.test(n)) return;
    mem.name = n.charAt(0).toUpperCase() + n.slice(1).toLowerCase();
    save(mem);
  }

  function score(text, keys) {
    var t = " " + text.toLowerCase() + " ";
    var n = 0;
    for (var i = 0; i < keys.length; i++) {
      if (t.indexOf(keys[i]) !== -1) n += keys[i].length > 4 ? 2 : 1;
    }
    return n;
  }

  function offTopic(t) {
    var no = [
      "missing cash", "unclaimed", "lost super", "stratton", "car loan", "car finance",
      "personal loan", "mortgage", "dating", "girlfriend", "intimacy", "sexy",
      "crypto tip", "what coin", "bitcoin buy", "forex signal", "which stock",
      "weather", "recipe", "homework", "write code", "other website", "canva",
      "robinhood", "etoro", "webull",
    ];
    for (var i = 0; i < no.length; i++) if (t.indexOf(no[i]) !== -1) return true;
    return false;
  }

  function reply(raw) {
    var text = raw.trim();
    if (!text) return "Say something. Sample, file, or price is a decent start.";
    extractName(text);
    var t = text.toLowerCase();

    if (offTopic(t)) {
      return "I only cover this desk: Sovereign Quant research reports — sample, CSV spec, A$199 / A$799, fulfilment, and what we will not do. Product enquiry and customer service. Nothing else.";
    }

    if (/\b(buy|sell|long|short)\b.+\b(now|today|asx|btc|eth)\b/.test(t) || /what should i (buy|trade)/.test(t)) {
      mark("guard");
      return "That's a signal. We don't do those. Research HTML only. If you want a tip from a chat box, you're in the wrong decade.";
    }

    var best = null;
    var bestN = 0;
    for (var i = 0; i < INTENTS.length; i++) {
      var n = score(t, INTENTS[i].keys);
      if (n > bestN) {
        bestN = n;
        best = INTENTS[i];
      }
    }
    if (best && bestN > 0) return best.fn();

    var hint = pageHint();
    return (
      "I only take product and service questions for Sovereign Quant — this website, this industry.<br><br>" +
      "Ask about: the sample report, CSV format, A$199, the A$799 three-market pack, Stripe, email fulfilment, turnaround, or refunds." +
      (hint ? "<br><br>" + hint : "") +
      '<br><br><a href="' +
      MAIL +
      '">reports@sovereignquant.com.au</a>'
    );
  }

  function injectCss() {
    var s = document.createElement("style");
    s.textContent =
      "#mia-root{position:fixed;right:18px;bottom:18px;z-index:9999;font-family:ui-sans-serif,system-ui,sans-serif}" +
      "#mia-btn{border:1px solid #c9a45c;background:#c9a45c;color:#070806;letter-spacing:.14em;text-transform:uppercase;font-size:11px;padding:12px 16px;cursor:pointer}" +
      "#mia-panel{display:none;width:min(380px,calc(100vw - 28px));height:min(520px,70vh);background:#0c0e0a;border:1px solid #2c2f24;flex-direction:column;margin-bottom:10px;box-shadow:0 12px 40px rgba(0,0,0,.45)}" +
      "#mia-root.open #mia-panel{display:flex}" +
      "#mia-head{padding:12px 14px;border-bottom:1px solid #2c2f24;display:flex;justify-content:space-between;align-items:center;color:#c9a45c;letter-spacing:.16em;font-size:11px;text-transform:uppercase}" +
      "#mia-head button{background:none;border:0;color:#ead7a8;cursor:pointer;font-size:16px}" +
      "#mia-log{flex:1;overflow:auto;padding:14px;display:flex;flex-direction:column;gap:10px}" +
      ".mia-msg{max-width:92%;padding:10px 12px;line-height:1.45;font-size:14px}" +
      ".mia-msg.bot{background:#161910;border:1px solid #2c2f24;color:#f3efe3;align-self:flex-start;font-family:Georgia,Palatino,serif}" +
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

  function openPanel(root) {
    root.classList.add("open");
    var input = root.querySelector("#mia-in");
    if (input) input.focus();
  }

  function boot() {
    injectCss();
    var root = document.createElement("div");
    root.id = "mia-root";
    root.innerHTML =
      '<div id="mia-panel" role="dialog" aria-label="Mia">' +
      '<div id="mia-head"><span>Mia · desk</span><button type="button" id="mia-x" aria-label="Close">×</button></div>' +
      '<div id="mia-log"></div>' +
      '<form id="mia-form"><input id="mia-in" autocomplete="off" maxlength="500" placeholder="Ask about the sample, CSV, or price" /><button type="submit">Send</button></form>' +
      "</div>" +
      '<button type="button" id="mia-btn">Ask Mia</button>';
    document.body.appendChild(root);

    var log = root.querySelector("#mia-log");
    var form = root.querySelector("#mia-form");
    var input = root.querySelector("#mia-in");

    var greet;
    if (mem.visits > 1 && name()) {
      greet =
        "Hello again, " +
        name() +
        ". Still on this browser, still no account. Sample, file, or the 199?";
    } else if (pageHint()) {
      greet = "Mia. " + pageHint() + " Ask me anything on the desk — I'll remember this tab.";
    } else {
      greet =
        "Hello. Mia, Sovereign Quant — product and customer service. I can help with the sample, the CSV, A$199 / A$799, and after you pay. I only cover this desk.";
    }
    bubble(log, "bot", greet);

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
        openPanel(root);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      input.value = "";
      bubble(log, "me", esc(text));
      mem.turns.push({ role: "user", text: text, t: Date.now() });
      if (mem.turns.length > 40) mem.turns = mem.turns.slice(-40);
      save(mem);
      var out = reply(text);
      setTimeout(function () {
        bubble(log, "bot", out);
        mem.turns.push({ role: "mia", text: out, t: Date.now() });
        save(mem);
      }, 220);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
