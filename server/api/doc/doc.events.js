/**
 * Doc model events
 */

'use strict';

import {EventEmitter} from 'events';
var Doc = require('../../sqldb').Doc;
var DocEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
DocEvents.setMaxListeners(0);

// Model events
var events = {
  afterCreate: 'save',
  afterUpdate: 'save',
  afterDestroy: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Doc) {
  for(var e in events) {
    let event = events[e];
    Doc.hook(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc, options, done) {
    DocEvents.emit(event + ':' + doc._id, doc);
    DocEvents.emit(event, doc);
    done(null);
  };
}

registerEvents(Doc);
export default DocEvents;
