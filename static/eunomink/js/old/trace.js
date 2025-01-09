//a class to handle the trace of our pointer (which should be the pen for manipulation)
class Trace {
  constructor() {
    this.events = [];
    this.size = 0;
    this.distance = 0;
    this.pointerId = null;
    this.target = null;
    this.lastPoint = null;
    this.wait = true;
    this.start = Date.now();
  }

  enqueue(evt) {//adds new elements to the queue
    if (evt.pointerId === this.pointerId) {
      while (this.distance > manipulation.maxDistance) {//si la distance enregistrée est plus grande que celle tolérée, on l'enlève.
        var dequeued = this.dequeue();
        this.distance -= dequeued.distance;
      }
      var distance, speed;
      var time = Date.now();
      if (time - this.start > 50) {
        this.wait = false;
      }
      if (this.isEmpty()) {
        distance = 0;
        speed = 0;
      } else {
        distance = dist(this.lastPoint, {//la nouvelle distance
          x: evt.clientX,
          y: evt.clientY
        });
        speed = distance / (time - this.events[this.size - 1].time);
      }

      this.events.push({
        evt: evt,
        time: time,
        distance: distance,
        speed: speed
      });
      this.distance += distance;
      this.lastPoint = {
        x: evt.clientX,
        y: evt.clientY
      };
      this.size++;
    }
  }

  dequeue() {//removes the first element from the queue
    if (this.size > 0) {//s'il y a plus d'une trace, on enlève la première ?
      this.size--;
      return this.events.shift();
    }
  }

  isEmpty() {
    return this.size == 0;
  }

  setStart(start) {
    this.start = start;
  }

  setPointerId(pointerId) {
    this.pointerId = pointerId;
  }

  setTarget(target) {
    this.target = target;
  }

  clear() {
    this.events = [];
    this.size = 0;
    this.pointerId = null;
    this.target = null;
    this.distance = 0;
    this.lastPoint = null;
    this.wait = true;
    this.start = null;
  }

  detectGesture() {
    var firstPoint = {
      x: this.events[0].evt.clientX,
      y: this.events[0].evt.clientY
    };
    if (this.distance > manipulation.minDistance) {
      if ((this.distance - dist(firstPoint, this.lastPoint)) / dist(firstPoint, this.lastPoint) > threshold.rotation.value) {
        //this is a rotation
        return gestures.rotation;
      } else {
        //this is a swipe, we must determine the direction
        var swipeX = this.lastPoint.x - firstPoint.x;
        var swipeY = this.lastPoint.y - firstPoint.y;
        if (Math.abs(swipeX) > Math.abs(swipeY)) {
          if (swipeX > 0) {
            return gestures.swipeRight;
          } else {
            return gestures.swipeLeft;
          }
        } else {
          if (swipeY > 0) {
            return gestures.swipeDown;
          } else {
            return gestures.swipeUp;
          }
        }
      }
    } else {
      //not enough distance to be considered a swipe or a rotation : is a tap
      return gestures.tap;
    }
  }

  //we determine which gesture was made, and we send it to the appropriate handler, depending on the target 
  handle() {
    var gesture = this.detectGesture(); //gestures.tap, etc...

    
    var classList = this.target.classList;

    if ((classList.contains("tableCell"))||(classList.contains("tableHeader"))||(classList.contains("MenuHeader"))) {
      //we send it to the table handler
      tableTraceHandler(this, gesture);
    }
    else if (classList.contains("barChart")) {
      histogramTraceHandler(this, gesture);
    }
    else if (classList.contains("histogram")){
      histogramTraceHandler(this, gesture);
    }
    this.clear();
  }
}


