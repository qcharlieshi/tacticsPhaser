/**
 * Created by CharlieShi on 3/9/17.
 */
import Phaser from 'phaser'
import Prefab from './Prefab'

export default class Unit extends Prefab {
    constructor(game, name, position, properties) {
        //super();
        super(game, name, position, properties);

        this.stats = {
            walking_radius: 5,
            attack_range: 1,
            speed: 1,
            attack: 1,
            defense: 1,
            health: 5
        };

        this.healthbar = this.game_state.game.add.sprite(this.x, this.y - this.height, "healthbar_image");
        this.healthbar.anchor.setTo(0.5);
        this.healthbar.scale.setTo(this.stats.health, 1);

        //Add Text instead of healthbar
        // var style = { font: "32px Arial", fill: "#ff0044", wordWrap: true, wordWrapWidth: sprite.width, align: "center", backgroundColor: "#ffff00" };
        // text = game.add.text(0, 0, "- text on a sprite -\ndrag me", style);
        // text.anchor.set(0.5);
        //this.hello_sprite.addChild(this.label_score);  //Need to use addChild
    }
}

