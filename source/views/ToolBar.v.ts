import { refs, Transaction } from "reactronic"
import { Block, BlockBody, lineFeed, Img, vmt, Button, PlainText, Label} from "verstak"
import { Markdown } from "verstak-markdown"
import { Icon} from "gost-pi"
import { $app, App } from "models/App"
import { observableModel } from "common/Utils"
import { AppTheme } from "themes/AppTheme"
import { css } from "@emotion/css"

export const ToolBar = (body?: BlockBody<HTMLElement, void, void>) => (
  Block({ ...vmt(body), base: {
    render(b) {
      const app = $app.value
      const theme = app.theme
      //const theme = useContext(GostTheme) as AppTheme
      b.style(theme.panel)
      Block(b => {
        Icon("fa-solid fa-play fa-lg")
        b.style(theme.toolbarButtonRun)
      })
      Block(b => {
        Icon("fa-solid fa-forward-step fa-lg")
        b.style(theme.toolbarButtonStep)
      })
      Block(b => {
        Icon("fa-solid fa-eraser fa-lg")
        b.style(theme.toolbarButtonClear)
      })
      Block(b => {
        Icon("fa-solid fa-palette fa-lg")
        b.style(theme.toolbarButtonChangeColor)
      })
      // Button({ key: "Run",
      //   initialize(b) {
      //     b.style(css`margin 100px;`)
      //     // b.model = observableModel({
      //     //   icon: "fa-solid fa-palette",
      //     //   label: "Run",
      //     //   //action() { app.nextTheme() }
      //     // })
      //   },
      //   render(b) {
      //     Icon("fa-solid fa-play fa-lg")
      //     b.style(theme.toolbarButton)
      //   }
      // })
      // Button({ key: "Run in one step",
      //   initialize(b) {
      //     // b.model = observableModel({
      //     //   icon: "fa-solid fa-palette",
      //     //   label: "Run",
      //     //   //action() { app.nextTheme() }
      //     // })
      //   },
      //   render(b) {
      //     b.style(theme.panel)
      //     Icon("fa-solid fa-forward-step fa-lg")
      //   }
      // })
      // Button({ key: "Clear",
      //   initialize(b) {
      //     // b.model = observableModel({
      //     //   icon: "fa-solid fa-palette",
      //     //   label: "Run",
      //     //   //action() { app.nextTheme() }
      //     // })
      //   },
      //   render(b) {
      //     b.style(theme.panel)
      //     Icon("fa-solid fa-eraser fa-lg")
      //   }
      // })
      // Button({ key: "Change color scheme",
      //   initialize(b) {
      //     // b.model = observableModel({
      //     //   icon: "fa-solid fa-palette",
      //     //   label: "Run",
      //     //   //action() { app.nextTheme() }
      //     // })
      //   },
      //   render(b) {
      //     b.style(theme.panel)
      //     Icon("fa-solid fa-palette fa-lg")
      //   }
      // })
      // Image({ // logo
      //   initialize(b, base) {
      //     base()
      //     b.contentAlignment = Align.Stretch
      //     b.frameAlignment = Align.Stretch
      //     b.model.source = "https://nezaboodka.com/img/star-768x768-circle.png"
      //     b.native.className = cx(s.Panel, s.Clickable, s.Logo)
      //     b.native.onclick = () => Transaction.run(null, () => app.blinkingEffect = !app.blinkingEffect)
      //   },
      //   render(b, base) {
      //     base()
      //     b.native.style.backgroundColor = app.blinkingEffect ? "red" : ""
      //   }
      // })
      // Block({ // Logo
      //   initialize(b) {
      //     b.style(theme.panel)
      //     // b.style(s.Clickable)
      //     // b.style(s.Logo)
      //     b.native.style.outlineOffset = "-1px"
      //     // b.native.onclick = () => Transaction.run(null, () => app.blinkingEffect = !app.blinkingEffect)
      //   },
      //   render(b) {
      //     b.native.style.boxShadow = app.blinkingEffect ? "0.025rem 0.025rem 0.35rem 0 red" : ""
      //     Img(b => {
      //       b.native.src = "https://nezaboodka.com/img/star-768x768-circle.png"
      //     })
      //   }
      // })
      // Block(b => {
      //   b.widthGrowth = 1
      //   b.style(theme.panel)
      //   Block(b => {
      //     b.widthGrowth = 1
      //     Markdown(`**Verstak** v${app.version}`)
      //     lineFeed()
      //     Markdown("Try to *change* window size")
      //   })
      //   Field({
      //     initialize(b) {
      //       const loader = app.loader
      //       b.minWidth = "7em"
      //       b.model = createFieldModel({
      //         icon: "fa-solid fa-search",
      //         text: refs(loader).filter,
      //         options: refs(loader).loaded,
      //         isHotText: true,
      //         isMultiLineText: false,
      //       })
      //     },
      //   })
      // })
      // Block({ // Account
      //   initialize(b) {
      //     // b.native.onclick = () => Transaction.run(null, () => app.nextTheme())
      //   },
      //   render(b) {
      //     b.style(theme.panel)
      //     // b.style(s.Hint)
      //     // b.style(s.Clickable)
      //     Icon("fa-solid fa-bars")
      //   }
      // })
    }},
  })
)
