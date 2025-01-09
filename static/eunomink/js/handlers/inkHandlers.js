function inkPicker(event){
    if(event.pointerType =="touch"){
        var off=0;//js takes badly the center of the finger ?
    } else {
        var off=0;
    }
    var objectToMove = null;//local
    var inkPlane = d3.select("#inksContainer").selectAll("svg");
    
    inkPlane.each(function(){
        var left = parseFloat(d3.select(this).style("left"));
        var right = parseFloat(d3.select(this).style("left"))+parseFloat(d3.select(this).attr("width"));
        var top = parseFloat(d3.select(this).style("top"));
        var bottom = parseFloat(d3.select(this).style("top"))+parseFloat(d3.select(this).attr("height"));
     
        if(event.clientX-off>left && event.clientX-off<right && event.clientY-off>top && event.clientY-off<bottom){//ça oblige a partir du centre !
            objectToMove=d3.select(this);
        }
        
    })
    return objectToMove;
}


function inkMover_setup(event,inkFound){

    window.startX = event.clientX;
    window.startY = event.clientY;

    //position dans le repère de la minitable
    var shiftX = event.clientX - inkFound.node().getBoundingClientRect().left;
    var shiftY = event.clientY - inkFound.node().getBoundingClientRect().top;

    inkFound.node().style.position = 'absolute';
    inkFound.node().style.zIndex = 1000;
/*
    if(inkFound.attr("postitId")!=null){//l'encre a un post-it en dessous (par sur que l'encre ait cet attribut donc on vérifie)
       
        d3.selectAll(".postitContainer").filter(function(){
            return d3.select(this).attr("postitId")==inkFound.attr("postitId")
        }).each(function(){
            var oldx=parseFloat(d3.select(this).style("left"));
            var oldy=parseFloat(d3.select(this).style("top"));
            d3.select(this).attr("startx",oldx).attr("starty",oldy);
        })
    }
    */

    return [inkFound,shiftX,shiftY];
}



function inkMover(event,[inkFound,shiftX,shiftY]){
    var off = 8;
    inkFound.node().style.left = event.pageX - shiftX - off + 'px';
    inkFound.node().style.top = event.pageY - shiftY - off+ 'px';
/*
    if(inkFound.attr("postitId")!=null){//l'encre a un post-it en dessous
        d3.selectAll(".postitContainer").filter(function(){
            return d3.select(this).attr("postitId")==inkFound.attr("postitId")
        }).each(function(){
            var oldx=Number(d3.select(this).attr("startx"));
            var oldy=Number(d3.select(this).attr("starty"));
            d3.select(this).style("left",oldx+(event.clientX - startX)+"px").style("top",oldy+(event.clientY - startY)+"px");
        })
    }
    */
}


function inkReleaser(inkFound){
   

     //avant de check si on a relaché sur un élément, on check si on a relaché sur une ink pour fusionner
                            //-> comment définir le chevauchement ?


    //----------------------------------------------------------------------------------//
    //                                     Magnet                                       //
    
    var magnet=false;
    var last = inkVector.x.length-1;
    //si le centre de l'ink est inclus dans un élément, on set l'attribut magnet à cet élément
    var elementPlane = d3.select("#elementsContainer").selectAll("svg");
    elementPlane.each(function(){
        var left = parseFloat(d3.select(this).style("left"));
        var right = left+parseFloat(d3.select(this).attr("width"));
        var top = parseFloat(d3.select(this).style("top"));
        var bottom = top+parseFloat(d3.select(this).attr("height"));
        
        
        //if(center[0]>left && center[0]<right && center[1]>top && center[1]<bottom && magnet==false){
        if((inkVector.x[0]>left && inkVector.x[0]<right && inkVector.y[0]>top && inkVector.y[0]<bottom) || (inkVector.x[last]>left && inkVector.x[last]<right && inkVector.y[last]>top && inkVector.y[last]<bottom) && magnet==false){
            if(d3.select(this).attr("id")!=null){
                inkFound.attr("magnet",d3.select(this).attr("id"));
            } else {
                inkFound.attr("magnet",d3.select(this).attr("class"));
            }
           
            magnet=true;
        }  

    })
    if(magnet==false){//si on n'a pas trouvé de parent
        inkFound.attr("magnet","none");
    }
    //----------------------------------------------------------------------------------//

    inkFound.node().style.zIndex = 0;
    inkFound=null;//on reset la variable globale
    
    return inkFound;
}



