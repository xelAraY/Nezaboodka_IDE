import { css } from "@emotion/css"
import { Grid, BlockBody, Block, PlainText, HtmlText, lineFeed, line, Align, VBlock, P, Group } from "verstak"
import { $app, incrementLetterInCoordinate} from "models/App"
import { Rectangle } from "models/Rectangle"
import { findMaxLetter } from "models/OutputBlock"

export const WorkArea = (body?: BlockBody<HTMLElement, void, void>) => (
  Grid(body, {reaction: true,
      initialize(b){
        b.contentAlignment = Align.Stretch
        b.frameAlignment = Align.Default
        b.native.style.overflow = 'scroll';
      },
      render(b) {
        const app = $app.value
        const columns = app.cellsInfo.ширина
        const rows = app.cellsInfo.высота

        b.native.style.gridTemplateColumns = `repeat(${columns + 2}, 1fr)`
        b.native.style.gridTemplateRows = `repeat(${rows + 2}, 1fr)`
        
        const startSymb : string = 'B'
        const endSymb : string = incrementLetterInCoordinate(findMaxLetter(app.cellsInfo))
      
        for(let i = 0; i < rows; i++) {

          GridRectangle(`${startSymb + (i + 2)}:${endSymb + (i + 2)}`, false, i + 1 == rows, true)
          GridCordText((i + 1).toString(),'A' + (i + 2))
        }

        let prevSymb = 'A'
        for(let i = 0; i < columns; i++) {

          let nextSymb = incrementLetterInCoordinate(prevSymb)
          GridRectangle(`${nextSymb + 2}:${nextSymb + (rows + 1)}`, true, false, false)
          GridCordText(prevSymb, nextSymb + 1)
          prevSymb = nextSymb

        }

        const blocks = app.outputBlocks
        blocks.forEach(element => {
          element.drawBlock(app.cellsInfo)
        });

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

const GridCordText = (title: string, coordinate: string) => (
  Block({
    render(b) {
      b.frameAlignment = Align.Center
      b.native.style.fontSize = 'smaller'
      b.native.style.color = 'black'
      HtmlText(`&nbsp;${title}`)
      b.cells = coordinate
    }
  })
)

const GridRectangle = (coordinate: string, isTransparent: boolean, isNeedBottomBorder: boolean, isNeedRightBorder: boolean) => (
  
  Block({
    initialize(b){
      b.contentAlignment = Align.Stretch
      b.frameAlignment = Align.Default
    },
    render(b) {
      let cssStyle = `margin: 0 rem ;
      padding: 0 ;
      border-width: thin ${isNeedRightBorder ? 'thin' : '0'} ${isNeedBottomBorder ? 'thin' : '0'} thin;
      border-radius: 0 rem;
      border-color: '#655c3f';
      border-style: solid;
      background-color: ${isTransparent ? 'transparent' : '#fdf1ce;'}`
      
      console.log(cssStyle)
      b.style( css`${cssStyle}`)
      b.cells = coordinate
    }
  })

)
