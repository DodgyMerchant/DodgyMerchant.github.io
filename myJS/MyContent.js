/**
 * @file Collection of code that manages content.
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 * @version 2.0.0
 */

import MyTags from "../myJS/MyTags.js";
import MyHTML from "./MyHTML.js";
import MyArr from "./MyArr.js";

/**
 * Tracks and manages its content.
 * Content is a HTML element.
 */
class Content {
  /**
   * Manager
   * @type {ContentManager}
   */
  manager;
  /**
   * Content element this object manages.
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
      MyHTML.addClass(this.target, this.manager.filteredClassActive);
    } else {
      MyHTML.removeClass(this.target, this.manager.filteredClassActive);
    }
  }

  /**
   *
   * @param {ContentManager} manager
   * @param {HTMLElement} target
   * @param {string[]} tags
   */
  constructor(manager, target, tags) {
    this.manager = manager;
    this.target = target;
    this.tags = tags;
  }
}

/**
 * ContentManager Object.
 */
export default class ContentManager {
  //#region filter elements

  /**
   * Name of the class that designates an HTML element as a filter button.
   * @type {string}
   */
  filterClassName;

  /**
   * Class name of active filters.
   * @type {string}
   */
  filterClassActive;

  /**
   * Maximum number of filters. -1 for infinite.
   * @type {number}
   */
  filterNumMax;

  /**
   * If the system allows the unselecting of the last filters resulting in an empty list.
   * Defaults to true.
   * @type {boolean}
   */
  zeroSelect;

  /**
   * If the system should use fallback.
   * Fallback sets the filter list to the filter fallback list if the filter list is empty.
   * Preventing the filter list from being empty.
   * Defaults to true.
   * @type {boolean}
   */
  filterFallback;

  /**
   * Filter Used On Initialization.
   * Defaults to "all".
   * Used as default fallback filter.
   * @type {string[]}
   */
  filterFallbackList;

  /**
   * How many tags in the filter element have to match for the object to be active.
   * @type {import("../myJS/MyTags.js").TagBehavior}
   */
  filterBehavior = "all";

  /**
   * Callback function type used on every user interaction with a registered filter element.
   * @callback FilterCallback Callback used on filter interaction.
   * @this ContentManager
   * @param {HTMLElement} ev Event targeting the filter element.
   * @param {HTMLElement} element Filter HTMLElement.
   * @param {boolean} newState Boolean that conveys if relating filters are active (true) or inactive (false).
   * @param {string[]} tags Tag of the target HTMLElement.
   */

  /**
   * Callback function used on every user interaction with a registered filter element.
   * @type {FilterCallback | undefined}
   */
  filterCallback;

  //#endregion filter
  //#region filtered elements

  /**
   * Name of the class that designates an HTML element as a filtered Element.
   * @type {string}
   */
  filteredClassName;

  /**
   * Class name of active filters
   * @type {string}
   */
  filteredClassActive;

  /**
   * Tag Filtering behavior that determines if a Filtered Object/Element should be displayed.
   * Behavior can be Read in MyTags Class.
   * Follow the import link.
   * @type {import("../myJS/MyTags.js").TagBehavior}
   */
  filteredBehavior = "match";

  /**
   * List of displayed Content.
   * @type {Content[]}
   */
  filteredDispList = [];

  /**
   * @callback FilteredCallback Function called after every update to the filter
   * @this ContentManager
   * @param {number} number number of results after filter application.
   * @param {Content[]} displayedList List of Content Objects that should be displayed with current active filter..
   * @param {import("../myJS/MyTags.js").TagBehavior} behavior Tag Filtering behavior that determines if a Filtered Object/Element should be displayed.
   * @param {string} className Class name that the ContentManager looks for to determine filtered targets.
   * @param {string} classActive Class name a FIltered HTMLElement receives if active (displayed).
   */
  /**
   * Function called after every update to the filter.
   * @type {FilteredCallback | undefined}
   */
  filteredCallback;

  //#endregion filtered
  //#region tags and filters

