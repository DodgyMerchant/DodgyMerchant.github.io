import ContentManager from "../myJS/MyContent.js";
import MyDisplay from "../myJS/MyDisplay.js";
import { MyHTML } from "../myJS/MyJS.js";
import MyTemplate from "../myJS/MyTemplate.js";

const ContOpenClass = "ContOpen";
const FltrOpenClass = "FltrOpen";
const FltrClosedDec = "-";
const FltrOpenDec = "x";

new ContentManager(
  [
    { element: document.getElementById("about"), tags: ["about"] },
    { element: document.getElementById("about-head"), tags: ["about"] },
    { element: document.getElementById("about-aside"), tags: ["about"] },
    { element: document.getElementById("projects"), tags: ["projects"] },
    { element: document.getElementById("projects-head"), tags: ["projects"] },
    { element: document.getElementById("projects-nav"), tags: ["projects"] },
  ],
  "lvl-fltr",
  "active",
  "lvl-fltrd",
  "active",
  undefined,
  1,
  ["about"],
  false
);

//#region filter

let collection = document
  .getElementById("projects-nav")
  .getElementsByClassName("clickable");

let filtFunc = (ev) => {
  /**
   * @type {HTMLParagraphElement}
   */
  let _t = ev.currentTarget;
  let _after = _t.nextElementSibling;

  if (MyHTML.hasAnyClass(_after, FltrOpenClass)) {
    MyHTML.removeClass(_after, FltrOpenClass);
    h3Update(_t, false);
  } else {
    MyHTML.addClass(_after, FltrOpenClass);
    h3Update(_t, true);
  }
};
let h3Update = (h3, open) => {
  if (open) h3.firstElementChild.innerText = FltrOpenDec;
  else h3.firstElementChild.innerText = FltrClosedDec;
};
let h3;
for (let i = 0; i < collection.length; i++) {
  h3 = collection.item(i);
  h3.addEventListener("pointerdown", filtFunc);

  h3Update(h3, MyHTML.hasAnyClass(h3.nextElementSibling, FltrOpenClass));
}

//#endregion filter

/**
 * @typedef {Object} ContentData content data loaded in to produce content for my website.
 * @property {string} headline Headline for this content block.
 * @property {string} sub Descriptive sub headline for this content block.
 * @property {string[]} tags list of strigns that are tags relating to this content block. Used for filtering.
 * @property {string} dateStart Project start text. Can be a date or a word.
 * @property {string} dateEnd Project end text. Can be a date or a word.
 * @property {string} status status it the project.
 * @property {ContentImage} image List of image objects.
 * @property {string} text text relating to the content.
 */
/**
 * @typedef {Object} ContentImage image data loaded in to produce content for my website.
 * @property {string} URL url to image.
 * @property {string} alt text description of image.
 */

//get data => create content => create contentmanager
fetch("content/content.json")
  .then((results) => results.json())
  .then(
    /**
     *
     * @param {{content: ContentData[]}} data
     * @returns
     */
    (data) => {
      /**
       * hodls data for ContentManager
       * @type {{element: HTMLElement, tags: string[]}}
       */
      let elements = [];

      //#region generate content

      let contTemp = document.getElementById("content-template");
      let contDest = document.getElementById("projects");

      if (!MyTemplate.supports()) {
        alert(
          "Your browser does not fully support this website!\n My portfolio projects won't be displayed currently."
        );
        return;
      }
      /**
       * @type {ContentData}
       */
      let entry;
      /**
       * @type {string}
       */
      let datS,
        /**
         * @type {string}
         */
        datE,
        /**
         * @type {Object{URL: string, alt: string}}
         */
        imgData,
        /**
         * @type {HTMLDivElement}
         */
        _newClone,
        _newImg,
        _newImgDesc,
        _contMain;

      /**
       *
       * @param {InputEvent} ev
       */
      let toggleDisp = function (ev) {
        // let _t = ev.currentTarget.parentElement;
        // MyDisplay.toggle(MyHTML.getChildById(_t, "content-main"));
        // MyDisplay.toggle(MyHTML.getChildById(_t, "content-foot"));

        MyHTML.toggleClass(ev.currentTarget.parentElement, ContOpenClass);
      };

      let regN = new RegExp("[\r\n]");

      for (let i = 0; i < data.content.length; i++) {
        entry = data.content[i];

        _newClone = MyTemplate.addTemplate(contTemp, contDest)[0];
        _contMain = MyHTML.getChildById(_newClone, "content-main");

        //save to list for content manager
        elements.push({ element: _newClone, tags: entry.tags });

        //headline
        MyHTML.getChildById(_newClone, "content-headline").innerText =
          entry.headline;
        //sub headline
        MyHTML.getChildById(_newClone, "content-subline").innerText = entry.sub;

        //#region date

        datS = entry.dateStart;
        datE = entry.dateEnd;
        let dateText;
        if (datS != "") {
          if (datE != "") {
            if (datE.match(/\d+/g)) {
              dateText = `From ${datS} to ${datE}`;
            } else {
              //datE is a word
              dateText = `From ${datS}, ${datE}.`;
            }
          } else {
            dateText = `Started ${datS}`;
          }
        } else {
          dateText = `Finished: ${datE}`;
        }

        MyHTML.getChildById(_newClone, "content-date").innerText = dateText;

        //#endregion date
        //#region img

        for (let ii = 0; ii < entry.image.length; ii++) {
          imgData = entry.image[ii];

          // <img id="content-img" src="" alt="placeholder image" />
          //       <p id="content-img-description">EEEEE</p>

          _newImg = document.createElement("img");
          _newImgDesc = document.createElement("p");

          _newImg.src = imgData.URL;
          _newImg.alt = imgData.alt;
          _newImgDesc.innerText = imgData.alt;

          _contMain.append(_newImg);
          _contMain.append(_newImgDesc);
        }

        //#endregion img
        //#region text
        let elem;

        entry.text.split(regN).forEach((txt) => {
          if (txt.length == 0) {
            //split multi line breaks into seperate paragraphs
            _contMain.append(document.createElement("br"));
          } else {
            //generate paragraph elements for each text section
            elem = document.createElement("p");

            elem.appendChild(document.createTextNode(txt));
            _contMain.append(elem);
          }
        });

        //#endregion text

        MyHTML.getChildById(_newClone, "content-tags").innerText =
          entry.tags.join(", ");

        _newClone.firstElementChild.addEventListener("pointerdown", toggleDisp);
      }

      //#endregion generate content

      new ContentManager(
        elements,
        "cont-fltr",
        "active",
        "cont-fltrd",
        "active",
        (num) => {
          //enable and disable no projects found message.

          console.log("proj found: ", num);
          if (num == 0) {
            MyDisplay.enable(document.getElementById("projects-empty"));
          } else {
            MyDisplay.disable(document.getElementById("projects-empty"));
          }
          document.getElementById("projects-number").innerText = num.toString();
        }
      );
    }
  );
