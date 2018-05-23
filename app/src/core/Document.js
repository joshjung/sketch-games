import Dispatcher from './util/Dispatcher';
import DocumentEvent from './events/DocumentEvents';
import Event from './util/Event';

/**
 * An interface for standard document DOM element interaction.
 */
class Document extends Dispatcher {
  //---------------------------------------------
  // Constructor
  //---------------------------------------------
  constructor() {
    super();
    this.listenForDocumentFocusChange();
  }

  //---------------------------------------------
  // Properties
  //---------------------------------------------
  /**
   * Returns true if the document is in focus (e.g. the user is looking at the tab/window).
   *
   * @returns {Boolean}
   */
  get focus() {
    return this._focus;
  }

  /**
   * Internally set to any change in focus.
   *
   * @param {Boolean} value True or false.
   */
  set __focus(value) {
    if (this._focus === value) {
      return;
    }
    this._focus = value;
    this.dispatch(new Event(DocumentEvent.FOCUS_CHANGE, {focus: this._focus}));
  }

  //---------------------------------------------
  // Methods
  //---------------------------------------------
  /**
   * Sets up event listeners for various browser to watch for a loss of focus on the tab.
   * If focus is lost, then it pauses the rendering loop to help reduce enery usage.
   *
   * See:
   * http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
   */
  listenForDocumentFocusChange() {
    var hidden = 'hidden';

    // Standards:
    if (hidden in document) {
      document.addEventListener('visibilitychange', this.onFocusChangeHandler.bind(this, hidden));
    } else if ((hidden = 'mozHidden') in document) {
      document.addEventListener('mozvisibilitychange', this.onFocusChangeHandler.bind(this, hidden));
    } else if ((hidden = 'webkitHidden') in document) {
      document.addEventListener('webkitvisibilitychange', this.onFocusChangeHandler.bind(this, hidden));
    } else if ((hidden = 'msHidden') in document) {
      document.addEventListener('msvisibilitychange', this.onFocusChangeHandler.bind(this, hidden));
    } else if ('onfocusin' in document) { // IE 9 and lower:
      document.onfocusin = document.onfocusout = this.onFocusChangeHandler.bind(this, hidden);
    } else {
      window.onpageshow = window.onpagehide =
        window.onfocus = window.onblur = this.onFocusChangeHandler.bind(this, hidden);
    }
  }

  //---------------------------------------------
  // Event Handlers
  //---------------------------------------------
  /**
   * Called when the browser tab/window gains or loses focus.
   *
   * @param {Boolean} property
   * @param {Event} event
   */
  onFocusChangeHandler(property, event) {
    var v = false;
    var h = true;
    var eventMap = {focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h};

    event = event || window.event;

    this.__focus = event.type in eventMap ? !eventMap[event.type] : !document[property];
  }
};

export default Document;
