//CommonTool
var do_gl_JSCtrl_LoadByRequireJS = function (o, a) {
    if (a) {
        o || (o = {});
        try {
            let {
                nameGroup: r,
                name: e,
                path: l,
                initParams: n,
                fInit: t,
                fInitParams: i,
                fShow: f,
                fShowParams: _,
                fCallBack: c,
            } = a;
            requirejs([l], function (a) {
                o[r] || (o[r] = {}),
                    o[r][e] || (o[r][e] = new a(...n)),
                    i || (i = []),
                    _ || (_ = []),
                    t && o[r][e][t](...i),
                    f && o[r][e][f](..._),
                    c && c();
            });
        } catch (o) {
            console.log("do_gl_JSCtrl_LoadByRequireJS:" + o);
        }
    }
};
var req_gl_Hex2Array = function (r) {
    if ("string" == typeof r) {
        for (
            var t = Math.floor(r.length / 2), n = new Uint8Array(t), e = 0;
            e < t;
            e++
        )
            n[e] = parseInt(r.substr(2 * e, 2), 16);
        return n;
    }
};

//sha256
!(function () {
    "use strict";
    function t(t, i) {
        i
            ? ((d[0] =
                d[16] =
                d[1] =
                d[2] =
                d[3] =
                d[4] =
                d[5] =
                d[6] =
                d[7] =
                d[8] =
                d[9] =
                d[10] =
                d[11] =
                d[12] =
                d[13] =
                d[14] =
                d[15] =
                0),
                (this.blocks = d))
            : (this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            t
                ? ((this.h0 = 3238371032),
                    (this.h1 = 914150663),
                    (this.h2 = 812702999),
                    (this.h3 = 4144912697),
                    (this.h4 = 4290775857),
                    (this.h5 = 1750603025),
                    (this.h6 = 1694076839),
                    (this.h7 = 3204075428))
                : ((this.h0 = 1779033703),
                    (this.h1 = 3144134277),
                    (this.h2 = 1013904242),
                    (this.h3 = 2773480762),
                    (this.h4 = 1359893119),
                    (this.h5 = 2600822924),
                    (this.h6 = 528734635),
                    (this.h7 = 1541459225)),
            (this.block = this.start = this.bytes = this.hBytes = 0),
            (this.finalized = this.hashed = !1),
            (this.first = !0),
            (this.is224 = t);
    }
    function i(i, r, s) {
        var e,
            n = typeof i;
        if ("string" === n) {
            var o,
                a = [],
                u = i.length,
                c = 0;
            for (e = 0; e < u; ++e)
                (o = i.charCodeAt(e)) < 128
                    ? (a[c++] = o)
                    : o < 2048
                        ? ((a[c++] = 192 | (o >> 6)), (a[c++] = 128 | (63 & o)))
                        : o < 55296 || o >= 57344
                            ? ((a[c++] = 224 | (o >> 12)),
                                (a[c++] = 128 | ((o >> 6) & 63)),
                                (a[c++] = 128 | (63 & o)))
                            : ((o = 65536 + (((1023 & o) << 10) | (1023 & i.charCodeAt(++e)))),
                                (a[c++] = 240 | (o >> 18)),
                                (a[c++] = 128 | ((o >> 12) & 63)),
                                (a[c++] = 128 | ((o >> 6) & 63)),
                                (a[c++] = 128 | (63 & o)));
            i = a;
        } else {
            if ("object" !== n) throw new Error(h);
            if (null === i) throw new Error(h);
            if (f && i.constructor === ArrayBuffer) i = new Uint8Array(i);
            else if (!(Array.isArray(i) || (f && ArrayBuffer.isView(i))))
                throw new Error(h);
        }
        i.length > 64 && (i = new t(r, !0).update(i).array());
        var y = [],
            p = [];
        for (e = 0; e < 64; ++e) {
            var l = i[e] || 0;
            (y[e] = 92 ^ l), (p[e] = 54 ^ l);
        }
        t.call(this, r, s),
            this.update(p),
            (this.oKeyPad = y),
            (this.inner = !0),
            (this.sharedMemory = s);
    }
    var h = "input is invalid type",
        r = "object" == typeof window,
        s = r ? window : {};
    s.JS_SHA256_NO_WINDOW && (r = !1);
    var e = !r && "object" == typeof self,
        n =
            !s.JS_SHA256_NO_NODE_JS &&
            "object" == typeof process &&
            process.versions &&
            process.versions.node;
    n ? (s = global) : e && (s = self);
    var o =
        !s.JS_SHA256_NO_COMMON_JS && "object" == typeof module && module.exports,
        a = "function" == typeof define && define.amd,
        f = !s.JS_SHA256_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
        u = "0123456789abcdef".split(""),
        c = [-2147483648, 8388608, 32768, 128],
        y = [24, 16, 8, 0],
        p = [
            1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993,
            2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987,
            1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774,
            264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
            2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711,
            113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
            1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
            3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344,
            430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
            1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424,
            2428436474, 2756734187, 3204031479, 3329325298,
        ],
        l = ["hex", "array", "digest", "arrayBuffer"],
        d = [];
    (!s.JS_SHA256_NO_NODE_JS && Array.isArray) ||
        (Array.isArray = function (t) {
            return "[object Array]" === Object.prototype.toString.call(t);
        }),
        !f ||
        (!s.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView) ||
        (ArrayBuffer.isView = function (t) {
            return (
                "object" == typeof t &&
                t.buffer &&
                t.buffer.constructor === ArrayBuffer
            );
        });
    var A = function (i, h) {
        return function (r) {
            return new t(h, !0).update(r)[i]();
        };
    },
        w = function (i) {
            var h = A("hex", i);
            n && (h = b(h, i)),
                (h.create = function () {
                    return new t(i);
                }),
                (h.update = function (t) {
                    return h.create().update(t);
                });
            for (var r = 0; r < l.length; ++r) {
                var s = l[r];
                h[s] = A(s, i);
            }
            return h;
        },
        b = function (t, i) {
            var r = eval("require('crypto')"),
                s = eval("require('buffer').Buffer"),
                e = i ? "sha224" : "sha256",
                n = function (i) {
                    if ("string" == typeof i)
                        return r.createHash(e).update(i, "utf8").digest("hex");
                    if (null === i || void 0 === i) throw new Error(h);
                    return (
                        i.constructor === ArrayBuffer && (i = new Uint8Array(i)),
                        Array.isArray(i) || ArrayBuffer.isView(i) || i.constructor === s
                            ? r.createHash(e).update(new s(i)).digest("hex")
                            : t(i)
                    );
                };
            return n;
        },
        v = function (t, h) {
            return function (r, s) {
                return new i(r, h, !0).update(s)[t]();
            };
        },
        _ = function (t) {
            var h = v("hex", t);
            (h.create = function (h) {
                return new i(h, t);
            }),
                (h.update = function (t, i) {
                    return h.create(t).update(i);
                });
            for (var r = 0; r < l.length; ++r) {
                var s = l[r];
                h[s] = v(s, t);
            }
            return h;
        };
    (t.prototype.update = function (t) {
        if (!this.finalized) {
            var i,
                r = typeof t;
            if ("string" !== r) {
                if ("object" !== r) throw new Error(h);
                if (null === t) throw new Error(h);
                if (f && t.constructor === ArrayBuffer) t = new Uint8Array(t);
                else if (!(Array.isArray(t) || (f && ArrayBuffer.isView(t))))
                    throw new Error(h);
                i = !0;
            }
            for (var s, e, n = 0, o = t.length, a = this.blocks; n < o;) {
                if (
                    (this.hashed &&
                        ((this.hashed = !1),
                            (a[0] = this.block),
                            (a[16] =
                                a[1] =
                                a[2] =
                                a[3] =
                                a[4] =
                                a[5] =
                                a[6] =
                                a[7] =
                                a[8] =
                                a[9] =
                                a[10] =
                                a[11] =
                                a[12] =
                                a[13] =
                                a[14] =
                                a[15] =
                                0)),
                        i)
                )
                    for (e = this.start; n < o && e < 64; ++n)
                        a[e >> 2] |= t[n] << y[3 & e++];
                else
                    for (e = this.start; n < o && e < 64; ++n)
                        (s = t.charCodeAt(n)) < 128
                            ? (a[e >> 2] |= s << y[3 & e++])
                            : s < 2048
                                ? ((a[e >> 2] |= (192 | (s >> 6)) << y[3 & e++]),
                                    (a[e >> 2] |= (128 | (63 & s)) << y[3 & e++]))
                                : s < 55296 || s >= 57344
                                    ? ((a[e >> 2] |= (224 | (s >> 12)) << y[3 & e++]),
                                        (a[e >> 2] |= (128 | ((s >> 6) & 63)) << y[3 & e++]),
                                        (a[e >> 2] |= (128 | (63 & s)) << y[3 & e++]))
                                    : ((s =
                                        65536 + (((1023 & s) << 10) | (1023 & t.charCodeAt(++n)))),
                                        (a[e >> 2] |= (240 | (s >> 18)) << y[3 & e++]),
                                        (a[e >> 2] |= (128 | ((s >> 12) & 63)) << y[3 & e++]),
                                        (a[e >> 2] |= (128 | ((s >> 6) & 63)) << y[3 & e++]),
                                        (a[e >> 2] |= (128 | (63 & s)) << y[3 & e++]));
                (this.lastByteIndex = e),
                    (this.bytes += e - this.start),
                    e >= 64
                        ? ((this.block = a[16]),
                            (this.start = e - 64),
                            this.hash(),
                            (this.hashed = !0))
                        : (this.start = e);
            }
            return (
                this.bytes > 4294967295 &&
                ((this.hBytes += (this.bytes / 4294967296) << 0),
                    (this.bytes = this.bytes % 4294967296)),
                this
            );
        }
    }),
        (t.prototype.finalize = function () {
            if (!this.finalized) {
                this.finalized = !0;
                var t = this.blocks,
                    i = this.lastByteIndex;
                (t[16] = this.block),
                    (t[i >> 2] |= c[3 & i]),
                    (this.block = t[16]),
                    i >= 56 &&
                    (this.hashed || this.hash(),
                        (t[0] = this.block),
                        (t[16] =
                            t[1] =
                            t[2] =
                            t[3] =
                            t[4] =
                            t[5] =
                            t[6] =
                            t[7] =
                            t[8] =
                            t[9] =
                            t[10] =
                            t[11] =
                            t[12] =
                            t[13] =
                            t[14] =
                            t[15] =
                            0)),
                    (t[14] = (this.hBytes << 3) | (this.bytes >>> 29)),
                    (t[15] = this.bytes << 3),
                    this.hash();
            }
        }),
        (t.prototype.hash = function () {
            var t,
                i,
                h,
                r,
                s,
                e,
                n,
                o,
                a,
                f = this.h0,
                u = this.h1,
                c = this.h2,
                y = this.h3,
                l = this.h4,
                d = this.h5,
                A = this.h6,
                w = this.h7,
                b = this.blocks;
            for (t = 16; t < 64; ++t)
                (i =
                    (((s = b[t - 15]) >>> 7) | (s << 25)) ^
                    ((s >>> 18) | (s << 14)) ^
                    (s >>> 3)),
                    (h =
                        (((s = b[t - 2]) >>> 17) | (s << 15)) ^
                        ((s >>> 19) | (s << 13)) ^
                        (s >>> 10)),
                    (b[t] = (b[t - 16] + i + b[t - 7] + h) << 0);
            for (a = u & c, t = 0; t < 64; t += 4)
                this.first
                    ? (this.is224
                        ? ((e = 300032),
                            (w = ((s = b[0] - 1413257819) - 150054599) << 0),
                            (y = (s + 24177077) << 0))
                        : ((e = 704751109),
                            (w = ((s = b[0] - 210244248) - 1521486534) << 0),
                            (y = (s + 143694565) << 0)),
                        (this.first = !1))
                    : ((i =
                        ((f >>> 2) | (f << 30)) ^
                        ((f >>> 13) | (f << 19)) ^
                        ((f >>> 22) | (f << 10))),
                        (r = (e = f & u) ^ (f & c) ^ a),
                        (w =
                            (y +
                                (s =
                                    w +
                                    (h =
                                        ((l >>> 6) | (l << 26)) ^
                                        ((l >>> 11) | (l << 21)) ^
                                        ((l >>> 25) | (l << 7))) +
                                    ((l & d) ^ (~l & A)) +
                                    p[t] +
                                    b[t])) <<
                            0),
                        (y = (s + (i + r)) << 0)),
                    (i =
                        ((y >>> 2) | (y << 30)) ^
                        ((y >>> 13) | (y << 19)) ^
                        ((y >>> 22) | (y << 10))),
                    (r = (n = y & f) ^ (y & u) ^ e),
                    (A =
                        (c +
                            (s =
                                A +
                                (h =
                                    ((w >>> 6) | (w << 26)) ^
                                    ((w >>> 11) | (w << 21)) ^
                                    ((w >>> 25) | (w << 7))) +
                                ((w & l) ^ (~w & d)) +
                                p[t + 1] +
                                b[t + 1])) <<
                        0),
                    (i =
                        (((c = (s + (i + r)) << 0) >>> 2) | (c << 30)) ^
                        ((c >>> 13) | (c << 19)) ^
                        ((c >>> 22) | (c << 10))),
                    (r = (o = c & y) ^ (c & f) ^ n),
                    (d =
                        (u +
                            (s =
                                d +
                                (h =
                                    ((A >>> 6) | (A << 26)) ^
                                    ((A >>> 11) | (A << 21)) ^
                                    ((A >>> 25) | (A << 7))) +
                                ((A & w) ^ (~A & l)) +
                                p[t + 2] +
                                b[t + 2])) <<
                        0),
                    (i =
                        (((u = (s + (i + r)) << 0) >>> 2) | (u << 30)) ^
                        ((u >>> 13) | (u << 19)) ^
                        ((u >>> 22) | (u << 10))),
                    (r = (a = u & c) ^ (u & y) ^ o),
                    (l =
                        (f +
                            (s =
                                l +
                                (h =
                                    ((d >>> 6) | (d << 26)) ^
                                    ((d >>> 11) | (d << 21)) ^
                                    ((d >>> 25) | (d << 7))) +
                                ((d & A) ^ (~d & w)) +
                                p[t + 3] +
                                b[t + 3])) <<
                        0),
                    (f = (s + (i + r)) << 0);
            (this.h0 = (this.h0 + f) << 0),
                (this.h1 = (this.h1 + u) << 0),
                (this.h2 = (this.h2 + c) << 0),
                (this.h3 = (this.h3 + y) << 0),
                (this.h4 = (this.h4 + l) << 0),
                (this.h5 = (this.h5 + d) << 0),
                (this.h6 = (this.h6 + A) << 0),
                (this.h7 = (this.h7 + w) << 0);
        }),
        (t.prototype.hex = function () {
            this.finalize();
            var t = this.h0,
                i = this.h1,
                h = this.h2,
                r = this.h3,
                s = this.h4,
                e = this.h5,
                n = this.h6,
                o = this.h7,
                a =
                    u[(t >> 28) & 15] +
                    u[(t >> 24) & 15] +
                    u[(t >> 20) & 15] +
                    u[(t >> 16) & 15] +
                    u[(t >> 12) & 15] +
                    u[(t >> 8) & 15] +
                    u[(t >> 4) & 15] +
                    u[15 & t] +
                    u[(i >> 28) & 15] +
                    u[(i >> 24) & 15] +
                    u[(i >> 20) & 15] +
                    u[(i >> 16) & 15] +
                    u[(i >> 12) & 15] +
                    u[(i >> 8) & 15] +
                    u[(i >> 4) & 15] +
                    u[15 & i] +
                    u[(h >> 28) & 15] +
                    u[(h >> 24) & 15] +
                    u[(h >> 20) & 15] +
                    u[(h >> 16) & 15] +
                    u[(h >> 12) & 15] +
                    u[(h >> 8) & 15] +
                    u[(h >> 4) & 15] +
                    u[15 & h] +
                    u[(r >> 28) & 15] +
                    u[(r >> 24) & 15] +
                    u[(r >> 20) & 15] +
                    u[(r >> 16) & 15] +
                    u[(r >> 12) & 15] +
                    u[(r >> 8) & 15] +
                    u[(r >> 4) & 15] +
                    u[15 & r] +
                    u[(s >> 28) & 15] +
                    u[(s >> 24) & 15] +
                    u[(s >> 20) & 15] +
                    u[(s >> 16) & 15] +
                    u[(s >> 12) & 15] +
                    u[(s >> 8) & 15] +
                    u[(s >> 4) & 15] +
                    u[15 & s] +
                    u[(e >> 28) & 15] +
                    u[(e >> 24) & 15] +
                    u[(e >> 20) & 15] +
                    u[(e >> 16) & 15] +
                    u[(e >> 12) & 15] +
                    u[(e >> 8) & 15] +
                    u[(e >> 4) & 15] +
                    u[15 & e] +
                    u[(n >> 28) & 15] +
                    u[(n >> 24) & 15] +
                    u[(n >> 20) & 15] +
                    u[(n >> 16) & 15] +
                    u[(n >> 12) & 15] +
                    u[(n >> 8) & 15] +
                    u[(n >> 4) & 15] +
                    u[15 & n];
            return (
                this.is224 ||
                (a +=
                    u[(o >> 28) & 15] +
                    u[(o >> 24) & 15] +
                    u[(o >> 20) & 15] +
                    u[(o >> 16) & 15] +
                    u[(o >> 12) & 15] +
                    u[(o >> 8) & 15] +
                    u[(o >> 4) & 15] +
                    u[15 & o]),
                a
            );
        }),
        (t.prototype.toString = t.prototype.hex),
        (t.prototype.digest = function () {
            this.finalize();
            var t = this.h0,
                i = this.h1,
                h = this.h2,
                r = this.h3,
                s = this.h4,
                e = this.h5,
                n = this.h6,
                o = this.h7,
                a = [
                    (t >> 24) & 255,
                    (t >> 16) & 255,
                    (t >> 8) & 255,
                    255 & t,
                    (i >> 24) & 255,
                    (i >> 16) & 255,
                    (i >> 8) & 255,
                    255 & i,
                    (h >> 24) & 255,
                    (h >> 16) & 255,
                    (h >> 8) & 255,
                    255 & h,
                    (r >> 24) & 255,
                    (r >> 16) & 255,
                    (r >> 8) & 255,
                    255 & r,
                    (s >> 24) & 255,
                    (s >> 16) & 255,
                    (s >> 8) & 255,
                    255 & s,
                    (e >> 24) & 255,
                    (e >> 16) & 255,
                    (e >> 8) & 255,
                    255 & e,
                    (n >> 24) & 255,
                    (n >> 16) & 255,
                    (n >> 8) & 255,
                    255 & n,
                ];
            return (
                this.is224 ||
                a.push((o >> 24) & 255, (o >> 16) & 255, (o >> 8) & 255, 255 & o),
                a
            );
        }),
        (t.prototype.array = t.prototype.digest),
        (t.prototype.arrayBuffer = function () {
            this.finalize();
            var t = new ArrayBuffer(this.is224 ? 28 : 32),
                i = new DataView(t);
            return (
                i.setUint32(0, this.h0),
                i.setUint32(4, this.h1),
                i.setUint32(8, this.h2),
                i.setUint32(12, this.h3),
                i.setUint32(16, this.h4),
                i.setUint32(20, this.h5),
                i.setUint32(24, this.h6),
                this.is224 || i.setUint32(28, this.h7),
                t
            );
        }),
        (i.prototype = new t()),
        (i.prototype.finalize = function () {
            if ((t.prototype.finalize.call(this), this.inner)) {
                this.inner = !1;
                var i = this.array();
                t.call(this, this.is224, this.sharedMemory),
                    this.update(this.oKeyPad),
                    this.update(i),
                    t.prototype.finalize.call(this);
            }
        });
    var B = w();
    (B.sha256 = B),
        (B.sha224 = w(!0)),
        (B.sha256.hmac = _()),
        (B.sha224.hmac = _(!0)),
        o
            ? (module.exports = B)
            : ((s.sha256 = B.sha256),
                (s.sha224 = B.sha224),
                a &&
                define(function () {
                    return B;
                }));
})();

//DateTool
var DateFormat = (function () {
    var t = /d{1,4}|M{1,4}|yy(?:yy)?|([HhmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        e =
            /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        a = /[^-+\dA-Z]/g,
        r = function (t, e) {
            for (t = String(t), e = e || 2; t.length < e;) t = "0" + t;
            return t;
        };
    return function (n, o, m) {
        var D = DateFormat;
        if (
            (1 != arguments.length ||
                "[object String]" != Object.prototype.toString.call(n) ||
                /\d/.test(n) ||
                ((o = n), (n = void 0)),
                isNaN(n))
        )
            try {
                (n = n.replace(/-/g, "/")), (n = new Date(n));
            } catch (t) {
                n = new Date();
            }
        else n = n ? new Date(n) : new Date();
        if (isNaN(n)) throw SyntaxError("invalid date");
        "UTC:" == (o = String(D.masks[o] || o || D.masks.default)).slice(0, 4) &&
            ((o = o.slice(4)), (m = !0));
        var s = m ? "getUTC" : "get",
            i = n[s + "Date"](),
            l = n[s + "Day"](),
            u = n[s + "Month"](),
            g = n[s + "FullYear"](),
            d = n[s + "Hours"](),
            y = n[s + "Minutes"](),
            c = n[s + "Seconds"](),
            M = n[s + "Milliseconds"](),
            f = m ? 0 : n.getTimezoneOffset(),
            h = {
                d: i,
                dd: r(i),
                ddd: D.i18n.dayNames[l],
                dddd: D.i18n.dayNames[l + 7],
                M: u + 1,
                MM: r(u + 1),
                MMM: D.i18n.monthNames[u],
                MMMM: D.i18n.monthNames[u + 12],
                yy: String(g).slice(2),
                yyyy: g,
                h: d % 12 || 12,
                hh: r(d % 12 || 12),
                H: d,
                HH: r(d),
                m: y,
                mm: r(y),
                s: c,
                ss: r(c),
                l: r(M, 3),
                L: r(M > 99 ? Math.round(M / 10) : M),
                t: d < 12 ? "a" : "p",
                tt: d < 12 ? "am" : "pm",
                T: d < 12 ? "A" : "P",
                TT: d < 12 ? "AM" : "PM",
                Z: m ? "UTC" : (String(n).match(e) || [""]).pop().replace(a, ""),
                o:
                    (f > 0 ? "-" : "+") +
                    r(100 * Math.floor(Math.abs(f) / 60) + (Math.abs(f) % 60), 4),
                S: ["th", "st", "nd", "rd"][
                    i % 10 > 3 ? 0 : (((i % 100) - (i % 10) != 10) * i) % 10
                ],
            };
        return o.replace(t, function (t) {
            return t in h ? h[t] : t.slice(1, t.length - 1);
        });
    };
})();
function reg_gl_DateObj_From_DateStr(t, e) {
    if (!t) return null;
    if ((t = t.trim()).length <= 0) return null;
    e || (e = DateFormat.masks.isoDateTime);
    var a = null;
    try {
        a = strToDate(t, e);
    } catch (e) {
        try {
            a = new Date(t);
        } catch (t) { }
    }
    return a;
}
function reg_gl_DateStr_From_DateObj(t, e) {
    return t ? (e || (e = DateFormat.masks.isoDateTime), DateFormat(t, e)) : null;
}
function reg_gl_DateStr_From_DateStr(t, e, a) {
    if (!t) return null;
    if ((t = t.trim()).length <= 0) return null;
    var r = reg_gl_DateObj_From_DateStr(t, e);
    return r ? (a || (a = DateFormat.masks.isoDateTime), DateFormat(r, a)) : null;
}
function req_gl_Date_LocalFormat() {
    var t = localStorage.language;
    t || (t = "en");
    var e = DateFormat.masks.enShortDate;
    return (
        "fr" == t
            ? (e = DateFormat.masks.frShortDate)
            : "vn" == t
                ? (e = DateFormat.masks.viShortDate)
                : "vi" == t && (e = DateFormat.masks.viShortDate),
        e
    );
}
function req_gl_DateFormat_LocalShort() {
    var t = localStorage.language;
    t || (t = "en");
    var e = DateFormat.masks.enShortDate;
    return (
        "fr" == t
            ? (e = DateFormat.masks.frShortDate)
            : "vn" == t
                ? (e = DateFormat.masks.viShortDate)
                : "vi" == t && (e = DateFormat.masks.viShortDate),
        e
    );
}
function req_gl_DateFormat_LocalFull() {
    var t = localStorage.language;
    t || (t = "en");
    var e = DateFormat.masks.enFullDate;
    return (
        "fr" == t
            ? (e = DateFormat.masks.frFullDate)
            : "vn" == t
                ? (e = DateFormat.masks.viFullDate)
                : "vi" == t && (e = DateFormat.masks.viFullDate),
        e
    );
}
function req_gl_DateStr_LocalFormatFull(t) {
    try {
        if (t) {
            var e = localStorage.language;
            e || (e = "en");
            var a = DateFormat.masks.enFullDate;
            return (
                "fr" == e
                    ? (a = DateFormat.masks.frFullDate)
                    : "vn" == e
                        ? (a = DateFormat.masks.viFullDate)
                        : "vi" == e && (a = DateFormat.masks.viFullDate),
                DateFormat(t, a)
            );
        }
        return t;
    } catch (e) {
        return t;
    }
}
function req_gl_DateStr_LocalFormatShort(t) {
    try {
        if (t) {
            var e = localStorage.language;
            e || (e = "en");
            var a = DateFormat.masks.enShortDate;
            return (
                "fr" == e
                    ? (a = DateFormat.masks.frShortDate)
                    : "vn" == e
                        ? (a = DateFormat.masks.viShortDate)
                        : "vi" == e && (a = DateFormat.masks.viShortDate),
                DateFormat(t, a)
            );
        }
        return t;
    } catch (e) {
        return t;
    }
}
DateFormat.masks = {
    default: "yyyy-MM-dd HH:mm:ss",
    isoDateTime: "yyyy-MM-dd HH:mm:ss",
    isoDate: "yyyy-MM-dd",
    isoTime: "HH:mm:ss",
    isoUtcDateTime: "UTC:yyyy-MM-dd HH:mm:ss'Z'",
    frFullDate: "dd/MM/yyyy HH:mm:ss",
    frShortDate: "dd/MM/yyyy",
    fr: "dd/MM/yyyy HH:mm:ss",
    enFullDate: "MM/dd/yyyy HH:mm:ss",
    enShortDate: "MM/dd/yyyy",
    en: "MM/dd/yyyy HH:mm:ss",
    viFullDate: "dd/MM/yyyy HH:mm:ss",
    viShortDate: "dd/MM/yyyy",
    vi: "dd/MM/yyyy HH:mm:ss",
    viFullDateToMM: "dd/MM/yyyy HH:mm",
    vnFullDate: "dd/MM/yyyy HH:mm:ss",
    vnShortDate: "dd/MM/yyyy",
    vn: "dd/MM/yyyy HH:mm:ss",
    vnFullDateToMM: "dd/MM/yyyy HH:mm",
    dbShortDate: "yyyy-MM-dd",
    dbLongDate: "yyyy-MM-dd HH:mm:ss",
};
var strToDate = function (t, e) {
    var a = t.replace(/[^a-zA-Z0-9]/g, "-"),
        r = e.replace(/[^a-zA-Z0-9]/g, "-").split("-"),
        n = a.split("-"),
        o = r.indexOf("yyyy"),
        m = r.indexOf("MM"),
        D = r.indexOf("dd"),
        s = r.indexOf("HH"),
        i = r.indexOf("mm"),
        l = r.indexOf("ss"),
        u = new Date(),
        g = o > -1 ? n[o] : u.getFullYear(),
        d = m > -1 ? n[m] - 1 : u.getMonth() - 1,
        y = D > -1 ? n[D] : u.getDate(),
        c = s > -1 ? n[s] : u.getHours(),
        M = i > -1 ? n[i] : u.getMinutes(),
        f = l > -1 ? n[l] : u.getSeconds();
    return new Date(g, d, y, c, M, f);
};
function reg_gl_Date_From_ShortFormat(t, e) {
    var a = req_gl_Date_ISOShortStr(t, e);
    return DateFormat(a, DateFormat.masks.dbShortDate);
}
function reg_gl_Date_From_LongFormat(t, e) {
    var a = req_gl_Date_ISOLongStr(strShortDate, e);
    return DateFormat(a, DateFormat.masks.dbLongDate);
}
function req_gl_Date_ISOShortStr(t, e) {
    return reqShortDateString(t, e);
}
function req_gl_Date_ISOLongStr(t, e) {
    return reqLongDateString(t, e);
}
function reg_gl_Date_From_ISOLongStr(t) {
    return DateFormat(t, DateFormat.masks.dbLongDate);
}
function reg_gl_Date_From_ISOShortStr(t) {
    return DateFormat(t, DateFormat.masks.dbShortDate);
}
function req_gl_Date_CompareStr(t, e, a) {
    return compareDate(t, e, a);
}
function req_gl_Date_CompareObj(t, e) {
    return date1 && date2
        ? d1.getTime() - d2.getTime()
        : (date1 && !date2) || (!date1 && date2)
            ? void 0
            : null;
}
function req_gl_Date_NbDayInMonth(t, e) {
    return new Date(t, e + 1, 0).getDate();
}
function reqShortDateString(t, e) {
    return (
        e || (e = localStorage.language),
        "fr" == e
            ? frShortDateToDBDate(t)
            : "en" == e
                ? enShortDateToDBDate(t)
                : "vi" == e || "vn" == e
                    ? frShortDateToDBDate(t)
                    : "iso" == e
                        ? t
                        : void 0
    );
}
function reqLongDateString(t, e) {
    return (
        e || (e = localStorage.language),
        "fr" == e
            ? frLongDateToDBDate(t)
            : "en" == e
                ? enLongDateToDBDate(t)
                : "vi" == e || "vn" == e
                    ? frLongDateToDBDate(t)
                    : "iso" == e
                        ? t
                        : void 0
    );
}
function reqNbDayInMonth(t, e) {
    return new Date(e, t + 1, 0).getDate();
}
function compareDate(t, e, a) {
    if (t && e) {
        var r = DateFormat(t, a),
            n = DateFormat(e, a);
        return r.getTime() - n.getTime();
    }
    if (!((t && !e) || (!t && e))) return null;
}
function getDateString(t, e) {
    var a = t.val(),
        r = e.val();
    try {
        a = frShortDateToDBDate(a);
    } catch (t) {
        a = DateFormat(a, DateFormat.masks.dbShortDate);
    }
    return null == a
        ? (t.addClass("error"), null)
        : null == r
            ? (e.addClass("error"), null)
            : a + " " + r + ":00";
}
function getDateFormatStandardShort(t) {
    var e = new Date(t || Date.now()),
        a = "" + e.getDate(),
        r = "" + (e.getMonth() + 1),
        n = e.getFullYear();
    return (
        r.length < 2 && (r = "0" + r),
        a.length < 2 && (a = "0" + a),
        [n, r, a].join("-")
    );
}
function frShortDateToDBDate(t) {
    if (10 == (t = t.slice(0, 10)).length) {
        var e = t.split("/");
        return 3 == e.length ? [e[2], e[1], e[0]].join("-") : null;
    }
}
function frLongDateToDBDate(t) {
    var e = t.split(" ");
    if (2 == e.length) {
        var a = e[0],
            r = e[1],
            n = a.split("/");
        return 3 == n.length ? [n[2], n[1], n[0]].join("-") + " " + r : null;
    }
}
function enShortDateToDBDate(t) {
    if (10 == (t = t.slice(0, 10)).length) {
        var e = t.split("/");
        return 3 == e.length ? [e[2], e[0], e[1]].join("-") : null;
    }
}
function enLongDateToDBDate(t) {
    var e = t.split(" ");
    if (2 == e.length) {
        var a = e[0],
            r = e[1],
            n = a.split("/");
        return 3 == n.length ? [n[2], n[0], n[1]].join("-") + " " + r : null;
    }
}
function stringToDate(t, e, a) {
    var r = e.toLowerCase().split(a),
        n = t.split(a),
        o = r.indexOf("mm"),
        m = r.indexOf("dd"),
        D = r.indexOf("yyyy"),
        s = parseInt(n[o]);
    return (s -= 1), new Date(n[D], s, n[m]);
}
function getWeek(t) {
    var e = new Date(t),
        a = new Date(e.getFullYear(), 0, 1);
    return Math.ceil(((e - a) / 864e5 + a.getDay() + 1) / 7);
}
function getYear(t) {
    return new Date(t).getFullYear();
}
function getStringMonth(t) {
    return getMonthStr(new Date(t).getMonth());
}
function getMonthStr(t) {
    switch (t) {
        case 0:
        case "00":
            return $.i18n("common_date_january");
        case 1:
        case "01":
            return $.i18n("common_date_february");
        case 2:
        case "02":
            return $.i18n("common_date_march");
        case 3:
        case "03":
            return $.i18n("common_date_april");
        case 4:
        case "04":
            return $.i18n("common_date_may");
        case 5:
        case "05":
            return $.i18n("common_date_june");
        case 6:
        case "06":
            return $.i18n("common_date_july");
        case 7:
        case "07":
            return $.i18n("common_date_august");
        case 8:
        case "08":
            return $.i18n("common_date_september");
        case 9:
        case "09":
            return $.i18n("common_date_october");
        case 10:
        case "10":
            return $.i18n("common_date_november");
        case 11:
        case "11":
            return $.i18n("common_date_december");
    }
}
var DateTimePickerFormat = function (t, e, a) {
    return "";
};
function getLstDayInPeriodeTime(t, e, a, r, n) {
    for (var o = new Array(), m = t.getTime(), D = e.getTime(); D - m > 0;) {
        var s = new Date();
        s.setTime(m);
        for (var i = s.getDay(), l = 0; l < a.length; l++)
            if (i == a[l].dateWeek) {
                var u = a[l].timeOfDay.split(";");
                if (null != u && u.length > 0)
                    for (var g = 0; g < u.length; g++) {
                        var d = u[g].split("-"),
                            y = d[0],
                            c = d[1],
                            M = y.split(":"),
                            f = c.split(":"),
                            h = {};
                        (h.start = DateFormat(
                            new Date(s.getFullYear(), s.getMonth(), s.getDate(), M[0], M[1]),
                            DateFormat.masks.isoDateTime
                        )),
                            (h.end = DateFormat(
                                new Date(
                                    s.getFullYear(),
                                    s.getMonth(),
                                    s.getDate(),
                                    f[0],
                                    f[1]
                                ),
                                DateFormat.masks.isoDateTime
                            )),
                            null != r && (h.subject = r),
                            null != n && (h.description = n),
                            o.push(h);
                    }
            }
        m += 864e5;
    }
    return o;
}
function getDaySelectOfWeek(t) {
    for (var e = new Array(), a = 0; a < t.length; a++) {
        var r = new Date(t[a].start),
            n = new Date(t[a].end),
            o = r.getDay(),
            m =
                (r.getHours() < 10 ? "0" + r.getHours() : r.getHours()) +
                ":" +
                (r.getMinutes() < 10 ? "0" + r.getMinutes() : r.getMinutes()),
            D =
                (n.getHours() < 10 ? "0" + n.getHours() : n.getHours()) +
                ":" +
                (n.getMinutes() < 10 ? "0" + n.getMinutes() : n.getMinutes()),
            s = {};
        (s.day = o), (s.time = m + "-" + D);
        for (
            var i = 0, l = 0;
            l < e.length && (e[l].day != s.day || e[l].time != s.time);
            l++
        )
            if (e[l].day == s.day && e[l].time != s.time) {
                for (
                    var u = e[l].time.split(";"), g = 0, d = 0;
                    d < u.length && u[d] != s.time;
                    d++
                )
                    g++;
                g == u.length && (e[l].time += ";" + s.time);
            } else i++;
        i == e.length && e.push(s);
    }
    return e;
}
function setFormatDateFromScheduler(t) {
    var e = t.split(" "),
        a = e[0],
        r = e[1],
        n = a.split("/"),
        o = r.split(":");
    return DateFormat(
        new Date(n[2], n[1] - 1, n[0], o[0], o[1]),
        DateFormat.masks.isoDateTime
    );
}
(DateTimePickerFormat.masks = {
    default: "ddd mmm DD YYYY HH:mm:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, YYYY",
    longDate: "mmmm d, YYYY",
    fullDate: "dddd, mmmm DD, YYYY",
    shortTime: "h:mm TT",
    mediumTime: "h:mm:ss TT",
    longTime: "h:mm:ss TT Z",
    isoDate: "YYYY-MM-DD",
    isoTime: "HH:mm:ss",
    isoDateTimeToMM: "YYYY-MM-DD HH:mm",
    isoDateTime: "YYYY-MM-DD HH:mm:ss",
    isoUtcDateTime: "UTC:YYYY-MM-DD HH:mm:ss'Z'",
    frFullDateToMM: "DD/MM/YYYY HH:mm",
    frFullDate: "DD/MM/YYYY HH:mm:ss",
    frShortDate: "DD/MM/YYYY",
    enFullDateToMM: "MM/DD/YYYY HH:mm",
    enFullDate: "MM/DD/YYYY HH:mm:ss",
    enShortDate: "MM/DD/YYYY",
    viFullDateToMM: "DD/MM/YYYY HH:mm",
    viFullDate: "DD/MM/YYYY HH:mm:ss",
    viShortDate: "DD/MM/YYYY",
    dbShortDate: "YYYY-MM-dd",
}),
    (DateFormat.i18n = {
        dayNames: [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ],
        monthNames: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
    });

//FunctionTool
var FUNCT_SCOPE = AppCommon.const.FUNCT_SCOPE,
    FUNCT_NAME = AppCommon.const.FUNCT_NAME,
    FUNCT_PARAM = AppCommon.const.FUNCT_PARAM;
function req_gl_funct(o, _, n) {
    var A = {};
    return (A[FUNCT_SCOPE] = o), (A[FUNCT_NAME] = _), (A[FUNCT_PARAM] = n), A;
}
function req_gl_Request_Content_Send(o, _) {
    var n = App.const.SV_CLASS,
        A = App.const.SV_NAME,
        s = App.const.SESS_ID,
        p = App.const.USER_ID,
        t = {};
    return (
        (t[n] = o),
        (t[A] = _),
        (t[p] = App.data.user ? App.data.user.id : -1),
        (t[s] = App.data.session_id),
        t
    );
}
function do_show_Msg_No_Ajax(o) {
    console.log("do_show_Msg_No_Ajax::" + o);
}
function do_show_Msg_Ajax(o, _) {
    console.log("do_show_Msg_Ajax::" + _);
}

//NotifyTool
function do_gl_show_Notify_Msg_Default(o, i, t, n) {
    i || (i = "topLeft"),
        t || (t = "info"),
        n
            ? $(n).notify(o, { className: t, position: i })
            : $.notify(o, { className: t, position: i });
}
function do_gl_show_Notify_Msg_Info(o, i, t) {
    i || (i = "topLeft");
    var n = "info";
    t
        ? $(t).notify(o, { className: n, position: i })
        : $.notify(o, { className: n, position: i });
}
function do_gl_show_Notify_Msg_Error(o, i, t) {
    i || (i = "topLeft");
    var n = "error";
    t
        ? $(t).notify(o, { className: n, position: i })
        : $.notify(o, { className: n, position: i });
}
function do_gl_show_Notify_Msg_Warn(o, i, t) {
    i || (i = "topLeft");
    var n = "warn";
    t
        ? $(t).notify(o, { className: n, position: i })
        : $.notify(o, { className: n, position: i });
}
function do_gl_show_Notify_Msg_Success(o, i, t) {
    i || (i = "topLeft");
    var n = "success";
    t
        ? $(t).notify(o, { className: n, position: i })
        : $.notify(o, { className: n, position: i });
}
function do_gl_show_Notify_Global(o, i) {
    $.notify(o, i);
}
function do_gl_show_Notify_Element(o, i, t) {
    $.notify(o, i, t);
}
function do_gl_show_Notify_Selector(o, i, t) {
    $(o).notify(i, t);
}
function do_gl_show_Notify_Style(o, i) {
    $.notify.addStyle(o, i);
}
function do_gl_show_Notify_Defaults(o) {
    $.notify.defaults(o);
}
function req_gl_set_Notify_Options(
    o,
    i,
    t,
    n,
    s,
    _,
    f,
    a,
    e,
    l,
    y,
    c,
    r,
    N,
    u
) {
    var d = {};
    return (
        o && (d.className = o),
        i && (d.position = i),
        t && (d.elementPosition = t),
        n && (d.globalPosition = n),
        s && (d.style = s),
        _ && (d.clickToHide = _),
        f && (d.autoHide = f),
        a && (d.autoHideDelay = a),
        e && (d.arrowShow = e),
        l && (d.arrowSize = l),
        y && (d.showAnimation = y),
        c && (d.showDuration = c),
        r && (d.hideAnimation = r),
        N && (d.hideDuration = N),
        u && (d.gap = u),
        d
    );
}

//Queue
var do_gl_queue = function (e, t, u, n, c) {
    queue(e, t, u, n, c);
},
    do_gl_execute = function (e, t) {
        execute(e, t);
    },
    queue = function (o, i, l, f, _) {
        null == _ && (_ = 50),
            (function e() {
                if (0 < o.length) {
                    var t = o.shift(),
                        u = t[FUNCT_NAME];
                    if (!u) return void e();
                    var n = t[FUNCT_SCOPE],
                        c = t[FUNCT_PARAM];
                    setTimeout(function () {
                        0 == f.err_code || null == f.err_code
                            ? (u.apply(n, [f].concat(c)), e())
                            : i && execute(i);
                    }, _);
                } else l && execute(l);
            })();
    },
    execute = function (e) {
        try {
            if ("function" == typeof e) e();
            else {
                var t = e[FUNCT_SCOPE],
                    u = e[FUNCT_NAME],
                    n = e[FUNCT_PARAM];
                u.apply(t, n);
            }
        } catch (e) {
            console.log("Cannot execute Funct");
        }
    };

//SecTool
var do_gl_LocalStorage_Save = function (e, t) {
    e || (e = "tmp"),
        t && localStorage.setItem(SECU_PREFIX + e, JSON.stringify(t));
},
    do_gl_LocalStorage_Clear = function (e) {
        e || (e = "tmp"), localStorage.removeItem(SECU_PREFIX + e);
    },
    req_gl_LocalStorage = function (e) {
        e || (e = "tmp");
        var t = localStorage.getItem(SECU_PREFIX + e);
        return t && (t = JSON.parse(t)), t;
    },
    rq_gl_Crypto = function (e, t) {
        return t
            ? "sha256" == t
                ? makeCrypto_SHA256(e)
                : "sha512" == t
                    ? makeCrypto_SHA512(e)
                    : void 0
            : makeCrypto_SHA256(e);
    },
    makeCrypto_SHA256 =
        ((rq_gl_Crypto = function (e) {
            return makeCrypto_SHA256(e);
        }),
            function (e) {
                return sha256(e);
            }),
    makeCrypto_SHA512 = function (e) {
        return sha512_digest(sha512_digest(e).toString(CryptoJS.enc.Hex)).toString(
            CryptoJS.enc.Hex
        );
    },
    SECU_PREFIX = "/hnv/",
    do_gl_Security_Login_Save = function (e, t, r, o, S, n) {
        storeSecurityLogin(e, t, r, o, S, n);
    },
    storeSecurityLogin = function (e, t, r, o, S, n) {
        storeSecurityHttpHeader(e, t, S),
            storeSecurityUserProfile(e, r),
            storeSecuritySession(e, o),
            storeSecurityToken(e, n);
    },
    do_gl_Security_HttpHeader_Save = function (e, t, r) {
        storeSecurityHttpHeader(e, t, r);
    },
    storeSecurityHttpHeader = function (e, t, r) {
        t && localStorage.setItem(SECU_PREFIX + e, JSON.stringify(t)),
            r
                ? localStorage.setItem(SECU_PREFIX + e + "/rem", JSON.stringify(1))
                : localStorage.setItem(SECU_PREFIX + e + "/rem", JSON.stringify(0));
        var o = new Date().getTime();
        localStorage.setItem(SECU_PREFIX + e + "/time", JSON.stringify(o)),
            localStorage.setItem(SECU_PREFIX + e + "/count", "1");
    },
    do_gl_Security_UserProfile_Save = function (e, t) {
        storeSecurityUserProfile(e, t);
    },
    storeSecurityUserProfile = function (e, t) {
        t && localStorage.setItem(SECU_PREFIX + e + "/usr", JSON.stringify(t));
    },
    do_gl_Security_Session_Save = function (e, t) {
        storeSecuritySession(e, t);
    },
    storeSecuritySession = function (e, t) {
        t && localStorage.setItem(SECU_PREFIX + e + "/sess", JSON.stringify(t));
    },
    do_gl_Security_Token_Save = function (e, t) {
        storeSecurityToken(e, t);
    },
    do_gl_Security_Token_Ini_Save = function (e, t) {
        storeSecurityTokenIni(e, t);
    },
    storeSecurityToken = function (e, t) {
        t &&
            (localStorage.setItem(SECU_PREFIX + e + "/tok", JSON.stringify(t)),
                localStorage.setItem(
                    SECU_PREFIX + e + "/tok_time",
                    new Date().getTime()
                ));
    },
    storeSecurityTokenIni = function (e, t) {
        t && localStorage.setItem(SECU_PREFIX + e + "/tok_ini", JSON.stringify(t));
    },
    TIME_SESS_LIM_REM_0 = 36e5,
    TIME_SESS_LIM_REM_2 = 31536e6,
    TIME_TOK_REFRESH = 9e5,
    req_gl_Security_Info = function (e) {
        return {
            tok_time: req_gl_Security_Token_Time(e),
            tok: req_gl_Security_Token(e),
            rem: req_gl_Security_Remember(e),
            secuHeader: req_gl_Security_HttpHeader(e),
            user: req_gl_Security_UserProfile(e),
        };
    },
    req_gl_Security_Token = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e + "/tok");
        return t ? JSON.parse(t) : null;
    },
    req_gl_Security_Token_Time = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e + "/tok_time");
        return t ? JSON.parse(t) : null;
    },
    req_gl_Security_Remember = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e + "/rem");
        return t ? JSON.parse(t) : null;
    },
    req_gl_Security_HttpHeader = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e);
        if (!t) return clearSecurityHttpHeader(e), null;
        var r = new Date().getTime(),
            o = localStorage.getItem(SECU_PREFIX + e + "/count");
        if (!o) return null;
        o = parseInt(o, 10);
        var S = localStorage.getItem(SECU_PREFIX + e + "/rem");
        if (((S = S ? parseInt(S, 10) : 0), o <= 0 && 0 == S)) {
            var n = localStorage.getItem(SECU_PREFIX + e + "/timeClose");
            if (!n)
                return console.log("no time close"), clearSecurityHttpHeader(e), null;
            if (r - (n = parseInt(n, 10)) > 3e4)
                return clearSecurityHttpHeader(e), null;
            localStorage.setItem(SECU_PREFIX + e + "/count", JSON.stringify(1));
        }
        var i = localStorage.getItem(SECU_PREFIX + e + "/time");
        return i
            ? ((i = parseInt(i, 10)),
                0 == S && r - i > TIME_SESS_LIM_REM_0
                    ? (clearSecurityHttpHeader(e), null)
                    : 1 == S && r - i > TIME_SESS_LIM_REM_2
                        ? (clearSecurityHttpHeader(e), null)
                        : 0 != S && 1 != S
                            ? (clearSecurityHttpHeader(e), null)
                            : (localStorage.setItem(SECU_PREFIX + e + "/time", JSON.stringify(r)),
                                JSON.parse(t)))
            : (clearSecurityHttpHeader(e), null);
    },
    req_gl_Security_UserProfile = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e + "/usr");
        return t ? JSON.parse(t) : null;
    },
    req_gl_Security_Session = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e + "/sess");
        return t ? JSON.parse(t) : null;
    },
    req_gl_Security_Token_Ini = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e + "/tok_ini");
        return t ? JSON.parse(t) : null;
    },
    req_gl_Security_Obj = function (e, t) {
        var r = localStorage.getItem(SECU_PREFIX + e + "/" + t);
        return r ? JSON.parse(r) : null;
    },
    do_gl_Security_Session_Close = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e + "/count");
        if (!t) return null;
        if ((t = parseInt(t, 10)) <= 0) return clearSecurityHttpHeader(e), null;
        var r = new Date().getTime();
        localStorage.setItem(SECU_PREFIX + e + "/timeClose", JSON.stringify(r)),
            localStorage.setItem(SECU_PREFIX + e + "/count", JSON.stringify(t - 1));
    },
    do_gl_Security_Session_Open = function (e) {
        doOpenSecuritySession(e), doSaveTimeLastRequest(e);
    },
    doOpenSecuritySession = function (e) {
        var t = localStorage.getItem(SECU_PREFIX + e + "/count");
        if (!t) return null;
        (t = parseInt(t, 10)),
            localStorage.setItem(SECU_PREFIX + e + "/count", JSON.stringify(t + 1));
    },
    doSaveTimeLastRequest = function (e) {
        var t = new Date().getTime();
        localStorage.setItem(SECU_PREFIX + e + "/time", JSON.stringify(t));
    },
    do_gl_Security_HttpHeader_Clear = function (e, t) {
        clearSecurityHttpHeader(e, t);
    },
    clearAllCache = function () {
        localStorage.clear();
    },
    clearSecurityHttpHeader = function (e, t) {
        localStorage.removeItem(SECU_PREFIX + e),
            localStorage.removeItem(SECU_PREFIX + e + "/usr"),
            localStorage.removeItem(SECU_PREFIX + e + "/sess"),
            localStorage.removeItem(SECU_PREFIX + e + "/time"),
            localStorage.removeItem(SECU_PREFIX + e + "/count"),
            localStorage.removeItem(SECU_PREFIX + e + "/tok"),
            localStorage.removeItem(SECU_PREFIX + "app_domains");
    },
    SECU_CRYPT_METH = 1,
    do_gl_Security_Method_Mod = function (e) {
        doSetSecuMethod(e);
    },
    doSetSecuMethod = function (e) {
        SECU_CRYPT_METH = e;
    },
    req_gl_Security_HttpHeader_New = function (e, t, r) {
        return createSecurityHttpHeader(e, t, r);
    },
    createSecurityHttpHeader = function (e, t, r) {
        r && doSetSecuMethod(r);
        var o = e + ":" + t;
        return (
            1 == SECU_CRYPT_METH && (o = e + ":" + makeCrypto_SHA256(t)),
            { Authorization: "Basic " + btoa(o) }
        );
    };
