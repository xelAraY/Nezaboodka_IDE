import { Transaction } from "reactronic"
import { Block, BlockBody, PlainText, FocusModel, lineFeed, vmt, ReactingFocuser } from "verstak"
import { observableModel, ValuesOrRefs } from "common/Utils"
import { $theme, FieldStyling } from "./Theme"
import { Icon } from "./Icon.v"

export interface FieldModel<T = string> extends FocusModel {
  icon?: string
  text: string
  options: Array<T>
  selected: T | undefined
  multiSelected: Set<T>
  position: number // scroll
  isMultiLineText: boolean
  isHotText: boolean
  inputStyle: string
}

export const Field = (body?: BlockBody<HTMLElement, FieldModel>) => (
  Block<FieldModel>({ autonomous: true, ...vmt(body), base: {
    initialize(b) {
      b.model ??= createFieldModel()
      b.native.dataForSensor.focus = b.model
      b.native.onscroll = () => {
        b.model.position = b.native.scrollTop
      }
    },
    render(b) {
      const m = b.model
      const s = $theme.value.field
      b.style(s.main)
      if (m.icon)
        Icon(m.icon, b => b.style(s.icon))
      FieldInput(m, s)
      FieldPopup(m, s)
    },
  }})
)

export function createFieldModel<T>(props?: Partial<ValuesOrRefs<FieldModel<T>>>): FieldModel<T> {
  return observableModel({
    icon: props?.icon,
    text: props?.text ?? "",
    options: props?.options ?? [],
    selected: props?.selected,
    multiSelected: props?.multiSelected ?? new Set<T>(),
    position: 0,
    isMultiLineText: props?.isMultiLineText ?? false,
    isEditMode: props?.isEditMode ?? false,
    isHotText: props?.isHotText ?? false,
    inputStyle: props?.inputStyle ?? "",
  })
}

function FieldInput(model: FieldModel, s: FieldStyling) {
  return (
    PlainText(model.text, {
      key: FieldInput.name,
      initialize(b) {
        const e = b.native
        b.style(s.input)
        b.widthGrowth = 1
        e.tabIndex = 0
        e.contentEditable = "true"
        e.dataForSensor.focus = model
        e.onkeydown = event => {
          const m = model
          if (isApplyKey(m, event))
            selectAllAndPreventDefault(event, e)
        }
        e.onkeyup = event => {
          const m = model
          if (isApplyKey(m, event)) {
            selectAllAndPreventDefault(event, e)
            Transaction.run(null, () => m.text = e.innerText)
          }
          else if (m.isHotText)
            Transaction.run(null, () => { m.text = e.innerText })
        }
      },
      redefinedRender(b) {
        const e = b.native
        if (!model.isEditMode)
          e.innerText = model.text
        ReactingFocuser(e, model)
      },
    })
  )
}

const FieldPopup = (model: FieldModel, s: FieldStyling) => (
  Block({ // popup itself
    key: FieldPopup.name,
    initialize(b) {
      const e = b.native
      e.onscroll = () => model.position = e.scrollTop
    },
    render(b) {
      b.style(s.popup)
      const visible = b.overlayVisible = model.isEditMode
      if (visible) {
        const options = model.options
        if (options.length > 0) {
          for (const x of model.options) {
            lineFeed()
            PlainText(x, { key: x })
          }
        }
        else
          PlainText("(nothing)", { key: "(nothing)" })
      }
    },
  })
)

function isApplyKey(m: FieldModel, event: KeyboardEvent): boolean {
  return event.key === "Enter" && (
    !m.isMultiLineText || event.shiftKey || event.ctrlKey || event.metaKey)
}

function selectAllAndPreventDefault(event: KeyboardEvent, e: HTMLElement): void {
  const range = document.createRange()
  range.selectNodeContents(e)
  const sel = window.getSelection()
  sel?.removeAllRanges()
  sel?.addRange(range)
  event.preventDefault()
}
