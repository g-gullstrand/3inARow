var win = Ti.UI.currentWindow;

// Håll koll på nuvarande spelare
var currentPlayer = 0;

// Håll koll på antal vinster per spelare
var player1wins = 0;
var player2wins = 0;

// Färger för grundruta och för varje spelare
var tileColor = "#ccc";
var player1Color = "#ff00ff";
var player2Color = "#aaaaaa";

// Namn till spelare från start.js
var player1name = win.p1name;
var player2name = win.p2name;

var tileSizeForAnimation = Ti.Platform.displayCaps.platformWidth / 4;
var tileStartPosition = -tileSizeForAnimation;

var slideOut = Titanium.UI.createAnimation({
	top : tileStartPosition
});
var slideInFirst = Titanium.UI.createAnimation({
	top: tileSizeForAnimation*3
});
var slideInSecond = Titanium.UI.createAnimation({
	top : tileSizeForAnimation*2
});
var slideInThird = Titanium.UI.createAnimation({
	top : tileSizeForAnimation
});
var slideInFourth = Titanium.UI.createAnimation({
	top : 0
});

// Funktion för att se om en rad är vinnande
function checkWonRow(wc, t1, t2, t3) {
	// Om det skickas med att någon redan vunnit, gå ur funktionen direkt och returnera vinnaren.
	if (wc != "") {
		return wc;
	}
	
	// Kolla om de tre rutnummer som skickats in är samma
	if (boardTiles[t1].backgroundColor == boardTiles[t2].backgroundColor && boardTiles[t2].backgroundColor == boardTiles[t3].backgroundColor) {
		// Om de är samma och de inte är grundfärgen
		if (boardTiles[t1].backgroundColor != tileColor) 
		{
			// Returnera vinstfärgen
			return boardTiles[t1].backgroundColor;
		}
	}
	
	// Om det inte är lika, returnera tomt
	return "";
}

