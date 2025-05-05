"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/directMessageHub").build();

connection.start().then(function () {
	alert('Connected to DirectMessageHub');
}).catch(function (err) {
	return console.error(err.toString());
});

connection.on("ReceiveMessage", function (user, message) {
    console.log("something happened :D");
	var content = `<b>${user} - </b>${message}`;
	$('#messagesList').append(`<li>${content}</li>`);
});