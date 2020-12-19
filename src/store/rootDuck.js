import { all, fork } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as posts from "./ducks/posts.duck.js";

export const rootReducer = combineReducers({
  posts: posts.postsReducer,
});

export function* rootSaga() {
  yield all([
    posts.saga,
  ].map(saga => fork(saga)));
};


