import { raw, ObservableObject, reactive, transactional } from "reactronic"
import { BaseHtmlDriver, ContextVariable, HtmlSensors, I, Output } from "verstak"
import { AppTheme } from "themes/AppTheme"
import { Loader } from "./Loader"
import { editor } from "monaco-editor"
import Worker from "../../library/artel/packages/monaco-client/source/worker?worker"
import { IOutputBlock } from "./OutputBlock"
import { Rectangle } from "./Rectangle"
import { TextBlock } from "./TextBlock"
import { InputBlock } from "./InputBlock"
import { ArtelMonacoClient } from "../../library/artel/packages/monaco-client/source"
import { DirectoryNode, FileNode, ProjectGraph, ProjectTreeCursor, SourceFileState, Workspace } from "../../library/artel/packages/compiler/source/project"
import { Uri } from "../../library/artel/packages/compiler/source/common"
import { Emitter } from "../../library/artel/packages/compiler/source/compilation/Emitter"
import { Diagnostic } from "../../library/artel/packages/compiler/source/diagnostic/Diagnostic"
import { collectDiagnostics } from "../../library/artel/packages/compiler/source/analysis/collect-diagnostics"
import { ITextBlock } from "interfaces/ITextBlock"


const defaultRowCount : number = 10
const defaultColumnCount : number = 10
const defaultBackgroundCOlor : string = 'white'

export interface CellInfo {

  size: number | undefined
  heightCellCount: number
	widthCellCount: number
  backgroundColor: string

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

  private gridModuleSourceCode: string = `
  используется артель

  тип ИнформацияОСетке = объект
  {
    размер: Число?
    количество_строк: Число
    количество_столбцов: Число
    цвет_фона: Текст
  }

  тип Прямоугольник_блок = объект
  {
    координаты: Текст
    цвет_фона: Текст
    стили_границы: Текст
  }

  тип Текстовый_блок = объект
  {
    координаты: Текст
    цвет_фона: Текст
    стили_границы: Текст
    текст: Текст
    стили_текста: Текст
  }

  тип ФункцияРендера<T> = операция(блок: T): Ничего

  сетка: ИнформацияОСетке

  внешняя операция прямоугольник(координаты: Текст, цвет: Текст = "чёрный", граница: Текст = "1px")

  внешняя операция вписать(координаты: Текст, сообщение: Текст, цвет: Текст = "чёрный", граница: Текст = "1px", стиль: Текст = "black center")

  внешняя операция ввести(координаты: Текст, цвет: Текст = "чёрный", граница: Текст = "1px", стиль: Текст = "black center")

  внешняя операция Текст(рендер: ФункцияРендера<Текстовый_блок>)

  внешняя операция Прямоугольник(рендер: ФункцияРендера<Прямоугольник_блок>)
  `

