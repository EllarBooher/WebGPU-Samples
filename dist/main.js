import React2, { memo, useState, useEffect, useRef, useCallback } from "react";
import { NavLink, Link } from "react-router";
const __variableDynamicImportRuntimeHelper = (glob, path, segs) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(
      reject.bind(
        null,
        new Error(
          "Unknown variable dynamic import: " + path + (path.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : "")
        )
      )
    );
  });
};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f = React2, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  return reactJsxRuntime_production_min;
}
var reactJsxRuntime_development = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_development;
function requireReactJsxRuntime_development() {
  if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
  hasRequiredReactJsxRuntime_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var React = React2;
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame2.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for("react.module.reference");
      }
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
          // types supported by any Flight configuration anywhere since
          // we don't know which Flight build this will end up being used
          // with.
          type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== void 0) {
            return true;
          }
        }
        return false;
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || "";
        return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentNameFromType(type) {
        if (type == null) {
          return null;
        }
        {
          if (typeof type.tag === "number") {
            error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
          }
        }
        if (typeof type === "function") {
          return type.displayName || type.name || null;
        }
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return getComponentNameFromType(init(payload));
              } catch (x) {
                return null;
              }
            }
          }
        }
        return null;
      }
      var assign = Object.assign;
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            };
            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          if (disabledDepth < 0) {
            error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
          }
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === void 0) {
            try {
              throw Error();
            } catch (x) {
              var match = x.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          }
          return "\n" + prefix + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry) {
          return "";
        }
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== void 0) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = void 0;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x) {
                control = x;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x) {
                control = x;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x) {
              control = x;
            }
            fn();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === "string") {
            var sampleLines = sample.stack.split("\n");
            var controlLines = control.stack.split("\n");
            var s = sampleLines.length - 1;
            var c = controlLines.length - 1;
            while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
              c--;
            }
            for (; s >= 1 && c >= 0; s--, c--) {
              if (sampleLines[s] !== controlLines[c]) {
                if (s !== 1 || c !== 1) {
                  do {
                    s--;
                    c--;
                    if (c < 0 || sampleLines[s] !== controlLines[c]) {
                      var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                      if (fn.displayName && _frame.includes("<anonymous>")) {
                        _frame = _frame.replace("<anonymous>", fn.displayName);
                      }
                      {
                        if (typeof fn === "function") {
                          componentFrameCache.set(fn, _frame);
                        }
                      }
                      return _frame;
                    }
                  } while (s >= 1 && c >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : "";
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        {
          if (typeof fn === "function") {
            componentFrameCache.set(fn, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn, false);
        }
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return "";
        }
        if (typeof type === "function") {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === "string") {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x) {
              }
            }
          }
        }
        return "";
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          var has2 = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has2(typeSpecs, typeSpecName)) {
              var error$1 = void 0;
              try {
                if (typeof typeSpecs[typeSpecName] !== "function") {
                  var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  err.name = "Invariant Violation";
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error("Failed %s type: %s", location, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      function typeName(value) {
        {
          var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return type;
        }
      }
      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown;
      var specialPropRefWarningShown;
      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, "ref")) {
            var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== void 0;
      }
      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== void 0;
      }
      function warnIfStringRefCannotBeAutoConverted(config, self) {
        {
          if (typeof config.ref === "string" && ReactCurrentOwner.current && self) ;
        }
      }
      function defineKeyPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingKey = function() {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
      }
      function defineRefPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingRef = function() {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, "ref", {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
      }
      var ReactElement = function(type, key, ref, self, source, owner, props) {
        var element = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type,
          key,
          ref,
          props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
        {
          element._store = {};
          Object.defineProperty(element._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          });
          Object.defineProperty(element, "_self", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          });
          Object.defineProperty(element, "_source", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      };
      function jsxDEV(type, config, maybeKey, source, self) {
        {
          var propName;
          var props = {};
          var key = null;
          var ref = null;
          if (maybeKey !== void 0) {
            {
              checkKeyStringCoercion(maybeKey);
            }
            key = "" + maybeKey;
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = "" + config.key;
          }
          if (hasValidRef(config)) {
            ref = config.ref;
            warnIfStringRefCannotBeAutoConverted(config, self);
          }
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          }
          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === void 0) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          if (key || ref) {
            var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
      }
      var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame$1.setExtraStackFrame(null);
          }
        }
      }
      var propTypesMisspellWarningShown;
      {
        propTypesMisspellWarningShown = false;
      }
      function isValidElement(object) {
        {
          return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
      }
      function getDeclarationErrorAddendum() {
        {
          if (ReactCurrentOwner$1.current) {
            var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
            if (name) {
              return "\n\nCheck the render method of `" + name + "`.";
            }
          }
          return "";
        }
      }
      function getSourceInfoErrorAddendum(source) {
        {
          return "";
        }
      }
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
      }
      function validateExplicitKey(element, parentType) {
        {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
          var childOwner = "";
          if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          setCurrentlyValidatingElement$1(element);
          error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
          setCurrentlyValidatingElement$1(null);
        }
      }
      function validateChildKeys(node2, parentType) {
        {
          if (typeof node2 !== "object") {
            return;
          }
          if (isArray(node2)) {
            for (var i = 0; i < node2.length; i++) {
              var child = node2[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node2)) {
            if (node2._store) {
              node2._store.validated = true;
            }
          } else if (node2) {
            var iteratorFn = getIteratorFn(node2);
            if (typeof iteratorFn === "function") {
              if (iteratorFn !== node2.entries) {
                var iterator = iteratorFn.call(node2);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
      }
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type === null || type === void 0 || typeof type === "string") {
            return;
          }
          var propTypes;
          if (typeof type === "function") {
            propTypes = type.propTypes;
          } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          type.$$typeof === REACT_MEMO_TYPE)) {
            propTypes = type.propTypes;
          } else {
            return;
          }
          if (propTypes) {
            var name = getComponentNameFromType(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== void 0 && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var _name = getComponentNameFromType(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
          }
        }
      }
      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement$1(fragment);
              error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
              setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          if (fragment.ref !== null) {
            setCurrentlyValidatingElement$1(fragment);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement$1(null);
          }
        }
      }
      var didWarnAboutKeySpread = {};
      function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
        {
          var validType = isValidElementType(type);
          if (!validType) {
            var info = "";
            if (type === void 0 || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
              info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendum();
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = "null";
            } else if (isArray(type)) {
              typeString = "array";
            } else if (type !== void 0 && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
              info = " Did you accidentally export a JSX literal instead of a component?";
            } else {
              typeString = typeof type;
            }
            error("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
          }
          var element = jsxDEV(type, props, key, source, self);
          if (element == null) {
            return element;
          }
          if (validType) {
            var children = props.children;
            if (children !== void 0) {
              if (isStaticChildren) {
                if (isArray(children)) {
                  for (var i = 0; i < children.length; i++) {
                    validateChildKeys(children[i], type);
                  }
                  if (Object.freeze) {
                    Object.freeze(children);
                  }
                } else {
                  error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
                }
              } else {
                validateChildKeys(children, type);
              }
            }
          }
          {
            if (hasOwnProperty.call(props, "key")) {
              var componentName = getComponentNameFromType(type);
              var keys = Object.keys(props).filter(function(k) {
                return k !== "key";
              });
              var beforeExample = keys.length > 0 ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
              if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                var afterExample = keys.length > 0 ? "{" + keys.join(": ..., ") + ": ...}" : "{}";
                error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                didWarnAboutKeySpread[componentName + beforeExample] = true;
              }
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
      }
      function jsxWithValidationStatic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, true);
        }
      }
      function jsxWithValidationDynamic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, false);
        }
      }
      var jsx = jsxWithValidationDynamic;
      var jsxs = jsxWithValidationStatic;
      reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
      reactJsxRuntime_development.jsx = jsx;
      reactJsxRuntime_development.jsxs = jsxs;
    })();
  }
  return reactJsxRuntime_development;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime) return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  if (process.env.NODE_ENV === "production") {
    jsxRuntime.exports = requireReactJsxRuntime_production_min();
  } else {
    jsxRuntime.exports = requireReactJsxRuntime_development();
  }
  return jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime();
