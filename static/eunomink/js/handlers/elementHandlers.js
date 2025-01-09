
function elementPicker(event){
    var off=-6;//a cause de la bordure invisble
    
    var objectToMove = null;//local
    var elementPlane = d3.select("#elementsContainer").selectAll("svg").filter(function(){
        return d3.select(this).attr("class")!="plotContainer";
    });
 
    elementPlane.each(function(){
        var left = parseFloat(d3.select(this).style("left"));
        var right = left+parseFloat(d3.select(this).attr("width"));
        var top = parseFloat(d3.select(this).style("top"));
        var bottom = top+parseFloat(d3.select(this).attr("height"));
        
        //console.log(left,right,top,bottom)
        if(event.clientX+off>=left && event.clientX+off<=right && event.clientY+off>=top && event.clientY+off<=bottom){
            objectToMove=d3.select(this);
        }
        
    })
    return objectToMove;
}


function elementMover_setup(event,elementFound){
   
    window.startX = event.clientX;
    window.startY = event.clientY;
    
    var shiftX = event.clientX - elementFound.node().getBoundingClientRect().left;
    var shiftY = event.clientY - elementFound.node().getBoundingClientRect().top;
    

    elementFound.node().style.position = 'absolute';

    if(elementFound.attr("class")=="postitContainer" || elementFound.attr("class")=="miniPostitContainer"){
        d3.selectAll(".ink").filter(function(){
            return d3.select(this).attr("postitId")==elementFound.attr("postitId")
        }).each(function(){
            var oldx=parseFloat(d3.select(this).style("left"));
            var oldy=parseFloat(d3.select(this).style("top"));
            d3.select(this).attr("startx",oldx).attr("starty",oldy);
        })
    }
    
    return [elementFound,shiftX,shiftY];
}


//function elementMover(event,[elementFound,inks,shiftX,shiftY,startXinks,startYinks,startXminitable,startYminitable,startXminiplots,startYminiplots,cursorXOriginVar,cursorYOriginVar,cursorAreaXOriginVar,cursorAreaYOriginVar,postitXvectorVar,postitYvectorVar,X_postitInksLinkedToTheTableVar,Y_postitInksLinkedToTheTableVar]){
function elementMover(event,[elementFound,shiftX,shiftY]){
    
    //Mouvement de l'objet
    elementFound.node().style.left = event.pageX - shiftX - off + 'px';
    elementFound.node().style.top = event.pageY - shiftY - off + 'px';

    if(elementFound.attr("class")=="postitContainer" || elementFound.attr("class")=="miniPostitContainer"){
        d3.selectAll(".ink").filter(function(){
            return d3.select(this).attr("postitId")==elementFound.attr("postitId")
        }).each(function(){
            var oldx=Number(d3.select(this).attr("startx"));
            var oldy=Number(d3.select(this).attr("starty"));
            d3.select(this).style("left",oldx+(event.clientX - startX)+"px").style("top",oldy+(event.clientY - startY)+"px");
        })
    }
   
        
}


//function elementReleaser(elementFound,inks){
function elementReleaser(elementFound){
    /*
    inks.each(function(){
        d3.select(this).node().style.zIndex = 0;
    });
*/
    elementFound.node().style.zIndex = 0;
    //elementFound=null;//global

    return elementFound;
}