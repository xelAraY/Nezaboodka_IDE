import { Block, BlockBody} from "verstak"
import { Button} from "gost-pi"
import { $app } from "models/App"
import { editor } from "monaco-editor"

export const ToolBar = (body?: BlockBody<HTMLElement, void, void>) => (
  Block(body, {
    render(b) {
      const app = $app.value
      const theme = app.theme
      //const theme = useContext(GostTheme) as AppTheme
      b.style(theme.panel)
      Button({ key: "Run",
        initialize(b) {
          b.model = {
            icon: "fa-solid fa-play fa-lg",
            label: "",
            action: () => alert("123")
          }
        },
        render(b) {
          b.style(theme.toolbarButtonRun)
        }
      })
      Button({ key: "Run in one step",
        initialize(b) {
          b.model = {
            icon: "fa-solid fa-forward-step fa-lg",
            label: "",
            action: () => alert("123")
          }
        },
        render(b) {
          b.style(theme.toolbarButtonStep)
        }
      })
      Button({ key: "Clear",
        initialize(b) {
          b.model = {
            icon: "fa-solid fa-eraser fa-lg",
            label: "",
            action: () => {
              let editor = app.getEditor()
              if (editor !== undefined){
                editor?.setValue('')
              }
            }
          }
        },
        render(b) {
          b.style(theme.toolbarButtonClear)
        }
      })
      Button({ key: "Change theme",
        initialize(b) {
          b.model = {
            icon: "fa-solid fa-palette fa-lg",
            label: "",
            action: () => {
              let codeEditor = app.getEditor()
              app.nextTheme()

            }
          }
        },
        render(b) {
          b.style(theme.toolbarButtonChangeTheme)
        }
      })
      Button({ key: "Change monaco theme",
        initialize(b) {
          b.model = {
            icon: "fa-solid fa-paint-roller fa-lg",
            label: "",
            action: () => {
              app.nextMonacoTheme()
            }
          }
        },
        render(b) {
          b.style(theme.toolbarButtonChangeTheme)
        }
      })
    }},
  )
)
