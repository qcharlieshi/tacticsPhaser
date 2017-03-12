/**
 * Created by CharlieShi on 3/11/17.
 */

import HighlightedRegion from './HighlightedRegion'

export default class AttackRegion extends HighlightedRegion {
    constructor (game, name, position, properties) {
        super (game, name, position, properties)
    }

    select () {
        let target_unit;
        target_unit = this.game_state.find_prefab_in_tile("units", this.position);

        if (target_unit) {
            this.game_state.current_unit.attack_unit(target_unit);
        }

        this.game_state.next_turn();
    }


}