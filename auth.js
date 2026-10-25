/**
 * Header link only. Account login was a dead Supabase project.
 * The licence is collected at /login.html after Stripe.
 */
(function () {
  window.SQAuth = {
    ready: true,
    user: null,
    async init() {
      document.querySelectorAll("[data-auth-slot]").forEach(function (slot) {
        slot.innerHTML = '<a href="/login.html">Licence</a>';
      });
      return null;
    },
    requireAuth() { return true; },
    async signOut() { location.href = "/"; }
  };
  document.addEventListener("DOMContentLoaded", function () { window.SQAuth.init(); });
})();
