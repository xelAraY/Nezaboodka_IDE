
export class BaseBlock {
	firstPoint: string
	secondPoint: string
	color: string

	constructor(firstPoint: string, secondPoint: string, color: string){
		this.firstPoint = firstPoint
		this.secondPoint = secondPoint
		this.color = color
	}
}
