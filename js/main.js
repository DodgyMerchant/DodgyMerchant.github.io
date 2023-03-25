import ContentManager from "../myJS/MyContent.js";
import MyDisplay from "../myJS/MyDisplay.js";
import { MyHTML } from "../myJS/MyJS.js";
import MyTemplate from "../myJS/MyTemplate.js";

const ContOpenClass = "ContOpen";
const ContCompressedClass = "ContCmprssd";
const FltrOpenClass = "FltrOpen";
const FltrClosedDec = "+";
const FltrOpenDec = "-";

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
  // h3.addEventListener("pointerdown", filtFunc);
  h3.addEventListener("pointerup", filtFunc);

  h3Update(h3, MyHTML.hasAnyClass(h3.nextElementSibling, FltrOpenClass));
}

//#endregion filter

/*

"content": [
        {
          "type": "image",
          "URL": "https://thumbs.gfycat.com/HelplessPeacefulArkshell-max-1mb.gif",
          "alt": "A GIF of my game, HANDS. Rock Paper Scissors but weird."
        },
        {
          "type": "text",
          "text": "SPITE will never be a fun game, that is not in its nature.\nBut still technically a game, I'm referring to it more as an experience.\nThe game is about the weakness of a dying person.\nHow energy leaves the body, but the will to survive doesn't.\n\nA soldier on deaths' door is hunted by creatures fleeing from the battlefield.\n\nIf one dies, it isn't from a lack of health points, but from the loss of energy.\nSo, hope you can stand up before you can't."
        }
      ],



*/
/**
 * @typedef {Object} ContentData content data loaded in to produce content for my website.
 * @property {string} headline Headline for this content block.
 * @property {string} sub Descriptive sub headline for this content block.
 * @property {string[]} tags list of strigns that are tags relating to this content block. Used for filtering.
 * @property {string} dateStart Project start text. Can be a date or a word.
 * @property {string} dateEnd Project end text. Can be a date or a word.
 * @property {string} status status it the project.
 * @property {ContentImage[] | ContentText[]} content content object list.
 * @property {{repo: string, links: ContentLink[]}} footer footer data list.
 */
/**
 * @typedef {Object} ContentImage image data loaded in to produce content for my website.
 * @property {"image"} type type of object.
 * @property {string} URL url to image.
 * @property {string} alt text description of image.
 */
/**
 * @typedef {Object} ContentText image data loaded in to produce content for my website.
 * @property {"text"} type type of object.
 * @property {string} text text relating to the content.
 */
/**
 * @typedef {Object} ContentLink link data.
 * @property {string} URL url of the link.
 * @property {string} text text of the link.
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
      let content;

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
        //#region status

        MyHTML.getChildById(
          _newClone,
          "project-status"
        ).lastElementChild.innerText = entry.status;

        //#endregion status

        //#region content

        for (let ii = 0; ii < entry.content.length; ii++) {
          content = entry.content[ii];

          switch (content.type) {
            case "image":
              // <img id="content-img" src="" alt="placeholder image" />
              //       <p id="content-img-description">EEEEE</p>

              _newImg = document.createElement("img");
              _newImgDesc = document.createElement("p");

              _newImg.src = content.URL;
              _newImg.alt = content.alt;
              _newImgDesc.innerText = content.alt;

              _contMain.append(_newImg);
              _contMain.append(_newImgDesc);

              break;
            case "text":
              let elem;

              content.text.split(regN).forEach((txt) => {
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

              break;
            default:
              console.error(
                "Content type not implemented!",
                entry.headline,
                content
              );
              break;
          }
        }

        //#endregion content
        //#region footer

        //repo

        let repExist = entry.footer.repo != "";
        let repoA = MyHTML.getChildById(_newClone, "content-repo");
        if (repExist) {
          repoA.innerText = entry.footer.repo;
          repoA.href = entry.footer.repo;
        } else {
          MyDisplay.disable(repoA.parentElement);
        }

        //links
        if (entry.footer.links.length > 0) {
          let linkObj, link;
          for (let i = 0; i < entry.footer.links.length; i++) {
            linkObj = entry.footer.links[i];
            link = MyTemplate.addTemplate(
              document.getElementById("template-ContLink"),
              MyHTML.getChildById(_newClone, "content-links")
            )[0];
            link.firstChild.textContent = linkObj.text;
            link.firstElementChild.innerText = linkObj.URL;
            link.firstElementChild.href = linkObj.URL;
          }
        } else if (!repExist) {
          MyDisplay.disable(MyHTML.getChildById(_newClone, "content-links"));
        }

        //#endregion footer

        MyHTML.getChildById(_newClone, "content-tags").innerText =
          entry.tags.join(", ");

        // _newClone.firstElementChild.addEventListener("pointerdown", toggleDisp);
        _newClone.firstElementChild.addEventListener("pointerup", toggleDisp);
        // _newClone.addEventListener("pointerup")
      }

      //#endregion generate content

      new ContentManager(
        elements,
        "cont-fltr",
        "active",
        "cont-fltrd",
        "active",
        (num) => {
          //#region no projects found message
          //enable and disable no projects found message.
          if (num == 0) {
            MyDisplay.enable(document.getElementById("projects-empty"));
          } else {
            MyDisplay.disable(document.getElementById("projects-empty"));
          }
          document.getElementById("projects-number").innerText = num.toString();

          //#endregion no projects found message

          //#region active/highlited subsections
          //search all sub section for active filters and turn headins active
          let subSections = document.getElementsByClassName("subFilter");
          let subSection, heading;
          for (let i = 0; i < subSections.length; i++) {
            subSection = subSections.item(i);
            heading = subSection.previousElementSibling;
            //check if section has a header its a header
            if (!["H2", "H3", "H4", "H5", "H6"].includes(heading.nodeName))
              //end early if not
              continue;
            //find any child filter that is active
            let ii;
            for (ii = 0; ii < subSection.children.length; ii++) {
              //if filter is active
              if (subSection.children[ii].classList.contains("active")) {
                //Give heading active if not present, and end this loop
                heading.classList.add("active");
                break;
              }
            }

            //remove active class if no children are active
            if (ii >= subSection.children.length)
              heading.classList.remove("active");
          }
          //#endregion active/highlited subsections
        }
      );
    }
  );
