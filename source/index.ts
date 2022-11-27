import { Transaction } from "reactronic"
import { VBlock, HtmlBody, setContext, lineFeed } from "verstak"
import { configureDebugging } from "dbg"
import { App } from "models/App"
import { MainWindow } from "views/MainWindow.v"
import { LightAppTheme } from "themes/LightAppTheme.s"
import { DarkAppTheme } from "themes/DarkAppTheme.s"
import { PrintAppTheme } from "themes/PrintAppTheme.s"

import "../index.reset.css"
import "../public/assets/verstak.css"
import "../index.css"

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
const version: string = "0.1"

configureDebugging()

const app = Transaction.run(null, () =>
  new App(version,
    new LightAppTheme(),
    new DarkAppTheme(),
    new PrintAppTheme()))

VBlock.root(() => {
  HtmlBody({
    autonomous: true,
    render(b) {
      setContext(App, app)
      const t = app.theme
      const css = b.native.style
      css.color = t.textColor
      css.backgroundColor = t.spaceFillColor
      lineFeed() // WORKAROUND
      MainWindow()
    }
  })
})
