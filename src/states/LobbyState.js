/**
 * Created by CharlieShi on 3/12/17.
 */
import JSONLevelState from './JSONLevelState';
import TextPrefab from '../prefabs/TextPrefab';
import firebase from 'firebase'

export default class LobbyState extends JSONLevelState {
    constructor () {
        super();

        this.prefab_classes = {
            "text": TextPrefab.prototype.constructor
        };

        this.INITIAL_PLAYER_DATA = {prepared: false, units: {}};
    }

    create () {
        JSONLevelState.prototype.create.call(this);

        firebase.database().ref("child/battles").once("value", this.find_battle.bind(this));
    }

    find_battle (snapshot) {
        let battles, battle, chosen_battle, new_battle;
        battles = snapshot.val();

        for (battle in battles) {
            if (battles.hasOwnProperty(battle) && !battles[battle].full) {
                chosen_battle = battle;
                firebase.database().ref("child/battles").child(chosen_battle).child("full").set(true, this.join_battle.bind(this, chosen_battle));
                break;
            }
        }

        if (!chosen_battle) {
            this.new_battle = firebase.database().ref("child/battles").push({player1: this.INITIAL_PLAYER_DATA, player2: this.INITIAL_PLAYER_DATA, full: false});
            this.new_battle.on("value", this.host_battle.bind(this));
        }
    }

    host_battle (snapshot) {
        let battle_data;
        battle_data = snapshot.val();
        console.log(snapshot)

        if (battle_data.full) {
            console.log("player1 starting preparation");

            this.new_battle.off();

            this.game.state.start("BootState", true, false,
                "assets/levels/preparation_level.json",
                "PreparationState",
                {battle_id: snapshot.key, local_player: "player1", remote_player: "player2"});
        }
    }

    join_battle (battle_id) {
        console.log("player2 starting preparation");

        this.game.state.start("BootState", true, false,
            "assets/levels/preparation_level.json",
            "PreparationState",
            {battle_id: battle_id, local_player: "player2", remote_player: "player1"});
    }
}