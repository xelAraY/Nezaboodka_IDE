import { IOutputBlock, parseCordinate } from "./OutputBlock"
import { Block, HtmlText } from "verstak"
import { css } from "@emotion/css"
import { CellInfo } from "./App"

export class TextBlock implements IOutputBlock {
  firstPoint: string
	secondPoint: string
  text: string

	constructor(firstPoint: string, secondPoint: string, text: string){
		this.firstPoint = firstPoint
		this.secondPoint = secondPoint
    this.text = text
	}

	drawBlock(cellsInfo: CellInfo): void {
		const cell = parseCordinate(this.firstPoint, cellsInfo) + ':' + parseCordinate(this.secondPoint, cellsInfo)
    const text = this.text
		Block({
			render(b){
			  b.style( css`margin: 0 rem;
			  padding: 0;
			  border: 1px solid;
			  border-radius: 0 rem;
			  border-color: #655c3f;
			  background: rgba(253, 241, 206, 0);
        align-items: center;`)
			  b.cells = cell
        HtmlText(text)
			}
		  })
	}
}