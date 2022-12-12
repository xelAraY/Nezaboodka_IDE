import { css } from "@emotion/css"
import { $theme} from "gost-pi"
import { AppTheme } from "themes/AppTheme"
import { Grid, BlockBody, Block, PlainText, HtmlText, lineFeed, Align, vmt } from "verstak"

export const WorkArea = (body?: BlockBody<HTMLElement, void, void>) => (
  Grid({ ...vmt(body), base: {
    render(b) {
      const squareCountWidth = Math.trunc((window.innerHeight)/20 )
      const sqareCountHeight = Math.trunc((window.innerHeight)/20 )

      //Draw grid
      for (var i = 0; i < sqareCountHeight / 2; i++){
        for (var j = 0; j < squareCountWidth / 2; j++){
          Block({
            initialize(b){
              b.contentAlignment = Align.Stretch
              b.frameAlignment = Align.Default
            },
            render(b) {
              const theme = $theme.value as AppTheme
              // b.style(theme.panel)
              b.style( css`margin: 0 rem ;
                padding: 0 ;
                border: 1px solid;
                border-radius: 0 rem;
                border-color: #655c3f;
                background-color: #fdf1ce;`)
              b.cells = {down : i, right : j}
            }
          })

        }
        lineFeed()
      }
    }},
  })
)
