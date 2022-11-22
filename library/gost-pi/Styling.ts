import { ObservableObject, raw } from "reactronic"

export interface StylingParams {
  fillColor: string
  textColor: string
  positiveColor: string
  negativeColor: string
  borderRadius: string
  outlineWidth: string
  outlineColor: string
  outlinePadding: string
  shadow: string
}

export class Styling extends ObservableObject {
  @raw protected readonly $: StylingParams

  constructor($: StylingParams) {
    super()
    this.$ = $
  }
}
