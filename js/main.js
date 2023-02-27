import ContentManager from "../myJS/MyContent.js";
import { MyHTML } from "../myJS/MyJS.js";
import MyTemplate from "../myJS/MyTemplate.js";

new ContentManager(
  [
    { element: document.getElementById("about"), tags: ["about"] },
    { element: document.getElementById("about-head"), tags: ["about"] },
    { element: document.getElementById("projects"), tags: ["projects"] },
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
    let contDest = document.getElementById("content-destination");

    if (!MyTemplate.supports()) {
      alert(
        "Your browser does not fully support this website!\n My portfolio projects won't be displayed currently."
      );
      return;
    }

    let entry;
    /**
     * @type {HTMLDivElement}
     */
    let _newClone;

    for (let i = 0; i < data.length; i++) {
      entry = data[i];

      _newClone = MyTemplate.addTemplate(contTemp, contDest)[0];

      //save to list for content manager
      elements.push({ element: _newClone, tags: entry.tags });

      //headline
      MyHTML.getChildById(_newClone, "content-headline").innerText =
        entry.headline;
      //sub headline
      MyHTML.getChildById(_newClone, "content-subline").innerText = entry.sub;

      //#region date

      let datS = entry.dateStart;
      let datE = entry.dateEnd;
      let dateText;
      if (datS != "") {
        if (datE != "") {
          dateText = `From ${datS} to ${datE}`;
        } else {
          dateText = `Started ${datS}`;
        }
      } else {
        dateText = `Finished: ${datE}`;
      }

      MyHTML.getChildById(_newClone, "content-date").innerText = dateText;

      //#endregion date
      //#region text

      //split multi line breaks into seperate paragraphs
      entry.text.split("\n\n").forEach((txt) => {
        //generate paragraph elements for each text section
        let elem = document.createElement("p");

        elem.appendChild(document.createTextNode(txt));
        _newClone.append(elem);
      });

      //#endregion text
      //#region img
      let imgTrg = MyHTML.getChildById(_newClone, "content-img");
      imgTrg.src = entry.imageURL;
      imgTrg.alt = entry.imageAlt;
      MyHTML.getChildById(_newClone, "content-img-description").innerText =
        entry.imageAlt;
      //#endregion img
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
