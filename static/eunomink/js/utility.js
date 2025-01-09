var sliders = false;
//densité en pixels css / cm
var density = 100 / 2.7;
var id = 0;
var svg = null;
var navigation = {
  main: null,
  transform: null,
  offset: {
    x: 0,
    y: 0
  },
  matrix: null
};

var draggables = {};

var links = {};

var browser, os, userAgent = navigator.userAgent;
// The order matters here, and this may report false positives for unlisted browsers.

if (userAgent.indexOf("Firefox") > -1) {
  browser = "firefox";
  // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
} else if (userAgent.indexOf("SamsungBrowser") > -1) {
  browser = "samsungInternet";
  // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
  browser = "opera";
  // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
} else if (userAgent.indexOf("Trident") > -1) {
  browser = "internetExplorer";
  // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
} else if (userAgent.indexOf("Edge") > -1) {
  browser = "edge";
  // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
} else if (userAgent.indexOf("Chrome") > -1) {
  browser = "chrome";
  // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
} else if (userAgent.indexOf("Safari") > -1) {
  browser = "safari";
  // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
} else {
  browser = "unknown";
}

if (userAgent.indexOf("Windows") > -1) {
  os = "windows";
} else if (userAgent.indexOf("Mac") > -1) {
  os = "mac";
} else {
  os = "other";
}

const EPenButton = {
  tip: 0x1, // left mouse, touch contact, pen contact
  barrel: 0x2, // right mouse, pen barrel button
  middle: 0x4, // middle mouse
  eraser: 0x20 // pen eraser button
};

const POINTER_TYPES = {
  TOUCH: "touch",
  PEN: "pen",
  MOUSE: "mouse"
};

const POINTER_EVENTS = [
  'pointerdown',
  'pointerup',
  'pointercancel',
  'pointermove',
  'pointerover',
  'pointerout',
  'pointerenter',
  'pointerleave',
  'gotpointercapture',
  'lostpointercapture'
];

//thresholds to determine gestures, along with some attributes for debugging
var threshold = {
  swipe: {
    value: 1,
    min: 0.1,
    max: 10,
    step: 0.1
  },
  rotation: {
    value: 0.2,
    min: 0.1,
    max: 1,
    step: 0.1
  }
}

//the object we need for detecting and handling the manipulation aspect
var manipulation = {
  trace: null,
  svg: null,
  maxDistance: 0,
  minDistance: 0,
  holdSelection: 0,
}

var gestures = {
  rotation: "rotation",
  swipeDown: "swipeDown",
  swipeUp: "swipeUp",
  swipeLeft: "swipeLeft",
  swipeRight: "swipeRight",
  tap: "tap"
}

var touchInput = function (evt) {
  if (os === "mac") {
    return evt.pointerType !== POINTER_TYPES.PEN;
  } else {
    return (evt.pointerType === POINTER_TYPES.TOUCH);
  }
}

var penInput = function (evt) {
  return (evt.pointerType === POINTER_TYPES.PEN);
}

var penOrTouchInput = function (evt) {
  return touchInput(evt) || penInput(evt);
};

function middlePoint(point1, point2) {
  var middle = svg.createSVGPoint();
  middle.x = (point1.x + point2.x) / 2;
  middle.y = (point1.y + point2.y) / 2;
  return middle;
}

function getPointerPosition(evt, parentTransform = null) {
  //gets the position of the pointer accounting for the transformations applied to the svg canvas
  var pos = svg.createSVGPoint();
  pos.x = evt.clientX;
  pos.y = evt.clientY;
  pos = pos.matrixTransform(navigation.matrix.inverse());
  if (parentTransform !== null) {
    pos = pos.matrixTransform(parentTransform.inverse());
  }
  return pos;
}

function applyOffset(point, offset) {
  point.x += offset.x;
  point.y += offset.y;
}

function printMatrix(matrix) {
  return `(${matrix.a}, ${matrix.b}, ${matrix.c}, ${matrix.d}, ${matrix.e}, ${matrix.f})`;
}

function insertBoundingRectangle(g, before = null) {
  var boundingRectangle = g.node().getBBox();

  return g.insert("g", before)
    .append("rect")
    .attr("width", boundingRectangle.width)
    .attr("height", boundingRectangle.height)
    .attr("x", boundingRectangle.x)
    .attr("y", boundingRectangle.y);
}

function getUniqueValues(array) {
  return array.filter(function (value, index, self) {
    return self.indexOf(value) === index;
  });
}

