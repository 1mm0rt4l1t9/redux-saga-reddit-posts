import { put, takeLatest, call } from 'redux-saga/effects';
import { createAction } from '../../utils/action-helper';
import { fetchPosts } from '../../crud/posts.crud.js';

const CLEAR_FETCH = 'posts/CLEAR_FETCH';
const FETCH_REQUEST = 'posts/FETCH_REQUEST';
const FETCH_SUCCESS = 'posts/FETCH_SUCCESS';
const FETCH_FAIL = 'posts/FETCH_FAIL';

const LIKE_POST = "posts/LIKE_POST";
const DEL_POST = "posts/DEL_POST";

const initialState = {
  liked: false,
  subreddit: undefined,
  newPosts: [],
  posts: undefined,
  loading: false,
  success: false,
  error: null,
};

export const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_FETCH: {
      return { ...state, posts: undefined, loading: false, success: false, error: null };
    }

    case FETCH_REQUEST: {
      return { ...state, posts: undefined, loading: true, success: false, error: null };
    }

    case FETCH_SUCCESS: {
      action.payload.forEach((item) => {
        if (item.data.dist) {
          item.data.children.map(post => {
            state.newPosts.push(post);
          }); 
        }
      });

      return { ...state, posts: state.newPosts, loading: false, success: true };
    }

    case FETCH_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }

    case LIKE_POST: {
      return { ...state, liked: action.payload }
    }

    case DEL_POST: {
      let updatedPosts = [];
      state.newPosts.forEach(item => {
        if (item.data.id !== action.payload) updatedPosts.push(item);
      });

      return { ...state, newPosts: updatedPosts }
    }

    default:
      return state;
  }
};

export const actions = {
  clearFetch: () => createAction(CLEAR_FETCH),
  fetchRequest: (payload) => createAction(FETCH_REQUEST, payload),
  fetchSuccess: (payload) => createAction(FETCH_SUCCESS, payload),
  fetchFail: (payload) => createAction(FETCH_FAIL, payload),

  likePost: (payload) => createAction(LIKE_POST, payload),

  delPost: (payload) => createAction(DEL_POST, payload),
};

function* fetchSaga({ payload }) {
  try {
    const { data } = yield call(() => fetchPosts(payload));
    yield put(actions.fetchSuccess(data));
  } catch (e) {
    yield put(actions.fetchFail(e?.response?.data?.message || 'Произошла ошибка.'));
  }
}

export function* saga() {
  yield takeLatest(FETCH_REQUEST, fetchSaga);
}
