/**
 * Created by CharlieShi on 3/9/17.
 */
import Phaser from 'phaser'

export default class TextPrefab extends Phaser.Text {
    constructor(game, name, position, properties) {
        //Had to pass in game.game?
        super(game.game, position.x, position.y, properties.text, properties.style);
        this.game_state = game;

        this.name = name;
        this.resolution = 1;

        this.game_state.groups[properties.group].add(this);

        if (properties.anchor) {
            this.anchor.setTo(properties.anchor.x, properties.anchor.y);
        }

        this.game_state.prefabs[name] = this;
    }
}
