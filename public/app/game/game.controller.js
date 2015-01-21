'use_strict';

function GameController ($scope) {

	// fonctions sockets (répercute les actions de l'opposant)
	var socket = io.connect();

	function init_vars() {
		// indique le début de la partie
		$scope.game = false;
		// tableaux des logs
		$scope.logs = ['Waiting for the other player'];
		// recap de la partie. +1 turn à chaque fois qu'un player joue
		$scope.game_turn = {turn: 0, my_turn: true};
		// limiteur de jeu: monstres joués
		$scope.game_state = {monster_played: false};
		// folder des cartes
		$scope.folder = "img/cards/";
		// simulation de BDD
		$scope.deck = [
			{_id: 1, stars: 8, attack: 3000, def: 2500, attack_tmp: 3000, def_tmp: 2500, state: 'visible', position: 'attack', attacked: false, type: 'monster', name: "Dragon blanc", txt: "Dragon blanc!", img: "328px-BlueEyesWhiteDragon-LOB-EN-UR-UE.jpg"},
			{_id: 2, stars: 7, attack: 2500, def: 2100, attack_tmp: 2500, def_tmp: 2100, state: 'visible', position: 'attack', attacked: false, type: 'monster', name: "Magicien noir", txt: "Magicien noir!", img: "329px-DarkMagician-LOB-EN-UR-UE.png"},
			{_id: 3, stars: 4, attack: 1400, def: 1200, attack_tmp: 1400, def_tmp: 1200, state: 'visible', position: 'attack', attacked: false, type: 'monster', name: "Guardien celtic", txt: "Guardien celtic!", img: "CelticGuardianLOB-EN-SR-UE.jpg"},
			{_id: 4, stars: 4, attack: 1400, def: 1200, attack_tmp: 1400, def_tmp: 1200, state: 'visible', position: 'attack', attacked: false, type: 'monster', name: "Guardien celtic", txt: "Guardien celtic!", img: "CelticGuardianLOB-EN-SR-UE.jpg"},
			{_id: 5, stars: 4, attack: 1400, def: 1200, attack_tmp: 1400, def_tmp: 1200, state: 'visible', position: 'attack', attacked: false, type: 'monster', name: "Guardien celtic", txt: "Guardien celtic!", img: "CelticGuardianLOB-EN-SR-UE.jpg"},
			{_id: 6, stars: 4, attack: 1400, def: 1200, attack_tmp: 1400, def_tmp: 1200, state: 'visible', position: 'attack', attacked: false, type: 'monster', name: "Guardien celtic", txt: "Guardien celtic!", img: "CelticGuardianLOB-EN-SR-UE.jpg"},
			{_id: 7, stars: 8, attack: 2850, def: 2350, attack_tmp: 2850, def_tmp: 2350, state: 'visible', position: 'attack', attacked: false, type: 'monster', name: "", txt: "Dragon à cornes!", img: "TriHornedDragon-LOB-EN-ScR-UE.jpg"},
			{_id: 8, type: 'trap', state: 'hidden', name: "Trou", txt: "C'est un trou!", img: "TrapHole-LOB-EN-SR-UE.jpg", effect: ""},
			{_id: 9, type: 'spell', state: 'hidden', name: "Epée", txt: "C'est une épée!", img: "326px-LegendarySwordLOB-EN-SP-UE.jpg", effect: "destroyAllMonsters"}
		];
		// main du joueur
		$scope.hand = [];
		$scope.hand.target = 'enemy_hand';
		// main de son opposant
		$scope.enemy_hand = [];
		$scope.enemy_hand.target = 'hand';
		// board de monstres
		$scope.monsters = [];
		$scope.monsters.target = 'enemy_monsters';
		// board de monstres ennemi
		$scope.enemy_monsters = [];
		$scope.enemy_monsters.target = 'monsters';
		// board de traps et de spells
		$scope.traps = [];
		$scope.traps.target = 'enemy_traps';
		// board de traps et de spells ennemi
		$scope.enemy_traps = [];
		$scope.enemy_traps.target = 'traps';
		// cimetière
		$scope.graveyard = [];
		$scope.graveyard.target = 'enemy_graveyard';
		// cimetière de l'ennemi
		$scope.enemy_graveyard = [];
		$scope.enemy_graveyard.target = 'graveyard';
		// carte par défaut ou dos de carte
		$scope.back = {_id: null, txt: "Sélectionnez une carte pour avoir sa description", img: "back.png"};
		// image apparaissant dans l'encadré de description
		$scope.focus = $scope.back;
		// image courante du joueur
		$scope.card_selected = null;
		$scope.pv = 3000;
		$scope.name = 'Dino';
		$scope.enemy_pv = 3000;
		$scope.enemy_name = 'Julien';
		// texte apparaissant dans l'encadré de tips
		$scope.tip = 'Your turn';
		// valeur du bouton de changement de position d'une carte
		$scope.switch_value = 'switch';
		// action courante
		$scope.action = false;
		// nombre de target restantes
		$scope.targets = 0;

		// choix d'une target
		$scope.target_choice = false;
		$scope.targets_choice = [];
		$scope.validate_target = false;

		$scope.target_choice = $scope.deck[0];
		$scope.targets_choice = $scope.deck;

		$scope.attack_button = false;
		$scope.switch_button = false;
		$scope.visible_button = false;
		$scope.play_visible_button = false;
		$scope.play_defense_button = false;
		$scope.play_hidden_button = false;
		console.log("init vars");
	}

	init_vars();

	// notifié que la partie commence
	socket.on('startGame', function (data) {
		$scope.$apply(function () {
			$scope.tip = 'The game begin!';
			$scope.logs.push('The game begin!');
			$scope.game_turn.my_turn = data.your_turn;
			$scope.game = true;
			if ($scope.game_turn.my_turn)
				init();
		});
	});

	// notifié que la partie finit
	socket.on('endGame', function (data) {
		$scope.$apply(function () {
			if (data.error != 0) {
				$scope.logs.push(data.message);
			}
			$scope.game = false;
			$scope.tip = 'The game end!';
			$scope.logs.push('The game end!');
			init_vars();
		});
	});

	// notifié que l'opposant à pioché
	socket.on('draw', function (data) {
		$scope.logs.push('Ennemy draw.');
		$scope.$apply(function () {
			$scope.enemy_hand.push(data);
		});
	});

	// notifié que l'opposant à bougé une carte d'une stack à une autre
	socket.on('play', function (data) {
		$scope.$apply(function () {
			playCard(eval("$scope." + data.source), eval("$scope." + data.destination), data.card, data.state, false);
		});
	});

	// notifié que l'opposant à finit son tour
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

	// initialisation du jeu et pioche
	function init() {
		if ($scope.game_turn.my_turn) {
			draw();
		}
	}

	// pioche
	function drawCard (source, destination) {
		var card = Math.round(Math.random() * (source.length - 1));
		$scope.tip = "Draw: " + source[card].name + '.';
		$scope.logs.push("Draw: " + source[card].name + '.');
		destination.push(source[card]);
		socket.emit('draw', {error: 0, card: card});
		source.splice(card, 1);
		return card;
	}

	// bouge une carte d'une stack à une autre
	function playCard (source, destination, card, state, emit) {
		if (emit)
			socket.emit('play', {error: 0, source: source.target, destination: destination.target, card: card, state: state});
		check_for_traps();
		card.state = state;
		if (state == 'hidden') {
			card.position = 'defense';
		}
		destination.push(card);
		for (var i = 0; i < source.length; i++) {
			// /!\ Point critique: la comparaison par instance ne fonctionne pas. Penser à mettre un id unique à chaque carte.
			if (source[i]._id === card._id) {
				$scope.tip = "Play: " + card.name + ' in ' + state + '.';
				$scope.logs.push("Play: " + card.name + ' in ' + state + '.');
				if (source[i]._id === $scope.card_selected._id) {
					$scope.card_selected = false;
					hide_buttons();
				}
				source.splice(i, 1);
				return;
			}
		};
	}

	// affiche la carte survolée dans l'encadré de description
	$scope.describe = function (card) {
        $scope.focus = card;
    }

    // affiche la carte survolée ennemie dans l'encadré de description
    $scope.describe_enemy = function (card) {
    	if (card.state != 'hidden')
        	$scope.focus = card;
        else $scope.focus = $scope.back;
    }

    // compte le nombre de draws dispo
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

	// le joueur joue une carte
	$scope.play = function (state) {
		if ($scope.card_selected.from == 'hand') {
			if ($scope.card_selected.type == 'monster') {
				if ($scope.game_state.monster_played) {
					$scope.tip = "You already have played a monster.";
					$scope.logs.push("You already have played a monster.");
					return;
				}
				if ($scope.card_selected.stars >= 5) {
					$scope.card_selected.state = state;
					$scope.targets = 1;
					if ($scope.card_selected.stars >= 7)
						$scope.targets++;
					$scope.tip = "Select " + $scope.targets + " monster to sacrifice.";
					$scope.logs.push("Select " + $scope.targets + " monster to sacrifice.");
					$scope.action = 'sacrifice';
					return;
				}
				$scope.game_state.monster_played = true;
				playCard($scope.hand, $scope.monsters, $scope.card_selected, state, true);
			} else if ($scope.card_selected.type == 'trap' || $scope.card_selected.type == 'spell') {
				playSpell($scope.card_selected);
				playCard($scope.hand, $scope.traps, $scope.card_selected, state, true);
			}
		}
	}

	// finit le tour du joueur
	$scope.end = function () {
		$scope.tip = "It is not your turn.";
		$scope.logs.push("Ennemy's turn.");
		socket.emit('end_turn', {error: 0});
		$scope.game_turn.turn++;
		$scope.game_turn.my_turn = false;
		for (var i = 0; i < $scope.monsters.length; i++) {
			$scope.monsters[i].attacked = false;
		};
		hide_buttons();
	}

	// le joueur joue un sort
	function playSpell (card) {
		// call the rigth function
		// si tu veux transférer une carte d'une pile à une autre, utilise la fonction playCard
		// seules les valeurs de attack_tmp et def_tmp doivent être modifiées
		card.state = 'visible';
		eval(card.effect + "()");
	}

	// change l'état du bouton de changement de position de la carte
	function change_switch_value (card) {
		if ($scope.card_selected.position == 'attack') {
			$scope.switch_value = 'Defense';
		} else if ($scope.card_selected.position == 'defense') {
			$scope.switch_value = 'Attack';
		} else {
			$scope.switch_value = 'Switch';
		}
	}

	function show_buttons(card) {
		if ($scope.game_turn.my_turn && $scope.card_selected && !$scope.action) {
			if ($scope.card_selected.from == 'board') {
				if ($scope.game_turn.turn != 0 && $scope.card_selected.type == 'monster' && !$scope.card_selected.attacked) {
					$scope.attack_button = true;
				}
				if ($scope.card_selected.state != 'hidden') {
					$scope.switch_button = true;
				}
				if ($scope.card_selected.state == 'hidden') {
					$scope.visible_button = true;
				}
			}
			if ($scope.card_selected.from == 'hand' && (!$scope.game_state.monster_played || $scope.card_selected.type != 'monster')) {
				$scope.play_hidden_button = true;
				$scope.play_visible_button = true;
				if ($scope.card_selected.type == 'monster') {
					$scope.play_defense_button = true;
				}
			}
		}
		if ($scope.target_choice) {
			$scope.validate_target = true;
		}
	}

	function check_for_traps() {
		// verifie les traps ciblant les cartes ennemies
		for (var i = 0; i < traps.length; i++) {
			if (traps[i].type == 'trap') {
				eval(traps[i].effect + "()");
			}
		};
	}

	function hide_buttons(end) {
		$scope.attack_button = false;
		$scope.switch_button = false;
		$scope.visible_button = false;
		$scope.play_visible_button = false;
		$scope.play_defense_button = false;
		$scope.play_hidden_button = false;
		$scope.validate_target = false;
	}

	// selectionne une carte
	$scope.select = function (card, from) {
		$scope.action = false;
		$scope.card_selected = card;
		$scope.card_selected.from = from;
		change_switch_value($scope.card_selected);
		show_buttons(card);
	}

	// la carte selectionnée attaque
	$scope.attack = function () {
		if ($scope.card_selected.position != 'attack') {
			$scope.tip = 'In order to attack, your monster should be in attack position.';
			$scope.logs.push('In order to attack, your monster should be in attack position.');
			return;
		}
		if ($scope.enemy_monsters.length == 0) {
			$scope.tip = $scope.card_selected.name + " attack directly your opponent for " + $scope.card_selected.attack_tmp + " damages.";
			$scope.logs.push($scope.card_selected.name + " attack directly your opponent for " + $scope.card_selected.attack_tmp + " damages.");
			$scope.enemy_pv -= $scope.card_selected.attack_tmp;
		} else {
			$scope.tip = "Select a target.";
			$scope.logs.push("Select a target.");
			$scope.action = 'attack';
		}
	}

	// la carte selectionnée change de position
	$scope.switch_position = function (card) {
		check_for_traps();
		if (card.attacked) {
			$scope.tip = 'Your monster can not switch after attacking.';
			$scope.logs.push('Your monster can not switch after attacking.');
			return;
		}
		if (card.position == 'attack') {
			card.position = 'defense';
		} else if (card.position == 'defense') {
			card.position = 'attack';
		}
		change_switch_value(card);
	}

	$scope.switch_state = function (card) {
		if (card.state == 'visible') {
			card.state == 'hidden';
		} else {
			card.state == 'visible';
		}
	}

	// applique les effets du combat aux cartes
	function apply_fight (card, def) {
		$scope.card_selected.attacked = true;
		if ($scope.card_selected.attack_tmp > def) {
			$scope.tip = $scope.card_selected.name + " destroy " + card.name + " and inflict " + ($scope.card_selected.attack_tmp - def) + " damages to your opponent.";
			$scope.logs.push($scope.card_selected.name + " destroy " + card.name + " and inflict " + ($scope.card_selected.attack_tmp - def) + " damages to your opponent.");
			playCard($scope.enemy_monsters, $scope.enemy_graveyard, card, 'hidden', true);
			$scope.enemy_pv -= $scope.card_selected.attack_tmp - def;
		} else if ($scope.card_selected.attack_tmp == def) {
			$scope.tip = $scope.card_selected.name + " and " + card.name + " both destroyed.";
			$scope.logs.push($scope.card_selected.name + " and " + card.name + " both destroyed.");
			playCard($scope.enemy_monsters, $scope.enemy_graveyard, card, 'hidden', true);
			playCard($scope.monsters, $scope.graveyard, $scope.card_selected, 'hidden', true);
		} else if ($scope.card_selected.attack_tmp < def) {
			$scope.tip = card.name + " destroy " + $scope.card_selected.name + " and inflict " + (def - $scope.card_selected.attack_tmp) + " damages to you.";
			$scope.logs.push(card.name + " destroy " + $scope.card_selected.name + " and inflict " + (def - $scope.card_selected.attack_tmp) + " damages to you.");
			playCard($scope.monsters, $scope.graveyard, $scope.card_selected, 'hidden', true);
			$scope.enemy_pv -= def - $scope.card_selected.attack_tmp;
		}
	}

	// choix de l'action à faire en fonction de l'état de la variable action lor du click sur une carte
	$scope.choice_action = function (card, from, stack) {
		if (!$scope.action) {
			$scope.select(card, from);
		} else {
			$scope.target(card, stack);
		}
	}

	// le joueur selectionne une cible pour son monstre
	$scope.target = function (card, from) {
		check_for_traps();
		if ($scope.action == 'attack' && from == 'enemy_monsters') {
			if (card.position == 'attack') {
				apply_fight(card, card.attack_tmp);
			} else {
				apply_fight(card, card.def_tmp);
			}
			$scope.action = false;
			return;
		}
		if ($scope.action == 'sacrifice' && from == 'monsters') {
			playCard($scope.monsters, $scope.graveyard, card, 'hidden', true);
			$scope.targets--;
			if ($scope.targets == 0) {
				playCard($scope.hand, $scope.monsters, $scope.card_selected, $scope.card_selected.state, true);
				$scope.action = false;
				return;
			}
			$scope.tip = "Select " + $scope.targets + " monster to sacrifice.";
			$scope.logs.push("Select " + $scope.targets + " monster to sacrifice.");
		}
	}

	$scope.next_target = function (card) {
		for (var i = 0; i < $scope.targets_choice.length; i++) {
			if ($scope.targets_choice[i]._id == card._id && i < $scope.targets_choice.length - 1) {
				$scope.target_choice = $scope.targets_choice[++i];
				return;
			}
		};
	}

	$scope.previous_target = function (card) {
		for (var i = $scope.targets_choice.length - 1; i >= 0; i--) {
			if ($scope.targets_choice[i]._id == card._id && i > 0) {
				$scope.target_choice = $scope.targets_choice[--i];
				return;
			}
		};
	}

	$scope.validate = function () {
		check_for_traps();

		// ici pour la validation de la carte target_choice

		$scope.target_choice = false;
		$scope.targets_choice = [];
		$scope.validate_target = false;
	}

	function getFirstVisibleEnemyMonster() {
		for (var i = 0; i < $scope.enemy_monsters.length; i++) {
			if ($scope.enemy_monsters[i].state == 'visible') {
				return $scope.enemy_monsters[i];
			}
		}
	}

	function doFissure() {
		var weakestMonster = getFirstVisibleEnemyMonster();
		for (var i = 0; i < $scope.enemy_monsters.length; i++) {
			if (weakestMonster.attack > $scope.enemy_monsters[i].attack &&
				$scope.enemy_monsters[i].state == 'visible') {
				weakestMonster = $scope.enemy_monsters[i];
			}
		}
		playCard($scope.enemy_monsters, $scope.enemy_graveyard, weakestMonster, 'hidden', true);
	}

	function destroyMonsters(monster, index, monsterBoard) {
		playCard(monsterBoard, $scope.enemy_graveyard, monster, 'hidden', true);
	}

	function destroyAllMonsters() {
		$scope.enemy_monsters.forEach(destroyMonsters);
		$scope.monsters.forEach(destroyMonsters);
	}

	function destroyActiveTrap() {
		var found = false;
		for (var i = 0; !found && i < $scope.enemy_traps.length; i++) {
			if ($scope.enemy_traps[i].state == 'visible') {
				found = true;
				playCard($scope.enemy_traps, $scope.enemy_graveyard, $scope.enemy_traps[i], 'hidden', true);
			}
		}
	}
}


GameController.$inject = ['$scope'];
angular.module('app').controller('GameCtrl', GameController);
