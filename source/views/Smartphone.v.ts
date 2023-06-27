import { css } from "@emotion/css";
import { AppTheme } from "themes/AppTheme";
import { Align, Block, BlockBody } from "verstak";
import { WorkArea } from "./WorkArea.v";

export const Smartphone = (theme: AppTheme, body?: BlockBody<HTMLElement, void, void>) => (
  Block(body, {reaction: true,
    initialize(b) {

    },
    render(b, base) {

      base()
      b.style(theme.RightPanel)
      b.style(theme.accentColor)
      b.widthGrowth = 3
      b.heightGrowth = 1

      b.contentAlignment = Align.Center | Align.CenterV

      Block({initialize(b){
        b.style(css`
          height: 630px;
          width: 430px;
        `)
      },
      render(){

        WorkArea({render(b, base) {
          base()
        }})

      }})

    }
  })

)