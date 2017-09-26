function includeHTML() {
	var z, i, elmnt, file, xhttp;
	z = document.getElementsByTagName("*");
	for (i = 0; i < z.length; i++) {
		elmnt = z[i];
		file = elmnt.getAttribute("include-html");
		if (file) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					elmnt.innerHTML = this.responseText;
					elmnt.removeAttribute("include-html");
					includeHTML();
				}
			}
			xhttp.open("GET", file, true);
			xhttp.send();
			return;
		}
	}
}

function loadFragmentInToElement(fragment_url, element_id) {
	var element = document.getElementById(element_id);
	element.innerHTML = '<p><em>Loading ...</em></p>';
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", fragment_url);
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			element.innerHTML = xmlhttp.responseText;
		}
	}
	xmlhttp.send(null);
}