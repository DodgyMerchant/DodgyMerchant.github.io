import MyArr from "./MyArr.js";
import MyTags from "./MyTags.js";

// TODO: to URL Trackers need tag lists by default? wouldn't that be an additional feature for another class?

export class URLManager {
  /**
   * URL parameter interface
   * @type {URLSearchParams}
   */
  _searchParam;
  /**
   *
   * @param {URLSearchParams} urlSearchParam
   */
  constructor(urlSearchParam) {
    this._searchParam = urlSearchParam;
  }
  /**
   * Set key value pair of url.
   * Updates Window {@link Location}.
   * @param {string} key Key to set value to.
   * @param {string} value Value to assign
   * @param {boolean} [historyOverride=false] If the new location should be added to user history.
   */
  set(key, value, historyOverride = false) {
    this._searchParam.set(key, value);

    this.updateURL(`?${this._searchParam.toString()}`, historyOverride);
  }
  /**
   * Get value of key parameter.
   * @param {string} key Key of the returned value.
   * @returns {string | null}
   */
  get(key) {
    return this._searchParam.get(key);
  }

  /**
   * Updates URL location and user history.
   * @param {string} url
   * @param {boolean} history If the new location should be added to user history.
   */
  updateURL(url, history) {
    if (history) window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  }

  /**
   * Constructs the URL from the current URL Search Parameters.
   * @returns {string}
   */
  constructUrl() {
    return `${window.location.origin}${window.location.pathname}?${this._searchParam.toString()}`;
  }
}
/**
 * Tracks one specific url property, that has one value.
 *
 * Use {@link URLTagTrackerMulti.validate} to correct lists.
 */
export class URLTagTracker extends URLManager {
  /**
   * Identifier string of managed property.
   * @type {string}
   */
  key;
  /**
   * The default tag applied on load, if no other is provided in the url parameters.
   * @type {string}
   */
  fallback;
  /**
   * Dictionary of values.
   * @type {{ [key: string]: string }}
   * */
  tags;
  /**
   * If the history should be automatically updated.
   * @type {boolean}
   */
  updateHistory;
  /**
   * Auto {@link validate}s and corrects tracked URL properties.
   * @param {URLSearchParams} urlSearchParam
   * @param {string} key
   * @param {string} fallback default value
   * @param {{ [key: string]: string }} tags Dictionary of values.
   * @param {boolean} updateHistory If the history should be automatically updated.
   */
  constructor(urlSearchParam, key, fallback, tags, updateHistory) {
    super(urlSearchParam);
    this.key = key;
    this.fallback = fallback;
    this.tags = tags;
    this.updateHistory = updateHistory;

    const urlTag = this.get() ?? this.fallback;
    const validTag = this.validate(urlTag);

    // a string is just an array. *sigh*.
    // if url tag isnt valid, change it.
    if (!MyTags.Compare(urlTag, validTag, "exact")) {
      this.set(validTag, false);
    }
  }
  /** Resets the filter to default state. */
  reset() {
    this.set(this.fallback);
  }
  /**
   *
   * @param {string} value
   * @returns {string}
   */
  validate(value) {
    if (Object.values(this.tags).includes(value)) return value;

    //tag is invalid, remove
    return this.fallback;
  }
  /**
   * Set value of managed url property.
   * Automatically decodes the URI.
   * @param {string} value value to set.
   * @param {boolean} [historyOverride=this.updateHistory] If the new location should be added to user history. Defaults to setting.
   */
  set(value, historyOverride = this.updateHistory) {
    this._searchParam.set(this.key, encodeURIComponent(value));

    this.updateURL(`?${this._searchParam.toString()}`, historyOverride);
  }
  /**
   * Returns the managed properties value from the url.
   * Automatically encodes the URI.
   * @returns {string | null}
   */
  get() {
    return decodeURIComponent(this._searchParam.get(this.key));
  }
}
/**
 * Tracks one specific URL property with multiple values.
 *
 * Use {@link URLTagTrackerMulti.validate} to correct lists.
 */
export class URLTagTrackerMulti extends URLTagTracker {
  /**
   * @override
   * @type {string[]}
   */
  fallback;

  /**
   * @override
   * @param {string[]} values
   * @returns {string[]}
   */
  validate(values) {
    if (!values) return this.fallback;

    const newArr = values.slice();

    for (const key in newArr) {
      //check for valid tags
      if (Object.values(this.tags).includes(newArr[key])) continue;

      //tag is invalid, remove
      MyArr.remove(newArr, key);
    }

    if (newArr.length <= 0) return this.fallback;

    return newArr;
  }
  /**
   * Set list of values to managed url property.
   * Automatically encodes the URI.
   * @override
   * @param {string[]} values
   * @param {boolean} [historyOverride=this.updateHistory] If the new location should be added to user history. Defaults to setting.
   */
  set(values, historyOverride = this.updateHistory) {
    this._searchParam.set(this.key, values.map(encodeURIComponent).join(","));

    this.updateURL(`?${this._searchParam.toString()}`, historyOverride);
  }
  /**
   * Returns the managed properties list of values from the url.
   * Automatically decodes the URI.
   * @override
   * @returns {string[] | null}
   */
  get() {
    return this._searchParam.get(this.key)?.split(",").map(decodeURIComponent);
  }
}
