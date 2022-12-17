import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import { Users } from "./modules/users/reducer";

const composeEnhancers: typeof compose =
  // @ts-ignore
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
  combineReducers({ users: Users.reducer }),
  composeEnhancers(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof store.getState>;
export type AppAction = Parameters<typeof store.dispatch>[0];
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, never, AppAction>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
