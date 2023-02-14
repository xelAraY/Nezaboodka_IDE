import { $app, CellInfo, incrementLetterInCoordinate } from "./App"

export interface IOutputBlock {

    drawBlock(cellsInfo: CellInfo): void

}

export function parseCordinate(point: string, cellsInfo: CellInfo) : string{
    
    let res = ''

    res = point.toUpperCase().trim()
    
    if (res.length < 2){
        res = 'A1'
    }


    let columnToken = parseColumns(res.match(/[A-Z]+/i)[0] ?? '', cellsInfo)
    let rowToken = parseRows(res.match(/[0-9]+/i)[0] ?? '', cellsInfo)
    
    return columnToken + rowToken
}

function parseColumns(columnToken: string, cellsInfo: CellInfo): string {
		
    const minimalLetter = 'A'
    const maxLetter = findMaxLetter(cellsInfo)

    if (columnToken.match(/[A-Z]+/i)){

        if (columnToken.length >= maxLetter.length){
            
            if (columnToken > maxLetter && columnToken.length == maxLetter.length || columnToken.length > maxLetter.length)
                columnToken = maxLetter
        }

    } 
    else{
        columnToken = minimalLetter
    }

    return incrementLetterInCoordinate(columnToken)
}

function parseRows(rowToken: string, cellsInfo: CellInfo): string {

    let rowNumber = parseInt(rowToken, 10)
    const ROW_COUNT = cellsInfo.высота

    if (isNaN(rowNumber)){
        
        rowNumber = 1

    } 
    else if (rowNumber < 1) {

        rowNumber = 1

    }
    else if (rowNumber > ROW_COUNT){

        rowNumber = ROW_COUNT

    }
    
    rowNumber++

    return rowNumber.toString()

}

function findMaxLetter(cellsInfo: CellInfo): string {
    
    let res = 'A'
    const COLUMN_COUNT = cellsInfo.ширина

    for (let i = 0; i < COLUMN_COUNT - 1; i++){
        res = incrementLetterInCoordinate(res)
    }

    return res
}