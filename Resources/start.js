var win = Ti.UI.currentWindow;


//------------------------------------------------------------------------
// Create an ImageView.
var backgroundImage = Ti.UI.createImageView({
	image : '/images/firstBackground.png',
	top : '0dp',
	bubbleParent:true

});


// Add to the parent view.
win.add(backgroundImage);


// Textfields för att ange spelarens namn
var player1nameTextField = Ti.UI.createTextField({
	top: "350dp",
	left: "10dp",
	right: "10dp",
	borderColor: "#DEDEDE",
	borderWidth: 1,
	borderRadius:5,
	hintText: "Spelare 1"
});

win.add(player1nameTextField);

var player2nameTextField = Ti.UI.createTextField({
	top: "380dp",
	left: "10dp",
	right: "10dp",
	borderColor: "#DEDEDE",
	borderWidth: 1,
	borderRadius:5,
	hintText: "Spelare 2"
});

win.add(player2nameTextField);


var startGameButton = Ti.UI.createButton({
	title: "Spela",
	top: "400dp",
	width: "100dp",
	height: "50dp"
});

startGameButton.addEventListener("click", function(e) {
	// if(player1nameTextField.value == "")
	// {
		// alert("Du måste skriva in namn för spelare 1!!");
		// return;
	// }
	// if(player2nameTextField.value == "")
	// {
		// alert("Du måste skriva in namn för spelare 2!!");
		// return;
	// }
// 	
	// Skicka med spelares namn och speltyp
	var gameWin = Ti.UI.createWindow({
		url: "game.js",
		backgroundColor: "#ffffff",
		p1name: player1nameTextField.value,
		p2name: player2nameTextField.value,
		gametype: "win1"		
	});
	
	gameWin.open();
});

win.add(startGameButton);

var start3GameButton = Ti.UI.createButton({
	title: "Spela först till tre",
	top: "450dp",
	width: "auto",
	height: "50dp"
});

start3GameButton.addEventListener("click", function(e) {
	// if(player1nameTextField.value == "")
	// {
		// alert("Du måste skriva in namn för spelare 1!!");
		// return;
	// }
	// if(player2nameTextField.value == "")
	// {
		// alert("Du måste skriva in namn för spelare 2!!");
		// return;
	// }
	
	var gameWin = Ti.UI.createWindow({
		url: "game.js",
		backgroundColor: "#ffffff",
		p1name: player1nameTextField.value,
		p2name: player2nameTextField.value,
		gametype: "win3"		
	});
	
	gameWin.open();
});

win.add(start3GameButton);

