/**
 * General html handling object.
 * @version 1.0.1
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyHTML {
  /**
   * Translate mouse window mouse position to local position to given element.
   * @param {HTMLElement} elem Element to get properties from.
   * @param {number} mx mouse x
   * @param {number} my mouse y
   * @returns {{x:number, y:number}}
   */
  static getPosRelative(elem, mx, my) {
    const rect = elem.getBoundingClientRect();
    return { x: mx - rect.left, y: my - rect.top };
  }

  //#region get property

  /**
   * Returns property or style of element.
   * First checks the elements direct style.
   * Then computed style declaration.
   * @param {HTMLElement} el Element to get property from.
   * @param {string} str Property name as string.
   * @returns {string} Property value as string or "".
   */
  static getPropertyStr(el, str) {
    const style = el.style.getPropertyValue(str);

    // if property style exists
    if (style) return style;

    // else look for computed style
    return getComputedStyle(el).getPropertyValue(str);
  }
  /**
   * Returns property or style of element.
   * First checks the elements direct style.
   * Then computed style declaration.
   * @param {HTMLElement} el Element to get property from.
   * @param {string} str Property name as string.
   * @returns {number} Property value as Int or Nan.
   */
  static getPropertyInt(el, str) {
    return Number.parseInt(this.getPropertyStr(el, str));
  }
  /**
   * Returns property or style of element.
   * First checks the elements direct style.
   * Then computed style declaration.
   * @param {HTMLElement} el Element to get property from.
   * @param {string} str Property name as string.
   * @returns {number} Property value as Float or NaN.
   */
  static getPropertyFlt(el, str) {
    return Number.parseFloat(this.getPropertyStr(el, str));
  }

  //#endregion get property
  //#region classes

  /**
   * Checks if target element has all classes supplied in the name string.
   * For a single class check use hasAnyClass, its slightly faster.
   * @param {HTMLElement} element
   * @param {string} name One or multiple classes. split by space.
   */
  static hasAllClass(element, name) {
    const arr1 = element.className.split(" ");
    const arr2 = name.split(" ");

    element.classList;

    for (let i = 0; i < arr2.length; i++) {
      if (!arr1.includes(arr2[i])) {
        return false;
      }
    }
    return true;
  }
  /**
   * Checks if target element has any one class supplied in the name string
   * @param {HTMLElement} element
   * @param {string} name One or multiple classes. split by space.
   * @returns {boolean}
   */
  static hasAnyClass(element, name) {
    if (element?.className?.length == 0) return false;

    const arr1 = element.className.split(" ");
    const arr2 = name.split(" ");

    for (let i = 0; i < arr2.length; i++) {
      if (arr1.includes(arr2[i])) {
        return true;
      }
    }

    return false;
  }
  /**
   * @author w3
   * @param {HTMLElement} element
   * @param {string} name One or multiple classes. split by space.
   */
  static addClass(element, name) {
    const arr1 = element.className.split(" ");
    const arr2 = name.split(" ");

    for (let i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) == -1) {
        element.className += " " + arr2[i];
      }
    }
  }
  /**
   *
   * @author w3
   * @param {HTMLElement} element
   * @param {string} name One or multiple classes. split by space.
   */
  static removeClass(element, name) {
    const arr1 = element.className.split(" ");
    const arr2 = name.split(" ");

    for (let i = 0; i < arr2.length; i++) {
      while (arr1.indexOf(arr2[i]) > -1) {
        arr1.splice(arr1.indexOf(arr2[i]), 1);
      }
    }
    element.className = arr1.join(" ");
  }

  /**
   * check length of strings, must be the same
   * @returns {boolean} if it passed
   */
  _check_requirements(arr1, arr2) {
    if (arr1.length != arr2.length) {
      console.error("Class names did not have the same number of entries.");
      return false;
    }
    return true;
  }

  /**
   * Finds the classes in "find" and replaces all found classes with the class from "replace" in the that are in the same position.
   * Both Strings must have the same amount of classes.
   * given: "f1 f2","r1 r2".
   * If "f1" is found then it will be replaced by "r2", because they share the same position in their lists, 0.
   * @param {HTMLElement} element
   * @param {string} find One or multiple classes. split by space. Both string must have the same number of entries.
   * @param {string} replace One or multiple classes. split by space.  Both string must have the same number of entries.
   */
  static replaceClass(element, find, replace) {
    const findArr = find.split(" ");
    const replaceArr = replace.split(" ");

    // check length of strings, must be the same
    if (!_check_requirements(findArr, replaceArr)) return;

    // get all classes of Element.
    const tList = element.className.split(" ");

    // replace found classes.
    let index;
    for (let i = 0; i < findArr.length; i++) {
      index = tList.indexOf(findArr[i]);
      if (index != -1) tList.splice(index, 1, replaceArr[i]);
    }

    element.className = tList.join(",");
  }
  /**
   * Finds the classes in from the given class strings in the elements class and replaces them by their respective counterparts from the other list.
   * given: element.className = "x1 x2 x3", "x1 B 44","A x3 99" => "A x2 B"
   * @param {HTMLElement} element
   * @param {string} classes1 One or multiple classes. split by space. must be the same number as name2.
   * @param {string} classes2 One or multiple classes. split by space. must be the same number as name1.
   */
  static switchClass(element, classes1, classes2) {
    const arr1 = classes1.split(" ");
    const arr2 = classes2.split(" ");

    // check length of strings, must be the same
    if (!_check_requirements(arr1, arr2)) return;

    const tList = element.className.split(" ");
    let index;
    for (let i = 0; i < arr1.length; i++) {
      index = tList.indexOf(arr1[i]);
      if (index != -1) tList.splice(index, 1, arr2[i]);
      else {
        index = tList.indexOf(arr2[i]);
        if (index != -1) tList.splice(index, 1, arr1[i]);
      }
    }

    element.className = tList.join(",");
  }
  /**
   *
   * @param {HTMLElement} element
   * @param {string} name A single class name
   */
  static toggleClass(element, name) {
    element.classList.toggle(name);
  }

  //#endregion classes

  /**
   *
   * @param {HTMLElement} parentEl
   * @param {string} childName
   */
  static getChildById(parentEl, childName) {
    /**
     * @type {HTMLElement}
     */
    let child;

    for (let i = 0; i < parentEl.children.length; i++) {
      child = parentEl.children[i];
      // is target
      if (child.id == childName) return child;
      // isn't the target, look into child>[child]
      child = this.getChildById(child, childName);
      if (child) return child;
    }

    return undefined;
  }
}
