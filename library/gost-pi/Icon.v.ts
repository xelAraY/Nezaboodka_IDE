import { css } from "@emotion/css"
import { cached } from "reactronic"
import { Block, BlockBody, vmt } from "verstak"
import { Styling } from "./Styling"
import { useTheme } from "./Theme"

export interface IconStyling {
  main: string
}

export const Icon = (name: string, body?: BlockBody<HTMLElement, void, void>) => (
  Block({ autonomous: true, ...vmt(body), base: {
    render(b) {
      const s = useTheme().icon
      b.style(name)
      b.style(s.main)
    },
  }})
)

export class DefaultIconStyling extends Styling implements IconStyling {
  @cached get main(): string { return css`
    min-width: 1.25em;
    min-height: auto;
    text-align: center;
  `}
}
