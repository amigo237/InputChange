/*!
 * InputChange v1.0.0
 * Copyright (c) 2013, in shenzhen. luzhao@xunlei.com
 */
 
(function(window) {

	/*
	经过测试，ie6-ie8可以用onpropertychange事件模拟oninput事件，
	ie9的onpropertychange在输入的时候会触发，删除字符的时候不会触发，
	ie9支持oninput事件，但是删除，剪切的时候不会触发，为了统一处理，这儿用定时器来检查
	*/
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
			if( !isSupportOnInput ) {
				this._checkChangeTimerId = setInterval( util.bind( this._inputHandler, this ), 100 );
				//util.addEvent( this._el, "propertychange", this._inputHandlerReal = util.bind( this._inputHandler, this ) );
			}
			else {
				util.addEvent( this._el, "input", this._inputHandlerReal = util.bind( this._inputHandler, this ) );
			}
			
		},

		_blurHandler: function() {
			if( !isSupportOnInput ) {
				clearInterval(this._checkChangeTimerId);
				//util.removeEvent( this._el, "propertychange", util.bind( this._inputHandler, this ) );
			}
			else {
				util.removeEvent( this._el, "input", this._inputHandlerReal );
			}
		},

		_inputHandler: function( e ) {
			var value = this._el.value;
			//var e = e || window.event;
			if( isSupportOnInput ) {
				this._callback(value);
			}
			else {
				if( this._value !== value ) {
					this._value = value;
					this._callback(value);
				}
				//e && e.propertyName == "value" && this._callback(value);
			}
		}
	};

	var util = {
		isFunction: function(obj) {
			return Object.prototype.toString.call(obj) === "[object Function]";
		},

		addEvent: function(elem, type, func) {
			if(elem.attachEvent){
				elem.attachEvent("on" + type, func);
			}
			else {
				elem.addEventListener(type, func, false);
			}
		},

		removeEvent: function(elem, type, func) {
			if(elem.attachEvent){
				elem.detachEvent("on" + type, func);
			}
			else {
				elem.removeEventListener(type, func);
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