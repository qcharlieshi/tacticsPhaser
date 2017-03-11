/**
 * Created by CharlieShi on 3/8/17.
 */
import Phaser from 'phaser'
import TiledState from './TiledState'
import BreadthFirstSearch from '../plugins/BreadthFirstSearch'
import HighlightedRegion from '../prefabs/HighlightedRegion'
import createPrefabFromPool from '../utils'

export default class BattleState extends TiledState {
    constructor(game) {
        super(game);
    }

    create() {
        super.create.call(this);

        this.groups.menu_items.forEach(function (menu_item) {
            this.prefabs.menu.add_item(menu_item);
        }, this);


        //Create tile dimension of points then add plugin into the game with the BFS object and the
        //map object it'll operate on
        //Gives us access to BFS operations through this.bfs......

        this.tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
        this.bfs = this.game.plugins.add(new BreadthFirstSearch(this.game), this.map);
        console.log(this.bfs.find_reachable_area(this.prefabs.unit0.position, 1));

        this.current_unit = this.prefabs.unit0;
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
                              HighlightedRegion.prototype.constructor)
    }

    attack () {
        this.highlight_region(this.current_unit.position,
                              this.current_unit.stats.attack_range,
                              "attack_regions",
                              HighlightedRegion.prototype.constructor)
    }

    wait () {

    }
}


