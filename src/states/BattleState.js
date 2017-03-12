/**
 * Created by CharlieShi on 3/8/17.
 */
import Phaser from 'phaser'
import TiledState from './TiledState'
import BreadthFirstSearch from '../plugins/BreadthFirstSearch'
import MoveRegion from '../prefabs/MoveRegion'
import Pathfinding from '../plugins/Pathfinding'
import AttackRegion from '../prefabs/AttackRegion'
import PriorityQueue from '../PriorityQueue'

//import HighlightedRegion from '../prefabs/HighlightedRegion'
import createPrefabFromPool from '../utils'
import firebase from 'firebase'

export default class BattleState extends TiledState {
    constructor (game) {
        super(game);
    }

    preload () {
        this.load.text("class_data", "assets/class_data.json");
    }

    init (level_data, extra_parameters) {
        TiledState.prototype.init.call(this, level_data);


        this.battle_ref = firebase.database().ref("child/battles").child(extra_parameters.battle_id);
        this.local_player = extra_parameters.local_player;
        this.remote_player = extra_parameters.remote_player;



        //this.units = extra_parameters.units;
    }

    create () {
        //Use tiled state create to create map using level data
        super.create.call(this);
        let world_grid;

        //Add menu items to the menu
        this.groups.menu_items.forEach(function (menu_item) {
            this.prefabs.menu.add_item(menu_item);
        }, this);


        //Create tile dimension of points then add plugin into the game with the BFS object and the
        //map object it'll operate on
        //Gives us access to BFS operations through this.bfs......
        //Same for pathfinding
        this.tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
        this.bfs = this.game.plugins.add(BreadthFirstSearch, this.map);

        world_grid = this.create_world_grid();
        this.pathfinding = this.game.plugins.add(Pathfinding, world_grid, [-1], this.tile_dimensions);

        //Use classes data to generate units
        this.class_data = JSON.parse(this.game.cache.getText("class_data"));

        //Bind callback to firebase
        this.battle_ref.once("value", this.create_units_queue.bind(this));

        //Set current player
        this.current_player = "player1";
        this.current_turn = 1;


        this.battle_ref.onDisconnect().remove();

        this.game.stage.disableVisibilityChange = true;

        //this.game_over();
    }

    next_player_turn () {
        //Check if units are alive or game over
        //If not game over, set current_player to the opposite
        if (this.groups.player1_units.countLiving() === 0 || this.groups.player2_units.countLiving() === 0) {
            this.game_over();
        } else {
            this.clear_previous_turn();
            this.current_turn++;

            if (this.current_player === 'player1') {
                this.current_player = 'player2';

                //add units back to its queue
                //untint player2's units
                this.groups.player2_units.forEach(function (unit) {
                    unit.tint = 0xffffff;
                });

                this.battle_ref.once("value", this.create_units_queue.bind(this));
                //this.create_units_queue();
            } else {
                this.current_player = 'player1';

                this.groups.player1_units.forEach(function (unit) {
                    unit.tint = 0xffffff;
                });

                this.create_units_queue();
            }
        }
    }

    next_turn () {
        this.clear_previous_turn();
        //Set current unit to the one dequeed based on the current player passed
        //If player has no more units to deque, change to next player's turn
        console.log('length of p1', this.units_queue_p1.length);

        if (this.current_player === "player1") {
            if (this.units_queue_p1.length > 0)
                this.current_unit = this.units_queue_p1.dequeue();
            else
                this.next_player_turn();
        } else {
            if (this.units_queue_p2.length > 0)
                this.current_unit = this.units_queue_p2.dequeue();
            else
                this.next_player_turn();
        }

        //Only show if its alive, otherwise skip
        if (this.current_unit.alive) {
            this.current_unit.prefab.tint = (this.current_unit.prefab.name.search("player1") !== -1) ? 0x0000ff : 0xff0000;

            if (this.current_unit.player === this.local_player) {
                this.prefabs.menu.show(true);
            }
        } else {
            this.next_turn();
        }
    }

