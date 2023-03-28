import { Block, Input } from "verstak";
import { CellInfo } from "./App";
import { IOutputBlock, parseCoordinate } from "./OutputBlock";
import { TextBlock } from "./TextBlock";


export class InputBlock implements IOutputBlock {


  private text: string = ''
  private firstPoint: string
  private secondPoint: string
  private color: string
  private borderStyles: string
  private textStyles: {color: string, location: string}

  private isItInputProcess: boolean = true;


  constructor(firstPoint: string, secondPoint: string, color: string, borderStyles: string, textStyles: { color: string, location: string}) {
    
    this.firstPoint = firstPoint
    this.secondPoint = secondPoint
    this.color = color
    this.borderStyles = borderStyles
    this.textStyles = textStyles

  }



  drawBlock(cellsInfo: CellInfo): void {
  
    new TextBlock(this.firstPoint, this.secondPoint, this.text, this.color, this.borderStyles, this.textStyles).drawBlock(cellsInfo)
      
  }

  async getUserInput(cellsInfo: CellInfo): Promise<string> {

    const cell = parseCoordinate(this.firstPoint, cellsInfo) + ':' + parseCoordinate(this.secondPoint, cellsInfo)
    const inputBlock = Input({render(b) {
      
      b.cells = cell
      b.native.type = 'text'

    }})

    return new Promise<string>(function(res, rej) {
      
      inputBlock.native.addEventListener('keydown', e => {
        
      })
    })

  }

}