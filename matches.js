this.Element && function (Prototype) {
	Prototype.matches =
		Prototype.matches ||
		Prototype.matchesSelector ||
		Prototype.mozMatchesSelector ||
		Prototype.msMatchesSelector ||
		Prototype.oMatchesSelector ||
		Prototype.webkitMatchesSelector ||
		matches;

	function matches(selector) {
		var node = this,
			nodes = (node.parentNode || node.document).querySelectorAll(selector),
			i = -1;
		while (nodes[++i] && nodes[i] != node);
		return !!nodes[i];
	}
}(Element.prototype);
