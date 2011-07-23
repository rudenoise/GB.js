var story = {};
// SET UP ENV
story.div = document.getElementById('app');
// SET UP HASCHANGE EVENT
if ('onhashchange' in window) {
    window.onhashchange = function () {
        story.hashChange();
    };
} else {// FOR BROWSERS WITHOUT #CHANGE SUPPORT
    setInterval(function () {
        story.hashChange();
    }, 100);
}
story.hashChange = function () {
    var str = unescape(window.location.hash.slice(1)), parts, ep, edit = false;
    if (GB.validEpisodeList(story.epLi) === false) {
        story.div.innerHTML = lms(['h1', '404: Broken story!']);
    } else if (str === '' || str === '#') {
        story.div.innerHTML = lms([
            ['h1', 'This is a Choose Your Own Adventure Story'],
            ['p', ['a', {
                href: '#' + story.epLi[0].description
            }, 'Start hrere &gt; &gt;']]
        ]);
    } else {
        parts = str.split('/');
        ep = story.epLi[GB.episodeIndex(story.epLi, parts[0])];
        edit = (parts.length === 2 && parts[1] === 'edit');
        if (edit && ep !== false) {
            story.edit(ep);
        } else if (ep !== false) {
            story.render(ep);
        } else {
            story.div.innerHTML = lms(['h1', '404: Episode not found!']);
        }
    }
}
// UI
story.render = function (episode) {
    story.div.innerHTML = lms([
        ['h2', episode.description],
        ['p', episode.body],
        ['ul', (function (choices) {
            var rtn = [], i, l = choices.length;
            for (i = 0; i < l; i += 1) {
                rtn.push(['li',
                    ['a', {
                        href: '#' + escape(choices[i])
                    }, choices[i]]]);
            }
            return rtn;
        } (episode.choices))],
        ['p', ['a', {href: document.location.hash + '/edit'}, 'edit']]
    ]);
};
story.edit = function (episode, error) {
    error = error || false;
    var epContent, choiceList, choiceArr = [],
        choiceInput, btn, filter, doFilter, doClick, newEpisode;
    story.div.innerHTML = lms([
        ['h2', episode.description],
        (error ? ['h2', 'you did sonething bad'] : []),
        ['textarea', {id: 'epContent'}, episode.body],
        ['ul', {id: 'choiceList'}, (function (choices) {
            var rtn = [], i, l = choices.length;
            for (i = 0; i < l; i += 1) {
                choiceArr.push(choices[i]);
                rtn.push(['li',
                    ['a', {
                        href: '#' + escape(choices[i])
                    }, choices[i]]]);
            }
            return rtn;
        } (episode.choices))],
        ['input', {id: 'choiceInput', type: 'text'}],
        ['ul', {id: 'filter'}],
        ['button', {id: 'btn'}, 'Update']
    ]);
    epContent = document.getElementById('epContent');
    choiceList = document.getElementById('choiceList');
    choiceInput = document.getElementById('choiceInput');
    filter = document.getElementById('filter');
    btn = document.getElementById('btn');
    doClick = function () {
        newEpisode = GB.createEpisode(episode.description, epContent.value, choiceArr);
        if (GB.validEpisode(newEpisode)) {
            story.epLi[GB.episodeIndex(story.epLi, episode.description)] = newEpisode;
            document.location.hash = '#';
        } else {
            story.edit(episode, true);
        }
    };
    doFilter = function () {
        filter.innerHTML = lms(function () {
            var i, l = story.epLi.length, rtn = [], re = new RegExp('^' + choiceInput.value.toLowerCase());
            for (i = 0; i < l; i += 1) {
                if (re.test(story.epLi[i].description.toLowerCase()) &&
                    !q.inA(story.epLi[i].description, choiceArr) &&
                    story.epLi[i].description !== episode.description) {
                    rtn.push(['li', story.epLi[i].description]);
                }
            }
            return rtn;
        } ());
        var i, l = filter.childNodes.length;
        for (i = 0; i < l; i += 1) {
            filter.childNodes[i].addEventListener('click', function () {
                newEpisode = GB.createEpisode(episode.description, epContent.value, choiceArr.concat(this.innerHTML));
                if (GB.validEpisode(newEpisode)) {
                    episode = story.epLi[GB.episodeIndex(story.epLi, episode.description)] = newEpisode;
                    story.edit(episode);
                }
            }, false);
        }
    };
    if ('addEventListener' in btn) {
        btn.addEventListener('click', doClick, false);
        choiceInput.addEventListener('keyup', doFilter, false);
    } else {
        btn.attachEvent('onclick', doClick);
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
story.hashChange();