class AesUtil {
    constructor(e, t) {
        (this.keySize = e / 32), (this.iterationCount = t);
    }
    generateKey(e, t) {
        return CryptoJS.PBKDF2(t, e, {
            keySize: this.keySize,
            iterations: this.iterationCount,
        });
    }
    encrypt(e, t) {
        let r = CryptoJS.lib.WordArray.random(16),
            o = CryptoJS.lib.WordArray.random(16),
            S = this.generateKey(r, e),
            n = CryptoJS.AES.encrypt(t, S, { iv: o });
        return r.toString() + o.toString() + n.toString();
    }
    decrypt(e, t) {
        let r = CryptoJS.enc.Hex.parse(t.substr(0, 32)),
            o = CryptoJS.enc.Hex.parse(t.substr(32, 32)),
            S = t.substring(64),
            n = this.generateKey(r, e),
            i = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(S),
            });
        return CryptoJS.AES.decrypt(i, n, { iv: o }).toString(CryptoJS.enc.Utf8);
    }
}
var do_gl_encrypt_aes = function (e, t) {
    return new AesUtil(128, 1e3).encrypt(e, t);
},
    do_gl_decrypt_aes = function (e, t) {
        return new AesUtil(128, 1e3).decrypt(e, t);
    };

//ResizableTool
function do_gl_init_Resizable(e, t) {
    var i = {
        onDragEnd: function (e, t) {
            do_gl_set_resize_datatable(t);
        },
    };
    new Resizable(e).do_lc_init(i, t),
        $(".splitter").on("dblclick", function () {
            $(".panel-left").width() < $(".panel-right").width()
                ? ($(".panel-left").css("width", "80%"),
                    $(".panel-right").css("width", "20%"))
                : ($(".panel-left").css("width", "25%"),
                    $(".panel-right").css("width", "75%"));
        });
}
function do_gl_set_resize_datatable(e) {
    e.find(".dataTables_scrollHeadInner").each(function () {
        $(this).css("width", "100%");
    });
}
Resizable = function (e) {
    if (((this.elt = $(e)), this.elt.length <= 0))
        console.log("Resizable error: " + e + " not found!");
    else {
        var t = { handleSelector: ".splitter", resizeHeight: !1 };
        this.do_lc_init = function (e, i) {
            i && (t = { handleSelector: ".splitter-horizontal", resizeWidth: !1 });
            var l = $.extend(!0, {}, t, e);
            this.elt.resizable(l);
        };
    }
};

