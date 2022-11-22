import { cached } from "reactronic"
import { css } from "@emotion/css"
import { GostTheme } from "gost-pi"

export class AppTheme extends GostTheme {
  panelFillColor: string = ""
  markdown: string = ""

  @cached
  get panel(): string { return css`
    margin: 0.5rem;
    padding: 1rem;
    box-shadow: ${this.shadow};
    border-radius: ${this.borderRadius};
    background-color: ${this.panelFillColor};
  `}


  @cached
  get important(): string { return css`
    border: 1px solid ${this.negativeColor};
  `}
}
