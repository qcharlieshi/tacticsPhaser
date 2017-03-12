/**
 * Created by CharlieShi on 3/12/17.
 */
import JSONLevelState from './JSONLevelState';
import TextPrefab from '../prefabs/TextPrefab';

export default class TitleState extends JSONLevelState {
    constructor () {
        super();

        this.prefab_classes = {
            "text": TextPrefab.prototype.constructor
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