function applyTranslation(draggable, translation) {
  draggable.attr("transform", "translate(" + translation.x + "," + translation.y + ")");
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

function pixelsToRow(scale,pix){
  return Number((scale(pix)).toFixed());
}

function rowToPixels(scale,row){
  return (scale(row));
}


function pixelsToColumn(scale,pix){
  return Number((scale(pix)).toFixed());
}

function columnToPixels(scale,row){
  return (scale(row));
}



function woodenFrame(parent,x,y,width,height,bonus){

  
  var test = y+height+bonus;
  
  //bottomline
  parent.append("rect").attr("class","woodenStroke")
          .attr("x",x)
          .attr("y",test)
          .attr("width",width+2*bonus)
          .attr("height",bonus);

  //topline
  parent.append("rect").attr("class","woodenStroke")
          .attr("x",x)
          .attr("y",y)
          .attr("width",width+2*bonus)
          .attr("height",bonus);

  //leftline
  parent.append("rect").attr("class","woodenStroke")
          .attr("x",x)
          .attr("y",y)
          .attr("width",bonus)
          .attr("height",height+2*bonus);

  //rightline
  parent.append("rect").attr("class","woodenStroke")
          .attr("x",x+width+bonus)
          .attr("y",y)
          .attr("width",bonus)
          .attr("height",height+2*bonus);
            
}



// Function to compute density
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
      });
    };
}
  
function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}

function kernelGaussian(k) {
    return function(v) {
        return Math.exp(-(v*v)/2)/Math.sqrt(2*Math.PI);
    };
}



function getVector(rawVector){
  if(rawVector.length!=0){
    if(typeof rawVector[0] == "string"){//string vector, to convert to numbers
    //if(isNaN(rawVector[0]*1)){
      return rawVector.split(',').map(Number);
    } else {
      return rawVector;
    }
  } else {
      return [];
  }
}

function transition(g) {
  return g.transition().duration(1000);
  }

function get_x_transform(el){
  return parseFloat(el.attr("transform").split(",")[0].split("(")[1]);
}


function get_y_transform(el){
  return parseFloat(el.attr("transform").split(",")[1].split(")")[0]);
}


function num_to_num_and_str_to_str(rawVector){
  if(rawVector.length!=0){
    if(isNaN(rawVector[0]*1)){//string vector, to convert to numbers
      
      return rawVector;
    } else {
      
      return rawVector.map(i=>Number(i))
    }
  } else {
      return [];
  }
}


