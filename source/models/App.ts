import { raw, ObservableObject, reactive, transactional, Transaction } from "reactronic"
import { BaseHtmlDriver, ContextVariable, HtmlSensors } from "verstak"
import { AppTheme } from "themes/AppTheme"
import Worker from "../../library/artel/projects/monaco-client/source/worker?worker"
import { editor } from "monaco-editor"
import { IOutputBlock } from "./OutputBlock"
import { ArtelMonacoClient } from "../../library/artel/projects/monaco-client/source"
import { DirectoryNode, FileNode, ProjectGraph, ProjectCursor, SourceFileState, Workspace } from "../../library/artel/projects/compiler/source/project"
import { Uri } from "../../library/artel/projects/compiler/source/common"
import { Emitter } from "../../library/artel/projects/compiler/source/emitter"
import { Diagnostic } from "../../library/artel/projects/compiler/source/diagnostic/Diagnostic"
import { BlockNode } from "./Tree"

export const DEFAULT_CELL_SIZE : number = 35

export interface CellInfo {
  cellSize: number
  heightCellCount: number
	widthCellCount: number
  backgroundColor: string
  rowsSize: Array<string>
  columnsSize: Array<string>
}

const DEFAULT_ROWS_COUNT : number = 10
const DEFAULT_COLUMNS_COUNT : number = 10
const DEFAULT_BACKGROUND_COLOR : string = 'white'

export class App extends ObservableObject {
  version: string
  sensors: HtmlSensors
  allThemes: Array<AppTheme>
  activeThemeIndex: number
  blinkingEffect: boolean
  widthGrowthCount: number
  monacoThemes: string[]
  activeMonacoThemeIndex: number
  textModelArtel: editor.ITextModel | undefined
  outputBlocks: Array<IOutputBlock>
  cellsInfo: CellInfo

  @raw
  editor: editor.IStandaloneCodeEditor | undefined
  @raw
  renderTree: BlockNode<any> | null = null;

  constructor(version: string, ...themes: Array<AppTheme>) {
    super()
    this.version = version;
    this.sensors = new HtmlSensors();
    this.allThemes = themes;
    this.activeThemeIndex = 0;
    this.blinkingEffect = false;
    this.widthGrowthCount = 3;
    this.editor = undefined;
    this.monacoThemes = ['vs', 'vs-dark', 'hc-black', 'hc-light'];
    this.activeMonacoThemeIndex = 0;
    this.textModelArtel = undefined;
    this.outputBlocks = [];
    this.cellsInfo = this.getDefaultCellsInfo();
  }

  get theme(): AppTheme {
    return this.allThemes[this.activeThemeIndex];
  }

  private gridModuleSourceCode: string = `
  используется артель

  тип ИнформацияОСетке = объект
  {
    размер_ячейки: Число?
    количество_строк: Число
    количество_столбцов: Число
    цвет_фона: Текст

    размер_строк: Массив<Текст>
    размер_столбцов: Массив<Текст>
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
    }]);
    this.textModelArtel = await client.getModel(new Worker());
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
      );

    const workspace = new Workspace([fileSystemTree]);
    const project = workspace.projectGraphs[0];

    if (project.mainProject.role !== 'main')
      throw new Error('Internal error');

    const emitter = new Emitter(project);

    function collectProjectDiagnostics(project: ProjectGraph) {
      const diagnosticsByFileUri = new Map<string, Diagnostic[]>();
      const cursor = ProjectCursor.fromProjectGraph(project);
      for (const sourceFile of cursor.enumerateSourceFiles()) {
        // const diagnostics = [...sourceFile.syntax.diagnostics.items]
        // const semanticDiagnostics = collectDiagnostics(project.ctx, sourceFile.syntax)
        // diagnostics.push(...semanticDiagnostics)
        // diagnosticsByFileUri.set(sourceFile.uri.toString(), diagnostics)
      }
      return diagnosticsByFileUri;
    }

    console.log(collectProjectDiagnostics(project));
    const compiledCode = emitter.emitToString();
    return compiledCode;
  }

  @transactional
  nextTheme(): void {
    this.activeThemeIndex = (this.activeThemeIndex + 1) % this.allThemes.length;
  }

  @transactional
  nextMonacoTheme(): void {
    this.activeMonacoThemeIndex = (this.activeMonacoThemeIndex + 1) % this.monacoThemes.length;
    this.editor?.updateOptions({theme: this.monacoThemes[this.activeMonacoThemeIndex]});
  }

  @reactive
  protected actualizeBrowserTitle(): void {
    document.title = `Verstak Demo ${this.version}`;
  }

  @reactive
  protected applyBlinkingEffect(): void {
    BaseHtmlDriver.blinkingEffect = this.blinkingEffect ? "verstak-blinking-effect" : undefined;
  }

  getDefaultCellsInfo(): CellInfo {
    return {
      heightCellCount : DEFAULT_ROWS_COUNT,
      widthCellCount : DEFAULT_COLUMNS_COUNT,
      cellSize : DEFAULT_CELL_SIZE,
      backgroundColor: DEFAULT_BACKGROUND_COLOR,
      columnsSize: [],
      rowsSize: []
    };
  }

  public getWidthGrowth(): Number {
    return this.widthGrowthCount;
  }

  public setEditor (editor: editor.IStandaloneCodeEditor): void {
    this.editor = editor;
  }

  public getEditor(): editor.IStandaloneCodeEditor | undefined {
    return this.editor;
  }
}

export const $app = new ContextVariable<App>()
