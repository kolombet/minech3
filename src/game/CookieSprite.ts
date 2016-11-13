import * as Phaser from "phaser"
import {Cookie} from "./Cookie.ts"

export class CookieSprite extends Phaser.Sprite {
    data: Cookie;

    constructor(game: Phaser.Game, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number) {
        super(game, x, y, key, frame);
    }
}