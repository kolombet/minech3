import * as Phaser from 'phaser';
import {CookieType, Cookie} from '../game/Cookie.ts';
import {Level} from '../game/Level.ts';
import {GameViewController} from '../game/GameViewController.ts';
import {Swap} from '../game/Swap.ts';
import {CookieSprite} from '../game/CookieSprite.ts';

export class GameScene extends Phaser.State {
    level: Level;
    tileWidth: number = 32;
    tileHeight: number = 36;
    numColumns = 9;
    numRows = 9;
    gameLayer: Phaser.Sprite;
    swipeStart: Cookie;
    prevX: number = 0;
    prevY: number = 0;
    tick: number = 0;
    onSwipeHandler: Phaser.Signal; //Swap -> void

    // https://www.raywenderlich.com/125311/make-game-like-candy-crush-spritekit-swift-part-1

    init(args: any): void {
        // let banner = this.add.text(this.game.world.centerX, this.game.height - 30, 'Test')
        // banner.font = 'Nunito'
        // banner.fontSize = 40
        // banner.fill = '#77BFA3'
        // banner.anchor.setTo(0.5)

        this.onSwipeHandler = new Phaser.Signal();

        this.game.input.addMoveCallback(this.moveCallback, this);

        this.gameLayer = this.game.add.sprite(this.tileWidth, this.tileHeight);

        var gameViewController = new GameViewController(this);
    }

    normalizeNumber(value: number): number {
        if (value > 0)
            value = 1;
        if (value < 0)
            value = -1;
        return value;
    }

    moveCallback(pointer: Phaser.Pointer, x: number, y: number): void {
        // var deltaX = x - this.prevX;
        // var deltaY = y - this.prevY;
        // if (Math.abs(deltaX) < 100 || Math.abs(deltaY) < 100)
        //     return;
        //
        // console.log(`delta x:${x - this.prevX} y:${y - this.prevY}`);
        // var direction;
        // if (x > y)
        //     direction = {x: this.normalizeNumber(x - this.prevX), y: 0};
        // else
        //     direction = {x: 0, y: this.normalizeNumber(y - this.prevY)};
        //
        // this.prevX = x;
        // this.prevY = y;
        //
        // if (direction.x == 0 && direction.y == 0)
        //     return;
        //
        // if (this.swipeStart == null)
        //     return;
        //
        //
        // this.tryToSwap(direction.x, direction.y);
        // this.swipeStart = null;
    }

    addSprites(cookies: Array<Cookie>): void {
        cookies.forEach((data: Cookie) => {
            var sprite = new CookieSprite(data, this.game, 0, 0, data.getImageName());
            this.gameLayer.addChild(sprite);
            // let sprite = this.game.add.sprite(0, 0, data.getImageName());

            sprite.anchor.set(.5);
            sprite.position = this.pointFor(data.column, data.row);
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(this.cookieClickDownHandler, this);
            sprite.events.onInputUp.add(this.cookieClickUpHandler, this);

            data.sprite = sprite;
        })
    }

    tryToSwapDelta(horDelta: number, vertDelta: number): void {
        // if (this.swipeStart)
        let toColumn = this.swipeStart.column + horDelta;
        let toRow = this.swipeStart.row - vertDelta;

        if (toColumn < 0 || toColumn > this.numColumns)
            return;

        if (toRow < 0 || toRow > this.numRows)
            return;

        let toCookie = this.level.cookieAt(toColumn, toRow);
        let fromCookie = this.level.cookieAt(this.swipeStart.column, this.swipeStart.row);
        if (fromCookie == null || toCookie == null)
            return;

        this.tryToSwap(fromCookie, toCookie);
    }

    tryToSwap(from: Cookie, to: Cookie) :void {
        console.log(`from cookie ${from} to ${to}`);
        let swap = new Swap(from, to);
        this.onSwipeHandler.dispatch(swap, this);
    }

    cookieClickDownHandler(el: CookieSprite, pointer: Phaser.Pointer) {
        let str = el.data.toString();
        let cookie = el.data;
        console.log(`cookie click down ${str}`);

        if (this.swipeStart != null) {
            if (el.data.eq(this.swipeStart) == false) {
                this.tryToSwap(this.swipeStart, cookie);
            }

            this.swipeStart.sprite.isSelected = false;
            this.swipeStart = null;

        } else {
            this.swipeStart = cookie;
            el.isSelected = true;
            
            this.tick = 0;
        }
    }

    cookieClickUpHandler(el: Phaser.Sprite, pointer: Phaser.Pointer) {
        console.log("cookie click up");
        //this.swipeEnd = el.data;
    }

    pointFor(column, row): Phaser.Point {
        return new Phaser.Point(
            column * this.tileWidth,
            row * this.tileHeight
        );
    }

    animate(swap:Swap) {
        if (swap == null) {
            new Error("no swap");
            return;
        }

        let spriteA = swap.cookieA.sprite;
        let spriteB = swap.cookieB.sprite;

        if (spriteA == null || spriteB == null) {
            new Error('no sprite');
        }

        let spriteAPt = {x:spriteA.position.x, y:spriteA.position.y};
        let spriteBPt = {x:spriteB.position.x, y:spriteB.position.y};

        let tweenTime = 300;

        this.game.add
            .tween(spriteA)
            .to(spriteBPt, tweenTime, Phaser.Easing.Bounce.Out, true);

        // this.scene.game.add
        //     .tween(spriteA.position.y)
        //     .to(spriteBPt.y, tweenTime, Phaser.Easing.Bounce.Out, true);

        this.game.add
            .tween(spriteB)
            .to(spriteAPt, tweenTime, Phaser.Easing.Bounce.Out, true);

        // this.scene.game.add
        //     .tween(spriteB.position.y)
        //     .to(spriteAPt.y, tweenTime, Phaser.Easing.Bounce.Out, true);
    }

    preload() {
    }

    create() {

    }

    render() {
    }

    update() {

    }
}