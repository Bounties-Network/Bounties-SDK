/* eslint import/first: 0 */

// ultimately each of these imports should be in separate files

import authenticationReducer from './Authentication';
import bountiesReducer from './Bounties';
import bountyReducer from './Bounty';
import categoriesReducer from './Categories';
import clientReducer from './Client';
import fulfillmentsReducer from './Fulfillments';
import fulfillmentReducer from './Fulfillment';
import transactionReducer from './Transaction';

export const reducers = {
  bounties: bountiesReducer,
  categories: categoriesReducer,
  authentication: authenticationReducer,
  bounty: bountyReducer,
  client: clientReducer,
  fulfillments: fulfillmentsReducer,
  fulfillment: fulfillmentReducer,
  transaction: transactionReducer,
};

import * as authenticationSagas from './Authentication/sagas';
import * as bountiesSagas from './Bounties/sagas';
import * as bountySagas from './Bounty/sagas';
import * as categoriesSagas from './Categories/sagas';
import * as clientSagas from './Client/sagas';
import * as fulfillmentsSagas from './Fulfillments/sagas';
import * as fulfillmentSagas from './Fulfillment/sagas';
import * as transactionSagas from './Transaction/sagas';

export const sagaWatchers = [
  ...authenticationSagas.default,
  ...bountiesSagas.default,
  ...bountySagas.default,
  ...categoriesSagas.default,
  ...clientSagas.default,
  ...fulfillmentSagas.default,
  ...fulfillmentsSagas.default,
  ...transactionSagas.default,
];

export const sagas = {
  authentication: authenticationSagas,
  bounties: bountiesSagas,
  bounty: bountySagas,
  categories: categoriesSagas,
  client: clientSagas,
  fulfillment: fulfillmentSagas,
  fulfillments: fulfillmentsSagas,
  transaction: transactionSagas,
};

import { actions as authenticationActions } from './Authentication';
import { actions as bountiesActions } from './Bounties';
import { actions as bountyActions } from './Bounty';
import { actions as categoriesActions } from './Categories';
import { actions as clientActions } from './Client';
import { actions as fulfillmentActions } from './Fulfillment';
import { actions as fulfillmentsActions } from './Fulfillments';
import { actions as transactionActions } from './Transaction';

export const actions = {
  authentication: authenticationActions,
  bounties: bountiesActions,
  bounty: bountyActions,
  categories: categoriesActions,
  client: clientActions,
  fulfillment: fulfillmentActions,
  fulfillments: fulfillmentsActions,
  transaction: transactionActions
};

import { actionTypes as authenticationActionTypes } from './Authentication';
import { actionTypes as bountiesActionTypes } from './Bounties';
import { actionTypes as bountyActionTypes } from './Bounty';
import { actionTypes as categoriesActionTypes } from './Categories';
import { actionTypes as clientActionTypes } from './Client';
import { actionTypes as fulfillmentActionTypes } from './Fulfillment';
import { actionTypes as fulfillmentsActionTypes } from './Fulfillments';
import { actionTypes as transactionActionTypes } from './Transaction';

export const actionTypes = {
  authentication: authenticationActionTypes,
  bounties: bountiesActionTypes,
  bounty: bountyActionTypes,
  categories: categoriesActionTypes,
  client: clientActionTypes,
  fulfillment: fulfillmentActionTypes,
  fulfillments: fulfillmentsActionTypes,
  transaction: transactionActionTypes
};

import * as authenticationSelectors from './Authentication/selectors';
import * as bountiesSelectors from './Bounties/selectors';
import * as bountySelectors from './Bounty/selectors';
import * as categoriesSelectors from './Categories/selectors';
import * as clientSelectors from './Client/selectors';
import * as fulfillmentSelectors from './Fulfillment/selectors';
import * as fulfillmentsSelectors from './Fulfillments/selectors';
import * as transactionSelectors from './Transaction/selectors';

export const selectors = {
  authentication: authenticationSelectors,
  bounties: bountiesSelectors,
  bounty: bountySelectors,
  categories: categoriesSelectors,
  client: clientSelectors,
  fulfillment: fulfillmentSelectors,
  fulfillments: fulfillmentsSelectors,
  transaction: transactionSelectors
};

import configImport from './config.js';
export const config = configImport;
export default config;

import requestImport from './utils/request';
export const request = requestImport;

import * as helpersImport from './utils/helpers';
export const helpers = helpersImport;