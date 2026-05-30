import ContentManager from "../myJS/MyContent.js";
import MyDisplay from "../myJS/MyDisplay.js";
import MyHTML from "../myJS/MyHTML.js";
import MyTemplate from "../myJS/MyTemplate.js";

// TODO: fold not displayed projects. remove
// TODO: replace more let with const

// BUG: resizing the window wont scale the iframes with it.

const MouseEventToOpen = "pointerup";

//#region iframes

/**
 * resizes {@link HTMLIFrameElement} to its content size.
 * @param {HTMLIFrameElement} el
 */
function iFrameResize(el) {
  el.style.height = el.contentDocument.documentElement.scrollHeight + "px";
}

//#endregion iframes
//#region URL parameters
const urlKeys = {
  category: {
    key: "c",
    about: "about",
    projects: "projects",
  },
  filter: {
    key: "f",
  },
};

// TODO: get filters from the URL and apply them to the filterInit value in the ContentManager constructor.
// window.location.replace() // no reload
// history.replaceState()
// history.pushState()

/**
 * URL parameter interface
 */
const urlParam = new URLSearchParams(window.location.search);

//category
urlParam.get(urlKeys.category.key);
//filter
urlParam.get(urlKeys.filter)?.split("+");

urlKeys.category.projects;

//#endregion  URL parameters
//#region category, Top level ContentManager

/**
 * The default category to apply on load, if no other is provided
 */
const categoryDefault = urlKeys.category.about;

// Create ContentManager to manage top level displayed sections: about / projects
new ContentManager(
  // prettier-ignore
  [
    { element: document.getElementById("about"), tags: [urlKeys.category.about] },
    { element: document.getElementById("about-head"), tags: [urlKeys.category.about] },
    { element: document.getElementById("about-aside"), tags: [urlKeys.category.about] },
    { element: document.getElementById("projects"), tags: [urlKeys.category.projects] },
    { element: document.getElementById("projects-head"), tags: [urlKeys.category.projects] },
    { element: document.getElementById("projects-nav"), tags: [urlKeys.category.projects] },
  ],
  "lvl-filter",
  "active",
  "lvl-filtered",
  "active",
  undefined,
  undefined,
  1,
  [urlParam.get(urlKeys.category.key) ?? categoryDefault],
  false,
);

//#endregion
//#region filter

const filterFoldClass = "filterFold";
const filterOpenClass = "filterOpen";
const filterClosedDec = "+";
const filterOpenDec = "-";

// get all filter sub group headings
const collection = document.getElementsByClassName(filterFoldClass);

/**
 * Callback function for the data panels filter group headings.
 * @param {PointerEvent} ev
 */
const filterGroupCallback = (ev) => {
  let heading = ev.currentTarget;
  let filterGroup = heading.nextElementSibling;

  // toggles the display status of the filter group
  MyHTML.toggleClass(filterGroup, filterOpenClass);

  // updates sub filter Heading display depending on the display status of its filter group
  filterHeadingUpdate(
    heading,
    MyHTML.hasAnyClass(filterGroup, filterOpenClass),
  );
};

/**
 * Updates the provided {@link HTMLElement}s visuals to match its provided open/closed state.
 * @param {HTMLElement} el
 * @param {boolean} open
 */
const filterHeadingUpdate = (el, open) => {
  el.firstElementChild.innerText = open ? filterOpenDec : filterClosedDec;
};

/**
 * @type {Element}
 */
let h3;
// go through all items
for (let i = 0; i < collection.length; i++) {
  h3 = collection.item(i);
  h3.addEventListener(MouseEventToOpen, filterGroupCallback);

  filterHeadingUpdate(
    h3,
    MyHTML.hasAnyClass(h3.nextElementSibling, filterOpenClass),
  );
}

//#endregion filter
//#region definitions
/**
 * @typedef {Object} ContentData content data loaded in to produce content for my website.
 * @property {string} headline Headline for this content block.
 * @property {string} sub Descriptive sub headline for this content block.
 * @property {string[]} tags list of strings that are tags relating to this content block. Used for filtering.
 * @property {string} dateStart Project start text. Can be a date or a word.
 * @property {string} dateEnd Project end text. Can be a date or a word.
 * @property {string} status status it the project.
 * @property {string} iFrameSrc Filepath to the html file to be displayed in the iFrame.
 * TODO: implement language.
 * @property {string} language language of the project.
 * @property {{repo: string, links: ContentLink[]}} footer footer data list.
 */
/**
 * @typedef {Object} ContentLink link data.
 * @property {string} URL url of the link.
 * @property {string} text text of the link.
 */
//#endregion definitions
//#region Content ContentManager
// get project data => create project content => create {@link ContentManager} for project data/content

const displayEvent = "display";
class DisplayEvent extends CustomEvent {
  /**
   * dispatched if display status changed
   * @param {boolean} opened if opened (true) or closed (false)
   */
  constructor(opened) {
    super(displayEvent, {
      detail: {
        open: opened,
      },
    });
  }
}

const ContOpenClass = "ContOpen";
const ContCompressedClass = "ContentCompressed";

