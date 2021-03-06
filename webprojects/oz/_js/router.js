/**	This file manages the location
 */

$(document).ready(function(){models.refresh();});

window.onhashchange = function() {
	"use strict";

	var cmd = (location.hash||"").slice(1);
	$(".nav .tBtn").removeClass("focus");
	$(".tickets > .ticket").hide()
	if(cmd.startsWith("tick-")) {
		var tKey = cmd.substr(5);
		$(".nav .tBtn[tKey=\""+tKey+"\"]").removeClass("focus");
		$(".tickets > .ticket[tKey=\""+tKey+"\"]").show()
	}
	if(cmd == "refresh" || cmd == "reload" || cmd == "reconnect")
		models.refresh();
}
