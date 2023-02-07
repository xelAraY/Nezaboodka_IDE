import { COLUMN_COUNT, incrementLetterInCoordinate, ROW_COUNT } from "./App"

export interface IOutputBlock {

    drawBlock(): void

}

export function parseCordinate(point: string) : string{
    
    let res = ''

    res = point.toUpperCase().trim()
    
    if (res.length < 2){
        res = 'A1'
    }


    let columnToken = parseColumns(res.match(/[A-Z]+/i)[0] ?? '')
    let rowToken = parseRows(res.substring(1))
    
    return columnToken + rowToken
}

function parseColumns(columnToken: string): string {
		
    const minimalLetter = 'A'
    const maxLetter = findMaxLetter()

    if (columnToken.match(/[A-Z]+/i)){

        if (columnToken > maxLetter && columnToken.length == maxLetter.length){
            columnToken = maxLetter
        }

    } 
    else{
        columnToken = minimalLetter
    }

    return incrementLetterInCoordinate(columnToken)
}

function parseRows(rowToken: string): string {

    let rowNumber = parseInt(rowToken, 10)

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

function findMaxLetter(): string {
    
    let res = 'A'

    for (let i = 0; i < COLUMN_COUNT - 1; i++){
        res = incrementLetterInCoordinate(res)
    }

    return res
}