fetch("./content/content.json")
  .then((results) => results.json())
  .then(
    /**
     * @param {{content: ContentData[]}} data
     * @returns
     */
    (data) => {
      /**
       * Holds data for ContentManager
       * @type {[{element: HTMLElement, tags: string[]}]}
       */
      const elements = [];

      //#region generate content

      const contTemp = document.getElementById("content-template");
      const contDest = document.getElementById("projects");

      if (!MyTemplate.supports()) {
        alert(
          "Your browser does not fully support this website!\n My portfolio projects won't be displayed currently.",
        );
        return;
      }
      // TODO: move variables to where they are used.
      /**
       * @type {ContentData}
       */
      let entry;
      /**
       * @type {string}
       */
      let dateStart,
        /**
         * @type {string}
         */
        dateEnd,
        /**
         * @type {HTMLDivElement}
         */
        newClone,
        dateText;

      /**
       * Toggles the display of the project entry {@link HTMLElement} that is the {@link InputEvent}.
       * @param {InputEvent} ev
       */
      const toggleDisp = function (ev) {
        const parent = ev.currentTarget.parentElement;
        MyHTML.toggleClass(parent, ContOpenClass);

        //dispatch display event with new display status.
        MyHTML.getChildById(parent, "content-iframe").dispatchEvent(
          new DisplayEvent(parent.classList.contains(ContOpenClass)),
        );
      };

      const regN = new RegExp("[\r\n]");
      let content;

      //add all projects
      for (let i = 0; i < data.content.length; i++) {
        entry = data.content[i];
        newClone = MyTemplate.addTemplate(contTemp, contDest)[0];

        //save to list for content manager
        elements.push({ element: newClone, tags: entry.tags });

        //headline
        MyHTML.getChildById(newClone, "content-headline").innerText =
          entry.headline;
        //sub headline
        MyHTML.getChildById(newClone, "content-subLine").innerText = entry.sub;

        //#region date

        dateStart = entry.dateStart;
        dateEnd = entry.dateEnd;
        if (dateStart && dateStart != "") {
          if (dateEnd && dateEnd != "") {
            if (dateEnd.match(/\d+/g)) {
              //dateEnd is a number
              dateText = `From ${dateStart} to ${dateEnd}`;
            } else {
              //dateEnd is a word
              dateText = `From ${dateStart}, ${dateEnd}.`;
            }
          } else {
            dateText = `Started ${dateStart}`;
          }
        } else {
          if (dateEnd && dateEnd != "") dateText = `Finished ${dateEnd}`;
        }

        if (dateText)
          MyHTML.getChildById(newClone, "content-date").innerText = dateText;
        else MyHTML.getChildById(newClone, "content-date").remove();
        //#endregion date
        //#region status

        if (entry.status && entry.status != "")
          MyHTML.getChildById(
            newClone,
            "project-status",
          ).lastElementChild.innerText = entry.status;
        else MyHTML.getChildById(newClone, "project-status").remove();

        //#endregion status
        //#region content

        if (entry.iFrameSrc) {
          /**
           * @type {HTMLIFrameElement}
           */
          const iframe = MyHTML.getChildById(newClone, "content-iframe");

          //add on load resizing
          iframe.addEventListener("load", (ev) =>
            iFrameResize(ev.currentTarget),
          );
          iframe.addEventListener(displayEvent, (ev) => {
            if (ev.detail.open) iFrameResize(ev.currentTarget);
          });

          //add source
          iframe.src = entry.iFrameSrc;
        }

        //#endregion content
        //#region footer

        //#region repo
        const repoA = MyHTML.getChildById(newClone, "content-repo");
        if (entry.footer.repo) {
          repoA.innerText = entry.footer.repo;
          repoA.href = entry.footer.repo;
        } else {
          MyDisplay.disable(repoA.parentElement);
        }
        //#endregion repo
        //#region links
        if (entry.footer.links.length > 0) {
          let linkObj, link;
          for (let i = 0; i < entry.footer.links.length; i++) {
            linkObj = entry.footer.links[i];
            link = MyTemplate.addTemplate(
              document.getElementById("template-ContLink"),
              MyHTML.getChildById(newClone, "content-links"),
            )[0];
            link.firstChild.textContent = linkObj.text;
            link.firstElementChild.innerText = linkObj.URL;
            link.firstElementChild.href = linkObj.URL;
          }
        } else if (!entry.footer.repo) {
          MyDisplay.disable(MyHTML.getChildById(newClone, "content-links"));
        }
        //#endregion links

        //#endregion footer

        //tags
        MyHTML.getChildById(newClone, "content-tags").innerText =
          entry.tags.join(", ");

        // open/close project
        newClone.firstElementChild.addEventListener(
          MouseEventToOpen,
          toggleDisp,
        );
        // _newClone.firstElementChild.addEventListener("pointerdown", toggleDisp);
      }

      //#endregion generate content
      //#region make ContentManager
      new ContentManager(
        elements,
        "content-filter",
        "active",
        "content-filtered",
        "active",
        (num, _displayedList, _behavior, _className) => {
          //#region no projects found message
          // TODO: look if making Project not found message a feature makes sense.

          //enable and disable no projects found message.
          if (num == 0) {
            MyDisplay.enable(document.getElementById("projects-empty"));
          } else {
            MyDisplay.disable(document.getElementById("projects-empty"));
          }
          //#endregion no projects found message
          //#region projects found counter
          document.getElementById("projects-number").innerText = num.toString();
          //#endregion projects found counter
          //#region active/highlited subsections

          //search all sub section for active filters and turn headings active
          const subSections = document.getElementsByClassName("subFilter");
          const headingList = ["H2", "H3", "H4", "H5", "H6"];
          let subSection, heading;
          for (let i = 0; i < subSections.length; i++) {
            subSection = subSections.item(i);
            heading = subSection.previousElementSibling;
            //check if section has a header its a header
            if (!headingList.includes(heading.nodeName))
              //end early if no previous heading present
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
        },
        undefined,
        undefined,
        ["all"],
      );
      //#endregion
    },
  );

//#endregion
