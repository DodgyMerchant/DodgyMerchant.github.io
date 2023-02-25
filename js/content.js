import MyDisplay from "../myJS/MyDisplay.js";
import { MyArr, MyHTML } from "../myJS/MyJS.js";
import MyTags from "../myJS/MyTags.js";
import MyTemplate from "../myJS/MyTemplate.js";

//#region get element

const FilterNav = document.getElementById("filter-nav");
/**
 *@type {HTMLButtonElement}
 */
const FilterButton = document.getElementById("filter-button");

/**
 * @type {HTMLDivElement}
 */
const ContentDestination = document.getElementById("content-destination");
/**
 * @type {HTMLTemplateElement}
 */
const ContentTemplate = document.getElementById("content-template");

//#endregion get element
//#region genearal events

//filter button
FilterButton.addEventListener("click", () => {
  MyDisplay.toggle(FilterNav);
});

//#endregion genearal events
//#region template support
if (!MyTemplate.supports())
  alert(
    "Your browser does not fully support this website!\n My portfolio projects won't be displayed currently."
  );
//#endregion template support

/**
 * tracks and manages its content
 */
class Content {
  /**
   * handler
   * @type {ContentHandler}
   */
  handler;
  /**
   * content elmeent this object manages.
   * @type {HTMLElement}
   */
  target;
  /**
   * @type {string[]}
   */
  tags;

  /**
   * @type {boolean} active
   */
  _active = false;
  get active() {
    return this._active;
  }
  set active(bool) {
    this._active = bool;

    if (bool) {
      MyHTML.addClass(this.target, this.handler.filteredClassActive);
    } else {
      MyHTML.removeClass(this.target, this.handler.filteredClassActive);
    }
  }

  /**
   *
   * @param {ContentHandler} handler
   * @param {HTMLElement} target
   * @param {string[]} tags
   */
  constructor(handler, target, tags) {
    this.handler = handler;
    this.target = target;
    this.tags = tags;
  }
}

/**
 * @type {ContentHandler}
 */
var contentHandler;

/**
 * @typedef {Object} ContentData content data object containing all data for a content block.
 * @property {string} headline text
 * @property {string} sub text
 * @property {string} dateStart text
 * @property {string} dateEnd text
 * @property {string} imageAlt desc
 * @property {string} imageURL desc
 * @property {string} text desc
 * @property {string[]} tags desc
 */
/**
 *
 */
class ContentHandler {
  //#region configurable

  //#endregion
  //#region filter elements

  /**
   * name of the class that designamtes an HTML element as a filter button.
   * @type {string}
   */
  filterClassName;
  /**
   * class name of active filters
   * @type {string}
   */
  filterClassActive;
  /**
   * Maximum number of filters. -1 for infinite.
   * @type {number}
   */
  filterNumMax;

  /**
   * how many tags in the filter ellement have to match for the object to be active.
   * @type {import("../myJS/MyTags.js").TagBehavior}
   */
  filterBehavior = "all";

  //#endregion filter
  //#region filtered elements
  /**
   * name of the class that designamtes an HTML element as a filtered Element.
   * @type {string}
   */
  filteredClassName;
  /**
   * class name of active filters
   * @type {string}
   */
  filteredClassActive;

  /**
   * how many tags in the filtered element have to match for the object be displayed.
   * @type {import("../myJS/MyTags.js").TagBehavior}
   */
  filteredBehavior = "match";

  //#endregion filtered
  //#region tags and filters

  /**
   * map of all tags
   * @type {Map<string, any>}
   */
  // tagMap = new Map();

  /**
   * @type {string[]}
   */
  activeFilters = [];

  //#endregion filtered
  //#region
  /**
   * @type {Content}
   */
  contentList = [];

  //#endregion

  /**
   *
   * @param {HTMLTemplateElement} template
   * @param {HTMLElement} destination
   * @param {string} filterClassName
   * @param {string | undefined} filterClassActive Name of the class set to a filter if its tags are in use. Used to Highlight active filters.
   * @param {string} filteredClassName
   * @param {string} filteredClassActive Name of the class set to a filtered object if is can be displayed.
   * @param {string} filterNumMax Maximum number of filters. -1 for infinite.
   * @param {[ContentData]} data
   * @returns
   */
  constructor(
    template,
    destination,
    filterClassName,
    filterClassActive,
    filteredClassName,
    filteredClassActive,
    filterNumMax,
    data
  ) {
    if (!MyTemplate.supports()) return;

    console.log(data);

    //#region content create
    let entry;
    /**
     * @type {HTMLDivElement}
     */
    let _newClone;

    for (let i = 0; i < data.length; i++) {
      entry = data[i];

      _newClone = MyTemplate.addTemplate(template, destination)[0];

      this.contentList.push(new Content(this, _newClone, entry.tags));

      this.setContent(
        _newClone,
        entry.tags.join(","),
        MyHTML.getChildByID(_newClone, "content-headline"),
        entry.headline,
        MyHTML.getChildByID(_newClone, "content-subline"),
        entry.sub,
        MyHTML.getChildByID(_newClone, "content-date"),
        entry.dateStart,
        entry.dateEnd,
        _newClone,
        entry.text,
        MyHTML.getChildByID(_newClone, "content-img"),
        MyHTML.getChildByID(_newClone, "content-img-description"),
        entry.imageURL,
        entry.imageAlt
      );
    }

    //#endregion
    //#region filter

    this.filterClassName = filterClassName;
    this.filterClassActive = filterClassActive;
    this.filterNumMax = filterNumMax;

    //perform filter setup on all filters
    let filter = document.getElementsByClassName(this.filterClassName);
    for (let i = 0; i < filter.length; i++) {
      this.filterSetup(filter[i]);
    }

    //#endregion filter
    //#region filtered

    this.filteredClassName = filteredClassName;
    this.filteredClassActive = filteredClassActive;

    //#endregion filter

    this.FilterApply(["all"]);
  }

