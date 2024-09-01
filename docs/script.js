(() => {

    const data = cards();

    const {
        setState,
        location,
        viewport,
        onClick
    } = helper();

    function main() {

        setState(state => {
            // init state
            return state;
        });
    
        onClick(viewport.cardContainer.actions.question.next.elem, e => {
            setState(state => {
                state.location = location.ANSWER;
            });
        });

        onClick(viewport.cardContainer.actions.answer.correct.elem, e => {
            setState(state => {
                state.index += 1;
                state.location = location.QUESTION;
            });
        });

    }

    main();

})();