var lib$3 = {};
var htmlToDom = {};
var domparser = {};
var utilities$2 = {};
var lib$2 = {};
var lib$1 = {};
var hasRequiredLib$3;
function requireLib$3() {
  if (hasRequiredLib$3) return lib$1;
  hasRequiredLib$3 = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
    var ElementType;
    (function(ElementType2) {
      ElementType2["Root"] = "root";
      ElementType2["Text"] = "text";
      ElementType2["Directive"] = "directive";
      ElementType2["Comment"] = "comment";
      ElementType2["Script"] = "script";
      ElementType2["Style"] = "style";
      ElementType2["Tag"] = "tag";
      ElementType2["CDATA"] = "cdata";
      ElementType2["Doctype"] = "doctype";
    })(ElementType = exports.ElementType || (exports.ElementType = {}));
    function isTag(elem) {
      return elem.type === ElementType.Tag || elem.type === ElementType.Script || elem.type === ElementType.Style;
    }
    exports.isTag = isTag;
    exports.Root = ElementType.Root;
    exports.Text = ElementType.Text;
    exports.Directive = ElementType.Directive;
    exports.Comment = ElementType.Comment;
    exports.Script = ElementType.Script;
    exports.Style = ElementType.Style;
    exports.Tag = ElementType.Tag;
    exports.CDATA = ElementType.CDATA;
    exports.Doctype = ElementType.Doctype;
  })(lib$1);
  return lib$1;
}
var node = {};
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return node;
  hasRequiredNode = 1;
  var __extends = node && node.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __assign2 = node && node.__assign || function() {
    __assign2 = Object.assign || function(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
          t[p] = s[p];
      }
      return t;
    };
    return __assign2.apply(this, arguments);
  };
  Object.defineProperty(node, "__esModule", { value: true });
  node.cloneNode = node.hasChildren = node.isDocument = node.isDirective = node.isComment = node.isText = node.isCDATA = node.isTag = node.Element = node.Document = node.CDATA = node.NodeWithChildren = node.ProcessingInstruction = node.Comment = node.Text = node.DataNode = node.Node = void 0;
  var domelementtype_1 = /* @__PURE__ */ requireLib$3();
  var Node = (
    /** @class */
    function() {
      function Node2() {
        this.parent = null;
        this.prev = null;
        this.next = null;
        this.startIndex = null;
        this.endIndex = null;
      }
      Object.defineProperty(Node2.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.parent;
        },
        set: function(parent) {
          this.parent = parent;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Node2.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.prev;
        },
        set: function(prev) {
          this.prev = prev;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Node2.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.next;
        },
        set: function(next) {
          this.next = next;
        },
        enumerable: false,
        configurable: true
      });
      Node2.prototype.cloneNode = function(recursive) {
        if (recursive === void 0) {
          recursive = false;
        }
        return cloneNode(this, recursive);
      };
      return Node2;
    }()
  );
  node.Node = Node;
  var DataNode = (
    /** @class */
    function(_super) {
      __extends(DataNode2, _super);
      function DataNode2(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
      }
      Object.defineProperty(DataNode2.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.data;
        },
        set: function(data) {
          this.data = data;
        },
        enumerable: false,
        configurable: true
      });
      return DataNode2;
    }(Node)
  );
  node.DataNode = DataNode;
  var Text = (
    /** @class */
    function(_super) {
      __extends(Text2, _super);
      function Text2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Text;
        return _this;
      }
      Object.defineProperty(Text2.prototype, "nodeType", {
        get: function() {
          return 3;
        },
        enumerable: false,
        configurable: true
      });
      return Text2;
    }(DataNode)
  );
  node.Text = Text;
  var Comment = (
    /** @class */
    function(_super) {
      __extends(Comment2, _super);
      function Comment2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Comment;
        return _this;
      }
      Object.defineProperty(Comment2.prototype, "nodeType", {
        get: function() {
          return 8;
        },
        enumerable: false,
        configurable: true
      });
      return Comment2;
    }(DataNode)
  );
  node.Comment = Comment;
  var ProcessingInstruction = (
    /** @class */
    function(_super) {
      __extends(ProcessingInstruction2, _super);
      function ProcessingInstruction2(name, data) {
        var _this = _super.call(this, data) || this;
        _this.name = name;
        _this.type = domelementtype_1.ElementType.Directive;
        return _this;
      }
      Object.defineProperty(ProcessingInstruction2.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: false,
        configurable: true
      });
      return ProcessingInstruction2;
    }(DataNode)
  );
  node.ProcessingInstruction = ProcessingInstruction;
  var NodeWithChildren = (
    /** @class */
    function(_super) {
      __extends(NodeWithChildren2, _super);
      function NodeWithChildren2(children) {
        var _this = _super.call(this) || this;
        _this.children = children;
        return _this;
      }
      Object.defineProperty(NodeWithChildren2.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function() {
          var _a;
          return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(NodeWithChildren2.prototype, "lastChild", {
        /** Last child of the node. */
        get: function() {
          return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(NodeWithChildren2.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.children;
        },
        set: function(children) {
          this.children = children;
        },
        enumerable: false,
        configurable: true
      });
      return NodeWithChildren2;
    }(Node)
  );
  node.NodeWithChildren = NodeWithChildren;
  var CDATA = (
    /** @class */
    function(_super) {
      __extends(CDATA2, _super);
      function CDATA2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.CDATA;
        return _this;
      }
      Object.defineProperty(CDATA2.prototype, "nodeType", {
        get: function() {
          return 4;
        },
        enumerable: false,
        configurable: true
      });
      return CDATA2;
    }(NodeWithChildren)
  );
  node.CDATA = CDATA;
  var Document = (
    /** @class */
    function(_super) {
      __extends(Document2, _super);
      function Document2() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = domelementtype_1.ElementType.Root;
        return _this;
      }
      Object.defineProperty(Document2.prototype, "nodeType", {
        get: function() {
          return 9;
        },
        enumerable: false,
        configurable: true
      });
      return Document2;
    }(NodeWithChildren)
  );
  node.Document = Document;
  var Element = (
    /** @class */
    function(_super) {
      __extends(Element2, _super);
      function Element2(name, attribs, children, type) {
        if (children === void 0) {
          children = [];
        }
        if (type === void 0) {
          type = name === "script" ? domelementtype_1.ElementType.Script : name === "style" ? domelementtype_1.ElementType.Style : domelementtype_1.ElementType.Tag;
        }
        var _this = _super.call(this, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        _this.type = type;
        return _this;
      }
      Object.defineProperty(Element2.prototype, "nodeType", {
        get: function() {
          return 1;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Element2.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function() {
          return this.name;
        },
        set: function(name) {
          this.name = name;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Element2.prototype, "attributes", {
        get: function() {
          var _this = this;
          return Object.keys(this.attribs).map(function(name) {
            var _a, _b;
            return {
              name,
              value: _this.attribs[name],
              namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
              prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
            };
          });
        },
        enumerable: false,
        configurable: true
      });
      return Element2;
    }(NodeWithChildren)
  );
  node.Element = Element;
  function isTag(node2) {
    return (0, domelementtype_1.isTag)(node2);
  }
  node.isTag = isTag;
  function isCDATA(node2) {
    return node2.type === domelementtype_1.ElementType.CDATA;
  }
  node.isCDATA = isCDATA;
  function isText(node2) {
    return node2.type === domelementtype_1.ElementType.Text;
  }
  node.isText = isText;
  function isComment(node2) {
    return node2.type === domelementtype_1.ElementType.Comment;
  }
  node.isComment = isComment;
  function isDirective(node2) {
    return node2.type === domelementtype_1.ElementType.Directive;
  }
  node.isDirective = isDirective;
  function isDocument(node2) {
    return node2.type === domelementtype_1.ElementType.Root;
  }
  node.isDocument = isDocument;
  function hasChildren(node2) {
    return Object.prototype.hasOwnProperty.call(node2, "children");
  }
  node.hasChildren = hasChildren;
  function cloneNode(node2, recursive) {
    if (recursive === void 0) {
      recursive = false;
    }
    var result;
    if (isText(node2)) {
      result = new Text(node2.data);
    } else if (isComment(node2)) {
      result = new Comment(node2.data);
    } else if (isTag(node2)) {
      var children = recursive ? cloneChildren(node2.children) : [];
      var clone_1 = new Element(node2.name, __assign2({}, node2.attribs), children);
      children.forEach(function(child) {
        return child.parent = clone_1;
      });
      if (node2.namespace != null) {
        clone_1.namespace = node2.namespace;
      }
      if (node2["x-attribsNamespace"]) {
        clone_1["x-attribsNamespace"] = __assign2({}, node2["x-attribsNamespace"]);
      }
      if (node2["x-attribsPrefix"]) {
        clone_1["x-attribsPrefix"] = __assign2({}, node2["x-attribsPrefix"]);
      }
      result = clone_1;
    } else if (isCDATA(node2)) {
      var children = recursive ? cloneChildren(node2.children) : [];
      var clone_2 = new CDATA(children);
      children.forEach(function(child) {
        return child.parent = clone_2;
      });
      result = clone_2;
    } else if (isDocument(node2)) {
      var children = recursive ? cloneChildren(node2.children) : [];
      var clone_3 = new Document(children);
      children.forEach(function(child) {
        return child.parent = clone_3;
      });
      if (node2["x-mode"]) {
        clone_3["x-mode"] = node2["x-mode"];
      }
      result = clone_3;
    } else if (isDirective(node2)) {
      var instruction = new ProcessingInstruction(node2.name, node2.data);
      if (node2["x-name"] != null) {
        instruction["x-name"] = node2["x-name"];
        instruction["x-publicId"] = node2["x-publicId"];
        instruction["x-systemId"] = node2["x-systemId"];
      }
      result = instruction;
    } else {
      throw new Error("Not implemented yet: ".concat(node2.type));
    }
    result.startIndex = node2.startIndex;
    result.endIndex = node2.endIndex;
    if (node2.sourceCodeLocation != null) {
      result.sourceCodeLocation = node2.sourceCodeLocation;
    }
    return result;
  }
  node.cloneNode = cloneNode;
  function cloneChildren(childs) {
    var children = childs.map(function(child) {
      return cloneNode(child, true);
    });
    for (var i = 1; i < children.length; i++) {
      children[i].prev = children[i - 1];
      children[i - 1].next = children[i];
    }
    return children;
  }
  return node;
}
var hasRequiredLib$2;
function requireLib$2() {
  if (hasRequiredLib$2) return lib$2;
  hasRequiredLib$2 = 1;
  (function(exports) {
    var __createBinding = lib$2 && lib$2.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = lib$2 && lib$2.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DomHandler = void 0;
    var domelementtype_1 = /* @__PURE__ */ requireLib$3();
    var node_js_1 = /* @__PURE__ */ requireNode();
    __exportStar(/* @__PURE__ */ requireNode(), exports);
    var defaultOpts = {
      withStartIndices: false,
      withEndIndices: false,
      xmlMode: false
    };
    var DomHandler = (
      /** @class */
      function() {
        function DomHandler2(callback, options, elementCB) {
          this.dom = [];
          this.root = new node_js_1.Document(this.dom);
          this.done = false;
          this.tagStack = [this.root];
          this.lastNode = null;
          this.parser = null;
          if (typeof options === "function") {
            elementCB = options;
            options = defaultOpts;
          }
          if (typeof callback === "object") {
            options = callback;
            callback = void 0;
          }
          this.callback = callback !== null && callback !== void 0 ? callback : null;
          this.options = options !== null && options !== void 0 ? options : defaultOpts;
          this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
        }
        DomHandler2.prototype.onparserinit = function(parser) {
          this.parser = parser;
        };
        DomHandler2.prototype.onreset = function() {
          this.dom = [];
          this.root = new node_js_1.Document(this.dom);
          this.done = false;
          this.tagStack = [this.root];
          this.lastNode = null;
          this.parser = null;
        };
        DomHandler2.prototype.onend = function() {
          if (this.done)
            return;
          this.done = true;
          this.parser = null;
          this.handleCallback(null);
        };
        DomHandler2.prototype.onerror = function(error) {
          this.handleCallback(error);
        };
        DomHandler2.prototype.onclosetag = function() {
          this.lastNode = null;
          var elem = this.tagStack.pop();
          if (this.options.withEndIndices) {
            elem.endIndex = this.parser.endIndex;
          }
          if (this.elementCB)
            this.elementCB(elem);
        };
        DomHandler2.prototype.onopentag = function(name, attribs) {
          var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : void 0;
          var element = new node_js_1.Element(name, attribs, void 0, type);
          this.addNode(element);
          this.tagStack.push(element);
        };
        DomHandler2.prototype.ontext = function(data) {
          var lastNode = this.lastNode;
          if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
            lastNode.data += data;
            if (this.options.withEndIndices) {
              lastNode.endIndex = this.parser.endIndex;
            }
          } else {
            var node2 = new node_js_1.Text(data);
            this.addNode(node2);
            this.lastNode = node2;
          }
        };
        DomHandler2.prototype.oncomment = function(data) {
          if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
            this.lastNode.data += data;
            return;
          }
          var node2 = new node_js_1.Comment(data);
          this.addNode(node2);
          this.lastNode = node2;
        };
        DomHandler2.prototype.oncommentend = function() {
          this.lastNode = null;
        };
        DomHandler2.prototype.oncdatastart = function() {
          var text = new node_js_1.Text("");
          var node2 = new node_js_1.CDATA([text]);
          this.addNode(node2);
          text.parent = node2;
          this.lastNode = text;
        };
        DomHandler2.prototype.oncdataend = function() {
          this.lastNode = null;
        };
        DomHandler2.prototype.onprocessinginstruction = function(name, data) {
          var node2 = new node_js_1.ProcessingInstruction(name, data);
          this.addNode(node2);
        };
        DomHandler2.prototype.handleCallback = function(error) {
          if (typeof this.callback === "function") {
            this.callback(error, this.dom);
          } else if (error) {
            throw error;
          }
        };
        DomHandler2.prototype.addNode = function(node2) {
          var parent = this.tagStack[this.tagStack.length - 1];
          var previousSibling = parent.children[parent.children.length - 1];
          if (this.options.withStartIndices) {
            node2.startIndex = this.parser.startIndex;
          }
          if (this.options.withEndIndices) {
            node2.endIndex = this.parser.endIndex;
          }
          parent.children.push(node2);
          if (previousSibling) {
            node2.prev = previousSibling;
            previousSibling.next = node2;
          }
          node2.parent = parent;
          this.lastNode = null;
        };
        return DomHandler2;
      }()
    );
    exports.DomHandler = DomHandler;
    exports.default = DomHandler;
  })(lib$2);
  return lib$2;
}
var constants = {};
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CARRIAGE_RETURN_PLACEHOLDER_REGEX = exports.CARRIAGE_RETURN_PLACEHOLDER = exports.CARRIAGE_RETURN_REGEX = exports.CARRIAGE_RETURN = exports.CASE_SENSITIVE_TAG_NAMES_MAP = exports.CASE_SENSITIVE_TAG_NAMES = void 0;
    exports.CASE_SENSITIVE_TAG_NAMES = [
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
    ];
    exports.CASE_SENSITIVE_TAG_NAMES_MAP = exports.CASE_SENSITIVE_TAG_NAMES.reduce(function(accumulator, tagName) {
      accumulator[tagName.toLowerCase()] = tagName;
      return accumulator;
    }, {});
    exports.CARRIAGE_RETURN = "\r";
    exports.CARRIAGE_RETURN_REGEX = new RegExp(exports.CARRIAGE_RETURN, "g");
    exports.CARRIAGE_RETURN_PLACEHOLDER = "__HTML_DOM_PARSER_CARRIAGE_RETURN_PLACEHOLDER_".concat(Date.now(), "__");
    exports.CARRIAGE_RETURN_PLACEHOLDER_REGEX = new RegExp(exports.CARRIAGE_RETURN_PLACEHOLDER, "g");
  })(constants);
  return constants;
}
var hasRequiredUtilities$2;
function requireUtilities$2() {
  if (hasRequiredUtilities$2) return utilities$2;
  hasRequiredUtilities$2 = 1;
  Object.defineProperty(utilities$2, "__esModule", { value: true });
  utilities$2.formatAttributes = formatAttributes;
  utilities$2.escapeSpecialCharacters = escapeSpecialCharacters;
  utilities$2.revertEscapedCharacters = revertEscapedCharacters;
  utilities$2.formatDOM = formatDOM;
  var domhandler_1 = /* @__PURE__ */ requireLib$2();
  var constants_1 = requireConstants();
  function getCaseSensitiveTagName(tagName) {
    return constants_1.CASE_SENSITIVE_TAG_NAMES_MAP[tagName];
  }
  function formatAttributes(attributes) {
    var map = {};
    var index = 0;
    var attributesLength = attributes.length;
    for (; index < attributesLength; index++) {
      var attribute = attributes[index];
      map[attribute.name] = attribute.value;
    }
    return map;
  }
  function formatTagName(tagName) {
    tagName = tagName.toLowerCase();
    var caseSensitiveTagName = getCaseSensitiveTagName(tagName);
    if (caseSensitiveTagName) {
      return caseSensitiveTagName;
    }
    return tagName;
  }
  function escapeSpecialCharacters(html) {
    return html.replace(constants_1.CARRIAGE_RETURN_REGEX, constants_1.CARRIAGE_RETURN_PLACEHOLDER);
  }
  function revertEscapedCharacters(text) {
    return text.replace(constants_1.CARRIAGE_RETURN_PLACEHOLDER_REGEX, constants_1.CARRIAGE_RETURN);
  }
  function formatDOM(nodes, parent, directive) {
    if (parent === void 0) {
      parent = null;
    }
    var domNodes = [];
    var current;
    var index = 0;
    var nodesLength = nodes.length;
    for (; index < nodesLength; index++) {
      var node2 = nodes[index];
      switch (node2.nodeType) {
        case 1: {
          var tagName = formatTagName(node2.nodeName);
          current = new domhandler_1.Element(tagName, formatAttributes(node2.attributes));
          current.children = formatDOM(
            // template children are on content
            tagName === "template" ? node2.content.childNodes : node2.childNodes,
            current
          );
          break;
        }
        case 3:
          current = new domhandler_1.Text(revertEscapedCharacters(node2.nodeValue));
          break;
        case 8:
          current = new domhandler_1.Comment(node2.nodeValue);
          break;
        default:
          continue;
      }
      var prev = domNodes[index - 1] || null;
      if (prev) {
        prev.next = current;
      }
      current.parent = parent;
      current.prev = prev;
      current.next = null;
      domNodes.push(current);
    }
    if (directive) {
      current = new domhandler_1.ProcessingInstruction(directive.substring(0, directive.indexOf(" ")).toLowerCase(), directive);
      current.next = domNodes[0] || null;
      current.parent = parent;
      domNodes.unshift(current);
      if (domNodes[1]) {
        domNodes[1].prev = domNodes[0];
      }
    }
    return domNodes;
  }
  return utilities$2;
}
var hasRequiredDomparser;
function requireDomparser() {
  if (hasRequiredDomparser) return domparser;
  hasRequiredDomparser = 1;
  Object.defineProperty(domparser, "__esModule", { value: true });
  domparser.default = domparser$1;
  var utilities_1 = requireUtilities$2();
  var HTML = "html";
  var HEAD = "head";
  var BODY = "body";
  var FIRST_TAG_REGEX = /<([a-zA-Z]+[0-9]?)/;
  var HEAD_TAG_REGEX = /<head[^]*>/i;
  var BODY_TAG_REGEX = /<body[^]*>/i;
  var parseFromDocument = function(html, tagName) {
    throw new Error("This browser does not support `document.implementation.createHTMLDocument`");
  };
  var parseFromString = function(html, tagName) {
    throw new Error("This browser does not support `DOMParser.prototype.parseFromString`");
  };
  var DOMParser = typeof window === "object" && window.DOMParser;
  if (typeof DOMParser === "function") {
    var domParser_1 = new DOMParser();
    var mimeType_1 = "text/html";
    parseFromString = function(html, tagName) {
      if (tagName) {
        html = "<".concat(tagName, ">").concat(html, "</").concat(tagName, ">");
      }
      return domParser_1.parseFromString(html, mimeType_1);
    };
    parseFromDocument = parseFromString;
  }
  if (typeof document === "object" && document.implementation) {
    var htmlDocument_1 = document.implementation.createHTMLDocument();
    parseFromDocument = function(html, tagName) {
      if (tagName) {
        var element = htmlDocument_1.documentElement.querySelector(tagName);
        if (element) {
          element.innerHTML = html;
        }
        return htmlDocument_1;
      }
      htmlDocument_1.documentElement.innerHTML = html;
      return htmlDocument_1;
    };
  }
  var template = typeof document === "object" && document.createElement("template");
  var parseFromTemplate;
  if (template && template.content) {
    parseFromTemplate = function(html) {
      template.innerHTML = html;
      return template.content.childNodes;
    };
  }
  function domparser$1(html) {
    var _a, _b;
    html = (0, utilities_1.escapeSpecialCharacters)(html);
    var match = html.match(FIRST_TAG_REGEX);
    var firstTagName = match && match[1] ? match[1].toLowerCase() : "";
    switch (firstTagName) {
      case HTML: {
        var doc = parseFromString(html);
        if (!HEAD_TAG_REGEX.test(html)) {
          var element = doc.querySelector(HEAD);
          (_a = element === null || element === void 0 ? void 0 : element.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(element);
        }
        if (!BODY_TAG_REGEX.test(html)) {
          var element = doc.querySelector(BODY);
          (_b = element === null || element === void 0 ? void 0 : element.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(element);
        }
        return doc.querySelectorAll(HTML);
      }
      case HEAD:
      case BODY: {
        var elements = parseFromDocument(html).querySelectorAll(firstTagName);
        if (BODY_TAG_REGEX.test(html) && HEAD_TAG_REGEX.test(html)) {
          return elements[0].parentNode.childNodes;
        }
        return elements;
      }
      // low-level tag or text
      default: {
        if (parseFromTemplate) {
          return parseFromTemplate(html);
        }
        var element = parseFromDocument(html, BODY).querySelector(BODY);
        return element.childNodes;
      }
    }
  }
  return domparser;
}
var hasRequiredHtmlToDom;
function requireHtmlToDom() {
  if (hasRequiredHtmlToDom) return htmlToDom;
  hasRequiredHtmlToDom = 1;
  var __importDefault = htmlToDom && htmlToDom.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(htmlToDom, "__esModule", { value: true });
  htmlToDom.default = HTMLDOMParser;
  var domparser_1 = __importDefault(requireDomparser());
  var utilities_1 = requireUtilities$2();
  var DIRECTIVE_REGEX = /<(![a-zA-Z\s]+)>/;
  function HTMLDOMParser(html) {
    if (typeof html !== "string") {
      throw new TypeError("First argument must be a string");
    }
    if (!html) {
      return [];
    }
    var match = html.match(DIRECTIVE_REGEX);
    var directive = match ? match[1] : void 0;
    return (0, utilities_1.formatDOM)((0, domparser_1.default)(html), null, directive);
  }
  return htmlToDom;
}
var attributesToProps = {};
var lib = {};
var possibleStandardNamesOptimized = {};
var hasRequiredPossibleStandardNamesOptimized;
function requirePossibleStandardNamesOptimized() {
  if (hasRequiredPossibleStandardNamesOptimized) return possibleStandardNamesOptimized;
  hasRequiredPossibleStandardNamesOptimized = 1;
  var SAME = 0;
  possibleStandardNamesOptimized.SAME = SAME;
  var CAMELCASE = 1;
  possibleStandardNamesOptimized.CAMELCASE = CAMELCASE;
  possibleStandardNamesOptimized.possibleStandardNames = {
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
  };
  return possibleStandardNamesOptimized;
}
var hasRequiredLib$1;
function requireLib$1() {
  if (hasRequiredLib$1) return lib;
  hasRequiredLib$1 = 1;
  const RESERVED = 0;
  const STRING2 = 1;
  const BOOLEANISH_STRING = 2;
  const BOOLEAN = 3;
  const OVERLOADED_BOOLEAN = 4;
  const NUMERIC = 5;
  const POSITIVE_NUMERIC = 6;
  function getPropertyInfo(name) {
    return properties.hasOwnProperty(name) ? properties[name] : null;
  }
  function PropertyInfoRecord(name, type, mustUseProperty, attributeName, attributeNamespace, sanitizeURL, removeEmptyString) {
    this.acceptsBooleans = type === BOOLEANISH_STRING || type === BOOLEAN || type === OVERLOADED_BOOLEAN;
    this.attributeName = attributeName;
    this.attributeNamespace = attributeNamespace;
    this.mustUseProperty = mustUseProperty;
    this.propertyName = name;
    this.type = type;
    this.sanitizeURL = sanitizeURL;
    this.removeEmptyString = removeEmptyString;
  }
  const properties = {};
  const reservedProps = [
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
  ];
  reservedProps.forEach((name) => {
    properties[name] = new PropertyInfoRecord(
      name,
      RESERVED,
      false,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  [
    ["acceptCharset", "accept-charset"],
    ["className", "class"],
    ["htmlFor", "for"],
    ["httpEquiv", "http-equiv"]
  ].forEach(([name, attributeName]) => {
    properties[name] = new PropertyInfoRecord(
      name,
      STRING2,
      false,
      // mustUseProperty
      attributeName,
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach((name) => {
    properties[name] = new PropertyInfoRecord(
      name,
      BOOLEANISH_STRING,
      false,
      // mustUseProperty
      name.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  [
    "autoReverse",
    "externalResourcesRequired",
    "focusable",
    "preserveAlpha"
  ].forEach((name) => {
    properties[name] = new PropertyInfoRecord(
      name,
      BOOLEANISH_STRING,
      false,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  [
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
  ].forEach((name) => {
    properties[name] = new PropertyInfoRecord(
      name,
      BOOLEAN,
      false,
      // mustUseProperty
      name.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  [
    "checked",
    // Note: `option.selected` is not updated if `select.multiple` is
    // disabled with `removeAttribute`. We have special logic for handling this.
    "multiple",
    "muted",
    "selected"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((name) => {
    properties[name] = new PropertyInfoRecord(
      name,
      BOOLEAN,
      true,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  [
    "capture",
    "download"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((name) => {
    properties[name] = new PropertyInfoRecord(
      name,
      OVERLOADED_BOOLEAN,
      false,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  [
    "cols",
    "rows",
    "size",
    "span"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((name) => {
    properties[name] = new PropertyInfoRecord(
      name,
      POSITIVE_NUMERIC,
      false,
      // mustUseProperty
      name,
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  ["rowSpan", "start"].forEach((name) => {
    properties[name] = new PropertyInfoRecord(
      name,
      NUMERIC,
      false,
      // mustUseProperty
      name.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  const CAMELIZE = /[\-\:]([a-z])/g;
  const capitalize = (token) => token[1].toUpperCase();
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
  ].forEach((attributeName) => {
    const name = attributeName.replace(CAMELIZE, capitalize);
    properties[name] = new PropertyInfoRecord(
      name,
      STRING2,
      false,
      // mustUseProperty
      attributeName,
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  [
    "xlink:actuate",
    "xlink:arcrole",
    "xlink:role",
    "xlink:show",
    "xlink:title",
    "xlink:type"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((attributeName) => {
    const name = attributeName.replace(CAMELIZE, capitalize);
    properties[name] = new PropertyInfoRecord(
      name,
      STRING2,
      false,
      // mustUseProperty
      attributeName,
      "http://www.w3.org/1999/xlink",
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  [
    "xml:base",
    "xml:lang",
    "xml:space"
    // NOTE: if you add a camelCased prop to this list,
    // you'll need to set attributeName to name.toLowerCase()
    // instead in the assignment below.
  ].forEach((attributeName) => {
    const name = attributeName.replace(CAMELIZE, capitalize);
    properties[name] = new PropertyInfoRecord(
      name,
      STRING2,
      false,
      // mustUseProperty
      attributeName,
      "http://www.w3.org/XML/1998/namespace",
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  ["tabIndex", "crossOrigin"].forEach((attributeName) => {
    properties[attributeName] = new PropertyInfoRecord(
      attributeName,
      STRING2,
      false,
      // mustUseProperty
      attributeName.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      false,
      // sanitizeURL
      false
      // removeEmptyString
    );
  });
  const xlinkHref = "xlinkHref";
  properties[xlinkHref] = new PropertyInfoRecord(
    "xlinkHref",
    STRING2,
    false,
    // mustUseProperty
    "xlink:href",
    "http://www.w3.org/1999/xlink",
    true,
    // sanitizeURL
    false
    // removeEmptyString
  );
  ["src", "href", "action", "formAction"].forEach((attributeName) => {
    properties[attributeName] = new PropertyInfoRecord(
      attributeName,
      STRING2,
      false,
      // mustUseProperty
      attributeName.toLowerCase(),
      // attributeName
      null,
      // attributeNamespace
      true,
      // sanitizeURL
      true
      // removeEmptyString
    );
  });
  const {
    CAMELCASE,
    SAME,
    possibleStandardNames: possibleStandardNamesOptimized2
  } = requirePossibleStandardNamesOptimized();
  const ATTRIBUTE_NAME_START_CHAR = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  const ATTRIBUTE_NAME_CHAR = ATTRIBUTE_NAME_START_CHAR + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
  const isCustomAttribute = RegExp.prototype.test.bind(
    // eslint-disable-next-line no-misleading-character-class
    new RegExp("^(data|aria)-[" + ATTRIBUTE_NAME_CHAR + "]*$")
  );
  const possibleStandardNames = Object.keys(
    possibleStandardNamesOptimized2
  ).reduce((accumulator, standardName) => {
    const propName = possibleStandardNamesOptimized2[standardName];
    if (propName === SAME) {
      accumulator[standardName] = standardName;
    } else if (propName === CAMELCASE) {
      accumulator[standardName.toLowerCase()] = standardName;
    } else {
      accumulator[standardName] = propName;
    }
    return accumulator;
  }, {});
  lib.BOOLEAN = BOOLEAN;
  lib.BOOLEANISH_STRING = BOOLEANISH_STRING;
  lib.NUMERIC = NUMERIC;
  lib.OVERLOADED_BOOLEAN = OVERLOADED_BOOLEAN;
  lib.POSITIVE_NUMERIC = POSITIVE_NUMERIC;
  lib.RESERVED = RESERVED;
  lib.STRING = STRING2;
  lib.getPropertyInfo = getPropertyInfo;
  lib.isCustomAttribute = isCustomAttribute;
  lib.possibleStandardNames = possibleStandardNames;
  return lib;
}
var utilities$1 = {};
var cjs$1 = {};
var inlineStyleParser;
var hasRequiredInlineStyleParser;
function requireInlineStyleParser() {
  if (hasRequiredInlineStyleParser) return inlineStyleParser;
  hasRequiredInlineStyleParser = 1;
  var COMMENT_REGEX = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
  var NEWLINE_REGEX = /\n/g;
  var WHITESPACE_REGEX = /^\s*/;
  var PROPERTY_REGEX = /^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/;
  var COLON_REGEX = /^:\s*/;
  var VALUE_REGEX = /^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/;
  var SEMICOLON_REGEX = /^[;\s]*/;
  var TRIM_REGEX = /^\s+|\s+$/g;
  var NEWLINE = "\n";
  var FORWARD_SLASH = "/";
  var ASTERISK = "*";
  var EMPTY_STRING = "";
  var TYPE_COMMENT = "comment";
  var TYPE_DECLARATION = "declaration";
  inlineStyleParser = function(style, options) {
    if (typeof style !== "string") {
      throw new TypeError("First argument must be a string");
    }
    if (!style) return [];
    options = options || {};
    var lineno = 1;
    var column = 1;
    function updatePosition(str) {
      var lines = str.match(NEWLINE_REGEX);
      if (lines) lineno += lines.length;
      var i = str.lastIndexOf(NEWLINE);
      column = ~i ? str.length - i : column + str.length;
    }
    function position() {
      var start = { line: lineno, column };
      return function(node2) {
        node2.position = new Position(start);
        whitespace();
        return node2;
      };
    }
    function Position(start) {
      this.start = start;
      this.end = { line: lineno, column };
      this.source = options.source;
    }
    Position.prototype.content = style;
    function error(msg) {
      var err = new Error(
        options.source + ":" + lineno + ":" + column + ": " + msg
      );
      err.reason = msg;
      err.filename = options.source;
      err.line = lineno;
      err.column = column;
      err.source = style;
      if (options.silent) ;
      else {
        throw err;
      }
    }
    function match(re) {
      var m = re.exec(style);
      if (!m) return;
      var str = m[0];
      updatePosition(str);
      style = style.slice(str.length);
      return m;
    }
    function whitespace() {
      match(WHITESPACE_REGEX);
    }
    function comments(rules) {
      var c;
      rules = rules || [];
      while (c = comment()) {
        if (c !== false) {
          rules.push(c);
        }
      }
      return rules;
    }
    function comment() {
      var pos = position();
      if (FORWARD_SLASH != style.charAt(0) || ASTERISK != style.charAt(1)) return;
      var i = 2;
      while (EMPTY_STRING != style.charAt(i) && (ASTERISK != style.charAt(i) || FORWARD_SLASH != style.charAt(i + 1))) {
        ++i;
      }
      i += 2;
      if (EMPTY_STRING === style.charAt(i - 1)) {
        return error("End of comment missing");
      }
      var str = style.slice(2, i - 2);
      column += 2;
      updatePosition(str);
      style = style.slice(i);
      column += 2;
      return pos({
        type: TYPE_COMMENT,
        comment: str
      });
    }
    function declaration() {
      var pos = position();
      var prop = match(PROPERTY_REGEX);
      if (!prop) return;
      comment();
      if (!match(COLON_REGEX)) return error("property missing ':'");
      var val = match(VALUE_REGEX);
      var ret = pos({
        type: TYPE_DECLARATION,
        property: trim(prop[0].replace(COMMENT_REGEX, EMPTY_STRING)),
        value: val ? trim(val[0].replace(COMMENT_REGEX, EMPTY_STRING)) : EMPTY_STRING
      });
      match(SEMICOLON_REGEX);
      return ret;
    }
    function declarations() {
      var decls = [];
      comments(decls);
      var decl;
      while (decl = declaration()) {
        if (decl !== false) {
          decls.push(decl);
          comments(decls);
        }
      }
      return decls;
    }
    whitespace();
    return declarations();
  };
  function trim(str) {
    return str ? str.replace(TRIM_REGEX, EMPTY_STRING) : EMPTY_STRING;
  }
  return inlineStyleParser;
}
var hasRequiredCjs$1;
function requireCjs$1() {
  if (hasRequiredCjs$1) return cjs$1;
  hasRequiredCjs$1 = 1;
  var __importDefault = cjs$1 && cjs$1.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(cjs$1, "__esModule", { value: true });
  cjs$1.default = StyleToObject;
  var inline_style_parser_1 = __importDefault(requireInlineStyleParser());
  function StyleToObject(style, iterator) {
    var styleObject = null;
    if (!style || typeof style !== "string") {
      return styleObject;
    }
    var declarations = (0, inline_style_parser_1.default)(style);
    var hasIterator = typeof iterator === "function";
    declarations.forEach(function(declaration) {
      if (declaration.type !== "declaration") {
        return;
      }
      var property = declaration.property, value = declaration.value;
      if (hasIterator) {
        iterator(property, value, declaration);
      } else if (value) {
        styleObject = styleObject || {};
        styleObject[property] = value;
      }
    });
    return styleObject;
  }
  return cjs$1;
}
var utilities = {};
var hasRequiredUtilities$1;
function requireUtilities$1() {
  if (hasRequiredUtilities$1) return utilities;
  hasRequiredUtilities$1 = 1;
  Object.defineProperty(utilities, "__esModule", { value: true });
  utilities.camelCase = void 0;
  var CUSTOM_PROPERTY_REGEX = /^--[a-zA-Z0-9_-]+$/;
  var HYPHEN_REGEX = /-([a-z])/g;
  var NO_HYPHEN_REGEX = /^[^-]+$/;
  var VENDOR_PREFIX_REGEX = /^-(webkit|moz|ms|o|khtml)-/;
  var MS_VENDOR_PREFIX_REGEX = /^-(ms)-/;
  var skipCamelCase = function(property) {
    return !property || NO_HYPHEN_REGEX.test(property) || CUSTOM_PROPERTY_REGEX.test(property);
  };
  var capitalize = function(match, character) {
    return character.toUpperCase();
  };
  var trimHyphen = function(match, prefix) {
    return "".concat(prefix, "-");
  };
  var camelCase = function(property, options) {
    if (options === void 0) {
      options = {};
    }
    if (skipCamelCase(property)) {
      return property;
    }
    property = property.toLowerCase();
    if (options.reactCompat) {
      property = property.replace(MS_VENDOR_PREFIX_REGEX, trimHyphen);
    } else {
      property = property.replace(VENDOR_PREFIX_REGEX, trimHyphen);
    }
    return property.replace(HYPHEN_REGEX, capitalize);
  };
  utilities.camelCase = camelCase;
  return utilities;
}
var cjs;
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  var __importDefault = cjs && cjs.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  var style_to_object_1 = __importDefault(requireCjs$1());
  var utilities_1 = requireUtilities$1();
  function StyleToJS(style, options) {
    var output = {};
    if (!style || typeof style !== "string") {
      return output;
    }
    (0, style_to_object_1.default)(style, function(property, value) {
      if (property && value) {
        output[(0, utilities_1.camelCase)(property, options)] = value;
      }
    });
    return output;
  }
  StyleToJS.default = StyleToJS;
  cjs = StyleToJS;
  return cjs;
}
var hasRequiredUtilities;
function requireUtilities() {
  if (hasRequiredUtilities) return utilities$1;
  hasRequiredUtilities = 1;
  (function(exports) {
    var __importDefault = utilities$1 && utilities$1.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.returnFirstArg = exports.canTextBeChildOfNode = exports.ELEMENTS_WITH_NO_TEXT_CHILDREN = exports.PRESERVE_CUSTOM_ATTRIBUTES = void 0;
    exports.isCustomComponent = isCustomComponent;
    exports.setStyleProp = setStyleProp;
    var react_1 = React2;
    var style_to_js_1 = __importDefault(requireCjs());
    var RESERVED_SVG_MATHML_ELEMENTS = /* @__PURE__ */ new Set([
      "annotation-xml",
      "color-profile",
      "font-face",
      "font-face-src",
      "font-face-uri",
      "font-face-format",
      "font-face-name",
      "missing-glyph"
    ]);
    function isCustomComponent(tagName, props) {
      if (!tagName.includes("-")) {
        return Boolean(props && typeof props.is === "string");
      }
      if (RESERVED_SVG_MATHML_ELEMENTS.has(tagName)) {
        return false;
      }
      return true;
    }
    var styleOptions = {
      reactCompat: true
    };
    function setStyleProp(style, props) {
      if (typeof style !== "string") {
        return;
      }
      if (!style.trim()) {
        props.style = {};
        return;
      }
      try {
        props.style = (0, style_to_js_1.default)(style, styleOptions);
      } catch (error) {
        props.style = {};
      }
    }
    exports.PRESERVE_CUSTOM_ATTRIBUTES = Number(react_1.version.split(".")[0]) >= 16;
    exports.ELEMENTS_WITH_NO_TEXT_CHILDREN = /* @__PURE__ */ new Set([
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
    var canTextBeChildOfNode = function(node2) {
      return !exports.ELEMENTS_WITH_NO_TEXT_CHILDREN.has(node2.name);
    };
    exports.canTextBeChildOfNode = canTextBeChildOfNode;
    var returnFirstArg = function(arg) {
      return arg;
    };
    exports.returnFirstArg = returnFirstArg;
  })(utilities$1);
  return utilities$1;
}
var hasRequiredAttributesToProps;
function requireAttributesToProps() {
  if (hasRequiredAttributesToProps) return attributesToProps;
  hasRequiredAttributesToProps = 1;
  Object.defineProperty(attributesToProps, "__esModule", { value: true });
  attributesToProps.default = attributesToProps$1;
  var react_property_1 = requireLib$1();
  var utilities_1 = requireUtilities();
  var UNCONTROLLED_COMPONENT_ATTRIBUTES = ["checked", "value"];
  var UNCONTROLLED_COMPONENT_NAMES = ["input", "select", "textarea"];
  var valueOnlyInputs = {
    reset: true,
    submit: true
  };
  function attributesToProps$1(attributes, nodeName) {
    if (attributes === void 0) {
      attributes = {};
    }
    var props = {};
    var isInputValueOnly = Boolean(attributes.type && valueOnlyInputs[attributes.type]);
    for (var attributeName in attributes) {
      var attributeValue = attributes[attributeName];
      if ((0, react_property_1.isCustomAttribute)(attributeName)) {
        props[attributeName] = attributeValue;
        continue;
      }
      var attributeNameLowerCased = attributeName.toLowerCase();
      var propName = getPropName(attributeNameLowerCased);
      if (propName) {
        var propertyInfo = (0, react_property_1.getPropertyInfo)(propName);
        if (UNCONTROLLED_COMPONENT_ATTRIBUTES.includes(propName) && UNCONTROLLED_COMPONENT_NAMES.includes(nodeName) && !isInputValueOnly) {
          propName = getPropName("default" + attributeNameLowerCased);
        }
        props[propName] = attributeValue;
        switch (propertyInfo && propertyInfo.type) {
          case react_property_1.BOOLEAN:
            props[propName] = true;
            break;
          case react_property_1.OVERLOADED_BOOLEAN:
            if (attributeValue === "") {
              props[propName] = true;
            }
            break;
        }
        continue;
      }
      if (utilities_1.PRESERVE_CUSTOM_ATTRIBUTES) {
        props[attributeName] = attributeValue;
      }
    }
    (0, utilities_1.setStyleProp)(attributes.style, props);
    return props;
  }
  function getPropName(attributeName) {
    return react_property_1.possibleStandardNames[attributeName];
  }
  return attributesToProps;
}
var domToReact = {};
var hasRequiredDomToReact;
function requireDomToReact() {
  if (hasRequiredDomToReact) return domToReact;
  hasRequiredDomToReact = 1;
  var __importDefault = domToReact && domToReact.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(domToReact, "__esModule", { value: true });
  domToReact.default = domToReact$1;
  var react_1 = React2;
  var attributes_to_props_1 = __importDefault(requireAttributesToProps());
  var utilities_1 = requireUtilities();
  var React = {
    cloneElement: react_1.cloneElement,
    createElement: react_1.createElement,
    isValidElement: react_1.isValidElement
  };
  function domToReact$1(nodes, options) {
    if (options === void 0) {
      options = {};
    }
    var reactElements = [];
    var hasReplace = typeof options.replace === "function";
    var transform = options.transform || utilities_1.returnFirstArg;
    var _a = options.library || React, cloneElement = _a.cloneElement, createElement = _a.createElement, isValidElement = _a.isValidElement;
    var nodesLength = nodes.length;
    for (var index = 0; index < nodesLength; index++) {
      var node2 = nodes[index];
      if (hasReplace) {
        var replaceElement = options.replace(node2, index);
        if (isValidElement(replaceElement)) {
          if (nodesLength > 1) {
            replaceElement = cloneElement(replaceElement, {
              key: replaceElement.key || index
            });
          }
          reactElements.push(transform(replaceElement, node2, index));
          continue;
        }
      }
      if (node2.type === "text") {
        var isWhitespace = !node2.data.trim().length;
        if (isWhitespace && node2.parent && !(0, utilities_1.canTextBeChildOfNode)(node2.parent)) {
          continue;
        }
        if (options.trim && isWhitespace) {
          continue;
        }
        reactElements.push(transform(node2.data, node2, index));
        continue;
      }
      var element = node2;
      var props = {};
      if (skipAttributesToProps(element)) {
        (0, utilities_1.setStyleProp)(element.attribs.style, element.attribs);
        props = element.attribs;
      } else if (element.attribs) {
        props = (0, attributes_to_props_1.default)(element.attribs, element.name);
      }
      var children = void 0;
      switch (node2.type) {
        case "script":
        case "style":
          if (node2.children[0]) {
            props.dangerouslySetInnerHTML = {
              __html: node2.children[0].data
            };
          }
          break;
        case "tag":
          if (node2.name === "textarea" && node2.children[0]) {
            props.defaultValue = node2.children[0].data;
          } else if (node2.children && node2.children.length) {
            children = domToReact$1(node2.children, options);
          }
          break;
        // skip all other cases (e.g., comment)
        default:
          continue;
      }
      if (nodesLength > 1) {
        props.key = index;
      }
      reactElements.push(transform(createElement(node2.name, props, children), node2, index));
    }
    return reactElements.length === 1 ? reactElements[0] : reactElements;
  }
  function skipAttributesToProps(node2) {
    return utilities_1.PRESERVE_CUSTOM_ATTRIBUTES && node2.type === "tag" && (0, utilities_1.isCustomComponent)(node2.name, node2.attribs);
  }
  return domToReact;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib$3;
  hasRequiredLib = 1;
  (function(exports) {
    var __importDefault = lib$3 && lib$3.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.htmlToDOM = exports.domToReact = exports.attributesToProps = exports.Text = exports.ProcessingInstruction = exports.Element = exports.Comment = void 0;
    exports.default = HTMLReactParser2;
    var html_dom_parser_1 = __importDefault(requireHtmlToDom());
    exports.htmlToDOM = html_dom_parser_1.default;
    var attributes_to_props_1 = __importDefault(requireAttributesToProps());
    exports.attributesToProps = attributes_to_props_1.default;
    var dom_to_react_1 = __importDefault(requireDomToReact());
    exports.domToReact = dom_to_react_1.default;
    var domhandler_1 = /* @__PURE__ */ requireLib$2();
    Object.defineProperty(exports, "Comment", { enumerable: true, get: function() {
      return domhandler_1.Comment;
    } });
    Object.defineProperty(exports, "Element", { enumerable: true, get: function() {
      return domhandler_1.Element;
    } });
    Object.defineProperty(exports, "ProcessingInstruction", { enumerable: true, get: function() {
      return domhandler_1.ProcessingInstruction;
    } });
    Object.defineProperty(exports, "Text", { enumerable: true, get: function() {
      return domhandler_1.Text;
    } });
    var domParserOptions = { lowerCaseAttributeNames: false };
    function HTMLReactParser2(html, options) {
      if (typeof html !== "string") {
        throw new TypeError("First argument must be a string");
      }
      if (!html) {
        return [];
      }
      return (0, dom_to_react_1.default)((0, html_dom_parser_1.default)(html, (options === null || options === void 0 ? void 0 : options.htmlparser2) || domParserOptions), options);
    }
  })(lib$3);
  return lib$3;
}
var libExports = requireLib();
const HTMLReactParser = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
const parseToHTML = HTMLReactParser.default || HTMLReactParser;
var propTypes$1 = { exports: {} };
var reactIs = { exports: {} };
var reactIs_production_min = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactIs_production_min;
function requireReactIs_production_min() {
  if (hasRequiredReactIs_production_min) return reactIs_production_min;
  hasRequiredReactIs_production_min = 1;
  var b = "function" === typeof Symbol && Symbol.for, c = b ? Symbol.for("react.element") : 60103, d = b ? Symbol.for("react.portal") : 60106, e = b ? Symbol.for("react.fragment") : 60107, f = b ? Symbol.for("react.strict_mode") : 60108, g = b ? Symbol.for("react.profiler") : 60114, h = b ? Symbol.for("react.provider") : 60109, k = b ? Symbol.for("react.context") : 60110, l = b ? Symbol.for("react.async_mode") : 60111, m = b ? Symbol.for("react.concurrent_mode") : 60111, n = b ? Symbol.for("react.forward_ref") : 60112, p = b ? Symbol.for("react.suspense") : 60113, q = b ? Symbol.for("react.suspense_list") : 60120, r = b ? Symbol.for("react.memo") : 60115, t = b ? Symbol.for("react.lazy") : 60116, v = b ? Symbol.for("react.block") : 60121, w = b ? Symbol.for("react.fundamental") : 60117, x = b ? Symbol.for("react.responder") : 60118, y = b ? Symbol.for("react.scope") : 60119;
  function z(a) {
    if ("object" === typeof a && null !== a) {
      var u = a.$$typeof;
      switch (u) {
        case c:
          switch (a = a.type, a) {
            case l:
            case m:
            case e:
            case g:
            case f:
            case p:
              return a;
            default:
              switch (a = a && a.$$typeof, a) {
                case k:
                case n:
                case t:
                case r:
                case h:
                  return a;
                default:
                  return u;
              }
          }
        case d:
          return u;
      }
    }
  }
  function A(a) {
    return z(a) === m;
  }
  reactIs_production_min.AsyncMode = l;
  reactIs_production_min.ConcurrentMode = m;
  reactIs_production_min.ContextConsumer = k;
  reactIs_production_min.ContextProvider = h;
  reactIs_production_min.Element = c;
  reactIs_production_min.ForwardRef = n;
  reactIs_production_min.Fragment = e;
  reactIs_production_min.Lazy = t;
  reactIs_production_min.Memo = r;
  reactIs_production_min.Portal = d;
  reactIs_production_min.Profiler = g;
  reactIs_production_min.StrictMode = f;
  reactIs_production_min.Suspense = p;
  reactIs_production_min.isAsyncMode = function(a) {
    return A(a) || z(a) === l;
  };
  reactIs_production_min.isConcurrentMode = A;
  reactIs_production_min.isContextConsumer = function(a) {
    return z(a) === k;
  };
  reactIs_production_min.isContextProvider = function(a) {
    return z(a) === h;
  };
  reactIs_production_min.isElement = function(a) {
    return "object" === typeof a && null !== a && a.$$typeof === c;
  };
  reactIs_production_min.isForwardRef = function(a) {
    return z(a) === n;
  };
  reactIs_production_min.isFragment = function(a) {
    return z(a) === e;
  };
  reactIs_production_min.isLazy = function(a) {
    return z(a) === t;
  };
  reactIs_production_min.isMemo = function(a) {
    return z(a) === r;
  };
  reactIs_production_min.isPortal = function(a) {
    return z(a) === d;
  };
  reactIs_production_min.isProfiler = function(a) {
    return z(a) === g;
  };
  reactIs_production_min.isStrictMode = function(a) {
    return z(a) === f;
  };
  reactIs_production_min.isSuspense = function(a) {
    return z(a) === p;
  };
  reactIs_production_min.isValidElementType = function(a) {
    return "string" === typeof a || "function" === typeof a || a === e || a === m || a === g || a === f || a === p || a === q || "object" === typeof a && null !== a && (a.$$typeof === t || a.$$typeof === r || a.$$typeof === h || a.$$typeof === k || a.$$typeof === n || a.$$typeof === w || a.$$typeof === x || a.$$typeof === y || a.$$typeof === v);
  };
  reactIs_production_min.typeOf = z;
  return reactIs_production_min;
}
var reactIs_development = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactIs_development;
function requireReactIs_development() {
  if (hasRequiredReactIs_development) return reactIs_development;
  hasRequiredReactIs_development = 1;
  if (process.env.NODE_ENV !== "production") {
    (function() {
      var hasSymbol = typeof Symbol === "function" && Symbol.for;
      var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for("react.element") : 60103;
      var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for("react.portal") : 60106;
      var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for("react.fragment") : 60107;
      var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for("react.strict_mode") : 60108;
      var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for("react.profiler") : 60114;
      var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for("react.provider") : 60109;
      var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for("react.context") : 60110;
      var REACT_ASYNC_MODE_TYPE = hasSymbol ? Symbol.for("react.async_mode") : 60111;
      var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for("react.concurrent_mode") : 60111;
      var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for("react.forward_ref") : 60112;
      var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for("react.suspense") : 60113;
      var REACT_SUSPENSE_LIST_TYPE = hasSymbol ? Symbol.for("react.suspense_list") : 60120;
      var REACT_MEMO_TYPE = hasSymbol ? Symbol.for("react.memo") : 60115;
      var REACT_LAZY_TYPE = hasSymbol ? Symbol.for("react.lazy") : 60116;
      var REACT_BLOCK_TYPE = hasSymbol ? Symbol.for("react.block") : 60121;
      var REACT_FUNDAMENTAL_TYPE = hasSymbol ? Symbol.for("react.fundamental") : 60117;
      var REACT_RESPONDER_TYPE = hasSymbol ? Symbol.for("react.responder") : 60118;
      var REACT_SCOPE_TYPE = hasSymbol ? Symbol.for("react.scope") : 60119;
      function isValidElementType(type) {
        return typeof type === "string" || typeof type === "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || typeof type === "object" && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_FUNDAMENTAL_TYPE || type.$$typeof === REACT_RESPONDER_TYPE || type.$$typeof === REACT_SCOPE_TYPE || type.$$typeof === REACT_BLOCK_TYPE);
      }
      function typeOf(object) {
        if (typeof object === "object" && object !== null) {
          var $$typeof = object.$$typeof;
          switch ($$typeof) {
            case REACT_ELEMENT_TYPE:
              var type = object.type;
              switch (type) {
                case REACT_ASYNC_MODE_TYPE:
                case REACT_CONCURRENT_MODE_TYPE:
                case REACT_FRAGMENT_TYPE:
                case REACT_PROFILER_TYPE:
                case REACT_STRICT_MODE_TYPE:
                case REACT_SUSPENSE_TYPE:
                  return type;
                default:
                  var $$typeofType = type && type.$$typeof;
                  switch ($$typeofType) {
                    case REACT_CONTEXT_TYPE:
                    case REACT_FORWARD_REF_TYPE:
                    case REACT_LAZY_TYPE:
                    case REACT_MEMO_TYPE:
                    case REACT_PROVIDER_TYPE:
                      return $$typeofType;
                    default:
                      return $$typeof;
                  }
              }
            case REACT_PORTAL_TYPE:
              return $$typeof;
          }
        }
        return void 0;
      }
      var AsyncMode = REACT_ASYNC_MODE_TYPE;
      var ConcurrentMode = REACT_CONCURRENT_MODE_TYPE;
      var ContextConsumer = REACT_CONTEXT_TYPE;
      var ContextProvider = REACT_PROVIDER_TYPE;
      var Element = REACT_ELEMENT_TYPE;
      var ForwardRef = REACT_FORWARD_REF_TYPE;
      var Fragment = REACT_FRAGMENT_TYPE;
      var Lazy = REACT_LAZY_TYPE;
      var Memo = REACT_MEMO_TYPE;
      var Portal = REACT_PORTAL_TYPE;
      var Profiler = REACT_PROFILER_TYPE;
      var StrictMode = REACT_STRICT_MODE_TYPE;
      var Suspense = REACT_SUSPENSE_TYPE;
      var hasWarnedAboutDeprecatedIsAsyncMode = false;
      function isAsyncMode(object) {
        {
          if (!hasWarnedAboutDeprecatedIsAsyncMode) {
            hasWarnedAboutDeprecatedIsAsyncMode = true;
            console["warn"]("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.");
          }
        }
        return isConcurrentMode(object) || typeOf(object) === REACT_ASYNC_MODE_TYPE;
      }
      function isConcurrentMode(object) {
        return typeOf(object) === REACT_CONCURRENT_MODE_TYPE;
      }
      function isContextConsumer(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
      }
      function isContextProvider(object) {
        return typeOf(object) === REACT_PROVIDER_TYPE;
      }
      function isElement(object) {
        return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function isForwardRef(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
      }
      function isFragment(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
      }
      function isLazy(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
      }
      function isMemo(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
      }
      function isPortal(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
      }
      function isProfiler(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
      }
      function isStrictMode(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
      }
      function isSuspense(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
      }
      reactIs_development.AsyncMode = AsyncMode;
      reactIs_development.ConcurrentMode = ConcurrentMode;
      reactIs_development.ContextConsumer = ContextConsumer;
      reactIs_development.ContextProvider = ContextProvider;
      reactIs_development.Element = Element;
      reactIs_development.ForwardRef = ForwardRef;
      reactIs_development.Fragment = Fragment;
      reactIs_development.Lazy = Lazy;
      reactIs_development.Memo = Memo;
      reactIs_development.Portal = Portal;
      reactIs_development.Profiler = Profiler;
      reactIs_development.StrictMode = StrictMode;
      reactIs_development.Suspense = Suspense;
      reactIs_development.isAsyncMode = isAsyncMode;
      reactIs_development.isConcurrentMode = isConcurrentMode;
      reactIs_development.isContextConsumer = isContextConsumer;
      reactIs_development.isContextProvider = isContextProvider;
      reactIs_development.isElement = isElement;
      reactIs_development.isForwardRef = isForwardRef;
      reactIs_development.isFragment = isFragment;
      reactIs_development.isLazy = isLazy;
      reactIs_development.isMemo = isMemo;
      reactIs_development.isPortal = isPortal;
      reactIs_development.isProfiler = isProfiler;
      reactIs_development.isStrictMode = isStrictMode;
      reactIs_development.isSuspense = isSuspense;
      reactIs_development.isValidElementType = isValidElementType;
      reactIs_development.typeOf = typeOf;
    })();
  }
  return reactIs_development;
}
var hasRequiredReactIs;
function requireReactIs() {
  if (hasRequiredReactIs) return reactIs.exports;
  hasRequiredReactIs = 1;
  if (process.env.NODE_ENV === "production") {
    reactIs.exports = requireReactIs_production_min();
  } else {
    reactIs.exports = requireReactIs_development();
  }
  return reactIs.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var objectAssign;
var hasRequiredObjectAssign;
function requireObjectAssign() {
  if (hasRequiredObjectAssign) return objectAssign;
  hasRequiredObjectAssign = 1;
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  function toObject(val) {
    if (val === null || val === void 0) {
      throw new TypeError("Object.assign cannot be called with null or undefined");
    }
    return Object(val);
  }
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
      var test1 = new String("abc");
      test1[5] = "de";
      if (Object.getOwnPropertyNames(test1)[0] === "5") {
        return false;
      }
      var test2 = {};
      for (var i = 0; i < 10; i++) {
        test2["_" + String.fromCharCode(i)] = i;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function(n) {
        return test2[n];
      });
      if (order2.join("") !== "0123456789") {
        return false;
      }
      var test3 = {};
      "abcdefghijklmnopqrst".split("").forEach(function(letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  objectAssign = shouldUseNative() ? Object.assign : function(target, source) {
    var from;
    var to = toObject(target);
    var symbols;
    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }
    return to;
  };
  return objectAssign;
}
var ReactPropTypesSecret_1;
var hasRequiredReactPropTypesSecret;
function requireReactPropTypesSecret() {
  if (hasRequiredReactPropTypesSecret) return ReactPropTypesSecret_1;
  hasRequiredReactPropTypesSecret = 1;
  var ReactPropTypesSecret = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  ReactPropTypesSecret_1 = ReactPropTypesSecret;
  return ReactPropTypesSecret_1;
}
var has;
var hasRequiredHas;
function requireHas() {
  if (hasRequiredHas) return has;
  hasRequiredHas = 1;
  has = Function.call.bind(Object.prototype.hasOwnProperty);
  return has;
}
var checkPropTypes_1;
var hasRequiredCheckPropTypes;
function requireCheckPropTypes() {
  if (hasRequiredCheckPropTypes) return checkPropTypes_1;
  hasRequiredCheckPropTypes = 1;
  var printWarning = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var ReactPropTypesSecret = /* @__PURE__ */ requireReactPropTypesSecret();
    var loggedTypeFailures = {};
    var has2 = /* @__PURE__ */ requireHas();
    printWarning = function(text) {
      var message = "Warning: " + text;
      if (typeof console !== "undefined") {
        console.error(message);
      }
      try {
        throw new Error(message);
      } catch (x) {
      }
    };
  }
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    if (process.env.NODE_ENV !== "production") {
      for (var typeSpecName in typeSpecs) {
        if (has2(typeSpecs, typeSpecName)) {
          var error;
          try {
            if (typeof typeSpecs[typeSpecName] !== "function") {
              var err = Error(
                (componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              err.name = "Invariant Violation";
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning(
              (componentName || "React class") + ": type specification of " + location + " `" + typeSpecName + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof error + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
            );
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            loggedTypeFailures[error.message] = true;
            var stack = getStack ? getStack() : "";
            printWarning(
              "Failed " + location + " type: " + error.message + (stack != null ? stack : "")
            );
          }
        }
      }
    }
  }
  checkPropTypes.resetWarningCache = function() {
    if (process.env.NODE_ENV !== "production") {
      loggedTypeFailures = {};
    }
  };
  checkPropTypes_1 = checkPropTypes;
  return checkPropTypes_1;
}
var factoryWithTypeCheckers;
var hasRequiredFactoryWithTypeCheckers;
function requireFactoryWithTypeCheckers() {
  if (hasRequiredFactoryWithTypeCheckers) return factoryWithTypeCheckers;
  hasRequiredFactoryWithTypeCheckers = 1;
  var ReactIs = requireReactIs();
  var assign = requireObjectAssign();
  var ReactPropTypesSecret = /* @__PURE__ */ requireReactPropTypesSecret();
  var has2 = /* @__PURE__ */ requireHas();
  var checkPropTypes = /* @__PURE__ */ requireCheckPropTypes();
  var printWarning = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    printWarning = function(text) {
      var message = "Warning: " + text;
      if (typeof console !== "undefined") {
        console.error(message);
      }
      try {
        throw new Error(message);
      } catch (x) {
      }
    };
  }
  function emptyFunctionThatReturnsNull() {
    return null;
  }
  factoryWithTypeCheckers = function(isValidElement, throwOnDirectAccess) {
    var ITERATOR_SYMBOL = typeof Symbol === "function" && Symbol.iterator;
    var FAUX_ITERATOR_SYMBOL = "@@iterator";
    function getIteratorFn(maybeIterable) {
      var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
      if (typeof iteratorFn === "function") {
        return iteratorFn;
      }
    }
    var ANONYMOUS = "<<anonymous>>";
    var ReactPropTypes = {
      array: createPrimitiveTypeChecker("array"),
      bigint: createPrimitiveTypeChecker("bigint"),
      bool: createPrimitiveTypeChecker("boolean"),
      func: createPrimitiveTypeChecker("function"),
      number: createPrimitiveTypeChecker("number"),
      object: createPrimitiveTypeChecker("object"),
      string: createPrimitiveTypeChecker("string"),
      symbol: createPrimitiveTypeChecker("symbol"),
      any: createAnyTypeChecker(),
      arrayOf: createArrayOfTypeChecker,
      element: createElementTypeChecker(),
      elementType: createElementTypeTypeChecker(),
      instanceOf: createInstanceTypeChecker,
      node: createNodeChecker(),
      objectOf: createObjectOfTypeChecker,
      oneOf: createEnumTypeChecker,
      oneOfType: createUnionTypeChecker,
      shape: createShapeTypeChecker,
      exact: createStrictShapeTypeChecker
    };
    function is(x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    }
    function PropTypeError(message, data) {
      this.message = message;
      this.data = data && typeof data === "object" ? data : {};
      this.stack = "";
    }
    PropTypeError.prototype = Error.prototype;
    function createChainableTypeChecker(validate) {
      if (process.env.NODE_ENV !== "production") {
        var manualPropTypeCallCache = {};
        var manualPropTypeWarningCount = 0;
      }
      function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
        componentName = componentName || ANONYMOUS;
        propFullName = propFullName || propName;
        if (secret !== ReactPropTypesSecret) {
          if (throwOnDirectAccess) {
            var err = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            err.name = "Invariant Violation";
            throw err;
          } else if (process.env.NODE_ENV !== "production" && typeof console !== "undefined") {
            var cacheKey = componentName + ":" + propName;
            if (!manualPropTypeCallCache[cacheKey] && // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3) {
              printWarning(
                "You are manually calling a React.PropTypes validation function for the `" + propFullName + "` prop on `" + componentName + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
              );
              manualPropTypeCallCache[cacheKey] = true;
              manualPropTypeWarningCount++;
            }
          }
        }
        if (props[propName] == null) {
          if (isRequired) {
            if (props[propName] === null) {
              return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required " + ("in `" + componentName + "`, but its value is `null`."));
            }
            return new PropTypeError("The " + location + " `" + propFullName + "` is marked as required in " + ("`" + componentName + "`, but its value is `undefined`."));
          }
          return null;
        } else {
          return validate(props, propName, componentName, location, propFullName);
        }
      }
      var chainedCheckType = checkType.bind(null, false);
      chainedCheckType.isRequired = checkType.bind(null, true);
      return chainedCheckType;
    }
    function createPrimitiveTypeChecker(expectedType) {
      function validate(props, propName, componentName, location, propFullName, secret) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== expectedType) {
          var preciseType = getPreciseType(propValue);
          return new PropTypeError(
            "Invalid " + location + " `" + propFullName + "` of type " + ("`" + preciseType + "` supplied to `" + componentName + "`, expected ") + ("`" + expectedType + "`."),
            { expectedType }
          );
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createAnyTypeChecker() {
      return createChainableTypeChecker(emptyFunctionThatReturnsNull);
    }
    function createArrayOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== "function") {
          return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside arrayOf.");
        }
        var propValue = props[propName];
        if (!Array.isArray(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an array."));
        }
        for (var i = 0; i < propValue.length; i++) {
          var error = typeChecker(propValue, i, componentName, location, propFullName + "[" + i + "]", ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createElementTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!isValidElement(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement."));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createElementTypeTypeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        if (!ReactIs.isValidElementType(propValue)) {
          var propType = getPropType(propValue);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createInstanceTypeChecker(expectedClass) {
      function validate(props, propName, componentName, location, propFullName) {
        if (!(props[propName] instanceof expectedClass)) {
          var expectedClassName = expectedClass.name || ANONYMOUS;
          var actualClassName = getClassName(props[propName]);
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + actualClassName + "` supplied to `" + componentName + "`, expected ") + ("instance of `" + expectedClassName + "`."));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createEnumTypeChecker(expectedValues) {
      if (!Array.isArray(expectedValues)) {
        if (process.env.NODE_ENV !== "production") {
          if (arguments.length > 1) {
            printWarning(
              "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
            );
          } else {
            printWarning("Invalid argument supplied to oneOf, expected an array.");
          }
        }
        return emptyFunctionThatReturnsNull;
      }
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        for (var i = 0; i < expectedValues.length; i++) {
          if (is(propValue, expectedValues[i])) {
            return null;
          }
        }
        var valuesString = JSON.stringify(expectedValues, function replacer(key, value) {
          var type = getPreciseType(value);
          if (type === "symbol") {
            return String(value);
          }
          return value;
        });
        return new PropTypeError("Invalid " + location + " `" + propFullName + "` of value `" + String(propValue) + "` " + ("supplied to `" + componentName + "`, expected one of " + valuesString + "."));
      }
      return createChainableTypeChecker(validate);
    }
    function createObjectOfTypeChecker(typeChecker) {
      function validate(props, propName, componentName, location, propFullName) {
        if (typeof typeChecker !== "function") {
          return new PropTypeError("Property `" + propFullName + "` of component `" + componentName + "` has invalid PropType notation inside objectOf.");
        }
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== "object") {
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type " + ("`" + propType + "` supplied to `" + componentName + "`, expected an object."));
        }
        for (var key in propValue) {
          if (has2(propValue, key)) {
            var error = typeChecker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
            if (error instanceof Error) {
              return error;
            }
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createUnionTypeChecker(arrayOfTypeCheckers) {
      if (!Array.isArray(arrayOfTypeCheckers)) {
        process.env.NODE_ENV !== "production" ? printWarning("Invalid argument supplied to oneOfType, expected an instance of array.") : void 0;
        return emptyFunctionThatReturnsNull;
      }
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (typeof checker !== "function") {
          printWarning(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + getPostfixForTypeWarning(checker) + " at index " + i + "."
          );
          return emptyFunctionThatReturnsNull;
        }
      }
      function validate(props, propName, componentName, location, propFullName) {
        var expectedTypes = [];
        for (var i2 = 0; i2 < arrayOfTypeCheckers.length; i2++) {
          var checker2 = arrayOfTypeCheckers[i2];
          var checkerResult = checker2(props, propName, componentName, location, propFullName, ReactPropTypesSecret);
          if (checkerResult == null) {
            return null;
          }
          if (checkerResult.data && has2(checkerResult.data, "expectedType")) {
            expectedTypes.push(checkerResult.data.expectedType);
          }
        }
        var expectedTypesMessage = expectedTypes.length > 0 ? ", expected one of type [" + expectedTypes.join(", ") + "]" : "";
        return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`" + expectedTypesMessage + "."));
      }
      return createChainableTypeChecker(validate);
    }
    function createNodeChecker() {
      function validate(props, propName, componentName, location, propFullName) {
        if (!isNode(props[propName])) {
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` supplied to " + ("`" + componentName + "`, expected a ReactNode."));
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function invalidValidatorError(componentName, location, propFullName, key, type) {
      return new PropTypeError(
        (componentName || "React class") + ": " + location + " type `" + propFullName + "." + key + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + type + "`."
      );
    }
    function createShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== "object") {
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
        }
        for (var key in shapeTypes) {
          var checker = shapeTypes[key];
          if (typeof checker !== "function") {
            return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
          }
          var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function createStrictShapeTypeChecker(shapeTypes) {
      function validate(props, propName, componentName, location, propFullName) {
        var propValue = props[propName];
        var propType = getPropType(propValue);
        if (propType !== "object") {
          return new PropTypeError("Invalid " + location + " `" + propFullName + "` of type `" + propType + "` " + ("supplied to `" + componentName + "`, expected `object`."));
        }
        var allKeys = assign({}, props[propName], shapeTypes);
        for (var key in allKeys) {
          var checker = shapeTypes[key];
          if (has2(shapeTypes, key) && typeof checker !== "function") {
            return invalidValidatorError(componentName, location, propFullName, key, getPreciseType(checker));
          }
          if (!checker) {
            return new PropTypeError(
              "Invalid " + location + " `" + propFullName + "` key `" + key + "` supplied to `" + componentName + "`.\nBad object: " + JSON.stringify(props[propName], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(shapeTypes), null, "  ")
            );
          }
          var error = checker(propValue, key, componentName, location, propFullName + "." + key, ReactPropTypesSecret);
          if (error) {
            return error;
          }
        }
        return null;
      }
      return createChainableTypeChecker(validate);
    }
    function isNode(propValue) {
      switch (typeof propValue) {
        case "number":
        case "string":
        case "undefined":
          return true;
        case "boolean":
          return !propValue;
        case "object":
          if (Array.isArray(propValue)) {
            return propValue.every(isNode);
          }
          if (propValue === null || isValidElement(propValue)) {
            return true;
          }
          var iteratorFn = getIteratorFn(propValue);
          if (iteratorFn) {
            var iterator = iteratorFn.call(propValue);
            var step;
            if (iteratorFn !== propValue.entries) {
              while (!(step = iterator.next()).done) {
                if (!isNode(step.value)) {
                  return false;
                }
              }
            } else {
              while (!(step = iterator.next()).done) {
                var entry = step.value;
                if (entry) {
                  if (!isNode(entry[1])) {
                    return false;
                  }
                }
              }
            }
          } else {
            return false;
          }
          return true;
        default:
          return false;
      }
    }
    function isSymbol(propType, propValue) {
      if (propType === "symbol") {
        return true;
      }
      if (!propValue) {
        return false;
      }
      if (propValue["@@toStringTag"] === "Symbol") {
        return true;
      }
      if (typeof Symbol === "function" && propValue instanceof Symbol) {
        return true;
      }
      return false;
    }
    function getPropType(propValue) {
      var propType = typeof propValue;
      if (Array.isArray(propValue)) {
        return "array";
      }
      if (propValue instanceof RegExp) {
        return "object";
      }
      if (isSymbol(propType, propValue)) {
        return "symbol";
      }
      return propType;
    }
    function getPreciseType(propValue) {
      if (typeof propValue === "undefined" || propValue === null) {
        return "" + propValue;
      }
      var propType = getPropType(propValue);
      if (propType === "object") {
        if (propValue instanceof Date) {
          return "date";
        } else if (propValue instanceof RegExp) {
          return "regexp";
        }
      }
      return propType;
    }
    function getPostfixForTypeWarning(value) {
      var type = getPreciseType(value);
      switch (type) {
        case "array":
        case "object":
          return "an " + type;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + type;
        default:
          return type;
      }
    }
    function getClassName(propValue) {
      if (!propValue.constructor || !propValue.constructor.name) {
        return ANONYMOUS;
      }
      return propValue.constructor.name;
    }
    ReactPropTypes.checkPropTypes = checkPropTypes;
    ReactPropTypes.resetWarningCache = checkPropTypes.resetWarningCache;
    ReactPropTypes.PropTypes = ReactPropTypes;
    return ReactPropTypes;
  };
  return factoryWithTypeCheckers;
}
var factoryWithThrowingShims;
var hasRequiredFactoryWithThrowingShims;
function requireFactoryWithThrowingShims() {
  if (hasRequiredFactoryWithThrowingShims) return factoryWithThrowingShims;
  hasRequiredFactoryWithThrowingShims = 1;
  var ReactPropTypesSecret = /* @__PURE__ */ requireReactPropTypesSecret();
  function emptyFunction() {
  }
  function emptyFunctionWithReset() {
  }
  emptyFunctionWithReset.resetWarningCache = emptyFunction;
  factoryWithThrowingShims = function() {
    function shim(props, propName, componentName, location, propFullName, secret) {
      if (secret === ReactPropTypesSecret) {
        return;
      }
      var err = new Error(
        "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
      );
      err.name = "Invariant Violation";
      throw err;
    }
    shim.isRequired = shim;
    function getShim() {
      return shim;
    }
    var ReactPropTypes = {
      array: shim,
      bigint: shim,
      bool: shim,
      func: shim,
      number: shim,
      object: shim,
      string: shim,
      symbol: shim,
      any: shim,
      arrayOf: getShim,
      element: shim,
      elementType: shim,
      instanceOf: getShim,
      node: shim,
      objectOf: getShim,
      oneOf: getShim,
      oneOfType: getShim,
      shape: getShim,
      exact: getShim,
      checkPropTypes: emptyFunctionWithReset,
      resetWarningCache: emptyFunction
    };
    ReactPropTypes.PropTypes = ReactPropTypes;
    return ReactPropTypes;
  };
  return factoryWithThrowingShims;
}
var hasRequiredPropTypes;
function requirePropTypes() {
  if (hasRequiredPropTypes) return propTypes$1.exports;
  hasRequiredPropTypes = 1;
  if (process.env.NODE_ENV !== "production") {
    var ReactIs = requireReactIs();
    var throwOnDirectAccess = true;
    propTypes$1.exports = /* @__PURE__ */ requireFactoryWithTypeCheckers()(ReactIs.isElement, throwOnDirectAccess);
  } else {
    propTypes$1.exports = /* @__PURE__ */ requireFactoryWithThrowingShims()();
  }
  return propTypes$1.exports;
}
var propTypesExports = /* @__PURE__ */ requirePropTypes();
const PropTypes = /* @__PURE__ */ getDefaultExportFromCjs(propTypesExports);
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
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
var hashFragment = "";
var observer = null;
var asyncTimerId = null;
var scrollFunction = null;
function reset() {
  hashFragment = "";
  if (observer !== null)
    observer.disconnect();
  if (asyncTimerId !== null) {
    window.clearTimeout(asyncTimerId);
    asyncTimerId = null;
  }
}
function isInteractiveElement(element) {
  var formTags = ["BUTTON", "INPUT", "SELECT", "TEXTAREA"];
  var linkTags = ["A", "AREA"];
  return formTags.includes(element.tagName) && !element.hasAttribute("disabled") || linkTags.includes(element.tagName) && element.hasAttribute("href");
}
function getElAndScroll() {
  var element = null;
  if (hashFragment === "#") {
    element = document.body;
  } else {
    var id = hashFragment.replace("#", "");
    element = document.getElementById(id);
    if (element === null && hashFragment === "#top") {
      element = document.body;
    }
  }
  if (element !== null) {
    scrollFunction(element);
    var originalTabIndex = element.getAttribute("tabindex");
    if (originalTabIndex === null && !isInteractiveElement(element)) {
      element.setAttribute("tabindex", -1);
    }
    element.focus({ preventScroll: true });
    if (originalTabIndex === null && !isInteractiveElement(element)) {
      element.blur();
      element.removeAttribute("tabindex");
    }
    reset();
    return true;
  }
  return false;
}
function hashLinkScroll(timeout) {
  window.setTimeout(function() {
    if (getElAndScroll() === false) {
      if (observer === null) {
        observer = new MutationObserver(getElAndScroll);
      }
      observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true
      });
      asyncTimerId = window.setTimeout(function() {
        reset();
      }, timeout || 1e4);
    }
  }, 0);
}
function genericHashLink(As) {
  return React2.forwardRef(function(props, ref) {
    var linkHash = "";
    if (typeof props.to === "string" && props.to.includes("#")) {
      linkHash = "#" + props.to.split("#").slice(1).join("#");
    } else if (typeof props.to === "object" && typeof props.to.hash === "string") {
      linkHash = props.to.hash;
    }
    var passDownProps = {};
    if (As === NavLink) {
      passDownProps.isActive = function(match, location) {
        return match && match.isExact && location.hash === linkHash;
      };
    }
    function handleClick(e) {
      reset();
      hashFragment = props.elementId ? "#" + props.elementId : linkHash;
      if (props.onClick)
        props.onClick(e);
      if (hashFragment !== "" && // ignore non-vanilla click events, same as react-router
      // below logic adapted from react-router: https://github.com/ReactTraining/react-router/blob/fc91700e08df8147bd2bb1be19a299cbb14dbcaa/packages/react-router-dom/modules/Link.js#L43-L48
      !e.defaultPrevented && // onClick prevented default
      e.button === 0 && // ignore everything but left clicks
      (!props.target || props.target === "_self") && // let browser handle "target=_blank" etc
      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)) {
        scrollFunction = props.scroll || function(el) {
          return props.smooth ? el.scrollIntoView({ behavior: "smooth" }) : el.scrollIntoView();
        };
        hashLinkScroll(props.timeout);
      }
    }
    var filteredProps = __rest(props, ["scroll", "smooth", "timeout", "elementId"]);
    return React2.createElement(As, __assign({}, passDownProps, filteredProps, { onClick: handleClick, ref }), props.children);
  });
}
var HashLink = genericHashLink(Link);
var NavHashLink = genericHashLink(NavLink);
if (process.env.NODE_ENV !== "production") {
  HashLink.displayName = "HashLink";
  NavHashLink.displayName = "NavHashLink";
  var propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node,
    scroll: PropTypes.func,
    timeout: PropTypes.number,
    elementId: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };
  HashLink.propTypes = propTypes;
  NavHashLink.propTypes = propTypes;
}
const SampleIDs = ["hello-cube", "sky-sea"];
const DefaultSampleID = "hello-cube";
const SampleDisplayDescriptorByID = /* @__PURE__ */ new Map([
  [
    DefaultSampleID,
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
]);
const SampleInitDescriptorByID = /* @__PURE__ */ new Map([
  [
    DefaultSampleID,
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
      import: () => import("./HelloCube-BKhbtyh6.js").then((value) => {
        return value.HelloCubeAppConstructor;
      })
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
      import: () => import("./SkySea-Bx_-To1d.js").then((value) => {
        return value.SkySeaAppConstructor;
      })
    }
  ]
]);
const repoRoot = "https://github.com/EllarBooher/WebGPU-Samples/tree/main/src/webgpu";
const EmbeddedReadme = memo(function EmbeddedReadme2({
  sampleID
}) {
  var _a;
  const [readmeText, setReadmeText] = useState();
  const projectFolder = (_a = SampleInitDescriptorByID.get(sampleID)) == null ? void 0 : _a.projectFolder;
  useEffect(() => {
    if (projectFolder === void 0) {
      setReadmeText(void 0);
      return;
    }
    __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "./hello-cube/README.md": () => import("./README-Bgw6Dhkp.js"), "./sky-sea/README.md": () => import("./README-BZcyQ1ko.js") }), `./${projectFolder}/README.md`, 3).then((value) => {
      const markdownModule = value;
      if (typeof markdownModule.default !== "string") {
        throw new Error(
          `Invalid readme markdown import, path is ${projectFolder}`
        );
      }
      setReadmeText(markdownModule.default);
    }).catch((err) => {
      if (err instanceof Error) {
        console.error(err);
      }
    });
  }, [projectFolder, setReadmeText]);
  if (readmeText === void 0) {
    return void 0;
  }
  const options = {
    replace(domNode) {
      const { attribs, children } = domNode;
      if (attribs === void 0 || children === void 0) {
        return;
      }
      const href = attribs.href;
      if (typeof href !== "string") {
        return;
      }
      if (href.startsWith("#") === true) {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(HashLink, { to: href, children: libExports.domToReact(children, options) });
      }
      const projectRoot = `${repoRoot}/${projectFolder}/`;
      let hrefParsed = void 0;
      if (URL.canParse(href)) {
        hrefParsed = href;
      } else if (URL.canParse(href, projectRoot)) {
        hrefParsed = URL.parse(href, projectRoot).href;
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { target: "_blank", rel: "noopener noreferrer", href: hrefParsed, children: libExports.domToReact(children, options) });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "webgpu-samples-readme-body", children: parseToHTML(readmeText, options) });
});
async function getDevice(props) {
  console.log("Starting WebGPU");
  const adapterPromise = navigator.gpu.requestAdapter().then((value) => {
    if (!value) {
      return Promise.reject(
        new Error("Requested WebGPU Adapter is not available.")
      );
    }
    return Promise.resolve(value);
  }).catch((reason) => {
    return Promise.reject(
      new Error("Unable to get WebGPU Adapter", { cause: reason })
    );
  });
  const devicePromise = adapterPromise.then((adapter) => {
    const knownRequiredFeatures = Array.from(
      props.requiredFeatures.values()
    ).filter((feature) => {
      return adapter.features.has(feature);
    });
    if (knownRequiredFeatures.length != props.requiredFeatures.size) {
      const reason = `Required features unavailable: ${Array.from(
        props.requiredFeatures.values()
      ).filter((feature) => !adapter.features.has(feature)).map((feature) => `'${feature}'`).join(",")}`;
      return Promise.reject(
        new Error("Unable to get WebGPU Device", { cause: reason })
      );
    }
    const features = knownRequiredFeatures.concat(
      ...Array.from(props.optionalFeatures.values()).filter((feature) => {
        return adapter.features.has(feature);
      })
    );
    console.log(`Enabling features: '${features.join(`', '`)}'`);
    const satisfiedRequiredLimits = /* @__PURE__ */ new Map();
    const missingLimits = new Array();
    for (const [name, requestedMinimum] of props.requiredLimits.entries()) {
      const supported = adapter.limits[name];
      if (supported >= requestedMinimum) {
        satisfiedRequiredLimits.set(name, requestedMinimum);
      } else {
        missingLimits.push({
          name,
          requestedMinimum,
          supported
        });
      }
    }
    if (satisfiedRequiredLimits.size < props.requiredLimits.size) {
      const reason = `Required limits unsatisfied: ${missingLimits.map(
        (limit) => `( name: '${limit.name}' supported: '${limit.supported}' requested: '${limit.requestedMinimum}' )`
      ).join(",")}`;
      return Promise.reject(
        new Error("Unable to get WebGPU Device", { cause: reason })
      );
    }
    const limits = {};
    for (const [name, limit] of satisfiedRequiredLimits) {
      limits[name] = limit;
    }
    return adapter.requestDevice({
      requiredFeatures: features,
      requiredLimits: limits
    }).catch((reason) => {
      return Promise.reject(
        new Error("Unable to get WebGPU Device", { cause: reason })
      );
    });
  });
  return Promise.all([adapterPromise, devicePromise]).then((value) => {
    const [adapter, device] = value;
    return {
      adapter,
      device
    };
  });
}
async function initializeApp(props) {
  return Promise.all([
    props.import(),
    getDevice({
      ...props
    })
  ]).then(([sampleConstructor, { adapter: _adapter, device }]) => {
    const canvasFormat = props.gpu.getPreferredCanvasFormat();
    const app = sampleConstructor(device, canvasFormat);
    device.lost.then(
      (reason) => {
        console.log(
          `WebGPU device lost - ("${reason.reason}"):
 ${reason.message}`
        );
      },
      (err) => {
        throw new Error(`WebGPU device lost rejected`, {
          cause: err
        });
      }
    ).finally(() => {
      app.quit = true;
    });
    device.onuncapturederror = (ev) => {
      app.quit = true;
      props.onUncapturedError(ev);
    };
    return app;
  });
}
/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.20.0
 * @author George Michael Brower
 * @license MIT
 */
class Controller {
  constructor(parent, object, property, className, elementType = "div") {
    this.parent = parent;
    this.object = object;
    this.property = property;
    this._disabled = false;
    this._hidden = false;
    this.initialValue = this.getValue();
    this.domElement = document.createElement(elementType);
    this.domElement.classList.add("controller");
    this.domElement.classList.add(className);
    this.$name = document.createElement("div");
    this.$name.classList.add("name");
    Controller.nextNameID = Controller.nextNameID || 0;
    this.$name.id = `lil-gui-name-${++Controller.nextNameID}`;
    this.$widget = document.createElement("div");
    this.$widget.classList.add("widget");
    this.$disable = this.$widget;
    this.domElement.appendChild(this.$name);
    this.domElement.appendChild(this.$widget);
    this.domElement.addEventListener("keydown", (e) => e.stopPropagation());
    this.domElement.addEventListener("keyup", (e) => e.stopPropagation());
    this.parent.children.push(this);
    this.parent.controllers.push(this);
    this.parent.$children.appendChild(this.domElement);
    this._listenCallback = this._listenCallback.bind(this);
    this.name(property);
  }
  /**
   * Sets the name of the controller and its label in the GUI.
   * @param {string} name
   * @returns {this}
   */
  name(name) {
    this._name = name;
    this.$name.textContent = name;
    return this;
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
  onChange(callback) {
    this._onChange = callback;
    return this;
  }
  /**
   * Calls the onChange methods of this controller and its parent GUI.
   * @protected
   */
  _callOnChange() {
    this.parent._callOnChange(this);
    if (this._onChange !== void 0) {
      this._onChange.call(this, this.getValue());
    }
    this._changed = true;
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
  onFinishChange(callback) {
    this._onFinishChange = callback;
    return this;
  }
  /**
   * Should be called by Controller when its widgets lose focus.
   * @protected
   */
  _callOnFinishChange() {
    if (this._changed) {
      this.parent._callOnFinishChange(this);
      if (this._onFinishChange !== void 0) {
        this._onFinishChange.call(this, this.getValue());
      }
    }
    this._changed = false;
  }
  /**
   * Sets the controller back to its initial value.
   * @returns {this}
   */
  reset() {
    this.setValue(this.initialValue);
    this._callOnFinishChange();
    return this;
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
  enable(enabled = true) {
    return this.disable(!enabled);
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
  disable(disabled = true) {
    if (disabled === this._disabled) return this;
    this._disabled = disabled;
    this.domElement.classList.toggle("disabled", disabled);
    this.$disable.toggleAttribute("disabled", disabled);
    return this;
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
  show(show = true) {
    this._hidden = !show;
    this.domElement.style.display = this._hidden ? "none" : "";
    return this;
  }
  /**
   * Hides the Controller.
   * @returns {this}
   */
  hide() {
    return this.show(false);
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
  options(options) {
    const controller = this.parent.add(this.object, this.property, options);
    controller.name(this._name);
    this.destroy();
    return controller;
  }
  /**
   * Sets the minimum value. Only works on number controllers.
   * @param {number} min
   * @returns {this}
   */
  min(min) {
    return this;
  }
  /**
   * Sets the maximum value. Only works on number controllers.
   * @param {number} max
   * @returns {this}
   */
  max(max) {
    return this;
  }
  /**
   * Values set by this controller will be rounded to multiples of `step`. Only works on number
   * controllers.
   * @param {number} step
   * @returns {this}
   */
  step(step) {
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
  decimals(decimals) {
    return this;
  }
  /**
   * Calls `updateDisplay()` every animation frame. Pass `false` to stop listening.
   * @param {boolean} listen
   * @returns {this}
   */
  listen(listen = true) {
    this._listening = listen;
    if (this._listenCallbackID !== void 0) {
      cancelAnimationFrame(this._listenCallbackID);
      this._listenCallbackID = void 0;
    }
    if (this._listening) {
      this._listenCallback();
    }
    return this;
  }
  _listenCallback() {
    this._listenCallbackID = requestAnimationFrame(this._listenCallback);
    const curValue = this.save();
    if (curValue !== this._listenPrevValue) {
      this.updateDisplay();
    }
    this._listenPrevValue = curValue;
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
  setValue(value) {
    if (this.getValue() !== value) {
      this.object[this.property] = value;
      this._callOnChange();
      this.updateDisplay();
    }
    return this;
  }
  /**
   * Updates the display to keep it in sync with the current value. Useful for updating your
   * controllers when their values have been modified outside of the GUI.
   * @returns {this}
   */
  updateDisplay() {
    return this;
  }
  load(value) {
    this.setValue(value);
    this._callOnFinishChange();
    return this;
  }
  save() {
    return this.getValue();
  }
  /**
   * Destroys this controller and removes it from the parent GUI.
   */
  destroy() {
    this.listen(false);
    this.parent.children.splice(this.parent.children.indexOf(this), 1);
    this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1);
    this.parent.$children.removeChild(this.domElement);
  }
}
class BooleanController extends Controller {
  constructor(parent, object, property) {
    super(parent, object, property, "boolean", "label");
    this.$input = document.createElement("input");
    this.$input.setAttribute("type", "checkbox");
    this.$input.setAttribute("aria-labelledby", this.$name.id);
    this.$widget.appendChild(this.$input);
    this.$input.addEventListener("change", () => {
      this.setValue(this.$input.checked);
      this._callOnFinishChange();
    });
    this.$disable = this.$input;
    this.updateDisplay();
  }
  updateDisplay() {
    this.$input.checked = this.getValue();
    return this;
  }
}
function normalizeColorString(string) {
  let match, result;
  if (match = string.match(/(#|0x)?([a-f0-9]{6})/i)) {
    result = match[2];
  } else if (match = string.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) {
    result = parseInt(match[1]).toString(16).padStart(2, 0) + parseInt(match[2]).toString(16).padStart(2, 0) + parseInt(match[3]).toString(16).padStart(2, 0);
  } else if (match = string.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) {
    result = match[1] + match[1] + match[2] + match[2] + match[3] + match[3];
  }
  if (result) {
    return "#" + result;
  }
  return false;
}
const STRING = {
  isPrimitive: true,
  match: (v) => typeof v === "string",
  fromHexString: normalizeColorString,
  toHexString: normalizeColorString
};
const INT = {
  isPrimitive: true,
  match: (v) => typeof v === "number",
  fromHexString: (string) => parseInt(string.substring(1), 16),
  toHexString: (value) => "#" + value.toString(16).padStart(6, 0)
};
const ARRAY = {
  isPrimitive: false,
  // The arrow function is here to appease tree shakers like esbuild or webpack.
  // See https://esbuild.github.io/api/#tree-shaking
  match: (v) => Array.isArray(v),
  fromHexString(string, target, rgbScale = 1) {
    const int = INT.fromHexString(string);
    target[0] = (int >> 16 & 255) / 255 * rgbScale;
    target[1] = (int >> 8 & 255) / 255 * rgbScale;
    target[2] = (int & 255) / 255 * rgbScale;
  },
  toHexString([r, g, b], rgbScale = 1) {
    rgbScale = 255 / rgbScale;
    const int = r * rgbScale << 16 ^ g * rgbScale << 8 ^ b * rgbScale << 0;
    return INT.toHexString(int);
  }
};
const OBJECT = {
  isPrimitive: false,
  match: (v) => Object(v) === v,
  fromHexString(string, target, rgbScale = 1) {
    const int = INT.fromHexString(string);
    target.r = (int >> 16 & 255) / 255 * rgbScale;
    target.g = (int >> 8 & 255) / 255 * rgbScale;
    target.b = (int & 255) / 255 * rgbScale;
  },
  toHexString({ r, g, b }, rgbScale = 1) {
    rgbScale = 255 / rgbScale;
    const int = r * rgbScale << 16 ^ g * rgbScale << 8 ^ b * rgbScale << 0;
    return INT.toHexString(int);
  }
};
const FORMATS = [STRING, INT, ARRAY, OBJECT];
function getColorFormat(value) {
  return FORMATS.find((format) => format.match(value));
}
class ColorController extends Controller {
  constructor(parent, object, property, rgbScale) {
    super(parent, object, property, "color");
    this.$input = document.createElement("input");
    this.$input.setAttribute("type", "color");
    this.$input.setAttribute("tabindex", -1);
    this.$input.setAttribute("aria-labelledby", this.$name.id);
    this.$text = document.createElement("input");
    this.$text.setAttribute("type", "text");
    this.$text.setAttribute("spellcheck", "false");
    this.$text.setAttribute("aria-labelledby", this.$name.id);
    this.$display = document.createElement("div");
    this.$display.classList.add("display");
    this.$display.appendChild(this.$input);
    this.$widget.appendChild(this.$display);
    this.$widget.appendChild(this.$text);
    this._format = getColorFormat(this.initialValue);
    this._rgbScale = rgbScale;
    this._initialValueHexString = this.save();
    this._textFocused = false;
    this.$input.addEventListener("input", () => {
      this._setValueFromHexString(this.$input.value);
    });
    this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    });
    this.$text.addEventListener("input", () => {
      const tryParse = normalizeColorString(this.$text.value);
      if (tryParse) {
        this._setValueFromHexString(tryParse);
      }
    });
    this.$text.addEventListener("focus", () => {
      this._textFocused = true;
      this.$text.select();
    });
    this.$text.addEventListener("blur", () => {
      this._textFocused = false;
      this.updateDisplay();
      this._callOnFinishChange();
    });
    this.$disable = this.$text;
    this.updateDisplay();
  }
  reset() {
    this._setValueFromHexString(this._initialValueHexString);
    return this;
  }
  _setValueFromHexString(value) {
    if (this._format.isPrimitive) {
      const newValue = this._format.fromHexString(value);
      this.setValue(newValue);
    } else {
      this._format.fromHexString(value, this.getValue(), this._rgbScale);
      this._callOnChange();
      this.updateDisplay();
    }
  }
  save() {
    return this._format.toHexString(this.getValue(), this._rgbScale);
  }
  load(value) {
    this._setValueFromHexString(value);
    this._callOnFinishChange();
    return this;
  }
  updateDisplay() {
    this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale);
    if (!this._textFocused) {
      this.$text.value = this.$input.value.substring(1);
    }
    this.$display.style.backgroundColor = this.$input.value;
    return this;
  }
}
class FunctionController extends Controller {
  constructor(parent, object, property) {
    super(parent, object, property, "function");
    this.$button = document.createElement("button");
    this.$button.appendChild(this.$name);
    this.$widget.appendChild(this.$button);
    this.$button.addEventListener("click", (e) => {
      e.preventDefault();
      this.getValue().call(this.object);
      this._callOnChange();
    });
    this.$button.addEventListener("touchstart", () => {
    }, { passive: true });
    this.$disable = this.$button;
  }
}
class NumberController extends Controller {
  constructor(parent, object, property, min, max, step) {
    super(parent, object, property, "number");
    this._initInput();
    this.min(min);
    this.max(max);
    const stepExplicit = step !== void 0;
    this.step(stepExplicit ? step : this._getImplicitStep(), stepExplicit);
    this.updateDisplay();
  }
  decimals(decimals) {
    this._decimals = decimals;
    this.updateDisplay();
    return this;
  }
  min(min) {
    this._min = min;
    this._onUpdateMinMax();
    return this;
  }
  max(max) {
    this._max = max;
    this._onUpdateMinMax();
    return this;
  }
  step(step, explicit = true) {
    this._step = step;
    this._stepExplicit = explicit;
    return this;
  }
  updateDisplay() {
    const value = this.getValue();
    if (this._hasSlider) {
      let percent = (value - this._min) / (this._max - this._min);
      percent = Math.max(0, Math.min(percent, 1));
      this.$fill.style.width = percent * 100 + "%";
    }
    if (!this._inputFocused) {
      this.$input.value = this._decimals === void 0 ? value : value.toFixed(this._decimals);
    }
    return this;
  }
  _initInput() {
    this.$input = document.createElement("input");
    this.$input.setAttribute("type", "text");
    this.$input.setAttribute("aria-labelledby", this.$name.id);
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      this.$input.setAttribute("type", "number");
      this.$input.setAttribute("step", "any");
    }
    this.$widget.appendChild(this.$input);
    this.$disable = this.$input;
    const onInput = () => {
      let value = parseFloat(this.$input.value);
      if (isNaN(value)) return;
      if (this._stepExplicit) {
        value = this._snap(value);
      }
      this.setValue(this._clamp(value));
    };
    const increment = (delta) => {
      const value = parseFloat(this.$input.value);
      if (isNaN(value)) return;
      this._snapClampSetValue(value + delta);
      this.$input.value = this.getValue();
    };
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        this.$input.blur();
      }
      if (e.code === "ArrowUp") {
        e.preventDefault();
        increment(this._step * this._arrowKeyMultiplier(e));
      }
      if (e.code === "ArrowDown") {
        e.preventDefault();
        increment(this._step * this._arrowKeyMultiplier(e) * -1);
      }
    };
    const onWheel = (e) => {
      if (this._inputFocused) {
        e.preventDefault();
        increment(this._step * this._normalizeMouseWheel(e));
      }
    };
    let testingForVerticalDrag = false, initClientX, initClientY, prevClientY, initValue, dragDelta;
    const DRAG_THRESH = 5;
    const onMouseDown = (e) => {
      initClientX = e.clientX;
      initClientY = prevClientY = e.clientY;
      testingForVerticalDrag = true;
      initValue = this.getValue();
      dragDelta = 0;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };
    const onMouseMove = (e) => {
      if (testingForVerticalDrag) {
        const dx = e.clientX - initClientX;
        const dy = e.clientY - initClientY;
        if (Math.abs(dy) > DRAG_THRESH) {
          e.preventDefault();
          this.$input.blur();
          testingForVerticalDrag = false;
          this._setDraggingStyle(true, "vertical");
        } else if (Math.abs(dx) > DRAG_THRESH) {
          onMouseUp();
        }
      }
      if (!testingForVerticalDrag) {
        const dy = e.clientY - prevClientY;
        dragDelta -= dy * this._step * this._arrowKeyMultiplier(e);
        if (initValue + dragDelta > this._max) {
          dragDelta = this._max - initValue;
        } else if (initValue + dragDelta < this._min) {
          dragDelta = this._min - initValue;
        }
        this._snapClampSetValue(initValue + dragDelta);
      }
      prevClientY = e.clientY;
    };
    const onMouseUp = () => {
      this._setDraggingStyle(false, "vertical");
      this._callOnFinishChange();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    const onFocus = () => {
      this._inputFocused = true;
    };
    const onBlur = () => {
      this._inputFocused = false;
      this.updateDisplay();
      this._callOnFinishChange();
    };
    this.$input.addEventListener("input", onInput);
    this.$input.addEventListener("keydown", onKeyDown);
    this.$input.addEventListener("wheel", onWheel, { passive: false });
    this.$input.addEventListener("mousedown", onMouseDown);
    this.$input.addEventListener("focus", onFocus);
    this.$input.addEventListener("blur", onBlur);
  }
  _initSlider() {
    this._hasSlider = true;
    this.$slider = document.createElement("div");
    this.$slider.classList.add("slider");
    this.$fill = document.createElement("div");
    this.$fill.classList.add("fill");
    this.$slider.appendChild(this.$fill);
    this.$widget.insertBefore(this.$slider, this.$input);
    this.domElement.classList.add("hasSlider");
    const map = (v, a, b, c, d) => {
      return (v - a) / (b - a) * (d - c) + c;
    };
    const setValueFromX = (clientX) => {
      const rect = this.$slider.getBoundingClientRect();
      let value = map(clientX, rect.left, rect.right, this._min, this._max);
      this._snapClampSetValue(value);
    };
    const mouseDown = (e) => {
      this._setDraggingStyle(true);
      setValueFromX(e.clientX);
      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    };
    const mouseMove = (e) => {
      setValueFromX(e.clientX);
    };
    const mouseUp = () => {
      this._callOnFinishChange();
      this._setDraggingStyle(false);
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("mouseup", mouseUp);
    };
    let testingForScroll = false, prevClientX, prevClientY;
    const beginTouchDrag = (e) => {
      e.preventDefault();
      this._setDraggingStyle(true);
      setValueFromX(e.touches[0].clientX);
      testingForScroll = false;
    };
    const onTouchStart = (e) => {
      if (e.touches.length > 1) return;
      if (this._hasScrollBar) {
        prevClientX = e.touches[0].clientX;
        prevClientY = e.touches[0].clientY;
        testingForScroll = true;
      } else {
        beginTouchDrag(e);
      }
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      window.addEventListener("touchend", onTouchEnd);
    };
    const onTouchMove = (e) => {
      if (testingForScroll) {
        const dx = e.touches[0].clientX - prevClientX;
        const dy = e.touches[0].clientY - prevClientY;
        if (Math.abs(dx) > Math.abs(dy)) {
          beginTouchDrag(e);
        } else {
          window.removeEventListener("touchmove", onTouchMove);
          window.removeEventListener("touchend", onTouchEnd);
        }
      } else {
        e.preventDefault();
        setValueFromX(e.touches[0].clientX);
      }
    };
    const onTouchEnd = () => {
      this._callOnFinishChange();
      this._setDraggingStyle(false);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    const callOnFinishChange = this._callOnFinishChange.bind(this);
    const WHEEL_DEBOUNCE_TIME = 400;
    let wheelFinishChangeTimeout;
    const onWheel = (e) => {
      const isVertical = Math.abs(e.deltaX) < Math.abs(e.deltaY);
      if (isVertical && this._hasScrollBar) return;
      e.preventDefault();
      const delta = this._normalizeMouseWheel(e) * this._step;
      this._snapClampSetValue(this.getValue() + delta);
      this.$input.value = this.getValue();
      clearTimeout(wheelFinishChangeTimeout);
      wheelFinishChangeTimeout = setTimeout(callOnFinishChange, WHEEL_DEBOUNCE_TIME);
    };
    this.$slider.addEventListener("mousedown", mouseDown);
    this.$slider.addEventListener("touchstart", onTouchStart, { passive: false });
    this.$slider.addEventListener("wheel", onWheel, { passive: false });
  }
  _setDraggingStyle(active, axis = "horizontal") {
    if (this.$slider) {
      this.$slider.classList.toggle("active", active);
    }
    document.body.classList.toggle("lil-gui-dragging", active);
    document.body.classList.toggle(`lil-gui-${axis}`, active);
  }
  _getImplicitStep() {
    if (this._hasMin && this._hasMax) {
      return (this._max - this._min) / 1e3;
    }
    return 0.1;
  }
  _onUpdateMinMax() {
    if (!this._hasSlider && this._hasMin && this._hasMax) {
      if (!this._stepExplicit) {
        this.step(this._getImplicitStep(), false);
      }
      this._initSlider();
      this.updateDisplay();
    }
  }
  _normalizeMouseWheel(e) {
    let { deltaX, deltaY } = e;
    if (Math.floor(e.deltaY) !== e.deltaY && e.wheelDelta) {
      deltaX = 0;
      deltaY = -e.wheelDelta / 120;
      deltaY *= this._stepExplicit ? 1 : 10;
    }
    const wheel = deltaX + -deltaY;
    return wheel;
  }
  _arrowKeyMultiplier(e) {
    let mult = this._stepExplicit ? 1 : 10;
    if (e.shiftKey) {
      mult *= 10;
    } else if (e.altKey) {
      mult /= 10;
    }
    return mult;
  }
  _snap(value) {
    let offset = 0;
    if (this._hasMin) {
      offset = this._min;
    } else if (this._hasMax) {
      offset = this._max;
    }
    value -= offset;
    value = Math.round(value / this._step) * this._step;
    value += offset;
    value = parseFloat(value.toPrecision(15));
    return value;
  }
  _clamp(value) {
    if (value < this._min) value = this._min;
    if (value > this._max) value = this._max;
    return value;
  }
  _snapClampSetValue(value) {
    this.setValue(this._clamp(this._snap(value)));
  }
  get _hasScrollBar() {
    const root = this.parent.root.$children;
    return root.scrollHeight > root.clientHeight;
  }
  get _hasMin() {
    return this._min !== void 0;
  }
  get _hasMax() {
    return this._max !== void 0;
  }
}
class OptionController extends Controller {
  constructor(parent, object, property, options) {
    super(parent, object, property, "option");
    this.$select = document.createElement("select");
    this.$select.setAttribute("aria-labelledby", this.$name.id);
    this.$display = document.createElement("div");
    this.$display.classList.add("display");
    this.$select.addEventListener("change", () => {
      this.setValue(this._values[this.$select.selectedIndex]);
      this._callOnFinishChange();
    });
    this.$select.addEventListener("focus", () => {
      this.$display.classList.add("focus");
    });
    this.$select.addEventListener("blur", () => {
      this.$display.classList.remove("focus");
    });
    this.$widget.appendChild(this.$select);
    this.$widget.appendChild(this.$display);
    this.$disable = this.$select;
    this.options(options);
  }
  options(options) {
    this._values = Array.isArray(options) ? options : Object.values(options);
    this._names = Array.isArray(options) ? options : Object.keys(options);
    this.$select.replaceChildren();
    this._names.forEach((name) => {
      const $option = document.createElement("option");
      $option.textContent = name;
      this.$select.appendChild($option);
    });
    this.updateDisplay();
    return this;
  }
  updateDisplay() {
    const value = this.getValue();
    const index = this._values.indexOf(value);
    this.$select.selectedIndex = index;
    this.$display.textContent = index === -1 ? value : this._names[index];
    return this;
  }
}
class StringController extends Controller {
  constructor(parent, object, property) {
    super(parent, object, property, "string");
    this.$input = document.createElement("input");
    this.$input.setAttribute("type", "text");
    this.$input.setAttribute("spellcheck", "false");
    this.$input.setAttribute("aria-labelledby", this.$name.id);
    this.$input.addEventListener("input", () => {
      this.setValue(this.$input.value);
    });
    this.$input.addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        this.$input.blur();
      }
    });
    this.$input.addEventListener("blur", () => {
      this._callOnFinishChange();
    });
    this.$widget.appendChild(this.$input);
    this.$disable = this.$input;
    this.updateDisplay();
  }
  updateDisplay() {
    this.$input.value = this.getValue();
    return this;
  }
}
var stylesheet = `.lil-gui {
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
function _injectStyles(cssContent) {
  const injected = document.createElement("style");
  injected.innerHTML = cssContent;
  const before = document.querySelector("head link[rel=stylesheet], head style");
  if (before) {
    document.head.insertBefore(injected, before);
  } else {
    document.head.appendChild(injected);
  }
}
let stylesInjected = false;
class GUI {
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
    parent,
    autoPlace = parent === void 0,
    container,
    width,
    title = "Controls",
    closeFolders = false,
    injectStyles = true,
    touchStyles = true
  } = {}) {
    this.parent = parent;
    this.root = parent ? parent.root : this;
    this.children = [];
    this.controllers = [];
    this.folders = [];
    this._closed = false;
    this._hidden = false;
    this.domElement = document.createElement("div");
    this.domElement.classList.add("lil-gui");
    this.$title = document.createElement("button");
    this.$title.classList.add("title");
    this.$title.setAttribute("aria-expanded", true);
    this.$title.addEventListener("click", () => this.openAnimated(this._closed));
    this.$title.addEventListener("touchstart", () => {
    }, { passive: true });
    this.$children = document.createElement("div");
    this.$children.classList.add("children");
    this.domElement.appendChild(this.$title);
    this.domElement.appendChild(this.$children);
    this.title(title);
    if (this.parent) {
      this.parent.children.push(this);
      this.parent.folders.push(this);
      this.parent.$children.appendChild(this.domElement);
      return;
    }
    this.domElement.classList.add("root");
    if (touchStyles) {
      this.domElement.classList.add("allow-touch-styles");
    }
    if (!stylesInjected && injectStyles) {
      _injectStyles(stylesheet);
      stylesInjected = true;
    }
    if (container) {
      container.appendChild(this.domElement);
    } else if (autoPlace) {
      this.domElement.classList.add("autoPlace");
      document.body.appendChild(this.domElement);
    }
    if (width) {
      this.domElement.style.setProperty("--width", width + "px");
    }
    this._closeFolders = closeFolders;
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
  add(object, property, $1, max, step) {
    if (Object($1) === $1) {
      return new OptionController(this, object, property, $1);
    }
    const initialValue = object[property];
    switch (typeof initialValue) {
      case "number":
        return new NumberController(this, object, property, $1, max, step);
      case "boolean":
        return new BooleanController(this, object, property);
      case "string":
        return new StringController(this, object, property);
      case "function":
        return new FunctionController(this, object, property);
    }
    console.error(`gui.add failed
	property:`, property, `
	object:`, object, `
	value:`, initialValue);
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
  addColor(object, property, rgbScale = 1) {
    return new ColorController(this, object, property, rgbScale);
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
  addFolder(title) {
    const folder = new GUI({ parent: this, title });
    if (this.root._closeFolders) folder.close();
    return folder;
  }
  /**
   * Recalls values that were saved with `gui.save()`.
   * @param {object} obj
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  load(obj, recursive = true) {
    if (obj.controllers) {
      this.controllers.forEach((c) => {
        if (c instanceof FunctionController) return;
        if (c._name in obj.controllers) {
          c.load(obj.controllers[c._name]);
        }
      });
    }
    if (recursive && obj.folders) {
      this.folders.forEach((f) => {
        if (f._title in obj.folders) {
          f.load(obj.folders[f._title]);
        }
      });
    }
    return this;
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
  save(recursive = true) {
    const obj = {
      controllers: {},
      folders: {}
    };
    this.controllers.forEach((c) => {
      if (c instanceof FunctionController) return;
      if (c._name in obj.controllers) {
        throw new Error(`Cannot save GUI with duplicate property "${c._name}"`);
      }
      obj.controllers[c._name] = c.save();
    });
    if (recursive) {
      this.folders.forEach((f) => {
        if (f._title in obj.folders) {
          throw new Error(`Cannot save GUI with duplicate folder "${f._title}"`);
        }
        obj.folders[f._title] = f.save();
      });
    }
    return obj;
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
  open(open = true) {
    this._setClosed(!open);
    this.$title.setAttribute("aria-expanded", !this._closed);
    this.domElement.classList.toggle("closed", this._closed);
    return this;
  }
  /**
   * Closes the GUI.
   * @returns {this}
   */
  close() {
    return this.open(false);
  }
  _setClosed(closed) {
    if (this._closed === closed) return;
    this._closed = closed;
    this._callOnOpenClose(this);
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
  show(show = true) {
    this._hidden = !show;
    this.domElement.style.display = this._hidden ? "none" : "";
    return this;
  }
  /**
   * Hides the GUI.
   * @returns {this}
   */
  hide() {
    return this.show(false);
  }
  openAnimated(open = true) {
    this._setClosed(!open);
    this.$title.setAttribute("aria-expanded", !this._closed);
    requestAnimationFrame(() => {
      const initialHeight = this.$children.clientHeight;
      this.$children.style.height = initialHeight + "px";
      this.domElement.classList.add("transition");
      const onTransitionEnd = (e) => {
        if (e.target !== this.$children) return;
        this.$children.style.height = "";
        this.domElement.classList.remove("transition");
        this.$children.removeEventListener("transitionend", onTransitionEnd);
      };
      this.$children.addEventListener("transitionend", onTransitionEnd);
      const targetHeight = !open ? 0 : this.$children.scrollHeight;
      this.domElement.classList.toggle("closed", !open);
      requestAnimationFrame(() => {
        this.$children.style.height = targetHeight + "px";
      });
    });
    return this;
  }
  /**
   * Change the title of this GUI.
   * @param {string} title
   * @returns {this}
   */
  title(title) {
    this._title = title;
    this.$title.textContent = title;
    return this;
  }
  /**
   * Resets all controllers to their initial values.
   * @param {boolean} recursive Pass false to exclude folders descending from this GUI.
   * @returns {this}
   */
  reset(recursive = true) {
    const controllers = recursive ? this.controllersRecursive() : this.controllers;
    controllers.forEach((c) => c.reset());
    return this;
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
  onChange(callback) {
    this._onChange = callback;
    return this;
  }
  _callOnChange(controller) {
    if (this.parent) {
      this.parent._callOnChange(controller);
    }
    if (this._onChange !== void 0) {
      this._onChange.call(this, {
        object: controller.object,
        property: controller.property,
        value: controller.getValue(),
        controller
      });
    }
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
  onFinishChange(callback) {
    this._onFinishChange = callback;
    return this;
  }
  _callOnFinishChange(controller) {
    if (this.parent) {
      this.parent._callOnFinishChange(controller);
    }
    if (this._onFinishChange !== void 0) {
      this._onFinishChange.call(this, {
        object: controller.object,
        property: controller.property,
        value: controller.getValue(),
        controller
      });
    }
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
  onOpenClose(callback) {
    this._onOpenClose = callback;
    return this;
  }
  _callOnOpenClose(changedGUI) {
    if (this.parent) {
      this.parent._callOnOpenClose(changedGUI);
    }
    if (this._onOpenClose !== void 0) {
      this._onOpenClose.call(this, changedGUI);
    }
  }
  /**
   * Destroys all DOM elements and event listeners associated with this GUI.
   */
  destroy() {
    if (this.parent) {
      this.parent.children.splice(this.parent.children.indexOf(this), 1);
      this.parent.folders.splice(this.parent.folders.indexOf(this), 1);
    }
    if (this.domElement.parentElement) {
      this.domElement.parentElement.removeChild(this.domElement);
    }
    Array.from(this.children).forEach((c) => c.destroy());
  }
  /**
   * Returns an array of controllers contained by this GUI and its descendents.
   * @returns {Controller[]}
   */
  controllersRecursive() {
    let controllers = Array.from(this.controllers);
    this.folders.forEach((f) => {
      controllers = controllers.concat(f.controllersRecursive());
    });
    return controllers;
  }
  /**
   * Returns an array of folders contained by this GUI and its descendents.
   * @returns {GUI[]}
   */
  foldersRecursive() {
    let folders = Array.from(this.folders);
    this.folders.forEach((f) => {
      folders = folders.concat(f.foldersRecursive());
    });
    return folders;
  }
}
const RenderingCanvas = function RenderingCanvas2({
  app,
  onError
}) {
  const animateRequestRef = useRef();
  const canvasRef = useRef(null);
  const guiPaneRef = useRef(null);
  const hibernateRef = useRef(false);
  const guiRef = useRef();
  const [guiDocked, setGUIDocked] = useState(true);
  const resizeTimeout = useRef();
  const lastTimeRef = useRef();
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const devicePixelRatio = window.devicePixelRatio;
      canvas.width = Math.max(canvas.offsetWidth * devicePixelRatio, 1);
      canvas.height = Math.max(canvas.offsetHeight * devicePixelRatio, 1);
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(() => {
        var _a;
        try {
          if (canvas.width <= 1 || canvas.height <= 1) {
            hibernateRef.current = true;
            console.log("Hibernate");
            return;
          }
          hibernateRef.current = false;
          (_a = app.handleResize) == null ? void 0 : _a.call(app, canvas.width, canvas.height);
        } catch (err) {
          onError(err);
        }
      }, 500);
      return () => {
        clearTimeout(resizeTimeout.current);
      };
    }
  }, [app, onError]);
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);
  const animate = useCallback(
    (time) => {
      var _a;
      const drawContext = (_a = canvasRef.current) == null ? void 0 : _a.getContext("webgpu");
      if (drawContext) {
        const deltaTime = time - (lastTimeRef.current ?? 0);
        lastTimeRef.current = time;
        const drawTexture = drawContext.getCurrentTexture();
        try {
          if (!hibernateRef.current) {
            app.draw(
              drawTexture,
              canvasRef.current.width / canvasRef.current.height,
              time,
              deltaTime
            );
          }
        } catch (err) {
          onError(err);
        }
        if (!app.quit) {
          animateRequestRef.current = requestAnimationFrame(animate);
        }
      }
    },
    [app, onError]
  );
  useEffect(() => {
    var _a, _b, _c;
    const context = (_a = canvasRef.current) == null ? void 0 : _a.getContext("webgpu");
    if (guiRef.current) {
      (_b = guiRef.current) == null ? void 0 : _b.destroy();
    }
    guiRef.current = new GUI({ container: guiPaneRef.current });
    if (app.setLowPerformanceMode) {
      guiRef.current.add({ checked: false }, "checked").onChange((checked) => {
        var _a2;
        (_a2 = app.setLowPerformanceMode) == null ? void 0 : _a2.call(app, checked);
      }).name("Low Performance Mode");
    }
    if (app.setupUI) {
      guiRef.current.onOpenClose((gui) => {
        if (gui == guiRef.current) {
          setGUIDocked(!gui._closed);
        }
      });
      try {
        app.setupUI(guiRef.current);
      } catch (err) {
        onError(err);
      }
    }
    if (!context) {
      console.error("'webgpu' canvas context not found, cannot animate.");
      return;
    }
    context.configure(app.presentationInterface());
    animateRequestRef.current = requestAnimationFrame(animate);
    const canvas = canvasRef.current;
    if (canvas) {
      (_c = app.handleResize) == null ? void 0 : _c.call(app, canvas.width, canvas.height);
    }
    return () => {
      if (animateRequestRef.current !== void 0) {
        cancelAnimationFrame(animateRequestRef.current);
      }
    };
  }, [animate, app, setGUIDocked, onError]);
  useEffect(() => {
    resizeCanvas();
  }, [resizeCanvas, guiDocked]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "webgpu-samples-canvas-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { className: "webgpu-samples-canvas", ref: canvasRef }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: guiDocked ? void 0 : "webgpu-samples-gui-floating",
        ref: guiPaneRef
      }
    ),
    void 0
  ] });
};
const AppLoader = function AppLoader2({
  sampleID
}) {
  const [errors, setErrors] = useState();
  const appRef = useRef();
  const appLoadingPromiseRef = useRef();
  const [initialized, setInitialized] = useState(false);
  const handleError = useCallback(
    (err) => {
      console.error(err);
      if (err instanceof Error) {
        setErrors([
          err.message,
          ...typeof err.cause === "string" ? [err.cause] : []
        ]);
      } else {
        setErrors(["Failed to initialize app."]);
      }
    },
    [setErrors]
  );
  const sample = SampleInitDescriptorByID.get(sampleID);
  useEffect(() => {
    if (sample === void 0) {
      setErrors(["No such sample, please navigate to another page."]);
      setInitialized(true);
      return;
    }
    if (!("gpu" in navigator)) {
      setErrors([
        "WebGPU is not available in this browser.",
        "navigator.gpu is null"
      ]);
      setInitialized(true);
      return;
    }
    setInitialized(false);
    setErrors(void 0);
    let shouldUpdate = true;
    appLoadingPromiseRef.current = initializeApp({
      gpu: navigator.gpu,
      requiredLimits: sample.requiredLimits,
      requiredFeatures: sample.requiredFeatures,
      optionalFeatures: sample.optionalFeatures,
      import: sample.import,
      onUncapturedError: (ev) => {
        console.error(`WebGPU device uncaptured error: ${ev.error.message}`);
        setErrors(["WebGPU has encountered an error, causing it to crash."]);
      }
    }).then((app) => {
      if (!shouldUpdate) return;
      appRef.current = app;
    }).catch((err) => {
      if (!shouldUpdate) return;
      handleError(err);
    }).finally(() => {
      if (!shouldUpdate) return;
      appLoadingPromiseRef.current = void 0;
      setInitialized(true);
    });
    return () => {
      var _a, _b;
      shouldUpdate = false;
      (_b = (_a = appRef.current) == null ? void 0 : _a.destroy) == null ? void 0 : _b.call(_a);
    };
  }, [sample, handleError]);
  const errorBlock = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "webgpu-samples-info", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: `Sorry, there was an issue, cause the sample to fail to load or crash.
            This app uses WebGPU, which can be unstable on some browsers.
            Try updating or using another browser.` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "webgpu-samples-error", children: errors == null ? void 0 : errors.map((value) => {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: value }, value);
    }) })
  ] });
  const loadingBlock = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "webgpu-samples-info", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: `Loading...` }) });
  if (navigator.gpu === void 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "webgpu-samples-info", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: `Your browser does not support WebGPU. Please try another.` }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: initialized ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: errors !== void 0 ? errorBlock : /* @__PURE__ */ jsxRuntimeExports.jsx(RenderingCanvas, { app: appRef.current, onError: handleError }) }) : loadingBlock });
};
export {
  AppLoader,
  DefaultSampleID,
  EmbeddedReadme,
  SampleDisplayDescriptorByID,
  SampleIDs
};
