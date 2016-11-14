import * as Phaser from "phaser"
import {Cookie} from "./Cookie.ts"

export class CookieSprite extends Phaser.Sprite {
    private _isSelected: boolean;
    get isSelected(): boolean {
        return this._isSelected;
    }

    set isSelected(value: boolean) {
        if (value == true) {
            this.scale = new Phaser.Point(1.1, 1.1);
        } else {
            this.scale = new Phaser.Point(1, 1);
        }
        this._isSelected = value;
    }

    data: Cookie;

    constructor(data:Cookie, game: Phaser.Game, x: number, y: number, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number) {
        super(game, x, y, key, frame);
        this.data = data;
        var text = new Phaser.Text(game, 0, 0, data.cookieType.typeID.toString())
        text.anchor.set(.5, .5);
        this.addChild(text);
    }
}