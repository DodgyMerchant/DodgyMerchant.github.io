/**
 * @file tag or filter logic handling class.
 * tags are strings that have to be an exact match.
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
/**
 * @typedef {"one" | "all" | "match" | "complete" | "exact"} TagBehavior refer to behavior map or MyTags Class for explainaition of individual behaviors.
 */
/**
 * tag or filter logic handling class.
 * tags are strings that have to be an exact match.
 * @version 1.1.0
 * @author Dodgy_Merchant <admin@dodgymerchant.dev>
 */
export default class MyTags {
  /* Filter Logic explainaition
  
  complete  = all tags in the target are matched to tags in the filter.

  match     = all tags in the filter are matched to tags in the target.

	target  filter
	"one":       one or more mathcing tags
	true   ["a", "x"] ["a", "y"]                       true =  incomplete  mismatch
	false  ["a", "x"] ["c", "y"]                       false = incomplete  mismatch
	"all":       all target tags are in the filter
	true   ["a", "b", "c"] ["a", "b", "c", "d", "e"]   true =  complete    mismatch
	true   ["a", "b", "c"] ["a", "b", "c"]             true =  complete    match
	false  ["a", "b", "c"] ["a", "b"]                  false = incomplete  match
	"match":     no mismatching tags
	true   ["a", "b"] ["a"]                            true =  incomplete  match
	true   ["a", "b"] ["a", "b"]                       true =  complete    match
	false  ["a", "b"] ["a", "c"]                       false = incomplete  mismatch
	false  ["a", "b"] ["a", "b", "c"]                  false = complete    mismatch
	"complete":  target has no mismatching tags unless all tags are contained in the filter.
	true   ["a", "b"] ["a"]                            true =  incomplete  match
	true   ["a", "b"] ["a", "b", "c"]                  true =  complete    mismatch
	true   ["a", "b"] ["a", "b"]                       true =  complete    match
	false  ["a", "b"] ["a", "c"]                       false = incomplete  mismatch
	"exact":     Displays all objects that have the exact same tags as used in the filter. All, not more or less.
	["a", "b", "c"] ["a", "b", "c"]                    true =  complete    match
  */

  /* test code
    // prettier-ignore
    {
    //one
    console.log("one: ", MyTags.Compare(["a", "x"], ["a", "y"], "one"), "true");
    console.log("one: ", MyTags.Compare(["a", "x"], ["c", "y"], "one"), "false");
    //all
    console.log("all: ", MyTags.Compare(["a", "b", "c"], ["a", "b", "c", "d", "e"], "all"), "true");
    console.log("all: ", MyTags.Compare(["a", "b", "c"], ["a", "b", "c"], "all"), "true");
    console.log("all: ", MyTags.Compare(["a", "b", "c"], ["a", "b"], "all"), "false");
    //match
    console.log("match: ", MyTags.Compare(["a", "b"], ["a"], "match"), "true");
    console.log("match: ", MyTags.Compare(["a", "b"], ["a", "b"], "match"), "true");
    console.log("match: ", MyTags.Compare(["a", "b"], ["a", "c"], "match"), "false");
    console.log("match: ", MyTags.Compare(["a", "b"], ["a", "b", "c"], "match"), "false");
    //complete
    console.log("complete: ", MyTags.Compare(["a", "b"], ["a"], "complete"), "true");
    console.log("complete: ", MyTags.Compare(["a", "b"], ["a", "b", "c"], "complete"), "true");
    console.log("complete: ", MyTags.Compare(["a", "b"], ["a", "b"], "complete"), "true");
    console.log("complete: ", MyTags.Compare(["a", "b"], ["a", "c"], "complete"), "false");
    //exact
    console.log("exact: ", MyTags.Compare(["a", "b", "c"], ["a", "b", "c"], "exact"), "true");
    console.log("exact: ", MyTags.Compare(["a", "b", "c"], ["a", "b", "x"], "exact"), "false");
    }
    */

  /**
   * a map of all behaviors and user description text for them.
   * @type {Map<TagBehavior,String>}
   */
  // prettier-ignore
  static TagBehaviorMap = new Map([
        ["one", "Displays all objects with atleast one matching tags."],
        ["all", "Displays all objects with all their tags matching."],
        ["exact","Displays all objects that have the exact same tags as used in the filter. All, not more or less."],
    ]);
  /**
   * expanded map of all behaviors and user description text for them.
   * @type {Map<TagBehavior,String>}
   */
  // prettier-ignore
  static TagBehaviorMapExt = new Map([
        ["one",       "Displays all objects with atleast one matching tag."],
        ["all",       "Displays all objects that have all their tags in the filter."],
        ["match",     "Displays all objects that have matching and no mismatching tags in the filter."],
        ["complete",  "Displays all objects that have no mismatching tags unless all tags are contained in the filter"],
        ["exact",     "Displays all objects that have the exact same tags as used in the filter. All, not more or less."],
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
          //all target tags must be in the filter tags
          // for (let i = 0; i < filterTags.length; i++) {
          // 	if (!targetTags.includes(filterTags[i])) {
          // 		return false;
          // 	}
          // }

          return this._cc(targetTags, filterTags);
        case "match":
          return this._cm(targetTags, filterTags);
        case "complete":
          if (
            !this._cc(targetTags, filterTags) &&
            !this._cm(targetTags, filterTags)
          )
            return false;
          return true;
        case "exact":
          //#region old
          // //looks for the exact same tags
          // feed = false;

          // //early exit if tag number isnt equal
          // if (targetTags.length != filterTags.length) return false;

          // for (o = 0; o < targetTags.length; o++) {
          // 	Otag = targetTags[o];
          // 	for (f = 0; f < filterTags.length; f++) {
          // 		Ftag = filterTags[f];

          // 		if (Ftag == Otag) {
          // 			feed = true;
          // 			break;
          // 		}
          // 	}

          // 	if (!feed) {
          // 		return false;
          // 	} else {
          // 		feed = false;
          // 	}
          // }

          // return true;

          //#endregion old

          return (
            this._cc(targetTags, filterTags) && this._cm(targetTags, filterTags)
          );
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

  static _cc(t, f) {
    // check for completion

    if (t.length > f.length) return false;

    for (let i = 0; i < t.length; i++) {
      if (!f.includes(t[i])) {
        return false;
      }
    }
    return true;
  }
  static _cm(t, f) {
    // check for matching

    return this._cc(f, t);
  }
}
