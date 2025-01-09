
const crossGenerator = d3.symbol().type(d3.symbolCross).size(32);

let lastIInk = null;

function editionBubble(textElement,type){

    var rid=parseInt(textElement.attr("rowId"));
   
    if(type=="subcell"){
        var subcell=d3.selectAll("#sc"+rid).filter(function(){
            return d3.select(this).attr("class")=="sc_principal";
        })
        var pos1=parseInt(subcell.attr("pos1"))
        var pos2=parseInt(subcell.attr("pos2"))
        var side=subcell.attr("side")
        
    } 
    

    let iinkLayer = document.getElementById("iinkLayer");
    if (iinkLayer == null){
        d3.select("body").append("div").attr("id", "iinkLayer");
    }
    else {
        d3.select("#iinkLayer").selectAll("svg").remove();
    }
    let svg4iink = d3.select("#iinkLayer")
                     .append("svg")
                     .attr("x", 0)
                     .attr("y", 0)
                     .attr("width", "100%")
                     .attr("height", "100%");  

    let cellValuePos = textElement.node().getBoundingClientRect();
    let foX =  cellValuePos.x;
    let foY = cellValuePos.y+20; // offset the iink box slight below cell value
    // dimensions should match the #iinkWrapper CSS declaration
    const foW = 400;
    const foH = 200;
    svg4iink.append("rect")
            .attr("x", foX)
            .attr("y", foY)
            .attr("width", foW)
            .attr("height", foH)
            .style("fill", "#FFF")
            .style("stroke", "#555");
    svg4iink.append("foreignObject")
            .attr("id", "iinkFO")
            .attr("x", foX)
            .attr("y", foY)
            .attr("width", foW)
            .attr("height", foH);
    // create the <div> directly with the DOM API as D3 seems to be messing up the xmlns declaration
    let iinkW = document.querySelector("#iinkFO");
    let iinkE = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    iinkE.setAttribute("id", "iinkWrapper");
    iinkE.setAttribute("touch-action", "none");
    iinkW.appendChild(iinkE);
    const iinkEditor = document.getElementById("iinkWrapper");

    iinkEditor.addEventListener('exported', (evt) => {
        const exports = evt.detail.exports;
        if (exports && exports['text/plain']){
            // XXX actually edit the table cell value based on the recognized ink
            // two possibilities: 1. we update at every new char (each time this callback is triggered)
            // 2. we update only when clicking on an OK button
        
            lastIInk = exports['text/plain'];
         
        }
    });

    /**
     * Attach an editor to the document
     * @param {Element} The DOM element to attach the ink paper
     * @param {Object} The recognition parameters
     */
    let editor = iink.register(iinkEditor, {
        recognitionParams: {
          type: 'TEXT',
          protocol: 'WEBSOCKET',
          server: {
            applicationKey: 'ceccb637-e367-44a7-9c3b-29788a52fc5a',
            hmacKey: 'f70e4c2e-f7b1-4956-815e-1c4b2ee0c0b9'
          }
        }
    });

    window.addEventListener('resize', () => {
      iinkEditor.editor.resize();
    });

    function canceliink(){
        d3.select("body").select("#iinkLayer").remove();
    }

    function commitiink(){
        
        if (lastIInk != null){
            
            if(type=="subcell"){
                if(lastIInk.includes("▧")==false){
                    replace_principalsubcells_with(lastIInk)
                } else {
                    edit_principalsubcells_with(lastIInk)
                }
            } else {
                replace_caret_with(lastIInk)
            }
            d3.selectAll(".sc_principal,.sc_secondary,.caret").remove()
            lastIInk = null;
        }
        d3.select("body").select("#iinkLayer").remove();
    }

    // iink component commit button
    let commitG = svg4iink.append("g")
                          .attr("transform", `translate(${foX+foW-25},${foY})`)
                          .on('click', () => (commitiink()));
    commitG.append("circle")
           .attr("cx", 0)
           .attr("cy", 0)
           .attr("r", 10)
           .style("fill", "#FFF")
           .style("stroke", "#AAA");
    commitG.append("path")
           .attr("d", crossGenerator)
           .style("fill", "green");
    // iink component cancel button
    let cancelG = svg4iink.append("g")
                         .attr("transform", `translate(${foX+foW},${foY}) rotate(45)`)
                         .on('click', () => (canceliink()));
    cancelG.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 10)
            .style("fill", "#FFF")
            .style("stroke", "#AAA");
    cancelG.append("path")
            .attr("d", crossGenerator)
            .style("fill", "#AAA");

    
    if (textElement.text() != null){//?
        if(type=="subcell"){
            var unique=true;
            d3.selectAll(".sc_principal").each(function(){
                if(d3.select(this).attr("text")!=textElement.text().slice(pos1,pos2+1)){
                    unique=false;
                }
            })
            if(unique==true){
                iinkEditor.editor.import_(textElement.text().slice(pos1,pos2+1), "text/plain");
            } else {
                iinkEditor.editor.import_("▧", "text/plain");
            }
            
        } 
    }
}
function headerBubble(textElement,type){

    var rid=-1
    if(type=="subcell"){
        var subcell=d3.selectAll("#sc"+rid).filter(function(){
            return d3.select(this).attr("class")=="sc_principal";
        })
        var pos1=parseInt(subcell.attr("pos1"))
        var pos2=parseInt(subcell.attr("pos2"))
    } 
    

    let iinkLayer = document.getElementById("iinkLayer");
    if (iinkLayer == null){
        d3.select("body").append("div").attr("id", "iinkLayer");
    }
    else {
        d3.select("#iinkLayer").selectAll("svg").remove();
    }
    let svg4iink = d3.select("#iinkLayer")
                     .append("svg")
                     .attr("x", 0)
                     .attr("y", 0)
                     .attr("width", "100%")
                     .attr("height", "100%");  

    let cellValuePos = textElement.node().getBoundingClientRect();
    let foX =  cellValuePos.x;
    let foY = cellValuePos.y+20; // offset the iink box slight below cell value
    // dimensions should match the #iinkWrapper CSS declaration
    const foW = 400;
    const foH = 200;
    svg4iink.append("rect")
            .attr("x", foX)
            .attr("y", foY)
            .attr("width", foW)
            .attr("height", foH)
            .style("fill", "#FFF")
            .style("stroke", "#555");
    svg4iink.append("foreignObject")
            .attr("id", "iinkFO")
            .attr("x", foX)
            .attr("y", foY)
            .attr("width", foW)
            .attr("height", foH);
    // create the <div> directly with the DOM API as D3 seems to be messing up the xmlns declaration
    let iinkW = document.querySelector("#iinkFO");
    let iinkE = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    iinkE.setAttribute("id", "iinkWrapper");
    iinkE.setAttribute("touch-action", "none");
    iinkW.appendChild(iinkE);
    const iinkEditor = document.getElementById("iinkWrapper");

    iinkEditor.addEventListener('exported', (evt) => {
        const exports = evt.detail.exports;
        if (exports && exports['text/plain']){
            // XXX actually edit the table cell value based on the recognized ink
            // two possibilities: 1. we update at every new char (each time this callback is triggered)
            // 2. we update only when clicking on an OK button
          
            lastIInk = exports['text/plain'];
        }
    });

    /**
     * Attach an editor to the document
     * @param {Element} The DOM element to attach the ink paper
     * @param {Object} The recognition parameters
     */
    let editor = iink.register(iinkEditor, {
        recognitionParams: {
          type: 'TEXT',
          protocol: 'WEBSOCKET',
          server: {
            applicationKey: 'ceccb637-e367-44a7-9c3b-29788a52fc5a',
            hmacKey: 'f70e4c2e-f7b1-4956-815e-1c4b2ee0c0b9'
          }
        }
    });

    window.addEventListener('resize', () => {
      iinkEditor.editor.resize();
    });

    function canceliink(){
        d3.select("body").select("#iinkLayer").remove();
    }

    function commitiink(){
        
        if (lastIInk != null){
          
            if(type=="subcell"){
                replace_principalsubcells_with(lastIInk)
            } else {
                replace_headercaret_with(lastIInk)
            }
            d3.selectAll(".sc_principal,.sc_secondary,.caret").remove()
            lastIInk = null;
        }
        d3.select("body").select("#iinkLayer").remove();
    }

    // iink component commit button
    let commitG = svg4iink.append("g")
                          .attr("transform", `translate(${foX+foW-25},${foY})`)
                          .on('click', () => (commitiink()));
    commitG.append("circle")
           .attr("cx", 0)
           .attr("cy", 0)
           .attr("r", 10)
           .style("fill", "#FFF")
           .style("stroke", "#AAA");
    commitG.append("path")
           .attr("d", crossGenerator)
           .style("fill", "green");
    // iink component cancel button
    let cancelG = svg4iink.append("g")
                         .attr("transform", `translate(${foX+foW},${foY}) rotate(45)`)
                         .on('click', () => (canceliink()));
    cancelG.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 10)
            .style("fill", "#FFF")
            .style("stroke", "#AAA");
    cancelG.append("path")
            .attr("d", crossGenerator)
            .style("fill", "#AAA");

    
    if (textElement.text() != null){//?
        if(type=="subcell"){
            iinkEditor.editor.import_(textElement.text().slice(pos1,pos2+1), "text/plain");
        } 
    }
}

