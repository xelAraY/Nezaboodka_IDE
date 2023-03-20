import { css } from "@emotion/css";
import { AppTheme } from "themes/AppTheme";
import { Block, BlockBody } from "verstak";
import { WorkArea } from "./WorkArea.v";


export const Smartphone = (theme: AppTheme, body?: BlockBody<HTMLElement, void, void>) => (
  
  Block(body, {
    initialize(b) {
      
    },
    render(b, base) {
      
      base()
      b.style(theme.RightPanel)
      b.style(theme.accent)
      b.widthGrowth = 3
      b.heightGrowth = 1

      Block({
        initialize(b){

          const telephoneCorpusStyle: string = css`
            
            margin: auto;
            height: 600px;
            width: 400px;
            padding: 50px 30px 100px 30px;
            border: 1px solid black;
            border-radius: 10%;
            background-color: black;`

          b.style(telephoneCorpusStyle)

        },
        render(b) {
          WorkArea({
            render(b, base) {
              base()
              b.style(theme.gridField)
              b.style(theme.accent)
              b.widthGrowth = 3
              b.heightGrowth = 1
            }
          })

        }
      })
      
    }
  })

)