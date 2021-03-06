//There is no good reason for you to be reading this file

if(!{{NATIVE}}) {

				  /////////////////////////////////////////////
				 /////////////////  INDEXOF  /////////////////
				/////////////////////////////////////////////

	//From MDN
	if (!Array.prototype.indexOf) {
	  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
		'use strict';
		if (this == null) {
		  throw new TypeError();
		}
		var n, k, t = Object(this),
			len = t.length >>> 0;

		if (len === 0) {
		  return -1;
		}
		n = 0;
		if (arguments.length > 1) {
		  n = Number(arguments[1]);
		  if (n != n) { // shortcut for verifying if it's NaN
			n = 0;
		  } else if (n != 0 && n != Infinity && n != -Infinity) {
			n = (n > 0 || -1) * Math.floor(Math.abs(n));
		  }
		}
		if (n >= len) {
		  return -1;
		}
		for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
		  if (k in t && t[k] === searchElement) {
			return k;
		  }
		}
		return -1;
	  };
	}

				  /////////////////////////////////////////////
				 /////////////////  FOREACH  /////////////////
				/////////////////////////////////////////////

	// Production steps of ECMA-262, Edition 5, 15.4.4.18
	// Reference: http://es5.github.com/#x15.4.4.18
	if ( !Array.prototype.forEach ) {

	  Array.prototype.forEach = function( callback, thisArg ) {

		var T, k;

		if ( this == null ) {
		  throw new TypeError( " this is null or not defined" );
		}

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0; // Hack to convert O.length to a UInt32

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if ( {}.toString.call(callback) != "[object Function]" ) {
		  throw new TypeError( callback + " is not a function" );
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if ( thisArg ) {
		  T = thisArg;
		}

		// 6. Let k be 0
		k = 0;

		// 7. Repeat, while k < len
		while( k < len ) {

		  var kValue;

		  // a. Let Pk be ToString(k).
		  //   This is implicit for LHS operands of the in operator
		  // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
		  //   This step can be combined with c
		  // c. If kPresent is true, then
		  if ( k in O ) {

			// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
			kValue = O[ k ];

			// ii. Call the Call internal method of callback with T as the this value and
			// argument list containing kValue, k, and O.
			callback.call( T, kValue, k, O );
		  }
		  // d. Increase k by 1.
		  k++;
		}
		// 8. return undefined
	  };
	}

				  /////////////////////////////////////////////
				 ///////////////////  MAP  ///////////////////
				/////////////////////////////////////////////

	// Production steps of ECMA-262, Edition 5, 15.4.4.19
	// Reference: http://es5.github.com/#x15.4.4.19
	if (!Array.prototype.map) {
	  Array.prototype.map = function(callback, thisArg) {

		var T, A, k;

		if (this == null) {
		  throw new TypeError(" this is null or not defined");
		}

		// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
		var O = Object(this);

		// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
		// 3. Let len be ToUint32(lenValue).
		var len = O.length >>> 0;

		// 4. If IsCallable(callback) is false, throw a TypeError exception.
		// See: http://es5.github.com/#x9.11
		if ({}.toString.call(callback) != "[object Function]") {
		  throw new TypeError(callback + " is not a function");
		}

		// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
		if (thisArg) {
		  T = thisArg;
		}

		// 6. Let A be a new array created as if by the expression new Array(len) where Array is
		// the standard built-in constructor with that name and len is the value of len.
		A = new Array(len);

		// 7. Let k be 0
		k = 0;

		// 8. Repeat, while k < len
		while(k < len) {

		  var kValue, mappedValue;

		  // a. Let Pk be ToString(k).
		  //   This is implicit for LHS operands of the in operator
		  // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
		  //   This step can be combined with c
		  // c. If kPresent is true, then
		  if (k in O) {

			// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
			kValue = O[ k ];

			// ii. Let mappedValue be the result of calling the Call internal method of callback
			// with T as the this value and argument list containing kValue, k, and O.
			mappedValue = callback.call(T, kValue, k, O);

			// iii. Call the DefineOwnProperty internal method of A with arguments
			// Pk, Property Descriptor {Value: mappedValue, Writable: true, Enumerable: true, Configurable: true},
			// and false.

			// In browsers that support Object.defineProperty, use the following:
			// Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

			// For best browser support, use the following:
			A[ k ] = mappedValue;
		  }
		  // d. Increase k by 1.
		  k++;
		}

		// 9. return A
		return A;
	  };      
	}

				  /////////////////////////////////////////////
				 //////////////////  REDUCE  /////////////////
				/////////////////////////////////////////////

	//I assume I got this from MDN
	if (!Array.prototype.reduce) {
	  Array.prototype.reduce = function reduce(accumulator){
		if (this===null || this===undefined) throw new TypeError("Object is null or undefined");
		var i = 0, l = this.length >> 0, curr;

		if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
		  throw new TypeError("First argument is not callable");

		if(arguments.length < 2) {
		  if (l === 0) throw new TypeError("Array length is 0 and no second argument");
		  curr = this[0];
		  i = 1; // start accumulating at the second element
		}
		else
		  curr = arguments[1];

		while (i < l) {
		  if(i in this) curr = accumulator.call(undefined, curr, this[i], i, this);
		  ++i;
		}

		return curr;
	  };
	}

				  /////////////////////////////////////////////
				 //////////////////  FILTER  /////////////////
				/////////////////////////////////////////////

	//I assume I got this from MDN
	if (!Array.prototype.filter)
	{
	  Array.prototype.filter = function(fun /*, thisp */)
	  {
		"use strict";

		if (this == null)
		  throw new TypeError();

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun != "function")
		  throw new TypeError();

		var res = [];
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
		{
		  if (i in t)
		  {
			var val = t[i]; // in case fun mutates this
			if (fun.call(thisp, val, i, t))
			  res.push(val);
		  }
		}

		return res;
	  };
	}

				  /////////////////////////////////////////////
				 /////////////////   isArray  ////////////////
				/////////////////////////////////////////////

	//I think I found this online somewhere....
	if(!Array.isArray)
		Array.isArray = function(array) {
			return Object.prototype.toString.call(array) === "[object Array]";
		};

				  /////////////////////////////////////////////
				 ///////////////////  BIND  //////////////////
				/////////////////////////////////////////////

	//Credit to MDN
	if (!Function.prototype.bind) {
	  Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
		  // closest thing possible to the ECMAScript 5 internal IsCallable function
		  throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP = function () {},
			fBound = function () {
			  return fToBind.apply(this instanceof fNOP
									 ? this
									 : oThis,
								   aArgs.concat(Array.prototype.slice.call(arguments, 1)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	  };
	}

				  /////////////////////////////////////////////
				 ///////////////  String.trim  ///////////////
				/////////////////////////////////////////////

	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	  };
	}

				  /////////////////////////////////////////////
				 //////////  Object.getPrototypeOf  //////////
				/////////////////////////////////////////////

	//Credit to John Resig, http://ejohn.org/blog/objectgetprototypeof/
	if(typeof Object.getPrototypeOf !== "function") {
		if (typeof "test".__proto__ === "object") {
			Object.getPrototypeOf = function(object){
				return object.__proto__;
			};
		} else {
			Object.getPrototypeOf = function(object){
				// May break if the constructor has been tampered with
				return object.constructor.prototype;
			};
		}
	}
				  /////////////////////////////////////////////
				 ///////////////   Object.keys  //////////////
				/////////////////////////////////////////////

	//Credit to MDN
	if(!Object.keys) {
		Object.keys = (function () {
			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = [
					'toString',
					'toLocaleString',
					'valueOf',
					'hasOwnProperty',
					'isPrototypeOf',
					'propertyIsEnumerable',
					'constructor'],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
				if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

				var result = [];
				for (var prop in obj) {
					if (hasOwnProperty.call(obj, prop)) result.push(prop);
				}

				if (hasDontEnumBug) {
					for (var i=0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
					}
				}
				return result;
			}
		})()
	};

				  /////////////////////////////////////////////
				 ///////////////   Object.keys  //////////////
				/////////////////////////////////////////////

	//credit to MDN
	if (!window.localStorage) try {
	  Object.defineProperty(window, "localStorage", new (function () {
		var aKeys = [], oStorage = {};
		Object.defineProperty(oStorage, "getItem", {
		  value: function (sKey) { return sKey ? this[sKey] : null; },
		  writable: false,
		  configurable: false,
		  enumerable: false
		});
		Object.defineProperty(oStorage, "key", {
		  value: function (nKeyId) { return aKeys[nKeyId]; },
		  writable: false,
		  configurable: false,
		  enumerable: false
		});
		Object.defineProperty(oStorage, "setItem", {
		  value: function (sKey, sValue) {
			if(!sKey) { return; }
			document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
		  },
		  writable: false,
		  configurable: false,
		  enumerable: false
		});
		Object.defineProperty(oStorage, "length", {
		  get: function () { return aKeys.length; },
		  configurable: false,
		  enumerable: false
		});
		Object.defineProperty(oStorage, "removeItem", {
		  value: function (sKey) {
			if(!sKey) { return; }
			document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		  },
		  writable: false,
		  configurable: false,
		  enumerable: false
		});
		this.get = function () {
		  var iThisIndx;
		  for (var sKey in oStorage) {
			iThisIndx = aKeys.indexOf(sKey);
			if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
			else { aKeys.splice(iThisIndx, 1); }
			delete oStorage[sKey];
		  }
		  for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
		  for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
			aCouple = aCouples[nIdx].split(/\s*=\s*/);
			if (aCouple.length > 1) {
			  oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
			  aKeys.push(iKey);
			}
		  }
		  return oStorage;
		};
		this.configurable = false;
		this.enumerable = true;
	  })());
	} catch(e) {
	  window.localStorage = {
		getItem: function (sKey) {
		  if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
		  return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
		},
		key: function (nKeyId) {
		  return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
		},
		setItem: function (sKey, sValue) {
		  if(!sKey) { return; }
		  document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
		  this.length = document.cookie.match(/\=/g).length;
		},
		length: 0,
		removeItem: function (sKey) {
		  if (!sKey || !this.hasOwnProperty(sKey)) { return; }
		  document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
		  this.length--;
		},
		hasOwnProperty: function (sKey) {
		  return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		}
	  };
	  window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
	}

}