function objectOverText(textElement,leftpix,rightpix,type,side,role,pos1,pos2){
    //type : highlight ou caret
    //side : left ou right (inutile si le type est caret)
    //role : principal ou secondary (inutile si le type est caret)
    var textWidth = textElement.node().getBoundingClientRect().right-textElement.node().getBoundingClientRect().left;
    
    var rid=parseInt(textElement.attr("rowId"));
    var cid=parseInt(textElement.attr("columnId"));
    var boxWidth=1.5;
   
    var oui =d3.select("#r"+rid).selectAll(".cell").filter(function(){//toutes les cellules de la bonne colonne et sélectionnées
                                                            return d3.select(this).attr("columnId")==cid;}
                                                            )
    
    var baseCell = get_x_transform( oui);
    var textAnchor = parseFloat(textElement.attr("x"))+baseCell;
    
    var offsetX = get_x_transform(table);
    var offsetY = get_y_transform(table);

    var textLeft = textAnchor - textWidth/2+offsetX;//car textAnchor c'est la coord du milieu
    var textHeight = textElement.node().getBoundingClientRect().bottom-textElement.node().getBoundingClientRect().top;
 
    var cellHeight = parseFloat(d3.select(".cell").select("rect").attr("height"));//constante
    var textBottom = parseFloat(textElement.attr("y"))+rid*cellHeight+offsetY+50;

    if(isNaN(rightpix-leftpix)==false && isNaN(textLeft+leftpix)==false){
        if(type != "caret"){//no nonsense
       
            var hl = d3.select("#tableClippath").append("rect").attr("id","sc"+rid)
                                                                .attr("side",side)
                                                                .attr("pos1",pos1)
                                                                .attr("pos2",pos2)
                                                                .attr("x",textLeft+leftpix).attr("y",textBottom-textHeight+boxWidth).attr("width",rightpix-leftpix).attr("height",textHeight)
                                                                .attr("rowId",rid).attr("columnId",cid)
                                                                .attr("rx",3).attr("ry",3)
                                                                .attr("text",textElement.text().slice(pos1,pos2+1));
            if(role=="principal"){
                hl.attr("class","sc_principal")
            } else {
                hl.attr("class","sc_secondary")
            }
            
        } else {
            //caret
            var hl = d3.select("#tableClippath").append("line").attr("class",type).attr("pos",pos1).attr("rowId",rid).attr("columnId",cid)
                                                                .attr("x1",textLeft+leftpix).attr("x2",textLeft+leftpix)
                                                                .attr("y1",textBottom-textHeight+boxWidth).attr("y2",textBottom+boxWidth)
                                                                
            //edition bubble
            d3.selectAll(".editionBubble").remove();
            editionBubble(textElement,"caret")
        }
    }
}

