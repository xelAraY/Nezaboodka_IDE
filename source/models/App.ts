import { raw, ObservableObject, reactive, transactional } from "reactronic"
import { BaseHtmlDriver, ContextVariable, HtmlSensors, I, Output } from "verstak"
import { AppTheme } from "themes/AppTheme"
import { Loader } from "./Loader"
import { editor } from "monaco-editor"
import Worker from "../../library/artel/packages/monaco-client/source/worker?worker"
import { Uri, Parser, Compilation, ArtelMonacoClient } from "./ArtelClasses"
import { WorkArea } from "../views/WorkArea.v"
import { $theme} from "gost-pi"
import { IOutputBlock } from "./OutputBlock"


export class App extends ObservableObject {
  version: string
  sensors: HtmlSensors
  allThemes: Array<AppTheme>
  activeThemeIndex: number
  blinkingEffect: boolean
  loader: Loader
  widthGrowthCount: number
  monacoThemes: string[]
  activeMonacoThemeIndex: number
  textModelArtel: editor.ITextModel | undefined
  outputBlocks: Array<IOutputBlock>

  @raw
  editor: editor.IStandaloneCodeEditor | undefined

  constructor(version: string, ...themes: Array<AppTheme>) {
    super()
    this.version = version
    this.sensors = new HtmlSensors()
    this.allThemes = themes
    this.activeThemeIndex = 0
    this.blinkingEffect = false
    this.loader = new Loader()
    this.widthGrowthCount = 3
    this.editor = undefined
    this.monacoThemes = ['vs', 'vs-dark', 'hc-black', 'hc-light']
    this.activeMonacoThemeIndex = 0
    this.textModelArtel = undefined
    this.outputBlocks = []
  }

  get theme(): AppTheme {
    return this.allThemes[this.activeThemeIndex]
  }

  @reactive
  async updateTextModel(): Promise<void> {
    const client = new ArtelMonacoClient()
    this.textModelArtel = await client.getModel(new Worker())
  }

  написать(coordinates: string, message: string): void {

  }

  @transactional
  compileArtel(code: string): string {

    const compilation = new Compilation(new Uri(['project']), [
      {
        uri: new Uri(['project', 'module']),
        sourceFiles: [
          {
            uri: new Uri(['project', 'module', 'sheet.a']),
            syntax: new Parser(code).parse(),
          }
        ]
      }
    ])
    let compilationResult: string
    try {
      const emitterResult = compilation.emitWithDiagnostics()
      //const codeWithHelperFunction = helperArtelFunctions + emitterResult.code
      const codeWithHelperFunction = emitterResult.code
      compilationResult = codeWithHelperFunction
      // const mainFileDiagnostics = emitterResult.diagnostics[1]
      // const syntaxErrors = mainFileDiagnostics.syntax.items.map<LanguageError>((d: { message: any; range: { start: any; length: any } }) => ({
      //   kind: 'syntax',
      //   message: d.message,
      //   span: { start: d.range.start, length: d.range.length }
      // }))
      // const semanticErrors = mainFileDiagnostics.semantic.items.map<LanguageError>((d: { message: any; range: { start: any; length: any } }) => ({
      //   kind: 'semantic',
      //   message: d.message,
      //   span: { start: d.range.start, length: d.range.length }
      // }))
      // compilationResult = {
      //   code: codeWithHelperFunction,
      //   errors: [...syntaxErrors, ...semanticErrors]
      // }
    } catch (_) {
      // compilationResult = {
      //   code: '',
      //   errors: [{ kind: 'semantic', message: 'Emitter error', span: { start: 0, length: 1 } }]
      // }
      compilationResult = 'bad'
    }
    return compilationResult
  }

  @transactional
  nextTheme(): void {
    this.activeThemeIndex = (this.activeThemeIndex + 1) % this.allThemes.length
  }

  @transactional
  nextMonacoTheme(): void {
    this.activeMonacoThemeIndex = (this.activeMonacoThemeIndex + 1) % this.monacoThemes.length
    this.editor?.updateOptions({theme: this.monacoThemes[this.activeMonacoThemeIndex]})
  }

  @reactive
  protected actualizeBrowserTitle(): void {
    document.title = `Verstak Demo ${this.version}`
  }

  @reactive
  protected applyBlinkingEffect(): void {
    BaseHtmlDriver.blinkingEffect = this.blinkingEffect ? "verstak-blinking-effect" : undefined
  }

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

export const ROW_COUNT = 10

export const COLUMN_COUNT = 10