const helper = () => {

    const location = {
        QUESTION: 0,
        ANSWER: 1,
        SAVELOAD: 2,
        SETTINGS: 3
    };

    let state = {
        index: 0,
        location: location.QUESTION,
    };

    function setState(func) {
        const copystate = JSON.parse(JSON.stringify(state));
        func(copystate);
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
                pallet: {
                    elem: qs(".viewport .settings .pallets .pallet")
                } 
            },
            saveload: {
                elem: qs(".viewport .settings .saveload")
            },
            more: {
                elem: qs(".viewport .settings .more")
            },
        },
        cardContainer: {
            elem: qs(".viewport .cardContainer"),
            config: {
                elem: qs(".viewport .cardContainer .config"),
                hide: {
                    elem: qs(".viewport .cardContainer .config")
                },
                skip: {
                    elem: qs(".viewport .cardContainer .skip")
                }
            },
            card: {
                elem: qs(".viewport .cardContainer .card"),
                question: {
                    elem: qs(".viewport .cardContainer .card .question"),
                    english: {
                        elem: qs(".viewport .cardContainer .card .question .english")
                    }
                },
                answer: {
                    elem: qs(".viewport .cardContainer .card .answer"),
                    area: {
                        elem: qs(".viewport .cardContainer .card .answer .area"),
                        simplified: {
                            elem: qs(".viewport .cardContainer .card .answer .area .simplified")
                        },
                        characters: {
                            elem: qs(".viewport .cardContainer .card .answer .area .characters")
                        }
                    }
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

        setStyle(
            viewport.cardContainer.card.question.elem, 
            "display", 
            (state.location === location.QUESTION) ? null : "none"
        );
        setStyle(
            viewport.cardContainer.card.answer.elem, 
            "display", 
            (state.location === location.ANSWER) ? null : "none"
        );
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

        viewport.cardContainer.card.question.english.elem.innerHTML = `English: ${state.index}`;
        viewport.cardContainer.card.answer.area.simplified.elem.innerHTML = `Simplified: ${state.index}`;
        viewport.cardContainer.card.answer.area.characters.elem.innerHTML = `Characters: ${state.index}`;
    }

    return {
        setState,
        location,
        viewport,
        onClick: (elem, func) => {
            elem.addEventListener("click", e => func(e));
        }
    };

}