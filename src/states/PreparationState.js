/**
 * Created by CharlieShi on 3/12/17.
 */
import TiledState from './TiledState'
import firebase from 'firebase'

export default class PreparationState extends TiledState {
    constructor () {
        super();
    }

    init (level_data, extra_parameters) {
        super.init.call(this, level_data);

        this.battle_ref = firebase.database().ref("child/battles").child(extra_parameters.battle_id);
        this.local_player = extra_parameters.local_player;
        this.remote_player = extra_parameters.remote_player;


        let textureInfantry = (this.local_player === 'player2' ? "infantry_blue_image" : "infantry_image")
        let textureRocket = (this.local_player === 'player2' ? "rocket_blue_image" : "rocket_image")
        let textureRocketInfantry = (this.local_player === 'player2' ? "rocket_infantry_blue_image" : "rocket_infantry_image")
        let textureApc = (this.local_player === 'player2' ? "apc_blue_image" : "apc_image")
        let textureTank = (this.local_player === 'player2' ? "tank_blue_image" : "tank_image")

        console.log('infantry texture',textureInfantry)

        // (this.local_player === 'player2' ? textureInfantryBlue : textureInfantry)

        //Each level could have its own set of starting units
        this.units_to_place =
            [{type: "unit", name: this.local_player + "_infantry_unit", properties: {texture: textureInfantry, group: this.local_player + "_units", unit_class: "infantry"}},
            {type: "unit", name: this.local_player + "_rocket_infantry_unit", properties: {texture: textureRocketInfantry, group: this.local_player + "_units", unit_class: "rocket_infantry"}},
            {type: "unit", name: this.local_player + "_tank_unit", properties: {texture: textureTank, group: this.local_player + "_units", unit_class: "tank"}},
            {type: "unit", name: this.local_player + "_apc_unit", properties: {texture: textureApc, group: this.local_player + "_units", unit_class: "apc"}},
            {type: "unit", name: this.local_player + "_rocket_unit", properties: {texture: textureRocket, group: this.local_player + "_units", unit_class: "rocket"}}];

        this.units = [];
    }

    create () {
        TiledState.prototype.create.call(this);
        this.current_unit_to_place = this.units_to_place.shift();
        this.prefabs.current_unit_sprite.loadTexture(this.current_unit_to_place.properties.texture);

        this.battle_ref.onDisconnect().remove;
        this.game.stage.disableVisibilityChange = true;
    }

    place_unit (position) {
        this.current_unit_to_place.position = position;
        //this.units.push(this.current_unit_to_place);

        //Push units onto firebase
        this.battle_ref.child(this.local_player).child("units").push(this.current_unit_to_place);

        //????
        this.create_prefab(
            this.current_unit_to_place.name,
            {type: "unit_sprite", properties: {texture: this.current_unit_to_place.properties.texture, group: "unit_sprites"}},
            position);

        //Test if theres any more units to place, if not set to prepared and wait
        if (this.units_to_place.length > 0) {
            this.current_unit_to_place = this.units_to_place.shift();
            this.prefabs.current_unit_sprite.loadTexture(this.current_unit_to_place.properties.texture);
        } else {
            this.prefabs.current_unit_sprite.kill();

            this.groups.place_regions.forEach(function (region) {
                region.kill();
            }, this);

            this.battle_ref.child(this.local_player).child("prepared").set(true, this.wait_for_enemy.bind(this));
            //this.game.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState", {units: this.units});
        }
    }

    wait_for_enemy () {
        this.battle_ref.child(this.remote_player).child("prepared").on("value", this.start_battle.bind(this));
    }

    start_battle (snapshot) {
        let prepared = snapshot.val();

        if (prepared) {
            console.log('start battle')
            this.game.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState",
                {battle_id: this.battle_ref.key, local_player: this.local_player, remote_player: this.remote_player});
        }
    }
}
