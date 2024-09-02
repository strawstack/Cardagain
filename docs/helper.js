const helper = () => {

    /* cards: Array of following:
    {"simplified": "阿拉伯语",
    "pinyin": "Ā lā bó yǔ",
    "english": "Arabic (language)",
    "module": 7}
    */
    const data = cards();

    const location = {
        QUESTION: 0,
        ANSWER: 1,
        SAVELOAD: 2,
        SETTINGS: 3
    };

    const menu = {
        NONE: 0,
        PALLETS: 1,
        SAVELOAD: 2,
        MORE: 3
    };

    const pallets = [
        {
            name: "classic",
            pallet: [
                "#0081A7",
                "#00AFB9",
                "#FDFCDC",
                "#FED9B7",
                "#F07167",
            ]
        },
        {
            name: "candy",
            pallet: [
                "#9B5DE5",
                "#F15BB5",
                "#FEE440",
                "#00BBF9",
                "#00F5D4",
            ]
        },
        {
            name: "aqua",
            pallet: [
                "#03045E",
                "#0077B6",
                "#00B4D8",
                "#90E0EF",
                "#CAF0F8",
            ]
        },
        {
            name: "heat",
            pallet: [
                "#F08080",
                "#F4978E",
                "#F8AD9D",
                "#FBC4AB",
                "#FFDAB9",
            ]
        },
        {
            name: "trance",
            pallet: [
                "#CDB4DB",
                "#FFC8DD",
                "#FFAFCC",
                "#BDE0FE",
                "#A2D2FF",
            ]
        },
        {
            name: "dust",
            pallet: [
                "#EDEDE9",
                "#D6CCC2",
                "#F5EBE0",
                "#E3D5CA",
                "#D5BDAF",
            ]
        },
        {
            name: "cyber",
            pallet: [
                "#3C1642",
                "#086375",
                "#1DD3B0",
                "#AFFC41",
                "#B2FF9E",
                
            ]
        }
    ];

    let state = {
        index: 0,
        location: location.QUESTION,
        menu: menu.NONE,
        cards: { // map {uid -> data}
            example: {
                correct: 0,
                incorrect: 0,
                skip: 0,
                hide: false,
                english: null // user override for english meaning   
            }
        },
        pallets
    };
    
    function setState(func) {
        const copystate = JSON.parse(JSON.stringify(state));
        func(copystate, data);
        state = copystate;
        render(state);
    }

    const qs = (() => {
        let uid = 0;
        return path => {
            const e = document.querySelector(path);
            e["uid"] = uid;
            uid += 1;
            return e;
        }
    })();

    const viewport = {
        elem: qs(".viewport"),
        settings: {
            elem: qs(".viewport .settings"),
            pallets: {
                elem: qs(".viewport .settings .pallets"),
            },
            saveload: {
                elem: qs(".viewport .settings .saveload")
            },
            more: {
                elem: qs(".viewport .settings .more")
            },
            area: {
                elem: qs(".viewport .settings .area"),
                pallets: {
                    elem: qs(".viewport .settings .area .pallets")
                },
                saveload: {
                    elem: qs(".viewport .settings .area .saveload"),
                    save: {
                        elem: qs(".viewport .settings .area .saveload .save")
                    },
                    load: {
                        elem: qs(".viewport .settings .area .saveload .load")
                    },
                    savedata: {
                        elem: qs(".viewport .settings .area .saveload .savedata")
                    }
                },
                more: {
                    elem: qs(".viewport .settings .area .more")
                },
            },
        },
        cardContainer: {
            elem: qs(".viewport .cardContainer"),
            config: {
                elem: qs(".viewport .cardContainer .config"),
                hide: {
                    elem: qs(".viewport .cardContainer .config .hide")
                },
                skip: {
                    elem: qs(".viewport .cardContainer .config .skip")
                },
                reset: {
                    elem: qs(".viewport .cardContainer .config .reset")
                }
            },
            card: {
                elem: qs(".viewport .cardContainer .card"),

                english: {
                    elem: qs(".viewport .cardContainer .card .english")
                },
                pinyin: {
                    elem: qs(".viewport .cardContainer .card .pinyin")
                },
                simplified: {
                    elem: qs(".viewport .cardContainer .card .simplified")
                }
            },
            actions: {
                elem: qs(".viewport .cardContainer .actions"),
                question: {
                    elem: qs(".viewport .cardContainer .actions .question"),
                    next: {
                        elem: qs(".viewport .cardContainer .actions .question .next")
                    }
                },
                answer: {
                    elem: qs(".viewport .cardContainer .actions .answer"),
                    incorrect: {
                        elem: qs(".viewport .cardContainer .actions .answer .incorrect")
                    },
                    correct: {
                        elem: qs(".viewport .cardContainer .actions .answer .correct")
                    }
                }
            }
        }
    };

    const setStyle = (() => {
        const defaults = {};
        return (ref, prop, value) => {
            if (!(ref.uid in defaults)) defaults[ref.uid] = ref.style[prop];
            if (value === null) {
                ref.style[prop] = defaults[ref.uid];
            } else {
                ref.style[prop] = value;
            } 
        }
    })();

    function render(state) {

        // Card
        setStyle(
            viewport.cardContainer.card.english.elem, 
            "grid-row", 
            (state.location === location.QUESTION) ? null : "2 / 3"
        );
        setStyle(
            viewport.cardContainer.card.pinyin.elem, 
            "display", 
            (state.location === location.ANSWER) ? null : "none"
        );
        setStyle(
            viewport.cardContainer.card.simplified.elem, 
            "display", 
            (state.location === location.ANSWER) ? null : "none"
        );

        // Card Actions
        setStyle(
            viewport.cardContainer.actions.question.elem, 
            "display", 
            (state.location === location.QUESTION) ? null : "none"
        );
        setStyle(
            viewport.cardContainer.actions.answer.elem, 
            "display", 
            (state.location === location.ANSWER) ? null : "none"
        );

        // Menu
        setStyle(
            viewport.settings.area.pallets.elem,
            "display",
            (state.menu === menu.PALLETS) ? null : "none"
        );
        setStyle(
            viewport.settings.area.saveload.elem,
            "display",
            (state.menu === menu.SAVELOAD) ? null : "none"
        );
        setStyle(
            viewport.settings.area.more.elem,
            "display",
            (state.menu === menu.MORE) ? null : "none"
        );

        const getEnglish = () => {
            if (state.cards[state.index].english === null) {
                return data[state.index].english.join("\n");
            } else {
                return state.cards[state.index].english;
            }
        };

        viewport.cardContainer.card.english.elem.innerHTML = getEnglish();
        viewport.cardContainer.card.pinyin.elem.innerHTML = data[state.index].pinyin;
        viewport.cardContainer.card.simplified.elem.innerHTML = data[state.index].simplified;
    }

    return {
        setState,
        location,
        menu,
        viewport,
        onClick: (elem, func) => {
            elem.addEventListener("click", e => func(e));
        }
    };

}