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

  _active = false;
  get active() {
    return this._active;
  }
  set active(bool) {
    this._active = bool;

    if (bool) {
      // console.log(
      //   `+ active ${MyHTML.getChildById(this.target, "content-headline")?.textContent}`,
      //   this.manager.activeFilters,
      //   this.target,
      // );
      MyHTML.addClass(this.target, this.manager.filteredClassActive);
    } else {
      // console.log(
      //   `- active ${MyHTML.getChildById(this.target, "content-headline")?.textContent}`,
      //   this.manager.activeFilters,
      //   this.target,
      // );
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

/*
Filter = an intractable HTMLElement that applies its tags to filter Content elements.
Filtered = HTMLElements that will displayed depending on the overlap of their tags with the active tag list.
Tag = a singular tag.
Tag List = a list of tags used to filter Filtered elements.
Content = a management object used with Filtered elements.
*/

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
  tagListNumMax;

  /**
   * If the system allows the unselecting of the last filters resulting in an empty list.
   * Defaults to true.
   * @type {boolean}
   */
  zeroSelect;

  /**
   * If the system should use tag fallback.
   * Tag fallback sets the tag list to the tag fallback list if the tag list is empty.
   * Preventing the tag list from being empty.
   * Defaults to true.
   * @type {boolean}
   */
  tagFallback;

  /**
   * Tag used on initialization.
   * Defaults to "all".
   * Used as default fallback filter.
   * @type {string[]}
   */
  tagFallbackList;

  /**
   * How many tags in the filter element have to match for the object to be active.
   * @type {import("../myJS/MyTags.js").TagBehavior}
   */
  filterBehavior;

  /**
   * Callback function type used on every user interaction with a registered filter element.
   * @callback FilterCallback Callback used on filter interaction.
   * @this ContentManager
   * @param {HTMLElement} ev Event targeting the filter element.
   * @param {boolean} newState Boolean that conveys if relating filters are active (true) or inactive (false).
   * @param {string[]} tags Tag of the target HTMLElement.
   */

  /**
   * Callback function used on every user interaction with a registered filter element.
   * Defaults to a {@link FilterCallback} that calls {@link TagListApply}.
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
   * @callback ApplyCallback Function called after every update to the tag list.
   * @this ContentManager
   * @param {number} number number of results after filter application.
   * @param {Content[]} displayedList List of Content Objects that should be displayed with current active filter..
   * @param {import("../myJS/MyTags.js").TagBehavior} behavior Tag Filtering behavior that determines if a Filtered Object/Element should be displayed.
   * @param {string} className Class name that the ContentManager looks for to determine filtered targets.
   * @param {string} classActive Class name a FIltered HTMLElement receives if active (displayed).
   */
  /**
   * Function called after every update to the tag list.
   * @type {ApplyCallback | undefined}
   */
  applyCallback;

  //#endregion filtered
  //#region tags and filters

  /**
   * @type {string} Class name of the "all" tag class.
   */
  allClassName;

  /**
   * @type {string[]} list of active tags.
   * Depending on {@link this.filterFallback} an empty list will be handles like the "all" tag.
   */
  activeTags = [];

  //#endregion filtered
  //#region Content Objects
  /**
   * @type {Content[]}
   */
  contentList = [];

  //#endregion Content Objects

  /**
   * Create a ContentManager instance that manages given content via filters.
   * Filter Elements must have their filter-tags in their class string following the Filter Class Designator.
   * If one filter has multiple tags they must only be separated by "," f.e: "tag1,tag2,tag3".
   * The "all" tag will be auto removed from the list if any other tag is present.
   * If no filters are selected fallback will be used and the fallback list will be applied.
   * If fallback is not used and filters are empty the system will treat it as if the "all" tag is used.
   * @param {{element: HTMLElement, tags: string[]}[]} elements List of HTMLElements to manage.
   * @param {string} filterClassName HTML class name of filter designated elements. will be given interaction events.
   * @param {string | undefined} filterClassActive Name of the class set to a filter if its tags are in use. Used to Highlight active filters.
   * @param {string} filteredClassName HTML class name of a content/filtered HTML element.
   * @param {string} filteredClassActive Name of the class set to a filtered object if is can be displayed.
   * @param {ApplyCallback=} [applyCallback=undefined] Callback function called after every update to the tag list. Useful to set the number of found objects into an element.
   * @param {FilterCallback=} [filterCallback=()=>void] Callback function used on every user interaction with a registered filter element. Defaults to a {@link FilterCallback} that calls {@link TagListApply}.
   * @param {number} [tagListNumMax=-1] Maximum number of filters. Defaults to -1 for infinite.
   * @param {string} [allClassName="all"] Class name of the "all" class.
   * @param {string[]} [tagListInit=[allClassName]] Tags to apply on initialization. defaults to "all".
   * @param {boolean=} [zeroSelect=true] If the system allows the unselecting of the last filters resulting in an empty list. Defaults to true.
   * @param {boolean=} [tagFallback=true] If the system should apply the tag fallback list if no tags are selected. Defaults to true.
   * @param {string[]} [tagFallbackList=[allClassName]] Tag list to use as fallback. The fallback list is used if the tag list is empty. Defaults to "all".
   * @param {import("../myJS/MyTags.js").TagBehavior=} [filteredBehavior="match"] Behavior determining if Filtered receive active class. Defaults to "match".
   * @param {import("../myJS/MyTags.js").TagBehavior=} [filterBehavior="all"] Behavior determining if Filters receive active class. Defaults to "all".
   */
  constructor(
    elements,
    filterClassName,
    filterClassActive,
    filteredClassName,
    filteredClassActive,
    applyCallback = undefined,
    filterCallback = () => {
      this.TagListApply();
    },
    tagListNumMax = -1,
    allClassName = "all",
    tagListInit = [allClassName],
    zeroSelect = true,
    tagFallback = true,
    tagFallbackList = [allClassName],
    filteredBehavior = "match",
    filterBehavior = "all",
  ) {
    this.filteredBehavior = filteredBehavior;
    this.filterBehavior = filterBehavior;

    this.allClassName = allClassName;

    //#region filter

    this.filterClassName = filterClassName;
    this.filterClassActive = filterClassActive;
    this.tagListNumMax = tagListNumMax;
    this.filterCallback = filterCallback;

    //perform filter setup on all filters
    const filter = document.getElementsByClassName(this.filterClassName);
    for (let i = 0; i < filter.length; i++) {
      this.filterSetup(filter[i]);
    }

    //#endregion filter
    //#region filtered

    elements.forEach((element) => {
      //add new content Obj to manager.
      this.contentList.push(new Content(this, element.element, element.tags));
    });

    this.applyCallback = applyCallback;
    this.filteredClassName = filteredClassName;
    this.filteredClassActive = filteredClassActive;

    //#endregion filter

    this.zeroSelect = zeroSelect;
    this.tagFallback = tagFallback;
    this.tagFallbackList = tagFallbackList;

    this.TagListApply(tagListInit.slice());
  }

  /**
   * Applies the given or active tag lists. Activating / Deactivating Filters and Filtered Elements.
   * @param {string[]} [tagsOverride=this.activeTags] The tag list to be used. Defaults to active tag list.
   */
  TagListApply(tagsOverride = this.activeTags) {
    //#region preprocess tags

    // remove "all" tag
    if (tagsOverride.length > 1 && tagsOverride.includes(this.allClassName))
      MyArr.remove(tagsOverride, tagsOverride.indexOf(this.allClassName));

    // fallback on list empty
    if (tagsOverride.length == 0 && this.tagFallback) {
      tagsOverride.push(...this.tagFallbackList);
    }

    //#endregion preprocess filters

    this.activeTags = tagsOverride;

    //#region filtered display list

    this.filteredDispList = [];
    let content, newState;
    for (let i = 0; i < this.contentList.length; i++) {
      content = this.contentList[i];
      if (
        this.TagCheck(content, this.activeTags, this.filteredBehavior) ||
        this.activeTags.includes(this.allClassName)
      ) {
        // count up filtered elements displayed
        this.filteredDispList.push(content);

        newState = true;
      } else {
        newState = false;
      }

      // set new state, avoid setting if not new.
      if (content.active != newState) content.active = newState;
    }

    //#endregion filtered display list
    //#region filter elements active class

    //go through all filter and add/remove active class
    if (this.filterClassActive) {
      const filterList = document.getElementsByClassName(this.filterClassName);
      let filter;
      for (let i = 0; i < filterList.length; i++) {
        filter = filterList[i];
        if (this.TagCheck(filter, this.activeTags, this.filterBehavior)) {
          // console.log('filter "', filter.textContent, '" set to active');
          MyHTML.addClass(filter, this.filterClassActive);
        } else {
          MyHTML.removeClass(filter, this.filterClassActive);
        }
      }
    }

    //#endregion filter elements active class

    //callback
    if (this.applyCallback)
      this.applyCallback(
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
   * Sets up the Filter HTMLElement with events for tag application.
   * @param {HTMLElement} filterEl
   */
  filterSetup(filterEl) {
    if (!MyHTML.hasAnyClass(filterEl, this.allClassName)) {
      // all not "all" buttons
      filterEl.addEventListener("click", (ev) => {
        const tags = this.getTags(ev.target);
        const check = this.TagCheck(
          ev.target,
          this.activeTags,
          this.filterBehavior,
        );
        // check if tags are present in filter remove them, otherwise add them.
        if (check) this.removeTags(tags);
        else this.addTags(tags);

        if (this.filterCallback)
          // call function with
          this.filterCallback(ev, !check, tags);
      });

      // right mouse button, activate only this tag
      filterEl.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();

        const tags = this.getTags(ev.target);
        this.activeTags = tags;

        if (this.filterCallback) this.filterCallback(ev, true, tags);
      });
    } else {
      // "all" button

      const func = (ev) => {
        if (ev.type == "contextmenu") ev.preventDefault();

        this.activeTags = [this.allClassName];

        if (this.filterCallback)
          this.filterCallback(ev, true, this.getTags(ev.currentTarget));
      };

      // left mouse button
      filterEl.addEventListener("click", func);
      // right mouse button
      filterEl.addEventListener("contextmenu", func);
    }
  }

  /**
   * Adds tags to active tag list, {@link activeTags}.
   * @param {string[]} tags
   */
  addTags(tags) {
    MyArr.pushUniqueList(this.activeTags, tags);

    //reduce to maximum length
    if (this.tagListNumMax != -1 && this.activeTags.length > this.tagListNumMax)
      this.activeTags.splice(0, this.activeTags.length - this.tagListNumMax);
  }

  /**
   * Removes tags from active tag list, {@link activeTags}.
   * @param {string[]} tags
   */
  removeTags(tags) {
    if (!this.zeroSelect) {
      //id the list cant be empty
      const copy = this.activeTags.slice();

      MyArr.removeList(copy, tags);
      if (copy.length != 0) this.activeTags = copy;
    } else MyArr.removeList(this.activeTags, tags);
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
