import * as Phaser from 'phaser'

/**
 * Created by Kolombet on 11/9/2016.
 */
export class CookieType {
    typeID:number;
    type:string;

    constructor(type:number) {
        this.typeID = type;
        this.type = CookieType.getTypesArr()[type];
    }

    static getTypes() {
        return {
            croissant: "croissant",
            cupcake: "cupcake",
            danish: "danish",
            donut: "donut",
            macaroon: "macaroon",
            sugarCookie: "sugarCookie"
        }
    }

    static getTypesArr() {
        var obj = CookieType.getTypes();
        var arr = Object.keys(obj)
            .map(function (key) {
                return obj[key];
            });
        return arr;
    }

    static getRandomType() {
        var types = CookieType.getTypesArr();
        var type = Math.floor(Math.random() * types.length);
        return new CookieType(type);
    }
}

export class Cookie {
    sprite: Phaser.Sprite;
    column: number;
    row: number;
    cookieType: CookieType;

    constructor({column, row, cookieType}) {
        this.column = column;
        this.row = row;
        this.cookieType = cookieType;
    }

    getImageName() {
        return 'gem' + (this.cookieType.typeID+1);
    }

    hashValue(): number {
        return this.row * 10 + this.column;
    }

    eq(to: Cookie): boolean {
        return this.column == to.column && this.row == to.row;
    }

    toString(): string {
        return `${this.column}x${this.row}`
    }
}