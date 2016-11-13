/* @flow */
export class Array2D<T> {
    columns:number;
    rows:number;
    _array:Array<T>;
    size:number;

    constructor(columns:number, rows:number) {
        this.columns = columns;
        this.rows = rows;
        this.size = columns * rows;
        this._array = new Array<T>(this.size);
    }

    /**
     * Return
     * @param column
     * @param row
     */
    g(column:number, row:number):T {
        var index = row * this.columns + column;
        if (index < 0 || index > this.size)
            throw new Error("out of bounds");
        return this._array[index];
    }

    s(column:number, row:number, value:any):void {
        let index = row * this.columns + column;
        if (index < 0 || index > this.size)
            throw new Error("out of bounds");
        this._array[index] = value;
    }

    toString() {
        return JSON.stringify(this._array);
    }
}