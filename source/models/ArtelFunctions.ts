  import { App } from "./App";
  import { ITextBlock } from "interfaces/ITextBlock";
  import { BlockNode } from "./Tree"
  import { TextBlock } from "./TextBlock";
  import { parseFirstPoint, parseSecondPoint, parseColor, parseBorderStyles, translateFromCyrillicTextBlock, translateFromCyrillicRectangleBlock, parseTextStyles } from "./Parse";
  import { IRectangle } from "interfaces/IRectangle";
  import { Rectangle } from "./Rectangle";
  import { ImageBlock } from "./ImageBlock";
  import { InputBlock } from "./InputBlock";
  import { Transaction } from "reactronic";


  export function textBlockFunction(operation: (block: ITextBlock) => void, app: App): void {
    let block: ITextBlock = { coordinates: '', color:'', text:'', borderStyles:'', textStyles:{ color: '', location:''}};

    if (app.renderTree) {
      app.renderTree.addChild(new BlockNode<ITextBlock>((b, innerOperations) => {
        new TextBlock(
          parseFirstPoint(b.coordinates),
          parseSecondPoint(b.coordinates),
          b.text,
          parseColor(b.color.trim()),
          parseBorderStyles(b.borderStyles.trim()),
          b.textStyles
        ).drawBlock(app.cellsInfo, innerOperations);
      }, app.renderTree, block))
      app.renderTree = app.renderTree.lastChild;
    }
    else {
      app.renderTree = new BlockNode<ITextBlock>((b, innerOperations) => {
        new TextBlock(parseFirstPoint(b.coordinates), parseSecondPoint(b.coordinates), b.text, b.color, b.borderStyles, b.textStyles).drawBlock(app.cellsInfo, innerOperations)
      }, null, block);
    }

    operation(block);
    translateFromCyrillicTextBlock(block, app);

    if (app.renderTree.parent != null) {
      app.renderTree = app.renderTree.parent;
    }
    else {
      const parent = app.renderTree;
      const outputBlocks = app.outputBlocks = app.outputBlocks.toMutable();
      outputBlocks.push({drawBlock: () => {
        parent?.renderChain();
      }})
      app.renderTree = null;
    }
  }

  export function rectangleBlockFunction(operation: (block: IRectangle) => void, app: App): void {
    let block: IRectangle = { coordinates: '', color:'', borderStyles:''};

    if (app.renderTree) {
      app.renderTree.addChild(new BlockNode<IRectangle>((b, innerOperations) => {
        new Rectangle(
          parseFirstPoint(b.coordinates),
          parseSecondPoint(b.coordinates),
          parseColor(b.color.trim()),
          parseBorderStyles(b.borderStyles.trim())
        ).drawBlock(app.cellsInfo, innerOperations);
      }, app.renderTree, block))
      app.renderTree = app.renderTree.lastChild;
    }
    else {
      app.renderTree = new BlockNode<IRectangle>((b, innerOperations) => {
        new Rectangle(
          parseFirstPoint(b.coordinates),
          parseSecondPoint(b.coordinates),
          parseColor(b.color.trim()),
          parseBorderStyles(b.borderStyles.trim())
        ).drawBlock(app.cellsInfo, innerOperations);
      }, null, block);
    }

    operation(block);
    translateFromCyrillicRectangleBlock(block);

    if (app.renderTree.parent != null) {
      app.renderTree = app.renderTree.parent;
    }
    else {
      const parent = app.renderTree;
      const outputBlocks = app.outputBlocks = app.outputBlocks.toMutable();
      outputBlocks.push({drawBlock: () => {
        parent?.renderChain();
      }})
      app.renderTree = null;
    }
  }

  export function writeFunction(coordinates: string, message: string, color: string, borderStyles: string, textStyles: string, app: App): void {
    const outputBlocks = app.outputBlocks = app.outputBlocks.toMutable();
    let firstPoint = parseFirstPoint(coordinates);
    let secondPoint = parseSecondPoint(coordinates);
    let enColor = parseColor(color.trim());

    if (enColor === 'anotherColorStyle'){
      enColor = color.trim();
    }

    const border = parseBorderStyles(borderStyles.trim());
    const textSt = parseTextStyles(textStyles.trim());
    outputBlocks.push(new TextBlock(firstPoint, secondPoint, message, enColor, border, textSt));
  }

  export function drawImageFunction(coordinates: string, url: string, app: App): void {
    const outputBlocks = app.outputBlocks = app.outputBlocks.toMutable();
    let firstPoint = parseFirstPoint(coordinates);
    let secondPoint = parseSecondPoint(coordinates);
    outputBlocks.push(new ImageBlock(firstPoint, secondPoint, url));
  }

  export async function inputFunction(coordinates: string, color: string, borderStyles: string, textStyles: string, app: App): Promise<string> {
    const outputBlocks = app.outputBlocks = app.outputBlocks.toMutable();
    let firstPoint = parseFirstPoint(coordinates);
    let secondPoint = parseSecondPoint(coordinates);
    let enColor = parseColor(color);

    if (enColor === 'anotherColorStyle'){
      enColor = color.trim();
    }

    const border = parseBorderStyles(borderStyles.trim());
    const textSt = parseTextStyles(textStyles.trim());
    const inputBlock = new InputBlock(firstPoint, secondPoint, enColor, border, textSt);
    const text: string = await inputBlock.getUserInput();
    outputBlocks.push(inputBlock);
    return Promise.resolve<string>(text);
  }

  export function rectangleFunction(coordinates: string, color: string, borderStyles: string, app: App): void {
    const outputBlocks = app.outputBlocks = app.outputBlocks.toMutable();
    let firstPoint = parseFirstPoint(coordinates);
    let secondPoint = parseSecondPoint(coordinates);
    let enColor = parseColor(color.trim());

    if (enColor === 'anotherColorStyle'){
      enColor = color.trim();
    }

    const border = parseBorderStyles(borderStyles.trim());
    outputBlocks.push(new Rectangle(firstPoint, secondPoint, enColor, border));
  }

  function clearBlocks(app: App) {
    app.outputBlocks = app.outputBlocks.toMutable();
    app.outputBlocks = [];
  }

  export function clearFunction(time: number = 0, app: App) {
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve(Transaction.run(null, () => clearBlocks(app)));
      }, time);
    })
  }