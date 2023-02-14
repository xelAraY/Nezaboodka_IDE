import { IOutputBlock, parseCordinate } from "./OutputBlock"
import { Block } from "verstak"
import { css } from "@emotion/css"
import { CellInfo } from "./App"

export class Rectangle implements IOutputBlock {
	firstPoint: string
	secondPoint: string

	constructor(firstPoint: string, secondPoint: string){
		this.firstPoint = firstPoint
		this.secondPoint = secondPoint
	}

	drawBlock(cellsInfo: CellInfo): void {
		const cell = parseCordinate(this.firstPoint, cellsInfo) + ':' + parseCordinate(this.secondPoint, cellsInfo)
		Block({
			render(b){
			  b.style( css`margin: 0 rem ;
			  padding: 0 ;
			  border: 1px solid ;
			  border-radius: 0 rem;
			  border-color: #655c3f;
			  background-color: #000000;`)
			  b.cells = cell
			}
		  })
	}
}