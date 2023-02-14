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
import { Rectangle } from "./Rectangle"
import { TextBlock } from "./TextBlock"

const defaultRowCount : number = 10
const defaultColumnCount : number = 10

export interface CellInfo {

  размер: number | undefined  
  ширина: number
	высота: number

}

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
  cellsInfo: CellInfo

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
    this.cellsInfo = this.getDefaultCellsInfo()
  }

  get theme(): AppTheme {
    return this.allThemes[this.activeThemeIndex]
  }

  @reactive
  async updateTextModel(): Promise<void> {
    const client = new ArtelMonacoClient()
    this.textModelArtel = await client.getModel(new Worker())
  }

  parseSecondPoint(coordinates: string): string {
    let colonPos = coordinates.indexOf(":")
    return coordinates.substring(colonPos+1)
  }

  parseFirstPoint(coordinates: string): string {
    let colonPos = coordinates.indexOf(":")
    return coordinates.substring(0, colonPos)
  }

  writeFunction(coordinates: string, message: string): void {
    const outputBlocks = this.outputBlocks = this.outputBlocks.toMutable()
    let firstPoint = this.parseFirstPoint(coordinates)
    let secondPoint = this.parseSecondPoint(coordinates)
    outputBlocks.push(new TextBlock(firstPoint, secondPoint, message))
  }

  rectangleFunction(coordinates: string): void {
    const outputBlocks = this.outputBlocks = this.outputBlocks.toMutable()
    let firstPoint = this.parseFirstPoint(coordinates)
    let secondPoint = this.parseSecondPoint(coordinates)
    outputBlocks.push(new Rectangle(firstPoint, secondPoint))
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

  getDefaultCellsInfo(): CellInfo{
    return {высота : defaultRowCount, ширина : defaultColumnCount, размер : undefined}
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

export function incrementLetterInCoordinate(text: string): string {

  let i: number = text.length
  let isExit: boolean = false
  while (i > 0 && !isExit){
    let lastChar
    if (text.charCodeAt(i - 1) < 'Z'.charCodeAt(0)){
      lastChar = String.fromCharCode(text.charCodeAt(i - 1) + 1)
      isExit = true
    }
    else{
      lastChar = 'A'
    }

    text = text.substring(0, i - 1) + lastChar + text.substring(i)
    i--
  }

  text = text + (!isExit ? 'A' : '')
  return text
}