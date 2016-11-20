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
        this.scene.onSwipeHandler.add(this.handleSwipe, this);

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

    handleSwipe(swap:Swap) {
        //disable user interaction

        if (this.level.isPossibleSwap(swap)) {
            this.level.performSwap(swap);
            this.scene.animateSwap(swap, this.handleMatches);
        } else {
            console.log("swipe not possible");
        }

        //enable user interaction on callback
    }

    beginGame() {
        this.shuffle();
    }

    shuffle() {
        let newCookies = this.level.shuffle();
        this.scene.addSprites(newCookies);
    }


    handleMatches() {
        let chains = this.level.removeMatches();
        console.log("handle matches");
    }
}