import { readFileSync, writeFileSync } from 'node:fs';

function fore(n, func) {
    Array(n).fill(0).forEach((_, i) => func(i));
}

// trim down full json
function trim(json) {
    return json.map(card => {
        return {
            simplified: card["simplified"],
            pinyin: card["forms"][0]["transcriptions"]["pinyin"],
            english: card["forms"][0]["meanings"][0]
        }
    });
}

function main() {
    const json = [];
    fore(7, i => {
        const module = i + 1;
        trim(JSON.parse(readFileSync(`${module}.json`, 'utf-8'))).map(card => {
            card["module"] = module;
            return card;
        }).forEach(e => json.push(e));
        
        const content = `const cards = () => { return ${JSON.stringify(json, null, 2)}; }`;
        
        writeFileSync("cards.js", content);
    });
}

main();