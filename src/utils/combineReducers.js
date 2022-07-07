import { useReducer } from 'react';

// Main
export function combineReducers(reducerDict) {
    const _initialState = getInitialState(reducerDict);
    return function(state = _initialState, action) {
        return Object.keys(reducerDict).reduce((acc, curr) => {
            let slice = reducerDict[curr](state[curr], action);
            return { ...acc, [curr]: slice };
        }, state);
    };
}

export function useStore(rootReducer, state) {
    const initialState = state || rootReducer(undefined, { type: undefined });
    return useReducer(rootReducer, initialState);
}


// Helpers
function getInitialState(reducerDict) {
    return Object.keys(reducerDict).reduce((acc, curr) => {
        const slice = reducerDict[curr](undefined, { type: undefined });
        return { ...acc, [curr]: slice };
    }, {});
};
