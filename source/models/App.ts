import { raw, ObservableObject, reactive, transactional, Transaction, options } from "reactronic"
import { BaseHtmlDriver, ContextVariable, HtmlSensors, I, Output } from "verstak"
import { AppTheme } from "themes/AppTheme"
import { Loader } from "./Loader"
import { editor } from "monaco-editor"
import Worker from "../../library/artel/packages/monaco-client/source/worker?worker"
import { IOutputBlock } from "./OutputBlock"
import { Rectangle } from "./Rectangle"
import { TextBlock } from "./TextBlock"
import { InputBlock } from "./InputBlock"
import { ImageBlock } from "./ImageBlock"
import { ArtelMonacoClient } from "../../library/artel/packages/monaco-client/source"
import { DirectoryNode, FileNode, ProjectGraph, ProjectTreeCursor, SourceFileState, Workspace } from "../../library/artel/packages/compiler/source/project"
import { Uri } from "../../library/artel/packages/compiler/source/common"
import { Emitter } from "../../library/artel/packages/compiler/source/compilation/Emitter"
import { Diagnostic } from "../../library/artel/packages/compiler/source/diagnostic/Diagnostic"
import { collectDiagnostics } from "../../library/artel/packages/compiler/source/analysis/collect-diagnostics"
import { ITextBlock } from "interfaces/ITextBlock"
import { IRectangle } from "interfaces/IRectangle"
import { BlockNode } from "./Tree"
import { IBaseBlock } from "interfaces/IBaseBlock"


const defaultRowCount : number = 10
const defaultColumnCount : number = 10
const defaultBackgroundCOlor : string = 'white'
const defaultCellSize : number = 35

export interface CellInfo {

  cellSize: number
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

