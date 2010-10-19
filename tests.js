/*global ovi, orpheus, music, module, test, asyncTest, start, ok, equal, expect, document, stop, console, Q, GB*/
module("Basic Setup");
test("NameSpaces", function () {
    ok(typeof(Q) === "object", "Q lib exists");
    ok(Q.isObj(GB), "GB exists");
});
module("Episodes", {
    setup: function () {
        this.exampleEp = {
            description: "A description...",
            body: "The body of the episode looks like this.",
            choices: []
        };
    },
    teardown: function () {
        delete this.exampleEp;
    }
});
test("Valid", function () {
    ok(Q.isFun(GB.validEpisode), "validEpisode is a function");
    var v = GB.validEpisode;
    ok(v() === false, "Rejects empty args");
    ok((v("", 123) && v(function () {})) === false, "Rejects bad args");
    ok(v({}) === false, "Rejects badly formed obj");
    ok(v({
        description: 1,
        body: 2,
        choices: {}
    }) === false, "Rejects well formed obj with bad types");
    ok(v(this.exampleEp), "Accepts well formed episode");
});
test("Create", function () {
    ok(Q.isFun(GB.createEpisode), "createEpisode is a function");
    var c = GB.createEpisode;
    ok(c() === false, "Rejects empty args");
    ok((c(1, 2) && c({}, function () {})) === false, "Rejects bad args");
    ok(Q.isObj(c("d", "b", [])), "Correct args return obj");
    ok(GB.validEpisode(c("d", "b", [])), "Correct args return validEpisode");
});
module("Story List", {
    setup: function () {
        this.egList = [];
        var c = GB.createEpisode;
        this.egList.push(c("Start", "You wake up.", ["Next"]));
        this.egList.push(c("Next", "You go to bed.", ["Start"]));
    },
    teardown: function () {
        delete this.egList;
    }
});
test("Valid Episode List", function () {
    ok(Q.isFun(GB.validEpisodeList), "validEpisodeList is a function");
    var el = GB.validEpisodeList;
    ok(el() === false, "Rejects empty args");
    ok(el([]), "Accepts empty arr");
    ok(el(12) === false, "Rejects bad args");
    ok(el(this.egList), "Accepts valid list");
    this.egList.push(12);
    ok(el(this.egList) === false, "Rejects invalid list");
});
test("Valid Choice", function () {
    ok(Q.isFun(GB.validChoice), "validChoice is a function");
    var v = GB.validChoice;
    ok(v() === false, "Rejects empty args");
    ok(v(1, 2) === false, "Rejects bad args");
    ok(v([], "t") === false, "Rejects no match on empty list");
    ok(v(this.egList, "blsh") === false, "Rejects none existant choice");
    ok(v(this.egList, "Start") && v(this.egList, "Next"), "Accepts valid choices");
});
test("Add choice to episode", function () {
    ok(Q.isFun(GB.addChoiceToEpisode), "addChoiceToEpisode is a function");
    var add = GB.addChoiceToEpisode, ep, ep2;
    ok(add() === false, "Rejects empty args");
    ok(add(1, [], {}) === false, "Rejects bad args");
    ep = GB.createEpisode("Another", "...");
    ep = add(this.egList, ep, "Start");
    ok(GB.validEpisode(ep) &&
       ep.choices[(ep.choices.length - 1)] === "Start",
    "Returns an episode with added choice");
    ok(add(this.egList, ep, "Stop") === false, "Rejects invalid choice");
    ep = GB.createEpisode("Another", "...");
    ok(ep.choices.length === 0, "Origional episode has no choices");
    ep2 = add(this.egList, ep, "Start");
    ok(ep.choices.length === 0 && ep2.choices.length === 1, "addChoiceToEpisode is not destructive");
    ep2 = add(this.egList, ep2, "Start");
    ok(ep2.choices.length === 1, "Doesn't add duplicate choices");
});
module("Navigate", {
    setup: function () {
        this.egList = [];
        var c = GB.createEpisode;
        this.egList.push(c("Start", "You wake up.", ["Next"]));
        this.egList.push(c("Next", "You go to bed.", ["Start"]));
    },
    teardown: function () {
        delete this.egList;
    }
});
test("Choice index", function () {
    ok(Q.isFun(GB.episodeIndex), "episodeIndex is a function");
    var ei = GB.episodeIndex;
    ok(ei() === false, "Returns false for no args");
    ok(ei(1, "", {}) === false, "Rejects bad args");
    ok(ei([], "t") === false, "Returns false for empty Arr");
    ok(ei([{a: "b"}], "t") === false, "Returns false if epLi contains invalid obj");
    ok(ei(this.egList, "Start") === 0, "Returns correct index id choice is in position 0");
    ok(ei(this.egList, "Star") === false, "Returns false no match");
    ok(ei(this.egList, "Next") === 1, "Returns correct index id choice is later in list");
});
test("Display Episode", function () {
    ok(Q.isFun(GB.displayEpisode), "displayEpisode is a function");
    var d = GB.displayEpisode;
    ok(d() === false, "Returns false for no args");
    ok(d(1, 2, 3) === false, "Rejects bad args");
    ok(d(this.egList, "Start", function (ep) {
        return GB.validEpisode(ep);
    }) === true, "Returns the value inside the callback");
    ok(d(this.egList, "Start", function (ep) {
        return !GB.validEpisode(ep);
    }) === false, "Returns the value inside the callback");
});
module("Build story", {
    setup: function () {
        this.ep1 = GB.createEpisode("Wake up", "You wake up bu feel tired");
        this.ep2 = GB.createEpisode("Go to bed", "You go back to bed");
        this.ep3 = GB.createEpisode("Brush teeth", "Brushing your teeth makes you feel lively!");
    },
    teardown: function () {}
});
test("Make Episode List", function () {
    ok(Q.isFun(GB.makeEpisodeList), "makeStory is a function");
    var mel = GB.makeEpisodeList, egStry1, egStry2;
    ok(mel() === false, "Returns false for empty args");
    ok(mel(1, "") === false, "Rejects bad args");
    ok(Q.isArr(mel([], this.ep1)), "Returns an array for valid args");
    ok(mel([], this.ep1)[0].description === "Wake up", "Returns an array for valid args");
    ok(mel([this.ep1, this.ep2], this.ep3).length === 3, "Returns a story the correct length");
    egStry1 = mel([this.ep1, this.ep2], this.ep3);
    ok(GB.validEpisodeList(egStry1), "Returns validEpisodeList");
    egStry2 = mel(egStry1, GB.addChoiceToEpisode(egStry1, egStry1[0], "Go to bed"));
    ok(GB.validEpisodeList(egStry2), "Returns validEpisodeList");
    ok(egStry2[0].choices[0] === "Go to bed", "Correct episode updated with choice");
    ok(Q.isUndef(egStry1[0].choices[0]), "makeEpisodeList is not destructive");
});
test("Match Description Start", function () {
    ok(Q.isFun(GB.matchStr), "GB.matchStr is a function");
    var match = GB.matchStr;
    ok(match() === false, "Returns false for no args");
    ok(match(123, []) === false, "Rejects bad args");
    ok((match(GB.createEpisode("wx", ""), "x") &&
        match(GB.createEpisode("ab", ""), "abc")) === false,
        "Rejects missmatched strings");
    ok(match(GB.createEpisode("abc", ""), "a") &&
        match(GB.createEpisode("xyz", ""), "xyz"),
        "Accepts pairs that start with same chars");
});
test("Filter Choices", function () {
    ok(Q.isFun(GB.filter), "GB.filter exists");
    var rslt = fil = GB.filter,
        egStry = GB.makeEpisodeList([this.ep1, this.ep2], this.ep3);
    ok(fil() === false, "Rejects empty args");
    ok(fil(12, []) === false, "Rejects bad args");
    ok(Q.isArr(fil([], "")),
        "Returns an array with arr and empty string");
    rslt = fil(egStry, "nnn"); 
    ok(Q.isArr(rslt) && rslt.length === 0,
        "Returns an empty array for no matches");
    rslt = fil(egStry, "W"); 
    ok(Q.isArr(rslt) && rslt.length === 1,
        "Returns an array 1 long matches");
    egStry = GB.makeEpisodeList(egStry, GB.createEpisode("Wank", ""));
    rslt = fil(egStry, "Wa");
    //console.log(egStry); 
    //console.log(rslt); 
    ok(Q.isArr(rslt) && rslt.length === 2,
        "Returns an array 2 long matches");
});
