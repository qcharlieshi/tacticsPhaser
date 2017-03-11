import 'pixi'
import 'p2'

import Phaser from 'phaser'
import config from './config'

import BootState from './states/BootState'
import LoadingState from './states/LoadingState'
import BattleState from './states/BattleState'


class Tactics extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null)

    this.state.add("BootState", new BootState());
    this.state.add("LoadingState", new LoadingState());
    this.state.add("BattleState", new BattleState());

    this.state.start("BootState", true, false, "assets/levels/battle_level.json", "BattleState");
  }

}

window.game = new Tactics(240, 240, Phaser.CANVAS);



