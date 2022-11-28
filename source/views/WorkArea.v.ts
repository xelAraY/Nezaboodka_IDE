import { GostTheme } from "gost-pi"
import { AppTheme } from "themes/AppTheme"
import { Grid, BlockBody, Block, PlainText, HtmlText, lineFeed, Align, vmt, useContext } from "verstak"

export const WorkArea = (body?: BlockBody<HTMLElement, void, void>) => (
  Grid({ ...vmt(body), base: {
    render(b) {
      // Blocks can be layed out automatically
      // based on their order and line feeds.
      // Ruler("1", Align.Left, true)
      // Ruler("A", Align.Top + Align.Center)
      // Ruler("B", Align.Top + Align.Center)
      // Ruler("C", Align.Top + Align.Center); lineFeed()
      // Ruler("2", Align.Left); lineFeed()
      // Ruler("3", Align.Left); lineFeed()
      // Blocks can also be layed out
      // explicitly in exact cells.
      const squareCountWidth = Math.trunc(window.innerWidth/20)
      const sqareCountHeight = Math.trunc(window.innerHeight/20)

      for (var i = 1; i < 3; i++){
        for (var j = 'A'; j < 'A'+3; j+=1){
          console.log(j.toString()+i.toString())
          ExampleData(j.toString()+i.toString())
        }
        lineFeed()
      }

      //ExampleData("A1")
      // ExampleData("A1:B1")
      // ExampleData("C1:C2")
      // ExampleData("B3:C3")
      // ExampleData("A2:B2")
      // ExampleData("A3")
    }},
  })
)

const Ruler = (title: string, frameAlignment: Align, overlap?: boolean) => (
  Block(b => {
    b.frameAlignment = frameAlignment
    b.cells = { horizontalOverlap: overlap }
    b.native.style.fontSize = "smaller"
    HtmlText(`&nbsp;${title}`)
  })
)

const ExampleData = (place: string) => (
  Block({
    initialize(b) {
      b.contentAlignment = Align.Center + Align.CenterV
    },
    render(b) {
      const theme = useContext(GostTheme) as AppTheme
      b.cells = place
      b.style(theme.accent)
      PlainText(place)
    }
  })
)
