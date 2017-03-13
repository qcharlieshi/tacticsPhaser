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
        target_unit = this.game_state.find_prefab_in_tile(this.game_state.remote_player + "_units", this.position);

        if (target_unit) {
            this.game_state.send_attack_command(target_unit);
        }

        this.game_state.next_turn();
    }


}