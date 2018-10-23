import request from '../utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';
import { actions } from './';
import { actionTypes as clientActionTypes } from '../Client';
import config from '../config';

const { SET_INITIALIZED } = clientActionTypes;
const { loadCategoriesFail, loadCategoriesSuccess } = actions;

export function* loadCategories(action) {
  try {
    const params = { limit: 2000, platform: config.settings.categoryPlatform };
    const endpoint = 'category/';
    const categories = yield call(request, endpoint, 'GET', { params });
    yield put(loadCategoriesSuccess(categories));
  } catch (e) {
    yield put(loadCategoriesFail(e));
  }
}

export function* watchCategories() {
  yield takeLatest(SET_INITIALIZED, loadCategories);
}

export default [watchCategories];
