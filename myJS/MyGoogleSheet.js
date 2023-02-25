/**
 * Google SHeets fetch data handling class.
 * Has only static functions.
 * @version 1.0.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyGS {
  /**
   * gets json data from google sheets and calsl function with the data
   * @param {string} sheet_id
   * @param {[pageName: string, range: string, func: function, labled: boolean]} pages list of page information to process. Inluding individual processing function
   * @returns {Promise<Response>[]} the fetch promise response
   */
  static GetDataMultiPage_ToJSON(sheet_id, pages) {
    let arr = [];
    for (let i = 0; i < pages.length; i += 4) {
      arr.push(
        this.GetData_ToJSON(
          sheet_id,
          pages[i],
          pages[i + 1],
          pages[i + 2],
          pages[i + 3]
        )
      );
    }

    return arr;
  }

  /**
   * gets json data from google sheets and calsl function with the data
   * @param {string} sheet_id
   * @param {string} sheet_page range of the
   * @param {string} sheet_Loc_range
   * @param {function} func function to execute to process json data, default undefined doesnt process data
   * @param {boolean} labled if the 1 row in the sheet should be used als lables.
   * @returns {Promise<Response>} the fetch promise response
   */
  static GetData_ToJSON(sheet_id, sheet_page, sheet_range, func, labled) {
    // let url = `https://docs.google.com/spreadsheets/d/${sheet_id}/gviz/tq?tqx=out:json&sheet=${sheet_page}&range=${sheet_range}`;
    let url = `https://docs.google.com/spreadsheets/d/${sheet_id}/gviz/tq?tqx=out:json&sheet=${sheet_page}&range=${sheet_range}`;

    return this.GetData(url, func, labled);
  }
  /**
   * fetches url and turns json text in to json data and calls function.
   * @param {string} url
   * @param {function} func function to execute to process json data, default undefined doesnt process data
   * @param {boolean=} labelCorrection if the returned table has no lables the first row of data will be deleted and used as lables for the columbs.
   * @returns {Promise<Response>} the fetch promise response
   */
  static GetData(url, func, labelCorrection = true) {
    return fetch(url)
      .then((res) => res.text())
      .then((rep) => {
        let jsonData = this.Text_toJson(rep);
        // console.log("jsonData: ", jsonData);
        //if there are no lables, but there should be

        let cols = jsonData.table.cols;
        if (labelCorrection && cols[0].label == "") {
          /**
           * @type {Object[]}
           */
          let labels = jsonData.table.rows.splice(0, 1)[0].c;

          for (let i = 0; i < cols.length; i++) {
            cols[i].label = this.JSON_cellGet(labels[i]);
          }
        }

        // let ret = func(jsonData);
        // console.log("return: ", ret);
        // if (func) return ret;
        if (func) return func(jsonData);
        return;
      });
  }

  /**
   * google sheets fetch text to jason
   * @param {string} text
   * @returns {Promise<Response>}
   */
  static Text_toJson(text) {
    //Remove additional text and extract only JSON:
    //remove function text in front and bracket in back
    return JSON.parse(text.substring(47).slice(0, -2));
  }

  //usables
  /**
   * returns value from a cell obj
   * @param {Object} cellObj
   * @returns {any} null if empty
   */
  static JSON_cellGet(cellObj) {
    if (cellObj != null)
      if (cellObj.v) return cellObj.v;
      else return cellObj.f;
    else return null;
  }

  /**
   *
   * @param {JSON} data google sheets json data
   */
  static JSON_to_PureJASON(data) {
    // console.log("JSON_to_PureJASON", data);
    let rows = data.table.rows;
    let rowLeng = rows.length;
    let cols = data.table.cols;
    let colLeng = cols.length;

    // console.log(cols);
    // console.log(rows);

    let jsonData = new Object();
    jsonData.rows = [];

    let rowData, rowV, colV, exStr, obj;
    //go through all rows
    for (let rowi = 0; rowi < rowLeng; rowi++) {
      rowData = rows[rowi];

      obj = {};

      //go through all colums
      for (let coli = 0; coli < colLeng; coli++) {
        colV = cols[coli].label;
        rowV = MyGS.JSON_cellGet(rowData.c[coli]);
        // console.log("json: ", rowi, colV, cols[coli].type, rowV);

        //differenciate by data type
        switch (cols[coli].type) {
          case "string":
            exStr = `${colV} =  ${rowV != null ? `\`${rowV}\`` : undefined};`;

            break;
          case "number":
            // exStr = `${colV} = +${rowV}`;

            exStr = `${colV} = +${rowV != null ? rowV : 0};`;

            break;
          default:
            console.warn(
              "google sheets convert to json: unkown type!!! ",
              colV,
              rowV
            );
            break;
        }

        // console.log("execute: ", "obj." + exStr);

        eval("obj." + exStr);
      }

      jsonData.rows.push(obj);
    }

    return jsonData;
  }
}