function magnetic_inks(objectToMove){
    var inks = d3.select("#inksContainer").selectAll("svg")
                                            .filter(function(){
                                                return d3.select(this).attr("magnet")==objectToMove.attr("id");
                                            });
    if(inks.empty()==true){//au cas où le nom de l'objet est dans sa classe et non dans son id
        var inks = d3.select("#inksContainer").selectAll("svg")
                                            .filter(function(){
                                                return d3.select(this).attr("magnet")==objectToMove.attr("class");
                                            });
    }

    return inks;
}




function inkHandler(inkFound){
    //dans tous les cas on rend l'ink permanente, on dessine dessus, 
    //mais si on ne bouge pas on considère que c'était juste pour catch l'ink donc on n'enregistrera pas le nouveau dessin
    
    //clearTimeout(ink_timer);
    inkNature(inkFound,"permanent");

    draw();

}


function draw(){
    //doit être dans pointerdown car ne doit pas etre appelé plusieurs fois
    window.inkVector ={
        x:[],
        y:[]
    };
    clearTimeout(inkWaitingTimer);
    for (var i=0;i<POINTER_EVENTS.length;i++){
        WPT.canvas.addEventListener(POINTER_EVENTS[i],Ink,false);
    }
}

function draw_end(){
    //cloture du path
    for (var i=0;i<POINTER_EVENTS.length;i++){
        WPT.canvas.removeEventListener(POINTER_EVENTS[i],Ink,false);
        WPT.context2d.clearRect(0,0,2000,10000);
    };
}




function inkNature(inkParent,nature){
    var ink = inkParent.selectAll("path");
    inkParent.attr("state","visible").style("position","absolute").attr("magnet","none")
    var delay=1500;
    
    if(nature=="transient"){//always arrow for the moment
        inkParent.attr("nature","transient");
        
        ink.transition()
            .duration(delay)
            .ease(d3.easeCubic)
            .style("opacity", "0");//disparition
    
        //ink_timer = 
        setTimeout(() => {  inkParent.remove(); }, delay);
        
  
    } else {
        /*
        var previousInk=d3.selectAll(".ink").filter(function(){return parseInt(d3.select(this).attr("inkId"))==inkId});
        //on cherche s'il y en a d'autres avec cet id
        
        if(previousInk.empty()==false){
            //si oui on ajoute ce path "ink" au svg recentInk et on remove inkParent  à l'autre et on lance le timer
            
            if(previousInk.select("path").attr("stroke")=="#01118B"){//encre sèche

                ink.transition()
                    .duration(delay/2)
                    .attr("stroke", "#01118B")
                    .style("opacity","1");  
                
                var temp=[];
                for(i=0;i<inkVector.x.length;i++){
                    var vec=[inkVector.x[i],inkVector.y[i]];
                    temp.push(vec);
                }
                fusionInk(previousInk,temp);

                inkId+=1; //?

            } else {//encre humide
                var temp=[];
                for(i=0;i<inkVector.x.length;i++){
                    var vec=[inkVector.x[i],inkVector.y[i]];
                    temp.push(vec);
                }
                var fusionnedInk=fusionInk(previousInk,temp);

                var newBigPath=fusionnedInk.selectAll("path");
    
                inkWaitingTimer = setTimeout(() => { 
                    newBigPath.transition()
                        .duration(delay/2)
                        .attr("stroke", "#01118B")
                        .style("opacity","1");    
    
                inkId+=1; //bien
    
                }, inkWaitingDelay);
            }
            

        } else {
           */
            inkParent.attr("nature","permanent").attr("inkId",inkId).attr("postitId",null);//meme si elle ne sèche pas, elle doit avoir un id pour qu'on puisse la trouver

            //sinon on lance juste le timer pour celle la
            //dans tous les cas, reposer le pen casse le timer
            if(palette_state=="closed"){
                var targetColor="darkblue";
            } else {
                var targetColor=stylus_color;
            }
            inkWaitingTimer = setTimeout(() => { 
                ink.transition()
                    .duration(delay/2)
                    .attr("stroke", targetColor)
                    .style("opacity","1");    

            inkId+=1; //bien

            }, inkWaitingDelay);
        //}
        
    }
}

