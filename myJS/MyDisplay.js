/**
 * html element property name of saved display value.
 * Change freely.
 * @type {string}
 */
const MyDispPropName = "--rememberDisplay";

/**
 * Html Display property handling class.
 * Has only static functions.
 * @version 1.0.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyDisplay {
	/**
	 *
	 * @param {HTMLElement} _el
	 * @returns {String}
	 */
	static setup(_el) {
		let _disp = _el.style.display;

		//no direct style set for display
		if (_disp == "") {
			//setting the var
			_disp = window.getComputedStyle(_el).display;
			//saving display val to direct display
			this.set(_el, _disp);
		}
		return _disp;
	}
	/**
	 *
	 * @param {HTMLElement} _el
	 * @returns
	 */
	static setupRemember(_el) {
		let _remdisp = _el.style.getPropertyValue(MyDispPropName);
		let _disp = this.get(_el);

		//if no rememberence is setup
		if (_remdisp == "") {
			let _give; //this val will be set as remember value
			if (_disp != "none") {
				//if computed style is not none
				_give = _disp; //sets current display value
			} else {
				/* prettier-ignore */
				let _custom = window.getComputedStyle(_el).getPropertyValue(MyDispPropName);
				if (_custom != "")
					//looks for custom computed var
					_give = _custom;
				else {
					//use fallback value
					_give = "block";
				}
			}
			//set values
			this.setRemember(_el, _give);
			_remdisp = _give;
		}

		return _remdisp;
	}

	//other
	/**
	 *
	 * @param {HTMLElement} _el
	 */
	static toggle(_el) {
		/**
		 * toggles the display style of an element
		 * uses and saves used computed styles if there is one
		 *
		 * saves the original display in a custom attribute "--rememberDisplay"
		 * this attribute can also be predefined
		 * THis should be dome if the element is not supposed to be a block display
		 * but starts off in as none
		 */
		//get direct style custom value
		this.setup(_el);
		let _remdisp = this.getRemember(_el);

		this.set(_el, _el.style.display == "none" ? _remdisp : "none");

		return _el.style.display;
	}
	/**
	 * @param {HTMLElement} _el
	 * @param {String | undefined} string
	 */
	static enable(_el, _str) {
		this.setup(_el);
		if (!_str) _str = this.getRemember(_el);

		if (_el.style.display == "none") this.set(_el, _str);
	}
	/**
	 * sets the display property of the given element to "none"
	 * @param {HTMLElement} _el
	 */
	static disable(_el) {
		this.setupRemember(_el);

		if (_el.style.display != "none") this.set(_el, "none");
	}

	/**
	 * get style display property
	 * @param {HTMLElement} _el
	 * @returns {String}
	 */
	static get(_el) {
		let _disp = this.setup(_el);

		return _disp;
	}
	/**
	 * set style display property
	 * @param {HTMLElement} _el
	 * @param {String} display
	 */
	static set(_el, display) {
		_el.style.display = display;
	}

	/**
	 *
	 * @param {HTMLElement} _el
	 * @returns {String}
	 */
	static getRemember(_el) {
		let _rem = this.setupRemember(_el);

		return _rem;
	}
	/**
	 * does not setup
	 * @param {HTMLElement} _el
	 * @param {String} display
	 */
	static setRemember(_el, display) {
		_el.style.setProperty(MyDispPropName, display);
	}
}
