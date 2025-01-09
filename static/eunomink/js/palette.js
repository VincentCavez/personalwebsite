function createPalette(){
    var width = (window.screen.width-25)/27;
    var height = (window.screen.height-131)/3;

    var container = d3.select("#elementsContainer").append("svg").attr("id","paletteContainer").attr("width",width).attr("height",height).style("left",-3*width/4).style("top",height).style("position","absolute");
    
    //container.append("rect").attr("width",width).attr("height",height).attr("x",0).attr("y",0).style("fill","white").style("stroke","rgb(90,61,43)").style("stroke-width",4);
    container.append("path")
    .attr("d","m 0 0 v "+height+" h "+2*width/3+" v "+(-(height-width)/3)+" q 0 "+(-width/3)+" "+width/3+" "+(-width/3)+" v "+(-height/3)+" q "+(-width/3)+" 0 "+(-width/3)+" "+(-width/3)+" v "+(-(height-width)/3)+" h "+(-2*width/3))
                .style("fill","white").style("stroke","rgb(90,61,43)").style("stroke-width",2);

    createCircle(container,width/4,width/3,height/7,"darkblue")
    createCircle(container,width/4,width/3,2*height/7,"lightseagreen")
    createCircle(container,width/4,width/3,3*height/7,"green")
    createCircle(container,width/4,width/3,4*height/7,"orange")
    createCircle(container,width/4,width/3,5*height/7,"red")
    createCircle(container,width/4,width/3,6*height/7,"black")
/*
    container.append("line").attr("x1",2*width/3).attr("x2",2*width/3).attr("y1",height/7).attr("y2",6*height/7).attr("stroke","rgb(90,61,43)")
    container.append("line").attr("x1",2*width/3).attr("x2",width-10).attr("y1",height/7).attr("y2",height/2).attr("stroke","rgb(90,61,43)")
    container.append("line").attr("x1",width-10).attr("x2",2*width/3).attr("y1",height/2).attr("y2",6*height/7).attr("stroke","rgb(90,61,43)")
*/
    d3.select("#elementsContainer").append("img").attr("class","black_paint")
                .attr("src","pictures/palette.svg")
                .attr("id","palette")
                .style("top",height+height/2-width/5+"px")
                .style("left",-6+"px")
                .attr("height",20)
                .attr("width",20)
                .style("position","absolute")


    
    window.palette_state="closed";//a sa creation, elle est rangee
    window.stylus_color="blue";

}

function createCircle(el,r,cx,cy,color){
    el.append("circle").attr("r",r).attr("cx",cx).attr("cy",cy).style("fill",color);
}