/**
 * Html element property name of saved display value.
 * Change freely.
 * @type {string}
 */
const MyDispPropName = "--rememberDisplay";

/**
 * Html Display property handling class.
 * Has only static functions.
 * @version 1.0.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyDisplay {
  //#region setup
  /**
   *
   * @param {HTMLElement} el
   * @returns {string}
   */
  static setup(el) {
    // style is set
    if (el.style.display) return el.style.display;

    // no direct style set for display
    //saving display val to direct display
    const display = window.getComputedStyle(el).display;
    this.set(el, display);
    return display;
  }
  /**
   * Initializes display remembrance functionality in given {@link HTMLElement}.
   * @param {HTMLElement} el Element to be initialized.
   * @param {string} fallback Fallback value if used for the display property if no used value can be found.
   * @returns {string} Used display string display property.
   */
  static setupRemember(el, fallback = "block") {
    // if remembrance is setup
    const rememberDisplay = el.style.getPropertyValue(MyDispPropName);
    if (rememberDisplay) return rememberDisplay;

    // if no remembrance is setup, check different sources for style and set it.
    const disp = this.get(el);
    let newValue; // this val will be set as remember value
    if (disp != "none") {
      // if computed style is not none
      newValue = disp; //sets current display value
    } else {
      // looks for custom computed var
      const custom = window
        .getComputedStyle(el)
        .getPropertyValue(MyDispPropName);

      if (custom != "") newValue = custom;
      else {
        // use fallback value
        newValue = fallback;
      }
    }
    //set values
    this.setRemember(el, newValue);
    return newValue;
  }
  //#endregion setup
  //#region manipulation
  /**
   * Toggles the display property between none <=> (block | remembered value).
   * @param {HTMLElement} el element to toggle the display property of.
   */
  static toggle(el) {
    /**
     * Toggles the display style of an element.
     * Uses and saves used computed styles if there is one.
     *
     * Saves the original display in a custom attribute "--rememberDisplay".
     * This attribute can also be predefined.
     * This should be dome if the element is not supposed to be a block display.
     * But starts off in as none.
     */
    //get direct style custom value
    this.setup(el);
    const rememberDisplay = this.getRemember(el);

    this.set(el, el.style.display == "none" ? rememberDisplay : "none");

    return el.style.display;
  }
  /**
   * Enables displaying for a given HTMLElement.
   * IF no string value is provided will used remembered value setup in the Element.
   * If nothing is setup will default to block and setup remembering that value.
   * @param {HTMLElement} el element to enable the display property of.
   * @param {string=} str property to set the display value to. Defaults to block.
   */
  static enable(el, str) {
    this.setup(el);
    if (!str) str = this.getRemember(el);

    if (el.style.display == "none") this.set(el, str);
  }
  /**
   * Disables displaying for a given HTMLElement by setting its display to "none".
   * Before that Will setup remembering for the original value.
   * @param {HTMLElement} el element to disable the display property of.
   */
  static disable(el) {
    this.setupRemember(el);

    if (el.style.display != "none") this.set(el, "none");
  }
  //#endregion manipulation

  /**
   * Get style display property.
   * @param {HTMLElement} el
   * @returns {String}
   */
  static get(el) {
    return this.setup(el);
  }
  /**
   * Set style display property of the {@link HTMLElement}
   * @param {HTMLElement} el
   * @param {String} display
   */
  static set(el, display) {
    el.style.display = display;
  }

  /**
   *
   * @param {HTMLElement} el
   * @returns {String}
   */
  static getRemember(el) {
    return this.setupRemember(el);
  }
  /**
   * Does not setup.
   * @param {HTMLElement} el
   * @param {String} display
   */
  static setRemember(el, display) {
    el.style.setProperty(MyDispPropName, display);
  }
}
