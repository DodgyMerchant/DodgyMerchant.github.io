/**
 * general html handling object
 * @version 1.0.1
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyHTML {
  /**
   * translate mouse window mouse position to local position to given element
   * @param {HTMLElement} elem
   * @param {number} mx mouse x
   * @param {number} my mouse y
   * @returns {{x:number, y:number}}
   */
  static getPosRelative(elem, mx, my) {
    let rect = elem.getBoundingClientRect();
    return { x: mx - rect.left, y: my - rect.top };
  }
  /**
   * returs property or style of element.
   * first checks the elements direct style.
   * then computed style declaration.
   * @param {HTMLElement} el
   * @param {string} str
   * @returns {string}
   */
  static getPropertyStr(el, str) {
    let style = el.style.getPropertyValue(str);

    //no property style
    if (style == "") {
      style = getComputedStyle(el).getPropertyValue(str);
    }

    return style;
  }
  /**
   * returs property or style of element.
   * first checks the elements direct style.
   * then computed style declaration.
   * @param {HTMLElement} el
   * @param {string} str
   * @returns {number}
   */
  static getPropertyInt(el, str) {
    return Number.parseInt(this.getPropertyStr(el, str));
  }
  /**
   * returs property or style of element.
   * first checks the elements direct style.
   * then computed style declaration.
   * @param {HTMLElement} el
   * @param {string} str
   * @returns {number}
   */
  static getPropertyFlt(el, str) {
    return Number.parseFloat(this.getPropertyStr(el, str));
  }

  //#region classes

  /**
   * Checks if target element has all classes supplied in the name string.
   * For a single class check use hasAnyClass, its slightly faster.
   * @param {HTMLElement} element
   * @param {string} name one or multiple classes. split by space.
   */
  static hasAllClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");

    element.classList;

    for (i = 0; i < arr2.length; i++) {
      if (!arr1.includes(arr2[i])) {
        return false;
      }
    }
    return true;
  }
  /**
   * Checks if target element has any one class supplied in the name string
   * @param {HTMLElement} element
   * @param {string} name one or multiple classes. split by space.
   */
  static hasAnyClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");

    for (i = 0; i < arr2.length; i++) {
      if (arr1.includes(arr2[i])) {
        return true;
      }
    }

    return false;
  }
  /**
   * @author w3
   * @param {HTMLElement} element
   * @param {string} name one or multiple classes. split by space.
   */
  static addClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) == -1) {
        element.className += " " + arr2[i];
      }
    }
  }
  /**
   *
   * @author w3
   * @param {HTMLElement} element
   * @param {string} name one or multiple classes. split by space.
   */
  static removeClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
      while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);
      }
    }
    element.className = arr1.join(" ");
  }
  /**
   * Finds the classes in "find" and replaces all found classes with the class from "replace" in the same position.
   * Both Strings must have the same amont of classes.
   * given: "f1 f2","r1 r2".
   * if "f1" is found then it will be replaced by "r2", because they share the same position in their lists, 0.
   * @param {HTMLElement} element
   * @param {string} find one or multiple classes. split by space. must be the same number as name2.
   * @param {string} replace one or multiple classes. split by space. must be the same number as name1.
   */
  static replaceClass(element, find, replace) {
    let tList, arr1, arr2;

    arr1 = find.split(" ");
    arr2 = replace.split(" ");
    if (arr1.length != arr2.length) {
      console.error("class name(s) inclused multiple classes.\nFunction supports a ONLY SINGLE class per name.");
      return;
    }
    tList = element.className.split(" ");

    let i, ind;
    for (i = 0; i < arr1.length; i++) {
      ind = tList.indexOf(arr1[i]);
      if (ind != -1) tList.splice(ind, 1, arr2[i]);
    }

    element.className = tList.join(",");
  }
  /**
   * Finds the classes in from the given class strings in the elements class and replaces them by their respective counterparts from the other list..
   * given: element.className = "x1 x2 x3", "x1 B 44","A x3 99" => "A x2 B"
   * @param {HTMLElement} element
   * @param {string} classes1 one or multiple classes. split by space. must be the same number as name2.
   * @param {string} classes2 one or multiple classes. split by space. must be the same number as name1.
   */
  static switchClass(element, classes1, classes2) {
    let tList, arr1, arr2;

    arr1 = classes1.split(" ");
    arr2 = classes2.split(" ");
    if (arr1.length != arr2.length) {
      console.error("class name(s) inclused multiple classes.\nFunction supports a ONLY SINGLE class per name.");
      return;
    }
    tList = element.className.split(" ");

    let i, ind;
    for (i = 0; i < arr1.length; i++) {
      ind = tList.indexOf(arr1[i]);
      if (ind != -1) tList.splice(ind, 1, arr2[i]);
      else {
        ind = tList.indexOf(arr2[i]);
        if (ind != -1) tList.splice(ind, 1, arr1[i]);
      }
    }

    element.className = tList.join(",");
  }
  /**
   *
   * @param {HTMLElement} element
   * @param {string} name a single class
   */
  static toggleClass(element, name) {
    // let tList, arr1, arr2;
    // tList = element.className.split(" ");

    // if (MyHTML.hasAnyClass(element, name)) {
    //   MyHTML.removeClass(element, name);
    // } else {
    //   MyHTML.addClass(element, name);
    // }

    element.classList.toggle(name);

    // element.className = tList.join(",");
  }

  //#endregion classes

  /**
   *
   * @param {HTMLElement} parentEl
   * @param {string} childName
   */
  static getChildById(parentEl, childName) {
    let leng = parentEl.children.length;
    /**
     * @type {HTMLElement}
     */
    let chld;
    for (let i = 0; i < leng; i++) {
      chld = parentEl.children[i];

      if (chld.id == childName) return chld;

      chld = this.getChildById(chld, childName);
      if (chld) return chld;
    }

    return undefined;
  }
}
