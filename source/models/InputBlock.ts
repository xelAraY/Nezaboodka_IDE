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
    
    if (this.isItInputProcess) {
      console.log('sad')
      const cell = parseCoordinate(this.firstPoint, cellsInfo) + ':' + parseCoordinate(this.secondPoint, cellsInfo)
      const inputBlock = Input({render(b) {
        
        b.cells = cell
        b.native.type = 'text'
  
      }})
  
      const context = this;        
      inputBlock.native.addEventListener('keydown', e => {
        if (e.key == 'Enter') {
          context.text = inputBlock.native.value
          context.isItInputProcess = false
          inputBlock.native.remove()
        }
      })


    }else {

      new TextBlock(this.firstPoint, this.secondPoint, this.text, this.color, this.borderStyles, this.textStyles).drawBlock(cellsInfo)
      
    }
  
  }

  async getUserInput(): Promise<string> {

    const context = this
    return new Promise<string>(resolve => {
      const interval = setInterval(() => {
        if (!context.isItInputProcess) {
          clearInterval(interval)
          resolve(context.text)
        }

      })
    })
  }

}