import { readFileSync, writeFileSync, existsSync } from 'node:fs';

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
    return meaning.map(term => term.trim()).join("\n");
}

// trim down full json
function trim(json, state) {
    return json.map((card, i) => {
        let obj = {
            simplified: card["simplified"],
            pinyin: card["forms"][0]["transcriptions"]["pinyin"],
            english: trimMeaning(card["forms"][0]["meanings"])
        };
        if (state !== null) { // overwrite with user data if available
            const { english, hide } = state.cards[i];
            obj["hide"] = hide;
            if (english !== null) {
                obj["english"] = english;
            }
        }
        return obj;
    });
}

function main() {
    let state = null;
    if(existsSync("cardagain_state.json")) {
        state = JSON.parse(readFileSync("cardagain_state.json", "utf-8"));
    }

    const json = [];
    fore(7, i => {
        const module = i + 1;
        trim(JSON.parse(readFileSync(`${module}.json`, 'utf-8')), state).map(card => {
            card["module"] = module;
            return card;
        }).forEach(e => json.push(e));
        const content = `const card_data = () => { return ${JSON.stringify(json, null, 2)}; }`;
        writeFileSync("../docs/card_data.js", content);
    });
}

main();