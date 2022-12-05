import { cached } from "reactronic"
import { css } from "@emotion/css"
import { DefaultGostTheme } from "../../library/gost-pi/Theme"

export class AppTheme extends DefaultGostTheme {
  accentColor: string = ""
  spaceFillColor: string = ""
  markdown: string = ""

  @cached
  get panel(): string { return css`
    margin: 0.5rem ;
    padding: 1rem;
    box-shadow: ${this.shadow};
    border-radius: ${this.borderRadius};
    background-color: ${this.fillColor};
  `}

  @cached
  get LeftPanel(): string { return css`
    margin: 0.5rem 0rem 0.5rem 0.5rem;
    padding: 0rem;
    box-shadow: ${this.shadow};
    border-radius: ${this.borderRadius};
    background-color: ${this.fillColor};
  `}

  @cached
  get RightPanel(): string { return css`
    margin: 0.5rem 0.5rem 0.5rem 0rem;
    padding: 0rem;
    box-shadow: ${this.shadow};
    border-radius: ${this.borderRadius};
    background-color: ${this.fillColor};
  `}

  @cached
  get accent(): string { return css`
    border: 1px solid ${this.accentColor};
  `}

  @cached
  get toolbarButton(): string { return css`
    margin: 10px;
    color: green;
  `}
}
