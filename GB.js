/*global Q*/
var GB = (function (GB) {
    // A CYOA style GameBook(GB) reader/writer JoelHughes.co.uk
    GB.validEpisode = function (ep) {
        return Q.isObj(ep) &&
            (("description" in ep) && Q.isStr(ep.description) &&
            ("body" in ep) && Q.isStr(ep.body) &&
            ("choices" in ep) && Q.isArr(ep.choices));
    };
    GB.createEpisode = function (description, body, choices) {
        choices = choices || [];
        return (Q.isStr(description) && Q.isStr(body) && Q.isArr(choices)) ? {
            description: description,
            body: body,
            choices: choices
        } : false;
    };
    GB.validEpisodeList = function (epLi) {
        // is a epLi recurser required?
        return Q.isEmptyArr(epLi) ? true :
            GB.validEpisode(Q.h(epLi)) ? GB.validEpisodeList(Q.t(epLi)) :
                false;
    };
    GB.validChoice = function (epLi, choice) {
        // is a epLi recurser required?
        return (Q.isArr(epLi) && Q.isStr(choice)) ?
            Q.isEmptyArr(epLi) ? false :
                (GB.validEpisode(Q.h(epLi)) &&
                    Q.h(epLi).description === choice) ?
                    true : GB.validChoice(Q.t(epLi), choice) : false;
    };
    GB.addChoiceToEpisode = function (epLi, ep, choice) {
        return (GB.validEpisode(ep) && GB.validChoice(epLi, choice)) ?
            GB.createEpisode(ep.description, ep.body,
                (Q.inArr(choice, ep.choices) ? ep.choices :
                    Q.con(choice, ep.choices))) :
            false;
    };
    GB.episodeIndex = function (epLi, choice, index) {
        index = index || 0;
        return (Q.isArr(epLi) && Q.isStr(choice) && Q.isNum(index)) ?
            Q.isEmptyArr(epLi) ? false :
                (GB.validEpisode(Q.h(epLi)) && Q.h(epLi).description ===
                    choice) ? index :
                    GB.episodeIndex(Q.t(epLi), choice, (index + 1)) : false;
    };
    GB.displayEpisode = function (epLi, choice, fun) {
        return (GB.validEpisodeList(epLi) &&
            Q.isStr(choice) && Q.isFun(fun)) ?
            fun(epLi[GB.episodeIndex(epLi, choice)]) : false;
    };
    GB.makeEpisodeList = function (epLi, ep) {
        //Returns a new episodeList
        //replaces ep at matching choice index with incoming ep
        //or appends ep
        return Q.isArr(epLi) && GB.validEpisode(ep) ?
            Q.isEmptyArr(epLi) ? Q.con(ep, epLi) :
                (Q.h(epLi).description === ep.description) ?
                    Q.con(ep, Q.t(epLi)) :
                    Q.con(Q.h(epLi), GB.makeEpisodeList(Q.t(epLi), ep)) : false;
    };
    GB.matchStr = function (ep, match) {
        return GB.validEpisode(ep) && Q.isStr(match) ?
            Q.isArr(ep.description.match(new RegExp("^" + match))) :
            false;
    };
    GB.filter = function (epLi, str) {
        return (Q.isArr(epLi) && Q.isStr(str)) ?
            Q.isEmptyArr(epLi) ?
                [] :
                GB.matchStr(Q.h(epLi), str) ?
                    Q.con(Q.h(epLi).description, GB.filter(Q.t(epLi), str)) :
                    GB.filter(Q.t(epLi), str) :
            false;
    };
    return GB;
})(GB || {});
