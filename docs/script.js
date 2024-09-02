(() => {

    const {
        setState,
        location,
        menu,
        viewport,
        onClick,
        pallets
    } = helper();

    function main() {

        // init
        setState((state, data) => {
            // Init data for each card
            // TODO - only if no local storage present
            for (let i = 0; i < data.length; i++) {
                state.cards[i] = {
                    correct: 0,
                    incorrect: 0,
                    skip: 0,
                    hide: false,
                    english: null
                }
            }
        });

        function nextIndex(state, value) {
            if (value === undefined) {
                state.index += 1;
            } else {
                state.index = value;
            }
            while (state.cards[state.index].hide) {
                state.index += 1;
            }
        }

        // Create Pallets
        for (let { name, pallet } of pallets) {
            const container = document.createElement("div");
            container.className = "pallet";
            for (let hex of pallet) {
                const color = document.createElement("div");
                color.className = "color";
                color.style.background = hex;
                container.appendChild(color);
            }
            const area = document.createElement("div");
            area.className = "area";
            area.innerHTML = name;
            container.appendChild(area);
            viewport.settings.area.pallets.elem.appendChild(container);
        }

        // Actions
        onClick(viewport.cardContainer.actions.question.next.elem, e => {
            setState(state => {
                state.location = location.ANSWER;
            });
        });
        onClick(viewport.cardContainer.actions.answer.correct.elem, e => {
            setState(state => {
                nextIndex(state);
                state.location = location.QUESTION;
            });
        });
        onClick(viewport.cardContainer.actions.answer.incorrect.elem, e => {
            setState(state => {
                nextIndex(state, 0);
                state.location = location.QUESTION;
            });
        });

        // Meta Actions
        onClick(viewport.cardContainer.config.hide.elem, e => {
            setState(state => {
                state.cards[state.index].hide = true;
                nextIndex(state);
                state.location = location.QUESTION;
            });
        });
        onClick(viewport.cardContainer.config.skip.elem, e => {
            setState(state => {
                nextIndex(state);
                state.location = location.QUESTION;
            });
        });
        onClick(viewport.cardContainer.config.reset.elem, e => {
            setState(state => {
                nextIndex(state, 0);
                state.location = location.QUESTION;
            });
        });

        // Menu
        onClick(viewport.settings.pallets.elem, e => {
            setState(state => {
                
                if (state.menu === menu.PALLETS) {
                    state.menu = menu.NONE;

                } else {
                    state.menu = menu.PALLETS;

                }
            });
        });

    }

    main();

})();