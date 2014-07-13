highlight
=========

Have a box flow around and highlight currently selected sections

Usage
-----
Install with component:

`component install rangermauve/highlight`

Quick example:
``` javascript
var highlight = require("highlight");

var my_element = document.getElementById("some_section");

// Dim everything but your element
highlight(my_element);

setTimeout(function(){
	// Stop highlighting
	highlight();
},2000);
```

Also, check out test.html for a nicer example (make sure to build the component first)
