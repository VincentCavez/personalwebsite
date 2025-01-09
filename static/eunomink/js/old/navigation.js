function makeDraggable(svg, draggable, inputFilter = touchInput, parentTransform = null, releaseBehavior = null) {
  //inspired of the code found on : https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/

  var id = draggable.attr("id");
  var cache = new pointerCache();

  var scaling = false;
  var dragging = false;
  var distanceInit = false;
  var newOffset = {
    x: 0,
    y: 0
  };
  var start1 = false,
    start2 = false,
    middle = false,
    newMatrix = false;

  if (!draggables[id]) {
    draggables[id] = {};
  }
  draggables[id].k = 1;
  draggables[id].offset = {
    x: 0,
    y: 0
  };
  draggables[id].draggable = draggable;

  var draggableSelection = {};
  Object.assign(draggableSelection, currentSelection);// copié collé
  draggables[id].selection = draggableSelection;
  draggables[id].data = dataset.rows;
  draggables[id].headers = dataset.columns;
  draggables[id].inputFilter = inputFilter;
  draggables[id].matrix = svg.createSVGMatrix();
  draggables[id].transform = svg.createSVGTransform();
  draggables[id].transform.setMatrix(draggables[id].matrix);
  draggables[id].draggable.node().transform.baseVal.insertItemBefore(draggables[id].transform, 0);
  draggables[id].releaseBehavior = releaseBehavior;

  draggables[id].draggable.on("pointerdown", pointerdownHandler)
    .on("pointermove", pointermoveHandler)
    .on("pointerup", pointerupHandler);

  function pointerdownHandler(evt) {
    evt.preventDefault();
    if (draggables[id].inputFilter(evt)) {
      cache.pushEvent(evt);
      if (cache.array.length === 1) {
        startDrag(evt);
      } else if (cache.array.length === 2) {
        startScale(evt);
      }
    }
  }

  function pointermoveHandler(evt) {
    evt.preventDefault();
    if (draggables[id].inputFilter(evt)) {
      cache.updateEvent(evt);
      if (dragging) {
        moveDrag(evt);
      } else if (scaling) {
        moveScale(evt);
      }
    }
  }

  function pointerupHandler(evt) {
    evt.preventDefault();
    if (draggables[id].inputFilter(evt)) {
      cache.removeEvent(evt);
      if (dragging) {
        endDrag(evt);
      } else if (scaling) {
        endScale(evt);
      }
    }
  }

  /*-------------------Scaling-----------------*/
  function startScale(evt) {
    start1 = getPointerPosition(cache.array[0], parentTransform);
    start2 = getPointerPosition(cache.array[1], parentTransform);


    middle = middlePoint(start1, start2);
    middle = middle.matrixTransform(draggables[id].matrix.inverse());

    distanceInit = dist(start1, start2);
    scaling = true;
    dragging = false;
  }

  function moveScale(evt) {
    var distance = dist(getPointerPosition(cache.array[0], parentTransform), getPointerPosition(cache.array[1], parentTransform));
    draggables[id].k = distance / distanceInit;

    newMatrix = svg.createSVGMatrix()
    newMatrix.a = draggables[id].matrix.a * draggables[id].k;
    newMatrix.b = draggables[id].matrix.b * draggables[id].k;
    newMatrix.d = draggables[id].matrix.d * draggables[id].k;
    newMatrix.c = draggables[id].matrix.c * draggables[id].k;

    newMatrix.e = draggables[id].matrix.e + (draggables[id].matrix.a - newMatrix.a) * middle.x;
    newMatrix.f = draggables[id].matrix.f + (draggables[id].matrix.a - newMatrix.a) * middle.y;
    draggables[id].transform.setMatrix(newMatrix);
  }

  function endScale(evt) {
    draggables[id].offset = {
      x: newMatrix.e,
      y: newMatrix.f
    }
    draggables[id].matrix = newMatrix;
    newMatrix = false;
    start1 = false;
    start2 = false;
    scaling = false;
    middle = false;
    draggables[id].k = 1;
  }

  /*-------------------Dragging-----------------*/
  function startDrag(evt) {
    evt.preventDefault();
    dragging = true;
    scaling = false;
    start1 = {
      x: cache.array[0].clientX,
      y: cache.array[0].clientY
    };
  };

  function moveDrag(evt) {
    newOffset = {
      x: (cache.array[0].clientX - start1.x) / navigation.matrix.a + draggables[id].offset.x,
      y: (cache.array[0].clientY - start1.y) / navigation.matrix.d + draggables[id].offset.y
    };

    if (parentTransform !== null) {
      newOffset.x = newOffset.x / parentTransform.a;
      newOffset.y = newOffset.y / parentTransform.d;
    }
    draggables[id].matrix.e = newOffset.x;
    draggables[id].matrix.f = newOffset.y;
    draggables[id].transform.setMatrix(draggables[id].matrix);
  };

  function endDrag(evt) {
    start1 = false;
    dragging = false;
    draggables[id].offset = newOffset;
    if (draggables[id].releaseBehavior != null) {
      draggables[id].releaseBehavior(evt);
    }
  }


};

