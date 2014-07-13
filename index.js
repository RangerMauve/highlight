// Get dependencies
var position = require('position');
var style = require('computed-style');

module.exports = function (element) {
	if (element) highlight(element);
	else hide_highlighter();
}

function hide_highlighter() {
	var highlighter = fetch_highlighter();
	highlighter.classList.add("rm-highlight-hidden");
}

function fetch_highlighter() {
	var highlighter;
	if (!(highlighter = document.querySelector(".rm-highlight"))) {
		highlighter = document.createElement("div");
		highlighter.classList.add("rm-highlight");
		highlighter.classList.add("rm-highlight-hidden");
	}
	return highlighter;
}


function highlight(element) {
	var highlighter = fetch_highlighter();;

	document.body.insertBefore(highlighter, document.body.childNodes[0]);

	var pos = position(element);
	var s = style(highlighter);
	var off_x = parseInt(s.getPropertyValue('border-left-width'));
	var off_y = parseInt(s.getPropertyValue('border-top-width'));
	highlighter.classList.remove("rm-highlight-hidden");
	highlighter.style.top = pos.top - off_y + "px";
	highlighter.style.top = pos.top - off_y + "px";
	highlighter.style.height = pos.height + "px";
	highlighter.style.left = pos.left - off_x + "px";
	highlighter.style.width = pos.width + "px";
}
