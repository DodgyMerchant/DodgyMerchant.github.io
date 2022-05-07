const supportsTemplate = function () {
  if (document.createElement("template").content) {
    console.log("Your browser supports template!");
    return true;
  } else {
    alert("Your browser does not fully support this website!");
    return false;
  }
};

function CreateContentTemplates() {
  if (!supportsTemplate()) return;
  var _container = document.getElementById("content-section");
  var _template = document.getElementById("content-template").content;

  var _newClone = _template.firstElementChild.cloneNode(true);
  _container.appendChild(_newClone);
}
