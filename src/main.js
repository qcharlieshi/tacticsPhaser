import 'pixi'
import 'p2'

import config from './config'
import Firebase from 'firebase'
import Phaser from 'phaser'


import BootState from './states/BootState'
import LoadingState from './states/LoadingState'
import BattleState from './states/BattleState'
import PreparationState from './states/PreparationState'
import TitleState from './states/TitleState'
import LobbyState from './states/LobbyState'


class Tactics extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement;
    const width = 760;
    const height = 400;

      // const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth;
      // const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight;

    super(width, height, Phaser.CANVAS, 'content', null)

    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyDdnLjZPDUcdOxPo4wwR7u5I1vVb7cZO3Q",
        authDomain: "tactics-23582.firebaseapp.com",
        databaseURL: "https://tactics-23582.firebaseio.com",
        storageBucket: "tactics-23582.appspot.com",
        messagingSenderId: "261339688299"
    };

    Firebase.initializeApp(config);

    this.state.add("BootState", new BootState());
    this.state.add("LoadingState", new LoadingState());
    this.state.add("BattleState", new BattleState());
    this.state.add("PreparationState", new PreparationState());
    this.state.add("TitleState", new TitleState());
    this.state.add("LobbyState", new LobbyState());

    this.state.start("BootState", true, false, "assets/levels/title_screen.json", "TitleState");
  }
}

window.game = new Tactics(240, 240, Phaser.CANVAS);



