import ye, { memo as it, useState as ce, useEffect as re, useRef as V, useCallback as ve } from "react";
const rt = (i, e, r) => {
  const t = i[e];
  return t ? typeof t == "function" ? t() : Promise.resolve(t) : new Promise((s, d) => {
    (typeof queueMicrotask == "function" ? queueMicrotask : setTimeout)(d.bind(null, /* @__PURE__ */ new Error("Unknown variable dynamic import: " + e + (e.split("/").length !== r ? ". Note that variables only represent file names one level deep." : ""))));
  });
};
function nt(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var oe = { exports: {} }, J = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ce;
function at() {
  if (Ce) return J;
  Ce = 1;
  var i = Symbol.for("react.transitional.element"), e = Symbol.for("react.fragment");
  function r(t, s, d) {
    var f = null;
    if (d !== void 0 && (f = "" + d), s.key !== void 0 && (f = "" + s.key), "key" in s) {
      d = {};
      for (var u in s)
        u !== "key" && (d[u] = s[u]);
    } else d = s;
    return s = d.ref, {
      $$typeof: i,
      type: t,
      key: f,
      ref: s !== void 0 ? s : null,
      props: d
    };
  }
  return J.Fragment = e, J.jsx = r, J.jsxs = r, J;
}
var K = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Te;
function ot() {
  return Te || (Te = 1, process.env.NODE_ENV !== "production" && (function() {
    function i(h) {
      if (h == null) return null;
      if (typeof h == "function")
        return h.$$typeof === D ? null : h.displayName || h.name || null;
      if (typeof h == "string") return h;
      switch (h) {
        case E:
          return "Fragment";
        case v:
          return "Profiler";
        case y:
          return "StrictMode";
        case n:
          return "Suspense";
        case l:
          return "SuspenseList";
        case S:
          return "Activity";
      }
      if (typeof h == "object")
        switch (typeof h.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), h.$$typeof) {
          case _:
            return "Portal";
          case R:
            return (h.displayName || "Context") + ".Provider";
          case g:
            return (h._context.displayName || "Context") + ".Consumer";
          case P:
            var T = h.render;
            return h = h.displayName, h || (h = T.displayName || T.name || "", h = h !== "" ? "ForwardRef(" + h + ")" : "ForwardRef"), h;
          case p:
            return T = h.displayName || null, T !== null ? T : i(h.type) || "Memo";
          case x:
            T = h._payload, h = h._init;
            try {
              return i(h(T));
            } catch {
            }
        }
      return null;
    }
    function e(h) {
      return "" + h;
    }
    function r(h) {
      try {
        e(h);
        var T = !1;
      } catch {
        T = !0;
      }
      if (T) {
        T = console;
        var O = T.error, I = typeof Symbol == "function" && Symbol.toStringTag && h[Symbol.toStringTag] || h.constructor.name || "Object";
        return O.call(
          T,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          I
        ), e(h);
      }
    }
    function t(h) {
      if (h === E) return "<>";
      if (typeof h == "object" && h !== null && h.$$typeof === x)
        return "<...>";
      try {
        var T = i(h);
        return T ? "<" + T + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function s() {
      var h = M.A;
      return h === null ? null : h.getOwner();
    }
    function d() {
      return Error("react-stack-top-frame");
    }
    function f(h) {
      if (U.call(h, "key")) {
        var T = Object.getOwnPropertyDescriptor(h, "key").get;
        if (T && T.isReactWarning) return !1;
      }
      return h.key !== void 0;
    }
    function u(h, T) {
      function O() {
        N || (N = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          T
        ));
      }
      O.isReactWarning = !0, Object.defineProperty(h, "key", {
        get: O,
        configurable: !0
      });
    }
    function o() {
      var h = i(this.type);
      return ae[h] || (ae[h] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), h = this.props.ref, h !== void 0 ? h : null;
    }
    function a(h, T, O, I, G, j, ue, de) {
      return O = j.ref, h = {
        $$typeof: A,
        type: h,
        key: T,
        props: j,
        _owner: G
      }, (O !== void 0 ? O : null) !== null ? Object.defineProperty(h, "ref", {
        enumerable: !1,
        get: o
      }) : Object.defineProperty(h, "ref", { enumerable: !1, value: null }), h._store = {}, Object.defineProperty(h._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(h, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(h, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: ue
      }), Object.defineProperty(h, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: de
      }), Object.freeze && (Object.freeze(h.props), Object.freeze(h)), h;
    }
    function c(h, T, O, I, G, j, ue, de) {
      var $ = T.children;
      if ($ !== void 0)
        if (I)
          if (k($)) {
            for (I = 0; I < $.length; I++)
              m($[I]);
            Object.freeze && Object.freeze($);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else m($);
      if (U.call(T, "key")) {
        $ = i(h);
        var B = Object.keys(T).filter(function(tt) {
          return tt !== "key";
        });
        I = 0 < B.length ? "{key: someKey, " + B.join(": ..., ") + ": ...}" : "{key: someKey}", xe[$ + I] || (B = 0 < B.length ? "{" + B.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          I,
          $,
          B,
          $
        ), xe[$ + I] = !0);
      }
      if ($ = null, O !== void 0 && (r(O), $ = "" + O), f(T) && (r(T.key), $ = "" + T.key), "key" in T) {
        O = {};
        for (var he in T)
          he !== "key" && (O[he] = T[he]);
      } else O = T;
      return $ && u(
        O,
        typeof h == "function" ? h.displayName || h.name || "Unknown" : h
      ), a(
        h,
        $,
        j,
        G,
        s(),
        O,
        ue,
        de
      );
    }
    function m(h) {
      typeof h == "object" && h !== null && h.$$typeof === A && h._store && (h._store.validated = 1);
    }
    var b = ye, A = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), E = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), v = Symbol.for("react.profiler"), g = Symbol.for("react.consumer"), R = Symbol.for("react.context"), P = Symbol.for("react.forward_ref"), n = Symbol.for("react.suspense"), l = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), x = Symbol.for("react.lazy"), S = Symbol.for("react.activity"), D = Symbol.for("react.client.reference"), M = b.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, U = Object.prototype.hasOwnProperty, k = Array.isArray, w = console.createTask ? console.createTask : function() {
      return null;
    };
    b = {
      react_stack_bottom_frame: function(h) {
        return h();
      }
    };
    var N, ae = {}, Ae = b.react_stack_bottom_frame.bind(
      b,
      d
    )(), we = w(t(d)), xe = {};
    K.Fragment = E, K.jsx = function(h, T, O, I, G) {
      var j = 1e4 > M.recentlyCreatedOwnerStacks++;
      return c(
        h,
        T,
        O,
        !1,
        I,
        G,
        j ? Error("react-stack-top-frame") : Ae,
        j ? w(t(h)) : we
      );
    }, K.jsxs = function(h, T, O, I, G) {
      var j = 1e4 > M.recentlyCreatedOwnerStacks++;
      return c(
        h,
        T,
        O,
        !0,
        I,
        G,
        j ? Error("react-stack-top-frame") : Ae,
        j ? w(t(h)) : we
      );
    };
  })()), K;
}
var Re;
function st() {
  return Re || (Re = 1, process.env.NODE_ENV === "production" ? oe.exports = at() : oe.exports = ot()), oe.exports;
}
var L = st(), Z = {}, Y = {}, se = {}, z = {}, q = {}, fe = {}, Se;
function Xe() {
  return Se || (Se = 1, (function(i) {
    Object.defineProperty(i, "__esModule", { value: !0 }), i.Doctype = i.CDATA = i.Tag = i.Style = i.Script = i.Comment = i.Directive = i.Text = i.Root = i.isTag = i.ElementType = void 0;
    var e;
    (function(t) {
      t.Root = "root", t.Text = "text", t.Directive = "directive", t.Comment = "comment", t.Script = "script", t.Style = "style", t.Tag = "tag", t.CDATA = "cdata", t.Doctype = "doctype";
    })(e = i.ElementType || (i.ElementType = {}));
    function r(t) {
      return t.type === e.Tag || t.type === e.Script || t.type === e.Style;
    }
    i.isTag = r, i.Root = e.Root, i.Text = e.Text, i.Directive = e.Directive, i.Comment = e.Comment, i.Script = e.Script, i.Style = e.Style, i.Tag = e.Tag, i.CDATA = e.CDATA, i.Doctype = e.Doctype;
  })(fe)), fe;
}
var C = {}, ke;
function Oe() {
  if (ke) return C;
  ke = 1;
  var i = C && C.__extends || /* @__PURE__ */ (function() {
    var n = function(l, p) {
      return n = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(x, S) {
        x.__proto__ = S;
      } || function(x, S) {
        for (var D in S) Object.prototype.hasOwnProperty.call(S, D) && (x[D] = S[D]);
      }, n(l, p);
    };
    return function(l, p) {
      if (typeof p != "function" && p !== null)
        throw new TypeError("Class extends value " + String(p) + " is not a constructor or null");
      n(l, p);
      function x() {
        this.constructor = l;
      }
      l.prototype = p === null ? Object.create(p) : (x.prototype = p.prototype, new x());
    };
  })(), e = C && C.__assign || function() {
    return e = Object.assign || function(n) {
      for (var l, p = 1, x = arguments.length; p < x; p++) {
        l = arguments[p];
        for (var S in l) Object.prototype.hasOwnProperty.call(l, S) && (n[S] = l[S]);
      }
      return n;
    }, e.apply(this, arguments);
  };
  Object.defineProperty(C, "__esModule", { value: !0 }), C.cloneNode = C.hasChildren = C.isDocument = C.isDirective = C.isComment = C.isText = C.isCDATA = C.isTag = C.Element = C.Document = C.CDATA = C.NodeWithChildren = C.ProcessingInstruction = C.Comment = C.Text = C.DataNode = C.Node = void 0;
  var r = /* @__PURE__ */ Xe(), t = (
    /** @class */
    (function() {
      function n() {
        this.parent = null, this.prev = null, this.next = null, this.startIndex = null, this.endIndex = null;
      }
      return Object.defineProperty(n.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.parent;
        },
        set: function(l) {
          this.parent = l;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(n.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.prev;
        },
        set: function(l) {
          this.prev = l;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(n.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.next;
        },
        set: function(l) {
          this.next = l;
        },
        enumerable: !1,
        configurable: !0
      }), n.prototype.cloneNode = function(l) {
        return l === void 0 && (l = !1), R(this, l);
      }, n;
    })()
  );
  C.Node = t;
  var s = (
    /** @class */
    (function(n) {
      i(l, n);
      function l(p) {
        var x = n.call(this) || this;
        return x.data = p, x;
      }
      return Object.defineProperty(l.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.data;
        },
        set: function(p) {
          this.data = p;
        },
        enumerable: !1,
        configurable: !0
      }), l;
    })(t)
  );
  C.DataNode = s;
  var d = (
    /** @class */
    (function(n) {
      i(l, n);
      function l() {
        var p = n !== null && n.apply(this, arguments) || this;
        return p.type = r.ElementType.Text, p;
      }
      return Object.defineProperty(l.prototype, "nodeType", {
        get: function() {
          return 3;
        },
        enumerable: !1,
        configurable: !0
      }), l;
    })(s)
  );
  C.Text = d;
  var f = (
    /** @class */
    (function(n) {
      i(l, n);
      function l() {
        var p = n !== null && n.apply(this, arguments) || this;
        return p.type = r.ElementType.Comment, p;
      }
      return Object.defineProperty(l.prototype, "nodeType", {
        get: function() {
          return 8;
        },
        enumerable: !1,
        configurable: !0
      }), l;
    })(s)
  );
  C.Comment = f;
  var u = (
    /** @class */
    (function(n) {
      i(l, n);
      function l(p, x) {
        var S = n.call(this, x) || this;
        return S.name = p, S.type = r.ElementType.Directive, S;
      }
      return Object.defineProperty(l.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: !1,
        configurable: !0
      }), l;
    })(s)
  );
  C.ProcessingInstruction = u;
  var o = (
    /** @class */
    (function(n) {
      i(l, n);
      function l(p) {
        var x = n.call(this) || this;
        return x.children = p, x;
      }
      return Object.defineProperty(l.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function() {
          var p;
          return (p = this.children[0]) !== null && p !== void 0 ? p : null;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(l.prototype, "lastChild", {
        /** Last child of the node. */
        get: function() {
          return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(l.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.children;
        },
        set: function(p) {
          this.children = p;
        },
        enumerable: !1,
        configurable: !0
      }), l;
    })(t)
  );
  C.NodeWithChildren = o;
  var a = (
    /** @class */
    (function(n) {
      i(l, n);
      function l() {
        var p = n !== null && n.apply(this, arguments) || this;
        return p.type = r.ElementType.CDATA, p;
      }
      return Object.defineProperty(l.prototype, "nodeType", {
        get: function() {
          return 4;
        },
        enumerable: !1,
        configurable: !0
      }), l;
    })(o)
  );
  C.CDATA = a;
  var c = (
    /** @class */
    (function(n) {
      i(l, n);
      function l() {
        var p = n !== null && n.apply(this, arguments) || this;
        return p.type = r.ElementType.Root, p;
      }
      return Object.defineProperty(l.prototype, "nodeType", {
        get: function() {
          return 9;
        },
        enumerable: !1,
        configurable: !0
      }), l;
    })(o)
  );
  C.Document = c;
  var m = (
    /** @class */
    (function(n) {
      i(l, n);
      function l(p, x, S, D) {
        S === void 0 && (S = []), D === void 0 && (D = p === "script" ? r.ElementType.Script : p === "style" ? r.ElementType.Style : r.ElementType.Tag);
        var M = n.call(this, S) || this;
        return M.name = p, M.attribs = x, M.type = D, M;
      }
      return Object.defineProperty(l.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(l.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.name;
        },
        set: function(p) {
          this.name = p;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(l.prototype, "attributes", {
        get: function() {
          var p = this;
          return Object.keys(this.attribs).map(function(x) {
            var S, D;
            return {
              name: x,
              value: p.attribs[x],
              namespace: (S = p["x-attribsNamespace"]) === null || S === void 0 ? void 0 : S[x],
              prefix: (D = p["x-attribsPrefix"]) === null || D === void 0 ? void 0 : D[x]
            };
          });
        },
        enumerable: !1,
        configurable: !0
      }), l;
    })(o)
  );
  C.Element = m;
  function b(n) {
    return (0, r.isTag)(n);
  }
  C.isTag = b;
  function A(n) {
    return n.type === r.ElementType.CDATA;
  }
  C.isCDATA = A;
  function _(n) {
    return n.type === r.ElementType.Text;
  }
  C.isText = _;
  function E(n) {
    return n.type === r.ElementType.Comment;
  }
  C.isComment = E;
  function y(n) {
    return n.type === r.ElementType.Directive;
  }
  C.isDirective = y;
  function v(n) {
    return n.type === r.ElementType.Root;
  }
  C.isDocument = v;
  function g(n) {
    return Object.prototype.hasOwnProperty.call(n, "children");
  }
  C.hasChildren = g;
  function R(n, l) {
    l === void 0 && (l = !1);
    var p;
    if (_(n))
      p = new d(n.data);
    else if (E(n))
      p = new f(n.data);
    else if (b(n)) {
      var x = l ? P(n.children) : [], S = new m(n.name, e({}, n.attribs), x);
      x.forEach(function(k) {
        return k.parent = S;
      }), n.namespace != null && (S.namespace = n.namespace), n["x-attribsNamespace"] && (S["x-attribsNamespace"] = e({}, n["x-attribsNamespace"])), n["x-attribsPrefix"] && (S["x-attribsPrefix"] = e({}, n["x-attribsPrefix"])), p = S;
    } else if (A(n)) {
      var x = l ? P(n.children) : [], D = new a(x);
      x.forEach(function(w) {
        return w.parent = D;
      }), p = D;
    } else if (v(n)) {
      var x = l ? P(n.children) : [], M = new c(x);
      x.forEach(function(w) {
        return w.parent = M;
      }), n["x-mode"] && (M["x-mode"] = n["x-mode"]), p = M;
    } else if (y(n)) {
      var U = new u(n.name, n.data);
      n["x-name"] != null && (U["x-name"] = n["x-name"], U["x-publicId"] = n["x-publicId"], U["x-systemId"] = n["x-systemId"]), p = U;
    } else
      throw new Error("Not implemented yet: ".concat(n.type));
    return p.startIndex = n.startIndex, p.endIndex = n.endIndex, n.sourceCodeLocation != null && (p.sourceCodeLocation = n.sourceCodeLocation), p;
  }
  C.cloneNode = R;
  function P(n) {
    for (var l = n.map(function(x) {
      return R(x, !0);
    }), p = 1; p < l.length; p++)
      l[p].prev = l[p - 1], l[p - 1].next = l[p];
    return l;
  }
  return C;
}
var Pe;
function We() {
  return Pe || (Pe = 1, (function(i) {
    var e = q && q.__createBinding || (Object.create ? (function(u, o, a, c) {
      c === void 0 && (c = a);
      var m = Object.getOwnPropertyDescriptor(o, a);
      (!m || ("get" in m ? !o.__esModule : m.writable || m.configurable)) && (m = { enumerable: !0, get: function() {
        return o[a];
      } }), Object.defineProperty(u, c, m);
    }) : (function(u, o, a, c) {
      c === void 0 && (c = a), u[c] = o[a];
    })), r = q && q.__exportStar || function(u, o) {
      for (var a in u) a !== "default" && !Object.prototype.hasOwnProperty.call(o, a) && e(o, u, a);
    };
    Object.defineProperty(i, "__esModule", { value: !0 }), i.DomHandler = void 0;
    var t = /* @__PURE__ */ Xe(), s = /* @__PURE__ */ Oe();
    r(/* @__PURE__ */ Oe(), i);
    var d = {
      withStartIndices: !1,
      withEndIndices: !1,
      xmlMode: !1
    }, f = (
      /** @class */
      (function() {
        function u(o, a, c) {
          this.dom = [], this.root = new s.Document(this.dom), this.done = !1, this.tagStack = [this.root], this.lastNode = null, this.parser = null, typeof a == "function" && (c = a, a = d), typeof o == "object" && (a = o, o = void 0), this.callback = o ?? null, this.options = a ?? d, this.elementCB = c ?? null;
        }
        return u.prototype.onparserinit = function(o) {
          this.parser = o;
        }, u.prototype.onreset = function() {
          this.dom = [], this.root = new s.Document(this.dom), this.done = !1, this.tagStack = [this.root], this.lastNode = null, this.parser = null;
        }, u.prototype.onend = function() {
          this.done || (this.done = !0, this.parser = null, this.handleCallback(null));
        }, u.prototype.onerror = function(o) {
          this.handleCallback(o);
        }, u.prototype.onclosetag = function() {
          this.lastNode = null;
          var o = this.tagStack.pop();
          this.options.withEndIndices && (o.endIndex = this.parser.endIndex), this.elementCB && this.elementCB(o);
        }, u.prototype.onopentag = function(o, a) {
          var c = this.options.xmlMode ? t.ElementType.Tag : void 0, m = new s.Element(o, a, void 0, c);
          this.addNode(m), this.tagStack.push(m);
        }, u.prototype.ontext = function(o) {
          var a = this.lastNode;
          if (a && a.type === t.ElementType.Text)
            a.data += o, this.options.withEndIndices && (a.endIndex = this.parser.endIndex);
          else {
            var c = new s.Text(o);
            this.addNode(c), this.lastNode = c;
          }
        }, u.prototype.oncomment = function(o) {
          if (this.lastNode && this.lastNode.type === t.ElementType.Comment) {
            this.lastNode.data += o;
            return;
          }
          var a = new s.Comment(o);
          this.addNode(a), this.lastNode = a;
        }, u.prototype.oncommentend = function() {
          this.lastNode = null;
        }, u.prototype.oncdatastart = function() {
          var o = new s.Text(""), a = new s.CDATA([o]);
          this.addNode(a), o.parent = a, this.lastNode = o;
        }, u.prototype.oncdataend = function() {
          this.lastNode = null;
        }, u.prototype.onprocessinginstruction = function(o, a) {
          var c = new s.ProcessingInstruction(o, a);
          this.addNode(c);
        }, u.prototype.handleCallback = function(o) {
          if (typeof this.callback == "function")
            this.callback(o, this.dom);
          else if (o)
            throw o;
        }, u.prototype.addNode = function(o) {
          var a = this.tagStack[this.tagStack.length - 1], c = a.children[a.children.length - 1];
          this.options.withStartIndices && (o.startIndex = this.parser.startIndex), this.options.withEndIndices && (o.endIndex = this.parser.endIndex), a.children.push(o), c && (o.prev = c, c.next = o), o.parent = a, this.lastNode = null;
        }, u;
      })()
    );
    i.DomHandler = f, i.default = f;
  })(q)), q;
}
var pe = {}, De;
function lt() {
  return De || (De = 1, (function(i) {
    Object.defineProperty(i, "__esModule", { value: !0 }), i.CARRIAGE_RETURN_PLACEHOLDER_REGEX = i.CARRIAGE_RETURN_PLACEHOLDER = i.CARRIAGE_RETURN_REGEX = i.CARRIAGE_RETURN = i.CASE_SENSITIVE_TAG_NAMES_MAP = i.CASE_SENSITIVE_TAG_NAMES = void 0, i.CASE_SENSITIVE_TAG_NAMES = [
      "animateMotion",
      "animateTransform",
      "clipPath",
      "feBlend",
      "feColorMatrix",
      "feComponentTransfer",
      "feComposite",
      "feConvolveMatrix",
      "feDiffuseLighting",
      "feDisplacementMap",
      "feDropShadow",
      "feFlood",
      "feFuncA",
      "feFuncB",
      "feFuncG",
      "feFuncR",
      "feGaussianBlur",
      "feImage",
      "feMerge",
      "feMergeNode",
      "feMorphology",
      "feOffset",
      "fePointLight",
      "feSpecularLighting",
      "feSpotLight",
      "feTile",
      "feTurbulence",
      "foreignObject",
      "linearGradient",
      "radialGradient",
      "textPath"
    ], i.CASE_SENSITIVE_TAG_NAMES_MAP = i.CASE_SENSITIVE_TAG_NAMES.reduce(function(e, r) {
      return e[r.toLowerCase()] = r, e;
    }, {}), i.CARRIAGE_RETURN = "\r", i.CARRIAGE_RETURN_REGEX = new RegExp(i.CARRIAGE_RETURN, "g"), i.CARRIAGE_RETURN_PLACEHOLDER = "__HTML_DOM_PARSER_CARRIAGE_RETURN_PLACEHOLDER_".concat(Date.now(), "__"), i.CARRIAGE_RETURN_PLACEHOLDER_REGEX = new RegExp(i.CARRIAGE_RETURN_PLACEHOLDER, "g");
  })(pe)), pe;
}
var Le;
function Je() {
  if (Le) return z;
  Le = 1, Object.defineProperty(z, "__esModule", { value: !0 }), z.formatAttributes = t, z.escapeSpecialCharacters = d, z.revertEscapedCharacters = f, z.formatDOM = u;
  var i = /* @__PURE__ */ We(), e = lt();
  function r(o) {
    return e.CASE_SENSITIVE_TAG_NAMES_MAP[o];
  }
  function t(o) {
    for (var a = {}, c = 0, m = o.length; c < m; c++) {
      var b = o[c];
      a[b.name] = b.value;
    }
    return a;
  }
  function s(o) {
    o = o.toLowerCase();
    var a = r(o);
    return a || o;
  }
  function d(o) {
    return o.replace(e.CARRIAGE_RETURN_REGEX, e.CARRIAGE_RETURN_PLACEHOLDER);
  }
  function f(o) {
    return o.replace(e.CARRIAGE_RETURN_PLACEHOLDER_REGEX, e.CARRIAGE_RETURN);
  }
  function u(o, a, c) {
    a === void 0 && (a = null);
    for (var m = [], b, A = 0, _ = o.length; A < _; A++) {
      var E = o[A];
      switch (E.nodeType) {
        case 1: {
          var y = s(E.nodeName);
          b = new i.Element(y, t(E.attributes)), b.children = u(
            // template children are on content
            y === "template" ? E.content.childNodes : E.childNodes,
            b
          );
          break;
        }
        case 3:
          b = new i.Text(f(E.nodeValue));
          break;
        case 8:
          b = new i.Comment(E.nodeValue);
          break;
        default:
          continue;
      }
      var v = m[A - 1] || null;
      v && (v.next = b), b.parent = a, b.prev = v, b.next = null, m.push(b);
    }
    return c && (b = new i.ProcessingInstruction(c.substring(0, c.indexOf(" ")).toLowerCase(), c), b.next = m[0] || null, b.parent = a, m.unshift(b), m[1] && (m[1].prev = m[0])), m;
  }
  return z;
}
var Me;
function ct() {
  if (Me) return se;
  Me = 1, Object.defineProperty(se, "__esModule", { value: !0 }), se.default = E;
  var i = Je(), e = "html", r = "head", t = "body", s = /<([a-zA-Z]+[0-9]?)/, d = /<head[^]*>/i, f = /<body[^]*>/i, u = function(y, v) {
    throw new Error("This browser does not support `document.implementation.createHTMLDocument`");
  }, o = function(y, v) {
    throw new Error("This browser does not support `DOMParser.prototype.parseFromString`");
  }, a = typeof window == "object" && window.DOMParser;
  if (typeof a == "function") {
    var c = new a(), m = "text/html";
    o = function(y, v) {
      return v && (y = "<".concat(v, ">").concat(y, "</").concat(v, ">")), c.parseFromString(y, m);
    }, u = o;
  }
  if (typeof document == "object" && document.implementation) {
    var b = document.implementation.createHTMLDocument();
    u = function(y, v) {
      if (v) {
        var g = b.documentElement.querySelector(v);
        return g && (g.innerHTML = y), b;
      }
      return b.documentElement.innerHTML = y, b;
    };
  }
  var A = typeof document == "object" && document.createElement("template"), _;
  A && A.content && (_ = function(y) {
    return A.innerHTML = y, A.content.childNodes;
  });
  function E(y) {
    var v, g;
    y = (0, i.escapeSpecialCharacters)(y);
    var R = y.match(s), P = R && R[1] ? R[1].toLowerCase() : "";
    switch (P) {
      case e: {
        var n = o(y);
        if (!d.test(y)) {
          var l = n.querySelector(r);
          (v = l?.parentNode) === null || v === void 0 || v.removeChild(l);
        }
        if (!f.test(y)) {
          var l = n.querySelector(t);
          (g = l?.parentNode) === null || g === void 0 || g.removeChild(l);
        }
        return n.querySelectorAll(e);
      }
      case r:
      case t: {
        var p = u(y).querySelectorAll(P);
        return f.test(y) && d.test(y) ? p[0].parentNode.childNodes : p;
      }
      // low-level tag or text
      default: {
        if (_)
          return _(y);
        var l = u(y, t).querySelector(t);
        return l.childNodes;
      }
    }
  }
  return se;
}
var Ie;
function ut() {
  if (Ie) return Y;
  Ie = 1;
  var i = Y && Y.__importDefault || function(d) {
    return d && d.__esModule ? d : { default: d };
  };
  Object.defineProperty(Y, "__esModule", { value: !0 }), Y.default = s;
  var e = i(ct()), r = Je(), t = /<(![a-zA-Z\s]+)>/;
  function s(d) {
    if (typeof d != "string")
      throw new TypeError("First argument must be a string");
    if (!d)
      return [];
    var f = d.match(t), u = f ? f[1] : void 0;
    return (0, r.formatDOM)((0, e.default)(d), null, u);
  }
  return Y;
}
var le = {}, F = {}, Q = {}, $e;
function dt() {
  if ($e) return Q;
  $e = 1;
  var i = 0;
  Q.SAME = i;
  var e = 1;
  return Q.CAMELCASE = e, Q.possibleStandardNames = {
    accept: 0,
    acceptCharset: 1,
    "accept-charset": "acceptCharset",
    accessKey: 1,
    action: 0,
    allowFullScreen: 1,
    alt: 0,
    as: 0,
    async: 0,
    autoCapitalize: 1,
    autoComplete: 1,
    autoCorrect: 1,
    autoFocus: 1,
    autoPlay: 1,
    autoSave: 1,
    capture: 0,
    cellPadding: 1,
    cellSpacing: 1,
    challenge: 0,
    charSet: 1,
    checked: 0,
    children: 0,
    cite: 0,
    class: "className",
    classID: 1,
    className: 1,
    cols: 0,
    colSpan: 1,
    content: 0,
    contentEditable: 1,
    contextMenu: 1,
    controls: 0,
    controlsList: 1,
    coords: 0,
    crossOrigin: 1,
    dangerouslySetInnerHTML: 1,
    data: 0,
    dateTime: 1,
    default: 0,
    defaultChecked: 1,
    defaultValue: 1,
    defer: 0,
    dir: 0,
    disabled: 0,
    disablePictureInPicture: 1,
    disableRemotePlayback: 1,
    download: 0,
    draggable: 0,
    encType: 1,
    enterKeyHint: 1,
    for: "htmlFor",
    form: 0,
    formMethod: 1,
    formAction: 1,
    formEncType: 1,
    formNoValidate: 1,
    formTarget: 1,
    frameBorder: 1,
    headers: 0,
    height: 0,
    hidden: 0,
    high: 0,
    href: 0,
    hrefLang: 1,
    htmlFor: 1,
    httpEquiv: 1,
    "http-equiv": "httpEquiv",
    icon: 0,
    id: 0,
    innerHTML: 1,
    inputMode: 1,
    integrity: 0,
    is: 0,
    itemID: 1,
    itemProp: 1,
    itemRef: 1,
    itemScope: 1,
    itemType: 1,
    keyParams: 1,
    keyType: 1,
    kind: 0,
    label: 0,
    lang: 0,
    list: 0,
    loop: 0,
    low: 0,
    manifest: 0,
    marginWidth: 1,
    marginHeight: 1,
    max: 0,
    maxLength: 1,
    media: 0,
    mediaGroup: 1,
    method: 0,
    min: 0,
    minLength: 1,
    multiple: 0,
    muted: 0,
    name: 0,
    noModule: 1,
    nonce: 0,
    noValidate: 1,
    open: 0,
    optimum: 0,
    pattern: 0,
    placeholder: 0,
    playsInline: 1,
    poster: 0,
    preload: 0,
    profile: 0,
    radioGroup: 1,
    readOnly: 1,
    referrerPolicy: 1,
    rel: 0,
    required: 0,
    reversed: 0,
    role: 0,
    rows: 0,
    rowSpan: 1,
    sandbox: 0,
    scope: 0,
    scoped: 0,
    scrolling: 0,
    seamless: 0,
    selected: 0,
    shape: 0,
    size: 0,
    sizes: 0,
    span: 0,
    spellCheck: 1,
    src: 0,
    srcDoc: 1,
    srcLang: 1,
    srcSet: 1,
    start: 0,
    step: 0,
    style: 0,
    summary: 0,
    tabIndex: 1,
    target: 0,
    title: 0,
    type: 0,
    useMap: 1,
    value: 0,
    width: 0,
    wmode: 0,
    wrap: 0,
    about: 0,
    accentHeight: 1,
    "accent-height": "accentHeight",
    accumulate: 0,
    additive: 0,
    alignmentBaseline: 1,
    "alignment-baseline": "alignmentBaseline",
    allowReorder: 1,
    alphabetic: 0,
    amplitude: 0,
    arabicForm: 1,
    "arabic-form": "arabicForm",
    ascent: 0,
    attributeName: 1,
    attributeType: 1,
    autoReverse: 1,
    azimuth: 0,
    baseFrequency: 1,
    baselineShift: 1,
    "baseline-shift": "baselineShift",
    baseProfile: 1,
    bbox: 0,
    begin: 0,
    bias: 0,
    by: 0,
    calcMode: 1,
    capHeight: 1,
    "cap-height": "capHeight",
    clip: 0,
    clipPath: 1,
    "clip-path": "clipPath",
    clipPathUnits: 1,
    clipRule: 1,
    "clip-rule": "clipRule",
    color: 0,
    colorInterpolation: 1,
    "color-interpolation": "colorInterpolation",
    colorInterpolationFilters: 1,
    "color-interpolation-filters": "colorInterpolationFilters",
    colorProfile: 1,
    "color-profile": "colorProfile",
    colorRendering: 1,
    "color-rendering": "colorRendering",
    contentScriptType: 1,
    contentStyleType: 1,
    cursor: 0,
    cx: 0,
    cy: 0,
    d: 0,
    datatype: 0,
    decelerate: 0,
    descent: 0,
    diffuseConstant: 1,
    direction: 0,
    display: 0,
    divisor: 0,
    dominantBaseline: 1,
    "dominant-baseline": "dominantBaseline",
    dur: 0,
    dx: 0,
    dy: 0,
    edgeMode: 1,
    elevation: 0,
    enableBackground: 1,
    "enable-background": "enableBackground",
    end: 0,
    exponent: 0,
    externalResourcesRequired: 1,
    fill: 0,
    fillOpacity: 1,
    "fill-opacity": "fillOpacity",
    fillRule: 1,
    "fill-rule": "fillRule",
    filter: 0,
    filterRes: 1,
    filterUnits: 1,
    floodOpacity: 1,
    "flood-opacity": "floodOpacity",
    floodColor: 1,
    "flood-color": "floodColor",
    focusable: 0,
    fontFamily: 1,
    "font-family": "fontFamily",
    fontSize: 1,
    "font-size": "fontSize",
    fontSizeAdjust: 1,
    "font-size-adjust": "fontSizeAdjust",
    fontStretch: 1,
    "font-stretch": "fontStretch",
    fontStyle: 1,
    "font-style": "fontStyle",
    fontVariant: 1,
    "font-variant": "fontVariant",
    fontWeight: 1,
    "font-weight": "fontWeight",
    format: 0,
    from: 0,
    fx: 0,
    fy: 0,
    g1: 0,
    g2: 0,
    glyphName: 1,
    "glyph-name": "glyphName",
    glyphOrientationHorizontal: 1,
    "glyph-orientation-horizontal": "glyphOrientationHorizontal",
    glyphOrientationVertical: 1,
    "glyph-orientation-vertical": "glyphOrientationVertical",
    glyphRef: 1,
    gradientTransform: 1,
    gradientUnits: 1,
    hanging: 0,
    horizAdvX: 1,
    "horiz-adv-x": "horizAdvX",
    horizOriginX: 1,
    "horiz-origin-x": "horizOriginX",
    ideographic: 0,
    imageRendering: 1,
    "image-rendering": "imageRendering",
    in2: 0,
    in: 0,
    inlist: 0,
    intercept: 0,
    k1: 0,
    k2: 0,
    k3: 0,
    k4: 0,
    k: 0,
    kernelMatrix: 1,
    kernelUnitLength: 1,
    kerning: 0,
    keyPoints: 1,
    keySplines: 1,
    keyTimes: 1,
    lengthAdjust: 1,
    letterSpacing: 1,
    "letter-spacing": "letterSpacing",
    lightingColor: 1,
    "lighting-color": "lightingColor",
    limitingConeAngle: 1,
    local: 0,
    markerEnd: 1,
    "marker-end": "markerEnd",
    markerHeight: 1,
    markerMid: 1,
    "marker-mid": "markerMid",
    markerStart: 1,
    "marker-start": "markerStart",
    markerUnits: 1,
    markerWidth: 1,
    mask: 0,
    maskContentUnits: 1,
    maskUnits: 1,
    mathematical: 0,
    mode: 0,
    numOctaves: 1,
    offset: 0,
    opacity: 0,
    operator: 0,
    order: 0,
    orient: 0,
    orientation: 0,
    origin: 0,
    overflow: 0,
    overlinePosition: 1,
    "overline-position": "overlinePosition",
    overlineThickness: 1,
    "overline-thickness": "overlineThickness",
    paintOrder: 1,
    "paint-order": "paintOrder",
    panose1: 0,
    "panose-1": "panose1",
    pathLength: 1,
    patternContentUnits: 1,
    patternTransform: 1,
    patternUnits: 1,
    pointerEvents: 1,
    "pointer-events": "pointerEvents",
    points: 0,
    pointsAtX: 1,
    pointsAtY: 1,
    pointsAtZ: 1,
    prefix: 0,
    preserveAlpha: 1,
    preserveAspectRatio: 1,
    primitiveUnits: 1,
    property: 0,
    r: 0,
    radius: 0,
    refX: 1,
    refY: 1,
    renderingIntent: 1,
    "rendering-intent": "renderingIntent",
    repeatCount: 1,
    repeatDur: 1,
    requiredExtensions: 1,
    requiredFeatures: 1,
    resource: 0,
    restart: 0,
    result: 0,
    results: 0,
    rotate: 0,
    rx: 0,
    ry: 0,
    scale: 0,
    security: 0,
    seed: 0,
    shapeRendering: 1,
    "shape-rendering": "shapeRendering",
    slope: 0,
    spacing: 0,
    specularConstant: 1,
    specularExponent: 1,
    speed: 0,
    spreadMethod: 1,
    startOffset: 1,
    stdDeviation: 1,
    stemh: 0,
    stemv: 0,
    stitchTiles: 1,
    stopColor: 1,
    "stop-color": "stopColor",
    stopOpacity: 1,
    "stop-opacity": "stopOpacity",
    strikethroughPosition: 1,
    "strikethrough-position": "strikethroughPosition",
    strikethroughThickness: 1,
    "strikethrough-thickness": "strikethroughThickness",
    string: 0,
    stroke: 0,
    strokeDasharray: 1,
    "stroke-dasharray": "strokeDasharray",
    strokeDashoffset: 1,
    "stroke-dashoffset": "strokeDashoffset",
    strokeLinecap: 1,
    "stroke-linecap": "strokeLinecap",
    strokeLinejoin: 1,
    "stroke-linejoin": "strokeLinejoin",
    strokeMiterlimit: 1,
    "stroke-miterlimit": "strokeMiterlimit",
    strokeWidth: 1,
    "stroke-width": "strokeWidth",
    strokeOpacity: 1,
    "stroke-opacity": "strokeOpacity",
    suppressContentEditableWarning: 1,
    suppressHydrationWarning: 1,
    surfaceScale: 1,
    systemLanguage: 1,
    tableValues: 1,
    targetX: 1,
    targetY: 1,
    textAnchor: 1,
    "text-anchor": "textAnchor",
    textDecoration: 1,
    "text-decoration": "textDecoration",
    textLength: 1,
    textRendering: 1,
    "text-rendering": "textRendering",
    to: 0,
    transform: 0,
    typeof: 0,
    u1: 0,
    u2: 0,
    underlinePosition: 1,
    "underline-position": "underlinePosition",
    underlineThickness: 1,
    "underline-thickness": "underlineThickness",
    unicode: 0,
    unicodeBidi: 1,
    "unicode-bidi": "unicodeBidi",
    unicodeRange: 1,
    "unicode-range": "unicodeRange",
    unitsPerEm: 1,
    "units-per-em": "unitsPerEm",
    unselectable: 0,
    vAlphabetic: 1,
    "v-alphabetic": "vAlphabetic",
    values: 0,
    vectorEffect: 1,
    "vector-effect": "vectorEffect",
    version: 0,
    vertAdvY: 1,
    "vert-adv-y": "vertAdvY",
    vertOriginX: 1,
    "vert-origin-x": "vertOriginX",
    vertOriginY: 1,
    "vert-origin-y": "vertOriginY",
    vHanging: 1,
    "v-hanging": "vHanging",
    vIdeographic: 1,
    "v-ideographic": "vIdeographic",
    viewBox: 1,
    viewTarget: 1,
    visibility: 0,
    vMathematical: 1,
    "v-mathematical": "vMathematical",
    vocab: 0,
    widths: 0,
    wordSpacing: 1,
    "word-spacing": "wordSpacing",
    writingMode: 1,
    "writing-mode": "writingMode",
    x1: 0,
    x2: 0,
    x: 0,
    xChannelSelector: 1,
    xHeight: 1,
    "x-height": "xHeight",
    xlinkActuate: 1,
    "xlink:actuate": "xlinkActuate",
    xlinkArcrole: 1,
    "xlink:arcrole": "xlinkArcrole",
    xlinkHref: 1,
    "xlink:href": "xlinkHref",
    xlinkRole: 1,
    "xlink:role": "xlinkRole",
    xlinkShow: 1,
    "xlink:show": "xlinkShow",
    xlinkTitle: 1,
    "xlink:title": "xlinkTitle",
    xlinkType: 1,
    "xlink:type": "xlinkType",
    xmlBase: 1,
    "xml:base": "xmlBase",
    xmlLang: 1,
    "xml:lang": "xmlLang",
    xmlns: 0,
    "xml:space": "xmlSpace",
    xmlnsXlink: 1,
    "xmlns:xlink": "xmlnsXlink",
    xmlSpace: 1,
    y1: 0,
    y2: 0,
    y: 0,
    yChannelSelector: 1,
    z: 0,
    zoomAndPan: 1
  }, Q;
}
var Ne;
function ht() {
  if (Ne) return F;
  Ne = 1;
  const i = 0, e = 1, r = 2, t = 3, s = 4, d = 5, f = 6;
  function u(n) {
    return a.hasOwnProperty(n) ? a[n] : null;
  }
  function o(n, l, p, x, S, D, M) {
    this.acceptsBooleans = l === r || l === t || l === s, this.attributeName = x, this.attributeNamespace = S, this.mustUseProperty = p, this.propertyName = n, this.type = l, this.sanitizeURL = D, this.removeEmptyString = M;
  }
  const a = {};
  [
    "children",
    "dangerouslySetInnerHTML",
    // TODO: This prevents the assignment of defaultValue to regular
    // elements (not just inputs). Now that ReactDOMInput assigns to the
    // defaultValue property -- do we need this?
    "defaultValue",
    "defaultChecked",
    "innerHTML",
    "suppressContentEditableWarning",
    "suppressHydrationWarning",
    "style"
  ].forEach((n) => {
    a[n] = new o(
      n,
      i,
      !1,
      // mustUseProperty
      n,
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), [
    ["acceptCharset", "accept-charset"],
    ["className", "class"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"]
  ].forEach(([n, l]) => {
    a[n] = new o(
      n,
      e,
      !1,
      // mustUseProperty
      l,
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach((n) => {
    a[n] = new o(
      n,
      r,
      !1,
      // mustUseProperty
      n.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), [
    "autoReverse",
    "externalResourcesRequired",
    "focusable",
    "preserveAlpha"
  ].forEach((n) => {
    a[n] = new o(
      n,
      r,
      !1,
      // mustUseProperty
      n,
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), [
    "allowFullScreen",
    "async",
    // Note: there is a special case that prevents it from being written to the DOM
    // on the client side because the browsers are inconsistent. Instead we call focus().
    "autoFocus",
    "autoPlay",
    "controls",
    "default",
    "defer",
    "disabled",
    "disablePictureInPicture",
    "disableRemotePlayback",
    "formNoValidate",
    "hidden",
    "loop",
    "noModule",
    "noValidate",
    "open",
    "playsInline",
    "readOnly",
    "required",
    "reversed",
    "scoped",
    "seamless",
    // Microdata
    "itemScope"
  ].forEach((n) => {
    a[n] = new o(
      n,
      t,
      !1,
      // mustUseProperty
      n.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), [
    "checked",
    // Note: `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`. We have special logic for handling this.
    "multiple",
    "muted",
    "selected"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((n) => {
    a[n] = new o(
      n,
      t,
      !0,
      // mustUseProperty
      n,
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), [
    "capture",
    "download"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((n) => {
    a[n] = new o(
      n,
      s,
      !1,
      // mustUseProperty
      n,
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), [
    "cols",
    "rows",
    "size",
    "span"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((n) => {
    a[n] = new o(
      n,
      f,
      !1,
      // mustUseProperty
      n,
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), ["rowSpan", "start"].forEach((n) => {
    a[n] = new o(
      n,
      d,
      !1,
      // mustUseProperty
      n.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  });
  const m = /[\-\:]([a-z])/g, b = (n) => n[1].toUpperCase();
  [
    "accent-height",
    "alignment-baseline",
    "arabic-form",
    "baseline-shift",
    "cap-height",
    "clip-path",
    "clip-rule",
    "color-interpolation",
    "color-interpolation-filters",
    "color-profile",
    "color-rendering",
    "dominant-baseline",
    "enable-background",
    "fill-opacity",
    "fill-rule",
    "flood-color",
    "flood-opacity",
    "font-family",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-variant",
    "font-weight",
    "glyph-name",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    "horiz-adv-x",
    "horiz-origin-x",
    "image-rendering",
    "letter-spacing",
    "lighting-color",
    "marker-end",
    "marker-mid",
    "marker-start",
    "overline-position",
    "overline-thickness",
    "paint-order",
    "panose-1",
    "pointer-events",
    "rendering-intent",
    "shape-rendering",
    "stop-color",
    "stop-opacity",
    "strikethrough-position",
    "strikethrough-thickness",
    "stroke-dasharray",
    "stroke-dashoffset",
    "stroke-linecap",
    "stroke-linejoin",
    "stroke-miterlimit",
    "stroke-opacity",
    "stroke-width",
    "text-anchor",
    "text-decoration",
    "text-rendering",
    "underline-position",
    "underline-thickness",
    "unicode-bidi",
    "unicode-range",
    "units-per-em",
    "v-alphabetic",
    "v-hanging",
    "v-ideographic",
    "v-mathematical",
    "vector-effect",
    "vert-adv-y",
    "vert-origin-x",
    "vert-origin-y",
    "word-spacing",
    "writing-mode",
    "xmlns:xlink",
    "x-height"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((n) => {
    const l = n.replace(m, b);
    a[l] = new o(
      l,
      e,
      !1,
      // mustUseProperty
      n,
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), [
    "xlink:actuate",
    "xlink:arcrole",
    "xlink:role",
    "xlink:show",
    "xlink:title",
    "xlink:type"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((n) => {
    const l = n.replace(m, b);
    a[l] = new o(
      l,
      e,
      !1,
      // mustUseProperty
      n,
      "http://www.w3.org/1999/xlink",
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), [
    "xml:base",
    "xml:lang",
    "xml:space"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((n) => {
    const l = n.replace(m, b);
    a[l] = new o(
      l,
      e,
      !1,
      // mustUseProperty
      n,
      "http://www.w3.org/XML/1998/namespace",
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), ["tabIndex", "crossOrigin"].forEach((n) => {
    a[n] = new o(
      n,
      e,
      !1,
      // mustUseProperty
      n.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  });
  const A = "xlinkHref";
  a[A] = new o(
    "xlinkHref",
    e,
    !1,
    // mustUseProperty
    "xlink:href",
    "http://www.w3.org/1999/xlink",
    !0,
    // sanitizeURL
    !1
    // removeEmptyString
  ), ["src", "href", "action", "formAction"].forEach((n) => {
    a[n] = new o(
      n,
      e,
      !1,
      // mustUseProperty
      n.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      !0,
      // sanitizeURL
      !0
      // removeEmptyString
    );
  });
  const {
    CAMELCASE: _,
    SAME: E,
    possibleStandardNames: y
  } = dt(), g = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD" + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", R = RegExp.prototype.test.bind(
    // eslint-disable-next-line no-misleading-character-class
    new RegExp("^(data|aria)-[" + g + "]*$")
  ), P = Object.keys(
    y
  ).reduce((n, l) => {
    const p = y[l];
    return p === E ? n[l] = l : p === _ ? n[l.toLowerCase()] = l : n[l] = p, n;
  }, {});
  return F.BOOLEAN = t, F.BOOLEANISH_STRING = r, F.NUMERIC = d, F.OVERLOADED_BOOLEAN = s, F.POSITIVE_NUMERIC = f, F.RESERVED = i, F.STRING = e, F.getPropertyInfo = u, F.isCustomAttribute = R, F.possibleStandardNames = P, F;
}
var ee = {}, X = {}, me, Fe;
function ft() {
  if (Fe) return me;
  Fe = 1;
  var i = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, e = /\n/g, r = /^\s*/, t = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, s = /^:\s*/, d = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, f = /^[;\s]*/, u = /^\s+|\s+$/g, o = `
`, a = "/", c = "*", m = "", b = "comment", A = "declaration";
  me = function(E, y) {
    if (typeof E != "string")
      throw new TypeError("First argument must be a string");
    if (!E) return [];
    y = y || {};
    var v = 1, g = 1;
    function R(k) {
      var w = k.match(e);
      w && (v += w.length);
      var N = k.lastIndexOf(o);
      g = ~N ? k.length - N : g + k.length;
    }
    function P() {
      var k = { line: v, column: g };
      return function(w) {
        return w.position = new n(k), x(), w;
      };
    }
    function n(k) {
      this.start = k, this.end = { line: v, column: g }, this.source = y.source;
    }
    n.prototype.content = E;
    function l(k) {
      var w = new Error(
        y.source + ":" + v + ":" + g + ": " + k
      );
      if (w.reason = k, w.filename = y.source, w.line = v, w.column = g, w.source = E, !y.silent) throw w;
    }
    function p(k) {
      var w = k.exec(E);
      if (w) {
        var N = w[0];
        return R(N), E = E.slice(N.length), w;
      }
    }
    function x() {
      p(r);
    }
    function S(k) {
      var w;
      for (k = k || []; w = D(); )
        w !== !1 && k.push(w);
      return k;
    }
    function D() {
      var k = P();
      if (!(a != E.charAt(0) || c != E.charAt(1))) {
        for (var w = 2; m != E.charAt(w) && (c != E.charAt(w) || a != E.charAt(w + 1)); )
          ++w;
        if (w += 2, m === E.charAt(w - 1))
          return l("End of comment missing");
        var N = E.slice(2, w - 2);
        return g += 2, R(N), E = E.slice(w), g += 2, k({
          type: b,
          comment: N
        });
      }
    }
    function M() {
      var k = P(), w = p(t);
      if (w) {
        if (D(), !p(s)) return l("property missing ':'");
        var N = p(d), ae = k({
          type: A,
          property: _(w[0].replace(i, m)),
          value: N ? _(N[0].replace(i, m)) : m
        });
        return p(f), ae;
      }
    }
    function U() {
      var k = [];
      S(k);
      for (var w; w = M(); )
        w !== !1 && (k.push(w), S(k));
      return k;
    }
    return x(), U();
  };
  function _(E) {
    return E ? E.replace(u, m) : m;
  }
  return me;
}
var je;
function pt() {
  if (je) return X;
  je = 1;
  var i = X && X.__importDefault || function(t) {
    return t && t.__esModule ? t : { default: t };
  };
  Object.defineProperty(X, "__esModule", { value: !0 }), X.default = r;
  var e = i(ft());
  function r(t, s) {
    var d = null;
    if (!t || typeof t != "string")
      return d;
    var f = (0, e.default)(t), u = typeof s == "function";
    return f.forEach(function(o) {
      if (o.type === "declaration") {
        var a = o.property, c = o.value;
        u ? s(a, c, o) : c && (d = d || {}, d[a] = c);
      }
    }), d;
  }
  return X;
}
var te = {}, He;
function mt() {
  if (He) return te;
  He = 1, Object.defineProperty(te, "__esModule", { value: !0 }), te.camelCase = void 0;
  var i = /^--[a-zA-Z0-9_-]+$/, e = /-([a-z])/g, r = /^[^-]+$/, t = /^-(webkit|moz|ms|o|khtml)-/, s = /^-(ms)-/, d = function(a) {
    return !a || r.test(a) || i.test(a);
  }, f = function(a, c) {
    return c.toUpperCase();
  }, u = function(a, c) {
    return "".concat(c, "-");
  }, o = function(a, c) {
    return c === void 0 && (c = {}), d(a) ? a : (a = a.toLowerCase(), c.reactCompat ? a = a.replace(s, u) : a = a.replace(t, u), a.replace(e, f));
  };
  return te.camelCase = o, te;
}
var ie, Ue;
function gt() {
  if (Ue) return ie;
  Ue = 1;
  var i = ie && ie.__importDefault || function(s) {
    return s && s.__esModule ? s : { default: s };
  }, e = i(pt()), r = mt();
  function t(s, d) {
    var f = {};
    return !s || typeof s != "string" || (0, e.default)(s, function(u, o) {
      u && o && (f[(0, r.camelCase)(u, d)] = o);
    }), f;
  }
  return t.default = t, ie = t, ie;
}
var Ve;
function Ke() {
  return Ve || (Ve = 1, (function(i) {
    var e = ee && ee.__importDefault || function(c) {
      return c && c.__esModule ? c : { default: c };
    };
    Object.defineProperty(i, "__esModule", { value: !0 }), i.returnFirstArg = i.canTextBeChildOfNode = i.ELEMENTS_WITH_NO_TEXT_CHILDREN = i.PRESERVE_CUSTOM_ATTRIBUTES = void 0, i.isCustomComponent = d, i.setStyleProp = u;
    var r = ye, t = e(gt()), s = /* @__PURE__ */ new Set([
      "annotation-xml",
      "color-profile",
      "font-face",
      "font-face-src",
      "font-face-uri",
      "font-face-format",
      "font-face-name",
      "missing-glyph"
    ]);
    function d(c, m) {
      return c.includes("-") ? !s.has(c) : !!(m && typeof m.is == "string");
    }
    var f = {
      reactCompat: !0
    };
    function u(c, m) {
      if (typeof c == "string") {
        if (!c.trim()) {
          m.style = {};
          return;
        }
        try {
          m.style = (0, t.default)(c, f);
        } catch {
          m.style = {};
        }
      }
    }
    i.PRESERVE_CUSTOM_ATTRIBUTES = Number(r.version.split(".")[0]) >= 16, i.ELEMENTS_WITH_NO_TEXT_CHILDREN = /* @__PURE__ */ new Set([
      "tr",
      "tbody",
      "thead",
      "tfoot",
      "colgroup",
      "table",
      "head",
      "html",
      "frameset"
    ]);
    var o = function(c) {
      return !i.ELEMENTS_WITH_NO_TEXT_CHILDREN.has(c.name);
    };
    i.canTextBeChildOfNode = o;
    var a = function(c) {
      return c;
    };
    i.returnFirstArg = a;
  })(ee)), ee;
}
var Ge;
function Ze() {
  if (Ge) return le;
  Ge = 1, Object.defineProperty(le, "__esModule", { value: !0 }), le.default = d;
  var i = ht(), e = Ke(), r = ["checked", "value"], t = ["input", "select", "textarea"], s = {
    reset: !0,
    submit: !0
  };
  function d(u, o) {
    u === void 0 && (u = {});
    var a = {}, c = !!(u.type && s[u.type]);
    for (var m in u) {
      var b = u[m];
      if ((0, i.isCustomAttribute)(m)) {
        a[m] = b;
        continue;
      }
      var A = m.toLowerCase(), _ = f(A);
      if (_) {
        var E = (0, i.getPropertyInfo)(_);
        switch (r.includes(_) && t.includes(o) && !c && (_ = f("default" + A)), a[_] = b, E && E.type) {
          case i.BOOLEAN:
            a[_] = !0;
            break;
          case i.OVERLOADED_BOOLEAN:
            b === "" && (a[_] = !0);
            break;
        }
        continue;
      }
      e.PRESERVE_CUSTOM_ATTRIBUTES && (a[m] = b);
    }
    return (0, e.setStyleProp)(u.style, a), a;
  }
  function f(u) {
    return i.possibleStandardNames[u];
  }
  return le;
}
var W = {}, ze;
function vt() {
  if (ze) return W;
  ze = 1;
  var i = W && W.__importDefault || function(u) {
    return u && u.__esModule ? u : { default: u };
  };
  Object.defineProperty(W, "__esModule", { value: !0 }), W.default = d;
  var e = ye, r = i(Ze()), t = Ke(), s = {
    cloneElement: e.cloneElement,
    createElement: e.createElement,
    isValidElement: e.isValidElement
  };
  function d(u, o) {
    o === void 0 && (o = {});
    for (var a = [], c = typeof o.replace == "function", m = o.transform || t.returnFirstArg, b = o.library || s, A = b.cloneElement, _ = b.createElement, E = b.isValidElement, y = u.length, v = 0; v < y; v++) {
      var g = u[v];
      if (c) {
        var R = o.replace(g, v);
        if (E(R)) {
          y > 1 && (R = A(R, {
            key: R.key || v
          })), a.push(m(R, g, v));
          continue;
        }
      }
      if (g.type === "text") {
        var P = !g.data.trim().length;
        if (P && g.parent && !(0, t.canTextBeChildOfNode)(g.parent) || o.trim && P)
          continue;
        a.push(m(g.data, g, v));
        continue;
      }
      var n = g, l = {};
      f(n) ? ((0, t.setStyleProp)(n.attribs.style, n.attribs), l = n.attribs) : n.attribs && (l = (0, r.default)(n.attribs, n.name));
      var p = void 0;
      switch (g.type) {
        case "script":
        case "style":
          g.children[0] && (l.dangerouslySetInnerHTML = {
            __html: g.children[0].data
          });
          break;
        case "tag":
          g.name === "textarea" && g.children[0] ? l.defaultValue = g.children[0].data : g.children && g.children.length && (p = d(g.children, o));
          break;
        // skip all other cases (e.g., comment)
        default:
          continue;
      }
      y > 1 && (l.key = v), a.push(m(_(g.name, l, p), g, v));
    }
    return a.length === 1 ? a[0] : a;
  }
  function f(u) {
    return t.PRESERVE_CUSTOM_ATTRIBUTES && u.type === "tag" && (0, t.isCustomComponent)(u.name, u.attribs);
  }
  return W;
}
var qe;
function bt() {
  return qe || (qe = 1, (function(i) {
    var e = Z && Z.__importDefault || function(o) {
      return o && o.__esModule ? o : { default: o };
    };
    Object.defineProperty(i, "__esModule", { value: !0 }), i.htmlToDOM = i.domToReact = i.attributesToProps = i.Text = i.ProcessingInstruction = i.Element = i.Comment = void 0, i.default = u;
    var r = e(ut());
    i.htmlToDOM = r.default;
    var t = e(Ze());
    i.attributesToProps = t.default;
    var s = e(vt());
    i.domToReact = s.default;
    var d = /* @__PURE__ */ We();
    Object.defineProperty(i, "Comment", { enumerable: !0, get: function() {
      return d.Comment;
    } }), Object.defineProperty(i, "Element", { enumerable: !0, get: function() {
      return d.Element;
    } }), Object.defineProperty(i, "ProcessingInstruction", { enumerable: !0, get: function() {
      return d.ProcessingInstruction;
    } }), Object.defineProperty(i, "Text", { enumerable: !0, get: function() {
      return d.Text;
    } });
    var f = { lowerCaseAttributeNames: !1 };
    function u(o, a) {
      if (typeof o != "string")
        throw new TypeError("First argument must be a string");
      return o ? (0, s.default)((0, r.default)(o, a?.htmlparser2 || f), a) : [];
    }
  })(Z)), Z;
}
var be = bt();
const Be = /* @__PURE__ */ nt(be), Et = Be.default || Be, yt = /* @__PURE__ */ new Set([
  "core-features-and-limits",
  "depth-clip-control",
  "depth32float-stencil8",
  "texture-compression-bc",
  "texture-compression-bc-sliced-3d",
  "texture-compression-etc2",
  "texture-compression-astc",
  "texture-compression-astc-sliced-3d",
  "timestamp-query",
  "indirect-first-instance",
  "shader-f16",
  "rg11b10ufloat-renderable",
  "bgra8unorm-storage",
  "float32-filterable",
  "float32-blendable",
  "clip-distances",
  "dual-source-blending",
  "subgroups",
  "texture-formats-tier1",
  "texture-formats-tier2"
]), Ft = ["hello-cube", "sky-sea"], Qe = "hello-cube", jt = /* @__PURE__ */ new Map([
  [
    Qe,
    {
      name: "Hello Cube",
      description: "Tests WebGPU functionality with a simple spinning cube."
    }
  ],
  [
    "sky-sea",
    {
      name: "Sky and Sea",
      description: "Real-time rendering of a dynamic sun over the open ocean, with various models for surface waves and raymarched atmospheric scattering."
    }
  ]
]), et = /* @__PURE__ */ new Map([
  [
    Qe,
    {
      projectFolder: "hello-cube",
      requiredLimits: /* @__PURE__ */ new Map(),
      requiredFeatures: /* @__PURE__ */ new Set(),
      optionalFeatures: yt,
      import: () => import("./HelloCube-D02_5DAD.js").then((i) => i.HelloCubeAppConstructor)
    }
  ],
  [
    "sky-sea",
    {
      projectFolder: "sky-sea",
      requiredLimits: /* @__PURE__ */ new Map([["maxStorageTexturesPerShaderStage", 8]]),
      requiredFeatures: /* @__PURE__ */ new Set(),
      optionalFeatures: /* @__PURE__ */ new Set([
        "timestamp-query",
        "float32-filterable"
      ]),
      import: () => import("./SkySea-BPbGn4Dy.js").then((i) => i.SkySeaAppConstructor)
    }
  ]
]), _t = "https://github.com/EllarBooher/WebGPU-Samples/tree/main/lib/webgpu", Ht = it(function({
  sampleID: e
}) {
  const [r, t] = ce(), s = et.get(e)?.projectFolder;
  if (re(() => {
    if (s === void 0) {
      t(void 0);
      return;
    }
    rt(/* @__PURE__ */ Object.assign({ "./hello-cube/README.md": () => import("./README-CPZmMRLh.js"), "./sky-sea/README.md": () => import("./README-kqzPCk2x.js") }), `./${s}/README.md`, 3).then((f) => {
      const u = f;
      if (typeof u.default != "string")
        throw new Error(
          `Invalid readme markdown import, path is ${s}`
        );
      t(u.default);
    }).catch((f) => {
      f instanceof Error && console.error(f);
    });
  }, [s, t]), r === void 0)
    return;
  const d = {
    replace(f) {
      const { attribs: u, children: o } = f;
      if (u === void 0 || o === void 0)
        return;
      const a = u.href;
      if (typeof a != "string")
        return;
      if (a.startsWith("#") === !0)
        return /* @__PURE__ */ L.jsx(
          "button",
          {
            role: "link",
            className: "webgpu-samples-hash-link",
            onClick: () => document.getElementById(a.slice(1))?.scrollIntoView(),
            children: be.domToReact(o, d)
          }
        );
      const c = `${_t}/${s}/`;
      let m;
      return URL.canParse(a) ? m = a : URL.canParse(a, c) && (m = URL.parse(a, c).href), /* @__PURE__ */ L.jsx("a", { target: "_blank", rel: "noopener noreferrer", href: m, children: be.domToReact(o, d) });
    }
  };
  return /* @__PURE__ */ L.jsx("div", { className: "webgpu-samples-readme-body", children: Et(r, d) });
});
async function At(i) {
  console.log("Starting WebGPU");
  const e = navigator.gpu.requestAdapter().then((t) => t ? Promise.resolve(t) : Promise.reject(
    new Error("Requested WebGPU Adapter is not available.")
  )).catch((t) => Promise.reject(
    new Error("Unable to get WebGPU Adapter", { cause: t })
  )), r = e.then((t) => {
    const s = Array.from(
      i.requiredFeatures.values()
    ).filter((a) => t.features.has(a));
    if (s.length != i.requiredFeatures.size) {
      const a = `Required features unavailable: ${Array.from(
        i.requiredFeatures.values()
      ).filter((c) => !t.features.has(c)).map((c) => `'${c}'`).join(",")}`;
      return Promise.reject(
        new Error("Unable to get WebGPU Device", { cause: a })
      );
    }
    const d = s.concat(
      ...Array.from(i.optionalFeatures.values()).filter((a) => t.features.has(a))
    );
    console.log(`Enabling features: '${d.join("', '")}'`);
    const f = /* @__PURE__ */ new Map(), u = new Array();
    for (const [a, c] of i.requiredLimits.entries()) {
      const m = t.limits[a];
      m >= c ? f.set(a, c) : u.push({
        name: a,
        requestedMinimum: c,
        supported: m
      });
    }
    if (f.size < i.requiredLimits.size) {
      const a = `Required limits unsatisfied: ${u.map(
        (c) => `( name: '${c.name}' supported: '${c.supported}' requested: '${c.requestedMinimum}' )`
      ).join(",")}`;
      return Promise.reject(
        new Error("Unable to get WebGPU Device", { cause: a })
      );
    }
    const o = {};
    for (const [a, c] of f)
      o[a] = c;
    return t.requestDevice({
      requiredFeatures: d,
      requiredLimits: o
    }).catch((a) => Promise.reject(
      new Error("Unable to get WebGPU Device", { cause: a })
    ));
  });
  return Promise.all([e, r]).then((t) => {
    const [s, d] = t;
    return {
      adapter: s,
      device: d
    };
  });
}
async function wt(i) {
  return Promise.all([
    i.import(),
    At({
      ...i
    })
  ]).then(([e, { adapter: r, device: t }]) => {
    const s = i.gpu.getPreferredCanvasFormat(), d = e(t, s);
    return t.lost.then(
      (f) => {
        console.log(
          `WebGPU device lost - ("${f.reason}"):
 ${f.message}`
        );
      },
      (f) => {
        throw new Error("WebGPU device lost rejected", {
          cause: f
        });
      }
    ).finally(() => {
      d.quit = !0;
    }), t.onuncapturederror = (f) => {
      d.quit = !0, i.onUncapturedError(f);
    }, d;
  });
}
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.20.0
 * @author George Michael Brower
 * @license MIT
 */
class H {
  constructor(e, r, t, s, d = "div") {
    this.parent = e, this.object = r, this.property = t, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(d), this.domElement.classList.add("controller"), this.domElement.classList.add(s), this.$name = document.createElement("div"), this.$name.classList.add("name"), H.nextNameID = H.nextNameID || 0, this.$name.id = `lil-gui-name-${++H.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (f) => f.stopPropagation()), this.domElement.addEventListener("keyup", (f) => f.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(t);
  }
  /**
   * Sets the name of the controller and its label in the GUI.
   * @param {string} name
   * @returns {this}
   */
  name(e) {
    return this._name = e, this.$name.textContent = e, this;
  }
  /**
   * Pass a function to be called whenever the value is modified by this controller.
   * The function receives the new value as its first parameter. The value of `this` will be the
   * controller.
   *
   * For function controllers, the `onChange` callback will be fired on click, after the function
   * executes.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onChange( function( v ) {
   * 	console.log( 'The value is now ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onChange(e) {
    return this._onChange = e, this;
  }
  /**
   * Calls the onChange methods of this controller and its parent GUI.
   * @protected
   */
  _callOnChange() {
    this.parent._callOnChange(this), this._onChange !== void 0 && this._onChange.call(this, this.getValue()), this._changed = !0;
  }
  /**
   * Pass a function to be called after this controller has been modified and loses focus.
   * @param {Function} callback
   * @returns {this}
   * @example
   * const controller = gui.add( object, 'property' );
   *
   * controller.onFinishChange( function( v ) {
   * 	console.log( 'Changes complete: ' + v );
   * 	console.assert( this === controller );
   * } );
   */
  onFinishChange(e) {
    return this._onFinishChange = e, this;
  }
  /**
   * Should be called by Controller when its widgets lose focus.
   * @protected
   */
  _callOnFinishChange() {
    this._changed && (this.parent._callOnFinishChange(this), this._onFinishChange !== void 0 && this._onFinishChange.call(this, this.getValue())), this._changed = !1;
  }
  /**
   * Sets the controller back to its initial value.
   * @returns {this}
   */
  reset() {
    return this.setValue(this.initialValue), this._callOnFinishChange(), this;
  }
  /**
   * Enables this controller.
   * @param {boolean} enabled
   * @returns {this}
   * @example
   * controller.enable();
   * controller.enable( false ); // disable
   * controller.enable( controller._disabled ); // toggle
   */
  enable(e = !0) {
    return this.disable(!e);
  }
  /**
   * Disables this controller.
   * @param {boolean} disabled
   * @returns {this}
   * @example
   * controller.disable();
   * controller.disable( false ); // enable
   * controller.disable( !controller._disabled ); // toggle
   */
  disable(e = !0) {
    return e === this._disabled ? this : (this._disabled = e, this.domElement.classList.toggle("disabled", e), this.$disable.toggleAttribute("disabled", e), this);
  }
  /**
   * Shows the Controller after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * controller.show();
   * controller.show( false ); // hide
   * controller.show( controller._hidden ); // toggle
   */
  show(e = !0) {
    return this._hidden = !e, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the Controller.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  /**
   * Changes this controller into a dropdown of options.
   *
   * Calling this method on an option controller will simply update the options. However, if this
   * controller was not already an option controller, old references to this controller are
   * destroyed, and a new controller is added to the end of the GUI.
   * @example
   * // safe usage
   *
   * gui.add( obj, 'prop1' ).options( [ 'a', 'b', 'c' ] );
   * gui.add( obj, 'prop2' ).options( { Big: 10, Small: 1 } );
   * gui.add( obj, 'prop3' );
   *
   * // danger
   *
   * const ctrl1 = gui.add( obj, 'prop1' );
   * gui.add( obj, 'prop2' );
   *
   * // calling options out of order adds a new controller to the end...
   * const ctrl2 = ctrl1.options( [ 'a', 'b', 'c' ] );
   *
   * // ...and ctrl1 now references a controller that doesn't exist
   * assert( ctrl2 !== ctrl1 )
   * @param {object|Array} options
   * @returns {Controller}
   */
  options(e) {
    const r = this.parent.add(this.object, this.property, e);
    return r.name(this._name), this.destroy(), r;
  }
  /**
   * Sets the minimum value. Only works on number controllers.
   * @param {number} min
   * @returns {this}
   */
  min(e) {
    return this;
  }
  /**
   * Sets the maximum value. Only works on number controllers.
   * @param {number} max
   * @returns {this}
   */
  max(e) {
    return this;
  }
  /**
   * Values set by this controller will be rounded to multiples of `step`. Only works on number
   * controllers.
   * @param {number} step
   * @returns {this}
   */
  step(e) {
    return this;
  }
  /**
   * Rounds the displayed value to a fixed number of decimals, without affecting the actual value
   * like `step()`. Only works on number controllers.
   * @example
   * gui.add( object, 'property' ).listen().decimals( 4 );
   * @param {number} decimals
   * @returns {this}
   */
  decimals(e) {
    return this;
  }
  /**
   * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
   * @param {boolean} listen
   * @returns {this}
   */
  listen(e = !0) {
    return this._listening = e, this._listenCallbackID !== void 0 && (cancelAnimationFrame(this._listenCallbackID), this._listenCallbackID = void 0), this._listening && this._listenCallback(), this;
  }
  _listenCallback() {
    this._listenCallbackID = requestAnimationFrame(this._listenCallback);
    const e = this.save();
    e !== this._listenPrevValue && this.updateDisplay(), this._listenPrevValue = e;
  }
  /**
   * Returns `object[ property ]`.
   * @returns {any}
   */
  getValue() {
    return this.object[this.property];
  }
  /**
   * Sets the value of `object[ property ]`, invokes any `onChange` handlers and updates the display.
   * @param {any} value
   * @returns {this}
   */
  setValue(e) {
    return this.getValue() !== e && (this.object[this.property] = e, this._callOnChange(), this.updateDisplay()), this;
  }
  /**
   * Updates the display to keep it in sync with the current value. Useful for updating your
   * controllers when their values have been modified outside of the GUI.
   * @returns {this}
   */
  updateDisplay() {
    return this;
  }
  load(e) {
    return this.setValue(e), this._callOnFinishChange(), this;
  }
  save() {
    return this.getValue();
  }
  /**
   * Destroys this controller and removes it from the parent GUI.
   */
  destroy() {
    this.listen(!1), this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1), this.parent.$children.removeChild(this.domElement);
  }
}
class xt extends H {
  constructor(e, r, t) {
    super(e, r, t, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function Ee(i) {
  let e, r;
  return (e = i.match(/(#|0x)?([a-f0-9]{6})/i)) ? r = e[2] : (e = i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? r = parseInt(e[1]).toString(16).padStart(2, 0) + parseInt(e[2]).toString(16).padStart(2, 0) + parseInt(e[3]).toString(16).padStart(2, 0) : (e = i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (r = e[1] + e[1] + e[2] + e[2] + e[3] + e[3]), r ? "#" + r : !1;
}
const Ct = {
  isPrimitive: !0,
  match: (i) => typeof i == "string",
  fromHexString: Ee,
  toHexString: Ee
}, ne = {
  isPrimitive: !0,
  match: (i) => typeof i == "number",
  fromHexString: (i) => parseInt(i.substring(1), 16),
  toHexString: (i) => "#" + i.toString(16).padStart(6, 0)
}, Tt = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (i) => Array.isArray(i),
  fromHexString(i, e, r = 1) {
    const t = ne.fromHexString(i);
    e[0] = (t >> 16 & 255) / 255 * r, e[1] = (t >> 8 & 255) / 255 * r, e[2] = (t & 255) / 255 * r;
  },
  toHexString([i, e, r], t = 1) {
    t = 255 / t;
    const s = i * t << 16 ^ e * t << 8 ^ r * t << 0;
    return ne.toHexString(s);
  }
}, Rt = {
  isPrimitive: !1,
  match: (i) => Object(i) === i,
  fromHexString(i, e, r = 1) {
    const t = ne.fromHexString(i);
    e.r = (t >> 16 & 255) / 255 * r, e.g = (t >> 8 & 255) / 255 * r, e.b = (t & 255) / 255 * r;
  },
  toHexString({ r: i, g: e, b: r }, t = 1) {
    t = 255 / t;
    const s = i * t << 16 ^ e * t << 8 ^ r * t << 0;
    return ne.toHexString(s);
  }
}, St = [Ct, ne, Tt, Rt];
function kt(i) {
  return St.find((e) => e.match(i));
}
class Ot extends H {
  constructor(e, r, t, s) {
    super(e, r, t, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = kt(this.initialValue), this._rgbScale = s, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const d = Ee(this.$text.value);
      d && this._setValueFromHexString(d);
    }), this.$text.addEventListener("focus", () => {
      this._textFocused = !0, this.$text.select();
    }), this.$text.addEventListener("blur", () => {
      this._textFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    }), this.$disable = this.$text, this.updateDisplay();
  }
  reset() {
    return this._setValueFromHexString(this._initialValueHexString), this;
  }
  _setValueFromHexString(e) {
    if (this._format.isPrimitive) {
      const r = this._format.fromHexString(e);
      this.setValue(r);
    } else
      this._format.fromHexString(e, this.getValue(), this._rgbScale), this._callOnChange(), this.updateDisplay();
  }
  save() {
    return this._format.toHexString(this.getValue(), this._rgbScale);
  }
  load(e) {
    return this._setValueFromHexString(e), this._callOnFinishChange(), this;
  }
  updateDisplay() {
    return this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale), this._textFocused || (this.$text.value = this.$input.value.substring(1)), this.$display.style.backgroundColor = this.$input.value, this;
  }
}
class ge extends H {
  constructor(e, r, t) {
    super(e, r, t, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (s) => {
      s.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class Pt extends H {
  constructor(e, r, t, s, d, f) {
    super(e, r, t, "number"), this._initInput(), this.min(s), this.max(d);
    const u = f !== void 0;
    this.step(u ? f : this._getImplicitStep(), u), this.updateDisplay();
  }
  decimals(e) {
    return this._decimals = e, this.updateDisplay(), this;
  }
  min(e) {
    return this._min = e, this._onUpdateMinMax(), this;
  }
  max(e) {
    return this._max = e, this._onUpdateMinMax(), this;
  }
  step(e, r = !0) {
    return this._step = e, this._stepExplicit = r, this;
  }
  updateDisplay() {
    const e = this.getValue();
    if (this._hasSlider) {
      let r = (e - this._min) / (this._max - this._min);
      r = Math.max(0, Math.min(r, 1)), this.$fill.style.width = r * 100 + "%";
    }
    return this._inputFocused || (this.$input.value = this._decimals === void 0 ? e : e.toFixed(this._decimals)), this;
  }
  _initInput() {
    this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("aria-labelledby", this.$name.id), window.matchMedia("(pointer: coarse)").matches && (this.$input.setAttribute("type", "number"), this.$input.setAttribute("step", "any")), this.$widget.appendChild(this.$input), this.$disable = this.$input;
    const r = () => {
      let g = parseFloat(this.$input.value);
      isNaN(g) || (this._stepExplicit && (g = this._snap(g)), this.setValue(this._clamp(g)));
    }, t = (g) => {
      const R = parseFloat(this.$input.value);
      isNaN(R) || (this._snapClampSetValue(R + g), this.$input.value = this.getValue());
    }, s = (g) => {
      g.key === "Enter" && this.$input.blur(), g.code === "ArrowUp" && (g.preventDefault(), t(this._step * this._arrowKeyMultiplier(g))), g.code === "ArrowDown" && (g.preventDefault(), t(this._step * this._arrowKeyMultiplier(g) * -1));
    }, d = (g) => {
      this._inputFocused && (g.preventDefault(), t(this._step * this._normalizeMouseWheel(g)));
    };
    let f = !1, u, o, a, c, m;
    const b = 5, A = (g) => {
      u = g.clientX, o = a = g.clientY, f = !0, c = this.getValue(), m = 0, window.addEventListener("mousemove", _), window.addEventListener("mouseup", E);
    }, _ = (g) => {
      if (f) {
        const R = g.clientX - u, P = g.clientY - o;
        Math.abs(P) > b ? (g.preventDefault(), this.$input.blur(), f = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(R) > b && E();
      }
      if (!f) {
        const R = g.clientY - a;
        m -= R * this._step * this._arrowKeyMultiplier(g), c + m > this._max ? m = this._max - c : c + m < this._min && (m = this._min - c), this._snapClampSetValue(c + m);
      }
      a = g.clientY;
    }, E = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", _), window.removeEventListener("mouseup", E);
    }, y = () => {
      this._inputFocused = !0;
    }, v = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", r), this.$input.addEventListener("keydown", s), this.$input.addEventListener("wheel", d, { passive: !1 }), this.$input.addEventListener("mousedown", A), this.$input.addEventListener("focus", y), this.$input.addEventListener("blur", v);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const e = (v, g, R, P, n) => (v - g) / (R - g) * (n - P) + P, r = (v) => {
      const g = this.$slider.getBoundingClientRect();
      let R = e(v, g.left, g.right, this._min, this._max);
      this._snapClampSetValue(R);
    }, t = (v) => {
      this._setDraggingStyle(!0), r(v.clientX), window.addEventListener("mousemove", s), window.addEventListener("mouseup", d);
    }, s = (v) => {
      r(v.clientX);
    }, d = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", s), window.removeEventListener("mouseup", d);
    };
    let f = !1, u, o;
    const a = (v) => {
      v.preventDefault(), this._setDraggingStyle(!0), r(v.touches[0].clientX), f = !1;
    }, c = (v) => {
      v.touches.length > 1 || (this._hasScrollBar ? (u = v.touches[0].clientX, o = v.touches[0].clientY, f = !0) : a(v), window.addEventListener("touchmove", m, { passive: !1 }), window.addEventListener("touchend", b));
    }, m = (v) => {
      if (f) {
        const g = v.touches[0].clientX - u, R = v.touches[0].clientY - o;
        Math.abs(g) > Math.abs(R) ? a(v) : (window.removeEventListener("touchmove", m), window.removeEventListener("touchend", b));
      } else
        v.preventDefault(), r(v.touches[0].clientX);
    }, b = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", m), window.removeEventListener("touchend", b);
    }, A = this._callOnFinishChange.bind(this), _ = 400;
    let E;
    const y = (v) => {
      if (Math.abs(v.deltaX) < Math.abs(v.deltaY) && this._hasScrollBar) return;
      v.preventDefault();
      const R = this._normalizeMouseWheel(v) * this._step;
      this._snapClampSetValue(this.getValue() + R), this.$input.value = this.getValue(), clearTimeout(E), E = setTimeout(A, _);
    };
    this.$slider.addEventListener("mousedown", t), this.$slider.addEventListener("touchstart", c, { passive: !1 }), this.$slider.addEventListener("wheel", y, { passive: !1 });
  }
  _setDraggingStyle(e, r = "horizontal") {
    this.$slider && this.$slider.classList.toggle("active", e), document.body.classList.toggle("lil-gui-dragging", e), document.body.classList.toggle(`lil-gui-${r}`, e);
  }
  _getImplicitStep() {
    return this._hasMin && this._hasMax ? (this._max - this._min) / 1e3 : 0.1;
  }
  _onUpdateMinMax() {
    !this._hasSlider && this._hasMin && this._hasMax && (this._stepExplicit || this.step(this._getImplicitStep(), !1), this._initSlider(), this.updateDisplay());
  }
  _normalizeMouseWheel(e) {
    let { deltaX: r, deltaY: t } = e;
    return Math.floor(e.deltaY) !== e.deltaY && e.wheelDelta && (r = 0, t = -e.wheelDelta / 120, t *= this._stepExplicit ? 1 : 10), r + -t;
  }
  _arrowKeyMultiplier(e) {
    let r = this._stepExplicit ? 1 : 10;
    return e.shiftKey ? r *= 10 : e.altKey && (r /= 10), r;
  }
  _snap(e) {
    let r = 0;
    return this._hasMin ? r = this._min : this._hasMax && (r = this._max), e -= r, e = Math.round(e / this._step) * this._step, e += r, e = parseFloat(e.toPrecision(15)), e;
  }
  _clamp(e) {
    return e < this._min && (e = this._min), e > this._max && (e = this._max), e;
  }
  _snapClampSetValue(e) {
    this.setValue(this._clamp(this._snap(e)));
  }
  get _hasScrollBar() {
    const e = this.parent.root.$children;
    return e.scrollHeight > e.clientHeight;
  }
  get _hasMin() {
    return this._min !== void 0;
  }
  get _hasMax() {
    return this._max !== void 0;
  }
}
class Dt extends H {
  constructor(e, r, t, s) {
    super(e, r, t, "option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$select.addEventListener("change", () => {
      this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
    }), this.$select.addEventListener("focus", () => {
      this.$display.classList.add("focus");
    }), this.$select.addEventListener("blur", () => {
      this.$display.classList.remove("focus");
    }), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(s);
  }
  options(e) {
    return this._values = Array.isArray(e) ? e : Object.values(e), this._names = Array.isArray(e) ? e : Object.keys(e), this.$select.replaceChildren(), this._names.forEach((r) => {
      const t = document.createElement("option");
      t.textContent = r, this.$select.appendChild(t);
    }), this.updateDisplay(), this;
  }
  updateDisplay() {
    const e = this.getValue(), r = this._values.indexOf(e);
    return this.$select.selectedIndex = r, this.$display.textContent = r === -1 ? e : this._names[r], this;
  }
}
class Lt extends H {
  constructor(e, r, t) {
    super(e, r, t, "string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
      this.setValue(this.$input.value);
    }), this.$input.addEventListener("keydown", (s) => {
      s.code === "Enter" && this.$input.blur();
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.value = this.getValue(), this;
  }
}
var Mt = `.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;
function It(i) {
  const e = document.createElement("style");
  e.innerHTML = i;
  const r = document.querySelector("head link[rel=stylesheet], head style");
  r ? document.head.insertBefore(e, r) : document.head.appendChild(e);
}
let Ye = !1;
class _e {
  /**
   * Creates a panel that holds controllers.
   * @example
   * new GUI();
   * new GUI( { container: document.getElementById( 'custom' ) } );
   *
   * @param {object} [options]
   * @param {boolean} [options.autoPlace=true]
   * Adds the GUI to `document.body` and fixes it to the top right of the page.
   *
   * @param {HTMLElement} [options.container]
   * Adds the GUI to this DOM element. Overrides `autoPlace`.
   *
   * @param {number} [options.width=245]
   * Width of the GUI in pixels, usually set when name labels become too long. Note that you can make
   * name labels wider in CSS with `.lil‑gui { ‑‑name‑width: 55% }`.
   *
   * @param {string} [options.title=Controls]
   * Name to display in the title bar.
   *
   * @param {boolean} [options.closeFolders=false]
   * Pass `true` to close all folders in this GUI by default.
   *
   * @param {boolean} [options.injectStyles=true]
   * Injects the default stylesheet into the page if this is the first GUI.
   * Pass `false` to use your own stylesheet.
   *
   * @param {number} [options.touchStyles=true]
   * Makes controllers larger on touch devices. Pass `false` to disable touch styles.
   *
   * @param {GUI} [options.parent]
   * Adds this GUI as a child in another GUI. Usually this is done for you by `addFolder()`.
   */
  constructor({
    parent: e,
    autoPlace: r = e === void 0,
    container: t,
    width: s,
    title: d = "Controls",
    closeFolders: f = !1,
    injectStyles: u = !0,
    touchStyles: o = !0
  } = {}) {
    if (this.parent = e, this.root = e ? e.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(d), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), o && this.domElement.classList.add("allow-touch-styles"), !Ye && u && (It(Mt), Ye = !0), t ? t.appendChild(this.domElement) : r && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), s && this.domElement.style.setProperty("--width", s + "px"), this._closeFolders = f;
  }
  /**
   * Adds a controller to the GUI, inferring controller type using the `typeof` operator.
   * @example
   * gui.add( object, 'property' );
   * gui.add( object, 'number', 0, 100, 1 );
   * gui.add( object, 'options', [ 1, 2, 3 ] );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number|object|Array} [$1] Minimum value for number controllers, or the set of
   * selectable values for a dropdown.
   * @param {number} [max] Maximum value for number controllers.
   * @param {number} [step] Step value for number controllers.
   * @returns {Controller}
   */
  add(e, r, t, s, d) {
    if (Object(t) === t)
      return new Dt(this, e, r, t);
    const f = e[r];
    switch (typeof f) {
      case "number":
        return new Pt(this, e, r, t, s, d);
      case "boolean":
        return new xt(this, e, r);
      case "string":
        return new Lt(this, e, r);
      case "function":
        return new ge(this, e, r);
    }
    console.error(`gui.add failed
	property:`, r, `
	object:`, e, `
	value:`, f);
  }
  /**
   * Adds a color controller to the GUI.
   * @example
   * params = {
   * 	cssColor: '#ff00ff',
   * 	rgbColor: { r: 0, g: 0.2, b: 0.4 },
   * 	customRange: [ 0, 127, 255 ],
   * };
   *
   * gui.addColor( params, 'cssColor' );
   * gui.addColor( params, 'rgbColor' );
   * gui.addColor( params, 'customRange', 255 );
   *
   * @param {object} object The object the controller will modify.
   * @param {string} property Name of the property to control.
   * @param {number} rgbScale Maximum value for a color channel when using an RGB color. You may
   * need to set this to 255 if your colors are too bright.
   * @returns {Controller}
   */
  addColor(e, r, t = 1) {
    return new Ot(this, e, r, t);
  }
  /**
   * Adds a folder to the GUI, which is just another GUI. This method returns
   * the nested GUI so you can add controllers to it.
   * @example
   * const folder = gui.addFolder( 'Position' );
   * folder.add( position, 'x' );
   * folder.add( position, 'y' );
   * folder.add( position, 'z' );
   *
   * @param {string} title Name to display in the folder's title bar.
   * @returns {GUI}
   */
  addFolder(e) {
    const r = new _e({ parent: this, title: e });
    return this.root._closeFolders && r.close(), r;
  }
  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(e, r = !0) {
    return e.controllers && this.controllers.forEach((t) => {
      t instanceof ge || t._name in e.controllers && t.load(e.controllers[t._name]);
    }), r && e.folders && this.folders.forEach((t) => {
      t._title in e.folders && t.load(e.folders[t._title]);
    }), this;
  }
  /**
   * Returns an object mapping controller names to values. The object can be passed to `gui.load()` to
   * recall these values.
   * @example
   * {
   * 	controllers: {
   * 		prop1: 1,
   * 		prop2: 'value',
   * 		...
   * 	},
   * 	folders: {
   * 		folderName1: { controllers, folders },
   * 		folderName2: { controllers, folders }
   * 		...
   * 	}
   * }
   *
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {object}
   */
  save(e = !0) {
    const r = {
      controllers: {},
      folders: {}
    };
    return this.controllers.forEach((t) => {
      if (!(t instanceof ge)) {
        if (t._name in r.controllers)
          throw new Error(`Cannot save GUI with duplicate property "${t._name}"`);
        r.controllers[t._name] = t.save();
      }
    }), e && this.folders.forEach((t) => {
      if (t._title in r.folders)
        throw new Error(`Cannot save GUI with duplicate folder "${t._title}"`);
      r.folders[t._title] = t.save();
    }), r;
  }
  /**
   * Opens a GUI or folder. GUI and folders are open by default.
   * @param {boolean} open Pass false to close.
   * @returns {this}
   * @example
   * gui.open(); // open
   * gui.open( false ); // close
   * gui.open( gui._closed ); // toggle
   */
  open(e = !0) {
    return this._setClosed(!e), this.$title.setAttribute("aria-expanded", !this._closed), this.domElement.classList.toggle("closed", this._closed), this;
  }
  /**
   * Closes the GUI.
   * @returns {this}
   */
  close() {
    return this.open(!1);
  }
  _setClosed(e) {
    this._closed !== e && (this._closed = e, this._callOnOpenClose(this));
  }
  /**
   * Shows the GUI after it's been hidden.
   * @param {boolean} show
   * @returns {this}
   * @example
   * gui.show();
   * gui.show( false ); // hide
   * gui.show( gui._hidden ); // toggle
   */
  show(e = !0) {
    return this._hidden = !e, this.domElement.style.display = this._hidden ? "none" : "", this;
  }
  /**
   * Hides the GUI.
   * @returns {this}
   */
  hide() {
    return this.show(!1);
  }
  openAnimated(e = !0) {
    return this._setClosed(!e), this.$title.setAttribute("aria-expanded", !this._closed), requestAnimationFrame(() => {
      const r = this.$children.clientHeight;
      this.$children.style.height = r + "px", this.domElement.classList.add("transition");
      const t = (d) => {
        d.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("transition"), this.$children.removeEventListener("transitionend", t));
      };
      this.$children.addEventListener("transitionend", t);
      const s = e ? this.$children.scrollHeight : 0;
      this.domElement.classList.toggle("closed", !e), requestAnimationFrame(() => {
        this.$children.style.height = s + "px";
      });
    }), this;
  }
  /**
   * Change the title of this GUI.
   * @param {string} title
   * @returns {this}
   */
  title(e) {
    return this._title = e, this.$title.textContent = e, this;
  }
  /**
   * Resets all controllers to their initial values.
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  reset(e = !0) {
    return (e ? this.controllersRecursive() : this.controllers).forEach((t) => t.reset()), this;
  }
  /**
   * Pass a function to be called whenever a controller in this GUI changes.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onChange(e) {
    return this._onChange = e, this;
  }
  _callOnChange(e) {
    this.parent && this.parent._callOnChange(e), this._onChange !== void 0 && this._onChange.call(this, {
      object: e.object,
      property: e.property,
      value: e.getValue(),
      controller: e
    });
  }
  /**
   * Pass a function to be called whenever a controller in this GUI has finished changing.
   * @param {function({object:object, property:string, value:any, controller:Controller})} callback
   * @returns {this}
   * @example
   * gui.onFinishChange( event => {
   * 	event.object     // object that was modified
   * 	event.property   // string, name of property
   * 	event.value      // new value of controller
   * 	event.controller // controller that was modified
   * } );
   */
  onFinishChange(e) {
    return this._onFinishChange = e, this;
  }
  _callOnFinishChange(e) {
    this.parent && this.parent._callOnFinishChange(e), this._onFinishChange !== void 0 && this._onFinishChange.call(this, {
      object: e.object,
      property: e.property,
      value: e.getValue(),
      controller: e
    });
  }
  /**
   * Pass a function to be called when this GUI or its descendants are opened or closed.
   * @param {function(GUI)} callback
   * @returns {this}
   * @example
   * gui.onOpenClose( changedGUI => {
   * 	console.log( changedGUI._closed );
   * } );
   */
  onOpenClose(e) {
    return this._onOpenClose = e, this;
  }
  _callOnOpenClose(e) {
    this.parent && this.parent._callOnOpenClose(e), this._onOpenClose !== void 0 && this._onOpenClose.call(this, e);
  }
  /**
   * Destroys all DOM elements and event listeners associated with this GUI.
   */
  destroy() {
    this.parent && (this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.folders.splice(this.parent.folders.indexOf(this), 1)), this.domElement.parentElement && this.domElement.parentElement.removeChild(this.domElement), Array.from(this.children).forEach((e) => e.destroy());
  }
  /**
   * Returns an array of controllers contained by this GUI and its descendents.
   * @returns {Controller[]}
   */
  controllersRecursive() {
    let e = Array.from(this.controllers);
    return this.folders.forEach((r) => {
      e = e.concat(r.controllersRecursive());
    }), e;
  }
  /**
   * Returns an array of folders contained by this GUI and its descendents.
   * @returns {GUI[]}
   */
  foldersRecursive() {
    let e = Array.from(this.folders);
    return this.folders.forEach((r) => {
      e = e.concat(r.foldersRecursive());
    }), e;
  }
}
const $t = function({
  app: e,
  onError: r
}) {
  const t = V(null), s = V(null), d = V(null), f = V(!1), u = V(null), [o, a] = ce(!0), c = V(void 0), m = V(null), b = ve(() => {
    const _ = s.current;
    if (_) {
      const E = window.devicePixelRatio;
      return _.width = Math.max(_.offsetWidth * E, 1), _.height = Math.max(_.offsetHeight * E, 1), clearTimeout(c.current), c.current = setTimeout(() => {
        try {
          if (_.width <= 1 || _.height <= 1) {
            f.current = !0, console.log("Hibernate");
            return;
          }
          f.current = !1, e.handleResize?.(_.width, _.height);
        } catch (y) {
          r(y);
        }
      }, 500), () => {
        clearTimeout(c.current);
      };
    }
  }, [e, r]);
  re(() => (b(), window.addEventListener("resize", b), () => {
    window.removeEventListener("resize", b);
  }), [b]);
  const A = ve(
    (_) => {
      const E = s.current?.getContext("webgpu");
      if (E) {
        const y = _ - (m.current ?? 0);
        m.current = _;
        const v = E.getCurrentTexture();
        try {
          f.current || e.draw(
            v,
            s.current.width / s.current.height,
            _,
            y
          );
        } catch (g) {
          r(g);
        }
        e.quit || (t.current = requestAnimationFrame(A));
      }
    },
    [e, r]
  );
  return re(() => {
    const _ = s.current?.getContext("webgpu");
    if (u.current && u.current?.destroy(), u.current = new _e({ container: d.current }), e.setLowPerformanceMode && u.current.add({ checked: !1 }, "checked").onChange((y) => {
      e.setLowPerformanceMode?.(y);
    }).name("Low Performance Mode"), e.setupUI) {
      u.current.onOpenClose((y) => {
        y == u.current && a(!y._closed);
      });
      try {
        e.setupUI(u.current);
      } catch (y) {
        r(y);
      }
    }
    if (!_) {
      console.error("'webgpu' canvas context not found, cannot animate.");
      return;
    }
    _.configure(e.presentationInterface()), t.current = requestAnimationFrame(A);
    const E = s.current;
    return E && e.handleResize?.(E.width, E.height), () => {
      t.current && cancelAnimationFrame(t.current);
    };
  }, [A, e, a, r]), re(() => {
    b();
  }, [b, o]), /* @__PURE__ */ L.jsxs(L.Fragment, { children: [
    /* @__PURE__ */ L.jsx("div", { className: "webgpu-samples-canvas-container", children: /* @__PURE__ */ L.jsx("canvas", { className: "webgpu-samples-canvas", ref: s }) }),
    /* @__PURE__ */ L.jsx(
      "div",
      {
        className: o ? void 0 : "webgpu-samples-gui-floating",
        ref: d
      }
    ),
    void 0
  ] });
}, Ut = function({
  sampleID: e,
  styleOverrides: r
}) {
  const [t, s] = ce(), d = V(null), f = V(void 0), [u, o] = ce(!1), a = ve(
    (A) => {
      console.error(A), A instanceof Error ? s([
        A.message,
        ...typeof A.cause == "string" ? [A.cause] : []
      ]) : s(["Failed to initialize app."]);
    },
    [s]
  ), c = et.get(e);
  re(() => {
    if (c === void 0) {
      s(["No such sample, please navigate to another page."]), o(!0);
      return;
    }
    if (!("gpu" in navigator)) {
      s([
        "WebGPU is not available in this browser.",
        "navigator.gpu is null"
      ]), o(!0);
      return;
    }
    o(!1), s(void 0);
    let A = !0;
    return f.current = wt({
      gpu: navigator.gpu,
      requiredLimits: c.requiredLimits,
      requiredFeatures: c.requiredFeatures,
      optionalFeatures: c.optionalFeatures,
      import: c.import,
      onUncapturedError: (_) => {
        console.error(`WebGPU device uncaptured error: ${_.error.message}`), s(["WebGPU has encountered an error, causing it to crash."]);
      }
    }).then((_) => {
      A && (d.current = _);
    }).catch((_) => {
      A && a(_);
    }).finally(() => {
      A && (f.current = void 0, o(!0));
    }), () => {
      A = !1, d.current?.destroy?.();
    };
  }, [c, a]);
  const m = /* @__PURE__ */ L.jsxs("div", { className: "webgpu-samples-info", children: [
    /* @__PURE__ */ L.jsx("p", { children: `Sorry, there was an issue, cause the sample to fail to load or crash.
            This app uses WebGPU, which can be unstable on some browsers.
            Try updating or using another browser.` }),
    /* @__PURE__ */ L.jsx("ol", { className: "webgpu-samples-error", children: t?.map((A) => /* @__PURE__ */ L.jsx("li", { children: A }, A)) })
  ] }), b = /* @__PURE__ */ L.jsx("div", { className: "webgpu-samples-info", children: /* @__PURE__ */ L.jsx("p", { children: "Loading..." }) });
  return navigator.gpu === void 0 ? /* @__PURE__ */ L.jsx("div", { className: "webgpu-samples-info", children: /* @__PURE__ */ L.jsx("p", { children: "Your browser does not support WebGPU. Please try another." }) }) : /* @__PURE__ */ L.jsx("div", { className: "webgpu-samples-app-loader", style: r, children: u ? /* @__PURE__ */ L.jsx(L.Fragment, { children: t !== void 0 ? m : /* @__PURE__ */ L.jsx($t, { app: d.current, onError: a }) }) : b });
};
export {
  Ut as A,
  Qe as D,
  Ht as E,
  yt as P,
  Ft as S,
  jt as a
};
