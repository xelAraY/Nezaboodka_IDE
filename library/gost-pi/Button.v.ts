import { cached, Transaction } from "reactronic"
import { Block, BlockBody, PlainText, vmt } from "verstak"
import { css } from "@emotion/css"
import { observableModel } from "common/Utils"
import { Styling } from "./Styling"
import { useTheme } from "./Theme"
import { Icon } from "./Icon.v"

export interface ButtonModel {
  icon?: string
  label?: string
  action?(): void
}

export interface ButtonStyling {
  main: string
  icon: string
  label: string
}

export const Button = (body?: BlockBody<HTMLElement, ButtonModel>) => (
  Block<ButtonModel>({ autonomous: true, ...vmt(body), base: {
    initialize(b) {
      b.model ??= observableModel({
        icon: "fa-solid fa-square",
        label: b.body.key,
      })
      b.native.onclick = () => Transaction.run(null, () => b.model.action?.())
    },
    render(b) {
      const m = b.model
      const s = useTheme().button
      b.style(s.main)
      if (m.icon)
        Icon(m.icon, b => b.style(s.icon))
      if (m.label)
        PlainText(m.label, b => b.style(s.label))
    },
  }})
)

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
