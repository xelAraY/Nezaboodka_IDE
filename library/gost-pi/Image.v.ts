import { Block, BlockBody, vmt } from "verstak"
import { observableModel } from "common/Utils"

export interface ImageModel {
  source?: string
}

export const Image = (body?: BlockBody<HTMLElement, ImageModel>) => (
  Block<ImageModel>({ autonomous: true, ...vmt(body), base: {
    initialize(b) {
      b.model ??= observableModel({ source: undefined })
    },
    render(b) {
      const m = b.model
      b.native.style.backgroundImage = `url(${m.source})`
      b.native.style.backgroundSize = "contain"
      b.native.style.backgroundRepeat = "no-repeat"
    },
  }})
)
