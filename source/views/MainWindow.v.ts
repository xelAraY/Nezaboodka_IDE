import { refs } from "reactronic"
import { Block, Align, PlainText, useContext, setContext, line, lineFeed } from "verstak"
import { Markdown } from "verstak-markdown"
import { createFieldModel, Field, GostTheme } from "gost-pi"
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
      setContext(GostTheme, theme)

      b.contentAlignment = Align.Top
      b.heightGrowth = 1
      b.widthGrowth = Number(app.getWidthGrowth())

      line(l => { // main line
        // Block(b => {
        //   b.style(app.theme.panel)
        //   b.minWidth = "10rem"
        //   b.contentAlignment = Align.Top
        //   b.frameAlignment = Align.Stretch
        //   PlainText("Navigation Bar")
        //   lineFeed()
        //   Field({
        //     initialize(b) {
        //       const loader = app.loader
        //       b.minWidth = "10em"
        //       b.model = createFieldModel({
        //         icon: "fa-solid fa-search",
        //         text: refs(loader).filter,
        //         options: refs(loader).loaded,
        //         isHotText: true,
        //         isMultiLineText: false,
        //       })
        //     },
        //   })
        //   lineFeed()
        //   Block(b => b.heightGrowth = 1)
        //   lineFeed()
        //   Field({
        //     initialize(b) {
        //       const loader = app.loader
        //       b.minWidth = "10em"
        //       b.model = createFieldModel({
        //         text: refs(loader).filter,
        //         options: refs(loader).loaded,
        //         isHotText: true,
        //         isMultiLineText: false,
        //       })
        //     },
        //   })
        // })

        Block(b => {
          b.style(theme.LeftPanel)
          b.style(theme.accent)
          b.contentAlignment = Align.Top
          b.widthGrowth = 3
          b.heightGrowth = 1
          Field({
            initialize(b) {
            const loader = app.loader
            b.widthGrowth = 3
            b.heightGrowth = 1
            b.contentAlignment = Align.Top
            b.model = createFieldModel({
              // icon: "fa-solid fa-search",
              //text: "refs(loader).filter",
              text: "",
              options: new Array<string>(0),
              isHotText: true,
              isMultiLineText: true,
              })
            },

            render(b){

            }
          })
        })

        WorkArea({
          render(b) {
            b.style(theme.RightPanel)
            b.style(theme.accent)
            b.widthGrowth = 3
            b.heightGrowth = 1
          }
        })

        // Block({
        //   autonomous: true,
        //   triggers: { theme },
        //   render(b) {
        //     b.style(theme.panel)
        //     b.style(theme.markdown)
        //     b.minWidth = "16rem"
        //     b.widthGrowth = 2
        //     b.contentAlignment = Align.Left + Align.Top,
        //     b.frameAlignment = Align.Stretch,
        //     Markdown(EXAMPLE_CODE)
        //   }
        // })
      })

      line(l => {
        ToolBar(b => {
          b.widthGrowth = 1
        })
      })

      // line(l => {
      //   StatusBar(b => {
      //     b.widthGrowth = 1
      //   })
      // })
    },
  })
)