function checkWon() {
	// Sätt nuvarande vinnarfärg till tom
	wonColor = "";

	// Kolla om ruta 0,1,2 dvs översta raden är samma färg, skicka med befintlig vinnare dvs tom
	wonColor = checkWonRow(wonColor, 0, 1, 2);
	
	wonColor = checkWonRow(wonColor, 1, 2, 3);
	// Kolla om ruta 3,4,5 dvs mellersta raden är samma färg, skicka med befintlig vinnare dvs
	// om rad ett var vinnande eller tomt.
	wonColor = checkWonRow(wonColor, 4, 5, 6);
	wonColor = checkWonRow(wonColor, 5, 6, 7);
	// osv för resterande rader
	wonColor = checkWonRow(wonColor, 8, 9, 10);
	wonColor = checkWonRow(wonColor, 9, 10, 11);
	
	wonColor = checkWonRow(wonColor, 12, 13, 14);
	wonColor = checkWonRow(wonColor, 13, 14, 15);

	wonColor = checkWonRow(wonColor, 0, 4, 8);
	wonColor = checkWonRow(wonColor, 4, 8, 12);
	
	wonColor = checkWonRow(wonColor, 1, 5, 9);
	wonColor = checkWonRow(wonColor, 5, 9, 13);
	
	wonColor = checkWonRow(wonColor, 2, 6, 10);
	wonColor = checkWonRow(wonColor, 6, 10, 14);
	
	wonColor = checkWonRow(wonColor, 3, 7, 11);
	wonColor = checkWonRow(wonColor, 7, 11, 15);

	//Diagonalt mitten
	wonColor = checkWonRow(wonColor, 0, 5, 10);
	wonColor = checkWonRow(wonColor, 5, 10, 15);
	
	wonColor = checkWonRow(wonColor, 3, 6, 9);
	wonColor = checkWonRow(wonColor, 6, 9, 12);
	
	
	wonColor = checkWonRow(wonColor, 4, 9, 14);
	wonColor = checkWonRow(wonColor, 8, 5, 2);
	
	wonColor = checkWonRow(wonColor, 1, 6, 11);
	wonColor = checkWonRow(wonColor, 7, 10, 13);
	//wonColor = checkWonRow(wonColor, 2, 4, 6);

	// Kolla om det är oavgjort. Loopa igenom alla rutor och se om någon är grundfärg.
	// Är någon grundfärg är det inte oavgjort.
	isDraw = true;
	for(i = 0;i < 16;i++)
	{
		if(boardTiles[i].backgroundColor == tileColor)
		{
			isDraw = false;
		}
	}

	Ti.API.info("wonColor " + wonColor);
	
	var wontext = '';
	// Om vinstfärg är spelare 1s färg, sätt vinsttext, lägg till en i antal vinster och ändra label
	// som visar antal vinster
	if (wonColor == player1Color) {
		wontext = player1name + " vann";
		
		player1wins++;
		wonCountLabel.text = player1name+": "+player1wins+" "+player2name+": "+player2wins;
	}
	if (wonColor == player2Color) {
		wontext = player2name + " vann";

		player2wins++;
		wonCountLabel.text = player1name+": "+player1wins+" "+player2name+": "+player2wins;
	}

	// Om någon vann ett spel
	if (wonColor != tileColor && wonColor != "") {
		// Skriv ut i loggen för att kunna felsöka
		Ti.API.info("win.gametype "+win.gametype);
		Ti.API.info("player1wins "+player1wins);
		Ti.API.info("player2wins "+player2wins);
		
		// Om det är spel "först till tre vinster" och ingen har tre vinster än
		// Återställ då rutor till grundfärg och sluta köra funktion vid "return". 
		if(win.gametype == "win3" && player1wins < 3 && player2wins < 3)
		{
			for ( i = 0; i < 16; i++) {
				boardTiles[i].backgroundColor = tileColor;
			}			
			for ( i = 0; i < 32; i++) {
					tiles[i].animate(slideOut);
					//gameView.remove(tiles[i]);
					firstRowClickCount = 0;
					secondRowClickCount = 0;
					thirdRowClickCount = 0;
					fourthRowClickCount = 0;
				}				
			return;				
		}
		
		// Gör en dialogruta med text att någon vann
		var dialog = Ti.UI.createAlertDialog({
			title : "Vinnare!",
			message: wontext, 
			buttonNames : ['Sluta spela!', 'Spela igen!']
		});
		dialog.addEventListener('click', function(e) {
			// Om någon klickade på första knappen dvs index 0 så stäng fönster
			// annars återställ spel
			if(e.index == 0)
			{
				win.close();
			} else {
				player1wins = 0;
				player2wins = 0;
				wonCountLabel.text = player1name+": "+player1wins+" "+player2name+": "+player2wins;
				
				for ( i = 0; i < 16; i++) {
					boardTiles[i].backgroundColor = tileColor;
				}	
				
				for ( i = 0; i < 32; i++) {
					tiles[i].animate(slideOut);
					
				}	
				
					firstRowClickCount = 0;
					secondRowClickCount = 0;
					thirdRowClickCount = 0;
					fourthRowClickCount = 0;
				
			}
		});
		dialog.show();	
		// Sluta köra funktion då någon vunnit		
		return;
	}
	
	// Kolla om det är oavgjort
	if(isDraw)
	{
		var dialog = Ti.UI.createAlertDialog({
			title : "Det blev oavgjort!",
			message: "Ingen vann!", 
			buttonNames : ['Sluta spela!', 'Spela igen!']
		});
		dialog.addEventListener('click', function(e) {
			if(e.index == 0)
			{
				win.close();
			} else {
				for ( i = 0; i < 16; i++) {
					boardTiles[i].backgroundColor = tileColor;
				}	
				
				for ( i = 0; i < 32; i++) {
					tiles[i].animate(slideOut);
					
				}	
				
				firstRowClickCount = 0;
				secondRowClickCount = 0;
				thirdRowClickCount = 0;
				fourthRowClickCount = 0;			
			}
		});
		dialog.show();
	}

}

// Vy i toppen
var navView = Ti.UI.createView({
	top : 0,
	height : "60dp",
	backgroundColor : "#6a8cb9"
});

win.add(navView);



// Stängknapp
var closeGameButton = Ti.UI.createButton({
	title : "Stäng",
	left : "5dp",
	width : "auto",
	height : "auto"
});