  private readonly newProperty = this

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
    размер_ячейки: Число?
    количество_строк: Число
    количество_столбцов: Число
    цвет_фона: Текст
  }

  тип Прямоугольник_Блок = объект
  {
    координаты: Текст
    цвет_фона: Текст
    стили_границы: Текст
  }

  тип Текстовый_Блок = объект
  {
    координаты: Текст
    цвет_фона: Текст
    стили_границы: Текст
    текст: Текст
    стили_текста: Текст
  }

  тип ФункцияРендера<T> = операция(блок: T)

  сетка: ИнформацияОСетке

  внешняя операция изображение(координаты: Текст, путь: Текст)

  внешняя операция прямоугольник(координаты: Текст, цвет: Текст = "чёрный", граница: Текст = "1px")

  внешняя операция вписать(координаты: Текст, сообщение: Текст, цвет: Текст = "чёрный", граница: Текст = "1px", стиль: Текст = "black center")

  внешняя операция ввести(координаты: Текст, цвет: Текст = "чёрный", граница: Текст = "1px", стиль: Текст = "black center")

  внешняя операция Текст-блок(рендер: ФункцияРендера<Текстовый_Блок>)

  внешняя операция Прямоугольник_блок(рендер: ФункцияРендера<Прямоугольник_Блок>)

  внешняя параллельная операция очистить(время: Число = 0)
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

  @raw
  renderTree: BlockNode<any> | null = null;

  textBlockFunction(operation: (block: ITextBlock) => void): void {

    let block: ITextBlock = { coordinates: '', color:'', text:'', borderStyles:'', textStyles:{ color: '', location:''}}

    if (this.renderTree) {
      this.renderTree.addChild(new BlockNode<ITextBlock>((b, innerOperations) => {
        new TextBlock(
          this.parseFirstPoint(b.coordinates),
          this.parseSecondPoint(b.coordinates),
          b.text,
          this.parseColor(b.color.trim()),
          this.parseBorderStyles(b.borderStyles.trim()),
          b.textStyles
        ).drawBlock(this.cellsInfo, innerOperations)
      }, this.renderTree, block))
      this.renderTree = this.renderTree.lastChild;
    }
    else {
      this.renderTree = new BlockNode<ITextBlock>((b, innerOperations) => {
        new TextBlock(this.parseFirstPoint(b.coordinates),this.parseSecondPoint(b.coordinates), b.text, b.color, b.borderStyles, b.textStyles).drawBlock(this.cellsInfo, innerOperations)
      }, null, block)

    }

    operation(block)
    translateFromCyrillicTextBlock(block, this)
    // пуш элемента в массив outputBlocks
    if (this.renderTree.parent != null) {
      this.renderTree = this.renderTree.parent;
    }
    else {
      const parent = this.renderTree
      const outputBlocks = this.outputBlocks = this.outputBlocks.toMutable();
      outputBlocks.push({drawBlock: (info) => {
        parent?.renderChain();
      }})
      this.renderTree = null;
    }

  }

  rectangleBlockFunction(operation: (block: IRectangle) => void): void {
    let block: IRectangle = { coordinates: '', color:'', borderStyles:''}

    if (this.renderTree) {
      this.renderTree.addChild(new BlockNode<IRectangle>((b, innerOperations) => {
        new Rectangle(
          this.parseFirstPoint(b.coordinates),
          this.parseSecondPoint(b.coordinates),
          this.parseColor(b.color.trim()),
          this.parseBorderStyles(b.borderStyles.trim())
        ).drawBlock(this.cellsInfo, innerOperations)
      }, this.renderTree, block))
      this.renderTree = this.renderTree.lastChild;
    }
    else {
      this.renderTree = new BlockNode<IRectangle>((b, innerOperations) => {
        new Rectangle(
          this.parseFirstPoint(b.coordinates),
          this.parseSecondPoint(b.coordinates),
          this.parseColor(b.color.trim()),
          this.parseBorderStyles(b.borderStyles.trim())
        ).drawBlock(this.cellsInfo, innerOperations)
      }, null, block)

    }

    operation(block)
    // пуш элемента в массив outputBlocks
    translateFromCyrillicRectangleBlock(block)
    if (this.renderTree.parent != null) {
      this.renderTree = this.renderTree.parent;
    }
    else {
      const parent = this.renderTree
      const outputBlocks = this.outputBlocks = this.outputBlocks.toMutable();
      outputBlocks.push({drawBlock: (info) => {
        parent?.renderChain();
      }})
      this.renderTree = null;
    }

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

  drawImageFunction(coordinates: string, url: string): void {
    const outputBlocks = this.outputBlocks = this.outputBlocks.toMutable()
    let firstPoint = this.parseFirstPoint(coordinates)
    let secondPoint = this.parseSecondPoint(coordinates)
    outputBlocks.push(new ImageBlock(firstPoint, secondPoint, url))
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

  clearBlocks() {
    this.outputBlocks = this.outputBlocks.toMutable();
    this.outputBlocks = []
  }

  clearFunction(time: number = 0) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve(Transaction.run(null, () => this.newProperty.clearBlocks()))
      }, time)
    });

  }


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
    return {heightCellCount : defaultRowCount, widthCellCount : defaultColumnCount, cellSize : defaultCellSize, backgroundColor: defaultBackgroundCOlor}
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


function translateFromCyrillicTextBlock(b: ITextBlock, app: App){
  translateFromCyrillicBaseBlock(b)
  let res = b as any
  b.borderStyles = res.стили_границы || ""
  b.text = res.текст || ""
  b.textStyles = app.parseTextStyles(res.стили_текста?.trim() ?? "") || {color: "", location: ""}
}

function translateFromCyrillicBaseBlock(b: IBaseBlock) {
  let res = b as any
  b.color = res.цвет_фона || ""
  b.coordinates = res.координаты || ""
}

function translateFromCyrillicRectangleBlock(b: IRectangle){
  translateFromCyrillicBaseBlock(b);
  let res = b as any || ""
  b.borderStyles = res.стили_границы || ""
}