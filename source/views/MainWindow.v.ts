import { refs } from "reactronic"
import { Block, Align, PlainText, useContext, subContext, line, lineFeed } from "verstak"
import { Markdown } from "verstak-markdown"
import { createFieldModel, Field, GostTheme } from "gost-pi"
import { AppTheme } from "themes/AppTheme"
import { App } from "models/App"
import { ToolBar } from "./ToolBar.v"
import { StatusBar } from "./StatusBar.v"
import { WorkArea } from "./WorkArea.v"

export const MainWindow = () => (
  Block({ autonomous: true,
    initialize(b) {
      const app = useContext(App)
      app.sensors.listen(b.native)
    },
    render(b) {
      const app = useContext(App)
      const theme = app.theme
      subContext(GostTheme, theme)

      b.contentAlignment = Align.Top
      b.heightGrowth = 1

      line(l => {
        ToolBar(b => {
          b.widthGrowth = 1
        })
      })

      line(l => { // main line
        Block(b => {
          b.style(app.theme.panel)
          b.minWidth = "10rem"
          b.contentAlignment = Align.Top
          b.frameAlignment = Align.Stretch
          PlainText("Navigation Bar")
          lineFeed()
          Field({
            initialize(b) {
              const loader = app.loader
              b.minWidth = "10em"
              b.model = createFieldModel({
                icon: "fa-solid fa-search",
                text: refs(loader).filter,
                options: refs(loader).loaded,
                isHotText: true,
                isMultiLineText: false,
              })
            },
          })
          lineFeed()
          Block(b => b.heightGrowth = 1)
          lineFeed()
          Field({
            initialize(b) {
              const loader = app.loader
              b.minWidth = "10em"
              b.model = createFieldModel({
                text: refs(loader).filter,
                options: refs(loader).loaded,
                isHotText: true,
                isMultiLineText: false,
              })
            },
          })
        })
        WorkArea({
          render(b) {
            b.style(theme.panel)
            b.style(theme.important)
            b.widthGrowth = 3
            b.heightGrowth = 1
          }
        })
        Block({
          autonomous: true,
          triggers: { theme },
          render(b) {
            b.style(theme.panel)
            b.style(theme.markdown)
            b.minWidth = "16rem"
            b.widthGrowth = 2
            b.contentAlignment = Align.Left + Align.Top,
            b.frameAlignment = Align.Stretch,
            Markdown(EXAMPLE_CODE)
          }
        })
      })

      line(l => {
        StatusBar(b => {
          b.widthGrowth = 1
        })
      })
    },
  })
)

const EXAMPLE_CODE = `
Block size is automatically adjusted to size of table
cells, while cells are automatically adjusted to screen
size of each user. System is suitable both to lay out
application panels and to create reusable components.

\`\`\` js
Grid("Example", {
  render(b) {
    // Blocks can be layed out automatically
    // based on their order and line feeds.
    Ruler("1", Align.Left, true)
    Ruler("A", Align.Top + Align.Center)
    Ruler("B", Align.Top + Align.Center)
    Ruler("C", Align.Top + Align.Center); lineFeed()
    Ruler("2", Align.Left); lineFeed()
    Ruler("3", Align.Left); lineFeed()
    // Blocks can also be layed out
    // explicitly in exact cells.
    ExampleData("B2")
    ExampleData("A1:B1")
    ExampleData("C1:C2")
    ExampleData("B3:C3")
    ExampleData("A2:A3")
  },
})
\`\`\`
`
