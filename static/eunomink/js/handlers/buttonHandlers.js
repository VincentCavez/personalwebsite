



function extended_bottom_svg(){

    var newWidth=parseFloat(d3.select("#tableClippath").attr("width"));
    var newHeight=parseFloat(d3.select("#tableClippath").attr("height"));

    d3.selectAll("#extend_bottom").remove();
    if(d3.selectAll("#extended_bottom").empty()==true){
        var extended_bottom = d3.select("#tableContainer").append("svg").attr("id","extended_bottom").style("position","absolute").attr("x",x_margin).attr("y",y_margin+newHeight);

        extended_bottom.append("rect").attr("class","extended_margin")
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width",newWidth)
                        .attr("height",extend_margin);

        extended_bottom.append("circle")
                        .attr("class","bluebutton")
                        .attr("r",4)
                        .attr("cx",newWidth/2)
                        .attr("cy",extend_margin/2);
    }
}


function extend_bottom_svg(){

    var newWidth=parseFloat(d3.select("#tableClippath").attr("width"));
    var newHeight=parseFloat(d3.select("#tableClippath").attr("height"));

    d3.selectAll("#extended_bottom").remove();
    if(d3.selectAll("#extend_bottom").empty()==true){
        var extend_bottom = tableContainer.append("svg").attr("id","extend_bottom").style("position","absolute").attr("x",x_margin).attr("y",y_margin+newHeight);

        extend_bottom.append("rect").attr("class","extend_margin")
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width",newWidth)
                        .attr("height",extend_margin);

        var arrowdown = extend_bottom.append("g").attr("id","arrowdown").attr("transform","translate("+(newWidth/2-15)+",0)");        
        arrowdown.append("line").attr("x1",0).attr("x2",30).attr("y1",3).attr("y2",3).style("stroke",downTriangleColor)
        arrowdown.append("line").attr("x1",0).attr("x2",15).attr("y1",3).attr("y2",13).style("stroke",downTriangleColor)
        arrowdown.append("line").attr("x1",15).attr("x2",30).attr("y1",13).attr("y2",3).style("stroke",downTriangleColor)
    }
   
}



function extended_right_svg(){

    var newWidth=parseFloat(d3.select("#tableClippath").attr("width"));
    var newHeight=parseFloat(d3.select("#tableClippath").attr("height"));

    d3.selectAll("#extend_right").remove();
    if(d3.selectAll("#extended_right").empty()==true){
        var extended_right = d3.select("#tableContainer").append("svg").attr("id","extended_right").style("position","absolute").attr("x",x_margin+newWidth).attr("y",y_margin);

        extended_right.append("rect").attr("class","extended_margin")
                        .attr("x",0)
                        .attr("y",0)
                        .attr("width",extend_margin)
                        .attr("height",newHeight);

        extended_right.append("circle")
                        .attr("class","bluebutton")
                        .attr("r",4)
                        .attr("cx",extend_margin/2)
                        .attr("cy",newHeight/2);
    }
}


function extend_right_svg(){

    var newWidth=parseFloat(d3.select("#tableClippath").attr("width"));
    var newHeight=parseFloat(d3.select("#tableClippath").attr("height"));

    d3.selectAll("#extended_right").remove();
    if(d3.selectAll("#extend_right").empty()==true){
        var extend_right = d3.select("#tableContainer").append("svg").attr("id","extend_right").style("position","absolute").attr("x",x_margin+newWidth).attr("y",y_margin);

        extend_right.append("rect").attr("class","extend_margin")
                    .attr("x",0)
                    .attr("y",0)
                    .attr("width",extend_margin)
                    .attr("height",newHeight);

        var arrowright = extend_right.append("g").attr("id","arrowright").attr("transform","translate(0,"+(newHeight/2)+")");        
    
        arrowright.append("line").attr("x1",3).attr("x2",3).attr("y1",-15).attr("y2",15).style("stroke",downTriangleColor)
        arrowright.append("line").attr("x1",3).attr("x2",13).attr("y1",-15).attr("y2",0).style("stroke",downTriangleColor)
        arrowright.append("line").attr("x1",3).attr("x2",13).attr("y1",15).attr("y2",0).style("stroke",downTriangleColor)
    }
}