function objectOverHeader(textElement,leftpix,rightpix,type,side,role,pos1,pos2){
    //type : highlight ou caret
    //side : left ou right (inutile si le type est caret)
    //role : principal ou secondary (inutile si le type est caret)
    var textWidth = textElement.node().getBoundingClientRect().right-textElement.node().getBoundingClientRect().left;
    
    var rid=-1;
    var cid=parseInt(textElement.attr("columnId"));
    var boxWidth=1.5;
   
    var oui =d3.selectAll(".headerCell").filter(function(){//toutes les cellules de la bonne colonne et sélectionnées
                                                            return d3.select(this).attr("columnId")==cid;}
                                                            )
    
    var baseCell = get_x_transform( oui);
    var textAnchor = parseFloat(textElement.attr("x"))+baseCell;
    
    var offsetX = get_x_transform(table);
    var offsetY = get_y_transform(table);

    var textLeft = textAnchor - textWidth/2+offsetX;//car textAnchor c'est la coord du milieu
    var textHeight = textElement.node().getBoundingClientRect().bottom-textElement.node().getBoundingClientRect().top;
 
    var cellHeight = parseFloat(d3.select(".cell").select("rect").attr("height"));//constante
    var textBottom = parseFloat(textElement.attr("y"))+rid*cellHeight+offsetY+50;

    if(isNaN(rightpix-leftpix)==false && isNaN(textLeft+leftpix)==false){
        if(type != "caret"){//no nonsense
       
            var hl = d3.select("#tableClippath").append("rect").attr("id","sc"+rid)
                                                                .attr("side",side)
                                                                .attr("pos1",pos1)
                                                                .attr("pos2",pos2)
                                                                .attr("x",textLeft+leftpix).attr("y",textBottom-textHeight+boxWidth).attr("width",rightpix-leftpix).attr("height",textHeight)
                                                                .attr("rowId",rid).attr("columnId",cid)
                                                                .attr("rx",3).attr("ry",3)
                                                                .attr("text",textElement.text().slice(pos1,pos2+1));
            if(role=="principal"){
                hl.attr("class","sc_principal")
            } else {
                hl.attr("class","sc_secondary")
            }
            
        } else {
            //caret
            var hl = d3.select("#tableClippath").append("line").attr("class",type).attr("pos",pos1).attr("rowId",rid).attr("columnId",cid)
                                                                .attr("x1",textLeft+leftpix).attr("x2",textLeft+leftpix)
                                                                .attr("y1",textBottom-textHeight+boxWidth).attr("y2",textBottom+boxWidth)
                                                                
            //edition bubble
            d3.selectAll(".editionBubble").remove();
            headerBubble(textElement,"caret")
        }
    }
}




