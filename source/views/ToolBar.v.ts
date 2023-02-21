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

                let functions = 'let сетка = app.cellsInfo\n'+
                                'function написать(coordinates, message)\{\n' +
                                '  app.writeFunction(coordinates, message)\n' +
                                '}\n' +
                                '\n' +
                                'function прямоугольник(coordinates, color="black", border = "1px solid")\{\n' +
                                '  app.rectangleFunction(coordinates, color, border)\n' +
                                '}\n'

                if (code !== undefined){
                  // let resultTsCompile = ts.transpile(functions + code)
                  let resultTsCompile = functions + code
                  app.outputBlocks = []
                  // console.log(resultTsCompile)
                  eval(resultTsCompile)
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
