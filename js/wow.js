(function() {
    var a, b, c, d, e, f = function(a, b) {
      return function() {
        return a.apply(b, arguments);
      };
    },
    g = [].indexOf || function(a) {
      for (var b = 0, c = this.length; c > b; b++) {
        if (b in this && this[b] === a) return b;
      }
      return -1;
    };
  
    b = function() {
      function a() {}
      return a.prototype.extend = function(a, b) {
        var c, d;
        for (c in b) {
          d = b[c];
          if (null == a[c]) a[c] = d;
        }
        return a;
      };
  
      a.prototype.isMobile = function(a) {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(a);
      };
  
      a.prototype.createEvent = function(a, b, c, d) {
        var e;
        if (null == b) b = !1;
        if (null == c) c = !1;
        if (null == d) d = null;
        if (null != document.createEvent) {
          e = document.createEvent("CustomEvent");
          e.initCustomEvent(a, b, c, d);
        } else if (null != document.createEventObject) {
          e = document.createEventObject();
          e.eventType = a;
        } else {
          e.eventName = a;
        }
        return e;
      };
  
      a.prototype.emitEvent = function(a, b) {
        if (null != a.dispatchEvent) {
          a.dispatchEvent(b);
        } else if (b in (null != a)) {
          a[b]();
        } else if ("on" + b in (null != a)) {
          a["on" + b]();
        } else {
          void 0;
        }
      };
  
      a.prototype.addEvent = function(a, b, c) {
        if (null != a.addEventListener) {
          a.addEventListener(b, c, !1);
        } else if (null != a.attachEvent) {
          a.attachEvent("on" + b, c);
        } else {
          a[b] = c;
        }
      };
  
      a.prototype.removeEvent = function(a, b, c) {
        if (null != a.removeEventListener) {
          a.removeEventListener(b, c, !1);
        } else if (null != a.detachEvent) {
          a.detachEvent("on" + b, c);
        } else {
          delete a[b];
        }
      };
  
      a.prototype.innerHeight = function() {
        return "innerHeight" in window ? window.innerHeight : document.documentElement.clientHeight;
      };
  
      return a;
    }();
  
    c = this.WeakMap || this.MozWeakMap || (c = function() {
      function a() {
        this.keys = [];
        this.values = [];
      }
  
      a.prototype.get = function(a) {
        var b, c, d, e, f;
        for (f = this.keys, b = d = 0, e = f.length; e > d; b = ++d) {
          c = f[b];
          if (c === a) return this.values[b];
        }
      };
  
      a.prototype.set = function(a, b) {
        var c, d, e, f, g;
        for (g = this.keys, c = e = 0, f = g.length; f > e; c = ++e) {
          d = g[c];
          if (d === a) {
            this.values[c] = b;
            return;
          }
        }
        this.keys.push(a);
        this.values.push(b);
      };
  
      return a;
    }());
  
    a = this.MutationObserver || this.WebkitMutationObserver || this.MozMutationObserver || (a = function() {
      function a() {
        "undefined" != typeof console && null !== console && console.warn("MutationObserver is not supported by your browser.");
        "undefined" != typeof console && null !== console && console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.");
      }
  
      a.notSupported = !0;
  
      a.prototype.observe = function() {};
  
      return a;
    }());
  
    d = this.getComputedStyle || function(a) {
      return this.getPropertyValue = function(b) {
        var c;
        if ("float" === b) {
          b = "styleFloat";
        }
        e.test(b) && b.replace(e, function(a, b) {
          return b.toUpperCase();
        });
        return (null != (c = a.currentStyle) ? c[b] : void 0) || null;
      };
      return this;
    };
  
    e = /(\-([a-z]){1})/g;
  
    this.WOW = function() {
      function e(a) {
        if (null == a) a = {};
        this.scrollCallback = f(this.scrollCallback, this);
        this.scrollHandler = f(this.scrollHandler, this);
        this.resetAnimation = f(this.resetAnimation, this);
        this.start = f(this.start, this);
        this.scrolled = !0;
        this.config = this.util().extend(a, this.defaults);
        this.animationNameCache = new c;
        this.wowEvent = this.util().createEvent(this.config.boxClass);
      }
  
      e.prototype.defaults = {
        boxClass: "wow",
        animateClass: "animated",
        offset: 0,
        mobile: !0,
        live: !0,
        callback: null
      };
  
      e.prototype.init = function() {
        var a;
        this.element = window.document.documentElement;
        a = document.readyState;
        if ("interactive" === a || "complete" === a) {
          this.start();
        } else {
          this.util().addEvent(document, "DOMContentLoaded", this.start);
        }
        return this.finished = [];
      };
  
      e.prototype.start = function() {
        var b, c, d, e;
        this.stopped = !1;
        this.boxes = function() {
          var a, c, d, e;
          d = this.element.querySelectorAll("." + this.config.boxClass);
          e = [];
          for (a = 0, c = d.length; c > a; a++) {
            b = d[a];
            e.push(b);
          }
          return e;
        }.call(this);
        this.all = function() {
          var a, c, d, e;
          d = this.boxes;
          e = [];
          for (a = 0, c = d.length; c > a; a++) {
            b = d[a];
            e.push(b);
          }
          return e;
        }.call(this);
        if (this.boxes.length) {
          if (this.disabled()) {
            this.resetStyle();
          } else {
            for (e = this.boxes, c = 0, d = e.length; d > c; c++) {
              b = e[c];
              this.applyStyle(b, !0);
            }
          }
        }
        if (!this.disabled()) {
          this.util().addEvent
  