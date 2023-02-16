/**
 * @file tag or filter logic handling class.
 * tags are strings that have to be an exact match.
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */

/**
 * @typedef {"one" | "all" | "exact"} TagBehavior "one" or more. "all" or more. "exact"ly the items, no more or less.
 */
/**
 * tag or filter logic handling class.
 * tags are strings that have to be an exact match.
 * @version 1.0.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyTags {
	/**
	 * @type {Map<TagBehavior,String>}
	 */
	// prettier-ignore
	static TagBehaviorMap = new Map([
		["one", "Displays all objects with one or more matching tags."],
		["all", "Displays all objects with all or more matching tags."],
		["exact","Displays all objects with the exact same tags. All, not more or less."],
	]);

	/**
	 * checks if target tags correspont to the filter tags using given behavior.
	 * If target tag list is empty will only be drawn if the filter tags are also empty.
	 * @param {string[]=} targetTags List of Tags belonging to the target.
	 * @param {string[]=} filterTags List of Tags to filter by. If no tags are given it will always return true.
	 * @param {TagBehavior} behavior "one" or more. "all" or more. "exact"ly the items, no more or less.
	 * @returns {boolean}
	 */
	static Compare(targetTags, filterTags, behavior) {
		let o, f, Otag, Ftag;
		let feed;

		let trgEmpty = targetTags.length == 0;
		let tagEmpty = !filterTags || filterTags.length == 0;

		if (!trgEmpty && !tagEmpty) {
			switch (behavior) {
				case "one":
					//look for one match

					for (f = 0; f < filterTags.length; f++) {
						Ftag = filterTags[f];
						for (o = 0; o < targetTags.length; o++) {
							Otag = targetTags[o];

							if (Otag == Ftag) {
								return true;
							}
						}
					}
					return false;
				case "all":
					feed = false;

					for (f = 0; f < filterTags.length; f++) {
						Ftag = filterTags[f];
						for (o = 0; o < targetTags.length; o++) {
							Otag = targetTags[o];

							if (Ftag == Otag) {
								feed = true;
								break;
							}
						}

						if (!feed) {
							return false;
						} else {
							feed = false;
						}
					}
					return true;
				case "exact":
					//looks for the exact same tags
					feed = false;

					//early exit if tag number isnt equal
					if (targetTags.length != filterTags.length) return false;

					for (o = 0; o < targetTags.length; o++) {
						Otag = targetTags[o];
						for (f = 0; f < filterTags.length; f++) {
							Ftag = filterTags[f];

							if (Ftag == Otag) {
								feed = true;
								break;
							}
						}

						if (!feed) {
							return false;
						} else {
							feed = false;
						}
					}

					return true;
			}
		} else {
			//if object tag list empty only draw if filter list is also empty
			if (trgEmpty) {
				if (tagEmpty) return true;
				else return false;
			}

			return true;
		}
	}
}
