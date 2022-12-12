import { Block, Align, line, VBlock } from "verstak"
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

      let codeEditor : VBlock<HTMLElement, unknown, void> | undefined = undefined
      let grid : VBlock<HTMLElement, unknown, void> | undefined = undefined
      let mousePrevPos: number | undefined = undefined
      let isResize: boolean = false

      let splitterMouseMove = (_: MouseEvent) => {
        if (isResize && codeEditor && grid) {
          let editorWidth: number = codeEditor.native.offsetWidth
          let gridWindowWidth: number = grid.native.offsetWidth

          if (mousePrevPos === undefined) {
            mousePrevPos = _.pageX
          }

          let offsetX = (_.pageX - mousePrevPos)
          editorWidth += offsetX
          gridWindowWidth -= offsetX

          let editorStyle = editorWidth + 'px'
          codeEditor.native.style.width = editorStyle
          codeEditor.native.style.maxWidth = editorStyle

          let gridStyle = gridWindowWidth + 'px'
          grid.native.style.width = gridStyle
          grid.native.style.maxWidth = gridStyle

          mousePrevPos = _.pageX
        }
      }

      b.native.addEventListener('mousemove', _ => {
        splitterMouseMove(_)
      })
      b.native.addEventListener('mouseup', _ => {
        isResize = false
        mousePrevPos = undefined
      })

      line(l => {

        codeEditor = Block(b => {

          b.style(theme.LeftPanel)
          b.style(theme.accent)
          b.contentAlignment = Align.Top
          b.widthGrowth = 3
          b.heightGrowth = 1

          if (app.getEditor() === undefined){
            app.setEditor(editor.create(b.native,
              {language: 'typescript', automaticLayout: true, smoothScrolling: true,
              theme: 'vs-dark', fontSize: 18}))
          }
        })


        Block(b => {
          b.style(theme.spliter)
          b.heightGrowth = 1
          b.native.addEventListener('mousemove', _ => {
            b.native.style.cursor = 'col-resize'
            splitterMouseMove(_)
          })
          b.native.addEventListener('mousedown', _ => {
            isResize = true
          })
          b.native.addEventListener('mouseup', _ => {
            isResize = false
            mousePrevPos = undefined
          })

        })


        grid = WorkArea({
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
