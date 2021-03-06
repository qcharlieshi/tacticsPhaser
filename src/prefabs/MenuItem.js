/**
 * Created by CharlieShi on 3/9/17.
 */
import TextPrefab from './TextPrefab'

export default class MenuItem extends TextPrefab {
    constructor (game, name, position, properties) {
        super(game, name, position, properties);

        this.anchor.setTo(0);
        this.inputEnabled = true;
        this.events.onInputDown.add(this.select, this);
    }

    select () {
        console.log('select')
    }
}



