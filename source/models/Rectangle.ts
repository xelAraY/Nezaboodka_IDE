import { IOutputBlock, parseCoordinate } from "./OutputBlock"
import { Block } from "verstak"
import { css } from "@emotion/css"
import { CellInfo } from "./App"

export class Rectangle implements IOutputBlock {
	firstPoint: string
	secondPoint: string
	color: string
	borderStyles: string

	constructor(firstPoint: string, secondPoint: string, color: string, borderStyles: string){
		this.firstPoint = firstPoint
		this.secondPoint = secondPoint
		this.color = color
		this.borderStyles = borderStyles
	}

	drawBlock(cellsInfo: CellInfo): void {
		const cell = parseCoordinate(this.firstPoint, cellsInfo) + ':' + parseCoordinate(this.secondPoint, cellsInfo)
		const color = this.color
		const borderStyles = this.borderStyles
		Block({
			render(b){
			  b.style( css`margin: 0 rem ;
			  padding: 0 ;`)
			  b.cells = cell
				b.native.style.backgroundColor = color
				b.native.style.border = borderStyles
			}
		})
	}
}