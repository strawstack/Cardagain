const helper = () => {

    const state = {};

    function setState(func) {
        render(
            func(
                JSON.parse(
                    JSON.stringify(state)
                )
            )
        );
    }

    function render(state) {
        
    }

    return {
        setState
    };

};