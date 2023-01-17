import { raw, ObservableObject, reactive, transactional } from "reactronic"
import { BaseHtmlDriver, ContextVariable, HtmlSensors, I } from "verstak"
import { AppTheme } from "themes/AppTheme"
import { Loader } from "./Loader"
import { editor } from "monaco-editor"
import { ArtelMonacoClient } from "../../library/artel/packages/monaco-client/source"

import { Compilation } from "../../library/artel/packages/compiler/source/compilation/Compilation"
import { Uri } from "../../library/artel/packages/compiler/source/Uri"
import { Parser } from "../../library/artel/packages/compiler/source/parser/Parser"
import Worker from "../../library/artel/packages/monaco-client/source/worker?worker"

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
  }

  get theme(): AppTheme {
    return this.allThemes[this.activeThemeIndex]
  }

  @reactive
  async updateTextModel(): Promise<void> {
    const client = new ArtelMonacoClient()
    this.textModelArtel = await client.getModel(new Worker())
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

/*
export function compileArtel(code: string): CompilationResult {
  const compilation = new Compilation(new Uri(['project']), [
    {
      uri: new Uri(['project', 'module']),
      sourceFiles: [
        {
          uri: new Uri(['project', 'module', 'system-blocks.a']),
          syntax: new Parser(systemBlocks).parse(),
        },
        {
          uri: new Uri(['project', 'module', 'sheet.a']),
          syntax: new Parser(code).parse(),
        }
      ]
    },
    {
      uri: new Uri(['project', 'table-builder']),
      sourceFiles: [
        {
          uri: new Uri(['project', 'table-builder', 'table-builder.a']),
          syntax: new Parser(tableConfigurator).parse(),
        }
      ]
    }
  ])
  let compilationResult: CompilationResult
  try {
    const emitterResult = compilation.emitWithDiagnostics()
    const codeWithHelperFunction = helperArtelFunctions + emitterResult.code
    const mainFileDiagnostics = emitterResult.diagnostics[1]
    const syntaxErrors = mainFileDiagnostics.syntax.items.map<LanguageError>(d => ({
      kind: 'syntax',
      message: d.message,
      span: { start: d.range.start, length: d.range.length }
    }))
    const semanticErrors = mainFileDiagnostics.semantic.items.map<LanguageError>(d => ({
      kind: 'semantic',
      message: d.message,
      span: { start: d.range.start, length: d.range.length }
    }))
    compilationResult = {
      code: codeWithHelperFunction,
      errors: [...syntaxErrors, ...semanticErrors]
    }
  } catch (_) {
    compilationResult = {
      code: '',
      errors: [{ kind: 'semantic', message: 'Emitter error', span: { start: 0, length: 1 } }]
    }
  }
  return compilationResult
}
*/
export const $app = new ContextVariable<App>()

export const ROW_COUNT = 10

export const COLUMN_COUNT = 10