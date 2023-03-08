import { IOutputBlock, parseCordinate } from "./OutputBlock"
import { Align, Block, HtmlText } from "verstak"
import { css } from "@emotion/css"
import { CellInfo } from "./App"

export class TextBlock implements IOutputBlock {
  firstPoint: string
	secondPoint: string
  text: string
	color: string
	borderStyles: string
	textStyles: { color: string, location: string}

	constructor(firstPoint: string, secondPoint: string, text: string, color: string, borderStyles: string, textStyles: { color: string, location: string}){
		this.firstPoint = firstPoint
		this.secondPoint = secondPoint
    this.text = text
		this.color = color
		this.borderStyles = borderStyles
		this.textStyles = textStyles
	}

	drawBlock(cellsInfo: CellInfo): void {
		const cell = parseCordinate(this.firstPoint, cellsInfo) + ':' + parseCordinate(this.secondPoint, cellsInfo)
    const text = this.text
		const color = this.color
		const borderStyles = this.borderStyles
		const textStyles = this.textStyles
		Block({
			render(b){
			  b.style( css`margin: 0 rem;
			  padding: 0;`)
			  b.cells = cell
				// b.native.style.alignItems = 'mid'
				b.contentAlignment = Align.CenterV | Align.Center
				b.native.style.backgroundColor = color
				b.native.style.border = borderStyles
				b.native.style.alignItems = textStyles.location
				b.native.style.color = textStyles.color
        HtmlText(text)
			}
		})
	}
}