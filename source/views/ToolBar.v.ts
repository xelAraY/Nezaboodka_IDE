import { Block, BlockBody} from "verstak"
import { Button, createFieldModel} from "gost-pi"
import { $app, CellInfo } from "models/App"
import * as ts from 'typescript'

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

                let сетка : CellInfo = app.getDefaultCellsInfo()

                let functions = 'function написать(coordinates: string, message: string): void\{\n' +
                                '  app.написать(coordinates, message)\n' +
                                '}\n' +
                                '\n' +
                                'function прямоугольник(coordinates: string): void \{\n' +
                                '  app.прямоугольник(coordinates)\n' +
                                '}\n'

                if (code !== undefined){
                  let resultTsCompile = ts.transpile(functions + code)
                  app.outputBlocks = []
                  // console.log(resultTsCompile)
                  eval(resultTsCompile)
                  app.cellsInfo = сетка
                  app.updateVariables()
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
              app.outputBlocks = []
              app.outputBlocks.toMutable()
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