closeGameButton.addEventListener("click", function(e) {
	win.close();
});

navView.add(closeGameButton);

// Label för att visa antal vinster. Dölj om det är bara spela en gång spel.
var wonCountLabel = Ti.UI.createLabel({
	bottom: 0, 
	text : player1name+": "+player1wins+" "+player2name+": "+player2wins
});
if(win.gametype == "win1")
{
	wonCountLabel.hide();
}
navView.add(wonCountLabel);

// Label för att visa aktiv spelare
var currentPlayerLabel = Ti.UI.createLabel({
	text : "Spelare: " + player1name
});
navView.add(currentPlayerLabel);

// Vy för spelplan. Gör höjden till skärmens bredd
var gameView = Ti.UI.createView({
	top : "60dp",
	height : Ti.Platform.displayCaps.platformWidth,
	backgroundColor : 'transparent'
});

win.add(gameView);




// Gör en ruta till en tredjedel av skärmens bredd
var tileSize = Ti.Platform.displayCaps.platformWidth / 4;

// Array för rutorna

	
var tiles = [];


	
for ( i = 0; i < 32; i++) {
	tiles[i] = Ti.UI.createView({
		width : tileSize,
		height : tileSize,
		backgroundColor : tileColor,
		borderColor : "#000000",
		borderWidth : 1,
		borderRadius:40,
		tile_number :i
	});

	gameView.add(tiles[i]);
}


//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------PLAYER 1
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Positionera vyerna
tiles[0].left = 0;
tiles[0].top = tileStartPosition;
tiles[0].backgroundColor = player1Color;

tiles[1].top = tileStartPosition; //0;
tiles[1].left = tileSize;
tiles[1].backgroundColor = player1Color;

tiles[2].top = tileStartPosition; //0;
tiles[2].left = tileSize*2;
tiles[2].backgroundColor = player1Color;

tiles[3].top = tileStartPosition; //0;
tiles[3].right = 0;
tiles[3].backgroundColor = player1Color;

//------------------------------------------------------------------------

tiles[4].left = 0;
tiles[4].top = tileStartPosition; //tileSize;
tiles[4].backgroundColor = player1Color;

tiles[5].left = tileSize;
tiles[5].top = tileStartPosition; //tileSize;
tiles[5].backgroundColor = player1Color;


tiles[6].left = tileSize*2;
tiles[6].top = tileStartPosition; //tileSize;
tiles[6].backgroundColor = player1Color;

tiles[7].left = tileSize*3;
tiles[7].top = tileStartPosition; //tileSize;
tiles[7].backgroundColor = player1Color;

//------------------------------------------------------------------------

tiles[8].left = 0;
tiles[8].top = tileStartPosition; //tileSize*2;
tiles[8].backgroundColor = player1Color;

tiles[9].left = tileSize;
tiles[9].top = tileStartPosition; //tileSize*2;
tiles[9].backgroundColor = player1Color;

tiles[10].left = tileSize*2;
tiles[10].top = tileStartPosition; //tileSize*2;
tiles[10].backgroundColor = player1Color;

tiles[11].right = 0;
tiles[11].top = tileStartPosition; //tileSize*2;
tiles[11].backgroundColor = player1Color;

//------------------------------------------------------------------------

tiles[12].left = 0;
tiles[12].top = tileStartPosition; //0;
tiles[12].backgroundColor = player1Color;

tiles[13].top = tileStartPosition; //0;
tiles[13].left = tileSize;
tiles[13].backgroundColor = player1Color;

tiles[14].top = tileStartPosition; //0;
tiles[14].left = tileSize*2;
tiles[14].backgroundColor = player1Color;

tiles[15].top = tileStartPosition; //0;
tiles[15].left = tileSize*3;
tiles[15].backgroundColor = player1Color;

//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------PLAYER 2
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Positionera vyerna
tiles[16].left = 0;
tiles[16].top = tileStartPosition;
tiles[16].backgroundColor = player2Color;

tiles[17].top = tileStartPosition; //0;
tiles[17].left = tileSize;
tiles[17].backgroundColor = player2Color;

tiles[18].top = tileStartPosition; //0;
tiles[18].left = tileSize*2;
tiles[18].backgroundColor = player2Color;

