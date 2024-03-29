import { IBaseBlock } from "interfaces/IBaseBlock";

type RenderFunction<T extends IBaseBlock> = (block: T, innerOperations?: () => void) => void;

export class BlockNode<T extends IBaseBlock> {
  private renderFunction: RenderFunction<T>
  private children: BlockNode<any>[] = []
  private block: T

  parent: BlockNode<any> | null

  constructor(renderFunction: RenderFunction<T>, parent: BlockNode<any> | null, block: T) {
    this.renderFunction = renderFunction;
    this.parent = parent;
    this.block = block;
  }

  addChild(blockNode: BlockNode<any>): void{
    this.children.push(blockNode);
  }

  public get renderChain(): () => void {
    return () => {
      this.renderFunction(this.block, () => {
        this.children.forEach(child => {
          child.renderChain();
        });
      });
    }
  }

  public get lastChild(): BlockNode<any> {
    return this.children[this.children.length - 1];
  }
}
