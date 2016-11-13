import * as Phaser from 'phaser'
import {centerGameObjects} from '../utils.ts'

export class SplashState extends Phaser.State {
  loaderBg: Phaser.Sprite
  loaderBar: Phaser.Sprite

  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.load.image('mushroom', 'assets/images/mushroom2.png')

    for (var i = 1; i < 7; i++) {
        this.load.image('gem' + i, 'assets/images/Gem' + i + '.png');
    }

    for (var i = 0; i < 4; i++) {
        this.load.json('level' + i, 'assets/levels/Level_' + i + '.json');
    }
  }

  create () {
    this.game.state.start('Game')
  }

}
