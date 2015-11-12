
var game = new Phaser.Game(500, 750, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player, keyboard, background, platforms, platform1, platform2, stars, meteors, scoreText, highScore, highScoreText, emitter, gameOverText;

var playerScore = 0;
var highScore = 0;



function preload() {

    game.load.image('space', './assets/bg.jpg');
    game.load.image('ship', './assets/playerShip1_red.png');
    game.load.image('platform', './assets/Parts/platform.png');
    game.load.image('star', './assets/Power-ups/powerupGreen_star.png');
    game.load.image('meteorMed', './assets/Meteors/meteorBrown_small1.png');
    game.load.image('meteorGrey', './assets/Meteors/meteorGrey_small1.png');

    // game.load.image('fire1', 'assets/fire1.png');
    // game.load.image('fire2', 'assets/fire2.png');
    // game.load.image('fire3', 'assets/fire3.png');

    game.load.audio('boden', ['./assets/8bit.mp3', 'assets/8bit.ogg']);

	fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	fireButton.onDown.add(changeDirection, this);
}

function create() {

	//  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	// game.scale.setScreenSize();

	// // Scaling
	// Phaser.StageScaleMode.EXACT_FIT = 0;
	// Phaser.StageScaleMode.NO_SCALE = 1;
	// Phaser.StageScaleMode.SHOW_ALL = 2;
	background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'space');

	// Physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// Music
	music = game.add.audio('boden');
    music.play();
    
    // Platforms
    platforms = game.add.group();
    platforms.enableBody = true;
    platform1 = platforms.create(game.world.width / 2 - 85, 60, 'platform');
    platform1.flipX = true;
    platform1.body.immovable = true;
    platform1.anchor.setTo(0, 0);
	platform1.scale.y *= -1;
    platform2 = platforms.create(game.world.width / 2 - 85, game.world.height - 60, 'platform');
    platform2.body.immovable = true;

    // Meteors
    meteors = game.add.group();
    meteors.enableBody = true;
    game.physics.arcade.enable(meteors);

    // Player
    player = game.add.sprite(game.world.width / 2 - 12, game.world.height - 130, 'ship');
    player.scale.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0, 0.5);

    // Particles
	// emitter = game.add.emitter(game.world.centerX, game.world.centerY, 400);
 //    emitter.makeParticles( [ 'fire1', 'fire2', 'fire3'] );
 //    emitter.setAlpha(1, 0, 400);
 //    emitter.setScale(0.8, 0, 0.8, 0, 400);
 //    emitter.start(false, 400, 5);

    // Star
    stars = game.add.group();
    stars.create(game.world.width / 2 - 5, 60, 'star').topStar = true;
    stars.enableBody = true;
    game.physics.arcade.enable(stars);

    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#FFF' });
	highScoreText = game.add.text(68 * (game.world.width / 100), 16, 'Highscore: ' + highScore, { fontSize: '24px', fill: '#FFF' });


}


var playerSpeed = -275;

function createMeteor() {
	var meteor;

	if (Math.round(Math.random()) === 1) {
		meteor = meteors.create(0 - 50, game.rnd.integerInRange(150, game.world.height - 130), 'meteorGrey');
		meteor.body.velocity.x = game.rnd.integerInRange(10, 300);
	} else {
		meteor = meteors.create(game.world.width + 50, game.rnd.integerInRange(100, game.world.height - 150), 'meteorMed');
		meteor.body.velocity.x = game.rnd.integerInRange(10, 300) * -1;
	}

	meteor.rotationSpeed = Math.round(Math.random() * 10);
	// player.scale.setTo(.5, .5);

	meteor.pivot.x = meteor.width * .5;
	meteor.pivot.y = meteor.height * .5;
	
	if(Math.round(Math.random()) === 1) {
		meteor.rotationSpeed *= -1;
	}
}


setInterval(function() {
	createMeteor();
}, 2400);

function update() {
	if (!player.body.velocity.y) player.body.velocity.y = playerSpeed;

	//  Scroll the background
    background.tilePosition.y += 0.2;

	meteors.forEach(function(meteor) {
		meteor.angle -= meteor.rotationSpeed;
	});

	// emitter.emitX = player.x;
 //    emitter.emitY = player.y;


	// Chech if player and platform are touching. If so change direction
	game.physics.arcade.overlap(player, platforms, changeDirection, null, this);
	game.physics.arcade.overlap(player, stars, collideWithStar, null, this);
	game.physics.arcade.overlap(player, meteors, collideWithMeteor, null, this);
}

function changeDirection() {
	player.scale.y *= -1;
	player.body.velocity.y = player.body.velocity.y * -1;
}

// I don't like this but no time
// window.addEventListener('keyup', function(e) {
// 	if (e.keyCode === 0 || e.keyCode === 32) {
// 		changeDirection(player);
// 	}
// });
// 


function collideWithStar(player, star) {
	// Create the star on the other side
	if (star.topStar) {
		star.kill();
	    stars.create(game.world.width / 2 - 5, game.world.height - 100, 'star');
	} else {
		star.kill()
		stars.create(game.world.width / 2 - 5, 60, 'star').topStar = true;
	}

	playerScore++;
	scoreText.text = 'Score: ' + playerScore;
}

function collideWithMeteor() {
	player.kill();
	music.destroy();

	restart();
}

function restart() {
	playerScore > highScore ? highScore = playerScore : highScore = highScore;
	playerScore = 0;
	scoreText.text = 'Score: ' + playerScore;
	highScoreText.text = 'Highscore: ' + highScore;
	// gameOverText = game.add.text(game.world.width / 4 - 16, game.world.height / 2 - 24, 'GAME OVER', { fontSize: '48px', fill: '#FFF' });
	// setTimeout(function() {
	// 	gameOverText.text = '';
	// }, 250);

	create();
}

