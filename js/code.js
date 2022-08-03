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

//#region filter
function filterSelection(tag) {
	let elements, effectiveTag, i;
	elements = document.getElementsByClassName("filtered");
	if (tag == "all") {
		effectiveTag = "";
	} else {
		effectiveTag = tag;
	}
	// Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
	for (i = 0; i < elements.length; i++) {
		if (elements[i].className.indexOf(effectiveTag) > -1) {
			w3AddClass(elements[i], "show");
		} else {
			w3RemoveClass(elements[i], "show");
		}
	}

	let filter, ii;
	let filterContainer = document.getElementsByClassName("filterContainer");
	for (i = 0; i < filterContainer.length; i++) {
		filter = filterContainer[i].getElementsByClassName("filter");
		for (ii = 0; ii < filter.length; ii++) {
			if (filter[ii].className.split(" ").includes(tag)) {
				w3AddClass(filter[ii], "active");
			} else {
				w3RemoveClass(filter[ii], "active");
			}
		}
	}
}

// Show filtered elements
function w3AddClass(element, name) {
	let i, arr1, arr2;
	arr1 = element.className.split(" ");
	arr2 = name.split(" ");
	for (i = 0; i < arr2.length; i++) {
		if (arr1.indexOf(arr2[i]) == -1) {
			element.className += " " + arr2[i];
		}
	}
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
	let i, arr1, arr2;
	arr1 = element.className.split(" ");
	arr2 = name.split(" ");
	for (i = 0; i < arr2.length; i++) {
		while (arr1.indexOf(arr2[i]) > -1) {
			arr1.splice(arr1.indexOf(arr2[i]), 1);
		}
	}
	element.className = arr1.join(" ");
}

// Add active class to the current control button (highlight it)
function filterSetup() {
	let filter, i, ii;

	let func = function () {
		let arr = this.className.split(" ");
		filterSelection(arr[arr.indexOf("filter") + 1]);
	};

	let filterContainer = document.getElementsByClassName("filterContainer");
	for (i = 0; i < filterContainer.length; i++) {
		filter = filterContainer[i].getElementsByClassName("filter");
		for (ii = 0; ii < filter.length; ii++) {
			filter[ii].addEventListener("click", func);
		}
	}
}

//#endregion
