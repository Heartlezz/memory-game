(function(){
var MemoryGame = {
		
		init: function(cards){		
		
			this.$container = $(".container");								
			this.cardsArray = cards;
			this.$cards = $(this.pickCards(this.cardsArray));
			this.setupGame();			
			
		},
				
		setupGame: function(){
			
			var setup = this.buildSetupHTML();
			this.$container.html(setup);
			$(".start-btn").on("click", $.proxy(this.startGame, this));			
		
		},		
		
		startGame: function(){			
			
			var start = this.buildStartHTML();
			this.$container.html(start);			
			this.paused = false;
			this.guess = null;
			$(".card").on("click", this.cardClicked);
			$(".restart").on("click", $.proxy(this.restartGame, this));	
			this.timeOut = setTimeout(function(){$(".inside").removeClass("picked");}, 5000);	
			
		},
		
		endGame: function(){
			
			var end = this.buildEndHTML();
			this.$container.html(end);
			$(".restart-btn").on("click", $.proxy(this.restartGame, this));	
			
		},
		
		restartGame: function(){
			
			clearTimeout(this.timeOut);
			this.$cards = $(this.pickCards(this.cardsArray));
			this.startGame();

		},
		
		pickCards: function(array){		
		
			var cards;			
			cards = this.shuffle(array);			
			cards = cards.slice(0,9);
			cards = $.merge(cards,cards);			
			array = this.shuffle(cards);			
			return array;			
		
		},
		
		score: function(match){
			
			var matched,oldScore,newScore,score = $(".score"),card = $(".card"),mg = MemoryGame;			
			oldScore = +score.html();
			
			if(match == "yes"){			
			matched = card.find(".inside").not(".matched").length;			
			if(matched == 0){
			matched = 2;
			}
			newScore = oldScore + (matched/2)*42;			
			score.html(newScore);			
			}else{			
			matched = card.find(".matched").length;			
			newScore = oldScore - (matched/2)*42;
			if(newScore < 0){
			newScore = 0;
			}			
			score.html(newScore);				
			}			
			mg.$score = newScore;
			
		},
		
		cardClicked: function(){
		
			var mG = MemoryGame;
			var $card = $(this);
			if(!mG.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				$card.find(".inside").addClass("picked");
				$card.attr("data-tid","Card-flipped");
				
				mG.sound();			
				
				if(!mG.guess){
					mG.guess = $(this).attr("data-id");					
				} else if(mG.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){					
					$(".picked").addClass("matched").removeClass("picked");
					mG.score("yes");
					$(".matched").children(".back").fadeOut();
					setTimeout(function(){$(".matched").fadeOut("slow");}, 600);
					mG.guess = null;
				} else {					
					$(".picked").closest(".card").attr("data-tid","Card");
					mG.score("no");
					mG.guess = null;
					mG.paused = true;
					setTimeout(function(){$(".picked").removeClass("picked"); mG.paused = false;}, 600);
				}
				if($(".matched").length == $(".card").length){
					mG.score("yes");
					setTimeout(function(){mG.endGame();}, 600);
				}
			}
		
		},

		shuffle: function(array){			
		
			var counter = array.length, temp, index;
			
			while (counter > 0) {
        	index = Math.floor(Math.random() * counter--);
        	temp = array[counter];
        	array[counter] = array[index];
        	array[index] = temp;
			}
			
	    	return array;
		
		},
		
		buildSetupHTML: function(){
			
			var setup = '';
			setup = '\
			<div class="screen">\
			<div class="logo"></div>\
			<div class="title">Memory game</div>\
			<div data-tid="NewGame-startGame" class="btn start-btn">Start game</div>\
			</div>\
			';
			return setup;
			
		},
		
		buildStartHTML: function(){
			
			var cardsHtml = this.buildCardHTML();
			var start = '';
			start = '\
			<div class="screen">\
			<div class="play-head">\
			<div data-tid="Menu-newGame" class="restart">Restart game</div>\
			<div class="score-title">Score: <span data-tid="Menu-scores" class="score">0</span></div>\
			</div>\
			<div data-tid="Deck" class="play-body">\
			'+cardsHtml+'\
			</div>\
			</div>\
			';	
			return start;
			
		},
		
		buildEndHTML: function(){
			
			var end = '';
			end = '\
			<div class="screen end-game">\
			<div class="logo"></div>\
			<div class="title">Congratulations!<br>Your final score:'+ this.$score+'</div>\
			<div class="btn restart-btn">Еще раз</div>\
			</div>\
			';
			return end;
		},
		
		buildCardHTML: function(){
		
			var cardsHtml = '';
			this.$cards.each(function(k, v){
				cardsHtml += '<div class="card"  data-tid="Card"  data-id="'+ v.id +'"><div class="inside picked">\
				<div class="front"><img src="'+ v.img +'"\
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="assets/cards/b.png"\
				alt="Back" /></div></div>\
				</div>';
			});
			
			return cardsHtml;
		
		},
		
		sound: function(){
				
				var audio = new Audio();
				if(audio.canPlayType('audio/mp3') == ""){				
				audio.src = "assets/sounds/slide.wav";					
				}else{
				audio.src = "assets/sounds/slide.mp3";;	
				}
				audio.play();
		}
	};

	var cards = [
		{
			name: "2C",
			img: "assets/cards/2C.png",
			id: 1,
		},
		{
			name: "2D",
			img: "assets/cards/2D.png",
			id: 2,
		},
		{
			name: "2H",
			img: "assets/cards/2H.png",
			id: 3,
		},
		{
			name: "2S",
			img: "assets/cards/2S.png",
			id: 4,
		},
		{
			name: "3C",
			img: "assets/cards/3C.png",
			id: 5,
		},
		{
			name: "3D",
			img: "assets/cards/3D.png",
			id: 6,
		},
		{
			name: "3H",
			img: "assets/cards/3H.png",
			id: 7,
		},
		{
			name: "3S",
			img: "assets/cards/3S.png",
			id: 8,
		},
		{
			name: "4C",
			img: "assets/cards/4C.png",
			id: 9,
		},
		{
			name: "4D",
			img: "assets/cards/4D.png",
			id: 10,
		},
		{
			name: "4H",
			img: "assets/cards/4H.png",
			id: 11,
		},
		{
			name: "4S",
			img: "assets/cards/4S.png",
			id: 12,
		},		
		{
			name: "5C",
			img: "assets/cards/5C.png",
			id: 13,
		},
		{
			name: "5D",
			img: "assets/cards/5D.png",
			id: 14,
		},
		{
			name: "5H",
			img: "assets/cards/5H.png",
			id: 15,
		},
		{
			name: "5S",
			img: "assets/cards/5S.png",
			id: 16,
		},
		{
			name: "6C",
			img: "assets/cards/6C.png",
			id: 17,
		},
		{
			name: "6D",
			img: "assets/cards/6D.png",
			id: 18,
		},
		{
			name: "6H",
			img: "assets/cards/6H.png",
			id: 19,
		},
		{
			name: "6S",
			img: "assets/cards/6S.png",
			id: 20,
		},
		{
			name: "7C",
			img: "assets/cards/7C.png",
			id: 21,
		},
		{
			name: "7D",
			img: "assets/cards/7D.png",
			id: 22,
		},
		{
			name: "7H",
			img: "assets/cards/7H.png",
			id: 23,
		},
		{
			name: "7S",
			img: "assets/cards/7S.png",
			id: 24,
		},
		{
			name: "8C",
			img: "assets/cards/8C.png",
			id: 25,
		},
		{
			name: "8D",
			img: "assets/cards/8D.png",
			id: 26,
		},
		{
			name: "8H",
			img: "assets/cards/8H.png",
			id: 27,
		},
		{
			name: "8S",
			img: "assets/cards/8S.png",
			id: 28,
		},
		{
			name: "9C",
			img: "assets/cards/9C.png",
			id: 29,
		},
		{
			name: "9D",
			img: "assets/cards/9D.png",
			id: 30,
		},
		{
			name: "9H",
			img: "assets/cards/9H.png",
			id: 31,
		},
		{
			name: "9S",
			img: "assets/cards/9S.png",
			id: 32,
		},
		{
			name: "0C",
			img: "assets/cards/0C.png",
			id: 33,
		},
		{
			name: "0D",
			img: "assets/cards/0D.png",
			id: 34,
		},
		{
			name: "0H",
			img: "assets/cards/0H.png",
			id: 35,
		},
		{
			name: "0S",
			img: "assets/cards/0S.png",
			id: 36,
		},
		{
			name: "JC",
			img: "assets/cards/JC.png",
			id: 37,
		},
		{
			name: "JD",
			img: "assets/cards/JD.png",
			id: 38,
		},
		{
			name: "JH",
			img: "assets/cards/JH.png",
			id: 39,
		},
		{
			name: "JS",
			img: "assets/cards/JS.png",
			id: 40,
		},
		{
			name: "QC",
			img: "assets/cards/QC.png",
			id: 41,
		},
		{
			name: "QD",
			img: "assets/cards/QD.png",
			id: 42,
		},
		{
			name: "QH",
			img: "assets/cards/QH.png",
			id: 43,
		},
		{
			name: "QS",
			img: "assets/cards/QS.png",
			id: 44,
		},
		{
			name: "KC",
			img: "assets/cards/KC.png",
			id: 45,
		},
		{
			name: "KD",
			img: "assets/cards/KD.png",
			id: 46,
		},
		{
			name: "KH",
			img: "assets/cards/KH.png",
			id: 47,
		},
		{
			name: "KS",
			img: "assets/cards/KS.png",
			id: 48,
		},
		{
			name: "AC",
			img: "assets/cards/AC.png",
			id: 49,
		},
		{
			name: "AD",
			img: "assets/cards/AD.png",
			id: 50,
		},
		{
			name: "AH",
			img: "assets/cards/AH.png",
			id: 51,
		},
		{
			name: "AS",
			img: "assets/cards/AS.png",
			id: 52,
		}
	];
  
	MemoryGame.init(cards);
})();