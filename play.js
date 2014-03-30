var play_state = {

    // No more preload, since it is already done in the 'load' state
    create: function() {
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);

        game.input.onDown.add(this.jump, this);

        // AUDIO YEAH
        this.jump_sound = this.game.add.audio('jump');
        this.lose_sound = this.game.add.audio('lose');
        this.music1 = game.add.audio('hack1');
        this.music2 = game.add.audio('hack2');
        this.music1.play();
        this.music2.play();
        this.music2.mute = true;

        // CLOUDS TO THE RESCUE
        this.clouds = game.add.group();
        this.clouds.createMultiple(10, 'cloud');
        this.game.physics.enable(this.clouds, Phaser.Physics.ARCADE);
        this.cloud_timer  = this.game.time.events.loop(6000/(x_velocity/x_slow_velocity), this.add_cloud, this);

        this.obstacles = game.add.group();
        this.obstacles.createMultiple(5, 'obstacle');
        this.game.physics.enable(this.obstacles, Phaser.Physics.ARCADE);

        this.outro = this.game.add.sprite(100,75,'outro');
        this.outro.visible = false;

        /// EDIT LATER
        if (bounce_game) {
            //this.pipes = game.add.group();
            //this.pipes.createMultiple(50, 'pipe');
            //this.game.physics.enable(this.pipes, Phaser.Physics.ARCADE);
            this.obstacle_timer = this.game.time.events.loop(1500, this.add_obstacle_bounce, this);
        } else{
            //this.cacti = game.add.group();
            //this.cacti.createMultiple(20, 'cactus');
            //this.game.physics.enable(this.obstacles, Phaser.Physics.ARCADE);
            this.obstacle_timer = this.game.time.events.loop(1500/(x_velocity/x_slow_velocity), this.add_obstacle_fly, this);
        }

        this.bird = this.game.add.sprite(100, 245, 'ball');
        this.game.physics.enable(this.bird, Phaser.Physics.ARCADE);
        this.bird.anchor.setTo(0.5, 0.5);
        this.bird.body.gravity.y = amp_gravity;
        this.bird.body.bounce.y = bounce;
        this.bird.body.drag.y = 100;
        this.bird.body.collideWorldBounds = true;

        // Not 'this.score', but just 'score'
        score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };

        this.label_score = this.game.add.text(20, 20, "0", style);
        //this.label_info = this.game.add.text(x_size-100, 20, x_velocity, style);

        this.jump_sound = this.game.add.audio('jump');
    },

    update: function() {
        if (amp_gravity > min_gravity)
	    amp_gravity -= decay_gravity;
	// if the bird hits the pipes...

        if(bounce_game){
            this.game.physics.arcade.overlap(this.bird, this.obstacles, this.hit_obstacle, null, this);
        }else{
            this.game.physics.arcade.overlap(this.bird, this.obstacles, this.hit_obstacle, null, this);
            this.obstacles.forEachAlive(function(c){
                c.body.velocity.x = -1*x_velocity;
            }, this);
            if (this.bird.body.blocked.down || this.bird.body.blocked.up) {
            // TODO Pawels scoring when bouncing
            //score++;

                x_velocity = Math.max(x_velocity - x_decrement, x_slow_velocity);
            } else {
                x_velocity += x_increment;
            }

        }
        this.label_score.text = score;
        //this.label_info.text = x_velocity;
    },

    jump: function() {
        if (this.bird.alive == false)
            return;

        amp_gravity = (amp_gravity + inc_gravity > max_gravity ?
            max_gravity:amp_gravity + inc_gravity);

        if(!bounce_game){
            sign_gravity *= -1;
            this.jump_sound.play();
            this.music1.mute = !this.music1.mute;
            this.music2.mute = !this.music2.mute;

            // TODO fixed rotate the face
            this.game.add.tween(this.bird).to({angle: (-sign_gravity + 1) * 90}, 200).start();
        }

        this.bird.body.velocity.y += sign_gravity * boost;
        this.bird.body.gravity.y = amp_gravity * sign_gravity;

        //this.game.add.tween(this.bird).to({angle: -20}, 100).start();
        this.jump_sound.play();

    },

    hit_obstacle: function() {
        if (this.bird.alive == false)
            return;

        // TODO this is very hacky
        this.bird.alive = false;
        this.bird.visible = false;

        this.bird = this.game.add.sprite(this.bird.x, this.bird.y, 'ball_dead');
        this.bird.alive = false;

        this.game.physics.enable(this.bird, Phaser.Physics.ARCADE);
        this.bird.anchor.setTo(0.5, 0.5);
        this.bird.body.gravity.y = amp_gravity;
        this.bird.body.bounce.y = bounce;
        this.bird.body.drag.y = 100;
        this.bird.body.collideWorldBounds = true;
        this.bird.alive = false;
        this.game.add.tween(this.bird).to({angle: 90}, 200).start();

        // TODO wait a few frames before restarting
        this.game.time.events.remove(this.obstacle_timer);
        this.game.time.events.remove(this.cloud_timer);

        this.obstacles.forEachAlive(function(c){
            c.body.velocity.x = 0;
        }, this);

        this.restart_game();
        this.music1.stop();
        this.music2.stop();
        this.lose_sound.play();
    },

    restart_game: function() {
        this.game.time.events.remove(this.obstacle_timer);

        amp_gravity = amp_gravity_init;
        sign_gravity = sign_gravity_init;

        if(bounce_game){
            boost = boost_init;
        } else{
            boost = 300;
        }
        if (score > best_score)
            best_score = score;

        x_velocity = x_slow_velocity;

        //splash screen
        var style = { font: "50px Impact", fill: "#000000" };
        var x = game.world.width/2, y = game.world.height/2;

        var text = this.game.add.text(x-140, y, score, style);
        var best_text = this.game.add.text(x+140, y, best_score, style);
        text.anchor.setTo(0.5, 0.5);
        best_text.anchor.setTo(0.5, 0.5);
        this.outro.visible = true;

        // This time we go back to the 'menu' state
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.new_game, this);
    },
    new_game: function(){
        // alert("In new Game");
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.remove(this.new_game,this);
        this.outro.visible = false;
        this.game.state.start('play');
    },

    add_obstacle_bounce: function(){
        sign_gravity = -1 * curr_pipe_state;
        this.game.add.tween(this.bird).to({angle: (-1+sign_gravity)*90}, 200).start();
        this.bird.body.gravity.y = amp_gravity * sign_gravity;
        last_pipe_state = curr_pipe_state;

        var frac_screen = (Math.random()*0.1+0.2);
        var height;
        if(curr_pipe_state == 1){ //upper
            height = -1200 + frac_screen*y_size;
        }
        else{ //lower
            height = (1-frac_screen)*y_size;
        }
        this._add_obstacle_helper(height);

        // Not 'this.score', but just 'score'
        score += 1;
        this.label_score.content = score;

        curr_pipe_state = (Math.random() <= change_state_prob) ? (-1*last_pipe_state) : last_pipe_state;


    },

    add_obstacle_fly: function(){

        var obstacle_location = (Math.random() <= 0.5);
        var frac_screen = (Math.random()*0.4+0.15);
        var height;

        if (obstacle_location == 0) { //upper
            height = -1200 + frac_screen*y_size;
        } else{ //lower
            height = (1-frac_screen)*y_size;
        }
        this._add_obstacle_helper(height);
        score += 1;
        this.label_score.content = score;

        //if (Math.random() >= 1){
            // TODO this is broken
        //    var height = (Math.random()*0.5 - 0.2)*y_size;
        //    cactus.rotation = Math.pi;///0.6*Math.random() + 2.8;
        //} else {
        //    var height = (Math.random()*0.5 + 0.3)*y_size;
            //cactus.rotation = 0;//0.6*Math.random() - .3;
        //}
    },

    _add_obstacle_helper: function(height){
        var obstacle = this.obstacles.getFirstDead();
        obstacle.reset(x_size, height);
        obstacle.body.velocity.x = -x_velocity;
        obstacle.checkWorldBounds = true;
        obstacle.outOfBoundsKill = true;
    },

    add_cloud: function(){
        var cloud = this.clouds.getFirstDead();
        cloud.reset(x_size, y_size/(2));
        cloud.body.velocity.x = -x_velocity/4;
        cloud.checkWorldBounds = true;
        cloud.outOfBoundsKill = true;
    },

};