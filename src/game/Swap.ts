import * as Phaser from "phaser"
import {Cookie} from "./Cookie.ts"

export class Swap {
    cookieA:Cookie;
    cookieB:Cookie;

    constructor(cookieA:Cookie, cookieB:Cookie) {
        this.cookieA = cookieA;
        this.cookieB = cookieB;
    }

    description():string {
        return `swap ${this.cookieA} with ${this.cookieB}`;
    }

    eq(lhs:Swap, rhs:Swap):boolean {
        return  (lhs.cookieA == rhs.cookieA && lhs.cookieB == rhs.cookieB) ||
                (lhs.cookieB == rhs.cookieB && lhs.cookieA == rhs.cookieB);
    }
}