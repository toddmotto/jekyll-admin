import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../collections';
import * as types from '../../constants/actionTypes';
import { API } from '../../constants/api';
import nock from 'nock';
import expect from 'expect';
import _ from 'underscore';

import { doc, new_doc, documents, collections } from './fixtures';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const filename = doc.path.substring(doc.path.lastIndexOf('/') + 1);

describe('Actions::Collections', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('fetches collections successfully', () => {
    nock(API)
      .get('/collections')
      .reply(200, collections);

    const expectedActions = [
      {type: types.FETCH_COLLECTIONS_REQUEST},
      {type: types.FETCH_COLLECTIONS_SUCCESS, collections}
    ];

    const store = mockStore({ collections: [] });

    return store.dispatch(actions.fetchCollections())
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetches the collection successfully', () => {
    let collection_name = "movies";
    nock(API)
      .get(`/collections/${collection_name}`)
      .reply(200, { collection_name, meta: {} });

    const expectedActions = [
      {type: types.FETCH_COLLECTION_REQUEST},
      {type: types.FETCH_COLLECTION_SUCCESS, collection: { collection_name, meta: {} } }
    ];

    const store = mockStore({ movies: {} });

    return store.dispatch(actions.fetchCollection(collection_name))
      .then(() => { // return of async actions
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetches the collection documents successfully', () => {
    const collection_name = "posts";
    nock(API)
      .get(`/collections/${collection_name}/documents`)
      .reply(200, documents);

    const expectedActions = [
      {type: types.FETCH_DOCUMENTS_REQUEST},
      {type: types.FETCH_DOCUMENTS_SUCCESS, documents }
    ];

    const store = mockStore({ currentDocuments: {} });

    return store.dispatch(actions.fetchDocuments(collection_name))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('fetches the document successfully', () => {
    nock(API)
      .get(`/collections/${doc.collection}/${filename}`)
      .reply(200, doc);

    const expectedActions = [
      {type: types.FETCH_DOCUMENT_REQUEST},
      {type: types.FETCH_DOCUMENT_SUCCESS, doc }
    ];

    const store = mockStore({ currentDocument: {} });

    return store.dispatch(actions.fetchDocument(doc.collection, filename))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('deletes the document successfully', () => {
    nock(API)
      .delete(`/collections/${doc.collection}/${filename}`)
      .reply(200);

    const expectedActions = [
      { id: filename, type: types.DELETE_DOCUMENT_SUCCESS }
    ];

    const store = mockStore({});

    return store.dispatch(actions.deleteDocument(filename, doc.collection))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('creates DELETE_DOCUMENT_FAILURE when deleting document failed', () => {
    nock(API)
      .delete(`/collections/${doc.collection}/${filename}`)
      .replyWithError('something awful happened');

    const expectedAction = {
      type: types.DELETE_DOCUMENT_FAILURE,
      error: 'something awful happened'
    };

    const store = mockStore({});

    return store.dispatch(actions.deleteDocument(filename, doc.collection))
      .then(() => {
        expect(store.getActions()[0].type).toEqual(expectedAction.type);
      });
  });

  it('updates the document successfully', () => {
    nock(API)
      .put(`/collections${doc.id+doc.ext}`)
      .reply(200, doc);

    const expectedActions = [
      { type: types.CLEAR_ERRORS },
      { type: types.PUT_DOCUMENT_SUCCESS, doc }
    ];

    const store = mockStore({metadata: { metadata: doc}});
    const filename = doc.path.substring(doc.path.lastIndexOf('/') + 1);

    return store.dispatch(actions.putDocument(filename, doc.collection))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('creates PUT_DOCUMENT_FAILURE when updating document failed', () => {
    nock(API)
      .put(`/collections${doc.id+doc.ext}`)
      .replyWithError('something awful happened');

    const expectedActions = [
      { type: types.CLEAR_ERRORS },
      { type: types.PUT_DOCUMENT_FAILURE, error: 'something awful happened' }
    ];

    const store = mockStore({metadata: { metadata: doc}});
    const filename = doc.path.substring(doc.path.lastIndexOf('/') + 1);

    return store.dispatch(actions.putDocument(filename, doc.collection))
      .then(() => {
        expect(store.getActions()[1].type).toEqual(expectedActions[1].type);
      });
  });

  it('creates the document successfully', () => {
    nock(API)
      .put(`/collections/${new_doc.collection}/${new_doc.path}`)
      .reply(200, doc);

    const expectedActions = [
      { type: types.CLEAR_ERRORS },
      { type: types.PUT_DOCUMENT_SUCCESS, doc }
    ];

    const store = mockStore({metadata: { metadata: new_doc}});

    return store.dispatch(actions.putDocument(null, new_doc.collection))
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('creates VALIDATION_ERROR if required field is not provided.', () => {
    const expectedActions = [
      {
        type: types.VALIDATION_ERROR,
        errors: [
          'The title is required.',
          'The filename is required.'
        ]
      }
    ];

    const store = mockStore({metadata: { metadata: _.omit(doc, ['title','path']) }});

    store.dispatch(actions.putDocument(doc.id, doc.collection));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
