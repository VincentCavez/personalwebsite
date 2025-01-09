class pointerCache {
  constructor() {
    this.array = new Array();
  }


  pushEvent(evt) {
    // Save this event in the cache
    this.array.push(evt);
  }

  updateEvent(evt) {
    // Remove this event from the cache
    for (var i = 0; i < this.array.length; i++) {
      if (this.array[i].pointerId == evt.pointerId) {
        this.array.splice(i, 1, evt);
        break;
      }
    }
  }


  removeEvent(evt) {
    // Remove this event from the cache
    for (var i = 0; i < this.array.length; i++) {
      if (this.array[i].pointerId == evt.pointerId) {
        this.array.splice(i, 1);
        break;
      }
    }
  }
}
