function minimize_postit(postitContainer){
    var old_top=parseFloat(postitContainer.style("top"))
    var old_width=parseFloat(postitContainer.attr("width"))
    var old_height=parseFloat(postitContainer.attr("height"))
    var left=parseFloat(postitContainer.style("left"))
    var id=Number(postitContainer.attr("postitId"))
    postitContainer.style("top",-10000+"px")

    d3.selectAll(".ink").filter(function(){
        return d3.select(this).attr("magnet")!="none" && Number(d3.select(this).attr("postitId"))==id;
    }).each(function(){
        d3.select(this).style("top",(parseFloat(d3.select(this).style("top"))-10000)+"px")
    })

    var square_size=40;
    
    var thisMiniPostitContainer=d3.select("#elementsContainer").append("svg").attr("postitId",id).attr("class","miniPostitContainer").attr("state","visible").style("left",left+"px").style("top",old_top+"px").attr("width",old_width).attr("height",old_height)
                                    
    var thisMiniPostit = thisMiniPostitContainer.append("rect").attr("class","postit").attr("x",0).attr("y",0).attr("width",old_width).attr("height",old_height)

    thisMiniPostit.transition().duration(150).attr("width",square_size).attr("height",square_size)
    window.tap_on_subcell_timer = setTimeout(() => {  
        thisMiniPostitContainer.attr("width",square_size).attr("height",square_size)

        //double arrow
        var first=square_size/5
        var second=first*2
        var third=first*3
        var fourth=first*4
        var op=0.5
        thisMiniPostitContainer.append("line").attr("x1",third).attr("x2",fourth).attr("y1",first).attr("y2",first).style("stroke","black").style("opacity",op)
        thisMiniPostitContainer.append("line").attr("x1",fourth).attr("x2",fourth).attr("y1",first).attr("y2",second).style("stroke","black").style("opacity",op)
        thisMiniPostitContainer.append("line").attr("x1",first).attr("x2",first).attr("y1",third).attr("y2",fourth).style("stroke","black").style("opacity",op)
        thisMiniPostitContainer.append("line").attr("x1",first).attr("x2",second).attr("y1",fourth).attr("y2",fourth).style("stroke","black").style("opacity",op)
        thisMiniPostitContainer.append("line").attr("x1",first).attr("x2",fourth).attr("y1",fourth).attr("y2",first).style("stroke","black").style("opacity",op)
    }, 150);

    
}

function expand_postit(minipostitContainer){
    var old_top=parseFloat(minipostitContainer.style("top"));
    var old_left=parseFloat(minipostitContainer.style("left"));
    
    var id=Number(minipostitContainer.attr("postitId"))
    
    
    var bigpostit=d3.selectAll(".postitContainer").filter(function(){
        return Number(d3.select(this).attr("postitId"))==id;
    })
    var old_width=parseFloat(bigpostit.attr("width"))
    var old_height=parseFloat(bigpostit.attr("height"))
    minipostitContainer.attr("width",old_width).attr("height",old_height)
    thisMiniPostit=minipostitContainer.select("rect");
    minipostitContainer.selectAll("line").remove()
    thisMiniPostit.transition().duration(150).attr("width",old_width).attr("height",old_height)

    window.tap_on_subcell_timer = setTimeout(() => {  
        minipostitContainer.remove();
        bigpostit.style("top",old_top+"px").style("left",old_left+"px")
        d3.selectAll(".ink").filter(function(){
            return d3.select(this).attr("magnet")!="none" && Number(d3.select(this).attr("postitId"))==id;
        }).each(function(){
            d3.select(this).style("top",(parseFloat(d3.select(this).style("top"))+10000)+"px")
        })
    }, 150);
    

}