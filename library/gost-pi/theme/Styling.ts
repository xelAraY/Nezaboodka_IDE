import { ObservableObject, raw } from "reactronic"

export interface AbstractTheme {
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
  @raw protected readonly $: AbstractTheme

  constructor($: AbstractTheme) {
    super()
    this.$ = $
  }
}
