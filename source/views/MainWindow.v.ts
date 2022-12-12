import { refs } from "reactronic"
import { Block, Align, PlainText, line, lineFeed, VBlock } from "verstak"
import { Markdown } from "verstak-markdown"
import { $theme, createFieldModel, Field} from "gost-pi"
import { $app, App } from "models/App"
import { ToolBar } from "./ToolBar.v"
import { StatusBar } from "./StatusBar.v"
import { WorkArea } from "./WorkArea.v"
import { css } from "@emotion/css"
import { editor } from "monaco-editor"

export const MainWindow = () => (
  Block({ autonomous: true,
    initialize(b) {

      $app.value.sensors.listen(b.native)
    },
    render(b) {
      const app = $app.value
      const theme = app.theme
      $theme.value = theme

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

        let codeEditor = Block(b => {

          b.style(theme.LeftPanel)
          b.style(theme.accent)
          b.contentAlignment = Align.Top
          b.widthGrowth = 3
          b.heightGrowth = 1

          app.setEditor(editor.create(b.native,
            {language: 'typescript', automaticLayout: true, smoothScrolling: true,
            theme: 'vs-dark', fontSize: 18}))

          // Field({
          //   initialize(b) {
          //     const loader = app.loader
          //     b.widthGrowth = 3
          //     b.heightGrowth = 1
          //     b.contentAlignment = Align.Top
          //     // b.model = createFieldModel({
          //     //   // icon: "fa-solid fa-search",
          //     //   //text: "refs(loader).filter",
          //     //   text: "",
          //     //   options: new Array<string>(0),
          //     //   isHotText: true,
          //     //   isMultiLineText: true,
          //     //   })

          //   },

          //   render(b){
          //     b.style(css`
          //     background-color: #d9e8fb;`)
          //   }
          // })
        })

        let spliter = Block(b => {
          b.style(theme.spliter)
          b.heightGrowth = 1
          b.native.addEventListener('mousemove', _ => {
            b.native.style.cursor = 'col-resize'
          })

        })


        let grid = WorkArea({
          render(b) {
            b.style(theme.RightPanel)
            b.style(theme.accent)
            b.widthGrowth = 3
            b.heightGrowth = 1
          }
        })
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
