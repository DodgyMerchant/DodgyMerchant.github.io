function displayToggle(_id) {
	/**
	 * toggles the display style of an element
	 * uses and saves used computed styles if there is one
	 *
	 * saves the original display in a custom attribute "--rememberDisplay"
	 * this attribute can also be predefined
	 * THis should be dome if the element is not supposed to be a block display
	 * but starts off in as none
	 */
	//get element
	var _el = document.getElementById(_id);
	//get direct style custom value
	var _remdisp = _el.style.getPropertyValue("--rememberDisplay");
	var _disp; //hold current display style used

	//#region direct style
	var _disp = _el.style.display;
	//no direct style set for display
	if (_disp == "") {
		//setting the var
		_disp = window.getComputedStyle(_el).display;
		//saving display val to direct display
		_el.style.display = _disp;
	}
	//#endregion
	//#region remembered style
	//if no rememberence is setup
	if (_remdisp == "") {
		var _give; //this val will be set as remember value
		if (_disp != "none") {
			//if computed style is not none
			_give = _disp; //sets current display value
		} else {
			/* prettier-ignore */
			var _custom = window.getComputedStyle(_el).getPropertyValue("--rememberDisplay");
			if (_custom != "")
				//looks for custom computed var
				_give = _custom;
			else {
				//use fallback value
				_give = "block";
			}
		}
		//set values
		_el.style.setProperty("--rememberDisplay", _give);
		_remdisp = _give;
	}
	//#endregion

	_el.style.display = _el.style.display === "none" ? _remdisp : "none";
}

function getIdStyle(_id) {
	// returns a CSS Style Declaration, all values are named by html style names
	var _el = document.getElementById(_id);
	return getComputedStyle(_el);
}

