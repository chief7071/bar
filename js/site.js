(function() {
    var e;
    e = function() {
      function e(e, t) {
        var n, r;
        this.options = {
          target: "instafeed",
          get: "popular",
          resolution: "thumbnail",
          sortBy: "none",
          links: true,
          mock: false,
          useHttp: false
        };
        if (typeof e === "object") {
          for (n in e) {
            r = e[n];
            this.options[n] = r;
          }
        }
        this.context = t != null ? t : this;
        this.unique = this._genKey();
      }
      e.prototype.hasNext = function() {
        return (
          typeof this.context.nextUrl === "string" &&
          this.context.nextUrl.length > 0
        );
      };
      e.prototype.next = function() {
        return this.hasNext() ? this.run(this.context.nextUrl) : false;
      };
      e.prototype.run = function(t) {
        var n, r, i;
        if (
          typeof this.options.clientId !== "string" &&
          typeof this.options.accessToken !== "string"
        ) {
          throw new Error("Missing clientId or accessToken.");
        }
        if (
          typeof this.options.accessToken !== "string" &&
          typeof this.options.clientId !== "string"
        ) {
          throw new Error("Missing clientId or accessToken.");
        }
        if (
          this.options.before != null &&
          typeof this.options.before === "function"
        ) {
          this.options.before.call(this);
        }
        if (typeof document !== "undefined" && document !== null) {
          i = document.createElement("script");
          i.id = "instafeed-fetcher";
          i.src = t || this._buildUrl();
          n = document.getElementsByTagName("head");
          n[0].appendChild(i);
          r = "instafeedCache" + this.unique;
          window[r] = new e(this.options, this);
          window[r].unique = this.unique;
        }
        return true;
      };
      e.prototype.parse = function(e) {
        var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D;
        if (typeof e !== "object") {
          if (
            this.options.error != null &&
            typeof this.options.error === "function"
          ) {
            this.options.error.call(this, "Invalid JSON data");
            return false;
          }
          throw new Error("Invalid JSON response");
        }
        if (e.meta.code !== 200) {
          if (
            this.options.error != null &&
            typeof this.options.error === "function"
          ) {
            this.options.error.call(this, e.meta.error_message);
            return false;
          }
          throw new Error("Error from Instagram: " + e.meta.error_message);
        }
        if (e.data.length === 0) {
          if (
            this.options.error != null &&
            typeof this.options.error === "function"
          ) {
            this.options.error.call(this, "No images were returned from Instagram");
            return false;
          }
          throw new Error("No images were returned from Instagram");
        }
        this.options.success != null &&
          typeof this.options.success === "function" &&
          this.options.success.call(this, e);
        this.context.nextUrl = "";
        if (e.pagination != null) {
          this.context.nextUrl = e.pagination.next_url;
        }
        if (this.options.sortBy !== "none") {
          this.options.sortBy === "random"
            ? (M = ["", "random"])
            : (M = this.options.sortBy.split("-"));
          O = M[0] === "least" ? true : false;
          switch (M[1]) {
            case "random":
              e.data.sort(function() {
                return 0.5 - Math.random();
              });
              break;
            case "recent":
              e.data = this._sortBy(e.data, "created_time", O);
              break;
            case "liked":
              e.data = this._sortBy(e.data, "likes.count", O);
              break;
            case "commented":
              e.data = this._sortBy(e.data, "comments.count", O);
              break;
            default:
              throw new Error(
                "Invalid option for sortBy: '" + this.options.sortBy + "'."
              );
          }
        }
        if (typeof document !== "undefined" && document !== null) {
          m = e.data;
          A = parseInt(this.options.limit, 10);
          if (this.options.limit != null && m.length > A) {
            m = m.slice(0, A);
          }
          u = document.createDocumentFragment();
          if (
            this.options.filter != null &&
            typeof this.options.filter === "function"
          ) {
            m = this._filter(m, this.options.filter);
          }
          if (
            this.options.template != null &&
            typeof this.options.template === "string"
          ) {
            f = "";
            d = "";
            w = "";
            D = document.createElement("div");
            for (c = 0, N = m.length; c < N; c++) {
              h = m[c];
              p = h.images[this.options.resolution];
              if (typeof p !== "object") {
                o = "No image found for resolution: " + this.options.resolution + ".";
                throw new Error(o);
              }
              E = p.width;
              y = p.height;
              b = "square";
              if (E > y) {
                b = "landscape";
              }
              if (E < y) {
                b = "portrait";
              }
              v = p.url;
              l = window.location.protocol.indexOf("http") >= 0;
              if (l && !this.options.useHttp) {
                v = v.replace(/https?:\/\//, "//");
              }
              d = this._makeTemplate(this.options.template, {
                model: h,
                id: h.id,
                link: h.link,
                type: h.type,
                image: v,
                width: E,
  