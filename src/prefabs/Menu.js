/**
 * Created by CharlieShi on 3/8/17.
 */
import Phaser from 'phaser'
import Prefab from './Prefab'

export default class Menu extends Prefab {
    constructor (game, name, position, properties) {
        super(game, name, position, properties);

        this.anchor.setTo(0);
        this.menu_items = [];
    }

    add_item (item) {
        this.menu_items.push(item);


        // item._text = 'Move';
        // item._width = 29;
        // console.log('adding menu item', item.visible)

        item.visible = this.visible;
    }

    show (show) {
        this.visible = show;
        this.menu_items.forEach(function (menu_item) {
            menu_item.visible = show;
        });
    }
}