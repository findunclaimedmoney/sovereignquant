/**
 * Sovereign Quant — Auth (Phase A)
 * Real Supabase client. Project: lerjughvnwxgnrtlcrnd
 */
(function () {
  const SUPABASE_URL = "https://lerjughvnwxgnrtlcrnd.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_TrnVc2zfj-wNhFwOcD3osw_8yWvus3U";

  window.SQAuth = {
    ready: false,
    user: null,
    client: null,

    async init() {
      // Load supabase-js from CDN if not already present
      if (!window.supabase) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      this.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      const { data: { session } } = await this.client.auth.getSession();
      this.user = session?.user ?? null;
      this.ready = true;
      this._renderHeader();

      // Keep header in sync on auth changes
      this.client.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user ?? null;
        this._renderHeader();
      });

      return this.user;
    },

    async signIn(email, password) {
      if (!this.client) await this.init();
      const { data, error } = await this.client.auth.signInWithPassword({ email, password });
      if (!error) this.user = data.user;
      return { data, error };
    },

    async signUp(email, password) {
      if (!this.client) await this.init();
      const { data, error } = await this.client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://sovereignquant.com.au/dashboard.html"
        }
      });
      if (!error && data.user) this.user = data.user;
      return { data, error };
    },

    async signOut() {
      if (!this.client) await this.init();
      await this.client.auth.signOut();
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
        const btn = slot.querySelector("[data-signout]");
        if (btn) {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            this.signOut();
          });
        }
      } else {
        slot.innerHTML = `<a href="/login.html">Login</a>`;
      }
    }
  };

  document.addEventListener("DOMContentLoaded", () => window.SQAuth.init());
})();
