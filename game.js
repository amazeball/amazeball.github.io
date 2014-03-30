// Our 'score' global variable

var sign_gravity_init = 1;
var amp_gravity_init = 1000;
var boost_init = 1250;
var best_score = 0;
var bounce_game = true;

var score = -1;
var amp_gravity = amp_gravity_init;
var min_gravity = 500;
var max_gravity = 1000;
var inc_gravity = 0;
var decay_gravity = 0;
var bounce = .50; //should show up on gh-pages branch
var row_prob = .9;
var x_size = 800;
var y_size = 600
var boost = boost_init;
var x_slow_velocity = 400;
var x_velocity = x_slow_velocity;
var x_increment = 1;
var x_decrement = 100;
var last_pipe_state = -1;
var curr_pipe_state = -1;
var change_state_prob = 0.35;
var sign_gravity = sign_gravity_init;

// Initialize Phaser
var game = new Phaser.Game(x_size, y_size, Phaser.AUTO, 'game_div');

// Define all the states
game.state.add('load', load_state);
game.state.add('menu', menu_state);
game.state.add('play', play_state);

// Start with the 'load' state
game.state.start('load');