function fusionInk(oldInkSVG,newInkPath){
    //newinkpath est dans le référentiel de la fenêtre
  
    var newTop=d3.min([oldInkSVG.style("top"),d3.min(inkVector.y)]);
    var newLeft=d3.min([oldInkSVG.style("left"),d3.min(inkVector.x)]);
    var newWidth=d3.max([oldInkSVG.attr("width"),d3.max(inkVector.x)-newLeft]);
    var newHeight=d3.max([oldInkSVG.attr("height"),d3.max(inkVector.y)-newTop]);

    //var offsetX=d3.min(inkVector.x)-new

    oldInkSVG.attr("width",newWidth)
            .attr("height",newHeight)
            .style("left",newLeft)
            .style("top",newTop)
            .append("path")
            .attr("stroke", "#0111FF")
            .attr("stroke-width", ink_stroke_width)
            .attr("fill","none")
            .attr("d",  d3.line()(newInkPath));

    inkParent.remove();

    return oldInkSVG;
}



function inkDrawing_to_SVG(color){
    
    
    //--------------------------------------------------------------//
    //                  Path to SVG and mini-SVG                    //
    window.top_ink=d3.min(inkVector.y)-ink_stroke_width;
    window.left_ink=d3.min(inkVector.x)-ink_stroke_width;
    window.height_ink=d3.max(inkVector.y)-top_ink+ink_stroke_width;
    window.width_ink=d3.max(inkVector.x)-left_ink+ink_stroke_width;

    var inkPlane = d3.select("#inksContainer");
    window.inkPath=[];
    
    for(i=0;i<inkVector.x.length;i++){
        var vec=[inkVector.x[i]-left_ink,inkVector.y[i]-top_ink];
        inkPath.push(vec);
        //mini_inkPath.push([vec[0]*width_ratio,vec[1]*height_ratio]);

    }
   
    if(palette_state=="closed"){
        window.ink_stroke_width=1;
        if(context[context.length-1]=="pen_on_postit"){
            window.ink_stroke_width=2;
        }
    } else {
        window.ink_stroke_width=2;
    }
    
    
    //width et height sont celles de l'ink, top et left aussi, dans le référentiel du canvas
    var ink = inkPlane.append("svg").attr("class","ink").attr("width",width_ink).attr("height",height_ink).style("left",left_ink).style("top",top_ink);  
    var inkStroke = ink.append("path")
        .attr("stroke", color)
        .attr("stroke-width", ink_stroke_width)
        .attr("fill","none")
        .attr("d",  d3.line()(inkPath));
    
    
    //--------------------------------------------------------------//
    return ink;
}

function distInkPoints(firstPoint,secondPoint){
    var dist = Math.sqrt((inkVector.x[secondPoint]-inkVector.x[firstPoint])*(inkVector.x[secondPoint]-inkVector.x[firstPoint])+(inkVector.y[secondPoint]-inkVector.y[firstPoint])*(inkVector.y[secondPoint]-inkVector.y[firstPoint]));
    return dist;
  }

