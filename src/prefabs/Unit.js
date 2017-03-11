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

        let style = {
            font: "bold 10px Arial",
            fill: "#FFF",
            stroke: "#000",
            strokeThickness: 3
            //backgroundColor: "#000"
        }

        //Set healthbar as text
        this.healthbar = this.game_state.game.add.text(this.x - 5, this.y - 5, this.health, style);
        this.healthbar.anchor.setTo(0.5);
    }
}

