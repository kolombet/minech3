import {GameScene} from '../states/GameScene.ts';
import {Level, LevelData} from '../game/Level.ts';
import * as Phaser from 'phaser';
import {Swap} from './Swap.ts';
import {Array2D} from "../util/Array2D.ts";
import {Cookie, CookieType} from "./Cookie.ts";
import {Tile} from "./Tile.ts";

export class GameViewController {
    scene:GameScene;
    level:Level;

    constructor(scene:GameScene) {
        this.scene = scene;

        var data = this.createLevelData();
        this.level = new Level(data);

        this.scene.level = this.level;
        this.beginGame();
        this.scene.onSwipeHandler.add(this.handleSwipe, this);

        // var inp:Phaser.Input = scene.game.input;
        // inp.addMoveCallback(this.moveCallback);
        // inp.onDown.add(this.itemTouched);
        // inp.onUp.add(this.itemTouched);
        // console.log('test')
    }

    createLevelData():LevelData {
        let data = new LevelData();
        data.numRows = 9;
        data.numColumns = 9;

        let id = 1;
        let level = this.scene.game.cache.getJSON('level' + id);
        if (!level) return;

        let tiles = level.tiles;
        if (!tiles)
            throw new Error("no tiles file");

        data.tiles = new Array2D<Tile>(data.numRows, data.numColumns);
        for (let r = 0; r < tiles.length; r++) {
            let row = r;
            let rowArray = tiles[r];
            let tileRow = data.numRows - row - 1;

            for (let c = 0; c < tiles.length; c++) {
                let column = c;
                let value = rowArray[c];

                if (value == 1) {
                    data.tiles.s(column, tileRow, new Tile());
                }
            }
        }

        let cookies = level.cookies;
        if (!cookies)
            throw new Error("no cookies file");

        data.cookies = new Array2D<Cookie>(data.numRows, data.numColumns);
        for (let r = 0; r < cookies.length; r++) {
            let row = r;
            let rowArray = cookies[r];
            let tileRow = data.numRows - row - 1;

            for (let c = 0; c < cookies.length; c++) {
                let column = c;
                let value = rowArray[c];

                if (value != 0) {
                    var type = new CookieType(value);
                    data.cookies.s(column, tileRow, new Cookie({
                        column:column, row:tileRow, cookieType:type
                    }));
                }
            }
        }
        return data;
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
        let newCookies = this.level.cookies.getSet();
        this.scene.addSprites(newCookies);
    }


    handleMatches() {
        let chains = this.level.removeMatches();
        console.log("handle matches " + chains.length);
    }
}