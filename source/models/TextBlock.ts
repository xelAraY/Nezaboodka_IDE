import { IOutputBlock } from "./OutputBlock"

export class TextBlock implements IOutputBlock {
  firstColumn: number
  lastColumn:number
  rows: number[]
  text: string

  constructor(fColumn: number, lColumn: number, lines: number[], message: string){
    this.firstColumn = fColumn
    this.lastColumn = lColumn
    this.rows = lines
    this.text = message
  }

  drawBlock(): void {

  }
}