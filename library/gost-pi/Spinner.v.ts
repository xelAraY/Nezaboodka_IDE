import { Block, BlockBody, PlainText } from "verstak"
import { observableModel, ValuesOrRefs } from "common/Utils"

export interface SpinnerModel {
  active: boolean
  color: string
}

export function Spinner(body?: BlockBody<HTMLElement, SpinnerModel>) {
  return (
    Block<SpinnerModel>(body, {
      reaction: true,
      initialize(b) {
        b.model ??= createLocalModel()
      },
      render(b) {
        const m = b.model
        m.active && PlainText("loading...")
      },
    })
  )
}

export function createLocalModel<T>(props?: Partial<ValuesOrRefs<SpinnerModel>>): SpinnerModel
{
  return observableModel({
    active: props?.active ?? false,
    color: props?.color ?? "",
  })
}
