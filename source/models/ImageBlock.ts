import { IOutputBlock, parseCoordinate } from "./OutputBlock"
import { Align, Block, HtmlText, Img } from "verstak"
import { css } from "@emotion/css"
import { CellInfo } from "./App"
import { Image } from "gost-pi"

export class ImageBlock implements IOutputBlock {
	firstPoint: string
	secondPoint: string
  url: string

	constructor(firstPoint: string, secondPoint: string, url: string){
		this.firstPoint = firstPoint
		this.secondPoint = secondPoint
    this.url = url
	}

	drawBlock(cellsInfo: CellInfo, addRender?: () => void): void {
		const cell = parseCoordinate(this.firstPoint, cellsInfo) + ':' + parseCoordinate(this.secondPoint, cellsInfo)
    const url = this.url
    Block({
			render(b){
			  b.style( css`margin: 0 rem;
			  padding: 0;`)
			  b.cells = cell
				b.native.style.alignItems = 'center'
        b.native.style.display = 'flex'
        b.native.style.justifyContent = 'center'
				b.contentAlignment = Align.CenterV | Align.Center
        b.native.style.backgroundImage = `url(${url})`
        b.native.style.backgroundSize = '100% 100%'
        b.native.style.backgroundRepeat = 'no-repeat'
				addRender?.()
			}
		})
  }

}