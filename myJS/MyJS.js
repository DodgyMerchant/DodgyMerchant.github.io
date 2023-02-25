/**
 * @file a collection of personal js files that are useful for me.
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */

/**
 * general html handling objecvt
 * @version 1.0.1
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export class MyHTML {
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
  //#region html class
  /**
   * @param {HTMLElement} element
   * @param {string} name class string split by space
   */
  static hasClass(element, name) {
    let i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");

    for (i = 0; i < arr2.length; i++) {
      if (arr1.indexOf(arr2[i]) != -1) {
        return true;
      }
    }

    return false;
  }
  /**
   * @author w3
   * @param {HTMLElement} element
   * @param {string} name
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
   * @param {string} name
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
  //#endregion html class
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

/**
 * @version 1.1.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export class MyArr {
  /**
   * check for array overlap
   * @param {any[]} arr1
   * @param {any[]} arr2
   */
  static overlap(arr1, arr2) {
    // console.log(arr2);
    return arr1.some((item) => arr2.includes(item));
  }

  //#region removing
  /**
   *
   * @param {any[]} list
   * @param {number} index index to remove
   * @returns {any} removed entry
   */
  static remove(list, index) {
    return list.splice(index, 1)[0];
  }

  /**
   *
   * @param {any[]} list
   * @param {any} data
   * @returns {any} removed entry
   */
  static removeEntry(list, data) {
    let index = list.indexOf(data);
    if (index != -1) return list.splice(index, 1)[0];
  }

  /**
   *
   * @param {any[]} targetList list to remove from
   * @param {any[]} dataList list of object to remove from other list.
   */
  static removeList(targetList, dataList) {
    dataList.forEach((elem) => {
      this.removeEntry(targetList, elem);
    });
  }

  //#endregion removing

  /**
   * pushes all entries in nested lists into target list
   * @param {any[]} targetList
   * @param {any | any[]} data
   */
  static pushFlat(targetList, data) {
    if (Array.isArray(data)) {
      data.forEach((element) => {
        this.pushUnique(targetList, element);
      });
    } else {
      targetList.push(data);
    }
  }

  /**
   * pushes data into target list if it isnt in the list already.
   * @param {any[]} targetList
   * @param {any} data
   * @returns {boolean} if the entry was added to target list.
   */
  static pushUnique(targetList, data) {
    for (let i = 0; i < targetList.length; i++) {
      if (targetList[i] == data) return false;
    }

    targetList.push(data);
    return true;
  }

  /**
   * pushes all entries into target list that arent in the list already.
   * @param {any[]} targetList
   * @param {any[]} dataList
   */
  static pushUniqueList(targetList, dataList) {
    dataList.forEach((element) => {
      this.pushUnique(targetList, element);
    });
  }
}
