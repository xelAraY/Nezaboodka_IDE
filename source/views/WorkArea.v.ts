import { css } from "@emotion/css"
import { Grid, BlockBody, Block, PlainText, HtmlText, lineFeed, line, Align, vmt, VBlock } from "verstak"
import { COLUMN_COUNT, ROW_COUNT } from "models/App"

export const WorkArea = (body?: BlockBody<HTMLElement, void, void>) => (
  Grid({ ...vmt(body), base: {
      initialize(b){
        b.contentAlignment = Align.Stretch
        b.frameAlignment = Align.Default
      },
      render(b) { 
        // //Draw grid
        // for (var i = 0; i < ROW_COUNT; i++){
          // for (var j = 0; j < COLUMN_COUNT; j++){
            
          //   // Block({
          //   //   initialize(b){
          //   //     b.contentAlignment = Align.Stretch
          //   //     b.frameAlignment = Align.Default
          //   //   },
          //   //   render(b) {
          //   //     const theme = $theme.value as AppTheme
          //   //     // b.style(theme.panel)
          //   //     b.style( css`margin: 0 rem ;
          //   //       padding: 0 ;
          //   //       border: 1px solid ;
          //   //       border-radius: 0 rem;
          //   //       border-color: #655c3f;
          //   //       background-color: #fdf1ce;`)
          //   //     b.cells = {down : i, right : j}
          //   //   }
          //   // })
          // }      
        //}
        
        let xPositionString = 'A'
        for (let i = 0; i < COLUMN_COUNT + 2; i++){
          
          if (i != 0 && i != COLUMN_COUNT + 2 - 1){
            Ruler(xPositionString, Align.Center)
          
            xPositionString = xPositionString.substring(0, xPositionString.length - 1)
                     + String.fromCharCode(xPositionString.charCodeAt(xPositionString.length - 1) + 1)
          }
          else{
            Ruler("", Align.Center)
          }

        }
        
        let yNumber : number = 1
        for (let i = yNumber - 1; i < ROW_COUNT + 1; i++) {
          lineFeed()
          if (i != ROW_COUNT + 1 - 1){
            Ruler(String(yNumber++), Align.Center, false)
            for (var j = 0; j < COLUMN_COUNT; j++){
              
              Block({
                initialize(b){
                  b.contentAlignment = Align.Stretch
                  b.frameAlignment = Align.Default
                },
                render(b) {
                  b.style( css`margin: 0 rem ;
                    padding: 0 ;
                    border: 1px solid ;
                    border-radius: 0 rem;
                    border-color: #655c3f;
                    background-color: #fdf1ce;`)
                  // b.cells = {down : i, right : j}
                }
              })
            }
          } 
          else {
            Ruler("", Align.Center)
          }
        }

      }
    }
  })
)

const Ruler = (title: string, frameAlignment: Align, overlap?: boolean) => (
  Block(b => {
    b.frameAlignment = frameAlignment
    b.cells = { horizontalOverlap: overlap }
    b.native.style.fontSize = 'smaller'
    HtmlText(`&nbsp;${title}`)
  })
)