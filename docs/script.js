(() => {

    const data = cards();

    const {
        setState
    } = helper();

    function main() {

        setState(state => {
            return state;
        });

    }

    main();

})();