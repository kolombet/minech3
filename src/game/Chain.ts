import {Cookie} from "./Cookie";
export class Chain {
    chainType:ChainType;
    cookies:Array<Cookie>;

    constructor(chainType: ChainType) {
        this.chainType = chainType;
    }

    add(cookie:Cookie) {
        this.cookies.push(cookie);
    }

    firstCookie(): Cookie {
        return this.cookies[0];
    }

    lastCookie(): Cookie {
        return this.cookies[this.cookies.length-1];
    }

    length(): number {
        return this.cookies.length;
    }

    description(): string {
        return `type:${this.chainType} cookies:${this.cookies}`;
    }
}

export enum ChainType {
    horizontal,
    vertical
}