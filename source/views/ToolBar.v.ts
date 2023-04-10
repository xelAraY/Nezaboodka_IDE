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
            action: async () => {
              const editor = app.getEditor()
              if (editor?.getValue() !== undefined){
                let code = app.compileArtel(editor.getValue())

                let functions = `сетка = {  
                                    get количество_строк() {
                                      return app.cellsInfo.heightCellCount;
                                    },
                                    set количество_строк(value) {
                                      app.cellsInfo = {...app.cellsInfo, heightCellCount: value}
                                    },
                                    get количество_столбцов() {
                                      return app.cellsInfo.widthCellCount
                                    },
                                    set количество_столбцов(value) {
                                      app.cellsInfo = {...app.cellsInfo, widthCellCount: value}
                                    } 
                                  }\n`+
                                'function написать(coordinates, message, color="красный", border = "1px solid", textStyles = "black center")\{\n' +
                                '  app.writeFunction(coordinates, message, color, border, textStyles)\n' +
                                '}\n' +
                                '\n' +
                                'function прямоугольник(coordinates, color = "красный", border = "1px solid")\{\n' +
                                '  app.rectangleFunction(coordinates, color, border)\n' +
                                '}\n'+
                                'async function ввести(coordinates, color="красный", border = "1px solid", textStyles = "black center"){\n' +
                                '  return await app.inputFunction(coordinates, color, border, textStyles)\n' +
                                '}\n'


                if (code !== undefined){
                  let resultTsCompile = code.replace('(async () => {__artel__run__0();})()', functions + '(async () => {__artel__run__0();})()')
                  app.outputBlocks = []
                  eval(resultTsCompile)
                  console.log(app.cellsInfo)
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


function translateCellInfoOnLatin (code: string): string {
  
  let result = code.replace(/размер/g, 'size')
  result = result.replace(/количество_строк/g, 'heightCellCount')
  return result.replace(/количество_столбцов/g, 'widthCellCount')

}