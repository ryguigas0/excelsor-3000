// GATHER THE DATA

let data = []

function parseData(csvString) {
    const csvLineStrings = csvString.split('\n')

    csvLineStrings.shift()

    const csvLines = csvLineStrings.map(
        function (line) {
            const cels = line.split(';')

            return {
                source: cels[0],
                source_id: cels[1],
                timestamp: cels[2],
                price: Number.parseFloat(cels[3]),
                area: Number.parseFloat(cels[4]),
                dorms: Number.parseFloat(cels[5]),
                toilets: Number.parseFloat(cels[6]),
                parking: Number.parseFloat(cels[7]),
                address: cels[8],
                lat: Number.parseFloat(cels[9]),
                lng: Number.parseFloat(cels[10])
            }
        }
    )

    return csvLines
}

async function readData() {
    const resp = await fetch('public/data.csv')

    data = parseData(await resp.text())

    console.log('READ', data.length, 'LINES')

    renderTable(data)
}

function renderTable(renderData) {
    let table = document.getElementById('data-output')
    for (let i = 0; i < renderData.length; i++) {
        const line = renderData[i];
        const tr = document.createElement('tr')

        for (let j = 0; j < Object.values(line).length; j++) {
            const val = Object.values(line)[j];
            const td = document.createElement('td')

            td.innerText = val

            tr.appendChild(td)
        }

        // tr.classList.add('highlight')

        table.appendChild(tr)
    }
}

readData()

// FILTER IT
const operations = []


function getOperationArgLength(oprSymbol) {
    if (oprSymbol === "=") {
        return 2
    }
}

const polishNotationPreview = document.getElementById('polish')

function parseFormula(e) {
    const formulaString = e.target.value

    const polishNotation = toPolishNotation(formulaString)

    polishNotationPreview.value = polishNotation
}

function toPolishNotation(inputFormula) {
    const operatorStack = []
    let polishNotation = ""

    const tokens = inputFormula.split(' ')

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        switch (token) {
            case ")":
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
                    const operator = operatorStack.pop()
                    polishNotation += operator + " "
                }
                operatorStack.pop()
                break;
            case "(":
            case "*":
            case "/":
                operatorStack.push(token)
                break
            case "+":
            case "-":
                while (operatorStack.length > 0 && (getOperatorPriority(operatorStack[operatorStack.length - 1]) >= getOperatorPriority(token))) {
                    const topOperator = operatorStack.pop()
                    polishNotation += topOperator + " "
                }

                operatorStack.push(token)
                break
            default:
                polishNotation += token + " "
                break;
        }
    }

    while (operatorStack.length > 0) {
        polishNotation += operatorStack.pop() + " "
    }

    return polishNotation
}

console.log({
    input: "(a + b + c) * d",
    output: toPolishNotation("(a + b + c) * d"),
    isRight: toPolishNotation("(a + b + c) * d") === "a b + c + d *"
})

function getOperatorPriority(operator) {
    const oprMap = {
        "*": 2,
        "/": 2,
        "+": 1,
        "-": 1,
    }

    return oprMap[operator] === undefined ? 0 : oprMap[operator]
}

const inputFormula = document.getElementById('formula')
inputFormula.oninput = parseFormula