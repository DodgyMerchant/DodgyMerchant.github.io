/**
 * @version 1.1.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyArr {
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
