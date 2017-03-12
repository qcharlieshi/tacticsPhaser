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

export default class BattleState extends TiledState {
    constructor(game) {
        super(game);
    }

    create() {
        super.create.call(this);
        let world_grid;

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

        this.units_queue = new PriorityQueue({comparator: function (unit_a, unit_b) {
            return unit_a.act_turn - unit_b.act_turn;
        }});

        this.groups.units.forEach(function (unit) {
            this.units_queue.queue(unit);
        }, this);

        console.log(this.units_queue);

        this.current_unit = this.prefabs.unit0; //todo: remove
    }

    next_turn () {
        this.clear_previous_turn();
        //Set current unit to the one dequeed
        this.current_unit = this.units_queue.dequeue();

        //Only show if its alive, otherwise skip
        if (this.current_unit.alive) {
            this.current_unit.tint = 0x0000ff;
            this.units_queue.queue(this.current_unit);
            this.prefabs.menu.show(true);
        } else {
            this.next_turn();
        }
    }

    clear_previous_turn () {
        if (this.current_unit) {
            this.current_unit.tint = 0xffffff;
        }

        this.groups.move_regions.forEach(function (region) {
            region.kill();
        }, this);

        this.groups.attack_regions.forEach(function (region) {
            region.kill();
        }, this);


    }

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

    move () {
        this.highlight_region(this.current_unit.position,
                              this.current_unit.stats.walking_radius,
                              "move_regions",
                              MoveRegion.prototype.constructor)
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
}


