import { Block, Align, line } from "verstak"
import { $theme} from "gost-pi"
import { $app } from "models/App"
import { ToolBar } from "./ToolBar.v"
import { WorkArea } from "./WorkArea.v"
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
        Block(b => {
          b.style(theme.LeftPanel)
          b.style(theme.accent)
          b.contentAlignment = Align.Top
          b.widthGrowth = 3
          b.heightGrowth = 1

          app.setEditor(editor.create(b.native,
            {language: 'typescript', automaticLayout: true, smoothScrolling: true,
            theme: 'vs-dark', fontSize: 18}))
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
    },
  })
)
