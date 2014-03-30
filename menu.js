var menu_state = {
    create: function() {
        //alert("MENU");
        // Call the 'start' function when pressing the spacebar
        //var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //space_key.onDown.add(this.start, this);

        game.input.onDown.add(this.start, this);
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.start, this);

        // Defining variables
        var style = { font: "30px Arial", fill: "#ffffff" };
        var x = game.world.width/2, y = game.world.height/2;

        this.intro = this.game.add.sprite(100,75,'intro');
        //this.intro.visible = true;

        // Adding a text centered on the screen
        //var text = this.game.add.text(x, y-50, "Click or press space to start", style);
        //text.anchor.setTo(0.5, 0.5);

        // If the user already played
        if (score > 0) {
            // Display its score
            var score_label = this.game.add.text(x, y+50, "score: " + score, style);
            score_label.anchor.setTo(0.5, 0.5);
        }
    },

    // Start the actual game
    start: function() {
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.remove(this.start, this);
        this.game.state.start('play');
        // TODO need to stop the game over sound somehow
        //this.game.state.lose_sound.stop();
        //alert("MENU START");
    }
};