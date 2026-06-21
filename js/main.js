import ContentManager from "../myJS/MyContent.js";
import MyDisplay from "../myJS/MyDisplay.js";
import MyHTML from "../myJS/MyHTML.js";
import MyTemplate from "../myJS/MyTemplate.js";
import { URLTagTracker, URLTagTrackerMulti } from "../myJS/MyURL.js";

// TODO: Project folding indicator. Sketch is in Obsidian.

/**
 *used mouse event to open/close sections. like filters & projects.
 */
const MouseEventToOpen = "pointerup";

//#region HTML iframes

const IFautoResizeClass = "iframe-autoResize";

/**
 * resizes {@link HTMLIFrameElement} to its content size.
 * @param {Event} ev
 */
function iFrameResize(ev) {
  //if im being displayed
  if (MyDisplay.get(ev.target) != "none") {
    ev.target.style.height = ev.target.contentDocument.body.scrollHeight + "px";
  }
}

/*
 * iFrames need to be resized if the view resizes. *sigh*
 */
new ResizeObserver((entries, observer) => {
  //get all iframes that want updates
  for (const iframe of document.getElementsByClassName(IFautoResizeClass)) {
    iframe.dispatchEvent(new Event("resize"));
  }
}).observe(document.documentElement);

//#endregion iframes
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
  const heading = ev.currentTarget;
  const filterGroup = heading.nextElementSibling;

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
// get project data => create project content => create {@link ContentManager} for project data/content

const ContOpenClass = "ContOpen";
const ContCompressedClass = "ContentCompressed";
const ContentPath = "./content/content.json";

fetch(ContentPath)
  .then((results) => results.json())
  .then(
    /**
     * @param {{content: ContentData[], tags: string[], allStatus: string[]}} data
     * @returns
     */
    (data) => {
      //#region URL parameters

      const _sp = new URLSearchParams(window.location.search);
      const UrlObj = {
        /** @type {URLTagTracker} */
        category: new URLTagTracker(
          _sp,
          "c",
          "about",
          {
            about: "about",
            projects: "projects",
            other: "other",
          },
          true,
        ),
        /** @type {URLTagTrackerMulti} */
        filter: new URLTagTrackerMulti(
          _sp,
          "f",
          ["all"],
          Object.fromEntries(data.tags.map((s) => [s, s])),
          false,
        ),
      };

      //#endregion  URL parameters
      //#region category, Top level ContentManager

      // Create ContentManager to manage top level displayed sections: about / projects
      new ContentManager(
        // prettier-ignore
        [
          { element: document.getElementById("about"), tags: [UrlObj.category.tags.about] },
          { element: document.getElementById("about-head"), tags: [UrlObj.category.tags.about] },
          { element: document.getElementById("about-aside"), tags: [UrlObj.category.tags.about] },
          { element: document.getElementById("projects"), tags: [UrlObj.category.tags.projects] },
          { element: document.getElementById("projects-head"), tags: [UrlObj.category.tags.projects] },
          { element: document.getElementById("projects-nav"), tags: [UrlObj.category.tags.projects] },
        ],
        "lvl-filter",
        "active",
        "lvl-filtered",
        "active",
        (manager) => {
          //BUG: setting history doesn't update on navigate back/forward.
          //set URL from category.
          UrlObj.category.set(manager.activeTags[0]);
        },
        undefined,
        undefined,
        1,
        undefined,
        [UrlObj.category.get() ?? UrlObj.category.fallback],
        false,
      );

      //#endregion
      //#region generate content
      const content = data.content;

      const contTemp = document.getElementById("content-template");
      const contDest = document.getElementById("projects");

      const displayEvent = "displayChange";
      class DisplayEvent extends CustomEvent {
        /**
         * dispatched if display status changed
         * @param {boolean} opened if opened (true) or closed (false)
         */
        constructor(opened) {
          super(displayEvent, {
            bubbles: false,
            detail: {
              open: opened,
            },
          });
        }
      }
      /**
       * Toggles the display of the project entry {@link HTMLElement} that is the {@link InputEvent}.
       * @param {InputEvent} ev
       */
      const toggleDisp = function (ev) {
        /**
         * @type {HTMLElement}
         */
        const parent = ev.currentTarget.parentElement;
        MyHTML.toggleClass(parent, ContOpenClass);

        // dispatch display event with new display status.
        // couldn't get capturing to work, so direct dispatch.
        MyHTML.getChildById(parent, "content-iframe").dispatchEvent(
          new DisplayEvent(parent.classList.contains(ContOpenClass)),
        );
      };

      /**
       * Holds data for ContentManager
       * @type {[{element: HTMLElement, tags: string[]}]}
       */
      const elements = [];
      let /**
         * @type {ContentData}
         */
        entry,
        /**
         * @type {HTMLDivElement}
         */
        newClone,
        /**
         * @type {string}
         */
        dateStart,
        /**
         * @type {string}
         */
        dateEnd,
        /**
         * @type {string}
         */
        dateText;

      //add all projects to elements
      for (let i = 0; i < content.length; i++) {
        entry = content[i];
        newClone = MyTemplate.addTemplate(contDest, contTemp)[0];

        //save to list for content manager
        elements.push({ element: newClone, tags: entry.tags });

        //#region headline + sub

        //headline
        MyHTML.getChildById(newClone, "content-headline").innerText =
          entry.headline;
        //sub headline
        MyHTML.getChildById(newClone, "content-subLine").innerText = entry.sub;

        //#endregion headline + sub
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

        /**
         * @type {HTMLIFrameElement}
         */
        const iframe = MyHTML.getChildById(newClone, "content-iframe");

        // add on load resizing
        iframe.addEventListener("load", iFrameResize);
        // add on parent display change
        iframe.addEventListener(displayEvent, iFrameResize);
        // add on resize event
        iframe.addEventListener("resize", iFrameResize);

        //add source
        iframe.src = entry.iFrameSrc;

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
              MyHTML.getChildById(newClone, "content-links"),
              document.getElementById("template-ContLink"),
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
      }

      //#endregion generate content
      //#region make ContentManager
      new ContentManager(
        elements,
        "content-filter",
        "active",
        "content-filtered",
        "active",
        (manager, num, _displayedList, _behavior, _className) => {
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
            // Check if section has a header
            if (!headingList.includes(heading.nodeName))
              // End early if no previous heading present
              continue;
            // Find any child filter that is active
            let ii; // Needed after loop
            for (let ii = 0; ii < subSection.children.length; ii++) {
              // If filter is active
              if (subSection.children[ii].classList.contains("active")) {
                // Give heading active if not present, and end this loop
                heading.classList.add("active");
                break;
              }
            }

            // Remove active class if no children are active
            if (ii >= subSection.children.length)
              heading.classList.remove("active");
          }
          //#endregion active/highlited subsections

          UrlObj.filter.set(manager.activeTags);
        },
        undefined,
        (content) => {
          //#region fold project if not displayed.

          if (
            !content.active &&
            MyHTML.hasAnyClass(content.target, ContOpenClass)
          )
            toggleDisp(
              // Fake event, scuffed I know.
              {
                currentTarget: { parentElement: content.target },
              },
            );

          //#endregion
        },
        undefined,
        UrlObj.filter.fallback,
        UrlObj.filter.get() ?? UrlObj.filter.fallback,
      );
      //#endregion
    },
  );
