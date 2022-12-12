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
    height: 90vh;
  `}

  @cached
  get RightPanel(): string { return css`
    margin: 0.5rem 0.5rem 0.5rem 0rem;
    padding: 0rem;
    box-shadow: ${this.shadow};
    border-radius: ${this.borderRadius};
    background-color: ${this.fillColor};
    height: 90vh;
  `}

  @cached
  get accent(): string { return css`
    border: 1px solid ${this.accentColor};
  `}

  @cached
  get toolbarButtonRun(): string { return css`
    margin: 10px;
    color: green;
    cursor: pointer;
  `}

  @cached
  get toolbarButtonStep(): string { return css`
    margin: 10px;
    color: black;
    cursor: pointer;
  `}

  @cached
  get toolbarButtonClear(): string { return css`
    margin: 10px;
    color: black;
    cursor: pointer;
  `}

  @cached
  get toolbarButtonChangeTheme(): string { return css`
    margin: 10px;
    color: #EB9F1D;
    cursor: pointer;
  `}

  @cached
  get spliter(): string { return css`
    border: 0px solid black;
    background-color: white;
    width: 3px;
    opacity: 0.0;
    margin: 5px 0px 10px 0px;
  `}
}
