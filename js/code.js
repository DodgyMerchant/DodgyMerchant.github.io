function filterlisttoggle(_id) {
	// var _el = document.getElementById("filter-list");
	var _el = document.getElementById(_id);
	var _style = window.getComputedStyle(_el);

	console.log("hello");

	if (_style.display == "none") {
		_style.display = "block";
	} else {
		_style.display = "none";
	}

	// _el.style.display = _el.style.display === "none" ? "block" : "none";
}

function getIdStyle(_id) {
	// returns a CSS Style Declaration, all values are named by html style names
	var _el = document.getElementById(_id);
	return getComputedStyle(_el);
}
