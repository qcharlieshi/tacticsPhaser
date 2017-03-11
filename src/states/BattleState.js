/**
 * Created by CharlieShi on 3/8/17.
 */
import Phaser from 'phaser'
import TiledState from './TiledState'

export default class BattleState extends TiledState {
    constructor(game) {
        super(game);
    }

    create() {
        super.create.call(this);
        console.log('battlestate groups', this.groups.menu_items.children)

        this.groups.menu_items.forEach(function (menu_item) {
            console.log('battlestate menu_item', menu_item)
            this.prefabs.menu.add_item(menu_item);
        }, this);

        // this.tile_dimensions = new Phaser.Point(this.map.tileWidth, this.map.tileHeight);
        // this.bfs = this.game.plugins.add(this.BreadthFirstSearch, this.map);
        // console.log(this.bfs.find_reachable_area(this.prefabs.unit0.position, 1));
    }
}


//Create tile dimension of points then add plugin into the game with the BFS object and the
//map object it'll operate on
//Gives us access to BFS operations through this.bfs......