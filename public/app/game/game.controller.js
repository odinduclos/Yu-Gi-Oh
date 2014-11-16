function GameController ($scope) {

	var socket = io.connect();
	var game = false;
	var server_logs = [];
	socket.on('server_log', function (data) {
		console.log(data);
		server_logs.push(data);
	});
	
	$scope.game_turn = {turn: 0, first_player: true};
	$scope.game_state = {monster_played: false, attacked: []};
	$scope.folder = "img/cards/";
	$scope.deck = [
		{_id: 1, star: 8, attack: 3000, def: 2500, state: 'visible', type: 'monster', name: "Dragon blanc", txt: "Dragon blanc!", img: "328px-BlueEyesWhiteDragon-LOB-EN-UR-UE.jpg"},
		{_id: 2, star: 7, attack: 2500, def: 2100, state: 'visible', type: 'monster', name: "Magicien noir", txt: "Magicien noir!", img: "329px-DarkMagician-LOB-EN-UR-UE.png"},
		{_id: 3, star: 8, attack: 2850, def: 2350, state: 'visible', type: 'monster', name: "Guardien celtic", txt: "Guardien celtic!", img: "CelticGuardianLOB-EN-SR-UE.jpg"},
		{_id: 4, star: 4, attack: 1400, def: 1200, state: 'visible', type: 'monster', name: "Dragon à corne", txt: "Dragon à cornes!", img: "TriHornedDragon-LOB-EN-ScR-UE.jpg"},
		{_id: 5, type: 'trap', state: 'hidden', name: "Trou", txt: "C'est un trou!", img: "TrapHole-LOB-EN-SR-UE.jpg"},
		{_id: 5, type: 'spell', state: 'hidden', name: "Epée", txt: "C'est une épée!", img: "326px-LegendarySwordLOB-EN-SP-UE.jpg"}
	];
	$scope.hand = [];
	$scope.monsters = [];
	$scope.traps = [];
	$scope.back = {_id: null, txt: "Sélectionnez une carte pour avoir sa description", img: "back.png"};
	$scope.focus = $scope.back;
	$scope.logs = [];
	$scope.card_selected = null;

	init();

	function init() {
		if ($scope.game_turn.first_player) {
			draw();
		}
	}

	function drawCard (source, destination) {
		// get server response
		var card = Math.round(Math.random() * (source.length - 1));
		destination.push(source[card]);
		$scope.logs.push("Draw: " + source[card].name);
		source.splice(card, 1);
		return card;
	}

	function playCard (source, destination, card, state) {
		card.state = state;
		destination.push(card);
		$scope.logs.push("Play: " + card.name + ' in ' + state);
		for (var i = 0; i < source.length; i++) {
			if (source[i] == card) {
				source.splice(i, 1);
				return;
			}
		};
	}

	$scope.describe = function (card) {
        $scope.focus = card;
    }

	function draw () {
		if ($scope.deck.length == 0) {
			$scope.logs.push("You have no more cards in your deck");
			return;
		}
		if ($scope.game_turn.turn == 0) {
			for (var i = 0; i < 3; i++) {
				var card = drawCard($scope.deck, $scope.hand);
			}
		} else {
			var card = drawCard($scope.deck, $scope.hand);
		}
	}

	$scope.play = function (state) {
		if ($scope.card_selected.from == 'hand') {
			if ($scope.card_selected.type == 'monster') {
				if ($scope.game_state.monster_played) {
					$scope.logs.push("You already have played a monster");
					return;
				}
				$scope.game_state.monster_played = true;
				playCard($scope.hand, $scope.monsters, $scope.card_selected, state);
			} else {
				playCard($scope.hand, $scope.traps, $scope.card_selected, state);
			}
		}
	}

	$scope.end = function () {
		// changer pour le multi
		/*if (!$scope.game_turn.first_player) {
			$scope.game_turn.turn++;
			$scope.game_turn.first_player = true;
		} else {
			$scope.game_turn.first_player = false;
		}*/

		// TEST
		$scope.game_turn.turn++;
		// TEST

		$scope.game_state.monster_played = false;
		$scope.game_state.attacked = [];
		draw();
		// mono test
		// $scope.end();
	}

	$scope.playSpell = function (card) {
		card.state = 'visible';
		// call the rigth function
	}

	$scope.select = function (from, card) {
		$scope.card_selected = card;
		$scope.card_selected.from = from;
	}
}


GameController.$inject = ['$scope'];
angular.module('app').controller('GameCtrl', GameController);