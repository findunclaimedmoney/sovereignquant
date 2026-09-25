/**
 * Sovereign Quant — Auth scaffold (Phase A)
 * Plug in your Supabase project URL + anon key below.
 * Free tier at https://supabase.com is enough to start.
 */
(function () {
  const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";   // ← replace
  const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";                 // ← replace

  // Minimal client (no external dependency required for scaffold)
  // When ready, load https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
  // and replace the stub below with real createClient().

  window.SQAuth = {
    ready: false,
    user: null,

    async init() {
      // Placeholder: in production this becomes
      // const { createClient } = supabase;
      // this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      // const { data: { session } } = await this.client.auth.getSession();
      // this.user = session?.user ?? null;
      this.ready = true;
      this._renderHeader();
      return this.user;
    },

    async signIn(email, password) {
      // Real: return this.client.auth.signInWithPassword({ email, password });
      console.warn("SQAuth: replace with real Supabase signIn");
      return { error: { message: "Auth not configured yet. Add your Supabase keys in auth.js" } };
    },

    async signUp(email, password) {
      // Real: return this.client.auth.signUp({ email, password });
      console.warn("SQAuth: replace with real Supabase signUp");
      return { error: { message: "Auth not configured yet. Add your Supabase keys in auth.js" } };
    },

    async signOut() {
      // Real: await this.client.auth.signOut();
      this.user = null;
      location.href = "/login.html";
    },

    requireAuth() {
      if (!this.user) {
        location.href = "/login.html?next=" + encodeURIComponent(location.pathname);
        return false;
      }
      return true;
    },

    _renderHeader() {
      const slot = document.querySelector("[data-auth-slot]");
      if (!slot) return;
      if (this.user) {
        slot.innerHTML = `<a href="/dashboard.html">Account</a> <a href="#" data-signout>Sign out</a>`;
        slot.querySelector("[data-signout]")?.addEventListener("click", (e) => {
          e.preventDefault();
          this.signOut();
        });
      } else {
        slot.innerHTML = `<a href="/login.html">Login</a>`;
      }
    }
  };

  document.addEventListener("DOMContentLoaded", () => window.SQAuth.init());
})();