function distCustom(point1, point2) {
  return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}


function makeZoomable(svg) {
  //this allows zoom and pan behavior. We simply check that the event was targetting the invisible rectangle element dedicated to zooming and panning
  //otherwise those same gestures have a different meaning (ex: resizing a window).
  const zoomListener = d3.select("#zoomListener");
  var cache = new pointerCache();


  navigation.matrix = svg.createSVGMatrix();

  navigation.transform = svg.createSVGTransform();
  navigation.transform.setMatrix(navigation.matrix);
  navigation.main.node().transform.baseVal.insertItemBefore(navigation.transform, 0);



  var distanceInit = false;
  var zooming = false;
  var panning = false;
  var k = 1,
    offset = navigation.offset;
  var start1 = false,
    start2 = false,
    middle = false,
    newMatrix = false;

  //--------------Pan-------------//
  function startPan(evt) {
    start1 = {
      x: cache.array[0].clientX,
      y: cache.array[0].clientY
    };
    panning = true;
    zooming = false;
  }

  function movePan(evt) {
    offset = {
      x: cache.array[0].clientX - start1.x + navigation.offset.x,
      y: cache.array[0].clientY - start1.y + navigation.offset.y
    };
    navigation.matrix.e = offset.x;
    navigation.matrix.f = offset.y;
    navigation.transform.setMatrix(navigation.matrix);
  }

  function endPan(evt) {
    start1 = false;
    panning = false;
    navigation.offset = offset;
  }


  //--------------Zoom-------------//
  function startZoom(evt) {
    start1 = { //doigt 1
      x: cache.array[0].clientX,
      y: cache.array[0].clientY
    };
    start2 = {//doigt 2
      x: cache.array[1].clientX,
      y: cache.array[1].clientY
    };


    middle = middlePoint(start1, start2);
    middle = middle.matrixTransform(navigation.matrix.inverse());

    distanceInit = distCustom(start1, start2);
    zooming = true;
    panning = false;
  }

  function moveZoom(evt) {
    var distance = distCustom({
      x: cache.array[0].clientX,
      y: cache.array[0].clientY
    }, {
      x: cache.array[1].clientX,
      y: cache.array[1].clientY
    });
    k = distance / distanceInit;

    newMatrix = svg.createSVGMatrix()
    newMatrix.a = navigation.matrix.a * k;
    newMatrix.b = navigation.matrix.b * k;
    newMatrix.c = navigation.matrix.c * k;
    newMatrix.d = navigation.matrix.d * k;

    newMatrix.e = navigation.matrix.e + (navigation.matrix.a - newMatrix.a) * middle.x;
    newMatrix.f = navigation.matrix.f + (navigation.matrix.a - newMatrix.a) * middle.y;

    navigation.transform.setMatrix(newMatrix);
  }

  function endZoom(evt) {
    navigation.offset = {
      x: newMatrix.e,
      y: newMatrix.f
    }
    navigation.matrix = newMatrix;
    newMatrix = false;
    start1 = false;
    start2 = false;
    zooming = false;
    middle = false;
    k = 1;
  }

  //--------------navigation logic------------//
  function pointerdownHandler(evt) {
    evt.preventDefault();
    if (touchInput(evt)) {
      cache.pushEvent(evt);
      if (cache.array.length === 1) {
        startPan(evt);
      } else if (cache.array.length === 2) {
        startZoom(evt);
      }
    }
  }

  function pointermoveHandler(evt) {
    evt.preventDefault();
    if (touchInput(evt)) {
      cache.updateEvent(evt);
      if (panning) {
        movePan(evt);
      } else if (zooming) {
        moveZoom(evt);
      }
    }

  }

  function pointerupHandler(evt) {
    evt.preventDefault();
    if (touchInput(evt)) {
      cache.removeEvent(evt);
      if (panning) {
        endPan(evt);
      } else if (zooming) {
        endZoom(evt);
      }
    }

  }

  zoomListener.on("pointerdown", pointerdownHandler)
    .on("pointermove", pointermoveHandler)
    .on("pointerup", pointerupHandler);
}
