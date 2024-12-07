// import { configureStore } from '@reduxjs/toolkit';
// import userReducer from '../slices/userSlice';

// const store = configureStore({
//   reducer: {
//     user: userReducer, // Add the user slice to the store
//   },
// });

// export default store;



import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Use localStorage as default storage
import { combineReducers } from 'redux';
import {thunk} from 'redux-thunk'; // Import the correct thunk
import userReducer from '../slices/userSlice'; // Import your user slice

// Redux Persist Configuration
const persistConfig = {
    key: 'root', // Key for localStorage
    storage, // Type of storage to use
    whitelist: ['user'], // Specify which slices to persist
};

// Combine Reducers
const rootReducer = combineReducers({
    user: userReducer, // Add your reducers here
});

// Wrap Reducers with Persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these paths in serializability checks
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(thunk),
});

// Export Persistor
export const persistor = persistStore(store);
