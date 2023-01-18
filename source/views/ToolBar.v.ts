import { Block, BlockBody} from "verstak"
import { Button, createFieldModel} from "gost-pi"
import { $app } from "models/App"

export const ToolBar = (body?: BlockBody<HTMLElement, void, void>) => (
  Block(body, {
    render(b) {
      const app = $app.value
      const theme = app.theme
      b.style(theme.panel)
      Button({ key: 'Run',
        initialize(b, base) {
          b.model = {
            icon: 'fa-solid fa-play fa-lg',
            label: '',
            action: () => {
              const editor = app.getEditor()
              if (editor?.getValue() !== undefined){
                let code = app.compileArtel(editor.getValue())
                if (code !== undefined){
                  alert(eval(code))
                }
              }
            }
          }
          base()
        },
        render(b, base) {
          base()
          b.style(theme.toolbarButtonRun)
        }
      })
      Button({ key: 'Run in one step',
        initialize(b, base) {
          b.model = {
            icon: 'fa-solid fa-forward-step fa-lg',
            label: '',
            action: () => alert('123')
          }
          base()
        },
        render(b, base) {
          base()
          b.style(theme.toolbarButtonStep)
        }
      })
      Button({ key: 'Clear',
        initialize(b, base) {
          b.model = {
            icon: 'fa-solid fa-eraser fa-lg',
            label: '',
            action: () => {
              let editor = app.getEditor()
              if (editor !== undefined){
                editor?.setValue('')
              }
            }
          }
          base()
        },
        render(b, base) {
          base()
          b.style(theme.toolbarButtonClear)
        }
      })
      Button({ key: 'Change theme',
        initialize(b, base) {
          b.model = {
            icon: 'fa-solid fa-palette fa-lg',
            label: '',
            action: () => {
              let codeEditor = app.getEditor()
              app.nextTheme()

            }
          }
          base()
        },
        render(b, base) {
          base()
          b.style(theme.toolbarButtonChangeTheme)
        }
      })
      Button({ key: 'Change monaco theme',
        initialize(b, base) {
          b.model = {
            icon: 'fa-solid fa-paint-roller fa-lg',
            label: '',
            action: () => {
              app.nextMonacoTheme()
            }
          }
          base()
        },
        render(b, base) {
          base()
          b.style(theme.toolbarButtonChangeTheme)
        }
      })
    }},
  )
)
