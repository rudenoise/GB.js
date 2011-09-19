/*global Q*/
var GB = (function (GB) {
    // A CYOA style GameBook(GB) reader/writer JoelHughes.co.uk
    GB.validEpisode = function (ep) {
        var re = new RegExp('[\<\>]');
        return q.isO(ep) &&
            (("description" in ep) && q.isS(ep.description) &&
                !re.test(ep.description) &&
            ("body" in ep) && q.isS(ep.body) && !re.test(ep.body) &&
            ("choices" in ep) && q.isA(ep.choices));
    };
    GB.createEpisode = function (description, body, choices) {
        choices = choices || [];
        return (q.isS(description) && q.isS(body) && q.isA(choices)) ? {
            description: description,
            body: body,
            choices: choices
        } : false;
    };
    GB.validEpisodeList = function (epLi) {
        // is a epLi recurser required?
        return q.isEA(epLi) ? true :
            GB.validEpisode(q.h(epLi)) ?
                GB.validEpisodeList(q.t(epLi)) :
                false;
    };
    GB.validChoice = function (epLi, choice) {
        // is a epLi recurser required?
        return (q.isA(epLi) && q.isS(choice)) ?
            q.isEA(epLi) ? false :
                (GB.validEpisode(q.h(epLi)) &&
                    q.h(epLi).description === choice) ?
                    true : GB.validChoice(q.t(epLi), choice) : false;
    };
    GB.addChoiceToEpisode = function (epLi, ep, choice) {
        return (GB.validEpisode(ep) && GB.validChoice(epLi, choice)) ?
            GB.createEpisode(ep.description, ep.body,
                (q.inA(choice, ep.choices) ? ep.choices :
                    q.cons(choice, ep.choices))) :
            false;
    };
    GB.episodeIndex = function (epLi, choice, index) {
        index = index || 0;
        return (q.isA(epLi) && q.isS(choice) && q.isN(index)) ?
            q.isEA(epLi) ? false :
                (GB.validEpisode(q.h(epLi)) && q.h(epLi).description ===
                    choice) ? index :
                    GB.episodeIndex(q.t(epLi), choice, (index + 1)) : false;
    };
    GB.displayEpisode = function (epLi, choice, fun) {
        return (GB.validEpisodeList(epLi) &&
            q.isS(choice) && q.isF(fun)) ?
            fun(epLi[GB.episodeIndex(epLi, choice)]) : false;
    };
    GB.makeEpisodeList = function (epLi, ep) {
        //Returns a new episodeList
        //replaces ep at matching choice index with incoming ep
        //or appends ep
        return q.isA(epLi) && GB.validEpisode(ep) ?
            q.isEA(epLi) ? q.cons(ep, epLi) :
                (q.h(epLi).description === ep.description) ?
                    q.cons(ep, q.t(epLi)) :
                    q.cons(q.h(epLi), GB.makeEpisodeList(q.t(epLi), ep)) : false;
    };
    GB.matchStr = function (ep, match) {
        return GB.validEpisode(ep) && q.isS(match) ?
            (new RegExp("^" + match)).test(ep.description) :
            false;
    };
    GB.filter = function (epLi, str) {
        return (q.isA(epLi) && q.isS(str)) ?
            q.isEA(epLi) ?
                [] :
                GB.matchStr(q.h(epLi), str) ?
                    q.cons(q.h(epLi).description, GB.filter(q.t(epLi), str)) :
                    GB.filter(q.t(epLi), str) :
            false;
    };
    // PRIVATE
    escape = function (html) {
        // TODO: Add html escaping when rendering page text
        return new Option(html).innerHTML;
    };
    return GB;
})(GB || {});
