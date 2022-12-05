import { cached } from "reactronic"
import { css } from "@emotion/css"
import { Styling } from "./Styling"

export interface ButtonStyling {
  main: string
  icon: string
  label: string
}

export class DefaultButtonStyling extends Styling implements ButtonStyling {

  @cached get main(): string { return css`
    cursor: pointer;
    border-radius: ${this.$.borderRadius};
    user-select: none;
  `}

  @cached get icon(): string { return css`
    min-width: auto;
    margin-left: ${this.$.outlinePadding};
    margin-right: ${this.$.outlinePadding};
  `}

  @cached get label(): string { return css`
    margin-left: ${this.$.outlinePadding};
    margin-right: ${this.$.outlinePadding};
  `}
}
