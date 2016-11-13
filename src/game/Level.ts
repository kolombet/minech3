/* @flow */

import {Array2D} from '../util/Array2D.ts'
import {Cookie, CookieType} from './Cookie.ts'
import {Tile} from './Tile.ts'
import * as Phaser from 'phaser'
import {Swap} from "./Swap";

export class Level {
    numColumns:number = 9;
    numRows:number = 9;
    cookies:Array2D<Cookie>;
    tiles:Array2D<Tile>;
    scene:Phaser.State;
    levelID:number;

    constructor(scene:Phaser.State, levelID:number) {
        this.levelID = levelID;
        this.scene = scene;
        this.cookies = new Array2D<Cookie>(this.numColumns, this.numRows);
        this.tiles = new Array2D<Tile>(this.numColumns, this.numRows);

        this.init();
    }

    cookieAt(column:number, row:number):Cookie {
        return this.cookies.g(column, row);
    }

    shuffle() {
        return this.createInitialCookies();
    }

    createInitialCookies() {
        console.log("create initial cookies");
        let set = new Array<Cookie>();
        for (var row = 0; row < this.numRows; row++) {
            for (var column = 0; column < this.numColumns; column++) {
                var tile = this.tiles.g(column, row) == null ? "null" : "notnull";
                // console.log(`tile ${row}x${column} is ${tile}`);


                if (this.tiles.g(column, row) != null) {
                    let cookieType:CookieType = CookieType.getRandomType();

                    let cookie = new Cookie({column, row, cookieType});
                    this.cookies.s(column, row, cookie);

                    set.push(cookie);
                }
            }
        }
        return set;
    }

    tileAt(column:number, row:number):Tile {
        return this.tiles.g(column, row);
    }

    init() {
        let level = this.scene.game.cache.getJSON('level' + this.levelID);
        if (!level) return;

        let tiles = level.tiles;
        if (!tiles) return;

        // var entries:any = Object.entries;
        for (var r = 0; r < tiles.length; r++) {
            var row = r;
            var rowArray = tiles[r];
            let tileRow = this.numRows - row - 1;

            for (var c = 0; c < tiles.length; c++) {
                var column = c;
                var value = rowArray[c];

                if (value == 1) {
                    this.tiles.s(column, tileRow, new Tile());
                }
            }
        }
        console.log("level tile init complete");
    }

    performSwap(swap: Swap) {
        let colA = swap.cookieA.column;
        let rowA = swap.cookieA.row;
        let colB = swap.cookieB.column;
        let rowB = swap.cookieB.row;

        this.cookies.s(colA, rowA, swap.cookieB);
        swap.cookieB.column = colA;
        swap.cookieB.row = rowA;

        this.cookies.s(colB, rowB, swap.cookieA);
        swap.cookieA.column = colB;
        swap.cookieA.row = rowB;
    }

    // an alternative version using a generator expression
    // entries(obj:Object) {
    //     return (for (key:String of Object.keys(obj)) [key, obj[key]]);
    // }
}