    clear_previous_turn () {
        //Clears any highlighted regions

        this.groups.move_regions.forEach(function (region) {
            region.kill();
        }, this);

        this.groups.attack_regions.forEach(function (region) {
            region.kill();
        }, this);
    };

    create_world_grid () {
        let obstacles_layer, row_index, column_index, world_grid;

        obstacles_layer = this.map.layers[1];

        world_grid = [];
        for (row_index = 0; row_index < this.map.height; row_index += 1) {
            world_grid.push([]);
            for (column_index = 0; column_index < this.map.width; column_index += 1) {
                world_grid[row_index].push(obstacles_layer.data[row_index][column_index].index);
            }
        }

        return world_grid;
    }

    create_units_queue (snapshot) {
        let battle_data;
        battle_data = snapshot.val();

        //Create new queue if not avaliable
        if (!this.units_queue_p1)
            this.units_queue_p1 = new PriorityQueue();
        if (!this.units_queue_p2)
            this.units_queue_p2 = new PriorityQueue();

        if (this.current_player === 'player1' || this.current_turn === 1)
            this.queue_player_units(battle_data, "player1");
        if (this.current_player === 'player2' || this.current_turn === 1)
            this.queue_player_units(battle_data, "player2");

        this.battle_ref.child("command").on("value", this.receive_command.bind(this));

        this.next_turn();
    }

    queue_player_units (battle_data, player) {
        let unit_key, unit_data, unit_prefab;

        //console.log('create units q', battle_data[player].units);

        for (unit_key in battle_data[player].units) {
            //console.log("unit key", unit_key)

            if (battle_data[player].units.hasOwnProperty(unit_key)) {
                unit_data = battle_data[player].units[unit_key];

                unit_prefab = this.create_prefab(unit_data.name, unit_data, unit_data.position);
                unit_prefab.load_stats(this.class_data);

                //Add units to each player's queue
                if (player === "player1") {
                    this.units_queue_p1.queue({player: player, prefab: unit_prefab});
                }

                if (player === "player2") {
                    this.units_queue_p2.queue({player: player, prefab: unit_prefab});
                }
            }
        }
    }

    highlight_region (source, radius, region_pool, region_constructor) {
        let positions, region_name, highlighted_regions;

        positions = this.bfs.find_reachable_area(source, radius);

        positions.forEach(function (position) {
            region_name = "region_" + this.groups[region_pool].countLiving();

            highlighted_regions = createPrefabFromPool(this.groups[region_pool],
                                                              region_constructor, this,
                                                              region_name,
                                                              position, {texture: "highlighted_region_image", group: region_pool})
        }, this)
    }

    //Unit Actions
    receive_command (snapshot) {
        let command;
        command = snapshot.val();

        if (command) {
            switch (command.type) {
                case "move":
                    this.move_unit(command.target);
                    break;
                case "attack":
                    break;
                case "wait":
                    break;
            }
        }
    }

    move () {
        this.highlight_region(this.current_unit.position,
                              this.current_unit.stats.walking_radius,
                              "move_regions",
                              MoveRegion.prototype.constructor)
    }

    send_move_command (target_position) {
        this.battle_ref.child("command").set({type: "move", target: {x: target_position.x, y: target_position.y}});
    }

    move_unit (target) {
        this.current_unit.prefab.move_to(target);
        this.next_turn();
    }

    attack () {
        this.highlight_region(this.current_unit.position,
                              this.current_unit.stats.attack_range,
                              "attack_regions",
                              AttackRegion.prototype.constructor)
    }

    wait () {
        this.next_turn();
    }

    // game_over () {
    //     let winner, winner_message;
    //     winner = (this.groups.player1_units.countLiving() === 0) ? "player 2" : "player 1";
    //
    //     winner_message = this.game.add.text(this.game.world.centerX, this.game.world.centerY, winner + " wins", {font: "24px Arial", fill: "#FFF"});
    //     winner_message.anchor.setTo(0.5);
    //
    //     this.game.input.onDown.add(function () {
    //         this.game.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");
    //     }, this);
    // }
}


