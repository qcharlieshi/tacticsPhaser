/**
 * Created by CharlieShi on 3/11/17.
 */
import Prefab from './Prefab'

export default class HighlightedRegion extends Prefab {
    constructor (game, name, position, properties) {
        super(game, name, position, properties);

        this.alpha = 0.5;
        this.inputEnabled = true;
        this.events.onInputDown.add(this.select, this);
    }

    select () {

    }


}