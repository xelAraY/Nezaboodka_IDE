import { IBaseBlock } from "./IBaseBlock"

export interface ITextBlock extends IBaseBlock{
	borderStyles: string
  text: string
	textStyles: { color: string, location: string}
}