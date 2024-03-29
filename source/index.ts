import { Transaction } from "reactronic"
import { VBlock, HtmlBody, lineFeed } from "verstak"
import { configureDebugging } from "dbg"
import { $app, App } from "models/App"
import { MainWindow } from "views/MainWindow.v"
import { LightAppTheme } from "themes/LightAppTheme.s"
import { DarkAppTheme } from "themes/DarkAppTheme.s"
import { PrintAppTheme } from "themes/PrintAppTheme.s"

import "../index.reset.css"
import "../public/assets/verstak.css"
import "../index.css"

const version: string = "0.1"

configureDebugging()

const app = Transaction.run(null, () =>
  new App(version,
    new LightAppTheme(),
    new DarkAppTheme(),
    new PrintAppTheme()))

VBlock.root(() => {
  HtmlBody({
    reaction: true,
    render(b) {
      $app.value = app;
      const t = app.theme;
      const css = b.native.style;
      css.color = t.textColor;
      css.backgroundColor = t.spaceFillColor;
      lineFeed(); // WORKAROUND
      MainWindow();
    }
  });
})
