//check for template support
const supportsTemplate = document.createElement("template").content;

//continue or exit
if (supportsTemplate) {
  console.log("Your browser supports template!");
} else {
  console.log("Your browser does NOT support template!!!");
  alert(
    "Your browser does not fully support this website!\n My portfolio projects won't be displayed currently."
  );
  // throw new Error();
  stop(); //this is not optimal
}

//setup container for content
const container = document.getElementById("content-section");
const template = document.getElementById("content-template").content;

function ContentCreate() {
  if (!supportsTemplate) return;

  var _elements = document.querySelectorAll(".project-data");
  var _leng = _elements.length;
  for (var i = 0; i < _leng; i++) {
    _elements[i].id = "abc-" + i;
  }

  var _elements = document.querySelectorAll(".project-data");
  var _leng = _elements.length;
  for (var i = 0; i < _leng; i++) {
    _elements[i].id = "abc-" + i;
  }

  var _new_node = ContentCreateArticle(template); //creates a new article with no info
  var _new_node = ContentCreateArticle(template); //creates a new article with no info
  var _new_node = ContentCreateArticle(template); //creates a new article with no info
  var _new_node = ContentCreateArticle(template); //creates a new article with no info
  var _new_node = ContentCreateArticle(template); //creates a new article with no info

  // var _text = _new_node.("content-text");
  // _text.style.color = "blue";

  // _node.nodeType
}

function ContentClear() {
  var _child = container.firstElementChild;
  while (_child) {
    container.removeChild(_child);
    var _child = container.firstElementChild;
  }
}

function ContentCreateArticle(_node) {
  // var _newClone = _node.firstElementChild.cloneNode(true);
  var _newClone = document.importNode(_node, true);
  container.appendChild(_newClone);
  return _newClone;
}

/*
var _template = document.getElementById("content-template").content;

*/