  @reactive
  async updateTextModel(): Promise<void> {
    const client = new ArtelMonacoClient([{
      name: 'работа-с-сеткой',
      sourceFiles: [{name: 'grid.art', text: this.gridModuleSourceCode}]
    }])
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

  parseColor(color: string): string {
    switch(color){
      case 'желтый':
        return 'yellow'
      case 'красный':
        return 'red'
      case 'зеленый':
        return 'green'
      case 'белый':
        return 'white'
      case 'синий':
        return 'blue'
      case 'фиолетовый':
        return 'purple'
      case 'чёрный':
        return 'black'
      default:
        return this.parseAnotherColorView(color)
    }
  }

  parseAnotherColorView(color: string): string {
    if (color.startsWith('rgb') || color.startsWith('rgba') || (color.startsWith('#') && color.length === 7)){
      return 'anotherColorStyle'
    }
    return 'unknown'
  }

  parseBorder(border: string): string {
    switch(border){
      case 'сплошной':
        return 'solid'
      case 'пунктирный':
        return 'dashed'
      case 'точечный':
        return 'dotted'
      default:
        return 'unknown'
    }
  }

  parseBorderStyles(borderStyles: string): string {
    let index = 0
    let startIndex = 0
    let result = ''
    let isRGBColor: boolean = false
    while (index < borderStyles.length){
      while (index < borderStyles.length && borderStyles[index+1] !== ' ') {
        index++
      }
      index++
      const style = borderStyles.substring(startIndex, index)
      let newStyle = this.parseColor(style.trim())
      if (newStyle === 'unknown'){
        newStyle = this.parseBorder(style.trim())
        if (newStyle === 'unknown'){
          newStyle = style
        }
      }
      else if(newStyle === 'anotherColorStyle') {
        if (style.trim().indexOf(')') === -1){
          while (borderStyles[index] !== ')' && index < borderStyles.length){
            index++
          }
          index++
        }

        newStyle = borderStyles.substring(startIndex, index)
      }
      result+= newStyle+' '
      startIndex = index
    }
    return result
  }

  parseLocation(text: string): string {
    switch(text){
      case 'центр':
        return 'center'
      case 'слева':
        return 'flex-start'
      case 'справа':
        return 'flex-end'
      default:
        return 'unknown'
    }
  }

  parseTextStyles(textStyles: string) {
    let index = 0
    let startIndex = 0
    let result = { color: 'black', location: 'center' }
    while (index < textStyles.length){
      while (index < textStyles.length && textStyles[index+1] !== ' ') {
        index++
      }
      index++
      const style = textStyles.substring(startIndex, index)
      let newStyle = this.parseColor(style.trim())
      if (newStyle === 'unknown'){
        newStyle = this.parseLocation(style.trim())
        if (newStyle === 'unknown'){
          alert('Unknown style for text!')
        }
        else {
          result.location = newStyle
        }
      }
      else if(newStyle === 'anotherColorStyle') {
        if (style.trim().indexOf(')') === -1){
          while (textStyles[index] !== ')' && index < textStyles.length){
            index++
          }
          index++
        }

        result.color = textStyles.substring(startIndex, index)
      }
      else {
        result.color = newStyle
      }

      startIndex = index
    }
    return result
  }

  writeFunction(coordinates: string, message: string, color: string, borderStyles: string, textStyles: string): void {
    const outputBlocks = this.outputBlocks = this.outputBlocks.toMutable()
    let firstPoint = this.parseFirstPoint(coordinates)
    let secondPoint = this.parseSecondPoint(coordinates)
    let enColor = this.parseColor(color.trim())
    if (enColor === 'anotherColorStyle'){
      enColor = color.trim()
    }
    const border = this.parseBorderStyles(borderStyles.trim())
    const textSt = this.parseTextStyles(textStyles.trim())
    outputBlocks.push(new TextBlock(firstPoint, secondPoint, message, enColor, border, textSt))
  }

  async inputFunction(coordinates: string, color: string, borderStyles: string, textStyles: string): Promise<string> {

    const outputBlocks = this.outputBlocks = this.outputBlocks.toMutable()

    let firstPoint = this.parseFirstPoint(coordinates)
    let secondPoint = this.parseSecondPoint(coordinates)
    let enColor = this.parseColor(color)
    if (enColor === 'anotherColorStyle'){
      enColor = color.trim()
    }

    const border = this.parseBorderStyles(borderStyles.trim())
    const textSt = this.parseTextStyles(textStyles.trim())


    const inputBlock = new InputBlock(firstPoint, secondPoint, enColor, border, textSt)

    const text: string = await inputBlock.getUserInput()

    outputBlocks.push(inputBlock)
    return Promise.resolve<string>(text)

  }

  rectangleFunction(coordinates: string, color: string, borderStyles: string): void {
    const outputBlocks = this.outputBlocks = this.outputBlocks.toMutable()
    let firstPoint = this.parseFirstPoint(coordinates)
    let secondPoint = this.parseSecondPoint(coordinates)
    let enColor = this.parseColor(color.trim())
    if (enColor === 'anotherColorStyle'){
      enColor = color.trim()
    }
    const border = this.parseBorderStyles(borderStyles.trim())
    outputBlocks.push(new Rectangle(firstPoint, secondPoint, enColor, border))
  }

  @transactional
  compileArtel(code: string): string {

    const fileSystemTree =
      new DirectoryNode(
        new Uri(['project']),
        [
          new FileNode(
            new Uri(['project', 'main.art']),
            new SourceFileState(code, 0)
          ),
          new FileNode(
            new Uri(['project', 'artel.project']),
            new SourceFileState('', 0)
          ),
          new DirectoryNode(
            new Uri(['project', 'работа-с-сеткой']),
            [
              new FileNode(
                new Uri(['project', 'работа-с-сеткой', 'grid.art']),
                new SourceFileState(this.gridModuleSourceCode, 0)
              ),
            ]
          )
        ]
      )


    const workspace = new Workspace([fileSystemTree])
    const project = workspace.projects[0]
    if (project.kind !== 'standard')
      throw new Error('Internal error')
    const emitter = new Emitter(project)

    function collectProjectDiagnostics(project: ProjectGraph) {
      const diagnosticsByFileUri = new Map<string, Diagnostic[]>()
      const cursor = ProjectTreeCursor.fromProject(project, false)
      for (const sourceFile of cursor.enumerateSourceFiles()) {
        const diagnostics = [...sourceFile.syntax.diagnostics.items]
        const semanticDiagnostics = collectDiagnostics(project.ctx, sourceFile.syntax)
        diagnostics.push(...semanticDiagnostics)
        diagnosticsByFileUri.set(sourceFile.uri.toString(), diagnostics)
      }
      return diagnosticsByFileUri
    }
    console.log(collectProjectDiagnostics(project))
    const compiledCode = emitter.emitToString()

    return compiledCode
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
    return {heightCellCount : defaultRowCount, widthCellCount : defaultColumnCount, size : undefined, backgroundColor: defaultBackgroundCOlor}
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