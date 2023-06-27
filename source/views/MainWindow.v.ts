import { Block, Align, line, VBlock } from "verstak"
import { $theme} from "gost-pi"
import { $app } from "models/App"
import { ToolBar } from "./ToolBar.v"
import { editor } from "monaco-editor"
import { Smartphone } from "./Smartphone.v"

const template = `используется артель
используется работа-с-сеткой

выполнить
{
  прямоугольник("D1:H2", "красный", "5px желтый пунктирный")
  очистить(1000)
  сетка.размер_строк[0] = "50px"
  сетка.размер_строк[8] = "100px"

  прямоугольник("D3:H4", "чёрный", "5px желтый пунктирный")
  сетка.количество_столбцов = 15

  сетка.размер_столбцов[0] = "50px"
  сетка.размер_столбцов[8] = "100px"

  очистить(1000)

  прямоугольник("D3:H4", "синий", "5px желтый пунктирный")
  сетка.количество_строк = 12
  сетка.размер_столбцов[9] = "1000px"
  
}
`

export const MainWindow = () => (
  Block({ reaction: true,
    initialize(b) {
      $app.value.sensors.listen(b.native);
    },
    render(b) {
      const app = $app.value;
      const theme = app.theme;
      $theme.value = theme;

      b.contentAlignment = Align.Top;
      b.heightGrowth = 1;
      b.widthGrowth = Number(app.getWidthGrowth());

      let codeEditor : VBlock<HTMLElement, unknown, void> | undefined;
      let grid : VBlock<HTMLElement, unknown, void> | undefined;
      let isResize: boolean = false;

      let splitterMouseMove = (_: MouseEvent) => {
        if (isResize && codeEditor && grid) {
          let editorWidth: number = codeEditor.native.offsetWidth;
          let gridWindowWidth: number = grid.native.offsetWidth;
          let offsetX: number = _.clientX - (codeEditor.native.offsetLeft + editorWidth);

          editorWidth += offsetX;
          gridWindowWidth -= offsetX;

          let editorStyle = editorWidth + 'px';
          codeEditor.native.style.width = editorStyle;
          codeEditor.native.style.maxWidth = editorStyle;

          let gridStyle = gridWindowWidth + 'px';
          grid.native.style.width = gridStyle;
          grid.native.style.maxWidth = gridStyle;
        }
      };

      b.native.addEventListener('mousemove', _ => {
        splitterMouseMove(_);
      });

      b.native.addEventListener('mouseup', _ => {
        isResize = false;
      });

      line(l => {
        codeEditor = Block({reaction: true,
          render(b) {
            b.style(theme.LeftPanel);
            b.contentAlignment = Align.Top;
            b.widthGrowth = 3;
            b.heightGrowth = 1;

            if (app.getEditor() === undefined){
              app.setEditor(editor.create(b.native,
                {
                  automaticLayout: true, 
                  smoothScrolling: true, 
                  theme: 'vs-dark', 
                  fontSize: 18
              }));
            }

            if (app.textModelArtel){
              app.editor?.setModel(app.textModelArtel);
            }

            const codeEditor = app.getEditor()
              codeEditor?.setValue(template);
          }
        })

        Block({
          render(b) {
            b.style(theme.splitter);
            b.heightGrowth = 1;
            b.native.addEventListener('mousemove', _ => {
              b.native.style.cursor = 'col-resize';
              splitterMouseMove(_);
            });
            b.native.addEventListener('mousedown', _ => {
              isResize = true;
            });
            b.native.addEventListener('mouseup', _ => {
              isResize = false;
            });
          }
        })

        //Draw telephone
        grid = Smartphone(theme);
      })

      line(l => {
        ToolBar({
          render(b, base) {
            base();
            b.widthGrowth = 1;
          }
        })
      })
    },
  })
)
