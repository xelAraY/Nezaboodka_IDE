import { css } from "@emotion/css"
import { Grid, BlockBody, Block, PlainText, HtmlText, lineFeed, line, Align, VBlock } from "verstak"
import { COLUMN_COUNT, ROW_COUNT } from "models/App"

export const WorkArea = (coordinates: string, message: string, body?: BlockBody<HTMLElement, void, void>) => (
  Grid(body, {reaction: true,
      initialize(b){
        b.contentAlignment = Align.Stretch
        b.frameAlignment = Align.Default
      },
      render(b) {
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

        const row = parseInt(coordinates.substr(1,1), 10)-1
        const column = coordinates.substr(0,1).charCodeAt(0)-"A".charCodeAt(0)
        let rows = []
        rows.push(parseInt(coordinates.substr(1,1), 10)-1)
        rows.push(parseInt(coordinates.substr(4,1), 10)-1)
        let yNumber : number = 1
        for (let i = yNumber - 1; i < ROW_COUNT + 1; i++) {
          lineFeed()
          let startColumn = column
          let distance = coordinates.substr(3,1).charCodeAt(0)-coordinates.substr(0,1).charCodeAt(0)+1

          if (i != ROW_COUNT + 1 - 1){
            Ruler(String(yNumber++), Align.Center, false)
            for (var j = 0; j < COLUMN_COUNT; j++){
              if (message !== ''){
                if (row == i && column == j){
                  Block({
                    render(b) {
                      b.native.style.alignItems = 'center'
                      HtmlText(message)
                    }
                  })
                }
                else {
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
                    }
                  })
                }
              }
              else {
                  if ((rows[0] == i || rows[1] == i) && startColumn == j && distance > 0){
                    Block({
                      render(b) {
                        b.native.style.backgroundColor = 'blue'
                      }
                    })
                    startColumn++
                    distance--
                  }
                  else {
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
                      }
                    })
                  }
              }
            }
          }
          else {
            Ruler("", Align.Center)
          }
        }
      }
    }
  )
)

const Ruler = (title: string, frameAlignment: Align, overlap?: boolean) => (
  Block({
    render(b) {
      b.frameAlignment = frameAlignment
      b.cells = { horizontalOverlap: overlap }
      b.native.style.fontSize = 'smaller'
      b.native.style.color = 'black'
      HtmlText(`&nbsp;${title}`)
    }
  })
)