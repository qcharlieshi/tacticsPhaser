/**
 * Created by CharlieShi on 3/11/17.
 */

import HighlightedRegion from './HighlightedRegion'

export default class MoveRegion extends HighlightedRegion {
    constructor (game, name, position, properties) {
        super (game, name, position, properties)
    }

    select () {
        let player1_unit, player2_unit;

        player1_unit = this.game_state.find_prefab_in_tile("player1_units", this.position);
        player2_unit = this.game_state.find_prefab_in_tile("player2_units", this.position);

        if (!player1_unit && !player2_unit) {
            this.game_state.send_move_command(this.position);
        }

        //todo: need to make it so attack can still be used instead of ending turn immediately
    }


}
