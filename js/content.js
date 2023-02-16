import MyDisplay from "../myJS/MyDisplay.js";
import { MyArr, MyHTML } from "../myJS/MyJS.js";
import MyTags from "../myJS/MyTags.js";
import MyTemplate from "../myJS/MyTemplate.js";

//#region get element

const FilterNav = document.getElementById("filter-nav");
/**
 *@type {HTMLButtonElement}
 */
const FilterButton = document.getElementById("filter-button");

/**
 * @type {HTMLDivElement}
 */
const ContentDestination = document.getElementById("content-destination");
/**
 * @type {HTMLTemplateElement}
 */
const ContentTemplate = document.getElementById("content-template");

//#endregion get element
//#region genearal events

//filter button
FilterButton.addEventListener("click", () => {
	MyDisplay.toggle(FilterNav);
});

//#endregion genearal events
//#region template support
if (!MyTemplate.supports())
	alert(
		"Your browser does not fully support this website!\n My portfolio projects won't be displayed currently."
	);
//#endregion template support

/**
 * @type {ContentHandler}
 */
var contentHandler;

/**
 * @typedef {Object} ContentData content data object containing all data for a content block.
 * @property {string} headline text
 * @property {string} sub text
 * @property {string} date text
 * @property {string} imageAlt desc
 * @property {string} imageURL desc
 * @property {string} text desc
 * @property {string[]} tags desc
 */
/**
 *
 */
class ContentHandler {
	//#region configurable

	//#endregion
	//#region filter elements
	/**
	 * class name of active filters
	 * @type {string}
	 */
	filterClassActive = "active";

	/**
	 * how many tags in the filter ellement have to match for the object to be active.
	 * @type {TagBehavior}
	 */
	filterBehavior = "one";

	//#endregion filter
	//#region filtered elements

	/**
	 * class name of active filters
	 * @type {string}
	 */
	filteredClassActive = "active";

	/**
	 * how many tags in the filtered element have to match for the object be displayed.
	 * @type {TagBehavior}
	 */
	filteredBehavior = "one";

	//#endregion filtered
	//#region tags and filters

	/**
	 * @typedef {"one" | "all" | "exact"} TagBehavior "one" or more. "all" or more. "exact"ly the items, no more or less.
	 */
	/**
	 * @type {Map<TagBehavior,String>}
	 */
	// prettier-ignore
	TagBehaviorMap = new Map([
		["one", "Displays all objects with one or more matching tags."],
		["all", "Displays all objects with all or more matching tags."],
		["exact","Displays all objects with the exact same tags. All, not more or less."],
	]);

	/**
	 * map of all tags
	 * @type {Map<string, any>}
	 */
	tagMap = new Map();

	/**
	 * @type {string[]}
	 */
	activeFilters = [];

	//#endregion filtered

	/**
	 *
	 * @param {HTMLTemplateElement} template
	 * @param {HTMLElement} destination
	 * @param {[ContentData]} data
	 * @returns
	 */
	constructor(template, destination, data) {
		if (!MyTemplate.supports()) return;

		console.log(data);

		//#region content create
		let entry, img;
		/**
		 * @type {HTMLDivElement}
		 */
		let _newClone;

		for (let i = 0; i < data.length; i++) {
			entry = data[i];

			_newClone = MyTemplate.addTemplate(template, destination)[0];

			// prettier-ignore
			this.setContent(
			_newClone,  entry.tags,
			MyHTML.getChildByID(_newClone,"content-headline"),  entry.headline,
			MyHTML.getChildByID(_newClone,"content-subline"),   entry.sub,
			MyHTML.getChildByID(_newClone,"content-date"),      entry.date,
			MyHTML.getChildByID(_newClone,"content-Text"),      entry.text,
			MyHTML.getChildByID(_newClone,"content-img"),       entry.imageURL,
			                                                    entry.imageAlt
			);
		}

		//#endregion
		//#region filter

		//perform filter setup on all filters
		let filter = document.getElementsByClassName("filter");
		for (let i = 0; i < filter.length; i++) {
			this.filterSetup(filter[i]);
		}

		//#endregion filter

		this.FilterApply(["all"]);
	}

