import 'pixi'
import 'p2'


import Phaser from 'phaser'
import config from './config'

import BootState from './states/BootState'
import LoadingState from './states/LoadingState'
import BattleState from './states/BattleState'
import PreparationState from './states/PreparationState'


class Tactics extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    let firebase = new Firebase("https://tactics-23582.firebaseio.com/");

    this.state.add("BootState", new BootState());
    this.state.add("LoadingState", new LoadingState());
    this.state.add("BattleState", new BattleState());
    this.state.add("PreparationState", new PreparationState());

    this.state.start("BootState", true, false, "assets/levels/preparation_level.json", "PreparationState");
  }

}

window.game = new Tactics(240, 240, Phaser.CANVAS);



