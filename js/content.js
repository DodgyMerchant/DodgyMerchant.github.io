//#region  base setup
//check for Template support
const supportsTemplate = document.createElement("Template").content;

//continue or exit
if (supportsTemplate) {
	console.log("Your browser supports Template!");
} else {
	console.log("Your browser does NOT support Template!!!");
	alert("Your browser does not fully support this website!\n My portfolio projects won't be displayed currently.");
	// throw new Error();
	stop(); //this is not optimal
}

//setup Container for content
const Container = document.getElementById("content-destination");
const Template = document.getElementById("content-template").content;

//#endregion

function ContentCreate(data) {
	if (!supportsTemplate) return;
	let entry, i, _newClone, img;

	for (i = 0; i < data.length; i++) {
		entry = data[i];

		_newClone = document.importNode(Template, true);

		_newClone.getElementById("content-article").classList.add(entry.topics);
		_newClone.getElementById("content-headline").innerText = entry.headline;
		_newClone.getElementById("content-subline").innerText = entry.sub;
		_newClone.getElementById("content-date").innerText = entry.date;
		_newClone.getElementById("content-Text").innerText = entry.text;
		img = _newClone.getElementById("content-img");
		img.src = "./content/" + entry.imageURL;
		img.alt = entry.imageAlt;

		Container.appendChild(_newClone);
	}
}

function ContentClear() {
	var _child = Container.firstElementChild;
	while (_child) {
		Container.removeChild(_child);
		var _child = Container.firstElementChild;
	}
}

/*
var _template = document.getElementById("content-Template").content;

*/