	/**
	 * update html elements
	 * @param {string[]} tags
	 */
	FilterApply(tags = this.activeFilters) {
		//#region preprocess filters

		//remove "all" filter
		if (tags.length > 1 && tags.includes("all"))
			MyArr.remove(tags, tags.indexOf("all"));

		//if list empty add all filter
		if (tags.length == 0) tags.push("all");

		//#endregion preprocess filters

		// console.log("FilterApply from: ", this.activeFilters, "to", tags);
		this.activeFilters = tags;

		/**
		 * filter targets
		 */
		let fltrTrg = document.getElementsByClassName("filtered");
		//filtered
		for (let i = 0; i < fltrTrg.length; i++) {
			if (
				this.TagCheck(fltrTrg[i], this.activeFilters, this.filteredBehavior) ||
				this.activeFilters.includes("all")
			) {
				MyHTML.addClass(fltrTrg[i], this.filteredClassActive);
			} else {
				MyHTML.removeClass(fltrTrg[i], this.filteredClassActive);
			}
		}

		//filter
		//go through all filter and
		let filterList = document.getElementsByClassName("filter");
		let filter;
		for (let i = 0; i < filterList.length; i++) {
			filter = filterList[i];
			if (this.TagCheck(filter, this.activeFilters, this.filterBehavior)) {
				// console.log('filter "', filter.textContent, '" set to active');
				MyHTML.addClass(filter, this.filterClassActive);
			} else {
				MyHTML.removeClass(filter, this.filterClassActive);
			}
		}
	}

	/**
	 * checks if the given target tag list corresponds to the source tag list with the given gebavior.
	 * If target object tag list is empty will only be drawn if the filtered tags are also empty.
	 * @param {HTMLElement} element element to check tags against.
	 * @param {string[]=} filterTags List of Tags to filter by. If no tags are given it will always return true.
	 * @param {TagBehavior=} behavior "one" or more. "all" or more. "exact"ly the items, no more or less.
	 * @returns {boolean}
	 */
	TagCheck(element, filterTags, behavior) {
		if (!behavior)
			if (element.className.split(" ").indexOf("filter") != -1) {
				behavior = this.filterBehavior;
			} else {
				behavior = this.filteredBehavior;
			}

		return MyTags.Compare(this.getTags(element), filterTags, behavior);
	}

	/**
	 * get tags of a given HTMLElement
	 * @param {HTMLElement} elem
	 */
	getTags(elem) {
		let classList = elem.className.split(" ");

		let num = classList.indexOf("filter");
		if (num == -1) num = classList.indexOf("filtered");

		return classList[num + 1].split(",");
	}

	/**
	 *
	 * @param {*} tagsTar
	 * @param {*} tags
	 * @param {*} headTrg
	 * @param {*} headTxt
	 * @param {*} subTrg
	 * @param {*} subTxt
	 * @param {*} datTrg
	 * @param {*} dat
	 * @param {*} txtTarg
	 * @param {string} txt article text
	 * @param {*} imgTrg
	 * @param {*} imgSrc
	 * @param {*} imgAlt
	 */
	setContent(
		tagTar,
		tags,
		headTrg,
		headTxt,
		subTrg,
		subTxt,
		datTrg,
		dat,
		txtTarg,
		txt,
		imgTrg,
		imgSrc,
		imgAlt
	) {
		tagTar.classList.add(tags);
		headTrg.innerText = headTxt;
		subTrg.innerText = subTxt;
		datTrg.innerText = dat;
		txtTarg.innerText = txt;
		imgTrg.src = imgSrc;
		imgTrg.alt = imgAlt;
	}

	/**
	 *
	 * @param {HTMLElement} filterEl
	 */
	filterSetup(filterEl) {
		if (!MyHTML.hasClass(filterEl, "all")) {
			//all not "all" buttons
			filterEl.addEventListener("click", (event) => {
				let _t = event.target;

				//set own active status
				// if (MyHTML.hasClass(_t, this.filterClassActive)) {
				// 	MyHTML.removeClass(_t, this.filterClassActive);
				// 	console.log("Filter is active -> inactive: ", _t.classList);
				// } else {
				// 	MyHTML.addClass(_t, this.filterClassActive);
				// 	console.log("Filter is inactive -> active: ", _t.classList);
				// }

				// if (this.TagCheck(_t, this.activeFilters, this.filterBehavior)) {
				if (MyHTML.hasClass(_t, this.filterClassActive)) {
					MyArr.removeList(this.activeFilters, this.getTags(_t));
				} else {
					MyArr.pushUniqueList(this.activeFilters, this.getTags(_t));
				}

				contentHandler.FilterApply();
			});
		} else {
			//"all" button
			filterEl.addEventListener("click", (event) => {
				contentHandler.FilterApply(["all"]);
			});
		}
	}
}

fetch("content/content.json")
	.then((results) => results.json())
	.then((data) => {
		contentHandler = new ContentHandler(
			ContentTemplate,
			ContentDestination,
			data
		);
	});

/*
var _template = document.getElementById("content-Template").content;

*/
