function GameController ($scope) {

	$scope.game = false;
	$scope.logs = ['Waiting for the other player'];
	$scope.game_turn = {turn: 0, my_turn: true};
	$scope.game_state = {monster_played: false, attacked: []};
	$scope.folder = "img/cards/";
	$scope.deck = [
		{_id: 1, star: 8, attack: 3000, def: 2500, state: 'visible', position: 'attack', type: 'monster', name: "Dragon blanc", txt: "Dragon blanc!", img: "328px-BlueEyesWhiteDragon-LOB-EN-UR-UE.jpg"},
		{_id: 2, star: 7, attack: 2500, def: 2100, state: 'visible', position: 'attack', type: 'monster', name: "Magicien noir", txt: "Magicien noir!", img: "329px-DarkMagician-LOB-EN-UR-UE.png"},
		{_id: 3, star: 8, attack: 2850, def: 2350, state: 'visible', position: 'attack', type: 'monster', name: "Guardien celtic", txt: "Guardien celtic!", img: "CelticGuardianLOB-EN-SR-UE.jpg"},
		{_id: 4, star: 4, attack: 1400, def: 1200, state: 'visible', position: 'attack', type: 'monster', name: "Dragon à corne", txt: "Dragon à cornes!", img: "TriHornedDragon-LOB-EN-ScR-UE.jpg"},
		{_id: 5, type: 'trap', state: 'hidden', name: "Trou", txt: "C'est un trou!", img: "TrapHole-LOB-EN-SR-UE.jpg"},
		{_id: 5, type: 'spell', state: 'hidden', name: "Epée", txt: "C'est une épée!", img: "326px-LegendarySwordLOB-EN-SP-UE.jpg"}
	];
	$scope.hand = [];
	$scope.enemy_hand = [];
	$scope.monsters = [];
	$scope.enemy_monsters = [];
	$scope.traps = [];
	$scope.enemy_traps = [];
	$scope.graveyard = [];
	$scope.enemy_graveyard = [];
	$scope.back = {_id: null, txt: "Sélectionnez une carte pour avoir sa description", img: "back.png"};
	$scope.focus = $scope.back;
	$scope.card_selected = null;
	$scope.pv = 3000;
	$scope.name = 'Dino';
	$scope.enemy_pv = 3000;
	$scope.enemy_name = 'Julien';
	$scope.tip = 'Your turn';
	$scope.switch_value = 'switch';
	$scope.action = '';

	var socket = io.connect();

	socket.on('startGame', function (data) {
		console.log(data);
		$scope.$apply(function () {
			$scope.tip = 'The game begin!';
			$scope.logs.push('The game begin!');
			$scope.game_turn.my_turn = data.your_turn;
			$scope.game = true;
			if ($scope.game_turn.my_turn)
				init();
		});
	});

	socket.on('endGame', function (data) {
		$scope.$apply(function () {
			if (data.error != 0) {
				console.log(data.message);
				$scope.logs.push(data.message);
			}
			$scope.game = false;
			$scope.tip = 'The game end!';
			$scope.logs.push('The game end!');
		});
	});

	socket.on('draw', function (data) {
		$scope.logs.push('Ennemy draw.');
		$scope.$apply(function () {
			$scope.enemy_hand.push(data);
		});
	});

	socket.on('play', function (data) {
		$scope.logs.push('Ennemy play a card.');
		$scope.$apply(function () {
			console.log(data);
			if (data.card.from == 'hand') {
				if (data.card.type == 'monster') {
					playCard($scope.enemy_hand, $scope.enemy_monsters, data.card, data.state);
				} else if (data.card.type == 'trap' || data.card.type == 'spell') {
					playCard($scope.enemy_hand, $scope.enemy_traps, data.card, data.state);
				}
			}
		});
	});

	socket.on('end_turn', function (data) {
		$scope.tip = 'Your turn!';
		$scope.logs.push('Your turn!');
		$scope.$apply(function () {
			$scope.game_state.monster_played = false;
			$scope.game_state.attacked = [];
			$scope.game_turn.my_turn = true;
			draw();
		});
	});

	function init() {
		if ($scope.game_turn.my_turn) {
			draw();
		}
	}

	function drawCard (source, destination) {
		var card = Math.round(Math.random() * (source.length - 1));
		$scope.tip = "Draw: " + source[card].name + '.';
		$scope.logs.push("Draw: " + source[card].name + '.');
		destination.push(source[card]);
		socket.emit('draw', {error: 0, card: card});
		source.splice(card, 1);
		return card;
	}

	function playCard (source, destination, card, state) {
		card.state = state;
		destination.push(card);
		for (var i = 0; i < source.length; i++) {
			if (source[i] == card) {
				source.splice(i, 1);
				socket.emit('play', {error: 0, card: card, state: state});
				$scope.tip = "Play: " + card.name + ' in ' + state + '.';
				$scope.logs.push("Play: " + card.name + ' in ' + state + '.');
				return;
			}
		};
	}

	$scope.describe = function (card) {
        $scope.focus = card;
    }

    $scope.describe_enemy = function (card) {
    	if (card.state != 'hidden')
        	$scope.focus = card;
        else $scope.focus = $scope.back;
    }

	function draw () {
		if ($scope.deck.length == 0) {
			$scope.tip = "You have no more cards in your deck.";
			$scope.logs.push("You have no more cards in your deck.");
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
					$scope.tip = "You already have played a monster.";
					$scope.logs.push("You already have played a monster.");
					return;
				}
				$scope.game_state.monster_played = true;
				playCard($scope.hand, $scope.monsters, $scope.card_selected, state);
			} else if ($scope.card_selected.type == 'trap' || $scope.card_selected.type == 'spell') {
				playCard($scope.hand, $scope.traps, $scope.card_selected, state);
			}
		}
	}

	$scope.end = function () {
		$scope.tip = "It is not your turn.";
		$scope.logs.push("Ennemy's turn.");
		socket.emit('end_turn', {error: 0});
		$scope.game_turn.turn++;
		$scope.game_turn.my_turn = false;
	}

	$scope.playSpell = function (card) {
		card.state = 'visible';
		// call the rigth function
	}

	function change_switch_value (card) {
		if ($scope.card_selected.position == 'attack') {
			$scope.switch_value = 'Defense';
		} else if ($scope.card_selected.position == 'defense') {
			$scope.switch_value = 'Attack';
		} else {
			$scope.switch_value = 'Switch';
		}
	}

	$scope.select = function (from, card) {
		$scope.card_selected = card;
		$scope.card_selected.from = from;
		change_switch_value($scope.card_selected);
	}

	$scope.attack = function () {
		if ($scope.enemy_monsters.length == 0) {
			$scope.tip = $scope.card_selected.name + " attack directly your opponent for " + $scope.card_selected.attack + " damages.";
			$scope.logs.push($scope.card_selected.name + " attack directly your opponent for " + $scope.card_selected.attack + " damages.");
			$scope.enemy_pv -= $scope.card_selected.attack;
		} else {
			$scope.tip = "Select a target.";
			$scope.logs.push("Select a target.");
			$scope.action = 'attack';
		}
	}

	$scope.switch_position = function () {
		if ($scope.card_selected.position == 'attack') {
			$scope.card_selected.position = 'defense';
		} else if ($scope.card_selected.position == 'defense') {
			$scope.card_selected.position = 'attack';
		}
		change_switch_value($scope.card_selected);
	}

	$scope.target = function (card) {
		if ($scope.action == 'attack') {
			if ($scope.card_selected.attack >= card.def) {
				$scope.tip = $scope.card_selected.name + " destroy " + card.name + " and inflict " + ($scope.card_selected.attack - card.defense) + " damages to your opponent.";
				$scope.logs.push($scope.card_selected.name + " destroy " + card.name + " and inflict " + ($scope.card_selected.attack - card.defense) + " damages to your opponent.");
				playCard($scope.enemy_monsters, $scope.enemy_graveyard, card, 'hidden');
			} else {

			}
		}
	}
}


GameController.$inject = ['$scope'];
angular.module('app').controller('GameCtrl', GameController);