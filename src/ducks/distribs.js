import {appName} from '../config'
import {createSelector} from 'reselect'
import {OrderedSet, Record} from 'immutable'
import {put, call, takeEvery} from 'redux-saga/effects'
import axios from 'axios'
import {arrToMap, arrToSet} from './utils'
 

// Constants

export const moduleName = 'distribs'
const prefix = `${appName}/${moduleName}`
export const LOAD_DISTRIBS_START = `${prefix}/LOAD_DISTRIBS_START`
export const LOAD_DISTRIBS_SUCCESS = `${prefix}/LOAD_DISTRIBS_SUCCESS`
export const LOAD_DISTRIBS_ERROR = `${prefix}/LOAD_DISTRIBS_ERROR`


// Reducer
const DistribsModel = Record({
	'id': null,
	'acf': null,
	'slug': null,
	'content': null,
	'title': null
})

const ReducerState = Record({
	entities: OrderedSet([]),
	error: null,
	loaded: false,
	loading: true
})

export default function reducer(state = new ReducerState(), action) {
	const {type, payload} = action

	switch(type){
		case LOAD_DISTRIBS_SUCCESS:
	 		return state
	 						.set('entities', arrToSet(payload.response.data, DistribsModel))
	 						.set('loaded', true)
	 		 				.set('loading', false)
	 			
		case LOAD_DISTRIBS_ERROR:
	 		return state
	 						.set('error', payload.error)
	 						.set('loaded', false)
	 						.set('loading', false)
	}

	return state
}

// Selectors

export const stateSelector = state => state[moduleName]
export const entitiesSelector = createSelector(stateSelector, state => state.entities)
export const loadingSelector = createSelector(stateSelector, state => state.loading)
export const loadedSelector = createSelector(stateSelector, state => state.loaded)
export const errorSelector = createSelector(stateSelector, state => state.error)


// Action Creators

export function loadDistribs(id){
	return {
		type: LOAD_DISTRIBS_START,
		payload: {id}
	}
}


//Sagas

export function * distribsSaga(action){

	try {
		const response = yield call(axios.get, `/wp-json/wp/v2/posts?categories=${action.payload.id}`)

		yield put({
						type: LOAD_DISTRIBS_SUCCESS,
						payload: {response}
					})
	} catch (error) {
		
		yield put({
						type: LOAD_DISTRIBS_ERROR,
						payload: {error}
					})
	}
}

export function * saga() {
	yield takeEvery(LOAD_DISTRIBS_START, distribsSaga)
}