function initialize_global_variables(){//columnsWidths et cumulatedColumnsWidths non inclues

  window.table = d3.select("#table");
  window.minitable = d3.select("#miniTable");
  window.miniplots = d3.selectAll(".plot");
  

  window.table_width = parseFloat(table.attr("width"));
  window.table_height = parseFloat(table.attr("height"));
          
  window.tableContainer = d3.select("#tableContainer");
  window.miniTableContainer = d3.selectAll("#miniTableContainer");
  window.miniplotsContainers = d3.selectAll(".plotContainer");//doit être rappelé à chaque ouverture et fermeture de plot
  window.elementsContainer = d3.selectAll("#elementsContainer");

  window.tableContainer_left = parseFloat(tableContainer.style("left"));
  window.tableContainer_right = tableContainer_left+parseFloat(tableContainer.attr("width"));
  window.tableContainer_top = parseFloat(tableContainer.style("top"));
  window.tableContainer_bottom = tableContainer_top+parseFloat(tableContainer.attr("height"));

  window.ghostRowWidth = parseFloat(d3.select("#tableClippath").attr("width"));
  window.ghostRowHeight = parseFloat(d3.select(".cell").select("rect").attr("height"));

  window.ghostColWidth = parseFloat(d3.select(".cell").select("rect").attr("width"));//wrong
  window.ghostColHeight =  parseFloat(d3.select("#tableClippath").attr("height"));


  window.minitable_background_height = minitable.select(".background").attr("height");
  window.minitable_background_width = minitable.select(".background").attr("width");
      

  window.pixelsToRowScale_table = d3.scaleQuantize()//table, must be offseted
                                  .domain([50,table_height+50])//pixels
                                  .range(d3.range(n));//row
  
  window.pixelsToRowScale_minitable = d3.scaleQuantize()//Linear()//table, must be offseted
                                  .domain([0,minitable_background_height])//pixels
                                  .range(d3.range(n));//row

  
  window.cumulatedColumnsWidths_allbutlast=[];
  for(i=0;i<cumulatedColumnsWidths.length-1;i++){
      cumulatedColumnsWidths_allbutlast.push(cumulatedColumnsWidths[i]);
  }
  
  window.pixelsToColumnScale_table = function(pix){//pix : 0 à table_width
      var res=0;
      
      window.cumulatedColumnsWidths_allbutlast=[];
      for(i=0;i<cumulatedColumnsWidths.length-1;i++){
          cumulatedColumnsWidths_allbutlast.push(cumulatedColumnsWidths[i]);
      }
      
      
      for(i=0;i<cumulatedColumnsWidths.length;i++){
          if(pix>=cumulatedColumnsWidths_allbutlast[i]){
              res=d3.range(p)[i];
          }
      }
      return res;
  }
  
  

  var ratio=table_width/minitable_background_width;
  
  window.cumulatedColumnsWidths_allbutlast_minitable=[];
  for(i=0;i<cumulatedColumnsWidths_allbutlast.length-1;i++){
      cumulatedColumnsWidths_allbutlast_minitable.push(cumulatedColumnsWidths_allbutlast[i]/ratio);
  }
  
  
  window.pixelsToColumnScale_minitable = function(pix){//pix : 0 à table_width
    var res=0;

    var ratio=table_width/minitable_background_width;

    window.cumulatedColumnsWidths_allbutlast_minitable=[];
    for(i=0;i<=cumulatedColumnsWidths_allbutlast.length-1;i++){
        cumulatedColumnsWidths_allbutlast_minitable.push(cumulatedColumnsWidths_allbutlast[i]/ratio);
    }

    for(i=0;i<=cumulatedColumnsWidths_allbutlast_minitable.length;i++){
        if(pix>=cumulatedColumnsWidths_allbutlast_minitable[i]){
            res=d3.range(p)[i];
        }
    }
    return res;
  }


  window.popupRatio=0.75;
  


  window.row_tPixels_mtPixels = d3.scaleLinear()
                                    .domain([table_height,0])//table pixels
                                    .range([minitable.attr("height"),0]);//minitable pixels, not background ???
  
  window.rowToPixelsScale = d3.scaleLinear()
                              .domain([0,n])//row //n-1 ??
                              .range([0,minitable_background_height]);//pixels    
  
  window.colToPixelsScale = d3.scaleLinear()
                              .domain([0,p])//row //n-1 ??
                              .range([0,minitable_background_width]);//pixels   NOPE

  window.row_mtPixels_tPixels = d3.scaleLinear()
                                  .domain([minitable_background_height,0])//minitable pixels
                                  .range([table_height,0]);//table pixels         
  
  window.col_mtPixels_tPixels = d3.scaleLinear()//ne fonctionne pas lorsque les colonnes n'ont pas la même largeur
                                  .domain([minitable_background_width,0])//minitable pixels
                                  .range([table_width,0]);//table pixels
  //a update lorsqu'on supprime ou crée une ligne ou colonne ?
  window.col_mtPixels_col = d3.scaleQuantize()
                                  .domain([0,minitable_background_width])//minitable pixels
                                  .range(d3.range(p));//col ids     
                                  
  window.row_mtPixels_row = d3.scaleQuantize()
                                  .domain([0,minitable_background_height])//minitable pixels
                                  .range(d3.range(n));//col ids  
}


function exclude_headers(){
  d3.select("#table").attr("excluded","0")
}

function good_rows_and_missing_rows(rowlist,id){
  var goodrows=[];
  var missingrows=[];
  d3.selectAll(".textcell").filter(function(){
    return parseInt(d3.select(this).attr("columnId"))==id && rowlist.includes(parseInt(d3.select(this).attr("rowId")));
  }).each(function(){
    if(d3.select(this).text()!=""){
      goodrows.push(parseInt(d3.select(this).attr("rowId")));
    } else {
      missingrows.push(parseInt(d3.select(this).attr("rowId")));
    }
  })
  return {goodrows,missingrows};
}


function densityVectors_extractor(values,id){
  var densityVectors = [];
  var textcells=d3.selectAll(".textcell")
                                  .filter(function(){
                                      return d3.select(this).attr("columnId")==id;
                                  })
  for(i=0;i<values.length;i++){
      var rowsVector=[];
      textcells.filter(function(){//on retourne tous ceux dont .text est inclus dans le vecteur de ce nbin là
                  return values[i]==parseFloat(d3.select(this).text());
                  })
              .each(function(){
                  //if( selfRowList.includes(parseInt(d3.select(this).attr("rowId")))){// Si on a le droit de le sélectionner, mais a priori oui puisque le plot ne montre que le sélectionnable
                      rowsVector.push(Number(d3.select(this).attr("rowId")));
                  //    }            
                  });  
      densityVectors.push([values[i],rowsVector]);
  }
  return densityVectors;
}