function inkClassifier(){
    var type = "unknown";

    //-------------------------subcellular-------------------------//
    
    tableContainer_left = parseFloat(tableContainer.style("left"));
    tableContainer_top = parseFloat(tableContainer.style("top"));
   
    var translate = table.attr("transform").split(",");
    var offsetX = Number(translate[0].split("(")[1]);
    var offsetY = Number(translate[1].split(")")[0]);
  
    var colIdLeft=pixelsToColumnScale_table(d3.min(inkVector.x)-tableContainer_left-x_margin-offsetX);
    var rowIdTop=pixelsToRowScale_table(d3.min(inkVector.y)-tableContainer_top-y_margin-offsetY);
    var colIdRight=pixelsToColumnScale_table(d3.max(inkVector.x)-tableContainer_left-x_margin-offsetX);
    var rowIdBottom=pixelsToRowScale_table(d3.max(inkVector.y)-tableContainer_top-y_margin-offsetY);
   
    //difference en hauteur entre le premier point et le dernier
    var diff =Math.abs(inkVector.y[0]-inkVector.y[inkVector.y.length-1]);
    var diff_x =Math.abs(d3.min(inkVector.x)-d3.max(inkVector.x));
    
    if(colIdLeft==colIdRight && rowIdTop==rowIdBottom && diff<=50){
        if(diff_x<10 && diff>10){//c'est peu large mais comme c'est haut ce n'est pas un point
            type = "subcell_line";
         
            return type;
        } else {
            type = "subcell_circle";
           
            return type;
        }
    }

    //-------------------------straight line-------------------------//

    var nbIdx=inkVector.x.length;
    var subDiv=10;
    var sum = distInkPoints(0,parseInt(nbIdx/subDiv));
    for(i=1;i<subDiv-1;i++){
        sum += distInkPoints(parseInt(i*nbIdx/subDiv),parseInt((i+1)*nbIdx/subDiv))
    }
    sum += distInkPoints(parseInt((subDiv-1)*nbIdx/subDiv),nbIdx-1);
    var toleratedDiff=distInkPoints(0,nbIdx-1)/15
    if(Math.abs(distInkPoints(0,nbIdx-1)-sum)<toleratedDiff){
        type = "straight line"
        
        return type;
    }


    
    
    var subDiv=50;
    var sum = distInkPoints(0,parseInt(nbIdx/subDiv));
    for(i=1;i<subDiv-1;i++){
        sum += distInkPoints(parseInt(i*nbIdx/subDiv),parseInt((i+1)*nbIdx/subDiv))
    }
    sum += distInkPoints(parseInt((subDiv-1)*nbIdx/subDiv),nbIdx-1);
   

    var close=40;//d3.max([height,width])/2;
    
    //si on termine au meme endroit qu'on a commencé, c'est rectangle rond ou carré

    if(distInkPoints(0,nbIdx-1)<close){

        var width=Math.abs(d3.min(inkVector.x)-d3.max(inkVector.x));
        var height=Math.abs(d3.min(inkVector.y)-d3.max(inkVector.y));
        var D = (width+height)/2;

        var toleratedDiff=sum/12;

        if(Math.abs(sum-Math.PI*D)>toleratedDiff){
            type = "rectangle";
            return type;
        } else {
            /*
            type = "cercle";
            return type;
            */
        }
    }

    

    return type;
}

















function midPointBetween(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}


