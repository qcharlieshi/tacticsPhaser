/**
 * Created by CharlieShi on 3/12/17.
 */
import TiledState from './TiledState'

export default class PreparationState extends TiledState {
    constructor () {
        super();

        //Each level could have its own set of starting units
        this.units_to_place = [{type: "unit", name: "infantry_unit", properties: {texture: "infantry_image", group: "units", unit_class: "infantry"}},
            {type: "unit", name: "rocket_infantry_unit", properties: {texture: "rocket_infantry_image", group: "units", unit_class: "rocket_infantry"}},
            {type: "unit", name: "tank_unit", properties: {texture: "tank_image", group: "units", unit_class: "tank"}},
            {type: "unit", name: "apc_unit", properties: {texture: "apc_image", group: "units", unit_class: "apc"}},
            {type: "unit", name: "rocket_unit", properties: {texture: "rocket_image", group: "units", unit_class: "rocket"}}];

        this.units = [];
    }

    create () {
        TiledState.prototype.create.call(this);
        this.current_unit_to_place = this.units_to_place.shift();
        this.prefabs.current_unit_sprite.loadTexture(this.current_unit_to_place.properties.texture);
    }

    place_unit (position) {
        this.current_unit_to_place.position = position;
        this.units.push(this.current_unit_to_place);
        this.create_prefab(this.current_unit_to_place.name, {type: "unit_sprite", properties: {texture: this.current_unit_to_place.properties.texture, group: "unit_sprites"}}, position);

        if (this.units_to_place.length > 0) {
            this.current_unit_to_place = this.units_to_place.shift();
            this.prefabs.current_unit_sprite.loadTexture(this.current_unit_to_place.properties.texture);
        } else {
            this.game.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState", {units: this.units});
        }
    }
}
