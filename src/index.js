"use strict";

require("./sass/app.sass")
require("font-awesome/css/font-awesome.css")

// Require index.html so it gets copied to dist
require("./index.html")

// Initialize Firebase
var fb = firebase
	.initializeApp(require("../config.js"))
	.database();

// Embed Elm
var Elm = require("./Main.elm")
var mountNode = document.getElementById("main")
var room = window.location.hash.substr(1)
var app = Elm.Main.embed(mountNode, {
	room: room
})

// Fetch Firebase data
var roomRef = null
app.ports.fetchRoomData.subscribe(function(room) {
	if (roomRef) {
		roomRef.off();
	}

	if (!room) {
		return;
	}

	roomRef = fb.ref("rooms/" + room)
	roomRef.on("value", function(snapshot) {
		if (snapshot.val()) {
			app.ports.roomData.send(snapshot.val())
		}
	})
});

// Vote
app.ports.fbVote.subscribe(function(data) {
	roomRef
		.child("users")
		.child(data.id)
		.set(data.vote)
})

// Vote
app.ports.fbEditQuestion.subscribe(function(question) {
	roomRef
		.child("question")
		.set(question)
})

app.ports.fbJoinRoom.subscribe(function(userName) {
	var amOnline = fb.ref(".info/connected");
	amOnline.on("value", function(snapshot) {
		if (snapshot.val()) {
			var userRef = roomRef.child("users").child(userName);
			userRef.onDisconnect().remove();
			userRef.set(0);
		}
	});
});