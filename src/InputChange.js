/*!
 * InputChange v1.0.0
 * Copyright (c) 2013, in shenzhen. luzhao@xunlei.com
 */
 
(function(window) {
	var isSupportOnInput = !window.attachEvent;

	var InputChange = function( el, callback ) {
		if (!(this instanceof InputChange)) {
			var obj = new InputChange( el, callback );
			return obj;
		}

		if( !el || el.nodeType !== 1 ) {
			throw new Error("Error parameter!");
		}

		this._el = el;
		this._value = this._el.value;
		this._callback = util.isFunction(callback) ? callback : function(){};
		util.addEvent( this._el, "focus", util.bind(this._focusHandler, this) );
		util.addEvent( this._el, "blur", util.bind(this._blurHandler, this) );
	}

	InputChange.prototype = {
		constructor: InputChange,
		
		_focusHandler: function() {
			if( window.attachEvent ) {
				util.addEvent( this._el, "propertychange", util.bind( this._inputHander, this ) );
			}
			else {
				util.addEvent( this._el, "input", util.bind( this._inputHander, this ) );
			}
			
		},

		_blurHandler: function() {
			if( window.attachEvent ) {
				util.removeEvent( this._el, "propertychange", util.bind( this._inputHander, this ) );
			}
			else {
				util.removeEvent( this._el, "input", util.bind( this._inputHander, this ) );
			}
		},

		_inputHander: function( e ) {
			var value = this._el.value,
				e = e || window.event;

			if( isSupportOnInput ) {
				this._callback(value);
			}
			else {
				e && e.propertyName == "value" && this._callback(value);
			}
		}
	};

	var util = {
		isFunction: function(obj) {
			return Object.prototype.toString.call(obj) === "[object Function]";
		},

		addEvent: function(elem, type, func) {
			if(elem.addEventListener){
				elem.addEventListener(type, func, false);
			}
			else if(elem.attachEvent){
				elem.attachEvent("on" + type, func);
			}
		},

		removeEvent: function(elem, type, func) {
			if(elem.addEventListener){
				elem.removeEventListener(type, func);
			}
			else if(elem.attachEvent){
				elem.detachEvent("on" + type, func);
			}
		},

		bind: function(func, context){
			if (Function.prototype.bind) {
				return func.bind(context);
			}
			else {
				return function(){
					return func.apply(context, Array.prototype.slice.call(arguments, 0));
				};
			}
		}
	};
	
	window.InputChange = InputChange;
})(window)