import {GameScene} from '../states/GameScene.ts';
import {Level} from '../game/Level.ts';
import * as Phaser from 'phaser';
import {Swap} from './Swap.ts';

export class GameViewController {
    scene:GameScene;
    level:Level;

    constructor(scene:GameScene) {
        this.level = new Level(scene, 3);
        this.scene = scene;
        this.scene.level = this.level;
        this.beginGame();
        this.scene.onSwipeHandler.add(this.animate, this);

        // var inp:Phaser.Input = scene.game.input;
        // inp.addMoveCallback(this.moveCallback);
        // inp.onDown.add(this.itemTouched);
        // inp.onUp.add(this.itemTouched);
        // console.log('test')
    }

    // moveCallback(pointer:Phaser.Pointer, x:number, y:number) {
    //     if (pointer.isDown) {
    //         console.log("mouse down");
    //     }
    // }
    //
    // itemTouched(pointer:Phaser.Pointer) {
    //
    // }

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

        this.scene.game.add
            .tween(spriteA)
            .to(spriteBPt, tweenTime, Phaser.Easing.Bounce.Out, true);

        // this.scene.game.add
        //     .tween(spriteA.position.y)
        //     .to(spriteBPt.y, tweenTime, Phaser.Easing.Bounce.Out, true);

        this.scene.game.add
            .tween(spriteB)
            .to(spriteAPt, tweenTime, Phaser.Easing.Bounce.Out, true);

        // this.scene.game.add
        //     .tween(spriteB.position.y)
        //     .to(spriteAPt.y, tweenTime, Phaser.Easing.Bounce.Out, true);
    }

    beginGame() {
        this.shuffle();
    }

    shuffle() {
        let newCookies = this.level.shuffle();
        this.scene.addSprites(newCookies);
    }


}