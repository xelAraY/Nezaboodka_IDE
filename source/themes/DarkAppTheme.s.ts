import { css } from "@emotion/css"
import { AppTheme } from "./AppTheme"

export class DarkAppTheme extends AppTheme {
  name = "Dark Theme"
  fillColor = "#14344F"
  textColor = "white"
  positiveColor = "rgb(160, 237, 49)"
  negativeColor = "orangered"
  shadow = "0.1rem 0.1rem 0.5rem 0 black"
  spaceFillColor = "#15293e"
  accentColor = "#FFFFA0"

  markdown = css`
    .toc-inner {
      background-color: rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(0, 0, 0, 0.15);
      /* box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset; */
    }

    pre {
      color: #f0f0f0;
      background-color: rgba(0, 0, 0, 0.2);
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15) inset;
    }

    /* .token {
      color: #D7D7D7;
    } */

    .substitution {
      color: #D7D7D7;
    }

    .token.keyword,
    .token.operator,
    .token.boolean,
    .token.symbol,
    .token.brace-curly,
    .token.brace-square {
      color: #86CCF6;
    }

    .token.kw {
      color: #86CCF6;
    }

    .token.tag {
      /* color: #FFD0D0; */
      /* font-size: 80%; */
      color: #86CCF6;
      font-style: italic;
    }

    .token.punctuation {
      /* color: #9090A0; */
      color: #547289;
    }

    .token.number,
    .token.string,
    .token.string-line {
      color: #FFD0D0;
    }

    .token.string .token.substitution > .token.brace-curly {
      color: #86CCF6;
    }

    .token.comment {
      color: #808090;
      font-style: italic;
    }

    .token.type {
      color: #5EF9C0;
    }

    .token.operation,
    .token.function {
      color: #FFFFA0;
    }
  `
}