//TagTool
function do_gl_init_TagInput(t, n, e, i) {
    var u = { itemValue: n, itemText: e };
    i && $.extend(!0, u, i), $(t).tagsinput(u);
}
function do_gl_add_TagInput(t, n) {
    $(t).tagsinput("add", n);
}
function do_gl_remove_TagInput(t, n) {
    $(t).tagsinput("remove", n);
}
function do_gl_removeAll_TagInput(t, n) {
    $(t).tagsinput("removeAll");
}
function req_gl_str_TagInput(t) {
    return $(t).val();
}
function req_gl_arr_TagInput(t) {
    return $(t).tagsinput("items");
}
TagsInput = function (t) {
    if (((this.elt = $(t)), this.elt.length <= 0))
        console.log("Tag input error: " + t + " not found!");
    else {
        var n = {};
        (this.do_lc_init = function (t, e, i) {
            (n.itemValue = t), (n.itemText = e);
            var u = $.extend(!0, {}, n, i);
            this.elt.tagsinput(u);
        }),
            (this.do_lc_add = function (t) {
                this.elt.tagsinput("add", t);
            }),
            (this.do_lc_remove = function (t) {
                this.elt.tagsinput("remove", t);
            }),
            (this.do_lc_removeAll = function () {
                this.elt.tagsinput("removeAll");
            }),
            (this.req_lc_value = function () {
                return this.elt.val();
            }),
            (this.req_lc_items = function () {
                return this.elt.tagsinput("items");
            }),
            (this.req_lc_exist = function (t) {
                var n = this.req_lc_items();
                return $.inArray(t, n) >= 0;
            }),
            (this.do_on_item_removed = function (t) {
                $("input").on("itemRemoved", function (n) {
                    t(n.item);
                });
            });
    }
};

