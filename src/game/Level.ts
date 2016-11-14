/* @flow */

import {Array2D} from '../util/Array2D.ts'
import {Cookie, CookieType} from './Cookie.ts'
import {Tile} from './Tile.ts'
import * as Phaser from 'phaser'
import {Swap} from "./Swap.ts";
import {Chain, ChainType} from "./Chain.ts";
import * as Collections from "typescript-collections"

export class Level {
    numColumns: number = 9;
    numRows: number = 9;
    cookies: Array2D<Cookie>;
    tiles: Array2D<Tile>;
    scene: Phaser.State;
    levelID: number;
    possibleSwaps: Array<Swap>;

    constructor(scene: Phaser.State, levelID: number) {
        this.levelID = levelID;
        this.scene = scene;
        this.cookies = new Array2D<Cookie>(this.numColumns, this.numRows);
        this.tiles = new Array2D<Tile>(this.numColumns, this.numRows);
        this.possibleSwaps = [];

        this.init();
    }

    cookieAt(column: number, row: number): Cookie {
        return this.cookies.g(column, row);
    }

    shuffle(): Array<Cookie> {
        let set: Array<Cookie>;

        for (var i = 0; i < 10; i++) {
            set = this.createInitialCookies();
            console.log(this.toString());
            this.detectPossibleSwaps();
            console.log(`possible swaps: ${this.possibleSwaps.toString()}`);
            if (this.possibleSwaps.length > 0)
                break;
        }

        return set;
    }

    detectPossibleSwaps(): void {
        var set = [];

        for (var row = 0; row < this.numRows; row++) {
            for (var column = 0; column < this.numColumns; column++) {
                let cookie = this.cookies.g(column, row);
                if (cookie != null) {
                    //detection
                    if (column < this.numColumns - 1) {
                        let other = this.cookies.g(column + 1, row);
                        if (other != null) {
                            this.cookies.s(column, row, other);
                            this.cookies.s(column + 1, row, cookie);

                            if (this.hasChainAt(column + 1, row) ||
                                this.hasChainAt(column, row)) {
                                set.push(new Swap(cookie, other));
                            }

                            this.cookies.s(column, row, cookie);
                            this.cookies.s(column + 1, row, other);
                        }
                    }

                    if (row < this.numColumns - 1) {
                        let other = this.cookies.g(column, row + 1);
                        if (other != null) {
                            this.cookies.s(column, row, other);
                            this.cookies.s(column, row + 1, cookie);

                            if (this.hasChainAt(column, row + 1) ||
                                this.hasChainAt(column, row)) {
                                set.push(new Swap(cookie, other));
                            }

                            this.cookies.s(column, row, cookie);
                            this.cookies.s(column, row + 1, other);
                        }
                    }
                }
            }
        }
        this.possibleSwaps = set;
    }

    hasChainAt(column: number, row: number): boolean {
        let cookieType = this.cookies.g(column, row).cookieType;

        let horLen = 1;

        let i = column - 1;
        while (i >= 0 &&
        this.cookies.g(i, row) &&
        this.cookies.g(i, row).cookieType.eq(cookieType)) {
            i -= 1;
            horLen += 1;
        }

        i = column + 1;
        while (i < this.numColumns &&
        this.cookies.g(i, row) &&
        this.cookies.g(i, row).cookieType.eq(cookieType)) {
            i += 1;
            horLen += 1;
        }
        if (horLen >= 3) {
            console.log("hor match");
            return true;
        }


        let verLen = 1;
        i = row - 1;
        while (i >= 0 &&
        this.cookies.g(column, i) &&
        this.cookies.g(column, i).cookieType.eq(cookieType)) {
            i -= 1;
            verLen += 1;
        }

        i = row + 1;
        while (i < this.numRows &&
        this.cookies.g(column, i) &&
        this.cookies.g(column, i).cookieType.eq(cookieType)) {
            i += 1;
            verLen += 1;
        }

        if (verLen >= 3) {
            console.log("ver match");
            return true;
        }
        return false;
    }

    isPossibleSwap(swap: Swap): boolean {
        let swaps = this.possibleSwaps.filter((el: Swap) => {
            return el.hashValue() == swap.hashValue();
        });
        return swaps.length > 0;
    }

    createInitialCookies(): Array<Cookie> {
        console.log("create initial cookies");
        let set = [];
        for (var row = 0; row < this.numRows; row++) {
            for (var column = 0; column < this.numColumns; column++) {
                var tile = this.tiles.g(column, row) == null ? "null" : "notnull";

                if (this.tiles.g(column, row) != null) {
                    let cookieType: CookieType = CookieType.getRandomType();

                    let cookie = new Cookie({column, row, cookieType});
                    this.cookies.s(column, row, cookie);

                    set.push(cookie);
                }
            }
        }
        return set;
    }

    tileAt(column: number, row: number): Tile {
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

    detectHorizontalMatches(): Array<Chain> {
        let set = [];
        for (var row = 0; row < this.numRows; row++) {
            var column = 0;
            while (column < this.numColumns - 2) {
                let cookie = this.cookies.g(column, row);
                if (cookie) {
                    let matchType = cookie.cookieType;

                    let nextOne = this.cookies.g(column + 1, row);
                    let nextTwo = this.cookies.g(column + 2, row);
                    if (nextOne.cookieType.eq(matchType) &&
                        nextTwo.cookieType.eq(matchType)) {
                        let chain = new Chain(ChainType.horizontal);
                        while (column < this.numColumns && this.cookies.g(column, row).cookieType.eq(matchType)) {
                            chain.add(this.cookies.g(column, row));
                            column += 1;
                        }

                        set.push(chain);
                        continue;
                    }
                }
                column += 1;
            }
        }
        return set;
    }

    detectVerticalMatches(): Array<Chain> {
        let set = [];
        for (var col = 0; col < this.numColumns; col++) {
            var row = 0;
            while (row < this.numRows - 2) {
                let cookie = this.cookies.g(col, row);
                if (cookie) {
                    let matchType = cookie.cookieType;

                    let nextOne = this.cookies.g(col, row + 1);
                    let nextTwo = this.cookies.g(col, row + 2);
                    if (nextOne.cookieType.eq(matchType) &&
                        nextTwo.cookieType.eq(matchType)) {
                        let chain = new Chain(ChainType.vertical);
                        while (row < this.numRows && this.cookies.g(col, row).cookieType.eq(matchType)) {
                            chain.add(this.cookies.g(col, row));
                            row += 1;
                        }

                        set.push(chain);
                        continue;
                    }
                }
                row += 1;
            }
        }
        return set;
    }

    removeMatches() :Array<Chain> {
        let horChains = this.detectHorizontalMatches();
        let verChains = this.detectVerticalMatches();

        for (let i = 0; i < verChains.length; i++) {
            horChains.push(verChains[i]);
        }

        return horChains;
    }

    toString() {
        var columnStr = '';
        for (var row = 0; row < this.numColumns; row++) {
            let rowStr = '';
            for (var col = 0; col < this.numRows; col++) {
                let data = 'x';
                let isEnabled = (this.cookies.g(col, row) != null);
                if (isEnabled)
                    data = this.cookies.g(col, row).cookieType.typeID.toString();

                rowStr += data;
            }
            columnStr += rowStr + '\n';
        }
        return columnStr;
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