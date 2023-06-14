import { css } from "@emotion/css"
import { Grid, BlockBody, Block, PlainText, HtmlText, lineFeed, line, Align, VBlock, P, Group } from "verstak"
import { $app, incrementLetterInCoordinate, CellInfo, DEFAULT_CELL_SIZE} from "models/App"
import { findMaxLetter } from "models/OutputBlock"

export const WorkArea = (body?: BlockBody<HTMLElement, void, void>) => (
  Grid(body, {reaction: true,
    initialize(b){
      b.widthGrowth = 3
      b.heightGrowth = 1
      b.style(css`
        height: 630px;
        width: 430px;`)
    },
    render(b){

      const app = $app.value
      console.log(app.cellsInfo.backgroundColor)
      const columns = app.cellsInfo.widthCellCount
      const rows = app.cellsInfo.heightCellCount
      console.log(columns)
      console.log(rows)

      b.native.style.gridTemplateColumns = getGridTemplateColumns(app.cellsInfo); //`30px 30px repeat(${columns}, ${app.cellsInfo.cellSize.toString()+'px'}) 30px`
      b.native.style.gridTemplateRows = getGridTemplateRows(app.cellsInfo); //`30px 50px repeat(${rows}, ${app.cellsInfo.cellSize.toString()+'px'}) 100px`

      const startSymb : string = 'C'
      const endSymb : string = incrementLetterInCoordinate(incrementLetterInCoordinate(findMaxLetter(app.cellsInfo)))
      const phoneEndSymb: string = incrementLetterInCoordinate(endSymb)

      Block({
          initialize(b){

            const telephoneCorpusStyle: string = css`

              margin: 0 rem;
              border: 1px solid black;
              border-radius: 10%;
              background-color: black;`

            b.style(telephoneCorpusStyle)
            b.contentAlignment = Align.Stretch
            b.frameAlignment = Align.Default

          },
          render(b) {
            b.cells = `B2:${phoneEndSymb}${rows + 3}`
          }
        })

      for(let i = 0; i < rows; i++) {

        GridRectangle(`${startSymb + (i + 3)}:${endSymb + (i + 3)}`, false, i + 1 == rows, true, app.cellsInfo.backgroundColor)
        GridCordText((i + 1).toString(),'A' + (i + 3))
      }

      let prevSymb = 'B'
      let cordSymb = 'A'
      for(let i = 0; i < columns; i++) {

        let nextSymb = incrementLetterInCoordinate(prevSymb)
        GridRectangle(`${nextSymb + 3}:${nextSymb + (rows + 2)}`, true, false, false, app.cellsInfo.backgroundColor)
        GridCordText(cordSymb, nextSymb + 1)
        cordSymb = incrementLetterInCoordinate(cordSymb)
        prevSymb = nextSymb

      }

      const block = app.outputBlocks;
      block.forEach(b => b.drawBlock(app.cellsInfo));
    }})
)

// const Ruler = (title: string, frameAlignment: Align, overlap?: boolean) => (
//   Block({
//     render(b) {
//       b.frameAlignment = frameAlignment
//       b.cells = { horizontalOverlap: overlap }
//       b.native.style.fontSize = 'smaller'
//       b.native.style.color = 'black'
//       if ($app.value.cellsInfo.size){
//          b.native.style.width = $app.value.cellsInfo.size?.toString() + 'px'
//       }
//       HtmlText(`&nbsp;${title}`)
//     }
//   })
// )

export const GridCordText = (title: string, coordinate: string) => (
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

export const GridRectangle = (coordinate: string, isTransparent: boolean, isNeedBottomBorder: boolean, isNeedRightBorder: boolean, backgroundColor: string) => (

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
      background-color: ${isTransparent ? 'transparent' : backgroundColor}`

      console.log(cssStyle)
      b.style( css`${cssStyle}`)
      b.cells = coordinate
    }
  })

)

function getGridTemplateColumns(cellInfo: CellInfo): string {
  let result = '30px 30px';
  let countEmpty = 0;
  
  for (let i = 0; i < cellInfo.widthCellCount; i++){
    if (!cellInfo.columnsSize[i]){
      countEmpty++;
    } else {
      if (countEmpty) {
        result += ` repeat(${countEmpty}, ${DEFAULT_CELL_SIZE + 'px'})`;
        countEmpty = 0;
      }
      
      result += ' ' + cellInfo.columnsSize[i];
    }
  }

  if (countEmpty) {
    result += ` repeat(${countEmpty}, ${DEFAULT_CELL_SIZE + 'px'})`;
  }

  return result + ' 30px';
}

function getGridTemplateRows(cellInfo: CellInfo): string {
  let result = '30px 50px';
  let countEmpty = 0;

  for (let i = 0; i < cellInfo.heightCellCount; i++){
    if (!cellInfo.rowsSize[i]){
      countEmpty++;
    } else {
      if (countEmpty){
        result += ` repeat(${countEmpty}, ${DEFAULT_CELL_SIZE + 'px'})`;
        countEmpty = 0;
      }

      result += ' ' + cellInfo.rowsSize[i];
    }
  }

  if (countEmpty){
    result += ` repeat(${countEmpty}, ${DEFAULT_CELL_SIZE + 'px'})`;
  }

  return result + ' 100px';
}