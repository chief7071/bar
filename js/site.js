(function() {
    var e;
    e = function() {
            function e(e, t) {
                var n, r;
                this.options = { target: "instafeed", get: "popular", resolution: "thumbnail", sortBy: "none", links: !0, mock: !1, useHttp: !1 };
                if (typeof e == "object")
                    for (n in e) r = e[n], this.options[n] = r;
                this.context = t != null ? t : this, this.unique = this._genKey()
            }
            return e.prototype.hasNext = function() { return typeof this.context.nextUrl == "string" && this.context.nextUrl.length > 0 }, e.prototype.next = function() { return this.hasNext() ? this.run(this.context.nextUrl) : !1 }, e.prototype.run = function(t) { var n, r, i; if (typeof this.options.clientId != "string" && typeof this.options.accessToken != "string") throw new Error("Missing clientId or accessToken."); if (typeof this.options.accessToken != "string" && typeof this.options.clientId != "string") throw new Error("Missing clientId or accessToken."); return this.options.before != null && typeof this.options.before == "function" && this.options.before.call(this), typeof document != "undefined" && document !== null && (i = document.createElement("script"), i.id = "instafeed-fetcher", i.src = t || this._buildUrl(), n = document.getElementsByTagName("head"), n[0].appendChild(i), r = "instafeedCache" + this.unique, window[r] = new e(this.options, this), window[r].unique = this.unique), !0 }, e.prototype.parse = function(e) {
                var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g, y, b, w, E, S, x, T, N, C, k, L, A, O, M, _, D;
                if (typeof e != "object") { if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, "Invalid JSON data"), !1; throw new Error("Invalid JSON response") }
                if (e.meta.code !== 200) { if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, e.meta.error_message), !1; throw new Error("Error from Instagram: " + e.meta.error_message) }
                if (e.data.length === 0) { if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, "No images were returned from Instagram"), !1; throw new Error("No images were returned from Instagram") } this.options.success != null && typeof this.options.success == "function" && this.options.success.call(this, e), this.context.nextUrl = "", e.pagination != null && (this.context.nextUrl = e.pagination.next_url);
                if (this.options.sortBy !== "none") {
                    this.options.sortBy === "random" ? M = ["", "random"] : M = this.options.sortBy.split("-"), O = M[0] === "least" ? !0 : !1;
                    switch (M[1]) {
                        case "random":
                            e.data.sort(function() { return .5 - Math.random() });
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
                            throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
                    }
                }
                if (typeof document != "undefined" && document !== null && this.options.mock === !1) {
                    m = e.data, A = parseInt(this.options.limit, 10), this.options.limit != null && m.length > A && (m = m.slice(0, A)), u = document.createDocumentFragment(), this.options.filter != null && typeof this.options.filter == "function" && (m = this._filter(m, this.options.filter));
                    if (this.options.template != null && typeof this.options.template == "string") {
                        f = "", d = "", w = "", D = document.createElement("div");
                        for (c = 0, N = m.length; c < N; c++) {
                            h = m[c], p = h.images[this.options.resolution];
                            if (typeof p != "object") throw o = "No image found for resolution: " + this.options.resolution + ".", new Error(o);
                            E = p.width, y = p.height, b = "square", E > y && (b = "landscape"), E < y && (b = "portrait"), v = p.url, l = window.location.protocol.indexOf("http") >= 0, l && !this.options.useHttp && (v = v.replace(/https?:\/\//, "//")), d = this._makeTemplate(this.options.template, { model: h, id: h.id, link: h.link, type: h.type, image: v, width: E, height: y, orientation: b, caption: this._getObjectProperty(h, "caption.text"), likes: h.likes.count, comments: h.comments.count, location: this._getObjectProperty(h, "location.name") }), f += d
                        }
                        D.innerHTML = f, i = [], r = 0, n = D.childNodes.length;
                        while (r < n) i.push(D.childNodes[r]), r += 1;
                        for (x = 0, C = i.length; x < C; x++) L = i[x], u.appendChild(L)
                    }
                    else
                        for (T = 0, k = m.length; T < k; T++) {
                            h = m[T], g = document.createElement("img"), p = h.images[this.options.resolution];
                            if (typeof p != "object") throw o = "No image found for resolution: " + this.options.resolution + ".", new Error(o);
                            v = p.url, l = window.location.protocol.indexOf("http") >= 0, l && !this.options.useHttp && (v = v.replace(/https?:\/\//, "//")), g.src = v, this.options.links === !0 ? (t = document.createElement("a"), t.href = h.link, t.appendChild(g), u.appendChild(t)) : u.appendChild(g)
                        }
                    _ = this.options.target, typeof _ == "string" && (_ = document.getElementById(_));
                    if (_ == null) throw o = 'No element with id="' + this.options.target + '" on page.', new Error(o);
                    _.appendChild(u), a = document.getElementsByTagName("head")[0], a.removeChild(document.getElementById("instafeed-fetcher")), S = "instafeedCache" + this.unique, window[S] = void 0;
                    try { delete window[S] }
                    catch (P) { s = P }
                }
                return this.options.after != null && typeof this.options.after == "function" && this.options.after.call(this), !0
            }, e.prototype._buildUrl = function() {
                var e, t, n;
                e = "https://api.instagram.com/v1";
                switch (this.options.get) {
                    case "popular":
                        t = "media/popular";
                        break;
                    case "tagged":
                        if (!this.options.tagName) throw new Error("No tag name specified. Use the 'tagName' option.");
                        t = "tags/" + this.options.tagName + "/media/recent";
                        break;
                    case "location":
                        if (!this.options.locationId) throw new Error("No location specified. Use the 'locationId' option.");
                        t = "locations/" + this.options.locationId + "/media/recent";
                        break;
                    case "user":
                        if (!this.options.userId) throw new Error("No user specified. Use the 'userId' option.");
                        t = "users/" + this.options.userId + "/media/recent";
                        break;
                    default:
                        throw new Error("Invalid option for get: '" + this.options.get + "'.")
                }
                return n = e + "/" + t, this.options.accessToken != null ? n += "?access_token=" + this.options.accessToken : n += "?client_id=" + this.options.clientId, this.options.limit != null && (n += "&count=" + this.options.limit), n += "&callback=instafeedCache" + this.unique + ".parse", n
            }, e.prototype._genKey = function() { var e; return e = function() { return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1) }, "" + e() + e() + e() + e() }, e.prototype._makeTemplate = function(e, t) {
                var n, r, i, s, o;
                r = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, n = e;
                while (r.test(n)) s = n.match(r)[1], o = (i = this._getObjectProperty(t, s)) != null ? i : "", n = n.replace(r, function() { return "" + o });
                return n
            }, e.prototype._getObjectProperty = function(e, t) {
                var n, r;
                t = t.replace(/\[(\w+)\]/g, ".$1"), r = t.split(".");
                while (r.length) {
                    n = r.shift();
                    if (!(e != null && n in e)) return null;
                    e = e[n]
                }
                return e
            }, e.prototype._sortBy = function(e, t, n) { var r; return r = function(e, r) { var i, s; return i = this._getObjectProperty(e, t), s = this._getObjectProperty(r, t), n ? i > s ? 1 : -1 : i < s ? 1 : -1 }, e.sort(r.bind(this)), e }, e.prototype._filter = function(e, t) {
                var n, r, i, s, o;
                n = [], r = function(e) { if (t(e)) return n.push(e) };
                for (i = 0, o = e.length; i < o; i++) s = e[i], r(s);
                return n
            }, e
        }(),
        function(e, t) { return typeof define == "function" && define.amd ? define([], t) : typeof module == "object" && module.exports ? module.exports = t() : e.Instafeed = t() }(this, function() { return e })
}).call(this);
(function($) {
    $.fontSpy = function(element, conf) {
        var $element = $(element);
        var defaults = { font: $element.css("font-family"), onLoad: "", onFail: "", testFont: "Comic Sans MS", testString: "QW@HhsXJ", delay: 50, timeOut: 2500 };
        var config = $.extend(defaults, conf);
        var tester = document.createElement("span");
        tester.style.position = "absolute";
        tester.style.top = "-9999px";
        tester.style.left = "-9999px";
        tester.style.visibility = "hidden";
        tester.style.fontFamily = config.testFont;
        tester.style.fontSize = "250px";
        tester.innerHTML = config.testString;
        document.body.appendChild(tester);
        var fallbackFontWidth = tester.offsetWidth;
        tester.style.fontFamily = config.font + "," + config.testFont;

        function checkFont() {
            var loadedFontWidth = tester.offsetWidth;
            if (fallbackFontWidth === loadedFontWidth) {
                if (config.timeOut < 0) {
                    $element.removeClass(config.onLoad);
                    $element.addClass(config.onFail);
                    console.log("failure")
                }
                else {
                    $element.addClass(config.onLoad);
                    setTimeout(checkFont, config.delay);
                    config.timeOut = config.timeOut - config.delay
                }
            }
            else { $element.removeClass(config.onLoad) }
        }
        checkFont()
    };
    $.fn.fontSpy = function(config) {
        return this.each(function() {
            if (undefined == $(this).data("fontSpy")) {
                var plugin = new $.fontSpy(this, config);
                $(this).data("fontSpy", plugin)
            }
        })
    }
})(jQuery);
"use strict";