tiles[19].top = tileStartPosition; //0;
tiles[19].right = 0;
tiles[19].backgroundColor = player2Color;

//------------------------------------------------------------------------

tiles[20].left = 0;
tiles[20].top = tileStartPosition; //tileSize;
tiles[20].backgroundColor = player2Color;

tiles[21].left = tileSize;
tiles[21].top = tileStartPosition; //tileSize;
tiles[21].backgroundColor = player2Color;

tiles[22].left = tileSize*2;
tiles[22].top = tileStartPosition; //tileSize;
tiles[22].backgroundColor = player2Color;

tiles[23].left = tileSize*3;
tiles[23].top = tileStartPosition; //tileSize;
tiles[23].backgroundColor = player2Color;

//------------------------------------------------------------------------

tiles[24].left = 0;
tiles[24].top = tileStartPosition; //tileSize*2;
tiles[24].backgroundColor = player2Color;

tiles[25].left = tileSize;
tiles[25].top = tileStartPosition; //tileSize*2;
tiles[25].backgroundColor = player2Color;

tiles[26].left = tileSize*2;
tiles[26].top = tileStartPosition; //tileSize*2;
tiles[26].backgroundColor = player2Color;

tiles[27].right = 0;
tiles[27].top = tileStartPosition; //tileSize*2;
tiles[27].backgroundColor = player2Color;

//------------------------------------------------------------------------

tiles[28].left = 0;
tiles[28].top = tileStartPosition; //0;
tiles[28].backgroundColor = player2Color;

tiles[29].top = tileStartPosition; //0;
tiles[29].left = tileSize;
tiles[29].backgroundColor = player2Color;

tiles[30].top = tileStartPosition; //0;
tiles[30].left = tileSize*2;
tiles[30].backgroundColor = player2Color;

tiles[31].top = tileStartPosition; //0;
tiles[31].left = tileSize*3;
tiles[31].backgroundColor = player2Color;



// Create an ImageView.
var secondBackgroundImage = Ti.UI.createImageView({
	image : '/images/secondBackground.png',
	bottom : '0dp',
	//opacity:0.5,
	bubbleParent:true

});

// Add to the parent view.
win.add(secondBackgroundImage);

//------------------------------------------------------------------------
// Create an ImageView.
var backgroundImage = Ti.UI.createImageView({
	image : '/images/backgroundNoStripes.png',
	top : '60dp',
	//opacity:0.5,
	bubbleParent:true

});

// Add to the parent view.
win.add(backgroundImage);

//------------------------------------------------------------------------

var boardTiles = [];

for ( i = 0; i < 16; i++) {
	boardTiles[i] = Ti.UI.createView({
		width : tileSize,
		height : tileSize,
		backgroundColor : '#ccc',
		borderColor : "#000000",
		borderWidth : 1,
		boardTiles_number :i,
		opacity:0.0
	});
	
	gameView.add(boardTiles[i]);
}

// Positionera vyerna
boardTiles[0].left = 0;
boardTiles[0].top = 0;

boardTiles[1].top = 0;
boardTiles[1].left = tileSize;

boardTiles[2].top = 0;
boardTiles[2].left = tileSize*2;

boardTiles[3].top = 0;
boardTiles[3].right = 0;

//------------------------------------------------------------------------

boardTiles[4].left = 0;
boardTiles[4].top = tileSize;

boardTiles[5].left = tileSize;
boardTiles[5].top = tileSize;


boardTiles[6].left = tileSize*2;
boardTiles[6].top = tileSize;

boardTiles[7].left = tileSize*3;
boardTiles[7].top = tileSize;

//------------------------------------------------------------------------

boardTiles[8].left = 0;
boardTiles[8].top = tileSize*2;

boardTiles[9].left = tileSize;
boardTiles[9].top = tileSize*2;

boardTiles[10].left = tileSize*2;
boardTiles[10].top = tileSize*2;


boardTiles[11].right = 0;
boardTiles[11].top = tileSize*2;

//------------------------------------------------------------------------

boardTiles[12].left = 0;
boardTiles[12].bottom = 0;

