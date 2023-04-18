import { IOutputBlock, parseCoordinate } from "./OutputBlock"
import { Align, Block, HtmlText } from "verstak"
import { css } from "@emotion/css"
import { CellInfo } from "./App"
import { BaseBlock } from "./BaseBlock"

export class TextBlock extends BaseBlock implements IOutputBlock {
	borderStyles: string
  text: string
	textStyles: { color: string, location: string}

	constructor(firstPoint: string, secondPoint: string, text: string, color: string, borderStyles: string, textStyles: { color: string, location: string}){
		super(firstPoint, secondPoint, color)
    this.text = text
		this.textStyles = textStyles
		this.borderStyles = borderStyles
	}

	drawBlock(cellsInfo: CellInfo): void {
		const cell = parseCoordinate(this.firstPoint, cellsInfo) + ':' + parseCoordinate(this.secondPoint, cellsInfo)
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