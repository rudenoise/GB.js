var story = {}, write = {};
story.restart = function () {
    story.renderEpisode(story.epLi[0]);
};
story.forward = function (e) {
    var txt = e.target.innerHTML;
    story.renderEpisode(story.epLi[GB.episodeIndex(story.epLi, txt)]);
};
// DOM ELEMENTS
// restart btn
story.restartBtn = document.getElementById("restart");
story.restartBtn.addEventListener("click", function () {
    story.restart();
}, true);
// choices event
story.choices = document.getElementById("choices");
story.choices.addEventListener("click", function (e) {
    story.forward(e);
}, true);
story.choice = document.getElementsByClassName("choice")[0];
story.choices.innerHTML = "";
// body element
story.body = document.getElementById("body");
// bind GB events to UI
story.renderEpisode = function (ep) {
    if (GB.validEpisode(ep)) {
        var i, l, node;
        this.body.innerHTML = ep.body;
        l = ep.choices.length;
        story.choices.innerHTML = "";
        for (i = 0; i < l; i += 1) {
            if (GB.validChoice(story.epLi, ep.choices[i])) {
                node = story.choice.cloneNode(false);
                node.innerHTML = ep.choices[i];
                story.choices.appendChild(node);
            }
        }
    }
};
// build story list
story.epLi = GB.makeEpisodeList([],
    GB.createEpisode("Wake up...", "You wake from a restful sleep"));
story.epLi = GB.makeEpisodeList(story.epLi,
    GB.createEpisode("Brush teeth...", "You brush your teeth and feel very sleepy"));
story.epLi[0] = GB.addChoiceToEpisode(story.epLi, story.epLi[0], "Brush teeth...");
story.epLi[1] = GB.addChoiceToEpisode(story.epLi, story.epLi[1], "Wake up...");
story.epLi = GB.makeEpisodeList(story.epLi,
    GB.createEpisode("Jump out of window...", "Your strange impulse sends you hurtling towards the street below..."));
story.epLi[0] = GB.addChoiceToEpisode(story.epLi, story.epLi[0], "Jump out of window...");
// GO
story.renderEpisode(story.epLi[0]);
// WRITE STORY
write.choicesIn = document.getElementById("choicesIn");
write.inEvent = function (e) {
    console.log(GB.filter(story.epLi, e.target.value));
};
write.choicesIn.addEventListener("keyup", write.inEvent, true);
