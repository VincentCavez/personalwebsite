function palettePicker(event){
    var off=20;//gros doigts
    var objectToMove = null;//local
    var palette = d3.select("#paletteContainer")
    
    var left = parseFloat(palette.style("left"));
    var right = left+parseFloat(palette.attr("width"));
    var top = parseFloat(palette.style("top"));
    var bottom = top+parseFloat(palette.attr("height"));
    

    if(event.clientX-off>left && event.clientX-off<right && event.clientY-off>top && event.clientY-off<bottom){//ça oblige a partir du centre !
        objectToMove=palette;
    }
    return objectToMove;
}

function paletteHandler(event){
    var palette = d3.select("#paletteContainer");
    var width = parseFloat(palette.attr("width"));
    var height = parseFloat(palette.attr("height"));
    var delay=500;
    var off=0;
    var top = parseFloat(palette.style("top"));
    

    if(palette_state=="closed" && event.pointerType =="touch"){
        palette.transition().duration(delay).style("left","-10px");//on décale la palette
        d3.select("#palette").transition().duration(delay).style("left",-6+3*width/4-10+"px")//.attr("class","darkblue_paint")
        //setTimeout(() => { window.palette_state="opened";}, delay);
        //de base, la couleur du haut est entourée
        palette.append("circle").attr("r",width/4+2).attr("cx",width/3).attr("cy",height/7).style("stroke","rgb(90,61,43)").style("fill","none").style("stroke-width",2).attr("id","contour_cercle")
        window.stylus_color="darkblue";
        window.palette_state="opened"
    } else {
        //si on est à droite, on ferme la palette
        if(event.clientX-off>width/2+10){
            if(event.pointerType =="touch"){
                palette.transition().duration(delay).style("left",-3*width/4+"px");//on décale la palette
                d3.select("#palette").transition().duration(delay).style("left",-6+"px")//.attr("class","blue_paint")
                d3.select("#contour_cercle").remove();
                
                window.stylus_color="blue";
                window.palette_state="closed"
            }
        } else {
            if(palette_state=="opened"){
                //si on est à gauche, on change la couleur
                palette.selectAll("circle").each(function(){
                    if(event.clientY-off>top+parseFloat(d3.select(this).attr("cy"))-parseFloat(d3.select(this).attr("r")) && event.clientY-off<top+parseFloat(d3.select(this).attr("cy"))+parseFloat(d3.select(this).attr("r"))){
                        var cx = parseFloat(d3.select(this).attr("cx"));
                        var cy = parseFloat(d3.select(this).attr("cy"));
                        var r = parseFloat(d3.select(this).attr("r"));

                        d3.select("#contour_cercle").remove();
                        palette.append("circle").attr("r",r+2).attr("cx",cx).attr("cy",cy).style("stroke","rgb(90,61,43)").style("fill","none").style("stroke-width",2).attr("id","contour_cercle")

                        //d3.select(this).style("stroke","rgb(90,61,43)").style("stroke-style","dotted").style("stroke-width","5px").style("stroke-dasharray",2)
                        var color = d3.select(this).style("fill");
                        //d3.select("#palette").attr("class",color+"_paint")
                        window.stylus_color=color;
                    }
                })
            }
        }
    }
}