function sizeTheVideo() {
    var aspectRatio = 1.78;
    var video = jQuery("#heroPlayer");
    var videoHeight = video.outerHeight();
    var newWidth = videoHeight * aspectRatio;
    var halfNewWidth = newWidth / 2;
    video.css({ width: newWidth + "px", left: "50%", "margin-left": "-" + halfNewWidth + "px" })
}
sizeTheVideo();
jQuery(window).resize(function() { sizeTheVideo() });
jQuery(".section__scroll button").on("click", function(event) {
    var body = jQuery("body");
    var nav = jQuery("nav");
    var parent = jQuery(this).parent().parent().parent();
    var offset = parent[0].offsetHeight - nav[0].offsetHeight;
    body.animate({ scrollTop: offset }, "2000")
});
jQuery(document).scroll(function() { var top = jQuery(this).scrollTop(); var hero = jQuery(".section--hero"); if (hero.length) { var nav = jQuery("nav"); var offset = (hero[0].offsetHeight - nav[0].offsetHeight) / 1.5; if (top > offset) { jQuery(".venue-booking-bar").fadeIn() } else { jQuery(".venue-booking-bar").fadeOut() } } });
var instaFeed;
instaFeed = new Instafeed({ target: "instaFeed", get: "user", userId: 1566420698, limit: 4, resolution: "standard_resolution", accessToken: "1566420698.3a81a9f.db8d73ff45df41fb9a84114b35b3e0c4", template: '<div class="instafeed__item"><a href="{{link}}" target="_blank"><img src="{{image}}" class="{{orientation}}"></a></div>', sortBy: "random" });
instaFeed.run();
var sectionEventSwiper;
var swiperSpeed = 2e3;
sectionEventSwiper = new Swiper("#section-events .swiper-container", { nextButton: "#section-events .swiper-button-next", prevButton: "#section-events .swiper-button-prev", slidesPerView: 4, spaceBetween: 15, breakpoints: { 1024: { slidesPerView: 3, spaceBetween: 15 }, 768: { slidesPerView: 2, spaceBetween: 15 }, 480: { slidesPerView: 1, spaceBetween: 15 } } });
var swiperInstance = jQuery(".section.section--swiper");
for (var i = 0; i < swiperInstance.length; i++) { new Swiper("#" + swiperInstance[i].id + " .swiper-container", { slidesPerView: 1, autoplay: swiperSpeed, loop: true, effect: "fade" }) }
var $grid = jQuery(".grid").masonry({ itemSelector: ".grid-item", columnWidth: ".grid-sizer", gutter: 0, percentPosition: true, transitionDuration: 0 });
$grid.imagesLoaded().progress(function(imgLoadData, elem) {
    jQuery(elem.img).closest(".grid-item").css("opacity", 1);
    $grid.masonry("layout")
});
(new WOW).init();
lightbox.option({ resizeDuration: 200, wrapAround: true, disableScrolling: true, showImageNumberLabel: false, albumLabel: "%1 / %2" });
var lbID = "";
var lightboxOnResize = function lightboxOnResize() { if (jQuery(window).width() < 960) { if (!lbID) { lbID = jQuery("[data-lightbox]").attr("data-lightbox") } jQuery("[data-lightbox]").removeAttr("data-lightbox").addClass("lightboxRemoved") } else { jQuery("a.lightboxRemoved").attr("data-lightbox", lbID).removeClass("lightboxRemoved") } };
jQuery(document).ready(lightboxOnResize);
jQuery(window).resize(lightboxOnResize);
jQuery("body").on("click", ".lightboxRemoved", function(e) { return false });
jQuery(".navbar-toggle").on("click", function() { jQuery(this).toggleClass("active") });
(function() { if (true == jQuery.browser.mozilla) { jQuery("body").addClass("firefox") } if (true == jQuery.browser.safari) { jQuery("body").addClass("safari") } })();
jQuery("#booking-dropdown").on("change", function(e) { jQuery("#c-" + jQuery(this).val()).click() });
window.scrollTo(0, 1);
