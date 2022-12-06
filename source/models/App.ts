import { ObservableObject, reactive, transactional, cached } from "reactronic"
import { BaseHtmlDriver, ContextVariable, HtmlSensors } from "verstak"
import { AppTheme } from "themes/AppTheme"
import { Loader } from "./Loader"
import { editor } from "monaco-editor"


export class App extends ObservableObject {
  version: string
  sensors: HtmlSensors
  allThemes: Array<AppTheme>
  activeThemeIndex: number
  blinkingEffect: boolean
  loader: Loader
  widthGrowthCount: number
  editor: editor.IStandaloneCodeEditor | undefined

  constructor(version: string, ...themes: Array<AppTheme>) {
    super()
    this.version = version
    this.sensors = new HtmlSensors()
    this.allThemes = themes
    this.activeThemeIndex = 0
    this.blinkingEffect = false
    this.loader = new Loader()
    this.widthGrowthCount = 2
  }

  get theme(): AppTheme {
    return this.allThemes[this.activeThemeIndex]
  }

  @transactional
  nextTheme(): void {
    this.activeThemeIndex = (this.activeThemeIndex + 1) % this.allThemes.length
  }

  @reactive
  protected actualizeBrowserTitle(): void {
    document.title = `Verstak Demo ${this.version}`
  }

  @reactive
  protected applyBlinkingEffect(): void {
    BaseHtmlDriver.blinkingEffect = this.blinkingEffect ? "verstak-blinking-effect" : undefined
  }

  @cached
  public getWidthGrowth():Number{
    return this.widthGrowthCount
  }

  public setEditor (editor: editor.IStandaloneCodeEditor): void{
    this.editor = editor
  }

  public getEditor(): editor.IStandaloneCodeEditor | undefined{
    return this.editor
  }
}

export const $app = new ContextVariable<App>()