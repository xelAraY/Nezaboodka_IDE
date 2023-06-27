import { ITextBlock } from "interfaces/ITextBlock";
import { App } from "./App";
import { IRectangle } from "interfaces/IRectangle";
import { IBaseBlock } from "interfaces/IBaseBlock";

export function incrementLetterInCoordinate(text: string): string {
  let i: number = text.length;
  let isExit: boolean = false;

  while (i > 0 && !isExit){
    let lastChar;
    if (text.charCodeAt(i - 1) < 'Z'.charCodeAt(0)){
      lastChar = String.fromCharCode(text.charCodeAt(i - 1) + 1);
      isExit = true;
    }
    else{
      lastChar = 'A';
    }

    text = text.substring(0, i - 1) + lastChar + text.substring(i);
    i--;
  }

  text = text + (!isExit ? 'A' : '');
  return text;
}

export function translateFromCyrillicTextBlock(b: ITextBlock, app: App){
  translateFromCyrillicBaseBlock(b);
  let res = b as any;
  b.borderStyles = res.стили_границы || '';
  b.text = res.текст || '';
  b.textStyles = parseTextStyles(res.стили_текста?.trim() ?? '') || {color: '', location: ''};
}

export function translateFromCyrillicBaseBlock(b: IBaseBlock) {
  let res = b as any;
  b.color = res.цвет_фона || '';
  b.coordinates = res.координаты || '';
}

export function translateFromCyrillicRectangleBlock(b: IRectangle){
  translateFromCyrillicBaseBlock(b);
  let res = b as any || '';
  b.borderStyles = res.стили_границы || '';
}

export function parseTextStyles(textStyles: string) {
  let index = 0;
  let startIndex = 0;
  let result = { color: 'black', location: 'center' };

  while (index < textStyles.length){
    while (index < textStyles.length && textStyles[index+1] !== ' ') {
      index++;
    }

    index++;
    const style = textStyles.substring(startIndex, index);
    let newStyle = parseColor(style.trim());
    
    if (newStyle === 'unknown'){
      newStyle = parseLocation(style.trim());
      if (newStyle !== 'unknown'){
        result.location = newStyle
      }
    }
    else if(newStyle === 'anotherColorStyle') {
      if (style.trim().indexOf(')') === -1){
        while (textStyles[index] !== ')' && index < textStyles.length){
          index++;
        }

        index++;
      }

      result.color = textStyles.substring(startIndex, index);
    }
    else {
      result.color = newStyle;
    }

    startIndex = index;
  }

  return result;
}

export function parseLocation(text: string): string {
  switch(text){
    case 'центр':
      return 'center';
    case 'слева':
      return 'flex-start';
    case 'справа':
      return 'flex-end';
    default:
      return 'unknown';
  }
}

export function parseBorderStyles(borderStyles: string): string {
  let index = 0;
  let startIndex = 0;
  let result = '';

  while (index < borderStyles.length){
    while (index < borderStyles.length && borderStyles[index+1] !== ' ') {
      index++;
    }

    index++;
    const style = borderStyles.substring(startIndex, index);
    let newStyle = parseColor(style.trim());
    
    if (newStyle === 'unknown'){
      newStyle = parseBorder(style.trim());
      if (newStyle === 'unknown'){
        newStyle = style;
      }
    }
    else if(newStyle === 'anotherColorStyle') {
      if (style.trim().indexOf(')') === -1){
        while (borderStyles[index] !== ')' && index < borderStyles.length){
          index++;
        }

        index++;
      }

      newStyle = borderStyles.substring(startIndex, index);
    }
    result+= newStyle + ' ';
    startIndex = index;
  }

  return result;
}

export function parseBorder(border: string): string {
  switch(border){
    case 'сплошной':
      return 'solid';
    case 'пунктирный':
      return 'dashed';
    case 'точечный':
      return 'dotted';
    default:
      return 'unknown';
  }
}

export function parseAnotherColorView(color: string): string {
  if (color.startsWith('rgb') || color.startsWith('rgba') || (color.startsWith('#') && color.length === 7)){
    return 'anotherColorStyle';
  }

  return 'unknown';
}

export function parseColor(color: string): string {
  switch(color){
    case 'желтый':
      return 'yellow';
    case 'красный':
      return 'red';
    case 'зеленый':
      return 'green';
    case 'белый':
      return 'white';
    case 'синий':
      return 'blue';
    case 'фиолетовый':
      return 'purple';
    case 'чёрный':
      return 'black';
    default:
      return parseAnotherColorView(color);
  }
}

export function parseFirstPoint(coordinates: string): string {
  let colonPos = coordinates.indexOf(':');
  return coordinates.substring(0, colonPos);
}

export function parseSecondPoint(coordinates: string): string {
  let colonPos = coordinates.indexOf(':');
  return coordinates.substring(colonPos + 1);
}
