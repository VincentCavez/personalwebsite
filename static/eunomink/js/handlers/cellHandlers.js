function cell_drag_setup(event){
    
    var movingCells = d3.select("#elementsContainer").append("svg").attr("id","movingCells").style("position","absolute")
                                                        .attr("width",10000).attr("height",10000)
                                                        .style("left",0+"px").style("top",0+"px")

    var cellClicked = d3.select("#r"+startYrow_finger).select("#c"+startXcol_finger)

    if(cellClicked.attr("state")=="unselected"){
        
        var cnr = cellClicked.node().getBoundingClientRect()

        var dupNode = cellClicked.node().cloneNode([true])
        cellClicked.select("text").text("")//vider la cellule après l'avoir clonée

        dupNode.setAttribute("transform","translate("+cnr.left+","+cnr.top+")");

        movingCells.node().appendChild(dupNode);
    } else {

        d3.selectAll(".cell").filter(function(){
            return d3.select(this).attr("state")=="selected"
        }).each(function(){
            var cnr = d3.select(this).node().getBoundingClientRect()

            var dupNode = d3.select(this).node().cloneNode([true])
            d3.select(this).select("text").text("")//vider la cellule après l'avoir clonée
            d3.select(this).attr("state","unselected")
            d3.select(this).select("rect").style("fill","white")
            dupNode.setAttribute("transform","translate("+cnr.left+","+cnr.top+")");
    
            movingCells.node().appendChild(dupNode);
        })
    }

    window.landingX=event.clientX;
    window.landingY=event.clientY;

    
}

function cell_drag_move(event){
    d3.select("#movingCells").style("left",event.clientX-landingX+"px").style("top",event.clientY-landingY+"px")
}

function cell_drag_end(){
    var firstcell = d3.select("#movingCells").select(".cell")
    var x = firstcell.node().getBoundingClientRect().left-108
    var y = firstcell.node().getBoundingClientRect().top-138
    
    var width = Number(firstcell.select("rect").attr("width"))
    var height = Number(firstcell.select("rect").attr("height"))

    var midx=x+width/2;
    var midy=y+height/2;

    var firstcol = pixelsToColumnScale_table(midx)
    var firstrow = pixelsToRowScale_table(midy)+1
    var offsetCol = firstcol-Number(firstcell.select("text").attr("columnId"))
    var offsetRow = firstrow-Number(firstcell.select("text").attr("rowId"))


    d3.select("#movingCells").selectAll(".cell").each(function(){
        var newtext=d3.select(this).select("text")
        d3.select("#r"+(Number(newtext.attr("rowId"))+offsetRow)).select("#c"+(Number(newtext.attr("columnId"))+offsetCol)).select("text").text(newtext.text())

    })

    d3.select("#movingCells").remove()
    deselect_table(table);  
}