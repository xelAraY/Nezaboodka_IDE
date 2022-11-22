import { css } from "@emotion/css"
import { cached } from "../../library/reactronic/source/Rx"
import { AppTheme } from "./AppTheme"

export class LightAppTheme extends AppTheme {
  name = "Light Theme"
  fillColor = "#F0F0F0"
  textColor = "black"
  panelFillColor = "white"

  markdown = css`
    .toc-inner {
      background-color: unset;
      border: 1px solid rgba(0, 0, 0, 0.25);
      /* box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05) inset; */
    }
    pre {
      color: #000000;
      background-color: inherit;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25) inset;
    }
    .substitution {
      color: #202020;
    }
    .token.comment {
      color: #A0A0A0;
      font-style: italic;
    }
    .token.number,
    .token.string,
    .token.string-line {
      color: #027111;
    }
    .token.string .token.substitution > .token.brace-curly {
      color: #2222CC;
    }
    .token.type {
      color: #469FA9;
    }
    .token.operation,
    .token.function {
      color: #930505;
    }
    .token.keyword,
    .token.operator,
    .token.boolean,
    .token.symbol,
    .token.brace-curly,
    .token.brace-square {
      color: #2222CC;
    }
    .token.kw {
      color: #2222CC;
    }
    .token.tag {
      /* color: #027111; */
      /* font-size: 80%; */
      color: #2222CC;
      font-style: italic;
    }
    .token.punctuation {
      color: #B0B0B0;
      /* color: #abade9; */
    }
  `
}