function textPicker(){

    var midX=d3.mean(inkVector.x);
    var midY=d3.mean(inkVector.y);
    
    var textToSelect = null;//local

    tableContainer_left = parseFloat(tableContainer.style("left"));
    tableContainer_top = parseFloat(tableContainer.style("top"));
   
   
    var offsetX = get_x_transform(table);
    var offsetY = get_y_transform(table);

    var relative_ClientX=midX-tableContainer_left-x_margin-offsetX;
    var relative_ClientY=midY-tableContainer_top-y_margin-offsetY;

    var colId=pixelsToColumnScale_table(relative_ClientX);
    var rowId=pixelsToRowScale_table(relative_ClientY);
    /*
    var textPlane = d3.selectAll(".textcell");

    var textToSelect = textPlane.filter(function(){
        return d3.select(this).attr("rowId")==rowId && d3.select(this).attr("columnId")==colId;
    });
    */
    var textToSelect = d3.select("#r"+rowId).selectAll(".cell").filter(function(){
        return parseFloat(d3.select(this).attr("columnId"))==colId;
    }).select("text");

    textToSelect.attr("rowId",rowId).attr("columnId",colId);

    return textToSelect;
}

function headerPicker(){

    var midX=d3.mean(inkVector.x);
    
    var textToSelect = null;//local

    tableContainer_left = parseFloat(tableContainer.style("left"));
    tableContainer_top = parseFloat(tableContainer.style("top"));
   
    var offsetX = get_x_transform(table);

    var relative_ClientX=midX-tableContainer_left-x_margin-offsetX;

    var colId=pixelsToColumnScale_table(relative_ClientX);
    
    var textToSelect = d3.selectAll(".headerCell").filter(function(){
        return parseFloat(d3.select(this).attr("columnId"))==colId;
    }).select("text");

    textToSelect.attr("columnId",colId);//?

    return textToSelect;
}





