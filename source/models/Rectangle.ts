import { IOutputBlock } from "./OutputBlock"

export class Rectangle implements IOutputBlock {
  firstColumn: number
  lastColumn:number
  rows: number[]

  constructor(fColumn: number, lColumn: number, lines: number[]){
    this.firstColumn = fColumn
    this.lastColumn = lColumn
    this.rows = lines
  }

  drawBlock(): void {

  }
}