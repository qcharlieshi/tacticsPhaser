/**
 * Created by CharlieShi on 3/9/17.
 */

import Prefab from './Prefab'

export default class Unit extends Prefab {
    constructor (game, name, position, properties) {
        super (game, name, position, properties);

        this.unit_class = properties.unit_class;
    }

    load_stats (classes_data) {
        this.stats = Object.create(classes_data[this.unit_class]);

        //Set healthbar as text
        const style = {
            font: "bold 10px Arial",
            fill: "#FFF",
            stroke: "#000",
            strokeThickness: 3
        };

        this.healthbar = this.game_state.game.add.text(this.x - 5, this.y - 5, this.stats.health, style);
        this.healthbar.anchor.setTo(0.5);
    }

    move_to (position) {
        console.log('this is', this)
        this.game_state.pathfinding.find_path(this.position, position, this.follow_path, this);
    }

    follow_path (path) {
        let next_position, moving_tween, healthbar_moving_tween;

        moving_tween = this.game_state.game.tweens.create(this);
        healthbar_moving_tween = this.game_state.game.tweens.create(this.healthbar);

        //Utilize tweens to move position, takes in a path found by the pathfinder
        path.forEach(function (position) {
            moving_tween.to({x: position.x, y: position.y}, Phaser.Timer.SECOND * 0.3);
            healthbar_moving_tween.to({x: position.x - 5, y: position.y - 5}, Phaser.Timer.SECOND * 0.3);
        }, this);

        moving_tween.start();
        healthbar_moving_tween.start();
    }

    attack_unit (target_unit) {
        //Basic game logic, not completed implemented
        let random_attack, random_defense, damage;

        random_attack = this.game_state.rnd.between(this.stats.attack - 2, this.stats.attack);
        random_defense = this.game_state.rnd.between(this.stats.defense - 1, this.stats.defense);
        damage = Math.max(random_attack - random_defense, 0);
        target_unit.receive_damage(damage);
    }

    receive_damage (damage) {
        //Change stats and display
        this.stats.health -= damage;
        this.healthbar.text = this.stats.health;

        console.log('recieved damage, health is: ', this.healthbar.text);

        //Check if dead
        if (this.stats.health <= 0) {
            this.kill();
            this.healthbar.kill();
        }
    }
}

