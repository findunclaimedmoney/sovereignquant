/**
 * Issues the offline workstation key the downloaded package accepts.
 * 365 days. Professional or Institutional. No server.
 */
(function () {
  const SECRET = "CHANGE-ME-TO-A-LONG-RANDOM-SECRET-BEFORE-DISTRIBUTION";

  function todayUtc() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(iso, days) {
    const parts = iso.split("-").map(Number);
    const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    dt.setUTCDate(dt.getUTCDate() + days);
    return dt.toISOString().slice(0, 10);
  }

  function bytesToHex(buf) {
    return Array.from(new Uint8Array(buf)).map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  function b64url(text) {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    bytes.forEach(function (b) { bin += String.fromCharCode(b); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  async function sha256hex(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return bytesToHex(buf);
  }

  async function hmacHex(payload) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
    return bytesToHex(sig);
  }

  async function issue(licensee, tier, issued) {
    const name = String(licensee || "").trim();
    const level = tier === "institutional" ? "institutional" : "professional";
    if (name.length < 2) throw new Error("Enter the name on the Stripe receipt.");
    const start = issued || todayUtc();
    const expires = addDays(start, 365);
    const keyId = (await sha256hex(name + start + level)).slice(0, 10);
    const payload = JSON.stringify({
      expires: expires,
      issued: start,
      key_id: keyId,
      licensee: name,
      machine_id: null,
      tier: level
    });
    const signature = await hmacHex(payload);
    return {
      key: b64url(payload + "|" + signature),
      tier: level,
      licensee: name,
      issued: start,
      expires: expires
    };
  }

  window.SQLicence = { issue: issue };
})();
