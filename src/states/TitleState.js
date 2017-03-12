/**
 * Created by CharlieShi on 3/12/17.
 */
import JSONLevelState from './JSONLevelState';
import TextPrefab from '../prefabs/TextPrefab';
import Prefab from '../prefabs/Prefab'

export default class TitleState extends JSONLevelState {
    constructor () {
        super();

        this.prefab_classes = {
            "text": TextPrefab.prototype.constructor,
            "image": Prefab.prototype.constructor
        };
    }

    create () {
        JSONLevelState.prototype.create.call(this);
        this.game.input.onDown.add(this.start_battle, this);
    }

    start_battle () {
        this.game.state.start("BootState", true, false, "assets/levels/lobby.json", "LobbyState");
    }
}

