// check for Template support
const supportsTemplate = new Boolean(
  document.createElement("Template").content,
);

// continue or exit
if (supportsTemplate) {
} else {
  alert(
    "Notice:\n\nYour Browser is far out of date.\nThis will cause most of this websites content to display incorrectly.\n\nMeaning large parts wont display at all.",
  );
}

/**
 * HTML template element handling class.
 * Has only static functions.
 * @version 1.2.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyTemplate {
  /**
   * Only creates element from template.
   * @param {HTMLTemplateElement} template
   * @returns {HTMLElement} appended child of template.
   */
  static create(template) {
    if (!supportsTemplate) return;

    return document.importNode(template.content, true);
  }

  /**
   * Clears element of all its child elements.
   * @param {HTMLElement} htmlElement
   */
  static clearAll(htmlElement) {
    const _child = htmlElement.firstElementChild;
    while (_child) {
      htmlElement.removeChild(_child);
      _child = htmlElement.firstElementChild;
    }
  }

  /**
   * Adds child to parent as a child.
   * @param {HTMLElement} parent Parent element to add child to.
   * @param {HTMLElement} child Child element to add to parent.
   * @returns {HTMLElement} Returns parent element for chaining.
   */
  static addChild(parent, child) {
    return parent.appendChild(child);
  }
  /**
   * Adds all children of provided template element to target the element.
   * Returns a list of all added child elements.
   * @param {HTMLElement} parent Parent {@link HTMLElement} to add children to.
   * @param {HTMLTemplateElement} template Template which {@link HTMLElement} children element to add.
   * @returns {Element[]} List of added elements.
   */
  static addTemplate(parent, template) {
    const list = [];
    const newTemplate = this.create(template);
    do {
      list.push(this.addChild(parent, newTemplate.firstElementChild));
    } while (newTemplate.childElementCount > 0);

    return list;
  }

  /**
   * Returns if the browser supports template.
   * @returns {Boolean}
   */
  static supports() {
    return supportsTemplate;
  }
}
