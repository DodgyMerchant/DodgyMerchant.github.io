import ContentManager from "../myJS/MyContent.js";
import MyDisplay from "../myJS/MyDisplay.js";
import { MyHTML } from "../myJS/MyJS.js";
import MyTemplate from "../myJS/MyTemplate.js";

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
  1,
  ["about"],
  false
);

//get data => create content => create contentmanager
fetch("content/content.json")
  .then((results) => results.json())
  .then((data) => {
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
      let _t = ev.currentTarget.parentElement;
      MyDisplay.toggle(MyHTML.getChildById(_t, "content-main"));
      MyDisplay.toggle(MyHTML.getChildById(_t, "content-foot"));
    };

    for (let i = 0; i < data.length; i++) {
      entry = data[i];

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
      //split multi line breaks into seperate paragraphs
      entry.text.split("\n\n").forEach((txt) => {
        //generate paragraph elements for each text section
        elem = document.createElement("p");

        elem.appendChild(document.createTextNode(txt));
        _contMain.append(elem);
      });

      //#endregion text

      _newClone.firstElementChild.addEventListener("pointerdown", toggleDisp);
    }

    //#endregion generate content

    new ContentManager(
      elements,
      "cont-fltr",
      "active",
      "cont-fltrd",
      "active",
      -1
    );
  });
