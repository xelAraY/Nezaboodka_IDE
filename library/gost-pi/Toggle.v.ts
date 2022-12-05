import { Transaction } from "reactronic"
import { Block, BlockBody, PlainText, vmt } from "verstak"
import { observableModel } from "common/Utils"
import { $theme } from "./Theme"
import { Icon } from "./Icon.v"

export interface ToggleModel {
  label?: string
  checked?: boolean
  color?: string
}

export const Toggle = (body?: BlockBody<HTMLElement, ToggleModel>) => (
  Block<ToggleModel>({ autonomous: true, ...vmt(body), base: {
    initialize(b) {
      b.model ??= observableModel({
        label: b.body.key,
        checked: true,
        color: "green" }) // model is either taken from parameter or created internally
      b.native.onclick = () => Transaction.run(null, () => b.model.checked = !b.model.checked)
    },
    render(b) {
      const m = b.model
      const t = $theme.value
      const s = t.toggle
      b.style(s.main)
      Icon(`fa-solid fa-toggle-${m.checked ? "on" : "off"}`, b => {
        b.style(s.icon)
        b.native.style.color = m.checked ? (t.positiveColor ?? "") : "" // subscribe to ToggleModel.checked
      })
      if (m.label)
        PlainText(m.label, b => b.style(s.label))
    },
  }})
)