function Ink(evt) {
   
    if(device=="wacom"){

        var outStr = "";
        var canvasBBox = WPT.canvas.getBoundingClientRect();
        var screenPos = {
            x: evt.clientX,
            y: evt.clientY
        };
        var pos = {
            x: screenPos.x - canvasBBox.left,
            y: screenPos.y - canvasBBox.top
        };
        
        

        var pressure = evt.pressure;
        var buttons = evt.buttons;
        var tilt = { x: evt.tiltX, y: evt.tiltY };
        var rotate = evt.twist;
        if (WPT.reportData) {
            outStr = evt.pointerType + " , " + evt.type + " : "
        }
        if (evt.pointerType) {
            
           
            if (buttons == EPenButton.barrel) {
                WPT.context2d.strokeStyle = "blue";//useless
            }
            else {
                WPT.context2d.strokeStyle = stylus_color;
            }
        
                
                
            
            if (WPT.useTilt) {
                // Favor tilts in x direction.
                context.lineWidth = pressure * 3 * Math.abs(tilt.x);
                // Uncomment for a "vaseline" (smeary) effect:
                //WPT.context2d.shadowColor = "blue";
                //WPT.context2d.shadowBlur = WPT.context2d.lineWidth / 2;
            }
            else {

                WPT.context2d.lineWidth = pressure * 5;//10
            }
                    
                

            
            // special case of pen eraser button
            if (buttons == EPenButton.eraser) {
                WPT.context2d.strokeStyle = WPT.BKG_COLOR;//a changer
            }
            switch (evt.type) {
                case "gotpointercapture":{
                    
                    WPT.isDrawing = true;
                    WPT.lastPos = pos;//first point
                    inkVector.x.push(pos.x);
                    inkVector.y.push(pos.y);
                    break;
                }
                case "pointerdown":{
                
                
                    WPT.isDrawing = true;
                    WPT.lastPos = pos;
                    
                    inkVector.x.push(pos.x);
                    inkVector.y.push(pos.y);
                    
                    break;
                }
                case "pointerup":{
                    WPT.lastPos=null;
                    WPT.context2d.closePath();

                    WPT.isDrawing = false;
                   
                    break;
                }
                case "pointermove":{
                   
                
                    if (!WPT.isDrawing) {//la première fois on va ici
                        
                        return;
                    }
                    
                    // erase with background color.
                    if (buttons == EPenButton.eraser) {//a changer aussi
                        var eraserSize = 20;
                        WPT.context2d.fillStyle = WPT.BKG_COLOR;
                        WPT.context2d.fillRect(pos.x, pos.y, eraserSize, eraserSize);
                        WPT.context2d.fill
                    } else if (pressure > 0) {//wacom ?
                    
                        WPT.context2d.beginPath();
                        //WPT.context2d.setLineDash([0, 4]);
                        WPT.context2d.lineCap = "round";
                        
                        WPT.context2d.moveTo(WPT.lastPos.x, WPT.lastPos.y);
                        // Draws Bezier curve from context position to midPoint.
                        var midPoint = midPointBetween(WPT.lastPos, pos);
                        WPT.context2d.quadraticCurveTo(WPT.lastPos.x, WPT.lastPos.y,midPoint.x, midPoint.y);
                        // This lineTo call eliminates gaps (but leaves flat lines if stroke
                        // is fast enough).
                        
                        WPT.context2d.lineTo(pos.x, pos.y);
                        
                        WPT.context2d.stroke();
                     
                        //----------same for the path----------//
                        WPT.path.lineCap = "round";
                        WPT.path.moveTo(WPT.lastPos.x, WPT.lastPos.y);
                        WPT.path.quadraticCurveTo(WPT.lastPos.x, WPT.lastPos.y,midPoint.x, midPoint.y);
                        // This lineTo call eliminates gaps (but leaves flat lines if stroke
                        // is fast enough).
                        
                        WPT.path.lineTo(pos.x, pos.y);

                    }
                    WPT.lastPos = pos;
                   
                    inkVector.x.push(pos.x);
                    inkVector.y.push(pos.y);
/*
                    var inkBelow=inkPicker(evt);
                    if(inkBelow!=null){
                        clearTimeout(ink_timer);
                        inkNature(inkBelow,"permanent");
                        inkReleaser(inkBelow);
                        context.pop();
                        context.push("pen_on_ink")
                    }
                    */
                    break;
                }
                
                case "pointerover":{
                    document.body.style.cursor = "crosshair";
                    break;
                }
                case "pointerout":{
                    document.body.style.cursor = "default";
                    break;
                }
                case "pointerenter":{ // maybe same as pointerover
                    document.body.style.cursor = "crosshair";
                    break;
                }
                case "pointerleave":{ // maybe same as pointerout
                    document.body.style.cursor = "default";
                    break;
                }
                case "lostpointercapture":{ // maybe same as pointerout
                    document.body.style.cursor = "default";
                    break;
                }
                
                default:{
                    console.log("WARNING: unhandled event: " + evt.type);
                    break;
                }
            }
        }
    





    } else {//ipad or anything
        var outStr = "";
        var canvasBBox = WPT.canvas.getBoundingClientRect();
        var screenPos = {
            x: evt.clientX,
            y: evt.clientY
        };
        var pos = {
            x: screenPos.x - canvasBBox.left,
            y: screenPos.y - canvasBBox.top
        };
        
        
        if(u==0){
            WPT.isDrawing = true;
            WPT.lastPos = pos;
            
            inkVector.x.push(pos.x);
            inkVector.y.push(pos.y);
            
            drawEndTimer=Date.now();
        }
        

        var pressure = evt.pressure;
        var buttons = evt.buttons;
        var tilt = { x: evt.tiltX, y: evt.tiltY };
        var rotate = evt.twist;
        if (WPT.reportData) {
            outStr = evt.pointerType + " , " + evt.type + " : "
        }
        if (evt.pointerType) {
            
           
            WPT.context2d.strokeStyle = "blue";//useless
            
                
                
            
            if (WPT.useTilt) {
                // Favor tilts in x direction.
                context.lineWidth = pressure * 3 * Math.abs(tilt.x);
                // Uncomment for a "vaseline" (smeary) effect:
                //WPT.context2d.shadowColor = "blue";
                //WPT.context2d.shadowBlur = WPT.context2d.lineWidth / 2;
            }
            else {
                WPT.context2d.lineWidth = pressure * 10;
            }
                    
                

            
            // special case of pen eraser button
            if (buttons == EPenButton.eraser) {
                WPT.context2d.strokeStyle = WPT.BKG_COLOR;//a changer
            }
            switch (evt.type) {
                case "gotpointercapture":{
                    
                    WPT.isDrawing = true;
                    WPT.lastPos = pos;//first point
                    inkVector.x.push(pos.x);
                    inkVector.y.push(pos.y);
                    break;
                }
                case "pointerdown":{
                
                
                    WPT.isDrawing = true;
                    WPT.lastPos = pos;
                    
                    inkVector.x.push(pos.x);
                    inkVector.y.push(pos.y);
                    
                    break;
                }
                case "pointerup":{
                    
                    WPT.isDrawing = false;
                    u=0;
                    WPT.lastPos=null;
                    WPT.context2d.closePath();
                    drawEndTimer=Date.now();
                    break;
                }
                case "pointermove":{
                    u=1;
                /*
                    if (!WPT.isDrawing) {//la première fois on va ici
                        
                        return;
                    }
                    */
                    // erase with background color.
                    if (buttons == EPenButton.eraser) {//a changer aussi
                        var eraserSize = 20;
                        WPT.context2d.fillStyle = WPT.BKG_COLOR;
                        WPT.context2d.fillRect(pos.x, pos.y, eraserSize, eraserSize);
                        WPT.context2d.fill
                    }
                    // To maintain pressure setting per data point, need to turn
                    // each data point into a stroke.
                    // TODO - this code "works" but draws flat lines if stroke is very fast.
                    // Need a way to fill in more of a curve between each pair of points.
                    // Possibly fill in the gap with interpolated points when the distance
                    // between each pair of generated points is larger than some value.
                    // See https://codepen.io/kangax/pen/FdlHC?editors=1010 for sample code
                    // of how to determine distance between points.

                    //else if (pressure > 0) {//wacom ?
                    
                        WPT.context2d.beginPath();
                        WPT.context2d.lineCap = "round";
                        
                        WPT.context2d.moveTo(WPT.lastPos.x, WPT.lastPos.y);
                        // Draws Bezier curve from context position to midPoint.
                        var midPoint = midPointBetween(WPT.lastPos, pos);
                        WPT.context2d.quadraticCurveTo(WPT.lastPos.x, WPT.lastPos.y,midPoint.x, midPoint.y);
                        // This lineTo call eliminates gaps (but leaves flat lines if stroke
                        // is fast enough).
                        
                        WPT.context2d.lineTo(pos.x, pos.y);
                        
                        
                        if(u==1){
                            WPT.context2d.stroke();
                        }
                        

                        //----------same for the path----------//
                        WPT.path.lineCap = "round";
                        WPT.path.moveTo(WPT.lastPos.x, WPT.lastPos.y);
                        WPT.path.quadraticCurveTo(WPT.lastPos.x, WPT.lastPos.y,midPoint.x, midPoint.y);
                        // This lineTo call eliminates gaps (but leaves flat lines if stroke
                        // is fast enough).
                        WPT.path.lineTo(pos.x, pos.y);

                    //}
                    WPT.lastPos = pos;
                    inkVector.x.push(pos.x);
                    inkVector.y.push(pos.y);

                    var inkBelow=inkPicker(evt);
                    if(inkBelow!=null){
                        clearTimeout(ink_timer);
                        inkNature(inkBelow,"permanent");
                        inkReleaser(inkBelow);
                        context.pop();
                        context.push("pen_on_ink")
                    }
                    break;
                }
                
                case "pointerover":{
                    document.body.style.cursor = "crosshair";
                    break;
                }
                case "pointerout":{
                    document.body.style.cursor = "default";
                    break;
                }
                case "pointerenter":{ // maybe same as pointerover
                    document.body.style.cursor = "crosshair";
                    break;
                }
                case "pointerleave":{ // maybe same as pointerout
                    document.body.style.cursor = "default";
                    break;
                }
                case "lostpointercapture":{ // maybe same as pointerout
                    document.body.style.cursor = "default";
                    break;
                }
                
                default:{
                    console.log("WARNING: unhandled event: " + evt.type);
                    break;
                }
            }
        }
    }
    
}