//BarRatingTool
var pr_name_eval = ["eval01", "eval02", "eval03", "eval04", "eval05"],
    do_gl_bar_rating_init = function (a) {
        null == App.data.curEval && (App.data.curEval = {});
        for (var n = 0; n < pr_name_eval.length; n++)
            App.data.curEval[pr_name_eval[n]] = a;
    },
    do_gl_bar_rating_init_one = function (a, n) {
        null == App.data.curEval && (App.data.curEval = {}),
            (App.data.curEval[a] = n);
    },
    do_gl_bar_rating_save_eval = function (a, n) {
        null == App.data.curEval && (App.data.curEval = {}),
            (App.data.curEval[n] = $(a).val());
    },
    do_gl_bar_rating_show = function (a, n, r, l, _) {
        void 0 == l || 0 == l || NaN == l
            ? (do_gl_bar_rating_show_err(n), do_gl_bar_rating_hide_err(a))
            : $(a).barrating({
                theme: null == r ? "fontawesome-stars" : r,
                initialRating: null == l ? 3 : l,
                readonly: null != _ && _,
            });
    },
    do_gl_bar_rating_show_all = function (a, n, r, l, _) {
        if (null == a || void 0 == a || void 0 == typeof a || "" == a) return 0;
        for (var e = 0; e < a.length; e++) do_gl_bar_rating_show(a[e], n, r, l, _);
    },
    req_gl_bar_rating_value = function (a, n) {
        if (a.length > pr_name_eval.length) return 0;
        for (var r = 0; r < a.length; r++)
            get_value_rating(pr_name_eval[r], a[r], n);
    },
    get_value_rating = function (a, n, r) {
        null == App.data.curEval && (App.data.curEval = {}),
            (App.data.curEval[a] = r),
            $(n).on("change", function () {
                for (
                    var a = parseInt($(n).val()),
                    r = "eval0" + n.substring(n.length - 1, n.length),
                    l = 0;
                    l < pr_name_eval.length;
                    l++
                )
                    pr_name_eval[l] == r && (App.data.curEval[pr_name_eval[l]] = a);
            });
    },
    req_gl_bar_rating_value_one_on_change = function (a, n) {
        return (
            (value = n),
            $(a).on("change", function () {
                value = parseInt($(a).val());
            }),
            value
        );
    },
    do_gl_bar_rating_show_err = function (a) {
        $(a).show();
    },
    do_gl_bar_rating_hide_err = function (a) {
        $(a).hide();
    };