  /**
   * Map of all tags
   * @type {Map<string, any>}
   */
  // tagMap = new Map();

  /**
   * @type {string[]}
   */
  activeFilters = [];

  //#endregion filtered
  //#region Content Objects
  /**
   * @type {Content}
   */
  contentList = [];

  //#endregion Content Objects

  /**
   * Create a ContentManager instance that manages given content via filters.
   * Filter Elements must have their filter-tags in their class string following the Filter Class Designator.
   * If one filter has multiple tags they must only be separated by "," f.e: "tag1,tag2,tag3".
   * The "all" filter is reserved to display all filtered items and will be auto removed from the list if any other tag is present..
   * If no filters are selected fallback will be used and the fallback list will be applied.
   * If fallback is not used and filters are empty the system will treat it as if the "all" filter is used.
   * @param {{element: HTMLElement, tags: string[]}[]} elements List of HTMLElements to manage.
   * @param {string} filterClassName HTML class name of filter designated elements. will be given interaction events.
   * @param {string | undefined} filterClassActive Name of the class set to a filter if its tags are in use. Used to Highlight active filters.
   * @param {string} filteredClassName HTML class name of a content/filtered HTML element.
   * @param {string} filteredClassActive Name of the class set to a filtered object if is can be displayed.
   * @param {FilteredCallback=} filteredCallback Callback function called after every update to the filter. Useful to set the number of found objects into an element.
   * @param {FilterCallback=} filterCallback Callback function used on every user interaction with a registered filter element.
   * @param {string=} filterNumMax Maximum number of filters. -1 for infinite. Defaults to -1.
   * @param {string[]=} filterInit Filters to apply on init. defaults to "all".
   * @param {boolean=} zeroSelect If the system allows the unselecting of the last filters resulting in an empty list. Defaults to true.
   * @param {boolean=} filterFallback If the system should apply the Fallback-Filter if no filters are selected. Defaults to true.
   * @param {string[]=} filterFallbackList Filter List to use as fallback. Defaults to init filter.
   * @param {import("../myJS/MyTags.js").TagBehavior=} filteredBehavior Behavior determining if Filtered receive active class. Defaults to "match".
   * @param {import("../myJS/MyTags.js").TagBehavior=} filterBehavior Behavior determining if Filters receive active class. Defaults to "all".
   */
  constructor(
    elements,
    filterClassName,
    filterClassActive,
    filteredClassName,
    filteredClassActive,
    filteredCallback = undefined,
    filterCallback = undefined,
    filterNumMax = -1,
    filterInit = ["all"],
    zeroSelect = true,
    filterFallback = true,
    filterFallbackList = filterInit,
    filteredBehavior = "match",
    filterBehavior = "all",
  ) {
    this.filteredBehavior = filteredBehavior;
    this.filterBehavior = filterBehavior;

    //#region filter

    this.filterClassName = filterClassName;
    this.filterClassActive = filterClassActive;
    this.filterNumMax = filterNumMax;
    this.filterCallback = filterCallback;

    //perform filter setup on all filters
    const filter = document.getElementsByClassName(this.filterClassName);
    for (let i = 0; i < filter.length; i++) {
      this.filterSetup(filter[i]);
    }

    //#endregion filter
    //#region filtered

    elements.forEach((element) => {
      this.contentList.push(new Content(this, element.element, element.tags));
    });
    //add new content Obj to manager.

    this.filteredCallback = filteredCallback;
    this.filteredClassName = filteredClassName;
    this.filteredClassActive = filteredClassActive;

    //#endregion filter

    this.zeroSelect = zeroSelect;
    this.filterFallback = filterFallback;
    this.filterFallbackList = filterFallbackList;

    this.FilterApply(filterInit.slice());
  }

