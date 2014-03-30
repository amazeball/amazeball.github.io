var load_state = {
    preload: function() {
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('ball', 'assets/ball_norm.png');
        this.game.load.image('ball_dead', 'assets/ball_dead.png');
        this.game.load.image('ball_impact', 'assets/ball_impact.png');
        this.game.load.image('cactus', 'assets/cactus.png');
        this.game.load.image('pipe', 'assets/pipe.png');
        this.game.load.image('cloud', 'assets/cloud.png');
        this.game.load.image('obstacle', 'assets/obstacle.png');
        this.game.load.audio('jump', 'assets/jump.wav');
        this.game.load.image('intro','assets/intro_color.png');
        this.game.load.image('outro','assets/outro_color.png');
        this.game.load.audio('hack1', ['assets/hack1.mp3', 'assets/hack1.ogg']);
        this.game.load.audio('hack2', ['assets/hack2.mp3', 'assets/hack2.ogg']);
        this.game.load.audio('lose', ['assets/hack-lose.mp3', 'assets/hack-lose.ogg']);
    },

    create: function() {
        // When all assets are loaded, go to the 'menu' state
        this.game.state.start('menu');
    }
};