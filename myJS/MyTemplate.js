//check for Template support
const supportsTemplate = new Boolean(
  document.createElement("Template").content
);
//continue or exit
if (supportsTemplate) {
  console.log("Your browser supports Template!");
} else {
  console.error("Your browser does NOT support Template!!!");
}

/**
 * HTML template element handling class.
 * Has only static functions.
 * @version 1.1.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyTemplate {
  /**
   *  only creates element from template
   * @param {HTMLTemplateElement} template
   * @returns {HTMLElement} appended child of template
   */
  static create(template) {
    if (!supportsTemplate) return;

    return document.importNode(template.content, true);
  }

  /**
   * clers of all child elements
   * @param {HTMLElement} parEl
   */
  static clearAll(parEl) {
    let _child = parEl.firstElementChild;
    while (_child) {
      parEl.removeChild(_child);
      _child = parEl.firstElementChild;
    }
  }

  static addChild(child, target) {
    return target.appendChild(child);
  }
  /**
   * adds all template children to target element and returns a list of all added elelemnts.
   * @param {HTMLTemplateElement} template
   * @param {HTMLElement} target
   * @returns {Node[]}
   */
  static addTemplate(template, target) {
    let list = [];
    let temp = this.create(template);
    do {
      list.push(this.addChild(temp.firstElementChild, target));
    } while (temp.childElementCount > 0);

    return list;
  }

  /**
   * returns if the browser supports template.
   * @returns {Boolean}
   */
  static supports() {
    return supportsTemplate;
  }
}