  /**
   * Update html elements
   * @param {string[]} tags
   */
  FilterApply(tags = this.activeFilters) {
    //#region preprocess filters

    //remove "all" filter
    if (tags.length > 1 && tags.includes("all"))
      MyArr.remove(tags, tags.indexOf("all"));

    //fallback on list empty
    if (tags.length == 0 && this.filterFallback) {
      tags.push(...this.filterFallbackList);
    }

    //#endregion preprocess filters

    this.activeFilters = tags;

    //filtered
    this.filteredDispList = [];
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
        //count up filtered elements displayed
        this.filteredDispList.push(cont);
        cont.active = true;
      } else {
        cont.active = false;
      }
    }

    //filter
    //go through all filter and add/remove active class
    if (this.filterClassActive) {
      const filterList = document.getElementsByClassName(this.filterClassName);
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

    //callback
    if (this.filteredCallback)
      this.filteredCallback(
        this.filteredDispList.length,
        this.filteredDispList,
        this.filteredBehavior,
        this.filteredClassName,
        this.filteredClassActive,
      );
  }

  /**
   * Checks if the given target tag list corresponds to the source tag list with the given behavior.
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
        behavior ? behavior : this.filteredBehavior,
      );
    } else if (
      element.className.split(" ").indexOf(this.filterClassName) != -1
    ) {
      return MyTags.Compare(
        this.getTags(element),
        filterTags,
        behavior ? behavior : this.filterBehavior,
      );
    }
  }

  /**
   * Get tags of a given HTMLElement
   * @param {HTMLElement} elem
   * @returns {string[] | undefined} undefined if failure.
   */
  getTags(elem) {
    const classList = elem.className.split(" ");
    const num = classList.indexOf(this.filterClassName);

    if (num != -1) return classList[num + 1].split(",");
    else return undefined;
  }

  /**
   * Sets up the Filter HTMLElements with events for filtering.
   * @param {HTMLElement} filterEl
   */
  filterSetup(filterEl) {
    if (!MyHTML.hasAnyClass(filterEl, "all")) {
      //all not "all" buttons
      filterEl.addEventListener("click", (ev) => {
        const _t = ev.target;
        const tags = this.getTags(_t);
        const check = this.TagCheck(
          _t,
          this.activeFilters,
          this.filterBehavior,
        );
        //check if tags are present in filter remove them, otherwise add them.
        if (check) this.removeFilter(tags);
        else this.addFilter(tags);

        this.FilterApply();
        if (this.filterCallback) this.filterCallback(ev, _t, !check, tags);
      });
      //right mouse button
      filterEl.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();

        const tags = this.getTags(ev.target);
        this.FilterApply(tags);
        if (this.filterCallback) this.filterCallback(ev, ev.target, true, tags);
      });
    } else {
      //"all" button

      const func = (ev) => {
        if (ev.type == "contextmenu") ev.preventDefault();

        this.FilterApply(["all"]);
        if (this.filterCallback)
          this.filterCallback(
            ev,
            ev.currentTarget,
            true,
            this.getTags(ev.currentTarget),
          );
      };

      //left mouse button
      filterEl.addEventListener("click", func);
      //right mouse button
      filterEl.addEventListener("contextmenu", func);
    }
  }

  /**
   * Adds tags to filter
   * @param {string[]} tags
   */
  addFilter(tags) {
    MyArr.pushUniqueList(this.activeFilters, tags);

    //reduce to maximum length
    if (
      this.filterNumMax != -1 &&
      this.activeFilters.length > this.filterNumMax
    )
      this.activeFilters.splice(
        0,
        this.activeFilters.length - this.filterNumMax,
      );
  }

  /**
   * Removes tags from filter
   * @param {string[]} tags
   */
  removeFilter(tags) {
    if (!this.zeroSelect) {
      //id the list cant be empty
      const copy = this.activeFilters.slice();

      MyArr.removeList(copy, tags);
      if (copy.length != 0) this.activeFilters = copy;
    } else MyArr.removeList(this.activeFilters, tags);
  }

  /**
   * Returns the list of displayed Content Objects.
   * DO NOT modify list!
   * @returns {Content[]}
   */
  getDisplayed() {
    return this.filteredDispList;
  }
}
