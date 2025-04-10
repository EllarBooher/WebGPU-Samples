import Se, { memo as Xr, useState as Ye, useEffect as je, useRef as he, useCallback as ut } from "react";
import { NavLink as pr, Link as Jr } from "react-router";
const Kr = (t, e, a) => {
  const r = t[e];
  return r ? typeof r == "function" ? r() : Promise.resolve(r) : new Promise((c, d) => {
    (typeof queueMicrotask == "function" ? queueMicrotask : setTimeout)(
      d.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + e + (e.split("/").length !== a ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
function vr(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var qe = { exports: {} }, Pe = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var kt;
function Zr() {
  if (kt) return Pe;
  kt = 1;
  var t = Se, e = Symbol.for("react.element"), a = Symbol.for("react.fragment"), r = Object.prototype.hasOwnProperty, c = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, d = { key: !0, ref: !0, __self: !0, __source: !0 };
  function p(u, o, s) {
    var l, h = {}, b = null, R = null;
    s !== void 0 && (b = "" + s), o.key !== void 0 && (b = "" + o.key), o.ref !== void 0 && (R = o.ref);
    for (l in o) r.call(o, l) && !d.hasOwnProperty(l) && (h[l] = o[l]);
    if (u && u.defaultProps) for (l in o = u.defaultProps, o) h[l] === void 0 && (h[l] = o[l]);
    return { $$typeof: e, type: u, key: b, ref: R, props: h, _owner: c.current };
  }
  return Pe.Fragment = a, Pe.jsx = p, Pe.jsxs = p, Pe;
}
var ke = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Dt;
function Qr() {
  return Dt || (Dt = 1, process.env.NODE_ENV !== "production" && function() {
    var t = Se, e = Symbol.for("react.element"), a = Symbol.for("react.portal"), r = Symbol.for("react.fragment"), c = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), p = Symbol.for("react.provider"), u = Symbol.for("react.context"), o = Symbol.for("react.forward_ref"), s = Symbol.for("react.suspense"), l = Symbol.for("react.suspense_list"), h = Symbol.for("react.memo"), b = Symbol.for("react.lazy"), R = Symbol.for("react.offscreen"), w = Symbol.iterator, _ = "@@iterator";
    function A(n) {
      if (n === null || typeof n != "object")
        return null;
      var m = w && n[w] || n[_];
      return typeof m == "function" ? m : null;
    }
    var g = t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function v(n) {
      {
        for (var m = arguments.length, C = new Array(m > 1 ? m - 1 : 0), P = 1; P < m; P++)
          C[P - 1] = arguments[P];
        S("error", n, C);
      }
    }
    function S(n, m, C) {
      {
        var P = g.ReactDebugCurrentFrame, Y = P.getStackAddendum();
        Y !== "" && (m += "%s", C = C.concat([Y]));
        var J = C.map(function(B) {
          return String(B);
        });
        J.unshift("Warning: " + m), Function.prototype.apply.call(console[n], console, J);
      }
    }
    var D = !1, i = !1, f = !1, y = !1, k = !1, F;
    F = Symbol.for("react.module.reference");
    function K(n) {
      return !!(typeof n == "string" || typeof n == "function" || n === r || n === d || k || n === c || n === s || n === l || y || n === R || D || i || f || typeof n == "object" && n !== null && (n.$$typeof === b || n.$$typeof === h || n.$$typeof === p || n.$$typeof === u || n.$$typeof === o || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      n.$$typeof === F || n.getModuleId !== void 0));
    }
    function re(n, m, C) {
      var P = n.displayName;
      if (P)
        return P;
      var Y = m.displayName || m.name || "";
      return Y !== "" ? C + "(" + Y + ")" : C;
    }
    function se(n) {
      return n.displayName || "Context";
    }
    function I(n) {
      if (n == null)
        return null;
      if (typeof n.tag == "number" && v("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof n == "function")
        return n.displayName || n.name || null;
      if (typeof n == "string")
        return n;
      switch (n) {
        case r:
          return "Fragment";
        case a:
          return "Portal";
        case d:
          return "Profiler";
        case c:
          return "StrictMode";
        case s:
          return "Suspense";
        case l:
          return "SuspenseList";
      }
      if (typeof n == "object")
        switch (n.$$typeof) {
          case u:
            var m = n;
            return se(m) + ".Consumer";
          case p:
            var C = n;
            return se(C._context) + ".Provider";
          case o:
            return re(n, n.render, "ForwardRef");
          case h:
            var P = n.displayName || null;
            return P !== null ? P : I(n.type) || "Memo";
          case b: {
            var Y = n, J = Y._payload, B = Y._init;
            try {
              return I(B(J));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var O = Object.assign, Z = 0, ne, de, ve, Ee, E, x, H;
    function N() {
    }
    N.__reactDisabledLog = !0;
    function $() {
      {
        if (Z === 0) {
          ne = console.log, de = console.info, ve = console.warn, Ee = console.error, E = console.group, x = console.groupCollapsed, H = console.groupEnd;
          var n = {
            configurable: !0,
            enumerable: !0,
            value: N,
            writable: !0
          };
          Object.defineProperties(console, {
            info: n,
            log: n,
            warn: n,
            error: n,
            group: n,
            groupCollapsed: n,
            groupEnd: n
          });
        }
        Z++;
      }
    }
    function z() {
      {
        if (Z--, Z === 0) {
          var n = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: O({}, n, {
              value: ne
            }),
            info: O({}, n, {
              value: de
            }),
            warn: O({}, n, {
              value: ve
            }),
            error: O({}, n, {
              value: Ee
            }),
            group: O({}, n, {
              value: E
            }),
            groupCollapsed: O({}, n, {
              value: x
            }),
            groupEnd: O({}, n, {
              value: H
            })
          });
        }
        Z < 0 && v("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var L = g.ReactCurrentDispatcher, j;
    function q(n, m, C) {
      {
        if (j === void 0)
          try {
            throw Error();
          } catch (Y) {
            var P = Y.stack.trim().match(/\n( *(at )?)/);
            j = P && P[1] || "";
          }
        return `
` + j + n;
      }
    }
    var G = !1, U;
    {
      var ie = typeof WeakMap == "function" ? WeakMap : Map;
      U = new ie();
    }
    function T(n, m) {
      if (!n || G)
        return "";
      {
        var C = U.get(n);
        if (C !== void 0)
          return C;
      }
      var P;
      G = !0;
      var Y = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var J;
      J = L.current, L.current = null, $();
      try {
        if (m) {
          var B = function() {
            throw Error();
          };
          if (Object.defineProperty(B.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(B, []);
            } catch (oe) {
              P = oe;
            }
            Reflect.construct(n, [], B);
          } else {
            try {
              B.call();
            } catch (oe) {
              P = oe;
            }
            n.call(B.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (oe) {
            P = oe;
          }
          n();
        }
      } catch (oe) {
        if (oe && P && typeof oe.stack == "string") {
          for (var V = oe.stack.split(`
`), ae = P.stack.split(`
`), Q = V.length - 1, ee = ae.length - 1; Q >= 1 && ee >= 0 && V[Q] !== ae[ee]; )
            ee--;
          for (; Q >= 1 && ee >= 0; Q--, ee--)
            if (V[Q] !== ae[ee]) {
              if (Q !== 1 || ee !== 1)
                do
                  if (Q--, ee--, ee < 0 || V[Q] !== ae[ee]) {
                    var ue = `
` + V[Q].replace(" at new ", " at ");
                    return n.displayName && ue.includes("<anonymous>") && (ue = ue.replace("<anonymous>", n.displayName)), typeof n == "function" && U.set(n, ue), ue;
                  }
                while (Q >= 1 && ee >= 0);
              break;
            }
        }
      } finally {
        G = !1, L.current = J, z(), Error.prepareStackTrace = Y;
      }
      var we = n ? n.displayName || n.name : "", ge = we ? q(we) : "";
      return typeof n == "function" && U.set(n, ge), ge;
    }
    function le(n, m, C) {
      return T(n, !1);
    }
    function _e(n) {
      var m = n.prototype;
      return !!(m && m.isReactComponent);
    }
    function me(n, m, C) {
      if (n == null)
        return "";
      if (typeof n == "function")
        return T(n, _e(n));
      if (typeof n == "string")
        return q(n);
      switch (n) {
        case s:
          return q("Suspense");
        case l:
          return q("SuspenseList");
      }
      if (typeof n == "object")
        switch (n.$$typeof) {
          case o:
            return le(n.render);
          case h:
            return me(n.type, m, C);
          case b: {
            var P = n, Y = P._payload, J = P._init;
            try {
              return me(J(Y), m, C);
            } catch {
            }
          }
        }
      return "";
    }
    var Oe = Object.prototype.hasOwnProperty, gt = {}, yt = g.ReactDebugCurrentFrame;
    function He(n) {
      if (n) {
        var m = n._owner, C = me(n.type, n._source, m ? m.type : null);
        yt.setExtraStackFrame(C);
      } else
        yt.setExtraStackFrame(null);
    }
    function xr(n, m, C, P, Y) {
      {
        var J = Function.call.bind(Oe);
        for (var B in n)
          if (J(n, B)) {
            var V = void 0;
            try {
              if (typeof n[B] != "function") {
                var ae = Error((P || "React class") + ": " + C + " type `" + B + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof n[B] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw ae.name = "Invariant Violation", ae;
              }
              V = n[B](m, B, P, C, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (Q) {
              V = Q;
            }
            V && !(V instanceof Error) && (He(Y), v("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", P || "React class", C, B, typeof V), He(null)), V instanceof Error && !(V.message in gt) && (gt[V.message] = !0, He(Y), v("Failed %s type: %s", C, V.message), He(null));
          }
      }
    }
    var Sr = Array.isArray;
    function We(n) {
      return Sr(n);
    }
    function Or(n) {
      {
        var m = typeof Symbol == "function" && Symbol.toStringTag, C = m && n[Symbol.toStringTag] || n.constructor.name || "Object";
        return C;
      }
    }
    function Pr(n) {
      try {
        return bt(n), !1;
      } catch {
        return !0;
      }
    }
    function bt(n) {
      return "" + n;
    }
    function Et(n) {
      if (Pr(n))
        return v("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Or(n)), bt(n);
    }
    var _t = g.ReactCurrentOwner, kr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, At, wt;
    function Dr(n) {
      if (Oe.call(n, "ref")) {
        var m = Object.getOwnPropertyDescriptor(n, "ref").get;
        if (m && m.isReactWarning)
          return !1;
      }
      return n.ref !== void 0;
    }
    function Ir(n) {
      if (Oe.call(n, "key")) {
        var m = Object.getOwnPropertyDescriptor(n, "key").get;
        if (m && m.isReactWarning)
          return !1;
      }
      return n.key !== void 0;
    }
    function $r(n, m) {
      typeof n.ref == "string" && _t.current;
    }
    function Lr(n, m) {
      {
        var C = function() {
          At || (At = !0, v("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", m));
        };
        C.isReactWarning = !0, Object.defineProperty(n, "key", {
          get: C,
          configurable: !0
        });
      }
    }
    function Mr(n, m) {
      {
        var C = function() {
          wt || (wt = !0, v("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", m));
        };
        C.isReactWarning = !0, Object.defineProperty(n, "ref", {
          get: C,
          configurable: !0
        });
      }
    }
    var jr = function(n, m, C, P, Y, J, B) {
      var V = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: e,
        // Built-in properties that belong on the element
        type: n,
        key: m,
        ref: C,
        props: B,
        // Record the component responsible for creating this element.
        _owner: J
      };
      return V._store = {}, Object.defineProperty(V._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(V, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: P
      }), Object.defineProperty(V, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Y
      }), Object.freeze && (Object.freeze(V.props), Object.freeze(V)), V;
    };
    function Fr(n, m, C, P, Y) {
      {
        var J, B = {}, V = null, ae = null;
        C !== void 0 && (Et(C), V = "" + C), Ir(m) && (Et(m.key), V = "" + m.key), Dr(m) && (ae = m.ref, $r(m, Y));
        for (J in m)
          Oe.call(m, J) && !kr.hasOwnProperty(J) && (B[J] = m[J]);
        if (n && n.defaultProps) {
          var Q = n.defaultProps;
          for (J in Q)
            B[J] === void 0 && (B[J] = Q[J]);
        }
        if (V || ae) {
          var ee = typeof n == "function" ? n.displayName || n.name || "Unknown" : n;
          V && Lr(B, ee), ae && Mr(B, ee);
        }
        return jr(n, V, ae, Y, P, _t.current, B);
      }
    }
    var Xe = g.ReactCurrentOwner, Tt = g.ReactDebugCurrentFrame;
    function Ae(n) {
      if (n) {
        var m = n._owner, C = me(n.type, n._source, m ? m.type : null);
        Tt.setExtraStackFrame(C);
      } else
        Tt.setExtraStackFrame(null);
    }
    var Je;
    Je = !1;
    function Ke(n) {
      return typeof n == "object" && n !== null && n.$$typeof === e;
    }
    function Ct() {
      {
        if (Xe.current) {
          var n = I(Xe.current.type);
          if (n)
            return `

Check the render method of \`` + n + "`.";
        }
        return "";
      }
    }
    function Nr(n) {
      return "";
    }
    var Rt = {};
    function Hr(n) {
      {
        var m = Ct();
        if (!m) {
          var C = typeof n == "string" ? n : n.displayName || n.name;
          C && (m = `

Check the top-level render call using <` + C + ">.");
        }
        return m;
      }
    }
    function xt(n, m) {
      {
        if (!n._store || n._store.validated || n.key != null)
          return;
        n._store.validated = !0;
        var C = Hr(m);
        if (Rt[C])
          return;
        Rt[C] = !0;
        var P = "";
        n && n._owner && n._owner !== Xe.current && (P = " It was passed a child from " + I(n._owner.type) + "."), Ae(n), v('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', C, P), Ae(null);
      }
    }
    function St(n, m) {
      {
        if (typeof n != "object")
          return;
        if (We(n))
          for (var C = 0; C < n.length; C++) {
            var P = n[C];
            Ke(P) && xt(P, m);
          }
        else if (Ke(n))
          n._store && (n._store.validated = !0);
        else if (n) {
          var Y = A(n);
          if (typeof Y == "function" && Y !== n.entries)
            for (var J = Y.call(n), B; !(B = J.next()).done; )
              Ke(B.value) && xt(B.value, m);
        }
      }
    }
    function qr(n) {
      {
        var m = n.type;
        if (m == null || typeof m == "string")
          return;
        var C;
        if (typeof m == "function")
          C = m.propTypes;
        else if (typeof m == "object" && (m.$$typeof === o || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        m.$$typeof === h))
          C = m.propTypes;
        else
          return;
        if (C) {
          var P = I(m);
          xr(C, n.props, "prop", P, n);
        } else if (m.PropTypes !== void 0 && !Je) {
          Je = !0;
          var Y = I(m);
          v("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Y || "Unknown");
        }
        typeof m.getDefaultProps == "function" && !m.getDefaultProps.isReactClassApproved && v("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Ur(n) {
      {
        for (var m = Object.keys(n.props), C = 0; C < m.length; C++) {
          var P = m[C];
          if (P !== "children" && P !== "key") {
            Ae(n), v("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", P), Ae(null);
            break;
          }
        }
        n.ref !== null && (Ae(n), v("Invalid attribute `ref` supplied to `React.Fragment`."), Ae(null));
      }
    }
    var Ot = {};
    function Pt(n, m, C, P, Y, J) {
      {
        var B = K(n);
        if (!B) {
          var V = "";
          (n === void 0 || typeof n == "object" && n !== null && Object.keys(n).length === 0) && (V += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var ae = Nr();
          ae ? V += ae : V += Ct();
          var Q;
          n === null ? Q = "null" : We(n) ? Q = "array" : n !== void 0 && n.$$typeof === e ? (Q = "<" + (I(n.type) || "Unknown") + " />", V = " Did you accidentally export a JSX literal instead of a component?") : Q = typeof n, v("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", Q, V);
        }
        var ee = Fr(n, m, C, Y, J);
        if (ee == null)
          return ee;
        if (B) {
          var ue = m.children;
          if (ue !== void 0)
            if (P)
              if (We(ue)) {
                for (var we = 0; we < ue.length; we++)
                  St(ue[we], n);
                Object.freeze && Object.freeze(ue);
              } else
                v("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              St(ue, n);
        }
        if (Oe.call(m, "key")) {
          var ge = I(n), oe = Object.keys(m).filter(function(Wr) {
            return Wr !== "key";
          }), Ze = oe.length > 0 ? "{key: someKey, " + oe.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Ot[ge + Ze]) {
            var Yr = oe.length > 0 ? "{" + oe.join(": ..., ") + ": ...}" : "{}";
            v(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, Ze, ge, Yr, ge), Ot[ge + Ze] = !0;
          }
        }
        return n === r ? Ur(ee) : qr(ee), ee;
      }
    }
    function Vr(n, m, C) {
      return Pt(n, m, C, !0);
    }
    function zr(n, m, C) {
      return Pt(n, m, C, !1);
    }
    var Br = zr, Gr = Vr;
    ke.Fragment = r, ke.jsx = Br, ke.jsxs = Gr;
  }()), ke;
}
var It;
function ei() {
  return It || (It = 1, process.env.NODE_ENV === "production" ? qe.exports = Zr() : qe.exports = Qr()), qe.exports;
}
var te = ei(), De = {}, Te = {}, Ue = {}, ye = {}, be = {}, Qe = {}, $t;
function mr() {
  return $t || ($t = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.Doctype = t.CDATA = t.Tag = t.Style = t.Script = t.Comment = t.Directive = t.Text = t.Root = t.isTag = t.ElementType = void 0;
    var e;
    (function(r) {
      r.Root = "root", r.Text = "text", r.Directive = "directive", r.Comment = "comment", r.Script = "script", r.Style = "style", r.Tag = "tag", r.CDATA = "cdata", r.Doctype = "doctype";
    })(e = t.ElementType || (t.ElementType = {}));
    function a(r) {
      return r.type === e.Tag || r.type === e.Script || r.type === e.Style;
    }
    t.isTag = a, t.Root = e.Root, t.Text = e.Text, t.Directive = e.Directive, t.Comment = e.Comment, t.Script = e.Script, t.Style = e.Style, t.Tag = e.Tag, t.CDATA = e.CDATA, t.Doctype = e.Doctype;
  }(Qe)), Qe;
}
var M = {}, Lt;
function Mt() {
  if (Lt) return M;
  Lt = 1;
  var t = M && M.__extends || /* @__PURE__ */ function() {
    var i = function(f, y) {
      return i = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(k, F) {
        k.__proto__ = F;
      } || function(k, F) {
        for (var K in F) Object.prototype.hasOwnProperty.call(F, K) && (k[K] = F[K]);
      }, i(f, y);
    };
    return function(f, y) {
      if (typeof y != "function" && y !== null)
        throw new TypeError("Class extends value " + String(y) + " is not a constructor or null");
      i(f, y);
      function k() {
        this.constructor = f;
      }
      f.prototype = y === null ? Object.create(y) : (k.prototype = y.prototype, new k());
    };
  }(), e = M && M.__assign || function() {
    return e = Object.assign || function(i) {
      for (var f, y = 1, k = arguments.length; y < k; y++) {
        f = arguments[y];
        for (var F in f) Object.prototype.hasOwnProperty.call(f, F) && (i[F] = f[F]);
      }
      return i;
    }, e.apply(this, arguments);
  };
  Object.defineProperty(M, "__esModule", { value: !0 }), M.cloneNode = M.hasChildren = M.isDocument = M.isDirective = M.isComment = M.isText = M.isCDATA = M.isTag = M.Element = M.Document = M.CDATA = M.NodeWithChildren = M.ProcessingInstruction = M.Comment = M.Text = M.DataNode = M.Node = void 0;
  var a = /* @__PURE__ */ mr(), r = (
    /** @class */
    function() {
      function i() {
        this.parent = null, this.prev = null, this.next = null, this.startIndex = null, this.endIndex = null;
      }
      return Object.defineProperty(i.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.parent;
        },
        set: function(f) {
          this.parent = f;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(i.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.prev;
        },
        set: function(f) {
          this.prev = f;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(i.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.next;
        },
        set: function(f) {
          this.next = f;
        },
        enumerable: !1,
        configurable: !0
      }), i.prototype.cloneNode = function(f) {
        return f === void 0 && (f = !1), S(this, f);
      }, i;
    }()
  );
  M.Node = r;
  var c = (
    /** @class */
    function(i) {
      t(f, i);
      function f(y) {
        var k = i.call(this) || this;
        return k.data = y, k;
      }
      return Object.defineProperty(f.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.data;
        },
        set: function(y) {
          this.data = y;
        },
        enumerable: !1,
        configurable: !0
      }), f;
    }(r)
  );
  M.DataNode = c;
  var d = (
    /** @class */
    function(i) {
      t(f, i);
      function f() {
        var y = i !== null && i.apply(this, arguments) || this;
        return y.type = a.ElementType.Text, y;
      }
      return Object.defineProperty(f.prototype, "nodeType", {
        get: function() {
          return 3;
        },
        enumerable: !1,
        configurable: !0
      }), f;
    }(c)
  );
  M.Text = d;
  var p = (
    /** @class */
    function(i) {
      t(f, i);
      function f() {
        var y = i !== null && i.apply(this, arguments) || this;
        return y.type = a.ElementType.Comment, y;
      }
      return Object.defineProperty(f.prototype, "nodeType", {
        get: function() {
          return 8;
        },
        enumerable: !1,
        configurable: !0
      }), f;
    }(c)
  );
  M.Comment = p;
  var u = (
    /** @class */
    function(i) {
      t(f, i);
      function f(y, k) {
        var F = i.call(this, k) || this;
        return F.name = y, F.type = a.ElementType.Directive, F;
      }
      return Object.defineProperty(f.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: !1,
        configurable: !0
      }), f;
    }(c)
  );
  M.ProcessingInstruction = u;
  var o = (
    /** @class */
    function(i) {
      t(f, i);
      function f(y) {
        var k = i.call(this) || this;
        return k.children = y, k;
      }
      return Object.defineProperty(f.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function() {
          var y;
          return (y = this.children[0]) !== null && y !== void 0 ? y : null;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(f.prototype, "lastChild", {
        /** Last child of the node. */
        get: function() {
          return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(f.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.children;
        },
        set: function(y) {
          this.children = y;
        },
        enumerable: !1,
        configurable: !0
      }), f;
    }(r)
  );
  M.NodeWithChildren = o;
  var s = (
    /** @class */
    function(i) {
      t(f, i);
      function f() {
        var y = i !== null && i.apply(this, arguments) || this;
        return y.type = a.ElementType.CDATA, y;
      }
      return Object.defineProperty(f.prototype, "nodeType", {
        get: function() {
          return 4;
        },
        enumerable: !1,
        configurable: !0
      }), f;
    }(o)
  );
  M.CDATA = s;
  var l = (
    /** @class */
    function(i) {
      t(f, i);
      function f() {
        var y = i !== null && i.apply(this, arguments) || this;
        return y.type = a.ElementType.Root, y;
      }
      return Object.defineProperty(f.prototype, "nodeType", {
        get: function() {
          return 9;
        },
        enumerable: !1,
        configurable: !0
      }), f;
    }(o)
  );
  M.Document = l;
  var h = (
    /** @class */
    function(i) {
      t(f, i);
      function f(y, k, F, K) {
        F === void 0 && (F = []), K === void 0 && (K = y === "script" ? a.ElementType.Script : y === "style" ? a.ElementType.Style : a.ElementType.Tag);
        var re = i.call(this, F) || this;
        return re.name = y, re.attribs = k, re.type = K, re;
      }
      return Object.defineProperty(f.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(f.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.name;
        },
        set: function(y) {
          this.name = y;
        },
        enumerable: !1,
        configurable: !0
      }), Object.defineProperty(f.prototype, "attributes", {
        get: function() {
          var y = this;
          return Object.keys(this.attribs).map(function(k) {
            var F, K;
            return {
              name: k,
              value: y.attribs[k],
              namespace: (F = y["x-attribsNamespace"]) === null || F === void 0 ? void 0 : F[k],
              prefix: (K = y["x-attribsPrefix"]) === null || K === void 0 ? void 0 : K[k]
            };
          });
        },
        enumerable: !1,
        configurable: !0
      }), f;
    }(o)
  );
  M.Element = h;
  function b(i) {
    return (0, a.isTag)(i);
  }
  M.isTag = b;
  function R(i) {
    return i.type === a.ElementType.CDATA;
  }
  M.isCDATA = R;
  function w(i) {
    return i.type === a.ElementType.Text;
  }
  M.isText = w;
  function _(i) {
    return i.type === a.ElementType.Comment;
  }
  M.isComment = _;
  function A(i) {
    return i.type === a.ElementType.Directive;
  }
  M.isDirective = A;
  function g(i) {
    return i.type === a.ElementType.Root;
  }
  M.isDocument = g;
  function v(i) {
    return Object.prototype.hasOwnProperty.call(i, "children");
  }
  M.hasChildren = v;
  function S(i, f) {
    f === void 0 && (f = !1);
    var y;
    if (w(i))
      y = new d(i.data);
    else if (_(i))
      y = new p(i.data);
    else if (b(i)) {
      var k = f ? D(i.children) : [], F = new h(i.name, e({}, i.attribs), k);
      k.forEach(function(I) {
        return I.parent = F;
      }), i.namespace != null && (F.namespace = i.namespace), i["x-attribsNamespace"] && (F["x-attribsNamespace"] = e({}, i["x-attribsNamespace"])), i["x-attribsPrefix"] && (F["x-attribsPrefix"] = e({}, i["x-attribsPrefix"])), y = F;
    } else if (R(i)) {
      var k = f ? D(i.children) : [], K = new s(k);
      k.forEach(function(O) {
        return O.parent = K;
      }), y = K;
    } else if (g(i)) {
      var k = f ? D(i.children) : [], re = new l(k);
      k.forEach(function(O) {
        return O.parent = re;
      }), i["x-mode"] && (re["x-mode"] = i["x-mode"]), y = re;
    } else if (A(i)) {
      var se = new u(i.name, i.data);
      i["x-name"] != null && (se["x-name"] = i["x-name"], se["x-publicId"] = i["x-publicId"], se["x-systemId"] = i["x-systemId"]), y = se;
    } else
      throw new Error("Not implemented yet: ".concat(i.type));
    return y.startIndex = i.startIndex, y.endIndex = i.endIndex, i.sourceCodeLocation != null && (y.sourceCodeLocation = i.sourceCodeLocation), y;
  }
  M.cloneNode = S;
  function D(i) {
    for (var f = i.map(function(k) {
      return S(k, !0);
    }), y = 1; y < f.length; y++)
      f[y].prev = f[y - 1], f[y - 1].next = f[y];
    return f;
  }
  return M;
}
var jt;
function gr() {
  return jt || (jt = 1, function(t) {
    var e = be && be.__createBinding || (Object.create ? function(u, o, s, l) {
      l === void 0 && (l = s);
      var h = Object.getOwnPropertyDescriptor(o, s);
      (!h || ("get" in h ? !o.__esModule : h.writable || h.configurable)) && (h = { enumerable: !0, get: function() {
        return o[s];
      } }), Object.defineProperty(u, l, h);
    } : function(u, o, s, l) {
      l === void 0 && (l = s), u[l] = o[s];
    }), a = be && be.__exportStar || function(u, o) {
      for (var s in u) s !== "default" && !Object.prototype.hasOwnProperty.call(o, s) && e(o, u, s);
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.DomHandler = void 0;
    var r = /* @__PURE__ */ mr(), c = /* @__PURE__ */ Mt();
    a(/* @__PURE__ */ Mt(), t);
    var d = {
      withStartIndices: !1,
      withEndIndices: !1,
      xmlMode: !1
    }, p = (
      /** @class */
      function() {
        function u(o, s, l) {
          this.dom = [], this.root = new c.Document(this.dom), this.done = !1, this.tagStack = [this.root], this.lastNode = null, this.parser = null, typeof s == "function" && (l = s, s = d), typeof o == "object" && (s = o, o = void 0), this.callback = o ?? null, this.options = s ?? d, this.elementCB = l ?? null;
        }
        return u.prototype.onparserinit = function(o) {
          this.parser = o;
        }, u.prototype.onreset = function() {
          this.dom = [], this.root = new c.Document(this.dom), this.done = !1, this.tagStack = [this.root], this.lastNode = null, this.parser = null;
        }, u.prototype.onend = function() {
          this.done || (this.done = !0, this.parser = null, this.handleCallback(null));
        }, u.prototype.onerror = function(o) {
          this.handleCallback(o);
        }, u.prototype.onclosetag = function() {
          this.lastNode = null;
          var o = this.tagStack.pop();
          this.options.withEndIndices && (o.endIndex = this.parser.endIndex), this.elementCB && this.elementCB(o);
        }, u.prototype.onopentag = function(o, s) {
          var l = this.options.xmlMode ? r.ElementType.Tag : void 0, h = new c.Element(o, s, void 0, l);
          this.addNode(h), this.tagStack.push(h);
        }, u.prototype.ontext = function(o) {
          var s = this.lastNode;
          if (s && s.type === r.ElementType.Text)
            s.data += o, this.options.withEndIndices && (s.endIndex = this.parser.endIndex);
          else {
            var l = new c.Text(o);
            this.addNode(l), this.lastNode = l;
          }
        }, u.prototype.oncomment = function(o) {
          if (this.lastNode && this.lastNode.type === r.ElementType.Comment) {
            this.lastNode.data += o;
            return;
          }
          var s = new c.Comment(o);
          this.addNode(s), this.lastNode = s;
        }, u.prototype.oncommentend = function() {
          this.lastNode = null;
        }, u.prototype.oncdatastart = function() {
          var o = new c.Text(""), s = new c.CDATA([o]);
          this.addNode(s), o.parent = s, this.lastNode = o;
        }, u.prototype.oncdataend = function() {
          this.lastNode = null;
        }, u.prototype.onprocessinginstruction = function(o, s) {
          var l = new c.ProcessingInstruction(o, s);
          this.addNode(l);
        }, u.prototype.handleCallback = function(o) {
          if (typeof this.callback == "function")
            this.callback(o, this.dom);
          else if (o)
            throw o;
        }, u.prototype.addNode = function(o) {
          var s = this.tagStack[this.tagStack.length - 1], l = s.children[s.children.length - 1];
          this.options.withStartIndices && (o.startIndex = this.parser.startIndex), this.options.withEndIndices && (o.endIndex = this.parser.endIndex), s.children.push(o), l && (o.prev = l, l.next = o), o.parent = s, this.lastNode = null;
        }, u;
      }()
    );
    t.DomHandler = p, t.default = p;
  }(be)), be;
}
var et = {}, Ft;
function ti() {
  return Ft || (Ft = 1, function(t) {
    Object.defineProperty(t, "__esModule", { value: !0 }), t.CARRIAGE_RETURN_PLACEHOLDER_REGEX = t.CARRIAGE_RETURN_PLACEHOLDER = t.CARRIAGE_RETURN_REGEX = t.CARRIAGE_RETURN = t.CASE_SENSITIVE_TAG_NAMES_MAP = t.CASE_SENSITIVE_TAG_NAMES = void 0, t.CASE_SENSITIVE_TAG_NAMES = [
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
    ], t.CASE_SENSITIVE_TAG_NAMES_MAP = t.CASE_SENSITIVE_TAG_NAMES.reduce(function(e, a) {
      return e[a.toLowerCase()] = a, e;
    }, {}), t.CARRIAGE_RETURN = "\r", t.CARRIAGE_RETURN_REGEX = new RegExp(t.CARRIAGE_RETURN, "g"), t.CARRIAGE_RETURN_PLACEHOLDER = "__HTML_DOM_PARSER_CARRIAGE_RETURN_PLACEHOLDER_".concat(Date.now(), "__"), t.CARRIAGE_RETURN_PLACEHOLDER_REGEX = new RegExp(t.CARRIAGE_RETURN_PLACEHOLDER, "g");
  }(et)), et;
}
var Nt;
function yr() {
  if (Nt) return ye;
  Nt = 1, Object.defineProperty(ye, "__esModule", { value: !0 }), ye.formatAttributes = r, ye.escapeSpecialCharacters = d, ye.revertEscapedCharacters = p, ye.formatDOM = u;
  var t = /* @__PURE__ */ gr(), e = ti();
  function a(o) {
    return e.CASE_SENSITIVE_TAG_NAMES_MAP[o];
  }
  function r(o) {
    for (var s = {}, l = 0, h = o.length; l < h; l++) {
      var b = o[l];
      s[b.name] = b.value;
    }
    return s;
  }
  function c(o) {
    o = o.toLowerCase();
    var s = a(o);
    return s || o;
  }
  function d(o) {
    return o.replace(e.CARRIAGE_RETURN_REGEX, e.CARRIAGE_RETURN_PLACEHOLDER);
  }
  function p(o) {
    return o.replace(e.CARRIAGE_RETURN_PLACEHOLDER_REGEX, e.CARRIAGE_RETURN);
  }
  function u(o, s, l) {
    s === void 0 && (s = null);
    for (var h = [], b, R = 0, w = o.length; R < w; R++) {
      var _ = o[R];
      switch (_.nodeType) {
        case 1: {
          var A = c(_.nodeName);
          b = new t.Element(A, r(_.attributes)), b.children = u(
            // template children are on content
            A === "template" ? _.content.childNodes : _.childNodes,
            b
          );
          break;
        }
        case 3:
          b = new t.Text(p(_.nodeValue));
          break;
        case 8:
          b = new t.Comment(_.nodeValue);
          break;
        default:
          continue;
      }
      var g = h[R - 1] || null;
      g && (g.next = b), b.parent = s, b.prev = g, b.next = null, h.push(b);
    }
    return l && (b = new t.ProcessingInstruction(l.substring(0, l.indexOf(" ")).toLowerCase(), l), b.next = h[0] || null, b.parent = s, h.unshift(b), h[1] && (h[1].prev = h[0])), h;
  }
  return ye;
}
var Ht;
function ri() {
  if (Ht) return Ue;
  Ht = 1, Object.defineProperty(Ue, "__esModule", { value: !0 }), Ue.default = _;
  var t = yr(), e = "html", a = "head", r = "body", c = /<([a-zA-Z]+[0-9]?)/, d = /<head[^]*>/i, p = /<body[^]*>/i, u = function(A, g) {
    throw new Error("This browser does not support `document.implementation.createHTMLDocument`");
  }, o = function(A, g) {
    throw new Error("This browser does not support `DOMParser.prototype.parseFromString`");
  }, s = typeof window == "object" && window.DOMParser;
  if (typeof s == "function") {
    var l = new s(), h = "text/html";
    o = function(A, g) {
      return g && (A = "<".concat(g, ">").concat(A, "</").concat(g, ">")), l.parseFromString(A, h);
    }, u = o;
  }
  if (typeof document == "object" && document.implementation) {
    var b = document.implementation.createHTMLDocument();
    u = function(A, g) {
      if (g) {
        var v = b.documentElement.querySelector(g);
        return v && (v.innerHTML = A), b;
      }
      return b.documentElement.innerHTML = A, b;
    };
  }
  var R = typeof document == "object" && document.createElement("template"), w;
  R && R.content && (w = function(A) {
    return R.innerHTML = A, R.content.childNodes;
  });
  function _(A) {
    var g, v;
    A = (0, t.escapeSpecialCharacters)(A);
    var S = A.match(c), D = S && S[1] ? S[1].toLowerCase() : "";
    switch (D) {
      case e: {
        var i = o(A);
        if (!d.test(A)) {
          var f = i.querySelector(a);
          (g = f == null ? void 0 : f.parentNode) === null || g === void 0 || g.removeChild(f);
        }
        if (!p.test(A)) {
          var f = i.querySelector(r);
          (v = f == null ? void 0 : f.parentNode) === null || v === void 0 || v.removeChild(f);
        }
        return i.querySelectorAll(e);
      }
      case a:
      case r: {
        var y = u(A).querySelectorAll(D);
        return p.test(A) && d.test(A) ? y[0].parentNode.childNodes : y;
      }
      // low-level tag or text
      default: {
        if (w)
          return w(A);
        var f = u(A, r).querySelector(r);
        return f.childNodes;
      }
    }
  }
  return Ue;
}
var qt;
function ii() {
  if (qt) return Te;
  qt = 1;
  var t = Te && Te.__importDefault || function(d) {
    return d && d.__esModule ? d : { default: d };
  };
  Object.defineProperty(Te, "__esModule", { value: !0 }), Te.default = c;
  var e = t(ri()), a = yr(), r = /<(![a-zA-Z\s]+)>/;
  function c(d) {
    if (typeof d != "string")
      throw new TypeError("First argument must be a string");
    if (!d)
      return [];
    var p = d.match(r), u = p ? p[1] : void 0;
    return (0, a.formatDOM)((0, e.default)(d), null, u);
  }
  return Te;
}
var Ve = {}, ce = {}, Ie = {}, Ut;
function ni() {
  if (Ut) return Ie;
  Ut = 1;
  var t = 0;
  Ie.SAME = t;
  var e = 1;
  return Ie.CAMELCASE = e, Ie.possibleStandardNames = {
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
  }, Ie;
}
var Vt;
function ai() {
  if (Vt) return ce;
  Vt = 1;
  const t = 0, e = 1, a = 2, r = 3, c = 4, d = 5, p = 6;
  function u(i) {
    return s.hasOwnProperty(i) ? s[i] : null;
  }
  function o(i, f, y, k, F, K, re) {
    this.acceptsBooleans = f === a || f === r || f === c, this.attributeName = k, this.attributeNamespace = F, this.mustUseProperty = y, this.propertyName = i, this.type = f, this.sanitizeURL = K, this.removeEmptyString = re;
  }
  const s = {};
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
  ].forEach((i) => {
    s[i] = new o(
      i,
      t,
      !1,
      // mustUseProperty
      i,
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
  ].forEach(([i, f]) => {
    s[i] = new o(
      i,
      e,
      !1,
      // mustUseProperty
      f,
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach((i) => {
    s[i] = new o(
      i,
      a,
      !1,
      // mustUseProperty
      i.toLowerCase(),
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
  ].forEach((i) => {
    s[i] = new o(
      i,
      a,
      !1,
      // mustUseProperty
      i,
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
  ].forEach((i) => {
    s[i] = new o(
      i,
      r,
      !1,
      // mustUseProperty
      i.toLowerCase(),
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
  ].forEach((i) => {
    s[i] = new o(
      i,
      r,
      !0,
      // mustUseProperty
      i,
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
  ].forEach((i) => {
    s[i] = new o(
      i,
      c,
      !1,
      // mustUseProperty
      i,
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
  ].forEach((i) => {
    s[i] = new o(
      i,
      p,
      !1,
      // mustUseProperty
      i,
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), ["rowSpan", "start"].forEach((i) => {
    s[i] = new o(
      i,
      d,
      !1,
      // mustUseProperty
      i.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  });
  const h = /[\-\:]([a-z])/g, b = (i) => i[1].toUpperCase();
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
  ].forEach((i) => {
    const f = i.replace(h, b);
    s[f] = new o(
      f,
      e,
      !1,
      // mustUseProperty
      i,
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
  ].forEach((i) => {
    const f = i.replace(h, b);
    s[f] = new o(
      f,
      e,
      !1,
      // mustUseProperty
      i,
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
  ].forEach((i) => {
    const f = i.replace(h, b);
    s[f] = new o(
      f,
      e,
      !1,
      // mustUseProperty
      i,
      "http://www.w3.org/XML/1998/namespace",
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  }), ["tabIndex", "crossOrigin"].forEach((i) => {
    s[i] = new o(
      i,
      e,
      !1,
      // mustUseProperty
      i.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      !1,
      // sanitizeURL
      !1
      // removeEmptyString
    );
  });
  const R = "xlinkHref";
  s[R] = new o(
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
  ), ["src", "href", "action", "formAction"].forEach((i) => {
    s[i] = new o(
      i,
      e,
      !1,
      // mustUseProperty
      i.toLowerCase(),
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
    CAMELCASE: w,
    SAME: _,
    possibleStandardNames: A
  } = ni(), v = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD" + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", S = RegExp.prototype.test.bind(
    // eslint-disable-next-line no-misleading-character-class
    new RegExp("^(data|aria)-[" + v + "]*$")
  ), D = Object.keys(
    A
  ).reduce((i, f) => {
    const y = A[f];
    return y === _ ? i[f] = f : y === w ? i[f.toLowerCase()] = f : i[f] = y, i;
  }, {});
  return ce.BOOLEAN = r, ce.BOOLEANISH_STRING = a, ce.NUMERIC = d, ce.OVERLOADED_BOOLEAN = c, ce.POSITIVE_NUMERIC = p, ce.RESERVED = t, ce.STRING = e, ce.getPropertyInfo = u, ce.isCustomAttribute = S, ce.possibleStandardNames = D, ce;
}
var $e = {}, Ce = {}, tt, zt;
function oi() {
  if (zt) return tt;
  zt = 1;
  var t = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g, e = /\n/g, a = /^\s*/, r = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/, c = /^:\s*/, d = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/, p = /^[;\s]*/, u = /^\s+|\s+$/g, o = `
`, s = "/", l = "*", h = "", b = "comment", R = "declaration";
  tt = function(_, A) {
    if (typeof _ != "string")
      throw new TypeError("First argument must be a string");
    if (!_) return [];
    A = A || {};
    var g = 1, v = 1;
    function S(I) {
      var O = I.match(e);
      O && (g += O.length);
      var Z = I.lastIndexOf(o);
      v = ~Z ? I.length - Z : v + I.length;
    }
    function D() {
      var I = { line: g, column: v };
      return function(O) {
        return O.position = new i(I), k(), O;
      };
    }
    function i(I) {
      this.start = I, this.end = { line: g, column: v }, this.source = A.source;
    }
    i.prototype.content = _;
    function f(I) {
      var O = new Error(
        A.source + ":" + g + ":" + v + ": " + I
      );
      if (O.reason = I, O.filename = A.source, O.line = g, O.column = v, O.source = _, !A.silent) throw O;
    }
    function y(I) {
      var O = I.exec(_);
      if (O) {
        var Z = O[0];
        return S(Z), _ = _.slice(Z.length), O;
      }
    }
    function k() {
      y(a);
    }
    function F(I) {
      var O;
      for (I = I || []; O = K(); )
        O !== !1 && I.push(O);
      return I;
    }
    function K() {
      var I = D();
      if (!(s != _.charAt(0) || l != _.charAt(1))) {
        for (var O = 2; h != _.charAt(O) && (l != _.charAt(O) || s != _.charAt(O + 1)); )
          ++O;
        if (O += 2, h === _.charAt(O - 1))
          return f("End of comment missing");
        var Z = _.slice(2, O - 2);
        return v += 2, S(Z), _ = _.slice(O), v += 2, I({
          type: b,
          comment: Z
        });
      }
    }
    function re() {
      var I = D(), O = y(r);
      if (O) {
        if (K(), !y(c)) return f("property missing ':'");
        var Z = y(d), ne = I({
          type: R,
          property: w(O[0].replace(t, h)),
          value: Z ? w(Z[0].replace(t, h)) : h
        });
        return y(p), ne;
      }
    }
    function se() {
      var I = [];
      F(I);
      for (var O; O = re(); )
        O !== !1 && (I.push(O), F(I));
      return I;
    }
    return k(), se();
  };
  function w(_) {
    return _ ? _.replace(u, h) : h;
  }
  return tt;
}
var Bt;
function si() {
  if (Bt) return Ce;
  Bt = 1;
  var t = Ce && Ce.__importDefault || function(r) {
    return r && r.__esModule ? r : { default: r };
  };
  Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.default = a;
  var e = t(oi());
  function a(r, c) {
    var d = null;
    if (!r || typeof r != "string")
      return d;
    var p = (0, e.default)(r), u = typeof c == "function";
    return p.forEach(function(o) {
      if (o.type === "declaration") {
        var s = o.property, l = o.value;
        u ? c(s, l, o) : l && (d = d || {}, d[s] = l);
      }
    }), d;
  }
  return Ce;
}
var Le = {}, Gt;
function li() {
  if (Gt) return Le;
  Gt = 1, Object.defineProperty(Le, "__esModule", { value: !0 }), Le.camelCase = void 0;
  var t = /^--[a-zA-Z0-9_-]+$/, e = /-([a-z])/g, a = /^[^-]+$/, r = /^-(webkit|moz|ms|o|khtml)-/, c = /^-(ms)-/, d = function(s) {
    return !s || a.test(s) || t.test(s);
  }, p = function(s, l) {
    return l.toUpperCase();
  }, u = function(s, l) {
    return "".concat(l, "-");
  }, o = function(s, l) {
    return l === void 0 && (l = {}), d(s) ? s : (s = s.toLowerCase(), l.reactCompat ? s = s.replace(c, u) : s = s.replace(r, u), s.replace(e, p));
  };
  return Le.camelCase = o, Le;
}
var Me, Yt;
function ui() {
  if (Yt) return Me;
  Yt = 1;
  var t = Me && Me.__importDefault || function(c) {
    return c && c.__esModule ? c : { default: c };
  }, e = t(si()), a = li();
  function r(c, d) {
    var p = {};
    return !c || typeof c != "string" || (0, e.default)(c, function(u, o) {
      u && o && (p[(0, a.camelCase)(u, d)] = o);
    }), p;
  }
  return r.default = r, Me = r, Me;
}
var Wt;
function br() {
  return Wt || (Wt = 1, function(t) {
    var e = $e && $e.__importDefault || function(l) {
      return l && l.__esModule ? l : { default: l };
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.returnFirstArg = t.canTextBeChildOfNode = t.ELEMENTS_WITH_NO_TEXT_CHILDREN = t.PRESERVE_CUSTOM_ATTRIBUTES = void 0, t.isCustomComponent = d, t.setStyleProp = u;
    var a = Se, r = e(ui()), c = /* @__PURE__ */ new Set([
      "annotation-xml",
      "color-profile",
      "font-face",
      "font-face-src",
      "font-face-uri",
      "font-face-format",
      "font-face-name",
      "missing-glyph"
    ]);
    function d(l, h) {
      return l.includes("-") ? !c.has(l) : !!(h && typeof h.is == "string");
    }
    var p = {
      reactCompat: !0
    };
    function u(l, h) {
      if (typeof l == "string") {
        if (!l.trim()) {
          h.style = {};
          return;
        }
        try {
          h.style = (0, r.default)(l, p);
        } catch {
          h.style = {};
        }
      }
    }
    t.PRESERVE_CUSTOM_ATTRIBUTES = Number(a.version.split(".")[0]) >= 16, t.ELEMENTS_WITH_NO_TEXT_CHILDREN = /* @__PURE__ */ new Set([
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
    var o = function(l) {
      return !t.ELEMENTS_WITH_NO_TEXT_CHILDREN.has(l.name);
    };
    t.canTextBeChildOfNode = o;
    var s = function(l) {
      return l;
    };
    t.returnFirstArg = s;
  }($e)), $e;
}
var Xt;
function Er() {
  if (Xt) return Ve;
  Xt = 1, Object.defineProperty(Ve, "__esModule", { value: !0 }), Ve.default = d;
  var t = ai(), e = br(), a = ["checked", "value"], r = ["input", "select", "textarea"], c = {
    reset: !0,
    submit: !0
  };
  function d(u, o) {
    u === void 0 && (u = {});
    var s = {}, l = !!(u.type && c[u.type]);
    for (var h in u) {
      var b = u[h];
      if ((0, t.isCustomAttribute)(h)) {
        s[h] = b;
        continue;
      }
      var R = h.toLowerCase(), w = p(R);
      if (w) {
        var _ = (0, t.getPropertyInfo)(w);
        switch (a.includes(w) && r.includes(o) && !l && (w = p("default" + R)), s[w] = b, _ && _.type) {
          case t.BOOLEAN:
            s[w] = !0;
            break;
          case t.OVERLOADED_BOOLEAN:
            b === "" && (s[w] = !0);
            break;
        }
        continue;
      }
      e.PRESERVE_CUSTOM_ATTRIBUTES && (s[h] = b);
    }
    return (0, e.setStyleProp)(u.style, s), s;
  }
  function p(u) {
    return t.possibleStandardNames[u];
  }
  return Ve;
}
var Re = {}, Jt;
function ci() {
  if (Jt) return Re;
  Jt = 1;
  var t = Re && Re.__importDefault || function(u) {
    return u && u.__esModule ? u : { default: u };
  };
  Object.defineProperty(Re, "__esModule", { value: !0 }), Re.default = d;
  var e = Se, a = t(Er()), r = br(), c = {
    cloneElement: e.cloneElement,
    createElement: e.createElement,
    isValidElement: e.isValidElement
  };
  function d(u, o) {
    o === void 0 && (o = {});
    for (var s = [], l = typeof o.replace == "function", h = o.transform || r.returnFirstArg, b = o.library || c, R = b.cloneElement, w = b.createElement, _ = b.isValidElement, A = u.length, g = 0; g < A; g++) {
      var v = u[g];
      if (l) {
        var S = o.replace(v, g);
        if (_(S)) {
          A > 1 && (S = R(S, {
            key: S.key || g
          })), s.push(h(S, v, g));
          continue;
        }
      }
      if (v.type === "text") {
        var D = !v.data.trim().length;
        if (D && v.parent && !(0, r.canTextBeChildOfNode)(v.parent) || o.trim && D)
          continue;
        s.push(h(v.data, v, g));
        continue;
      }
      var i = v, f = {};
      p(i) ? ((0, r.setStyleProp)(i.attribs.style, i.attribs), f = i.attribs) : i.attribs && (f = (0, a.default)(i.attribs, i.name));
      var y = void 0;
      switch (v.type) {
        case "script":
        case "style":
          v.children[0] && (f.dangerouslySetInnerHTML = {
            __html: v.children[0].data
          });
          break;
        case "tag":
          v.name === "textarea" && v.children[0] ? f.defaultValue = v.children[0].data : v.children && v.children.length && (y = d(v.children, o));
          break;
        // skip all other cases (e.g., comment)
        default:
          continue;
      }
      A > 1 && (f.key = g), s.push(h(w(v.name, f, y), v, g));
    }
    return s.length === 1 ? s[0] : s;
  }
  function p(u) {
    return r.PRESERVE_CUSTOM_ATTRIBUTES && u.type === "tag" && (0, r.isCustomComponent)(u.name, u.attribs);
  }
  return Re;
}
var Kt;
function di() {
  return Kt || (Kt = 1, function(t) {
    var e = De && De.__importDefault || function(o) {
      return o && o.__esModule ? o : { default: o };
    };
    Object.defineProperty(t, "__esModule", { value: !0 }), t.htmlToDOM = t.domToReact = t.attributesToProps = t.Text = t.ProcessingInstruction = t.Element = t.Comment = void 0, t.default = u;
    var a = e(ii());
    t.htmlToDOM = a.default;
    var r = e(Er());
    t.attributesToProps = r.default;
    var c = e(ci());
    t.domToReact = c.default;
    var d = /* @__PURE__ */ gr();
    Object.defineProperty(t, "Comment", { enumerable: !0, get: function() {
      return d.Comment;
    } }), Object.defineProperty(t, "Element", { enumerable: !0, get: function() {
      return d.Element;
    } }), Object.defineProperty(t, "ProcessingInstruction", { enumerable: !0, get: function() {
      return d.ProcessingInstruction;
    } }), Object.defineProperty(t, "Text", { enumerable: !0, get: function() {
      return d.Text;
    } });
    var p = { lowerCaseAttributeNames: !1 };
    function u(o, s) {
      if (typeof o != "string")
        throw new TypeError("First argument must be a string");
      return o ? (0, c.default)((0, a.default)(o, (s == null ? void 0 : s.htmlparser2) || p), s) : [];
    }
  }(De)), De;
}
var ct = di();
const Zt = /* @__PURE__ */ vr(ct), fi = Zt.default || Zt;
var ze = { exports: {} }, Be = { exports: {} }, W = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qt;
function hi() {
  if (Qt) return W;
  Qt = 1;
  var t = typeof Symbol == "function" && Symbol.for, e = t ? Symbol.for("react.element") : 60103, a = t ? Symbol.for("react.portal") : 60106, r = t ? Symbol.for("react.fragment") : 60107, c = t ? Symbol.for("react.strict_mode") : 60108, d = t ? Symbol.for("react.profiler") : 60114, p = t ? Symbol.for("react.provider") : 60109, u = t ? Symbol.for("react.context") : 60110, o = t ? Symbol.for("react.async_mode") : 60111, s = t ? Symbol.for("react.concurrent_mode") : 60111, l = t ? Symbol.for("react.forward_ref") : 60112, h = t ? Symbol.for("react.suspense") : 60113, b = t ? Symbol.for("react.suspense_list") : 60120, R = t ? Symbol.for("react.memo") : 60115, w = t ? Symbol.for("react.lazy") : 60116, _ = t ? Symbol.for("react.block") : 60121, A = t ? Symbol.for("react.fundamental") : 60117, g = t ? Symbol.for("react.responder") : 60118, v = t ? Symbol.for("react.scope") : 60119;
  function S(i) {
    if (typeof i == "object" && i !== null) {
      var f = i.$$typeof;
      switch (f) {
        case e:
          switch (i = i.type, i) {
            case o:
            case s:
            case r:
            case d:
            case c:
            case h:
              return i;
            default:
              switch (i = i && i.$$typeof, i) {
                case u:
                case l:
                case w:
                case R:
                case p:
                  return i;
                default:
                  return f;
              }
          }
        case a:
          return f;
      }
    }
  }
  function D(i) {
    return S(i) === s;
  }
  return W.AsyncMode = o, W.ConcurrentMode = s, W.ContextConsumer = u, W.ContextProvider = p, W.Element = e, W.ForwardRef = l, W.Fragment = r, W.Lazy = w, W.Memo = R, W.Portal = a, W.Profiler = d, W.StrictMode = c, W.Suspense = h, W.isAsyncMode = function(i) {
    return D(i) || S(i) === o;
  }, W.isConcurrentMode = D, W.isContextConsumer = function(i) {
    return S(i) === u;
  }, W.isContextProvider = function(i) {
    return S(i) === p;
  }, W.isElement = function(i) {
    return typeof i == "object" && i !== null && i.$$typeof === e;
  }, W.isForwardRef = function(i) {
    return S(i) === l;
  }, W.isFragment = function(i) {
    return S(i) === r;
  }, W.isLazy = function(i) {
    return S(i) === w;
  }, W.isMemo = function(i) {
    return S(i) === R;
  }, W.isPortal = function(i) {
    return S(i) === a;
  }, W.isProfiler = function(i) {
    return S(i) === d;
  }, W.isStrictMode = function(i) {
    return S(i) === c;
  }, W.isSuspense = function(i) {
    return S(i) === h;
  }, W.isValidElementType = function(i) {
    return typeof i == "string" || typeof i == "function" || i === r || i === s || i === d || i === c || i === h || i === b || typeof i == "object" && i !== null && (i.$$typeof === w || i.$$typeof === R || i.$$typeof === p || i.$$typeof === u || i.$$typeof === l || i.$$typeof === A || i.$$typeof === g || i.$$typeof === v || i.$$typeof === _);
  }, W.typeOf = S, W;
}
var X = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var er;
function pi() {
  return er || (er = 1, process.env.NODE_ENV !== "production" && function() {
    var t = typeof Symbol == "function" && Symbol.for, e = t ? Symbol.for("react.element") : 60103, a = t ? Symbol.for("react.portal") : 60106, r = t ? Symbol.for("react.fragment") : 60107, c = t ? Symbol.for("react.strict_mode") : 60108, d = t ? Symbol.for("react.profiler") : 60114, p = t ? Symbol.for("react.provider") : 60109, u = t ? Symbol.for("react.context") : 60110, o = t ? Symbol.for("react.async_mode") : 60111, s = t ? Symbol.for("react.concurrent_mode") : 60111, l = t ? Symbol.for("react.forward_ref") : 60112, h = t ? Symbol.for("react.suspense") : 60113, b = t ? Symbol.for("react.suspense_list") : 60120, R = t ? Symbol.for("react.memo") : 60115, w = t ? Symbol.for("react.lazy") : 60116, _ = t ? Symbol.for("react.block") : 60121, A = t ? Symbol.for("react.fundamental") : 60117, g = t ? Symbol.for("react.responder") : 60118, v = t ? Symbol.for("react.scope") : 60119;
    function S(T) {
      return typeof T == "string" || typeof T == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      T === r || T === s || T === d || T === c || T === h || T === b || typeof T == "object" && T !== null && (T.$$typeof === w || T.$$typeof === R || T.$$typeof === p || T.$$typeof === u || T.$$typeof === l || T.$$typeof === A || T.$$typeof === g || T.$$typeof === v || T.$$typeof === _);
    }
    function D(T) {
      if (typeof T == "object" && T !== null) {
        var le = T.$$typeof;
        switch (le) {
          case e:
            var _e = T.type;
            switch (_e) {
              case o:
              case s:
              case r:
              case d:
              case c:
              case h:
                return _e;
              default:
                var me = _e && _e.$$typeof;
                switch (me) {
                  case u:
                  case l:
                  case w:
                  case R:
                  case p:
                    return me;
                  default:
                    return le;
                }
            }
          case a:
            return le;
        }
      }
    }
    var i = o, f = s, y = u, k = p, F = e, K = l, re = r, se = w, I = R, O = a, Z = d, ne = c, de = h, ve = !1;
    function Ee(T) {
      return ve || (ve = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), E(T) || D(T) === o;
    }
    function E(T) {
      return D(T) === s;
    }
    function x(T) {
      return D(T) === u;
    }
    function H(T) {
      return D(T) === p;
    }
    function N(T) {
      return typeof T == "object" && T !== null && T.$$typeof === e;
    }
    function $(T) {
      return D(T) === l;
    }
    function z(T) {
      return D(T) === r;
    }
    function L(T) {
      return D(T) === w;
    }
    function j(T) {
      return D(T) === R;
    }
    function q(T) {
      return D(T) === a;
    }
    function G(T) {
      return D(T) === d;
    }
    function U(T) {
      return D(T) === c;
    }
    function ie(T) {
      return D(T) === h;
    }
    X.AsyncMode = i, X.ConcurrentMode = f, X.ContextConsumer = y, X.ContextProvider = k, X.Element = F, X.ForwardRef = K, X.Fragment = re, X.Lazy = se, X.Memo = I, X.Portal = O, X.Profiler = Z, X.StrictMode = ne, X.Suspense = de, X.isAsyncMode = Ee, X.isConcurrentMode = E, X.isContextConsumer = x, X.isContextProvider = H, X.isElement = N, X.isForwardRef = $, X.isFragment = z, X.isLazy = L, X.isMemo = j, X.isPortal = q, X.isProfiler = G, X.isStrictMode = U, X.isSuspense = ie, X.isValidElementType = S, X.typeOf = D;
  }()), X;
}
var tr;
function _r() {
  return tr || (tr = 1, process.env.NODE_ENV === "production" ? Be.exports = hi() : Be.exports = pi()), Be.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var rt, rr;
function vi() {
  if (rr) return rt;
  rr = 1;
  var t = Object.getOwnPropertySymbols, e = Object.prototype.hasOwnProperty, a = Object.prototype.propertyIsEnumerable;
  function r(d) {
    if (d == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(d);
  }
  function c() {
    try {
      if (!Object.assign)
        return !1;
      var d = new String("abc");
      if (d[5] = "de", Object.getOwnPropertyNames(d)[0] === "5")
        return !1;
      for (var p = {}, u = 0; u < 10; u++)
        p["_" + String.fromCharCode(u)] = u;
      var o = Object.getOwnPropertyNames(p).map(function(l) {
        return p[l];
      });
      if (o.join("") !== "0123456789")
        return !1;
      var s = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(l) {
        s[l] = l;
      }), Object.keys(Object.assign({}, s)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return rt = c() ? Object.assign : function(d, p) {
    for (var u, o = r(d), s, l = 1; l < arguments.length; l++) {
      u = Object(arguments[l]);
      for (var h in u)
        e.call(u, h) && (o[h] = u[h]);
      if (t) {
        s = t(u);
        for (var b = 0; b < s.length; b++)
          a.call(u, s[b]) && (o[s[b]] = u[s[b]]);
      }
    }
    return o;
  }, rt;
}
var it, ir;
function pt() {
  if (ir) return it;
  ir = 1;
  var t = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return it = t, it;
}
var nt, nr;
function Ar() {
  return nr || (nr = 1, nt = Function.call.bind(Object.prototype.hasOwnProperty)), nt;
}
var at, ar;
function mi() {
  if (ar) return at;
  ar = 1;
  var t = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var e = /* @__PURE__ */ pt(), a = {}, r = /* @__PURE__ */ Ar();
    t = function(d) {
      var p = "Warning: " + d;
      typeof console < "u" && console.error(p);
      try {
        throw new Error(p);
      } catch {
      }
    };
  }
  function c(d, p, u, o, s) {
    if (process.env.NODE_ENV !== "production") {
      for (var l in d)
        if (r(d, l)) {
          var h;
          try {
            if (typeof d[l] != "function") {
              var b = Error(
                (o || "React class") + ": " + u + " type `" + l + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof d[l] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw b.name = "Invariant Violation", b;
            }
            h = d[l](p, l, o, u, null, e);
          } catch (w) {
            h = w;
          }
          if (h && !(h instanceof Error) && t(
            (o || "React class") + ": type specification of " + u + " `" + l + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof h + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), h instanceof Error && !(h.message in a)) {
            a[h.message] = !0;
            var R = s ? s() : "";
            t(
              "Failed " + u + " type: " + h.message + (R ?? "")
            );
          }
        }
    }
  }
  return c.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (a = {});
  }, at = c, at;
}
var ot, or;
function gi() {
  if (or) return ot;
  or = 1;
  var t = _r(), e = vi(), a = /* @__PURE__ */ pt(), r = /* @__PURE__ */ Ar(), c = /* @__PURE__ */ mi(), d = function() {
  };
  process.env.NODE_ENV !== "production" && (d = function(u) {
    var o = "Warning: " + u;
    typeof console < "u" && console.error(o);
    try {
      throw new Error(o);
    } catch {
    }
  });
  function p() {
    return null;
  }
  return ot = function(u, o) {
    var s = typeof Symbol == "function" && Symbol.iterator, l = "@@iterator";
    function h(E) {
      var x = E && (s && E[s] || E[l]);
      if (typeof x == "function")
        return x;
    }
    var b = "<<anonymous>>", R = {
      array: g("array"),
      bigint: g("bigint"),
      bool: g("boolean"),
      func: g("function"),
      number: g("number"),
      object: g("object"),
      string: g("string"),
      symbol: g("symbol"),
      any: v(),
      arrayOf: S,
      element: D(),
      elementType: i(),
      instanceOf: f,
      node: K(),
      objectOf: k,
      oneOf: y,
      oneOfType: F,
      shape: se,
      exact: I
    };
    function w(E, x) {
      return E === x ? E !== 0 || 1 / E === 1 / x : E !== E && x !== x;
    }
    function _(E, x) {
      this.message = E, this.data = x && typeof x == "object" ? x : {}, this.stack = "";
    }
    _.prototype = Error.prototype;
    function A(E) {
      if (process.env.NODE_ENV !== "production")
        var x = {}, H = 0;
      function N(z, L, j, q, G, U, ie) {
        if (q = q || b, U = U || j, ie !== a) {
          if (o) {
            var T = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw T.name = "Invariant Violation", T;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var le = q + ":" + j;
            !x[le] && // Avoid spamming the console because they are often not actionable except for lib authors
            H < 3 && (d(
              "You are manually calling a React.PropTypes validation function for the `" + U + "` prop on `" + q + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), x[le] = !0, H++);
          }
        }
        return L[j] == null ? z ? L[j] === null ? new _("The " + G + " `" + U + "` is marked as required " + ("in `" + q + "`, but its value is `null`.")) : new _("The " + G + " `" + U + "` is marked as required in " + ("`" + q + "`, but its value is `undefined`.")) : null : E(L, j, q, G, U);
      }
      var $ = N.bind(null, !1);
      return $.isRequired = N.bind(null, !0), $;
    }
    function g(E) {
      function x(H, N, $, z, L, j) {
        var q = H[N], G = ne(q);
        if (G !== E) {
          var U = de(q);
          return new _(
            "Invalid " + z + " `" + L + "` of type " + ("`" + U + "` supplied to `" + $ + "`, expected ") + ("`" + E + "`."),
            { expectedType: E }
          );
        }
        return null;
      }
      return A(x);
    }
    function v() {
      return A(p);
    }
    function S(E) {
      function x(H, N, $, z, L) {
        if (typeof E != "function")
          return new _("Property `" + L + "` of component `" + $ + "` has invalid PropType notation inside arrayOf.");
        var j = H[N];
        if (!Array.isArray(j)) {
          var q = ne(j);
          return new _("Invalid " + z + " `" + L + "` of type " + ("`" + q + "` supplied to `" + $ + "`, expected an array."));
        }
        for (var G = 0; G < j.length; G++) {
          var U = E(j, G, $, z, L + "[" + G + "]", a);
          if (U instanceof Error)
            return U;
        }
        return null;
      }
      return A(x);
    }
    function D() {
      function E(x, H, N, $, z) {
        var L = x[H];
        if (!u(L)) {
          var j = ne(L);
          return new _("Invalid " + $ + " `" + z + "` of type " + ("`" + j + "` supplied to `" + N + "`, expected a single ReactElement."));
        }
        return null;
      }
      return A(E);
    }
    function i() {
      function E(x, H, N, $, z) {
        var L = x[H];
        if (!t.isValidElementType(L)) {
          var j = ne(L);
          return new _("Invalid " + $ + " `" + z + "` of type " + ("`" + j + "` supplied to `" + N + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return A(E);
    }
    function f(E) {
      function x(H, N, $, z, L) {
        if (!(H[N] instanceof E)) {
          var j = E.name || b, q = Ee(H[N]);
          return new _("Invalid " + z + " `" + L + "` of type " + ("`" + q + "` supplied to `" + $ + "`, expected ") + ("instance of `" + j + "`."));
        }
        return null;
      }
      return A(x);
    }
    function y(E) {
      if (!Array.isArray(E))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? d(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : d("Invalid argument supplied to oneOf, expected an array.")), p;
      function x(H, N, $, z, L) {
        for (var j = H[N], q = 0; q < E.length; q++)
          if (w(j, E[q]))
            return null;
        var G = JSON.stringify(E, function(ie, T) {
          var le = de(T);
          return le === "symbol" ? String(T) : T;
        });
        return new _("Invalid " + z + " `" + L + "` of value `" + String(j) + "` " + ("supplied to `" + $ + "`, expected one of " + G + "."));
      }
      return A(x);
    }
    function k(E) {
      function x(H, N, $, z, L) {
        if (typeof E != "function")
          return new _("Property `" + L + "` of component `" + $ + "` has invalid PropType notation inside objectOf.");
        var j = H[N], q = ne(j);
        if (q !== "object")
          return new _("Invalid " + z + " `" + L + "` of type " + ("`" + q + "` supplied to `" + $ + "`, expected an object."));
        for (var G in j)
          if (r(j, G)) {
            var U = E(j, G, $, z, L + "." + G, a);
            if (U instanceof Error)
              return U;
          }
        return null;
      }
      return A(x);
    }
    function F(E) {
      if (!Array.isArray(E))
        return process.env.NODE_ENV !== "production" && d("Invalid argument supplied to oneOfType, expected an instance of array."), p;
      for (var x = 0; x < E.length; x++) {
        var H = E[x];
        if (typeof H != "function")
          return d(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + ve(H) + " at index " + x + "."
          ), p;
      }
      function N($, z, L, j, q) {
        for (var G = [], U = 0; U < E.length; U++) {
          var ie = E[U], T = ie($, z, L, j, q, a);
          if (T == null)
            return null;
          T.data && r(T.data, "expectedType") && G.push(T.data.expectedType);
        }
        var le = G.length > 0 ? ", expected one of type [" + G.join(", ") + "]" : "";
        return new _("Invalid " + j + " `" + q + "` supplied to " + ("`" + L + "`" + le + "."));
      }
      return A(N);
    }
    function K() {
      function E(x, H, N, $, z) {
        return O(x[H]) ? null : new _("Invalid " + $ + " `" + z + "` supplied to " + ("`" + N + "`, expected a ReactNode."));
      }
      return A(E);
    }
    function re(E, x, H, N, $) {
      return new _(
        (E || "React class") + ": " + x + " type `" + H + "." + N + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + $ + "`."
      );
    }
    function se(E) {
      function x(H, N, $, z, L) {
        var j = H[N], q = ne(j);
        if (q !== "object")
          return new _("Invalid " + z + " `" + L + "` of type `" + q + "` " + ("supplied to `" + $ + "`, expected `object`."));
        for (var G in E) {
          var U = E[G];
          if (typeof U != "function")
            return re($, z, L, G, de(U));
          var ie = U(j, G, $, z, L + "." + G, a);
          if (ie)
            return ie;
        }
        return null;
      }
      return A(x);
    }
    function I(E) {
      function x(H, N, $, z, L) {
        var j = H[N], q = ne(j);
        if (q !== "object")
          return new _("Invalid " + z + " `" + L + "` of type `" + q + "` " + ("supplied to `" + $ + "`, expected `object`."));
        var G = e({}, H[N], E);
        for (var U in G) {
          var ie = E[U];
          if (r(E, U) && typeof ie != "function")
            return re($, z, L, U, de(ie));
          if (!ie)
            return new _(
              "Invalid " + z + " `" + L + "` key `" + U + "` supplied to `" + $ + "`.\nBad object: " + JSON.stringify(H[N], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(E), null, "  ")
            );
          var T = ie(j, U, $, z, L + "." + U, a);
          if (T)
            return T;
        }
        return null;
      }
      return A(x);
    }
    function O(E) {
      switch (typeof E) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !E;
        case "object":
          if (Array.isArray(E))
            return E.every(O);
          if (E === null || u(E))
            return !0;
          var x = h(E);
          if (x) {
            var H = x.call(E), N;
            if (x !== E.entries) {
              for (; !(N = H.next()).done; )
                if (!O(N.value))
                  return !1;
            } else
              for (; !(N = H.next()).done; ) {
                var $ = N.value;
                if ($ && !O($[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function Z(E, x) {
      return E === "symbol" ? !0 : x ? x["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && x instanceof Symbol : !1;
    }
    function ne(E) {
      var x = typeof E;
      return Array.isArray(E) ? "array" : E instanceof RegExp ? "object" : Z(x, E) ? "symbol" : x;
    }
    function de(E) {
      if (typeof E > "u" || E === null)
        return "" + E;
      var x = ne(E);
      if (x === "object") {
        if (E instanceof Date)
          return "date";
        if (E instanceof RegExp)
          return "regexp";
      }
      return x;
    }
    function ve(E) {
      var x = de(E);
      switch (x) {
        case "array":
        case "object":
          return "an " + x;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + x;
        default:
          return x;
      }
    }
    function Ee(E) {
      return !E.constructor || !E.constructor.name ? b : E.constructor.name;
    }
    return R.checkPropTypes = c, R.resetWarningCache = c.resetWarningCache, R.PropTypes = R, R;
  }, ot;
}
var st, sr;
function yi() {
  if (sr) return st;
  sr = 1;
  var t = /* @__PURE__ */ pt();
  function e() {
  }
  function a() {
  }
  return a.resetWarningCache = e, st = function() {
    function r(p, u, o, s, l, h) {
      if (h !== t) {
        var b = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw b.name = "Invariant Violation", b;
      }
    }
    r.isRequired = r;
    function c() {
      return r;
    }
    var d = {
      array: r,
      bigint: r,
      bool: r,
      func: r,
      number: r,
      object: r,
      string: r,
      symbol: r,
      any: r,
      arrayOf: c,
      element: r,
      elementType: r,
      instanceOf: c,
      node: r,
      objectOf: c,
      oneOf: c,
      oneOfType: c,
      shape: c,
      exact: c,
      checkPropTypes: a,
      resetWarningCache: e
    };
    return d.PropTypes = d, d;
  }, st;
}
var lr;
function bi() {
  if (lr) return ze.exports;
  if (lr = 1, process.env.NODE_ENV !== "production") {
    var t = _r(), e = !0;
    ze.exports = /* @__PURE__ */ gi()(t.isElement, e);
  } else
    ze.exports = /* @__PURE__ */ yi()();
  return ze.exports;
}
var Ei = /* @__PURE__ */ bi();
const pe = /* @__PURE__ */ vr(Ei);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var dt = function() {
  return dt = Object.assign || function(e) {
    for (var a, r = 1, c = arguments.length; r < c; r++) {
      a = arguments[r];
      for (var d in a) Object.prototype.hasOwnProperty.call(a, d) && (e[d] = a[d]);
    }
    return e;
  }, dt.apply(this, arguments);
};
function _i(t, e) {
  var a = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (a[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var c = 0, r = Object.getOwnPropertySymbols(t); c < r.length; c++)
      e.indexOf(r[c]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[c]) && (a[r[c]] = t[r[c]]);
  return a;
}
var xe = "", Fe = null, Ge = null, wr = null;
function vt() {
  xe = "", Fe !== null && Fe.disconnect(), Ge !== null && (window.clearTimeout(Ge), Ge = null);
}
function ur(t) {
  var e = ["BUTTON", "INPUT", "SELECT", "TEXTAREA"], a = ["A", "AREA"];
  return e.includes(t.tagName) && !t.hasAttribute("disabled") || a.includes(t.tagName) && t.hasAttribute("href");
}
function cr() {
  var t = null;
  if (xe === "#")
    t = document.body;
  else {
    var e = xe.replace("#", "");
    t = document.getElementById(e), t === null && xe === "#top" && (t = document.body);
  }
  if (t !== null) {
    wr(t);
    var a = t.getAttribute("tabindex");
    return a === null && !ur(t) && t.setAttribute("tabindex", -1), t.focus({ preventScroll: !0 }), a === null && !ur(t) && (t.blur(), t.removeAttribute("tabindex")), vt(), !0;
  }
  return !1;
}
function Ai(t) {
  window.setTimeout(function() {
    cr() === !1 && (Fe === null && (Fe = new MutationObserver(cr)), Fe.observe(document, {
      attributes: !0,
      childList: !0,
      subtree: !0
    }), Ge = window.setTimeout(function() {
      vt();
    }, t || 1e4));
  }, 0);
}
function Tr(t) {
  return Se.forwardRef(function(e, a) {
    var r = "";
    typeof e.to == "string" && e.to.includes("#") ? r = "#" + e.to.split("#").slice(1).join("#") : typeof e.to == "object" && typeof e.to.hash == "string" && (r = e.to.hash);
    var c = {};
    t === pr && (c.isActive = function(u, o) {
      return u && u.isExact && o.hash === r;
    });
    function d(u) {
      vt(), xe = e.elementId ? "#" + e.elementId : r, e.onClick && e.onClick(u), xe !== "" && // ignore non-vanilla click events, same as react-router
      // below logic adapted from react-router: https://github.com/ReactTraining/react-router/blob/fc91700e08df8147bd2bb1be19a299cbb14dbcaa/packages/react-router-dom/modules/Link.js#L43-L48
      !u.defaultPrevented && // onClick prevented default
      u.button === 0 && // ignore everything but left clicks
      (!e.target || e.target === "_self") && // let browser handle "target=_blank" etc
      !(u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) && (wr = e.scroll || function(o) {
        return e.smooth ? o.scrollIntoView({ behavior: "smooth" }) : o.scrollIntoView();
      }, Ai(e.timeout));
    }
    var p = _i(e, ["scroll", "smooth", "timeout", "elementId"]);
    return Se.createElement(t, dt({}, c, p, { onClick: d, ref: a }), e.children);
  });
}
var ft = Tr(Jr), dr = Tr(pr);
if (process.env.NODE_ENV !== "production") {
  ft.displayName = "HashLink", dr.displayName = "NavHashLink";
  var fr = {
    onClick: pe.func,
    children: pe.node,
    scroll: pe.func,
    timeout: pe.number,
    elementId: pe.string,
    to: pe.oneOfType([pe.string, pe.object])
  };
  ft.propTypes = fr, dr.propTypes = fr;
}
const qi = ["hello-cube", "sky-sea"], Cr = "hello-cube", Ui = /* @__PURE__ */ new Map([
  [
    Cr,
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
]), Rr = /* @__PURE__ */ new Map([
  [
    Cr,
    {
      projectFolder: "hello-cube",
      requiredLimits: /* @__PURE__ */ new Map(),
      requiredFeatures: /* @__PURE__ */ new Set(),
      optionalFeatures: /* @__PURE__ */ new Set([
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
        "dual-source-blending"
      ]),
      import: () => import("./HelloCube-CXcaSkqz.js").then((t) => t.HelloCubeAppConstructor)
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
      import: () => import("./SkySea-DfwX_pY4.js").then((t) => t.SkySeaAppConstructor)
    }
  ]
]), wi = "https://github.com/EllarBooher/WebGPU-Samples/tree/main/lib/webgpu", Vi = Xr(function({
  sampleID: e
}) {
  var p;
  const [a, r] = Ye(), c = (p = Rr.get(e)) == null ? void 0 : p.projectFolder;
  if (je(() => {
    if (c === void 0) {
      r(void 0);
      return;
    }
    Kr(/* @__PURE__ */ Object.assign({ "./hello-cube/README.md": () => import("./README-CPZmMRLh.js"), "./sky-sea/README.md": () => import("./README-u4DQJ_ZV.js") }), `./${c}/README.md`, 3).then((u) => {
      const o = u;
      if (typeof o.default != "string")
        throw new Error(
          `Invalid readme markdown import, path is ${c}`
        );
      r(o.default);
    }).catch((u) => {
      u instanceof Error && console.error(u);
    });
  }, [c, r]), a === void 0)
    return;
  const d = {
    replace(u) {
      const { attribs: o, children: s } = u;
      if (o === void 0 || s === void 0)
        return;
      const l = o.href;
      if (typeof l != "string")
        return;
      if (l.startsWith("#") === !0)
        return /* @__PURE__ */ te.jsx(ft, { to: l, children: ct.domToReact(s, d) });
      const h = `${wi}/${c}/`;
      let b;
      return URL.canParse(l) ? b = l : URL.canParse(l, h) && (b = URL.parse(l, h).href), /* @__PURE__ */ te.jsx("a", { target: "_blank", rel: "noopener noreferrer", href: b, children: ct.domToReact(s, d) });
    }
  };
  return /* @__PURE__ */ te.jsx("div", { className: "webgpu-samples-readme-body", children: fi(a, d) });
});
async function Ti(t) {
  console.log("Starting WebGPU");
  const e = navigator.gpu.requestAdapter().then((r) => r ? Promise.resolve(r) : Promise.reject(
    new Error("Requested WebGPU Adapter is not available.")
  )).catch((r) => Promise.reject(
    new Error("Unable to get WebGPU Adapter", { cause: r })
  )), a = e.then((r) => {
    const c = Array.from(
      t.requiredFeatures.values()
    ).filter((s) => r.features.has(s));
    if (c.length != t.requiredFeatures.size) {
      const s = `Required features unavailable: ${Array.from(
        t.requiredFeatures.values()
      ).filter((l) => !r.features.has(l)).map((l) => `'${l}'`).join(",")}`;
      return Promise.reject(
        new Error("Unable to get WebGPU Device", { cause: s })
      );
    }
    const d = c.concat(
      ...Array.from(t.optionalFeatures.values()).filter((s) => r.features.has(s))
    );
    console.log(`Enabling features: '${d.join("', '")}'`);
    const p = /* @__PURE__ */ new Map(), u = new Array();
    for (const [s, l] of t.requiredLimits.entries()) {
      const h = r.limits[s];
      h >= l ? p.set(s, l) : u.push({
        name: s,
        requestedMinimum: l,
        supported: h
      });
    }
    if (p.size < t.requiredLimits.size) {
      const s = `Required limits unsatisfied: ${u.map(
        (l) => `( name: '${l.name}' supported: '${l.supported}' requested: '${l.requestedMinimum}' )`
      ).join(",")}`;
      return Promise.reject(
        new Error("Unable to get WebGPU Device", { cause: s })
      );
    }
    const o = {};
    for (const [s, l] of p)
      o[s] = l;
    return r.requestDevice({
      requiredFeatures: d,
      requiredLimits: o
    }).catch((s) => Promise.reject(
      new Error("Unable to get WebGPU Device", { cause: s })
    ));
  });
  return Promise.all([e, a]).then((r) => {
    const [c, d] = r;
    return {
      adapter: c,
      device: d
    };
  });
}
async function Ci(t) {
  return Promise.all([
    t.import(),
    Ti({
      ...t
    })
  ]).then(([e, { adapter: a, device: r }]) => {
    const c = t.gpu.getPreferredCanvasFormat(), d = e(r, c);
    return r.lost.then(
      (p) => {
        console.log(
          `WebGPU device lost - ("${p.reason}"):
 ${p.message}`
        );
      },
      (p) => {
        throw new Error("WebGPU device lost rejected", {
          cause: p
        });
      }
    ).finally(() => {
      d.quit = !0;
    }), r.onuncapturederror = (p) => {
      d.quit = !0, t.onUncapturedError(p);
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
class fe {
  constructor(e, a, r, c, d = "div") {
    this.parent = e, this.object = a, this.property = r, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(d), this.domElement.classList.add("controller"), this.domElement.classList.add(c), this.$name = document.createElement("div"), this.$name.classList.add("name"), fe.nextNameID = fe.nextNameID || 0, this.$name.id = `lil-gui-name-${++fe.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (p) => p.stopPropagation()), this.domElement.addEventListener("keyup", (p) => p.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(r);
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
    const a = this.parent.add(this.object, this.property, e);
    return a.name(this._name), this.destroy(), a;
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
class Ri extends fe {
  constructor(e, a, r) {
    super(e, a, r, "boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked), this._callOnFinishChange();
    }), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.checked = this.getValue(), this;
  }
}
function ht(t) {
  let e, a;
  return (e = t.match(/(#|0x)?([a-f0-9]{6})/i)) ? a = e[2] : (e = t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? a = parseInt(e[1]).toString(16).padStart(2, 0) + parseInt(e[2]).toString(16).padStart(2, 0) + parseInt(e[3]).toString(16).padStart(2, 0) : (e = t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (a = e[1] + e[1] + e[2] + e[2] + e[3] + e[3]), a ? "#" + a : !1;
}
const xi = {
  isPrimitive: !0,
  match: (t) => typeof t == "string",
  fromHexString: ht,
  toHexString: ht
}, Ne = {
  isPrimitive: !0,
  match: (t) => typeof t == "number",
  fromHexString: (t) => parseInt(t.substring(1), 16),
  toHexString: (t) => "#" + t.toString(16).padStart(6, 0)
}, Si = {
  isPrimitive: !1,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (t) => Array.isArray(t),
  fromHexString(t, e, a = 1) {
    const r = Ne.fromHexString(t);
    e[0] = (r >> 16 & 255) / 255 * a, e[1] = (r >> 8 & 255) / 255 * a, e[2] = (r & 255) / 255 * a;
  },
  toHexString([t, e, a], r = 1) {
    r = 255 / r;
    const c = t * r << 16 ^ e * r << 8 ^ a * r << 0;
    return Ne.toHexString(c);
  }
}, Oi = {
  isPrimitive: !1,
  match: (t) => Object(t) === t,
  fromHexString(t, e, a = 1) {
    const r = Ne.fromHexString(t);
    e.r = (r >> 16 & 255) / 255 * a, e.g = (r >> 8 & 255) / 255 * a, e.b = (r & 255) / 255 * a;
  },
  toHexString({ r: t, g: e, b: a }, r = 1) {
    r = 255 / r;
    const c = t * r << 16 ^ e * r << 8 ^ a * r << 0;
    return Ne.toHexString(c);
  }
}, Pi = [xi, Ne, Si, Oi];
function ki(t) {
  return Pi.find((e) => e.match(t));
}
class Di extends fe {
  constructor(e, a, r, c) {
    super(e, a, r, "color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = ki(this.initialValue), this._rgbScale = c, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$text.addEventListener("input", () => {
      const d = ht(this.$text.value);
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
      const a = this._format.fromHexString(e);
      this.setValue(a);
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
class lt extends fe {
  constructor(e, a, r) {
    super(e, a, r, "function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (c) => {
      c.preventDefault(), this.getValue().call(this.object), this._callOnChange();
    }), this.$button.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$disable = this.$button;
  }
}
class Ii extends fe {
  constructor(e, a, r, c, d, p) {
    super(e, a, r, "number"), this._initInput(), this.min(c), this.max(d);
    const u = p !== void 0;
    this.step(u ? p : this._getImplicitStep(), u), this.updateDisplay();
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
  step(e, a = !0) {
    return this._step = e, this._stepExplicit = a, this;
  }
  updateDisplay() {
    const e = this.getValue();
    if (this._hasSlider) {
      let a = (e - this._min) / (this._max - this._min);
      a = Math.max(0, Math.min(a, 1)), this.$fill.style.width = a * 100 + "%";
    }
    return this._inputFocused || (this.$input.value = this._decimals === void 0 ? e : e.toFixed(this._decimals)), this;
  }
  _initInput() {
    this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("aria-labelledby", this.$name.id), window.matchMedia("(pointer: coarse)").matches && (this.$input.setAttribute("type", "number"), this.$input.setAttribute("step", "any")), this.$widget.appendChild(this.$input), this.$disable = this.$input;
    const a = () => {
      let v = parseFloat(this.$input.value);
      isNaN(v) || (this._stepExplicit && (v = this._snap(v)), this.setValue(this._clamp(v)));
    }, r = (v) => {
      const S = parseFloat(this.$input.value);
      isNaN(S) || (this._snapClampSetValue(S + v), this.$input.value = this.getValue());
    }, c = (v) => {
      v.key === "Enter" && this.$input.blur(), v.code === "ArrowUp" && (v.preventDefault(), r(this._step * this._arrowKeyMultiplier(v))), v.code === "ArrowDown" && (v.preventDefault(), r(this._step * this._arrowKeyMultiplier(v) * -1));
    }, d = (v) => {
      this._inputFocused && (v.preventDefault(), r(this._step * this._normalizeMouseWheel(v)));
    };
    let p = !1, u, o, s, l, h;
    const b = 5, R = (v) => {
      u = v.clientX, o = s = v.clientY, p = !0, l = this.getValue(), h = 0, window.addEventListener("mousemove", w), window.addEventListener("mouseup", _);
    }, w = (v) => {
      if (p) {
        const S = v.clientX - u, D = v.clientY - o;
        Math.abs(D) > b ? (v.preventDefault(), this.$input.blur(), p = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(S) > b && _();
      }
      if (!p) {
        const S = v.clientY - s;
        h -= S * this._step * this._arrowKeyMultiplier(v), l + h > this._max ? h = this._max - l : l + h < this._min && (h = this._min - l), this._snapClampSetValue(l + h);
      }
      s = v.clientY;
    }, _ = () => {
      this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", w), window.removeEventListener("mouseup", _);
    }, A = () => {
      this._inputFocused = !0;
    }, g = () => {
      this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
    };
    this.$input.addEventListener("input", a), this.$input.addEventListener("keydown", c), this.$input.addEventListener("wheel", d, { passive: !1 }), this.$input.addEventListener("mousedown", R), this.$input.addEventListener("focus", A), this.$input.addEventListener("blur", g);
  }
  _initSlider() {
    this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("hasSlider");
    const e = (g, v, S, D, i) => (g - v) / (S - v) * (i - D) + D, a = (g) => {
      const v = this.$slider.getBoundingClientRect();
      let S = e(g, v.left, v.right, this._min, this._max);
      this._snapClampSetValue(S);
    }, r = (g) => {
      this._setDraggingStyle(!0), a(g.clientX), window.addEventListener("mousemove", c), window.addEventListener("mouseup", d);
    }, c = (g) => {
      a(g.clientX);
    }, d = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", c), window.removeEventListener("mouseup", d);
    };
    let p = !1, u, o;
    const s = (g) => {
      g.preventDefault(), this._setDraggingStyle(!0), a(g.touches[0].clientX), p = !1;
    }, l = (g) => {
      g.touches.length > 1 || (this._hasScrollBar ? (u = g.touches[0].clientX, o = g.touches[0].clientY, p = !0) : s(g), window.addEventListener("touchmove", h, { passive: !1 }), window.addEventListener("touchend", b));
    }, h = (g) => {
      if (p) {
        const v = g.touches[0].clientX - u, S = g.touches[0].clientY - o;
        Math.abs(v) > Math.abs(S) ? s(g) : (window.removeEventListener("touchmove", h), window.removeEventListener("touchend", b));
      } else
        g.preventDefault(), a(g.touches[0].clientX);
    }, b = () => {
      this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", h), window.removeEventListener("touchend", b);
    }, R = this._callOnFinishChange.bind(this), w = 400;
    let _;
    const A = (g) => {
      if (Math.abs(g.deltaX) < Math.abs(g.deltaY) && this._hasScrollBar) return;
      g.preventDefault();
      const S = this._normalizeMouseWheel(g) * this._step;
      this._snapClampSetValue(this.getValue() + S), this.$input.value = this.getValue(), clearTimeout(_), _ = setTimeout(R, w);
    };
    this.$slider.addEventListener("mousedown", r), this.$slider.addEventListener("touchstart", l, { passive: !1 }), this.$slider.addEventListener("wheel", A, { passive: !1 });
  }
  _setDraggingStyle(e, a = "horizontal") {
    this.$slider && this.$slider.classList.toggle("active", e), document.body.classList.toggle("lil-gui-dragging", e), document.body.classList.toggle(`lil-gui-${a}`, e);
  }
  _getImplicitStep() {
    return this._hasMin && this._hasMax ? (this._max - this._min) / 1e3 : 0.1;
  }
  _onUpdateMinMax() {
    !this._hasSlider && this._hasMin && this._hasMax && (this._stepExplicit || this.step(this._getImplicitStep(), !1), this._initSlider(), this.updateDisplay());
  }
  _normalizeMouseWheel(e) {
    let { deltaX: a, deltaY: r } = e;
    return Math.floor(e.deltaY) !== e.deltaY && e.wheelDelta && (a = 0, r = -e.wheelDelta / 120, r *= this._stepExplicit ? 1 : 10), a + -r;
  }
  _arrowKeyMultiplier(e) {
    let a = this._stepExplicit ? 1 : 10;
    return e.shiftKey ? a *= 10 : e.altKey && (a /= 10), a;
  }
  _snap(e) {
    let a = 0;
    return this._hasMin ? a = this._min : this._hasMax && (a = this._max), e -= a, e = Math.round(e / this._step) * this._step, e += a, e = parseFloat(e.toPrecision(15)), e;
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
class $i extends fe {
  constructor(e, a, r, c) {
    super(e, a, r, "option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("display"), this.$select.addEventListener("change", () => {
      this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
    }), this.$select.addEventListener("focus", () => {
      this.$display.classList.add("focus");
    }), this.$select.addEventListener("blur", () => {
      this.$display.classList.remove("focus");
    }), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(c);
  }
  options(e) {
    return this._values = Array.isArray(e) ? e : Object.values(e), this._names = Array.isArray(e) ? e : Object.keys(e), this.$select.replaceChildren(), this._names.forEach((a) => {
      const r = document.createElement("option");
      r.textContent = a, this.$select.appendChild(r);
    }), this.updateDisplay(), this;
  }
  updateDisplay() {
    const e = this.getValue(), a = this._values.indexOf(e);
    return this.$select.selectedIndex = a, this.$display.textContent = a === -1 ? e : this._names[a], this;
  }
}
class Li extends fe {
  constructor(e, a, r) {
    super(e, a, r, "string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
      this.setValue(this.$input.value);
    }), this.$input.addEventListener("keydown", (c) => {
      c.code === "Enter" && this.$input.blur();
    }), this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    }), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
  }
  updateDisplay() {
    return this.$input.value = this.getValue(), this;
  }
}
var Mi = `.lil-gui {
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
function ji(t) {
  const e = document.createElement("style");
  e.innerHTML = t;
  const a = document.querySelector("head link[rel=stylesheet], head style");
  a ? document.head.insertBefore(e, a) : document.head.appendChild(e);
}
let hr = !1;
class mt {
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
    autoPlace: a = e === void 0,
    container: r,
    width: c,
    title: d = "Controls",
    closeFolders: p = !1,
    injectStyles: u = !0,
    touchStyles: o = !0
  } = {}) {
    if (this.parent = e, this.root = e ? e.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {
    }, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(d), this.parent) {
      this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root"), o && this.domElement.classList.add("allow-touch-styles"), !hr && u && (ji(Mi), hr = !0), r ? r.appendChild(this.domElement) : a && (this.domElement.classList.add("autoPlace"), document.body.appendChild(this.domElement)), c && this.domElement.style.setProperty("--width", c + "px"), this._closeFolders = p;
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
  add(e, a, r, c, d) {
    if (Object(r) === r)
      return new $i(this, e, a, r);
    const p = e[a];
    switch (typeof p) {
      case "number":
        return new Ii(this, e, a, r, c, d);
      case "boolean":
        return new Ri(this, e, a);
      case "string":
        return new Li(this, e, a);
      case "function":
        return new lt(this, e, a);
    }
    console.error(`gui.add failed
	property:`, a, `
	object:`, e, `
	value:`, p);
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
  addColor(e, a, r = 1) {
    return new Di(this, e, a, r);
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
    const a = new mt({ parent: this, title: e });
    return this.root._closeFolders && a.close(), a;
  }
  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(e, a = !0) {
    return e.controllers && this.controllers.forEach((r) => {
      r instanceof lt || r._name in e.controllers && r.load(e.controllers[r._name]);
    }), a && e.folders && this.folders.forEach((r) => {
      r._title in e.folders && r.load(e.folders[r._title]);
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
    const a = {
      controllers: {},
      folders: {}
    };
    return this.controllers.forEach((r) => {
      if (!(r instanceof lt)) {
        if (r._name in a.controllers)
          throw new Error(`Cannot save GUI with duplicate property "${r._name}"`);
        a.controllers[r._name] = r.save();
      }
    }), e && this.folders.forEach((r) => {
      if (r._title in a.folders)
        throw new Error(`Cannot save GUI with duplicate folder "${r._title}"`);
      a.folders[r._title] = r.save();
    }), a;
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
      const a = this.$children.clientHeight;
      this.$children.style.height = a + "px", this.domElement.classList.add("transition");
      const r = (d) => {
        d.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("transition"), this.$children.removeEventListener("transitionend", r));
      };
      this.$children.addEventListener("transitionend", r);
      const c = e ? this.$children.scrollHeight : 0;
      this.domElement.classList.toggle("closed", !e), requestAnimationFrame(() => {
        this.$children.style.height = c + "px";
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
    return (e ? this.controllersRecursive() : this.controllers).forEach((r) => r.reset()), this;
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
    return this.folders.forEach((a) => {
      e = e.concat(a.controllersRecursive());
    }), e;
  }
  /**
   * Returns an array of folders contained by this GUI and its descendents.
   * @returns {GUI[]}
   */
  foldersRecursive() {
    let e = Array.from(this.folders);
    return this.folders.forEach((a) => {
      e = e.concat(a.foldersRecursive());
    }), e;
  }
}
const Fi = function({
  app: e,
  onError: a
}) {
  const r = he(), c = he(null), d = he(null), p = he(!1), u = he(), [o, s] = Ye(!0), l = he(), h = he(), b = ut(() => {
    const w = c.current;
    if (w) {
      const _ = window.devicePixelRatio;
      return w.width = Math.max(w.offsetWidth * _, 1), w.height = Math.max(w.offsetHeight * _, 1), clearTimeout(l.current), l.current = setTimeout(() => {
        var A;
        try {
          if (w.width <= 1 || w.height <= 1) {
            p.current = !0, console.log("Hibernate");
            return;
          }
          p.current = !1, (A = e.handleResize) == null || A.call(e, w.width, w.height);
        } catch (g) {
          a(g);
        }
      }, 500), () => {
        clearTimeout(l.current);
      };
    }
  }, [e, a]);
  je(() => (b(), window.addEventListener("resize", b), () => {
    window.removeEventListener("resize", b);
  }), [b]);
  const R = ut(
    (w) => {
      var A;
      const _ = (A = c.current) == null ? void 0 : A.getContext("webgpu");
      if (_) {
        const g = w - (h.current ?? 0);
        h.current = w;
        const v = _.getCurrentTexture();
        try {
          p.current || e.draw(
            v,
            c.current.width / c.current.height,
            w,
            g
          );
        } catch (S) {
          a(S);
        }
        e.quit || (r.current = requestAnimationFrame(R));
      }
    },
    [e, a]
  );
  return je(() => {
    var A, g, v;
    const w = (A = c.current) == null ? void 0 : A.getContext("webgpu");
    if (u.current && ((g = u.current) == null || g.destroy()), u.current = new mt({ container: d.current }), e.setLowPerformanceMode && u.current.add({ checked: !1 }, "checked").onChange((S) => {
      var D;
      (D = e.setLowPerformanceMode) == null || D.call(e, S);
    }).name("Low Performance Mode"), e.setupUI) {
      u.current.onOpenClose((S) => {
        S == u.current && s(!S._closed);
      });
      try {
        e.setupUI(u.current);
      } catch (S) {
        a(S);
      }
    }
    if (!w) {
      console.error("'webgpu' canvas context not found, cannot animate.");
      return;
    }
    w.configure(e.presentationInterface()), r.current = requestAnimationFrame(R);
    const _ = c.current;
    return _ && ((v = e.handleResize) == null || v.call(e, _.width, _.height)), () => {
      r.current !== void 0 && cancelAnimationFrame(r.current);
    };
  }, [R, e, s, a]), je(() => {
    b();
  }, [b, o]), /* @__PURE__ */ te.jsxs(te.Fragment, { children: [
    /* @__PURE__ */ te.jsx("div", { className: "webgpu-samples-canvas-container", children: /* @__PURE__ */ te.jsx("canvas", { className: "webgpu-samples-canvas", ref: c }) }),
    /* @__PURE__ */ te.jsx(
      "div",
      {
        className: o ? void 0 : "webgpu-samples-gui-floating",
        ref: d
      }
    ),
    void 0
  ] });
}, zi = function({
  sampleID: e,
  styleOverrides: a
}) {
  const [r, c] = Ye(), d = he(), p = he(), [u, o] = Ye(!1), s = ut(
    (R) => {
      console.error(R), R instanceof Error ? c([
        R.message,
        ...typeof R.cause == "string" ? [R.cause] : []
      ]) : c(["Failed to initialize app."]);
    },
    [c]
  ), l = Rr.get(e);
  je(() => {
    if (l === void 0) {
      c(["No such sample, please navigate to another page."]), o(!0);
      return;
    }
    if (!("gpu" in navigator)) {
      c([
        "WebGPU is not available in this browser.",
        "navigator.gpu is null"
      ]), o(!0);
      return;
    }
    o(!1), c(void 0);
    let R = !0;
    return p.current = Ci({
      gpu: navigator.gpu,
      requiredLimits: l.requiredLimits,
      requiredFeatures: l.requiredFeatures,
      optionalFeatures: l.optionalFeatures,
      import: l.import,
      onUncapturedError: (w) => {
        console.error(`WebGPU device uncaptured error: ${w.error.message}`), c(["WebGPU has encountered an error, causing it to crash."]);
      }
    }).then((w) => {
      R && (d.current = w);
    }).catch((w) => {
      R && s(w);
    }).finally(() => {
      R && (p.current = void 0, o(!0));
    }), () => {
      var w, _;
      R = !1, (_ = (w = d.current) == null ? void 0 : w.destroy) == null || _.call(w);
    };
  }, [l, s]);
  const h = /* @__PURE__ */ te.jsxs("div", { className: "webgpu-samples-info", children: [
    /* @__PURE__ */ te.jsx("p", { children: `Sorry, there was an issue, cause the sample to fail to load or crash.
            This app uses WebGPU, which can be unstable on some browsers.
            Try updating or using another browser.` }),
    /* @__PURE__ */ te.jsx("ol", { className: "webgpu-samples-error", children: r == null ? void 0 : r.map((R) => /* @__PURE__ */ te.jsx("li", { children: R }, R)) })
  ] }), b = /* @__PURE__ */ te.jsx("div", { className: "webgpu-samples-info", children: /* @__PURE__ */ te.jsx("p", { children: "Loading..." }) });
  return navigator.gpu === void 0 ? /* @__PURE__ */ te.jsx("div", { className: "webgpu-samples-info", children: /* @__PURE__ */ te.jsx("p", { children: "Your browser does not support WebGPU. Please try another." }) }) : /* @__PURE__ */ te.jsx("div", { className: "webgpu-samples-app-loader", style: a, children: u ? /* @__PURE__ */ te.jsx(te.Fragment, { children: r !== void 0 ? h : /* @__PURE__ */ te.jsx(Fi, { app: d.current, onError: s }) }) : b });
};
export {
  zi as AppLoader,
  Cr as DefaultSampleID,
  Vi as EmbeddedReadme,
  Ui as SampleDisplayDescriptorByID,
  qi as SampleIDs
};
