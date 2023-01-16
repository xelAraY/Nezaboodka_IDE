import { Block, BlockBody } from "verstak"
import { observableModel } from "common/Utils"

export interface ImageModel {
  source?: string
}

export function Image(body?: BlockBody<HTMLElement, ImageModel>) {
  return (
    Block<ImageModel>(body, {
      reaction: true,
      initialize(b) {
        b.model ??= observableModel({ source: undefined })
      },
      render(b) {
        const m = b.model
        b.native.style.backgroundImage = `url(${m.source})`
        b.native.style.backgroundSize = "contain"
        b.native.style.backgroundRepeat = "no-repeat"
      },
    })
  )
}