function cursorHandler(event,textToSelect){

    //handler
    var cursorWidth=1;
    var textWidth = textToSelect.node().getBoundingClientRect().right-textToSelect.node().getBoundingClientRect().left;
    var textHeight = textToSelect.node().getBoundingClientRect().bottom-textToSelect.node().getBoundingClientRect().top;
    var cellHeight = parseFloat(d3.select(".cellrow").attr("height"));
    var textAnchor = parseFloat(textToSelect.attr("x"));
    var rowId = parseInt(textToSelect.attr("rowId"));
    var translate = table.attr("transform").split(",");
    var offsetX = Number(translate[0].split("(")[1]);
    var offsetY = Number(translate[1].split(")")[0]);
    var textLeft = tableContainer_left+x_margin+textAnchor-textWidth/2+offsetX;
    var textBottom = tableContainer_top+y_margin+parseFloat(textToSelect.attr("y"))+rowId*cellHeight+offsetY;

    var relative_ClientX=event.clientX-textLeft-8;

    var cumulatedAnchors=[0];
    for(i=0;i<textToSelect.text().length;i++){
        cumulatedAnchors.push(charactersToPixels.get(textToSelect.text()[i])+cumulatedAnchors[i]);
    }
   
    //initialisations
    var diff=Math.abs(cumulatedAnchors[0]-relative_ClientX);
    var wantedX=cumulatedAnchors[0];
    var pos=0;
    //recherche du point le plus près de relative_ClientX
    for(i=1;i<cumulatedAnchors.length;i++){
        var newdiff=Math.abs(cumulatedAnchors[i]-relative_ClientX);

        if(newdiff<diff){
            diff=Math.abs(cumulatedAnchors[i]-relative_ClientX);
            wantedX=cumulatedAnchors[i];
            pos=i;
        }
    }
   
    
    d3.selectAll(".cursor").remove();
    d3.selectAll(".cursorArea").remove();

    d3.select("#elementsContainer").append("svg").attr("class","cursor")
                                                    .style("position","absolute")//.style("z-index",1000)
                                                    .style("left",textLeft+wantedX)
                                                    .style("top",textBottom-textHeight+2)
                                                    .attr("width",cursorWidth)
                                                    .attr("height",textHeight)
                                    .append("rect").style("fill","red")
                                                    .style("position","absolute")
                                                    .attr("x",0).attr("width",2)
                                                    .attr("y",0).attr("height",textHeight);
}






















