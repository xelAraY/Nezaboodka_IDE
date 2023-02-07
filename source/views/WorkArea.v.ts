import { css } from "@emotion/css"
import { Grid, BlockBody, Block, PlainText, HtmlText, lineFeed, line, Align, VBlock, P, Group } from "verstak"
import { $app, COLUMN_COUNT, incrementLetterInCoordinate, ROW_COUNT } from "models/App"
import { Rectangle } from "models/Rectangle"

export const WorkArea = (body?: BlockBody<HTMLElement, void, void>) => (
  Grid(body, {reaction: true,
      initialize(b){
        b.contentAlignment = Align.Stretch
        b.frameAlignment = Align.Default
      },
      render(b) {

        line( (b) => {
          let xPositionString = 'A'
          for (let i = 0; i < COLUMN_COUNT + 2; i++){

            if (i != 0 && i != COLUMN_COUNT + 2 - 1){
              Ruler(xPositionString, Align.Center)
              xPositionString = incrementLetterInCoordinate(xPositionString)
            }
            else{
              Ruler("", Align.Center)
            }

          }
        })
        

        let yNumber : number = 1
        for (let i = yNumber - 1; i < ROW_COUNT + 1; i++) {
          lineFeed(false)
          console.log(COLUMN_COUNT)
          line((b) => {
          if (i != ROW_COUNT + 1 - 1){
            Ruler(String(yNumber++), Align.Center, false)
            for (var j = 0; j < COLUMN_COUNT; j++){
              Block({
                initialize(b){
                  b.contentAlignment = Align.Stretch
                  b.frameAlignment = Align.Default
                },
                render(b) {
                  let cssStyle = `margin: 0 rem ;
                  padding: 0 ;
                  border: 1px solid ;
                  border-radius: 0 rem;
                  border-color: #655c3f;
                  background-color: #fdf1ce;
                  ${$app.value.cellsInfo.размер ? `width: ` + $app.value.cellsInfo.размер + `px`: ``}`
                  console.log(cssStyle)
                  b.style( css`${cssStyle}`
                  // b.cells = {down : i, right : j}
                  )
                }
              })
            }
          }
          else {
            Ruler("", Align.Center)
          }  
        })

        const app = $app.value
        const blocks = app.outputBlocks
        blocks.forEach(element => {
          element.drawBlock()
        });
      }
    }
  })
)

const Ruler = (title: string, frameAlignment: Align, overlap?: boolean) => (
  Block({
    render(b) {
      b.frameAlignment = frameAlignment
      b.cells = { horizontalOverlap: overlap }
      b.native.style.fontSize = 'smaller'
      b.native.style.color = 'black'
      if ($app.value.cellsInfo.размер){
         b.native.style.width = $app.value.cellsInfo.размер?.toString() + 'px'
      }
      HtmlText(`&nbsp;${title}`)
    }
  })
)