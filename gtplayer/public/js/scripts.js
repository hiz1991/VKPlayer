/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.3",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.4-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-06-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Will be defined later
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();


jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.slice(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( Data.accepts( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					events = Object.keys( data.events || {} );
					if ( events.length ) {
						for ( j = 0; (type = events[j]) !== undefined; j++ ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );

/**
 * Parse JavaScript SDK v1.6.14
 *
 * The source tree of this library can be found at
 *   https://github.com/ParsePlatform/Parse-SDK-JS
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Parse = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

/**
 * Parse.Analytics provides an interface to Parse's logging and analytics
 * backend.
 *
 * @class Parse.Analytics
 * @static
 */

/**
 * Tracks the occurrence of a custom event with additional dimensions.
 * Parse will store a data point at the time of invocation with the given
 * event name.
 *
 * Dimensions will allow segmentation of the occurrences of this custom
 * event. Keys and values should be {@code String}s, and will throw
 * otherwise.
 *
 * To track a user signup along with additional metadata, consider the
 * following:
 * <pre>
 * var dimensions = {
 *  gender: 'm',
 *  source: 'web',
 *  dayType: 'weekend'
 * };
 * Parse.Analytics.track('signup', dimensions);
 * </pre>
 *
 * There is a default limit of 8 dimensions per event tracked.
 *
 * @method track
 * @param {String} name The name of the custom event to report to Parse as
 * having happened.
 * @param {Object} dimensions The dictionary of information by which to
 * segment this event.
 * @param {Object} options A Backbone-style callback object.
 * @return {Parse.Promise} A promise that is resolved when the round-trip
 * to the server completes.
 */
'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.track = track;

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

function track(name, dimensions, options) {
  name = name || '';
  name = name.replace(/^\s*/, '');
  name = name.replace(/\s*$/, '');
  if (name.length === 0) {
    throw new TypeError('A name for the custom event must be provided');
  }

  for (var key in dimensions) {
    if (typeof key !== 'string' || typeof dimensions[key] !== 'string') {
      throw new TypeError('track() dimensions expects keys and values of type "string".');
    }
  }

  options = options || {};
  return _CoreManager2['default'].getAnalyticsController().track(name, dimensions)._thenRunCallbacks(options);
}

_CoreManager2['default'].setAnalyticsController({
  track: function track(name, dimensions) {
    var RESTController = _CoreManager2['default'].getRESTController();
    return RESTController.request('POST', 'events/' + name, { dimensions: dimensions });
  }
});
},{"./CoreManager":3,"babel-runtime/helpers/interop-require-default":47}],2:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.run = run;

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _decode = _dereq_('./decode');

var _decode2 = _interopRequireDefault(_decode);

var _encode = _dereq_('./encode');

var _encode2 = _interopRequireDefault(_encode);

var _ParseError = _dereq_('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

/**
 * Contains functions for calling and declaring
 * <a href="/docs/cloud_code_guide#functions">cloud functions</a>.
 * <p><strong><em>
 *   Some functions are only available from Cloud Code.
 * </em></strong></p>
 *
 * @class Parse.Cloud
 * @static
 */

/**
 * Makes a call to a cloud function.
 * @method run
 * @param {String} name The function name.
 * @param {Object} data The parameters to send to the cloud function.
 * @param {Object} options A Backbone-style options object
 * options.success, if set, should be a function to handle a successful
 * call to a cloud function.  options.error should be a function that
 * handles an error running the cloud function.  Both functions are
 * optional.  Both functions take a single argument.
 * @return {Parse.Promise} A promise that will be resolved with the result
 * of the function.
 */

function run(name, data, options) {
  options = options || {};

  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('Cloud function name must be a string.');
  }

  var requestOptions = {};
  if (options.useMasterKey) {
    requestOptions.useMasterKey = options.useMasterKey;
  }
  if (options.sessionToken) {
    requestOptions.sessionToken = options.sessionToken;
  }

  return _CoreManager2['default'].getCloudController().run(name, data, requestOptions)._thenRunCallbacks(options);
}

_CoreManager2['default'].setCloudController({
  run: function run(name, data, options) {
    var RESTController = _CoreManager2['default'].getRESTController();

    var payload = (0, _encode2['default'])(data, true);

    var requestOptions = {};
    if (options.hasOwnProperty('useMasterKey')) {
      requestOptions.useMasterKey = options.useMasterKey;
    }
    if (options.hasOwnProperty('sessionToken')) {
      requestOptions.sessionToken = options.sessionToken;
    }

    var request = RESTController.request('POST', 'functions/' + name, payload, requestOptions);

    return request.then(function (res) {
      var decoded = (0, _decode2['default'])(res);
      if (decoded && decoded.hasOwnProperty('result')) {
        return _ParsePromise2['default'].as(decoded.result);
      }
      return _ParsePromise2['default'].error(new _ParseError2['default'](_ParseError2['default'].INVALID_JSON, 'The server returned an invalid response.'));
    })._thenRunCallbacks(options);
  }
});
},{"./CoreManager":3,"./ParseError":10,"./ParsePromise":16,"./decode":29,"./encode":30,"babel-runtime/helpers/interop-require-default":47}],3:[function(_dereq_,module,exports){
(function (process){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var config = {
  // Defaults
  IS_NODE: typeof process !== 'undefined' && !!process.versions && !!process.versions.node,
  REQUEST_ATTEMPT_LIMIT: 5,
  SERVER_URL: 'https://api.parse.com/1',
  VERSION: 'js' + '1.6.14',
  APPLICATION_ID: null,
  JAVASCRIPT_KEY: null,
  MASTER_KEY: null,
  USE_MASTER_KEY: false,
  PERFORM_USER_REWRITE: true,
  FORCE_REVOCABLE_SESSION: false
};

module.exports = {
  get: function get(key) {
    if (config.hasOwnProperty(key)) {
      return config[key];
    }
    throw new Error('Configuration key not found: ' + key);
  },

  set: function set(key, value) {
    config[key] = value;
  },

  /* Specialized Controller Setters/Getters */

  setAnalyticsController: function setAnalyticsController(controller) {
    if (typeof controller.track !== 'function') {
      throw new Error('AnalyticsController must implement track()');
    }
    config['AnalyticsController'] = controller;
  },

  getAnalyticsController: function getAnalyticsController() {
    return config['AnalyticsController'];
  },

  setCloudController: function setCloudController(controller) {
    if (typeof controller.run !== 'function') {
      throw new Error('CloudController must implement run()');
    }
    config['CloudController'] = controller;
  },

  getCloudController: function getCloudController() {
    return config['CloudController'];
  },

  setConfigController: function setConfigController(controller) {
    if (typeof controller.current !== 'function') {
      throw new Error('ConfigController must implement current()');
    }
    if (typeof controller.get !== 'function') {
      throw new Error('ConfigController must implement get()');
    }
    config['ConfigController'] = controller;
  },

  getConfigController: function getConfigController() {
    return config['ConfigController'];
  },

  setFileController: function setFileController(controller) {
    if (typeof controller.saveFile !== 'function') {
      throw new Error('FileController must implement saveFile()');
    }
    if (typeof controller.saveBase64 !== 'function') {
      throw new Error('FileController must implement saveBase64()');
    }
    config['FileController'] = controller;
  },

  getFileController: function getFileController() {
    return config['FileController'];
  },

  setInstallationController: function setInstallationController(controller) {
    if (typeof controller.currentInstallationId !== 'function') {
      throw new Error('InstallationController must implement currentInstallationId()');
    }
    config['InstallationController'] = controller;
  },

  getInstallationController: function getInstallationController() {
    return config['InstallationController'];
  },

  setPushController: function setPushController(controller) {
    if (typeof controller.send !== 'function') {
      throw new Error('PushController must implement send()');
    }
    config['PushController'] = controller;
  },

  getPushController: function getPushController() {
    return config['PushController'];
  },

  setObjectController: function setObjectController(controller) {
    if (typeof controller.save !== 'function') {
      throw new Error('ObjectController must implement save()');
    }
    if (typeof controller.fetch !== 'function') {
      throw new Error('ObjectController must implement fetch()');
    }
    if (typeof controller.destroy !== 'function') {
      throw new Error('ObjectController must implement destroy()');
    }
    config['ObjectController'] = controller;
  },

  getObjectController: function getObjectController() {
    return config['ObjectController'];
  },

  setQueryController: function setQueryController(controller) {
    if (typeof controller.find !== 'function') {
      throw new Error('QueryController must implement find()');
    }
    config['QueryController'] = controller;
  },

  getQueryController: function getQueryController() {
    return config['QueryController'];
  },

  setRESTController: function setRESTController(controller) {
    if (typeof controller.request !== 'function') {
      throw new Error('RESTController must implement request()');
    }
    if (typeof controller.ajax !== 'function') {
      throw new Error('RESTController must implement ajax()');
    }
    config['RESTController'] = controller;
  },

  getRESTController: function getRESTController() {
    return config['RESTController'];
  },

  setSessionController: function setSessionController(controller) {
    if (typeof controller.getSession !== 'function') {
      throw new Error('A SessionController must implement getSession()');
    }
    config['SessionController'] = controller;
  },

  getSessionController: function getSessionController() {
    return config['SessionController'];
  },

  setStorageController: function setStorageController(controller) {
    if (controller.async) {
      if (typeof controller.getItemAsync !== 'function') {
        throw new Error('An async StorageController must implement getItemAsync()');
      }
      if (typeof controller.setItemAsync !== 'function') {
        throw new Error('An async StorageController must implement setItemAsync()');
      }
      if (typeof controller.removeItemAsync !== 'function') {
        throw new Error('An async StorageController must implement removeItemAsync()');
      }
    } else {
      if (typeof controller.getItem !== 'function') {
        throw new Error('A synchronous StorageController must implement getItem()');
      }
      if (typeof controller.setItem !== 'function') {
        throw new Error('A synchronous StorageController must implement setItem()');
      }
      if (typeof controller.removeItem !== 'function') {
        throw new Error('A synchonous StorageController must implement removeItem()');
      }
    }
    config['StorageController'] = controller;
  },

  getStorageController: function getStorageController() {
    return config['StorageController'];
  },

  setUserController: function setUserController(controller) {
    if (typeof controller.setCurrentUser !== 'function') {
      throw new Error('A UserController must implement setCurrentUser()');
    }
    if (typeof controller.currentUser !== 'function') {
      throw new Error('A UserController must implement currentUser()');
    }
    if (typeof controller.currentUserAsync !== 'function') {
      throw new Error('A UserController must implement currentUserAsync()');
    }
    if (typeof controller.signUp !== 'function') {
      throw new Error('A UserController must implement signUp()');
    }
    if (typeof controller.logIn !== 'function') {
      throw new Error('A UserController must implement logIn()');
    }
    if (typeof controller.become !== 'function') {
      throw new Error('A UserController must implement become()');
    }
    if (typeof controller.logOut !== 'function') {
      throw new Error('A UserController must implement logOut()');
    }
    if (typeof controller.requestPasswordReset !== 'function') {
      throw new Error('A UserController must implement requestPasswordReset()');
    }
    if (typeof controller.upgradeToRevocableSession !== 'function') {
      throw new Error('A UserController must implement upgradeToRevocableSession()');
    }
    if (typeof controller.linkWith !== 'function') {
      throw new Error('A UserController must implement linkWith()');
    }
    config['UserController'] = controller;
  },

  getUserController: function getUserController() {
    return config['UserController'];
  }
};
}).call(this,_dereq_('_process'))
},{"_process":75}],4:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * -weak
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _parseDate = _dereq_('./parseDate');

var _parseDate2 = _interopRequireDefault(_parseDate);

var _ParseUser = _dereq_('./ParseUser');

var _ParseUser2 = _interopRequireDefault(_ParseUser);

var initialized = false;
var requestedPermissions;
var initOptions;

/**
 * Provides a set of utilities for using Parse with Facebook.
 * @class Parse.FacebookUtils
 * @static
 */
exports['default'] = {
  /**
   * Initializes Parse Facebook integration.  Call this function after you
   * have loaded the Facebook Javascript SDK with the same parameters
   * as you would pass to<code>
   * <a href=
   * "https://developers.facebook.com/docs/reference/javascript/FB.init/">
   * FB.init()</a></code>.  Parse.FacebookUtils will invoke FB.init() for you
   * with these arguments.
   *
   * @method init
   * @param {Object} options Facebook options argument as described here:
   *   <a href=
   *   "https://developers.facebook.com/docs/reference/javascript/FB.init/">
   *   FB.init()</a>. The status flag will be coerced to 'false' because it
   *   interferes with Parse Facebook integration. Call FB.getLoginStatus()
   *   explicitly if this behavior is required by your application.
   */
  init: function init(options) {
    if (typeof FB === 'undefined') {
      throw new Error('The Facebook JavaScript SDK must be loaded before calling init.');
    }
    initOptions = {};
    if (options) {
      for (var key in options) {
        initOptions[key] = options[key];
      }
    }
    if (initOptions.status && typeof console !== 'undefined') {
      var warn = console.warn || console.log || function () {};
      warn.call(console, 'The "status" flag passed into' + ' FB.init, when set to true, can interfere with Parse Facebook' + ' integration, so it has been suppressed. Please call' + ' FB.getLoginStatus() explicitly if you require this behavior.');
    }
    initOptions.status = false;
    FB.init(initOptions);
    _ParseUser2['default']._registerAuthenticationProvider({
      authenticate: function authenticate(options) {
        var _this = this;

        if (typeof FB === 'undefined') {
          options.error(this, 'Facebook SDK not found.');
        }
        FB.login(function (response) {
          if (response.authResponse) {
            if (options.success) {
              options.success(_this, {
                id: response.authResponse.userID,
                access_token: response.authResponse.accessToken,
                expiration_date: new Date(response.authResponse.expiresIn * 1000 + new Date().getTime()).toJSON()
              });
            }
          } else {
            if (options.error) {
              options.error(_this, response);
            }
          }
        }, {
          scope: requestedPermissions
        });
      },

      restoreAuthentication: function restoreAuthentication(authData) {
        if (authData) {
          var expiration = (0, _parseDate2['default'])(authData.expiration_date);
          var expiresIn = expiration ? (expiration.getTime() - new Date().getTime()) / 1000 : 0;

          var authResponse = {
            userID: authData.id,
            accessToken: authData.access_token,
            expiresIn: expiresIn
          };
          var newOptions = {};
          if (initOptions) {
            for (var key in initOptions) {
              newOptions[key] = initOptions[key];
            }
          }
          newOptions.authResponse = authResponse;

          // Suppress checks for login status from the browser.
          newOptions.status = false;

          // If the user doesn't match the one known by the FB SDK, log out.
          // Most of the time, the users will match -- it's only in cases where
          // the FB SDK knows of a different user than the one being restored
          // from a Parse User that logged in with username/password.
          var existingResponse = FB.getAuthResponse();
          if (existingResponse && existingResponse.userID !== authResponse.userID) {
            FB.logout();
          }

          FB.init(newOptions);
        }
        return true;
      },

      getAuthType: function getAuthType() {
        return 'facebook';
      },

      deauthenticate: function deauthenticate() {
        this.restoreAuthentication(null);
      }
    });
    initialized = true;
  },

  /**
   * Gets whether the user has their account linked to Facebook.
   *
   * @method isLinked
   * @param {Parse.User} user User to check for a facebook link.
   *     The user must be logged in on this device.
   * @return {Boolean} <code>true</code> if the user has their account
   *     linked to Facebook.
   */
  isLinked: function isLinked(user) {
    return user._isLinked('facebook');
  },

  /**
   * Logs in a user using Facebook. This method delegates to the Facebook
   * SDK to authenticate the user, and then automatically logs in (or
   * creates, in the case where it is a new user) a Parse.User.
   *
   * @method logIn
   * @param {String, Object} permissions The permissions required for Facebook
   *    log in.  This is a comma-separated string of permissions.
   *    Alternatively, supply a Facebook authData object as described in our
   *    REST API docs if you want to handle getting facebook auth tokens
   *    yourself.
   * @param {Object} options Standard options object with success and error
   *    callbacks.
   */
  logIn: function logIn(permissions, options) {
    if (!permissions || typeof permissions === 'string') {
      if (!initialized) {
        throw new Error('You must initialize FacebookUtils before calling logIn.');
      }
      requestedPermissions = permissions;
      return _ParseUser2['default']._logInWith('facebook', options);
    } else {
      var newOptions = {};
      if (options) {
        for (var key in options) {
          newOptions[key] = options[key];
        }
      }
      newOptions.authData = permissions;
      return _ParseUser2['default']._logInWith('facebook', newOptions);
    }
  },

  /**
   * Links Facebook to an existing PFUser. This method delegates to the
   * Facebook SDK to authenticate the user, and then automatically links
   * the account to the Parse.User.
   *
   * @method link
   * @param {Parse.User} user User to link to Facebook. This must be the
   *     current user.
   * @param {String, Object} permissions The permissions required for Facebook
   *    log in.  This is a comma-separated string of permissions.
   *    Alternatively, supply a Facebook authData object as described in our
   *    REST API docs if you want to handle getting facebook auth tokens
   *    yourself.
   * @param {Object} options Standard options object with success and error
   *    callbacks.
   */
  link: function link(user, permissions, options) {
    if (!permissions || typeof permissions === 'string') {
      if (!initialized) {
        throw new Error('You must initialize FacebookUtils before calling link.');
      }
      requestedPermissions = permissions;
      return user._linkWith('facebook', options);
    } else {
      var newOptions = {};
      if (options) {
        for (var key in options) {
          newOptions[key] = options[key];
        }
      }
      newOptions.authData = permissions;
      return user._linkWith('facebook', newOptions);
    }
  },

  /**
   * Unlinks the Parse.User from a Facebook account.
   *
   * @method unlink
   * @param {Parse.User} user User to unlink from Facebook. This must be the
   *     current user.
   * @param {Object} options Standard options object with success and error
   *    callbacks.
   */
  unlink: function unlink(user, options) {
    if (!initialized) {
      throw new Error('You must initialize FacebookUtils before calling unlink.');
    }
    return user._unlinkFrom('facebook', options);
  }
};
module.exports = exports['default'];
},{"./ParseUser":21,"./parseDate":34,"babel-runtime/helpers/interop-require-default":47}],5:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

var _Storage = _dereq_('./Storage');

var _Storage2 = _interopRequireDefault(_Storage);

var iidCache = null;

function hexOctet() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function generateId() {
  return hexOctet() + hexOctet() + '-' + hexOctet() + '-' + hexOctet() + '-' + hexOctet() + '-' + hexOctet() + hexOctet() + hexOctet();
}

module.exports = {
  currentInstallationId: function currentInstallationId() {
    if (typeof iidCache === 'string') {
      return _ParsePromise2['default'].as(iidCache);
    }
    var path = _Storage2['default'].generatePath('installationId');
    return _Storage2['default'].getItemAsync(path).then(function (iid) {
      if (!iid) {
        iid = generateId();
        return _Storage2['default'].setItemAsync(path, iid).then(function () {
          iidCache = iid;
          return iid;
        });
      }
      iidCache = iid;
      return iid;
    });
  },

  _clearCache: function _clearCache() {
    iidCache = null;
  },

  _setInstallationIdCache: function _setInstallationIdCache(iid) {
    iidCache = iid;
  }
};
},{"./CoreManager":3,"./ParsePromise":16,"./Storage":24,"babel-runtime/helpers/interop-require-default":47}],6:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getState = getState;
exports.initializeState = initializeState;
exports.removeState = removeState;
exports.getServerData = getServerData;
exports.setServerData = setServerData;
exports.getPendingOps = getPendingOps;
exports.setPendingOp = setPendingOp;
exports.pushPendingState = pushPendingState;
exports.popPendingState = popPendingState;
exports.mergeFirstPendingState = mergeFirstPendingState;
exports.getObjectCache = getObjectCache;
exports.estimateAttribute = estimateAttribute;
exports.estimateAttributes = estimateAttributes;
exports.commitServerChanges = commitServerChanges;
exports.enqueueTask = enqueueTask;
exports._clearAllState = _clearAllState;

var _encode = _dereq_('./encode');

var _encode2 = _interopRequireDefault(_encode);

var _ParseFile = _dereq_('./ParseFile');

var _ParseFile2 = _interopRequireDefault(_ParseFile);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

var _ParseRelation = _dereq_('./ParseRelation');

var _ParseRelation2 = _interopRequireDefault(_ParseRelation);

var _TaskQueue = _dereq_('./TaskQueue');

var _TaskQueue2 = _interopRequireDefault(_TaskQueue);

var _ParseOp = _dereq_('./ParseOp');

var objectState = {};

function getState(className, id) {
  var classData = objectState[className];
  if (classData) {
    return classData[id] || null;
  }
  return null;
}

function initializeState(className, id, initial) {
  var state = getState(className, id);
  if (state) {
    return state;
  }
  if (!objectState[className]) {
    objectState[className] = {};
  }
  if (!initial) {
    initial = {
      serverData: {},
      pendingOps: [{}],
      objectCache: {},
      tasks: new _TaskQueue2['default'](),
      existed: false
    };
  }
  state = objectState[className][id] = initial;
  return state;
}

function removeState(className, id) {
  var state = getState(className, id);
  if (state === null) {
    return null;
  }
  delete objectState[className][id];
  return state;
}

function getServerData(className, id) {
  var state = getState(className, id);
  if (state) {
    return state.serverData;
  }
  return {};
}

function setServerData(className, id, attributes) {
  var data = initializeState(className, id).serverData;
  for (var attr in attributes) {
    if (typeof attributes[attr] !== 'undefined') {
      data[attr] = attributes[attr];
    } else {
      delete data[attr];
    }
  }
}

function getPendingOps(className, id) {
  var state = getState(className, id);
  if (state) {
    return state.pendingOps;
  }
  return [{}];
}

function setPendingOp(className, id, attr, op) {
  var pending = initializeState(className, id).pendingOps;
  var last = pending.length - 1;
  if (op) {
    pending[last][attr] = op;
  } else {
    delete pending[last][attr];
  }
}

function pushPendingState(className, id) {
  var pending = initializeState(className, id).pendingOps;
  pending.push({});
}

function popPendingState(className, id) {
  var pending = initializeState(className, id).pendingOps;
  var first = pending.shift();
  if (!pending.length) {
    pending[0] = {};
  }
  return first;
}

function mergeFirstPendingState(className, id) {
  var first = popPendingState(className, id);
  var pending = getPendingOps(className, id);
  var next = pending[0];
  for (var attr in first) {
    if (next[attr] && first[attr]) {
      var merged = next[attr].mergeWith(first[attr]);
      if (merged) {
        next[attr] = merged;
      }
    } else {
      next[attr] = first[attr];
    }
  }
}

function getObjectCache(className, id) {
  var state = getState(className, id);
  if (state) {
    return state.objectCache;
  }
  return {};
}

function estimateAttribute(className, id, attr) {
  var serverData = getServerData(className, id);
  var value = serverData[attr];
  var pending = getPendingOps(className, id);
  for (var i = 0; i < pending.length; i++) {
    if (pending[i][attr]) {
      if (pending[i][attr] instanceof _ParseOp.RelationOp) {
        value = pending[i][attr].applyTo(value, { className: className, id: id }, attr);
      } else {
        value = pending[i][attr].applyTo(value);
      }
    }
  }
  return value;
}

function estimateAttributes(className, id) {
  var data = {};
  var attr;
  var serverData = getServerData(className, id);
  for (attr in serverData) {
    data[attr] = serverData[attr];
  }
  var pending = getPendingOps(className, id);
  for (var i = 0; i < pending.length; i++) {
    for (attr in pending[i]) {
      if (pending[i][attr] instanceof _ParseOp.RelationOp) {
        data[attr] = pending[i][attr].applyTo(data[attr], { className: className, id: id }, attr);
      } else {
        data[attr] = pending[i][attr].applyTo(data[attr]);
      }
    }
  }
  return data;
}

function commitServerChanges(className, id, changes) {
  var state = initializeState(className, id);
  for (var attr in changes) {
    var val = changes[attr];
    state.serverData[attr] = val;
    if (val && typeof val === 'object' && !(val instanceof _ParseObject2['default']) && !(val instanceof _ParseFile2['default']) && !(val instanceof _ParseRelation2['default'])) {
      var json = (0, _encode2['default'])(val, false, true);
      state.objectCache[attr] = JSON.stringify(json);
    }
  }
}

function enqueueTask(className, id, task) {
  var state = initializeState(className, id);
  return state.tasks.enqueue(task);
}

function _clearAllState() {
  objectState = {};
}
},{"./ParseFile":11,"./ParseObject":14,"./ParseOp":15,"./ParsePromise":16,"./ParseRelation":18,"./TaskQueue":26,"./encode":30,"babel-runtime/helpers/interop-require-default":47}],7:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = _dereq_('babel-runtime/helpers/interop-require-wildcard')['default'];

var _decode = _dereq_('./decode');

var _decode2 = _interopRequireDefault(_decode);

var _encode = _dereq_('./encode');

var _encode2 = _interopRequireDefault(_encode);

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _InstallationController = _dereq_('./InstallationController');

var _InstallationController2 = _interopRequireDefault(_InstallationController);

var _ParseOp = _dereq_('./ParseOp');

var ParseOp = _interopRequireWildcard(_ParseOp);

var _RESTController = _dereq_('./RESTController');

var _RESTController2 = _interopRequireDefault(_RESTController);

/**
 * Contains all Parse API classes and functions.
 * @class Parse
 * @static
 */
var Parse = {
  /**
   * Call this method first to set up your authentication tokens for Parse.
   * You can get your keys from the Data Browser on parse.com.
   * @method initialize
   * @param {String} applicationId Your Parse Application ID.
   * @param {String} javaScriptKey Your Parse JavaScript Key.
   * @param {String} masterKey (optional) Your Parse Master Key. (Node.js only!)
   * @static
   */
  initialize: function initialize(applicationId, javaScriptKey) {
    if ('browser' === 'browser' && _CoreManager2['default'].get('IS_NODE')) {
      console.log('It looks like you\'re using the browser version of the SDK in a ' + 'node.js environment. You should require(\'parse/node\') instead.');
    }
    Parse._initialize(applicationId, javaScriptKey);
  },

  _initialize: function _initialize(applicationId, javaScriptKey, masterKey) {
    _CoreManager2['default'].set('APPLICATION_ID', applicationId);
    _CoreManager2['default'].set('JAVASCRIPT_KEY', javaScriptKey);
    _CoreManager2['default'].set('MASTER_KEY', masterKey);
    _CoreManager2['default'].set('USE_MASTER_KEY', false);
  }
};

/** These legacy setters may eventually be deprecated **/
Object.defineProperty(Parse, 'applicationId', {
  get: function get() {
    return _CoreManager2['default'].get('APPLICATION_ID');
  },
  set: function set(value) {
    _CoreManager2['default'].set('APPLICATION_ID', value);
  }
});
Object.defineProperty(Parse, 'javaScriptKey', {
  get: function get() {
    return _CoreManager2['default'].get('JAVASCRIPT_KEY');
  },
  set: function set(value) {
    _CoreManager2['default'].set('JAVASCRIPT_KEY', value);
  }
});
Object.defineProperty(Parse, 'masterKey', {
  get: function get() {
    return _CoreManager2['default'].get('MASTER_KEY');
  },
  set: function set(value) {
    _CoreManager2['default'].set('MASTER_KEY', value);
  }
});
Object.defineProperty(Parse, 'serverURL', {
  get: function get() {
    return _CoreManager2['default'].get('SERVER_URL');
  },
  set: function set(value) {
    _CoreManager2['default'].set('SERVER_URL', value);
  }
});
/** End setters **/

Parse.ACL = _dereq_('./ParseACL');
Parse.Analytics = _dereq_('./Analytics');
Parse.Cloud = _dereq_('./Cloud');
Parse.CoreManager = _dereq_('./CoreManager');
Parse.Config = _dereq_('./ParseConfig');
Parse.Error = _dereq_('./ParseError');
Parse.FacebookUtils = _dereq_('./FacebookUtils');
Parse.File = _dereq_('./ParseFile');
Parse.GeoPoint = _dereq_('./ParseGeoPoint');
Parse.Installation = _dereq_('./ParseInstallation');
Parse.Object = _dereq_('./ParseObject');
Parse.Op = {
  Set: ParseOp.SetOp,
  Unset: ParseOp.UnsetOp,
  Increment: ParseOp.IncrementOp,
  Add: ParseOp.AddOp,
  Remove: ParseOp.RemoveOp,
  AddUnique: ParseOp.AddUniqueOp,
  Relation: ParseOp.RelationOp
};
Parse.Promise = _dereq_('./ParsePromise');
Parse.Push = _dereq_('./Push');
Parse.Query = _dereq_('./ParseQuery');
Parse.Relation = _dereq_('./ParseRelation');
Parse.Role = _dereq_('./ParseRole');
Parse.Session = _dereq_('./ParseSession');
Parse.Storage = _dereq_('./Storage');
Parse.User = _dereq_('./ParseUser');

Parse._request = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return _CoreManager2['default'].getRESTController().request.apply(null, args);
};
Parse._ajax = function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return _CoreManager2['default'].getRESTController().ajax.apply(null, args);
};
// We attempt to match the signatures of the legacy versions of these methods
Parse._decode = function (_, value) {
  return (0, _decode2['default'])(value);
};
Parse._encode = function (value, _, disallowObjects) {
  return (0, _encode2['default'])(value, disallowObjects);
};
Parse._getInstallationId = function () {
  return _CoreManager2['default'].getInstallationController().currentInstallationId();
};

_CoreManager2['default'].setInstallationController(_InstallationController2['default']);
_CoreManager2['default'].setRESTController(_RESTController2['default']);

// For legacy requires, of the form `var Parse = require('parse').Parse`
Parse.Parse = Parse;

module.exports = Parse;
},{"./Analytics":1,"./Cloud":2,"./CoreManager":3,"./FacebookUtils":4,"./InstallationController":5,"./ParseACL":8,"./ParseConfig":9,"./ParseError":10,"./ParseFile":11,"./ParseGeoPoint":12,"./ParseInstallation":13,"./ParseObject":14,"./ParseOp":15,"./ParsePromise":16,"./ParseQuery":17,"./ParseRelation":18,"./ParseRole":19,"./ParseSession":20,"./ParseUser":21,"./Push":22,"./RESTController":23,"./Storage":24,"./decode":29,"./encode":30,"babel-runtime/helpers/interop-require-default":47,"babel-runtime/helpers/interop-require-wildcard":48}],8:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = _dereq_('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ParseRole = _dereq_('./ParseRole');

var _ParseRole2 = _interopRequireDefault(_ParseRole);

var _ParseUser = _dereq_('./ParseUser');

var _ParseUser2 = _interopRequireDefault(_ParseUser);

var PUBLIC_KEY = '*';

/**
 * Creates a new ACL.
 * If no argument is given, the ACL has no permissions for anyone.
 * If the argument is a Parse.User, the ACL will have read and write
 *   permission for only that user.
 * If the argument is any other JSON object, that object will be interpretted
 *   as a serialized ACL created with toJSON().
 * @class Parse.ACL
 * @constructor
 *
 * <p>An ACL, or Access Control List can be added to any
 * <code>Parse.Object</code> to restrict access to only a subset of users
 * of your application.</p>
 */

var ParseACL = (function () {
  function ParseACL(arg1) {
    _classCallCheck(this, ParseACL);

    this.permissionsById = {};
    if (arg1 && typeof arg1 === 'object') {
      if (arg1 instanceof _ParseUser2['default']) {
        this.setReadAccess(arg1, true);
        this.setWriteAccess(arg1, true);
      } else {
        for (var userId in arg1) {
          var accessList = arg1[userId];
          if (typeof userId !== 'string') {
            throw new TypeError('Tried to create an ACL with an invalid user id.');
          }
          this.permissionsById[userId] = {};
          for (var permission in accessList) {
            var allowed = accessList[permission];
            if (permission !== 'read' && permission !== 'write') {
              throw new TypeError('Tried to create an ACL with an invalid permission type.');
            }
            if (typeof allowed !== 'boolean') {
              throw new TypeError('Tried to create an ACL with an invalid permission value.');
            }
            this.permissionsById[userId][permission] = allowed;
          }
        }
      }
    } else if (typeof arg1 === 'function') {
      throw new TypeError('ParseACL constructed with a function. Did you forget ()?');
    }
  }

  /**
   * Returns a JSON-encoded version of the ACL.
   * @method toJSON
   * @return {Object}
   */

  _createClass(ParseACL, [{
    key: 'toJSON',
    value: function toJSON() {
      var permissions = {};
      for (var p in this.permissionsById) {
        permissions[p] = this.permissionsById[p];
      }
      return permissions;
    }

    /**
     * Returns whether this ACL is equal to another object
     * @method equals
     * @param other The other object to compare to
     * @return {Boolean}
     */
  }, {
    key: 'equals',
    value: function equals(other) {
      if (!(other instanceof ParseACL)) {
        return false;
      }
      var users = _Object$keys(this.permissionsById);
      var otherUsers = _Object$keys(other.permissionsById);
      if (users.length !== otherUsers.length) {
        return false;
      }
      for (var u in this.permissionsById) {
        if (!other.permissionsById[u]) {
          return false;
        }
        if (this.permissionsById[u].read !== other.permissionsById[u].read) {
          return false;
        }
        if (this.permissionsById[u].write !== other.permissionsById[u].write) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: '_setAccess',
    value: function _setAccess(accessType, userId, allowed) {
      if (userId instanceof _ParseUser2['default']) {
        userId = userId.id;
      } else if (userId instanceof _ParseRole2['default']) {
        userId = 'role:' + userId.getName();
      }
      if (typeof userId !== 'string') {
        throw new TypeError('userId must be a string.');
      }
      if (typeof allowed !== 'boolean') {
        throw new TypeError('allowed must be either true or false.');
      }
      var permissions = this.permissionsById[userId];
      if (!permissions) {
        if (!allowed) {
          // The user already doesn't have this permission, so no action is needed
          return;
        } else {
          permissions = {};
          this.permissionsById[userId] = permissions;
        }
      }

      if (allowed) {
        this.permissionsById[userId][accessType] = true;
      } else {
        delete permissions[accessType];
        if (_Object$keys(permissions).length === 0) {
          delete this.permissionsById[userId];
        }
      }
    }
  }, {
    key: '_getAccess',
    value: function _getAccess(accessType, userId) {
      if (userId instanceof _ParseUser2['default']) {
        userId = userId.id;
      } else if (userId instanceof _ParseRole2['default']) {
        userId = 'role:' + userId.getName();
      }
      var permissions = this.permissionsById[userId];
      if (!permissions) {
        return false;
      }
      return !!permissions[accessType];
    }

    /**
     * Sets whether the given user is allowed to read this object.
     * @method setReadAccess
     * @param userId An instance of Parse.User or its objectId.
     * @param {Boolean} allowed Whether that user should have read access.
     */
  }, {
    key: 'setReadAccess',
    value: function setReadAccess(userId, allowed) {
      this._setAccess('read', userId, allowed);
    }

    /**
     * Get whether the given user id is *explicitly* allowed to read this object.
     * Even if this returns false, the user may still be able to access it if
     * getPublicReadAccess returns true or a role that the user belongs to has
     * write access.
     * @method getReadAccess
     * @param userId An instance of Parse.User or its objectId, or a Parse.Role.
     * @return {Boolean}
     */
  }, {
    key: 'getReadAccess',
    value: function getReadAccess(userId) {
      return this._getAccess('read', userId);
    }

    /**
     * Sets whether the given user id is allowed to write this object.
     * @method setWriteAccess
     * @param userId An instance of Parse.User or its objectId, or a Parse.Role..
     * @param {Boolean} allowed Whether that user should have write access.
     */
  }, {
    key: 'setWriteAccess',
    value: function setWriteAccess(userId, allowed) {
      this._setAccess('write', userId, allowed);
    }

    /**
     * Gets whether the given user id is *explicitly* allowed to write this object.
     * Even if this returns false, the user may still be able to write it if
     * getPublicWriteAccess returns true or a role that the user belongs to has
     * write access.
     * @method getWriteAccess
     * @param userId An instance of Parse.User or its objectId, or a Parse.Role.
     * @return {Boolean}
     */
  }, {
    key: 'getWriteAccess',
    value: function getWriteAccess(userId) {
      return this._getAccess('write', userId);
    }

    /**
     * Sets whether the public is allowed to read this object.
     * @method setPublicReadAccess
     * @param {Boolean} allowed
     */
  }, {
    key: 'setPublicReadAccess',
    value: function setPublicReadAccess(allowed) {
      this.setReadAccess(PUBLIC_KEY, allowed);
    }

    /**
     * Gets whether the public is allowed to read this object.
     * @method getPublicReadAccess
     * @return {Boolean}
     */
  }, {
    key: 'getPublicReadAccess',
    value: function getPublicReadAccess() {
      return this.getReadAccess(PUBLIC_KEY);
    }

    /**
     * Sets whether the public is allowed to write this object.
     * @method setPublicWriteAccess
     * @param {Boolean} allowed
     */
  }, {
    key: 'setPublicWriteAccess',
    value: function setPublicWriteAccess(allowed) {
      this.setWriteAccess(PUBLIC_KEY, allowed);
    }

    /**
     * Gets whether the public is allowed to write this object.
     * @method getPublicWriteAccess
     * @return {Boolean}
     */
  }, {
    key: 'getPublicWriteAccess',
    value: function getPublicWriteAccess() {
      return this.getWriteAccess(PUBLIC_KEY);
    }

    /**
     * Gets whether users belonging to the given role are allowed
     * to read this object. Even if this returns false, the role may
     * still be able to write it if a parent role has read access.
     *
     * @method getRoleReadAccess
     * @param role The name of the role, or a Parse.Role object.
     * @return {Boolean} true if the role has read access. false otherwise.
     * @throws {TypeError} If role is neither a Parse.Role nor a String.
     */
  }, {
    key: 'getRoleReadAccess',
    value: function getRoleReadAccess(role) {
      if (role instanceof _ParseRole2['default']) {
        // Normalize to the String name
        role = role.getName();
      }
      if (typeof role !== 'string') {
        throw new TypeError('role must be a ParseRole or a String');
      }
      return this.getReadAccess('role:' + role);
    }

    /**
     * Gets whether users belonging to the given role are allowed
     * to write this object. Even if this returns false, the role may
     * still be able to write it if a parent role has write access.
     *
     * @method getRoleWriteAccess
     * @param role The name of the role, or a Parse.Role object.
     * @return {Boolean} true if the role has write access. false otherwise.
     * @throws {TypeError} If role is neither a Parse.Role nor a String.
     */
  }, {
    key: 'getRoleWriteAccess',
    value: function getRoleWriteAccess(role) {
      if (role instanceof _ParseRole2['default']) {
        // Normalize to the String name
        role = role.getName();
      }
      if (typeof role !== 'string') {
        throw new TypeError('role must be a ParseRole or a String');
      }
      return this.getWriteAccess('role:' + role);
    }

    /**
     * Sets whether users belonging to the given role are allowed
     * to read this object.
     *
     * @method setRoleReadAccess
     * @param role The name of the role, or a Parse.Role object.
     * @param {Boolean} allowed Whether the given role can read this object.
     * @throws {TypeError} If role is neither a Parse.Role nor a String.
     */
  }, {
    key: 'setRoleReadAccess',
    value: function setRoleReadAccess(role, allowed) {
      if (role instanceof _ParseRole2['default']) {
        // Normalize to the String name
        role = role.getName();
      }
      if (typeof role !== 'string') {
        throw new TypeError('role must be a ParseRole or a String');
      }
      this.setReadAccess('role:' + role, allowed);
    }

    /**
     * Sets whether users belonging to the given role are allowed
     * to write this object.
     *
     * @method setRoleWriteAccess
     * @param role The name of the role, or a Parse.Role object.
     * @param {Boolean} allowed Whether the given role can write this object.
     * @throws {TypeError} If role is neither a Parse.Role nor a String.
     */
  }, {
    key: 'setRoleWriteAccess',
    value: function setRoleWriteAccess(role, allowed) {
      if (role instanceof _ParseRole2['default']) {
        // Normalize to the String name
        role = role.getName();
      }
      if (typeof role !== 'string') {
        throw new TypeError('role must be a ParseRole or a String');
      }
      this.setWriteAccess('role:' + role, allowed);
    }
  }]);

  return ParseACL;
})();

exports['default'] = ParseACL;
module.exports = exports['default'];
},{"./ParseRole":19,"./ParseUser":21,"babel-runtime/core-js/object/keys":41,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/interop-require-default":47}],9:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _decode = _dereq_('./decode');

var _decode2 = _interopRequireDefault(_decode);

var _encode = _dereq_('./encode');

var _encode2 = _interopRequireDefault(_encode);

var _escape2 = _dereq_('./escape');

var _escape3 = _interopRequireDefault(_escape2);

var _ParseError = _dereq_('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

var _Storage = _dereq_('./Storage');

var _Storage2 = _interopRequireDefault(_Storage);

/**
 * Parse.Config is a local representation of configuration data that
 * can be set from the Parse dashboard.
 *
 * @class Parse.Config
 * @constructor
 */

var ParseConfig = (function () {
  function ParseConfig() {
    _classCallCheck(this, ParseConfig);

    this.attributes = {};
    this._escapedAttributes = {};
  }

  /**
   * Gets the value of an attribute.
   * @method get
   * @param {String} attr The name of an attribute.
   */

  _createClass(ParseConfig, [{
    key: 'get',
    value: function get(attr) {
      return this.attributes[attr];
    }

    /**
     * Gets the HTML-escaped value of an attribute.
     * @method escape
     * @param {String} attr The name of an attribute.
     */
  }, {
    key: 'escape',
    value: function escape(attr) {
      var html = this._escapedAttributes[attr];
      if (html) {
        return html;
      }
      var val = this.attributes[attr];
      var escaped = '';
      if (val != null) {
        escaped = (0, _escape3['default'])(val.toString());
      }
      this._escapedAttributes[attr] = escaped;
      return escaped;
    }

    /**
     * Retrieves the most recently-fetched configuration object, either from
     * memory or from local storage if necessary.
     *
     * @method current
     * @static
     * @return {Config} The most recently-fetched Parse.Config if it
     *     exists, else an empty Parse.Config.
     */
  }], [{
    key: 'current',
    value: function current() {
      var controller = _CoreManager2['default'].getConfigController();
      return controller.current();
    }

    /**
     * Gets a new configuration object from the server.
     * @method get
     * @static
     * @param {Object} options A Backbone-style options object.
     * Valid options are:<ul>
     *   <li>success: Function to call when the get completes successfully.
     *   <li>error: Function to call when the get fails.
     * </ul>
     * @return {Parse.Promise} A promise that is resolved with a newly-created
     *     configuration object when the get completes.
     */
  }, {
    key: 'get',
    value: function get(options) {
      options = options || {};

      var controller = _CoreManager2['default'].getConfigController();
      return controller.get()._thenRunCallbacks(options);
    }
  }]);

  return ParseConfig;
})();

exports['default'] = ParseConfig;

var currentConfig = null;

var CURRENT_CONFIG_KEY = 'currentConfig';

function decodePayload(data) {
  try {
    var json = JSON.parse(data);
    if (json && typeof json === 'object') {
      return (0, _decode2['default'])(json);
    }
  } catch (e) {
    return null;
  }
}

_CoreManager2['default'].setConfigController({
  current: function current() {
    if (currentConfig) {
      return currentConfig;
    }

    var config = new ParseConfig();
    var storagePath = _Storage2['default'].generatePath(CURRENT_CONFIG_KEY);
    var configData;
    if (!_Storage2['default'].async()) {
      configData = _Storage2['default'].getItem(storagePath);

      if (configData) {
        var attributes = decodePayload(configData);
        if (attributes) {
          config.attributes = attributes;
          currentConfig = config;
        }
      }
      return config;
    }
    // Return a promise for async storage controllers
    return _Storage2['default'].getItemAsync(storagePath).then(function (configData) {
      if (configData) {
        var attributes = decodePayload(configData);
        if (attributes) {
          config.attributes = attributes;
          currentConfig = config;
        }
      }
      return config;
    });
  },

  get: function get() {
    var RESTController = _CoreManager2['default'].getRESTController();

    return RESTController.request('GET', 'config', {}, {}).then(function (response) {
      if (!response || !response.params) {
        var error = new _ParseError2['default'](_ParseError2['default'].INVALID_JSON, 'Config JSON response invalid.');
        return _ParsePromise2['default'].error(error);
      }

      var config = new ParseConfig();
      config.attributes = {};
      for (var attr in response.params) {
        config.attributes[attr] = (0, _decode2['default'])(response.params[attr]);
      }
      currentConfig = config;
      return _Storage2['default'].setItemAsync(_Storage2['default'].generatePath(CURRENT_CONFIG_KEY), JSON.stringify(response.params)).then(function () {
        return config;
      });
    });
  }
});
module.exports = exports['default'];
},{"./CoreManager":3,"./ParseError":10,"./ParsePromise":16,"./Storage":24,"./decode":29,"./encode":30,"./escape":32,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/interop-require-default":47}],10:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Constructs a new Parse.Error object with the given code and message.
 * @class Parse.Error
 * @constructor
 * @param {Number} code An error code constant from <code>Parse.Error</code>.
 * @param {String} message A detailed description of the error.
 */
"use strict";

var _classCallCheck = _dereq_("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ParseError = function ParseError(code, message) {
  _classCallCheck(this, ParseError);

  this.code = code;
  this.message = message;
}

/**
 * Error code indicating some error other than those enumerated here.
 * @property OTHER_CAUSE
 * @static
 * @final
 */
;

exports["default"] = ParseError;
ParseError.OTHER_CAUSE = -1;

/**
 * Error code indicating that something has gone wrong with the server.
 * If you get this error code, it is Parse's fault. Contact us at
 * https://parse.com/help
 * @property INTERNAL_SERVER_ERROR
 * @static
 * @final
 */
ParseError.INTERNAL_SERVER_ERROR = 1;

/**
 * Error code indicating the connection to the Parse servers failed.
 * @property CONNECTION_FAILED
 * @static
 * @final
 */
ParseError.CONNECTION_FAILED = 100;

/**
 * Error code indicating the specified object doesn't exist.
 * @property OBJECT_NOT_FOUND
 * @static
 * @final
 */
ParseError.OBJECT_NOT_FOUND = 101;

/**
 * Error code indicating you tried to query with a datatype that doesn't
 * support it, like exact matching an array or object.
 * @property INVALID_QUERY
 * @static
 * @final
 */
ParseError.INVALID_QUERY = 102;

/**
 * Error code indicating a missing or invalid classname. Classnames are
 * case-sensitive. They must start with a letter, and a-zA-Z0-9_ are the
 * only valid characters.
 * @property INVALID_CLASS_NAME
 * @static
 * @final
 */
ParseError.INVALID_CLASS_NAME = 103;

/**
 * Error code indicating an unspecified object id.
 * @property MISSING_OBJECT_ID
 * @static
 * @final
 */
ParseError.MISSING_OBJECT_ID = 104;

/**
 * Error code indicating an invalid key name. Keys are case-sensitive. They
 * must start with a letter, and a-zA-Z0-9_ are the only valid characters.
 * @property INVALID_KEY_NAME
 * @static
 * @final
 */
ParseError.INVALID_KEY_NAME = 105;

/**
 * Error code indicating a malformed pointer. You should not see this unless
 * you have been mucking about changing internal Parse code.
 * @property INVALID_POINTER
 * @static
 * @final
 */
ParseError.INVALID_POINTER = 106;

/**
 * Error code indicating that badly formed JSON was received upstream. This
 * either indicates you have done something unusual with modifying how
 * things encode to JSON, or the network is failing badly.
 * @property INVALID_JSON
 * @static
 * @final
 */
ParseError.INVALID_JSON = 107;

/**
 * Error code indicating that the feature you tried to access is only
 * available internally for testing purposes.
 * @property COMMAND_UNAVAILABLE
 * @static
 * @final
 */
ParseError.COMMAND_UNAVAILABLE = 108;

/**
 * You must call Parse.initialize before using the Parse library.
 * @property NOT_INITIALIZED
 * @static
 * @final
 */
ParseError.NOT_INITIALIZED = 109;

/**
 * Error code indicating that a field was set to an inconsistent type.
 * @property INCORRECT_TYPE
 * @static
 * @final
 */
ParseError.INCORRECT_TYPE = 111;

/**
 * Error code indicating an invalid channel name. A channel name is either
 * an empty string (the broadcast channel) or contains only a-zA-Z0-9_
 * characters and starts with a letter.
 * @property INVALID_CHANNEL_NAME
 * @static
 * @final
 */
ParseError.INVALID_CHANNEL_NAME = 112;

/**
 * Error code indicating that push is misconfigured.
 * @property PUSH_MISCONFIGURED
 * @static
 * @final
 */
ParseError.PUSH_MISCONFIGURED = 115;

/**
 * Error code indicating that the object is too large.
 * @property OBJECT_TOO_LARGE
 * @static
 * @final
 */
ParseError.OBJECT_TOO_LARGE = 116;

/**
 * Error code indicating that the operation isn't allowed for clients.
 * @property OPERATION_FORBIDDEN
 * @static
 * @final
 */
ParseError.OPERATION_FORBIDDEN = 119;

/**
 * Error code indicating the result was not found in the cache.
 * @property CACHE_MISS
 * @static
 * @final
 */
ParseError.CACHE_MISS = 120;

/**
 * Error code indicating that an invalid key was used in a nested
 * JSONObject.
 * @property INVALID_NESTED_KEY
 * @static
 * @final
 */
ParseError.INVALID_NESTED_KEY = 121;

/**
 * Error code indicating that an invalid filename was used for ParseFile.
 * A valid file name contains only a-zA-Z0-9_. characters and is between 1
 * and 128 characters.
 * @property INVALID_FILE_NAME
 * @static
 * @final
 */
ParseError.INVALID_FILE_NAME = 122;

/**
 * Error code indicating an invalid ACL was provided.
 * @property INVALID_ACL
 * @static
 * @final
 */
ParseError.INVALID_ACL = 123;

/**
 * Error code indicating that the request timed out on the server. Typically
 * this indicates that the request is too expensive to run.
 * @property TIMEOUT
 * @static
 * @final
 */
ParseError.TIMEOUT = 124;

/**
 * Error code indicating that the email address was invalid.
 * @property INVALID_EMAIL_ADDRESS
 * @static
 * @final
 */
ParseError.INVALID_EMAIL_ADDRESS = 125;

/**
 * Error code indicating a missing content type.
 * @property MISSING_CONTENT_TYPE
 * @static
 * @final
 */
ParseError.MISSING_CONTENT_TYPE = 126;

/**
 * Error code indicating a missing content length.
 * @property MISSING_CONTENT_LENGTH
 * @static
 * @final
 */
ParseError.MISSING_CONTENT_LENGTH = 127;

/**
 * Error code indicating an invalid content length.
 * @property INVALID_CONTENT_LENGTH
 * @static
 * @final
 */
ParseError.INVALID_CONTENT_LENGTH = 128;

/**
 * Error code indicating a file that was too large.
 * @property FILE_TOO_LARGE
 * @static
 * @final
 */
ParseError.FILE_TOO_LARGE = 129;

/**
 * Error code indicating an error saving a file.
 * @property FILE_SAVE_ERROR
 * @static
 * @final
 */
ParseError.FILE_SAVE_ERROR = 130;

/**
 * Error code indicating that a unique field was given a value that is
 * already taken.
 * @property DUPLICATE_VALUE
 * @static
 * @final
 */
ParseError.DUPLICATE_VALUE = 137;

/**
 * Error code indicating that a role's name is invalid.
 * @property INVALID_ROLE_NAME
 * @static
 * @final
 */
ParseError.INVALID_ROLE_NAME = 139;

/**
 * Error code indicating that an application quota was exceeded.  Upgrade to
 * resolve.
 * @property EXCEEDED_QUOTA
 * @static
 * @final
 */
ParseError.EXCEEDED_QUOTA = 140;

/**
 * Error code indicating that a Cloud Code script failed.
 * @property SCRIPT_FAILED
 * @static
 * @final
 */
ParseError.SCRIPT_FAILED = 141;

/**
 * Error code indicating that a Cloud Code validation failed.
 * @property VALIDATION_ERROR
 * @static
 * @final
 */
ParseError.VALIDATION_ERROR = 142;

/**
 * Error code indicating that invalid image data was provided.
 * @property INVALID_IMAGE_DATA
 * @static
 * @final
 */
ParseError.INVALID_IMAGE_DATA = 143;

/**
 * Error code indicating an unsaved file.
 * @property UNSAVED_FILE_ERROR
 * @static
 * @final
 */
ParseError.UNSAVED_FILE_ERROR = 151;

/**
 * Error code indicating an invalid push time.
 * @property INVALID_PUSH_TIME_ERROR
 * @static
 * @final
 */
ParseError.INVALID_PUSH_TIME_ERROR = 152;

/**
 * Error code indicating an error deleting a file.
 * @property FILE_DELETE_ERROR
 * @static
 * @final
 */
ParseError.FILE_DELETE_ERROR = 153;

/**
 * Error code indicating that the application has exceeded its request
 * limit.
 * @property REQUEST_LIMIT_EXCEEDED
 * @static
 * @final
 */
ParseError.REQUEST_LIMIT_EXCEEDED = 155;

/**
 * Error code indicating an invalid event name.
 * @property INVALID_EVENT_NAME
 * @static
 * @final
 */
ParseError.INVALID_EVENT_NAME = 160;

/**
 * Error code indicating that the username is missing or empty.
 * @property USERNAME_MISSING
 * @static
 * @final
 */
ParseError.USERNAME_MISSING = 200;

/**
 * Error code indicating that the password is missing or empty.
 * @property PASSWORD_MISSING
 * @static
 * @final
 */
ParseError.PASSWORD_MISSING = 201;

/**
 * Error code indicating that the username has already been taken.
 * @property USERNAME_TAKEN
 * @static
 * @final
 */
ParseError.USERNAME_TAKEN = 202;

/**
 * Error code indicating that the email has already been taken.
 * @property EMAIL_TAKEN
 * @static
 * @final
 */
ParseError.EMAIL_TAKEN = 203;

/**
 * Error code indicating that the email is missing, but must be specified.
 * @property EMAIL_MISSING
 * @static
 * @final
 */
ParseError.EMAIL_MISSING = 204;

/**
 * Error code indicating that a user with the specified email was not found.
 * @property EMAIL_NOT_FOUND
 * @static
 * @final
 */
ParseError.EMAIL_NOT_FOUND = 205;

/**
 * Error code indicating that a user object without a valid session could
 * not be altered.
 * @property SESSION_MISSING
 * @static
 * @final
 */
ParseError.SESSION_MISSING = 206;

/**
 * Error code indicating that a user can only be created through signup.
 * @property MUST_CREATE_USER_THROUGH_SIGNUP
 * @static
 * @final
 */
ParseError.MUST_CREATE_USER_THROUGH_SIGNUP = 207;

/**
 * Error code indicating that an an account being linked is already linked
 * to another user.
 * @property ACCOUNT_ALREADY_LINKED
 * @static
 * @final
 */
ParseError.ACCOUNT_ALREADY_LINKED = 208;

/**
 * Error code indicating that the current session token is invalid.
 * @property INVALID_SESSION_TOKEN
 * @static
 * @final
 */
ParseError.INVALID_SESSION_TOKEN = 209;

/**
 * Error code indicating that a user cannot be linked to an account because
 * that account's id could not be found.
 * @property LINKED_ID_MISSING
 * @static
 * @final
 */
ParseError.LINKED_ID_MISSING = 250;

/**
 * Error code indicating that a user with a linked (e.g. Facebook) account
 * has an invalid session.
 * @property INVALID_LINKED_SESSION
 * @static
 * @final
 */
ParseError.INVALID_LINKED_SESSION = 251;

/**
 * Error code indicating that a service being linked (e.g. Facebook or
 * Twitter) is unsupported.
 * @property UNSUPPORTED_SERVICE
 * @static
 * @final
 */
ParseError.UNSUPPORTED_SERVICE = 252;

/**
 * Error code indicating that there were multiple errors. Aggregate errors
 * have an "errors" property, which is an array of error objects with more
 * detail about each error that occurred.
 * @property AGGREGATE_ERROR
 * @static
 * @final
 */
ParseError.AGGREGATE_ERROR = 600;

/**
 * Error code indicating the client was unable to read an input file.
 * @property FILE_READ_ERROR
 * @static
 * @final
 */
ParseError.FILE_READ_ERROR = 601;

/**
 * Error code indicating a real error code is unavailable because
 * we had to use an XDomainRequest object to allow CORS requests in
 * Internet Explorer, which strips the body from HTTP responses that have
 * a non-2XX status code.
 * @property X_DOMAIN_REQUEST
 * @static
 * @final
 */
ParseError.X_DOMAIN_REQUEST = 602;
module.exports = exports["default"];
},{"babel-runtime/helpers/class-call-check":43}],11:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

function b64Digit(number) {
  if (number < 26) {
    return String.fromCharCode(65 + number);
  }
  if (number < 52) {
    return String.fromCharCode(97 + (number - 26));
  }
  if (number < 62) {
    return String.fromCharCode(48 + (number - 52));
  }
  if (number === 62) {
    return '+';
  }
  if (number === 63) {
    return '/';
  }
  throw new TypeError('Tried to encode large digit ' + number + ' in base64.');
}

/**
 * A Parse.File is a local representation of a file that is saved to the Parse
 * cloud.
 * @class Parse.File
 * @constructor
 * @param name {String} The file's name. This will be prefixed by a unique
 *     value once the file has finished saving. The file name must begin with
 *     an alphanumeric character, and consist of alphanumeric characters,
 *     periods, spaces, underscores, or dashes.
 * @param data {Array} The data for the file, as either:
 *     1. an Array of byte value Numbers, or
 *     2. an Object like { base64: "..." } with a base64-encoded String.
 *     3. a File object selected with a file upload control. (3) only works
 *        in Firefox 3.6+, Safari 6.0.2+, Chrome 7+, and IE 10+.
 *        For example:<pre>
 * var fileUploadControl = $("#profilePhotoFileUpload")[0];
 * if (fileUploadControl.files.length > 0) {
 *   var file = fileUploadControl.files[0];
 *   var name = "photo.jpg";
 *   var parseFile = new Parse.File(name, file);
 *   parseFile.save().then(function() {
 *     // The file has been saved to Parse.
 *   }, function(error) {
 *     // The file either could not be read, or could not be saved to Parse.
 *   });
 * }</pre>
 * @param type {String} Optional Content-Type header to use for the file. If
 *     this is omitted, the content type will be inferred from the name's
 *     extension.
 */

var ParseFile = (function () {
  function ParseFile(name, data, type) {
    _classCallCheck(this, ParseFile);

    var specifiedType = type || '';

    this._name = name;

    if (Array.isArray(data)) {
      this._source = {
        format: 'base64',
        base64: ParseFile.encodeBase64(data),
        type: specifiedType
      };
    } else if (typeof File !== 'undefined' && data instanceof File) {
      this._source = {
        format: 'file',
        file: data,
        type: specifiedType
      };
    } else if (data && data.hasOwnProperty('base64')) {
      var matches = /^data:([a-zA-Z]*\/[a-zA-Z+.-]*);(charset=[a-zA-Z0-9\-\/\s]*,)?base64,(\S+)/.exec(data.base64);
      if (matches && matches.length > 0) {
        // if data URI with type and charset, there will be 4 matches.
        this._source = {
          format: 'base64',
          base64: matches.length === 4 ? matches[3] : matches[2],
          type: matches[1]
        };
      } else {
        this._source = {
          format: 'base64',
          base64: data.base64,
          type: specifiedType
        };
      }
    } else if (typeof data !== 'undefined') {
      throw new TypeError('Cannot create a Parse.File with that data.');
    }
  }

  /**
   * Gets the name of the file. Before save is called, this is the filename
   * given by the user. After save is called, that name gets prefixed with a
   * unique identifier.
   * @method name
   * @return {String}
   */

  _createClass(ParseFile, [{
    key: 'name',
    value: function name() {
      return this._name;
    }

    /**
     * Gets the url of the file. It is only available after you save the file or
     * after you get the file from a Parse.Object.
     * @method url
     * @return {String}
     */
  }, {
    key: 'url',
    value: function url() {
      return this._url;
    }

    /**
     * Saves the file to the Parse cloud.
     * @method save
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} Promise that is resolved when the save finishes.
     */
  }, {
    key: 'save',
    value: function save(options) {
      var _this = this;

      options = options || {};
      var controller = _CoreManager2['default'].getFileController();
      if (!this._previousSave) {
        if (this._source.format === 'file') {
          this._previousSave = controller.saveFile(this._name, this._source).then(function (res) {
            _this._name = res.name;
            _this._url = res.url;
            return _this;
          });
        } else {
          this._previousSave = controller.saveBase64(this._name, this._source).then(function (res) {
            _this._name = res.name;
            _this._url = res.url;
            return _this;
          });
        }
      }
      if (this._previousSave) {
        return this._previousSave._thenRunCallbacks(options);
      }
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        __type: 'File',
        name: this._name,
        url: this._url
      };
    }
  }, {
    key: 'equals',
    value: function equals(other) {
      if (this === other) {
        return true;
      }
      // Unsaved Files are never equal, since they will be saved to different URLs
      return other instanceof ParseFile && this.name() === other.name() && this.url() === other.url() && typeof this.url() !== 'undefined';
    }
  }], [{
    key: 'fromJSON',
    value: function fromJSON(obj) {
      if (obj.__type !== 'File') {
        throw new TypeError('JSON object does not represent a ParseFile');
      }
      var file = new ParseFile(obj.name);
      file._url = obj.url;
      return file;
    }
  }, {
    key: 'encodeBase64',
    value: function encodeBase64(bytes) {
      var chunks = [];
      chunks.length = Math.ceil(bytes.length / 3);
      for (var i = 0; i < chunks.length; i++) {
        var b1 = bytes[i * 3];
        var b2 = bytes[i * 3 + 1] || 0;
        var b3 = bytes[i * 3 + 2] || 0;

        var has2 = i * 3 + 1 < bytes.length;
        var has3 = i * 3 + 2 < bytes.length;

        chunks[i] = [b64Digit(b1 >> 2 & 0x3F), b64Digit(b1 << 4 & 0x30 | b2 >> 4 & 0x0F), has2 ? b64Digit(b2 << 2 & 0x3C | b3 >> 6 & 0x03) : '=', has3 ? b64Digit(b3 & 0x3F) : '='].join('');
      }

      return chunks.join('');
    }
  }]);

  return ParseFile;
})();

exports['default'] = ParseFile;

_CoreManager2['default'].setFileController({
  saveFile: function saveFile(name, source) {
    if (source.format !== 'file') {
      throw new Error('saveFile can only be used with File-type sources.');
    }
    // To directly upload a File, we use a REST-style AJAX request
    var headers = {
      'X-Parse-Application-ID': _CoreManager2['default'].get('APPLICATION_ID'),
      'X-Parse-JavaScript-Key': _CoreManager2['default'].get('JAVASCRIPT_KEY')
    };
    var url = _CoreManager2['default'].get('SERVER_URL');
    if (url[url.length - 1] !== '/') {
      url += '/';
    }
    url += 'files/' + name;
    return _CoreManager2['default'].getRESTController().ajax('POST', url, source.file, headers);
  },

  saveBase64: function saveBase64(name, source) {
    if (source.format !== 'base64') {
      throw new Error('saveBase64 can only be used with Base64-type sources.');
    }
    var data = {
      base64: source.base64
    };
    if (source.type) {
      data._ContentType = source.type;
    }

    return _CoreManager2['default'].getRESTController().request('POST', 'files/' + name, data);
  }
});
module.exports = exports['default'];
},{"./CoreManager":3,"./ParsePromise":16,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/interop-require-default":47}],12:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

/**
 * Creates a new GeoPoint with any of the following forms:<br>
 *   <pre>
 *   new GeoPoint(otherGeoPoint)
 *   new GeoPoint(30, 30)
 *   new GeoPoint([30, 30])
 *   new GeoPoint({latitude: 30, longitude: 30})
 *   new GeoPoint()  // defaults to (0, 0)
 *   </pre>
 * @class Parse.GeoPoint
 * @constructor
 *
 * <p>Represents a latitude / longitude point that may be associated
 * with a key in a ParseObject or used as a reference point for geo queries.
 * This allows proximity-based queries on the key.</p>
 *
 * <p>Only one key in a class may contain a GeoPoint.</p>
 *
 * <p>Example:<pre>
 *   var point = new Parse.GeoPoint(30.0, -20.0);
 *   var object = new Parse.Object("PlaceObject");
 *   object.set("location", point);
 *   object.save();</pre></p>
 */

var ParseGeoPoint = (function () {
  function ParseGeoPoint(arg1, arg2) {
    _classCallCheck(this, ParseGeoPoint);

    if (Array.isArray(arg1)) {
      ParseGeoPoint._validate(arg1[0], arg1[1]);
      this._latitude = arg1[0];
      this._longitude = arg1[1];
    } else if (typeof arg1 === 'object') {
      ParseGeoPoint._validate(arg1.latitude, arg1.longitude);
      this._latitude = arg1.latitude;
      this._longitude = arg1.longitude;
    } else if (typeof arg1 === 'number' && typeof arg2 === 'number') {
      ParseGeoPoint._validate(arg1, arg2);
      this._latitude = arg1;
      this._longitude = arg2;
    } else {
      this._latitude = 0;
      this._longitude = 0;
    }
  }

  /**
   * North-south portion of the coordinate, in range [-90, 90].
   * Throws an exception if set out of range in a modern browser.
   * @property latitude
   * @type Number
   */

  _createClass(ParseGeoPoint, [{
    key: 'toJSON',

    /**
     * Returns a JSON representation of the GeoPoint, suitable for Parse.
     * @method toJSON
     * @return {Object}
     */
    value: function toJSON() {
      ParseGeoPoint._validate(this._latitude, this._longitude);
      return {
        __type: 'GeoPoint',
        latitude: this._latitude,
        longitude: this._longitude
      };
    }
  }, {
    key: 'equals',
    value: function equals(other) {
      return other instanceof ParseGeoPoint && this.latitude === other.latitude && this.longitude === other.longitude;
    }

    /**
     * Returns the distance from this GeoPoint to another in radians.
     * @method radiansTo
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
  }, {
    key: 'radiansTo',
    value: function radiansTo(point) {
      var d2r = Math.PI / 180.0;
      var lat1rad = this.latitude * d2r;
      var long1rad = this.longitude * d2r;
      var lat2rad = point.latitude * d2r;
      var long2rad = point.longitude * d2r;

      var sinDeltaLatDiv2 = Math.sin((lat1rad - lat2rad) / 2);
      var sinDeltaLongDiv2 = Math.sin((long1rad - long2rad) / 2);
      // Square of half the straight line chord distance between both points.
      var a = sinDeltaLatDiv2 * sinDeltaLatDiv2 + Math.cos(lat1rad) * Math.cos(lat2rad) * sinDeltaLongDiv2 * sinDeltaLongDiv2;
      a = Math.min(1.0, a);
      return 2 * Math.asin(Math.sqrt(a));
    }

    /**
     * Returns the distance from this GeoPoint to another in kilometers.
     * @method kilometersTo
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
  }, {
    key: 'kilometersTo',
    value: function kilometersTo(point) {
      return this.radiansTo(point) * 6371.0;
    }

    /**
     * Returns the distance from this GeoPoint to another in miles.
     * @method milesTo
     * @param {Parse.GeoPoint} point the other Parse.GeoPoint.
     * @return {Number}
     */
  }, {
    key: 'milesTo',
    value: function milesTo(point) {
      return this.radiansTo(point) * 3958.8;
    }

    /**
     * Throws an exception if the given lat-long is out of bounds.
     */
  }, {
    key: 'latitude',
    get: function get() {
      return this._latitude;
    },
    set: function set(val) {
      ParseGeoPoint._validate(val, this.longitude);
      this._latitude = val;
    }

    /**
     * East-west portion of the coordinate, in range [-180, 180].
     * Throws if set out of range in a modern browser.
     * @property longitude
     * @type Number
     */
  }, {
    key: 'longitude',
    get: function get() {
      return this._longitude;
    },
    set: function set(val) {
      ParseGeoPoint._validate(this.latitude, val);
      this._longitude = val;
    }
  }], [{
    key: '_validate',
    value: function _validate(latitude, longitude) {
      if (latitude !== latitude || longitude !== longitude) {
        throw new TypeError('GeoPoint latitude and longitude must be valid numbers');
      }
      if (latitude < -90.0) {
        throw new TypeError('GeoPoint latitude out of bounds: ' + latitude + ' < -90.0.');
      }
      if (latitude > 90.0) {
        throw new TypeError('GeoPoint latitude out of bounds: ' + latitude + ' > 90.0.');
      }
      if (longitude < -180.0) {
        throw new TypeError('GeoPoint longitude out of bounds: ' + longitude + ' < -180.0.');
      }
      if (longitude > 180.0) {
        throw new TypeError('GeoPoint longitude out of bounds: ' + longitude + ' > 180.0.');
      }
    }

    /**
     * Creates a GeoPoint with the user's current location, if available.
     * Calls options.success with a new GeoPoint instance or calls options.error.
     * @method current
     * @param {Object} options An object with success and error callbacks.
     * @static
     */
  }, {
    key: 'current',
    value: function current(options) {
      var promise = new _ParsePromise2['default']();
      navigator.geolocation.getCurrentPosition(function (location) {
        promise.resolve(new ParseGeoPoint(location.coords.latitude, location.coords.longitude));
      }, function (error) {
        promise.reject(error);
      });

      return promise._thenRunCallbacks(options);
    }
  }]);

  return ParseGeoPoint;
})();

exports['default'] = ParseGeoPoint;
module.exports = exports['default'];
},{"./ParsePromise":16,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/interop-require-default":47}],13:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _get = _dereq_('babel-runtime/helpers/get')['default'];

var _inherits = _dereq_('babel-runtime/helpers/inherits')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ParseObject2 = _dereq_('./ParseObject');

var _ParseObject3 = _interopRequireDefault(_ParseObject2);

var Installation = (function (_ParseObject) {
  _inherits(Installation, _ParseObject);

  function Installation(attributes) {
    _classCallCheck(this, Installation);

    _get(Object.getPrototypeOf(Installation.prototype), 'constructor', this).call(this, '_Installation');
    if (attributes && typeof attributes === 'object') {
      if (!this.set(attributes || {})) {
        throw new Error('Can\'t create an invalid Session');
      }
    }
  }

  return Installation;
})(_ParseObject3['default']);

exports['default'] = Installation;

_ParseObject3['default'].registerSubclass('_Installation', Installation);
module.exports = exports['default'];
},{"./ParseObject":14,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/get":45,"babel-runtime/helpers/inherits":46,"babel-runtime/helpers/interop-require-default":47}],14:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = _dereq_('babel-runtime/core-js/object/keys')['default'];

var _Object$freeze = _dereq_('babel-runtime/core-js/object/freeze')['default'];

var _Object$create = _dereq_('babel-runtime/core-js/object/create')['default'];

var _Object$defineProperty = _dereq_('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = _dereq_('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _canBeSerialized = _dereq_('./canBeSerialized');

var _canBeSerialized2 = _interopRequireDefault(_canBeSerialized);

var _decode = _dereq_('./decode');

var _decode2 = _interopRequireDefault(_decode);

var _encode = _dereq_('./encode');

var _encode2 = _interopRequireDefault(_encode);

var _equals = _dereq_('./equals');

var _equals2 = _interopRequireDefault(_equals);

var _escape2 = _dereq_('./escape');

var _escape3 = _interopRequireDefault(_escape2);

var _ObjectState = _dereq_('./ObjectState');

var ObjectState = _interopRequireWildcard(_ObjectState);

var _ParseACL = _dereq_('./ParseACL');

var _ParseACL2 = _interopRequireDefault(_ParseACL);

var _parseDate = _dereq_('./parseDate');

var _parseDate2 = _interopRequireDefault(_parseDate);

var _ParseError = _dereq_('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _ParseFile = _dereq_('./ParseFile');

var _ParseFile2 = _interopRequireDefault(_ParseFile);

var _ParseOp = _dereq_('./ParseOp');

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

var _ParseQuery = _dereq_('./ParseQuery');

var _ParseQuery2 = _interopRequireDefault(_ParseQuery);

var _ParseRelation = _dereq_('./ParseRelation');

var _ParseRelation2 = _interopRequireDefault(_ParseRelation);

var _unique = _dereq_('./unique');

var _unique2 = _interopRequireDefault(_unique);

var _unsavedChildren = _dereq_('./unsavedChildren');

var _unsavedChildren2 = _interopRequireDefault(_unsavedChildren);

// Mapping of class names to constructors, so we can populate objects from the
// server with appropriate subclasses of ParseObject
var classMap = {};

// Global counter for generating unique local Ids
var localCount = 0;
// Global counter for generating unique Ids for non-single-instance objects
var objectCount = 0;
// On web clients, objects are single-instance: any two objects with the same Id
// will have the same attributes. However, this may be dangerous default
// behavior in a server scenario
var singleInstance = !_CoreManager2['default'].get('IS_NODE');

function getServerUrlPath() {
  var serverUrl = _CoreManager2['default'].get('SERVER_URL');
  if (serverUrl[serverUrl.length - 1] !== '/') {
    serverUrl += '/';
  }
  var url = serverUrl.replace(/https?:\/\//, '');
  return url.substr(url.indexOf('/'));
}

/**
 * Creates a new model with defined attributes.
 *
 * <p>You won't normally call this method directly.  It is recommended that
 * you use a subclass of <code>Parse.Object</code> instead, created by calling
 * <code>extend</code>.</p>
 *
 * <p>However, if you don't want to use a subclass, or aren't sure which
 * subclass is appropriate, you can use this form:<pre>
 *     var object = new Parse.Object("ClassName");
 * </pre>
 * That is basically equivalent to:<pre>
 *     var MyClass = Parse.Object.extend("ClassName");
 *     var object = new MyClass();
 * </pre></p>
 *
 * @class Parse.Object
 * @constructor
 * @param {String} className The class name for the object
 * @param {Object} attributes The initial set of data to store in the object.
 * @param {Object} options The options for this object instance.
 */

var ParseObject = (function () {
  function ParseObject(className, attributes, options) {
    _classCallCheck(this, ParseObject);

    // Enable legacy initializers
    if (typeof this.initialize === 'function') {
      this.initialize.apply(this, arguments);
    }

    var toSet = null;
    this._objCount = objectCount++;
    if (typeof className === 'string') {
      this.className = className;
      if (attributes && typeof attributes === 'object') {
        toSet = attributes;
      }
    } else if (className && typeof className === 'object') {
      this.className = className.className;
      toSet = {};
      for (var attr in className) {
        if (attr !== 'className') {
          toSet[attr] = className[attr];
        }
      }
      if (attributes && typeof attributes === 'object') {
        options = attributes;
      }
    }
    if (toSet && !this.set(toSet, options)) {
      throw new Error('Can\'t create an invalid Parse Object');
    }
  }

  /** Prototype getters / setters **/

  _createClass(ParseObject, [{
    key: '_getId',

    /** Private methods **/

    /**
     * Returns a local or server Id used uniquely identify this object
     */
    value: function _getId() {
      if (typeof this.id === 'string') {
        return this.id;
      }
      if (typeof this._localId === 'string') {
        return this._localId;
      }
      var localId = 'local' + String(localCount++);
      this._localId = localId;
      return localId;
    }

    /**
     * Returns a local or server Id used to pull data from the Object State store
     * If single instance objects are disabled, it will use the object's unique
     * count to separate its data from other objects with the same server Id.
     */
  }, {
    key: '_getStateIdentifier',
    value: function _getStateIdentifier() {
      if (typeof this.id === 'string') {
        if (singleInstance) {
          return this.id;
        }
        return this.id + '_' + String(this._objCount);
      }
      return this._getId();
    }
  }, {
    key: '_getServerData',
    value: function _getServerData() {
      return ObjectState.getServerData(this.className, this._getStateIdentifier());
    }
  }, {
    key: '_clearServerData',
    value: function _clearServerData() {
      var serverData = this._getServerData();
      var unset = {};
      for (var attr in serverData) {
        unset[attr] = undefined;
      }
      ObjectState.setServerData(this.className, this._getStateIdentifier(), unset);
    }
  }, {
    key: '_getPendingOps',
    value: function _getPendingOps() {
      return ObjectState.getPendingOps(this.className, this._getStateIdentifier());
    }
  }, {
    key: '_clearPendingOps',
    value: function _clearPendingOps() {
      var pending = this._getPendingOps();
      var latest = pending[pending.length - 1];
      var keys = _Object$keys(latest);
      keys.forEach(function (key) {
        delete latest[key];
      });
    }
  }, {
    key: '_getDirtyObjectAttributes',
    value: function _getDirtyObjectAttributes() {
      var attributes = this.attributes;
      var objectCache = ObjectState.getObjectCache(this.className, this._getStateIdentifier());
      var dirty = {};
      for (var attr in attributes) {
        var val = attributes[attr];
        if (val && typeof val === 'object' && !(val instanceof ParseObject) && !(val instanceof _ParseFile2['default']) && !(val instanceof _ParseRelation2['default'])) {
          // Due to the way browsers construct maps, the key order will not change
          // unless the object is changed
          try {
            var json = (0, _encode2['default'])(val, false, true);
            var stringified = JSON.stringify(json);
            if (objectCache[attr] !== stringified) {
              dirty[attr] = val;
            }
          } catch (e) {
            // Error occurred, possibly by a nested unsaved pointer in a mutable container
            // No matter how it happened, it indicates a change in the attribute
            dirty[attr] = val;
          }
        }
      }
      return dirty;
    }
  }, {
    key: '_toFullJSON',
    value: function _toFullJSON(seen) {
      var json = this.toJSON(seen);
      json.__type = 'Object';
      json.className = this.className;
      return json;
    }
  }, {
    key: '_getSaveJSON',
    value: function _getSaveJSON() {
      var pending = this._getPendingOps();
      var dirtyObjects = this._getDirtyObjectAttributes();
      var json = {};
      var attr;
      for (attr in dirtyObjects) {
        json[attr] = new _ParseOp.SetOp(dirtyObjects[attr]).toJSON();
      }
      for (attr in pending[0]) {
        json[attr] = pending[0][attr].toJSON();
      }
      return json;
    }
  }, {
    key: '_getSaveParams',
    value: function _getSaveParams() {
      var method = this.id ? 'PUT' : 'POST';
      var body = this._getSaveJSON();
      var path = 'classes/' + this.className;
      if (this.id) {
        path += '/' + this.id;
      } else if (this.className === '_User') {
        path = 'users';
      }
      return {
        method: method,
        body: body,
        path: path
      };
    }
  }, {
    key: '_finishFetch',
    value: function _finishFetch(serverData) {
      if (!this.id && serverData.objectId) {
        this.id = serverData.objectId;
      }
      ObjectState.initializeState(this.className, this._getStateIdentifier());
      var decoded = {};
      for (var attr in serverData) {
        if (attr === 'ACL') {
          decoded[attr] = new _ParseACL2['default'](serverData[attr]);
        } else if (attr !== 'objectId') {
          decoded[attr] = (0, _decode2['default'])(serverData[attr]);
          if (decoded[attr] instanceof _ParseRelation2['default']) {
            decoded[attr]._ensureParentAndKey(this, attr);
          }
        }
      }
      if (decoded.createdAt && typeof decoded.createdAt === 'string') {
        decoded.createdAt = (0, _parseDate2['default'])(decoded.createdAt);
      }
      if (decoded.updatedAt && typeof decoded.updatedAt === 'string') {
        decoded.updatedAt = (0, _parseDate2['default'])(decoded.updatedAt);
      }
      if (!decoded.updatedAt && decoded.createdAt) {
        decoded.updatedAt = decoded.createdAt;
      }
      ObjectState.commitServerChanges(this.className, this._getStateIdentifier(), decoded);
    }
  }, {
    key: '_setExisted',
    value: function _setExisted(existed) {
      var state = ObjectState.getState(this.className, this._getStateIdentifier());
      if (state) {
        state.existed = existed;
      }
    }
  }, {
    key: '_migrateId',
    value: function _migrateId(serverId) {
      if (this._localId && serverId) {
        var oldState = ObjectState.removeState(this.className, this._getStateIdentifier());
        this.id = serverId;
        delete this._localId;
        if (oldState) {
          ObjectState.initializeState(this.className, this._getStateIdentifier(), oldState);
        }
      }
    }
  }, {
    key: '_handleSaveResponse',
    value: function _handleSaveResponse(response, status) {
      var changes = {};
      var attr;
      var pending = ObjectState.popPendingState(this.className, this._getStateIdentifier());
      for (attr in pending) {
        if (pending[attr] instanceof _ParseOp.RelationOp) {
          changes[attr] = pending[attr].applyTo(undefined, this, attr);
        } else if (!(attr in response)) {
          // Only SetOps and UnsetOps should not come back with results
          changes[attr] = pending[attr].applyTo(undefined);
        }
      }
      for (attr in response) {
        if ((attr === 'createdAt' || attr === 'updatedAt') && typeof response[attr] === 'string') {
          changes[attr] = (0, _parseDate2['default'])(response[attr]);
        } else if (attr === 'ACL') {
          changes[attr] = new _ParseACL2['default'](response[attr]);
        } else if (attr !== 'objectId') {
          changes[attr] = (0, _decode2['default'])(response[attr]);
        }
      }
      if (changes.createdAt && !changes.updatedAt) {
        changes.updatedAt = changes.createdAt;
      }

      this._migrateId(response.objectId);

      if (status !== 201) {
        this._setExisted(true);
      }

      ObjectState.commitServerChanges(this.className, this._getStateIdentifier(), changes);
    }
  }, {
    key: '_handleSaveError',
    value: function _handleSaveError() {
      var pending = this._getPendingOps();
      ObjectState.mergeFirstPendingState(this.className, this._getStateIdentifier());
    }

    /** Public methods **/

  }, {
    key: 'initialize',
    value: function initialize() {}
    // NOOP

    /**
     * Returns a JSON version of the object suitable for saving to Parse.
     * @method toJSON
     * @return {Object}
     */

  }, {
    key: 'toJSON',
    value: function toJSON(seen) {
      var seenEntry = this.id ? this.className + ':' + this.id : this;
      var seen = seen || [seenEntry];
      var json = {};
      var attrs = this.attributes;
      for (var attr in attrs) {
        if ((attr === 'createdAt' || attr === 'updatedAt') && attrs[attr].toJSON) {
          json[attr] = attrs[attr].toJSON();
        } else {
          json[attr] = (0, _encode2['default'])(attrs[attr], false, false, seen);
        }
      }
      var pending = this._getPendingOps();
      for (var attr in pending[0]) {
        json[attr] = pending[0][attr].toJSON();
      }

      if (this.id) {
        json.objectId = this.id;
      }
      return json;
    }

    /**
     * Determines whether this ParseObject is equal to another ParseObject
     * @method equals
     * @return {Boolean}
     */
  }, {
    key: 'equals',
    value: function equals(other) {
      if (this === other) {
        return true;
      }
      return other instanceof ParseObject && this.className === other.className && this.id === other.id && typeof this.id !== 'undefined';
    }

    /**
     * Returns true if this object has been modified since its last
     * save/refresh.  If an attribute is specified, it returns true only if that
     * particular attribute has been modified since the last save/refresh.
     * @method dirty
     * @param {String} attr An attribute name (optional).
     * @return {Boolean}
     */
  }, {
    key: 'dirty',
    value: function dirty(attr) {
      if (!this.id) {
        return true;
      }
      var pendingOps = this._getPendingOps();
      var dirtyObjects = this._getDirtyObjectAttributes();
      if (attr) {
        if (dirtyObjects.hasOwnProperty(attr)) {
          return true;
        }
        for (var i = 0; i < pendingOps.length; i++) {
          if (pendingOps[i].hasOwnProperty(attr)) {
            return true;
          }
        }
        return false;
      }
      if (_Object$keys(pendingOps[0]).length !== 0) {
        return true;
      }
      if (_Object$keys(dirtyObjects).length !== 0) {
        return true;
      }
      return false;
    }

    /**
     * Returns an array of keys that have been modified since last save/refresh
     * @method dirtyKeys
     * @return {Array of string}
     */
  }, {
    key: 'dirtyKeys',
    value: function dirtyKeys() {
      var pendingOps = this._getPendingOps();
      var keys = {};
      for (var i = 0; i < pendingOps.length; i++) {
        for (var attr in pendingOps[i]) {
          keys[attr] = true;
        }
      }
      var dirtyObjects = this._getDirtyObjectAttributes();
      for (var attr in dirtyObjects) {
        keys[attr] = true;
      }
      return _Object$keys(keys);
    }

    /**
     * Gets a Pointer referencing this Object.
     * @method toPointer
     * @return {Object}
     */
  }, {
    key: 'toPointer',
    value: function toPointer() {
      if (!this.id) {
        throw new Error('Cannot create a pointer to an unsaved ParseObject');
      }
      return {
        __type: 'Pointer',
        className: this.className,
        objectId: this.id
      };
    }

    /**
     * Gets the value of an attribute.
     * @method get
     * @param {String} attr The string name of an attribute.
     */
  }, {
    key: 'get',
    value: function get(attr) {
      return this.attributes[attr];
    }

    /**
     * Gets a relation on the given class for the attribute.
     * @method relation
     * @param String attr The attribute to get the relation for.
     */
  }, {
    key: 'relation',
    value: function relation(attr) {
      var value = this.get(attr);
      if (value) {
        if (!(value instanceof _ParseRelation2['default'])) {
          throw new Error('Called relation() on non-relation field ' + attr);
        }
        value._ensureParentAndKey(this, attr);
        return value;
      }
      return new _ParseRelation2['default'](this, attr);
    }

    /**
     * Gets the HTML-escaped value of an attribute.
     * @method escape
     * @param {String} attr The string name of an attribute.
     */
  }, {
    key: 'escape',
    value: function escape(attr) {
      var val = this.attributes[attr];
      if (val == null) {
        return '';
      }
      var str = val;
      if (typeof val !== 'string') {
        if (typeof val.toString !== 'function') {
          return '';
        }
        val = val.toString();
      }
      return (0, _escape3['default'])(val);
    }

    /**
     * Returns <code>true</code> if the attribute contains a value that is not
     * null or undefined.
     * @method has
     * @param {String} attr The string name of the attribute.
     * @return {Boolean}
     */
  }, {
    key: 'has',
    value: function has(attr) {
      var attributes = this.attributes;
      if (attributes.hasOwnProperty(attr)) {
        return attributes[attr] != null;
      }
      return false;
    }

    /**
     * Sets a hash of model attributes on the object.
     *
     * <p>You can call it with an object containing keys and values, or with one
     * key and value.  For example:<pre>
     *   gameTurn.set({
     *     player: player1,
     *     diceRoll: 2
     *   }, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
     *
     *   game.set("currentPlayer", player2, {
     *     error: function(gameTurnAgain, error) {
     *       // The set failed validation.
     *     }
     *   });
     *
     *   game.set("finished", true);</pre></p>
     *
     * @method set
     * @param {String} key The key to set.
     * @param {} value The value to give it.
     * @param {Object} options A set of options for the set.
     *     The only supported option is <code>error</code>.
     * @return {Boolean} true if the set succeeded.
     */
  }, {
    key: 'set',
    value: function set(key, value, options) {
      var changes = {};
      var newOps = {};
      if (key && typeof key === 'object') {
        changes = key;
        options = value;
      } else if (typeof key === 'string') {
        changes[key] = value;
      } else {
        return this;
      }

      options = options || {};
      var readonly = [];
      if (typeof this.constructor.readOnlyAttributes === 'function') {
        readonly = readonly.concat(this.constructor.readOnlyAttributes());
      }
      for (var k in changes) {
        if (k === 'createdAt' || k === 'updatedAt') {
          // This property is read-only, but for legacy reasons we silently
          // ignore it
          continue;
        }
        if (readonly.indexOf(k) > -1) {
          throw new Error('Cannot modify readonly attribute: ' + k);
        }
        if (options.unset) {
          newOps[k] = new _ParseOp.UnsetOp();
        } else if (changes[k] instanceof _ParseOp.Op) {
          newOps[k] = changes[k];
        } else if (changes[k] && typeof changes[k] === 'object' && typeof changes[k].__op === 'string') {
          newOps[k] = (0, _ParseOp.opFromJSON)(changes[k]);
        } else if (k === 'objectId' || k === 'id') {
          this.id = changes[k];
        } else if (k === 'ACL' && typeof changes[k] === 'object' && !(changes[k] instanceof _ParseACL2['default'])) {
          newOps[k] = new _ParseOp.SetOp(new _ParseACL2['default'](changes[k]));
        } else {
          newOps[k] = new _ParseOp.SetOp(changes[k]);
        }
      }

      // Calculate new values
      var currentAttributes = this.attributes;
      var newValues = {};
      for (var attr in newOps) {
        if (newOps[attr] instanceof _ParseOp.RelationOp) {
          newValues[attr] = newOps[attr].applyTo(currentAttributes[attr], this, attr);
        } else if (!(newOps[attr] instanceof _ParseOp.UnsetOp)) {
          newValues[attr] = newOps[attr].applyTo(currentAttributes[attr]);
        }
      }

      // Validate changes
      if (!options.ignoreValidation) {
        var validation = this.validate(newValues);
        if (validation) {
          if (typeof options.error === 'function') {
            options.error(this, validation);
          }
          return false;
        }
      }

      // Consolidate Ops
      var pendingOps = this._getPendingOps();
      var last = pendingOps.length - 1;
      for (var attr in newOps) {
        var nextOp = newOps[attr].mergeWith(pendingOps[last][attr]);
        ObjectState.setPendingOp(this.className, this._getStateIdentifier(), attr, nextOp);
      }

      return this;
    }

    /**
     * Remove an attribute from the model. This is a noop if the attribute doesn't
     * exist.
     * @method unset
     * @param {String} attr The string name of an attribute.
     */
  }, {
    key: 'unset',
    value: function unset(attr, options) {
      options = options || {};
      options.unset = true;
      return this.set(attr, null, options);
    }

    /**
     * Atomically increments the value of the given attribute the next time the
     * object is saved. If no amount is specified, 1 is used by default.
     *
     * @method increment
     * @param attr {String} The key.
     * @param amount {Number} The amount to increment by (optional).
     */
  }, {
    key: 'increment',
    value: function increment(attr, amount) {
      if (typeof amount === 'undefined') {
        amount = 1;
      }
      if (typeof amount !== 'number') {
        throw new Error('Cannot increment by a non-numeric amount.');
      }
      return this.set(attr, new _ParseOp.IncrementOp(amount));
    }

    /**
     * Atomically add an object to the end of the array associated with a given
     * key.
     * @method add
     * @param attr {String} The key.
     * @param item {} The item to add.
     */
  }, {
    key: 'add',
    value: function add(attr, item) {
      return this.set(attr, new _ParseOp.AddOp([item]));
    }

    /**
     * Atomically add an object to the array associated with a given key, only
     * if it is not already present in the array. The position of the insert is
     * not guaranteed.
     *
     * @method addUnique
     * @param attr {String} The key.
     * @param item {} The object to add.
     */
  }, {
    key: 'addUnique',
    value: function addUnique(attr, item) {
      return this.set(attr, new _ParseOp.AddUniqueOp([item]));
    }

    /**
     * Atomically remove all instances of an object from the array associated
     * with a given key.
     *
     * @method remove
     * @param attr {String} The key.
     * @param item {} The object to remove.
     */
  }, {
    key: 'remove',
    value: function remove(attr, item) {
      return this.set(attr, new _ParseOp.RemoveOp([item]));
    }

    /**
     * Returns an instance of a subclass of Parse.Op describing what kind of
     * modification has been performed on this field since the last time it was
     * saved. For example, after calling object.increment("x"), calling
     * object.op("x") would return an instance of Parse.Op.Increment.
     *
     * @method op
     * @param attr {String} The key.
     * @returns {Parse.Op} The operation, or undefined if none.
     */
  }, {
    key: 'op',
    value: function op(attr) {
      var pending = this._getPendingOps();
      for (var i = pending.length; i--;) {
        if (pending[i][attr]) {
          return pending[i][attr];
        }
      }
    }

    /**
     * Creates a new model with identical attributes to this one.
     * @method clone
     * @return {Parse.Object}
     */
  }, {
    key: 'clone',
    value: function clone() {
      var clone = new this.constructor();
      if (!clone.className) {
        clone.className = this.className;
      }
      if (clone.set) {
        clone.set(this.attributes);
      }
      return clone;
    }

    /**
     * Returns true if this object has never been saved to Parse.
     * @method isNew
     * @return {Boolean}
     */
  }, {
    key: 'isNew',
    value: function isNew() {
      return !this.id;
    }

    /**
     * Returns true if this object was created by the Parse server when the
     * object might have already been there (e.g. in the case of a Facebook
     * login)
     * @method existed
     * @return {Boolean}
     */
  }, {
    key: 'existed',
    value: function existed() {
      if (!this.id) {
        return false;
      }
      var state = ObjectState.getState(this.className, this._getStateIdentifier());
      if (state) {
        return state.existed;
      }
      return false;
    }

    /**
     * Checks if the model is currently in a valid state.
     * @method isValid
     * @return {Boolean}
     */
  }, {
    key: 'isValid',
    value: function isValid() {
      return !this.validate(this.attributes);
    }

    /**
     * You should not call this function directly unless you subclass
     * <code>Parse.Object</code>, in which case you can override this method
     * to provide additional validation on <code>set</code> and
     * <code>save</code>.  Your implementation should return
     *
     * @method validate
     * @param {Object} attrs The current data to validate.
     * @return {} False if the data is valid.  An error object otherwise.
     * @see Parse.Object#set
     */
  }, {
    key: 'validate',
    value: function validate(attrs) {
      if (attrs.hasOwnProperty('ACL') && !(attrs.ACL instanceof _ParseACL2['default'])) {
        return new _ParseError2['default'](_ParseError2['default'].OTHER_CAUSE, 'ACL must be a Parse ACL.');
      }
      for (var key in attrs) {
        if (!/^[A-Za-z][0-9A-Za-z_]*$/.test(key)) {
          return new _ParseError2['default'](_ParseError2['default'].INVALID_KEY_NAME);
        }
      }
      return false;
    }

    /**
     * Returns the ACL for this object.
     * @method getACL
     * @returns {Parse.ACL} An instance of Parse.ACL.
     * @see Parse.Object#get
     */
  }, {
    key: 'getACL',
    value: function getACL() {
      var acl = this.get('ACL');
      if (acl instanceof _ParseACL2['default']) {
        return acl;
      }
      return null;
    }

    /**
     * Sets the ACL to be used for this object.
     * @method setACL
     * @param {Parse.ACL} acl An instance of Parse.ACL.
     * @param {Object} options Optional Backbone-like options object to be
     *     passed in to set.
     * @return {Boolean} Whether the set passed validation.
     * @see Parse.Object#set
     */
  }, {
    key: 'setACL',
    value: function setACL(acl, options) {
      return this.set('ACL', acl, options);
    }

    /**
     * Clears all attributes on a model
     * @method clear
     */
  }, {
    key: 'clear',
    value: function clear() {
      var attributes = this.attributes;
      var erasable = {};
      var readonly = ['createdAt', 'updatedAt'];
      if (typeof this.constructor.readOnlyAttributes === 'function') {
        readonly = readonly.concat(this.constructor.readOnlyAttributes());
      }
      for (var attr in attributes) {
        if (readonly.indexOf(attr) < 0) {
          erasable[attr] = true;
        }
      }
      return this.set(erasable, { unset: true });
    }

    /**
     * Fetch the model from the server. If the server's representation of the
     * model differs from its current attributes, they will be overriden.
     *
     * @method fetch
     * @param {Object} options A Backbone-style callback object.
     * Valid options are:<ul>
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     * @return {Parse.Promise} A promise that is fulfilled when the fetch
     *     completes.
     */
  }, {
    key: 'fetch',
    value: function fetch(options) {
      options = options || {};
      var fetchOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        fetchOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        fetchOptions.sessionToken = options.sessionToken;
      }
      var controller = _CoreManager2['default'].getObjectController();
      return controller.fetch(this, true, fetchOptions)._thenRunCallbacks(options);
    }

    /**
     * Set a hash of model attributes, and save the model to the server.
     * updatedAt will be updated when the request returns.
     * You can either call it as:<pre>
     *   object.save();</pre>
     * or<pre>
     *   object.save(null, options);</pre>
     * or<pre>
     *   object.save(attrs, options);</pre>
     * or<pre>
     *   object.save(key, value, options);</pre>
     *
     * For example, <pre>
     *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }, {
     *     success: function(gameTurnAgain) {
     *       // The save was successful.
     *     },
     *     error: function(gameTurnAgain, error) {
     *       // The save failed.  Error is an instance of Parse.Error.
     *     }
     *   });</pre>
     * or with promises:<pre>
     *   gameTurn.save({
     *     player: "Jake Cutter",
     *     diceRoll: 2
     *   }).then(function(gameTurnAgain) {
     *     // The save was successful.
     *   }, function(error) {
     *     // The save failed.  Error is an instance of Parse.Error.
     *   });</pre>
     *
     * @method save
     * @param {Object} options A Backbone-style callback object.
     * Valid options are:<ul>
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     * @return {Parse.Promise} A promise that is fulfilled when the save
     *     completes.
     */
  }, {
    key: 'save',
    value: function save(arg1, arg2, arg3) {
      var _this = this;

      var attrs;
      var options;
      if (typeof arg1 === 'object' || typeof arg1 === 'undefined') {
        attrs = arg1;
        options = arg2;
      } else {
        attrs = {};
        attrs[arg1] = arg2;
        options = arg3;
      }

      // Support save({ success: function() {}, error: function() {} })
      if (!options && attrs) {
        options = {};
        if (typeof attrs.success === 'function') {
          options.success = attrs.success;
          delete attrs.success;
        }
        if (typeof attrs.error === 'function') {
          options.error = attrs.error;
          delete attrs.error;
        }
      }

      if (attrs) {
        var validation = this.validate(attrs);
        if (validation) {
          if (options && typeof options.error === 'function') {
            options.error(this, validation);
          }
          return _ParsePromise2['default'].error(validation);
        }
        this.set(attrs, options);
      }

      options = options || {};
      var saveOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        saveOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        saveOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager2['default'].getObjectController();
      var unsaved = (0, _unsavedChildren2['default'])(this);
      return controller.save(unsaved, saveOptions).then(function () {
        return controller.save(_this, saveOptions);
      })._thenRunCallbacks(options, this);
    }

    /**
     * Destroy this model on the server if it was already persisted.
     * If `wait: true` is passed, waits for the server to respond
     * before removal.
     *
     * @method destroy
     * @param {Object} options A Backbone-style callback object.
     * Valid options are:<ul>
     *   <li>success: A Backbone-style success callback
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     * @return {Parse.Promise} A promise that is fulfilled when the destroy
     *     completes.
     */
  }, {
    key: 'destroy',
    value: function destroy(options) {
      options = options || {};
      var destroyOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        destroyOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        destroyOptions.sessionToken = options.sessionToken;
      }
      if (!this.id) {
        return _ParsePromise2['default'].as()._thenRunCallbacks(options);
      }
      return _CoreManager2['default'].getObjectController().destroy(this, destroyOptions)._thenRunCallbacks(options);
    }

    /** Static methods **/

  }, {
    key: 'attributes',
    get: function get() {
      return _Object$freeze(ObjectState.estimateAttributes(this.className, this._getStateIdentifier()));
    }

    /**
     * The first time this object was saved on the server.
     * @property createdAt
     * @type Date
     */
  }, {
    key: 'createdAt',
    get: function get() {
      return this._getServerData().createdAt;
    }

    /**
     * The last time this object was updated on the server.
     * @property updatedAt
     * @type Date
     */
  }, {
    key: 'updatedAt',
    get: function get() {
      return this._getServerData().updatedAt;
    }
  }], [{
    key: '_clearAllState',
    value: function _clearAllState() {
      ObjectState._clearAllState();
    }

    /**
     * Fetches the given list of Parse.Object.
     * If any error is encountered, stops and calls the error handler.
     *
     * <pre>
     *   Parse.Object.fetchAll([object1, object2, ...], {
     *     success: function(list) {
     *       // All the objects were fetched.
     *     },
     *     error: function(error) {
     *       // An error occurred while fetching one of the objects.
     *     },
     *   });
     * </pre>
     *
     * @method fetchAll
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {Object} options A Backbone-style callback object.
     * @static
     * Valid options are:<ul>
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     * </ul>
     */
  }, {
    key: 'fetchAll',
    value: function fetchAll(list, options) {
      var options = options || {};

      var queryOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        queryOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        queryOptions.sessionToken = options.sessionToken;
      }
      return _CoreManager2['default'].getObjectController().fetch(list, true, queryOptions)._thenRunCallbacks(options);
    }

    /**
     * Fetches the given list of Parse.Object if needed.
     * If any error is encountered, stops and calls the error handler.
     *
     * <pre>
     *   Parse.Object.fetchAllIfNeeded([object1, ...], {
     *     success: function(list) {
     *       // Objects were fetched and updated.
     *     },
     *     error: function(error) {
     *       // An error occurred while fetching one of the objects.
     *     },
     *   });
     * </pre>
     *
     * @method fetchAllIfNeeded
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {Object} options A Backbone-style callback object.
     * @static
     * Valid options are:<ul>
     *   <li>success: A Backbone-style success callback.
     *   <li>error: An Backbone-style error callback.
     * </ul>
     */
  }, {
    key: 'fetchAllIfNeeded',
    value: function fetchAllIfNeeded(list, options) {
      var options = options || {};

      var queryOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        queryOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        queryOptions.sessionToken = options.sessionToken;
      }
      return _CoreManager2['default'].getObjectController().fetch(list, false, queryOptions)._thenRunCallbacks(options);
    }

    /**
     * Destroy the given list of models on the server if it was already persisted.
     *
     * <p>Unlike saveAll, if an error occurs while deleting an individual model,
     * this method will continue trying to delete the rest of the models if
     * possible, except in the case of a fatal error like a connection error.
     *
     * <p>In particular, the Parse.Error object returned in the case of error may
     * be one of two types:
     *
     * <ul>
     *   <li>A Parse.Error.AGGREGATE_ERROR. This object's "errors" property is an
     *       array of other Parse.Error objects. Each error object in this array
     *       has an "object" property that references the object that could not be
     *       deleted (for instance, because that object could not be found).</li>
     *   <li>A non-aggregate Parse.Error. This indicates a serious error that
     *       caused the delete operation to be aborted partway through (for
     *       instance, a connection failure in the middle of the delete).</li>
     * </ul>
     *
     * <pre>
     *   Parse.Object.destroyAll([object1, object2, ...], {
     *     success: function() {
     *       // All the objects were deleted.
     *     },
     *     error: function(error) {
     *       // An error occurred while deleting one or more of the objects.
     *       // If this is an aggregate error, then we can inspect each error
     *       // object individually to determine the reason why a particular
     *       // object was not deleted.
     *       if (error.code === Parse.Error.AGGREGATE_ERROR) {
     *         for (var i = 0; i < error.errors.length; i++) {
     *           console.log("Couldn't delete " + error.errors[i].object.id +
     *             "due to " + error.errors[i].message);
     *         }
     *       } else {
     *         console.log("Delete aborted because of " + error.message);
     *       }
     *     },
     *   });
     * </pre>
     *
     * @method destroyAll
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {Object} options A Backbone-style callback object.
     * @static
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     * @return {Parse.Promise} A promise that is fulfilled when the destroyAll
     *     completes.
     */
  }, {
    key: 'destroyAll',
    value: function destroyAll(list, options) {
      var options = options || {};

      var destroyOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        destroyOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        destroyOptions.sessionToken = options.sessionToken;
      }
      return _CoreManager2['default'].getObjectController().destroy(list, destroyOptions)._thenRunCallbacks(options);
    }

    /**
     * Saves the given list of Parse.Object.
     * If any error is encountered, stops and calls the error handler.
     *
     * <pre>
     *   Parse.Object.saveAll([object1, object2, ...], {
     *     success: function(list) {
     *       // All the objects were saved.
     *     },
     *     error: function(error) {
     *       // An error occurred while saving one of the objects.
     *     },
     *   });
     * </pre>
     *
     * @method saveAll
     * @param {Array} list A list of <code>Parse.Object</code>.
     * @param {Object} options A Backbone-style callback object.
     * @static
     * Valid options are:<ul>
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     */
  }, {
    key: 'saveAll',
    value: function saveAll(list, options) {
      var options = options || {};

      var saveOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        saveOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        saveOptions.sessionToken = options.sessionToken;
      }
      return _CoreManager2['default'].getObjectController().save(list, saveOptions)._thenRunCallbacks(options);
    }

    /**
     * Creates a reference to a subclass of Parse.Object with the given id. This
     * does not exist on Parse.Object, only on subclasses.
     *
     * <p>A shortcut for: <pre>
     *  var Foo = Parse.Object.extend("Foo");
     *  var pointerToFoo = new Foo();
     *  pointerToFoo.id = "myObjectId";
     * </pre>
     *
     * @method createWithoutData
     * @param {String} id The ID of the object to create a reference to.
     * @static
     * @return {Parse.Object} A Parse.Object reference.
     */
  }, {
    key: 'createWithoutData',
    value: function createWithoutData(id) {
      var obj = new this();
      obj.id = id;
      return obj;
    }

    /**
     * Creates a new instance of a Parse Object from a JSON representation.
     * @method fromJSON
     * @param {Object} json The JSON map of the Object's data
     * @static
     * @return {Parse.Object} A Parse.Object reference
     */
  }, {
    key: 'fromJSON',
    value: function fromJSON(json) {
      if (!json.className) {
        throw new Error('Cannot create an object without a className');
      }
      var constructor = classMap[json.className];
      var o = constructor ? new constructor() : new ParseObject(json.className);
      var otherAttributes = {};
      for (var attr in json) {
        if (attr !== 'className' && attr !== '__type') {
          otherAttributes[attr] = json[attr];
        }
      }
      o._finishFetch(otherAttributes);
      if (json.objectId) {
        o._setExisted(true);
      }
      return o;
    }

    /**
     * Registers a subclass of Parse.Object with a specific class name.
     * When objects of that class are retrieved from a query, they will be
     * instantiated with this subclass.
     * This is only necessary when using ES6 subclassing.
     * @method registerSubclass
     * @param {String} className The class name of the subclass
     * @param {Class} constructor The subclass
     */
  }, {
    key: 'registerSubclass',
    value: function registerSubclass(className, constructor) {
      if (typeof className !== 'string') {
        throw new TypeError('The first argument must be a valid class name.');
      }
      if (typeof constructor === 'undefined') {
        throw new TypeError('You must supply a subclass constructor.');
      }
      if (typeof constructor !== 'function') {
        throw new TypeError('You must register the subclass constructor. ' + 'Did you attempt to register an instance of the subclass?');
      }
      classMap[className] = constructor;
      if (!constructor.className) {
        constructor.className = className;
      }
    }

    /**
     * Creates a new subclass of Parse.Object for the given Parse class name.
     *
     * <p>Every extension of a Parse class will inherit from the most recent
     * previous extension of that class. When a Parse.Object is automatically
     * created by parsing JSON, it will use the most recent extension of that
     * class.</p>
     *
     * <p>You should call either:<pre>
     *     var MyClass = Parse.Object.extend("MyClass", {
     *         <i>Instance methods</i>,
     *         initialize: function(attrs, options) {
     *             this.someInstanceProperty = [],
     *             <i>Other instance properties</i>
     *         }
     *     }, {
     *         <i>Class properties</i>
     *     });</pre>
     * or, for Backbone compatibility:<pre>
     *     var MyClass = Parse.Object.extend({
     *         className: "MyClass",
     *         <i>Instance methods</i>,
     *         initialize: function(attrs, options) {
     *             this.someInstanceProperty = [],
     *             <i>Other instance properties</i>
     *         }
     *     }, {
     *         <i>Class properties</i>
     *     });</pre></p>
     *
     * @method extend
     * @param {String} className The name of the Parse class backing this model.
     * @param {Object} protoProps Instance properties to add to instances of the
     *     class returned from this method.
     * @param {Object} classProps Class properties to add the class returned from
     *     this method.
     * @return {Class} A new subclass of Parse.Object.
     */
  }, {
    key: 'extend',
    value: function extend(className, protoProps, classProps) {
      if (typeof className !== 'string') {
        if (className && typeof className.className === 'string') {
          return ParseObject.extend(className.className, className, protoProps);
        } else {
          throw new Error('Parse.Object.extend\'s first argument should be the className.');
        }
      }
      var adjustedClassName = className;

      if (adjustedClassName === 'User' && _CoreManager2['default'].get('PERFORM_USER_REWRITE')) {
        adjustedClassName = '_User';
      }

      var parentProto = ParseObject.prototype;
      if (this.hasOwnProperty('__super__') && this.__super__) {
        parentProto = this.prototype;
      } else if (classMap[adjustedClassName]) {
        parentProto = classMap[adjustedClassName].prototype;
      }
      var ParseObjectSubclass = function ParseObjectSubclass(attributes, options) {
        // Enable legacy initializers
        if (typeof this.initialize === 'function') {
          this.initialize.apply(this, arguments);
        }

        this.className = adjustedClassName;
        this._objCount = objectCount++;
        if (attributes && typeof attributes === 'object') {
          if (!this.set(attributes || {}, options)) {
            throw new Error('Can\'t create an invalid Parse Object');
          }
        }
      };
      ParseObjectSubclass.className = adjustedClassName;
      ParseObjectSubclass.__super__ = parentProto;

      ParseObjectSubclass.prototype = _Object$create(parentProto, {
        constructor: {
          value: ParseObjectSubclass,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });

      if (protoProps) {
        for (var prop in protoProps) {
          if (prop !== 'className') {
            _Object$defineProperty(ParseObjectSubclass.prototype, prop, {
              value: protoProps[prop],
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
        }
      }

      if (classProps) {
        for (var prop in classProps) {
          if (prop !== 'className') {
            _Object$defineProperty(ParseObjectSubclass, prop, {
              value: classProps[prop],
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
        }
      }

      ParseObjectSubclass.extend = function (name, protoProps, classProps) {
        if (typeof name === 'string') {
          return ParseObject.extend.call(ParseObjectSubclass, name, protoProps, classProps);
        }
        return ParseObject.extend.call(ParseObjectSubclass, adjustedClassName, name, protoProps);
      };
      ParseObjectSubclass.createWithoutData = ParseObject.createWithoutData;

      classMap[adjustedClassName] = ParseObjectSubclass;
      return ParseObjectSubclass;
    }

    /**
     * Enable single instance objects, where any local objects with the same Id
     * share the same attributes, and stay synchronized with each other.
     * This is disabled by default in server environments, since it can lead to
     * security issues.
     * @method enableSingleInstance
     */
  }, {
    key: 'enableSingleInstance',
    value: function enableSingleInstance() {
      singleInstance = true;
    }

    /**
     * Disable single instance objects, where any local objects with the same Id
     * share the same attributes, and stay synchronized with each other.
     * When disabled, you can have two instances of the same object in memory
     * without them sharing attributes.
     * @method disableSingleInstance
     */
  }, {
    key: 'disableSingleInstance',
    value: function disableSingleInstance() {
      singleInstance = false;
    }
  }]);

  return ParseObject;
})();

exports['default'] = ParseObject;

_CoreManager2['default'].setObjectController({
  fetch: function fetch(target, forceFetch, options) {
    if (Array.isArray(target)) {
      if (target.length < 1) {
        return _ParsePromise2['default'].as([]);
      }
      var objs = [];
      var ids = [];
      var className = null;
      var results = [];
      var error = null;
      target.forEach(function (el, i) {
        if (error) {
          return;
        }
        if (!className) {
          className = el.className;
        }
        if (className !== el.className) {
          error = new _ParseError2['default'](_ParseError2['default'].INVALID_CLASS_NAME, 'All objects should be of the same class');
        }
        if (!el.id) {
          error = new _ParseError2['default'](_ParseError2['default'].MISSING_OBJECT_ID, 'All objects must have an ID');
        }
        if (forceFetch || _Object$keys(el._getServerData()).length === 0) {
          ids.push(el.id);
          objs.push(el);
        }
        results.push(el);
      });
      if (error) {
        return _ParsePromise2['default'].error(error);
      }
      var query = new _ParseQuery2['default'](className);
      query.containedIn('objectId', ids);
      query._limit = ids.length;
      return query.find(options).then(function (objects) {
        var idMap = {};
        objects.forEach(function (o) {
          idMap[o.id] = o;
        });
        for (var i = 0; i < objs.length; i++) {
          var obj = objs[i];
          if (!obj || !obj.id || !idMap[obj.id]) {
            if (forceFetch) {
              return _ParsePromise2['default'].error(new _ParseError2['default'](_ParseError2['default'].OBJECT_NOT_FOUND, 'All objects must exist on the server.'));
            }
          }
        }
        if (!singleInstance) {
          // If single instance objects are disabled, we need to replace the
          for (var i = 0; i < results.length; i++) {
            var obj = results[i];
            if (obj && obj.id && idMap[obj.id]) {
              var id = obj.id;
              obj._finishFetch(idMap[id].toJSON());
              results[i] = idMap[id];
            }
          }
        }
        return _ParsePromise2['default'].as(results);
      });
    } else {
      var RESTController = _CoreManager2['default'].getRESTController();
      return RESTController.request('GET', 'classes/' + target.className + '/' + target._getId(), {}, options).then(function (response, status, xhr) {
        if (target instanceof ParseObject) {
          target._clearPendingOps();
          target._finishFetch(response);
        }
        return target;
      });
    }
  },

  destroy: function destroy(target, options) {
    var RESTController = _CoreManager2['default'].getRESTController();
    if (Array.isArray(target)) {
      if (target.length < 1) {
        return _ParsePromise2['default'].as([]);
      }
      var batches = [[]];
      target.forEach(function (obj) {
        if (!obj.id) {
          return;
        }
        batches[batches.length - 1].push(obj);
        if (batches[batches.length - 1].length >= 20) {
          batches.push([]);
        }
      });
      if (batches[batches.length - 1].length === 0) {
        // If the last batch is empty, remove it
        batches.pop();
      }
      var deleteCompleted = _ParsePromise2['default'].as();
      var errors = [];
      batches.forEach(function (batch) {
        deleteCompleted = deleteCompleted.then(function () {
          return RESTController.request('POST', 'batch', {
            requests: batch.map(function (obj) {
              return {
                method: 'DELETE',
                path: getServerUrlPath() + 'classes/' + obj.className + '/' + obj._getId(),
                body: {}
              };
            })
          }, options).then(function (results) {
            for (var i = 0; i < results.length; i++) {
              if (results[i] && results[i].hasOwnProperty('error')) {
                var err = new _ParseError2['default'](results[i].error.code, results[i].error.error);
                err.object = batch[i];
                errors.push(err);
              }
            }
          });
        });
      });
      return deleteCompleted.then(function () {
        if (errors.length) {
          var aggregate = new _ParseError2['default'](_ParseError2['default'].AGGREGATE_ERROR);
          aggregate.errors = errors;
          return _ParsePromise2['default'].error(aggregate);
        }
        return _ParsePromise2['default'].as(target);
      });
    } else if (target instanceof ParseObject) {
      return RESTController.request('DELETE', 'classes/' + target.className + '/' + target._getId(), {}, options).then(function () {
        return _ParsePromise2['default'].as(target);
      });
    }
    return _ParsePromise2['default'].as(target);
  },

  save: function save(target, options) {
    var RESTController = _CoreManager2['default'].getRESTController();
    if (Array.isArray(target)) {
      if (target.length < 1) {
        return _ParsePromise2['default'].as([]);
      }

      var unsaved = target.concat();
      for (var i = 0; i < target.length; i++) {
        if (target[i] instanceof ParseObject) {
          unsaved = unsaved.concat((0, _unsavedChildren2['default'])(target[i], true));
        }
      }
      unsaved = (0, _unique2['default'])(unsaved);

      var filesSaved = _ParsePromise2['default'].as();
      var pending = [];
      unsaved.forEach(function (el) {
        if (el instanceof _ParseFile2['default']) {
          filesSaved = filesSaved.then(function () {
            return el.save();
          });
        } else if (el instanceof ParseObject) {
          pending.push(el);
        }
      });

      return filesSaved.then(function () {
        var objectError = null;
        return _ParsePromise2['default']._continueWhile(function () {
          return pending.length > 0;
        }, function () {
          var batch = [];
          var nextPending = [];
          pending.forEach(function (el) {
            if (batch.length < 20 && (0, _canBeSerialized2['default'])(el)) {
              batch.push(el);
            } else {
              nextPending.push(el);
            }
          });
          pending = nextPending;
          if (batch.length < 1) {
            return _ParsePromise2['default'].error(new _ParseError2['default'](_ParseError2['default'].OTHER_CAUSE, 'Tried to save a batch with a cycle.'));
          }

          // Queue up tasks for each object in the batch.
          // When every task is ready, the API request will execute
          var batchReturned = new _ParsePromise2['default']();
          var batchReady = [];
          var batchTasks = [];
          batch.forEach(function (obj, index) {
            var ready = new _ParsePromise2['default']();
            batchReady.push(ready);
            var task = function task() {
              ready.resolve();
              return batchReturned.then(function (responses, status) {
                if (responses[index].hasOwnProperty('success')) {
                  obj._handleSaveResponse(responses[index].success, status);
                } else {
                  if (!objectError && responses[index].hasOwnProperty('error')) {
                    var serverError = responses[index].error;
                    objectError = new _ParseError2['default'](serverError.code, serverError.error);
                    // Cancel the rest of the save
                    pending = [];
                  }
                  obj._handleSaveError();
                }
              });
            };
            ObjectState.pushPendingState(obj.className, obj._getStateIdentifier());
            batchTasks.push(ObjectState.enqueueTask(obj.className, obj._getStateIdentifier(), task));
          });

          _ParsePromise2['default'].when(batchReady).then(function () {
            // Kick off the batch request
            return RESTController.request('POST', 'batch', {
              requests: batch.map(function (obj) {
                var params = obj._getSaveParams();
                params.path = getServerUrlPath() + params.path;
                return params;
              })
            }, options);
          }).then(function (response, status, xhr) {
            batchReturned.resolve(response, status);
          });

          return _ParsePromise2['default'].when(batchTasks);
        }).then(function () {
          if (objectError) {
            return _ParsePromise2['default'].error(objectError);
          }
          return _ParsePromise2['default'].as(target);
        });
      });
    } else if (target instanceof ParseObject) {
      // copying target lets Flow guarantee the pointer isn't modified elsewhere
      var targetCopy = target;
      var task = function task() {
        var params = targetCopy._getSaveParams();
        return RESTController.request(params.method, params.path, params.body, options).then(function (response, status) {
          targetCopy._handleSaveResponse(response, status);
        }, function (error) {
          targetCopy._handleSaveError();
          return _ParsePromise2['default'].error(error);
        });
      };
      ObjectState.pushPendingState(target.className, target._getStateIdentifier());
      return ObjectState.enqueueTask(target.className, target._getStateIdentifier(), task).then(function () {
        return target;
      }, function (error) {
        return error;
      });
    }
    return _ParsePromise2['default'].as();
  }
});
module.exports = exports['default'];

/**
 * The ID of this object, unique within its class.
 * @property id
 * @type String
 */
},{"./CoreManager":3,"./ObjectState":6,"./ParseACL":8,"./ParseError":10,"./ParseFile":11,"./ParseOp":15,"./ParsePromise":16,"./ParseQuery":17,"./ParseRelation":18,"./canBeSerialized":28,"./decode":29,"./encode":30,"./equals":31,"./escape":32,"./parseDate":34,"./unique":35,"./unsavedChildren":36,"babel-runtime/core-js/object/create":37,"babel-runtime/core-js/object/define-property":38,"babel-runtime/core-js/object/freeze":39,"babel-runtime/core-js/object/keys":41,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/interop-require-default":47,"babel-runtime/helpers/interop-require-wildcard":48}],15:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _get = _dereq_('babel-runtime/helpers/get')['default'];

var _inherits = _dereq_('babel-runtime/helpers/inherits')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.opFromJSON = opFromJSON;

var _arrayContainsObject = _dereq_('./arrayContainsObject');

var _arrayContainsObject2 = _interopRequireDefault(_arrayContainsObject);

var _decode = _dereq_('./decode');

var _decode2 = _interopRequireDefault(_decode);

var _encode = _dereq_('./encode');

var _encode2 = _interopRequireDefault(_encode);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

var _ParseRelation = _dereq_('./ParseRelation');

var _ParseRelation2 = _interopRequireDefault(_ParseRelation);

var _unique = _dereq_('./unique');

var _unique2 = _interopRequireDefault(_unique);

function opFromJSON(json) {
  if (!json || !json.__op) {
    return null;
  }
  switch (json.__op) {
    case 'Delete':
      return new UnsetOp();
    case 'Increment':
      return new IncrementOp(json.amount);
    case 'Add':
      return new AddOp((0, _decode2['default'])(json.objects));
    case 'AddUnique':
      return new AddUniqueOp((0, _decode2['default'])(json.objects));
    case 'Remove':
      return new RemoveOp((0, _decode2['default'])(json.objects));
    case 'AddRelation':
      var toAdd = (0, _decode2['default'])(json.objects);
      if (!Array.isArray(toAdd)) {
        return new RelationOp([], []);
      }
      return new RelationOp(toAdd, []);
    case 'RemoveRelation':
      var toRemove = (0, _decode2['default'])(json.objects);
      if (!Array.isArray(toRemove)) {
        return new RelationOp([], []);
      }
      return new RelationOp([], toRemove);
    case 'Batch':
      var toAdd = [];
      var toRemove = [];
      for (var i = 0; i < json.ops.length; i++) {
        if (json.ops[i].__op === 'AddRelation') {
          toAdd = toAdd.concat((0, _decode2['default'])(json.ops[i].objects));
        } else if (json.ops[i].__op === 'RemoveRelation') {
          toRemove = toRemove.concat((0, _decode2['default'])(json.ops[i].objects));
        }
      }
      return new RelationOp(toAdd, toRemove);
  }
  return null;
}

var Op = (function () {
  function Op() {
    _classCallCheck(this, Op);
  }

  _createClass(Op, [{
    key: 'applyTo',

    // Empty parent class
    value: function applyTo(value) {}
  }, {
    key: 'mergeWith',
    value: function mergeWith(previous) {}
  }, {
    key: 'toJSON',
    value: function toJSON() {}
  }]);

  return Op;
})();

exports.Op = Op;

var SetOp = (function (_Op) {
  _inherits(SetOp, _Op);

  function SetOp(value) {
    _classCallCheck(this, SetOp);

    _get(Object.getPrototypeOf(SetOp.prototype), 'constructor', this).call(this);
    this._value = value;
  }

  _createClass(SetOp, [{
    key: 'applyTo',
    value: function applyTo(value) {
      return this._value;
    }
  }, {
    key: 'mergeWith',
    value: function mergeWith(previous) {
      return new SetOp(this._value);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return (0, _encode2['default'])(this._value, false, true);
    }
  }]);

  return SetOp;
})(Op);

exports.SetOp = SetOp;

var UnsetOp = (function (_Op2) {
  _inherits(UnsetOp, _Op2);

  function UnsetOp() {
    _classCallCheck(this, UnsetOp);

    _get(Object.getPrototypeOf(UnsetOp.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(UnsetOp, [{
    key: 'applyTo',
    value: function applyTo(value) {
      return undefined;
    }
  }, {
    key: 'mergeWith',
    value: function mergeWith(previous) {
      return new UnsetOp();
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return { __op: 'Delete' };
    }
  }]);

  return UnsetOp;
})(Op);

exports.UnsetOp = UnsetOp;

var IncrementOp = (function (_Op3) {
  _inherits(IncrementOp, _Op3);

  function IncrementOp(amount) {
    _classCallCheck(this, IncrementOp);

    _get(Object.getPrototypeOf(IncrementOp.prototype), 'constructor', this).call(this);
    if (typeof amount !== 'number') {
      throw new TypeError('Increment Op must be initialized with a numeric amount.');
    }
    this._amount = amount;
  }

  _createClass(IncrementOp, [{
    key: 'applyTo',
    value: function applyTo(value) {
      if (typeof value === 'undefined') {
        return this._amount;
      }
      if (typeof value !== 'number') {
        throw new TypeError('Cannot increment a non-numeric value.');
      }
      return this._amount + value;
    }
  }, {
    key: 'mergeWith',
    value: function mergeWith(previous) {
      if (!previous) {
        return this;
      }
      if (previous instanceof SetOp) {
        return new SetOp(this.applyTo(previous._value));
      }
      if (previous instanceof UnsetOp) {
        return new SetOp(this._amount);
      }
      if (previous instanceof IncrementOp) {
        return new IncrementOp(this.applyTo(previous._amount));
      }
      throw new Error('Cannot merge Increment Op with the previous Op');
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return { __op: 'Increment', amount: this._amount };
    }
  }]);

  return IncrementOp;
})(Op);

exports.IncrementOp = IncrementOp;

var AddOp = (function (_Op4) {
  _inherits(AddOp, _Op4);

  function AddOp(value) {
    _classCallCheck(this, AddOp);

    _get(Object.getPrototypeOf(AddOp.prototype), 'constructor', this).call(this);
    this._value = Array.isArray(value) ? value : [value];
  }

  _createClass(AddOp, [{
    key: 'applyTo',
    value: function applyTo(value) {
      if (value == null) {
        return this._value;
      }
      if (Array.isArray(value)) {
        return value.concat(this._value);
      }
      throw new Error('Cannot add elements to a non-array value');
    }
  }, {
    key: 'mergeWith',
    value: function mergeWith(previous) {
      if (!previous) {
        return this;
      }
      if (previous instanceof SetOp) {
        return new SetOp(this.applyTo(previous._value));
      }
      if (previous instanceof UnsetOp) {
        return new SetOp(this._value);
      }
      if (previous instanceof AddOp) {
        return new AddOp(this.applyTo(previous._value));
      }
      throw new Error('Cannot merge Add Op with the previous Op');
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return { __op: 'Add', objects: (0, _encode2['default'])(this._value, false, true) };
    }
  }]);

  return AddOp;
})(Op);

exports.AddOp = AddOp;

var AddUniqueOp = (function (_Op5) {
  _inherits(AddUniqueOp, _Op5);

  function AddUniqueOp(value) {
    _classCallCheck(this, AddUniqueOp);

    _get(Object.getPrototypeOf(AddUniqueOp.prototype), 'constructor', this).call(this);
    this._value = (0, _unique2['default'])(Array.isArray(value) ? value : [value]);
  }

  _createClass(AddUniqueOp, [{
    key: 'applyTo',
    value: function applyTo(value) {
      if (value == null) {
        return this._value || [];
      }
      if (Array.isArray(value)) {
        // copying value lets Flow guarantee the pointer isn't modified elsewhere
        var valueCopy = value;
        var toAdd = [];
        this._value.forEach(function (v) {
          if (v instanceof _ParseObject2['default']) {
            if (!(0, _arrayContainsObject2['default'])(valueCopy, v)) {
              toAdd.push(v);
            }
          } else {
            if (valueCopy.indexOf(v) < 0) {
              toAdd.push(v);
            }
          }
        });
        return value.concat(toAdd);
      }
      throw new Error('Cannot add elements to a non-array value');
    }
  }, {
    key: 'mergeWith',
    value: function mergeWith(previous) {
      if (!previous) {
        return this;
      }
      if (previous instanceof SetOp) {
        return new SetOp(this.applyTo(previous._value));
      }
      if (previous instanceof UnsetOp) {
        return new SetOp(this._value);
      }
      if (previous instanceof AddUniqueOp) {
        return new AddUniqueOp(this.applyTo(previous._value));
      }
      throw new Error('Cannot merge AddUnique Op with the previous Op');
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return { __op: 'AddUnique', objects: (0, _encode2['default'])(this._value, false, true) };
    }
  }]);

  return AddUniqueOp;
})(Op);

exports.AddUniqueOp = AddUniqueOp;

var RemoveOp = (function (_Op6) {
  _inherits(RemoveOp, _Op6);

  function RemoveOp(value) {
    _classCallCheck(this, RemoveOp);

    _get(Object.getPrototypeOf(RemoveOp.prototype), 'constructor', this).call(this);
    this._value = (0, _unique2['default'])(Array.isArray(value) ? value : [value]);
  }

  _createClass(RemoveOp, [{
    key: 'applyTo',
    value: function applyTo(value) {
      if (value == null) {
        return [];
      }
      if (Array.isArray(value)) {
        var i = value.indexOf(this._value);
        var removed = value.concat([]);
        for (var i = 0; i < this._value.length; i++) {
          var index = removed.indexOf(this._value[i]);
          while (index > -1) {
            removed.splice(index, 1);
            index = removed.indexOf(this._value[i]);
          }
          if (this._value[i] instanceof _ParseObject2['default'] && this._value[i].id) {
            for (var j = 0; j < removed.length; j++) {
              if (removed[j] instanceof _ParseObject2['default'] && this._value[i].id === removed[j].id) {
                removed.splice(j, 1);
                j--;
              }
            }
          }
        }
        return removed;
      }
      throw new Error('Cannot remove elements from a non-array value');
    }
  }, {
    key: 'mergeWith',
    value: function mergeWith(previous) {
      if (!previous) {
        return this;
      }
      if (previous instanceof SetOp) {
        return new SetOp(this.applyTo(previous._value));
      }
      if (previous instanceof UnsetOp) {
        return new UnsetOp();
      }
      if (previous instanceof RemoveOp) {
        var uniques = previous._value.concat([]);
        for (var i = 0; i < this._value.length; i++) {
          if (this._value[i] instanceof _ParseObject2['default']) {
            if (!(0, _arrayContainsObject2['default'])(uniques, this._value[i])) {
              uniques.push(this._value[i]);
            }
          } else {
            if (uniques.indexOf(this._value[i]) < 0) {
              uniques.push(this._value[i]);
            }
          }
        }
        return new RemoveOp(uniques);
      }
      throw new Error('Cannot merge Remove Op with the previous Op');
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return { __op: 'Remove', objects: (0, _encode2['default'])(this._value, false, true) };
    }
  }]);

  return RemoveOp;
})(Op);

exports.RemoveOp = RemoveOp;

var RelationOp = (function (_Op7) {
  _inherits(RelationOp, _Op7);

  function RelationOp(adds, removes) {
    _classCallCheck(this, RelationOp);

    _get(Object.getPrototypeOf(RelationOp.prototype), 'constructor', this).call(this);
    this._targetClassName = null;

    if (Array.isArray(adds)) {
      this.relationsToAdd = (0, _unique2['default'])(adds.map(this._extractId, this));
    }

    if (Array.isArray(removes)) {
      this.relationsToRemove = (0, _unique2['default'])(removes.map(this._extractId, this));
    }
  }

  _createClass(RelationOp, [{
    key: '_extractId',
    value: function _extractId(obj) {
      if (typeof obj === 'string') {
        return obj;
      }
      if (!obj.id) {
        throw new Error('You cannot add or remove an unsaved Parse Object from a relation');
      }
      if (!this._targetClassName) {
        this._targetClassName = obj.className;
      }
      if (this._targetClassName !== obj.className) {
        throw new Error('Tried to create a Relation with 2 different object types: ' + this._targetClassName + ' and ' + obj.className + '.');
      }
      return obj.id;
    }
  }, {
    key: 'applyTo',
    value: function applyTo(value, object, key) {
      if (!value) {
        var parent = new _ParseObject2['default'](object.className);
        if (object.id && object.id.indexOf('local') === 0) {
          parent._localId = object.id;
        } else if (object.id) {
          parent.id = object.id;
        }
        var relation = new _ParseRelation2['default'](parent, key);
        relation.targetClassName = this._targetClassName;
        return relation;
      }
      if (value instanceof _ParseRelation2['default']) {
        if (this._targetClassName) {
          if (value.targetClassName) {
            if (this._targetClassName !== value.targetClassName) {
              throw new Error('Related object must be a ' + value.targetClassName + ', but a ' + this._targetClassName + ' was passed in.');
            }
          } else {
            value.targetClassName = this._targetClassName;
          }
        }
        return value;
      } else {
        throw new Error('Relation cannot be applied to a non-relation field');
      }
    }
  }, {
    key: 'mergeWith',
    value: function mergeWith(previous) {
      if (!previous) {
        return this;
      } else if (previous instanceof UnsetOp) {
        throw new Error('You cannot modify a relation after deleting it.');
      } else if (previous instanceof RelationOp) {
        if (previous._targetClassName && previous._targetClassName !== this._targetClassName) {
          throw new Error('Related object must be of class ' + previous._targetClassName + ', but ' + (this._targetClassName || 'null') + ' was passed in.');
        }
        var newAdd = previous.relationsToAdd.concat([]);
        this.relationsToRemove.forEach(function (r) {
          var index = newAdd.indexOf(r);
          if (index > -1) {
            newAdd.splice(index, 1);
          }
        });
        this.relationsToAdd.forEach(function (r) {
          var index = newAdd.indexOf(r);
          if (index < 0) {
            newAdd.push(r);
          }
        });

        var newRemove = previous.relationsToRemove.concat([]);
        this.relationsToAdd.forEach(function (r) {
          var index = newRemove.indexOf(r);
          if (index > -1) {
            newRemove.splice(index, 1);
          }
        });
        this.relationsToRemove.forEach(function (r) {
          var index = newRemove.indexOf(r);
          if (index < 0) {
            newRemove.push(r);
          }
        });

        var newRelation = new RelationOp(newAdd, newRemove);
        newRelation._targetClassName = this._targetClassName;
        return newRelation;
      }
      throw new Error('Cannot merge Relation Op with the previous Op');
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var _this = this;

      var idToPointer = function idToPointer(id) {
        return {
          __type: 'Pointer',
          className: _this._targetClassName,
          objectId: id
        };
      };

      var adds = null;
      var removes = null;
      var pointers = null;

      if (this.relationsToAdd.length > 0) {
        pointers = this.relationsToAdd.map(idToPointer);
        adds = { __op: 'AddRelation', objects: pointers };
      }
      if (this.relationsToRemove.length > 0) {
        pointers = this.relationsToRemove.map(idToPointer);
        removes = { __op: 'RemoveRelation', objects: pointers };
      }

      if (adds && removes) {
        return { __op: 'Batch', ops: [adds, removes] };
      }

      return adds || removes || {};
    }
  }]);

  return RelationOp;
})(Op);

exports.RelationOp = RelationOp;
},{"./ParseObject":14,"./ParseRelation":18,"./arrayContainsObject":27,"./decode":29,"./encode":30,"./unique":35,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/get":45,"babel-runtime/helpers/inherits":46,"babel-runtime/helpers/interop-require-default":47}],16:[function(_dereq_,module,exports){
(function (process){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _isPromisesAPlusCompliant = false;

/**
 * A Promise is returned by async methods as a hook to provide callbacks to be
 * called when the async task is fulfilled.
 *
 * <p>Typical usage would be like:<pre>
 *    query.find().then(function(results) {
 *      results[0].set("foo", "bar");
 *      return results[0].saveAsync();
 *    }).then(function(result) {
 *      console.log("Updated " + result.id);
 *    });
 * </pre></p>
 *
 * @class Parse.Promise
 * @constructor
 */

var ParsePromise = (function () {
  function ParsePromise() {
    _classCallCheck(this, ParsePromise);

    this._resolved = false;
    this._rejected = false;
    this._resolvedCallbacks = [];
    this._rejectedCallbacks = [];
  }

  /**
   * Marks this promise as fulfilled, firing any callbacks waiting on it.
   * @method resolve
   * @param {Object} result the result to pass to the callbacks.
   */

  _createClass(ParsePromise, [{
    key: 'resolve',
    value: function resolve() {
      if (this._resolved || this._rejected) {
        throw new Error('A promise was resolved even though it had already been ' + (this._resolved ? 'resolved' : 'rejected') + '.');
      }
      this._resolved = true;

      for (var _len = arguments.length, results = Array(_len), _key = 0; _key < _len; _key++) {
        results[_key] = arguments[_key];
      }

      this._result = results;
      for (var i = 0; i < this._resolvedCallbacks.length; i++) {
        this._resolvedCallbacks[i].apply(this, results);
      }

      this._resolvedCallbacks = [];
      this._rejectedCallbacks = [];
    }

    /**
     * Marks this promise as fulfilled, firing any callbacks waiting on it.
     * @method reject
     * @param {Object} error the error to pass to the callbacks.
     */
  }, {
    key: 'reject',
    value: function reject(error) {
      if (this._resolved || this._rejected) {
        throw new Error('A promise was resolved even though it had already been ' + (this._resolved ? 'resolved' : 'rejected') + '.');
      }
      this._rejected = true;
      this._error = error;
      for (var i = 0; i < this._rejectedCallbacks.length; i++) {
        this._rejectedCallbacks[i](error);
      }
      this._resolvedCallbacks = [];
      this._rejectedCallbacks = [];
    }

    /**
     * Adds callbacks to be called when this promise is fulfilled. Returns a new
     * Promise that will be fulfilled when the callback is complete. It allows
     * chaining. If the callback itself returns a Promise, then the one returned
     * by "then" will not be fulfilled until that one returned by the callback
     * is fulfilled.
     * @method then
     * @param {Function} resolvedCallback Function that is called when this
     * Promise is resolved. Once the callback is complete, then the Promise
     * returned by "then" will also be fulfilled.
     * @param {Function} rejectedCallback Function that is called when this
     * Promise is rejected with an error. Once the callback is complete, then
     * the promise returned by "then" with be resolved successfully. If
     * rejectedCallback is null, or it returns a rejected Promise, then the
     * Promise returned by "then" will be rejected with that error.
     * @return {Parse.Promise} A new Promise that will be fulfilled after this
     * Promise is fulfilled and either callback has completed. If the callback
     * returned a Promise, then this Promise will not be fulfilled until that
     * one is.
     */
  }, {
    key: 'then',
    value: function then(resolvedCallback, rejectedCallback) {
      var _this = this;

      var promise = new ParsePromise();

      var wrappedResolvedCallback = function wrappedResolvedCallback() {
        for (var _len2 = arguments.length, results = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          results[_key2] = arguments[_key2];
        }

        if (typeof resolvedCallback === 'function') {
          if (_isPromisesAPlusCompliant) {
            try {
              results = [resolvedCallback.apply(this, results)];
            } catch (e) {
              results = [ParsePromise.error(e)];
            }
          } else {
            results = [resolvedCallback.apply(this, results)];
          }
        }
        if (results.length === 1 && ParsePromise.is(results[0])) {
          results[0].then(function () {
            promise.resolve.apply(promise, arguments);
          }, function (error) {
            promise.reject(error);
          });
        } else {
          promise.resolve.apply(promise, results);
        }
      };

      var wrappedRejectedCallback = function wrappedRejectedCallback(error) {
        var result = [];
        if (typeof rejectedCallback === 'function') {
          if (_isPromisesAPlusCompliant) {
            try {
              result = [rejectedCallback(error)];
            } catch (e) {
              result = [ParsePromise.error(e)];
            }
          } else {
            result = [rejectedCallback(error)];
          }
          if (result.length === 1 && ParsePromise.is(result[0])) {
            result[0].then(function () {
              promise.resolve.apply(promise, arguments);
            }, function (error) {
              promise.reject(error);
            });
          } else {
            if (_isPromisesAPlusCompliant) {
              promise.resolve.apply(promise, result);
            } else {
              promise.reject(result[0]);
            }
          }
        } else {
          promise.reject(error);
        }
      };

      var runLater = function runLater(fn) {
        fn.call();
      };
      if (_isPromisesAPlusCompliant) {
        if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
          runLater = function (fn) {
            process.nextTick(fn);
          };
        } else if (typeof setTimeout === 'function') {
          runLater = function (fn) {
            setTimeout(fn, 0);
          };
        }
      }

      if (this._resolved) {
        runLater(function () {
          wrappedResolvedCallback.apply(_this, _this._result);
        });
      } else if (this._rejected) {
        runLater(function () {
          wrappedRejectedCallback(_this._error);
        });
      } else {
        this._resolvedCallbacks.push(wrappedResolvedCallback);
        this._rejectedCallbacks.push(wrappedRejectedCallback);
      }

      return promise;
    }

    /**
     * Add handlers to be called when the promise
     * is either resolved or rejected
     * @method always
     */
  }, {
    key: 'always',
    value: function always(callback) {
      return this.then(callback, callback);
    }

    /**
     * Add handlers to be called when the Promise object is resolved
     * @method done
     */
  }, {
    key: 'done',
    value: function done(callback) {
      return this.then(callback);
    }

    /**
     * Add handlers to be called when the Promise object is rejected
     * @method fail
     */
  }, {
    key: 'fail',
    value: function fail(callback) {
      return this.then(null, callback);
    }

    /**
     * Run the given callbacks after this promise is fulfilled.
     * @method _thenRunCallbacks
     * @param optionsOrCallback {} A Backbone-style options callback, or a
     * callback function. If this is an options object and contains a "model"
     * attributes, that will be passed to error callbacks as the first argument.
     * @param model {} If truthy, this will be passed as the first result of
     * error callbacks. This is for Backbone-compatability.
     * @return {Parse.Promise} A promise that will be resolved after the
     * callbacks are run, with the same result as this.
     */
  }, {
    key: '_thenRunCallbacks',
    value: function _thenRunCallbacks(optionsOrCallback, model) {
      var options = {};
      if (typeof optionsOrCallback === 'function') {
        options.success = function (result) {
          optionsOrCallback(result, null);
        };
        options.error = function (error) {
          optionsOrCallback(null, error);
        };
      } else if (typeof optionsOrCallback === 'object') {
        if (typeof optionsOrCallback.success === 'function') {
          options.success = optionsOrCallback.success;
        }
        if (typeof optionsOrCallback.error === 'function') {
          options.error = optionsOrCallback.error;
        }
      }

      return this.then(function () {
        for (var _len3 = arguments.length, results = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          results[_key3] = arguments[_key3];
        }

        if (options.success) {
          options.success.apply(this, results);
        }
        return ParsePromise.as.apply(ParsePromise, arguments);
      }, function (error) {
        if (options.error) {
          if (typeof model !== 'undefined') {
            options.error(model, error);
          } else {
            options.error(error);
          }
        }
        // By explicitly returning a rejected Promise, this will work with
        // either jQuery or Promises/A+ semantics.
        return ParsePromise.error(error);
      });
    }

    /**
     * Adds a callback function that should be called regardless of whether
     * this promise failed or succeeded. The callback will be given either the
     * array of results for its first argument, or the error as its second,
     * depending on whether this Promise was rejected or resolved. Returns a
     * new Promise, like "then" would.
     * @method _continueWith
     * @param {Function} continuation the callback.
     */
  }, {
    key: '_continueWith',
    value: function _continueWith(continuation) {
      return this.then(function () {
        return continuation(arguments, null);
      }, function (error) {
        return continuation(null, error);
      });
    }

    /**
     * Returns true iff the given object fulfils the Promise interface.
     * @method is
     * @param {Object} promise The object to test
     * @static
     * @return {Boolean}
     */
  }], [{
    key: 'is',
    value: function is(promise) {
      return promise != null && typeof promise.then === 'function';
    }

    /**
     * Returns a new promise that is resolved with a given value.
     * @method as
     * @param value The value to resolve the promise with
     * @static
     * @return {Parse.Promise} the new promise.
     */
  }, {
    key: 'as',
    value: function as() {
      var promise = new ParsePromise();

      for (var _len4 = arguments.length, values = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        values[_key4] = arguments[_key4];
      }

      promise.resolve.apply(promise, values);
      return promise;
    }

    /**
     * Returns a new promise that is rejected with a given error.
     * @method error
     * @param error The error to reject the promise with
     * @static
     * @return {Parse.Promise} the new promise.
     */
  }, {
    key: 'error',
    value: function error() {
      var promise = new ParsePromise();

      for (var _len5 = arguments.length, errors = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        errors[_key5] = arguments[_key5];
      }

      promise.reject.apply(promise, errors);
      return promise;
    }

    /**
     * Returns a new promise that is fulfilled when all of the input promises
     * are resolved. If any promise in the list fails, then the returned promise
     * will be rejected with an array containing the error from each promise.
     * If they all succeed, then the returned promise will succeed, with the
     * results being the results of all the input
     * promises. For example: <pre>
     *   var p1 = Parse.Promise.as(1);
     *   var p2 = Parse.Promise.as(2);
     *   var p3 = Parse.Promise.as(3);
     *
     *   Parse.Promise.when(p1, p2, p3).then(function(r1, r2, r3) {
     *     console.log(r1);  // prints 1
     *     console.log(r2);  // prints 2
     *     console.log(r3);  // prints 3
     *   });</pre>
     *
     * The input promises can also be specified as an array: <pre>
     *   var promises = [p1, p2, p3];
     *   Parse.Promise.when(promises).then(function(results) {
     *     console.log(results);  // prints [1,2,3]
     *   });
     * </pre>
     * @method when
     * @param {Array} promises a list of promises to wait for.
     * @static
     * @return {Parse.Promise} the new promise.
     */
  }, {
    key: 'when',
    value: function when(promises) {
      var objects;
      if (Array.isArray(promises)) {
        objects = promises;
      } else {
        objects = arguments;
      }

      var total = objects.length;
      var hadError = false;
      var results = [];
      var errors = [];
      results.length = objects.length;
      errors.length = objects.length;

      if (total === 0) {
        return ParsePromise.as.apply(this, results);
      }

      var promise = new ParsePromise();

      var resolveOne = function resolveOne() {
        total--;
        if (total <= 0) {
          if (hadError) {
            promise.reject(errors);
          } else {
            promise.resolve.apply(promise, results);
          }
        }
      };

      var chain = function chain(object, index) {
        if (ParsePromise.is(object)) {
          object.then(function (result) {
            results[index] = result;
            resolveOne();
          }, function (error) {
            errors[index] = error;
            hadError = true;
            resolveOne();
          });
        } else {
          results[i] = object;
          resolveOne();
        }
      };
      for (var i = 0; i < objects.length; i++) {
        chain(objects[i], i);
      }

      return promise;
    }

    /**
     * Runs the given asyncFunction repeatedly, as long as the predicate
     * function returns a truthy value. Stops repeating if asyncFunction returns
     * a rejected promise.
     * @method _continueWhile
     * @param {Function} predicate should return false when ready to stop.
     * @param {Function} asyncFunction should return a Promise.
     * @static
     */
  }, {
    key: '_continueWhile',
    value: function _continueWhile(predicate, asyncFunction) {
      if (predicate()) {
        return asyncFunction().then(function () {
          return ParsePromise._continueWhile(predicate, asyncFunction);
        });
      }
      return ParsePromise.as();
    }
  }, {
    key: 'isPromisesAPlusCompliant',
    value: function isPromisesAPlusCompliant() {
      return _isPromisesAPlusCompliant;
    }
  }, {
    key: 'enableAPlusCompliant',
    value: function enableAPlusCompliant() {
      _isPromisesAPlusCompliant = true;
    }
  }, {
    key: 'disableAPlusCompliant',
    value: function disableAPlusCompliant() {
      _isPromisesAPlusCompliant = false;
    }
  }]);

  return ParsePromise;
})();

exports['default'] = ParsePromise;
module.exports = exports['default'];
}).call(this,_dereq_('_process'))
},{"_process":75,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44}],17:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _encode = _dereq_('./encode');

var _encode2 = _interopRequireDefault(_encode);

var _ParseError = _dereq_('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _ParseGeoPoint = _dereq_('./ParseGeoPoint');

var _ParseGeoPoint2 = _interopRequireDefault(_ParseGeoPoint);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

/**
 * Converts a string into a regex that matches it.
 * Surrounding with \Q .. \E does this, we just need to escape any \E's in
 * the text separately.
 */
function quote(s) {
  return '\\Q' + s.replace('\\E', '\\E\\\\E\\Q') + '\\E';
}

/**
 * Creates a new parse Parse.Query for the given Parse.Object subclass.
 * @class Parse.Query
 * @constructor
 * @param {} objectClass An instance of a subclass of Parse.Object, or a Parse className string.
 *
 * <p>Parse.Query defines a query that is used to fetch Parse.Objects. The
 * most common use case is finding all objects that match a query through the
 * <code>find</code> method. For example, this sample code fetches all objects
 * of class <code>MyClass</code>. It calls a different function depending on
 * whether the fetch succeeded or not.
 *
 * <pre>
 * var query = new Parse.Query(MyClass);
 * query.find({
 *   success: function(results) {
 *     // results is an array of Parse.Object.
 *   },
 *
 *   error: function(error) {
 *     // error is an instance of Parse.Error.
 *   }
 * });</pre></p>
 *
 * <p>A Parse.Query can also be used to retrieve a single object whose id is
 * known, through the get method. For example, this sample code fetches an
 * object of class <code>MyClass</code> and id <code>myId</code>. It calls a
 * different function depending on whether the fetch succeeded or not.
 *
 * <pre>
 * var query = new Parse.Query(MyClass);
 * query.get(myId, {
 *   success: function(object) {
 *     // object is an instance of Parse.Object.
 *   },
 *
 *   error: function(object, error) {
 *     // error is an instance of Parse.Error.
 *   }
 * });</pre></p>
 *
 * <p>A Parse.Query can also be used to count the number of objects that match
 * the query without retrieving all of those objects. For example, this
 * sample code counts the number of objects of the class <code>MyClass</code>
 * <pre>
 * var query = new Parse.Query(MyClass);
 * query.count({
 *   success: function(number) {
 *     // There are number instances of MyClass.
 *   },
 *
 *   error: function(error) {
 *     // error is an instance of Parse.Error.
 *   }
 * });</pre></p>
 */

var ParseQuery = (function () {
  function ParseQuery(objectClass) {
    _classCallCheck(this, ParseQuery);

    if (typeof objectClass === 'string') {
      if (objectClass === 'User' && _CoreManager2['default'].get('PERFORM_USER_REWRITE')) {
        this.className = '_User';
      } else {
        this.className = objectClass;
      }
    } else if (objectClass instanceof _ParseObject2['default']) {
      this.className = objectClass.className;
    } else if (typeof objectClass === 'function') {
      if (typeof objectClass.className === 'string') {
        this.className = objectClass.className;
      } else {
        var obj = new objectClass();
        this.className = obj.className;
      }
    } else {
      throw new TypeError('A ParseQuery must be constructed with a ParseObject or class name.');
    }

    this._where = {};
    this._include = [];
    this._limit = -1; // negative limit is not sent in the server request
    this._skip = 0;
    this._extraOptions = {};
  }

  /**
   * Adds constraint that at least one of the passed in queries matches.
   * @method _orQuery
   * @param {Array} queries
   * @return {Parse.Query} Returns the query, so you can chain this call.
   */

  _createClass(ParseQuery, [{
    key: '_orQuery',
    value: function _orQuery(queries) {
      var queryJSON = queries.map(function (q) {
        return q.toJSON().where;
      });

      this._where.$or = queryJSON;
      return this;
    }

    /**
     * Helper for condition queries
     */
  }, {
    key: '_addCondition',
    value: function _addCondition(key, condition, value) {
      if (!this._where[key] || typeof this._where[key] === 'string') {
        this._where[key] = {};
      }
      this._where[key][condition] = (0, _encode2['default'])(value, false, true);
      return this;
    }

    /**
     * Returns a JSON representation of this query.
     * @method toJSON
     * @return {Object} The JSON representation of the query.
     */
  }, {
    key: 'toJSON',
    value: function toJSON() {
      var params = {
        where: this._where
      };

      if (this._include.length) {
        params.include = this._include.join(',');
      }
      if (this._select) {
        params.keys = this._select.join(',');
      }
      if (this._limit >= 0) {
        params.limit = this._limit;
      }
      if (this._skip > 0) {
        params.skip = this._skip;
      }
      if (this._order) {
        params.order = this._order.join(',');
      }
      for (var key in this._extraOptions) {
        params[key] = this._extraOptions[key];
      }

      return params;
    }

    /**
     * Constructs a Parse.Object whose id is already known by fetching data from
     * the server.  Either options.success or options.error is called when the
     * find completes.
     *
     * @method get
     * @param {String} objectId The id of the object to be fetched.
     * @param {Object} options A Backbone-style options object.
     * Valid options are:<ul>
     *   <li>success: A Backbone-style success callback
     *   <li>error: An Backbone-style error callback.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Parse.Promise} A promise that is resolved with the result when
     * the query completes.
     */
  }, {
    key: 'get',
    value: function get(objectId, options) {
      this.equalTo('objectId', objectId);

      var firstOptions = {};
      if (options && options.hasOwnProperty('useMasterKey')) {
        firstOptions.useMasterKey = options.useMasterKey;
      }
      if (options && options.hasOwnProperty('sessionToken')) {
        firstOptions.sessionToken = options.sessionToken;
      }

      return this.first(firstOptions).then(function (response) {
        if (response) {
          return response;
        }

        var errorObject = new _ParseError2['default'](_ParseError2['default'].OBJECT_NOT_FOUND, 'Object not found.');
        return _ParsePromise2['default'].error(errorObject);
      })._thenRunCallbacks(options, null);
    }

    /**
     * Retrieves a list of ParseObjects that satisfy this query.
     * Either options.success or options.error is called when the find
     * completes.
     *
     * @method find
     * @param {Object} options A Backbone-style options object. Valid options
     * are:<ul>
     *   <li>success: Function to call when the find completes successfully.
     *   <li>error: Function to call when the find fails.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Parse.Promise} A promise that is resolved with the results when
     * the query completes.
     */
  }, {
    key: 'find',
    value: function find(options) {
      var _this = this;

      options = options || {};

      var findOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        findOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager2['default'].getQueryController();

      return controller.find(this.className, this.toJSON(), findOptions).then(function (response) {
        return response.results.map(function (data) {
          if (!data.className) {
            data.className = _this.className;
          }
          return _ParseObject2['default'].fromJSON(data);
        });
      })._thenRunCallbacks(options);
    }

    /**
     * Counts the number of objects that match this query.
     * Either options.success or options.error is called when the count
     * completes.
     *
     * @method count
     * @param {Object} options A Backbone-style options object. Valid options
     * are:<ul>
     *   <li>success: Function to call when the count completes successfully.
     *   <li>error: Function to call when the find fails.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Parse.Promise} A promise that is resolved with the count when
     * the query completes.
     */
  }, {
    key: 'count',
    value: function count(options) {
      options = options || {};

      var findOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        findOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager2['default'].getQueryController();

      var params = this.toJSON();
      params.limit = 0;
      params.count = 1;

      return controller.find(this.className, params, findOptions).then(function (result) {
        return result.count;
      })._thenRunCallbacks(options);
    }

    /**
     * Retrieves at most one Parse.Object that satisfies this query.
     *
     * Either options.success or options.error is called when it completes.
     * success is passed the object if there is one. otherwise, undefined.
     *
     * @method first
     * @param {Object} options A Backbone-style options object. Valid options
     * are:<ul>
     *   <li>success: Function to call when the find completes successfully.
     *   <li>error: Function to call when the find fails.
     *   <li>useMasterKey: In Cloud Code and Node only, causes the Master Key to
     *     be used for this request.
     *   <li>sessionToken: A valid session token, used for making a request on
     *       behalf of a specific user.
     * </ul>
     *
     * @return {Parse.Promise} A promise that is resolved with the object when
     * the query completes.
     */
  }, {
    key: 'first',
    value: function first(options) {
      var _this2 = this;

      options = options || {};

      var findOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        findOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
      }

      var controller = _CoreManager2['default'].getQueryController();

      var params = this.toJSON();
      params.limit = 1;

      return controller.find(this.className, params, findOptions).then(function (response) {
        var objects = response.results;
        if (!objects[0]) {
          return undefined;
        }
        if (!objects[0].className) {
          objects[0].className = _this2.className;
        }
        return _ParseObject2['default'].fromJSON(objects[0]);
      })._thenRunCallbacks(options);
    }

    /**
     * Iterates over each result of a query, calling a callback for each one. If
     * the callback returns a promise, the iteration will not continue until
     * that promise has been fulfilled. If the callback returns a rejected
     * promise, then iteration will stop with that error. The items are
     * processed in an unspecified order. The query may not have any sort order,
     * and may not use limit or skip.
     * @method each
     * @param {Function} callback Callback that will be called with each result
     *     of the query.
     * @param {Object} options An optional Backbone-like options object with
     *     success and error callbacks that will be invoked once the iteration
     *     has finished.
     * @return {Parse.Promise} A promise that will be fulfilled once the
     *     iteration has completed.
     */
  }, {
    key: 'each',
    value: function each(callback, options) {
      options = options || {};

      if (this._order || this._skip || this._limit >= 0) {
        return _ParsePromise2['default'].error('Cannot iterate on a query with sort, skip, or limit.')._thenRunCallbacks(options);
      }

      var promise = new _ParsePromise2['default']();

      var query = new ParseQuery(this.className);
      // We can override the batch size from the options.
      // This is undocumented, but useful for testing.
      query._limit = options.batchSize || 100;
      query._include = this._include.map(function (i) {
        return i;
      });
      if (this._select) {
        query._select = this._select.map(function (s) {
          return s;
        });
      }

      query._where = {};
      for (var attr in this._where) {
        var val = this._where[attr];
        if (Array.isArray(val)) {
          query._where[attr] = val.map(function (v) {
            return v;
          });
        } else if (val && typeof val === 'object') {
          var conditionMap = {};
          query._where[attr] = conditionMap;
          for (var cond in val) {
            conditionMap[cond] = val[cond];
          }
        } else {
          query._where[attr] = val;
        }
      }

      query.ascending('objectId');

      var findOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        findOptions.useMasterKey = options.useMasterKey;
      }
      if (options.hasOwnProperty('sessionToken')) {
        findOptions.sessionToken = options.sessionToken;
      }

      var finished = false;
      return _ParsePromise2['default']._continueWhile(function () {
        return !finished;
      }, function () {
        return query.find(findOptions).then(function (results) {
          var callbacksDone = _ParsePromise2['default'].as();
          results.forEach(function (result) {
            callbacksDone = callbacksDone.then(function () {
              return callback(result);
            });
          });

          return callbacksDone.then(function () {
            if (results.length >= query._limit) {
              query.greaterThan('objectId', results[results.length - 1].id);
            } else {
              finished = true;
            }
          });
        });
      })._thenRunCallbacks(options);
    }

    /** Query Conditions **/

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be equal to the provided value.
     * @method equalTo
     * @param {String} key The key to check.
     * @param value The value that the Parse.Object must contain.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'equalTo',
    value: function equalTo(key, value) {
      if (typeof value === 'undefined') {
        return this.doesNotExist(key);
      }

      this._where[key] = (0, _encode2['default'])(value, false, true);
      return this;
    }

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be not equal to the provided value.
     * @method notEqualTo
     * @param {String} key The key to check.
     * @param value The value that must not be equalled.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'notEqualTo',
    value: function notEqualTo(key, value) {
      return this._addCondition(key, '$ne', value);
    }

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be less than the provided value.
     * @method lessThan
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'lessThan',
    value: function lessThan(key, value) {
      return this._addCondition(key, '$lt', value);
    }

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be greater than the provided value.
     * @method greaterThan
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'greaterThan',
    value: function greaterThan(key, value) {
      return this._addCondition(key, '$gt', value);
    }

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be less than or equal to the provided value.
     * @method lessThanOrEqualTo
     * @param {String} key The key to check.
     * @param value The value that provides an upper bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'lessThanOrEqualTo',
    value: function lessThanOrEqualTo(key, value) {
      return this._addCondition(key, '$lte', value);
    }

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be greater than or equal to the provided value.
     * @method greaterThanOrEqualTo
     * @param {String} key The key to check.
     * @param value The value that provides an lower bound.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'greaterThanOrEqualTo',
    value: function greaterThanOrEqualTo(key, value) {
      return this._addCondition(key, '$gte', value);
    }

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * be contained in the provided list of values.
     * @method containedIn
     * @param {String} key The key to check.
     * @param {Array} values The values that will match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'containedIn',
    value: function containedIn(key, value) {
      return this._addCondition(key, '$in', value);
    }

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * not be contained in the provided list of values.
     * @method notContainedIn
     * @param {String} key The key to check.
     * @param {Array} values The values that will not match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'notContainedIn',
    value: function notContainedIn(key, value) {
      return this._addCondition(key, '$nin', value);
    }

    /**
     * Adds a constraint to the query that requires a particular key's value to
     * contain each one of the provided list of values.
     * @method containsAll
     * @param {String} key The key to check.  This key's value must be an array.
     * @param {Array} values The values that will match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'containsAll',
    value: function containsAll(key, values) {
      return this._addCondition(key, '$all', values);
    }

    /**
     * Adds a constraint for finding objects that contain the given key.
     * @method exists
     * @param {String} key The key that should exist.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'exists',
    value: function exists(key) {
      return this._addCondition(key, '$exists', true);
    }

    /**
     * Adds a constraint for finding objects that do not contain a given key.
     * @method doesNotExist
     * @param {String} key The key that should not exist
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'doesNotExist',
    value: function doesNotExist(key) {
      return this._addCondition(key, '$exists', false);
    }

    /**
     * Adds a regular expression constraint for finding string values that match
     * the provided regular expression.
     * This may be slow for large datasets.
     * @method matches
     * @param {String} key The key that the string to match is stored in.
     * @param {RegExp} regex The regular expression pattern to match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'matches',
    value: function matches(key, regex, modifiers) {
      this._addCondition(key, '$regex', regex);
      if (!modifiers) {
        modifiers = '';
      }
      if (regex.ignoreCase) {
        modifiers += 'i';
      }
      if (regex.multiline) {
        modifiers += 'm';
      }
      if (modifiers.length) {
        this._addCondition(key, '$options', modifiers);
      }
      return this;
    }

    /**
     * Adds a constraint that requires that a key's value matches a Parse.Query
     * constraint.
     * @method matchesQuery
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {Parse.Query} query The query that should match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'matchesQuery',
    value: function matchesQuery(key, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      return this._addCondition(key, '$inQuery', queryJSON);
    }

    /**
     * Adds a constraint that requires that a key's value not matches a
     * Parse.Query constraint.
     * @method doesNotMatchQuery
     * @param {String} key The key that the contains the object to match the
     *                     query.
     * @param {Parse.Query} query The query that should not match.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'doesNotMatchQuery',
    value: function doesNotMatchQuery(key, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      return this._addCondition(key, '$notInQuery', queryJSON);
    }

    /**
     * Adds a constraint that requires that a key's value matches a value in
     * an object returned by a different Parse.Query.
     * @method matchesKeyInQuery
     * @param {String} key The key that contains the value that is being
     *                     matched.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {Parse.Query} query The query to run.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'matchesKeyInQuery',
    value: function matchesKeyInQuery(key, queryKey, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      return this._addCondition(key, '$select', {
        key: queryKey,
        query: queryJSON
      });
    }

    /**
     * Adds a constraint that requires that a key's value not match a value in
     * an object returned by a different Parse.Query.
     * @method doesNotMatchKeyInQuery
     * @param {String} key The key that contains the value that is being
     *                     excluded.
     * @param {String} queryKey The key in the objects returned by the query to
     *                          match against.
     * @param {Parse.Query} query The query to run.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'doesNotMatchKeyInQuery',
    value: function doesNotMatchKeyInQuery(key, queryKey, query) {
      var queryJSON = query.toJSON();
      queryJSON.className = query.className;
      return this._addCondition(key, '$dontSelect', {
        key: queryKey,
        query: queryJSON
      });
    }

    /**
     * Adds a constraint for finding string values that contain a provided
     * string.  This may be slow for large datasets.
     * @method contains
     * @param {String} key The key that the string to match is stored in.
     * @param {String} substring The substring that the value must contain.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'contains',
    value: function contains(key, value) {
      if (typeof value !== 'string') {
        throw new Error('The value being searched for must be a string.');
      }
      return this._addCondition(key, '$regex', quote(value));
    }

    /**
     * Adds a constraint for finding string values that start with a provided
     * string.  This query will use the backend index, so it will be fast even
     * for large datasets.
     * @method startsWith
     * @param {String} key The key that the string to match is stored in.
     * @param {String} prefix The substring that the value must start with.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'startsWith',
    value: function startsWith(key, value) {
      if (typeof value !== 'string') {
        throw new Error('The value being searched for must be a string.');
      }
      return this._addCondition(key, '$regex', '^' + quote(value));
    }

    /**
     * Adds a constraint for finding string values that end with a provided
     * string.  This will be slow for large datasets.
     * @method endsWith
     * @param {String} key The key that the string to match is stored in.
     * @param {String} suffix The substring that the value must end with.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'endsWith',
    value: function endsWith(key, value) {
      if (typeof value !== 'string') {
        throw new Error('The value being searched for must be a string.');
      }
      return this._addCondition(key, '$regex', quote(value) + '$');
    }

    /**
     * Adds a proximity based constraint for finding objects with key point
     * values near the point given.
     * @method near
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'near',
    value: function near(key, point) {
      if (!(point instanceof _ParseGeoPoint2['default'])) {
        // Try to cast it as a GeoPoint
        point = new _ParseGeoPoint2['default'](point);
      }
      return this._addCondition(key, '$nearSphere', point);
    }

    /**
     * Adds a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * @method withinRadians
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in radians) of results to
     *   return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'withinRadians',
    value: function withinRadians(key, point, distance) {
      this.near(key, point);
      return this._addCondition(key, '$maxDistance', distance);
    }

    /**
     * Adds a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 3958.8 miles.
     * @method withinMiles
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in miles) of results to
     *     return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'withinMiles',
    value: function withinMiles(key, point, distance) {
      return this.withinRadians(key, point, distance / 3958.8);
    }

    /**
     * Adds a proximity based constraint for finding objects with key point
     * values near the point given and within the maximum distance given.
     * Radius of earth used is 6371.0 kilometers.
     * @method withinKilometers
     * @param {String} key The key that the Parse.GeoPoint is stored in.
     * @param {Parse.GeoPoint} point The reference Parse.GeoPoint that is used.
     * @param {Number} maxDistance Maximum distance (in kilometers) of results
     *     to return.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'withinKilometers',
    value: function withinKilometers(key, point, distance) {
      return this.withinRadians(key, point, distance / 6371.0);
    }

    /**
     * Adds a constraint to the query that requires a particular key's
     * coordinates be contained within a given rectangular geographic bounding
     * box.
     * @method withinGeoBox
     * @param {String} key The key to be constrained.
     * @param {Parse.GeoPoint} southwest
     *     The lower-left inclusive corner of the box.
     * @param {Parse.GeoPoint} northeast
     *     The upper-right inclusive corner of the box.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'withinGeoBox',
    value: function withinGeoBox(key, southwest, northeast) {
      if (!(southwest instanceof _ParseGeoPoint2['default'])) {
        southwest = new _ParseGeoPoint2['default'](southwest);
      }
      if (!(northeast instanceof _ParseGeoPoint2['default'])) {
        northeast = new _ParseGeoPoint2['default'](northeast);
      }
      this._addCondition(key, '$within', { '$box': [southwest, northeast] });
      return this;
    }

    /** Query Orderings **/

    /**
     * Sorts the results in ascending order by the given key.
     *
     * @method ascending
     * @param {(String|String[]|...String} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'ascending',
    value: function ascending() {
      this._order = [];

      for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }

      return this.addAscending.apply(this, keys);
    }

    /**
     * Sorts the results in ascending order by the given key,
     * but can also add secondary sort descriptors without overwriting _order.
     *
     * @method addAscending
     * @param {(String|String[]|...String} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'addAscending',
    value: function addAscending() {
      var _this3 = this;

      if (!this._order) {
        this._order = [];
      }

      for (var _len2 = arguments.length, keys = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        keys[_key2] = arguments[_key2];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          key = key.join();
        }
        _this3._order = _this3._order.concat(key.replace(/\s/g, '').split(','));
      });

      return this;
    }

    /**
     * Sorts the results in descending order by the given key.
     *
     * @method descending
     * @param {(String|String[]|...String} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'descending',
    value: function descending() {
      this._order = [];

      for (var _len3 = arguments.length, keys = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        keys[_key3] = arguments[_key3];
      }

      return this.addDescending.apply(this, keys);
    }

    /**
     * Sorts the results in descending order by the given key,
     * but can also add secondary sort descriptors without overwriting _order.
     *
     * @method addDescending
     * @param {(String|String[]|...String} key The key to order by, which is a
     * string of comma separated values, or an Array of keys, or multiple keys.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'addDescending',
    value: function addDescending() {
      var _this4 = this;

      if (!this._order) {
        this._order = [];
      }

      for (var _len4 = arguments.length, keys = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        keys[_key4] = arguments[_key4];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          key = key.join();
        }
        _this4._order = _this4._order.concat(key.replace(/\s/g, '').split(',').map(function (k) {
          return '-' + k;
        }));
      });

      return this;
    }

    /** Query Options **/

    /**
     * Sets the number of results to skip before returning any results.
     * This is useful for pagination.
     * Default is to skip zero results.
     * @method skip
     * @param {Number} n the number of results to skip.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'skip',
    value: function skip(n) {
      if (typeof n !== 'number' || n < 0) {
        throw new Error('You can only skip by a positive number');
      }
      this._skip = n;
      return this;
    }

    /**
     * Sets the limit of the number of results to return. The default limit is
     * 100, with a maximum of 1000 results being returned at a time.
     * @method limit
     * @param {Number} n the number of results to limit to.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'limit',
    value: function limit(n) {
      if (typeof n !== 'number') {
        throw new Error('You can only set the limit to a numeric value');
      }
      this._limit = n;
      return this;
    }

    /**
     * Includes nested Parse.Objects for the provided key.  You can use dot
     * notation to specify which fields in the included object are also fetched.
     * @method include
     * @param {String} key The name of the key to include.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'include',
    value: function include() {
      var _this5 = this;

      for (var _len5 = arguments.length, keys = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        keys[_key5] = arguments[_key5];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          _this5._include = _this5._include.concat(key);
        } else {
          _this5._include.push(key);
        }
      });
      return this;
    }

    /**
     * Restricts the fields of the returned Parse.Objects to include only the
     * provided keys.  If this is called multiple times, then all of the keys
     * specified in each of the calls will be included.
     * @method select
     * @param {Array} keys The names of the keys to include.
     * @return {Parse.Query} Returns the query, so you can chain this call.
     */
  }, {
    key: 'select',
    value: function select() {
      var _this6 = this;

      if (!this._select) {
        this._select = [];
      }

      for (var _len6 = arguments.length, keys = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        keys[_key6] = arguments[_key6];
      }

      keys.forEach(function (key) {
        if (Array.isArray(key)) {
          _this6._select = _this6._select.concat(key);
        } else {
          _this6._select.push(key);
        }
      });
      return this;
    }

    /**
     * Constructs a Parse.Query that is the OR of the passed in queries.  For
     * example:
     * <pre>var compoundQuery = Parse.Query.or(query1, query2, query3);</pre>
     *
     * will create a compoundQuery that is an or of the query1, query2, and
     * query3.
     * @method or
     * @param {...Parse.Query} var_args The list of queries to OR.
     * @static
     * @return {Parse.Query} The query that is the OR of the passed in queries.
     */
  }], [{
    key: 'or',
    value: function or() {
      var className = null;

      for (var _len7 = arguments.length, queries = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        queries[_key7] = arguments[_key7];
      }

      queries.forEach(function (q) {
        if (!className) {
          className = q.className;
        }

        if (className !== q.className) {
          throw new Error('All queries must be for the same class.');
        }
      });

      var query = new ParseQuery(className);
      query._orQuery(queries);
      return query;
    }
  }]);

  return ParseQuery;
})();

exports['default'] = ParseQuery;

_CoreManager2['default'].setQueryController({
  find: function find(className, params, options) {
    var RESTController = _CoreManager2['default'].getRESTController();

    return RESTController.request('GET', 'classes/' + className, params, options);
  }
});
module.exports = exports['default'];
},{"./CoreManager":3,"./ParseError":10,"./ParseGeoPoint":12,"./ParseObject":14,"./ParsePromise":16,"./encode":30,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/interop-require-default":47}],18:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ParseOp = _dereq_('./ParseOp');

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

var _ParseQuery = _dereq_('./ParseQuery');

var _ParseQuery2 = _interopRequireDefault(_ParseQuery);

/**
 * Creates a new Relation for the given parent object and key. This
 * constructor should rarely be used directly, but rather created by
 * Parse.Object.relation.
 * @class Parse.Relation
 * @constructor
 * @param {Parse.Object} parent The parent of this relation.
 * @param {String} key The key for this relation on the parent.
 *
 * <p>
 * A class that is used to access all of the children of a many-to-many
 * relationship.  Each instance of Parse.Relation is associated with a
 * particular parent object and key.
 * </p>
 */

var ParseRelation = (function () {
  function ParseRelation(parent, key) {
    _classCallCheck(this, ParseRelation);

    this.parent = parent;
    this.key = key;
    this.targetClassName = null;
  }

  /**
   * Makes sure that this relation has the right parent and key.
   */

  _createClass(ParseRelation, [{
    key: '_ensureParentAndKey',
    value: function _ensureParentAndKey(parent, key) {
      this.key = this.key || key;
      if (this.key !== key) {
        throw new Error('Internal Error. Relation retrieved from two different keys.');
      }
      if (this.parent) {
        if (this.parent.className !== parent.className) {
          throw new Error('Internal Error. Relation retrieved from two different Objects.');
        }
        if (this.parent.id) {
          if (this.parent.id !== parent.id) {
            throw new Error('Internal Error. Relation retrieved from two different Objects.');
          }
        } else if (parent.id) {
          this.parent = parent;
        }
      } else {
        this.parent = parent;
      }
    }

    /**
     * Adds a Parse.Object or an array of Parse.Objects to the relation.
     * @method add
     * @param {} objects The item or items to add.
     */
  }, {
    key: 'add',
    value: function add(objects) {
      if (!Array.isArray(objects)) {
        objects = [objects];
      }

      var change = new _ParseOp.RelationOp(objects, []);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
      return this.parent;
    }

    /**
     * Removes a Parse.Object or an array of Parse.Objects from this relation.
     * @method remove
     * @param {} objects The item or items to remove.
     */
  }, {
    key: 'remove',
    value: function remove(objects) {
      if (!Array.isArray(objects)) {
        objects = [objects];
      }

      var change = new _ParseOp.RelationOp([], objects);
      this.parent.set(this.key, change);
      this.targetClassName = change._targetClassName;
    }

    /**
     * Returns a JSON version of the object suitable for saving to disk.
     * @method toJSON
     * @return {Object}
     */
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return {
        __type: 'Relation',
        className: this.targetClassName
      };
    }

    /**
     * Returns a Parse.Query that is limited to objects in this
     * relation.
     * @method query
     * @return {Parse.Query}
     */
  }, {
    key: 'query',
    value: function query() {
      var query;
      if (!this.targetClassName) {
        query = new _ParseQuery2['default'](this.parent.className);
        query._extraOptions.redirectClassNameForKey = this.key;
      } else {
        query = new _ParseQuery2['default'](this.targetClassName);
      }
      query._addCondition('$relatedTo', 'object', {
        __type: 'Pointer',
        className: this.parent.className,
        objectId: this.parent.id
      });
      query._addCondition('$relatedTo', 'key', this.key);

      return query;
    }
  }]);

  return ParseRelation;
})();

exports['default'] = ParseRelation;
module.exports = exports['default'];
},{"./ParseObject":14,"./ParseOp":15,"./ParseQuery":17,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/interop-require-default":47}],19:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

/**
 * Represents a Role on the Parse server. Roles represent groupings of
 * Users for the purposes of granting permissions (e.g. specifying an ACL
 * for an Object). Roles are specified by their sets of child users and
 * child roles, all of which are granted any permissions that the parent
 * role has.
 *
 * <p>Roles must have a name (which cannot be changed after creation of the
 * role), and must specify an ACL.</p>
 * @class Parse.Role
 * @constructor
 * @param {String} name The name of the Role to create.
 * @param {Parse.ACL} acl The ACL for this role. Roles must have an ACL.
 * A Parse.Role is a local representation of a role persisted to the Parse
 * cloud.
 */
'use strict';

var _get = _dereq_('babel-runtime/helpers/get')['default'];

var _inherits = _dereq_('babel-runtime/helpers/inherits')['default'];

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ParseACL = _dereq_('./ParseACL');

var _ParseACL2 = _interopRequireDefault(_ParseACL);

var _ParseError = _dereq_('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _ParseObject2 = _dereq_('./ParseObject');

var _ParseObject3 = _interopRequireDefault(_ParseObject2);

var ParseRole = (function (_ParseObject) {
  _inherits(ParseRole, _ParseObject);

  function ParseRole(name, acl) {
    _classCallCheck(this, ParseRole);

    _get(Object.getPrototypeOf(ParseRole.prototype), 'constructor', this).call(this, '_Role');
    if (typeof name === 'string' && acl instanceof _ParseACL2['default']) {
      this.setName(name);
      this.setACL(acl);
    }
  }

  /**
   * Gets the name of the role.  You can alternatively call role.get("name")
   *
   * @method getName
   * @return {String} the name of the role.
   */

  _createClass(ParseRole, [{
    key: 'getName',
    value: function getName() {
      return this.get('name');
    }

    /**
     * Sets the name for a role. This value must be set before the role has
     * been saved to the server, and cannot be set once the role has been
     * saved.
     *
     * <p>
     *   A role's name can only contain alphanumeric characters, _, -, and
     *   spaces.
     * </p>
     *
     * <p>This is equivalent to calling role.set("name", name)</p>
     *
     * @method setName
     * @param {String} name The name of the role.
     * @param {Object} options Standard options object with success and error
     *     callbacks.
     */
  }, {
    key: 'setName',
    value: function setName(name, options) {
      return this.set('name', name, options);
    }

    /**
     * Gets the Parse.Relation for the Parse.Users that are direct
     * children of this role. These users are granted any privileges that this
     * role has been granted (e.g. read or write access through ACLs). You can
     * add or remove users from the role through this relation.
     *
     * <p>This is equivalent to calling role.relation("users")</p>
     *
     * @method getUsers
     * @return {Parse.Relation} the relation for the users belonging to this
     *     role.
     */
  }, {
    key: 'getUsers',
    value: function getUsers() {
      return this.relation('users');
    }

    /**
     * Gets the Parse.Relation for the Parse.Roles that are direct
     * children of this role. These roles' users are granted any privileges that
     * this role has been granted (e.g. read or write access through ACLs). You
     * can add or remove child roles from this role through this relation.
     *
     * <p>This is equivalent to calling role.relation("roles")</p>
     *
     * @method getRoles
     * @return {Parse.Relation} the relation for the roles belonging to this
     *     role.
     */
  }, {
    key: 'getRoles',
    value: function getRoles() {
      return this.relation('roles');
    }
  }, {
    key: 'validate',
    value: function validate(attrs, options) {
      var isInvalid = _get(Object.getPrototypeOf(ParseRole.prototype), 'validate', this).call(this, attrs, options);
      if (isInvalid) {
        return isInvalid;
      }

      if ('name' in attrs && attrs.name !== this.getName()) {
        var newName = attrs.name;
        if (this.id && this.id !== attrs.objectId) {
          // Check to see if the objectId being set matches this.id
          // This happens during a fetch -- the id is set before calling fetch
          // Let the name be set in this case
          return new _ParseError2['default'](_ParseError2['default'].OTHER_CAUSE, 'A role\'s name can only be set before it has been saved.');
        }
        if (typeof newName !== 'string') {
          return new _ParseError2['default'](_ParseError2['default'].OTHER_CAUSE, 'A role\'s name must be a String.');
        }
        if (!/^[0-9a-zA-Z\-_ ]+$/.test(newName)) {
          return new _ParseError2['default'](_ParseError2['default'].OTHER_CAUSE, 'A role\'s name can be only contain alphanumeric characters, _, ' + '-, and spaces.');
        }
      }
      return false;
    }
  }]);

  return ParseRole;
})(_ParseObject3['default']);

exports['default'] = ParseRole;

_ParseObject3['default'].registerSubclass('_Role', ParseRole);
module.exports = exports['default'];
},{"./ParseACL":8,"./ParseError":10,"./ParseObject":14,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/get":45,"babel-runtime/helpers/inherits":46,"babel-runtime/helpers/interop-require-default":47}],20:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

/**
 * @class Parse.Session
 * @constructor
 *
 * <p>A Parse.Session object is a local representation of a revocable session.
 * This class is a subclass of a Parse.Object, and retains the same
 * functionality of a Parse.Object.</p>
 */
'use strict';

var _get = _dereq_('babel-runtime/helpers/get')['default'];

var _inherits = _dereq_('babel-runtime/helpers/inherits')['default'];

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _isRevocableSession = _dereq_('./isRevocableSession');

var _isRevocableSession2 = _interopRequireDefault(_isRevocableSession);

var _ParseObject2 = _dereq_('./ParseObject');

var _ParseObject3 = _interopRequireDefault(_ParseObject2);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

var _ParseUser = _dereq_('./ParseUser');

var _ParseUser2 = _interopRequireDefault(_ParseUser);

var ParseSession = (function (_ParseObject) {
  _inherits(ParseSession, _ParseObject);

  function ParseSession(attributes) {
    _classCallCheck(this, ParseSession);

    _get(Object.getPrototypeOf(ParseSession.prototype), 'constructor', this).call(this, '_Session');
    if (attributes && typeof attributes === 'object') {
      if (!this.set(attributes || {})) {
        throw new Error('Can\'t create an invalid Session');
      }
    }
  }

  /**
   * Returns the session token string.
   * @method getSessionToken
   * @return {String}
   */

  _createClass(ParseSession, [{
    key: 'getSessionToken',
    value: function getSessionToken() {
      return this.get('sessionToken');
    }
  }], [{
    key: 'readOnlyAttributes',
    value: function readOnlyAttributes() {
      return ['createdWith', 'expiresAt', 'installationId', 'restricted', 'sessionToken', 'user'];
    }

    /**
     * Retrieves the Session object for the currently logged in session.
     * @method current
     * @static
     * @return {Parse.Promise} A promise that is resolved with the Parse.Session
     *   object after it has been fetched. If there is no current user, the
     *   promise will be rejected.
     */
  }, {
    key: 'current',
    value: function current(options) {
      options = options || {};
      var controller = _CoreManager2['default'].getSessionController();

      var sessionOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        sessionOptions.useMasterKey = options.useMasterKey;
      }
      return _ParseUser2['default'].currentAsync().then(function (user) {
        if (!user) {
          return _ParsePromise2['default'].error('There is no current user.');
        }
        var token = user.getSessionToken();
        sessionOptions.sessionToken = user.getSessionToken();
        return controller.getSession(sessionOptions);
      });
    }

    /**
     * Determines whether the current session token is revocable.
     * This method is useful for migrating Express.js or Node.js web apps to
     * use revocable sessions. If you are migrating an app that uses the Parse
     * SDK in the browser only, please use Parse.User.enableRevocableSession()
     * instead, so that sessions can be automatically upgraded.
     * @method isCurrentSessionRevocable
     * @static
     * @return {Boolean}
     */
  }, {
    key: 'isCurrentSessionRevocable',
    value: function isCurrentSessionRevocable() {
      var currentUser = _ParseUser2['default'].current();
      if (currentUser) {
        return (0, _isRevocableSession2['default'])(currentUser.getSessionToken() || '');
      }
      return false;
    }
  }]);

  return ParseSession;
})(_ParseObject3['default']);

exports['default'] = ParseSession;

_ParseObject3['default'].registerSubclass('_Session', ParseSession);

_CoreManager2['default'].setSessionController({
  getSession: function getSession(options) {
    var RESTController = _CoreManager2['default'].getRESTController();
    var session = new ParseSession();

    return RESTController.request('GET', 'sessions/me', {}, options).then(function (sessionData) {
      session._finishFetch(sessionData);
      session._setExisted(true);
      return session;
    });
  }
});
module.exports = exports['default'];
},{"./CoreManager":3,"./ParseObject":14,"./ParsePromise":16,"./ParseUser":21,"./isRevocableSession":33,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/get":45,"babel-runtime/helpers/inherits":46,"babel-runtime/helpers/interop-require-default":47}],21:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _get = _dereq_('babel-runtime/helpers/get')['default'];

var _inherits = _dereq_('babel-runtime/helpers/inherits')['default'];

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _Object$defineProperty = _dereq_('babel-runtime/core-js/object/define-property')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = _dereq_('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _isRevocableSession = _dereq_('./isRevocableSession');

var _isRevocableSession2 = _interopRequireDefault(_isRevocableSession);

var _ObjectState = _dereq_('./ObjectState');

var ObjectState = _interopRequireWildcard(_ObjectState);

var _ParseError = _dereq_('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _ParseObject2 = _dereq_('./ParseObject');

var _ParseObject3 = _interopRequireDefault(_ParseObject2);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

var _ParseSession = _dereq_('./ParseSession');

var _ParseSession2 = _interopRequireDefault(_ParseSession);

var _Storage = _dereq_('./Storage');

var _Storage2 = _interopRequireDefault(_Storage);

var CURRENT_USER_KEY = 'currentUser';
var canUseCurrentUser = !_CoreManager2['default'].get('IS_NODE');
var currentUserCacheMatchesDisk = false;
var currentUserCache = null;

var authProviders = {};

/**
 * @class Parse.User
 * @constructor
 *
 * <p>A Parse.User object is a local representation of a user persisted to the
 * Parse cloud. This class is a subclass of a Parse.Object, and retains the
 * same functionality of a Parse.Object, but also extends it with various
 * user specific methods, like authentication, signing up, and validation of
 * uniqueness.</p>
 */

var ParseUser = (function (_ParseObject) {
  _inherits(ParseUser, _ParseObject);

  function ParseUser(attributes) {
    _classCallCheck(this, ParseUser);

    _get(Object.getPrototypeOf(ParseUser.prototype), 'constructor', this).call(this, '_User');
    if (attributes && typeof attributes === 'object') {
      if (!this.set(attributes || {})) {
        throw new Error('Can\'t create an invalid Parse User');
      }
    }
  }

  /**
   * Request a revocable session token to replace the older style of token.
   * @method _upgradeToRevocableSession
   * @param {Object} options A Backbone-style options object.
   * @return {Parse.Promise} A promise that is resolved when the replacement
   *   token has been fetched.
   */

  _createClass(ParseUser, [{
    key: '_upgradeToRevocableSession',
    value: function _upgradeToRevocableSession(options) {
      options = options || {};

      var upgradeOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        upgradeOptions.useMasterKey = options.useMasterKey;
      }

      var controller = _CoreManager2['default'].getUserController();
      return controller.upgradeToRevocableSession(this, upgradeOptions)._thenRunCallbacks(options);
    }

    /**
     * Unlike in the Android/iOS SDKs, logInWith is unnecessary, since you can
     * call linkWith on the user (even if it doesn't exist yet on the server).
     * @method _linkWith
     */
  }, {
    key: '_linkWith',
    value: function _linkWith(provider, options) {
      var _this = this;

      var authType;
      if (typeof provider === 'string') {
        authType = provider;
        provider = authProviders[provider];
      } else {
        authType = provider.getAuthType();
      }
      if (options && options.hasOwnProperty('authData')) {
        var authData = this.get('authData') || {};
        authData[authType] = options.authData;

        var controller = _CoreManager2['default'].getUserController();
        return controller.linkWith(this, authData)._thenRunCallbacks(options, this);
      } else {
        var promise = new _ParsePromise2['default']();
        provider.authenticate({
          success: function success(provider, result) {
            var opts = {};
            opts.authData = result;
            if (options.success) {
              opts.success = options.success;
            }
            if (options.error) {
              opts.error = options.error;
            }
            _this._linkWith(provider, opts).then(function () {
              promise.resolve(_this);
            }, function (error) {
              promise.reject(error);
            });
          },
          error: function error(provider, _error) {
            if (options.error) {
              options.error(_this, _error);
            }
            promise.reject(_error);
          }
        });
        return promise;
      }
    }

    /**
     * Synchronizes auth data for a provider (e.g. puts the access token in the
     * right place to be used by the Facebook SDK).
     * @method _synchronizeAuthData
     */
  }, {
    key: '_synchronizeAuthData',
    value: function _synchronizeAuthData(provider) {
      if (!this.isCurrent() || !provider) {
        return;
      }
      var authType;
      if (typeof provider === 'string') {
        authType = provider;
        provider = authProviders[authType];
      } else {
        authType = provider.getAuthType();
      }
      var authData = this.get('authData');
      if (!provider || typeof authData !== 'object') {
        return;
      }
      var success = provider.restoreAuthentication(authData[authType]);
      if (!success) {
        this._unlinkFrom(provider);
      }
    }

    /**
     * Synchronizes authData for all providers.
     * @method _synchronizeAllAuthData
     */
  }, {
    key: '_synchronizeAllAuthData',
    value: function _synchronizeAllAuthData() {
      var authData = this.get('authData');
      if (typeof authData !== 'object') {
        return;
      }

      for (var key in authData) {
        this._synchronizeAuthData(key);
      }
    }

    /**
     * Removes null values from authData (which exist temporarily for
     * unlinking)
     * @method _cleanupAuthData
     */
  }, {
    key: '_cleanupAuthData',
    value: function _cleanupAuthData() {
      if (!this.isCurrent()) {
        return;
      }
      var authData = this.get('authData');
      if (typeof authData !== 'object') {
        return;
      }

      for (var key in authData) {
        if (!authData[key]) {
          delete authData[key];
        }
      }
    }

    /**
     * Unlinks a user from a service.
     * @method _unlinkFrom
     */
  }, {
    key: '_unlinkFrom',
    value: function _unlinkFrom(provider, options) {
      var _this2 = this;

      var authType;
      if (typeof provider === 'string') {
        authType = provider;
        provider = authProviders[provider];
      } else {
        authType = provider.getAuthType();
      }
      return this._linkWith(provider, { authData: null }).then(function () {
        _this2._synchronizeAuthData(provider);
        return _ParsePromise2['default'].as(_this2);
      })._thenRunCallbacks(options);
    }

    /**
     * Checks whether a user is linked to a service.
     * @method _isLinked
     */
  }, {
    key: '_isLinked',
    value: function _isLinked(provider) {
      var authType;
      if (typeof provider === 'string') {
        authType = provider;
      } else {
        authType = provider.getAuthType();
      }
      var authData = this.get('authData') || {};
      return !!authData[authType];
    }

    /**
     * Deauthenticates all providers.
     * @method _logOutWithAll
     */
  }, {
    key: '_logOutWithAll',
    value: function _logOutWithAll() {
      var authData = this.get('authData');
      if (typeof authData !== 'object') {
        return;
      }

      for (var key in authData) {
        this._logOutWith(key);
      }
    }

    /**
     * Deauthenticates a single provider (e.g. removing access tokens from the
     * Facebook SDK).
     * @method _logOutWith
     */
  }, {
    key: '_logOutWith',
    value: function _logOutWith(provider) {
      if (!this.isCurrent()) {
        return;
      }
      if (typeof provider === 'string') {
        provider = authProviders[provider];
      }
      if (provider && provider.deauthenticate) {
        provider.deauthenticate();
      }
    }

    /**
     * Returns true if <code>current</code> would return this user.
     * @method isCurrent
     * @return {Boolean}
     */
  }, {
    key: 'isCurrent',
    value: function isCurrent() {
      var current = ParseUser.current();
      return !!current && current.id === this.id;
    }

    /**
     * Returns get("username").
     * @method getUsername
     * @return {String}
     */
  }, {
    key: 'getUsername',
    value: function getUsername() {
      return this.get('username');
    }

    /**
     * Calls set("username", username, options) and returns the result.
     * @method setUsername
     * @param {String} username
     * @param {Object} options A Backbone-style options object.
     * @return {Boolean}
     */
  }, {
    key: 'setUsername',
    value: function setUsername(username) {
      // Strip anonymity, even we do not support anonymous user in js SDK, we may
      // encounter anonymous user created by android/iOS in cloud code.
      var authData = this.get('authData');
      if (authData && authData.hasOwnProperty('anonymous')) {
        // We need to set anonymous to null instead of deleting it in order to remove it from Parse.
        authData.anonymous = null;
      }
      this.set('username', username);
    }

    /**
     * Calls set("password", password, options) and returns the result.
     * @method setPassword
     * @param {String} password
     * @param {Object} options A Backbone-style options object.
     * @return {Boolean}
     */
  }, {
    key: 'setPassword',
    value: function setPassword(password) {
      this.set('password', password);
    }

    /**
     * Returns get("email").
     * @method getEmail
     * @return {String}
     */
  }, {
    key: 'getEmail',
    value: function getEmail() {
      return this.get('email');
    }

    /**
     * Calls set("email", email, options) and returns the result.
     * @method setEmail
     * @param {String} email
     * @param {Object} options A Backbone-style options object.
     * @return {Boolean}
     */
  }, {
    key: 'setEmail',
    value: function setEmail(email) {
      this.set('email', email);
    }

    /**
     * Returns the session token for this user, if the user has been logged in,
     * or if it is the result of a query with the master key. Otherwise, returns
     * undefined.
     * @method getSessionToken
     * @return {String} the session token, or undefined
     */
  }, {
    key: 'getSessionToken',
    value: function getSessionToken() {
      return this.get('sessionToken');
    }

    /**
     * Checks whether this user is the current user and has been authenticated.
     * @method authenticated
     * @return (Boolean) whether this user is the current user and is logged in.
     */
  }, {
    key: 'authenticated',
    value: function authenticated() {
      var current = ParseUser.current();
      return !!this.get('sessionToken') && !!current && current.id === this.id;
    }

    /**
     * Signs up a new user. You should call this instead of save for
     * new Parse.Users. This will create a new Parse.User on the server, and
     * also persist the session on disk so that you can access the user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling signUp.</p>
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @method signUp
     * @param {Object} attrs Extra fields to set on the new user, or null.
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is fulfilled when the signup
     *     finishes.
     */
  }, {
    key: 'signUp',
    value: function signUp(attrs, options) {
      options = options || {};

      var signupOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        signupOptions.useMasterKey = options.useMasterKey;
      }

      var controller = _CoreManager2['default'].getUserController();
      return controller.signUp(this, attrs, signupOptions)._thenRunCallbacks(options, this);
    }

    /**
     * Logs in a Parse.User. On success, this saves the session to disk,
     * so you can retrieve the currently logged in user using
     * <code>current</code>.
     *
     * <p>A username and password must be set before calling logIn.</p>
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @method logIn
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} A promise that is fulfilled with the user when
     *     the login is complete.
     */
  }, {
    key: 'logIn',
    value: function logIn(options) {
      options = options || {};

      var loginOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        loginOptions.useMasterKey = options.useMasterKey;
      }

      var controller = _CoreManager2['default'].getUserController();
      return controller.logIn(this, loginOptions)._thenRunCallbacks(options, this);
    }

    /**
     * Wrap the default save behavior with functionality to save to local
     * storage if this is current user.
     */
  }, {
    key: 'save',
    value: function save() {
      var _this3 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _get(Object.getPrototypeOf(ParseUser.prototype), 'save', this).apply(this, args).then(function () {
        if (_this3.isCurrent()) {
          return _CoreManager2['default'].getUserController().updateUserOnDisk(_this3);
        }
        return _this3;
      });
    }

    /**
     * Wrap the default fetch behavior with functionality to save to local
     * storage if this is current user.
     */
  }, {
    key: 'fetch',
    value: function fetch() {
      var _this4 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return _get(Object.getPrototypeOf(ParseUser.prototype), 'fetch', this).apply(this, args).then(function () {
        if (_this4.isCurrent()) {
          return _CoreManager2['default'].getUserController().updateUserOnDisk(_this4);
        }
        return _this4;
      });
    }
  }], [{
    key: 'readOnlyAttributes',
    value: function readOnlyAttributes() {
      return ['sessionToken'];
    }

    /**
     * Adds functionality to the existing Parse.User class
     * @method extend
     * @param {Object} protoProps A set of properties to add to the prototype
     * @param {Object} classProps A set of static properties to add to the class
     * @static
     * @return {Class} The newly extended Parse.User class
     */
  }, {
    key: 'extend',
    value: function extend(protoProps, classProps) {
      if (protoProps) {
        for (var prop in protoProps) {
          if (prop !== 'className') {
            _Object$defineProperty(ParseUser.prototype, prop, {
              value: protoProps[prop],
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
        }
      }

      if (classProps) {
        for (var prop in classProps) {
          if (prop !== 'className') {
            _Object$defineProperty(ParseUser, prop, {
              value: classProps[prop],
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
        }
      }

      return ParseUser;
    }

    /**
     * Retrieves the currently logged in ParseUser with a valid session,
     * either from memory or localStorage, if necessary.
     * @method current
     * @static
     * @return {Parse.Object} The currently logged in Parse.User.
     */
  }, {
    key: 'current',
    value: function current() {
      if (!canUseCurrentUser) {
        return null;
      }
      var controller = _CoreManager2['default'].getUserController();
      return controller.currentUser();
    }

    /**
     * Retrieves the currently logged in ParseUser from asynchronous Storage.
     * @method currentAsync
     * @static
     * @return {Parse.Promise} A Promise that is resolved with the currently
     *   logged in Parse User
     */
  }, {
    key: 'currentAsync',
    value: function currentAsync() {
      if (!canUseCurrentUser) {
        return _ParsePromise2['default'].as(null);
      }
      var controller = _CoreManager2['default'].getUserController();
      return controller.currentUserAsync();
    }

    /**
     * Signs up a new user with a username (or email) and password.
     * This will create a new Parse.User on the server, and also persist the
     * session in localStorage so that you can access the user using
     * {@link #current}.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @method signUp
     * @param {String} username The username (or email) to sign up with.
     * @param {String} password The password to sign up with.
     * @param {Object} attrs Extra fields to set on the new user.
     * @param {Object} options A Backbone-style options object.
     * @static
     * @return {Parse.Promise} A promise that is fulfilled with the user when
     *     the signup completes.
     */
  }, {
    key: 'signUp',
    value: function signUp(username, password, attrs, options) {
      attrs = attrs || {};
      attrs.username = username;
      attrs.password = password;
      var user = new ParseUser(attrs);
      return user.signUp({}, options);
    }

    /**
     * Logs in a user with a username (or email) and password. On success, this
     * saves the session to disk, so you can retrieve the currently logged in
     * user using <code>current</code>.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @method logIn
     * @param {String} username The username (or email) to log in with.
     * @param {String} password The password to log in with.
     * @param {Object} options A Backbone-style options object.
     * @static
     * @return {Parse.Promise} A promise that is fulfilled with the user when
     *     the login completes.
     */
  }, {
    key: 'logIn',
    value: function logIn(username, password, options) {
      var user = new ParseUser();
      user._finishFetch({ username: username, password: password });
      return user.logIn(options);
    }

    /**
     * Logs in a user with a session token. On success, this saves the session
     * to disk, so you can retrieve the currently logged in user using
     * <code>current</code>.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @method become
     * @param {String} sessionToken The sessionToken to log in with.
     * @param {Object} options A Backbone-style options object.
     * @static
     * @return {Parse.Promise} A promise that is fulfilled with the user when
     *     the login completes.
     */
  }, {
    key: 'become',
    value: function become(sessionToken, options) {
      if (!canUseCurrentUser) {
        throw new Error('It is not memory-safe to become a user in a server environment');
      }
      options = options || {};

      var becomeOptions = {
        sessionToken: sessionToken
      };
      if (options.hasOwnProperty('useMasterKey')) {
        becomeOptions.useMasterKey = options.useMasterKey;
      }

      var controller = _CoreManager2['default'].getUserController();
      return controller.become(becomeOptions)._thenRunCallbacks(options);
    }
  }, {
    key: 'logInWith',
    value: function logInWith(provider, options) {
      return ParseUser._logInWith(provider, options);
    }

    /**
     * Logs out the currently logged in user session. This will remove the
     * session from disk, log out of linked services, and future calls to
     * <code>current</code> will return <code>null</code>.
     * @method logOut
     * @static
     * @return {Parse.Promise} A promise that is resolved when the session is
     *   destroyed on the server.
     */
  }, {
    key: 'logOut',
    value: function logOut() {
      if (!canUseCurrentUser) {
        throw new Error('There is no current user user on a node.js server environment.');
      }

      var controller = _CoreManager2['default'].getUserController();
      return controller.logOut();
    }

    /**
     * Requests a password reset email to be sent to the specified email address
     * associated with the user account. This email allows the user to securely
     * reset their password on the Parse site.
     *
     * <p>Calls options.success or options.error on completion.</p>
     *
     * @method requestPasswordReset
     * @param {String} email The email address associated with the user that
     *     forgot their password.
     * @param {Object} options A Backbone-style options object.
     * @static
     */
  }, {
    key: 'requestPasswordReset',
    value: function requestPasswordReset(email, options) {
      options = options || {};

      var requestOptions = {};
      if (options.hasOwnProperty('useMasterKey')) {
        requestOptions.useMasterKey = options.useMasterKey;
      }

      var controller = _CoreManager2['default'].getUserController();
      return controller.requestPasswordReset(email, requestOptions)._thenRunCallbacks(options);
    }

    /**
     * Allow someone to define a custom User class without className
     * being rewritten to _User. The default behavior is to rewrite
     * User to _User for legacy reasons. This allows developers to
     * override that behavior.
     *
     * @method allowCustomUserClass
     * @param {Boolean} isAllowed Whether or not to allow custom User class
     * @static
     */
  }, {
    key: 'allowCustomUserClass',
    value: function allowCustomUserClass(isAllowed) {
      _CoreManager2['default'].set('PERFORM_USER_REWRITE', !isAllowed);
    }

    /**
     * Allows a legacy application to start using revocable sessions. If the
     * current session token is not revocable, a request will be made for a new,
     * revocable session.
     * It is not necessary to call this method from cloud code unless you are
     * handling user signup or login from the server side. In a cloud code call,
     * this function will not attempt to upgrade the current token.
     * @method enableRevocableSession
     * @param {Object} options A Backbone-style options object.
     * @static
     * @return {Parse.Promise} A promise that is resolved when the process has
     *   completed. If a replacement session token is requested, the promise
     *   will be resolved after a new token has been fetched.
     */
  }, {
    key: 'enableRevocableSession',
    value: function enableRevocableSession(options) {
      options = options || {};
      _CoreManager2['default'].set('FORCE_REVOCABLE_SESSION', true);
      if (canUseCurrentUser) {
        var current = ParseUser.current();
        if (current) {
          return current._upgradeToRevocableSession(options);
        }
      }
      return _ParsePromise2['default'].as()._thenRunCallbacks(options);
    }

    /**
     * Enables the use of become or the current user in a server
     * environment. These features are disabled by default, since they depend on
     * global objects that are not memory-safe for most servers.
     * @method enableUnsafeCurrentUser
     * @static
     */
  }, {
    key: 'enableUnsafeCurrentUser',
    value: function enableUnsafeCurrentUser() {
      canUseCurrentUser = true;
    }

    /**
     * Disables the use of become or the current user in any environment.
     * These features are disabled on servers by default, since they depend on
     * global objects that are not memory-safe for most servers.
     * @method disableUnsafeCurrentUser
     * @static
     */
  }, {
    key: 'disableUnsafeCurrentUser',
    value: function disableUnsafeCurrentUser() {
      canUseCurrentUser = false;
    }
  }, {
    key: '_registerAuthenticationProvider',
    value: function _registerAuthenticationProvider(provider) {
      authProviders[provider.getAuthType()] = provider;
      // Synchronize the current user with the auth provider.
      ParseUser.currentAsync().then(function (current) {
        if (current) {
          current._synchronizeAuthData(provider.getAuthType());
        }
      });
    }
  }, {
    key: '_logInWith',
    value: function _logInWith(provider, options) {
      var user = new ParseUser();
      return user._linkWith(provider, options);
    }
  }, {
    key: '_clearCache',
    value: function _clearCache() {
      currentUserCache = null;
      currentUserCacheMatchesDisk = false;
    }
  }, {
    key: '_setCurrentUserCache',
    value: function _setCurrentUserCache(user) {
      currentUserCache = user;
    }
  }]);

  return ParseUser;
})(_ParseObject3['default']);

exports['default'] = ParseUser;

_ParseObject3['default'].registerSubclass('_User', ParseUser);

var DefaultController = {
  updateUserOnDisk: function updateUserOnDisk(user) {
    var path = _Storage2['default'].generatePath(CURRENT_USER_KEY);
    var json = user.toJSON();
    json.className = '_User';
    return _Storage2['default'].setItemAsync(path, JSON.stringify(json)).then(function () {
      return user;
    });
  },

  setCurrentUser: function setCurrentUser(user) {
    currentUserCache = user;
    user._cleanupAuthData();
    user._synchronizeAllAuthData();
    return DefaultController.updateUserOnDisk(user);
  },

  currentUser: function currentUser() {
    if (currentUserCache) {
      return currentUserCache;
    }
    if (currentUserCacheMatchesDisk) {
      return null;
    }
    if (_Storage2['default'].async()) {
      throw new Error('Cannot call currentUser() when using a platform with an async ' + 'storage system. Call currentUserAsync() instead.');
    }
    var path = _Storage2['default'].generatePath(CURRENT_USER_KEY);
    var userData = _Storage2['default'].getItem(path);
    currentUserCacheMatchesDisk = true;
    if (!userData) {
      currentUserCache = null;
      return null;
    }
    userData = JSON.parse(userData);
    if (!userData.className) {
      userData.className = '_User';
    }
    if (userData._id) {
      if (userData.objectId !== userData._id) {
        userData.objectId = userData._id;
      }
      delete userData._id;
    }
    if (userData._sessionToken) {
      userData.sessionToken = userData._sessionToken;
      delete userData._sessionToken;
    }
    var current = _ParseObject3['default'].fromJSON(userData);
    currentUserCache = current;
    current._synchronizeAllAuthData();
    return current;
  },

  currentUserAsync: function currentUserAsync() {
    if (currentUserCache) {
      return _ParsePromise2['default'].as(currentUserCache);
    }
    if (currentUserCacheMatchesDisk) {
      return _ParsePromise2['default'].as(null);
    }
    var path = _Storage2['default'].generatePath(CURRENT_USER_KEY);
    return _Storage2['default'].getItemAsync(path).then(function (userData) {
      currentUserCacheMatchesDisk = true;
      if (!userData) {
        currentUserCache = null;
        return _ParsePromise2['default'].as(null);
      }
      userData = JSON.parse(userData);
      if (!userData.className) {
        userData.className = '_User';
      }
      if (userData._id) {
        if (userData.objectId !== userData._id) {
          userData.objectId = userData._id;
        }
        delete userData._id;
      }
      if (userData._sessionToken) {
        userData.sessionToken = userData._sessionToken;
        delete userData._sessionToken;
      }
      var current = _ParseObject3['default'].fromJSON(userData);
      currentUserCache = current;
      current._synchronizeAllAuthData();
      return _ParsePromise2['default'].as(current);
    });
  },

  signUp: function signUp(user, attrs, options) {
    var username = attrs && attrs.username || user.get('username');
    var password = attrs && attrs.password || user.get('password');

    if (!username || !username.length) {
      return _ParsePromise2['default'].error(new _ParseError2['default'](_ParseError2['default'].OTHER_CAUSE, 'Cannot sign up user with an empty name.'));
    }
    if (!password || !password.length) {
      return _ParsePromise2['default'].error(new _ParseError2['default'](_ParseError2['default'].OTHER_CAUSE, 'Cannot sign up user with an empty password.'));
    }

    return user.save(attrs, options).then(function () {
      // Clear the password field
      user._finishFetch({ password: undefined });

      if (canUseCurrentUser) {
        return DefaultController.setCurrentUser(user);
      }
      return user;
    });
  },

  logIn: function logIn(user, options) {
    var RESTController = _CoreManager2['default'].getRESTController();
    var auth = {
      username: user.get('username'),
      password: user.get('password')
    };
    return RESTController.request('GET', 'login', auth, options).then(function (response, status) {
      user._migrateId(response.objectId);
      user._setExisted(true);
      ObjectState.setPendingOp(user.className, user._getId(), 'username', undefined);
      ObjectState.setPendingOp(user.className, user._getId(), 'password', undefined);
      response.password = undefined;
      user._finishFetch(response);
      if (!canUseCurrentUser) {
        // We can't set the current user, so just return the one we logged in
        return _ParsePromise2['default'].as(user);
      }
      return DefaultController.setCurrentUser(user);
    });
  },

  become: function become(options) {
    var user = new ParseUser();
    var RESTController = _CoreManager2['default'].getRESTController();
    return RESTController.request('GET', 'users/me', {}, options).then(function (response, status) {
      user._finishFetch(response);
      user._setExisted(true);
      return DefaultController.setCurrentUser(user);
    });
  },

  logOut: function logOut() {
    return DefaultController.currentUserAsync().then(function (currentUser) {
      var path = _Storage2['default'].generatePath(CURRENT_USER_KEY);
      var promise = _Storage2['default'].removeItemAsync(path);
      var RESTController = _CoreManager2['default'].getRESTController();
      if (currentUser !== null) {
        var currentSession = currentUser.getSessionToken();
        if (currentSession && (0, _isRevocableSession2['default'])(currentSession)) {
          promise = promise.then(function () {
            return RESTController.request('POST', 'logout', {}, { sessionToken: currentSession });
          });
        }
        currentUser._logOutWithAll();
        currentUser._finishFetch({ sessionToken: undefined });
      }
      currentUserCacheMatchesDisk = true;
      currentUserCache = null;

      return promise;
    });
  },

  requestPasswordReset: function requestPasswordReset(email, options) {
    var RESTController = _CoreManager2['default'].getRESTController();
    return RESTController.request('POST', 'requestPasswordReset', { email: email }, options);
  },

  upgradeToRevocableSession: function upgradeToRevocableSession(user, options) {
    var token = user.getSessionToken();
    if (!token) {
      return _ParsePromise2['default'].error(new _ParseError2['default'](_ParseError2['default'].SESSION_MISSING, 'Cannot upgrade a user with no session token'));
    }

    options.sessionToken = token;

    var RESTController = _CoreManager2['default'].getRESTController();
    return RESTController.request('POST', 'upgradeToRevocableSession', {}, options).then(function (result) {
      var session = new _ParseSession2['default']();
      session._finishFetch(result);
      user._finishFetch({ sessionToken: session.getSessionToken() });
      if (user.isCurrent()) {
        return DefaultController.setCurrentUser(user);
      }
      return _ParsePromise2['default'].as(user);
    });
  },

  linkWith: function linkWith(user, authData) {
    return user.save({ authData: authData }).then(function () {
      if (canUseCurrentUser) {
        return DefaultController.setCurrentUser(user);
      }
      return user;
    });
  }
};

_CoreManager2['default'].setUserController(DefaultController);
module.exports = exports['default'];
},{"./CoreManager":3,"./ObjectState":6,"./ParseError":10,"./ParseObject":14,"./ParsePromise":16,"./ParseSession":20,"./Storage":24,"./isRevocableSession":33,"babel-runtime/core-js/object/define-property":38,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/get":45,"babel-runtime/helpers/inherits":46,"babel-runtime/helpers/interop-require-default":47,"babel-runtime/helpers/interop-require-wildcard":48}],22:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.send = send;

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _ParseQuery = _dereq_('./ParseQuery');

var _ParseQuery2 = _interopRequireDefault(_ParseQuery);

/**
 * Contains functions to deal with Push in Parse.
 * @class Parse.Push
 * @static
 */

/**
 * Sends a push notification.
 * @method send
 * @param {Object} data -  The data of the push notification.  Valid fields
 * are:
 *   <ol>
 *     <li>channels - An Array of channels to push to.</li>
 *     <li>push_time - A Date object for when to send the push.</li>
 *     <li>expiration_time -  A Date object for when to expire
 *         the push.</li>
 *     <li>expiration_interval - The seconds from now to expire the push.</li>
 *     <li>where - A Parse.Query over Parse.Installation that is used to match
 *         a set of installations to push to.</li>
 *     <li>data - The data to send as part of the push</li>
 *   <ol>
 * @param {Object} options An object that has an optional success function,
 * that takes no arguments and will be called on a successful push, and
 * an error function that takes a Parse.Error and will be called if the push
 * failed.
 * @return {Parse.Promise} A promise that is fulfilled when the push request
 *     completes.
 */

function send(data, options) {
  options = options || {};

  if (data.where && data.where instanceof _ParseQuery2['default']) {
    data.where = data.where.toJSON().where;
  }

  if (data.push_time && typeof data.push_time === 'object') {
    data.push_time = data.push_time.toJSON();
  }

  if (data.expiration_time && typeof data.expiration_time === 'object') {
    data.expiration_time = data.expiration_time.toJSON();
  }

  if (data.expiration_time && data.expiration_interval) {
    throw new Error('expiration_time and expiration_interval cannot both be set.');
  }

  return _CoreManager2['default'].getPushController().send(data, {
    useMasterKey: options.useMasterKey
  })._thenRunCallbacks(options);
}

_CoreManager2['default'].setPushController({
  send: function send(data, options) {
    var RESTController = _CoreManager2['default'].getRESTController();

    var request = RESTController.request('POST', 'push', data, { useMasterKey: !!options.useMasterKey });

    return request._thenRunCallbacks(options);
  }
});
},{"./CoreManager":3,"./ParseQuery":17,"babel-runtime/helpers/interop-require-default":47}],23:[function(_dereq_,module,exports){
(function (process){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _ParseError = _dereq_('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

var _Storage = _dereq_('./Storage');

var _Storage2 = _interopRequireDefault(_Storage);

var XHR = null;
if (typeof XMLHttpRequest !== 'undefined') {
  XHR = XMLHttpRequest;
}

var useXDomainRequest = false;
if (typeof XDomainRequest !== 'undefined' && !('withCredentials' in new XMLHttpRequest())) {
  useXDomainRequest = true;
}

function ajaxIE9(method, url, data) {
  var promise = new _ParsePromise2['default']();
  var xdr = new XDomainRequest();
  xdr.onload = function () {
    var response;
    try {
      response = JSON.parse(xdr.responseText);
    } catch (e) {
      promise.reject(e);
    }
    if (response) {
      promise.resolve(response);
    }
  };
  xdr.onerror = xdr.ontimeout = function () {
    // Let's fake a real error message.
    var fakeResponse = {
      responseText: JSON.stringify({
        code: _ParseError2['default'].X_DOMAIN_REQUEST,
        error: 'IE\'s XDomainRequest does not supply error info.'
      })
    };
    promise.reject(fakeResponse);
  };
  xdr.onprogress = function () {};
  xdr.open(method, url);
  xdr.send(data);
  return promise;
}

var RESTController = {
  ajax: function ajax(method, url, data, headers) {
    if (useXDomainRequest) {
      return ajaxIE9(method, url, data, headers);
    }

    var promise = new _ParsePromise2['default']();
    var attempts = 0;

    var dispatch = function dispatch() {
      if (XHR == null) {
        throw new Error('Cannot make a request: No definition of XMLHttpRequest was found.');
      }
      var handled = false;
      var xhr = new XHR();

      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4 || handled) {
          return;
        }
        handled = true;

        if (xhr.status >= 200 && xhr.status < 300) {
          var response;
          try {
            response = JSON.parse(xhr.responseText);
          } catch (e) {
            promise.reject(e.toString());
          }
          if (response) {
            promise.resolve(response, xhr.status, xhr);
          }
        } else if (xhr.status >= 500 || xhr.status === 0) {
          // retry on 5XX or node-xmlhttprequest error
          if (++attempts < _CoreManager2['default'].get('REQUEST_ATTEMPT_LIMIT')) {
            // Exponentially-growing random delay
            var delay = Math.round(Math.random() * 125 * Math.pow(2, attempts));
            setTimeout(dispatch, delay);
          } else if (xhr.status === 0) {
            promise.reject('Unable to connect to the Parse API');
          } else {
            // After the retry limit is reached, fail
            promise.reject(xhr);
          }
        } else {
          promise.reject(xhr);
        }
      };

      headers = headers || {};
      headers['Content-Type'] = 'text/plain'; // Avoid pre-flight
      if (_CoreManager2['default'].get('IS_NODE')) {
        headers['User-Agent'] = 'Parse/' + _CoreManager2['default'].get('VERSION') + ' (NodeJS ' + process.versions.node + ')';
      }

      xhr.open(method, url, true);
      for (var h in headers) {
        xhr.setRequestHeader(h, headers[h]);
      }
      xhr.send(data);
    };
    dispatch();

    return promise;
  },

  request: function request(method, path, data, options) {
    options = options || {};
    var url = _CoreManager2['default'].get('SERVER_URL');
    if (url[url.length - 1] !== '/') {
      url += '/';
    }
    url += path;

    var payload = {};
    if (data && typeof data === 'object') {
      for (var k in data) {
        payload[k] = data[k];
      }
    }

    if (method !== 'POST') {
      payload._method = method;
      method = 'POST';
    }

    payload._ApplicationId = _CoreManager2['default'].get('APPLICATION_ID');
    payload._JavaScriptKey = _CoreManager2['default'].get('JAVASCRIPT_KEY');
    payload._ClientVersion = _CoreManager2['default'].get('VERSION');

    var useMasterKey = options.useMasterKey;
    if (typeof useMasterKey === 'undefined') {
      useMasterKey = _CoreManager2['default'].get('USE_MASTER_KEY');
    }
    if (useMasterKey) {
      if (_CoreManager2['default'].get('MASTER_KEY')) {
        delete payload._JavaScriptKey;
        payload._MasterKey = _CoreManager2['default'].get('MASTER_KEY');
      } else {
        throw new Error('Cannot use the Master Key, it has not been provided.');
      }
    }

    if (_CoreManager2['default'].get('FORCE_REVOCABLE_SESSION')) {
      payload._RevocableSession = '1';
    }

    var installationController = _CoreManager2['default'].getInstallationController();

    return installationController.currentInstallationId().then(function (iid) {
      payload._InstallationId = iid;
      var userController = _CoreManager2['default'].getUserController();
      if (options && typeof options.sessionToken === 'string') {
        return _ParsePromise2['default'].as(options.sessionToken);
      } else if (userController) {
        return userController.currentUserAsync().then(function (user) {
          if (user) {
            return _ParsePromise2['default'].as(user.getSessionToken());
          }
          return _ParsePromise2['default'].as(null);
        });
      }
      return _ParsePromise2['default'].as(null);
    }).then(function (token) {
      if (token) {
        payload._SessionToken = token;
      }

      var payloadString = JSON.stringify(payload);

      return RESTController.ajax(method, url, payloadString);
    }).then(null, function (response) {
      // Transform the error into an instance of ParseError by trying to parse
      // the error string as JSON
      var error;
      if (response && response.responseText) {
        try {
          var errorJSON = JSON.parse(response.responseText);
          error = new _ParseError2['default'](errorJSON.code, errorJSON.error);
        } catch (e) {
          // If we fail to parse the error text, that's okay.
          error = new _ParseError2['default'](_ParseError2['default'].INVALID_JSON, 'Received an error with invalid JSON from Parse: ' + response.responseText);
        }
      } else {
        error = new _ParseError2['default'](_ParseError2['default'].CONNECTION_FAILED, 'XMLHttpRequest failed: ' + JSON.stringify(response));
      }

      return _ParsePromise2['default'].error(error);
    });
  },

  _setXHR: function _setXHR(xhr) {
    XHR = xhr;
  }
};

module.exports = RESTController;
}).call(this,_dereq_('_process'))
},{"./CoreManager":3,"./ParseError":10,"./ParsePromise":16,"./Storage":24,"_process":75,"babel-runtime/helpers/interop-require-default":47}],24:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

var _CoreManager = _dereq_('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

module.exports = {
  async: function async() {
    var controller = _CoreManager2['default'].getStorageController();
    return !!controller.async;
  },

  getItem: function getItem(path) {
    var controller = _CoreManager2['default'].getStorageController();
    if (controller.async === 1) {
      throw new Error('Synchronous storage is not supported by the current storage controller');
    }
    return controller.getItem(path);
  },

  getItemAsync: function getItemAsync(path) {
    var controller = _CoreManager2['default'].getStorageController();
    if (controller.async === 1) {
      return controller.getItemAsync(path);
    }
    return _ParsePromise2['default'].as(controller.getItem(path));
  },

  setItem: function setItem(path, value) {
    var controller = _CoreManager2['default'].getStorageController();
    if (controller.async === 1) {
      throw new Error('Synchronous storage is not supported by the current storage controller');
    }
    return controller.setItem(path, value);
  },

  setItemAsync: function setItemAsync(path, value) {
    var controller = _CoreManager2['default'].getStorageController();
    if (controller.async === 1) {
      return controller.setItemAsync(path, value);
    }
    return _ParsePromise2['default'].as(controller.setItem(path, value));
  },

  removeItem: function removeItem(path) {
    var controller = _CoreManager2['default'].getStorageController();
    if (controller.async === 1) {
      throw new Error('Synchronous storage is not supported by the current storage controller');
    }
    return controller.removeItem(path);
  },

  removeItemAsync: function removeItemAsync(path) {
    var controller = _CoreManager2['default'].getStorageController();
    if (controller.async === 1) {
      return controller.removeItemAsync(path);
    }
    return _ParsePromise2['default'].as(controller.removeItem(path));
  },

  generatePath: function generatePath(path) {
    if (!_CoreManager2['default'].get('APPLICATION_ID')) {
      throw new Error('You need to call Parse.initialize before using Parse.');
    }
    if (typeof path !== 'string') {
      throw new Error('Tried to get a Storage path that was not a String.');
    }
    if (path[0] === '/') {
      path = path.substr(1);
    }
    return 'Parse/' + _CoreManager2['default'].get('APPLICATION_ID') + '/' + path;
  },

  _clear: function _clear() {
    var controller = _CoreManager2['default'].getStorageController();
    if (controller.hasOwnProperty('clear')) {
      controller.clear();
    }
  }
};

_CoreManager2['default'].setStorageController(_dereq_('./StorageController.browser'));
},{"./CoreManager":3,"./ParsePromise":16,"./StorageController.browser":25,"babel-runtime/helpers/interop-require-default":47}],25:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

module.exports = {
  async: 0,

  getItem: function getItem(path) {
    return localStorage.getItem(path);
  },

  setItem: function setItem(path, value) {
    try {
      localStorage.setItem(path, value);
    } catch (e) {
      // Quota exceeded, possibly due to Safari Private Browsing mode
    }
  },

  removeItem: function removeItem(path) {
    localStorage.removeItem(path);
  },

  clear: function clear() {
    localStorage.clear();
  }
};
},{"./ParsePromise":16,"babel-runtime/helpers/interop-require-default":47}],26:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _createClass = _dereq_('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = _dereq_('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

var _ParsePromise = _dereq_('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

module.exports = (function () {
  function TaskQueue() {
    _classCallCheck(this, TaskQueue);

    this.queue = [];
  }

  _createClass(TaskQueue, [{
    key: 'enqueue',
    value: function enqueue(task) {
      var _this = this;

      var taskComplete = new _ParsePromise2['default']();
      this.queue.push({
        task: task,
        _completion: taskComplete
      });
      if (this.queue.length === 1) {
        task().then(function () {
          _this._dequeue();
          taskComplete.resolve();
        }, function (error) {
          _this._dequeue();
          taskComplete.reject(error);
        });
      }
      return taskComplete;
    }
  }, {
    key: '_dequeue',
    value: function _dequeue() {
      var _this2 = this;

      this.queue.shift();
      if (this.queue.length) {
        var next = this.queue[0];
        next.task().then(function () {
          _this2._dequeue();
          next._completion.resolve();
        }, function (error) {
          _this2._dequeue();
          next._completion.reject(error);
        });
      }
    }
  }]);

  return TaskQueue;
})();
},{"./ParsePromise":16,"babel-runtime/helpers/class-call-check":43,"babel-runtime/helpers/create-class":44,"babel-runtime/helpers/interop-require-default":47}],27:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = arrayContainsObject;

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

function arrayContainsObject(array, object) {
  if (array.indexOf(object) > -1) {
    return true;
  }
  for (var i = 0; i < array.length; i++) {
    if (array[i] instanceof _ParseObject2['default'] && array[i].className === object.className && array[i]._getId() === object._getId()) {
      return true;
    }
  }
  return false;
}

module.exports = exports['default'];
},{"./ParseObject":14,"babel-runtime/helpers/interop-require-default":47}],28:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = canBeSerialized;

var _ParseFile = _dereq_('./ParseFile');

var _ParseFile2 = _interopRequireDefault(_ParseFile);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

var _ParseRelation = _dereq_('./ParseRelation');

var _ParseRelation2 = _interopRequireDefault(_ParseRelation);

function canBeSerialized(obj) {
  if (!(obj instanceof _ParseObject2['default'])) {
    return true;
  }
  var attributes = obj.attributes;
  for (var attr in attributes) {
    var val = attributes[attr];
    if (!canBeSerializedHelper(val)) {
      return false;
    }
  }
  return true;
}

function canBeSerializedHelper(value) {
  if (typeof value !== 'object') {
    return true;
  }
  if (value instanceof _ParseRelation2['default']) {
    return true;
  }
  if (value instanceof _ParseObject2['default']) {
    return !!value.id;
  }
  if (value instanceof _ParseFile2['default']) {
    if (value.url()) {
      return true;
    }
    return false;
  }
  if (Array.isArray(value)) {
    for (var i = 0; i < value.length; i++) {
      if (!canBeSerializedHelper(value[i])) {
        return false;
      }
    }
    return true;
  }
  for (var k in value) {
    if (!canBeSerializedHelper(value[k])) {
      return false;
    }
  }
  return true;
}
module.exports = exports['default'];
},{"./ParseFile":11,"./ParseObject":14,"./ParseRelation":18,"babel-runtime/helpers/interop-require-default":47}],29:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = decode;

var _ParseACL = _dereq_('./ParseACL');

var _ParseACL2 = _interopRequireDefault(_ParseACL);

var _ParseFile = _dereq_('./ParseFile');

var _ParseFile2 = _interopRequireDefault(_ParseFile);

var _ParseGeoPoint = _dereq_('./ParseGeoPoint');

var _ParseGeoPoint2 = _interopRequireDefault(_ParseGeoPoint);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

var _ParseOp = _dereq_('./ParseOp');

var _ParseRelation = _dereq_('./ParseRelation');

var _ParseRelation2 = _interopRequireDefault(_ParseRelation);

function decode(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    var dup = [];
    value.forEach(function (v, i) {
      dup[i] = decode(v);
    });
    return dup;
  }
  if (typeof value.__op === 'string') {
    return (0, _ParseOp.opFromJSON)(value);
  }
  if (value.__type === 'Pointer' && value.className) {
    return _ParseObject2['default'].fromJSON(value);
  }
  if (value.__type === 'Object' && value.className) {
    return _ParseObject2['default'].fromJSON(value);
  }
  if (value.__type === 'Relation') {
    // The parent and key fields will be populated by the parent
    var relation = new _ParseRelation2['default'](null, null);
    relation.targetClassName = value.className;
    return relation;
  }
  if (value.__type === 'Date') {
    return new Date(value.iso);
  }
  if (value.__type === 'File') {
    return _ParseFile2['default'].fromJSON(value);
  }
  if (value.__type === 'GeoPoint') {
    return new _ParseGeoPoint2['default']({
      latitude: value.latitude,
      longitude: value.longitude
    });
  }
  var copy = {};
  for (var k in value) {
    copy[k] = decode(value[k]);
  }
  return copy;
}

module.exports = exports['default'];
},{"./ParseACL":8,"./ParseFile":11,"./ParseGeoPoint":12,"./ParseObject":14,"./ParseOp":15,"./ParseRelation":18,"babel-runtime/helpers/interop-require-default":47}],30:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _Object$keys = _dereq_('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ParseACL = _dereq_('./ParseACL');

var _ParseACL2 = _interopRequireDefault(_ParseACL);

var _ParseFile = _dereq_('./ParseFile');

var _ParseFile2 = _interopRequireDefault(_ParseFile);

var _ParseGeoPoint = _dereq_('./ParseGeoPoint');

var _ParseGeoPoint2 = _interopRequireDefault(_ParseGeoPoint);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

var _ParseOp = _dereq_('./ParseOp');

var _ParseRelation = _dereq_('./ParseRelation');

var _ParseRelation2 = _interopRequireDefault(_ParseRelation);

var toString = Object.prototype.toString;

function encode(value, disallowObjects, forcePointers, seen) {
  if (value instanceof _ParseObject2['default']) {
    if (disallowObjects) {
      throw new Error('Parse Objects not allowed here');
    }
    var seenEntry = value.id ? value.className + ':' + value.id : value;
    if (forcePointers || !seen || seen.indexOf(seenEntry) > -1 || value.dirty() || _Object$keys(value._getServerData()).length < 1) {
      return value.toPointer();
    }
    seen = seen.concat(seenEntry);
    return value._toFullJSON(seen);
  }
  if (value instanceof _ParseOp.Op || value instanceof _ParseACL2['default'] || value instanceof _ParseGeoPoint2['default'] || value instanceof _ParseRelation2['default']) {
    return value.toJSON();
  }
  if (value instanceof _ParseFile2['default']) {
    if (!value.url()) {
      throw new Error('Tried to encode an unsaved file.');
    }
    return value.toJSON();
  }
  if (toString.call(value) === '[object Date]') {
    if (isNaN(value)) {
      throw new Error('Tried to encode an invalid date.');
    }
    return { __type: 'Date', iso: value.toJSON() };
  }
  if (toString.call(value) === '[object RegExp]' && typeof value.source === 'string') {
    return value.source;
  }

  if (Array.isArray(value)) {
    return value.map(function (v) {
      return encode(v, disallowObjects, forcePointers, seen);
    });
  }

  if (value && typeof value === 'object') {
    var output = {};
    for (var k in value) {
      output[k] = encode(value[k], disallowObjects, forcePointers, seen);
    }
    return output;
  }

  return value;
}

exports['default'] = function (value, disallowObjects, forcePointers, seen) {
  return encode(value, !!disallowObjects, !!forcePointers, seen || []);
};

module.exports = exports['default'];
},{"./ParseACL":8,"./ParseFile":11,"./ParseGeoPoint":12,"./ParseObject":14,"./ParseOp":15,"./ParseRelation":18,"babel-runtime/core-js/object/keys":41,"babel-runtime/helpers/interop-require-default":47}],31:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

var _Object$keys = _dereq_('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = equals;

var _ParseACL = _dereq_('./ParseACL');

var _ParseACL2 = _interopRequireDefault(_ParseACL);

var _ParseFile = _dereq_('./ParseFile');

var _ParseFile2 = _interopRequireDefault(_ParseFile);

var _ParseGeoPoint = _dereq_('./ParseGeoPoint');

var _ParseGeoPoint2 = _interopRequireDefault(_ParseGeoPoint);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

function equals(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }

  if (!a || typeof a !== 'object') {
    // a is a primitive
    return a === b;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
      return false;
    }
    if (a.length !== b.length) {
      return false;
    }
    for (var i = a.length; i--;) {
      if (!equals(a[i], b[i])) {
        return false;
      }
    }
    return true;
  }

  if (a instanceof _ParseACL2['default'] || a instanceof _ParseFile2['default'] || a instanceof _ParseGeoPoint2['default'] || a instanceof _ParseObject2['default']) {
    return a.equals(b);
  }

  if (_Object$keys(a).length !== _Object$keys(b).length) {
    return false;
  }
  for (var k in a) {
    if (!equals(a[k], b[k])) {
      return false;
    }
  }
  return true;
}

module.exports = exports['default'];
},{"./ParseACL":8,"./ParseFile":11,"./ParseGeoPoint":12,"./ParseObject":14,"babel-runtime/core-js/object/keys":41,"babel-runtime/helpers/interop-require-default":47}],32:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = escape;

function escape(str) {
  return str.replace(/[&<>\/'"]/g, function (char) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '/': '&#x2F;',
      '\'': '&#x27;',
      '"': '&quot;'
    })[char];
  });
}

module.exports = exports['default'];
},{}],33:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = isRevocableSession;

function isRevocableSession(token) {
  return token.indexOf('r:') > -1;
}

module.exports = exports['default'];
},{}],34:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = parseDate;

function parseDate(iso8601) {
  var regexp = new RegExp('^([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})' + 'T' + '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2})' + '(.([0-9]+))?' + 'Z$');
  var match = regexp.exec(iso8601);
  if (!match) {
    return null;
  }

  var year = match[1] || 0;
  var month = (match[2] || 1) - 1;
  var day = match[3] || 0;
  var hour = match[4] || 0;
  var minute = match[5] || 0;
  var second = match[6] || 0;
  var milli = match[8] || 0;

  return new Date(Date.UTC(year, month, day, hour, minute, second, milli));
}

module.exports = exports['default'];
},{}],35:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = unique;

var _arrayContainsObject = _dereq_('./arrayContainsObject');

var _arrayContainsObject2 = _interopRequireDefault(_arrayContainsObject);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

function unique(arr) {
  var uniques = [];
  arr.forEach(function (value) {
    if (value instanceof _ParseObject2['default']) {
      if (!(0, _arrayContainsObject2['default'])(uniques, value)) {
        uniques.push(value);
      }
    } else {
      if (uniques.indexOf(value) < 0) {
        uniques.push(value);
      }
    }
  });
  return uniques;
}

module.exports = exports['default'];
},{"./ParseObject":14,"./arrayContainsObject":27,"babel-runtime/helpers/interop-require-default":47}],36:[function(_dereq_,module,exports){
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

'use strict';

var _interopRequireDefault = _dereq_('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = unsavedChildren;

var _ParseFile = _dereq_('./ParseFile');

var _ParseFile2 = _interopRequireDefault(_ParseFile);

var _ParseObject = _dereq_('./ParseObject');

var _ParseObject2 = _interopRequireDefault(_ParseObject);

var _ParseRelation = _dereq_('./ParseRelation');

var _ParseRelation2 = _interopRequireDefault(_ParseRelation);

/**
 * Return an array of unsaved children, which are either Parse Objects or Files.
 * If it encounters any dirty Objects without Ids, it will throw an exception.
 */

function unsavedChildren(obj, allowDeepUnsaved) {
  var encountered = {
    objects: {},
    files: []
  };
  var identifier = obj.className + ':' + obj._getId();
  encountered.objects[identifier] = obj.dirty() ? obj : true;
  var attributes = obj.attributes;
  for (var attr in attributes) {
    if (typeof attributes[attr] === 'object') {
      traverse(attributes[attr], encountered, false, !!allowDeepUnsaved);
    }
  }
  var unsaved = [];
  for (var id in encountered.objects) {
    if (id !== identifier && encountered.objects[id] !== true) {
      unsaved.push(encountered.objects[id]);
    }
  }
  return unsaved.concat(encountered.files);
}

function traverse(obj, encountered, shouldThrow, allowDeepUnsaved) {
  if (obj instanceof _ParseObject2['default']) {
    if (!obj.id && shouldThrow) {
      throw new Error('Cannot create a pointer to an unsaved Object.');
    }
    var identifier = obj.className + ':' + obj._getId();
    if (!encountered.objects[identifier]) {
      encountered.objects[identifier] = obj.dirty() ? obj : true;
      var attributes = obj.attributes;
      for (var attr in attributes) {
        if (typeof attributes[attr] === 'object') {
          traverse(attributes[attr], encountered, !allowDeepUnsaved, allowDeepUnsaved);
        }
      }
    }
    return;
  }
  if (obj instanceof _ParseFile2['default']) {
    if (!obj.url() && encountered.files.indexOf(obj) < 0) {
      encountered.files.push(obj);
    }
    return;
  }
  if (obj instanceof _ParseRelation2['default']) {
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach(function (el) {
      traverse(el, encountered, shouldThrow, allowDeepUnsaved);
    });
  }
  for (var k in obj) {
    if (typeof obj[k] === 'object') {
      traverse(obj[k], encountered, shouldThrow, allowDeepUnsaved);
    }
  }
}
module.exports = exports['default'];
},{"./ParseFile":11,"./ParseObject":14,"./ParseRelation":18,"babel-runtime/helpers/interop-require-default":47}],37:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":49}],38:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":50}],39:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/freeze"), __esModule: true };
},{"core-js/library/fn/object/freeze":51}],40:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":52}],41:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":53}],42:[function(_dereq_,module,exports){
module.exports = { "default": _dereq_("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":54}],43:[function(_dereq_,module,exports){
"use strict";

exports["default"] = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

exports.__esModule = true;
},{}],44:[function(_dereq_,module,exports){
"use strict";

var _Object$defineProperty = _dereq_("babel-runtime/core-js/object/define-property")["default"];

exports["default"] = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;

      _Object$defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

exports.__esModule = true;
},{"babel-runtime/core-js/object/define-property":38}],45:[function(_dereq_,module,exports){
"use strict";

var _Object$getOwnPropertyDescriptor = _dereq_("babel-runtime/core-js/object/get-own-property-descriptor")["default"];

exports["default"] = function get(_x, _x2, _x3) {
  var _again = true;

  _function: while (_again) {
    var object = _x,
        property = _x2,
        receiver = _x3;
    _again = false;
    if (object === null) object = Function.prototype;

    var desc = _Object$getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        _x = parent;
        _x2 = property;
        _x3 = receiver;
        _again = true;
        desc = parent = undefined;
        continue _function;
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  }
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/get-own-property-descriptor":40}],46:[function(_dereq_,module,exports){
"use strict";

var _Object$create = _dereq_("babel-runtime/core-js/object/create")["default"];

var _Object$setPrototypeOf = _dereq_("babel-runtime/core-js/object/set-prototype-of")["default"];

exports["default"] = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = _Object$create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

exports.__esModule = true;
},{"babel-runtime/core-js/object/create":37,"babel-runtime/core-js/object/set-prototype-of":42}],47:[function(_dereq_,module,exports){
"use strict";

exports["default"] = function (obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
};

exports.__esModule = true;
},{}],48:[function(_dereq_,module,exports){
"use strict";

exports["default"] = function (obj) {
  if (obj && obj.__esModule) {
    return obj;
  } else {
    var newObj = {};

    if (obj != null) {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
      }
    }

    newObj["default"] = obj;
    return newObj;
  }
};

exports.__esModule = true;
},{}],49:[function(_dereq_,module,exports){
var $ = _dereq_('../../modules/$');
module.exports = function create(P, D){
  return $.create(P, D);
};
},{"../../modules/$":66}],50:[function(_dereq_,module,exports){
var $ = _dereq_('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":66}],51:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.freeze');
module.exports = _dereq_('../../modules/$.core').Object.freeze;
},{"../../modules/$.core":58,"../../modules/es6.object.freeze":71}],52:[function(_dereq_,module,exports){
var $ = _dereq_('../../modules/$');
_dereq_('../../modules/es6.object.get-own-property-descriptor');
module.exports = function getOwnPropertyDescriptor(it, key){
  return $.getDesc(it, key);
};
},{"../../modules/$":66,"../../modules/es6.object.get-own-property-descriptor":72}],53:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.keys');
module.exports = _dereq_('../../modules/$.core').Object.keys;
},{"../../modules/$.core":58,"../../modules/es6.object.keys":73}],54:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.object.set-prototype-of');
module.exports = _dereq_('../../modules/$.core').Object.setPrototypeOf;
},{"../../modules/$.core":58,"../../modules/es6.object.set-prototype-of":74}],55:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],56:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":65}],57:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],58:[function(_dereq_,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],59:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":55}],60:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],61:[function(_dereq_,module,exports){
var global    = _dereq_('./$.global')
  , core      = _dereq_('./$.core')
  , ctx       = _dereq_('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":58,"./$.ctx":59,"./$.global":63}],62:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],63:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],64:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":57}],65:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],66:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],67:[function(_dereq_,module,exports){
// most Object methods by ES6 should accept primitives
var $export = _dereq_('./$.export')
  , core    = _dereq_('./$.core')
  , fails   = _dereq_('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":58,"./$.export":61,"./$.fails":62}],68:[function(_dereq_,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = _dereq_('./$').getDesc
  , isObject = _dereq_('./$.is-object')
  , anObject = _dereq_('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = _dereq_('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":66,"./$.an-object":56,"./$.ctx":59,"./$.is-object":65}],69:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./$.iobject')
  , defined = _dereq_('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":60,"./$.iobject":64}],70:[function(_dereq_,module,exports){
// 7.1.13 ToObject(argument)
var defined = _dereq_('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":60}],71:[function(_dereq_,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = _dereq_('./$.is-object');

_dereq_('./$.object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(it) : it;
  };
});
},{"./$.is-object":65,"./$.object-sap":67}],72:[function(_dereq_,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = _dereq_('./$.to-iobject');

_dereq_('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":67,"./$.to-iobject":69}],73:[function(_dereq_,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = _dereq_('./$.to-object');

_dereq_('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":67,"./$.to-object":70}],74:[function(_dereq_,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = _dereq_('./$.export');
$export($export.S, 'Object', {setPrototypeOf: _dereq_('./$.set-proto').set});
},{"./$.export":61,"./$.set-proto":68}],75:[function(_dereq_,module,exports){

},{}]},{},[7])(7)
});
/*!
 * Bootstrap v3.3.4 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.4
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.4
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.4'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.4
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.4'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.4
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.4'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.4
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.4'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.4
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.4'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.4
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.4'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.4
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.4'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.4
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.4'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.4
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.4'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.4
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.4'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.4
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.4'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $(document.body).height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/*!
 * VERSION: 1.12.1
 * DATE: 2014-06-26
 * UPDATES AND DOCS AT: http://www.greensock.com
 * 
 * Includes all of the following: TweenLite, TweenMax, TimelineLite, TimelineMax, EasePack, CSSPlugin, RoundPropsPlugin, BezierPlugin, AttrPlugin, DirectionalRotationPlugin
 *
 * @license Copyright (c) 2008-2014, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/
(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("TweenMax",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=[].slice,r=function(t,e,s){i.call(this,t,e,s),this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._dirty=!0,this.render=r.prototype.render},n=1e-10,a=i._internals,o=a.isSelector,h=a.isArray,l=r.prototype=i.to({},.1,{}),_=[];r.version="1.12.1",l.constructor=r,l.kill()._gc=!1,r.killTweensOf=r.killDelayedCallsTo=i.killTweensOf,r.getTweensOf=i.getTweensOf,r.lagSmoothing=i.lagSmoothing,r.ticker=i.ticker,r.render=i.render,l.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),i.prototype.invalidate.call(this)},l.updateTo=function(t,e){var s,r=this.ratio;e&&this._startTime<this._timeline._time&&(this._startTime=this._timeline._time,this._uncache(!1),this._gc?this._enabled(!0,!1):this._timeline.insert(this,this._startTime-this._delay));for(s in t)this.vars[s]=t[s];if(this._initted)if(e)this._initted=!1;else if(this._gc&&this._enabled(!0,!1),this._notifyPluginsOfEnabled&&this._firstPT&&i._onPluginEvent("_onDisable",this),this._time/this._duration>.998){var n=this._time;this.render(0,!0,!1),this._initted=!1,this.render(n,!0,!1)}else if(this._time>0){this._initted=!1,this._init();for(var a,o=1/(1-r),h=this._firstPT;h;)a=h.s+h.c,h.c*=o,h.s=a-h.c,h=h._next}return this},l.render=function(t,e,i){this._initted||0===this._duration&&this.vars.repeat&&this.invalidate();var s,r,o,h,l,u,p,f,c=this._dirty?this.totalDuration():this._totalDuration,m=this._time,d=this._totalTime,g=this._cycle,v=this._duration,y=this._rawPrevTime;if(t>=c?(this._totalTime=c,this._cycle=this._repeat,this._yoyo&&0!==(1&this._cycle)?(this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0):(this._time=v,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1),this._reversed||(s=!0,r="onComplete"),0===v&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>y||y===n)&&y!==t&&(i=!0,y>n&&(r="onReverseComplete")),this._rawPrevTime=f=!e||t||y===t?t:n)):1e-7>t?(this._totalTime=this._time=this._cycle=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==d||0===v&&y>0&&y!==n)&&(r="onReverseComplete",s=this._reversed),0>t?(this._active=!1,0===v&&(this._initted||!this.vars.lazy||i)&&(y>=0&&(i=!0),this._rawPrevTime=f=!e||t||y===t?t:n)):this._initted||(i=!0)):(this._totalTime=this._time=t,0!==this._repeat&&(h=v+this._repeatDelay,this._cycle=this._totalTime/h>>0,0!==this._cycle&&this._cycle===this._totalTime/h&&this._cycle--,this._time=this._totalTime-this._cycle*h,this._yoyo&&0!==(1&this._cycle)&&(this._time=v-this._time),this._time>v?this._time=v:0>this._time&&(this._time=0)),this._easeType?(l=this._time/v,u=this._easeType,p=this._easePower,(1===u||3===u&&l>=.5)&&(l=1-l),3===u&&(l*=2),1===p?l*=l:2===p?l*=l*l:3===p?l*=l*l*l:4===p&&(l*=l*l*l*l),this.ratio=1===u?1-l:2===u?l:.5>this._time/v?l/2:1-l/2):this.ratio=this._ease.getRatio(this._time/v)),m===this._time&&!i&&g===this._cycle)return d!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),void 0;if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=m,this._totalTime=d,this._rawPrevTime=y,this._cycle=g,a.lazyTweens.push(this),this._lazy=t,void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/v):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==m&&t>=0&&(this._active=!0),0===d&&(2===this._initted&&t>0&&this._init(),this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._totalTime||0===v)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||_))),o=this._firstPT;o;)o.f?o.t[o.p](o.c*this.ratio+o.s):o.t[o.p]=o.c*this.ratio+o.s,o=o._next;this._onUpdate&&(0>t&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||(this._totalTime!==d||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||_)),this._cycle!==g&&(e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||_)),r&&(this._gc||(0>t&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||_),0===v&&this._rawPrevTime===n&&f!==n&&(this._rawPrevTime=0)))},r.to=function(t,e,i){return new r(t,e,i)},r.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new r(t,e,i)},r.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new r(t,e,s)},r.staggerTo=r.allTo=function(t,e,n,a,l,u,p){a=a||0;var f,c,m,d,g=n.delay||0,v=[],y=function(){n.onComplete&&n.onComplete.apply(n.onCompleteScope||this,arguments),l.apply(p||this,u||_)};for(h(t)||("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s.call(t,0))),f=t.length,m=0;f>m;m++){c={};for(d in n)c[d]=n[d];c.delay=g,m===f-1&&l&&(c.onComplete=y),v[m]=new r(t[m],e,c),g+=a}return v},r.staggerFrom=r.allFrom=function(t,e,i,s,n,a,o){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,r.staggerTo(t,e,i,s,n,a,o)},r.staggerFromTo=r.allFromTo=function(t,e,i,s,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,r.staggerTo(t,e,s,n,a,o,h)},r.delayedCall=function(t,e,i,s,n){return new r(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:n,overwrite:0})},r.set=function(t,e){return new r(t,0,e)},r.isTweening=function(t){return i.getTweensOf(t,!0).length>0};var u=function(t,e){for(var s=[],r=0,n=t._first;n;)n instanceof i?s[r++]=n:(e&&(s[r++]=n),s=s.concat(u(n,e)),r=s.length),n=n._next;return s},p=r.getAllTweens=function(e){return u(t._rootTimeline,e).concat(u(t._rootFramesTimeline,e))};r.killAll=function(t,i,s,r){null==i&&(i=!0),null==s&&(s=!0);var n,a,o,h=p(0!=r),l=h.length,_=i&&s&&r;for(o=0;l>o;o++)a=h[o],(_||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&(t?a.totalTime(a._reversed?0:a.totalDuration()):a._enabled(!1,!1))},r.killChildTweensOf=function(t,e){if(null!=t){var n,l,_,u,p,f=a.tweenLookup;if("string"==typeof t&&(t=i.selector(t)||t),o(t)&&(t=s.call(t,0)),h(t))for(u=t.length;--u>-1;)r.killChildTweensOf(t[u],e);else{n=[];for(_ in f)for(l=f[_].target.parentNode;l;)l===t&&(n=n.concat(f[_].tweens)),l=l.parentNode;for(p=n.length,u=0;p>u;u++)e&&n[u].totalTime(n[u].totalDuration()),n[u]._enabled(!1,!1)}}};var f=function(t,i,s,r){i=i!==!1,s=s!==!1,r=r!==!1;for(var n,a,o=p(r),h=i&&s&&r,l=o.length;--l>-1;)a=o[l],(h||a instanceof e||(n=a.target===a.vars.onComplete)&&s||i&&!n)&&a.paused(t)};return r.pauseAll=function(t,e,i){f(!0,t,e,i)},r.resumeAll=function(t,e,i){f(!1,t,e,i)},r.globalTimeScale=function(e){var s=t._rootTimeline,r=i.ticker.time;return arguments.length?(e=e||n,s._startTime=r-(r-s._startTime)*s._timeScale/e,s=t._rootFramesTimeline,r=i.ticker.frame,s._startTime=r-(r-s._startTime)*s._timeScale/e,s._timeScale=t._rootTimeline._timeScale=e,e):s._timeScale},l.progress=function(t){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),!1):this._time/this.duration()},l.totalProgress=function(t){return arguments.length?this.totalTime(this.totalDuration()*t,!1):this._totalTime/this.totalDuration()},l.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},l.duration=function(e){return arguments.length?t.prototype.duration.call(this,e):this._duration},l.totalDuration=function(t){return arguments.length?-1===this._repeat?this:this.duration((t-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat,this._dirty=!1),this._totalDuration)},l.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},l.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},l.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},r},!0),window._gsDefine("TimelineLite",["core.Animation","core.SimpleTimeline","TweenLite"],function(t,e,i){var s=function(t){e.call(this,t),this._labels={},this.autoRemoveChildren=this.vars.autoRemoveChildren===!0,this.smoothChildTiming=this.vars.smoothChildTiming===!0,this._sortChildren=!0,this._onUpdate=this.vars.onUpdate;var i,s,r=this.vars;for(s in r)i=r[s],a(i)&&-1!==i.join("").indexOf("{self}")&&(r[s]=this._swapSelfInParams(i));a(r.tweens)&&this.add(r.tweens,0,r.align,r.stagger)},r=1e-10,n=i._internals.isSelector,a=i._internals.isArray,o=[],h=window._gsDefine.globals,l=function(t){var e,i={};for(e in t)i[e]=t[e];return i},_=function(t,e,i,s){t._timeline.pause(t._startTime),e&&e.apply(s||t._timeline,i||o)},u=o.slice,p=s.prototype=new e;return s.version="1.12.1",p.constructor=s,p.kill()._gc=!1,p.to=function(t,e,s,r){var n=s.repeat&&h.TweenMax||i;return e?this.add(new n(t,e,s),r):this.set(t,s,r)},p.from=function(t,e,s,r){return this.add((s.repeat&&h.TweenMax||i).from(t,e,s),r)},p.fromTo=function(t,e,s,r,n){var a=r.repeat&&h.TweenMax||i;return e?this.add(a.fromTo(t,e,s,r),n):this.set(t,r,n)},p.staggerTo=function(t,e,r,a,o,h,_,p){var f,c=new s({onComplete:h,onCompleteParams:_,onCompleteScope:p,smoothChildTiming:this.smoothChildTiming});for("string"==typeof t&&(t=i.selector(t)||t),n(t)&&(t=u.call(t,0)),a=a||0,f=0;t.length>f;f++)r.startAt&&(r.startAt=l(r.startAt)),c.to(t[f],e,l(r),f*a);return this.add(c,o)},p.staggerFrom=function(t,e,i,s,r,n,a,o){return i.immediateRender=0!=i.immediateRender,i.runBackwards=!0,this.staggerTo(t,e,i,s,r,n,a,o)},p.staggerFromTo=function(t,e,i,s,r,n,a,o,h){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,this.staggerTo(t,e,s,r,n,a,o,h)},p.call=function(t,e,s,r){return this.add(i.delayedCall(0,t,e,s),r)},p.set=function(t,e,s){return s=this._parseTimeOrLabel(s,0,!0),null==e.immediateRender&&(e.immediateRender=s===this._time&&!this._paused),this.add(new i(t,0,e),s)},s.exportRoot=function(t,e){t=t||{},null==t.smoothChildTiming&&(t.smoothChildTiming=!0);var r,n,a=new s(t),o=a._timeline;for(null==e&&(e=!0),o._remove(a,!0),a._startTime=0,a._rawPrevTime=a._time=a._totalTime=o._time,r=o._first;r;)n=r._next,e&&r instanceof i&&r.target===r.vars.onComplete||a.add(r,r._startTime-r._delay),r=n;return o.add(a,0),a},p.add=function(r,n,o,h){var l,_,u,p,f,c;if("number"!=typeof n&&(n=this._parseTimeOrLabel(n,0,!0,r)),!(r instanceof t)){if(r instanceof Array||r&&r.push&&a(r)){for(o=o||"normal",h=h||0,l=n,_=r.length,u=0;_>u;u++)a(p=r[u])&&(p=new s({tweens:p})),this.add(p,l),"string"!=typeof p&&"function"!=typeof p&&("sequence"===o?l=p._startTime+p.totalDuration()/p._timeScale:"start"===o&&(p._startTime-=p.delay())),l+=h;return this._uncache(!0)}if("string"==typeof r)return this.addLabel(r,n);if("function"!=typeof r)throw"Cannot add "+r+" into the timeline; it is not a tween, timeline, function, or string.";r=i.delayedCall(0,r)}if(e.prototype.add.call(this,r,n),(this._gc||this._time===this._duration)&&!this._paused&&this._duration<this.duration())for(f=this,c=f.rawTime()>r._startTime;f._timeline;)c&&f._timeline.smoothChildTiming?f.totalTime(f._totalTime,!0):f._gc&&f._enabled(!0,!1),f=f._timeline;return this},p.remove=function(e){if(e instanceof t)return this._remove(e,!1);if(e instanceof Array||e&&e.push&&a(e)){for(var i=e.length;--i>-1;)this.remove(e[i]);return this}return"string"==typeof e?this.removeLabel(e):this.kill(null,e)},p._remove=function(t,i){e.prototype._remove.call(this,t,i);var s=this._last;return s?this._time>s._startTime+s._totalDuration/s._timeScale&&(this._time=this.duration(),this._totalTime=this._totalDuration):this._time=this._totalTime=this._duration=this._totalDuration=0,this},p.append=function(t,e){return this.add(t,this._parseTimeOrLabel(null,e,!0,t))},p.insert=p.insertMultiple=function(t,e,i,s){return this.add(t,e||0,i,s)},p.appendMultiple=function(t,e,i,s){return this.add(t,this._parseTimeOrLabel(null,e,!0,t),i,s)},p.addLabel=function(t,e){return this._labels[t]=this._parseTimeOrLabel(e),this},p.addPause=function(t,e,i,s){return this.call(_,["{self}",e,i,s],this,t)},p.removeLabel=function(t){return delete this._labels[t],this},p.getLabelTime=function(t){return null!=this._labels[t]?this._labels[t]:-1},p._parseTimeOrLabel=function(e,i,s,r){var n;if(r instanceof t&&r.timeline===this)this.remove(r);else if(r&&(r instanceof Array||r.push&&a(r)))for(n=r.length;--n>-1;)r[n]instanceof t&&r[n].timeline===this&&this.remove(r[n]);if("string"==typeof i)return this._parseTimeOrLabel(i,s&&"number"==typeof e&&null==this._labels[i]?e-this.duration():0,s);if(i=i||0,"string"!=typeof e||!isNaN(e)&&null==this._labels[e])null==e&&(e=this.duration());else{if(n=e.indexOf("="),-1===n)return null==this._labels[e]?s?this._labels[e]=this.duration()+i:i:this._labels[e]+i;i=parseInt(e.charAt(n-1)+"1",10)*Number(e.substr(n+1)),e=n>1?this._parseTimeOrLabel(e.substr(0,n-1),0,s):this.duration()}return Number(e)+i},p.seek=function(t,e){return this.totalTime("number"==typeof t?t:this._parseTimeOrLabel(t),e!==!1)},p.stop=function(){return this.paused(!0)},p.gotoAndPlay=function(t,e){return this.play(t,e)},p.gotoAndStop=function(t,e){return this.pause(t,e)},p.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,n,a,h,l,_=this._dirty?this.totalDuration():this._totalDuration,u=this._time,p=this._startTime,f=this._timeScale,c=this._paused;if(t>=_?(this._totalTime=this._time=_,this._reversed||this._hasPausedChild()||(n=!0,h="onComplete",0===this._duration&&(0===t||0>this._rawPrevTime||this._rawPrevTime===r)&&this._rawPrevTime!==t&&this._first&&(l=!0,this._rawPrevTime>r&&(h="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=_+1e-4):1e-7>t?(this._totalTime=this._time=0,(0!==u||0===this._duration&&this._rawPrevTime!==r&&(this._rawPrevTime>0||0>t&&this._rawPrevTime>=0))&&(h="onReverseComplete",n=this._reversed),0>t?(this._active=!1,0===this._duration&&this._rawPrevTime>=0&&this._first&&(l=!0),this._rawPrevTime=t):(this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(l=!0))):this._totalTime=this._time=this._rawPrevTime=t,this._time!==u&&this._first||i||l){if(this._initted||(this._initted=!0),this._active||!this._paused&&this._time!==u&&t>0&&(this._active=!0),0===u&&this.vars.onStart&&0!==this._time&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||o)),this._time>=u)for(s=this._first;s&&(a=s._next,!this._paused||c);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;else for(s=this._last;s&&(a=s._prev,!this._paused||c);)(s._active||u>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=a;this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||o)),h&&(this._gc||(p===this._startTime||f!==this._timeScale)&&(0===this._time||_>=this.totalDuration())&&(n&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[h]&&this.vars[h].apply(this.vars[h+"Scope"]||this,this.vars[h+"Params"]||o)))}},p._hasPausedChild=function(){for(var t=this._first;t;){if(t._paused||t instanceof s&&t._hasPausedChild())return!0;t=t._next}return!1},p.getChildren=function(t,e,s,r){r=r||-9999999999;for(var n=[],a=this._first,o=0;a;)r>a._startTime||(a instanceof i?e!==!1&&(n[o++]=a):(s!==!1&&(n[o++]=a),t!==!1&&(n=n.concat(a.getChildren(!0,e,s)),o=n.length))),a=a._next;return n},p.getTweensOf=function(t,e){var s,r,n=this._gc,a=[],o=0;for(n&&this._enabled(!0,!0),s=i.getTweensOf(t),r=s.length;--r>-1;)(s[r].timeline===this||e&&this._contains(s[r]))&&(a[o++]=s[r]);return n&&this._enabled(!1,!0),a},p._contains=function(t){for(var e=t.timeline;e;){if(e===this)return!0;e=e.timeline}return!1},p.shiftChildren=function(t,e,i){i=i||0;for(var s,r=this._first,n=this._labels;r;)r._startTime>=i&&(r._startTime+=t),r=r._next;if(e)for(s in n)n[s]>=i&&(n[s]+=t);return this._uncache(!0)},p._kill=function(t,e){if(!t&&!e)return this._enabled(!1,!1);for(var i=e?this.getTweensOf(e):this.getChildren(!0,!0,!1),s=i.length,r=!1;--s>-1;)i[s]._kill(t,e)&&(r=!0);return r},p.clear=function(t){var e=this.getChildren(!1,!0,!0),i=e.length;for(this._time=this._totalTime=0;--i>-1;)e[i]._enabled(!1,!1);return t!==!1&&(this._labels={}),this._uncache(!0)},p.invalidate=function(){for(var t=this._first;t;)t.invalidate(),t=t._next;return this},p._enabled=function(t,i){if(t===this._gc)for(var s=this._first;s;)s._enabled(t,!0),s=s._next;return e.prototype._enabled.call(this,t,i)},p.duration=function(t){return arguments.length?(0!==this.duration()&&0!==t&&this.timeScale(this._duration/t),this):(this._dirty&&this.totalDuration(),this._duration)},p.totalDuration=function(t){if(!arguments.length){if(this._dirty){for(var e,i,s=0,r=this._last,n=999999999999;r;)e=r._prev,r._dirty&&r.totalDuration(),r._startTime>n&&this._sortChildren&&!r._paused?this.add(r,r._startTime-r._delay):n=r._startTime,0>r._startTime&&!r._paused&&(s-=r._startTime,this._timeline.smoothChildTiming&&(this._startTime+=r._startTime/this._timeScale),this.shiftChildren(-r._startTime,!1,-9999999999),n=0),i=r._startTime+r._totalDuration/r._timeScale,i>s&&(s=i),r=e;this._duration=this._totalDuration=s,this._dirty=!1}return this._totalDuration}return 0!==this.totalDuration()&&0!==t&&this.timeScale(this._totalDuration/t),this},p.usesFrames=function(){for(var e=this._timeline;e._timeline;)e=e._timeline;return e===t._rootFramesTimeline},p.rawTime=function(){return this._paused?this._totalTime:(this._timeline.rawTime()-this._startTime)*this._timeScale},s},!0),window._gsDefine("TimelineMax",["TimelineLite","TweenLite","easing.Ease"],function(t,e,i){var s=function(e){t.call(this,e),this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._cycle=0,this._yoyo=this.vars.yoyo===!0,this._dirty=!0},r=1e-10,n=[],a=new i(null,null,1,0),o=s.prototype=new t;return o.constructor=s,o.kill()._gc=!1,s.version="1.12.1",o.invalidate=function(){return this._yoyo=this.vars.yoyo===!0,this._repeat=this.vars.repeat||0,this._repeatDelay=this.vars.repeatDelay||0,this._uncache(!0),t.prototype.invalidate.call(this)},o.addCallback=function(t,i,s,r){return this.add(e.delayedCall(0,t,s,r),i)},o.removeCallback=function(t,e){if(t)if(null==e)this._kill(null,t);else for(var i=this.getTweensOf(t,!1),s=i.length,r=this._parseTimeOrLabel(e);--s>-1;)i[s]._startTime===r&&i[s]._enabled(!1,!1);return this},o.tweenTo=function(t,i){i=i||{};var s,r,o,h={ease:a,overwrite:i.delay?2:1,useFrames:this.usesFrames(),immediateRender:!1};for(r in i)h[r]=i[r];return h.time=this._parseTimeOrLabel(t),s=Math.abs(Number(h.time)-this._time)/this._timeScale||.001,o=new e(this,s,h),h.onStart=function(){o.target.paused(!0),o.vars.time!==o.target.time()&&s===o.duration()&&o.duration(Math.abs(o.vars.time-o.target.time())/o.target._timeScale),i.onStart&&i.onStart.apply(i.onStartScope||o,i.onStartParams||n)},o},o.tweenFromTo=function(t,e,i){i=i||{},t=this._parseTimeOrLabel(t),i.startAt={onComplete:this.seek,onCompleteParams:[t],onCompleteScope:this},i.immediateRender=i.immediateRender!==!1;var s=this.tweenTo(e,i);return s.duration(Math.abs(s.vars.time-t)/this._timeScale||.001)},o.render=function(t,e,i){this._gc&&this._enabled(!0,!1);var s,a,o,h,l,_,u=this._dirty?this.totalDuration():this._totalDuration,p=this._duration,f=this._time,c=this._totalTime,m=this._startTime,d=this._timeScale,g=this._rawPrevTime,v=this._paused,y=this._cycle;if(t>=u?(this._locked||(this._totalTime=u,this._cycle=this._repeat),this._reversed||this._hasPausedChild()||(a=!0,h="onComplete",0===this._duration&&(0===t||0>g||g===r)&&g!==t&&this._first&&(l=!0,g>r&&(h="onReverseComplete"))),this._rawPrevTime=this._duration||!e||t||this._rawPrevTime===t?t:r,this._yoyo&&0!==(1&this._cycle)?this._time=t=0:(this._time=p,t=p+1e-4)):1e-7>t?(this._locked||(this._totalTime=this._cycle=0),this._time=0,(0!==f||0===p&&g!==r&&(g>0||0>t&&g>=0)&&!this._locked)&&(h="onReverseComplete",a=this._reversed),0>t?(this._active=!1,0===p&&g>=0&&this._first&&(l=!0),this._rawPrevTime=t):(this._rawPrevTime=p||!e||t||this._rawPrevTime===t?t:r,t=0,this._initted||(l=!0))):(0===p&&0>g&&(l=!0),this._time=this._rawPrevTime=t,this._locked||(this._totalTime=t,0!==this._repeat&&(_=p+this._repeatDelay,this._cycle=this._totalTime/_>>0,0!==this._cycle&&this._cycle===this._totalTime/_&&this._cycle--,this._time=this._totalTime-this._cycle*_,this._yoyo&&0!==(1&this._cycle)&&(this._time=p-this._time),this._time>p?(this._time=p,t=p+1e-4):0>this._time?this._time=t=0:t=this._time))),this._cycle!==y&&!this._locked){var T=this._yoyo&&0!==(1&y),w=T===(this._yoyo&&0!==(1&this._cycle)),x=this._totalTime,b=this._cycle,P=this._rawPrevTime,S=this._time;if(this._totalTime=y*p,y>this._cycle?T=!T:this._totalTime+=p,this._time=f,this._rawPrevTime=0===p?g-1e-4:g,this._cycle=y,this._locked=!0,f=T?0:p,this.render(f,e,0===p),e||this._gc||this.vars.onRepeat&&this.vars.onRepeat.apply(this.vars.onRepeatScope||this,this.vars.onRepeatParams||n),w&&(f=T?p+1e-4:-1e-4,this.render(f,!0,!1)),this._locked=!1,this._paused&&!v)return;this._time=S,this._totalTime=x,this._cycle=b,this._rawPrevTime=P}if(!(this._time!==f&&this._first||i||l))return c!==this._totalTime&&this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n)),void 0;if(this._initted||(this._initted=!0),this._active||!this._paused&&this._totalTime!==c&&t>0&&(this._active=!0),0===c&&this.vars.onStart&&0!==this._totalTime&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||n)),this._time>=f)for(s=this._first;s&&(o=s._next,!this._paused||v);)(s._active||s._startTime<=this._time&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=o;else for(s=this._last;s&&(o=s._prev,!this._paused||v);)(s._active||f>=s._startTime&&!s._paused&&!s._gc)&&(s._reversed?s.render((s._dirty?s.totalDuration():s._totalDuration)-(t-s._startTime)*s._timeScale,e,i):s.render((t-s._startTime)*s._timeScale,e,i)),s=o;this._onUpdate&&(e||this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||n)),h&&(this._locked||this._gc||(m===this._startTime||d!==this._timeScale)&&(0===this._time||u>=this.totalDuration())&&(a&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[h]&&this.vars[h].apply(this.vars[h+"Scope"]||this,this.vars[h+"Params"]||n)))},o.getActive=function(t,e,i){null==t&&(t=!0),null==e&&(e=!0),null==i&&(i=!1);var s,r,n=[],a=this.getChildren(t,e,i),o=0,h=a.length;for(s=0;h>s;s++)r=a[s],r.isActive()&&(n[o++]=r);return n},o.getLabelAfter=function(t){t||0!==t&&(t=this._time);var e,i=this.getLabelsArray(),s=i.length;for(e=0;s>e;e++)if(i[e].time>t)return i[e].name;return null},o.getLabelBefore=function(t){null==t&&(t=this._time);for(var e=this.getLabelsArray(),i=e.length;--i>-1;)if(t>e[i].time)return e[i].name;return null},o.getLabelsArray=function(){var t,e=[],i=0;for(t in this._labels)e[i++]={time:this._labels[t],name:t};return e.sort(function(t,e){return t.time-e.time}),e},o.progress=function(t){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&0!==(1&this._cycle)?1-t:t)+this._cycle*(this._duration+this._repeatDelay),!1):this._time/this.duration()},o.totalProgress=function(t){return arguments.length?this.totalTime(this.totalDuration()*t,!1):this._totalTime/this.totalDuration()},o.totalDuration=function(e){return arguments.length?-1===this._repeat?this:this.duration((e-this._repeat*this._repeatDelay)/(this._repeat+1)):(this._dirty&&(t.prototype.totalDuration.call(this),this._totalDuration=-1===this._repeat?999999999999:this._duration*(this._repeat+1)+this._repeatDelay*this._repeat),this._totalDuration)},o.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),t>this._duration&&(t=this._duration),this._yoyo&&0!==(1&this._cycle)?t=this._duration-t+this._cycle*(this._duration+this._repeatDelay):0!==this._repeat&&(t+=this._cycle*(this._duration+this._repeatDelay)),this.totalTime(t,e)):this._time},o.repeat=function(t){return arguments.length?(this._repeat=t,this._uncache(!0)):this._repeat},o.repeatDelay=function(t){return arguments.length?(this._repeatDelay=t,this._uncache(!0)):this._repeatDelay},o.yoyo=function(t){return arguments.length?(this._yoyo=t,this):this._yoyo},o.currentLabel=function(t){return arguments.length?this.seek(t,!0):this.getLabelBefore(this._time+1e-8)},s},!0),function(){var t=180/Math.PI,e=[],i=[],s=[],r={},n=function(t,e,i,s){this.a=t,this.b=e,this.c=i,this.d=s,this.da=s-t,this.ca=i-t,this.ba=e-t},a=",x,y,z,left,top,right,bottom,marginTop,marginLeft,marginRight,marginBottom,paddingLeft,paddingTop,paddingRight,paddingBottom,backgroundPosition,backgroundPosition_y,",o=function(t,e,i,s){var r={a:t},n={},a={},o={c:s},h=(t+e)/2,l=(e+i)/2,_=(i+s)/2,u=(h+l)/2,p=(l+_)/2,f=(p-u)/8;return r.b=h+(t-h)/4,n.b=u+f,r.c=n.a=(r.b+n.b)/2,n.c=a.a=(u+p)/2,a.b=p-f,o.b=_+(s-_)/4,a.c=o.a=(a.b+o.b)/2,[r,n,a,o]},h=function(t,r,n,a,h){var l,_,u,p,f,c,m,d,g,v,y,T,w,x=t.length-1,b=0,P=t[0].a;for(l=0;x>l;l++)f=t[b],_=f.a,u=f.d,p=t[b+1].d,h?(y=e[l],T=i[l],w=.25*(T+y)*r/(a?.5:s[l]||.5),c=u-(u-_)*(a?.5*r:0!==y?w/y:0),m=u+(p-u)*(a?.5*r:0!==T?w/T:0),d=u-(c+((m-c)*(3*y/(y+T)+.5)/4||0))):(c=u-.5*(u-_)*r,m=u+.5*(p-u)*r,d=u-(c+m)/2),c+=d,m+=d,f.c=g=c,f.b=0!==l?P:P=f.a+.6*(f.c-f.a),f.da=u-_,f.ca=g-_,f.ba=P-_,n?(v=o(_,P,g,u),t.splice(b,1,v[0],v[1],v[2],v[3]),b+=4):b++,P=m;f=t[b],f.b=P,f.c=P+.4*(f.d-P),f.da=f.d-f.a,f.ca=f.c-f.a,f.ba=P-f.a,n&&(v=o(f.a,P,f.c,f.d),t.splice(b,1,v[0],v[1],v[2],v[3]))},l=function(t,s,r,a){var o,h,l,_,u,p,f=[];if(a)for(t=[a].concat(t),h=t.length;--h>-1;)"string"==typeof(p=t[h][s])&&"="===p.charAt(1)&&(t[h][s]=a[s]+Number(p.charAt(0)+p.substr(2)));if(o=t.length-2,0>o)return f[0]=new n(t[0][s],0,0,t[-1>o?0:1][s]),f;for(h=0;o>h;h++)l=t[h][s],_=t[h+1][s],f[h]=new n(l,0,0,_),r&&(u=t[h+2][s],e[h]=(e[h]||0)+(_-l)*(_-l),i[h]=(i[h]||0)+(u-_)*(u-_));return f[h]=new n(t[h][s],0,0,t[h+1][s]),f},_=function(t,n,o,_,u,p){var f,c,m,d,g,v,y,T,w={},x=[],b=p||t[0];u="string"==typeof u?","+u+",":a,null==n&&(n=1);for(c in t[0])x.push(c);if(t.length>1){for(T=t[t.length-1],y=!0,f=x.length;--f>-1;)if(c=x[f],Math.abs(b[c]-T[c])>.05){y=!1;break}y&&(t=t.concat(),p&&t.unshift(p),t.push(t[1]),p=t[t.length-3])}for(e.length=i.length=s.length=0,f=x.length;--f>-1;)c=x[f],r[c]=-1!==u.indexOf(","+c+","),w[c]=l(t,c,r[c],p);for(f=e.length;--f>-1;)e[f]=Math.sqrt(e[f]),i[f]=Math.sqrt(i[f]);if(!_){for(f=x.length;--f>-1;)if(r[c])for(m=w[x[f]],v=m.length-1,d=0;v>d;d++)g=m[d+1].da/i[d]+m[d].da/e[d],s[d]=(s[d]||0)+g*g;for(f=s.length;--f>-1;)s[f]=Math.sqrt(s[f])}for(f=x.length,d=o?4:1;--f>-1;)c=x[f],m=w[c],h(m,n,o,_,r[c]),y&&(m.splice(0,d),m.splice(m.length-d,d));return w},u=function(t,e,i){e=e||"soft";var s,r,a,o,h,l,_,u,p,f,c,m={},d="cubic"===e?3:2,g="soft"===e,v=[];if(g&&i&&(t=[i].concat(t)),null==t||d+1>t.length)throw"invalid Bezier data";for(p in t[0])v.push(p);for(l=v.length;--l>-1;){for(p=v[l],m[p]=h=[],f=0,u=t.length,_=0;u>_;_++)s=null==i?t[_][p]:"string"==typeof(c=t[_][p])&&"="===c.charAt(1)?i[p]+Number(c.charAt(0)+c.substr(2)):Number(c),g&&_>1&&u-1>_&&(h[f++]=(s+h[f-2])/2),h[f++]=s;for(u=f-d+1,f=0,_=0;u>_;_+=d)s=h[_],r=h[_+1],a=h[_+2],o=2===d?0:h[_+3],h[f++]=c=3===d?new n(s,r,a,o):new n(s,(2*r+s)/3,(2*r+a)/3,a);h.length=f}return m},p=function(t,e,i){for(var s,r,n,a,o,h,l,_,u,p,f,c=1/i,m=t.length;--m>-1;)for(p=t[m],n=p.a,a=p.d-n,o=p.c-n,h=p.b-n,s=r=0,_=1;i>=_;_++)l=c*_,u=1-l,s=r-(r=(l*l*a+3*u*(l*o+u*h))*l),f=m*i+_-1,e[f]=(e[f]||0)+s*s},f=function(t,e){e=e>>0||6;var i,s,r,n,a=[],o=[],h=0,l=0,_=e-1,u=[],f=[];for(i in t)p(t[i],a,e);for(r=a.length,s=0;r>s;s++)h+=Math.sqrt(a[s]),n=s%e,f[n]=h,n===_&&(l+=h,n=s/e>>0,u[n]=f,o[n]=l,h=0,f=[]);return{length:l,lengths:o,segments:u}},c=window._gsDefine.plugin({propName:"bezier",priority:-1,version:"1.3.2",API:2,global:!0,init:function(t,e,i){this._target=t,e instanceof Array&&(e={values:e}),this._func={},this._round={},this._props=[],this._timeRes=null==e.timeResolution?6:parseInt(e.timeResolution,10);var s,r,n,a,o,h=e.values||[],l={},p=h[0],c=e.autoRotate||i.vars.orientToBezier;this._autoRotate=c?c instanceof Array?c:[["x","y","rotation",c===!0?0:Number(c)||0]]:null;for(s in p)this._props.push(s);for(n=this._props.length;--n>-1;)s=this._props[n],this._overwriteProps.push(s),r=this._func[s]="function"==typeof t[s],l[s]=r?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]():parseFloat(t[s]),o||l[s]!==h[0][s]&&(o=l);if(this._beziers="cubic"!==e.type&&"quadratic"!==e.type&&"soft"!==e.type?_(h,isNaN(e.curviness)?1:e.curviness,!1,"thruBasic"===e.type,e.correlate,o):u(h,e.type,l),this._segCount=this._beziers[s].length,this._timeRes){var m=f(this._beziers,this._timeRes);this._length=m.length,this._lengths=m.lengths,this._segments=m.segments,this._l1=this._li=this._s1=this._si=0,this._l2=this._lengths[0],this._curSeg=this._segments[0],this._s2=this._curSeg[0],this._prec=1/this._curSeg.length}if(c=this._autoRotate)for(this._initialRotations=[],c[0]instanceof Array||(this._autoRotate=c=[c]),n=c.length;--n>-1;){for(a=0;3>a;a++)s=c[n][a],this._func[s]="function"==typeof t[s]?t[s.indexOf("set")||"function"!=typeof t["get"+s.substr(3)]?s:"get"+s.substr(3)]:!1;s=c[n][2],this._initialRotations[n]=this._func[s]?this._func[s].call(this._target):this._target[s]}return this._startRatio=i.vars.runBackwards?1:0,!0},set:function(e){var i,s,r,n,a,o,h,l,_,u,p=this._segCount,f=this._func,c=this._target,m=e!==this._startRatio;if(this._timeRes){if(_=this._lengths,u=this._curSeg,e*=this._length,r=this._li,e>this._l2&&p-1>r){for(l=p-1;l>r&&e>=(this._l2=_[++r]););this._l1=_[r-1],this._li=r,this._curSeg=u=this._segments[r],this._s2=u[this._s1=this._si=0]}else if(this._l1>e&&r>0){for(;r>0&&(this._l1=_[--r])>=e;);0===r&&this._l1>e?this._l1=0:r++,this._l2=_[r],this._li=r,this._curSeg=u=this._segments[r],this._s1=u[(this._si=u.length-1)-1]||0,this._s2=u[this._si]}if(i=r,e-=this._l1,r=this._si,e>this._s2&&u.length-1>r){for(l=u.length-1;l>r&&e>=(this._s2=u[++r]););this._s1=u[r-1],this._si=r}else if(this._s1>e&&r>0){for(;r>0&&(this._s1=u[--r])>=e;);0===r&&this._s1>e?this._s1=0:r++,this._s2=u[r],this._si=r}o=(r+(e-this._s1)/(this._s2-this._s1))*this._prec}else i=0>e?0:e>=1?p-1:p*e>>0,o=(e-i*(1/p))*p;for(s=1-o,r=this._props.length;--r>-1;)n=this._props[r],a=this._beziers[n][i],h=(o*o*a.da+3*s*(o*a.ca+s*a.ba))*o+a.a,this._round[n]&&(h=Math.round(h)),f[n]?c[n](h):c[n]=h;if(this._autoRotate){var d,g,v,y,T,w,x,b=this._autoRotate;for(r=b.length;--r>-1;)n=b[r][2],w=b[r][3]||0,x=b[r][4]===!0?1:t,a=this._beziers[b[r][0]],d=this._beziers[b[r][1]],a&&d&&(a=a[i],d=d[i],g=a.a+(a.b-a.a)*o,y=a.b+(a.c-a.b)*o,g+=(y-g)*o,y+=(a.c+(a.d-a.c)*o-y)*o,v=d.a+(d.b-d.a)*o,T=d.b+(d.c-d.b)*o,v+=(T-v)*o,T+=(d.c+(d.d-d.c)*o-T)*o,h=m?Math.atan2(T-v,y-g)*x+w:this._initialRotations[r],f[n]?c[n](h):c[n]=h)
}}}),m=c.prototype;c.bezierThrough=_,c.cubicToQuadratic=o,c._autoCSS=!0,c.quadraticToCubic=function(t,e,i){return new n(t,(2*e+t)/3,(2*e+i)/3,i)},c._cssRegister=function(){var t=window._gsDefine.globals.CSSPlugin;if(t){var e=t._internals,i=e._parseToProxy,s=e._setPluginRatio,r=e.CSSPropTween;e._registerComplexSpecialProp("bezier",{parser:function(t,e,n,a,o,h){e instanceof Array&&(e={values:e}),h=new c;var l,_,u,p=e.values,f=p.length-1,m=[],d={};if(0>f)return o;for(l=0;f>=l;l++)u=i(t,p[l],a,o,h,f!==l),m[l]=u.end;for(_ in e)d[_]=e[_];return d.values=m,o=new r(t,"bezier",0,0,u.pt,2),o.data=u,o.plugin=h,o.setRatio=s,0===d.autoRotate&&(d.autoRotate=!0),!d.autoRotate||d.autoRotate instanceof Array||(l=d.autoRotate===!0?0:Number(d.autoRotate),d.autoRotate=null!=u.end.left?[["left","top","rotation",l,!1]]:null!=u.end.x?[["x","y","rotation",l,!1]]:!1),d.autoRotate&&(a._transform||a._enableTransforms(!1),u.autoRotate=a._target._gsTransform),h._onInitTween(u.proxy,d,a._tween),o}})}},m._roundProps=function(t,e){for(var i=this._overwriteProps,s=i.length;--s>-1;)(t[i[s]]||t.bezier||t.bezierThrough)&&(this._round[i[s]]=e)},m._kill=function(t){var e,i,s=this._props;for(e in this._beziers)if(e in t)for(delete this._beziers[e],delete this._func[e],i=s.length;--i>-1;)s[i]===e&&s.splice(i,1);return this._super._kill.call(this,t)}}(),window._gsDefine("plugins.CSSPlugin",["plugins.TweenPlugin","TweenLite"],function(t,e){var i,s,r,n,a=function(){t.call(this,"css"),this._overwriteProps.length=0,this.setRatio=a.prototype.setRatio},o={},h=a.prototype=new t("css");h.constructor=a,a.version="1.12.1",a.API=2,a.defaultTransformPerspective=0,a.defaultSkewType="compensated",h="px",a.suffixMap={top:h,right:h,bottom:h,left:h,width:h,height:h,fontSize:h,padding:h,margin:h,perspective:h,lineHeight:""};var l,_,u,p,f,c,m=/(?:\d|\-\d|\.\d|\-\.\d)+/g,d=/(?:\d|\-\d|\.\d|\-\.\d|\+=\d|\-=\d|\+=.\d|\-=\.\d)+/g,g=/(?:\+=|\-=|\-|\b)[\d\-\.]+[a-zA-Z0-9]*(?:%|\b)/gi,v=/[^\d\-\.]/g,y=/(?:\d|\-|\+|=|#|\.)*/g,T=/opacity *= *([^)]*)/i,w=/opacity:([^;]*)/i,x=/alpha\(opacity *=.+?\)/i,b=/^(rgb|hsl)/,P=/([A-Z])/g,S=/-([a-z])/gi,k=/(^(?:url\(\"|url\())|(?:(\"\))$|\)$)/gi,R=function(t,e){return e.toUpperCase()},A=/(?:Left|Right|Width)/i,C=/(M11|M12|M21|M22)=[\d\-\.e]+/gi,O=/progid\:DXImageTransform\.Microsoft\.Matrix\(.+?\)/i,D=/,(?=[^\)]*(?:\(|$))/gi,M=Math.PI/180,z=180/Math.PI,I={},E=document,L=E.createElement("div"),F=E.createElement("img"),N=a._internals={_specialProps:o},X=navigator.userAgent,U=function(){var t,e=X.indexOf("Android"),i=E.createElement("div");return u=-1!==X.indexOf("Safari")&&-1===X.indexOf("Chrome")&&(-1===e||Number(X.substr(e+8,1))>3),f=u&&6>Number(X.substr(X.indexOf("Version/")+8,1)),p=-1!==X.indexOf("Firefox"),/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(X)&&(c=parseFloat(RegExp.$1)),i.innerHTML="<a style='top:1px;opacity:.55;'>a</a>",t=i.getElementsByTagName("a")[0],t?/^0.55/.test(t.style.opacity):!1}(),Y=function(t){return T.test("string"==typeof t?t:(t.currentStyle?t.currentStyle.filter:t.style.filter)||"")?parseFloat(RegExp.$1)/100:1},j=function(t){window.console&&console.log(t)},B="",q="",V=function(t,e){e=e||L;var i,s,r=e.style;if(void 0!==r[t])return t;for(t=t.charAt(0).toUpperCase()+t.substr(1),i=["O","Moz","ms","Ms","Webkit"],s=5;--s>-1&&void 0===r[i[s]+t];);return s>=0?(q=3===s?"ms":i[s],B="-"+q.toLowerCase()+"-",q+t):null},W=E.defaultView?E.defaultView.getComputedStyle:function(){},G=a.getStyle=function(t,e,i,s,r){var n;return U||"opacity"!==e?(!s&&t.style[e]?n=t.style[e]:(i=i||W(t))?n=i[e]||i.getPropertyValue(e)||i.getPropertyValue(e.replace(P,"-$1").toLowerCase()):t.currentStyle&&(n=t.currentStyle[e]),null==r||n&&"none"!==n&&"auto"!==n&&"auto auto"!==n?n:r):Y(t)},$=N.convertToPixels=function(t,i,s,r,n){if("px"===r||!r)return s;if("auto"===r||!s)return 0;var o,h,l,_=A.test(i),u=t,p=L.style,f=0>s;if(f&&(s=-s),"%"===r&&-1!==i.indexOf("border"))o=s/100*(_?t.clientWidth:t.clientHeight);else{if(p.cssText="border:0 solid red;position:"+G(t,"position")+";line-height:0;","%"!==r&&u.appendChild)p[_?"borderLeftWidth":"borderTopWidth"]=s+r;else{if(u=t.parentNode||E.body,h=u._gsCache,l=e.ticker.frame,h&&_&&h.time===l)return h.width*s/100;p[_?"width":"height"]=s+r}u.appendChild(L),o=parseFloat(L[_?"offsetWidth":"offsetHeight"]),u.removeChild(L),_&&"%"===r&&a.cacheWidths!==!1&&(h=u._gsCache=u._gsCache||{},h.time=l,h.width=100*(o/s)),0!==o||n||(o=$(t,i,s,r,!0))}return f?-o:o},Z=N.calculateOffset=function(t,e,i){if("absolute"!==G(t,"position",i))return 0;var s="left"===e?"Left":"Top",r=G(t,"margin"+s,i);return t["offset"+s]-($(t,e,parseFloat(r),r.replace(y,""))||0)},Q=function(t,e){var i,s,r={};if(e=e||W(t,null))if(i=e.length)for(;--i>-1;)r[e[i].replace(S,R)]=e.getPropertyValue(e[i]);else for(i in e)r[i]=e[i];else if(e=t.currentStyle||t.style)for(i in e)"string"==typeof i&&void 0===r[i]&&(r[i.replace(S,R)]=e[i]);return U||(r.opacity=Y(t)),s=Pe(t,e,!1),r.rotation=s.rotation,r.skewX=s.skewX,r.scaleX=s.scaleX,r.scaleY=s.scaleY,r.x=s.x,r.y=s.y,xe&&(r.z=s.z,r.rotationX=s.rotationX,r.rotationY=s.rotationY,r.scaleZ=s.scaleZ),r.filters&&delete r.filters,r},H=function(t,e,i,s,r){var n,a,o,h={},l=t.style;for(a in i)"cssText"!==a&&"length"!==a&&isNaN(a)&&(e[a]!==(n=i[a])||r&&r[a])&&-1===a.indexOf("Origin")&&("number"==typeof n||"string"==typeof n)&&(h[a]="auto"!==n||"left"!==a&&"top"!==a?""!==n&&"auto"!==n&&"none"!==n||"string"!=typeof e[a]||""===e[a].replace(v,"")?n:0:Z(t,a),void 0!==l[a]&&(o=new ue(l,a,l[a],o)));if(s)for(a in s)"className"!==a&&(h[a]=s[a]);return{difs:h,firstMPT:o}},K={width:["Left","Right"],height:["Top","Bottom"]},J=["marginLeft","marginRight","marginTop","marginBottom"],te=function(t,e,i){var s=parseFloat("width"===e?t.offsetWidth:t.offsetHeight),r=K[e],n=r.length;for(i=i||W(t,null);--n>-1;)s-=parseFloat(G(t,"padding"+r[n],i,!0))||0,s-=parseFloat(G(t,"border"+r[n]+"Width",i,!0))||0;return s},ee=function(t,e){(null==t||""===t||"auto"===t||"auto auto"===t)&&(t="0 0");var i=t.split(" "),s=-1!==t.indexOf("left")?"0%":-1!==t.indexOf("right")?"100%":i[0],r=-1!==t.indexOf("top")?"0%":-1!==t.indexOf("bottom")?"100%":i[1];return null==r?r="0":"center"===r&&(r="50%"),("center"===s||isNaN(parseFloat(s))&&-1===(s+"").indexOf("="))&&(s="50%"),e&&(e.oxp=-1!==s.indexOf("%"),e.oyp=-1!==r.indexOf("%"),e.oxr="="===s.charAt(1),e.oyr="="===r.charAt(1),e.ox=parseFloat(s.replace(v,"")),e.oy=parseFloat(r.replace(v,""))),s+" "+r+(i.length>2?" "+i[2]:"")},ie=function(t,e){return"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*parseFloat(t.substr(2)):parseFloat(t)-parseFloat(e)},se=function(t,e){return null==t?e:"string"==typeof t&&"="===t.charAt(1)?parseInt(t.charAt(0)+"1",10)*Number(t.substr(2))+e:parseFloat(t)},re=function(t,e,i,s){var r,n,a,o,h=1e-6;return null==t?o=e:"number"==typeof t?o=t:(r=360,n=t.split("_"),a=Number(n[0].replace(v,""))*(-1===t.indexOf("rad")?1:z)-("="===t.charAt(1)?0:e),n.length&&(s&&(s[i]=e+a),-1!==t.indexOf("short")&&(a%=r,a!==a%(r/2)&&(a=0>a?a+r:a-r)),-1!==t.indexOf("_cw")&&0>a?a=(a+9999999999*r)%r-(0|a/r)*r:-1!==t.indexOf("ccw")&&a>0&&(a=(a-9999999999*r)%r-(0|a/r)*r)),o=e+a),h>o&&o>-h&&(o=0),o},ne={aqua:[0,255,255],lime:[0,255,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,255],navy:[0,0,128],white:[255,255,255],fuchsia:[255,0,255],olive:[128,128,0],yellow:[255,255,0],orange:[255,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[255,0,0],pink:[255,192,203],cyan:[0,255,255],transparent:[255,255,255,0]},ae=function(t,e,i){return t=0>t?t+1:t>1?t-1:t,0|255*(1>6*t?e+6*(i-e)*t:.5>t?i:2>3*t?e+6*(i-e)*(2/3-t):e)+.5},oe=function(t){var e,i,s,r,n,a;return t&&""!==t?"number"==typeof t?[t>>16,255&t>>8,255&t]:(","===t.charAt(t.length-1)&&(t=t.substr(0,t.length-1)),ne[t]?ne[t]:"#"===t.charAt(0)?(4===t.length&&(e=t.charAt(1),i=t.charAt(2),s=t.charAt(3),t="#"+e+e+i+i+s+s),t=parseInt(t.substr(1),16),[t>>16,255&t>>8,255&t]):"hsl"===t.substr(0,3)?(t=t.match(m),r=Number(t[0])%360/360,n=Number(t[1])/100,a=Number(t[2])/100,i=.5>=a?a*(n+1):a+n-a*n,e=2*a-i,t.length>3&&(t[3]=Number(t[3])),t[0]=ae(r+1/3,e,i),t[1]=ae(r,e,i),t[2]=ae(r-1/3,e,i),t):(t=t.match(m)||ne.transparent,t[0]=Number(t[0]),t[1]=Number(t[1]),t[2]=Number(t[2]),t.length>3&&(t[3]=Number(t[3])),t)):ne.black},he="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#.+?\\b";for(h in ne)he+="|"+h+"\\b";he=RegExp(he+")","gi");var le=function(t,e,i,s){if(null==t)return function(t){return t};var r,n=e?(t.match(he)||[""])[0]:"",a=t.split(n).join("").match(g)||[],o=t.substr(0,t.indexOf(a[0])),h=")"===t.charAt(t.length-1)?")":"",l=-1!==t.indexOf(" ")?" ":",",_=a.length,u=_>0?a[0].replace(m,""):"";return _?r=e?function(t){var e,p,f,c;if("number"==typeof t)t+=u;else if(s&&D.test(t)){for(c=t.replace(D,"|").split("|"),f=0;c.length>f;f++)c[f]=r(c[f]);return c.join(",")}if(e=(t.match(he)||[n])[0],p=t.split(e).join("").match(g)||[],f=p.length,_>f--)for(;_>++f;)p[f]=i?p[0|(f-1)/2]:a[f];return o+p.join(l)+l+e+h+(-1!==t.indexOf("inset")?" inset":"")}:function(t){var e,n,p;if("number"==typeof t)t+=u;else if(s&&D.test(t)){for(n=t.replace(D,"|").split("|"),p=0;n.length>p;p++)n[p]=r(n[p]);return n.join(",")}if(e=t.match(g)||[],p=e.length,_>p--)for(;_>++p;)e[p]=i?e[0|(p-1)/2]:a[p];return o+e.join(l)+h}:function(t){return t}},_e=function(t){return t=t.split(","),function(e,i,s,r,n,a,o){var h,l=(i+"").split(" ");for(o={},h=0;4>h;h++)o[t[h]]=l[h]=l[h]||l[(h-1)/2>>0];return r.parse(e,o,n,a)}},ue=(N._setPluginRatio=function(t){this.plugin.setRatio(t);for(var e,i,s,r,n=this.data,a=n.proxy,o=n.firstMPT,h=1e-6;o;)e=a[o.v],o.r?e=Math.round(e):h>e&&e>-h&&(e=0),o.t[o.p]=e,o=o._next;if(n.autoRotate&&(n.autoRotate.rotation=a.rotation),1===t)for(o=n.firstMPT;o;){if(i=o.t,i.type){if(1===i.type){for(r=i.xs0+i.s+i.xs1,s=1;i.l>s;s++)r+=i["xn"+s]+i["xs"+(s+1)];i.e=r}}else i.e=i.s+i.xs0;o=o._next}},function(t,e,i,s,r){this.t=t,this.p=e,this.v=i,this.r=r,s&&(s._prev=this,this._next=s)}),pe=(N._parseToProxy=function(t,e,i,s,r,n){var a,o,h,l,_,u=s,p={},f={},c=i._transform,m=I;for(i._transform=null,I=e,s=_=i.parse(t,e,s,r),I=m,n&&(i._transform=c,u&&(u._prev=null,u._prev&&(u._prev._next=null)));s&&s!==u;){if(1>=s.type&&(o=s.p,f[o]=s.s+s.c,p[o]=s.s,n||(l=new ue(s,"s",o,l,s.r),s.c=0),1===s.type))for(a=s.l;--a>0;)h="xn"+a,o=s.p+"_"+h,f[o]=s.data[h],p[o]=s[h],n||(l=new ue(s,h,o,l,s.rxp[h]));s=s._next}return{proxy:p,end:f,firstMPT:l,pt:_}},N.CSSPropTween=function(t,e,s,r,a,o,h,l,_,u,p){this.t=t,this.p=e,this.s=s,this.c=r,this.n=h||e,t instanceof pe||n.push(this.n),this.r=l,this.type=o||0,_&&(this.pr=_,i=!0),this.b=void 0===u?s:u,this.e=void 0===p?s+r:p,a&&(this._next=a,a._prev=this)}),fe=a.parseComplex=function(t,e,i,s,r,n,a,o,h,_){i=i||n||"",a=new pe(t,e,0,0,a,_?2:1,null,!1,o,i,s),s+="";var u,p,f,c,g,v,y,T,w,x,P,S,k=i.split(", ").join(",").split(" "),R=s.split(", ").join(",").split(" "),A=k.length,C=l!==!1;for((-1!==s.indexOf(",")||-1!==i.indexOf(","))&&(k=k.join(" ").replace(D,", ").split(" "),R=R.join(" ").replace(D,", ").split(" "),A=k.length),A!==R.length&&(k=(n||"").split(" "),A=k.length),a.plugin=h,a.setRatio=_,u=0;A>u;u++)if(c=k[u],g=R[u],T=parseFloat(c),T||0===T)a.appendXtra("",T,ie(g,T),g.replace(d,""),C&&-1!==g.indexOf("px"),!0);else if(r&&("#"===c.charAt(0)||ne[c]||b.test(c)))S=","===g.charAt(g.length-1)?"),":")",c=oe(c),g=oe(g),w=c.length+g.length>6,w&&!U&&0===g[3]?(a["xs"+a.l]+=a.l?" transparent":"transparent",a.e=a.e.split(R[u]).join("transparent")):(U||(w=!1),a.appendXtra(w?"rgba(":"rgb(",c[0],g[0]-c[0],",",!0,!0).appendXtra("",c[1],g[1]-c[1],",",!0).appendXtra("",c[2],g[2]-c[2],w?",":S,!0),w&&(c=4>c.length?1:c[3],a.appendXtra("",c,(4>g.length?1:g[3])-c,S,!1)));else if(v=c.match(m)){if(y=g.match(d),!y||y.length!==v.length)return a;for(f=0,p=0;v.length>p;p++)P=v[p],x=c.indexOf(P,f),a.appendXtra(c.substr(f,x-f),Number(P),ie(y[p],P),"",C&&"px"===c.substr(x+P.length,2),0===p),f=x+P.length;a["xs"+a.l]+=c.substr(f)}else a["xs"+a.l]+=a.l?" "+c:c;if(-1!==s.indexOf("=")&&a.data){for(S=a.xs0+a.data.s,u=1;a.l>u;u++)S+=a["xs"+u]+a.data["xn"+u];a.e=S+a["xs"+u]}return a.l||(a.type=-1,a.xs0=a.e),a.xfirst||a},ce=9;for(h=pe.prototype,h.l=h.pr=0;--ce>0;)h["xn"+ce]=0,h["xs"+ce]="";h.xs0="",h._next=h._prev=h.xfirst=h.data=h.plugin=h.setRatio=h.rxp=null,h.appendXtra=function(t,e,i,s,r,n){var a=this,o=a.l;return a["xs"+o]+=n&&o?" "+t:t||"",i||0===o||a.plugin?(a.l++,a.type=a.setRatio?2:1,a["xs"+a.l]=s||"",o>0?(a.data["xn"+o]=e+i,a.rxp["xn"+o]=r,a["xn"+o]=e,a.plugin||(a.xfirst=new pe(a,"xn"+o,e,i,a.xfirst||a,0,a.n,r,a.pr),a.xfirst.xs0=0),a):(a.data={s:e+i},a.rxp={},a.s=e,a.c=i,a.r=r,a)):(a["xs"+o]+=e+(s||""),a)};var me=function(t,e){e=e||{},this.p=e.prefix?V(t)||t:t,o[t]=o[this.p]=this,this.format=e.formatter||le(e.defaultValue,e.color,e.collapsible,e.multi),e.parser&&(this.parse=e.parser),this.clrs=e.color,this.multi=e.multi,this.keyword=e.keyword,this.dflt=e.defaultValue,this.pr=e.priority||0},de=N._registerComplexSpecialProp=function(t,e,i){"object"!=typeof e&&(e={parser:i});var s,r,n=t.split(","),a=e.defaultValue;for(i=i||[a],s=0;n.length>s;s++)e.prefix=0===s&&e.prefix,e.defaultValue=i[s]||a,r=new me(n[s],e)},ge=function(t){if(!o[t]){var e=t.charAt(0).toUpperCase()+t.substr(1)+"Plugin";de(t,{parser:function(t,i,s,r,n,a,h){var l=(window.GreenSockGlobals||window).com.greensock.plugins[e];return l?(l._cssRegister(),o[s].parse(t,i,s,r,n,a,h)):(j("Error: "+e+" js file not loaded."),n)}})}};h=me.prototype,h.parseComplex=function(t,e,i,s,r,n){var a,o,h,l,_,u,p=this.keyword;if(this.multi&&(D.test(i)||D.test(e)?(o=e.replace(D,"|").split("|"),h=i.replace(D,"|").split("|")):p&&(o=[e],h=[i])),h){for(l=h.length>o.length?h.length:o.length,a=0;l>a;a++)e=o[a]=o[a]||this.dflt,i=h[a]=h[a]||this.dflt,p&&(_=e.indexOf(p),u=i.indexOf(p),_!==u&&(i=-1===u?h:o,i[a]+=" "+p));e=o.join(", "),i=h.join(", ")}return fe(t,this.p,e,i,this.clrs,this.dflt,s,this.pr,r,n)},h.parse=function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(G(t,this.p,r,!1,this.dflt)),this.format(e),n,a)},a.registerSpecialProp=function(t,e,i){de(t,{parser:function(t,s,r,n,a,o){var h=new pe(t,r,0,0,a,2,r,!1,i);return h.plugin=o,h.setRatio=e(t,s,n._tween,r),h},priority:i})};var ve="scaleX,scaleY,scaleZ,x,y,z,skewX,skewY,rotation,rotationX,rotationY,perspective".split(","),ye=V("transform"),Te=B+"transform",we=V("transformOrigin"),xe=null!==V("perspective"),be=N.Transform=function(){this.skewY=0},Pe=N.getTransform=function(t,e,i,s){if(t._gsTransform&&i&&!s)return t._gsTransform;var r,n,o,h,l,_,u,p,f,c,m,d,g,v=i?t._gsTransform||new be:new be,y=0>v.scaleX,T=2e-5,w=1e5,x=179.99,b=x*M,P=xe?parseFloat(G(t,we,e,!1,"0 0 0").split(" ")[2])||v.zOrigin||0:0;for(ye?r=G(t,Te,e,!0):t.currentStyle&&(r=t.currentStyle.filter.match(C),r=r&&4===r.length?[r[0].substr(4),Number(r[2].substr(4)),Number(r[1].substr(4)),r[3].substr(4),v.x||0,v.y||0].join(","):""),n=(r||"").match(/(?:\-|\b)[\d\-\.e]+\b/gi)||[],o=n.length;--o>-1;)h=Number(n[o]),n[o]=(l=h-(h|=0))?(0|l*w+(0>l?-.5:.5))/w+h:h;if(16===n.length){var S=n[8],k=n[9],R=n[10],A=n[12],O=n[13],D=n[14];if(v.zOrigin&&(D=-v.zOrigin,A=S*D-n[12],O=k*D-n[13],D=R*D+v.zOrigin-n[14]),!i||s||null==v.rotationX){var I,E,L,F,N,X,U,Y=n[0],j=n[1],B=n[2],q=n[3],V=n[4],W=n[5],$=n[6],Z=n[7],Q=n[11],H=Math.atan2($,R),K=-b>H||H>b;v.rotationX=H*z,H&&(F=Math.cos(-H),N=Math.sin(-H),I=V*F+S*N,E=W*F+k*N,L=$*F+R*N,S=V*-N+S*F,k=W*-N+k*F,R=$*-N+R*F,Q=Z*-N+Q*F,V=I,W=E,$=L),H=Math.atan2(S,Y),v.rotationY=H*z,H&&(X=-b>H||H>b,F=Math.cos(-H),N=Math.sin(-H),I=Y*F-S*N,E=j*F-k*N,L=B*F-R*N,k=j*N+k*F,R=B*N+R*F,Q=q*N+Q*F,Y=I,j=E,B=L),H=Math.atan2(j,W),v.rotation=H*z,H&&(U=-b>H||H>b,F=Math.cos(-H),N=Math.sin(-H),Y=Y*F+V*N,E=j*F+W*N,W=j*-N+W*F,$=B*-N+$*F,j=E),U&&K?v.rotation=v.rotationX=0:U&&X?v.rotation=v.rotationY=0:X&&K&&(v.rotationY=v.rotationX=0),v.scaleX=(0|Math.sqrt(Y*Y+j*j)*w+.5)/w,v.scaleY=(0|Math.sqrt(W*W+k*k)*w+.5)/w,v.scaleZ=(0|Math.sqrt($*$+R*R)*w+.5)/w,v.skewX=0,v.perspective=Q?1/(0>Q?-Q:Q):0,v.x=A,v.y=O,v.z=D}}else if(!(xe&&!s&&n.length&&v.x===n[4]&&v.y===n[5]&&(v.rotationX||v.rotationY)||void 0!==v.x&&"none"===G(t,"display",e))){var J=n.length>=6,te=J?n[0]:1,ee=n[1]||0,ie=n[2]||0,se=J?n[3]:1;v.x=n[4]||0,v.y=n[5]||0,_=Math.sqrt(te*te+ee*ee),u=Math.sqrt(se*se+ie*ie),p=te||ee?Math.atan2(ee,te)*z:v.rotation||0,f=ie||se?Math.atan2(ie,se)*z+p:v.skewX||0,c=_-Math.abs(v.scaleX||0),m=u-Math.abs(v.scaleY||0),Math.abs(f)>90&&270>Math.abs(f)&&(y?(_*=-1,f+=0>=p?180:-180,p+=0>=p?180:-180):(u*=-1,f+=0>=f?180:-180)),d=(p-v.rotation)%180,g=(f-v.skewX)%180,(void 0===v.skewX||c>T||-T>c||m>T||-T>m||d>-x&&x>d&&false|d*w||g>-x&&x>g&&false|g*w)&&(v.scaleX=_,v.scaleY=u,v.rotation=p,v.skewX=f),xe&&(v.rotationX=v.rotationY=v.z=0,v.perspective=parseFloat(a.defaultTransformPerspective)||0,v.scaleZ=1)}v.zOrigin=P;for(o in v)T>v[o]&&v[o]>-T&&(v[o]=0);return i&&(t._gsTransform=v),v},Se=function(t){var e,i,s=this.data,r=-s.rotation*M,n=r+s.skewX*M,a=1e5,o=(0|Math.cos(r)*s.scaleX*a)/a,h=(0|Math.sin(r)*s.scaleX*a)/a,l=(0|Math.sin(n)*-s.scaleY*a)/a,_=(0|Math.cos(n)*s.scaleY*a)/a,u=this.t.style,p=this.t.currentStyle;if(p){i=h,h=-l,l=-i,e=p.filter,u.filter="";var f,m,d=this.t.offsetWidth,g=this.t.offsetHeight,v="absolute"!==p.position,w="progid:DXImageTransform.Microsoft.Matrix(M11="+o+", M12="+h+", M21="+l+", M22="+_,x=s.x,b=s.y;if(null!=s.ox&&(f=(s.oxp?.01*d*s.ox:s.ox)-d/2,m=(s.oyp?.01*g*s.oy:s.oy)-g/2,x+=f-(f*o+m*h),b+=m-(f*l+m*_)),v?(f=d/2,m=g/2,w+=", Dx="+(f-(f*o+m*h)+x)+", Dy="+(m-(f*l+m*_)+b)+")"):w+=", sizingMethod='auto expand')",u.filter=-1!==e.indexOf("DXImageTransform.Microsoft.Matrix(")?e.replace(O,w):w+" "+e,(0===t||1===t)&&1===o&&0===h&&0===l&&1===_&&(v&&-1===w.indexOf("Dx=0, Dy=0")||T.test(e)&&100!==parseFloat(RegExp.$1)||-1===e.indexOf("gradient("&&e.indexOf("Alpha"))&&u.removeAttribute("filter")),!v){var P,S,k,R=8>c?1:-1;for(f=s.ieOffsetX||0,m=s.ieOffsetY||0,s.ieOffsetX=Math.round((d-((0>o?-o:o)*d+(0>h?-h:h)*g))/2+x),s.ieOffsetY=Math.round((g-((0>_?-_:_)*g+(0>l?-l:l)*d))/2+b),ce=0;4>ce;ce++)S=J[ce],P=p[S],i=-1!==P.indexOf("px")?parseFloat(P):$(this.t,S,parseFloat(P),P.replace(y,""))||0,k=i!==s[S]?2>ce?-s.ieOffsetX:-s.ieOffsetY:2>ce?f-s.ieOffsetX:m-s.ieOffsetY,u[S]=(s[S]=Math.round(i-k*(0===ce||2===ce?1:R)))+"px"}}},ke=N.set3DTransformRatio=function(t){var e,i,s,r,n,a,o,h,l,_,u,f,c,m,d,g,v,y,T,w,x,b,P,S=this.data,k=this.t.style,R=S.rotation*M,A=S.scaleX,C=S.scaleY,O=S.scaleZ,D=S.perspective;if(!(1!==t&&0!==t||"auto"!==S.force3D||S.rotationY||S.rotationX||1!==O||D||S.z))return Re.call(this,t),void 0;if(p){var z=1e-4;z>A&&A>-z&&(A=O=2e-5),z>C&&C>-z&&(C=O=2e-5),!D||S.z||S.rotationX||S.rotationY||(D=0)}if(R||S.skewX)y=Math.cos(R),T=Math.sin(R),e=y,n=T,S.skewX&&(R-=S.skewX*M,y=Math.cos(R),T=Math.sin(R),"simple"===S.skewType&&(w=Math.tan(S.skewX*M),w=Math.sqrt(1+w*w),y*=w,T*=w)),i=-T,a=y;else{if(!(S.rotationY||S.rotationX||1!==O||D))return k[ye]="translate3d("+S.x+"px,"+S.y+"px,"+S.z+"px)"+(1!==A||1!==C?" scale("+A+","+C+")":""),void 0;e=a=1,i=n=0}u=1,s=r=o=h=l=_=f=c=m=0,d=D?-1/D:0,g=S.zOrigin,v=1e5,R=S.rotationY*M,R&&(y=Math.cos(R),T=Math.sin(R),l=u*-T,c=d*-T,s=e*T,o=n*T,u*=y,d*=y,e*=y,n*=y),R=S.rotationX*M,R&&(y=Math.cos(R),T=Math.sin(R),w=i*y+s*T,x=a*y+o*T,b=_*y+u*T,P=m*y+d*T,s=i*-T+s*y,o=a*-T+o*y,u=_*-T+u*y,d=m*-T+d*y,i=w,a=x,_=b,m=P),1!==O&&(s*=O,o*=O,u*=O,d*=O),1!==C&&(i*=C,a*=C,_*=C,m*=C),1!==A&&(e*=A,n*=A,l*=A,c*=A),g&&(f-=g,r=s*f,h=o*f,f=u*f+g),r=(w=(r+=S.x)-(r|=0))?(0|w*v+(0>w?-.5:.5))/v+r:r,h=(w=(h+=S.y)-(h|=0))?(0|w*v+(0>w?-.5:.5))/v+h:h,f=(w=(f+=S.z)-(f|=0))?(0|w*v+(0>w?-.5:.5))/v+f:f,k[ye]="matrix3d("+[(0|e*v)/v,(0|n*v)/v,(0|l*v)/v,(0|c*v)/v,(0|i*v)/v,(0|a*v)/v,(0|_*v)/v,(0|m*v)/v,(0|s*v)/v,(0|o*v)/v,(0|u*v)/v,(0|d*v)/v,r,h,f,D?1+-f/D:1].join(",")+")"},Re=N.set2DTransformRatio=function(t){var e,i,s,r,n,a=this.data,o=this.t,h=o.style;return a.rotationX||a.rotationY||a.z||a.force3D===!0||"auto"===a.force3D&&1!==t&&0!==t?(this.setRatio=ke,ke.call(this,t),void 0):(a.rotation||a.skewX?(e=a.rotation*M,i=e-a.skewX*M,s=1e5,r=a.scaleX*s,n=a.scaleY*s,h[ye]="matrix("+(0|Math.cos(e)*r)/s+","+(0|Math.sin(e)*r)/s+","+(0|Math.sin(i)*-n)/s+","+(0|Math.cos(i)*n)/s+","+a.x+","+a.y+")"):h[ye]="matrix("+a.scaleX+",0,0,"+a.scaleY+","+a.x+","+a.y+")",void 0)};de("transform,scale,scaleX,scaleY,scaleZ,x,y,z,rotation,rotationX,rotationY,rotationZ,skewX,skewY,shortRotation,shortRotationX,shortRotationY,shortRotationZ,transformOrigin,transformPerspective,directionalRotation,parseTransform,force3D,skewType",{parser:function(t,e,i,s,n,o,h){if(s._transform)return n;var l,_,u,p,f,c,m,d=s._transform=Pe(t,r,!0,h.parseTransform),g=t.style,v=1e-6,y=ve.length,T=h,w={};if("string"==typeof T.transform&&ye)u=L.style,u[ye]=T.transform,u.display="block",u.position="absolute",E.body.appendChild(L),l=Pe(L,null,!1),E.body.removeChild(L);else if("object"==typeof T){if(l={scaleX:se(null!=T.scaleX?T.scaleX:T.scale,d.scaleX),scaleY:se(null!=T.scaleY?T.scaleY:T.scale,d.scaleY),scaleZ:se(T.scaleZ,d.scaleZ),x:se(T.x,d.x),y:se(T.y,d.y),z:se(T.z,d.z),perspective:se(T.transformPerspective,d.perspective)},m=T.directionalRotation,null!=m)if("object"==typeof m)for(u in m)T[u]=m[u];else T.rotation=m;l.rotation=re("rotation"in T?T.rotation:"shortRotation"in T?T.shortRotation+"_short":"rotationZ"in T?T.rotationZ:d.rotation,d.rotation,"rotation",w),xe&&(l.rotationX=re("rotationX"in T?T.rotationX:"shortRotationX"in T?T.shortRotationX+"_short":d.rotationX||0,d.rotationX,"rotationX",w),l.rotationY=re("rotationY"in T?T.rotationY:"shortRotationY"in T?T.shortRotationY+"_short":d.rotationY||0,d.rotationY,"rotationY",w)),l.skewX=null==T.skewX?d.skewX:re(T.skewX,d.skewX),l.skewY=null==T.skewY?d.skewY:re(T.skewY,d.skewY),(_=l.skewY-d.skewY)&&(l.skewX+=_,l.rotation+=_)}for(xe&&null!=T.force3D&&(d.force3D=T.force3D,c=!0),d.skewType=T.skewType||d.skewType||a.defaultSkewType,f=d.force3D||d.z||d.rotationX||d.rotationY||l.z||l.rotationX||l.rotationY||l.perspective,f||null==T.scale||(l.scaleZ=1);--y>-1;)i=ve[y],p=l[i]-d[i],(p>v||-v>p||null!=I[i])&&(c=!0,n=new pe(d,i,d[i],p,n),i in w&&(n.e=w[i]),n.xs0=0,n.plugin=o,s._overwriteProps.push(n.n));return p=T.transformOrigin,(p||xe&&f&&d.zOrigin)&&(ye?(c=!0,i=we,p=(p||G(t,i,r,!1,"50% 50%"))+"",n=new pe(g,i,0,0,n,-1,"transformOrigin"),n.b=g[i],n.plugin=o,xe?(u=d.zOrigin,p=p.split(" "),d.zOrigin=(p.length>2&&(0===u||"0px"!==p[2])?parseFloat(p[2]):u)||0,n.xs0=n.e=p[0]+" "+(p[1]||"50%")+" 0px",n=new pe(d,"zOrigin",0,0,n,-1,n.n),n.b=u,n.xs0=n.e=d.zOrigin):n.xs0=n.e=p):ee(p+"",d)),c&&(s._transformType=f||3===this._transformType?3:2),n},prefix:!0}),de("boxShadow",{defaultValue:"0px 0px 0px 0px #999",prefix:!0,color:!0,multi:!0,keyword:"inset"}),de("borderRadius",{defaultValue:"0px",parser:function(t,e,i,n,a){e=this.format(e);var o,h,l,_,u,p,f,c,m,d,g,v,y,T,w,x,b=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],P=t.style;for(m=parseFloat(t.offsetWidth),d=parseFloat(t.offsetHeight),o=e.split(" "),h=0;b.length>h;h++)this.p.indexOf("border")&&(b[h]=V(b[h])),u=_=G(t,b[h],r,!1,"0px"),-1!==u.indexOf(" ")&&(_=u.split(" "),u=_[0],_=_[1]),p=l=o[h],f=parseFloat(u),v=u.substr((f+"").length),y="="===p.charAt(1),y?(c=parseInt(p.charAt(0)+"1",10),p=p.substr(2),c*=parseFloat(p),g=p.substr((c+"").length-(0>c?1:0))||""):(c=parseFloat(p),g=p.substr((c+"").length)),""===g&&(g=s[i]||v),g!==v&&(T=$(t,"borderLeft",f,v),w=$(t,"borderTop",f,v),"%"===g?(u=100*(T/m)+"%",_=100*(w/d)+"%"):"em"===g?(x=$(t,"borderLeft",1,"em"),u=T/x+"em",_=w/x+"em"):(u=T+"px",_=w+"px"),y&&(p=parseFloat(u)+c+g,l=parseFloat(_)+c+g)),a=fe(P,b[h],u+" "+_,p+" "+l,!1,"0px",a);return a},prefix:!0,formatter:le("0px 0px 0px 0px",!1,!0)}),de("backgroundPosition",{defaultValue:"0 0",parser:function(t,e,i,s,n,a){var o,h,l,_,u,p,f="background-position",m=r||W(t,null),d=this.format((m?c?m.getPropertyValue(f+"-x")+" "+m.getPropertyValue(f+"-y"):m.getPropertyValue(f):t.currentStyle.backgroundPositionX+" "+t.currentStyle.backgroundPositionY)||"0 0"),g=this.format(e);if(-1!==d.indexOf("%")!=(-1!==g.indexOf("%"))&&(p=G(t,"backgroundImage").replace(k,""),p&&"none"!==p)){for(o=d.split(" "),h=g.split(" "),F.setAttribute("src",p),l=2;--l>-1;)d=o[l],_=-1!==d.indexOf("%"),_!==(-1!==h[l].indexOf("%"))&&(u=0===l?t.offsetWidth-F.width:t.offsetHeight-F.height,o[l]=_?parseFloat(d)/100*u+"px":100*(parseFloat(d)/u)+"%");d=o.join(" ")}return this.parseComplex(t.style,d,g,n,a)},formatter:ee}),de("backgroundSize",{defaultValue:"0 0",formatter:ee}),de("perspective",{defaultValue:"0px",prefix:!0}),de("perspectiveOrigin",{defaultValue:"50% 50%",prefix:!0}),de("transformStyle",{prefix:!0}),de("backfaceVisibility",{prefix:!0}),de("userSelect",{prefix:!0}),de("margin",{parser:_e("marginTop,marginRight,marginBottom,marginLeft")}),de("padding",{parser:_e("paddingTop,paddingRight,paddingBottom,paddingLeft")}),de("clip",{defaultValue:"rect(0px,0px,0px,0px)",parser:function(t,e,i,s,n,a){var o,h,l;return 9>c?(h=t.currentStyle,l=8>c?" ":",",o="rect("+h.clipTop+l+h.clipRight+l+h.clipBottom+l+h.clipLeft+")",e=this.format(e).split(",").join(l)):(o=this.format(G(t,this.p,r,!1,this.dflt)),e=this.format(e)),this.parseComplex(t.style,o,e,n,a)}}),de("textShadow",{defaultValue:"0px 0px 0px #999",color:!0,multi:!0}),de("autoRound,strictUnits",{parser:function(t,e,i,s,r){return r}}),de("border",{defaultValue:"0px solid #000",parser:function(t,e,i,s,n,a){return this.parseComplex(t.style,this.format(G(t,"borderTopWidth",r,!1,"0px")+" "+G(t,"borderTopStyle",r,!1,"solid")+" "+G(t,"borderTopColor",r,!1,"#000")),this.format(e),n,a)},color:!0,formatter:function(t){var e=t.split(" ");return e[0]+" "+(e[1]||"solid")+" "+(t.match(he)||["#000"])[0]}}),de("borderWidth",{parser:_e("borderTopWidth,borderRightWidth,borderBottomWidth,borderLeftWidth")}),de("float,cssFloat,styleFloat",{parser:function(t,e,i,s,r){var n=t.style,a="cssFloat"in n?"cssFloat":"styleFloat";return new pe(n,a,0,0,r,-1,i,!1,0,n[a],e)}});var Ae=function(t){var e,i=this.t,s=i.filter||G(this.data,"filter"),r=0|this.s+this.c*t;100===r&&(-1===s.indexOf("atrix(")&&-1===s.indexOf("radient(")&&-1===s.indexOf("oader(")?(i.removeAttribute("filter"),e=!G(this.data,"filter")):(i.filter=s.replace(x,""),e=!0)),e||(this.xn1&&(i.filter=s=s||"alpha(opacity="+r+")"),-1===s.indexOf("pacity")?0===r&&this.xn1||(i.filter=s+" alpha(opacity="+r+")"):i.filter=s.replace(T,"opacity="+r))};de("opacity,alpha,autoAlpha",{defaultValue:"1",parser:function(t,e,i,s,n,a){var o=parseFloat(G(t,"opacity",r,!1,"1")),h=t.style,l="autoAlpha"===i;return"string"==typeof e&&"="===e.charAt(1)&&(e=("-"===e.charAt(0)?-1:1)*parseFloat(e.substr(2))+o),l&&1===o&&"hidden"===G(t,"visibility",r)&&0!==e&&(o=0),U?n=new pe(h,"opacity",o,e-o,n):(n=new pe(h,"opacity",100*o,100*(e-o),n),n.xn1=l?1:0,h.zoom=1,n.type=2,n.b="alpha(opacity="+n.s+")",n.e="alpha(opacity="+(n.s+n.c)+")",n.data=t,n.plugin=a,n.setRatio=Ae),l&&(n=new pe(h,"visibility",0,0,n,-1,null,!1,0,0!==o?"inherit":"hidden",0===e?"hidden":"inherit"),n.xs0="inherit",s._overwriteProps.push(n.n),s._overwriteProps.push(i)),n}});var Ce=function(t,e){e&&(t.removeProperty?("ms"===e.substr(0,2)&&(e="M"+e.substr(1)),t.removeProperty(e.replace(P,"-$1").toLowerCase())):t.removeAttribute(e))},Oe=function(t){if(this.t._gsClassPT=this,1===t||0===t){this.t.setAttribute("class",0===t?this.b:this.e);for(var e=this.data,i=this.t.style;e;)e.v?i[e.p]=e.v:Ce(i,e.p),e=e._next;1===t&&this.t._gsClassPT===this&&(this.t._gsClassPT=null)}else this.t.getAttribute("class")!==this.e&&this.t.setAttribute("class",this.e)};de("className",{parser:function(t,e,s,n,a,o,h){var l,_,u,p,f,c=t.getAttribute("class")||"",m=t.style.cssText;if(a=n._classNamePT=new pe(t,s,0,0,a,2),a.setRatio=Oe,a.pr=-11,i=!0,a.b=c,_=Q(t,r),u=t._gsClassPT){for(p={},f=u.data;f;)p[f.p]=1,f=f._next;u.setRatio(1)}return t._gsClassPT=a,a.e="="!==e.charAt(1)?e:c.replace(RegExp("\\s*\\b"+e.substr(2)+"\\b"),"")+("+"===e.charAt(0)?" "+e.substr(2):""),n._tween._duration&&(t.setAttribute("class",a.e),l=H(t,_,Q(t),h,p),t.setAttribute("class",c),a.data=l.firstMPT,t.style.cssText=m,a=a.xfirst=n.parse(t,l.difs,a,o)),a}});var De=function(t){if((1===t||0===t)&&this.data._totalTime===this.data._totalDuration&&"isFromStart"!==this.data.data){var e,i,s,r,n=this.t.style,a=o.transform.parse;if("all"===this.e)n.cssText="",r=!0;else for(e=this.e.split(","),s=e.length;--s>-1;)i=e[s],o[i]&&(o[i].parse===a?r=!0:i="transformOrigin"===i?we:o[i].p),Ce(n,i);r&&(Ce(n,ye),this.t._gsTransform&&delete this.t._gsTransform)}};for(de("clearProps",{parser:function(t,e,s,r,n){return n=new pe(t,s,0,0,n,2),n.setRatio=De,n.e=e,n.pr=-10,n.data=r._tween,i=!0,n}}),h="bezier,throwProps,physicsProps,physics2D".split(","),ce=h.length;ce--;)ge(h[ce]);h=a.prototype,h._firstPT=null,h._onInitTween=function(t,e,o){if(!t.nodeType)return!1;this._target=t,this._tween=o,this._vars=e,l=e.autoRound,i=!1,s=e.suffixMap||a.suffixMap,r=W(t,""),n=this._overwriteProps;var h,p,c,m,d,g,v,y,T,x=t.style;if(_&&""===x.zIndex&&(h=G(t,"zIndex",r),("auto"===h||""===h)&&this._addLazySet(x,"zIndex",0)),"string"==typeof e&&(m=x.cssText,h=Q(t,r),x.cssText=m+";"+e,h=H(t,h,Q(t)).difs,!U&&w.test(e)&&(h.opacity=parseFloat(RegExp.$1)),e=h,x.cssText=m),this._firstPT=p=this.parse(t,e,null),this._transformType){for(T=3===this._transformType,ye?u&&(_=!0,""===x.zIndex&&(v=G(t,"zIndex",r),("auto"===v||""===v)&&this._addLazySet(x,"zIndex",0)),f&&this._addLazySet(x,"WebkitBackfaceVisibility",this._vars.WebkitBackfaceVisibility||(T?"visible":"hidden"))):x.zoom=1,c=p;c&&c._next;)c=c._next;y=new pe(t,"transform",0,0,null,2),this._linkCSSP(y,null,c),y.setRatio=T&&xe?ke:ye?Re:Se,y.data=this._transform||Pe(t,r,!0),n.pop()}if(i){for(;p;){for(g=p._next,c=m;c&&c.pr>p.pr;)c=c._next;(p._prev=c?c._prev:d)?p._prev._next=p:m=p,(p._next=c)?c._prev=p:d=p,p=g}this._firstPT=m}return!0},h.parse=function(t,e,i,n){var a,h,_,u,p,f,c,m,d,g,v=t.style;for(a in e)f=e[a],h=o[a],h?i=h.parse(t,f,a,this,i,n,e):(p=G(t,a,r)+"",d="string"==typeof f,"color"===a||"fill"===a||"stroke"===a||-1!==a.indexOf("Color")||d&&b.test(f)?(d||(f=oe(f),f=(f.length>3?"rgba(":"rgb(")+f.join(",")+")"),i=fe(v,a,p,f,!0,"transparent",i,0,n)):!d||-1===f.indexOf(" ")&&-1===f.indexOf(",")?(_=parseFloat(p),c=_||0===_?p.substr((_+"").length):"",(""===p||"auto"===p)&&("width"===a||"height"===a?(_=te(t,a,r),c="px"):"left"===a||"top"===a?(_=Z(t,a,r),c="px"):(_="opacity"!==a?0:1,c="")),g=d&&"="===f.charAt(1),g?(u=parseInt(f.charAt(0)+"1",10),f=f.substr(2),u*=parseFloat(f),m=f.replace(y,"")):(u=parseFloat(f),m=d?f.substr((u+"").length)||"":""),""===m&&(m=a in s?s[a]:c),f=u||0===u?(g?u+_:u)+m:e[a],c!==m&&""!==m&&(u||0===u)&&_&&(_=$(t,a,_,c),"%"===m?(_/=$(t,a,100,"%")/100,e.strictUnits!==!0&&(p=_+"%")):"em"===m?_/=$(t,a,1,"em"):"px"!==m&&(u=$(t,a,u,m),m="px"),g&&(u||0===u)&&(f=u+_+m)),g&&(u+=_),!_&&0!==_||!u&&0!==u?void 0!==v[a]&&(f||"NaN"!=f+""&&null!=f)?(i=new pe(v,a,u||_||0,0,i,-1,a,!1,0,p,f),i.xs0="none"!==f||"display"!==a&&-1===a.indexOf("Style")?f:p):j("invalid "+a+" tween value: "+e[a]):(i=new pe(v,a,_,u-_,i,0,a,l!==!1&&("px"===m||"zIndex"===a),0,p,f),i.xs0=m)):i=fe(v,a,p,f,!0,null,i,0,n)),n&&i&&!i.plugin&&(i.plugin=n);return i},h.setRatio=function(t){var e,i,s,r=this._firstPT,n=1e-6;if(1!==t||this._tween._time!==this._tween._duration&&0!==this._tween._time)if(t||this._tween._time!==this._tween._duration&&0!==this._tween._time||this._tween._rawPrevTime===-1e-6)for(;r;){if(e=r.c*t+r.s,r.r?e=Math.round(e):n>e&&e>-n&&(e=0),r.type)if(1===r.type)if(s=r.l,2===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2;else if(3===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3;else if(4===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4;else if(5===s)r.t[r.p]=r.xs0+e+r.xs1+r.xn1+r.xs2+r.xn2+r.xs3+r.xn3+r.xs4+r.xn4+r.xs5;else{for(i=r.xs0+e+r.xs1,s=1;r.l>s;s++)i+=r["xn"+s]+r["xs"+(s+1)];r.t[r.p]=i}else-1===r.type?r.t[r.p]=r.xs0:r.setRatio&&r.setRatio(t);else r.t[r.p]=e+r.xs0;r=r._next}else for(;r;)2!==r.type?r.t[r.p]=r.b:r.setRatio(t),r=r._next;else for(;r;)2!==r.type?r.t[r.p]=r.e:r.setRatio(t),r=r._next},h._enableTransforms=function(t){this._transformType=t||3===this._transformType?3:2,this._transform=this._transform||Pe(this._target,r,!0)};var Me=function(){this.t[this.p]=this.e,this.data._linkCSSP(this,this._next,null,!0)
};h._addLazySet=function(t,e,i){var s=this._firstPT=new pe(t,e,0,0,this._firstPT,2);s.e=i,s.setRatio=Me,s.data=this},h._linkCSSP=function(t,e,i,s){return t&&(e&&(e._prev=t),t._next&&(t._next._prev=t._prev),t._prev?t._prev._next=t._next:this._firstPT===t&&(this._firstPT=t._next,s=!0),i?i._next=t:s||null!==this._firstPT||(this._firstPT=t),t._next=e,t._prev=i),t},h._kill=function(e){var i,s,r,n=e;if(e.autoAlpha||e.alpha){n={};for(s in e)n[s]=e[s];n.opacity=1,n.autoAlpha&&(n.visibility=1)}return e.className&&(i=this._classNamePT)&&(r=i.xfirst,r&&r._prev?this._linkCSSP(r._prev,i._next,r._prev._prev):r===this._firstPT&&(this._firstPT=i._next),i._next&&this._linkCSSP(i._next,i._next._next,r._prev),this._classNamePT=null),t.prototype._kill.call(this,n)};var ze=function(t,e,i){var s,r,n,a;if(t.slice)for(r=t.length;--r>-1;)ze(t[r],e,i);else for(s=t.childNodes,r=s.length;--r>-1;)n=s[r],a=n.type,n.style&&(e.push(Q(n)),i&&i.push(n)),1!==a&&9!==a&&11!==a||!n.childNodes.length||ze(n,e,i)};return a.cascadeTo=function(t,i,s){var r,n,a,o=e.to(t,i,s),h=[o],l=[],_=[],u=[],p=e._internals.reservedProps;for(t=o._targets||o.target,ze(t,l,u),o.render(i,!0),ze(t,_),o.render(0,!0),o._enabled(!0),r=u.length;--r>-1;)if(n=H(u[r],l[r],_[r]),n.firstMPT){n=n.difs;for(a in s)p[a]&&(n[a]=s[a]);h.push(e.to(u[r],i,n))}return h},t.activate([a]),a},!0),function(){var t=window._gsDefine.plugin({propName:"roundProps",priority:-1,API:2,init:function(t,e,i){return this._tween=i,!0}}),e=t.prototype;e._onInitAllProps=function(){for(var t,e,i,s=this._tween,r=s.vars.roundProps instanceof Array?s.vars.roundProps:s.vars.roundProps.split(","),n=r.length,a={},o=s._propLookup.roundProps;--n>-1;)a[r[n]]=1;for(n=r.length;--n>-1;)for(t=r[n],e=s._firstPT;e;)i=e._next,e.pg?e.t._roundProps(a,!0):e.n===t&&(this._add(e.t,t,e.s,e.c),i&&(i._prev=e._prev),e._prev?e._prev._next=i:s._firstPT===e&&(s._firstPT=i),e._next=e._prev=null,s._propLookup[t]=o),e=i;return!1},e._add=function(t,e,i,s){this._addTween(t,e,i,i+s,e,!0),this._overwriteProps.push(e)}}(),window._gsDefine.plugin({propName:"attr",API:2,version:"0.3.2",init:function(t,e){var i,s,r;if("function"!=typeof t.setAttribute)return!1;this._target=t,this._proxy={},this._start={},this._end={};for(i in e)this._start[i]=this._proxy[i]=s=t.getAttribute(i),r=this._addTween(this._proxy,i,parseFloat(s),e[i],i),this._end[i]=r?r.s+r.c:e[i],this._overwriteProps.push(i);return!0},set:function(t){this._super.setRatio.call(this,t);for(var e,i=this._overwriteProps,s=i.length,r=1===t?this._end:t?this._proxy:this._start;--s>-1;)e=i[s],this._target.setAttribute(e,r[e]+"")}}),window._gsDefine.plugin({propName:"directionalRotation",API:2,version:"0.2.0",init:function(t,e){"object"!=typeof e&&(e={rotation:e}),this.finals={};var i,s,r,n,a,o,h=e.useRadians===!0?2*Math.PI:360,l=1e-6;for(i in e)"useRadians"!==i&&(o=(e[i]+"").split("_"),s=o[0],r=parseFloat("function"!=typeof t[i]?t[i]:t[i.indexOf("set")||"function"!=typeof t["get"+i.substr(3)]?i:"get"+i.substr(3)]()),n=this.finals[i]="string"==typeof s&&"="===s.charAt(1)?r+parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)):Number(s)||0,a=n-r,o.length&&(s=o.join("_"),-1!==s.indexOf("short")&&(a%=h,a!==a%(h/2)&&(a=0>a?a+h:a-h)),-1!==s.indexOf("_cw")&&0>a?a=(a+9999999999*h)%h-(0|a/h)*h:-1!==s.indexOf("ccw")&&a>0&&(a=(a-9999999999*h)%h-(0|a/h)*h)),(a>l||-l>a)&&(this._addTween(t,i,r,r+a,i),this._overwriteProps.push(i)));return!0},set:function(t){var e;if(1!==t)this._super.setRatio.call(this,t);else for(e=this._firstPT;e;)e.f?e.t[e.p](this.finals[e.p]):e.t[e.p]=this.finals[e.p],e=e._next}})._autoCSS=!0,window._gsDefine("easing.Back",["easing.Ease"],function(t){var e,i,s,r=window.GreenSockGlobals||window,n=r.com.greensock,a=2*Math.PI,o=Math.PI/2,h=n._class,l=function(e,i){var s=h("easing."+e,function(){},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,s},_=t.register||function(){},u=function(t,e,i,s){var r=h("easing."+t,{easeOut:new e,easeIn:new i,easeInOut:new s},!0);return _(r,t),r},p=function(t,e,i){this.t=t,this.v=e,i&&(this.next=i,i.prev=this,this.c=i.v-e,this.gap=i.t-t)},f=function(e,i){var s=h("easing."+e,function(t){this._p1=t||0===t?t:1.70158,this._p2=1.525*this._p1},!0),r=s.prototype=new t;return r.constructor=s,r.getRatio=i,r.config=function(t){return new s(t)},s},c=u("Back",f("BackOut",function(t){return(t-=1)*t*((this._p1+1)*t+this._p1)+1}),f("BackIn",function(t){return t*t*((this._p1+1)*t-this._p1)}),f("BackInOut",function(t){return 1>(t*=2)?.5*t*t*((this._p2+1)*t-this._p2):.5*((t-=2)*t*((this._p2+1)*t+this._p2)+2)})),m=h("easing.SlowMo",function(t,e,i){e=e||0===e?e:.7,null==t?t=.7:t>1&&(t=1),this._p=1!==t?e:0,this._p1=(1-t)/2,this._p2=t,this._p3=this._p1+this._p2,this._calcEnd=i===!0},!0),d=m.prototype=new t;return d.constructor=m,d.getRatio=function(t){var e=t+(.5-t)*this._p;return this._p1>t?this._calcEnd?1-(t=1-t/this._p1)*t:e-(t=1-t/this._p1)*t*t*t*e:t>this._p3?this._calcEnd?1-(t=(t-this._p3)/this._p1)*t:e+(t-e)*(t=(t-this._p3)/this._p1)*t*t*t:this._calcEnd?1:e},m.ease=new m(.7,.7),d.config=m.config=function(t,e,i){return new m(t,e,i)},e=h("easing.SteppedEase",function(t){t=t||1,this._p1=1/t,this._p2=t+1},!0),d=e.prototype=new t,d.constructor=e,d.getRatio=function(t){return 0>t?t=0:t>=1&&(t=.999999999),(this._p2*t>>0)*this._p1},d.config=e.config=function(t){return new e(t)},i=h("easing.RoughEase",function(e){e=e||{};for(var i,s,r,n,a,o,h=e.taper||"none",l=[],_=0,u=0|(e.points||20),f=u,c=e.randomize!==!1,m=e.clamp===!0,d=e.template instanceof t?e.template:null,g="number"==typeof e.strength?.4*e.strength:.4;--f>-1;)i=c?Math.random():1/u*f,s=d?d.getRatio(i):i,"none"===h?r=g:"out"===h?(n=1-i,r=n*n*g):"in"===h?r=i*i*g:.5>i?(n=2*i,r=.5*n*n*g):(n=2*(1-i),r=.5*n*n*g),c?s+=Math.random()*r-.5*r:f%2?s+=.5*r:s-=.5*r,m&&(s>1?s=1:0>s&&(s=0)),l[_++]={x:i,y:s};for(l.sort(function(t,e){return t.x-e.x}),o=new p(1,1,null),f=u;--f>-1;)a=l[f],o=new p(a.x,a.y,o);this._prev=new p(0,0,0!==o.t?o:o.next)},!0),d=i.prototype=new t,d.constructor=i,d.getRatio=function(t){var e=this._prev;if(t>e.t){for(;e.next&&t>=e.t;)e=e.next;e=e.prev}else for(;e.prev&&e.t>=t;)e=e.prev;return this._prev=e,e.v+(t-e.t)/e.gap*e.c},d.config=function(t){return new i(t)},i.ease=new i,u("Bounce",l("BounceOut",function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}),l("BounceIn",function(t){return 1/2.75>(t=1-t)?1-7.5625*t*t:2/2.75>t?1-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1-(7.5625*(t-=2.25/2.75)*t+.9375):1-(7.5625*(t-=2.625/2.75)*t+.984375)}),l("BounceInOut",function(t){var e=.5>t;return t=e?1-2*t:2*t-1,t=1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375,e?.5*(1-t):.5*t+.5})),u("Circ",l("CircOut",function(t){return Math.sqrt(1-(t-=1)*t)}),l("CircIn",function(t){return-(Math.sqrt(1-t*t)-1)}),l("CircInOut",function(t){return 1>(t*=2)?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)})),s=function(e,i,s){var r=h("easing."+e,function(t,e){this._p1=t||1,this._p2=e||s,this._p3=this._p2/a*(Math.asin(1/this._p1)||0)},!0),n=r.prototype=new t;return n.constructor=r,n.getRatio=i,n.config=function(t,e){return new r(t,e)},r},u("Elastic",s("ElasticOut",function(t){return this._p1*Math.pow(2,-10*t)*Math.sin((t-this._p3)*a/this._p2)+1},.3),s("ElasticIn",function(t){return-(this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2))},.3),s("ElasticInOut",function(t){return 1>(t*=2)?-.5*this._p1*Math.pow(2,10*(t-=1))*Math.sin((t-this._p3)*a/this._p2):.5*this._p1*Math.pow(2,-10*(t-=1))*Math.sin((t-this._p3)*a/this._p2)+1},.45)),u("Expo",l("ExpoOut",function(t){return 1-Math.pow(2,-10*t)}),l("ExpoIn",function(t){return Math.pow(2,10*(t-1))-.001}),l("ExpoInOut",function(t){return 1>(t*=2)?.5*Math.pow(2,10*(t-1)):.5*(2-Math.pow(2,-10*(t-1)))})),u("Sine",l("SineOut",function(t){return Math.sin(t*o)}),l("SineIn",function(t){return-Math.cos(t*o)+1}),l("SineInOut",function(t){return-.5*(Math.cos(Math.PI*t)-1)})),h("easing.EaseLookup",{find:function(e){return t.map[e]}},!0),_(r.SlowMo,"SlowMo","ease,"),_(i,"RoughEase","ease,"),_(e,"SteppedEase","ease,"),c},!0)}),function(t){"use strict";var e=t.GreenSockGlobals||t;if(!e.TweenLite){var i,s,r,n,a,o=function(t){var i,s=t.split("."),r=e;for(i=0;s.length>i;i++)r[s[i]]=r=r[s[i]]||{};return r},h=o("com.greensock"),l=1e-10,_=[].slice,u=function(){},p=function(){var t=Object.prototype.toString,e=t.call([]);return function(i){return null!=i&&(i instanceof Array||"object"==typeof i&&!!i.push&&t.call(i)===e)}}(),f={},c=function(i,s,r,n){this.sc=f[i]?f[i].sc:[],f[i]=this,this.gsClass=null,this.func=r;var a=[];this.check=function(h){for(var l,_,u,p,m=s.length,d=m;--m>-1;)(l=f[s[m]]||new c(s[m],[])).gsClass?(a[m]=l.gsClass,d--):h&&l.sc.push(this);if(0===d&&r)for(_=("com.greensock."+i).split("."),u=_.pop(),p=o(_.join("."))[u]=this.gsClass=r.apply(r,a),n&&(e[u]=p,"function"==typeof define&&define.amd?define((t.GreenSockAMDPath?t.GreenSockAMDPath+"/":"")+i.split(".").join("/"),[],function(){return p}):"undefined"!=typeof module&&module.exports&&(module.exports=p)),m=0;this.sc.length>m;m++)this.sc[m].check()},this.check(!0)},m=t._gsDefine=function(t,e,i,s){return new c(t,e,i,s)},d=h._class=function(t,e,i){return e=e||function(){},m(t,[],function(){return e},i),e};m.globals=e;var g=[0,0,1,1],v=[],y=d("easing.Ease",function(t,e,i,s){this._func=t,this._type=i||0,this._power=s||0,this._params=e?g.concat(e):g},!0),T=y.map={},w=y.register=function(t,e,i,s){for(var r,n,a,o,l=e.split(","),_=l.length,u=(i||"easeIn,easeOut,easeInOut").split(",");--_>-1;)for(n=l[_],r=s?d("easing."+n,null,!0):h.easing[n]||{},a=u.length;--a>-1;)o=u[a],T[n+"."+o]=T[o+n]=r[o]=t.getRatio?t:t[o]||new t};for(r=y.prototype,r._calcEnd=!1,r.getRatio=function(t){if(this._func)return this._params[0]=t,this._func.apply(null,this._params);var e=this._type,i=this._power,s=1===e?1-t:2===e?t:.5>t?2*t:2*(1-t);return 1===i?s*=s:2===i?s*=s*s:3===i?s*=s*s*s:4===i&&(s*=s*s*s*s),1===e?1-s:2===e?s:.5>t?s/2:1-s/2},i=["Linear","Quad","Cubic","Quart","Quint,Strong"],s=i.length;--s>-1;)r=i[s]+",Power"+s,w(new y(null,null,1,s),r,"easeOut",!0),w(new y(null,null,2,s),r,"easeIn"+(0===s?",easeNone":"")),w(new y(null,null,3,s),r,"easeInOut");T.linear=h.easing.Linear.easeIn,T.swing=h.easing.Quad.easeInOut;var x=d("events.EventDispatcher",function(t){this._listeners={},this._eventTarget=t||this});r=x.prototype,r.addEventListener=function(t,e,i,s,r){r=r||0;var o,h,l=this._listeners[t],_=0;for(null==l&&(this._listeners[t]=l=[]),h=l.length;--h>-1;)o=l[h],o.c===e&&o.s===i?l.splice(h,1):0===_&&r>o.pr&&(_=h+1);l.splice(_,0,{c:e,s:i,up:s,pr:r}),this!==n||a||n.wake()},r.removeEventListener=function(t,e){var i,s=this._listeners[t];if(s)for(i=s.length;--i>-1;)if(s[i].c===e)return s.splice(i,1),void 0},r.dispatchEvent=function(t){var e,i,s,r=this._listeners[t];if(r)for(e=r.length,i=this._eventTarget;--e>-1;)s=r[e],s.up?s.c.call(s.s||i,{type:t,target:i}):s.c.call(s.s||i)};var b=t.requestAnimationFrame,P=t.cancelAnimationFrame,S=Date.now||function(){return(new Date).getTime()},k=S();for(i=["ms","moz","webkit","o"],s=i.length;--s>-1&&!b;)b=t[i[s]+"RequestAnimationFrame"],P=t[i[s]+"CancelAnimationFrame"]||t[i[s]+"CancelRequestAnimationFrame"];d("Ticker",function(t,e){var i,s,r,o,h,_=this,p=S(),f=e!==!1&&b,c=500,m=33,d=function(t){var e,n,a=S()-k;a>c&&(p+=a-m),k+=a,_.time=(k-p)/1e3,e=_.time-h,(!i||e>0||t===!0)&&(_.frame++,h+=e+(e>=o?.004:o-e),n=!0),t!==!0&&(r=s(d)),n&&_.dispatchEvent("tick")};x.call(_),_.time=_.frame=0,_.tick=function(){d(!0)},_.lagSmoothing=function(t,e){c=t||1/l,m=Math.min(e,c,0)},_.sleep=function(){null!=r&&(f&&P?P(r):clearTimeout(r),s=u,r=null,_===n&&(a=!1))},_.wake=function(){null!==r?_.sleep():_.frame>10&&(k=S()-c+5),s=0===i?u:f&&b?b:function(t){return setTimeout(t,0|1e3*(h-_.time)+1)},_===n&&(a=!0),d(2)},_.fps=function(t){return arguments.length?(i=t,o=1/(i||60),h=this.time+o,_.wake(),void 0):i},_.useRAF=function(t){return arguments.length?(_.sleep(),f=t,_.fps(i),void 0):f},_.fps(t),setTimeout(function(){f&&(!r||5>_.frame)&&_.useRAF(!1)},1500)}),r=h.Ticker.prototype=new h.events.EventDispatcher,r.constructor=h.Ticker;var R=d("core.Animation",function(t,e){if(this.vars=e=e||{},this._duration=this._totalDuration=t||0,this._delay=Number(e.delay)||0,this._timeScale=1,this._active=e.immediateRender===!0,this.data=e.data,this._reversed=e.reversed===!0,j){a||n.wake();var i=this.vars.useFrames?Y:j;i.add(this,i._time),this.vars.paused&&this.paused(!0)}});n=R.ticker=new h.Ticker,r=R.prototype,r._dirty=r._gc=r._initted=r._paused=!1,r._totalTime=r._time=0,r._rawPrevTime=-1,r._next=r._last=r._onUpdate=r._timeline=r.timeline=null,r._paused=!1;var A=function(){a&&S()-k>2e3&&n.wake(),setTimeout(A,2e3)};A(),r.play=function(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},r.pause=function(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},r.resume=function(t,e){return null!=t&&this.seek(t,e),this.paused(!1)},r.seek=function(t,e){return this.totalTime(Number(t),e!==!1)},r.restart=function(t,e){return this.reversed(!1).paused(!1).totalTime(t?-this._delay:0,e!==!1,!0)},r.reverse=function(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},r.render=function(){},r.invalidate=function(){return this},r.isActive=function(){var t,e=this._timeline,i=this._startTime;return!e||!this._gc&&!this._paused&&e.isActive()&&(t=e.rawTime())>=i&&i+this.totalDuration()/this._timeScale>t},r._enabled=function(t,e){return a||n.wake(),this._gc=!t,this._active=this.isActive(),e!==!0&&(t&&!this.timeline?this._timeline.add(this,this._startTime-this._delay):!t&&this.timeline&&this._timeline._remove(this,!0)),!1},r._kill=function(){return this._enabled(!1,!1)},r.kill=function(t,e){return this._kill(t,e),this},r._uncache=function(t){for(var e=t?this:this.timeline;e;)e._dirty=!0,e=e.timeline;return this},r._swapSelfInParams=function(t){for(var e=t.length,i=t.concat();--e>-1;)"{self}"===t[e]&&(i[e]=this);return i},r.eventCallback=function(t,e,i,s){if("on"===(t||"").substr(0,2)){var r=this.vars;if(1===arguments.length)return r[t];null==e?delete r[t]:(r[t]=e,r[t+"Params"]=p(i)&&-1!==i.join("").indexOf("{self}")?this._swapSelfInParams(i):i,r[t+"Scope"]=s),"onUpdate"===t&&(this._onUpdate=e)}return this},r.delay=function(t){return arguments.length?(this._timeline.smoothChildTiming&&this.startTime(this._startTime+t-this._delay),this._delay=t,this):this._delay},r.duration=function(t){return arguments.length?(this._duration=this._totalDuration=t,this._uncache(!0),this._timeline.smoothChildTiming&&this._time>0&&this._time<this._duration&&0!==t&&this.totalTime(this._totalTime*(t/this._duration),!0),this):(this._dirty=!1,this._duration)},r.totalDuration=function(t){return this._dirty=!1,arguments.length?this.duration(t):this._totalDuration},r.time=function(t,e){return arguments.length?(this._dirty&&this.totalDuration(),this.totalTime(t>this._duration?this._duration:t,e)):this._time},r.totalTime=function(t,e,i){if(a||n.wake(),!arguments.length)return this._totalTime;if(this._timeline){if(0>t&&!i&&(t+=this.totalDuration()),this._timeline.smoothChildTiming){this._dirty&&this.totalDuration();var s=this._totalDuration,r=this._timeline;if(t>s&&!i&&(t=s),this._startTime=(this._paused?this._pauseTime:r._time)-(this._reversed?s-t:t)/this._timeScale,r._dirty||this._uncache(!1),r._timeline)for(;r._timeline;)r._timeline._time!==(r._startTime+r._totalTime)/r._timeScale&&r.totalTime(r._totalTime,!0),r=r._timeline}this._gc&&this._enabled(!0,!1),(this._totalTime!==t||0===this._duration)&&(this.render(t,e,!1),z.length&&B())}return this},r.progress=r.totalProgress=function(t,e){return arguments.length?this.totalTime(this.duration()*t,e):this._time/this.duration()},r.startTime=function(t){return arguments.length?(t!==this._startTime&&(this._startTime=t,this.timeline&&this.timeline._sortChildren&&this.timeline.add(this,t-this._delay)),this):this._startTime},r.timeScale=function(t){if(!arguments.length)return this._timeScale;if(t=t||l,this._timeline&&this._timeline.smoothChildTiming){var e=this._pauseTime,i=e||0===e?e:this._timeline.totalTime();this._startTime=i-(i-this._startTime)*this._timeScale/t}return this._timeScale=t,this._uncache(!1)},r.reversed=function(t){return arguments.length?(t!=this._reversed&&(this._reversed=t,this.totalTime(this._timeline&&!this._timeline.smoothChildTiming?this.totalDuration()-this._totalTime:this._totalTime,!0)),this):this._reversed},r.paused=function(t){if(!arguments.length)return this._paused;if(t!=this._paused&&this._timeline){a||t||n.wake();var e=this._timeline,i=e.rawTime(),s=i-this._pauseTime;!t&&e.smoothChildTiming&&(this._startTime+=s,this._uncache(!1)),this._pauseTime=t?i:null,this._paused=t,this._active=this.isActive(),!t&&0!==s&&this._initted&&this.duration()&&this.render(e.smoothChildTiming?this._totalTime:(i-this._startTime)/this._timeScale,!0,!0)}return this._gc&&!t&&this._enabled(!0,!1),this};var C=d("core.SimpleTimeline",function(t){R.call(this,0,t),this.autoRemoveChildren=this.smoothChildTiming=!0});r=C.prototype=new R,r.constructor=C,r.kill()._gc=!1,r._first=r._last=null,r._sortChildren=!1,r.add=r.insert=function(t,e){var i,s;if(t._startTime=Number(e||0)+t._delay,t._paused&&this!==t._timeline&&(t._pauseTime=t._startTime+(this.rawTime()-t._startTime)/t._timeScale),t.timeline&&t.timeline._remove(t,!0),t.timeline=t._timeline=this,t._gc&&t._enabled(!0,!0),i=this._last,this._sortChildren)for(s=t._startTime;i&&i._startTime>s;)i=i._prev;return i?(t._next=i._next,i._next=t):(t._next=this._first,this._first=t),t._next?t._next._prev=t:this._last=t,t._prev=i,this._timeline&&this._uncache(!0),this},r._remove=function(t,e){return t.timeline===this&&(e||t._enabled(!1,!0),t.timeline=null,t._prev?t._prev._next=t._next:this._first===t&&(this._first=t._next),t._next?t._next._prev=t._prev:this._last===t&&(this._last=t._prev),this._timeline&&this._uncache(!0)),this},r.render=function(t,e,i){var s,r=this._first;for(this._totalTime=this._time=this._rawPrevTime=t;r;)s=r._next,(r._active||t>=r._startTime&&!r._paused)&&(r._reversed?r.render((r._dirty?r.totalDuration():r._totalDuration)-(t-r._startTime)*r._timeScale,e,i):r.render((t-r._startTime)*r._timeScale,e,i)),r=s},r.rawTime=function(){return a||n.wake(),this._totalTime};var O=d("TweenLite",function(e,i,s){if(R.call(this,i,s),this.render=O.prototype.render,null==e)throw"Cannot tween a null target.";this.target=e="string"!=typeof e?e:O.selector(e)||e;var r,n,a,o=e.jquery||e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType),h=this.vars.overwrite;if(this._overwrite=h=null==h?U[O.defaultOverwrite]:"number"==typeof h?h>>0:U[h],(o||e instanceof Array||e.push&&p(e))&&"number"!=typeof e[0])for(this._targets=a=_.call(e,0),this._propLookup=[],this._siblings=[],r=0;a.length>r;r++)n=a[r],n?"string"!=typeof n?n.length&&n!==t&&n[0]&&(n[0]===t||n[0].nodeType&&n[0].style&&!n.nodeType)?(a.splice(r--,1),this._targets=a=a.concat(_.call(n,0))):(this._siblings[r]=q(n,this,!1),1===h&&this._siblings[r].length>1&&V(n,this,null,1,this._siblings[r])):(n=a[r--]=O.selector(n),"string"==typeof n&&a.splice(r+1,1)):a.splice(r--,1);else this._propLookup={},this._siblings=q(e,this,!1),1===h&&this._siblings.length>1&&V(e,this,null,1,this._siblings);(this.vars.immediateRender||0===i&&0===this._delay&&this.vars.immediateRender!==!1)&&(this._time=-l,this.render(-this._delay))},!0),D=function(e){return e.length&&e!==t&&e[0]&&(e[0]===t||e[0].nodeType&&e[0].style&&!e.nodeType)},M=function(t,e){var i,s={};for(i in t)X[i]||i in e&&"transform"!==i&&"x"!==i&&"y"!==i&&"width"!==i&&"height"!==i&&"className"!==i&&"border"!==i||!(!L[i]||L[i]&&L[i]._autoCSS)||(s[i]=t[i],delete t[i]);t.css=s};r=O.prototype=new R,r.constructor=O,r.kill()._gc=!1,r.ratio=0,r._firstPT=r._targets=r._overwrittenProps=r._startAt=null,r._notifyPluginsOfEnabled=r._lazy=!1,O.version="1.12.1",O.defaultEase=r._ease=new y(null,null,1,1),O.defaultOverwrite="auto",O.ticker=n,O.autoSleep=!0,O.lagSmoothing=function(t,e){n.lagSmoothing(t,e)},O.selector=t.$||t.jQuery||function(e){return t.$?(O.selector=t.$,t.$(e)):t.document?t.document.getElementById("#"===e.charAt(0)?e.substr(1):e):e};var z=[],I={},E=O._internals={isArray:p,isSelector:D,lazyTweens:z},L=O._plugins={},F=E.tweenLookup={},N=0,X=E.reservedProps={ease:1,delay:1,overwrite:1,onComplete:1,onCompleteParams:1,onCompleteScope:1,useFrames:1,runBackwards:1,startAt:1,onUpdate:1,onUpdateParams:1,onUpdateScope:1,onStart:1,onStartParams:1,onStartScope:1,onReverseComplete:1,onReverseCompleteParams:1,onReverseCompleteScope:1,onRepeat:1,onRepeatParams:1,onRepeatScope:1,easeParams:1,yoyo:1,immediateRender:1,repeat:1,repeatDelay:1,data:1,paused:1,reversed:1,autoCSS:1,lazy:1},U={none:0,all:1,auto:2,concurrent:3,allOnStart:4,preexisting:5,"true":1,"false":0},Y=R._rootFramesTimeline=new C,j=R._rootTimeline=new C,B=function(){var t=z.length;for(I={};--t>-1;)i=z[t],i&&i._lazy!==!1&&(i.render(i._lazy,!1,!0),i._lazy=!1);z.length=0};j._startTime=n.time,Y._startTime=n.frame,j._active=Y._active=!0,setTimeout(B,1),R._updateRoot=O.render=function(){var t,e,i;if(z.length&&B(),j.render((n.time-j._startTime)*j._timeScale,!1,!1),Y.render((n.frame-Y._startTime)*Y._timeScale,!1,!1),z.length&&B(),!(n.frame%120)){for(i in F){for(e=F[i].tweens,t=e.length;--t>-1;)e[t]._gc&&e.splice(t,1);0===e.length&&delete F[i]}if(i=j._first,(!i||i._paused)&&O.autoSleep&&!Y._first&&1===n._listeners.tick.length){for(;i&&i._paused;)i=i._next;i||n.sleep()}}},n.addEventListener("tick",R._updateRoot);var q=function(t,e,i){var s,r,n=t._gsTweenID;if(F[n||(t._gsTweenID=n="t"+N++)]||(F[n]={target:t,tweens:[]}),e&&(s=F[n].tweens,s[r=s.length]=e,i))for(;--r>-1;)s[r]===e&&s.splice(r,1);return F[n].tweens},V=function(t,e,i,s,r){var n,a,o,h;if(1===s||s>=4){for(h=r.length,n=0;h>n;n++)if((o=r[n])!==e)o._gc||o._enabled(!1,!1)&&(a=!0);else if(5===s)break;return a}var _,u=e._startTime+l,p=[],f=0,c=0===e._duration;for(n=r.length;--n>-1;)(o=r[n])===e||o._gc||o._paused||(o._timeline!==e._timeline?(_=_||W(e,0,c),0===W(o,_,c)&&(p[f++]=o)):u>=o._startTime&&o._startTime+o.totalDuration()/o._timeScale>u&&((c||!o._initted)&&2e-10>=u-o._startTime||(p[f++]=o)));for(n=f;--n>-1;)o=p[n],2===s&&o._kill(i,t)&&(a=!0),(2!==s||!o._firstPT&&o._initted)&&o._enabled(!1,!1)&&(a=!0);return a},W=function(t,e,i){for(var s=t._timeline,r=s._timeScale,n=t._startTime;s._timeline;){if(n+=s._startTime,r*=s._timeScale,s._paused)return-100;s=s._timeline}return n/=r,n>e?n-e:i&&n===e||!t._initted&&2*l>n-e?l:(n+=t.totalDuration()/t._timeScale/r)>e+l?0:n-e-l};r._init=function(){var t,e,i,s,r,n=this.vars,a=this._overwrittenProps,o=this._duration,h=!!n.immediateRender,l=n.ease;if(n.startAt){this._startAt&&(this._startAt.render(-1,!0),this._startAt.kill()),r={};for(s in n.startAt)r[s]=n.startAt[s];if(r.overwrite=!1,r.immediateRender=!0,r.lazy=h&&n.lazy!==!1,r.startAt=r.delay=null,this._startAt=O.to(this.target,0,r),h)if(this._time>0)this._startAt=null;else if(0!==o)return}else if(n.runBackwards&&0!==o)if(this._startAt)this._startAt.render(-1,!0),this._startAt.kill(),this._startAt=null;else{i={};for(s in n)X[s]&&"autoCSS"!==s||(i[s]=n[s]);if(i.overwrite=0,i.data="isFromStart",i.lazy=h&&n.lazy!==!1,i.immediateRender=h,this._startAt=O.to(this.target,0,i),h){if(0===this._time)return}else this._startAt._init(),this._startAt._enabled(!1)}if(this._ease=l?l instanceof y?n.easeParams instanceof Array?l.config.apply(l,n.easeParams):l:"function"==typeof l?new y(l,n.easeParams):T[l]||O.defaultEase:O.defaultEase,this._easeType=this._ease._type,this._easePower=this._ease._power,this._firstPT=null,this._targets)for(t=this._targets.length;--t>-1;)this._initProps(this._targets[t],this._propLookup[t]={},this._siblings[t],a?a[t]:null)&&(e=!0);else e=this._initProps(this.target,this._propLookup,this._siblings,a);if(e&&O._onPluginEvent("_onInitAllProps",this),a&&(this._firstPT||"function"!=typeof this.target&&this._enabled(!1,!1)),n.runBackwards)for(i=this._firstPT;i;)i.s+=i.c,i.c=-i.c,i=i._next;this._onUpdate=n.onUpdate,this._initted=!0},r._initProps=function(e,i,s,r){var n,a,o,h,l,_;if(null==e)return!1;I[e._gsTweenID]&&B(),this.vars.css||e.style&&e!==t&&e.nodeType&&L.css&&this.vars.autoCSS!==!1&&M(this.vars,e);for(n in this.vars){if(_=this.vars[n],X[n])_&&(_ instanceof Array||_.push&&p(_))&&-1!==_.join("").indexOf("{self}")&&(this.vars[n]=_=this._swapSelfInParams(_,this));else if(L[n]&&(h=new L[n])._onInitTween(e,this.vars[n],this)){for(this._firstPT=l={_next:this._firstPT,t:h,p:"setRatio",s:0,c:1,f:!0,n:n,pg:!0,pr:h._priority},a=h._overwriteProps.length;--a>-1;)i[h._overwriteProps[a]]=this._firstPT;(h._priority||h._onInitAllProps)&&(o=!0),(h._onDisable||h._onEnable)&&(this._notifyPluginsOfEnabled=!0)}else this._firstPT=i[n]=l={_next:this._firstPT,t:e,p:n,f:"function"==typeof e[n],n:n,pg:!1,pr:0},l.s=l.f?e[n.indexOf("set")||"function"!=typeof e["get"+n.substr(3)]?n:"get"+n.substr(3)]():parseFloat(e[n]),l.c="string"==typeof _&&"="===_.charAt(1)?parseInt(_.charAt(0)+"1",10)*Number(_.substr(2)):Number(_)-l.s||0;l&&l._next&&(l._next._prev=l)}return r&&this._kill(r,e)?this._initProps(e,i,s,r):this._overwrite>1&&this._firstPT&&s.length>1&&V(e,this,i,this._overwrite,s)?(this._kill(i,e),this._initProps(e,i,s,r)):(this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration)&&(I[e._gsTweenID]=!0),o)},r.render=function(t,e,i){var s,r,n,a,o=this._time,h=this._duration,_=this._rawPrevTime;if(t>=h)this._totalTime=this._time=h,this.ratio=this._ease._calcEnd?this._ease.getRatio(1):1,this._reversed||(s=!0,r="onComplete"),0===h&&(this._initted||!this.vars.lazy||i)&&(this._startTime===this._timeline._duration&&(t=0),(0===t||0>_||_===l)&&_!==t&&(i=!0,_>l&&(r="onReverseComplete")),this._rawPrevTime=a=!e||t||_===t?t:l);else if(1e-7>t)this._totalTime=this._time=0,this.ratio=this._ease._calcEnd?this._ease.getRatio(0):0,(0!==o||0===h&&_>0&&_!==l)&&(r="onReverseComplete",s=this._reversed),0>t?(this._active=!1,0===h&&(this._initted||!this.vars.lazy||i)&&(_>=0&&(i=!0),this._rawPrevTime=a=!e||t||_===t?t:l)):this._initted||(i=!0);else if(this._totalTime=this._time=t,this._easeType){var u=t/h,p=this._easeType,f=this._easePower;(1===p||3===p&&u>=.5)&&(u=1-u),3===p&&(u*=2),1===f?u*=u:2===f?u*=u*u:3===f?u*=u*u*u:4===f&&(u*=u*u*u*u),this.ratio=1===p?1-u:2===p?u:.5>t/h?u/2:1-u/2}else this.ratio=this._ease.getRatio(t/h);if(this._time!==o||i){if(!this._initted){if(this._init(),!this._initted||this._gc)return;if(!i&&this._firstPT&&(this.vars.lazy!==!1&&this._duration||this.vars.lazy&&!this._duration))return this._time=this._totalTime=o,this._rawPrevTime=_,z.push(this),this._lazy=t,void 0;this._time&&!s?this.ratio=this._ease.getRatio(this._time/h):s&&this._ease._calcEnd&&(this.ratio=this._ease.getRatio(0===this._time?0:1))}for(this._lazy!==!1&&(this._lazy=!1),this._active||!this._paused&&this._time!==o&&t>=0&&(this._active=!0),0===o&&(this._startAt&&(t>=0?this._startAt.render(t,e,i):r||(r="_dummyGS")),this.vars.onStart&&(0!==this._time||0===h)&&(e||this.vars.onStart.apply(this.vars.onStartScope||this,this.vars.onStartParams||v))),n=this._firstPT;n;)n.f?n.t[n.p](n.c*this.ratio+n.s):n.t[n.p]=n.c*this.ratio+n.s,n=n._next;this._onUpdate&&(0>t&&this._startAt&&this._startTime&&this._startAt.render(t,e,i),e||(this._time!==o||s)&&this._onUpdate.apply(this.vars.onUpdateScope||this,this.vars.onUpdateParams||v)),r&&(this._gc||(0>t&&this._startAt&&!this._onUpdate&&this._startTime&&this._startAt.render(t,e,i),s&&(this._timeline.autoRemoveChildren&&this._enabled(!1,!1),this._active=!1),!e&&this.vars[r]&&this.vars[r].apply(this.vars[r+"Scope"]||this,this.vars[r+"Params"]||v),0===h&&this._rawPrevTime===l&&a!==l&&(this._rawPrevTime=0)))}},r._kill=function(t,e){if("all"===t&&(t=null),null==t&&(null==e||e===this.target))return this._lazy=!1,this._enabled(!1,!1);e="string"!=typeof e?e||this._targets||this.target:O.selector(e)||e;var i,s,r,n,a,o,h,l;if((p(e)||D(e))&&"number"!=typeof e[0])for(i=e.length;--i>-1;)this._kill(t,e[i])&&(o=!0);else{if(this._targets){for(i=this._targets.length;--i>-1;)if(e===this._targets[i]){a=this._propLookup[i]||{},this._overwrittenProps=this._overwrittenProps||[],s=this._overwrittenProps[i]=t?this._overwrittenProps[i]||{}:"all";break}}else{if(e!==this.target)return!1;a=this._propLookup,s=this._overwrittenProps=t?this._overwrittenProps||{}:"all"}if(a){h=t||a,l=t!==s&&"all"!==s&&t!==a&&("object"!=typeof t||!t._tempKill);for(r in h)(n=a[r])&&(n.pg&&n.t._kill(h)&&(o=!0),n.pg&&0!==n.t._overwriteProps.length||(n._prev?n._prev._next=n._next:n===this._firstPT&&(this._firstPT=n._next),n._next&&(n._next._prev=n._prev),n._next=n._prev=null),delete a[r]),l&&(s[r]=1);!this._firstPT&&this._initted&&this._enabled(!1,!1)}}return o},r.invalidate=function(){return this._notifyPluginsOfEnabled&&O._onPluginEvent("_onDisable",this),this._firstPT=null,this._overwrittenProps=null,this._onUpdate=null,this._startAt=null,this._initted=this._active=this._notifyPluginsOfEnabled=this._lazy=!1,this._propLookup=this._targets?{}:[],this},r._enabled=function(t,e){if(a||n.wake(),t&&this._gc){var i,s=this._targets;if(s)for(i=s.length;--i>-1;)this._siblings[i]=q(s[i],this,!0);else this._siblings=q(this.target,this,!0)}return R.prototype._enabled.call(this,t,e),this._notifyPluginsOfEnabled&&this._firstPT?O._onPluginEvent(t?"_onEnable":"_onDisable",this):!1},O.to=function(t,e,i){return new O(t,e,i)},O.from=function(t,e,i){return i.runBackwards=!0,i.immediateRender=0!=i.immediateRender,new O(t,e,i)},O.fromTo=function(t,e,i,s){return s.startAt=i,s.immediateRender=0!=s.immediateRender&&0!=i.immediateRender,new O(t,e,s)},O.delayedCall=function(t,e,i,s,r){return new O(e,0,{delay:t,onComplete:e,onCompleteParams:i,onCompleteScope:s,onReverseComplete:e,onReverseCompleteParams:i,onReverseCompleteScope:s,immediateRender:!1,useFrames:r,overwrite:0})},O.set=function(t,e){return new O(t,0,e)},O.getTweensOf=function(t,e){if(null==t)return[];t="string"!=typeof t?t:O.selector(t)||t;var i,s,r,n;if((p(t)||D(t))&&"number"!=typeof t[0]){for(i=t.length,s=[];--i>-1;)s=s.concat(O.getTweensOf(t[i],e));for(i=s.length;--i>-1;)for(n=s[i],r=i;--r>-1;)n===s[r]&&s.splice(i,1)}else for(s=q(t).concat(),i=s.length;--i>-1;)(s[i]._gc||e&&!s[i].isActive())&&s.splice(i,1);return s},O.killTweensOf=O.killDelayedCallsTo=function(t,e,i){"object"==typeof e&&(i=e,e=!1);for(var s=O.getTweensOf(t,e),r=s.length;--r>-1;)s[r]._kill(i,t)};var G=d("plugins.TweenPlugin",function(t,e){this._overwriteProps=(t||"").split(","),this._propName=this._overwriteProps[0],this._priority=e||0,this._super=G.prototype},!0);if(r=G.prototype,G.version="1.10.1",G.API=2,r._firstPT=null,r._addTween=function(t,e,i,s,r,n){var a,o;return null!=s&&(a="number"==typeof s||"="!==s.charAt(1)?Number(s)-i:parseInt(s.charAt(0)+"1",10)*Number(s.substr(2)))?(this._firstPT=o={_next:this._firstPT,t:t,p:e,s:i,c:a,f:"function"==typeof t[e],n:r||e,r:n},o._next&&(o._next._prev=o),o):void 0},r.setRatio=function(t){for(var e,i=this._firstPT,s=1e-6;i;)e=i.c*t+i.s,i.r?e=Math.round(e):s>e&&e>-s&&(e=0),i.f?i.t[i.p](e):i.t[i.p]=e,i=i._next},r._kill=function(t){var e,i=this._overwriteProps,s=this._firstPT;if(null!=t[this._propName])this._overwriteProps=[];else for(e=i.length;--e>-1;)null!=t[i[e]]&&i.splice(e,1);for(;s;)null!=t[s.n]&&(s._next&&(s._next._prev=s._prev),s._prev?(s._prev._next=s._next,s._prev=null):this._firstPT===s&&(this._firstPT=s._next)),s=s._next;return!1},r._roundProps=function(t,e){for(var i=this._firstPT;i;)(t[this._propName]||null!=i.n&&t[i.n.split(this._propName+"_").join("")])&&(i.r=e),i=i._next},O._onPluginEvent=function(t,e){var i,s,r,n,a,o=e._firstPT;if("_onInitAllProps"===t){for(;o;){for(a=o._next,s=r;s&&s.pr>o.pr;)s=s._next;(o._prev=s?s._prev:n)?o._prev._next=o:r=o,(o._next=s)?s._prev=o:n=o,o=a}o=e._firstPT=r}for(;o;)o.pg&&"function"==typeof o.t[t]&&o.t[t]()&&(i=!0),o=o._next;return i},G.activate=function(t){for(var e=t.length;--e>-1;)t[e].API===G.API&&(L[(new t[e])._propName]=t[e]);return!0},m.plugin=function(t){if(!(t&&t.propName&&t.init&&t.API))throw"illegal plugin definition.";
var e,i=t.propName,s=t.priority||0,r=t.overwriteProps,n={init:"_onInitTween",set:"setRatio",kill:"_kill",round:"_roundProps",initAll:"_onInitAllProps"},a=d("plugins."+i.charAt(0).toUpperCase()+i.substr(1)+"Plugin",function(){G.call(this,i,s),this._overwriteProps=r||[]},t.global===!0),o=a.prototype=new G(i);o.constructor=a,a.API=t.API;for(e in n)"function"==typeof t[e]&&(o[n[e]]=t[e]);return a.version=t.version,G.activate([a]),a},i=t._gsQueue){for(s=0;i.length>s;s++)i[s]();for(r in f)f[r].func||t.console.log("GSAP encountered missing dependency: com.greensock."+r)}a=!1}}(window);
!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var i in n)("object"==typeof exports?exports:t)[i]=n[i]}}(this,function(){return function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){(function(e){"use strict";var i=n(4),r=n(8),o=n(2),s=n(9),a=n(1).Promise,u=n(15),h=n(16);t.exports=e.SC={initialize:function(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];o.set("oauth_token",t.oauth_token),o.set("client_id",t.client_id),o.set("redirect_uri",t.redirect_uri),o.set("baseURL",t.baseURL),o.set("connectURL",t.connectURL)},get:function(t,e){return i.request("GET",t,e)},post:function(t,e){return i.request("POST",t,e)},put:function(t,e){return i.request("PUT",t,e)},"delete":function(t){return i.request("DELETE",t)},upload:function(t){return i.upload(t)},connect:function(t){return s(t)},isConnected:function(){return void 0!==o.get("oauth_token")},oEmbed:function(t,e){return i.oEmbed(t,e)},resolve:function(t){return i.resolve(t)},Recorder:u,Promise:a,stream:function(t,e){return h(t,e)},connectCallback:function(){r.notifyDialog(this.location)}}}).call(e,function(){return this}())},function(t,e,n){var i;(function(t,r,o,s){/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   2.3.0
	 */
(function(){"use strict";function a(t){return"function"==typeof t||"object"==typeof t&&null!==t}function u(t){return"function"==typeof t}function h(t){return"object"==typeof t&&null!==t}function c(t){q=t}function l(t){Q=t}function f(){var e=t.nextTick,n=t.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);return Array.isArray(n)&&"0"===n[1]&&"10"===n[2]&&(e=r),function(){e(m)}}function d(){return function(){K(m)}}function p(){var t=0,e=new et(m),n=document.createTextNode("");return e.observe(n,{characterData:!0}),function(){n.data=t=++t%2}}function g(){var t=new MessageChannel;return t.port1.onmessage=m,function(){t.port2.postMessage(0)}}function _(){return function(){setTimeout(m,1)}}function m(){for(var t=0;Z>t;t+=2){var e=rt[t],n=rt[t+1];e(n),rt[t]=void 0,rt[t+1]=void 0}Z=0}function y(){try{var t=n(26);return K=t.runOnLoop||t.runOnContext,d()}catch(e){return _()}}function v(){}function E(){return new TypeError("You cannot resolve a promise with itself")}function S(){return new TypeError("A promises callback cannot return that same promise.")}function A(t){try{return t.then}catch(e){return ut.error=e,ut}}function w(t,e,n,i){try{t.call(e,n,i)}catch(r){return r}}function T(t,e,n){Q(function(t){var i=!1,r=w(n,e,function(n){i||(i=!0,e!==n?I(t,n):O(t,n))},function(e){i||(i=!0,R(t,e))},"Settle: "+(t._label||" unknown promise"));!i&&r&&(i=!0,R(t,r))},t)}function b(t,e){e._state===st?O(t,e._result):e._state===at?R(t,e._result):D(e,void 0,function(e){I(t,e)},function(e){R(t,e)})}function P(t,e){if(e.constructor===t.constructor)b(t,e);else{var n=A(e);n===ut?R(t,ut.error):void 0===n?O(t,e):u(n)?T(t,e,n):O(t,e)}}function I(t,e){t===e?R(t,E()):a(e)?P(t,e):O(t,e)}function L(t){t._onerror&&t._onerror(t._result),M(t)}function O(t,e){t._state===ot&&(t._result=e,t._state=st,0!==t._subscribers.length&&Q(M,t))}function R(t,e){t._state===ot&&(t._state=at,t._result=e,Q(L,t))}function D(t,e,n,i){var r=t._subscribers,o=r.length;t._onerror=null,r[o]=e,r[o+st]=n,r[o+at]=i,0===o&&t._state&&Q(M,t)}function M(t){var e=t._subscribers,n=t._state;if(0!==e.length){for(var i,r,o=t._result,s=0;s<e.length;s+=3)i=e[s],r=e[s+n],i?x(n,i,r,o):r(o);t._subscribers.length=0}}function k(){this.error=null}function N(t,e){try{return t(e)}catch(n){return ht.error=n,ht}}function x(t,e,n,i){var r,o,s,a,h=u(n);if(h){if(r=N(n,i),r===ht?(a=!0,o=r.error,r=null):s=!0,e===r)return void R(e,S())}else r=i,s=!0;e._state!==ot||(h&&s?I(e,r):a?R(e,o):t===st?O(e,r):t===at&&R(e,r))}function C(t,e){try{e(function(e){I(t,e)},function(e){R(t,e)})}catch(n){R(t,n)}}function F(t,e){var n=this;n._instanceConstructor=t,n.promise=new t(v),n._validateInput(e)?(n._input=e,n.length=e.length,n._remaining=e.length,n._init(),0===n.length?O(n.promise,n._result):(n.length=n.length||0,n._enumerate(),0===n._remaining&&O(n.promise,n._result))):R(n.promise,n._validationError())}function U(t){return new ct(this,t).promise}function B(t){function e(t){I(r,t)}function n(t){R(r,t)}var i=this,r=new i(v);if(!$(t))return R(r,new TypeError("You must pass an array to race.")),r;for(var o=t.length,s=0;r._state===ot&&o>s;s++)D(i.resolve(t[s]),void 0,e,n);return r}function H(t){var e=this;if(t&&"object"==typeof t&&t.constructor===e)return t;var n=new e(v);return I(n,t),n}function j(t){var e=this,n=new e(v);return R(n,t),n}function G(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function Y(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}function V(t){this._id=gt++,this._state=void 0,this._result=void 0,this._subscribers=[],v!==t&&(u(t)||G(),this instanceof V||Y(),C(this,t))}function z(){var t;if("undefined"!=typeof o)t=o;else if("undefined"!=typeof self)t=self;else try{t=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}var n=t.Promise;n&&"[object Promise]"===Object.prototype.toString.call(n.resolve())&&!n.cast||(t.Promise=_t)}var W;W=Array.isArray?Array.isArray:function(t){return"[object Array]"===Object.prototype.toString.call(t)};var K,q,X,$=W,Z=0,Q=({}.toString,function(t,e){rt[Z]=t,rt[Z+1]=e,Z+=2,2===Z&&(q?q(m):X())}),J="undefined"!=typeof window?window:void 0,tt=J||{},et=tt.MutationObserver||tt.WebKitMutationObserver,nt="undefined"!=typeof t&&"[object process]"==={}.toString.call(t),it="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,rt=new Array(1e3);X=nt?f():et?p():it?g():void 0===J?y():_();var ot=void 0,st=1,at=2,ut=new k,ht=new k;F.prototype._validateInput=function(t){return $(t)},F.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")},F.prototype._init=function(){this._result=new Array(this.length)};var ct=F;F.prototype._enumerate=function(){for(var t=this,e=t.length,n=t.promise,i=t._input,r=0;n._state===ot&&e>r;r++)t._eachEntry(i[r],r)},F.prototype._eachEntry=function(t,e){var n=this,i=n._instanceConstructor;h(t)?t.constructor===i&&t._state!==ot?(t._onerror=null,n._settledAt(t._state,e,t._result)):n._willSettleAt(i.resolve(t),e):(n._remaining--,n._result[e]=t)},F.prototype._settledAt=function(t,e,n){var i=this,r=i.promise;r._state===ot&&(i._remaining--,t===at?R(r,n):i._result[e]=n),0===i._remaining&&O(r,i._result)},F.prototype._willSettleAt=function(t,e){var n=this;D(t,void 0,function(t){n._settledAt(st,e,t)},function(t){n._settledAt(at,e,t)})};var lt=U,ft=B,dt=H,pt=j,gt=0,_t=V;V.all=lt,V.race=ft,V.resolve=dt,V.reject=pt,V._setScheduler=c,V._setAsap=l,V._asap=Q,V.prototype={constructor:V,then:function(t,e){var n=this,i=n._state;if(i===st&&!t||i===at&&!e)return this;var r=new this.constructor(v),o=n._result;if(i){var s=arguments[i-1];Q(function(){x(i,r,s,o)})}else D(n,r,t,e);return r},"catch":function(t){return this.then(null,t)}};var mt=z,yt={Promise:_t,polyfill:mt};n(19).amd?(i=function(){return yt}.call(e,n,e,s),!(void 0!==i&&(s.exports=i))):"undefined"!=typeof s&&s.exports?s.exports=yt:"undefined"!=typeof this&&(this.ES6Promise=yt),mt()}).call(this)}).call(e,n(6),n(3).setImmediate,function(){return this}(),n(20)(t))},function(t,e){"use strict";var n={oauth_token:void 0,baseURL:"https://api.soundcloud.com",connectURL:"//connect.soundcloud.com",client_id:void 0,redirect_uri:void 0};t.exports={get:function(t){return n[t]},set:function(t,e){e&&(n[t]=e)}}},function(t,e,n){(function(t,i){function r(t,e){this._id=t,this._clearFn=e}var o=n(6).nextTick,s=Function.prototype.apply,a=Array.prototype.slice,u={},h=0;e.setTimeout=function(){return new r(s.call(setTimeout,window,arguments),clearTimeout)},e.setInterval=function(){return new r(s.call(setInterval,window,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t.close()},r.prototype.unref=r.prototype.ref=function(){},r.prototype.close=function(){this._clearFn.call(window,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout(function(){t._onTimeout&&t._onTimeout()},e))},e.setImmediate="function"==typeof t?t:function(t){var n=h++,i=arguments.length<2?!1:a.call(arguments,1);return u[n]=!0,o(function(){u[n]&&(i?t.apply(null,i):t.call(null),e.clearImmediate(n))}),n},e.clearImmediate="function"==typeof i?i:function(t){delete u[t]}}).call(e,n(3).setImmediate,n(3).clearImmediate)},function(t,e,n){(function(e){"use strict";var i=n(2),r=n(17),o=n(1).Promise,s=function(t,n,i,r){var s=void 0,a=new o(function(o){var a=e.FormData&&i instanceof FormData;s=new XMLHttpRequest,s.upload&&s.upload.addEventListener("progress",r),s.open(t,n,!0),a||s.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),s.onreadystatechange=function(){4===s.readyState&&o({responseText:s.responseText,request:s})},s.send(i)});return a.request=s,a},a=function(t){var e=t.responseText,n=t.request,i=void 0,r=void 0;try{r=JSON.parse(e)}catch(o){}return r?r.errors&&(i={message:""},r.errors[0]&&r.errors[0].error_message&&(i={message:r.errors[0].error_message})):i=n?{message:"HTTP Error: "+n.status}:{message:"Unknown error"},i&&(i.status=n.status),{json:r,error:i}},u=function c(t,e,n,i){var r=s(t,e,n,i),o=r.then(function(t){var e=t.responseText,n=t.request,i=a({responseText:e,request:n});if(i.json&&"302 - Found"===i.json.status)return c("GET",i.json.location,null);if(200!==n.status&&i.error)throw i.error;return i.json});return o.request=r.request,o},h=function(t,e,n){Object.keys(e).forEach(function(i){n?t.append(i,e[i]):t[i]=e[i]})};t.exports={request:function(t,n){var o=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],s=arguments.length<=3||void 0===arguments[3]?function(){}:arguments[3],a=i.get("oauth_token"),c=i.get("client_id"),l={},f=e.FormData&&o instanceof FormData,d=void 0,p=void 0;return l.format="json",a?l.oauth_token=a:l.client_id=c,h(o,l,f),"GET"!==t&&(d=f?o:r.encode(o),o={oauth_token:a}),n="/"!==n[0]?"/"+n:n,p=""+i.get("baseURL")+n+"?"+r.encode(o),u(t,p,d,s)},oEmbed:function(t){var e=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],n=e.element;delete e.element,e.url=t;var i="https://soundcloud.com/oembed.json?"+r.encode(e);return u("GET",i,null).then(function(t){return n&&t.html&&(n.innerHTML=t.html),t})},upload:function(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],e=t.asset_data||t.file,n=i.get("oauth_token")&&t.title&&e;if(!n)return new o(function(t,e){e({status:0,error_message:"oauth_token needs to be present and title and asset_data / file passed as parameters"})});var r=Object.keys(t),s=new FormData;return r.forEach(function(e){var n=t[e];"file"===e&&(e="asset_data",n=t.file),s.append("track["+e+"]",n)}),this.request("POST","/tracks",s,t.progress)},resolve:function(t){return this.request("GET","/resolve",{url:t,_status_code_map:{302:200}})}}}).call(e,function(){return this}())},function(t,e){"use strict";var n={};t.exports={get:function(t){return n[t]},set:function(t,e){n[t]=e}}},function(t,e){function n(){h&&s&&(h=!1,s.length?u=s.concat(u):c=-1,u.length&&i())}function i(){if(!h){var t=setTimeout(n);h=!0;for(var e=u.length;e;){for(s=u,u=[];++c<e;)s&&s[c].run();c=-1,e=u.length}s=null,h=!1,clearTimeout(t)}}function r(t,e){this.fun=t,this.array=e}function o(){}var s,a=t.exports={},u=[],h=!1,c=-1;a.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];u.push(new r(t,e)),1!==u.length||h||setTimeout(i,0)},r.prototype.run=function(){this.fun.apply(null,this.array)},a.title="browser",a.browser=!0,a.env={},a.argv=[],a.version="",a.versions={},a.on=o,a.addListener=o,a.once=o,a.off=o,a.removeListener=o,a.removeAllListeners=o,a.emit=o,a.binding=function(t){throw new Error("process.binding is not supported")},a.cwd=function(){return"/"},a.chdir=function(t){throw new Error("process.chdir is not supported")},a.umask=function(){return 0}},function(t,e,n){"use strict";var i=n(18);e.extract=function(t){return t.split("?")[1]||""},e.parse=function(t){return"string"!=typeof t?{}:(t=t.trim().replace(/^(\?|#|&)/,""),t?t.split("&").reduce(function(t,e){var n=e.replace(/\+/g," ").split("="),i=n.shift(),r=n.length>0?n.join("="):void 0;return i=decodeURIComponent(i),r=void 0===r?null:decodeURIComponent(r),t.hasOwnProperty(i)?Array.isArray(t[i])?t[i].push(r):t[i]=[t[i],r]:t[i]=r,t},{}):{})},e.stringify=function(t){return t?Object.keys(t).sort().map(function(e){var n=t[e];return Array.isArray(n)?n.sort().map(function(t){return i(e)+"="+i(t)}).join("&"):i(e)+"="+i(n)}).filter(function(t){return t.length>0}).join("&"):""}},function(t,e,n){"use strict";var i=n(7),r=n(5);t.exports={notifyDialog:function(t){var e=i.parse(t.search),n=i.parse(t.hash),o={oauth_token:e.access_token||n.access_token,dialog_id:e.state||n.state,error:e.error||n.error,error_description:e.error_description||n.error_description},s=r.get(o.dialog_id);s&&s.handleConnectResponse(o)}}},function(t,e,n){"use strict";var i=n(2),r=n(11),o=n(1).Promise,s=function(t){return i.set("oauth_token",t.oauth_token),t};t.exports=function(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],e=i.get("oauth_token");if(e)return new o(function(t){t({oauth_token:e})});var n={client_id:t.client_id||i.get("client_id"),redirect_uri:t.redirect_uri||i.get("redirect_uri"),response_type:"code_and_token",scope:t.scope||"non-expiring",display:"popup"};if(!n.client_id||!n.redirect_uri)throw new Error("Options client_id and redirect_uri must be passed");var a=new r(n);return a.open().then(s)}},function(t,e,n){"use strict";var i=n(1).Promise;t.exports=function(){var t={};return t.promise=new i(function(e,n){t.resolve=e,t.reject=n}),t}},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=n(10),s=n(5),a=n(12),u=n(7),h="SoundCloud_Dialog",c=function(){return[h,Math.ceil(1e6*Math.random()).toString(16)].join("_")},l=function(t){return"https://soundcloud.com/connect?"+u.stringify(t)},f=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];i(this,t),this.id=c(),this.options=e,this.options.state=this.id,this.width=456,this.height=510,this.deferred=o()}return r(t,[{key:"open",value:function(){var t=l(this.options);return this.popup=a.open(t,this.width,this.height),s.set(this.id,this),this.deferred.promise}},{key:"handleConnectResponse",value:function(t){var e=t.error;e?this.deferred.reject(t):this.deferred.resolve(t),this.popup.close()}}]),t}();t.exports=f},function(t,e){"use strict";t.exports={open:function(t,e,n){var i={},r=void 0;return i.location=1,i.width=e,i.height=n,i.left=window.screenX+(window.outerWidth-e)/2,i.top=window.screenY+(window.outerHeight-n)/2,i.toolbar="no",i.scrollbars="yes",r=Object.keys(i).map(function(t){return t+"="+i[t]}).join(", "),window.open(t,i.name,r)}}},function(t,e){(function(e){"use strict";var n=e.AudioContext||e.webkitAudioContext,i=null;t.exports=function(){return i?i:i=new n}}).call(e,function(){return this}())},function(t,e){(function(e){"use strict";var n=e.navigator.getUserMedia||e.navigator.webkitGetUserMedia||e.navigator.mozGetUserMedia;t.exports=function(t,i,r){n.call(e.navigator,t,i,r)}}).call(e,function(){return this}())},function(t,e,n){"use strict";function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var r=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}(),o=n(13),s=n(14),a=n(1).Promise,u=n(24),h=function(){var t=this,e=this.context;return new a(function(n,i){t.source?t.source instanceof AudioNode?n(t.source):i(new Error("source needs to be an instance of AudioNode")):s({audio:!0},function(i){t.stream=i,t.source=e.createMediaStreamSource(i),n(t.source)}.bind(t),i)})},c=function(){function t(){var e=arguments.length<=0||void 0===arguments[0]?{}:arguments[0];i(this,t),this.context=e.context||o(),this._recorder=null,this.source=e.source,this.stream=null}return r(t,[{key:"start",value:function(){var t=this;return h.call(this).then(function(e){return t._recorder=new u(e),t._recorder.record(),e})}},{key:"stop",value:function(){if(this._recorder&&this._recorder.stop(),this.stream)if(this.stream.stop)this.stream.stop();else if(this.stream.getTracks){var t=this.stream.getTracks()[0];t&&t.stop()}}},{key:"getBuffer",value:function(){var t=this;return new a(function(e,n){t._recorder?t._recorder.getBuffer(function(n){var i=t.context.sampleRate,r=t.context.createBuffer(2,n[0].length,i);r.getChannelData(0).set(n[0]),r.getChannelData(1).set(n[1]),e(r)}.bind(t)):n(new Error("Nothing has been recorded yet."))})}},{key:"getWAV",value:function(){var t=this;return new a(function(e,n){t._recorder?t._recorder.exportWAV(function(t){e(t)}):n(new Error("Nothing has been recorded yet."))})}},{key:"play",value:function(){var t=this;return this.getBuffer().then(function(e){var n=t.context.createBufferSource();return n.buffer=e,n.connect(t.context.destination),n.start(0),n})}},{key:"saveAs",value:function(t){return this.getWAV().then(function(e){u.forceDownload(e,t)})}},{key:"delete",value:function(){this._recorder&&(this._recorder.stop(),this._recorder.clear(),this._recorder=null),this.stream&&this.stream.stop()}}]),t}();t.exports=c},function(t,e,n){"use strict";var i=n(4),r=n(23),o=new r({flashAudioPath:"https://connect.soundcloud.com/sdk/flashAudio.swf"}),s=n(2),a=n(25);t.exports=function(t,e){var n=e?{secret_token:e}:{};return i.request("GET",t,n).then(function(t){var n=s.get("baseURL"),i=s.get("client_id"),r=n+"/tracks/"+t.id+"/streams?client_id="+i,u=n+"/tracks/"+t.id+"/plays?client_id="+i;return e&&(r+="&secret_token="+e,u+="&secret_token="+e),new a(o,{soundId:t.id,duration:t.duration,streamUrlsEndpoint:r,registerEndpoint:u})})}},function(t,e){t.exports={encode:function(t,e){function n(t){return t.filter(function(t){return"string"==typeof t&&t.length}).join("&")}function i(t){var e=Object.keys(t);return l?e.sort():e}function r(t,e){var r=":name[:prop]";return n(i(e).map(function(n){return s(r.replace(/:name/,t).replace(/:prop/,n),e[n])}))}function o(t,e){var i=":name[]";return n(e.map(function(e){return s(i.replace(/:name/,t),e)}))}function s(t,e){var n=/%20/g,i=encodeURIComponent,s=typeof e,a=null;return Array.isArray(e)?a=o(t,e):"string"===s?a=i(t)+"="+u(e):"number"===s?a=i(t)+"="+i(e).replace(n,"+"):"boolean"===s?a=i(t)+"="+e:"object"===s&&(null!==e?a=r(t,e):c||(a=i(t)+"=null")),a}function a(t){return"%"+("0"+t.charCodeAt(0).toString(16)).slice(-2).toUpperCase()}function u(t){return t.replace(/[^ !'()~\*]*/g,encodeURIComponent).replace(/ /g,"+").replace(/[!'()~\*]/g,a)}var h="object"==typeof e?e:{},c=h.ignorenull||!1,l=h.sorted||!1;return n(i(t).map(function(e){return s(e,t[e])}))}}},function(t,e){"use strict";t.exports=function(t){return encodeURIComponent(t).replace(/[!'()*]/g,function(t){return"%"+t.charCodeAt(0).toString(16).toUpperCase()})}},function(t,e){t.exports=function(){throw new Error("define cannot be used indirect")}},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){var n=window.URL||window.webkitURL;t.exports=function(t,e){try{try{var i;try{var r=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder;i=new r,i.append(t),i=i.getBlob()}catch(o){i=new Blob([t])}return new Worker(n.createObjectURL(i))}catch(o){return new Worker("data:application/javascript,"+encodeURIComponent(t))}}catch(o){return new Worker(e)}}},function(t,e,n){t.exports=function(){return n(21)('!function(t){function n(r){if(e[r])return e[r].exports;var a=e[r]={exports:{},id:r,loaded:!1};return t[r].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n){(function(t){function n(t){h=t.sampleRate,v=t.numChannels,s()}function e(t){for(var n=0;v>n;n++)p[n].push(t[n]);g+=t[0].length}function r(t){for(var n=[],e=0;v>e;e++)n.push(i(p[e],g));if(2===v)var r=f(n[0],n[1]);else var r=n[0];var a=l(r),o=new Blob([a],{type:t});this.postMessage(o)}function a(){for(var t=[],n=0;v>n;n++)t.push(i(p[n],g));this.postMessage(t)}function o(){g=0,p=[],s()}function s(){for(var t=0;v>t;t++)p[t]=[]}function i(t,n){for(var e=new Float32Array(n),r=0,a=0;a<t.length;a++)e.set(t[a],r),r+=t[a].length;return e}function f(t,n){for(var e=t.length+n.length,r=new Float32Array(e),a=0,o=0;e>a;)r[a++]=t[o],r[a++]=n[o],o++;return r}function c(t,n,e){for(var r=0;r<e.length;r++,n+=2){var a=Math.max(-1,Math.min(1,e[r]));t.setInt16(n,0>a?32768*a:32767*a,!0)}}function u(t,n,e){for(var r=0;r<e.length;r++)t.setUint8(n+r,e.charCodeAt(r))}function l(t){var n=new ArrayBuffer(44+2*t.length),e=new DataView(n);return u(e,0,"RIFF"),e.setUint32(4,36+2*t.length,!0),u(e,8,"WAVE"),u(e,12,"fmt "),e.setUint32(16,16,!0),e.setUint16(20,1,!0),e.setUint16(22,v,!0),e.setUint32(24,h,!0),e.setUint32(28,4*h,!0),e.setUint16(32,2*v,!0),e.setUint16(34,16,!0),u(e,36,"data"),e.setUint32(40,2*t.length,!0),c(e,44,t),e}var h,v,g=0,p=[];t.onmessage=function(t){switch(t.data.command){case"init":n(t.data.config);break;case"record":e(t.data.buffer);break;case"exportWAV":r(t.data.type);break;case"getBuffer":a();break;case"clear":o()}}}).call(n,function(){return this}())}]);\n//# sourceMappingURL=9f9aac32c9a7432b5555.worker.js.map',n.p+"9f9aac32c9a7432b5555.worker.js")}},function(t,e){t.exports=function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}(function(t){for(var e in t)if(Object.prototype.hasOwnProperty.call(t,e))switch(typeof t[e]){case"function":break;case"object":t[e]=function(e){var n=e.slice(1),i=t[e[0]];return function(t,e,r){i.apply(this,[t,e,r].concat(n))}}(t[e]);break;default:t[e]=t[t[e]]}return t}([function(t,e,n){var i,r=n(1),o=n(12),s=n(14),a=n(38),u=n(43),h=n(39),c=n(16),l=n(42),f=n(128),d=n(129);t.exports=i=function(t){t=t||{},this._players={},this._volume=1,this._mute=!1,this.States=a,this.Errors=u,this._settings=o({},t,i.defaults)},i.MimeTypes=d,i.Protocols=f,i.Events=h,i.States=a,i.Errors=u,i.BrowserUtils=c,i.defaults={flashAudioPath:"flashAudio.swf",flashLoadTimeout:2e3,flashObjectID:"flashAudioObject",audioObjectID:"html5AudioObject",updateInterval:300,bufferTime:8e3,bufferingDelay:800,streamUrlProvider:null,debug:!1},i.capabilities=l.names,i.createDefaultMediaDescriptor=function(t,e,n){if(!t||!e||!e.length)throw new Error("invalid input to create media descriptor");return n||(n=0),{id:t,src:e,duration:n,forceSingle:!1,forceFlash:!1,forceHTML5:!1,forceCustomHLS:!1,mimeType:void 0}},i.prototype.getAudioPlayer=function(t){return this._players[t]},i.prototype.hasAudioPlayer=function(t){return void 0!==this._players[t]},i.prototype.removeAudioPlayer=function(t){this.hasAudioPlayer(t)&&delete this._players[t]},i.prototype.setVolume=function(t){t=Math.min(1,t),this._volume=Math.max(0,t);for(var e in this._players)this._players.hasOwnProperty(e)&&this._players[e].setVolume(this._volume)},i.prototype.getVolume=function(){return this._volume},i.prototype.setMute=function(t){this._muted=t;for(var e in this._players)this._players.hasOwnProperty(e)&&this._players[e].setMute(this._muted)},i.prototype.getMute=function(){return this._muted},i.prototype.createAudioPlayer=function(t,e){var n,i=r({},this._settings,e);if(!t)throw"AudioManager: No media descriptor object passed, can`t build any player";if(t.id||(t.id=Math.floor(1e10*Math.random()).toString()+(new Date).getTime().toString()),!t.src)throw new Error("AudioManager: You need to pass a valid media source URL");if(!this._players[t.id]){if(n=s.createAudioPlayer(t,i),!n)throw new Error("AudioManager: No player could be created from the given descriptor");this._players[t.id]=n}return this._players[t.id].setVolume(this._volume),this._players[t.id].setMute(this._muted),this._players[t.id].on(h.STATE_CHANGE,this._onStateChange,this),this._players[t.id]},i.prototype._onStateChange=function(t,e){e.getState()===a.DEAD&&this.removeAudioPlayer(e.getId())}},[130,2,8,4],[131,3,4],function(t,e){function n(t,e,n){n||(n={});for(var i=-1,r=e.length;++i<r;){var o=e[i];n[o]=t[o]}return n}t.exports=n},[132,5,6,7],function(t,e){function n(t){return!!t&&"object"==typeof t}function i(t,e){var n=null==t?void 0:t[e];return s(n)?n:void 0}function r(t){return o(t)&&f.call(t)==a}function o(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function s(t){return null==t?!1:r(t)?d.test(c.call(t)):n(t)&&u.test(t)}var a="[object Function]",u=/^\[object .+?Constructor\]$/,h=Object.prototype,c=Function.prototype.toString,l=h.hasOwnProperty,f=h.toString,d=RegExp("^"+c.call(l).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");t.exports=i},function(t,e){function n(t){return!!t&&"object"==typeof t}function i(t){return function(e){return null==e?void 0:e[t]}}function r(t){return null!=t&&o(l(t))}function o(t){return"number"==typeof t&&t>-1&&t%1==0&&c>=t}function s(t){return n(t)&&r(t)&&u.call(t,"callee")&&!h.call(t,"callee")}var a=Object.prototype,u=a.hasOwnProperty,h=a.propertyIsEnumerable,c=9007199254740991,l=i("length");t.exports=s},function(t,e){function n(t){return!!t&&"object"==typeof t}function i(t,e){var n=null==t?void 0:t[e];return a(n)?n:void 0}function r(t){return"number"==typeof t&&t>-1&&t%1==0&&m>=t}function o(t){return s(t)&&p.call(t)==h}function s(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function a(t){return null==t?!1:o(t)?g.test(f.call(t)):n(t)&&c.test(t)}var u="[object Array]",h="[object Function]",c=/^\[object .+?Constructor\]$/,l=Object.prototype,f=Function.prototype.toString,d=l.hasOwnProperty,p=l.toString,g=RegExp("^"+f.call(d).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),_=i(Array,"isArray"),m=9007199254740991,y=_||function(t){return n(t)&&r(t.length)&&p.call(t)==u};t.exports=y},[133,9,10,11],function(t,e){function n(t,e,n){if("function"!=typeof t)return i;if(void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 3:return function(n,i,r){return t.call(e,n,i,r)};case 4:return function(n,i,r,o){return t.call(e,n,i,r,o)};case 5:return function(n,i,r,o,s){return t.call(e,n,i,r,o,s)}}return function(){return t.apply(e,arguments)}}function i(t){return t}t.exports=n},function(t,e){function n(t){return function(e){return null==e?void 0:e[t]}}function i(t){return null!=t&&s(c(t))}function r(t,e){return t="number"==typeof t||u.test(t)?+t:-1,e=null==e?h:e,t>-1&&t%1==0&&e>t}function o(t,e,n){if(!a(n))return!1;var o=typeof e;if("number"==o?i(n)&&r(e,n.length):"string"==o&&e in n){var s=n[e];return t===t?t===s:s!==s}return!1}function s(t){return"number"==typeof t&&t>-1&&t%1==0&&h>=t}function a(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}var u=/^\d+$/,h=9007199254740991,c=n("length");t.exports=o},function(t,e){function n(t,e){if("function"!=typeof t)throw new TypeError(i);return e=r(void 0===e?t.length-1:+e||0,0),function(){for(var n=arguments,i=-1,o=r(n.length-e,0),s=Array(o);++i<o;)s[i]=n[e+i];switch(e){case 0:return t.call(this,s);case 1:return t.call(this,n[0],s);case 2:return t.call(this,n[0],n[1],s)}var a=Array(e+1);for(i=-1;++i<e;)a[i]=n[i];return a[e]=s,t.apply(this,a)}}var i="Expected a function",r=Math.max;t.exports=n},function(t,e,n){function i(t,e){return void 0===t?e:t}function r(t,e){return s(function(n){var i=n[0];return null==i?i:(n.push(e),t.apply(void 0,n))})}var o=n(1),s=n(13),a=r(o,i);t.exports=a},11,function(t,e,n){t.exports=n(15)},function(t,e,n){var i,r=n(16),o=n(17),s=n(45),a=n(49),u=n(46),h=n(48),c=n(50),l=n(129);t.exports=i=function(){},i.createAudioPlayer=function(t,e){var n;if(n=t.src.split(":")[0],("rtmp"===n||"rtmpt"===n||t.forceFlash)&&!t.forceHTML5)return new o(t,e);if(t.mimeType=i.getMimeType(t),t.mimeType===l.M3U8){if(r.isMSESupportMPEG()||r.isMSESupportMP4())return new c(t,e);if(r.isNativeHlsSupported()&&!t.forceCustomHLS)return r.isMobile()||t.forceSingle?new a(t,e):new s(t,e)}else{if(r.supportHTML5Audio()&&r.canPlayType(t.mimeType)||t.forceHTML5)return r.isMobile()||t.forceSingle?new h(t,e):new u(t,e);if(t.mimeType===l.MP3)return new o(t,e)}return null},i.getMimeType=function(t){if(t.mimeType)return t.mimeType;var e=t.src.split("?")[0];return e=e.substring(e.lastIndexOf(".")+1,e.length),l.getTypeByExtension(e)}},function(t,e){function n(){return!(!window.MediaSource&&!window.WebKitMediaSource)}t.exports={supportHTML5Audio:function(){var t;try{if(window.HTMLAudioElement&&"undefined"!=typeof Audio)return t=new Audio,!0}catch(e){return!1}},createAudioElement:function(){var t=document.createElement("audio");return t.setAttribute("msAudioCategory","BackgroundCapableMedia"),t.mozAudioChannelType="content",t},isMobile:function(t){var e=window.navigator.userAgent,n=["mobile","iPhone","iPad","iPod","Android","Skyfire"];return n.some(function(t){return t=new RegExp(t,"i"),t.test(e)})},isIE10Mobile:function(){return/IEmobile\/10\.0/gi.test(navigator.userAgent)},canPlayType:function(t){var e=document.createElement("audio");return!!(e&&e.canPlayType&&e.canPlayType(t).match(/maybe|probably/i))},isNativeHlsSupported:function(){var t,e,n,i=navigator.userAgent,r=["iPhone","iPad","iPod"];return t=function(t){return t.test(i)},e=!t(/chrome/i)&&!t(/opera/i)&&t(/safari/i),n=r.some(function(e){return t(new RegExp(e,"i"))}),n||e},isMSESupported:n,isMSESupportMPEG:function(){return n()&&MediaSource.isTypeSupported("audio/mpeg")},isMSESupportMP4:function(){return n()&&MediaSource.isTypeSupported("audio/mp4")}}},function(t,e,n){function i(t,e){a.call(this,"FlashAudioProxy",t,e),i.players[t.id]=this,this._errorMessage=null,this._errorID=null,this._volume=1,this._muted=!1,i.creatingFlashAudio||(i.flashAudio?this._createFlashAudio():i.createFlashObject(e))}var r=n(1),o=n(18),s=n(29),a=n(35),u=n(39),h=n(43),c=n(38),l=n(44);t.exports=i,r(i.prototype,a.prototype),i.players={},i.createFlashObject=function(t){i.creatingFlashAudio=!0,i.containerElement=document.createElement("div"),i.containerElement.setAttribute("id",t.flashObjectID+"-container"),i.flashElementTarget=document.createElement("div"),i.flashElementTarget.setAttribute("id",t.flashObjectID+"-target"),i.containerElement.appendChild(i.flashElementTarget),document.body.appendChild(i.containerElement);var e=function(e){if(e.success)i.flashAudio=document.getElementById(t.flashObjectID),window.setTimeout(function(){if(i.flashAudio&&!("PercentLoaded"in i.flashAudio))for(var t in i.players)i.players.hasOwnProperty(t)&&(i.players[t]._errorID=h.FLASH_PROXY_FLASH_BLOCKED,i.players[t]._errorMessage="Flash object blocked",i.players[t]._setState(c.ERROR),i.players[t]._logger.type=i.players[t].getType(),i.players[t]._logger.log(i.players[t]._errorMessage))},t.flashLoadTimeout),i.flashAudio.triggerEvent=function(t,e){i.players[t]._triggerEvent(e)},i.flashAudio.onPositionChange=function(t,e,n,r){i.players[t]._onPositionChange(e,n,r)},i.flashAudio.onDebug=function(t,e,n){i.players[t]._logger.type=e,i.players[t]._logger.log(n)},i.flashAudio.onStateChange=function(t,e){i.players[t]._setState(e),e===c.DEAD&&delete i.players[t]},i.flashAudio.onInit=function(t){i.creatingFlashAudio=!1,o(s(i.players),"_createFlashAudio")};else for(var n in i.players)i.players.hasOwnProperty(n)&&(i.players[n]._errorID=h.FLASH_PROXY_CANT_LOAD_FLASH,i.players[n]._errorMessage="Cannot create flash object",i.players[n]._setState(c.ERROR))};document.getElementById(t.flashObjectID)||l.embedSWF(t.flashAudioPath,t.flashObjectID+"-target","1","1","9.0.24","",{json:encodeURIComponent(JSON.stringify(t))},{allowscriptaccess:"always"},{id:t.flashObjectID,tabIndex:"-1"},e)},i._ready=function(){return i.flashAudio&&!i.creatingFlashAudio},i.prototype._createFlashAudio=function(){i.flashAudio.createAudio(this.getDescriptor()),this._state=i.flashAudio.getState(this.getId()),this.setVolume(this._volume),this.setMute(this._muted)},i.prototype._triggerEvent=function(t){this._logger.log("Flash element triggered event: "+t),this.trigger(t,this)},i.prototype._setState=function(t){this._state!==t&&(this._state=t,this.trigger(u.STATE_CHANGE,t,this))},i.prototype._onPositionChange=function(t,e,n){this.trigger(u.POSITION_CHANGE,t,e,n,this)},i.prototype.getType=function(){return i._ready()?i.flashAudio.getType(this.getId()):this._type},i.prototype.getContainerElement=function(){
return i.containerElement},i.prototype.play=function(t){if(i._ready()){if(this.getState()===c.PAUSED)return void this.resume();t=void 0===t?0:t,i.flashAudio.playAudio(this.getId(),t)}},i.prototype.pause=function(){i._ready()&&i.flashAudio.pauseAudio(this.getId())},i.prototype.seek=function(t){i._ready()&&i.flashAudio.seekAudio(this.getId(),t)},i.prototype.resume=function(){i._ready()&&i.flashAudio.resumeAudio(this.getId())},i.prototype.setVolume=function(t){this._volume=t,i._ready()&&i.flashAudio.setVolume(this.getId(),t)},i.prototype.getVolume=function(){return i._ready()?i.flashAudio.getVolume(this.getId()):this._volume},i.prototype.setMute=function(t){this._muted=t,i._ready()&&i.flashAudio.setMute(this.getId(),t)},i.prototype.getMute=function(){return i._ready()?i.flashAudio.getMute(this.getId()):this._muted},i.prototype.getState=function(){return this._state},i.prototype.getCurrentPosition=function(){return i._ready()?i.flashAudio.getCurrentPosition(this.getId()):0},i.prototype.getLoadedPosition=function(){return i._ready()?i.flashAudio.getLoadedPosition(this.getId()):0},i.prototype.getDuration=function(){return i._ready()?i.flashAudio.getDuration(this.getId()):0},i.prototype.kill=function(){return i._ready()?void i.flashAudio.killAudio(this.getId()):0},i.prototype.getErrorMessage=function(){return this._errorMessage?this._errorMessage:i.flashAudio.getErrorMessage(this.getId())},i.prototype.getErrorID=function(){return this._errorID?this._errorID:i.flashAudio.getErrorID(this.getId())},i.prototype.getLevelNum=function(){return i._ready()?i.flashAudio.getLevelNum(this.getId()):0},i.prototype.getLevel=function(){return i._ready()?i.flashAudio.getLevel(this.getId()):0},i.prototype.setLevel=function(t){return i._ready()?i.flashAudio.setLevel(this.getId(),t):0}},function(t,e,n){function i(t){return function(e){return null==e?void 0:e[t]}}function r(t){return null!=t&&s(_(t))}function o(t,e){var n=typeof t;if("string"==n&&p.test(t)||"number"==n)return!0;if(l(t))return!1;var i=!d.test(t);return i||null!=e&&t in a(e)}function s(t){return"number"==typeof t&&t>-1&&t%1==0&&g>=t}function a(t){return u(t)?t:Object(t)}function u(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}var h=n(19),c=n(24),l=n(23),f=n(28),d=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,p=/^\w*$/,g=9007199254740991,_=i("length"),m=f(function(t,e,n){var i=-1,s="function"==typeof e,a=o(e),u=r(t)?Array(t.length):[];return h(t,function(t){var r=s?e:a&&null!=t?t[e]:void 0;u[++i]=r?r.apply(t,n):c(t,e,n)}),u});t.exports=m},[134,20],[132,21,22,23],5,6,7,function(t,e,n){function i(t,e,n){null==t||r(e,t)||(e=c(e),t=1==e.length?t:u(t,h(e,0,-1)),e=s(e));var i=null==t?t:t[e];return null==i?void 0:i.apply(t,n)}function r(t,e){var n=typeof t;if("string"==n&&d.test(t)||"number"==n)return!0;if(l(t))return!1;var i=!f.test(t);return i||null!=e&&t in o(e)}function o(t){return a(t)?t:Object(t)}function s(t){var e=t?t.length:0;return e?t[e-1]:void 0}function a(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}var u=n(25),h=n(26),c=n(27),l=n(23),f=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,d=/^\w*$/;t.exports=i},function(t,e){function n(t,e,n){if(null!=t){void 0!==n&&n in i(t)&&(e=[n]);for(var r=0,o=e.length;null!=t&&o>r;)t=t[e[r++]];return r&&r==o?t:void 0}}function i(t){return r(t)?t:Object(t)}function r(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}t.exports=n},function(t,e){function n(t,e,n){var i=-1,r=t.length;e=null==e?0:+e||0,0>e&&(e=-e>r?0:r+e),n=void 0===n||n>r?r:+n||0,0>n&&(n+=r),r=e>n?0:n-e>>>0,e>>>=0;for(var o=Array(r);++i<r;)o[i]=t[i+e];return o}t.exports=n},function(t,e,n){function i(t){return null==t?"":t+""}function r(t){if(o(t))return t;var e=[];return i(t).replace(s,function(t,n,i,r){e.push(i?r.replace(a,"$1"):n||t)}),e}var o=n(23),s=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g,a=/\\(\\)?/g;t.exports=r},11,function(t,e,n){function i(t){return r(t,o(t))}var r=n(30),o=n(31);t.exports=i},function(t,e){function n(t,e){for(var n=-1,i=e.length,r=Array(i);++n<i;)r[n]=t[e[n]];return r}t.exports=n},[132,32,33,34],5,6,7,function(t,e,n){function i(t,e,n,i){this._type=t,this._id=e.id,this._descriptor=e,this._settings=n,this._currentPosition=this._loadedPosition=this._duration=0,this._capabilities=r({},h.createDefaults(),i),this._logger=new u(this.getType(),this.getId(),e.title,n);try{h.validate(this.getCapabilities())}catch(o){return this.getLogger().log("Bad caps: "+o),void this.updateState(s.ERROR)}this.updateState(s.INITIALIZE)}var r=n(1),o=n(36),s=n(38),a=n(39),u=n(40),h=n(42);t.exports=i,r(i.prototype,o),i.prototype.canPlay=function(){return!1},i.prototype.getCapabilities=function(){return this._capabilities},i.prototype.getLogger=function(){return this._logger},i.prototype.getSettings=function(){return this._settings},i.prototype.getDescriptor=function(){return this._descriptor},i.prototype.getType=function(){return this._type},i.prototype.getId=function(){return this._id+""},i.prototype.beforeStateChange=function(t,e){return!0},i.prototype.notifyStateChange=function(t,e){return!0},i.prototype.afterStateChange=function(t,e){},i.prototype.updateState=function(t){var e=this._state;e!==t&&e!==s.DEAD&&this.beforeStateChange(e,t)&&(this._state=t,this._logger.log('state changed "'+this.getState()+'", position: '+this.getCurrentPosition()+", duration: "+this.getDuration()),this.notifyStateChange(e,t)&&this.trigger(a.STATE_CHANGE,t,this),this.afterStateChange(e,t))},i.prototype.getState=function(){return this._state},i.prototype._isInOneOfStates=function(){for(var t in arguments)if(arguments[t]===this.getState())return!0;return!1},i.prototype.getCurrentPosition=function(){return this._currentPosition},i.prototype.getLoadedPosition=function(){return this._loadedPosition},i.prototype.getDuration=function(){return this._duration}},function(t,e,n){t.exports=n(37)},function(t,e,n){!function(){function n(){return{keys:Object.keys||function(t){if("object"!=typeof t&&"function"!=typeof t||null===t)throw new TypeError("keys() called on a non-object");var e,n=[];for(e in t)t.hasOwnProperty(e)&&(n[n.length]=e);return n},uniqueId:function(t){var e=++a+"";return t?t+e:e},has:function(t,e){return o.call(t,e)},each:function(t,e,n){if(null!=t)if(r&&t.forEach===r)t.forEach(e,n);else if(t.length===+t.length)for(var i=0,o=t.length;o>i;i++)e.call(n,t[i],i,t);else for(var s in t)this.has(t,s)&&e.call(n,t[s],s,t)},once:function(t){var e,n=!1;return function(){return n?e:(n=!0,e=t.apply(this,arguments),t=null,e)}}}}var i,r=Array.prototype.forEach,o=Object.prototype.hasOwnProperty,s=Array.prototype.slice,a=0,u=n();i={on:function(t,e,n){if(!c(this,"on",t,[e,n])||!e)return this;this._events||(this._events={});var i=this._events[t]||(this._events[t]=[]);return i.push({callback:e,context:n,ctx:n||this}),this},once:function(t,e,n){if(!c(this,"once",t,[e,n])||!e)return this;var i=this,r=u.once(function(){i.off(t,r),e.apply(this,arguments)});return r._callback=e,this.on(t,r,n)},off:function(t,e,n){var i,r,o,s,a,h,l,f;if(!this._events||!c(this,"off",t,[e,n]))return this;if(!t&&!e&&!n)return this._events={},this;for(s=t?[t]:u.keys(this._events),a=0,h=s.length;h>a;a++)if(t=s[a],o=this._events[t]){if(this._events[t]=i=[],e||n)for(l=0,f=o.length;f>l;l++)r=o[l],(e&&e!==r.callback&&e!==r.callback._callback||n&&n!==r.context)&&i.push(r);i.length||delete this._events[t]}return this},trigger:function(t){if(!this._events)return this;var e=s.call(arguments,1);if(!c(this,"trigger",t,e))return this;var n=this._events[t],i=this._events.all;return n&&l(n,e),i&&l(i,arguments),this},stopListening:function(t,e,n){var i=this._listeners;if(!i)return this;var r=!e&&!n;"object"==typeof e&&(n=this),t&&((i={})[t._listenerId]=t);for(var o in i)i[o].off(e,n,this),r&&delete this._listeners[o];return this}};var h=/\s+/,c=function(t,e,n,i){if(!n)return!0;if("object"==typeof n){for(var r in n)t[e].apply(t,[r,n[r]].concat(i));return!1}if(h.test(n)){for(var o=n.split(h),s=0,a=o.length;a>s;s++)t[e].apply(t,[o[s]].concat(i));return!1}return!0},l=function(t,e){var n,i=-1,r=t.length,o=e[0],s=e[1],a=e[2];switch(e.length){case 0:for(;++i<r;)(n=t[i]).callback.call(n.ctx);return;case 1:for(;++i<r;)(n=t[i]).callback.call(n.ctx,o);return;case 2:for(;++i<r;)(n=t[i]).callback.call(n.ctx,o,s);return;case 3:for(;++i<r;)(n=t[i]).callback.call(n.ctx,o,s,a);return;default:for(;++i<r;)(n=t[i]).callback.apply(n.ctx,e)}},f={listenTo:"on",listenToOnce:"once"};u.each(f,function(t,e){i[e]=function(e,n,i){var r=this._listeners||(this._listeners={}),o=e._listenerId||(e._listenerId=u.uniqueId("l"));return r[o]=e,"object"==typeof n&&(i=this),e[t](n,i,this),this}}),i.bind=i.on,i.unbind=i.off,i.mixin=function(t){var e=["on","once","off","trigger","stopListening","listenTo","listenToOnce","bind","unbind"];return u.each(e,function(e){t[e]=this[e]},this),t},"undefined"!=typeof t&&t.exports&&(e=t.exports=i),e.BackboneEvents=i}(this)},function(t,e){t.exports={PLAYING:"playing",LOADING:"loading",SEEKING:"seeking",PAUSED:"paused",ERROR:"error",IDLE:"idle",INITIALIZE:"initialize",ENDED:"ended",DEAD:"dead"}},function(t,e){t.exports={POSITION_CHANGE:"position-change",STATE_CHANGE:"state-change",DATA:"data",NETWORK_TIMEOUT:"network-timeout",METADATA:"metadata"}},function(t,e,n){var i,r=n(41),o=null;t.exports=function(t,e,n,s){if(!i&&(i=r(!!s.debug,"audiomanager"),o)){var a=i;i=function(){a(o(arguments[0]+"%s",Array.prototype.slice.call(arguments,1)))}}return n=n&&n.length?" ["+n.replace(/\s/g,"").substr(0,6)+"]":"",{log:i.bind(null,"%s (%s)%s",t,e,n)}}},function(t,e){function n(){function t(t,n){for(var i,r=arguments.length,o=Array(r>2?r-2:0),s=2;r>s;s++)o[s-2]=arguments[s];"string"==typeof n?n=" "+n:(o.unshift(n),n=""),(i=window.console)[t].apply(i,[e()+" |"+c+"%c"+n].concat(l,o))}function e(){var t=new Date,e=null===h?0:t-h;return h=+t,"%c"+r(t.getHours())+":"+r(t.getMinutes())+":"+r(t.getSeconds())+"."+i(t.getMilliseconds(),"0",3)+"%c (%c"+i("+"+e+"ms"," ",8)+"%c)"}var n=arguments.length<=0||void 0===arguments[0]?!0:arguments[0],o=arguments.length<=1||void 0===arguments[1]?"":arguments[1];if(!n)return s;var h=null,c=a(o),l=["color: green","color: grey","color: blue","color: grey",u(o),""],f=t.bind(null,"log");return f.log=f,["info","warn","error"].forEach(function(e){f[e]=t.bind(null,e)}),f}function i(t,e,n){return o(e,n-(""+t).length)+t}function r(t){return i(t,"0",2)}function o(t,e){return e>0?new Array(e+1).join(t):""}function s(){}function a(t){return t?"%c"+t:"%c"}t.exports=n,s.log=s.info=s.warn=s.error=s;var u=function(){var t=["#51613C","#447848","#486E5F","#787444","#6E664E"],e=0;return function(n){return n?"background-color:"+t[e++%t.length]+";color:#fff;border-radius:3px;padding:2px 4px;font-family:sans-serif;text-transform:uppercase;font-size:9px;margin:0 4px":""}}()},function(t,e){function n(t){for(var e in r)if(r.hasOwnProperty(e)&&void 0===t[r[e]])throw new Error("Caps lack required field: "+e);if(!(t[r.PROTOCOLS]instanceof Array))throw new Error("Caps protocols must be an array");if(!(t[r.MIMETYPES]instanceof Array))throw new Error("Caps mimetypes must be an array");return!0}function i(){var t={};return t[r.MIMETYPES]=[],t[r.PROTOCOLS]=[],t[r.AUDIO_ONLY]=!0,t[r.CAN_SEEK_ALWAYS]=!0,t[r.NEEDS_URL_REFRESH]=!0,t}var r={MIMETYPES:"mimetypes",PROTOCOLS:"protocols",AUDIO_ONLY:"audioOnly",CAN_SEEK_ALWAYS:"canSeekAlways",NEEDS_URL_REFRESH:"needsUrlRefresh"},o={createDefaults:i,names:r,validate:n};t.exports=o},function(t,e){t.exports={FLASH_HLS_PLAYLIST_NOT_FOUND:"HLS_PLAYLIST_NOT_FOUND",FLASH_HLS_PLAYLIST_SECURITY_ERROR:"HLS_SECURITY_ERROR",FLASH_HLS_NOT_VALID_PLAYLIST:"HLS_NOT_VALID_PLAYLIST",FLASH_HLS_NO_TS_IN_PLAYLIST:"HLS_NO_TS_IN_PLAYLIST",FLASH_HLS_NO_PLAYLIST_IN_MANIFEST:"HLS_NO_PLAYLIST_IN_MANIFEST",FLASH_HLS_TS_IS_CORRUPT:"HLS_TS_IS_CORRUPT",FLASH_HLS_FLV_TAG_CORRUPT:"HLS_FLV_TAG_CORRUPT",FLASH_HTTP_FILE_NOT_FOUND:"HTTP_FILE_NOT_FOUND",FLASH_RTMP_CONNECT_FAILED:"RTMP_CONNECT_FAILED",FLASH_RTMP_CONNECT_CLOSED:"RTMP_CONNECT_CLOSED",FLASH_RTMP_CANNOT_PLAY_STREAM:"RTMP_CANNOT_PLAY_STREAM",FLASH_PROXY_CANT_LOAD_FLASH:"CANT_LOAD_FLASH",FLASH_PROXY_FLASH_BLOCKED:"FLASH_PROXY_FLASH_BLOCKED",GENERIC_AUDIO_ENDED_EARLY:"GENERIC_AUDIO_ENDED_EARLY",GENERIC_AUDIO_OVERRUN:"GENERIC_AUDIO_OVERRUN",HTML5_AUDIO_ABORTED:"HTML5_AUDIO_ABORTED",HTML5_AUDIO_NETWORK:"HTML5_AUDIO_NETWORK",HTML5_AUDIO_DECODE:"HTML5_AUDIO_DECODE",HTML5_AUDIO_SRC_NOT_SUPPORTED:"HTML5_AUDIO_SRC_NOT_SUPPORTED",MSE_BAD_OBJECT_STATE:"MSE_BAD_OBJECT_STATE",MSE_NOT_SUPPORTED:"MSE_NOT_SUPPORTED",MSE_MP3_NOT_SUPPORTED:"MSE_MP3_NOT_SUPPORTED",MSE_HLS_NOT_VALID_PLAYLIST:"MSE_HLS_NOT_VALID_PLAYLIST",MSE_HLS_PLAYLIST_NOT_FOUND:"MSE_HLS_PLAYLIST_NOT_FOUND",MSE_HLS_SEGMENT_NOT_FOUND:"MSE_HLS_SEGMENT_NOT_FOUND"}},function(t,e){function n(){if(!q&&document.getElementsByTagName("body")[0]){try{var t,e=v("span");e.style.display="none",t=j.getElementsByTagName("body")[0].appendChild(e),t.parentNode.removeChild(t),t=null,e=null}catch(n){return}q=!0;for(var i=V.length,r=0;i>r;r++)V[r]()}}function i(t){q?t():V[V.length]=t}function r(t){if(typeof H.addEventListener!=k)H.addEventListener("load",t,!1);else if(typeof j.addEventListener!=k)j.addEventListener("load",t,!1);else if(typeof H.attachEvent!=k)S(H,"onload",t);else if("function"==typeof H.onload){var e=H.onload;H.onload=function(){e(),t()}}else H.onload=t}function o(){var t=j.getElementsByTagName("body")[0],e=v(N);e.setAttribute("style","visibility: hidden;"),e.setAttribute("type",F);var n=t.appendChild(e);if(n){var i=0;!function r(){if(typeof n.GetVariable!=k)try{var o=n.GetVariable("$version");o&&(o=o.split(" ")[1].split(","),Q.pv=[E(o[0]),E(o[1]),E(o[2])])}catch(a){Q.pv=[8,0,0]}else if(10>i)return i++,void window.setTimeout(r,10);t.removeChild(e),n=null,s()}()}else s()}function s(){var t=z.length;if(t>0)for(var e=0;t>e;e++){var n=z[e].id,i=z[e].callbackFn,r={success:!1,id:n};if(Q.pv[0]>0){var o=y(n);if(o)if(!A(z[e].swfVersion)||Q.wk&&Q.wk<312)if(z[e].expressInstall&&u()){var s={};s.data=z[e].expressInstall,s.width=o.getAttribute("width")||"0",s.height=o.getAttribute("height")||"0",o.getAttribute("class")&&(s.styleclass=o.getAttribute("class")),o.getAttribute("align")&&(s.align=o.getAttribute("align"));for(var l={},f=o.getElementsByTagName("param"),d=f.length,p=0;d>p;p++)"movie"!==f[p].getAttribute("name").toLowerCase()&&(l[f[p].getAttribute("name")]=f[p].getAttribute("value"));h(s,l,n,i)}else c(o),i&&i(r);else T(n,!0),i&&(r.success=!0,r.ref=a(n),r.id=n,i(r))}else if(T(n,!0),i){var g=a(n);g&&typeof g.SetVariable!=k&&(r.success=!0,r.ref=g,r.id=g.id),i(r)}}}function a(t){var e=null,n=y(t);return n&&"OBJECT"===n.nodeName.toUpperCase()&&(e=typeof n.SetVariable!==k?n:n.getElementsByTagName(N)[0]||n),e}function u(){return!X&&A("6.0.65")&&(Q.win||Q.mac)&&!(Q.wk&&Q.wk<312)}function h(t,e,n,i){var r=y(n);if(n=m(n),X=!0,O=i||null,R={success:!1,id:n},r){"OBJECT"===r.nodeName.toUpperCase()?(I=l(r),L=null):(I=r,L=n),t.id=U,(typeof t.width==k||!/%$/.test(t.width)&&E(t.width)<310)&&(t.width="310"),(typeof t.height==k||!/%$/.test(t.height)&&E(t.height)<137)&&(t.height="137");var o=Q.ie?"ActiveX":"PlugIn",s="MMredirectURL="+encodeURIComponent(H.location.toString().replace(/&/g,"%26"))+"&MMplayerType="+o+"&MMdoctitle="+encodeURIComponent(j.title.slice(0,47)+" - Flash Player Installation");if(typeof e.flashvars!=k?e.flashvars+="&"+s:e.flashvars=s,Q.ie&&4!==r.readyState){var a=v("div");n+="SWFObjectNew",a.setAttribute("id",n),r.parentNode.insertBefore(a,r),r.style.display="none",g(r)}d(t,e,n)}}function c(t){if(Q.ie&&4!==t.readyState){t.style.display="none";var e=v("div");t.parentNode.insertBefore(e,t),e.parentNode.replaceChild(l(t),e),g(t)}else t.parentNode.replaceChild(l(t),t)}function l(t){var e=v("div");if(Q.win&&Q.ie)e.innerHTML=t.innerHTML;else{var n=t.getElementsByTagName(N)[0];if(n){var i=n.childNodes;if(i)for(var r=i.length,o=0;r>o;o++)1===i[o].nodeType&&"PARAM"===i[o].nodeName||8===i[o].nodeType||e.appendChild(i[o].cloneNode(!0))}}return e}function f(t,e){var n=v("div");return n.innerHTML="<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000'><param name='movie' value='"+t+"'>"+e+"</object>",n.firstChild}function d(t,e,n){var i,r=y(n);if(n=m(n),Q.wk&&Q.wk<312)return i;if(r){var o,s,a,u=v(Q.ie?"div":N);typeof t.id==k&&(t.id=n);for(a in e)e.hasOwnProperty(a)&&"movie"!==a.toLowerCase()&&p(u,a,e[a]);Q.ie&&(u=f(t.data,u.innerHTML));for(o in t)t.hasOwnProperty(o)&&(s=o.toLowerCase(),"styleclass"===s?u.setAttribute("class",t[o]):"classid"!==s&&"data"!==s&&u.setAttribute(o,t[o]));Q.ie?W[W.length]=t.id:(u.setAttribute("type",F),u.setAttribute("data",t.data)),r.parentNode.replaceChild(u,r),i=u}return i}function p(t,e,n){var i=v("param");i.setAttribute("name",e),i.setAttribute("value",n),t.appendChild(i)}function g(t){var e=y(t);e&&"OBJECT"===e.nodeName.toUpperCase()&&(Q.ie?(e.style.display="none",function n(){if(4===e.readyState){for(var t in e)"function"==typeof e[t]&&(e[t]=null);e.parentNode.removeChild(e)}else window.setTimeout(n,10)}()):e.parentNode.removeChild(e))}function _(t){return t&&t.nodeType&&1===t.nodeType}function m(t){return _(t)?t.id:t}function y(t){if(_(t))return t;var e=null;try{e=j.getElementById(t)}catch(n){}return e}function v(t){return j.createElement(t)}function E(t){return parseInt(t,10)}function S(t,e,n){t.attachEvent(e,n),K[K.length]=[t,e,n]}function A(t){t+="";var e=Q.pv,n=t.split(".");return n[0]=E(n[0]),n[1]=E(n[1])||0,n[2]=E(n[2])||0,e[0]>n[0]||e[0]===n[0]&&e[1]>n[1]||e[0]===n[0]&&e[1]===n[1]&&e[2]>=n[2]}function w(t,e,n,i){var r=j.getElementsByTagName("head")[0];if(r){var o="string"==typeof n?n:"screen";if(i&&(D=null,M=null),!D||M!==o){var s=v("style");s.setAttribute("type","text/css"),s.setAttribute("media",o),D=r.appendChild(s),Q.ie&&typeof j.styleSheets!=k&&j.styleSheets.length>0&&(D=j.styleSheets[j.styleSheets.length-1]),M=o}D&&(typeof D.addRule!=k?D.addRule(t,e):typeof j.createTextNode!=k&&D.appendChild(j.createTextNode(t+" {"+e+"}")))}}function T(t,e){if($){var n=e?"visible":"hidden",i=y(t);q&&i?i.style.visibility=n:"string"==typeof t&&w("#"+t,"visibility:"+n)}}function b(t){var e=/[\\\"<>\.;]/,n=null!=e.exec(t);return n&&typeof encodeURIComponent!=k?encodeURIComponent(t):t}/*!    SWFObject v2.3.20130521 <http://github.com/swfobject/swfobject>
		    is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
		*/
var P,I,L,O,R,D,M,k="undefined",N="object",x="Shockwave Flash",C="ShockwaveFlash.ShockwaveFlash",F="application/x-shockwave-flash",U="SWFObjectExprInst",B="onreadystatechange",H=window,j=document,G=navigator,Y=!1,V=[],z=[],W=[],K=[],q=!1,X=!1,$=!0,Z=!1,Q=function(){var t=typeof j.getElementById!=k&&typeof j.getElementsByTagName!=k&&typeof j.createElement!=k,e=G.userAgent.toLowerCase(),n=G.platform.toLowerCase(),i=n?/win/.test(n):/win/.test(e),r=n?/mac/.test(n):/mac/.test(e),o=/webkit/.test(e)?parseFloat(e.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):!1,s="Microsoft Internet Explorer"===G.appName,a=[0,0,0],u=null;if(typeof G.plugins!=k&&typeof G.plugins[x]==N)u=G.plugins[x].description,u&&typeof G.mimeTypes!=k&&G.mimeTypes[F]&&G.mimeTypes[F].enabledPlugin&&(Y=!0,s=!1,u=u.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),a[0]=E(u.replace(/^(.*)\..*$/,"$1")),a[1]=E(u.replace(/^.*\.(.*)\s.*$/,"$1")),a[2]=/[a-zA-Z]/.test(u)?E(u.replace(/^.*[a-zA-Z]+(.*)$/,"$1")):0);else if(typeof H.ActiveXObject!=k)try{var h=new ActiveXObject(C);h&&(u=h.GetVariable("$version"),u&&(s=!0,u=u.split(" ")[1].split(","),a=[E(u[0]),E(u[1]),E(u[2])]))}catch(c){}return{w3:t,pv:a,wk:o,ie:s,win:i,mac:r}}();!function(){Q.w3&&((typeof j.readyState!=k&&("complete"===j.readyState||"interactive"===j.readyState)||typeof j.readyState==k&&(j.getElementsByTagName("body")[0]||j.body))&&n(),q||(typeof j.addEventListener!=k&&j.addEventListener("DOMContentLoaded",n,!1),Q.ie&&(j.attachEvent(B,function t(){"complete"===j.readyState&&(j.detachEvent(B,t),n())}),H===top&&!function e(){if(!q){try{j.documentElement.doScroll("left")}catch(t){return void window.setTimeout(e,0)}n()}}()),Q.wk&&!function i(){return q?void 0:/loaded|complete/.test(j.readyState)?void n():void window.setTimeout(i,0)}()))}(),V[0]=function(){Y?o():s()},function(){Q.ie&&window.attachEvent("onunload",function(){for(var t=K.length,e=0;t>e;e++)K[e][0].detachEvent(K[e][1],K[e][2]);for(var n=W.length,i=0;n>i;i++)g(W[i]);for(var r in Q)Q[r]=null;Q=null;for(var o in P)P[o]=null;P=null})}(),t.exports=P={registerObject:function(t,e,n,i){if(Q.w3&&t&&e){var r={};r.id=t,r.swfVersion=e,r.expressInstall=n,r.callbackFn=i,z[z.length]=r,T(t,!1)}else i&&i({success:!1,id:t})},getObjectById:function(t){return Q.w3?a(t):void 0},embedSWF:function(t,e,n,r,o,s,a,c,l,f){var p=m(e),g={success:!1,id:p};Q.w3&&!(Q.wk&&Q.wk<312)&&t&&e&&n&&r&&o?(T(p,!1),i(function(){n+="",r+="";var i={};if(l&&typeof l===N)for(var _ in l)i[_]=l[_];i.data=t,i.width=n,i.height=r;var m={};if(c&&typeof c===N)for(var y in c)m[y]=c[y];if(a&&typeof a===N)for(var v in a)if(a.hasOwnProperty(v)){var E=Z?encodeURIComponent(v):v,S=Z?encodeURIComponent(a[v]):a[v];typeof m.flashvars!=k?m.flashvars+="&"+E+"="+S:m.flashvars=E+"="+S}if(A(o)){var w=d(i,m,e);i.id===p&&T(p,!0),g.success=!0,g.ref=w,g.id=w.id}else{if(s&&u())return i.data=s,void h(i,m,e,f);T(p,!0)}f&&f(g)})):f&&f(g)},switchOffAutoHideShow:function(){$=!1},enableUriEncoding:function(t){Z=typeof t===k?!0:t},ua:Q,getFlashPlayerVersion:function(){return{major:Q.pv[0],minor:Q.pv[1],release:Q.pv[2]}},hasFlashPlayerVersion:A,createSWF:function(t,e,n){return Q.w3?d(t,e,n):void 0},showExpressInstall:function(t,e,n,i){Q.w3&&u()&&h(t,e,n,i)},removeSWF:function(t){Q.w3&&g(t)},createCSS:function(t,e,n,i){Q.w3&&w(t,e,n,i)},addDomLoadEvent:i,addLoadEvent:r,getQueryParamValue:function(t){var e=j.location.search||j.location.hash;if(e){if(/\?/.test(e)&&(e=e.split("?")[1]),null==t)return b(e);for(var n=e.split("&"),i=0;i<n.length;i++)if(n[i].substring(0,n[i].indexOf("="))===t)return b(n[i].substring(n[i].indexOf("=")+1))}return""},expressInstallCallback:function(){if(X){var t=y(U);t&&I&&(t.parentNode.replaceChild(I,t),L&&(T(L,!0),Q.ie&&(I.style.display="block")),O&&O(R)),X=!1}},version:"2.3"}},function(t,e,n){function i(t,e,n,i){if(n!==s&&n!==o&&void 0!==n)throw new Error("Can not use the provided base class");this._baseclass=n||o,this._baseclass.call(this,t,e,i||"HLSAudioPlayer"),this._seekPosition=0}var r=n(1),o=n(46),s=n(48),a=n(38);t.exports=i,r(i.prototype,o.prototype),i.prototype.seek=function(t){this._baseclass.prototype.seek.apply(this,arguments),this._isInOneOfStates(a.LOADING,a.SEEKING)&&(this._seekPosition=t)},i.prototype.getCurrentPosition=function(){if(this._isInOneOfStates(a.LOADING)&&this._seekPosition>0)return this._seekPosition;if(this._isInOneOfStates(a.PLAYING,a.SEEKING)){if(this._seekPosition>=this._currentPosition)return this._seekPosition;this._seekPosition=0}return this._baseclass.prototype.getCurrentPosition.apply(this,arguments)}},function(t,e,n){function i(t,e,n){this._duration=0,this._currentPosition=0,this._loadedPosition=0,h.prototype.constructor.call(this,n||"HTML5AudioPlayer",t,e),this._isLoaded=!1,this._prevCurrentPosition=0,this._prevCheckTime=0,this._positionUpdateTimer=0,this._playRequested=!1,this._startFromPosition=0,this.getDescriptor().duration&&(this._duration=this.getDescriptor().duration),this._bindHandlers(),this._initMediaElement(),this.updateState(s.IDLE)}var r=n(1),o=n(47).bindAll,s=n(38),a=n(39),u=n(43),h=n(35),c=n(16);t.exports=i,r(i.prototype,h.prototype),i.MediaAPIEvents=["ended","play","playing","pause","seeking","waiting","seeked","error","loadeddata","loadedmetadata"],i.prototype.play=function(t){return this._isInOneOfStates(s.ERROR,s.DEAD)?void this._logger.log("play called but state is ERROR or DEAD"):(this._logger.log("play from "+t),this._startFromPosition=t||0,this._playRequested=!0,this._isInOneOfStates(s.PAUSED,s.ENDED)?void this.resume():(this.updateState(s.LOADING),this._html5Audio.readyState>0&&this._onLoadedMetadata(),this._html5Audio.readyState>1&&this._onLoaded(),void(this._isLoaded?this._playAfterLoaded():this.once(a.DATA,this._playAfterLoaded))))},i.prototype.pause=function(){this._isInOneOfStates(s.ERROR,s.DEAD)||(this._logger.log("pause"),this._playRequested=!1,this._html5Audio&&this._html5Audio.pause())},i.prototype.seek=function(t){var e,n=!1,i=t/1e3,r=this._html5Audio.seekable;if(!this._isInOneOfStates(s.ERROR,s.DEAD)){if(!this._isLoaded)return this.once(a.DATA,function(){this.seek(t)}),void this._logger.log("postponing seek for when loaded");if(c.isIE10Mobile)n=!0;else for(e=0;e<r.length;e++)if(i<=r.end(e)&&i>=r.start(e)){n=!0;break}if(!n)return void this._logger.log("can not seek");this._logger.log("seek"),this.updateState(s.SEEKING),this._html5Audio.currentTime=i,this._currentPosition=t,this._lastMediaClockCheck=null}},i.prototype.resume=function(){return this._isInOneOfStates(s.ERROR,s.DEAD)?void this._logger.log("resume called but state is ERROR or DEAD"):(this._logger.log("resume"),void(this.getState()===s.PAUSED?(this.updateState(s.PLAYING),this._html5Audio.play(this._html5Audio.currentTime)):this.getState()===s.ENDED&&this._html5Audio.play(0)))},i.prototype.setVolume=function(t){this._html5Audio&&(this._html5Audio.volume=t)},i.prototype.getVolume=function(){return this._html5Audio?this._html5Audio.volume:1},i.prototype.setMute=function(t){this._html5Audio&&(this._html5Audio.muted=t)},i.prototype.getMute=function(){return this._html5Audio?this._html5Audio.muted:!1},i.prototype.kill=function(){this._state!==s.DEAD&&(this._logger.log("killing ..."),this._resetPositionInterval(!1),this._playRequested=!1,this._toggleEventListeners(!1),this.pause(),delete this._html5Audio,this.updateState(s.DEAD),this._logger.log("dead"))},i.prototype.getErrorMessage=function(){return this._errorMessage},i.prototype.getErrorID=function(){return this._errorID},i.prototype._bindHandlers=function(){o(this,["_onPositionChange","_onHtml5MediaEvent","_onLoaded","_onLoadedMetadata"])},i.prototype._initMediaElement=function(){this._html5Audio=c.createAudioElement(),this._html5Audio.id=this.getSettings().audioObjectID+"_"+this.getId(),this._html5Audio.preload="auto",this._html5Audio.type=this.getDescriptor().mimeType,this._html5Audio.src=this.getDescriptor().src,this._html5Audio.load(),this._toggleEventListeners(!0)},i.prototype._playAfterLoaded=function(){this._playRequested&&(this._trySeekToStartPosition(),this._html5Audio.play())},i.prototype._isInOneOfStates=function(){for(var t in arguments)if(arguments[t]===this._state)return!0;return!1},i.prototype._toggleEventListeners=function(t){if(this._html5Audio){var e=t?"addEventListener":"removeEventListener";i.MediaAPIEvents.forEach(function(t){switch(t){case"loadeddata":this._html5Audio[e]("loadeddata",this._onLoaded);break;case"loadedmetadata":this._html5Audio[e]("loadedmetadata",this._onLoadedMetadata);break;default:this._html5Audio[e](t,this._onHtml5MediaEvent)}},this)}},i.prototype._trySeekToStartPosition=function(){var t;return this._startFromPosition>0&&(this._logger.log("seek to start position: "+this._startFromPosition),t=this._startFromPosition/1e3,this._html5Audio.currentTime=t,this._html5Audio.currentTime===t)?(this._lastMediaClockCheck=null,this._currentPosition=this._startFromPosition,this._startFromPosition=0,!0):!1},i.prototype._onLoaded=function(){this._logger.log("HTML5 media loadeddata event"),this.trigger(a.DATA,this)},i.prototype._onLoadedMetadata=function(){this._logger.log("HTML5 media loadedmetadata event"),(void 0===this._duration||0===this._duration)&&(this._duration=1e3*this._html5Audio.duration),this._loadedPosition=this._duration,this._isLoaded=!0,this.trigger(a.METADATA,this)},i.prototype._resetPositionInterval=function(t){window.clearInterval(this._positionUpdateTimer),t&&(this._positionUpdateTimer=window.setInterval(this._onPositionChange,this.getSettings().updateInterval))},i.prototype._onPositionChange=function(){if(!this._isInOneOfStates(s.DEAD)){var t;return Date.now(),this._currentPosition=1e3*this._html5Audio.currentTime,this.trigger(a.POSITION_CHANGE,this.getCurrentPosition(),this._loadedPosition,this._duration,this),this._isInOneOfStates(s.PLAYING,s.LOADING)?0!==this._duration&&(this._currentPosition>this._duration||this._currentPosition>this._loadedPosition&&!c.isIE10Mobile)?void this._onHtml5MediaEvent({type:"ended"}):this.getState()!==s.PLAYING||this._mediasHasProgressed()?void(this.getState()!==s.PLAYING&&this._mediasHasProgressed()&&this.updateState(s.PLAYING)):(this._logger.log("media clock check failed, playhead is not advancing anymore"),void this.updateState(s.LOADING)):void(this._state===s.SEEKING&&t>0&&this.updateState(s.PLAYING))}},i.prototype._mediasHasProgressed=function(){var t=!1,e=Date.now();if(this._lastMediaClockCheck){var n=e-this._lastMediaClockCheck,i=this._currentPosition-this._lastMediaClockValue;if(.1*n>i){if(0===i&&50>n)return!0;t=!0}}return this._lastMediaClockValue=this._currentPosition,this._lastMediaClockCheck=e,!t},i.prototype._onHtml5MediaEvent=function(t){switch(this._logger.log("HTML5 media event: "+t.type),t.type){case"playing":if(this._trySeekToStartPosition())break;this._onPositionChange(),this._resetPositionInterval(!0),this.updateState(s.PLAYING);break;case"pause":this._onPositionChange(),this._resetPositionInterval(!1),this.updateState(s.PAUSED);break;case"ended":this._currentPosition=this._loadedPosition=this._duration,this._resetPositionInterval(!1),this.updateState(s.ENDED);break;case"waiting":if(this.getState()===s.SEEKING)break;this.updateState(s.LOADING);break;case"seeking":this.updateState(s.SEEKING);break;case"seeked":this._html5Audio.paused?this.updateState(s.PAUSED):this.updateState(s.PLAYING),this._onPositionChange(t);break;case"error":this._error(this._html5AudioErrorCodeToErrorId(),!0)}},i.prototype._html5AudioErrorCodeToErrorId=function(){return{1:u.HTML5_AUDIO_ABORTED,2:u.HTML5_AUDIO_NETWORK,3:u.HTML5_AUDIO_DECODE,4:u.HTML5_AUDIO_SRC_NOT_SUPPORTED}[this._html5Audio.error.code]},i.prototype._error=function(t,e){var n="error: ";e&&(n="error (native): "),this._errorID=t,this._errorMessage=this._getErrorMessage(this._errorID),this._logger.log(n+this._errorID+" "+this._errorMessage),this.updateState(s.ERROR),this._toggleEventListeners(!1)},i.prototype._getErrorMessage=function(t){var e={};return e[u.HTML5_AUDIO_ABORTED]="The fetching process for the media resource was aborted by the user agent at the user's request.",e[u.HTML5_AUDIO_NETWORK]="A network error of some description caused the user agent to stop fetching the media resource, after the resource was established to be usable.",e[u.HTML5_AUDIO_DECODE]="An error of some description occurred while decoding the media resource, after the resource was established to be usable.",e[u.HTML5_AUDIO_SRC_NOT_SUPPORTED]="The media resource indicated by the src attribute was not suitable.",e[t]}},function(t,e){function n(t,e){var n=new Uint8Array(t.byteLength+e.byteLength);return n.set(new Uint8Array(t),0),n.set(new Uint8Array(e),t.byteLength),n}t.exports={bindAll:function(t,e){e.forEach(function(e){t[e]=t[e].bind(t)})},concatBuffersToUint8Array:n}},function(t,e,n){function i(t,e,n){u.prototype.constructor.call(this,t,e,n||"HTML5SingleAudioPlayer")}var r,o=n(1),s=n(16),a=n(39),u=n(46),h=n(38),c={};t.exports=i,o(i.prototype,u.prototype),i._onLoaded=function(t){i._pauseOthersAndForwardEvent("_onLoaded",t)},i._onLoadedMetadata=function(t){i._pauseOthersAndForwardEvent("_onLoadedMetadata",t)},i._onHtml5MediaEvent=function(t){i._pauseOthersAndForwardEvent("_onHtml5MediaEvent",t)},i._pauseOthersAndForwardEvent=function(t,e){Object.keys(c).forEach(function(n){var i=c[n];n===r?i[t](e):i.pause()})},i.prototype._initMediaElement=function(){i._html5Audio||(i._html5Audio=s.createAudioElement(),i._html5Audio.id=this.getSettings().audioObjectID+"_Single",u.prototype._toggleEventListeners.call(i,!0)),this._toggleEventListeners(!0),this._html5Audio=i._html5Audio,this._logger.log("initialized player for use with: "+this.getDescriptor().src)},i.prototype._toggleEventListeners=function(t){t?c[this.getId()]=this:delete c[this.getId()]},i.prototype.play=function(t){this._logger.log("singleton play at: "+t),(0===this._html5Audio.readyState||this.getDescriptor().src!==this._html5Audio.src)&&(this._logger.log("setting up audio element for use with: "+this.getDescriptor().src),r=this.getId(),this._isInOneOfStates(h.PAUSED)&&(this._logger.log("state was paused"),t=this._currentPosition||0),this._toggleEventListeners(!0),this._html5Audio.preload="auto",this._html5Audio.type=this.getDescriptor().mimeType,this._html5Audio.src=this.getDescriptor().src,this._html5Audio.load()),u.prototype.play.call(this,t)},i.prototype.resume=function(){return this._isInOneOfStates(h.ERROR,h.DEAD)?void 0:r!==this.getId()?void this.play(this._currentPosition):void u.prototype.resume.apply(this,arguments)},i.prototype.pause=function(){this._isInOneOfStates(h.ERROR,h.DEAD)||(this._logger.log("singleton pause"),r===this.getId()?u.prototype.pause.apply(this,arguments):(this._toggleEventListeners(!1),this._isInOneOfStates(h.PAUSED)||this.updateState(h.PAUSED),this._resetPositionInterval(!1)))},i.prototype.seek=function(t){return r!==this.getId()?(this._currentPosition=t,void this.trigger(a.POSITION_CHANGE,this._currentPosition,this._loadedPosition,this._duration,this)):void u.prototype.seek.apply(this,arguments)}},function(t,e,n){function i(t,e){o.call(this,t,e,s,"HLSSingleAudioPlayer")}var r=n(1),o=n(45),s=n(48);t.exports=i,r(i.prototype,s.prototype,o.prototype)},function(t,e,n){function i(t,e){return u.prototype.constructor.call(this,"HLSMSEPlayer",t,e,w()),o(this,["_onPositionChange","_onPlaylistLoaded","_onPlaylistFailed","_onSegmentLoaded","_onSegmentProgress","_onSegmentFailed","_onHtml5MediaEvent","_onLoadedData","_onLoadedMetadata","_onMediaSourceAppend","_onMediaSourceReady","_onMediaSourceDestroy","_onMediaSourceError"]),this._streamUrlProvider=this.getSettings().streamUrlProvider||null,this._minPreBufferLengthForPlayback=5e3,this._maxBufferLength=3e4,this._streamUrlRetryTimer=null,this._streamUrlTimesFailed=0,this._playlistRetryTimer=null,this._playlistTimesFailed=0,this._playlistRefreshInProgress=!1,this._isPlaylistLoaded=!1,this._loadOnInit=!1,this._schedulingSegmentIndex=-1,this._segmentsDownloading=[],this._nextSchedulingTimeout=null,this._mimeType=T(),this._mimeType?(this._mseToolkit=new l(this._logger,this._mimeType),this._mseToolkit.on(l.Events.SEGMENT_APPENDED,this._onMediaSourceAppend),this._mseToolkit.on(l.Events.SOURCE_READY,this._onMediaSourceReady),this._mseToolkit.on(l.Events.SOURCE_DESTROY,this._onMediaSourceDestroy),this._mseToolkit.on(l.Events.SOURCE_ERROR,this._onMediaSourceError),this._hlsToolkit=new c(this._logger,this.getDescriptor().src),this._hlsToolkit.on(c.Events.SEGMENT_LOADED,this._onSegmentLoaded),this._hlsToolkit.on(c.Events.SEGMENT_PROGRESS,this._onSegmentProgress),this._hlsToolkit.on(c.Events.SEGMENT_FAILED,this._onSegmentFailed),this._hlsToolkit.on(c.Events.PLAYLIST_LOADED,this._onPlaylistLoaded),this._hlsToolkit.on(c.Events.PLAYLIST_FAILED,this._onPlaylistFailed),this._hlsToolkit.on(c.Events.PLAYLIST_PARSE_ERROR,this._onPlaylistFailed),this._html5Audio=this._mseToolkit.media(),void this._toggleEventListeners(!0)):void this._error(a.MSE_NOT_SUPPORTED)}var r=n(1),o=n(47).bindAll,s=n(39),a=n(43),u=n(35),h=n(46),c=n(51),l=n(66),f=n(67),d=n(38),p=n(42),g=n(128),_=n(129),m=n(16),y=200,v=500,E=3,S=1e4,A=function(t){var e=t/E,n=v*(Math.pow(Math.E,e)/Math.E);return n+=Math.random()*y,n>S&&(n=S),n},w=function(){var t={};return t[p.names.PROTOCOLS]=[g.HLS],t[p.names.MIMETYPES]=[_.HLS,_.M3U8,_.MP3],t[p.names.NEEDS_URL_REFRESH]=!1,t},T=function(){return m.isMSESupportMPEG()&&!m.isNativeHlsSupported()?"audio/mpeg":m.isMSESupportMP4()?"audio/mp4":null};t.exports=i,r(i.prototype,u.prototype),i.prototype._onLoadedData=function(){this._logger.log("loadeddata event handler"),this.trigger(s.DATA)},i.prototype._onLoadedMetadata=function(){this._logger.log("loadedmetadata event handler")},i.prototype._mediasHasProgressed=function(){var t=!1,e=Date.now();if(this._lastMediaClockCheck){var n=e-this._lastMediaClockCheck,i=this._currentPosition-this._lastMediaClockValue;if(.1*n>i){if(0===i&&50>n)return!0;t=!0}}return this._lastMediaClockValue=this._currentPosition,this._lastMediaClockCheck=e,!t},i.prototype._onPositionChange=function(){return this._html5Audio&&this.getState()!==d.SEEKING?(this._currentPosition=1e3*this._html5Audio.currentTime,this.getState()!==d.PLAYING||this._mediasHasProgressed()?(this.getState()!==d.PLAYING&&this._mediasHasProgressed()&&this.updateState(d.PLAYING),this._triggerPositionEvent(),this._currentPosition>=this._duration?void this.updateState(d.ENDED):void 0):(this._logger.log("media clock check failed, playhead is not advancing anymore"),void this.updateState(d.LOADING))):void 0},i.prototype._onMediaSourceReady=function(){this.getDescriptor().duration&&(this._setDuration(this.getDescriptor().duration),this._logger.log("duration set from descriptor to "+this._duration)),this.updateState(d.IDLE),this._loadOnInit&&this._loadInitialPlaylist()},i.prototype._onMediaSourceDestroy=function(){this.kill()},i.prototype._onMediaSourceError=function(t){this._logger.log("MediaSource API error: "+t.message),this._error(a.MSE_BAD_OBJECT_STATE),this.kill()},i.prototype._onMediaSourceAppend=function(t){this._logger.log("segment appended: "+t.index),this.trigger(s.DATA,t),this._loadedPosition=t.endPosition,this._playRequested&&(this._logger.log("triggering playback after appending enough segments"),this._html5Audio.play(this._currentPosition))},i.prototype._onSegmentProgress=function(t){var e=Math.round(t.loaded/t.total*100);this._logger.log("segment "+t.index+" loaded "+t.loaded+" of "+t.total+" bytes ("+e+"%)"),this._loadedPosition=t.endPosition-t.duration*(t.loaded/t.total)},i.prototype._onSegmentLoaded=function(t){return this._mseToolkit.sourceIsReady()?void this._appendSegments():void this._logger.log("we have been disposed while loading a segment, noop")},i.prototype._onSegmentFailed=function(t){switch(this._logger.log("segment loading failed handler: "+t.status),t.status){case c.Status.NOT_FOUND:case c.Status.FORBIDDEN:this._cancelNextScheduling(),this._cancelAllInFlightRequests(),this._refreshPlaylist();break;case c.Status.TIMEOUT:this.trigger(s.NETWORK_TIMEOUT);case c.Status.SERVER_ERROR:if(t.aborted){this._logger.log("aborted segment has been prevented from being retried");break}t.scheduleRetry(A(t.timesFailed),this._hlsToolkit.loadSegment,this._hlsToolkit);break;case c.Status.FAILED:this._logger.log("WARNING: segment loading failed for unknown reason!");break;default:throw new Error("Invalid status on failed segment: "+t.status)}},i.prototype._onPlaylistLoaded=function(){return this._logger.log("playlist loaded handler"),this._mseToolkit.sourceIsReady()?(this._playlistRefreshInProgress&&(this._cancelNextScheduling(),this._runScheduling()),this._playlistRefreshInProgress=!1,this._playlistTimesFailed=0,this._isPlaylistLoaded=!0,this._inspectEncryptionData(),this._setDuration(this._hlsToolkit.getDuration()),this._logger.log("duration set from playlist info to "+this._duration),void this.trigger(s.METADATA)):void this._logger.log("we have been disposed while loading the playlist, noop")},i.prototype._onPlaylistFailed=function(t){return this._logger.log("playlist loading failed handler. HTTP status code is "+t),this._mseToolkit.sourceIsReady()?(this._logger.log("Playlist loading failed  "+this._playlistTimesFailed+" times before"),this._playlistTimesFailed++,this._playlistRetryTimer=window.setTimeout(function(){this.hasStreamUrlProvider()?this._refreshPlaylist():this._hlsToolkit.updatePlaylist()}.bind(this),A(this._playlistTimesFailed)),void(0===t&&this.trigger(s.NETWORK_TIMEOUT))):void this._logger.log("we have been disposed while loading the playlist, noop")},i.prototype.afterStateChange=function(t,e){switch(e){case d.PLAYING:this._runScheduling();break;case d.PAUSED:this._cancelNextScheduling()}},i.prototype._onHtml5MediaEvent=function(t){switch(this._logger.log('HTML5 media event "'+t.type+'"'),this._waitingToPause=!1,t.type){case"playing":this._playRequested=!1,this._triggerPositionEvent(),this._resetPositionTimer(!0),this.updateState(d.PLAYING);break;case"pause":this._triggerPositionEvent(),this._resetPositionTimer(!1),this.updateState(d.PAUSED);break;case"ended":this._currentPosition=this._loadedPosition=this._duration,this._triggerPositionEvent(),this._resetPositionTimer(!1),this.updateState(d.ENDED);break;case"waiting":if(this.getState()===d.SEEKING)break;this.updateState(d.LOADING);break;case"seeking":this._triggerPositionEvent(),this.updateState(d.SEEKING);break;case"seeked":this._html5Audio.paused?this.updateState(d.PAUSED):this.updateState(d.PLAYING),this._onPositionChange();break;case"error":this._error(this._html5AudioErrorCodeToErrorId(),!0)}},i.prototype._toggleEventListeners=function(t){if(this._html5Audio){var e=t?"addEventListener":"removeEventListener";h.MediaAPIEvents.forEach(function(t){switch(t){case"loadeddata":this._html5Audio[e]("loadeddata",this._onLoadedData);break;case"loadedmetadata":this._html5Audio[e]("loadedmetadata",this._onLoadedMetadata);break;case"timeupdate":default:this._html5Audio[e](t,this._onHtml5MediaEvent)}},this)}},i.prototype._loadInitialPlaylist=function(){this.updateState(d.LOADING),this._hlsToolkit.updatePlaylist()},i.prototype._refreshPlaylist=function(){this.hasStreamUrlProvider()&&(this._playlistRefreshfInProgress||(this._playlistRefreshInProgress=!0,this._streamUrlProvider().done(function(t){this._logger.log("got new M3u8 URL: "+t),this._streamUrlTimesFailed=0,this._hlsToolkit.setUri(t),this._hlsToolkit.updatePlaylist()}.bind(this)).fail(function(){this._logger.log("failed to retrieve stream URL :("),this._streamUrlRetryTimer=window.setTimeout(function(){this._playlistRefreshInProgress=!1,this._refreshPlaylist()}.bind(this),A(++this._streamUrlTimesFailed))}.bind(this))))},i.prototype._setDuration=function(t){this._duration=t;try{this._mseToolkit.duration(this._duration)}catch(e){this._onMediaSourceError(e)}},i.prototype._resetPositionTimer=function(t){window.clearInterval(this._positionUpdateTimer),t&&(this._positionUpdateTimer=window.setInterval(this._onPositionChange,this.getSettings().updateInterval))},i.prototype._triggerPositionEvent=function(){this.trigger(s.POSITION_CHANGE,this._currentPosition,this._loadedPosition,this._duration,this)},i.prototype._initTransmuxerOnce=function(t,e){if(!this._transmuxer){var n=this._mimeType!==t.mimeType?f.Configs.MP3_TO_FMP4:f.Configs.VOID;this._transmuxer=new f(n),this._transmuxer.on("segment",function(t){this._logger.log("transmuxed data ready, "+t.data.length+" bytes for segment "+t.index),e(t)}.bind(this))}},i.prototype._transmuxSegment=function(t,e){this._logger.log("transmuxing segment "+t.index),this._initTransmuxerOnce(t,e),this._transmuxer.process(t)},i.prototype._appendSegments=function(){var t=!0;this._segmentsDownloading.slice().forEach(function(e){e.isComplete()&&t?(this._decryptSegment(e),this._transmuxSegment(e,function(t){this._mseToolkit.append(t)}.bind(this)),this._segmentsDownloading.shift()):t=!1},this)},i.prototype._cancelNextScheduling=function(){this._logger.log("cancelling next scheduling"),window.clearTimeout(this._nextSchedulingTimeout),this._nextSchedulingTimeout=null},i.prototype._getBufferUntilTime=function(){return this._currentPosition+this._maxBufferLength},i.prototype._getCurrentSegment=function(){return this._schedulingSegmentIndex>0?this._hlsToolkit.getSegment(this._schedulingSegmentIndex):this._hlsToolkit.getSegmentForTime(this._currentPosition)},i.prototype._runScheduling=function(){function t(){var e=!1,n=this._getBufferUntilTime(),i=this._getCurrentSegment(),r=i?i.duration:Math.Infinity;if(this._logger.log("scheduling next requests, current buffer-until time: "+n+" ms"),!i)return void this._logger.log("no segment to schedule, closing loop");for(this._logger.log("current segment index: "+i.index);i.endPosition<=n;){if(this._logger.log("scheduling loop at "+this._currentPosition+" ms, current segment "+i.index),this._requestSegment(i),i.isLast){e=!0,this._logger.log("end of playlist reached");break}this._schedulingSegmentIndex=i.index+1,i=this._hlsToolkit.getSegment(this._schedulingSegmentIndex)}this._isInOneOfStates(d.DEAD,d.PAUSED)||e?(this._logger.log("not re-scheduling"),this._nextSchedulingTimeout=null):(this._logger.log("timing next check for more data in "+r+" ms"),this._nextSchedulingTimeout=window.setTimeout(t.bind(this),r))}this._nextSchedulingTimeout||t.call(this)},i.prototype._cancelAllInFlightRequests=function(){this._schedulingSegmentIndex=-1,this._segmentsDownloading.forEach(function(t){t.isComplete()||t.cancel()}),this._segmentsDownloading=[]},i.prototype._requestSegment=function(t){return this._segmentsDownloading.push(t),t.isComplete()?(this._logger.log("requested data is already loaded from segment "+t.index),void this._onSegmentLoaded(t)):t.hasBeenRequested()||t.hasFailed()?void this._logger.log("segment already in flight or failed (will retry): "+t.timesFailed+" times"):void this._hlsToolkit.loadSegment(t)},i.prototype._decryptSegment=function(t){this._hlsToolkit.isAES128Encrypted()&&this._hlsToolkit.decryptSegmentAES128(t)},i.prototype._inspectEncryptionData=function(){this._hlsToolkit.isAES128Encrypted()&&(this._logger.log("got key of byte length "+this._hlsToolkit.getEncryptionKey().byteLength),this._hlsToolkit.getEncryptionIv()?this._logger.log("got IV of byte length "+this._hlsToolkit.getEncryptionIv().byteLength):this._logger.log("no IV found in header, will use per-segment-index IV"))},i.prototype._html5AudioErrorCodeToErrorId=function(){return{1:a.HTML5_AUDIO_ABORTED,2:a.HTML5_AUDIO_NETWORK,3:a.HTML5_AUDIO_DECODE,4:a.HTML5_AUDIO_SRC_NOT_SUPPORTED}[this._html5Audio.error.code]},i.prototype._error=function(t,e){this._errorID=t,this._errorMessage=this._getErrorMessage(this._errorID),e&&this._html5Audio.error&&(this._errorMessage+=" (native message: "+this._html5Audio.error.message+")"),this._logger.log(this._errorID+" "+this._errorMessage),this.updateState(d.ERROR),this._toggleEventListeners(!1)},i.prototype._getErrorMessage=function(t){var e={};return e[a.MSE_NOT_SUPPORTED]="The browser does not support MediaSource API",e[a.MSE_BAD_OBJECT_STATE]="MediaSource API has thrown an exception",e[t]?"Error: "+t+" ("+e[t]+")":"Error: "+t},i.prototype.setVolume=function(t){this._html5Audio&&(this._html5Audio.volume=t)},i.prototype.getVolume=function(){return this._html5Audio?this._html5Audio.volume:1},i.prototype.setMute=function(t){this._html5Audio&&(this._html5Audio.muted=t)},i.prototype.getMute=function(){return this._html5Audio?this._html5Audio.muted:!1},i.prototype.getErrorID=function(){return this._errorID},i.prototype.play=function(t){return this._isInOneOfStates(d.ERROR,d.DEAD)?void this._logger.log("play called but state is ERROR or DEAD"):this._isInOneOfStates(d.IDLE,d.INITIALIZE)?(t=t||0,this._logger.log("play from "+t),this._playRequested=!0,this.seek(t),this.getState()===d.INITIALIZE?void(this._loadOnInit=!0):void this._loadInitialPlaylist()):void this.resume()},i.prototype.pause=function(){this._html5Audio&&(this._playRequested=!1,this._html5Audio.pause())},i.prototype.seek=function(t){if(!this._isInOneOfStates(d.ERROR,d.DEAD)){if(!this._isPlaylistLoaded)return void this.once(s.METADATA,function(){this.seek(t)}.bind(this));if(t>this._duration)return void this._logger.log("can not seek to position over duration");this._logger.log("seek to "+t+" ms"),this.updateState(d.SEEKING),this._lastMediaClockCheck=null,this._currentPosition=t;try{this._html5Audio.currentTime=t/1e3}catch(e){this._logger.log("error seeking: "+e.message)}this._cancelAllInFlightRequests(),this._cancelNextScheduling(),this._runScheduling()}},i.prototype.resume=function(){this._html5Audio&&(this._logger.log("resume from "+this._currentPosition),this._html5Audio.play(1e3*this._currentPosition))},i.prototype.kill=function(){this.getState()!==d.DEAD&&(this._logger.log("kill"),this._resetPositionTimer(!1),this._cancelNextScheduling(),this._cancelAllInFlightRequests(),window.clearTimeout(this._playlistRetryTimer),window.clearTimeout(this._streamUrlRetryTimer),this._playRequested=!1,this._toggleEventListeners(!1),this._html5Audio.pause(),this.updateState(d.DEAD))},i.prototype.getErrorMessage=function(){return this._errorMessage},i.prototype.hasStreamUrlProvider=function(){return!!this._streamUrlProvider}},function(t,e,n){var i,r=n(1),o=n(52),s=n(58),a=null,u=n(36),h={NEW:"new",REQUESTED:"requested",COMPLETE:"complete",TIMEOUT:"timeout",FORBIDDEN:"forbidden",NOT_FOUND:"not-found",SERVER_ERROR:"server-error",FAILED:"failed"},c={FIRST:"#EXTM3U",PLAYLIST:"#EXT-X-STREAM-INF:",SEGMENT:"#EXTINF:",END_TAG:"#EXT-X-ENDLIST",ENCRYPTION:"#EXT-X-KEY:"};t.exports=i=function(t,e){this._logger=t,this._duration=0,this.setUri(e)},i.Events={PLAYLIST_LOADED:"playlist-loaded",PLAYLIST_PARSE_ERROR:"playlist-parse-error",PLAYLIST_FAILED:"playlist-failed",SEGMENT_LOADED:"segment-loaded",SEGMENT_PROGRESS:"segment-progress",SEGMENT_FAILED:"segment-failed",SEGMENT_CANCELED:"segment-canceled"},i.Status=h,r(i.prototype,u),i.Segment=function(t,e,n,i,o){r(this,{toolkit:t,uri:e,startPosition:n,endPosition:n+i,duration:i,index:o,data:null,status:h.NEW,isLast:!1,timesFailed:0,loaded:0,total:-1,aborted:!1,xhr:null,mimeType:"audio/mpeg"}),this._logger=t._logger},i.Segment.prototype.containsTime=function(t){return t>=this.startPosition&&t<=this.endPosition},i.Segment.prototype.isComplete=function(){return this.status===h.COMPLETE},i.Segment.prototype.hasFailed=function(){return this.status===h.TIMEOUT||this.status===h.FORBIDDEN||this.status===h.NOT_FOUND||this.status===h.SERVER_ERROR||this.status===h.FAILED},i.Segment.prototype.isNew=function(){return this.status===h.NEW},i.Segment.prototype.hasBeenRequested=function(){return this.status===h.REQUESTED},i.Segment.prototype.scheduleRetry=function(t,e,n){var i=this;this._retryTimer=window.setTimeout(function(){e.call(n,i)},t)},i.Segment.prototype.cancel=function(){this._logger.log("segment cancelled, clearing timeout: "+this.index),window.clearTimeout(this._retryTimer),this.xhr&&(this._logger.log("will abort & reset segment: "+this.index),this.status=h.NEW,this.aborted=!0,this.data=null,this.timesFailed=0,this.xhr.abort(),this.xhr=null,this.toolkit.trigger(i.Events.SEGMENT_CANCELED,this));
},i.prototype.setUri=function(t){var e=this._uri=t;e.indexOf("?")>-1&&(e=e.substr(0,e.indexOf("?"))),this._baseURI=e.substr(0,e.lastIndexOf("/")+1)},i.prototype.updatePlaylist=function(){var t=!1,e=new XMLHttpRequest;e.open("GET",this._uri,!0),e.responseType="text",this._logger.log("downloading playlist");var n=function(n){t||(t=!0,this.trigger(i.Events.PLAYLIST_FAILED,e.status))}.bind(this);e.onload=function(t){return 200!==e.status?void n():(this._segments=[],this._duration=0,this._parsePlaylist(e.responseText)?(this.getLastSegment().isLast=!0,this._logger.log("playlist download complete"),void this._retrieveEncryptionKey(function(){this.trigger(i.Events.PLAYLIST_LOADED)})):(this._logger.log("error parsing playlist"),void this.trigger(i.Events.PLAYLIST_PARSE_ERROR)))}.bind(this),e.onerror=function(t){n(t)}.bind(this),e.send()},i.prototype._parsePlaylist=function(t){for(var e,n,r,o=t.split("\n"),s=!1,a=0,u=0;a<o.length;)e=o[a++],0===e.indexOf(c.SEGMENT)?(r=1e3*Number(e.substr(8,e.indexOf(",")-8)),n=this._createSegmentURL(o[a]),this._addSegment(new i.Segment(this,n,this._duration,r,u++)),a++):0===e.indexOf(c.ENCRYPTION)?this._parsePlaylistEncryptionHeader(e):0===e.indexOf(c.END_TAG)&&(s=!0);return!(0===this.getNumSegments()||!s)},i.prototype._addSegment=function(t){this._segments.push(t),this._duration+=t.duration},i.prototype._parsePlaylistEncryptionHeader=function(t){var e,n,i,r=t.substr(c.ENCRYPTION.length).split(",");if(s(r,function(t){t.indexOf("METHOD")>=0?n=t.split("=")[1]:t.indexOf("URI")>=0?e=t.split("=")[1]:t.indexOf("IV")>=0&&(i=t.split("=")[1])}),!(n&&e&&n.length&&e.length))throw new Error("Failed to parse M3U8 encryption header");n=n.trim(),e=e.trim().replace(/"/g,""),this._encryptionMethod=n,this._encryptionKeyUri=e,i&&i.length?(this._encryptionIvHexString=i.trim(),this._parseEncryptionIvHexString()):this._encryptionIv=null},i.prototype._parseEncryptionIvHexString=function(){var t,e=this._encryptionIvHexString.replace("0x",""),n=new Uint16Array(8),i=0;if(e.length%4!==0)throw new Error("Failed to parse M3U8 encryption IV (length is not multiple of 4)");for(;i<e.length;i+=4){if(t=parseInt(e.substr(i,4),16),isNaN(t))throw new Error("Failed to parse hex number in IV string");n[i/4]=t}this._encryptionIv=n},i.prototype._encryptionIvForSegment=function(t){var e=new DataView(new ArrayBuffer(16));return e.setUint32(0,t.index,!0),e.buffer},i.prototype._retrieveEncryptionKey=function(t){if(t){if(!this._encryptionKeyUri)return void t.call(this);var e=this._encryptionKeyUri,n=new XMLHttpRequest;n.open("GET",e,!0),n.responseType="arraybuffer",n.onload=o(function(i){200===n.status?this._encryptionKey=new Uint8Array(n.response):this._logger.log("Failed to retrieve encryption key from "+e+", returned status "+n.status),t.call(this)},this),n.send(),this._logger.log("Downloading encryption key from "+e)}},i.prototype._removeEncryptionPaddingBytes=function(t){var e=t.data[t.data.byteLength-1];e?(this._logger.log("Detected PKCS7 padding length of "+e+" bytes, slicing segment."),t.data=t.data.subarray(0,t.data.byteLength-e)):this._logger.log("No padding detected (last byte is zero)")},i.prototype.decryptSegmentAES128=function(t){if(this._logger.log("Decrypting AES-128 cyphered segment ..."),!a)throw new Error("AES decryption not built-in");var e=a.cipher.createDecipher("AES-CBC",a.util.createBuffer(this._encryptionKey)),n=0,i=t.data.byteLength,r=this._encryptionIv||this._encryptionIvForSegment(t);for(this._logger.log("Using IV ->"),e.start({iv:a.util.createBuffer(r)}),e.update(a.util.createBuffer(t.data)),e.finish(),t.data=new Uint8Array(i);i>n;n++)t.data[n]=e.output.getByte();this._removeEncryptionPaddingBytes(t)},i.prototype.isAES128Encrypted=function(){return"AES-128"===this._encryptionMethod},i.prototype.getEncryptionKeyUri=function(){return this._encryptionKeyUri},i.prototype.getEncryptionIv=function(){return this._encryptionIv},i.prototype.getEncryptionKey=function(){return this._encryptionKey},i.prototype._createSegmentURL=function(t){return"http://"===t.substr(0,7)||"https://"===t.substr(0,8)||"/"===t.substr(0,1)?t:this._baseURI+t},i.prototype._handleLoadSegmentFailure=function(t,e,n){t.aborted||(this._logger.log("segment aborted: "+t.aborted),this._logger.log("segment loading failure: HTTP response status: "+e.status),0===e.status?t.status=h.TIMEOUT:403===e.status?t.status=h.FORBIDDEN:404===e.status?t.status=h.NOT_FOUND:e.status>=500?t.status=h.SERVER_ERROR:t.status=h.FAILED,t.timesFailed++,this.trigger(i.Events.SEGMENT_FAILED,t))},i.prototype.loadSegment=function(t){var e=!1,n=new XMLHttpRequest,r=t.uri,o=function(i){e||(e=!0,this._handleLoadSegmentFailure(t,n,i))}.bind(this);(t.hasBeenRequested()||t.isComplete())&&this._logger.log("segment cant be loaded, requested: ",!!t.hasBeenRequested()," complete: ",t.isComplete()),n.open("GET",r,!0),n.responseType="arraybuffer",n.onload=function(){if(!t.aborted){if(200!==n.status)return void o();this._logger.log("download of segment "+t.index+" complete"),t.status=h.COMPLETE,t.data=new Uint8Array(n.response),t.downloadTime=Date.now()-t.downloadStartTime,this.trigger(i.Events.SEGMENT_LOADED,t)}}.bind(this),n.onprogress=function(e){t.aborted||e.loaded&&e.total&&(t.loaded=e.loaded,t.total=e.total,this.trigger(i.Events.SEGMENT_PROGRESS,t))}.bind(this),n.onerror=function(t){o(t)}.bind(this),this._logger.log("requesting segment "+t.index+" from "+r),t.xhr=n,t.aborted=!1,t.downloadStartTime=Date.now(),t.status=h.REQUESTED,n.send()},i.prototype.getSegment=function(t){return this._segments&&this._segments[t]?this._segments[t]:null},i.prototype.getSegmentIndexForTime=function(t){var e,n;if(t>this._duration||0>t||!this._segments||0===this._segments.length)return-1;for(e=Math.floor(this._segments.length*(t/this._duration)),n=this._segments[e];!(n.startPosition<=t&&n.startPosition+n.duration>t);)n.startPosition+n.duration>=t?e--:e++,n=this._segments[e];return e},i.prototype.getSegmentForTime=function(t){var e=this.getSegmentIndexForTime(t);return e>=0?this._segments[e]:null},i.prototype.getDuration=function(){return this._duration},i.prototype.getNumSegments=function(){return this._segments.length},i.prototype.getLastSegment=function(){return this._segments.length?this._segments[this._segments.length-1]:null}},function(t,e,n){var i=n(53),r=n(56),o=n(57),s=1,a=32,u=o(function(t,e,n){var o=s;if(n.length){var h=r(n,u.placeholder);o|=a}return i(t,o,e,n,h)});u.placeholder={},t.exports=u},function(t,e,n){(function(e){function i(t,e,n){for(var i=n.length,r=-1,o=P(t.length-i,0),s=-1,a=e.length,u=Array(a+o);++s<a;)u[s]=e[s];for(;++r<i;)u[n[r]]=t[r];for(;o--;)u[s++]=t[r++];return u}function r(t,e,n){for(var i=-1,r=n.length,o=-1,s=P(t.length-r,0),a=-1,u=e.length,h=Array(s+u);++o<s;)h[o]=t[o];for(var c=o;++a<u;)h[c+a]=e[a];for(;++i<r;)h[c+n[i]]=t[o++];return h}function o(t,n){function i(){var o=this&&this!==e&&this instanceof i?r:t;return o.apply(n,arguments)}var r=s(t);return i}function s(t){return function(){var e=arguments;switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3]);case 5:return new t(e[0],e[1],e[2],e[3],e[4]);case 6:return new t(e[0],e[1],e[2],e[3],e[4],e[5]);case 7:return new t(e[0],e[1],e[2],e[3],e[4],e[5],e[6])}var n=p(t.prototype),i=t.apply(n,e);return f(i)?i:n}}function a(t,n,o,u,h,c,f,p,T,b){function I(){for(var y=arguments.length,v=y,E=Array(y);v--;)E[v]=arguments[v];if(u&&(E=i(E,u,h)),c&&(E=r(E,c,f)),D||k){var w=I.placeholder,x=g(E,w);if(y-=x.length,b>y){var C=p?d(p):void 0,F=P(b-y,0),U=D?x:void 0,B=D?void 0:x,H=D?E:void 0,j=D?void 0:E;n|=D?S:A,n&=~(D?A:S),M||(n&=~(_|m));var G=a(t,n,o,H,U,j,B,C,T,F);return G.placeholder=w,G}}var Y=O?o:this,V=R?Y[t]:t;return p&&(E=l(E,p)),L&&T<E.length&&(E.length=T),this&&this!==e&&this instanceof I&&(V=N||s(t)),V.apply(Y,E)}var L=n&w,O=n&_,R=n&m,D=n&v,M=n&y,k=n&E,N=R?void 0:s(t);return I}function u(t,n,i,r){function o(){for(var n=-1,s=arguments.length,h=-1,c=r.length,l=Array(c+s);++h<c;)l[h]=r[h];for(;s--;)l[h++]=arguments[++n];var f=this&&this!==e&&this instanceof o?u:t;return f.apply(a?i:this,l)}var a=n&_,u=s(t);return o}function h(t,e,n,i,r,s,h,c){var l=e&m;if(!l&&"function"!=typeof t)throw new TypeError(T);var f=i?i.length:0;if(f||(e&=~(S|A),i=r=void 0),f-=r?r.length:0,e&A){var d=i,p=r;i=r=void 0}var g=[t,e,n,i,r,d,p,s,h,c];if(g[9]=null==c?l?0:t.length:P(c-f,0)||0,e==_)var y=o(g[0],g[2]);else y=e!=S&&e!=(_|S)||g[4].length?a.apply(void 0,g):u.apply(void 0,g);return y}function c(t,e){return t="number"==typeof t||b.test(t)?+t:-1,e=null==e?L:e,t>-1&&t%1==0&&e>t}function l(t,e){for(var n=t.length,i=I(e.length,n),r=d(t);i--;){var o=e[i];t[i]=c(o,n)?r[o]:void 0}return t}function f(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}var d=n(54),p=n(55),g=n(56),_=1,m=2,y=4,v=8,E=16,S=32,A=64,w=128,T="Expected a function",b=/^\d+$/,P=Math.max,I=Math.min,L=9007199254740991;t.exports=h}).call(e,function(){return this}())},function(t,e){function n(t,e){var n=-1,i=t.length;for(e||(e=Array(i));++n<i;)e[n]=t[n];return e}t.exports=n},function(t,e){function n(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}var i=function(){function t(){}return function(e){if(n(e)){t.prototype=e;var i=new t;t.prototype=void 0}return i||{}}}();t.exports=i},function(t,e){function n(t,e){for(var n=-1,r=t.length,o=-1,s=[];++n<r;)t[n]===e&&(t[n]=i,s[++o]=n);return s}var i="__lodash_placeholder__";t.exports=n},11,function(t,e,n){function i(t,e){return function(n,i,r){return"function"==typeof i&&void 0===r&&a(n)?t(n,i):e(n,s(i,r,3))}}var r=n(59),o=n(60),s=n(65),a=n(64),u=i(r,o);t.exports=u},function(t,e){function n(t,e){for(var n=-1,i=t.length;++n<i&&e(t[n],n,t)!==!1;);return t}t.exports=n},[134,61],[132,62,63,64],5,6,7,9,function(t,e,n){var i,r=n(36),o=n(16),s=n(47).bindAll,a=n(1);t.exports=i=function(t,e){s(this,["_onMSEInit","_onMSEDispose","_onSourceBufferUpdate"]),this.mimeType=e,this._logger=t,this._isBufferPrepared=!1,this._sourceBufferPtsOffset=0,this._segmentsAwaitingAppendance=[],this._isNotReady=!0,this._sourceBuffer=null,this._mediaSource=new MediaSource,this._mediaSource.addEventListener("sourceopen",this._onMSEInit,!1),this._mediaSource.addEventListener("sourceclose",this._onMSEDispose,!1),this._mediaElem=o.createAudioElement(),this._mediaElem.src=window.URL.createObjectURL(this._mediaSource)},i.Events={SOURCE_READY:"source-ready",SOURCE_DESTROYED:"source-destroy",SOURCE_ERROR:"source-error",SEGMENT_APPENDED:"segment-appended"},a(i.prototype,r),a(i.prototype,{_onMSEInit:function(){this._logger.log("source open handler"),this._isNotReady=!1,this._mediaSource.removeEventListener("sourceopen",this._onMSEInit,!1),this._sourceBuffer=this._mediaSource.addSourceBuffer(this.mimeType),this._sourceBuffer.addEventListener("update",this._onSourceBufferUpdate),this.trigger(i.Events.SOURCE_READY)},_onMSEDispose:function(){this._isNotReady=!0,this._logger.log("source dispose handler"),this._mediaSource.removeEventListener("sourceclose",this._onMSEDispose,!1)},_appendNextSegment:function(t){try{if(this._sourceBuffer.updating)return this._logger.log("source buffer is busy updating already, enqueuing data for later appending"),void this._segmentsAwaitingAppendance.unshift(t);t.isLast&&this._logger.log("about to append last segment"),this._currentSegmentAppending=t,this._sourceBuffer.timestampOffset=t.startPosition/1e3,this._sourceBuffer.appendBuffer(t.data),this._logger.log("appending segment "+t.index)}catch(e){this._logger.log("error while appending to SourceBuffer: "+e.message+")"),this.trigger(i.Events.SOURCE_ERROR,e)}},_tryAppendEos:function(){this._logger.log("attempting to finalize stream");try{"open"!==this._mediaSource.readyState||this._sourceBuffer.updating?this._logger.log("couldn't call endOfStream because SourceBuffer is still updating, we'll call it once its done"):(this._mediaSource.endOfStream(),this._logger.log("called endOfStream"))}catch(t){this._logger.log("SourceBuffer endOfStream() call failed with error: "+t.message),this.trigger(i.Events.SOURCE_ERROR,t)}},_onSourceBufferUpdate:function(){(this._currentSegmentAppending||this._sourceBuffer.updating)&&(this._logger.log("done updating SourceBuffer with segment "+this._currentSegmentAppending.index),this.trigger(i.Events.SEGMENT_APPENDED,this._currentSegmentAppending),this._currentSegmentAppending.isLast&&(this._logger.log("was last segment, setting on EOS on SourceBuffer"),this._tryAppendEos()),this._segmentsAwaitingAppendance.length&&!this._sourceBuffer.updating&&this._appendNextSegment(this._segmentsAwaitingAppendance.pop()))},append:function(t){if(!this.sourceIsReady())throw new Error("MediaSource is not ready yet");this._appendNextSegment(t)},media:function(){return this._mediaElem},sourceIsReady:function(){return!this._isNotReady},duration:function(t){return this._mediaSource.duration=t/1e3,1e3*this._mediaSource.duration}})},function(t,e,n){var i,r=n(47).concatBuffersToUint8Array,o=n(1),s=n(36),a=n(68);t.exports=i=function(t){this.config=t,this.reset(),this.segments=[],this.pushedInitData=!1},o(i.prototype,s),i.prototype.process=function(t){switch(this.segments.push(t),this.config){case i.Configs.VOID:this.trigger("segment",t);break;case i.Configs.MP3_TO_FMP4:this.src.enqueue(new a.Unit.Transfer(t.data,"binary")),this.src.enqueue(a.Unit.Transfer.Flush());break;default:throw new Error("Config "+this.config+" not supported")}},i.prototype.dequeue=function(){return this.segments.shift()},i.prototype.reset=function(){switch(this.config){case i.Configs.VOID:break;case i.Configs.MP3_TO_FMP4:this.gotInitData=!1,this.src=new a.Unit.BasePushSrc,this.parser=new a.Units.MP3Parser,this.muxer=new a.Units.MP4Mux(a.Units.MP4Mux.Profiles.MP3_AUDIO_ONLY),this.sink=new a.Unit.BaseSink,this.sink._onData=function(){var t,e=this.sink.dequeue().data;return this.gotInitData?(t=this.dequeue(),t.mimeType="audio/mp4",this.gotInitData&&!this.pushedInitData?(t.data=r(this.initData,e),this.pushedInitData=!0):t.data=e,this.trigger("segment",t),void this.reset()):(this.gotInitData=!0,void(this.initData=e))}.bind(this),a.Unit.link(this.src,this.parser,this.muxer,this.sink);break;default:throw new Error("Config "+this.config+" not supported")}},i.Configs={VOID:"VOID",MP3_TO_FMP4:"MP3_TO_FMP4"}},function(t,e,n){var i,r=n(69),o=n(115),s=n(118),a=n(121),u=n(124),h=n(125);t.exports=i={Unit:r,Units:{File:h,MP4Mux:o,MP3Parser:s,MSESink:a,XHR:u}}},function(t,e,n){(function(e){var i,r,o,s,a,u,h,c,l,f,d=n(74),p=n(76),g=n(85),_=n(96),m=n(97);t.exports=i=function(){_.call(this),this.inputs||(this.inputs=[]),this.outputs||(this.outputs=[])},i.create=function(t){return p(i.prototype,t)},i.createBaseSrc=function(t){return p(u.prototype,t)},i.createBasePushSrc=function(t){return p(h.prototype,t)},i.createBaseSink=function(t){return p(c.prototype,t)},i.createBaseTransform=function(t){return p(a.prototype,t)},i.createBaseParser=function(t){return p(l.prototype,t)},i.link=function(t,e){if(arguments.length>2)return i.linkArray(arguments);for(var n=0;n<Math.min(t.numberOfOuts(),e.numberOfIns());n++)t.out(n).pipe(e["in"](n));return e},i.linkArray=function(t){var e,n,r;for(r=0;r<t.length;r++)e=t[r],t.length>r+1&&(n=t[r+1],i.link(e,n));return n};var y=i.Event={CHAIN:"chain",NEED_DATA:"need-data",FINISH:"finish",PIPE:"pipe",UNPIPE:"unpipe",ERROR:"error",END:"end",OPEN:"open",CLOSE:"close"};i.prototype=p(_.prototype,{constructor:i,"in":function(t){return this.inputs[t]},out:function(t){return this.outputs[t]},numberOfIns:function(){return this.inputs.length},numberOfOuts:function(){return this.outputs.length},add:function(t){return t instanceof r?this.addInput(t):t instanceof o&&this.addOutput(t),this},remove:function(t){t instanceof r?this.removeInput(t):t instanceof o&&this.removeOutput(t)},addInput:function(t){this._installEventForwarder(t,y.FINISH),this._installEventForwarder(t,y.OPEN),this._installEventForwarder(t,y.PIPE),this._installEventForwarder(t,y.UNPIPE),this._installEventForwarder(t,y.ERROR),this._installEventForwarder(t,y.CHAIN),this.inputs.push(t)},addOutput:function(t){this._installEventForwarder(t,y.END),this._installEventForwarder(t,y.OPEN),this._installEventForwarder(t,y.CLOSE),this._installEventForwarder(t,y.ERROR),this._installEventForwarder(t,y.NEED_DATA),this.outputs.push(t)},removeInput:function(t){removePut(this.inputs,t)},removeOutput:function(t){removePut(this.outputs,t)},removePut:function(t,e){t.slice().forEach(function(n,i){n==e&&t.splice(i,1)})},_installEventForwarder:function(t,e){t.on(e,function(n){this.emit(e,t,n)}.bind(this))}}),i.Transfer=s=function(t,n,i){n||(n=t instanceof e?"buffer":t instanceof String?"utf8":"object"),this.resolved=!1,this.data=t,this.encoding=n,this.doneCallback=i},s.prototype=p(Object.prototype,{constructor:s,resolve:function(){this.doneCallback&&!this.resolved&&(this.doneCallback(),this.resolved=!0)},setFlushing:function(t){return this.data.flush=t,this},setEmpty:function(t){return this.data.empty=t,this}}),s.Flush=function(){return new s({},"binary").setFlushing(!0).setEmpty(!0)},s.EOS=function(){return new s(null,"binary")},i.Input=r=function(t,e){m.Writable.prototype.constructor.call(this,{objectMode:!0,decodeStrings:!1})},r.prototype=p(m.Writable.prototype,{constructor:r,_write:function(t,e,n){d("_write: "+e),this.emit(i.Event.CHAIN,new s(t,e,n))}}),i.Output=o=function(t){m.Readable.prototype.constructor.call(this,{objectMode:!0}),this._dataRequested=0,this._shouldPushMore=!0},o.eos=function(t){t.push(null,"null")},o.prototype=p(m.Readable.prototype,{constructor:o,_read:function(t){this._dataRequested++,this.emit(y.NEED_DATA,this)},push:function(t,e){return this._dataRequested--,this._shouldPushMore=m.Readable.prototype.push.call(this,t,e),this._shouldPushMore},isPulling:function(){return this._dataRequested>0},eos:function(){m.Readable.prototype.push.call(this,null,"null")}}),i.BaseTransform=a=function(){i.prototype.constructor.apply(this,arguments),this.add(new r).add(new o),this.on(y.CHAIN,this._onChain.bind(this)),this.on(y.FINISH,this._onFinish.bind(this))},a.prototype=p(i.prototype,{constructor:a,_onChain:function(t,e){this._transform(e),this.out(0).push(e.data,e.encoding),e.resolve()},_onFinish:function(t){o.eos(this.out(0))},_transform:function(t){}}),i.BaseSrc=u=function(){i.prototype.constructor.apply(this,arguments),this.add(new o),this.on(y.NEED_DATA,this.squeeze.bind(this))},u.prototype=p(i.prototype,{constructor:u,squeeze:function(){d("squeeze");var t=this._source();t&&(this.out(0).push(t.data,t.encoding),t.resolve())},_source:function(){}}),i.BasePushSrc=h=function(){u.prototype.constructor.apply(this,arguments),this._bufferOut=[]},h.prototype=p(u.prototype,{constructor:h,_source:function(){return this._bufferOut.length?this._bufferOut.shift():null},enqueue:function(t){this._bufferOut.push(t),this.out(0).isPulling&&this.out(0).isPulling()&&this.squeeze()}}),i.BaseSink=c=function(){i.prototype.constructor.apply(this,arguments),this.add(new r),this.on(y.CHAIN,this._onChain.bind(this)),this._bufferIn=[]},c.prototype=p(i.prototype,{constructor:c,_onChain:function(t,e){d("BaseSink._onChain: "+e.encoding),this._bufferIn.push(e),this._onData(),e.resolve()},_onData:function(){},dequeue:function(){return this._bufferIn.length?this._bufferIn.shift():null}}),i.BaseParser=l=function(){h.prototype.constructor.apply(this,arguments),c.prototype.constructor.apply(this,arguments),this.on("finish",this._onFinish.bind(this))},g(l.prototype,i.prototype,_.prototype,u.prototype,h.prototype,c.prototype,{constructor:l,_onData:function(){this._parse(this.dequeue())},_onFinish:function(){d("BaseParser._onFinish"),o.eos(this.out(0))},_parse:function(t){}}),i.InputSelector=f=function(t){for(a.prototype.constructor.apply(this,arguments),t=(t||1)-1;t-- >0;)this.add(new r);this.selectedInputIndex=0},g(f.prototype,a.prototype,{constructor:f,_onChain:function(t,e){var n=this["in"](this.selectedInputIndex);return t!==n?void e.resolve():(this._transform(e),this.out(0).push(e.data,e.encoding),void e.resolve())},_onFinish:function(t){var e=this["in"](this.selectedInputIndex);t===e&&o.eos(this.out(0))}})}).call(e,n(70).Buffer)},function(t,e,n){(function(t,i){function r(){function t(){}try{var e=new Uint8Array(1);return e.foo=function(){return 42},e.constructor=t,42===e.foo()&&e.constructor===t&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(n){return!1}}function o(){return t.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function t(e){return this instanceof t?(this.length=0,this.parent=void 0,"number"==typeof e?s(this,e):"string"==typeof e?a(this,e,arguments.length>1?arguments[1]:"utf8"):u(this,e)):arguments.length>1?new t(e,arguments[1]):new t(e)}function s(e,n){if(e=g(e,0>n?0:0|_(n)),!t.TYPED_ARRAY_SUPPORT)for(var i=0;n>i;i++)e[i]=0;return e}function a(t,e,n){("string"!=typeof n||""===n)&&(n="utf8");var i=0|y(e,n);return t=g(t,i),t.write(e,n),t}function u(e,n){if(t.isBuffer(n))return h(e,n);if($(n))return c(e,n);if(null==n)throw new TypeError("must start with number, buffer, array or string");if("undefined"!=typeof ArrayBuffer){if(n.buffer instanceof ArrayBuffer)return l(e,n);if(n instanceof ArrayBuffer)return f(e,n)}return n.length?d(e,n):p(e,n)}function h(t,e){var n=0|_(e.length);return t=g(t,n),e.copy(t,0,0,n),t}function c(t,e){var n=0|_(e.length);t=g(t,n);for(var i=0;n>i;i+=1)t[i]=255&e[i];return t}function l(t,e){var n=0|_(e.length);t=g(t,n);for(var i=0;n>i;i+=1)t[i]=255&e[i];return t}function f(e,n){return t.TYPED_ARRAY_SUPPORT?(n.byteLength,e=t._augment(new Uint8Array(n))):e=l(e,new Uint8Array(n)),e}function d(t,e){var n=0|_(e.length);t=g(t,n);for(var i=0;n>i;i+=1)t[i]=255&e[i];return t}function p(t,e){var n,i=0;"Buffer"===e.type&&$(e.data)&&(n=e.data,i=0|_(n.length)),t=g(t,i);for(var r=0;i>r;r+=1)t[r]=255&n[r];return t}function g(e,n){t.TYPED_ARRAY_SUPPORT?(e=t._augment(new Uint8Array(n)),e.__proto__=t.prototype):(e.length=n,e._isBuffer=!0);var i=0!==n&&n<=t.poolSize>>>1;return i&&(e.parent=Z),e}function _(t){if(t>=o())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+o().toString(16)+" bytes");return 0|t}function m(e,n){if(!(this instanceof m))return new m(e,n);var i=new t(e,n);return delete i.parent,i}function y(t,e){"string"!=typeof t&&(t=""+t);var n=t.length;if(0===n)return 0;for(var i=!1;;)switch(e){case"ascii":case"binary":case"raw":case"raws":return n;case"utf8":case"utf-8":return Y(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return W(t).length;default:if(i)return Y(t).length;e=(""+e).toLowerCase(),i=!0}}function v(t,e,n){var i=!1;if(e=0|e,n=void 0===n||n===1/0?this.length:0|n,t||(t="utf8"),0>e&&(e=0),n>this.length&&(n=this.length),e>=n)return"";for(;;)switch(t){case"hex":return D(this,e,n);case"utf8":case"utf-8":return I(this,e,n);case"ascii":return O(this,e,n);case"binary":return R(this,e,n);case"base64":return P(this,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return M(this,e,n);default:if(i)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),i=!0}}function E(t,e,n,i){n=Number(n)||0;var r=t.length-n;i?(i=Number(i),i>r&&(i=r)):i=r;var o=e.length;if(o%2!==0)throw new Error("Invalid hex string");i>o/2&&(i=o/2);for(var s=0;i>s;s++){var a=parseInt(e.substr(2*s,2),16);if(isNaN(a))throw new Error("Invalid hex string");t[n+s]=a}return s}function S(t,e,n,i){return K(Y(e,t.length-n),t,n,i)}function A(t,e,n,i){return K(V(e),t,n,i)}function w(t,e,n,i){return A(t,e,n,i)}function T(t,e,n,i){return K(W(e),t,n,i)}function b(t,e,n,i){return K(z(e,t.length-n),t,n,i)}function P(t,e,n){return 0===e&&n===t.length?q.fromByteArray(t):q.fromByteArray(t.slice(e,n))}function I(t,e,n){n=Math.min(t.length,n);for(var i=[],r=e;n>r;){var o=t[r],s=null,a=o>239?4:o>223?3:o>191?2:1;if(n>=r+a){var u,h,c,l;switch(a){case 1:128>o&&(s=o);break;case 2:u=t[r+1],128===(192&u)&&(l=(31&o)<<6|63&u,l>127&&(s=l));break;case 3:u=t[r+1],h=t[r+2],128===(192&u)&&128===(192&h)&&(l=(15&o)<<12|(63&u)<<6|63&h,l>2047&&(55296>l||l>57343)&&(s=l));break;case 4:u=t[r+1],h=t[r+2],c=t[r+3],128===(192&u)&&128===(192&h)&&128===(192&c)&&(l=(15&o)<<18|(63&u)<<12|(63&h)<<6|63&c,l>65535&&1114112>l&&(s=l))}}null===s?(s=65533,a=1):s>65535&&(s-=65536,i.push(s>>>10&1023|55296),s=56320|1023&s),i.push(s),r+=a}return L(i)}function L(t){var e=t.length;if(Q>=e)return String.fromCharCode.apply(String,t);for(var n="",i=0;e>i;)n+=String.fromCharCode.apply(String,t.slice(i,i+=Q));return n}function O(t,e,n){var i="";n=Math.min(t.length,n);for(var r=e;n>r;r++)i+=String.fromCharCode(127&t[r]);return i}function R(t,e,n){var i="";n=Math.min(t.length,n);for(var r=e;n>r;r++)i+=String.fromCharCode(t[r]);return i}function D(t,e,n){var i=t.length;(!e||0>e)&&(e=0),(!n||0>n||n>i)&&(n=i);for(var r="",o=e;n>o;o++)r+=G(t[o]);return r}function M(t,e,n){for(var i=t.slice(e,n),r="",o=0;o<i.length;o+=2)r+=String.fromCharCode(i[o]+256*i[o+1]);return r}function k(t,e,n){if(t%1!==0||0>t)throw new RangeError("offset is not uint");if(t+e>n)throw new RangeError("Trying to access beyond buffer length")}function N(e,n,i,r,o,s){if(!t.isBuffer(e))throw new TypeError("buffer must be a Buffer instance");if(n>o||s>n)throw new RangeError("value is out of bounds");if(i+r>e.length)throw new RangeError("index out of range")}function x(t,e,n,i){0>e&&(e=65535+e+1);for(var r=0,o=Math.min(t.length-n,2);o>r;r++)t[n+r]=(e&255<<8*(i?r:1-r))>>>8*(i?r:1-r)}function C(t,e,n,i){0>e&&(e=4294967295+e+1);for(var r=0,o=Math.min(t.length-n,4);o>r;r++)t[n+r]=e>>>8*(i?r:3-r)&255}function F(t,e,n,i,r,o){if(e>r||o>e)throw new RangeError("value is out of bounds");if(n+i>t.length)throw new RangeError("index out of range");if(0>n)throw new RangeError("index out of range")}function U(t,e,n,i,r){return r||F(t,e,n,4,3.4028234663852886e38,-3.4028234663852886e38),X.write(t,e,n,i,23,4),n+4}function B(t,e,n,i,r){return r||F(t,e,n,8,1.7976931348623157e308,-1.7976931348623157e308),X.write(t,e,n,i,52,8),n+8}function H(t){if(t=j(t).replace(tt,""),t.length<2)return"";for(;t.length%4!==0;)t+="=";return t}function j(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function G(t){return 16>t?"0"+t.toString(16):t.toString(16)}function Y(t,e){e=e||1/0;for(var n,i=t.length,r=null,o=[],s=0;i>s;s++){if(n=t.charCodeAt(s),n>55295&&57344>n){if(!r){if(n>56319){(e-=3)>-1&&o.push(239,191,189);continue}if(s+1===i){(e-=3)>-1&&o.push(239,191,189);continue}r=n;continue}if(56320>n){(e-=3)>-1&&o.push(239,191,189),r=n;continue}n=(r-55296<<10|n-56320)+65536}else r&&(e-=3)>-1&&o.push(239,191,189);if(r=null,128>n){if((e-=1)<0)break;o.push(n)}else if(2048>n){if((e-=2)<0)break;o.push(n>>6|192,63&n|128)}else if(65536>n){if((e-=3)<0)break;o.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(1114112>n))throw new Error("Invalid code point");if((e-=4)<0)break;o.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return o}function V(t){for(var e=[],n=0;n<t.length;n++)e.push(255&t.charCodeAt(n));return e}function z(t,e){for(var n,i,r,o=[],s=0;s<t.length&&!((e-=2)<0);s++)n=t.charCodeAt(s),i=n>>8,r=n%256,o.push(r),o.push(i);return o}function W(t){return q.toByteArray(H(t))}function K(t,e,n,i){for(var r=0;i>r&&!(r+n>=e.length||r>=t.length);r++)e[r+n]=t[r];return r}/*!
		 * The buffer module from node.js, for the browser.
		 *
		 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
		 * @license  MIT
		 */
var q=n(71),X=n(72),$=n(73);e.Buffer=t,e.SlowBuffer=m,e.INSPECT_MAX_BYTES=50,t.poolSize=8192;var Z={};t.TYPED_ARRAY_SUPPORT=void 0!==i.TYPED_ARRAY_SUPPORT?i.TYPED_ARRAY_SUPPORT:r(),t.TYPED_ARRAY_SUPPORT&&(t.prototype.__proto__=Uint8Array.prototype,t.__proto__=Uint8Array),t.isBuffer=function(t){return!(null==t||!t._isBuffer)},t.compare=function(e,n){if(!t.isBuffer(e)||!t.isBuffer(n))throw new TypeError("Arguments must be Buffers");if(e===n)return 0;for(var i=e.length,r=n.length,o=0,s=Math.min(i,r);s>o&&e[o]===n[o];)++o;return o!==s&&(i=e[o],r=n[o]),r>i?-1:i>r?1:0},t.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},t.concat=function(e,n){if(!$(e))throw new TypeError("list argument must be an Array of Buffers.");if(0===e.length)return new t(0);var i;if(void 0===n)for(n=0,i=0;i<e.length;i++)n+=e[i].length;var r=new t(n),o=0;for(i=0;i<e.length;i++){var s=e[i];s.copy(r,o),o+=s.length}return r},t.byteLength=y,t.prototype.length=void 0,t.prototype.parent=void 0,t.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?I(this,0,t):v.apply(this,arguments)},t.prototype.equals=function(e){if(!t.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e?!0:0===t.compare(this,e)},t.prototype.inspect=function(){var t="",n=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,n).match(/.{2}/g).join(" "),this.length>n&&(t+=" ... ")),"<Buffer "+t+">"},t.prototype.compare=function(e){if(!t.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e?0:t.compare(this,e)},t.prototype.indexOf=function(e,n){function i(t,e,n){for(var i=-1,r=0;n+r<t.length;r++)if(t[n+r]===e[-1===i?0:r-i]){if(-1===i&&(i=r),r-i+1===e.length)return n+i}else i=-1;return-1}if(n>2147483647?n=2147483647:-2147483648>n&&(n=-2147483648),n>>=0,0===this.length)return-1;if(n>=this.length)return-1;if(0>n&&(n=Math.max(this.length+n,0)),"string"==typeof e)return 0===e.length?-1:String.prototype.indexOf.call(this,e,n);if(t.isBuffer(e))return i(this,e,n);if("number"==typeof e)return t.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,e,n):i(this,[e],n);throw new TypeError("val must be string, number or Buffer")},t.prototype.get=function(t){return console.log(".get() is deprecated. Access using array indexes instead."),this.readUInt8(t)},t.prototype.set=function(t,e){return console.log(".set() is deprecated. Access using array indexes instead."),this.writeUInt8(t,e)},t.prototype.write=function(t,e,n,i){if(void 0===e)i="utf8",n=this.length,e=0;else if(void 0===n&&"string"==typeof e)i=e,n=this.length,e=0;else if(isFinite(e))e=0|e,isFinite(n)?(n=0|n,void 0===i&&(i="utf8")):(i=n,n=void 0);else{var r=i;i=e,e=0|n,n=r}var o=this.length-e;if((void 0===n||n>o)&&(n=o),t.length>0&&(0>n||0>e)||e>this.length)throw new RangeError("attempt to write outside buffer bounds");i||(i="utf8");for(var s=!1;;)switch(i){case"hex":return E(this,t,e,n);case"utf8":case"utf-8":return S(this,t,e,n);case"ascii":return A(this,t,e,n);case"binary":return w(this,t,e,n);case"base64":return T(this,t,e,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return b(this,t,e,n);default:if(s)throw new TypeError("Unknown encoding: "+i);i=(""+i).toLowerCase(),s=!0}},t.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var Q=4096;t.prototype.slice=function(e,n){var i=this.length;e=~~e,n=void 0===n?i:~~n,0>e?(e+=i,0>e&&(e=0)):e>i&&(e=i),0>n?(n+=i,0>n&&(n=0)):n>i&&(n=i),e>n&&(n=e);var r;if(t.TYPED_ARRAY_SUPPORT)r=t._augment(this.subarray(e,n));else{var o=n-e;r=new t(o,void 0);for(var s=0;o>s;s++)r[s]=this[s+e]}return r.length&&(r.parent=this.parent||this),r},t.prototype.readUIntLE=function(t,e,n){t=0|t,e=0|e,n||k(t,e,this.length);for(var i=this[t],r=1,o=0;++o<e&&(r*=256);)i+=this[t+o]*r;return i},t.prototype.readUIntBE=function(t,e,n){t=0|t,e=0|e,n||k(t,e,this.length);for(var i=this[t+--e],r=1;e>0&&(r*=256);)i+=this[t+--e]*r;return i},t.prototype.readUInt8=function(t,e){return e||k(t,1,this.length),this[t]},t.prototype.readUInt16LE=function(t,e){return e||k(t,2,this.length),this[t]|this[t+1]<<8},t.prototype.readUInt16BE=function(t,e){return e||k(t,2,this.length),this[t]<<8|this[t+1]},t.prototype.readUInt32LE=function(t,e){return e||k(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},t.prototype.readUInt32BE=function(t,e){return e||k(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},t.prototype.readIntLE=function(t,e,n){t=0|t,e=0|e,n||k(t,e,this.length);for(var i=this[t],r=1,o=0;++o<e&&(r*=256);)i+=this[t+o]*r;return r*=128,i>=r&&(i-=Math.pow(2,8*e)),i},t.prototype.readIntBE=function(t,e,n){t=0|t,e=0|e,n||k(t,e,this.length);for(var i=e,r=1,o=this[t+--i];i>0&&(r*=256);)o+=this[t+--i]*r;return r*=128,o>=r&&(o-=Math.pow(2,8*e)),o},t.prototype.readInt8=function(t,e){return e||k(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},t.prototype.readInt16LE=function(t,e){e||k(t,2,this.length);var n=this[t]|this[t+1]<<8;return 32768&n?4294901760|n:n},t.prototype.readInt16BE=function(t,e){e||k(t,2,this.length);var n=this[t+1]|this[t]<<8;return 32768&n?4294901760|n:n},t.prototype.readInt32LE=function(t,e){return e||k(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},t.prototype.readInt32BE=function(t,e){return e||k(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},t.prototype.readFloatLE=function(t,e){return e||k(t,4,this.length),X.read(this,t,!0,23,4)},t.prototype.readFloatBE=function(t,e){return e||k(t,4,this.length),X.read(this,t,!1,23,4)},t.prototype.readDoubleLE=function(t,e){return e||k(t,8,this.length),X.read(this,t,!0,52,8)},t.prototype.readDoubleBE=function(t,e){return e||k(t,8,this.length),X.read(this,t,!1,52,8)},t.prototype.writeUIntLE=function(t,e,n,i){t=+t,e=0|e,n=0|n,i||N(this,t,e,n,Math.pow(2,8*n),0);var r=1,o=0;for(this[e]=255&t;++o<n&&(r*=256);)this[e+o]=t/r&255;return e+n},t.prototype.writeUIntBE=function(t,e,n,i){t=+t,e=0|e,n=0|n,i||N(this,t,e,n,Math.pow(2,8*n),0);var r=n-1,o=1;for(this[e+r]=255&t;--r>=0&&(o*=256);)this[e+r]=t/o&255;return e+n},t.prototype.writeUInt8=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,1,255,0),t.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[n]=255&e,n+1},t.prototype.writeUInt16LE=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,2,65535,0),t.TYPED_ARRAY_SUPPORT?(this[n]=255&e,this[n+1]=e>>>8):x(this,e,n,!0),n+2},t.prototype.writeUInt16BE=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,2,65535,0),t.TYPED_ARRAY_SUPPORT?(this[n]=e>>>8,this[n+1]=255&e):x(this,e,n,!1),n+2},t.prototype.writeUInt32LE=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,4,4294967295,0),t.TYPED_ARRAY_SUPPORT?(this[n+3]=e>>>24,this[n+2]=e>>>16,this[n+1]=e>>>8,this[n]=255&e):C(this,e,n,!0),n+4},t.prototype.writeUInt32BE=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,4,4294967295,0),t.TYPED_ARRAY_SUPPORT?(this[n]=e>>>24,this[n+1]=e>>>16,this[n+2]=e>>>8,this[n+3]=255&e):C(this,e,n,!1),n+4},t.prototype.writeIntLE=function(t,e,n,i){if(t=+t,e=0|e,!i){var r=Math.pow(2,8*n-1);N(this,t,e,n,r-1,-r)}var o=0,s=1,a=0>t?1:0;for(this[e]=255&t;++o<n&&(s*=256);)this[e+o]=(t/s>>0)-a&255;return e+n},t.prototype.writeIntBE=function(t,e,n,i){if(t=+t,e=0|e,!i){var r=Math.pow(2,8*n-1);N(this,t,e,n,r-1,-r)}var o=n-1,s=1,a=0>t?1:0;for(this[e+o]=255&t;--o>=0&&(s*=256);)this[e+o]=(t/s>>0)-a&255;return e+n},t.prototype.writeInt8=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,1,127,-128),t.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),0>e&&(e=255+e+1),this[n]=255&e,n+1},t.prototype.writeInt16LE=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,2,32767,-32768),t.TYPED_ARRAY_SUPPORT?(this[n]=255&e,this[n+1]=e>>>8):x(this,e,n,!0),n+2},t.prototype.writeInt16BE=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,2,32767,-32768),t.TYPED_ARRAY_SUPPORT?(this[n]=e>>>8,this[n+1]=255&e):x(this,e,n,!1),n+2},t.prototype.writeInt32LE=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,4,2147483647,-2147483648),t.TYPED_ARRAY_SUPPORT?(this[n]=255&e,this[n+1]=e>>>8,this[n+2]=e>>>16,this[n+3]=e>>>24):C(this,e,n,!0),n+4},t.prototype.writeInt32BE=function(e,n,i){return e=+e,n=0|n,i||N(this,e,n,4,2147483647,-2147483648),0>e&&(e=4294967295+e+1),t.TYPED_ARRAY_SUPPORT?(this[n]=e>>>24,this[n+1]=e>>>16,this[n+2]=e>>>8,this[n+3]=255&e):C(this,e,n,!1),n+4},t.prototype.writeFloatLE=function(t,e,n){return U(this,t,e,!0,n)},t.prototype.writeFloatBE=function(t,e,n){return U(this,t,e,!1,n)},t.prototype.writeDoubleLE=function(t,e,n){return B(this,t,e,!0,n)},t.prototype.writeDoubleBE=function(t,e,n){return B(this,t,e,!1,n)},t.prototype.copy=function(e,n,i,r){if(i||(i=0),r||0===r||(r=this.length),n>=e.length&&(n=e.length),n||(n=0),r>0&&i>r&&(r=i),r===i)return 0;if(0===e.length||0===this.length)return 0;if(0>n)throw new RangeError("targetStart out of bounds");if(0>i||i>=this.length)throw new RangeError("sourceStart out of bounds");if(0>r)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-n<r-i&&(r=e.length-n+i);var o,s=r-i;if(this===e&&n>i&&r>n)for(o=s-1;o>=0;o--)e[o+n]=this[o+i];else if(1e3>s||!t.TYPED_ARRAY_SUPPORT)for(o=0;s>o;o++)e[o+n]=this[o+i];else e._set(this.subarray(i,i+s),n);return s},t.prototype.fill=function(t,e,n){if(t||(t=0),e||(e=0),n||(n=this.length),e>n)throw new RangeError("end < start");if(n!==e&&0!==this.length){if(0>e||e>=this.length)throw new RangeError("start out of bounds");if(0>n||n>this.length)throw new RangeError("end out of bounds");var i;if("number"==typeof t)for(i=e;n>i;i++)this[i]=t;else{var r=Y(t.toString()),o=r.length;for(i=e;n>i;i++)this[i]=r[i%o]}return this}},t.prototype.toArrayBuffer=function(){if("undefined"!=typeof Uint8Array){if(t.TYPED_ARRAY_SUPPORT)return new t(this).buffer;for(var e=new Uint8Array(this.length),n=0,i=e.length;i>n;n+=1)e[n]=this[n];return e.buffer}throw new TypeError("Buffer.toArrayBuffer not supported in this browser")};var J=t.prototype;t._augment=function(e){return e.constructor=t,e._isBuffer=!0,e._set=e.set,e.get=J.get,e.set=J.set,e.write=J.write,e.toString=J.toString,e.toLocaleString=J.toString,e.toJSON=J.toJSON,e.equals=J.equals,e.compare=J.compare,e.indexOf=J.indexOf,e.copy=J.copy,e.slice=J.slice,e.readUIntLE=J.readUIntLE,e.readUIntBE=J.readUIntBE,e.readUInt8=J.readUInt8,e.readUInt16LE=J.readUInt16LE,e.readUInt16BE=J.readUInt16BE,e.readUInt32LE=J.readUInt32LE,e.readUInt32BE=J.readUInt32BE,e.readIntLE=J.readIntLE,e.readIntBE=J.readIntBE,e.readInt8=J.readInt8,e.readInt16LE=J.readInt16LE,e.readInt16BE=J.readInt16BE,e.readInt32LE=J.readInt32LE,e.readInt32BE=J.readInt32BE,e.readFloatLE=J.readFloatLE,e.readFloatBE=J.readFloatBE,e.readDoubleLE=J.readDoubleLE,e.readDoubleBE=J.readDoubleBE,e.writeUInt8=J.writeUInt8,e.writeUIntLE=J.writeUIntLE,e.writeUIntBE=J.writeUIntBE,e.writeUInt16LE=J.writeUInt16LE,e.writeUInt16BE=J.writeUInt16BE,e.writeUInt32LE=J.writeUInt32LE,e.writeUInt32BE=J.writeUInt32BE,e.writeIntLE=J.writeIntLE,e.writeIntBE=J.writeIntBE,e.writeInt8=J.writeInt8,e.writeInt16LE=J.writeInt16LE,e.writeInt16BE=J.writeInt16BE,e.writeInt32LE=J.writeInt32LE,e.writeInt32BE=J.writeInt32BE,e.writeFloatLE=J.writeFloatLE,e.writeFloatBE=J.writeFloatBE,e.writeDoubleLE=J.writeDoubleLE,e.writeDoubleBE=J.writeDoubleBE,e.fill=J.fill,e.inspect=J.inspect,e.toArrayBuffer=J.toArrayBuffer,e};var tt=/[^+\/0-9A-Za-z-_]/g}).call(e,n(70).Buffer,function(){return this}())},function(t,e,n){var i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";!function(t){"use strict";function e(t){var e=t.charCodeAt(0);return e===s||e===l?62:e===a||e===f?63:u>e?-1:u+10>e?e-u+26+26:c+26>e?e-c:h+26>e?e-h+26:void 0}function n(t){function n(t){h[l++]=t}var i,r,s,a,u,h;if(t.length%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var c=t.length;u="="===t.charAt(c-2)?2:"="===t.charAt(c-1)?1:0,h=new o(3*t.length/4-u),s=u>0?t.length-4:t.length;var l=0;for(i=0,r=0;s>i;i+=4,r+=3)a=e(t.charAt(i))<<18|e(t.charAt(i+1))<<12|e(t.charAt(i+2))<<6|e(t.charAt(i+3)),n((16711680&a)>>16),n((65280&a)>>8),n(255&a);return 2===u?(a=e(t.charAt(i))<<2|e(t.charAt(i+1))>>4,n(255&a)):1===u&&(a=e(t.charAt(i))<<10|e(t.charAt(i+1))<<4|e(t.charAt(i+2))>>2,n(a>>8&255),n(255&a)),h}function r(t){function e(t){return i.charAt(t)}function n(t){return e(t>>18&63)+e(t>>12&63)+e(t>>6&63)+e(63&t)}var r,o,s,a=t.length%3,u="";for(r=0,s=t.length-a;s>r;r+=3)o=(t[r]<<16)+(t[r+1]<<8)+t[r+2],u+=n(o);switch(a){case 1:o=t[t.length-1],u+=e(o>>2),u+=e(o<<4&63),u+="==";break;case 2:o=(t[t.length-2]<<8)+t[t.length-1],u+=e(o>>10),u+=e(o>>4&63),u+=e(o<<2&63),u+="="}return u}var o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="+".charCodeAt(0),a="/".charCodeAt(0),u="0".charCodeAt(0),h="a".charCodeAt(0),c="A".charCodeAt(0),l="-".charCodeAt(0),f="_".charCodeAt(0);t.toByteArray=n,t.fromByteArray=r}(e)},function(t,e){e.read=function(t,e,n,i,r){var o,s,a=8*r-i-1,u=(1<<a)-1,h=u>>1,c=-7,l=n?r-1:0,f=n?-1:1,d=t[e+l];for(l+=f,o=d&(1<<-c)-1,d>>=-c,c+=a;c>0;o=256*o+t[e+l],l+=f,c-=8);for(s=o&(1<<-c)-1,o>>=-c,c+=i;c>0;s=256*s+t[e+l],l+=f,c-=8);if(0===o)o=1-h;else{if(o===u)return s?NaN:(d?-1:1)*(1/0);s+=Math.pow(2,i),o-=h}return(d?-1:1)*s*Math.pow(2,o-i)},e.write=function(t,e,n,i,r,o){var s,a,u,h=8*o-r-1,c=(1<<h)-1,l=c>>1,f=23===r?Math.pow(2,-24)-Math.pow(2,-77):0,d=i?0:o-1,p=i?1:-1,g=0>e||0===e&&0>1/e?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,s=c):(s=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-s))<1&&(s--,u*=2),e+=s+l>=1?f/u:f*Math.pow(2,1-l),e*u>=2&&(s++,u/=2),s+l>=c?(a=0,s=c):s+l>=1?(a=(e*u-1)*Math.pow(2,r),s+=l):(a=e*Math.pow(2,l-1)*Math.pow(2,r),s=0));r>=8;t[n+d]=255&a,d+=p,a/=256,r-=8);for(s=s<<r|a,h+=r;h>0;t[n+d]=255&s,d+=p,s/=256,h-=8);t[n+d-p]|=128*g}},function(t,e){var n=Array.isArray,i=Object.prototype.toString;t.exports=n||function(t){return!!t&&"[object Array]"==i.call(t)}},function(t,e,n){var i=n(75);t.exports=function(){i.loggingEnabled()&&console.log.apply(console,arguments)}},function(t,e){var n=!1;t.exports={loggingEnabled:function(t){return void 0!==t&&(n=t),n}}},function(t,e,n){function i(t,e,n){var i=o(t);return n&&s(t,e,n)&&(e=void 0),e?r(i,e):i}var r=n(77),o=n(83),s=n(84);t.exports=i},[131,78,79],3,[132,80,81,82],5,6,7,55,10,[130,86,92,88],[131,87,88],3,[132,89,90,91],5,6,7,[133,93,94,95],9,10,11,function(t,e){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(t){return"function"==typeof t}function r(t){return"number"==typeof t}function o(t){return"object"==typeof t&&null!==t}function s(t){return void 0===t}t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(t){if(!r(t)||0>t||isNaN(t))throw TypeError("n must be a positive number");return this._maxListeners=t,this},n.prototype.emit=function(t){var e,n,r,a,u,h;if(this._events||(this._events={}),"error"===t&&(!this._events.error||o(this._events.error)&&!this._events.error.length)){if(e=arguments[1],e instanceof Error)throw e;throw TypeError('Uncaught, unspecified "error" event.')}if(n=this._events[t],s(n))return!1;if(i(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:a=Array.prototype.slice.call(arguments,1),n.apply(this,a)}else if(o(n))for(a=Array.prototype.slice.call(arguments,1),h=n.slice(),r=h.length,u=0;r>u;u++)h[u].apply(this,a);return!0},n.prototype.addListener=function(t,e){var r;if(!i(e))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",t,i(e.listener)?e.listener:e),this._events[t]?o(this._events[t])?this._events[t].push(e):this._events[t]=[this._events[t],e]:this._events[t]=e,o(this._events[t])&&!this._events[t].warned&&(r=s(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,r&&r>0&&this._events[t].length>r&&(this._events[t].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[t].length),"function"==typeof console.trace&&console.trace())),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(t,e){function n(){this.removeListener(t,n),r||(r=!0,e.apply(this,arguments))}if(!i(e))throw TypeError("listener must be a function");var r=!1;return n.listener=e,this.on(t,n),this},n.prototype.removeListener=function(t,e){var n,r,s,a;if(!i(e))throw TypeError("listener must be a function");if(!this._events||!this._events[t])return this;if(n=this._events[t],s=n.length,r=-1,n===e||i(n.listener)&&n.listener===e)delete this._events[t],this._events.removeListener&&this.emit("removeListener",t,e);else if(o(n)){for(a=s;a-- >0;)if(n[a]===e||n[a].listener&&n[a].listener===e){r=a;break}if(0>r)return this;1===n.length?(n.length=0,delete this._events[t]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",t,e)}return this},n.prototype.removeAllListeners=function(t){var e,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[t]&&delete this._events[t],this;if(0===arguments.length){for(e in this._events)"removeListener"!==e&&this.removeAllListeners(e);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[t],i(n))this.removeListener(t,n);else if(n)for(;n.length;)this.removeListener(t,n[n.length-1]);return delete this._events[t],this},n.prototype.listeners=function(t){var e;return e=this._events&&this._events[t]?i(this._events[t])?[this._events[t]]:this._events[t].slice():[]},n.prototype.listenerCount=function(t){if(this._events){var e=this._events[t];if(i(e))return 1;if(e)return e.length}return 0},n.listenerCount=function(t,e){return t.listenerCount(e)}},function(t,e,n){function i(){r.call(this)}t.exports=i;var r=n(96).EventEmitter,o=n(98);o(i,r),i.Readable=n(99),i.Writable=n(111),i.Duplex=n(112),i.Transform=n(113),i.PassThrough=n(114),i.Stream=i,i.prototype.pipe=function(t,e){function n(e){t.writable&&!1===t.write(e)&&h.pause&&h.pause()}function i(){h.readable&&h.resume&&h.resume()}function o(){c||(c=!0,t.end())}function s(){c||(c=!0,"function"==typeof t.destroy&&t.destroy())}function a(t){if(u(),0===r.listenerCount(this,"error"))throw t}function u(){h.removeListener("data",n),t.removeListener("drain",i),h.removeListener("end",o),h.removeListener("close",s),h.removeListener("error",a),t.removeListener("error",a),h.removeListener("end",u),h.removeListener("close",u),t.removeListener("close",u)}var h=this;h.on("data",n),t.on("drain",i),t._isStdio||e&&e.end===!1||(h.on("end",o),h.on("close",s));var c=!1;return h.on("error",a),t.on("error",a),h.on("end",u),h.on("close",u),t.on("close",u),t.emit("pipe",h),t}},function(t,e){"function"==typeof Object.create?t.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(t,e){t.super_=e;var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},function(t,e,n){e=t.exports=n(100),e.Stream=n(97),e.Readable=e,e.Writable=n(107),e.Duplex=n(106),e.Transform=n(109),e.PassThrough=n(110)},function(t,e,n){(function(e){function i(t,e){var i=n(106);t=t||{};var r=t.highWaterMark,o=t.objectMode?16:16384;this.highWaterMark=r||0===r?r:o,this.highWaterMark=~~this.highWaterMark,this.buffer=[],this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.objectMode=!!t.objectMode,e instanceof i&&(this.objectMode=this.objectMode||!!t.readableObjectMode),this.defaultEncoding=t.defaultEncoding||"utf8",this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,t.encoding&&(L||(L=n(108).StringDecoder),this.decoder=new L(t.encoding),this.encoding=t.encoding)}function r(t){return n(106),this instanceof r?(this._readableState=new i(t,this),this.readable=!0,void P.call(this)):new r(t)}function o(t,e,n,i,r){var o=h(e,n);if(o)t.emit("error",o);else if(I.isNullOrUndefined(n))e.reading=!1,e.ended||c(t,e);else if(e.objectMode||n&&n.length>0)if(e.ended&&!r){var a=new Error("stream.push() after EOF");t.emit("error",a)}else if(e.endEmitted&&r){var a=new Error("stream.unshift() after end event");t.emit("error",a)}else!e.decoder||r||i||(n=e.decoder.write(n)),r||(e.reading=!1),e.flowing&&0===e.length&&!e.sync?(t.emit("data",n),t.read(0)):(e.length+=e.objectMode?1:n.length,r?e.buffer.unshift(n):e.buffer.push(n),e.needReadable&&l(t)),d(t,e);else r||(e.reading=!1);return s(e)}function s(t){return!t.ended&&(t.needReadable||t.length<t.highWaterMark||0===t.length)}function a(t){if(t>=R)t=R;else{t--;for(var e=1;32>e;e<<=1)t|=t>>e;t++}return t}function u(t,e){return 0===e.length&&e.ended?0:e.objectMode?0===t?0:1:isNaN(t)||I.isNull(t)?e.flowing&&e.buffer.length?e.buffer[0].length:e.length:0>=t?0:(t>e.highWaterMark&&(e.highWaterMark=a(t)),t>e.length?e.ended?e.length:(e.needReadable=!0,0):t)}function h(t,e){var n=null;return I.isBuffer(e)||I.isString(e)||I.isNullOrUndefined(e)||t.objectMode||(n=new TypeError("Invalid non-string/buffer chunk")),n}function c(t,e){if(e.decoder&&!e.ended){var n=e.decoder.end();n&&n.length&&(e.buffer.push(n),e.length+=e.objectMode?1:n.length)}e.ended=!0,l(t)}function l(t){var n=t._readableState;n.needReadable=!1,n.emittedReadable||(O("emitReadable",n.flowing),n.emittedReadable=!0,n.sync?e.nextTick(function(){f(t)}):f(t))}function f(t){O("emit readable"),t.emit("readable"),y(t)}function d(t,n){n.readingMore||(n.readingMore=!0,e.nextTick(function(){p(t,n)}))}function p(t,e){for(var n=e.length;!e.reading&&!e.flowing&&!e.ended&&e.length<e.highWaterMark&&(O("maybeReadMore read 0"),t.read(0),n!==e.length);)n=e.length;e.readingMore=!1}function g(t){return function(){var e=t._readableState;O("pipeOnDrain",e.awaitDrain),e.awaitDrain&&e.awaitDrain--,0===e.awaitDrain&&b.listenerCount(t,"data")&&(e.flowing=!0,y(t))}}function _(t,n){n.resumeScheduled||(n.resumeScheduled=!0,e.nextTick(function(){m(t,n)}))}function m(t,e){e.resumeScheduled=!1,t.emit("resume"),y(t),e.flowing&&!e.reading&&t.read(0)}function y(t){var e=t._readableState;if(O("flow",e.flowing),e.flowing)do var n=t.read();while(null!==n&&e.flowing)}function v(t,e){var n,i=e.buffer,r=e.length,o=!!e.decoder,s=!!e.objectMode;if(0===i.length)return null;if(0===r)n=null;else if(s)n=i.shift();else if(!t||t>=r)n=o?i.join(""):T.concat(i,r),i.length=0;else if(t<i[0].length){var a=i[0];n=a.slice(0,t),i[0]=a.slice(t)}else if(t===i[0].length)n=i.shift();else{n=o?"":new T(t);for(var u=0,h=0,c=i.length;c>h&&t>u;h++){var a=i[0],l=Math.min(t-u,a.length);o?n+=a.slice(0,l):a.copy(n,u,0,l),l<a.length?i[0]=a.slice(l):i.shift(),u+=l}}return n}function E(t){var n=t._readableState;if(n.length>0)throw new Error("endReadable called on non-empty stream");n.endEmitted||(n.ended=!0,e.nextTick(function(){n.endEmitted||0!==n.length||(n.endEmitted=!0,t.readable=!1,t.emit("end"))}))}function S(t,e){for(var n=0,i=t.length;i>n;n++)e(t[n],n)}function A(t,e){for(var n=0,i=t.length;i>n;n++)if(t[n]===e)return n;return-1}t.exports=r;var w=n(102),T=n(70).Buffer;r.ReadableState=i;var b=n(96).EventEmitter;b.listenerCount||(b.listenerCount=function(t,e){return t.listeners(e).length});var P=n(97),I=n(103);I.inherits=n(104);var L,O=n(105);O=O&&O.debuglog?O.debuglog("stream"):function(){},I.inherits(r,P),r.prototype.push=function(t,e){var n=this._readableState;return I.isString(t)&&!n.objectMode&&(e=e||n.defaultEncoding,e!==n.encoding&&(t=new T(t,e),e="")),o(this,n,t,e,!1)},r.prototype.unshift=function(t){var e=this._readableState;return o(this,e,t,"",!0)},r.prototype.setEncoding=function(t){return L||(L=n(108).StringDecoder),this._readableState.decoder=new L(t),this._readableState.encoding=t,this};var R=8388608;r.prototype.read=function(t){O("read",t);var e=this._readableState,n=t;if((!I.isNumber(t)||t>0)&&(e.emittedReadable=!1),0===t&&e.needReadable&&(e.length>=e.highWaterMark||e.ended))return O("read: emitReadable",e.length,e.ended),0===e.length&&e.ended?E(this):l(this),null;if(t=u(t,e),0===t&&e.ended)return 0===e.length&&E(this),null;var i=e.needReadable;O("need readable",i),(0===e.length||e.length-t<e.highWaterMark)&&(i=!0,O("length less than watermark",i)),(e.ended||e.reading)&&(i=!1,O("reading or ended",i)),i&&(O("do read"),e.reading=!0,e.sync=!0,0===e.length&&(e.needReadable=!0),this._read(e.highWaterMark),e.sync=!1),i&&!e.reading&&(t=u(n,e));var r;return r=t>0?v(t,e):null,I.isNull(r)&&(e.needReadable=!0,t=0),e.length-=t,0!==e.length||e.ended||(e.needReadable=!0),n!==t&&e.ended&&0===e.length&&E(this),I.isNull(r)||this.emit("data",r),r},r.prototype._read=function(t){this.emit("error",new Error("not implemented"))},r.prototype.pipe=function(t,n){function i(t){O("onunpipe"),t===l&&o()}function r(){O("onend"),t.end()}function o(){O("cleanup"),t.removeListener("close",u),t.removeListener("finish",h),t.removeListener("drain",_),t.removeListener("error",a),t.removeListener("unpipe",i),l.removeListener("end",r),l.removeListener("end",o),l.removeListener("data",s),!f.awaitDrain||t._writableState&&!t._writableState.needDrain||_()}function s(e){O("ondata");var n=t.write(e);!1===n&&(O("false write response, pause",l._readableState.awaitDrain),l._readableState.awaitDrain++,l.pause())}function a(e){O("onerror",e),c(),t.removeListener("error",a),0===b.listenerCount(t,"error")&&t.emit("error",e)}function u(){t.removeListener("finish",h),c()}function h(){O("onfinish"),t.removeListener("close",u),c()}function c(){O("unpipe"),l.unpipe(t)}var l=this,f=this._readableState;switch(f.pipesCount){case 0:f.pipes=t;break;case 1:f.pipes=[f.pipes,t];break;default:f.pipes.push(t)}f.pipesCount+=1,O("pipe count=%d opts=%j",f.pipesCount,n);var d=(!n||n.end!==!1)&&t!==e.stdout&&t!==e.stderr,p=d?r:o;f.endEmitted?e.nextTick(p):l.once("end",p),t.on("unpipe",i);var _=g(l);return t.on("drain",_),l.on("data",s),t._events&&t._events.error?w(t._events.error)?t._events.error.unshift(a):t._events.error=[a,t._events.error]:t.on("error",a),t.once("close",u),t.once("finish",h),t.emit("pipe",l),f.flowing||(O("pipe resume"),l.resume()),t},r.prototype.unpipe=function(t){var e=this._readableState;if(0===e.pipesCount)return this;if(1===e.pipesCount)return t&&t!==e.pipes?this:(t||(t=e.pipes),e.pipes=null,e.pipesCount=0,e.flowing=!1,t&&t.emit("unpipe",this),this);if(!t){var n=e.pipes,i=e.pipesCount;e.pipes=null,e.pipesCount=0,e.flowing=!1;for(var r=0;i>r;r++)n[r].emit("unpipe",this);return this}var r=A(e.pipes,t);return-1===r?this:(e.pipes.splice(r,1),e.pipesCount-=1,1===e.pipesCount&&(e.pipes=e.pipes[0]),t.emit("unpipe",this),this)},r.prototype.on=function(t,n){var i=P.prototype.on.call(this,t,n);if("data"===t&&!1!==this._readableState.flowing&&this.resume(),"readable"===t&&this.readable){var r=this._readableState;if(!r.readableListening)if(r.readableListening=!0,r.emittedReadable=!1,r.needReadable=!0,r.reading)r.length&&l(this,r);else{var o=this;e.nextTick(function(){O("readable nexttick read 0"),o.read(0)})}}return i},r.prototype.addListener=r.prototype.on,r.prototype.resume=function(){var t=this._readableState;return t.flowing||(O("resume"),t.flowing=!0,t.reading||(O("resume read 0"),this.read(0)),_(this,t)),this},r.prototype.pause=function(){return O("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(O("pause"),this._readableState.flowing=!1,this.emit("pause")),this},r.prototype.wrap=function(t){var e=this._readableState,n=!1,i=this;t.on("end",function(){if(O("wrapped end"),e.decoder&&!e.ended){var t=e.decoder.end();t&&t.length&&i.push(t)}i.push(null)}),t.on("data",function(r){if(O("wrapped data"),e.decoder&&(r=e.decoder.write(r)),r&&(e.objectMode||r.length)){var o=i.push(r);o||(n=!0,t.pause())}});for(var r in t)I.isFunction(t[r])&&I.isUndefined(this[r])&&(this[r]=function(e){return function(){return t[e].apply(t,arguments)}}(r));var o=["error","close","destroy","pause","resume"];return S(o,function(e){t.on(e,i.emit.bind(i,e))}),i._read=function(e){O("wrapped _read",e),n&&(n=!1,t.resume())},i},r._fromList=v}).call(e,n(101))},function(t,e){function n(){h=!1,s.length?u=s.concat(u):c=-1,u.length&&i()}function i(){if(!h){var t=setTimeout(n);h=!0;for(var e=u.length;e;){for(s=u,u=[];++c<e;)s&&s[c].run();c=-1,e=u.length}s=null,h=!1,clearTimeout(t)}}function r(t,e){this.fun=t,this.array=e}function o(){}var s,a=t.exports={},u=[],h=!1,c=-1;a.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];u.push(new r(t,e)),1!==u.length||h||setTimeout(i,0)},r.prototype.run=function(){this.fun.apply(null,this.array)},a.title="browser",a.browser=!0,a.env={},a.argv=[],a.version="",a.versions={},a.on=o,a.addListener=o,a.once=o,a.off=o,a.removeListener=o,a.removeAllListeners=o,a.emit=o,a.binding=function(t){throw new Error("process.binding is not supported")},a.cwd=function(){return"/"},a.chdir=function(t){throw new Error("process.chdir is not supported")},a.umask=function(){return 0}},function(t,e){t.exports=Array.isArray||function(t){return"[object Array]"==Object.prototype.toString.call(t)}},function(t,e,n){(function(t){function n(t){return Array.isArray?Array.isArray(t):"[object Array]"===_(t)}function i(t){return"boolean"==typeof t}function r(t){return null===t}function o(t){return null==t}function s(t){return"number"==typeof t}function a(t){return"string"==typeof t}function u(t){return"symbol"==typeof t}function h(t){return void 0===t}function c(t){return"[object RegExp]"===_(t)}function l(t){return"object"==typeof t&&null!==t}function f(t){return"[object Date]"===_(t)}function d(t){return"[object Error]"===_(t)||t instanceof Error}function p(t){return"function"==typeof t}function g(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"==typeof t||"undefined"==typeof t}function _(t){return Object.prototype.toString.call(t)}e.isArray=n,e.isBoolean=i,e.isNull=r,e.isNullOrUndefined=o,e.isNumber=s,e.isString=a,e.isSymbol=u,e.isUndefined=h,e.isRegExp=c,e.isObject=l,e.isDate=f,e.isError=d,e.isFunction=p,e.isPrimitive=g,e.isBuffer=t.isBuffer}).call(e,n(70).Buffer)},98,function(t,e){},function(t,e,n){(function(e){function i(t){return this instanceof i?(u.call(this,t),h.call(this,t),t&&t.readable===!1&&(this.readable=!1),t&&t.writable===!1&&(this.writable=!1),this.allowHalfOpen=!0,t&&t.allowHalfOpen===!1&&(this.allowHalfOpen=!1),void this.once("end",r)):new i(t)}function r(){this.allowHalfOpen||this._writableState.ended||e.nextTick(this.end.bind(this))}function o(t,e){for(var n=0,i=t.length;i>n;n++)e(t[n],n)}t.exports=i;var s=Object.keys||function(t){var e=[];for(var n in t)e.push(n);return e},a=n(103);a.inherits=n(104);var u=n(100),h=n(107);a.inherits(i,u),o(s(h.prototype),function(t){i.prototype[t]||(i.prototype[t]=h.prototype[t])})}).call(e,n(101))},function(t,e,n){(function(e){function i(t,e,n){this.chunk=t,this.encoding=e,this.callback=n}function r(t,e){var i=n(106);t=t||{};var r=t.highWaterMark,o=t.objectMode?16:16384;this.highWaterMark=r||0===r?r:o,this.objectMode=!!t.objectMode,e instanceof i&&(this.objectMode=this.objectMode||!!t.writableObjectMode),this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1;var s=t.decodeStrings===!1;this.decodeStrings=!s,this.defaultEncoding=t.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(t){d(e,t)},this.writecb=null,this.writelen=0,this.buffer=[],this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1}function o(t){var e=n(106);return this instanceof o||this instanceof e?(this._writableState=new r(t,this),this.writable=!0,void w.call(this)):new o(t)}function s(t,n,i){var r=new Error("write after end");
t.emit("error",r),e.nextTick(function(){i(r)})}function a(t,n,i,r){var o=!0;if(!(A.isBuffer(i)||A.isString(i)||A.isNullOrUndefined(i)||n.objectMode)){var s=new TypeError("Invalid non-string/buffer chunk");t.emit("error",s),e.nextTick(function(){r(s)}),o=!1}return o}function u(t,e,n){return!t.objectMode&&t.decodeStrings!==!1&&A.isString(e)&&(e=new S(e,n)),e}function h(t,e,n,r,o){n=u(e,n,r),A.isBuffer(n)&&(r="buffer");var s=e.objectMode?1:n.length;e.length+=s;var a=e.length<e.highWaterMark;return a||(e.needDrain=!0),e.writing||e.corked?e.buffer.push(new i(n,r,o)):c(t,e,!1,s,n,r,o),a}function c(t,e,n,i,r,o,s){e.writelen=i,e.writecb=s,e.writing=!0,e.sync=!0,n?t._writev(r,e.onwrite):t._write(r,o,e.onwrite),e.sync=!1}function l(t,n,i,r,o){i?e.nextTick(function(){n.pendingcb--,o(r)}):(n.pendingcb--,o(r)),t._writableState.errorEmitted=!0,t.emit("error",r)}function f(t){t.writing=!1,t.writecb=null,t.length-=t.writelen,t.writelen=0}function d(t,n){var i=t._writableState,r=i.sync,o=i.writecb;if(f(i),n)l(t,i,r,n,o);else{var s=m(t,i);s||i.corked||i.bufferProcessing||!i.buffer.length||_(t,i),r?e.nextTick(function(){p(t,i,s,o)}):p(t,i,s,o)}}function p(t,e,n,i){n||g(t,e),e.pendingcb--,i(),v(t,e)}function g(t,e){0===e.length&&e.needDrain&&(e.needDrain=!1,t.emit("drain"))}function _(t,e){if(e.bufferProcessing=!0,t._writev&&e.buffer.length>1){for(var n=[],i=0;i<e.buffer.length;i++)n.push(e.buffer[i].callback);e.pendingcb++,c(t,e,!0,e.length,e.buffer,"",function(t){for(var i=0;i<n.length;i++)e.pendingcb--,n[i](t)}),e.buffer=[]}else{for(var i=0;i<e.buffer.length;i++){var r=e.buffer[i],o=r.chunk,s=r.encoding,a=r.callback,u=e.objectMode?1:o.length;if(c(t,e,!1,u,o,s,a),e.writing){i++;break}}i<e.buffer.length?e.buffer=e.buffer.slice(i):e.buffer.length=0}e.bufferProcessing=!1}function m(t,e){return e.ending&&0===e.length&&!e.finished&&!e.writing}function y(t,e){e.prefinished||(e.prefinished=!0,t.emit("prefinish"))}function v(t,e){var n=m(t,e);return n&&(0===e.pendingcb?(y(t,e),e.finished=!0,t.emit("finish")):y(t,e)),n}function E(t,n,i){n.ending=!0,v(t,n),i&&(n.finished?e.nextTick(i):t.once("finish",i)),n.ended=!0}t.exports=o;var S=n(70).Buffer;o.WritableState=r;var A=n(103);A.inherits=n(104);var w=n(97);A.inherits(o,w),o.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe. Not readable."))},o.prototype.write=function(t,e,n){var i=this._writableState,r=!1;return A.isFunction(e)&&(n=e,e=null),A.isBuffer(t)?e="buffer":e||(e=i.defaultEncoding),A.isFunction(n)||(n=function(){}),i.ended?s(this,i,n):a(this,i,t,n)&&(i.pendingcb++,r=h(this,i,t,e,n)),r},o.prototype.cork=function(){var t=this._writableState;t.corked++},o.prototype.uncork=function(){var t=this._writableState;t.corked&&(t.corked--,t.writing||t.corked||t.finished||t.bufferProcessing||!t.buffer.length||_(this,t))},o.prototype._write=function(t,e,n){n(new Error("not implemented"))},o.prototype._writev=null,o.prototype.end=function(t,e,n){var i=this._writableState;A.isFunction(t)?(n=t,t=null,e=null):A.isFunction(e)&&(n=e,e=null),A.isNullOrUndefined(t)||this.write(t,e),i.corked&&(i.corked=1,this.uncork()),i.ending||i.finished||E(this,i,n)}}).call(e,n(101))},function(t,e,n){function i(t){if(t&&!u(t))throw new Error("Unknown encoding: "+t)}function r(t){return t.toString(this.encoding)}function o(t){this.charReceived=t.length%2,this.charLength=this.charReceived?2:0}function s(t){this.charReceived=t.length%3,this.charLength=this.charReceived?3:0}var a=n(70).Buffer,u=a.isEncoding||function(t){switch(t&&t.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}},h=e.StringDecoder=function(t){switch(this.encoding=(t||"utf8").toLowerCase().replace(/[-_]/,""),i(t),this.encoding){case"utf8":this.surrogateSize=3;break;case"ucs2":case"utf16le":this.surrogateSize=2,this.detectIncompleteChar=o;break;case"base64":this.surrogateSize=3,this.detectIncompleteChar=s;break;default:return void(this.write=r)}this.charBuffer=new a(6),this.charReceived=0,this.charLength=0};h.prototype.write=function(t){for(var e="";this.charLength;){var n=t.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:t.length;if(t.copy(this.charBuffer,this.charReceived,0,n),this.charReceived+=n,this.charReceived<this.charLength)return"";t=t.slice(n,t.length),e=this.charBuffer.slice(0,this.charLength).toString(this.encoding);var i=e.charCodeAt(e.length-1);if(!(i>=55296&&56319>=i)){if(this.charReceived=this.charLength=0,0===t.length)return e;break}this.charLength+=this.surrogateSize,e=""}this.detectIncompleteChar(t);var r=t.length;this.charLength&&(t.copy(this.charBuffer,0,t.length-this.charReceived,r),r-=this.charReceived),e+=t.toString(this.encoding,0,r);var r=e.length-1,i=e.charCodeAt(r);if(i>=55296&&56319>=i){var o=this.surrogateSize;return this.charLength+=o,this.charReceived+=o,this.charBuffer.copy(this.charBuffer,o,0,o),t.copy(this.charBuffer,0,0,o),e.substring(0,r)}return e},h.prototype.detectIncompleteChar=function(t){for(var e=t.length>=3?3:t.length;e>0;e--){var n=t[t.length-e];if(1==e&&n>>5==6){this.charLength=2;break}if(2>=e&&n>>4==14){this.charLength=3;break}if(3>=e&&n>>3==30){this.charLength=4;break}}this.charReceived=e},h.prototype.end=function(t){var e="";if(t&&t.length&&(e=this.write(t)),this.charReceived){var n=this.charReceived,i=this.charBuffer,r=this.encoding;e+=i.slice(0,n).toString(r)}return e}},function(t,e,n){function i(t,e){this.afterTransform=function(t,n){return r(e,t,n)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null}function r(t,e,n){var i=t._transformState;i.transforming=!1;var r=i.writecb;if(!r)return t.emit("error",new Error("no writecb in Transform class"));i.writechunk=null,i.writecb=null,u.isNullOrUndefined(n)||t.push(n),r&&r(e);var o=t._readableState;o.reading=!1,(o.needReadable||o.length<o.highWaterMark)&&t._read(o.highWaterMark)}function o(t){if(!(this instanceof o))return new o(t);a.call(this,t),this._transformState=new i(t,this);var e=this;this._readableState.needReadable=!0,this._readableState.sync=!1,this.once("prefinish",function(){u.isFunction(this._flush)?this._flush(function(t){s(e,t)}):s(e)})}function s(t,e){if(e)return t.emit("error",e);var n=t._writableState,i=t._transformState;if(n.length)throw new Error("calling transform done when ws.length != 0");if(i.transforming)throw new Error("calling transform done when still transforming");return t.push(null)}t.exports=o;var a=n(106),u=n(103);u.inherits=n(104),u.inherits(o,a),o.prototype.push=function(t,e){return this._transformState.needTransform=!1,a.prototype.push.call(this,t,e)},o.prototype._transform=function(t,e,n){throw new Error("not implemented")},o.prototype._write=function(t,e,n){var i=this._transformState;if(i.writecb=n,i.writechunk=t,i.writeencoding=e,!i.transforming){var r=this._readableState;(i.needTransform||r.needReadable||r.length<r.highWaterMark)&&this._read(r.highWaterMark)}},o.prototype._read=function(t){var e=this._transformState;u.isNull(e.writechunk)||!e.writecb||e.transforming?e.needTransform=!0:(e.transforming=!0,this._transform(e.writechunk,e.writeencoding,e.afterTransform))}},function(t,e,n){function i(t){return this instanceof i?void r.call(this,t):new i(t)}t.exports=i;var r=n(109),o=n(103);o.inherits=n(104),o.inherits(i,r),i.prototype._transform=function(t,e,n){n(null,t)}},function(t,e,n){t.exports=n(107)},function(t,e,n){t.exports=n(106)},function(t,e,n){t.exports=n(109)},function(t,e,n){t.exports=n(110)},function(t,e,n){(function(e){var i,r=n(74),o=n(69),s=(o.BaseTransform,o.BaseParser),a=n(116);t.exports=i=function(t,e){o.BaseParser.prototype.constructor.apply(this,arguments),t||(t={audioTrackId:-1,videoTrackId:-1,tracks:[]}),this.muxer=new a(t),this.muxer.ondata=this._onMp4Data.bind(this),this.muxer.oncodecinfo=this._onCodecInfo.bind(this),this._codecInfo=null,this._timestamp=0,e&&(this.worker="undefined"!=typeof Worker?new Worker("/dist/mp4-mux-worker-bundle.js"):null),this.worker&&(this.worker.onmessage=function(t){this._onMp4Data(t.data)}.bind(this),this.worker.postMessage({mp4MuxProfile:t}))},i.Profiles=a.Profiles,i.prototype=o.createBaseParser({constructor:i,_onMp4Data:function(t){r("_onMp4Data"),this.enqueue(new o.Transfer(new e(t),"buffer"))},_onCodecInfo:function(t){r("Codec info: "+t),this._codecInfo=t},_onFinish:function(t){r("MP4Mux._onFinish"),this.worker?this.worker.postMessage({eos:!0}):this.muxer&&this.muxer.flush(),s.prototype._onFinish.call(this,t)},_parse:function(t){var e;t.data&&(e=this._timestamp=t.data.timestamp),t.data.flush&&(this._needFlush=!0),r("UnitMP4Mux Timestamp: "+this._timestamp),r("UnitMP4Mux._parse: Payload type: "+typeof t.data),this.worker?(t.data.empty||this.worker.postMessage({data:t.data,meta:t.data.meta,timestamp:e,packetType:a.TYPE_AUDIO_PACKET}),this._needFlush&&(this.worker.postMessage({eos:!0}),this._needFlush=!1)):this.muxer&&(t.data.empty||this.muxer.pushPacket(a.TYPE_AUDIO_PACKET,new Uint8Array(t.data),e,t.data.meta),this._needFlush&&(this.muxer.flush(),this._needFlush=!1))}})}).call(e,n(70).Buffer)},function(t,e,n){function i(t){for(var e=t.length>>1,n=new Uint8Array(e),i=0;e>i;i++)n[i]=parseInt(t.substr(2*i,2),16);return n}function r(t,e){var n,i=0,r=s.RAW;switch(e.codecId){case l:var o=t[i++];r=o,n=1024;break;case c:var u=t[i+1]>>3&3,f=t[i+1]>>1&3;n=1===f?3===u?1152:576:3===f?384:1152}return info={codecDescription:h[e.codecId],codecId:e.codecId,data:t.subarray(i),rate:e.sampleRate,size:e.sampleSize,channels:e.channels,samples:n,packetType:r},a("parsed audio packet with %d samples",n),info}function o(t){var e=0,n=t[e]>>4,i=15&t[e];e++;var r={frameType:n,codecId:i,codecDescription:d[i]};switch(i){case g:var o=t[e++];r.packetType=o,r.compositionTime=(t[e]<<24|t[e+1]<<16|t[e+2]<<8)>>8,e+=3;break;case p:r.packetType=_.NALU,r.horizontalOffset=t[e]>>4&15,r.verticalOffset=15&t[e],r.compositionTime=0,e++}return r.data=t.subarray(e),r}var s,a=n(74),u=n(117),h=["PCM","ADPCM","MP3","PCM le","Nellymouser16","Nellymouser8","Nellymouser","G.711 A-law","G.711 mu-law",null,"AAC","Speex","MP3 8khz"],c=2,l=10;!function(t){t[t.HEADER=0]="HEADER",t[t.RAW=1]="RAW"}(s||(s={}));var f,d=[null,"JPEG","Sorenson","Screen","VP6","VP6 alpha","Screen2","AVC"],p=4,g=7;!function(t){t[t.KEY=1]="KEY",t[t.INNER=2]="INNER",t[t.DISPOSABLE=3]="DISPOSABLE",t[t.GENERATED=4]="GENERATED",t[t.INFO=5]="INFO"}(f||(f={}));var _;!function(t){t[t.HEADER=0]="HEADER",t[t.NALU=1]="NALU",t[t.END=2]="END"}(_||(_={}));var m,y=8,v=9,E=!0;!function(t){t[t.CAN_GENERATE_HEADER=0]="CAN_GENERATE_HEADER",t[t.NEED_HEADER_DATA=1]="NEED_HEADER_DATA",t[t.MAIN_PACKETS=2]="MAIN_PACKETS"}(m||(m={}));var S=function(){function t(t){var e=this;this.oncodecinfo=function(t){throw new Error("MP4Mux.oncodecinfo is not set")},this.ondata=function(t){throw new Error("MP4Mux.ondata is not set")},this.metadata=t,this.trackStates=this.metadata.tracks.map(function(t,n){var i={trackId:n+1,trackInfo:t,cachedDuration:0,samplesProcessed:0,initializationData:[]};return e.metadata.audioTrackId===n&&(e.audioTrackState=i),e.metadata.videoTrackId===n&&(e.videoTrackState=i),i},this),this._checkIfNeedHeaderData(),this.filePos=0,this.cachedPackets=[],this.chunkIndex=0}return t.prototype.pushPacket=function(t,e,n,i){switch(this.state===m.CAN_GENERATE_HEADER&&this._tryGenerateHeader(),t){case y:var a=this.audioTrackState,u=r(e,i);if(!a||a.trackInfo.codecId!==u.codecId)throw new Error("Unexpected audio packet codec: "+u.codecDescription);switch(u.codecId){default:throw new Error("Unsupported audio codec: "+u.codecDescription);case c:break;case l:if(u.packetType===s.HEADER)return void a.initializationData.push(u.data)}this.cachedPackets.push({packet:u,timestamp:n,trackId:a.trackId});break;case v:var h=this.videoTrackState,f=o(e);if(!h||h.trackInfo.codecId!==f.codecId)throw new Error("Unexpected video packet codec: "+f.codecDescription);switch(f.codecId){default:throw new Error("unsupported video codec: "+f.codecDescription);case p:break;case g:if(f.packetType===_.HEADER)return void h.initializationData.push(f.data)}this.cachedPackets.push({packet:f,timestamp:n,trackId:h.trackId});break;default:throw new Error("unknown packet type: "+t)}this.state===m.NEED_HEADER_DATA&&this._tryGenerateHeader()},t.prototype.flush=function(){this.cachedPackets.length>0&&this._chunk()},t.prototype._checkIfNeedHeaderData=function(){this.trackStates.some(function(t){return t.trackInfo.codecId===l||t.trackInfo.codecId===g})?this.state=m.NEED_HEADER_DATA:this.state=m.CAN_GENERATE_HEADER},t.prototype._tryGenerateHeader=function(){var t=this.trackStates.every(function(t){switch(t.trackInfo.codecId){case l:case g:return t.initializationData.length>0;default:return!0}});if(t){for(var e=["isom"],n=1,r=1,o=[],s=0;s<this.trackStates.length;s++){var a,h=this.trackStates[s],f=h.trackInfo;switch(f.codecId){case l:var d=h.initializationData[0];a=new u.AudioSampleEntry("mp4a",n,f.channels,f.samplesize,f.samplerate);var _=new Uint8Array(41+d.length);_.set(i("0000000003808080"),0),_[8]=32+d.length,_.set(i("00020004808080"),9),_[16]=18+d.length,_.set(i("40150000000000FA000000000005808080"),17),_[34]=d.length,_.set(d,35),_.set(i("068080800102"),35+d.length),a.otherBoxes=[new u.RawTag("esds",_)];var y=d[0]>>3;h.mimeTypeCodec="mp4a.40."+y;break;case c:a=new u.AudioSampleEntry(".mp3",n,f.channels,f.samplesize,f.samplerate),h.mimeTypeCodec="mp3";break;case g:var v=h.initializationData[0];a=new u.VideoSampleEntry("avc1",r,f.width,f.height),a.otherBoxes=[new u.RawTag("avcC",v)];var E=v[1]<<16|v[2]<<8|v[3];h.mimeTypeCodec="avc1."+(16777216|E).toString(16).substr(1),e.push("iso2","avc1","mp41");break;case p:a=new u.VideoSampleEntry("VP6F",r,f.width,f.height),a.otherBoxes=[new u.RawTag("glbl",i("00"))],h.mimeTypeCodec="avc1.42001E";break;default:throw new Error("not supported track type")}var S,A=u.TrackHeaderFlags.TRACK_ENABLED|u.TrackHeaderFlags.TRACK_IN_MOVIE;h===this.audioTrackState?S=new u.TrackBox(new u.TrackHeaderBox(A,h.trackId,-1,0,0,1,s),new u.MediaBox(new u.MediaHeaderBox(f.timescale,-1,f.language),new u.HandlerBox("soun","SoundHandler"),new u.MediaInformationBox(new u.SoundMediaHeaderBox,new u.DataInformationBox(new u.DataReferenceBox([new u.DataEntryUrlBox(u.SELF_CONTAINED_DATA_REFERENCE_FLAG)])),new u.SampleTableBox(new u.SampleDescriptionBox([a]),new u.RawTag("stts",i("0000000000000000")),new u.RawTag("stsc",i("0000000000000000")),new u.RawTag("stsz",i("000000000000000000000000")),new u.RawTag("stco",i("0000000000000000")))))):h===this.videoTrackState&&(S=new u.TrackBox(new u.TrackHeaderBox(A,h.trackId,-1,f.width,f.height,0,s),new u.MediaBox(new u.MediaHeaderBox(f.timescale,-1,f.language),new u.HandlerBox("vide","VideoHandler"),new u.MediaInformationBox(new u.VideoMediaHeaderBox,new u.DataInformationBox(new u.DataReferenceBox([new u.DataEntryUrlBox(u.SELF_CONTAINED_DATA_REFERENCE_FLAG)])),new u.SampleTableBox(new u.SampleDescriptionBox([a]),new u.RawTag("stts",i("0000000000000000")),new u.RawTag("stsc",i("0000000000000000")),new u.RawTag("stsz",i("000000000000000000000000")),new u.RawTag("stco",i("0000000000000000"))))))),o.push(S)}var w=new u.MovieExtendsBox(null,[new u.TrackExtendsBox(1,1,0,0,0),new u.TrackExtendsBox(2,1,0,0,0)],null),T=new u.BoxContainerBox("udat",[new u.MetaBox(new u.RawTag("hdlr",i("00000000000000006D6469726170706C000000000000000000")),[new u.RawTag("ilst",i("00000025A9746F6F0000001D6461746100000001000000004C61766635342E36332E313034"))])]),b=new u.MovieHeaderBox(1e3,0,this.trackStates.length+1),P=new u.MovieBox(b,o,w,T),I=new u.FileTypeBox("isom",512,e),L=I.layout(0),O=P.layout(L),R=new Uint8Array(L+O);I.write(R),P.write(R),this.oncodecinfo(this.trackStates.map(function(t){return t.mimeTypeCodec})),this.ondata(R),this.filePos+=R.length,this.state=m.MAIN_PACKETS}},t.prototype._chunk=function(){var t=this.cachedPackets;if(E&&this.videoTrackState){for(var e=t.length-1,n=this.videoTrackState.trackId;e>0&&(t[e].trackId!==n||t[e].packet.frameType!==f.KEY);)e--;e>0&&(t=t.slice(0,e))}if(0!==t.length){for(var i=[],r=0,o=[],s=[],a=0;a<this.trackStates.length;a++){var h=this.trackStates[a],d=h.trackInfo,_=h.trackId,m=t.filter(function(t){return t.trackId===_});if(0!==m.length){var y,v,S,A=new u.TrackFragmentBaseMediaDecodeTimeBox(h.cachedDuration);switch(s.push(r),d.codecId){case l:case c:S=[];for(var e=0;e<m.length;e++){var w=m[e].packet,T=Math.round(w.samples*d.timescale/d.samplerate);i.push(w.data),r+=w.data.length,S.push({duration:T,size:w.data.length}),h.samplesProcessed+=w.samples}var b=u.TrackFragmentFlags.DEFAULT_SAMPLE_FLAGS_PRESENT;y=new u.TrackFragmentHeaderBox(b,_,0,0,0,0,u.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS);var P=u.TrackRunFlags.DATA_OFFSET_PRESENT|u.TrackRunFlags.SAMPLE_DURATION_PRESENT|u.TrackRunFlags.SAMPLE_SIZE_PRESENT;v=new u.TrackRunBox(P,S,0,0),h.cachedDuration=Math.round(h.samplesProcessed*d.timescale/d.samplerate);break;case g:case p:S=[];for(var I=h.samplesProcessed,L=I*d.timescale/d.framerate,O=Math.round(L),e=0;e<m.length;e++){var R=m[e].packet;I++;var D=Math.round(I*d.timescale/d.framerate),M=D-O;O=D;var k=Math.round(I*d.timescale/d.framerate+R.compositionTime*d.timescale/1e3);i.push(R.data),r+=R.data.length;var N=R.frameType===f.KEY?u.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS:u.SampleFlags.SAMPLE_DEPENDS_ON_OTHER|u.SampleFlags.SAMPLE_IS_NOT_SYNC;S.push({duration:M,size:R.data.length,flags:N,compositionTimeOffset:k-D})}var b=u.TrackFragmentFlags.DEFAULT_SAMPLE_FLAGS_PRESENT;y=new u.TrackFragmentHeaderBox(b,_,0,0,0,0,u.SampleFlags.SAMPLE_DEPENDS_ON_NO_OTHERS);var P=u.TrackRunFlags.DATA_OFFSET_PRESENT|u.TrackRunFlags.SAMPLE_DURATION_PRESENT|u.TrackRunFlags.SAMPLE_SIZE_PRESENT|u.TrackRunFlags.SAMPLE_FLAGS_PRESENT|u.TrackRunFlags.SAMPLE_COMPOSITION_TIME_OFFSET;v=new u.TrackRunBox(P,S,0,0),h.cachedDuration=O,h.samplesProcessed=I;break;default:throw new Error("Un codec")}var x=new u.TrackFragmentBox(y,A,v);o.push(x)}}this.cachedPackets.splice(0,t.length);for(var C=new u.MovieFragmentHeaderBox(++this.chunkIndex),F=new u.MovieFragmentBox(C,o),U=F.layout(0),B=new u.MediaDataBox(i),H=B.layout(U),j=U+8,a=0;a<o.length;a++)o[a].run.dataOffset=j+s[a];var G=new Uint8Array(U+H);F.write(G),B.write(G),this.ondata(G),this.filePos+=G.length}},t}();t.exports=S,S.MP3_SOUND_CODEC_ID=c,S.AAC_SOUND_CODEC_ID=l,S.TYPE_AUDIO_PACKET=y,S.TYPE_VIDEO_PACKET=v,S.Profiles={MP3_AUDIO_ONLY:{audioTrackId:0,videoTrackId:-1,tracks:[{codecId:S.MP3_SOUND_CODEC_ID,channels:2,samplerate:44100,samplesize:16,timescale:44100}]}}},function(t,e){function n(t){for(var e=new Uint8Array(4*t.length),n=0,i=0,r=t.length;r>i;i++){var o=t.charCodeAt(i);if(127>=o)e[n++]=o;else{if(o>=55296&&56319>=o){var s=t.charCodeAt(i+1);s>=56320&&57343>=s&&(o=((1023&o)<<10)+(1023&s)+65536,++i)}0!==(4292870144&o)?(e[n++]=248|o>>>24&3,e[n++]=128|o>>>18&63,e[n++]=128|o>>>12&63,e[n++]=128|o>>>6&63,e[n++]=128|63&o):0!==(4294901760&o)?(e[n++]=240|o>>>18&7,e[n++]=128|o>>>12&63,e[n++]=128|o>>>6&63,e[n++]=128|63&o):0!==(4294965248&o)?(e[n++]=224|o>>>12&15,e[n++]=128|o>>>6&63,e[n++]=128|63&o):(e[n++]=192|o>>>6&31,e[n++]=128|63&o)}}return e.subarray(0,n)}function i(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return Array.prototype.concat.apply(t,e)}function r(t,e,n){t[e]=n>>24&255,t[e+1]=n>>16&255,t[e+2]=n>>8&255,t[e+3]=255&n}function o(t){return t.charCodeAt(0)<<24|t.charCodeAt(1)<<16|t.charCodeAt(2)<<8|t.charCodeAt(3)}function s(t){return(t-d)/1e3|0}function a(t){return 65536*t|0}function u(t){return 1073741824*t|0}function h(t){return 256*t|0}function c(t){return(31&t.charCodeAt(0))<<10|(31&t.charCodeAt(1))<<5|31&t.charCodeAt(2)}var l,f=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)};t.exports=l={};var d=-20828448e5,p=[1,0,0,0,1,0,0,0,1],g=[0,0,0],_=function(){function t(t,e){this.boxtype=t,"uuid"===t&&(this.userType=e)}return t.prototype.layout=function(t){this.offset=t;var e=8;return this.userType&&(e+=16),this.size=e,e},t.prototype.write=function(t){return r(t,this.offset,this.size),r(t,this.offset+4,o(this.boxtype)),this.userType?(t.set(this.userType,this.offset+8),24):8},t.prototype.toUint8Array=function(){var t=this.layout(0),e=new Uint8Array(t);return this.write(e),e},t}();l.Box=_;var m=function(t){function e(e,n,i){void 0===n&&(n=0),void 0===i&&(i=0),t.call(this,e),this.version=n,this.flags=i}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+4,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,this.version<<24|this.flags),n+4},e}(_);l.FullBox=m;var y=function(t){function e(e,n,i){t.call(this,"ftype"),this.majorBrand=e,this.minorVersion=n,this.compatibleBrands=i}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+4*(2+this.compatibleBrands.length),this.size},e.prototype.write=function(e){var n=this,i=t.prototype.write.call(this,e);return r(e,this.offset+i,o(this.majorBrand)),r(e,this.offset+i+4,this.minorVersion),i+=8,this.compatibleBrands.forEach(function(t){r(e,n.offset+i,o(t)),i+=4},this),i},e}(_);l.FileTypeBox=y;var v=function(t){function e(e,n){t.call(this,e),this.children=n}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e);return this.children.forEach(function(t){t&&(n+=t.layout(e+n))}),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return this.children.forEach(function(t){t&&(n+=t.write(e))}),n},e}(_);l.BoxContainerBox=v;var E=function(t){function e(e,n,r,o){t.call(this,"moov",i([e],n,[r,o])),this.header=e,this.tracks=n,this.extendsBox=r,this.userData=o}return f(e,t),e}(v);l.MovieBox=E;var S=function(t){function e(e,n,i,r,o,s,a,u){void 0===r&&(r=1),void 0===o&&(o=1),void 0===s&&(s=p),void 0===a&&(a=d),void 0===u&&(u=d),t.call(this,"mvhd",0,0),this.timescale=e,this.duration=n,this.nextTrackId=i,this.rate=r,this.volume=o,this.matrix=s,this.creationTime=a,this.modificationTime=u}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+16+4+2+2+8+36+24+4,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,s(this.creationTime)),r(e,this.offset+n+4,s(this.modificationTime)),r(e,this.offset+n+8,this.timescale),r(e,this.offset+n+12,this.duration),n+=16,r(e,this.offset+n,a(this.rate)),r(e,this.offset+n+4,h(this.volume)<<16),r(e,this.offset+n+8,0),r(e,this.offset+n+12,0),n+=16,r(e,this.offset+n,a(this.matrix[0])),r(e,this.offset+n+4,a(this.matrix[1])),r(e,this.offset+n+8,a(this.matrix[2])),r(e,this.offset+n+12,a(this.matrix[3])),r(e,this.offset+n+16,a(this.matrix[4])),r(e,this.offset+n+20,a(this.matrix[5])),r(e,this.offset+n+24,u(this.matrix[6])),r(e,this.offset+n+28,u(this.matrix[7])),r(e,this.offset+n+32,u(this.matrix[8])),n+=36,r(e,this.offset+n,0),r(e,this.offset+n+4,0),r(e,this.offset+n+8,0),r(e,this.offset+n+12,0),r(e,this.offset+n+16,0),r(e,this.offset+n+20,0),n+=24,r(e,this.offset+n,this.nextTrackId),n+=4},e}(m);l.MovieHeaderBox=S,function(t){t[t.TRACK_ENABLED=1]="TRACK_ENABLED",t[t.TRACK_IN_MOVIE=2]="TRACK_IN_MOVIE",t[t.TRACK_IN_PREVIEW=4]="TRACK_IN_PREVIEW"}(l.TrackHeaderFlags||(l.TrackHeaderFlags={}));var A=(l.TrackHeaderFlags,function(t){function e(e,n,i,r,o,s,a,u,h,c,l){void 0===a&&(a=0),void 0===u&&(u=0),void 0===h&&(h=p),void 0===c&&(c=d),void 0===l&&(l=d),t.call(this,"tkhd",0,e),this.trackId=n,this.duration=i,this.width=r,this.height=o,this.volume=s,this.alternateGroup=a,this.layer=u,this.matrix=h,this.creationTime=c,this.modificationTime=l}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+20+8+6+2+36+8,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,s(this.creationTime)),r(e,this.offset+n+4,s(this.modificationTime)),r(e,this.offset+n+8,this.trackId),r(e,this.offset+n+12,0),r(e,this.offset+n+16,this.duration),n+=20,r(e,this.offset+n,0),r(e,this.offset+n+4,0),r(e,this.offset+n+8,this.layer<<16|this.alternateGroup),r(e,this.offset+n+12,h(this.volume)<<16),n+=16,r(e,this.offset+n,a(this.matrix[0])),r(e,this.offset+n+4,a(this.matrix[1])),r(e,this.offset+n+8,a(this.matrix[2])),r(e,this.offset+n+12,a(this.matrix[3])),r(e,this.offset+n+16,a(this.matrix[4])),r(e,this.offset+n+20,a(this.matrix[5])),r(e,this.offset+n+24,u(this.matrix[6])),r(e,this.offset+n+28,u(this.matrix[7])),r(e,this.offset+n+32,u(this.matrix[8])),n+=36,r(e,this.offset+n,a(this.width)),r(e,this.offset+n+4,a(this.height)),n+=8},e}(m));l.TrackHeaderBox=A;var w=function(t){function e(e,n,i,r,o){void 0===i&&(i="unk"),void 0===r&&(r=d),void 0===o&&(o=d),t.call(this,"mdhd",0,0),this.timescale=e,this.duration=n,this.language=i,this.creationTime=r,this.modificationTime=o}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+16+4,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,s(this.creationTime)),r(e,this.offset+n+4,s(this.modificationTime)),r(e,this.offset+n+8,this.timescale),r(e,this.offset+n+12,this.duration),r(e,this.offset+n+16,c(this.language)<<16),n+20},e}(m);l.MediaHeaderBox=w;var T=function(t){function e(e,i){t.call(this,"hdlr",0,0),this.handlerType=e,this.name=i,this._encodedName=n(this.name)}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+8+12+(this._encodedName.length+1),this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,0),r(e,this.offset+n+4,o(this.handlerType)),r(e,this.offset+n+8,0),r(e,this.offset+n+12,0),r(e,this.offset+n+16,0),n+=20,e.set(this._encodedName,this.offset+n),e[this.offset+n+this._encodedName.length]=0,n+=this._encodedName.length+1},e}(m);l.HandlerBox=T;var b=function(t){function e(e){void 0===e&&(e=0),t.call(this,"smhd",0,0),this.balance=e}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+4,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,h(this.balance)<<16),n+4},e}(m);l.SoundMediaHeaderBox=b;var P=function(t){function e(e,n){void 0===e&&(e=0),void 0===n&&(n=g),t.call(this,"vmhd",0,0),this.graphicsMode=e,this.opColor=n}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+8,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,this.graphicsMode<<16|this.opColor[0]),r(e,this.offset+n+4,this.opColor[1]<<16|this.opColor[2]),n+8},e}(m);l.VideoMediaHeaderBox=P,l.SELF_CONTAINED_DATA_REFERENCE_FLAG=1;var I=function(t){function e(e,i){void 0===i&&(i=null),t.call(this,"url ",0,e),this.location=i,e&l.SELF_CONTAINED_DATA_REFERENCE_FLAG||(this._encodedLocation=n(i))}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e);return this._encodedLocation&&(n+=this._encodedLocation.length+1),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return this._encodedLocation&&(e.set(this._encodedLocation,this.offset+n),e[this.offset+n+this._encodedLocation.length]=0,n+=this._encodedLocation.length),n},e}(m);l.DataEntryUrlBox=I;var L=function(t){function e(e){t.call(this,"dref",0,0),this.entries=e}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e)+4;return this.entries.forEach(function(t){n+=t.layout(e+n)}),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,this.entries.length),this.entries.forEach(function(t){n+=t.write(e)}),n},e}(m);l.DataReferenceBox=L;var O=function(t){function e(e){t.call(this,"dinf",[e]),this.dataReference=e}return f(e,t),e}(v);l.DataInformationBox=O;var R=function(t){function e(e){t.call(this,"stsd",0,0),this.entries=e}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e);return n+=4,this.entries.forEach(function(t){n+=t.layout(e+n)}),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,this.entries.length),n+=4,this.entries.forEach(function(t){n+=t.write(e)}),n},e}(m);l.SampleDescriptionBox=R;var D=function(t){function e(e,n,i,r,o){t.call(this,"stbl",[e,n,i,r,o]),this.sampleDescriptions=e,this.timeToSample=n,this.sampleToChunk=i,this.sampleSizes=r,this.chunkOffset=o}return f(e,t),e}(v);l.SampleTableBox=D;var M=function(t){function e(e,n,i){t.call(this,"minf",[e,n,i]),this.header=e,this.info=n,this.sampleTable=i}return f(e,t),e}(v);l.MediaInformationBox=M;var k=function(t){function e(e,n,i){t.call(this,"mdia",[e,n,i]),this.header=e,this.handler=n,this.info=i}return f(e,t),e}(v);l.MediaBox=k;var N=function(t){function e(e,n){t.call(this,"trak",[e,n]),this.header=e,this.media=n}return f(e,t),e}(v);l.TrackBox=N;var x=function(t){function e(e,n,i,r,o){t.call(this,"trex",0,0),this.trackId=e,this.defaultSampleDescriptionIndex=n,this.defaultSampleDuration=i,this.defaultSampleSize=r,this.defaultSampleFlags=o}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+20,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,this.trackId),r(e,this.offset+n+4,this.defaultSampleDescriptionIndex),r(e,this.offset+n+8,this.defaultSampleDuration),r(e,this.offset+n+12,this.defaultSampleSize),r(e,this.offset+n+16,this.defaultSampleFlags),n+20},e}(m);l.TrackExtendsBox=x;var C=function(t){function e(e,n,r){t.call(this,"mvex",i([e],n,[r])),this.header=e,this.tracDefaults=n,this.levels=r}return f(e,t),e}(v);l.MovieExtendsBox=C;var F=function(t){function e(e,n){t.call(this,"meta",0,0),this.handler=e,this.otherBoxes=n}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e);return n+=this.handler.layout(e+n),this.otherBoxes.forEach(function(t){n+=t.layout(e+n)}),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return n+=this.handler.write(e),this.otherBoxes.forEach(function(t){n+=t.write(e)}),n},e}(m);l.MetaBox=F;var U=function(t){function e(e){t.call(this,"mfhd",0,0),this.sequenceNumber=e}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+4,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,this.sequenceNumber),n+4},e}(m);l.MovieFragmentHeaderBox=U,function(t){t[t.BASE_DATA_OFFSET_PRESENT=1]="BASE_DATA_OFFSET_PRESENT",t[t.SAMPLE_DESCRIPTION_INDEX_PRESENT=2]="SAMPLE_DESCRIPTION_INDEX_PRESENT",t[t.DEFAULT_SAMPLE_DURATION_PRESENT=8]="DEFAULT_SAMPLE_DURATION_PRESENT",t[t.DEFAULT_SAMPLE_SIZE_PRESENT=16]="DEFAULT_SAMPLE_SIZE_PRESENT",t[t.DEFAULT_SAMPLE_FLAGS_PRESENT=32]="DEFAULT_SAMPLE_FLAGS_PRESENT"}(l.TrackFragmentFlags||(l.TrackFragmentFlags={}));var B=l.TrackFragmentFlags,H=function(t){function e(e,n,i,r,o,s,a){t.call(this,"tfhd",0,e),this.trackId=n,this.baseDataOffset=i,this.sampleDescriptionIndex=r,this.defaultSampleDuration=o,this.defaultSampleSize=s,this.defaultSampleFlags=a}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e)+4,i=this.flags;return i&B.BASE_DATA_OFFSET_PRESENT&&(n+=8),i&B.SAMPLE_DESCRIPTION_INDEX_PRESENT&&(n+=4),i&B.DEFAULT_SAMPLE_DURATION_PRESENT&&(n+=4),i&B.DEFAULT_SAMPLE_SIZE_PRESENT&&(n+=4),i&B.DEFAULT_SAMPLE_FLAGS_PRESENT&&(n+=4),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e),i=this.flags;return r(e,this.offset+n,this.trackId),n+=4,i&B.BASE_DATA_OFFSET_PRESENT&&(r(e,this.offset+n,0),r(e,this.offset+n+4,this.baseDataOffset),n+=8),i&B.SAMPLE_DESCRIPTION_INDEX_PRESENT&&(r(e,this.offset+n,this.sampleDescriptionIndex),n+=4),i&B.DEFAULT_SAMPLE_DURATION_PRESENT&&(r(e,this.offset+n,this.defaultSampleDuration),n+=4),i&B.DEFAULT_SAMPLE_SIZE_PRESENT&&(r(e,this.offset+n,this.defaultSampleSize),n+=4),i&B.DEFAULT_SAMPLE_FLAGS_PRESENT&&(r(e,this.offset+n,this.defaultSampleFlags),n+=4),n},e}(m);l.TrackFragmentHeaderBox=H;
var j=function(t){function e(e){t.call(this,"tfdt",0,0),this.baseMediaDecodeTime=e}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+4,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,this.baseMediaDecodeTime),n+4},e}(m);l.TrackFragmentBaseMediaDecodeTimeBox=j;var G=function(t){function e(e,n,i){t.call(this,"traf",[e,n,i]),this.header=e,this.decodeTime=n,this.run=i}return f(e,t),e}(v);l.TrackFragmentBox=G,function(t){t[t.IS_LEADING_MASK=201326592]="IS_LEADING_MASK",t[t.SAMPLE_DEPENDS_ON_MASK=50331648]="SAMPLE_DEPENDS_ON_MASK",t[t.SAMPLE_DEPENDS_ON_OTHER=16777216]="SAMPLE_DEPENDS_ON_OTHER",t[t.SAMPLE_DEPENDS_ON_NO_OTHERS=33554432]="SAMPLE_DEPENDS_ON_NO_OTHERS",t[t.SAMPLE_IS_DEPENDED_ON_MASK=12582912]="SAMPLE_IS_DEPENDED_ON_MASK",t[t.SAMPLE_HAS_REDUNDANCY_MASK=3145728]="SAMPLE_HAS_REDUNDANCY_MASK",t[t.SAMPLE_PADDING_VALUE_MASK=917504]="SAMPLE_PADDING_VALUE_MASK",t[t.SAMPLE_IS_NOT_SYNC=65536]="SAMPLE_IS_NOT_SYNC",t[t.SAMPLE_DEGRADATION_PRIORITY_MASK=65535]="SAMPLE_DEGRADATION_PRIORITY_MASK"}(l.SampleFlags||(l.SampleFlags={})),l.SampleFlags,!function(t){t[t.DATA_OFFSET_PRESENT=1]="DATA_OFFSET_PRESENT",t[t.FIRST_SAMPLE_FLAGS_PRESENT=4]="FIRST_SAMPLE_FLAGS_PRESENT",t[t.SAMPLE_DURATION_PRESENT=256]="SAMPLE_DURATION_PRESENT",t[t.SAMPLE_SIZE_PRESENT=512]="SAMPLE_SIZE_PRESENT",t[t.SAMPLE_FLAGS_PRESENT=1024]="SAMPLE_FLAGS_PRESENT",t[t.SAMPLE_COMPOSITION_TIME_OFFSET=2048]="SAMPLE_COMPOSITION_TIME_OFFSET"}(l.TrackRunFlags||(l.TrackRunFlags={}));var Y=l.TrackRunFlags,V=function(t){function e(e,n,i,r){t.call(this,"trun",1,e),this.samples=n,this.dataOffset=i,this.firstSampleFlags=r}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e)+4,i=this.samples.length,r=this.flags;return r&Y.DATA_OFFSET_PRESENT&&(n+=4),r&Y.FIRST_SAMPLE_FLAGS_PRESENT&&(n+=4),r&Y.SAMPLE_DURATION_PRESENT&&(n+=4*i),r&Y.SAMPLE_SIZE_PRESENT&&(n+=4*i),r&Y.SAMPLE_FLAGS_PRESENT&&(n+=4*i),r&Y.SAMPLE_COMPOSITION_TIME_OFFSET&&(n+=4*i),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e),i=this.samples.length,o=this.flags;r(e,this.offset+n,i),n+=4,o&Y.DATA_OFFSET_PRESENT&&(r(e,this.offset+n,this.dataOffset),n+=4),o&Y.FIRST_SAMPLE_FLAGS_PRESENT&&(r(e,this.offset+n,this.firstSampleFlags),n+=4);for(var s=0;i>s;s++){var a=this.samples[s];o&Y.SAMPLE_DURATION_PRESENT&&(r(e,this.offset+n,a.duration),n+=4),o&Y.SAMPLE_SIZE_PRESENT&&(r(e,this.offset+n,a.size),n+=4),o&Y.SAMPLE_FLAGS_PRESENT&&(r(e,this.offset+n,a.flags),n+=4),o&Y.SAMPLE_COMPOSITION_TIME_OFFSET&&(r(e,this.offset+n,a.compositionTimeOffset),n+=4)}return n},e}(m);l.TrackRunBox=V;var z=function(t){function e(e,n){t.call(this,"moof",i([e],n)),this.header=e,this.trafs=n}return f(e,t),e}(v);l.MovieFragmentBox=z;var W=function(t){function e(e){t.call(this,"mdat"),this.chunks=e}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e);return this.chunks.forEach(function(t){n+=t.length}),this.size=n},e.prototype.write=function(e){var n=this,i=t.prototype.write.call(this,e);return this.chunks.forEach(function(t){e.set(t,n.offset+i),i+=t.length},this),i},e}(_);l.MediaDataBox=W;var K=function(t){function e(e,n){t.call(this,e),this.dataReferenceIndex=n}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+8,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,0),r(e,this.offset+n+4,this.dataReferenceIndex),n+8},e}(_);l.SampleEntry=K;var q=function(t){function e(e,n,i,r,o,s){void 0===i&&(i=2),void 0===r&&(r=16),void 0===o&&(o=44100),void 0===s&&(s=null),t.call(this,e,n),this.channelCount=i,this.sampleSize=r,this.sampleRate=o,this.otherBoxes=s}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e)+20;return this.otherBoxes&&this.otherBoxes.forEach(function(t){n+=t.layout(e+n)}),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return r(e,this.offset+n,0),r(e,this.offset+n+4,0),r(e,this.offset+n+8,this.channelCount<<16|this.sampleSize),r(e,this.offset+n+12,0),r(e,this.offset+n+16,this.sampleRate<<16),n+=20,this.otherBoxes&&this.otherBoxes.forEach(function(t){n+=t.write(e)}),n},e}(K);l.AudioSampleEntry=q,l.COLOR_NO_ALPHA_VIDEO_SAMPLE_DEPTH=24;var X=function(t){function e(e,n,i,r,o,s,a,u,h,c){if(void 0===o&&(o=""),void 0===s&&(s=72),void 0===a&&(a=72),void 0===u&&(u=1),void 0===h&&(h=l.COLOR_NO_ALPHA_VIDEO_SAMPLE_DEPTH),void 0===c&&(c=null),t.call(this,e,n),this.width=i,this.height=r,this.compressorName=o,this.horizResolution=s,this.vertResolution=a,this.frameCount=u,this.depth=h,this.otherBoxes=c,o.length>31)throw new Error("invalid compressor name")}return f(e,t),e.prototype.layout=function(e){var n=t.prototype.layout.call(this,e)+16+12+4+2+32+2+2;return this.otherBoxes&&this.otherBoxes.forEach(function(t){n+=t.layout(e+n)}),this.size=n},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);r(e,this.offset+n,0),r(e,this.offset+n+4,0),r(e,this.offset+n+8,0),r(e,this.offset+n+12,0),n+=16,r(e,this.offset+n,this.width<<16|this.height),r(e,this.offset+n+4,a(this.horizResolution)),r(e,this.offset+n+8,a(this.vertResolution)),n+=12,r(e,this.offset+n,0),r(e,this.offset+n+4,this.frameCount<<16),n+=6,e[this.offset+n]=this.compressorName.length;for(var i=0;31>i;i++)e[this.offset+n+i+1]=i<this.compressorName.length?127&this.compressorName.charCodeAt(i):0;return n+=32,r(e,this.offset+n,this.depth<<16|65535),n+=4,this.otherBoxes&&this.otherBoxes.forEach(function(t){n+=t.write(e)}),n},e}(K);l.VideoSampleEntry=X;var $=function(t){function e(e,n){t.call(this,e),this.data=n}return f(e,t),e.prototype.layout=function(e){return this.size=t.prototype.layout.call(this,e)+this.data.length,this.size},e.prototype.write=function(e){var n=t.prototype.write.call(this,e);return e.set(this.data,this.offset+n),n+this.data.length},e}(_);l.RawTag=$},function(t,e,n){(function(e){var i,r=n(74),o=n(69),s=(o.BaseTransform,n(119));n(120),t.exports=i=function(){o.BaseParser.prototype.constructor.apply(this,arguments),this.parser=new s,this.parser.onFrame=this._onMp3Frame.bind(this),this.parser.onNoise=this._onNoise.bind(this),this.parser.onClose=this._onClose.bind(this),this._sampleRate=0,this._bitRate=0,this._timestamp=0},i.prototype=o.createBaseParser({constructor:i,_onMp3Frame:function(t,n,i){r("Found frame length "+t.length+" bitRate="+n+", sampleRate="+i);var s=new e(t),a=1152;s.meta={mimeType:"audio/mpeg",codecId:2,channels:2,bitRate:n,sampleRate:i,sampleSize:16},s.duration=a,s.timestamp=this._timestamp,this.enqueue(new o.Transfer(s,"buffer")),this._bitRate=n,this._timestamp+=a},_onNoise:function(){r("mp3 has noise")},_onClose:function(){r("parser closed")},_parse:function(t){return r("parse called"),t.data.empty?(r("empty transfer"),void this.enqueue(t)):void this.parser.push(new Uint8Array(t.data))}})}).call(e,n(70).Buffer)},function(t,e,n){var i=n(74),r=[32,64,96,128,160,192,224,256,288,320,352,384,416,448,32,48,56,64,80,96,112,128,160,192,224,256,320,384,32,40,48,56,64,80,96,112,128,160,192,224,256,320,32,48,56,64,80,96,112,128,144,160,176,192,224,256,8,16,24,32,40,48,56,64,80,96,112,128,144,160],o=[44100,48e3,32e3,22050,24e3,16e3,11025,12e3,8e3],s=function(){function t(){this.buffer=null,this.bufferSize=0}return t.prototype.push=function(t){var e;if(this.bufferSize>0){var n=t.length+this.bufferSize;if(!this.buffer||this.buffer.length<n){var r=new Uint8Array(n);this.bufferSize>0&&r.set(this.buffer.subarray(0,this.bufferSize)),this.buffer=r}this.buffer.set(t,this.bufferSize),this.bufferSize=n,t=this.buffer,e=n}else e=t.length;i("push "+e);for(var o,s=0;e>s&&(o=this._parse(t,s,e))>0;)s+=o;var a=e-s;a>0&&(!this.buffer||this.buffer.length<a?this.buffer=new Uint8Array(t.subarray(s,e)):this.buffer.set(t.subarray(s,e))),this.bufferSize=a},t.prototype._parse=function(t,e,n){if(i("_parse"),e+2>n)return-1;if(255===t[e]||224===(224&t[e+1])){if(e+24>n)return-1;var s=t[e+1]>>3&3,a=t[e+1]>>1&3,u=t[e+2]>>4&15,h=t[e+2]>>2&3,c=!!(2&t[e+2]);if(1!==s&&0!==u&&15!==u&&3!==h){var l=3===s?3-a:3===a?3:4,f=1e3*r[14*l+u-1],d=3===s?0:2===s?1:2,p=o[3*d+h],g=c?1:0,_=3===a?(3===s?12:6)*f/p+g<<2:(3===s?144:72)*f/p+g|0;return e+_>n?-1:(this.onFrame&&(i("onFrame"),this.onFrame(t.subarray(e,e+_),f,p)),_)}}for(var m=e+2;n>m;){if(255===t[m-1]&&224===(224&t[m]))return this.onNoise&&this.onNoise(t.subarray(e,m-1)),m-e-1;m++}return-1},t.prototype.close=function(){this.bufferSize>0&&this.onNoise&&this.onNoise(this.buffer.subarray(0,this.bufferSize)),this.buffer=null,this.bufferSize=0,this.onClose&&this.onClose()},t}();t.exports=s},function(t,e){var n=1e9;t.exports={TIMESCALE_SECONDS:n}},function(t,e,n){var i,r=n(122),o=n(69),s=o.BaseSink,a=n(123);t.exports=i=function(t){if(s.prototype.constructor.call(this),!r.haveMediaSourceSupportMimeType(t))throw new Error("Local MediaSource doesn't support provided MIME type: "+t);var e;e=arguments.length>1?Array.prototype.slice.call(arguments):t instanceof Array?t:[t],this.mimeTypes=e,this.mediaSource=new MediaSource,this.mseWriter=new a(this.mediaSource),this.dataSources=[],this.selectedDataSourceIndex=0,this.mimeTypes.forEach(function(t){var e={mimeType:t};this.mseWriter.listen(e),this.dataSources.push(e)}.bind(this))},i.prototype=o.createBaseSink({constructor:i,_onData:function(){var t=this.dataSources[this.selectedDataSourceIndex];if(!t||!t.onData)throw new Error("DataSource is not existing or has no onData function defined");var e=this.dequeue();e&&t.onData(e.data)},getMediaSourceUrl:function(){return URL.createObjectURL(this.mediaSource)}})},function(t,e){var n;t.exports=n={haveGlobalWindow:function(){return"undefined"!=typeof window},haveMediaSourceExtensions:function(){return n.haveGlobalWindow()&&window.MediaSource},haveMediaSourceSupportMimeType:function(t){return n.haveMediaSourceExtensions()&&window.MediaSource.isTypeSupported(t)}}},function(t,e){var n=function(){function t(t,e){this.mediaSource=t,this.dataSource=e,this.dataSource.onData=this.pushData.bind(this),this.updateEnabled=!1,this.buffer=[],this.sourceBuffer=null,this.sourceBufferUpdatedBound=null}return t.prototype.allowWriting=function(){this.updateEnabled=!0,this.update()},t.prototype.pushData=function(t){this.buffer.push(t),this.update()},t.prototype.update=function(){if(this.updateEnabled&&0!==this.buffer.length){this.sourceBuffer||(this.sourceBuffer=this.mediaSource.addSourceBuffer(this.dataSource.mimeType),this.sourceBufferUpdatedBound=this._sourceBufferUpdated.bind(this),this.sourceBuffer.addEventListener("update",this.sourceBufferUpdatedBound)),this.updateEnabled=!1;var t=this.buffer.shift();if(null===t)return void this.sourceBuffer.removeEventListener("update",this.sourceBufferUpdatedBound);t.timestamp&&(this.sourceBuffer.timestampOffset=t.timestamp/1e9),this.sourceBuffer.appendBuffer(t)}},t.prototype._sourceBufferUpdated=function(t){this.updateEnabled=!0,this.update()},t.prototype.finish=function(){this.buffer.push(null),this.update()},t}(),i=function(){function t(t){this.bufferWriters=[],this.mediaSource=t,this.mediaSourceOpened=!1,this.mediaSource.addEventListener("sourceopen",function(t){this.mediaSourceOpened=!0,this.bufferWriters.forEach(function(t){t.allowWriting()})}.bind(this)),this.mediaSource.addEventListener("sourceend",function(t){this.mediaSourceOpened=!1}.bind(this))}return t.prototype.listen=function(t){var e=new n(this.mediaSource,t);this.bufferWriters.push(e),this.mediaSourceOpened&&e.allowWriting()},t}();t.exports=i},function(t,e,n){var i,r,o=n(69);r=function(t){o.BasePushSrc.prototype.constructor.call(this);var e=this.req=new XMLHttpRequest;e.open("GET",t,!0),e.responseType="arraybuffer",e.onload=function(t){this.enqueue(new o.Transfer(new Uint8Array(e.response),"binary")),this.enqueue(new o.Transfer(null,"binary"))}.bind(this),e.send()},r.prototype=o.createBasePushSrc({constructor:r}),t.exports=i={Src:r}},function(t,e,n){var i,r,o,s=n(69),a=n(126);n(76),r=function(t,e){s.prototype.constructor.call(this);var n=a.createReadStream(t,e);this.on("end",function(){n.close()}),this.addOutput(n)},r.prototype=s.create({constructor:r}),o=function(t,e){s.prototype.constructor.call(this);var n=a.createWriteStream(t,e);this.on("finish",function(){n.close()}),this.addInput(n)},o.prototype=s.create({constructor:o}),t.exports=i={Src:r,Sink:o}},function(t,e,n){var i=n(122);t.exports=i.haveGlobalWindow()?new(n(127)):n(!function(){var t=new Error('Cannot find module "fs"');throw t.code="MODULE_NOT_FOUND",t}())},function(t,e,n){var i;i=function(){function t(){return!1}function e(t){return!(!(t&&t.data instanceof Object)||n(t))}function n(t){return!!(t&&t.data instanceof ArrayBuffer)}function i(t,n){var i,r=t.length,o=n;for(i=0;r>i;++i){if(!e(o))throw new Error("ENOENT");o=o.data[t[i]]}return o}String.prototype.trim||!function(){var t=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;String.prototype.trim=function(){return this.replace(t,"")}}();var r=function(){var t=Date.now();this.root={mtime:t,ctime:t,atime:t,data:{}}};return r.prototype.join=function(){var t=[],e=arguments||[];return t=this.parse(Array.prototype.slice.call(e).join("/")),("/"===e[0][0]?"/":"")+t.join("/")},r.prototype.parse=function(t){var e=[];return t=t||"/",t.split(/\/+/).forEach(function(t){t=t.trim(),t.length&&"."!==t&&(".."===t?e.pop():e.push(t))}),e},r.prototype.fileSizeSI=function(t,e,n,i,r){return(e=Math,n=e.log,i=1e3,r=n(t)/n(i)|0,t/e.pow(i,r)).toFixed(r?2:0)+" "+(r?"kMGTPEZY"[--r]+"B":"Bytes")},r.prototype.fileSizeIEC=function(t,e,n,i,r){return(e=Math,n=e.log,i=1024,r=n(t)/n(i)|0,t/e.pow(i,r)).toFixed(r?2:0)+" "+(r?"KMGTPEZY"[--r]+"iB":"Bytes")},r.prototype.statSync=function(n){var r=this.parse(n),o=i(r,this.root),s=e(o);if(!o||!o.data)throw new Error("ENOENT");return{size:s?Object.keys(o.data).length:o.data.byteLength,ctime:new Date(o.ctime),mtime:new Date(o.mtime),atime:new Date(o.atime),isFile:function(){return!s},isDirectory:function(){return s},isBlockDevice:t,isCharacterDevice:t,isSymbolicLink:t,isFIFO:t,isSocket:t}},r.prototype.existsSync=function(t){var n,i=this.parse(t),r=i.length,o=this.root;for(n=0;r>n;++n){if(!e(o))return!1;o=o.data[i[n]]}return!!o},r.prototype.mkdirSync=function(t){var n=this.parse(t),r=i(n.slice(0,n.length-1),this.root),o=Date.now();if(!n.length||!e(r))throw new Error("ENODIR");r.data[n[n.length-1]]={data:{},ctime:o,mtime:o,atime:o},r.mtime=o},r.prototype.mkdirpSync=function(t){var r,o,s,a=this.parse(t),u=a.length;if(!a.length)throw new Error("ENODIR");for(o=0;u>o;++o){if(r=a.slice(0,o+1),s=i(r,this.root),n(s))throw new Error("ENODIR");e(s)||this.mkdirSync(r.join("/"))}},r.prototype.readdirSync=function(t){var n=this.parse(t),r=i(n,this.root);if(!e(r))throw new Error("ENODIR");return r.atime=Date.now(),Object.keys(r.data)},r.prototype.rmdirSync=function(t){var n=this.parse(t),r=i(n,this.root);if(dirname=n.pop(),parentDir=i(n,this.root),!e(r))throw new Error("ENODIR");if(Object.keys(r.data).length)throw new Error("ENOTEMPTY");delete parentDir.data[dirname],parentDir.mtime=Date.now()},r.prototype.rmrfSync=function(t){var n=this.parse(t),r=n.pop(),o=i(n,this.root);if(!e(o))throw new Error("ENODIR");r?delete o.data[r]:o.data={},o.mtime=Date.now()},r.prototype.writeFileSync=function(t,n,r){var o,s,a=this.parse(t),u=a.pop(),h=this.existsSync(t),c=i(a,this.root);if(!e(c))throw new Error("ENODIR");if(!u)throw new Error("EINVALIDPATH");if(r=r||{encoding:!0},"string"==typeof n){o=new ArrayBuffer(2*n.length);for(var l=new Uint16Array(o),f=0,d=n.length;d>f;++f)l[f]=n.charCodeAt(f)}else o=n;s=Date.now(),c.data[u]={data:o,ctime:s,mtime:s,atime:s},h||(c.mtime=s),c.atime=s},r.prototype.readFileSync=function(t,e){var r=this.parse(t),o=i(r,this.root),e=e||{encoding:!1};if(!n(o))throw new Error("ENOENT");return o.atime=Date.now(),e.encoding?String.fromCharCode.apply(null,new Uint16Array(o.data)):o.data},r.prototype.renameSync=function(t,n){var r=this.parse(t),o=i(r,this.root),s=i(r.slice(0,r.length-1),this.root),a=r[r.length-1],u=this.parse(n),h=i(u,this.root),c=i(u.slice(0,u.length-1),this.root),l=u[u.length-1],f=Date.now();if(!r.length||!u.length)throw new Error("ENOENT");if(!e(s||!e(c)))throw new Error("ENODIR");if(h)throw new Error("EEXISTS");c.data[l]=h=o,h.ctime=f,c.mtime=f,delete s.data[a],s.mtime=f},["stat","exists","readdir","mkdirp","mkdir","rmdir","rmrf","unlink"].forEach(function(t){r.prototype[t]=function(e,n){try{var i=this[t+"Sync"](e)}catch(r){return n(r)}return n(null,i)}}),["writeFile","readFile"].forEach(function(t){r.prototype[t]=function(e,n,i){i||(i=n,n=void 0);try{var r=this[t+"Sync"](e,n)}catch(o){return i(o)}return i(null,r)}}),["rename"].forEach(function(t){r.prototype[t]=function(e,n,i){try{var r=this[t+"Sync"](e,n)}catch(o){return i(o)}return i(null,r)}}),r}.call(e,n,e,t),!(void 0!==i&&(t.exports=i))},function(t,e){var n={HTTP:"http",RTMP:"rtmp",HLS:"hls"};t.exports=n},function(t,e){t.exports={AAC:"audio/aac",M3U8:"application/x-mpegURL",HLS:"application/vnd.apple.mpegurl",MP4A:"audio/mp4",MP3:"audio/mpeg",OGG:"audio/ogg",WAV:"audio/wav",WEBMA:"audio/webm",getTypeByExtension:function(t){var e={mp3:this.MP3,aac:this.AAC,mp4:this.MP4A,mp4a:this.MP4A,ogg:this.OGG,oga:this.OGG,opus:this.OGG,webm:this.WEBM,wav:this.WAV,m3u8:this.M3U8};return e[t]||null}}},function(t,e,n,i,r,o){function s(t,e,n){for(var i=-1,r=h(e),o=r.length;++i<o;){var s=r[i],a=t[s],u=n(a,e[s],s,t,e);(u===u?u===a:a!==a)&&(void 0!==a||s in t)||(t[s]=u)}return t}var a=n(i),u=n(r),h=n(o),c=u(function(t,e,n){return n?s(t,e,n):a(t,e)});t.exports=c},function(t,e,n,i,r){function o(t,e){return null==e?t:s(e,a(e),t)}var s=n(i),a=n(r);t.exports=o},function(t,e,n,i,r,o){function s(t){return function(e){return null==e?void 0:e[t]}}function a(t){return null!=t&&h(S(t))}function u(t,e){return t="number"==typeof t||_.test(t)?+t:-1,e=null==e?E:e,t>-1&&t%1==0&&e>t}function h(t){return"number"==typeof t&&t>-1&&t%1==0&&E>=t}function c(t){for(var e=f(t),n=e.length,i=n&&t.length,r=!!i&&h(i)&&(g(t)||p(t)),o=-1,s=[];++o<n;){var a=e[o];(r&&u(a,i)||y.call(t,a))&&s.push(a)}return s}function l(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}function f(t){if(null==t)return[];l(t)||(t=Object(t));var e=t.length;e=e&&h(e)&&(g(t)||p(t))&&e||0;for(var n=t.constructor,i=-1,r="function"==typeof n&&n.prototype===t,o=Array(e),s=e>0;++i<e;)o[i]=i+"";for(var a in t)s&&u(a,e)||"constructor"==a&&(r||!y.call(t,a))||o.push(a);return o}var d=n(i),p=n(r),g=n(o),_=/^\d+$/,m=Object.prototype,y=m.hasOwnProperty,v=d(Object,"keys"),E=9007199254740991,S=s("length"),A=v?function(t){var e=null==t?void 0:t.constructor;return"function"==typeof e&&e.prototype===t||"function"!=typeof t&&a(t)?c(t):l(t)?v(t):[]}:c;t.exports=A},function(t,e,n,i,r,o){function s(t){return h(function(e,n){var i=-1,r=null==e?0:n.length,o=r>2?n[r-2]:void 0,s=r>2?n[2]:void 0,h=r>1?n[r-1]:void 0;for("function"==typeof o?(o=a(o,h,5),r-=2):(o="function"==typeof h?h:void 0,r-=o?1:0),s&&u(n[0],n[1],s)&&(o=3>r?void 0:o,r=1);++i<r;){var c=n[i];c&&t(e,c,o)}return e})}var a=n(i),u=n(r),h=n(o);t.exports=s},function(t,e,n,i){function r(t,e){return p(t,e,l)}function o(t){return function(e){return null==e?void 0:e[t]}}function s(t,e){return function(n,i){var r=n?g(n):0;if(!u(r))return t(n,i);for(var o=e?r:-1,s=h(n);(e?o--:++o<r)&&i(s[o],o,s)!==!1;);return n}}function a(t){return function(e,n,i){for(var r=h(e),o=i(e),s=o.length,a=t?s:-1;t?a--:++a<s;){var u=o[a];if(n(r[u],u,r)===!1)break}return e}}function u(t){return"number"==typeof t&&t>-1&&t%1==0&&f>=t}function h(t){return c(t)?t:Object(t)}function c(t){var e=typeof t;return!!t&&("object"==e||"function"==e)}var l=n(i),f=9007199254740991,d=s(r),p=a(),g=o("length");t.exports=d}]))},function(t,e,n){var i=n(22),r=function(t,e){var n=e||{},r=n.bufferLen||4096,o=n.numChannels||2;this.context=t.context,this.node=(this.context.createScriptProcessor||this.context.createJavaScriptNode).call(this.context,r,o,o);var s=new i;s.postMessage({command:"init",config:{sampleRate:this.context.sampleRate,numChannels:o}});var a,u=!1;this.node.onaudioprocess=function(t){if(u){for(var e=[],n=0;o>n;n++)e.push(t.inputBuffer.getChannelData(n));s.postMessage({command:"record",buffer:e})}},this.configure=function(t){for(var e in t)t.hasOwnProperty(e)&&(n[e]=t[e])},this.record=function(){u=!0},this.stop=function(){u=!1},this.clear=function(){s.postMessage({command:"clear"})},this.getBuffer=function(t){a=t||n.callback,s.postMessage({command:"getBuffer"})},this.exportWAV=function(t,e){if(a=t||n.callback,e=e||n.type||"audio/wav",!a)throw new Error("Callback not set");s.postMessage({command:"exportWAV",type:e})},s.onmessage=function(t){var e=t.data;a(e)},t.connect(this.node),this.node.connect(this.context.destination)};r.forceDownload=function(t,e){var n=(window.URL||window.webkitURL).createObjectURL(t),i=window.document.createElement("a");i.href=n,i.download=e||"output.wav";var r=document.createEvent("Event");r.initEvent("click",!0,!0),i.dispatchEvent(r)},t.exports=r},function(t,e){t.exports=function(t){function e(i){if(n[i])return n[i].exports;var r=n[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,e),r.loaded=!0,r.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){function i(){return this._hooksPause.every(function(t){return t.call()})}function r(t){var e=t.resource_id||t.id||t.cid;if(!e)throw new Error("Your model should have a unique `id`, `cid` or `resource_id` property");return e}function o(t){C=t,t&&(x.AudioManagerStates=t.States)}function s(){var t=G();return p.call(this,!0).done(function(e){t.resolve(e.url)}).fail(function(){t.reject()}),t.promise()}function a(t){var e,n=this.options;return e={id:this.getId(),src:t.url,duration:$.result(n.duration),title:this.options.title,mimeType:t.mimeType,forceSingle:n.useSinglePlayer},C.createAudioPlayer(e,{streamUrlProvider:s.bind(this)})}function u(t,e){var n=e?"on":"off";t[n]("state-change",L,this)[n]("position-change",c,this)[n]("metadata",h,this)}function h(){this.trigger(Y.METADATA)}function c(){this._prevPosition!==this.currentTime()&&(this.trigger(Y.TIME),this._prevPosition=this.currentTime())}function l(){this._initAudioDefer&&(this._initAudioDefer.reject(),this._initAudioDefer=null,this.streamInfo=null)}function f(){l.call(this),this.controller&&(this._storedPosition=this.currentTime(),this.controller.kill(),this.controller=null,this.trigger(Y.RESET))}function d(){this._registerPlays=!0,this.pause(),this.trigger(Y.FINISH)}function p(t){var e=G(),n=this.streamInfo&&!t;return n?e.resolve(this.streamInfo):g.call(this).done(function(t){var n=q.choosePreferredStream(t,this.options);n?e.resolve(n):(this.trigger(Y.NO_PROTOCOL),F.warn("(%s) Could not match a protocol of given media descriptor to one of the supported protocols (%s), aborting attempt to play.",this.getId(),this.options.protocols),e.reject())}.bind(this)).fail(function(t){F.warn("(%s) Stream request failed with status: %d",this.getId(),t.status),_.call(this,t),m.call(this,t),e.reject()}.bind(this)),e.promise()}function g(){if(this.options.streamUrls&&!this._usedPrefetchUrls){var t,e=G();return this._usedPrefetchUrls=!0,t=$.result(this.options.streamUrls),e.resolve(t),e.promise()}return this.ajax({type:"GET",url:$.result(this.options.streamUrlsEndpoint),dataType:"json",async:this.options.asyncFetch,timeout:this.options.asyncFetch?nt:et})}function _(t){var e=t.status>=400&&-1!==(t.responseText||"").indexOf("geo_blocked");e&&this.trigger(Y.GEO_BLOCKED)}function m(t){0===t.status&&this.trigger(Y.NO_CONNECTION)}function y(){return this.controller&&this.controller.getCapabilities&&this.controller.getCapabilities()?this.controller.getCapabilities().needsUrlRefresh:!0}function v(t){if(!y.call(this))return!0;var e=this._initAudioDefer&&this._initAudioDefer.state(),n=q.streamValidForPlayingFrom(this.streamInfo,t);return this.controller&&this.controller.hasStreamUrlProvider&&this.controller.hasStreamUrlProvider()?!0:e&&("pending"===e||"resolved"===e&&n)}function E(t){t&&!this._bufferingTimeout?this._bufferingTimeout=window.setTimeout(function(){this._isBuffering=!0,this.trigger(Y.BUFFERRING_START)}.bind(this),it):t||(this._bufferingTimeout&&(window.clearTimeout(this._bufferingTimeout),this._bufferingTimeout=null),this._isBuffering&&(this._isBuffering=!1,this.trigger(Y.BUFFERRING_END)))}function S(){this.off(Y.TIME,this.seekTimeEventHandler),this.trigger(Y.SEEKED),this.seekTimeEventHandler=null}function A(){this._errorRecoveryFlagsResetTimeout=window.setTimeout(function(){this._errorRecoveryTime=null,this._errorRecoveryCounts=0}.bind(this),at)}function w(){this._errorRecoveryFlagsResetTimeout&&window.clearTimeout(this._errorRecoveryFlagsResetTimeout)}function T(){var t=this.isPlaying(),e=Date.now();return w.call(this),this._errorRecoveryTime&&this._errorRecoveryTime+ot>e&&this._errorRecoveryCounts>st?void this.trigger(Y.AUDIO_ERROR,this):(this._errorRecoveryTime=Date.now(),this._errorRecoveryCounts++,f.call(this),void(t&&this.play({seek:this.currentTime(),userInitiated:!1})))}function b(t){this.logAudioError({error_code:t,protocol:this.streamInfo?this.streamInfo.protocol:void 0,player_type:this.controller?this.controller.getType():void 0,host:this.streamInfo?X.getUrlHost(this.streamInfo.url):void 0,url:this.streamInfo?this.streamInfo.url:void 0})}function P(){var t,e=C.Errors;if(!this.controller)return F.error("(%s) Controller is null, aborting error handler.",this.getId(),this),b.call(this,null),void T.call(this);switch(t=this.controller&&this.controller.getErrorID(),F.error("(%s) %s",this.getId(),this.controller.getErrorMessage?this.controller.getErrorMessage():"Controller does not provide getErrorMessage()"),D(t,"MSE","GENERIC","HTML5_AUDIO_DECODE","HTML5_AUDIO_SRC_NOT_SUPPORTED","FLASH_PROXY","FLASH_RTMP_CONNECT_FAILED","FLASH_RTMP_CANNOT_PLAY_STREAM")&&b.call(this,t),t){case e.FLASH_PROXY_CANT_LOAD_FLASH:this.trigger(Y.FLASH_NOT_LOADED);break;case e.FLASH_PROXY_FLASH_BLOCKED:this.trigger(Y.FLASH_BLOCK);break;case e.FLASH_RTMP_CONNECT_FAILED:$.without(this.options.protocols,W.RTMP);case e.FLASH_RTMP_CANNOT_PLAY_STREAM:case e.FLASH_RTMP_CONNECT_CLOSED:case e.HTML5_AUDIO_NETWORK:case e.HTML5_AUDIO_ABORTED:case e.HTML5_AUDIO_DECODE:case e.HTML5_AUDIO_SRC_NOT_SUPPORTED:case e.GENERIC_AUDIO_ENDED_EARLY:case e.MSE_BAD_OBJECT_STATE:case e.MSE_NOT_SUPPORTED:case e.MSE_MP3_NOT_SUPPORTED:case e.MSE_HLS_NOT_VALID_PLAYLIST:case e.MSE_HLS_PLAYLIST_NOT_FOUND:case e.MSE_HLS_SEGMENT_NOT_FOUND:T.call(this);break;case e.GENERIC_AUDIO_OVERRUN:d.call(this);break;default:F.error("(%s) Unhandled audio error code: %s",this.getId(),t,this)}}function I(t,e){switch(this.options.debug&&O.call(this,t,e),t){case Y.PAUSE:this._isPlaying=!1,this._isPlayActionQueued=!1;break;case Y.PLAY:var n=e;this.toggleMute(J.muted),this.setVolume(J.volume),this._isPlaying=!1,this._isPlayActionQueued=!0,this._userInitiatedPlay=void 0!==n.userInitiated?!!n.userInitiated:!0,M.call(this);break;case Y.PLAY_START:this._isPlaying=!0,this._isPlayActionQueued=!1,this._registerPlays&&this.registerPlay();break;case Y.BUFFERRING_START:case Y.SEEK:this._isPlaying&&(this._isPlaying=!1,this._isPlayActionQueued=!0);break;case Y.BUFFERRING_END:case Y.SEEKED:this._isPlayActionQueued&&(this._isPlaying=!0,this._isPlayActionQueued=!1);break;case Y.NO_CONNECTION:this._hasNoConnection=!0,this._noConnectionSince=Date.now();break;case Y.NO_STREAMS:this.pause(),E.call(this,!1),l.call(this),N.call(this);break;case Y.STREAMS:this._noConnectionSince=null,this._hasNoConnection=!1;break;case Y.ONLINE:k.call(this);break;case Y.OFFLINE:}}function L(t){var e=C.States,n=C.Errors;switch(t){case e.IDLE:R.call(this),this.controller&&this.controller.getErrorID()===n.FLASH_PROXY_FLASH_BLOCKED&&this.trigger(Y.FLASH_UNBLOCK);break;case e.PAUSED:R.call(this),E.call(this,!1),this.seekTimeEventHandler&&this.isPaused()&&S.call(this),this.isPlaying()&&this.trigger(Y.PAUSE,{position:this.currentTime()});break;case e.PLAYING:R.call(this),E.call(this,!1),A.call(this),this.trigger(Y.PLAY_RESUME);break;case e.LOADING:case e.SEEKING:R.call(this),E.call(this,!0);break;case e.ENDED:R.call(this),d.call(this);break;case e.ERROR:E.call(this,!1),P.call(this)}this.trigger(Y.STATE_CHANGE,t)}function O(t,e){var n=this.options.title;n=n&&n.length?" ["+n.replace(/\s/g,"").substr(0,6)+"]":"",t===Y.STATE_CHANGE?F("(%s)%s Event: %s (%s)",this.getId(),n,t,e):t!==Y.TIME||this._loggedTime?t!==Y.TIME&&F("(%s)%s Event: %s",this.getId(),n,t):F("(%s)%s Event: %s %dms",this.getId(),n,t,this.currentTime()),this._loggedTime=t===Y.TIME}function R(){this._initAudioDefer&&this._initAudioDefer.resolve()}function D(t){return void 0===C.Errors[t]?!1:Array.prototype.slice.call(arguments,1).some(function(e){return 0===t.indexOf(e)})}function M(){function t(){var t=window.navigator.onLine;F("Navigator `onLine` status is now: "+t),window.setTimeout(function(){window.navigator.onLine===t&&this.trigger(t?Y.ONLINE:Y.OFFLINE)}.bind(this),500)}this._onlineEventsRegistered||(this._onlineEventsRegistered=!0,window.addEventListener("online",t.bind(this)),window.addEventListener("offline",t.bind(this)))}function k(){if(this.hasNoConnection()&&this._isPlayRetryQueued){var t=Date.now()-this._noConnectionSince;this._isPlayRetryQueued=!0,t<this.options.retryAfterNoConnectionEventTimeout&&this.play({userInitiated:!1})}}function N(){this.hasNoConnection()&&!this._userInitiatedPlay&&(this._isPlayRetryQueued=!0)}var x,C,F,U=n(1),B=n(6),H=n(8),j=n(9),G=n(2).Deferred,Y=n(7),V=n(14),z=n(10),W=n(15),K=n(16),q=n(18),X=n(12),$=n(13),Z=n(19),Q={},J={muted:!1,volume:1},tt={soundId:Q,duration:Q,title:null,registerEndpoint:Q,streamUrlsEndpoint:Q,resourceId:!1,debug:!1,asyncFetch:!0,useSinglePlayer:!0,protocols:[W.HLS,W.RTMP,W.HTTP],extensions:[V.MP3],maxBitrate:1/0,mediaSourceEnabled:!1,mseFirefox:!1,mseSafari:!1,eventLogger:null,logErrors:!0,logPerformance:!0,ajax:null,retryAfterNoConnectionEventTimeout:6e4,fadeOutOnPause:!1,fadeOutAlgo:Z.VolumeAutomator.Algos.EaseInOut},et=6e3,nt=6e3,it=400,rt=6e4,ot=6e3,st=3,at=3e4,ut=[];x=t.exports=function(t,e){if(1===arguments.length?e=t:x.setAudioManager(t),!C)throw new Error("SCAudio: AudioManager instance must be set with `SCAudio.setAudioManager()` or passed via the constructor");this.options=$.extend({},tt,e);var n=Object.keys(this.options).filter(function(t){return this.options[t]===Q},this);if(n.length)throw new Error("SCAudio: pass into constructor the following options: "+n.join(", "));K.prioritizeAndFilter(this.options),this.controller=null,this.streamInfo=null,this._userInitiatedPlay=this._registerPlays=!0,this._registerCounts=this._errorRecoveryCounts=0,this._isPlayActionQueued=this._onlineEventsRegistered=this._usedPrefetchUrls=this._isPlaying=this._isBuffering=this._hasNoConnection=!1,this._initAudioDefer=this._expirationTimeout=this._bufferingTimeout=this._errorRecoveryTime=this._errorRecoveryFlagsResetTimeout=this._storedPosition=this._prevPosition=this._noConnectionSince=null,this.options.debug&&(this._loggedTime=!1),this._modelListeners={},this._hooksPause=[],this.audioPerfMonitor=new H(this,this.logAudioPerformance.bind(this)),this.audioLogger=new B(this),this.volumeAutomator=new Z.VolumeAutomator(this),F=F||j(e.debug,"scaudio")},$.extend(x.prototype,z,{constructor:x,initAudio:function(){return this._initAudioDefer||(this._initAudioDefer=G(),p.call(this).done(function(t){var e=!0;this.streamInfo&&(e=!1),this.streamInfo=t,e&&this.trigger(Y.STREAMS),this.controller=a.call(this,t),u.call(this,this.controller,!0),L.call(this,this.controller.getState())}.bind(this)).fail(function(){this.trigger(Y.NO_STREAMS)}.bind(this)),this._initAudioDefer.done(function(){this.trigger(Y.CREATED)}.bind(this))),this._initAudioDefer.promise()},registerPlay:function(){var t=this.options.soundId,e=!1;return-1===ut.indexOf(t)&&(ut.push(t),window.setTimeout(function(){var e=ut.indexOf(t);e>-1&&ut.splice(e,1)},rt),this.ajax({type:"POST",url:$.result(this.options.registerEndpoint),dataType:"json"}),this._registerCounts++,this._registerPlays=!1,this.trigger(Y.REGISTERED),e=!0),e},toggle:function(){
this[this.isPaused()?"play":"pause"]()},play:function(t){var e;if(t&&null!=t.seek)e=t.seek;else{if(this.isPlaying())return;e=this.currentTime()}t=$.extend({},t,{position:e}),this.trigger(Y.PLAY,t),v.call(this,e)||(f.call(this),this._isPlayActionQueued=!0),this.initAudio().done(function(){this._isPlayActionQueued&&(this._storedPosition=null,this.trigger(Y.PLAY_START,t),this.controller&&this.controller.play(e))}.bind(this)),E.call(this,!0)},pause:function(t){this.isPaused()||(t=$.extend({},t,{position:this.currentTime()}),i.call(this)&&(this.trigger(Y.PAUSE,t),this.controller&&this.controller.pause()))},registerHook:function(t,e){switch(t){case"pause":this._hooksPause.push(e);break;default:throw new Error("can`t register hook for "+t)}},getListenTime:function(){return this.audioLogger?this.audioLogger.getListenTime():0},dispose:function(){this.audioLogger=null,this.audioPerfMonitor=null,$.without(ut,this.options.soundId),window.clearTimeout(this._bufferingTimeout),l.call(this),this.controller&&(this.controller.kill(),this.controller=null),delete this.controller,this.trigger(Y.DESTROYED),this.off()},seek:function(t){return this.controller?t>=$.result(this.options.duration)?void d.call(this):(this.seekTimeEventHandler&&this.off(Y.TIME,this.seekTimeEventHandler),this.seekTimeEventHandler=$.after(2,function(){S.call(this)}.bind(this)),this.on(Y.TIME,this.seekTimeEventHandler),this.trigger(Y.SEEK,{from:this.currentTime(),to:t}),this.isPlaying()&&!v.call(this,t)?(f.call(this),void this.play({seek:t})):void this.controller.seek(t)):void 0},seekRelative:function(t){this.controller&&this.seek(this.currentTime()+t)},currentTime:function(){return this._storedPosition?this._storedPosition:this.controller?this.controller.getCurrentPosition():0},loadProgress:function(){var t=0;return this.controller&&(t=this.controller.getLoadedPosition()/this.controller.getDuration(),t=t>=.99?1:t),t},buffered:function(){return this.controller&&this.controller.getDuration()||0},isPaused:function(){return!this.isPlaying()},isBuffering:function(){return this._isBuffering},isPlaying:function(){return this._isPlayActionQueued||this._isPlaying},isLoading:function(){return!(!this.controller||this.controller.getState()!==C.States.LOADING)},hasNoConnection:function(){return!!this._hasNoConnection},hasStreamInfo:function(){return!!this.streamInfo},toggleMute:function(t){x.toggleMute(t)},isMuted:function(){return x.isMuted()},setVolume:function(t){x.setVolume(t)},getVolume:function(){return x.getVolume()},logAudioPerformance:function(t){this.getEventLogger()&&this.options.logPerformance&&this.getEventLogger().audioPerformance(t)},logAudioError:function(t){this.getEventLogger()&&this.options.logErrors&&this.getEventLogger().audioError(t)},getAudioManagerStates:function(){return C.States},getId:function(){return this.options.resourceId||this.options.soundId},getEventLogger:function(){return this.options.eventLogger},registerModelEventListener:function(t,e){var n=r(t);if(this._modelListeners[n])throw new Error("Data model is already registered (forgot to unregister it or registering twice?)");this._modelListeners[n]=e=e.bind(this,t),this.on("all",e)},unregisterModelEventListener:function(t){var e=r(t);this._modelListeners[e]&&(this.off("all",this._modelListeners[e]),delete this._modelListeners[e])},ajax:function(t){return this.options.ajax?this.options.ajax(t):U(t)},trigger:function(t,e){I.call(this,t,e),z.trigger.call(this,t,e)}}),$.extend(x,{getSettings:function(){return J},setSettings:function(t){$.extend(J,t)},setAudioManager:o,setAudioManagerOnce:$.once(o),toggleMute:function(t){J.muted=void 0===t?!J.muted:!!t,C&&C.setVolume(J.muted?0:1)},isMuted:function(){return J.muted},setVolume:function(t){J.volume=void 0===t?1:t,C&&C.setVolume(J.volume)},getVolume:function(){return J.volume},Extensions:V,Protocols:W,Events:Y,BUFFER_DELAY:it,PLAY_REGISTRATION_TIMEOUT:rt})},function(t,e,n){var i=n(2).Deferred,r=4;t.exports=function(t){var e,n,o,s,a,u,h,c;t&&(o=t.data||null,n=t.url||"",e=t.type||"GET",s=t.dataType||"text",a=t.async,u=t.timeout,h=t.beforeSend||null);var l=i();a=a!==!1;var f=new XMLHttpRequest;return f.open(e,n,a),a&&(f.responseType="text"),h&&h(f),f.onreadystatechange=function(){if(f.readyState===r)if(clearTimeout(c),0!==f.status&&f.status<400){var t=f.responseText;if("json"===s)try{t=JSON.parse(t)}catch(e){return void l.reject(f)}l.resolve(t)}else l.reject(f)},null!=u&&(c=setTimeout(function(){f.readyState!==r&&(f.abort(),l.reject(f))},u)),f.send(o),l.promise()}},function(t,e,n){t.exports=n(3)},function(t,e,n){/*!
		* jquery-deferred
		* Copyright(c) 2011 Hidden <zzdhidden@gmail.com>
		* MIT Licensed
		*/
var i=t.exports=n(4),r=Array.prototype.slice;i.extend({Deferred:function(t){var e=[["resolve","done",i.Callbacks("once memory"),"resolved"],["reject","fail",i.Callbacks("once memory"),"rejected"],["notify","progress",i.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return o.done(arguments).fail(arguments),this},then:function(){var t=arguments;return i.Deferred(function(n){i.each(e,function(e,r){var s=r[0],a=t[e];o[r[1]](i.isFunction(a)?function(){var t=a.apply(this,arguments);t&&i.isFunction(t.promise)?t.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[s+"With"](this===o?n:this,[t])}:n[s])}),t=null}).promise()},promise:function(t){return null!=t?i.extend(t,r):r}},o={};return r.pipe=r.then,i.each(e,function(t,i){var s=i[2],a=i[3];r[i[1]]=s.add,a&&s.add(function(){n=a},e[1^t][2].disable,e[2][2].lock),o[i[0]]=s.fire,o[i[0]+"With"]=s.fireWith}),r.promise(o),t&&t.call(o,o),o},when:function(t){var e,n,o,s=0,a=r.call(arguments),u=a.length,h=1!==u||t&&i.isFunction(t.promise)?u:0,c=1===h?t:i.Deferred(),l=function(t,n,i){return function(o){n[t]=this,i[t]=arguments.length>1?r.call(arguments):o,i===e?c.notifyWith(n,i):--h||c.resolveWith(n,i)}};if(u>1)for(e=new Array(u),n=new Array(u),o=new Array(u);u>s;s++)a[s]&&i.isFunction(a[s].promise)?a[s].promise().done(l(s,o,a)).fail(c.reject).progress(l(s,n,e)):--h;return h||c.resolveWith(o,a),c.promise()}})},function(t,e,n){function i(t){var e=s[t]={};return r.each(t.split(o),function(t,n){e[n]=!0}),e}var r=t.exports=n(5),o=/\s+/,s={};r.Callbacks=function(t){t="string"==typeof t?s[t]||i(t):r.extend({},t);var e,n,o,a,u,h,c=[],l=!t.once&&[],f=function(i){for(e=t.memory&&i,n=!0,h=a||0,a=0,u=c.length,o=!0;c&&u>h;h++)if(c[h].apply(i[0],i[1])===!1&&t.stopOnFalse){e=!1;break}o=!1,c&&(l?l.length&&f(l.shift()):e?c=[]:d.disable())},d={add:function(){if(c){var n=c.length;!function i(e){r.each(e,function(e,n){var o=r.type(n);"function"===o?t.unique&&d.has(n)||c.push(n):n&&n.length&&"string"!==o&&i(n)})}(arguments),o?u=c.length:e&&(a=n,f(e))}return this},remove:function(){return c&&r.each(arguments,function(t,e){for(var n;(n=r.inArray(e,c,n))>-1;)c.splice(n,1),o&&(u>=n&&u--,h>=n&&h--)}),this},has:function(t){return r.inArray(t,c)>-1},empty:function(){return c=[],this},disable:function(){return c=l=e=void 0,this},disabled:function(){return!c},lock:function(){return l=void 0,e||d.disable(),this},locked:function(){return!l},fireWith:function(t,e){return e=e||[],e=[t,e.slice?e.slice():e],!c||n&&!l||(o?l.push(e):f(e)),this},fire:function(){return d.fireWith(this,arguments),this},fired:function(){return!!n}};return d}},function(t,e){function n(t){return null==t?String(t):c[h.call(t)]||"object"}function i(t){return"function"===u.type(t)}function r(t){return"array"===u.type(t)}function o(t,e,n){var r,o=0,s=t.length,a=void 0===s||i(t);if(n)if(a){for(r in t)if(e.apply(t[r],n)===!1)break}else for(;s>o&&e.apply(t[o++],n)!==!1;);else if(a){for(r in t)if(e.call(t[r],r,t[r])===!1)break}else for(;s>o&&e.call(t[o],o,t[o++])!==!1;);return t}function s(t){return!(!t||"object"!==u.type(t))}function a(){var t,e,n,i,r,o,s=arguments[0]||{},a=1,h=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},a=2),"object"==typeof s||u.isFunction(s)||(s={}),h===a&&(s=this,--a);h>a;a++)if(null!=(t=arguments[a]))for(e in t)n=s[e],i=t[e],s!==i&&(c&&i&&(u.isPlainObject(i)||(r=u.isArray(i)))?(r?(r=!1,o=n&&u.isArray(n)?n:[]):o=n&&u.isPlainObject(n)?n:{},s[e]=u.extend(c,o,i)):void 0!==i&&(s[e]=i));return s}var u=t.exports={type:n,isArray:r,isFunction:i,isPlainObject:s,each:o,extend:a,noop:function(){}},h=Object.prototype.toString,c={};"Boolean Number String Function Array Date RegExp Object".split(" ").forEach(function(t){c["[object "+t+"]"]=t.toLowerCase()})},function(t,e,n){function i(t){this.listenTime+=t.from-this.currentTime,this.currentTime=t.to}function r(t){this.listenTime+=t.position-this.currentTime,this.currentTime=t.position}function o(t){this.currentTime=t.position}var s,a=n(7);s=t.exports=function(t){this.scAudio=t,this.listenTime=0,this.currentTime=0,this.scAudio.on(a.SEEK,i,this).on(a.PLAY_START,o,this).on(a.PAUSE,r,this)},s.prototype={constructor:s,getListenTime:function(){return this.listenTime+this.scAudio.currentTime()-this.currentTime}}},function(t,e){var n={CREATED:"created",STATE_CHANGE:"state-change",DESTROYED:"destroyed",PLAY:"play",PLAY_START:"play-start",PLAY_RESUME:"play-resume",METADATA:"metadata",PAUSE:"pause",FINISH:"finish",RESET:"reset",SEEK:"seek",SEEKED:"seeked",GEO_BLOCKED:"geo_blocked",BUFFERRING_START:"buffering_start",BUFFERRING_END:"buffering_end",FLASH_NOT_LOADED:"flash_not_loaded",FLASH_BLOCK:"flash_blocked",FLASH_UNBLOCK:"flash_unblocked",AUDIO_ERROR:"audio_error",TIME:"time",NO_STREAMS:"no_streams",STREAMS:"streams",NO_PROTOCOL:"no_protocol",NO_CONNECTION:"no_connection",REGISTERED:"registered",ONLINE:"online",OFFLINE:"offline"};t.exports=n},function(t,e,n){function i(){return this.scAudio.controller?this.controller?void m.warn("(%s) Setup was called while it was already initialized (returned with a no-op)",this.scAudio.getId()):(m("(%s) Initialized",this.scAudio.getId()),this.controller=this.scAudio.controller,this.protocol=this.scAudio.streamInfo.protocol,void(this.host=S.getUrlHost(this.scAudio.streamInfo.url))):void m.warn("Can´t initialize when controller is null")}function r(){this.controller&&(m("(%s) Reset",this.scAudio.getId()),this.controller=this.protocol=this.host=null,this.timeToPlayMeasured=!1)}function o(t){var e=this.scAudio.getAudioManagerStates();t===e.LOADING?this.timeToPlayMeasured&&f.call(this):A.isNull(this.bufferingStartTime)||d.call(this)}function s(){this.metadataLoadStartTime=Date.now()}function a(){return A.isNull(this.metadataLoadStartTime)?void m.warn("(%s) onMetadataEnd was called without onMetadataStart being called before.",this.scAudio.getId()):(this.log({type:"metadata",latency:Date.now()-this.metadataLoadStartTime}),void(this.metadataLoadStartTime=null))}function u(){this.playClickTime=Date.now()}function h(){if(!this.timeToPlayMeasured){if(A.isNull(this.playClickTime))return void m.warn("(%s) onPlayResume was called without onPlayStart being called before.",this.scAudio.getId());this.log({type:"play",latency:Date.now()-this.playClickTime}),this.playClickTime=null,this.timeToPlayMeasured=!0}}function c(){this.scAudio.isPaused()||(this.seekStartTime=Date.now())}function l(){if(!this.scAudio.isPaused()){if(A.isNull(this.seekStartTime))return void m.warn("(%s) onSeekEnd was called without onSeekStart being called before.",this.scAudio.getId());this.log({type:"seek",latency:Date.now()-this.seekStartTime}),this.seekStartTime=null}}function f(){this.bufferingStartTime||(this.bufferingStartTime=Date.now())}function d(){return A.isNull(this.bufferingStartTime)?void m.warn("(%s) onBufferingEnd was called without onBufferingStart being called before.",this.scAudio.getId()):(p.call(this),void(this.bufferingStartTime=null))}function p(){A.isNull(this.bufferingStartTime)||(A.isNull(this.bufferingTimeAccumulated)&&(this.bufferingTimeAccumulated=0),this.bufferingTimeAccumulated+=Date.now()-this.bufferingStartTime)}function g(){p.call(this),A.isNull(this.bufferingTimeAccumulated)||(this.log({type:"buffer",latency:this.bufferingTimeAccumulated}),this.bufferingStartTime=this.bufferingTimeAccumulated=null)}var _,m,y=n(9),v=n(7),E=n(10),S=n(12),A=n(13);_=t.exports=function(t,e){this.scAudio=t,this.logFn=e,this.controller=null,this.reset(),m=m||y(t.options.debug,"audioperf"),t.on(v.CREATED,i,this).on(v.RESET,r,this).on(v.DESTROYED,r,this).on(v.SEEK,c,this).on(v.SEEKED,l,this).on(v.PLAY,u,this).on(v.PLAY_START,s,this).on(v.PLAY_RESUME,h,this).on(v.PAUSE,g,this).on(v.FINISH,g,this).on(v.STATE_CHANGE,o,this).on(v.METADATA,a,this)},A.extend(_.prototype,E,{constructor:_,log:function(t){return this.controller?(A.extend(t,{protocol:this.protocol,host:this.host,playertype:this.controller.getType()}),m("(%s) %s latency: %d protocol: %s host: %s playertype: %s",this.scAudio.getId(),t.type,t.latency,t.protocol,t.host,t.playertype),void this.logFn(t)):void m.warn("(%s) Monitor log was called while controller is null (returned with a no-op)",this.scAudio.getId())},reset:function(){this.bufferingStartTime=this.bufferingTimeAccumulated=this.playClickTime=this.seekStartTime=this.metadataLoadStartTime=null,this.timeToPlayMeasured=!1}})},function(t,e){function n(){function t(t,n){for(var i,r=arguments.length,o=Array(r>2?r-2:0),s=2;r>s;s++)o[s-2]=arguments[s];"string"==typeof n?n=" "+n:(o.unshift(n),n=""),(i=window.console)[t].apply(i,[e()+" |"+c+"%c"+n].concat(l,o))}function e(){var t=new Date,e=null===h?0:t-h;return h=+t,"%c"+r(t.getHours())+":"+r(t.getMinutes())+":"+r(t.getSeconds())+"."+i(t.getMilliseconds(),"0",3)+"%c (%c"+i("+"+e+"ms"," ",8)+"%c)"}var n=arguments.length<=0||void 0===arguments[0]?!0:arguments[0],o=arguments.length<=1||void 0===arguments[1]?"":arguments[1];if(!n)return s;var h=null,c=a(o),l=["color: green","color: grey","color: blue","color: grey",u(o),""],f=t.bind(null,"log");return f.log=f,["info","warn","error"].forEach(function(e){f[e]=t.bind(null,e)}),f}function i(t,e,n){return o(e,n-(""+t).length)+t}function r(t){return i(t,"0",2)}function o(t,e){return e>0?new Array(e+1).join(t):""}function s(){}function a(t){return t?"%c"+t:"%c"}t.exports=n,s.log=s.info=s.warn=s.error=s;var u=function(){var t=["#51613C","#447848","#486E5F","#787444","#6E664E"],e=0;return function(n){return n?"background-color:"+t[e++%t.length]+";color:#fff;border-radius:3px;padding:2px 4px;font-family:sans-serif;text-transform:uppercase;font-size:9px;margin:0 4px":""}}()},function(t,e,n){t.exports=n(11)},function(t,e,n){!function(){function n(){return{keys:Object.keys||function(t){if("object"!=typeof t&&"function"!=typeof t||null===t)throw new TypeError("keys() called on a non-object");var e,n=[];for(e in t)t.hasOwnProperty(e)&&(n[n.length]=e);return n},uniqueId:function(t){var e=++a+"";return t?t+e:e},has:function(t,e){return o.call(t,e)},each:function(t,e,n){if(null!=t)if(r&&t.forEach===r)t.forEach(e,n);else if(t.length===+t.length)for(var i=0,o=t.length;o>i;i++)e.call(n,t[i],i,t);else for(var s in t)this.has(t,s)&&e.call(n,t[s],s,t)},once:function(t){var e,n=!1;return function(){return n?e:(n=!0,e=t.apply(this,arguments),t=null,e)}}}}var i,r=Array.prototype.forEach,o=Object.prototype.hasOwnProperty,s=Array.prototype.slice,a=0,u=n();i={on:function(t,e,n){if(!c(this,"on",t,[e,n])||!e)return this;this._events||(this._events={});var i=this._events[t]||(this._events[t]=[]);return i.push({callback:e,context:n,ctx:n||this}),this},once:function(t,e,n){if(!c(this,"once",t,[e,n])||!e)return this;var i=this,r=u.once(function(){i.off(t,r),e.apply(this,arguments)});return r._callback=e,this.on(t,r,n)},off:function(t,e,n){var i,r,o,s,a,h,l,f;if(!this._events||!c(this,"off",t,[e,n]))return this;if(!t&&!e&&!n)return this._events={},this;for(s=t?[t]:u.keys(this._events),a=0,h=s.length;h>a;a++)if(t=s[a],o=this._events[t]){if(this._events[t]=i=[],e||n)for(l=0,f=o.length;f>l;l++)r=o[l],(e&&e!==r.callback&&e!==r.callback._callback||n&&n!==r.context)&&i.push(r);i.length||delete this._events[t]}return this},trigger:function(t){if(!this._events)return this;var e=s.call(arguments,1);if(!c(this,"trigger",t,e))return this;var n=this._events[t],i=this._events.all;return n&&l(n,e),i&&l(i,arguments),this},stopListening:function(t,e,n){var i=this._listeners;if(!i)return this;var r=!e&&!n;"object"==typeof e&&(n=this),t&&((i={})[t._listenerId]=t);for(var o in i)i[o].off(e,n,this),r&&delete this._listeners[o];return this}};var h=/\s+/,c=function(t,e,n,i){if(!n)return!0;if("object"==typeof n){for(var r in n)t[e].apply(t,[r,n[r]].concat(i));return!1}if(h.test(n)){for(var o=n.split(h),s=0,a=o.length;a>s;s++)t[e].apply(t,[o[s]].concat(i));return!1}return!0},l=function(t,e){var n,i=-1,r=t.length,o=e[0],s=e[1],a=e[2];switch(e.length){case 0:for(;++i<r;)(n=t[i]).callback.call(n.ctx);return;case 1:for(;++i<r;)(n=t[i]).callback.call(n.ctx,o);return;case 2:for(;++i<r;)(n=t[i]).callback.call(n.ctx,o,s);return;case 3:for(;++i<r;)(n=t[i]).callback.call(n.ctx,o,s,a);return;default:for(;++i<r;)(n=t[i]).callback.apply(n.ctx,e)}},f={listenTo:"on",listenToOnce:"once"};u.each(f,function(t,e){i[e]=function(e,n,i){var r=this._listeners||(this._listeners={}),o=e._listenerId||(e._listenerId=u.uniqueId("l"));return r[o]=e,"object"==typeof n&&(i=this),e[t](n,i,this),this}}),i.bind=i.on,i.unbind=i.off,i.mixin=function(t){var e=["on","once","off","trigger","stopListening","listenTo","listenToOnce","bind","unbind"];return u.each(e,function(e){t[e]=this[e]},this),t},"undefined"!=typeof t&&t.exports&&(e=t.exports=i),e.BackboneEvents=i}(this)},function(t,e){var n={getUrlParams:function(t){var e={},n=t.indexOf("?");return n>-1&&t.substr(n+1).split("&").forEach(function(t){var n=t.split("=");e[n[0]]=n[1]}),e},getUrlHost:function(t){var e,n=t.split("//");return e=n[0]===t?n[0].split("/")[0]:n[1]?n[1].split("/")[0]:""}};t.exports=n},function(t,e){var n={extend:function(t){var e=Array.prototype.slice.call(arguments,1);return e.forEach(function(e){if(e)for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n])}),t},each:function(t,e,n){Object.keys(t).forEach(function(i){e.call(n||null,t[i],i)})},without:function(t,e){var n=t.indexOf(e);n>-1&&t.splice(n,1)},result:function(t){var e=t;return n.isFunction(e)&&(e=t()),e},isFunction:function(t){return"function"==typeof t},after:function(t,e){return function(){return--t<1?e.apply(this,arguments):void 0}},isNull:function(t){return null===t},once:function(t){var e,n=!1;return function(){return n?e:(n=!0,void(e=t.apply(this,arguments)))}}};t.exports=n},function(t,e){var n={AAC:"aac",MP3:"mp3",OGG:"ogg",OPUS:"opus",WAV:"wav"};t.exports=n},function(t,e){var n={HTTP:"http",RTMP:"rtmp",HLS:"hls"};t.exports=n},function(t,e,n){function i(t){return h.supportsMediaSourceExtensions()&&t.mediaSourceEnabled&&(h.isChrome()&&h.getChromeVersion()>=35||h.isFirefox()&&t.mseFirefox||h.isSafari()&&t.mseSafari)}function r(t){return function(e){var n=!1;switch(e){case u.RTMP:n=h.supportsFlash();break;case u.HTTP:n=h.supportsHTML5Audio()||h.supportsFlash();break;case u.HLS:n=i(t)}return n}}function o(t){return h.isSafari()||h.isFirefox()?[u.HLS,u.HTTP,u.RTMP]:t}function s(t){t.protocols=o(t.protocols).filter(r(t))}var a,u=n(15),h=n(17);a={prioritizeAndFilter:s},t.exports=a},function(t,e){function n(t){return t.test(window.navigator.userAgent.toLowerCase())}function i(t,e){try{return window.navigator.userAgent.toLowerCase().match(t)[e]}catch(n){return null}}function r(){try{return parseInt(i(/chrom(e|ium)\/([0-9]+)\./,2),10)}catch(t){return NaN}}function o(){return!h()&&n(/safari/)}function s(){return o()&&n(/version\/7\.1/)}function a(){return o()&&n(/version\/8/)&&!n(/version\/80/)}function u(){return o()&&n(/version\/9\./)}function h(){return n(/chrom(e|ium)/)}function c(){return n(/firefox/)}function l(){return!!window.MediaSource&&(window.MediaSource.isTypeSupported("audio/mpeg")||window.MediaSource.isTypeSupported("audio/mp4"))}function f(){try{return window.hasOwnProperty("Audio")&&!!(new window.Audio).canPlayType("audio/mpeg")}catch(t){return!1}}function d(){try{var t=o()&&n(/version\/5\.0/),e=window.hasOwnProperty("Audio")&&(!!(new window.Audio).canPlayType('audio/x-mpegURL; codecs="mp3"')||!!(new window.Audio).canPlayType('vnd.apple.mpegURL; codecs="mp3"'));return!t&&e}catch(i){return!1}}function p(){return _(g())>=y}function g(){var t,e,n,i;if("undefined"!=typeof window.ActiveXObject)try{i=new window.ActiveXObject("ShockwaveFlash.ShockwaveFlash"),i&&(t=i.GetVariable("$version"))}catch(r){t=null}else window.navigator&&window.navigator.plugins&&window.navigator.plugins.length>0&&(n="application/x-shockwave-flash",e=window.navigator.mimeTypes,e&&e[n]&&e[n].enabledPlugin&&e[n].enabledPlugin.description&&(t=e[n].enabledPlugin.description));return t}function _(t){if(!t)return 0;var e=t.match(/\d\S+/)[0].replace(/,/g,".").split(".");return parseFloat([e[0],e[1]].join("."))||0}var m,y=9;m={flashPlugin:g,isSafari:o,isSafari71:s,isSafari8:a,isSafari9:u,isChrome:h,getChromeVersion:r,isFirefox:c,supportsNativeHLSAudio:d,supportsHTML5Audio:f,supportsFlash:p,supportsMediaSourceExtensions:l},t.exports=m},function(t,e,n){function i(t){var e=f.getUrlHost(t);return p.every(function(t){return 0!==e.indexOf(t)})}function r(t,e){return!(t===c.HLS&&!i(e))}function o(t,e){if(!t)return!1;var n=t.issuedAt+s(t.protocol,t.duration);return a(t.protocol)?Date.now()+t.duration-(e||0)<n:Date.now()<n}function s(t,e){var n=a(t);return g+(n?l.result(e):0)}function a(t){return t===c.HTTP||t===c.HLS}function u(t,e){function n(t){return-1*t}function i(t,e){return Math.abs(e-m)-Math.abs(t-m)}var o,s,a,u,h,c,f,d,p,g,_={},m=e.maxBitrate,y=e.protocols,v=e.extensions;for(l.each(t,function(t,e){var n=e.split("_"),i=n[0],r=n[1],o=n[2];_[i]=_[i]||{},_[i][r]=_[i][r]||{},_[i][r][o]=t}),h=0,c=y.length;c>h;++h)for(u=y[h],d=0,p=v.length;p>d;++d)if(f=v[d],_[u]&&_[u][f]){if(o=Object.keys(_[u][f]).map(Number).sort(n),s=m===1/0,a=m===-(1/0),m=s||a?o[s?"pop":"shift"]():o.sort(i).pop(),g=_[u][f][m],!r(u,g))continue;return{url:g,bitrate:m,protocol:u,extension:f,issuedAt:Date.now(),duration:l.result(e.duration)}}return null}var h,c=n(15),l=n(13),f=n(12),d=.9,p=[],g=Math.floor(12e4*d);h={choosePreferredStream:u,streamValidForPlayingFrom:o},t.exports=h},function(t,e,n){var i,r,o=n(7),s=n(13),a={Linear:0,EaseOut:1,EaseInOut:2},u=600,h=25;t.exports=i={},i.VolumeAutomator=r=function(t){this.scAudio=t,this.fadeOutAlgo=this.scAudio.options.fadeOutAlgo,this.fadeOutTimer=null,this.initialVolume=void 0,this.scAudio.options.fadeOutOnPause&&r.isSupported()&&(this.scAudio.on(o.PLAY,this.onPlay,this),this.scAudio.registerHook("pause",this.hookPause.bind(this)))},i.VolumeAutomator.isSupported=function(){var t=new window.Audio,e=t.volume,n=0===e?1:e/2;return t.volume=n,t.volume===n},i.VolumeAutomator.Algos=a,s.extend(r.prototype,{fadeOutAndPause:function(){var t=Date.now(),e=function(){var n,i=(Date.now()-t)/u,r=this.initialVolume;if(i>=1)this.scAudio.controller&&this.scAudio.controller.pause(),this.cancelFadeout();else{switch(this.fadeOutAlgo){case a.Linear:n=r*(1-i);break;case a.EaseOut:n=r*(1/(10*(i+.1))-.05);break;case a.EaseInOut:default:n=r*(Math.cos(i*Math.PI)/2+.5)}this.scAudio.setVolume(n),window.clearTimeout(this.fadeOutTimer),this.fadeOutTimer=window.setTimeout(e,h)}}.bind(this);this.initialVolume=this.scAudio.getVolume(),e()},cancelFadeout:function(){this.fadeOutTimer&&(window.clearTimeout(this.fadeOutTimer),this.fadeOutTimer=null,this.scAudio.setVolume(this.initialVolume),this.initialVolume=void 0)},hookPause:function(t){return this.fadeOutAndPause(),!1},onPlay:function(){this.cancelFadeout()}})}])},function(t,e){}])});
//# sourceMappingURL=sdk-3.1.2.js.map
function initBounceButtons(selector){
	try { 
	    if(!TweenMax){}
	}
	catch(err) {
	    console.error('bounceb missing tweenlite. '+err)
	    return
	}
	try { 
	    if(!$){}
	}
	catch(err) {
	    console.error('bounceb missing jquery. '+err)
	    return
	}
	$button = $(selector)
	$button.click(function(e) {
	  e.preventDefault()
	  var button = e.currentTarget
	  console.log(e)
	  var duration = 0.3,
	      delay = 0.08;
	  TweenMax.to(button, duration, {scaleY: 1.1, ease: Expo.easeOut});
	  TweenMax.to(button, duration, {scaleX: 1.05, scaleY: 1, ease: Back.easeOut, easeParams: [3], delay: delay});
	  TweenMax.to(button, duration * 1.25, {scaleX: 1, scaleY: 1, ease: Back.easeOut, easeParams: [6], delay: delay * 3 });
	});
}
function SPlogin(callback) {
    var CLIENT_ID = '7b3974949bf84ea7bb249665c3eb9d9f';
    // var REDIRECT_URI = 'http://jmperezperez.com/spotify-oauth-jsfiddle-proxy/';
    var REDIRECT_URI = 'http://www.gtplayer.ru/spCallback.html';
    function getLoginURL(scopes) {
        return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
          '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
          '&scope=' + encodeURIComponent(scopes.join(' ')) +
          '&response_type=token';
    }
    
    var url = getLoginURL([
        'user-read-email', 
        "user-library-read"
    ]);
    
    var width = 450,
        height = 730,
        left = (screen.width / 2) - (width / 2),
        top = (screen.height / 2) - (height / 2);

    window.addEventListener("message", function(event) {
        var hash = JSON.parse(event.data);
        if (hash.type == 'access_token') {
            callback(hash.access_token);
        }
    }, false);
    
    var w = window.open(url,
                        'Spotify',
                        'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                       );
    
}

function SPgetUserData(accessToken) {
    return $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
           'Authorization': 'Bearer ' + accessToken
        }
    });
}
function SPgetAllTracks(accessToken){
    return $.ajax({
        url: 'https://api.spotify.com/v1/me/tracks?limit=50',
        headers: {
           'Authorization': 'Bearer ' + accessToken
        }
    });
}

function SPChangeButton(itemID, spanText, onclick){
    $("#"+itemID+" span").text(spanText)
    $("#"+itemID).click(onclick)
}

function SPlogout(){
    Parse.User.current().set("SPToken",null).save()
    $('#spLoginButton').show()
    $('#spLogOutButton').hide()
}

function SPLoginInit(){
    SPlogin(function(accessToken) {
        Parse.User.current().set("SPToken",accessToken).save()
        $('#spLoginButton').hide()
        $('#spLogOutButton').show()
    });
}    

//###########################################################################

function SPSearchTrack(accessToken, title, artistTested, callback){
    var result=null
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data:{q:title, type:"track", limit:50},
        headers: {
           'Authorization': 'Bearer ' + accessToken
        }
    }).success(function(res){
        console.log(res)
        var tracks  = res.tracks.items
        artistFound = false
        for(el in tracks){
            var foundAllArtist=true
            var currentArtists = tracks[el].artists
            for(artist in currentArtists){
                // console.log(artistTested,currentArtists[artist].name )
                if(artistTested.toUpperCase().indexOf(currentArtists[artist].name.toUpperCase())==-1) foundAllArtist = false
            }
            if(foundAllArtist) {
                result =  tracks[el]
                break
            }
        }
        console.log("success",result)
        if(result==null) {
            result={}
            result.id = null
        }
        callback( result )

    }).fail(function(res) {
       console.log("fail",res)
       result.id = null
       callback( result )
    }).error(function(res) {
       console.log("fail",res)
       result.id = null
       callback( result )
    })
}

function getSPIDForItem(VKMusicItem, i){
    setTimeout(function(){
        SPSearchTrack(SPToken, VKMusicItem.title,VKMusicItem.artist, function(res){
            console.log(res)
            VKMusicItem.spotifyID = res.id
            // return VKMusicItem
            // return VKMusicItem
        })
    }, i*500)
    // console.log(new Date())
}

function getSPIdsForAll(VKMusic){
    var percent = 0
    var items = VKMusic.response.length
    for(var i=0;i<items;i++){
        getSPIDForItem(VKMusic.response[i],i)
    }

}

function saveAllSPIDs(VKMusic){

    arr=[]
    for(var i in VKMusic.response){
        // if(VKMusic.response[i].spotifyID!=null
        arr.push({VKID:VKMusic.response[i].aid, SPID:VKMusic.response[i].spotifyID})
    }
    Parse.User.current().set("SPVKIdsMatches", arr).save()
}

function getFeaturesForAll(accessToken, dictArray){
    var arr=[]
    for(i in dictArray) if(dictArray[i].spotifyID!=null) arr.push(dictArray[i])
    reqStr = ""
    for(i in arr){
        reqStr=reqStr+arr[i].spotifyID+","
    }
    $.ajax({
        url: 'https://api.spotify.com/v1/audio-features',
        data:{ids:reqStr},
        headers: {
           'Authorization': 'Bearer ' + accessToken
        }
    }).success(function(res){
        // console.log(res)
        // var tracks  = res.tracks.items
        // artistFound = false
        // for(el in tracks){
        //     var foundAllArtist=true
        //     var currentArtists = tracks[el].artists
        //     for(artist in currentArtists){
        //         // console.log(artistTested,currentArtists[artist].name )
        //         if(artistTested.toUpperCase().indexOf(currentArtists[artist].name.toUpperCase())==-1) foundAllArtist = false
        //     }
        //     if(foundAllArtist) {
        //         result =  tracks[el]
        //         break
        //     }
        // }
        console.log("success",res)
        // if(result==null) {
        //     result={}
        //     result.id = null
        // }
        // callback( result )
        for(i in arr){
            dictArray[i].af = res.audio_features[i]
        }

    }).fail(function(res) {
       console.log("fail",res)
       // result.id = null
       // callback( result )
    }).error(function(res) {
       console.log("fail",res)
       // result.id = null
       // callback( result )
    })
}
//###########################################################################
getUniqueArray = function(arr){
   var u = {}, a = [];
   for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
         continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
   }
   return a;
}
function checkTime(date, hours){
  if(!date) date = new Date()
  var opens = hours[date.getDay()].open;
  var closes = hours[date.getDay()].close;
  var yesterdayClose=hours[((date.getDay()>0)?date.getDay()-1:6)].close;
  var yesCloseDate = new Date(null, null, null, yesterdayClose.substr(0,2), yesterdayClose.substr(3,5));      
  var openDate = new Date(null, null, null, opens.substr(0,2), opens.substr(3,5));
  var closeDate = new Date(null, null, null, closes.substr(0,2), closes.substr(3,5));
  var currentDate = new Date(null, null, null, date.getHours(), date.getMinutes());
  var nowOpen =( (currentDate>=openDate && currentDate.getHours()<=23) || currentDate<yesCloseDate && (currentDate.getHours()<6 && yesCloseDate.getHours()<6)) ;
  if(nowOpen){
    if(currentDate.getHours()<=23&&currentDate.getHours()>6) return [true,closeDate.toLocaleTimeString()]
    else return [true,yesCloseDate.toLocaleTimeString()]
  }else{
    var tomorrOpen = hours[((date.getDay()<6)?date.getDay()+1:0)].open;
    tomorrOpen = new Date(null, null, null, tomorrOpen.substr(0,2), tomorrOpen.substr(3,5));
    if(currentDate.getHours()<=23&&currentDate.getHours()>yesCloseDate.getHours()) return [false, openDate.toLocaleTimeString()]
    else return [false,tomorrOpen.toLocaleTimeString()]
  }
}
function checkDistPC(postcode, thresh, toBeAnimatedJQDiv, classAdd){
      toBeAnimatedJQDiv.addClass(classAdd);
      Parse.Cloud.run('checkDistance', {destinationPC:postcode.replace(" ","")}, {
        success: function (result) {
                 toBeAnimatedJQDiv.removeClass(classAdd);
                 result = JSON.parse(result)
                 if(result.status == "INVALID_REQUEST" || result.rows[0].elements[0].status=="ZERO_RESULTS" || result.rows[0].elements[0].status=="NOT_FOUND"){
                  swal("Error!", "The postcode is not found", "error");
                    return;
                 }
                 var distance = result.rows[0].elements[0].distance.value*0.000621371192;
                 console.log(distance)
                 if(distance>thresh){
                    swal("Error!", "We don't deliver beyond 3 miles from NE37 2SY", "error");
                    return;
                  }else{
                    swal("Success", "We deliver to your postcode", "success");
                  }

        }, 
        error:function(res){toBeAnimatedJQDiv.removeClass(classAdd);}})
}

function searchForPropertyInObjectArray(objArray, term, value) {
  var result = base.Offers.filter(function( obj ) {
    return obj[term] == value;
  });
  return result
}

function isArray(prop){
  if(!prop) return false
  return prop.constructor === Array
}
function findAndRemove(array, property, value) {
    array.forEach(function(result, index) {
        if (result[property] === value) {
            //Remove from array
            array.splice(index, 1);
        }
    });
}

function decodeHTMLEntities(text) {
    var entities = [
        ['apos', '\''],
        ['amp', '&'],
        ['lt', '<'],
        ['gt', '>']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
}








    Parse.initialize("S3FAzGmZtzGPwZrieqcDcdzdGrN9nTEYLLIFdkAY", "P2CcIuM1V7fPaEUzXnqHejLkdmKaFrMv7aXxHkz3");
  
  var VKId;
  var VKMusic={}
  var testVar;
  var toggleVKSearchEnabled=false;
  var $animation;
  var SPToken;
  var SPMusic;

  mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"
  // $(".playlist, #youtube, #stats, #bgChanger, #uploadFrameDisplayer").on(mousewheelevt, function(e) {
  //     e.stopPropagation();
  // });
  // $("#lyricsHolder").on(mousewheelevt, function(e) {
  //     e.stopPropagation();
  // });
  function initiateVK() {
      VK.init({
        apiId: 4152682
      });
      loginVK(); //alert("wonder");
    };
    // setTimeout(function() {
    //   loginVK();
    // }, 8000);
    function loginVK(){//window.scrollTo(0, 1);//alert("triggered"); 
    VK.Auth.getLoginStatus(function(answer){console.log(answer);
    if(answer.status=="connected" && answer.session!=null)
    {
      VKgetMusic(answer);
    }
      else
        {
          VK.Auth.login(authInfoVK,8); //alert("hi");
        }
    });
  }
    function authInfoVK(response) { console.log(response);
    if (response.session) {
        testVar = response
      //alert('user: '+response.session.mid);console.log(response.settings);
          setTimeout(function() 
                    {
                       VKId=response.session.mid;
                       VKgetMusic(response);
                     }, 0)
          }
     else {
      //alert('not auth');
    }
  }
  function VKgetMusic(source)
  {
    loginSuccessful()
    VK.api("audio.get", {uid:VKId}, function(data) {console.log(data);
      VKMusic = JSON.parse(decodeHTMLEntities(JSON.stringify(data))); 
      refreshAngular(VKMusic);
      fireEvent("VKLoaded")
   })
  }

  function searchMusic(name){
    VK.api("audio.search", {q:name, auto_complete:1, lyrics:0, performer_only:0, sort:2, search_own:0, offset:0,count:10}, function(response){
          console.log(response); 
          if(response.response.length==1){
          return {"response":[328053,{"aid":420270844,"artist":"Lx24 ","duration":218,"lyrics_id":"193532162","owner_id":230246713,"title":"Ты мой Космос  ","url":"http://cs9-11v6.v"}]}
         }else{
          // return response
          var res = response
          for(var i=1; i<res.response.length; i++){
            $("#searchList").append('<li class="list-group-item vkSearchItemContainer"><a class="btn btn-default btn-sm firstChild" onclick="playFromSearch('+i+',`'+res.response[i].url+'`,this)"><i class="fa fa-fw fa-play"></i></a><a class="btn btn-default btn-sm" onclick="handleVKAdding('+res.response[i].aid+','+res.response[i].owner_id+',this)"><i class="fa fa-fw fa-plus"></i></a><span class="VKSearchSpan">'+res.response[i].artist+' - '+res.response[i].title+'</span></li>')
          }

         }
      })

    // return {"response":[328053,{"aid":420270844,"artist":"Lx24 ","duration":218,"lyrics_id":"193532162","owner_id":230246713,"title":"Ты мой Космос  ","url":"http://cs9-11v6.v"}]}
  }

  function playFromSearch(index, url, el){
    if(Player.audio) Player.audio.pause()
    Player.audio = new Audio(url);
    Player.audio.play()

    var parent = $(el.parentNode)
    // var children = btn.find("i")
    var btn = $(el)
    var children = btn.find("i")
    $(children[0]).removeClass("fa-play").addClass("fa-pause")
  }

  function VKSearchAction(){
    var term = $("#termInput").val()
    $("#searchList").empty()
    var res = searchMusic(term)
    // console.log(res.response)

  }

   function searchLyricsVK(name, source)
   {
     VK.api("audio.search", {q:name, auto_complete:1, lyrics:1, performer_only:0, sort:2, search_own:0, offset:0,count:10}, function(response){
        console.log(response); 
            function displayNoLyrics()
            {
             $("#lyricsContainer").empty(); 
             strTempTemp='No Lyrics found. Sorry(:';
             $("#lyricsContainer").append(strTempTemp); 
             console.log('No Lyrics found. Sorry(:')
             $("#lyricsShowButton").addClass("disabled")
            }
            if(response.response.length==1)//not found
            {
               displayNoLyrics();
            }
            else if(response.response[1].lyrics_id!=null && response.response.length>=2)//found
            {
             //console.log(response.response);
                var foundLongLyrics=false;
                //for(var i=0, l=response.response.length; i<l;i++)
                var count=0;
                function fetchLyrics()
                {
                  if(count<response.response.length)
                  { 
                    if(foundLongLyrics){}
                    else
                    {
                      VK.api("audio.getLyrics", {lyrics_id:response.response[count+1].lyrics_id}, checkLength);
                      count++;
                    }
                  }
                } 
                fetchLyrics();
                function checkLength(lyrResp)
                {//console.log(lyrResp);//alert("called");
                if(lyrResp.response)
                 { 
                    if(lyrResp.response.text.length>500)
                    {
                      console.log(foundLongLyrics);
                      foundLongLyrics=true;
                     $("#lyricsContainer").empty();
                     $("#lyricsContainer").append(lyrResp.response.text.replace(/\n/g, '<br />'));
                     console.log(lyrResp.response.text.replace(/\n/g, '<br />'))
                     // console.log(lyrResp.response.text.length);
                     // $(".lyricsHolder").animate({ scrollTop: 0}, 'slow');
                     scrollTo(lyricsContainer, 0)
                     $("#lyricsShowButton").removeClass("disabled")
                    }
                    else fetchLyrics();
                  }
                else return false;//error received
                }
                setTimeout(function(){ 
                                      console.log("found",foundLongLyrics);
                                      if(!foundLongLyrics)
                                      {
                                        displayNoLyrics();
                                      }
                        }
                , 1000);
            }
    }) //http://vk.com/dev/audio.search
       
   }
  function toggleVKSearchEnabler()
  { 
    if(!toggleVKSearchEnabled)
    {
    toggleVKSearchEnabled=true;
    $("#VKSearchEnabler").addClass("buttonPressed");
    $( "#tags" ).autocomplete({
        source: "VK"//$.merge(forMerge, cleanedArr)
      });
    }
    else
    {
      toggleVKSearchEnabled=false; 
      $("#VKSearchEnabler").removeClass("buttonPressed");
      feedAutoComplete();
    }
  }
  function handleVKAdding(id,owner_id, el)
  {//alert('handleVKAdding');
    testVar = el
    console.log(id, owner_id, el)
    VK.api("audio.add", {aid:id, oid:owner_id}, function(data){
      // VKgetMusic("handleVKAdding");
      // 
      var btn = $(el)
      btn.attr('disabled', true);
      var children = btn.find("i")
      $(children[0]).removeClass("fa-plus").addClass("fa-check")
    });

    // var btn = $(el)
    // btn.attr('disabled', true);
    // var children = btn.find("i")
    // $(children[0]).removeClass("fa-plus").addClass("fa-check")
  }



  var playerApp = angular.module('playerApp', []);

  // Define the `PhoneListController` controller on the `playerApp` module
  playerApp.controller('playerController', function playerController($scope) {
    $scope.response = [
      {
        artist: 'Johann Sebastian Bach',
        title: 'Prelude in C major',
        url:'https://www.dropbox.com/s/kavovoai0jwpj38/amclassical_prelude_in_c_major_bwv_846a.mp3?dl=1'
      }, {
        artist: 'Wolfgang Mozart',
        title: 'Adagio for Glass Harmonica',
        url:'https://www.dropbox.com/s/wiap2pkf6344obr/amclassical_mozart_adagio.mp3?dl=1'
      }, {
        artist: 'Johann Sebastian Bach',
        title: ' Jesu Joy of Man\'s Desiring',
        url:'https://www.dropbox.com/s/l3mpp1awychq2h4/amclassical_jesu_joy_of_mans_desiring.mp3?dl=1'
      }
    ];
    $scope.refresh = function(value){
      $scope.response=value;
      $scope.$apply();
      // $scope.response = Storage.get();
    }
    $scope.getPictureAndPlay = function(value,el){
      changeActive(el.$index)
      Player.play(el.music.url, el.$index)
      searchLyricsVK(el.music.artist+" "+el.music.title)
      Loader.showLoader()
      getPictureAndPlay(value);
    }
    $scope.playAt=function(index){
      var first = $scope.response[index]
      $scope.getPictureAndPlay(first.artist, {music:{url:first.url},$index:index})
    }
    $scope.orderList = "artist";
  });

  function refreshAngular(VKMusic){
    // VKMusic.response.shift()
    angular
            .element(document.querySelector('[ng-controller="playerController"]'))
            .scope().refresh(VKMusic.response)
  }
  function getPictureAndPlay(artist) {
     Parse.Cloud.run('searchArtist', {artist:encodeURIComponent(artist)}, { 
      success: function (result) {
        // console.log(result)
        var parsed = JSON.parse(result)
        console.log(parsed)
        if(!parsed.artist){
          $("#image img").attr("src", "player.svg")
          return
        }
        var url = parsed.artist.image[4]
          console.log(url)   
           if(url["#text"] && url["#text"].length>1) $("#image img").attr("src", url["#text"])
           else $("#image img").attr("src", "player.svg")
        } ,
        error:function (result) {
          console.log(result)   
        }
       });
  }

  function loginSuccessful(){
    VK.api('users.get', {
           user_ids: VK._session.mid,
           fields: "photo_50,city,verified"
       }, function(data) {
          console.log(data)
           $("#logoutButton span").text('Log out'+" "+data.response[0].first_name+" "+data.response[0].last_name);
       });

    $("#logoutButton").css("display","block")
    $("#loginButton").hide()
  }
  function logoutSuccessful(){
    $("#loginButton").show()
    $("#logoutButton").hide()
  }

  var Loader={
    img:null,
    showLoader:function(){
      Loader.img.attr("src", "circle.svg")

    }
  }

  var Player={
    playing:false,
    index:0,
    audio:null,
    position:0,
    autoNext:true,
    pause:function(){
      Player.position = Player.audio.currentTime;
      Player.audio.pause(); 
      showPlayIcon(null,true) 
      Player.playing=false
    },
    play:function(url,indx){
      if(Player.audio) Player.audio.src=url
        else Player.audio = new Audio(url);
      Player.audio.addEventListener("progress", Player.progressUpdate, false);
      Player.audio.addEventListener("timeupdate", Player.timeupdateSong, false);
      Player.audio.addEventListener("ended", Player.songEnded, false);
      Player.audio.addEventListener("error", Player.errorLoading, false)
      Player.audio.play(); 
      showPlayIcon(null,false)
      $("#barsCont").click(Player.seekbarMouseUp)
      Player.playing=true
      Player.index = indx
    },
    continue:function(){
      Player.audio.play(Player.position);
      Player.playing=true
      showPlayIcon(null,false)
    }, 
    bufferBar: "#buffer .progress-bar",
    currentProgress:"#currentProgress .progress-bar",
    progressUpdate:function(){
        if (Player.audio.buffered.length > 0) {
            var percent = (Player.audio.buffered.end(0) / Player.audio.duration) * 100;
            $(Player.bufferBar).css({
                width: percent + "%"
            });
        }
    },
    isBeingAnimated:false,
    seeking:false,
    timeupdateSong:function() {
            if (!Player.isBeingAnimated) {
                if (Player.seeking == false) {
                    var timePercent = (Player.audio.currentTime / Player.audio.duration) * 100;
                    $(Player.currentProgress).css({
                        width: timePercent + "%"
                    });
                    timePercent=Math.floor( timePercent );
                    if(timePercent/10 % 2 === 0 && timePercent>1) lyricsScroll(timePercent)
                }
            }
            // if (controls.timeProgress != null || controls.timeProgress != undefined) {
            //     $(controls.timeProgress).text(((Math.floor(this.currentTime / 60)) < 10 ? "0" + Math.floor(this.currentTime / 60) : Math.floor(this.currentTime / 60)) + ":" + ((this.currentTime - (Math.floor(this.currentTime / 60)) * 60) < 10 ? "0" + Math.floor(this.currentTime - (Math.floor(this.currentTime / 60)) * 60) : Math.floor(this.currentTime - (Math.floor(this.currentTime / 60)) * 60)));
            // }
    }, 
    errorLoading:function(e){
      console.log(e)
      Player.songEnded()
    },
    seekbarMouseUp:function(e) {
        var relX = Math.round(((e.pageX - $("#barsCont").offset().left) / $("#barsCont").width()) * 100);
        relX = relX > 100 ? 100 : relX;

        try {
            Player.audio.currentTime = (relX * Player.audio.duration) / 100;
        } catch (e) {
            console.log("Please wait until music is loaded");
        }
        //------------------------------------------------------------------------
        $(Player.currentProgress).css({
            width: relX + "%"
        });

        Player.isBeingAnimated = true;
        setTimeout(function() {
            Player.isBeingAnimated = false;
        }, 350);

        Player.seeking = false;
        if (Player.audio.paused) {
            Player.continue()
        }
        // document.removeEventListener("mousemove", seekbarMouseMove, false);
        // document.removeEventListener("mouseup", seekbarMouseUp, false);
        // // $(controls.indicator).css('z-index', -100);
        // $(controls.indicator).hide();
    },
    songEnded:function(){
        // console.log("song ended");
        if (Player.repeat == 0 && Player.index >= VKMusic.response.length - 1) {
            Player.pause()
        } else if (Player.repeat == 1) {
            Player.audio.currentTime = 0;
            Player.play();
        } else {
            if (!Player.autoNext) {
                Player.pause();
                return
            }
            Player.index = (Player.index >= VKMusic.response.length - 1)?0:Player.index+1
            // Player.play(VKMusic.response[Player.index].url, Player.index)
            angular
              .element(document.querySelector('[ng-controller="playerController"]'))
                .scope().playAt(Player.index)
            console.log(VKMusic.response[Player.index], Player.index)
        }
    }
  }

  function scrollTo(div, y){
    return TweenMax.to(div, 2, {scrollTo:{y:y}, ease:Power2.easeOut});
  }
  function lyricsScroll(percent) {
    console.log("lyricsScroll",percent)
    if($('#lyricsContainer:hover').length==0) scrollTo(lyricsContainer, (lyricsContainer.scrollHeight/100*percent-lyricsContainer.offsetHeight/2))
  }
  function flipArtwork(toShow, toHide){
    $("#"+toShow).css("transform", "")
    TweenMax.to(document.getElementById(toHide), 0.5, {x:-100, opacity:0 , ease:Power1.easeInOut ,repeat:0,
    onComplete:function(){
      $("#"+toHide).hide();
      TweenMax.to(document.getElementById(toHide), 0.1, {x:0, opacity:1 , ease:Power1.easeInOut ,repeat:0})
      // $("#"+toHide).css("transform", "")
      // $("#"+toHide).css("opacity", "1")
      // $("#"+toShow).fadeIn("slow");
      $("#"+toShow).show();
      TweenMax.fromTo(document.getElementById(toShow), 0.5, {x:100, opacity:0}, {x:0, opacity:1});
    }
      });

  }

  function playOrPause(){
    // if(playShown)
    playShown = !playShown;
    showPlayIcon($animation, playShown)
    if(playShown) Player.pause()
    else Player.continue()
  }

  function showPlayIcon($animation,bool){
    if(!$animation) $animation = $("#animation")
    playShown = bool
    $animation.attr({
       "from": bool ? play : pause,
       "to": bool ? pause : play
    }).get(0).beginElement();
  }

  var playShown = false
  function initiMorphPlayPause(classReceived, animation){
     pause = "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28",
     play = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26",
     $animation = $(animation);

     showPlayIcon($animation, true)

    $("."+classReceived).on('click', playOrPause);

  }
  function progressCircle(percent){
      var val = percent;
      var $circle = $('#svg #bar');
      
      if (isNaN(val)) {
       val = 100; 
      }
      else{
        var r = $circle.attr('r');
        var c = Math.PI*(r*2);
       
        if (val < 0) { val = 0;}
        if (val > 100) { val = 100;}
        
        var pct = ((100-val)/100)*c;
        
        $circle.css({ strokeDashoffset: pct});
        
        $('#cont').attr('data-pct',Math.floor(val));
      }
  }

  function volume(vol) {
      vol = vol > 100 ? 100 : vol < 0 ? 0 : vol;
      Player.audio.volume = vol / 100;
      progressCircle(vol)
      console.log(vol)
      // volumePercent = vol;
      // $(controls.volumeLevel).css({
      //     width: vol + "%"
      // });
      // setCookie("volumeOfPlayer", vol, 365);
  }
  function volumeScroll(e) {
      if(!Player.audio) return
      // if (scrollVolumeOn) {
          scrollVolControl = Player.audio.volume * 100;
          var e = window.event || e;
          var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
          delta > 0 ? scrollVolControl += 1 : scrollVolControl -= 1;
          volume(scrollVolControl);
      // }
  }

  function changeActive(index){
    $(".listItem").removeClass("activeItem")
    var item = $(".listItem")[index]
    $(item).addClass("activeItem")
  }
  jQuery(document).ready(function() {
      setTimeout(function() {
        var el = document.createElement("script");
        el.type = "text/javascript";
        el.src = "https://vk.com/js/api/openapi.js";
        el.async = true;
        el.id="vkscript"
        el.onload=function(){
          initiateVK()
        };
        document.getElementsByTagName('body')[0].appendChild(el);
      }, 0);

      try{
        if(!VK){
          console.log("VK", angular.element(document.querySelector('[ng-controller="playerController"]')).scope().response)
          VKMusic.response=angular
                    .element(document.querySelector('[ng-controller="playerController"]'))
                    .scope().response
        }
      }
      catch(e){
        console.log(e)
        VKMusic.response=angular
                  .element(document.querySelector('[ng-controller="playerController"]'))
                  .scope().response
      }
      // initiateVK()
      initBounceButtons("#image img")
      // initToggling({class:"toggPlay"})
      initiMorphPlayPause("ytp-play-button", "#animation")
      $(document).dblclick(function() {
          playOrPause();
      });
      Loader.img = $("#image img")
      $('#cont').on(mousewheelevt, volumeScroll);
      var lock=false;
      var timer;
      $('body').on(mousewheelevt, function(){
        if(timer){timer.clear()}
        if(!lock){
          lock=true
          $('#cont').fadeIn();
          time = setTimeout(function(){
            $('#cont').fadeOut(function(){lock=false});
          }, 3000)
          
        }
      });
      $("#ulMain, #cont, #lyricsContainer").on(mousewheelevt, function(e){e.stopPropagation()});
      //____________________________
        $('.search-panel .dropdown-menu').find('a').click(function(e) {
        e.preventDefault();
        var param = $(this).attr("href").replace("#","");
        var concept = $(this).text();
        $('.search-panel span#search_concept').text(concept);
        $('.input-group #search_param').val(param);
      });
      
        //____________________________
      $( "#query" ).on('input',function() {
        console.log($( this ).val().length)
        if($( this ).val().length>0){

          $( this ).addClass("opacityFull")
          Player.autoNext=false
          $(".searchSourceRadio").removeClass("closed")
          $("#searchclear").show()

        } else{
          //When no input
          $( this ).removeClass("opacityFull")
          Player.autoNext=true
          $(".searchSourceRadio").addClass("closed")
          $("#searchclear").hide()

        }
      });


      $( "#termInput" ).on("input", function() {
        VKSearchAction()
      });

      window.addEventListener('keydown',function(e,val){
         if(e.ctrlKey && e.code=="KeyF") {
          //action
          $('#searchPanel').modal('toggle');
         }
      });

      $("#searchclear").click(function(){
          $("#query").val('');
          $("#query").trigger( "input" );
      });

      // SC.initialize({
      //   client_id: 'bd00189db2bc8ba23deb78a1dd2a7120',

      //   redirect_uri: "http://www.gtplayer.ru/sclogin.html"
      // });

      //SPotify login
      SPToken = Parse.User.current().get("SPToken")
      // if(SPToken){
      //  SPgetAllTracks(SPToken).then(function(res){
      //    SPMusic = res
      //  })
      //  SPChangeButton("spLoginButton", "Log out Spotify", function(){
      //    Parse.User.current().set("SPToken", null).save();
      //    SPChangeButton("spLoginButton", "Link Spotify", SPlogin)
      //  })
      // }else{
      //  SPChangeButton("spLoginButton", "Link Spotify", function(){
      //    SPlogin(function(accessToken) {
      //      Parse.User.current().set("SPToken", accessToken).save()
      //      SPgetAllTracks(SPToken).then(function(res){
      //        SPMusic = res
      //      })
      //     });
      //  })
      // }
      if(SPToken){
        $('#spLoginButton').hide()
        $('#spLogOutButton').show()
        // SPlogin(function(accessToken) {
        //   SPToken = accessToken
        //   Parse.User.current().set("SPToken", SPToken).save()
        // })
        document.addEventListener("VKLoaded",getSPIDSForVK)
      }else{
        $('#spLoginButton').show()
        $('#spLogOutButton').hide()
      }


    }
  );
  function loadUploads(){
    Parse.Cloud.run('getUploads', {}, {
        success: function(result) {
              console.log(result)
              refreshAngular(result);
        }, 
        error:function(e){
            console.log(e)
      }
    })
  }

  function launchVKSearch(){
    var term = $("#query").val()
    $('#searchPanel').modal('toggle');
    $("#termInput").val(term)
    $("#termInput").trigger( "input" );
    $("#termInput").focus()
  }

  function getSPIDSForVK(){
    var matches = Parse.User.current().get("SPVKIdsMatches")
    for(i in VKMusic.response){
      for(m in matches){
        if(VKMusic.response[i].aid==matches[m].VKID && matches[m].SPID!=null) VKMusic.response[i].spotifyID = matches[m].SPID
      }
      if(!VKMusic.response[i].spotifyID) VKMusic.response[i].spotifyID=null
    }
    if(SPToken) getFeaturesForAll(SPToken, VKMusic.response)
  }

  function fireEvent(name){
    var event; // The custom event that will be created

    if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(name, true, true);
    } else {
      event = document.createEventObject();
      event.eventType = name;
    }

    event.eventName = name;

    if (document.createEvent) {
      document.dispatchEvent(event);
    } else {
      document.fireEvent("on" + event.eventType, event);
    }
  }
//# sourceMappingURL=scripts.js.map
