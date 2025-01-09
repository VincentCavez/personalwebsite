
function createPlotTabs(){

    var side=127;
    var languette=(window.screen.width-25)/81;//la meme languette que pour la palette
    var elementContainer=d3.select("#elementsContainer");
    var leftTableContainer=parseFloat(d3.select("#tableContainer").style("left"))
    /*
    var tc = elementContainer.append("svg").attr("id","tabsContainer").style("position","absolute").style("left",leftTableContainer+x_margin)
                                                                                                    .style("top",-6+"px")
                                                                                                    .attr("width",1665)
                                                                                                    .attr("height",side+languette)//.attr("viewBox","100 0 1270 127")
                                                                                                    */
    var localShiftXtable=get_x_transform(d3.select("#table"))
    for(j=0;j<p;j++){
        var anchor = (cumulatedColumnsWidths[j+1]-cumulatedColumnsWidths[j])/2-127/2
        var container = elementContainer.append("svg").attr("class","tab").attr("columnId",j).style("position","absolute").attr("state","closed")
                                        .style("left",leftTableContainer+x_margin+localShiftXtable+cumulatedColumnsWidths[j]+anchor+"px").attr("originalx",leftTableContainer+x_margin+localShiftXtable+cumulatedColumnsWidths[j]+anchor)
                                        .style("top",-side-6+"px")
                                        .attr("width",side)
                                        .attr("height",side+languette+5)

        

        //container.append("rect").attr("x",0).attr("y",0).attr("width",side).attr("height",side+languette)

        container.append("path").attr("d","m 0 0 v "+side+" q 0 "+languette+" "+side/3+" "+languette+" h "+side/3+" q "+side/3+" 0 "+side/3+" "+(-languette)+" v "+(-side)+" h "+(-side))
        .style("fill","white").style("stroke","rgb(90,61,43)").style("stroke-width",2);

        if(typeGuesser()[j]=="quantitative"){var src="pictures/ruler.svg";} else {var src="pictures/categories.svg";}

        elementContainer.append("img")
                .attr("src",src)
                .attr("id","tabLogo"+j).attr("class","tabLogo").attr("columnId",j)
                .style("top",-languette/2+5+"px")
                .style("left",leftTableContainer+x_margin+localShiftXtable+cumulatedColumnsWidths[j]+anchor+side/2-20+"px")
                .attr("height",20)
                .attr("width",40)
                .style("position","absolute")
    }
}


function tabsHandler(event){
    var side=127;
    var offset_table=-get_x_transform(d3.select("#table"))
    var delay=500;
    var x = event.clientX-tableContainer.node().getBoundingClientRect().left-x_margin+offset_table
    var startXcol = pixelsToColumnScale_table(x)
    var thisTab = d3.selectAll(".tab").filter(function(){
        return d3.select(this).attr("columnId")==startXcol
    })

    if(thisTab.attr("state")=="closed"){//on ouvre la tab
        miniplot_setup(event,startXcol)
        thisTab.transition().duration(delay).style("top",-9+"px")
        thisTab.attr("state","opened")
        d3.select("#tabLogo"+startXcol).transition().duration(delay/2).style("opacity",0)
    } else {//on ferme la tab
        thisTab.select(".plotContainer").transition().duration(delay).style("opacity",0);
        thisTab.transition().duration(delay).style("top",-side-6+"px")
        thisTab.attr("state","closed")
        d3.select("#tabLogo"+startXcol).transition().duration(delay/2).style("opacity",1)
    }
    
}