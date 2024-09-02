import { readFileSync, writeFileSync } from 'node:fs';

function fore(n, func) {
    Array(n).fill(0).forEach((_, i) => func(i));
}

function removeBrackets(str) {
    return str.replaceAll(/\(.+?\)/g, "");
}

function expandSemiColon(str) {
    return str.split("; ");
}

function sortByLength(arr) {
    return arr.sort((a, b) => a.length - b.length);
}

function trimMeaning(meaning) {
    meaning = meaning.map(t => removeBrackets(t));
    meaning = meaning.map(t => expandSemiColon(t)).flat();
    meaning = sortByLength(meaning);
    return meaning;
}

// trim down full json
function trim(json) {
    return json.map(card => {
        return {
            simplified: card["simplified"],
            pinyin: card["forms"][0]["transcriptions"]["pinyin"],
            english: trimMeaning(card["forms"][0]["meanings"])
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
        const content = `const card_data = () => { return ${JSON.stringify(json, null, 2)}; }`;
        writeFileSync("card_data.js", content);
    });
}

main();