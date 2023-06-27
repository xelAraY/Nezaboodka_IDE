import { Block, BlockBody} from "verstak"
import { Button, createFieldModel} from "gost-pi"
import { $app, CellInfo } from "models/App"
import { Transaction } from "reactronic"

const defaultCellSize : number = 35

export const ToolBar = (body?: BlockBody<HTMLElement, void, void>) => (
  Block(body, {
    render(b) {
      const app = $app.value;
      const transactionRun = Transaction.run;
      const theme = app.theme;
      b.style(theme.panel);
      Button({ key: 'Run',
        initialize(b, base) {
          b.model = {
            icon: 'fa-solid fa-play fa-lg',
            label: '',
            action: async () => {
              const editor = app.getEditor();
              app.cellsInfo = app.getDefaultCellsInfo();
              
              if (editor?.getValue() !== undefined){
                let code = app.compileArtel(editor.getValue());
                let functions = `сетка = {
                                    get размер_ячейки() {
                                      return app.cellsInfo.cellSize;
                                    },
                                    set размер_ячейки(value) {
                                      const newHeight = 180+app.cellsInfo.heightCellCount*value
                                      const newWidth = 90 + app.cellsInfo.widthCellCount*value
                                      console.log(newHeight)
                                      console.log(newWidth)
                                      if (!(newHeight > 600 || newWidth > 400) && !(newHeight < 300 || newWidth < 200))
                                        transactionRun(null, () => app.cellsInfo = {...app.cellsInfo, cellSize: value})
                                      else
                                        transactionRun(null, () => app.cellsInfo = {...app.cellsInfo, cellSize: defaultCellSize})
                                    },
                                    get количество_строк() {
                                      return app.cellsInfo.heightCellCount;
                                    },
                                    set количество_строк(value) {
                                      transactionRun(null, () => {
                                        for (let i = app.cellsInfo.heightCellCount; i < value; i++){
                                          this.размер_строк[i] = '';   
                                        }
                                        
                                        app.cellsInfo = {...app.cellsInfo, heightCellCount: value}
                                      })
                                    },
                                    get количество_столбцов() {
                                      return app.cellsInfo.widthCellCount
                                    },
                                    set количество_столбцов(value) {
                                      transactionRun(null, () => {
                                        for (let i = app.cellsInfo.widthCellCount; i < value; i++){
                                          this.размер_столбцов[i] = '';   
                                        }

                                        app.cellsInfo = {...app.cellsInfo, widthCellCount: value}
                                      })
                                    },
                                    get цвет_фона() {
                                      return app.cellsInfo.backgroundColor
                                    },
                                    set цвет_фона(value) {
                                      let color = app.parseColor(value)
                                      if (color == 'anotherColorStyle'){
                                        color = value
                                      }
                                      transactionRun(null, () => app.cellsInfo = {...app.cellsInfo, backgroundColor: color})
                                    },
                                    размер_строк: new Proxy(app.cellsInfo.rowsSize, {
                                      get(target, property){
                                        return target[property]
                                      },
                                      set(target, property, value){
                                        // target = target.toMutable();
                                        if (typeof value == 'string'){
                                          // transactionRun(null, () => {
                                            target[property] = value;
                                            console.log('set ' + value + ' for index ' + property);
                                          // });   
                                        }
                                        return true;
                                      }
                                    }),
                                    размер_столбцов: new Proxy(app.cellsInfo.columnsSize, {
                                      get(target, property){
                                        return target[property]
                                      },
                                      set(target, property, value){
                                        // target = target.toMutable();
                                        if (typeof value == 'string'){
                                          // transactionRun(null, () => {
                                            target[property] = value
                                            console.log('set ' + value + ' for index ' + property)
                                          // });   
                                        }
                                        return true;
                                      }
                                    }),
                                  }\n`+
                                'function вписать(coordinates, message, color="красный", border = "1px solid", textStyles = "black center")\{\n' +
                                '  transactionRun(null, () => app.writeFunction(coordinates, message, color, border, textStyles))\n' +
                                '}\n' +
                                '\n' +
                                'function прямоугольник(coordinates, color = "красный", border = "1px solid")\{\n' +
                                '  transactionRun(null, () => app.rectangleFunction(coordinates, color, border))\n' +
                                '}\n'+
                                'function изображение(coordinates, url)\{\n' +
                                '  transactionRun(null, () => app.drawImageFunction(coordinates, url))\n' +
                                '}\n'+
                                'async function ввести(coordinates, color="красный", border = "1px solid", textStyles = "black center"){\n' +
                                '  return await app.inputFunction(coordinates, color, border, textStyles)\n' +
                                '}\n'+
                                'function Текст_блок(render)\{\n' +
                                '  transactionRun(null, () => app.textBlockFunction(render))\n' +
                                '}\n'+
                                'function Прямоугольник_блок(render)\{\n' +
                                '  transactionRun(null, () => app.rectangleBlockFunction(render))\n' +
                                '}\n'+
                                'async function очистить(time)\{\n' +
                                ' return app.clearFunction(time)\n' +
                                '}\n' +
                                `for (let i = 0; i < app.cellsInfo.heightCellCount; i++){
                                   сетка.размер_строк[i.toString()] = '';
                                  };

                                 for (let i = 0; i < app.cellsInfo.widthCellCount; i++){
                                   сетка.размер_столбцов[i.toString()] = '';
                                 };
                                `

                if (code !== undefined){
                  let resultTsCompile = code.replace('let сетка;', 'let сетка;' + functions );
                  console.log(resultTsCompile);
                  app.outputBlocks = [];
                  eval(resultTsCompile);
                  console.log(app.cellsInfo);
                }
              }
            }
          }
          base();
        },
        render(b, base) {
          base();
          b.style(theme.toolbarButtonRun);
        }
      });

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
          };
          base();
        },
        render(b, base) {
          base();
          b.style(theme.toolbarButtonClear);
        }
      });

      Button({ key: 'Change theme',
        initialize(b, base) {
          b.model = {
            icon: 'fa-solid fa-palette fa-lg',
            label: '',
            action: () => {
              app.nextTheme();
            }
          }
          base();
        },
        render(b, base) {
          base();
          b.style(theme.toolbarButtonChangeTheme);
        }
      });

      Button({ key: 'Change monaco theme',
        initialize(b, base) {
          b.model = {
            icon: 'fa-solid fa-paint-roller fa-lg',
            label: '',
            action: () => {
              app.nextMonacoTheme();
            }
          }
          base();
        },
        render(b, base) {
          base();
          b.style(theme.toolbarButtonChangeTheme);
        }
      });
    }},
  )
)
