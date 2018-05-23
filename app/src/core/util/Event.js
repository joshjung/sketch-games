'use strict';

/*============================================*\
 * Class
\*============================================*/
/**
 * Represents an event that can bubble or use the capture phase.
 */
class Event {
  constructor(type, properties, bubbles, useCapture) {
    this.type = type;
    this.bubbles = bubbles;
    this.useCapture = useCapture;
    this.phase = -1;
    this.target = null;
    this.properties = properties;
  }
}

/*============================================*\
 * Static Properties
\*============================================*/
Event.typeId = 0x0;

/*============================================*\
 * Static Methods
\*============================================*/
/**
 * Generate a type object which describes the type of an Event. Slightly more memory intensive than just a type string,
 * but comparison of types should be faster since we do not have to compare every character in a string, but just a
 * memory address.
 *
 * This method also guarantees that the typeId is unique.
 *
 * @param {String} type The type string (e.g. 'scroll')
 * @param {String} description A description of the event to help with debugging.
 * @returns {{name: String, typeId: Number}}
 */
Event.generateType = function(type, description) {
  return {
    type: type,
    description: description,
    typeId: Event.typeId++
  };
};

/**
 * Builds an Object mapping event types to objects that represent what each event is, including a unique Numeric
 * identifier.
 *
 * @param {Object[]} typesAndDescriptions Expected to be in the format of [{type: String, description: String}...]
 * @returns {{eventName: {type: String, description: String, typeId: Number}}}
 */
Event.generateEventList = function(typesAndDescriptions) {
  var ret = {};
  typesAndDescriptions.forEach(tad => {
    ret[tad.type] = Event.generateType(tad.type, tad.description);
  });
  return ret;
};

export default Event;