boardTiles[13].bottom = 0;
boardTiles[13].left = tileSize;

boardTiles[14].bottom = 0;
boardTiles[14].left = tileSize*2;

boardTiles[15].bottom = 0;
boardTiles[15].left = tileSize*3;





var firstRow = Ti.UI.createView({
	height:Ti.Platform.displayCaps.platformWidth,
	width:tileSize,
	left:0,
	top:'60dp',
	backgroundColor:'transparent',
	
});

var firstRowClickCount = 0;

firstRow.addEventListener('click', function(e) {
	
	if(firstRowClickCount == 0 && currentPlayer == 0){
		
			tiles[0].animate(slideInFirst);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[12].backgroundColor = player1Color;
			
	}else if(firstRowClickCount == 0 && currentPlayer == 1){
		
			tiles[16].animate(slideInFirst);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[12].backgroundColor = player2Color;
			
			
	}
	
	if(firstRowClickCount == 1 && currentPlayer == 0){
		
			tiles[4].animate(slideInSecond);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[8].backgroundColor = player1Color;
			
	}else if(firstRowClickCount == 1 && currentPlayer == 1){
		
			tiles[20].animate(slideInSecond);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[8].backgroundColor = player2Color;
	}
	
	if(firstRowClickCount == 2 && currentPlayer == 0){
		
			tiles[8].animate(slideInThird);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[4].backgroundColor = player1Color;
			
	}else if(firstRowClickCount == 2 && currentPlayer == 1){
		
			tiles[24].animate(slideInThird);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[4].backgroundColor = player2Color;
			
	}
	if(firstRowClickCount == 3 && currentPlayer == 0){
		
			tiles[12].animate(slideInFourth);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[0].backgroundColor = player1Color;
			
	}else if(firstRowClickCount == 3 && currentPlayer == 1){
		
			tiles[28].animate(slideInFourth);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[0].backgroundColor = player2Color;
	}
	
	
	
	if(firstRowClickCount <= 3){
		firstRowClickCount += 1;
	}
	
	Ti.API.info('firstRowClickCount: '+firstRowClickCount);
	
	checkWon();

});


win.add(firstRow);


//------------------------------------------------------------------------


var secondRow = Ti.UI.createView({
	height:Ti.Platform.displayCaps.platformWidth,
	width:tileSize,
	left:tileSize,
	top:'60dp',
	backgroundColor:'transparent',
	
});

var secondRowClickCount = 0;

secondRow.addEventListener('click', function(e) {
	
if(secondRowClickCount == 0 && currentPlayer == 0){
		
			tiles[1].animate(slideInFirst);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[13].backgroundColor = player1Color;
			
	}else if(secondRowClickCount == 0 && currentPlayer == 1){
		
			tiles[17].animate(slideInFirst);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[13].backgroundColor = player2Color;
			
	}
	
	if(secondRowClickCount == 1 && currentPlayer == 0){
		
			tiles[5].animate(slideInSecond);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[9].backgroundColor = player1Color;
			
	}else if(secondRowClickCount == 1 && currentPlayer == 1){
		
			tiles[21].animate(slideInSecond);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[9].backgroundColor = player2Color;
			
	}
	
	if(secondRowClickCount == 2 && currentPlayer == 0){
		
			tiles[9].animate(slideInThird);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[5].backgroundColor = player1Color;
			
	}else if(secondRowClickCount == 2 && currentPlayer == 1){
		
			tiles[25].animate(slideInThird);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[5].backgroundColor = player2Color;
			
	}
	if(secondRowClickCount == 3 && currentPlayer == 0){
		
			tiles[13].animate(slideInFourth);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[1].backgroundColor = player1Color;
			
	}else if(secondRowClickCount == 3 && currentPlayer == 1){
		
			tiles[29].animate(slideInFourth);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[1].backgroundColor = player2Color;
			
	}
	
	if(secondRowClickCount <= 3){
		secondRowClickCount += 1;
	}
	
	
	Ti.API.info('secondRowClickCount: '+secondRowClickCount);
	
	checkWon();
});


win.add(secondRow);


//------------------------------------------------------------------------


