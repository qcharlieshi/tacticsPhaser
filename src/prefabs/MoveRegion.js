/**
 * Created by CharlieShi on 3/11/17.
 */

import HighlightedRegion from './HighlightedRegion'

export default class MoveRegion extends HighlightedRegion {
    constructor (game, name, position, properties) {
        super (game, name, position, properties)
    }

    select () {
        this.game_state.current_unit.move_to(this.position);

        //todo: need to make it so attack can still be used instead of ending turn immediately
        //Check for remaining move
        this.game_state.next_turn();
    }


}