//PaginationTool
var do_gl_init_pagination = function (a, o, n, t, i, e, d, c) {
    var g = $(a).find(".wygo-pagination"),
        l = $(g),
        r = {
            pageSize: void 0 == i ? 9 : i,
            pageRange: void 0 == e ? 1 : e,
            dataSource: o,
            totalNumberLocator: function (a) {
                return a[App.const.RES_DATA].total;
            },
            ajax: {
                dataType: "json",
                type: "POST",
                headers: n,
                data: t,
                url: o,
                beforeSend: function () {
                    l.prev().html($.i18n("common_loading_data"));
                },
            },
            callback: d,
            afterRender: function () {
                do_gl_load_top_Div(c || a, g);
            },
        };
    try {
        l.pagination(r);
    } catch (a) {
        console.log(a);
    }
},
    do_gl_init_pagination_noAjax = function (a, o, n, t, i, e, d) {
        var c = $(a).find(".wygo-pagination"),
            g = $(c),
            l = {
                pageSize: void 0 == o ? 9 : o,
                pageRange: void 0 == n ? 1 : n,
                dataSource: e,
                totalNumber: d,
                callback: t,
                afterRender: function () {
                    do_gl_load_top_Div(i || a, c);
                },
            };
        try {
            g.pagination(l);
        } catch (a) {
            console.log(a);
        }
    },
    do_gl_init_pagination_noResData = function (a, o, n, t, i, e, d, c, g, l) {
        var r = $(a).find(".wygo-pagination"),
            p = $(r),
            _ = {
                pageSize: void 0 == i ? 9 : i,
                pageRange: void 0 == e ? 1 : e,
                dataSource: g,
                locator: "",
                totalNumber: l,
                isNoAjax: !0,
                ajax: {
                    dataType: "json",
                    type: "POST",
                    headers: n,
                    data: t,
                    url: o,
                    beforeSend: function () {
                        p.prev().html($.i18n("common_loading_data"));
                    },
                },
                callback: d,
                afterRender: function () {
                    do_gl_load_top_Div(c || a, r);
                },
            };
        try {
            p.pagination(_);
        } catch (a) {
            console.log(a);
        }
    };
