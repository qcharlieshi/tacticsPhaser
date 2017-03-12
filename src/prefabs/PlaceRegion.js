/**
 * Created by CharlieShi on 3/12/17.
 */

import HighlightedRegion from './HighlightedRegion';

export default class PlaceRegion extends HighlightedRegion {
    constructor (game, name, position, properties) {
        super(game, name, position, properties);

        this.player = properties.player;
    }

    select () {
        let current_placed_unit, collision;

        current_placed_unit = this.game_state.find_prefab_in_tile("unit_sprites", this.position);

        //Add to avoid collisions as well
        //todo: write this conditional, find out how to access the collision layer
        collision = this.game_state;

        if (!current_placed_unit && this.player === this.game_state.local_player) {
            this.game_state.place_unit(this.position);
        }
    }
}


