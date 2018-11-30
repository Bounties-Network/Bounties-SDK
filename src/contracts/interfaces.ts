import { readFileSync, readdirSync } from "fs"
import { join } from "path"


function readABIs(dirname: string) {
    let interfaces: { [s: string]: [any] } = {}
    const filenames = readdirSync(dirname)
    
    filenames.forEach(filename => {
        const content = readFileSync(join(dirname, filename), 'utf-8')
        interfaces[filename.split('.')[0]] = JSON.parse(content);
    })

    return interfaces
}

export const interfaces = readABIs(join(__dirname, "./abi"))