  /**
   * update html elements
   * @param {string[]} tags
   */
  FilterApply(tags = this.activeFilters) {
    //#region preprocess filters

    //remove "all" filter
    if (tags.length > 1 && tags.includes("all"))
      MyArr.remove(tags, tags.indexOf("all"));

    //if list empty add all filter
    if (tags.length == 0) tags.push("all");

    //#endregion preprocess filters

    this.activeFilters = tags;

    //filtered
    /**
     * @type {Content}
     */
    let cont;
    for (let i = 0; i < this.contentList.length; i++) {
      cont = this.contentList[i];
      if (
        this.TagCheck(cont, this.activeFilters, this.filteredBehavior) ||
        this.activeFilters.includes("all")
      ) {
        cont.active = true;
      } else {
        cont.active = false;
      }
    }

    //filter
    //go through all filter and add/remove active class
    if (this.filterClassActive) {
      let filterList = document.getElementsByClassName(this.filterClassName);
      let filter;
      for (let i = 0; i < filterList.length; i++) {
        filter = filterList[i];
        if (this.TagCheck(filter, this.activeFilters, this.filterBehavior)) {
          // console.log('filter "', filter.textContent, '" set to active');
          MyHTML.addClass(filter, this.filterClassActive);
        } else {
          MyHTML.removeClass(filter, this.filterClassActive);
        }
      }
    }
  }

  /**
   * checks if the given target tag list corresponds to the source tag list with the given gebavior.
   * If target object tag list is empty will only be drawn if the filtered tags are also empty.
   * @param {HTMLElement | Content} element element to check tags against.
   * @param {string[]=} filterTags List of Tags to filter by. If no tags are given it will always return true.
   * @param {import("../myJS/MyTags.js").TagBehavior=} behavior "one" or more. "all" or more. "exact"ly the items, no more or less.
   * @returns {boolean}
   */
  TagCheck(element, filterTags, behavior) {
    if (element instanceof Content) {
      return MyTags.Compare(
        element.tags,
        filterTags,
        behavior ? behavior : this.filteredBehavior
      );
    } else if (
      element.className.split(" ").indexOf(this.filterClassName) != -1
    ) {
      return MyTags.Compare(
        this.getTags(element),
        filterTags,
        behavior ? behavior : this.filterBehavior
      );
    }
  }

  /**
   * get tags of a given HTMLElement
   * @param {HTMLElement} elem
   */
  getTags(elem) {
    let classList = elem.className.split(" ");

    let num = classList.indexOf(this.filterClassName);

    return classList[num + 1].split(",");
  }

  /**
   *
   * @param {HTMLElement} filterEl
   */
  filterSetup(filterEl) {
    if (!MyHTML.hasClass(filterEl, "all")) {
      //all not "all" buttons
      filterEl.addEventListener("click", (event) => {
        let _t = event.target;

        console.log("FilterApply from: ", this.activeFilters);

        if (this.TagCheck(_t, this.activeFilters, this.filterBehavior)) {
          // if (MyHTML.hasClass(_t, this.filterClassActive)) {
          MyArr.removeList(this.activeFilters, this.getTags(_t));
        } else {
          MyArr.pushUniqueList(this.activeFilters, this.getTags(_t));
        }

        console.log("FilterApply to: ", this.activeFilters);

        contentHandler.FilterApply();
      });
    } else {
      //"all" button
      filterEl.addEventListener("click", () => {
        console.log("FilterApply from: ", this.activeFilters);
        contentHandler.FilterApply(["all"]);
        console.log("FilterApply to: ", this.activeFilters);
      });
    }
  }

  //#region filtered

  /**
   *
   * @param {HTMLElement} tagsTar
   * @param {string} tags
   * @param {HTMLElement} headTrg
   * @param {string} headTxt
   * @param {HTMLElement} subTrg
   * @param {string} subTxt
   * @param {HTMLElement} datTrg
   * @param {string} datS
   * @param {string} datE
   * @param {HTMLElement} txtTarg
   * @param {string} txt article text
   * @param {HTMLElement} imgTrg
   * @param {HTMLElement} imgAltTrg
   * @param {*} imgSrc
   * @param {*} imgAlt
   */
  setContent(
    tagTar,
    tags,
    headTrg,
    headTxt,
    subTrg,
    subTxt,
    datTrg,
    datS,
    datE,
    txtTarg,
    txt,
    imgTrg,
    imgAltTrg,
    imgSrc,
    imgAlt
  ) {
    tagTar.classList.add(tags);
    headTrg.innerText = headTxt;
    subTrg.innerText = subTxt;

    //#region date
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

    datTrg.innerText = dateText;

    //#endregion date
    //#region text

    //split multi line breaks into seperate paragraphs
    txt.split("\n\n").forEach((txt) => {
      //generate paragraph elements for each text section
      let elem = document.createElement("p");

      elem.appendChild(document.createTextNode(txt));
      txtTarg.append(elem);
    });

    //#endregion text

    imgTrg.src = imgSrc;
    imgTrg.alt = imgAlt;
    imgAltTrg.innerText = imgAlt;
  }

  //#endregion filtered
}

fetch("content/content.json")
  .then((results) => results.json())
  .then((data) => {
    contentHandler = new ContentHandler(
      ContentTemplate,
      ContentDestination,
      "filter",
      "active",
      "filtered",
      "active",
      -1,
      data
    );
  });

/*
var _template = document.getElementById("content-Template").content;

*/