function cursorAreaHandler_setup(event,textToSelect,startCursor){
    
    //handler
    var cursorWidth=1;
    var textWidth = textToSelect.node().getBoundingClientRect().right-textToSelect.node().getBoundingClientRect().left;
    var textHeight = textToSelect.node().getBoundingClientRect().bottom-textToSelect.node().getBoundingClientRect().top;
    var cellHeight = parseFloat(d3.select(".cellrow").attr("height"));
    var textAnchor = parseFloat(textToSelect.attr("x"));
    var rowId = parseInt(textToSelect.attr("rowId"));
    var translate = table.attr("transform").split(",");
    var offsetX = Number(translate[0].split("(")[1]);
    var offsetY = Number(translate[1].split(")")[0]);
    var textLeft = tableContainer_left+x_margin+textAnchor-textWidth/2+offsetX;
    var textBottom = tableContainer_top+y_margin+parseFloat(textToSelect.attr("y"))+rowId*cellHeight+offsetY;

    var relative_ClientX=event.clientX-textLeft-12;

    var cumulatedAnchors=[0];
    for(i=0;i<textToSelect.text().length;i++){
        cumulatedAnchors.push(charactersToPixels.get(textToSelect.text()[i])+cumulatedAnchors[i]);
    }

    var diff=Math.abs(cumulatedAnchors[0]-relative_ClientX);
    var wantedX=cumulatedAnchors[0];
    window.position=0;
    for(i=1;i<cumulatedAnchors.length;i++){
        var newdiff=Math.abs(cumulatedAnchors[i]-relative_ClientX);

        if(newdiff<diff){
            diff=Math.abs(cumulatedAnchors[i]-relative_ClientX);
            wantedX=cumulatedAnchors[i];
            position=i;
        }
    }
    

    d3.selectAll(".cursor").remove();
    d3.selectAll(".cursorArea").remove();
    
    d3.select("#elementsContainer").append("svg").attr("class","cursorArea")
                                                .style("position","absolute")//.style("z-index",1000)
                                                .style("left",wantedX+textLeft)
                                                .style("top",textBottom-textHeight+2)
                                                .attr("width",0)
                                                .attr("height",textHeight)
                                .append("rect").style("fill","red").style("opacity",0.5)
                                                .style("position","absolute")
                                                .attr("x",0).attr("width",0)
                                                .attr("y",0).attr("height",textHeight);
    
    return (wantedX+textLeft);
}






function cursorAreaHandler(event,textToSelect,newcursor){
   
    //handler
    var cursorWidth=1;
    var textWidth = textToSelect.node().getBoundingClientRect().right-textToSelect.node().getBoundingClientRect().left;
    var textHeight = textToSelect.node().getBoundingClientRect().bottom-textToSelect.node().getBoundingClientRect().top;
    var cellHeight = parseFloat(d3.select(".cellrow").attr("height"));
    var textAnchor = parseFloat(textToSelect.attr("x"));
    var rowId = parseInt(textToSelect.attr("rowId"));
    var translate = table.attr("transform").split(",");
    var offsetX = Number(translate[0].split("(")[1]);
    var offsetY = Number(translate[1].split(")")[0]);
    var textLeft = tableContainer_left+x_margin+textAnchor-textWidth/2+offsetX;
    var textBottom = tableContainer_top+y_margin+parseFloat(textToSelect.attr("y"))+rowId*cellHeight+offsetY;

    var relative_ClientX=event.clientX-textLeft-8;

    var cumulatedAnchors=[0];
    for(i=0;i<textToSelect.text().length;i++){
        cumulatedAnchors.push(charactersToPixels.get(textToSelect.text()[i])+cumulatedAnchors[i]);
    }
 

    var diff=Math.abs(cumulatedAnchors[0]-relative_ClientX);
    var wantedX=cumulatedAnchors[0];
    var pos=0;
    for(i=1;i<cumulatedAnchors.length;i++){
        var newdiff=Math.abs(cumulatedAnchors[i]-relative_ClientX);

        if(newdiff<diff){
            diff=Math.abs(cumulatedAnchors[i]-relative_ClientX);
            wantedX=cumulatedAnchors[i];
            pos=i;
        }
    }
    
    var area=d3.select(".cursorArea");
  
    if(newcursor<(wantedX+textLeft)){//vers la droite
        area.attr("width",wantedX+textLeft-newcursor)
        
        area.select("rect").attr("width",wantedX+textLeft-newcursor)
        
    } else if(newcursor>(wantedX+textLeft)){ //vers la gauche
        area.attr("width",newcursor-(wantedX+textLeft)).style("left",textLeft+wantedX)
       
        area.select("rect").attr("width",newcursor-(wantedX+textLeft))
        
    } else {
        area.attr("width",0).style("left",textLeft+wantedX)

        area.select("rect").attr("width",0)

    }

        
}