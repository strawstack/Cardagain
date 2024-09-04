(() => {

    const {
        setState,
        location,
        menu,
        timer,
        viewport,
        onClick,
        save,
        load
    } = helper();

    function main() {
        
        // Allows timer cancel
        let interval = null;

        // init
        setState(state => {

            // Load from local storage
            const storage_str = localStorage.getItem("state");
            const storage = (storage_str === null) ? storage_str : JSON.parse(storage_str);

            // Data for each card
            if (storage !== null) {
                for (const key in state) {
                    state[key] = storage[key];
                }
            }

            // Create Pallets
            for (let { name, pallet } of state.pallets) {
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

                onClick(container, e => {
                    document.body.style.setProperty("--color-bkg", pallet[0]);
                    document.body.style.setProperty("--color-tiles", pallet[1]);
                    document.body.style.setProperty("--color-text-bkg", pallet[2]);
                    setState((s) => { // Update default pallet
                        s.default_pallet = name;
                    });
                });

            }

            // Start timer if active
            if (state.timer.status === timer.ACTIVE) {
                interval = setInterval(() => {
                    setState(s => {
                        s.timer.seconds = s.timer.seconds + 1;
                    });
                }, 1000);
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

        // Actions
        onClick(viewport.cardContainer.actions.question.next.elem, e => {
            setState(state => {
                state.location = location.ANSWER;
            });
        });
        onClick(viewport.cardContainer.actions.answer.correct.elem, e => {
            setState(state => {
                state.streak = state.streak + 1;
                state.cards[state.index].correct += 1;
                nextIndex(state);
                state.location = location.QUESTION;
            });
        });
        onClick(viewport.cardContainer.actions.answer.incorrect.elem, e => {
            setState(state => {
                state.streak = 0;
                state.cards[state.index].incorrect += 1;
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
                state.cards[state.index].skip += 1;
                nextIndex(state);
                state.location = location.QUESTION;
            });
        });
        onClick(viewport.cardContainer.config.reset.elem, e => {
            setState(state => {
                state.streak = 0;
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
        onClick(viewport.settings.saveload.elem, e => {
            setState(state => {
                if (state.menu === menu.SAVELOAD) {
                    state.menu = menu.NONE;
                } else {
                    state.menu = menu.SAVELOAD;
                }
            });
        });
        onClick(viewport.settings.more.elem, e => {
            setState(state => {
                if (state.menu === menu.MORE) {
                    state.menu = menu.NONE;
                } else {
                    state.menu = menu.MORE;
                }
            });
        });

        // Menu - saveload
        onClick(viewport.settings.area.saveload.save.elem, e => {
            setState(state => {
                save(state);
            });
        });
        viewport.settings.area.saveload.load.elem.addEventListener("change", e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = readerEvent => {
                const content = JSON.parse(readerEvent.target.result);
                load(content);
            }
        });

        // Menu - more
        onClick(viewport.settings.area.more.clearLocalstorage.elem, e => {
            localStorage.clear();
        });

        // Change event - english content
        viewport.cardContainer.card.english.elem.addEventListener("input", e => {
            const text = e.target.innerHTML;
            setState(state => {
                state.cards[state.index].english = text;
            });
        }, false);

        // Timer
        onClick(viewport.stats.timer.controls.start.elem, e => {
            setState(state => {
                if (state.timer.status === timer.PAUSE) {
                    state.timer.status = timer.ACTIVE;
                    interval = setInterval(() => {
                        setState(s => {
                            s.timer.seconds = s.timer.seconds + 1;
                        });
                    }, 1000);
                }
            });
        });
        onClick(viewport.stats.timer.controls.pausereset.elem, e => {
            setState(state => {
                if (state.timer.status === timer.ACTIVE) {
                    state.timer.status = timer.PAUSE;
                    clearInterval(interval);
                    interval = null;

                } else if (state.timer.status === timer.PAUSE) {
                    state.timer.seconds = 0;

                }
            });
        });

    }

    main();

})();