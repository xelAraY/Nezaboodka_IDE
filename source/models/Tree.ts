import { IBaseBlock } from "interfaces/IBaseBlock";
import { IOutputBlock } from "./OutputBlock"
import { CellInfo } from "./App";


type RenderFunction<T extends IBaseBlock> = (block: T, innerOperations?: RenderFunction<any>) => void;


class BlockNode<T extends IBaseBlock> {

  private renderFunction: RenderFunction<T>;
  private children: BlockNode<any>[] = [];
  private block: T;

  parent: BlockNode<any> | null;

  constructor(renderFunction: RenderFunction<T>, parent: BlockNode<T>, block: T) {

    this.renderFunction = renderFunction;
    this.parent = parent;
    this.block = block;

  }

  addChild(blockNode: BlockNode<any>): void{
    
    this.children.push(blockNode);
  
  }

  public get renderChain(): RenderFunction<T> {

    return () => {

      this.renderFunction(this.block, () => {
        this.children.forEach(child => {
          child.renderChain(child.block);
        })
      })

    }

  }
  

}