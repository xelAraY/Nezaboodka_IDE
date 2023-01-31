import { IOutputBlock, parseCordinate } from "./OutputBlock"
import { Block } from "verstak"
import { css } from "@emotion/css"

export class Rectangle implements IOutputBlock {
	cell: string

	constructor(firstPoint: string, secondPoint: string){
		this.cell = parseCordinate(firstPoint) + ':' + parseCordinate(secondPoint)
	}

	drawBlock(): void {
		const cell = this.cell
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