var thirdRow = Ti.UI.createView({
	height:Ti.Platform.displayCaps.platformWidth,
	width:tileSize,
	left:tileSize*2,
	top:'60dp',
	backgroundColor:'transparent',
	
});

var thirdRowClickCount = 0;

thirdRow.addEventListener('click', function(e) {
	

if(thirdRowClickCount == 0 && currentPlayer == 0){
		
			tiles[2].animate(slideInFirst);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[14].backgroundColor = player1Color;
			
	}else if(thirdRowClickCount == 0 && currentPlayer == 1){
		
			tiles[18].animate(slideInFirst);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[14].backgroundColor = player2Color;
			
	}
	
	if(thirdRowClickCount == 1 && currentPlayer == 0){
		
			tiles[6].animate(slideInSecond);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[10].backgroundColor = player1Color;
			
	}else if(thirdRowClickCount == 1 && currentPlayer == 1){
		
			tiles[22].animate(slideInSecond);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[10].backgroundColor = player2Color;
			
	}
	
	if(thirdRowClickCount == 2 && currentPlayer == 0){
		
			tiles[10].animate(slideInThird);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[6].backgroundColor = player1Color;
			
	}else if(thirdRowClickCount == 2 && currentPlayer == 1){
		
			tiles[26].animate(slideInThird);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[6].backgroundColor = player2Color;
			
	}
	if(thirdRowClickCount == 3 && currentPlayer == 0){
		
			tiles[14].animate(slideInFourth);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[2].backgroundColor = player1Color;
			
	}else if(thirdRowClickCount == 3 && currentPlayer == 1){
		
			tiles[30].animate(slideInFourth);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[2].backgroundColor = player2Color;
			
	}
	
	if(thirdRowClickCount <= 3){
		thirdRowClickCount += 1;
	}
	
	
	Ti.API.info('thirdRowClickCount: '+thirdRowClickCount);
	
	checkWon();
});


win.add(thirdRow);


//------------------------------------------------------------------------


var fourthRow = Ti.UI.createView({
	height:Ti.Platform.displayCaps.platformWidth,
	width:tileSize,
	right:0,
	top:'60dp',
	backgroundColor:'transparent',
	
});

var fourthRowClickCount = 0;

fourthRow.addEventListener('click', function(e) {

if(fourthRowClickCount == 0 && currentPlayer == 0){
		
			tiles[3].animate(slideInFirst);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[15].backgroundColor = player1Color;
			
	}else if(fourthRowClickCount == 0 && currentPlayer == 1){
		
			tiles[19].animate(slideInFirst);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[15].backgroundColor = player2Color;
			
	}
	
	if(fourthRowClickCount == 1 && currentPlayer == 0){
		
			tiles[7].animate(slideInSecond);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[11].backgroundColor = player1Color;
			
	}else if(fourthRowClickCount == 1 && currentPlayer == 1){
		
			tiles[23].animate(slideInSecond);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[11].backgroundColor = player2Color;
			
	}
	
	if(fourthRowClickCount == 2 && currentPlayer == 0){
		
			tiles[11].animate(slideInThird);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[7].backgroundColor = player1Color;
			
	}else if(fourthRowClickCount == 2 && currentPlayer == 1){
		
			tiles[27].animate(slideInThird);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[7].backgroundColor = player2Color;
			
	}
	if(fourthRowClickCount == 3 && currentPlayer == 0){
		
			tiles[15].animate(slideInFourth);
			//e.source.backgroundColor = player1Color;
			currentPlayer = 1;
			currentPlayerLabel.text = "Spelare: " + player2name;
			boardTiles[3].backgroundColor = player1Color;
			
	}else if(fourthRowClickCount == 3 && currentPlayer == 1){
		
			tiles[31].animate(slideInFourth);
			//e.source.backgroundColor = player2Color;
			currentPlayer = 0;
			currentPlayerLabel.text = "Spelare: " + player1name;
			boardTiles[3].backgroundColor = player2Color;
	}
	
	if(fourthRowClickCount <= 3){
		fourthRowClickCount += 1;
	}
	
	
	Ti.API.info('fourthRowClickCount: '+fourthRowClickCount);
	
	checkWon();
});


win.add(fourthRow);







