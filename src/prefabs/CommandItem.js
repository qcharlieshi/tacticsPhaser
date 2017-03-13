/**
 * Created by CharlieShi on 3/11/17.
 */
import MenuItem from './MenuItem'

export default class CommandItem extends MenuItem {
    constructor (game, name, position, properties) {
        super (game, name, position, properties);
        this.callback = properties.callback;
    }

    select () {
        //TODO: uncomment this to make the menu hide after every guy
        //TODO: or maybe not im not sure, maybe just hide it in the battle state
        //this.game_state.prefabs.menu.show(false);
        this.game_state[this.callback].call(this.game_state);
    }
}