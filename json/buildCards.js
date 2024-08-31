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
    fore(7, i => {
        const module = i + 1;
        const json = trim(JSON.parse(readFileSync(`${module}.json`, 'utf-8'))).map(card => {
            card["module"] = module;
            card["data"] = {
                "correct": 0,
                "incorrect": 0,
                "skip": 0,
                "hide": false,
                "english": null // user override for english meaning
            }
            return card;
        });
        
        const content = `const cards = () => { return ${JSON.stringify(json, null, 2)}; }`;
        
        writeFileSync("cards.js", content);
    });
}

main();