function do_gl_load_top_Div(a, o) {
    var n = App.data.currentUrl,
        t = a;
    o.find(".paginationjs-page.J-paginationjs-page").each(function () {
        $(this).on("click", function () {
            var a = -1 != n.indexOf(t) ? n : n + t;
            window.open(a, "_self");
        });
    });
}

//LightSliderTool
function do_gl_init_lightSlider_with_lightGallery(l, i, o, t, e, a) {
    var r = $(l),
        d = {
            gallery: void 0 != i && i,
            item: void 0 == o || o >= 3 ? 3 : o,
            auto: !(o <= 3) && void 0 != e && e,
            loop: !(o <= 3) && void 0 != t && t,
            thumbItem: void 0 == a ? 9 : a,
            enableDrag: !(o <= 3),
            controls: !(o <= 3),
            onSliderLoad: function (i) {
                i.lightGallery({ selector: l + " .lslide", autoplayFirstVideo: !1 });
            },
        };
    try {
        r.lightSlider(d);
    } catch (l) {
        console.log(l);
    }
}
function do_gl_init_lightGallery(l) {
    $(l).lightGallery({ autoplayFirstVideo: !1 });
}

//StatisticTool
function do_gl_statistic_new(t, _, i, s, p) {
    var a = App.const.SV_CLASS,
        c = App.const.SV_NAME,
        n = App.const.SESS_ID,
        o =
            (App.const.FUNCT_SCOPE, App.const.FUNCT_NAME, App.const.FUNCT_PARAM, {});
    (o[a] = "ServiceStatistic"),
        (o[c] = "SVStNew"),
        (o[n] = App.data.session_id),
        App.data.user ? (uId = App.data.user.id) : (uId = -1),
        (o.json_obj = JSON.stringify({
            uId: uId,
            entTyp: s,
            entId: p,
            dt: reg_gl_DateStr_From_DateObj(new Date()),
            time: 0,
        }));
    var e = [];
    e.push(req_gl_funct(null, do_gl_statistic_period_check, [t, _, i, null, 0])),
        i.do_lc_ajax(t, _, o, 1e5, e, null);
}
var var_gl_statistic_time = 2e4;
function do_gl_statistic_period_check(t, _, i, s, p, a, c) {
    if (
        (c || (c = 1),
            !(10 < c) && t[App.const.SV_CODE] == App.const.SV_CODE_API_YES)
    ) {
        if (!p) {
            var n = t.res_data;
            p = n.id;
        }
        if (!p) return;
        setTimeout(function () {
            do_gl_statistic_mod(_, i, s, p, a + var_gl_statistic_time * c, c + 1);
        }, var_gl_statistic_time * c);
    }
}
function do_gl_statistic_mod(t, _, i, s, p, a) {
    var c = App.const.SV_CLASS,
        n = App.const.SV_NAME,
        o = App.const.SESS_ID,
        e =
            (App.const.FUNCT_SCOPE, App.const.FUNCT_NAME, App.const.FUNCT_PARAM, {});
    (e[c] = "ServiceStatistic"),
        (e[n] = "SVStMod"),
        (e[o] = App.data.session_id),
        App.data.user ? (uId = App.data.user.id) : (uId = -1),
        (e.json_obj = JSON.stringify({ uId: uId, id: s, time: p }));
    var d = [];
    d.push(req_gl_funct(null, do_gl_statistic_period_check, [t, _, i, s, p, a])),
        i.ajaxBackground(t, _, e, 1e5, d, null);
}
