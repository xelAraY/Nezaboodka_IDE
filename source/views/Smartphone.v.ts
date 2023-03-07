import { css } from "@emotion/css";
import { AppTheme } from "themes/AppTheme";
import { Block, BlockBody } from "verstak";
import { WorkArea } from "./WorkArea.v";


export const Smartphone = (theme: AppTheme, body?: BlockBody<HTMLElement, void, void>) => (
  
  Block(body, {
    initialize(b) {
      
    },
    render(b, base) {
      
      base()
      b.style(theme.RightPanel)
      b.style(theme.accent)
      b.widthGrowth = 3
      b.heightGrowth = 1

      WorkArea({
        render(b, base) {
          base()
          b.style(theme.RightPanel)
          b.style(theme.accent)
          b.widthGrowth = 3
          b.heightGrowth = 1
        }
      })

      const style = css`
        border: 1px solid black;`


      b.style(style)
    }
  })

)