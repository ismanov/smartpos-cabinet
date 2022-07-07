import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist';
import rootReducer from './reducer';
import thunkMiddleware from 'redux-thunk'
import loggerMiddleware from './middleware/logger'
import memory from '../coreLayer/services/memory';

const middleware = applyMiddleware(thunkMiddleware);

export const store = createStore(rootReducer, middleware);

store.getState(() => {
    memory.set("redux_state", store.getState())
})

export const persistor = persistStore(store);
