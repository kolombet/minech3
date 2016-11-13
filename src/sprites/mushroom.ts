import * as Phaser from 'phaser'

export class Mushroom extends Phaser.Sprite {

  constructor({ game, x, y, asset }) {
    super(game, x, y, asset)

    this.game = game
    this.anchor.setTo(1)

  }

  update() {
    this.angle += 5
  }

}
