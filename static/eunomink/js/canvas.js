var WPT = {
    W: null,
    H: null,
    BKG_COLOR: "#EEE",
    canvas: null,
    context2d: null,
    path:null,
    reportData: false,
    useTilt: false,
    isDrawing: false,
    lastPos: null
};



var createCanvas = function(){
    var supportsPointerEvents = window.PointerEvent;
    if(device=="wacom"){
        WPT.W=window.screen.width-25;//?
        WPT.H=window.screen.height-131;
    }
    if(device=="ipad"){
        WPT.W=5120;//width*height must be < 16777216
        WPT.H=3072;
    }
    d3.select("#globalContainer")
      .append("div").attr("id","canvasContainer")//with the properties
      .append("canvas")
      .attr("width", WPT.W+"px")
      .attr("height", WPT.H+"px")
    WPT.canvas = d3.select("canvas").node();
    WPT.context2d = WPT.canvas.getContext("2d");
    WPT.path = d3.path();
    //clearCanvas(WPT.BKG_COLOR);
    initListeners();
};

function clearCanvas(color) {
    WPT.context2d.fillStyle = color;
    WPT.context2d.fillRect(0, 0, WPT.W, WPT.H);
}





