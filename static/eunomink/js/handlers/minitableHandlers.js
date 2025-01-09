function minitable_setup(event){
    window.bonus = scroller_size;
    window.startX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
    window.startY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;

    if(startX>scroller_size && startY>scroller_size) { //CONTENU
        minitable_hovering_setup(event);    //faire apparaitre le plus et initialiser le hovering rectangle
        d3.select("#leftScroller").attr("class","scroller");
        d3.select("#topScroller").attr("class","scroller");
        if(coming_from_scroller=="top"){
            hovering = "horizontal";
            quickshift_top_setup(event);
            display_label_minitable(event,"col");
        }
        if(coming_from_scroller=="left"){
            hovering = "vertical";
            quickshift_left_setup(event);
            display_label_minitable(event,"row");
        }
        if(coming_from_scroller=="no"){//on ne connait pas la direction donc il n'y a ni nom, ni indice, ni pop up
            hovering = 0;//au tout début, hovering est 0 mais je doute qu'il soit reset à chaque fois -> ne pas oublier de le mettre à minitable_end()
        }
        window.coming_from_scroller="no";
    }

    if(startX<scroller_size && startY>scroller_size){//QUICK SHIFT ON LEFT BAR
        hovering=0;
        minitable.selectAll("line").remove();
        d3.selectAll("#hoveringRectangle").remove();
        d3.select("#leftScroller").attr("class","scroller");
        d3.select("#topScroller").attr("class","unavailable");
        quickshift_left_setup(event);
        window.coming_from_scroller="left";

    } 

    if(startX>scroller_size && startY<scroller_size){//QUICK SHIFT ON TOP BAR
        hovering=0;
        minitable.selectAll("line").remove();
        d3.selectAll("#hoveringRectangle").remove();
        d3.select("#leftScroller").attr("class","unavailable");
        d3.select("#topScroller").attr("class","scroller");
        quickshift_top_setup(event);
        window.coming_from_scroller="top";

    } 

    
}


function minitable_hovering_setup(event){
    //plots_closing();
    var size=2;
    newX = event.clientX - miniTableContainer.node().getBoundingClientRect().left - scroller_size;
    newY = event.clientY - miniTableContainer.node().getBoundingClientRect().top - scroller_size;
    //plus mark at the starting point
    minitable.append("line").attr("x1",newX).attr("x2",newX).attr("y1",newY-size).attr("y2",newY+size).style("stroke","navy");
    minitable.append("line").attr("x1",newX-size).attr("x2",newX+size).attr("y1",newY).attr("y2",newY).style("stroke","navy");

    window.tHoveringRect = table.append("rect").attr("id", "hoveringRectangle");
    window.mtHoveringRect = minitable.append("rect").attr("id", "hoveringRectangle");
    
    window.timer_minitable=Date.now();
    window.inside_perimeter=true;
    window.reset_label=true;

}


function quickshift_top_setup(event){
    
    window.inkClipPath_left = parseFloat(tableContainer.style("left"))+x_margin;
    window.inkClipPath_right = tableContainer_left+parseFloat(tableContainer.attr("width"));
    window.inkClipPath_top = parseFloat(tableContainer.style("top"))+y_margin;
    window.inkClipPath_bottom = tableContainer_top+parseFloat(tableContainer.attr("height"));
    d3.selectAll("#label_first").remove();
    if(d3.select(".popupIndex").empty()==false){
        d3.selectAll(".popupIndex").remove();
    }
    window.startXcol = pixelsToRow(pixelsToColumnScale_minitable,startX-scroller_size);//bonus

    var name = d3.selectAll(".columnlabel").filter(function(){
        return d3.select(this).attr("columnId")==startXcol;
    }).text();//toujours bon, columnlabel c'est dans les columnsheaders
    
    var colwidth = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
                                                                    return (d3.select(this).attr("columnId"))==startXcol;
                                                                }).select("rect").attr("width"))*popupRatio;
    var colheight = ghostColHeight*popupRatio;

    var top = miniTableContainer.node().getBoundingClientRect().top;
   
    var offsetGhostCol = 50;
    var offsetFont=10;//c'est le numéro des lignes à gauche de la colonne
    
                                                               
    //CONTAINER
    var pui = d3.select("#elementsContainer").append("svg")
                                                .style("left",(event.clientX-colwidth-offsetFont))
                                                .style("top",top-2*offsetFont)
                                                .attr("width",colwidth+offsetFont)
                                                .attr("height",colheight+offsetGhostCol+50)
                                                .attr("class","popupIndex").style("position","absolute");
    //LETTER
    pui.append("text").attr("class","popupIndexcss").attr("x",colwidth).attr("y",offsetFont).text(name).attr("text-anchor", "start");
   
   
    var x = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==startXcol;
    }).select("text").attr("x"))*popupRatio;
    
    var r=3.5;
    
    if(n>10){
        var NewN=7;
        //on cherche le y de la 8eme ligne, il faut le récupérer dans le transform
        var y = get_y_transform(d3.select("#r"+8))*popupRatio*1.2+event.clientY-top;//utile seulement pour les trois points
        
        var etc = pui.append("g").attr("id","etc").attr("transform","translate("+(colwidth/2-r*r+offsetFont)+","+0+")");

        etc.append("circle")
            .style("fill","gray")
            .attr("cx",0)
            .attr("cy",y)
            .attr("r",r);

        etc.append("circle")
            .style("fill","gray")
            .attr("cx",r*r)
            .attr("cy",y)
            .attr("r",r);
        
        etc.append("circle")
            .style("fill","gray")
            .attr("cx",2*r*r)
            .attr("cy",y)
            .attr("r",r);
            
    } else {
        var NewN=n;
    }
    var header = d3.select("#h"+startXcol);

    var backColor = "lightgrey";
    

    var y_cell = get_y_transform(d3.select("#r"+0))*popupRatio+event.clientY-top;
    var y_texte = y_cell+parseFloat(header.select("text").attr("y"))*popupRatio;
    var height_cell = header.select("rect").attr("height")*popupRatio;
    var texte = header.select("text").text();
    
    pui.append("rect")
        .attr("class","cell")
        .style("fill",backColor)
        .attr("x",offsetFont)
        .attr("y",y_cell+offsetGhostCol)
        .attr("number",0)
        .attr("width",colwidth)
        .attr("height",height_cell)
        .style("opacity",1)
        ;
    pui.append("text")
        .attr("class","popupTextcell")
        .attr("text-anchor","middle")
        .attr("x",x+offsetFont)
        .attr("y",y_texte+offsetGhostCol)//dans le repère du ghost, qui est déjà aux bonnes coords
        .attr("number",0)
        .style("opacity",1)
        .text(texte); 
        
    

    for(i=0;i<NewN;i++){
        
        var cell = d3.select("#r"+i).selectAll(".cell").filter(function(){
            return (d3.select(this).attr("columnId"))==startXcol;
        });

        var cellState = cell.attr("state");
        if(cellState=="selected"){var backColor = selectedColor;}
        if(cellState=="unselected"){var backColor = unselectedColor;}
        if(cellState=="excluded"){var backColor = excludedColor;}

        var y_cell = get_y_transform(d3.select("#r"+(i+1)))*popupRatio+event.clientY-top;
        var y_texte = y_cell+parseFloat(cell.select("text").attr("y"))*popupRatio;
        var height_cell = cell.select("rect").attr("height")*popupRatio;
        var texte = cell.select("text").text();
        
        pui.append("rect")
            .attr("class","cell")
            .style("fill",backColor)
            .attr("x",offsetFont)
            .attr("y",y_cell+offsetGhostCol)
            .attr("number",i+1)
            .attr("width",colwidth)
            .attr("height",height_cell)
            .style("opacity",1)
            ;
        pui.append("text")
            .attr("class","popupTextcell")
            .attr("text-anchor","middle")
            .attr("x",x+offsetFont)
            .attr("y",y_texte+offsetGhostCol)//dans le repère du ghost, qui est déjà aux bonnes coords
            .attr("number",i+1)
            .style("opacity",1)
            .text(texte); 
            
        //indices des lignes    
        pui.append("text").attr("class","popupLabels").attr("x",0).attr("y",y_texte+offsetGhostCol).text(i+1).attr("text-anchor","start");
    }
    d3.selectAll(".sc_principal,.sc_secondary").each(function(){
        if(d3.select(this).attr("startx_qs")==null){//si c'est la premiere fois qu'on le bouge
            var oldx=Number(d3.select(this).attr("x"));
            d3.select(this).attr("startx_qs",oldx);
        }
    })
    
    d3.selectAll(".ink,.postitContainer,.tab,.tabLogo").each(function(){
        if(d3.select(this).attr("startx_qs")==null){//si c'est la premiere fois qu'on le bouge
            var oldx=parseFloat(d3.select(this).style("left"));
            d3.select(this).attr("startx_qs",oldx);
        }
       
    })
   
    
}


function quickshift_left_setup(event){
    window.inkClipPath_left = parseFloat(tableContainer.style("left"))+x_margin;
    window.inkClipPath_right = tableContainer_left+parseFloat(tableContainer.attr("width"));
    window.inkClipPath_top = parseFloat(tableContainer.style("top"))+y_margin;
    window.inkClipPath_bottom = tableContainer_top+parseFloat(tableContainer.attr("height"));
    d3.selectAll("#label_first").remove();
    if(d3.select(".popupIndex").empty()==false){
        d3.selectAll(".popupIndex").remove();
    }
    window.startYrow = pixelsToRow(pixelsToRowScale_minitable,startY-scroller_size);//bonus
    var offsetGhostRow = 20;
    var offsetFont=10;
    var points=50;

    var rowheight=ghostRowHeight*popupRatio;

    var left = miniTableContainer.node().getBoundingClientRect().left;

    var rowwidth=cumulatedColumnsWidths[3]*popupRatio;
  
    
    //CONTAINER
    var pui = d3.select("#elementsContainer").append("svg")
                                                .style("left",left-rowwidth-offsetGhostRow-points)
                                                .style("top",event.clientY-rowheight/2- offsetFont)
                                                .attr("width",rowwidth+offsetGhostRow+points)//plus grand que ce qu'il ne faut, mais pas grave
                                                .attr("height",rowheight+offsetFont+40)
                                                .attr("class","popupIndex").style("position","absolute");
    
    //INDEX
    pui.append("text").attr("class","popupIndexcss").attr("x",0).attr("y",rowheight/2+offsetFont).text(startYrow+1).attr("text-anchor", "start");
    

    var y = parseFloat(d3.select("#r1").select(".cell").select("text").attr("y"))*popupRatio;//la demi hauteur
    
    var r=3.5;
        
    if(p>6){
        var NewP=3;
        var x = get_x_transform(d3.select("#r"+startYrow).selectAll(".cell")
                                                        .filter(function(){
                                                                    return d3.select(this).attr("columnId")==NewP;
                                                                    })
                                )*popupRatio*1.1;
    
        pui.append("circle")
            .style("fill","gray")
            .attr("cx",x)
            .attr("cy",rowheight/2+offsetFont)
            .attr("r",r);
        pui.append("circle")
            .style("fill","gray")
            .attr("cx",x+r*r)
            .attr("cy",rowheight/2+offsetFont)
            .attr("r",r);
        pui.append("circle")
            .style("fill","gray")
            .attr("cx",x+2*r*r)
            .attr("cy",rowheight/2+offsetFont)
            .attr("r",r);
            
    } else {
        var NewP=p;
    }
    for(i=0;i<NewP;i++){
        var cell = d3.select("#r"+startYrow).selectAll(".cell").filter(function(){
                            return d3.select(this).attr("columnId")==i;
                        });

        var cellState = cell.attr("state");

        if(cellState=="selected"){var backColor = selectedColor;}//un peu plus foncé
        if(cellState=="unselected"){var backColor = unselectedColor;}
        if(cellState=="excluded"){var backColor = excludedColor;}

        
        var x_cell = parseFloat(cell.attr("transform").split(",")[0].split("(")[1])*popupRatio;
        var x_texte = x_cell+parseFloat(cell.select("text").attr("x"))*popupRatio;
        var width_cell = parseFloat(cell.select("rect").attr("width"))*popupRatio;
        var texte = cell.select("text").text();
        
        pui.append("rect")
            .attr("class","cell")
            .style("fill",backColor)
            .attr("x",x_cell+offsetGhostRow)
            .attr("y",offsetFont)
            .attr("number",i)
            .attr("width",width_cell)
            .attr("height",rowheight)
            .style("opacity",1);
        
        pui.append("text")
            .attr("class","popupTextcell")
            .attr("text-anchor","middle")
            .attr("x",x_texte+offsetGhostRow)
            .attr("y",y+offsetFont)//dans le repère du ghost, qui est déjà aux bonnes coords
            .attr("number",i)
            .style("opacity",1)
            .text(texte);    
            
        pui.append("text").attr("class","popupLabels").attr("x",x_texte+offsetGhostRow).attr("y",offsetFont-3).text(columnNames[i]).attr("text-anchor","middle");
    }
    d3.selectAll(".sc_principal,.sc_secondary").each(function(){
        if(d3.select(this).attr("starty_qs")==null){//si c'est la premiere fois qu'on le bouge
            var oldy=Number(d3.select(this).attr("y"));
            d3.select(this).attr("starty_qs",oldy);
        }
    })
    
    d3.selectAll(".ink,.postitContainer").each(function(){
        if(d3.select(this).attr("starty_qs")==null){//si c'est la premiere fois qu'on le bouge
            var oldy=parseFloat(d3.select(this).style("top"));
            d3.select(this).attr("starty_qs",oldy);
        }
    })
   

}












function minitable_move(event){
    window.newX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
    window.newY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;

    if(newX>scroller_size && newY>scroller_size) { //CONTENU    
        if(coming_from_scroller!="no"){
            minitable_setup(event);
        }
        minitable_hovering(event);
        
    }

    if((newX<scroller_size && newY>scroller_size) || coming_from_scroller=="left"){//QUICK SHIFT ON LEFT BAR
        if(coming_from_scroller=="no"){//on vient du contenu
            minitable_setup(event);
        }
        quickshift_left_scroller(event);
    } 

    if((newX>scroller_size && newY<scroller_size) || coming_from_scroller=="top"){//QUICK SHIFT ON TOP BAR
        if(coming_from_scroller=="no"){
            minitable_setup(event);
        }
        quickshift_top_scroller(event);
    }
}


function minitable_hovering(event){
    var del=200;
    

    newX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
    newY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
        
    newYrow = pixelsToRowScale_minitable(newY-scroller_size)
    newXcol = pixelsToColumnScale_minitable(newX-scroller_size)

    var top_of_trace=7 
    if(Math.sqrt(Math.pow(newX-startX,2)+Math.pow(newY-startY,2))<10){//si on est dans le perimetre
        
        if(inside_perimeter==false){
            timer_minitable=Date.now();//on note le moment d'arrivée dans le périmètre
            inside_perimeter=true;
        
        }
        if(Date.now()-timer_minitable>1000 || hovering==0){//on a dépassé une seconde, ou alors c'est la première fois
            //------------------------------------------------------------//
            // DANS LE PERIMETRE, ET ON CHANGE DE DIRECTION A TOUT MOMENT //
            //------------------------------------------------------------//
       
            
            //VERTICAL
            if(Math.abs(newX-startX)<Math.abs(newY-startY)){
                if(reset_label==true){
                    quickshift_left_setup(event);
                    display_label_minitable(event,"row");
                    window.reset_label=false;
                }
                quickshift_left_scroller(event);
                
                if(newY>startY){//on est parti vers le bas
                    var ty=cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                    var th=cumulatedRowHeights[row_mtPixels_row(newY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                    mtHoveringRect.transition().duration(del).attr("y",startY-bonus).attr("height", newY-startY).attr("x",0).attr("width",minitable_background_width);
                    tHoveringRect.transition().duration(del).attr("y",ty).attr("height",th).attr("x",0).attr("width",table_width);
                    d3.select(".minitableTrace").attr("y2",newY-top_of_trace)
                  
                } else {//on est parti vers le haut
                    var ty=cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                    var th=cumulatedRowHeights[row_mtPixels_row(startY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                    mtHoveringRect.transition().duration(del).attr("y",newY-bonus).attr("height", startY-newY).attr("x",0).attr("width",minitable_background_width);
                    tHoveringRect.transition().duration(del).attr("y",ty).attr("height", th).attr("x",0).attr("width",table_width);
                    d3.select(".minitableTrace").attr("y1",newY)
                }
                hovering = "vertical";
                
            } else {
                //HORIZONTAL
                if(reset_label==true){
                    quickshift_top_setup(event);
                    display_label_minitable(event,"col");
                    window.reset_label=false;
                }
                quickshift_top_scroller(event);

                if(newX>startX){//on est parti vers la droite
                    var tx=cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]
                    var tw=cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)+1]-cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]
                    
                    mtHoveringRect.transition().duration(del).attr("x",startX-bonus).attr("width", newX-startX).attr("y",0).attr("height",minitable_background_height);
                    tHoveringRect.transition().duration(del).attr("x",tx).attr("width",tw).attr("y",0).attr("height",table_height);
                } else {//on est parti vers la gauche
                    var tx=cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)]
                    var tw=cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]-cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)]
                
                    mtHoveringRect.transition().duration(del).attr("x",newX-bonus).attr("width", startX-newX).attr("y",0).attr("height",minitable_background_height);
                    tHoveringRect.transition().duration(del).attr("x",tx).attr("width", tw).attr("y",0).attr("height",table_height);
                }
                hovering = "horizontal";
                
            }
        
        } else {

            //---------------------------------------------------------//
            //      DANS LE PERIMETRE, MAIS ON NE FAIT QUE PASSER      //
            //---------------------------------------------------------//
            //VERTICAL
            if(hovering=="vertical"){
                quickshift_left_scroller(event);
                if(newY>startY){//on est parti vers le bas
                    var ty=cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                    var th=cumulatedRowHeights[row_mtPixels_row(newY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                    mtHoveringRect.attr("y",startY-bonus).attr("height", newY-startY).attr("x",0).attr("width",minitable_background_width);
                    tHoveringRect.attr("y",ty).attr("height",th).attr("x",0).attr("width",table_width);
                    d3.select(".minitableTrace").attr("y2",newY-top_of_trace)
                } else {//on est parti vers le haut
                    var ty=cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                    var th=cumulatedRowHeights[row_mtPixels_row(startY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                    mtHoveringRect.attr("y",newY-bonus).attr("height", startY-newY).attr("x",0).attr("width",minitable_background_width);
                    tHoveringRect.attr("y",ty).attr("height", th).attr("x",0).attr("width",table_width);
                    d3.select(".minitableTrace").attr("y1",newY)
                }
            } else {
                //HORIZONTAL
                quickshift_top_scroller(event);
                if(newX>startX){//on est parti vers la droite
                    var tx=cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]
                    var tw=cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)+1]-cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]
                    
                    mtHoveringRect.attr("x",startX-bonus).attr("width", newX-startX).attr("y",0).attr("height",minitable_background_height);
                    tHoveringRect.attr("x",tx).attr("width",tw).attr("y",0).attr("height",table_height);
                } else {//on est parti vers la gauche
                    var tx=cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)]
                    var tw=cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]-cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)]
                
                    mtHoveringRect.attr("x",newX-bonus).attr("width", startX-newX).attr("y",0).attr("height",minitable_background_height);
                    tHoveringRect.attr("x",tx).attr("width", tw).attr("y",0).attr("height",table_height);
                }
            }
        }
    } else {
        //---------------------------------------------------------//
        //      EN DEHORS du PERIMETRE, ON GARDE LA DIRECTION      //
        //---------------------------------------------------------//
        window.reset_label=true;//prochaine fois qu'on dwell dans le périmètre, on reset le label

        //VERTICAL
        if(hovering=="vertical"){
            quickshift_left_scroller(event);
            if(newY>startY){//on est parti vers le bas
                var ty=cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                var th=cumulatedRowHeights[row_mtPixels_row(newY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                mtHoveringRect.attr("y",startY-bonus).attr("height", newY-startY).attr("x",0).attr("width",minitable_background_width);
                tHoveringRect.attr("y",ty).attr("height",th).attr("x",0).attr("width",table_width);
                d3.select(".minitableTrace").attr("y2",newY-top_of_trace)
            } else {//on est parti vers le haut
                var ty=cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                var th=cumulatedRowHeights[row_mtPixels_row(startY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                mtHoveringRect.attr("y",newY-bonus).attr("height", startY-newY).attr("x",0).attr("width",minitable_background_width);
                tHoveringRect.attr("y",ty).attr("height", th).attr("x",0).attr("width",table_width);
                d3.select(".minitableTrace").attr("y1",newY)
            }
        } else {
            //HORIZONTAL
            quickshift_top_scroller(event);
            if(newX>startX){//on est parti vers la droite
                var tx=cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]
                var tw=cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)+1]-cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]
                
                mtHoveringRect.attr("x",startX-bonus).attr("width", newX-startX).attr("y",0).attr("height",minitable_background_height);
                tHoveringRect.attr("x",tx).attr("width",tw).attr("y",0).attr("height",table_height);
            } else {//on est parti vers la gauche
                var tx=cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)]
                var tw=cumulatedColumnsWidths[col_mtPixels_col(startX-bonus)]-cumulatedColumnsWidths[col_mtPixels_col(newX-bonus)]
            
                mtHoveringRect.attr("x",newX-bonus).attr("width", startX-newX).attr("y",0).attr("height",minitable_background_height);
                tHoveringRect.attr("x",tx).attr("width", tw).attr("y",0).attr("height",table_height);
            }
        }
    
        inside_perimeter=false;
    }





    
        
            
        
    
   

}


function quickshift_top_scroller(event) {
   
    var offsetFont=10;//c'est le numéro des lignes à gauche de la colonne
    newX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
    newXcol = pixelsToColumnScale_minitable(newX-bonus)//window ??
    var lastY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
    


    var colwidth = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==newXcol;
    }).select("rect").attr("width"))*popupRatio;
    
    var x = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==newXcol;
    }).select("text").attr("x"))*popupRatio;

    var name = d3.selectAll(".columnlabel").filter(function(){
        return d3.select(this).attr("columnId")==newXcol;
    }).text();

    
    //pop up index container
    var pui = d3.select(".popupIndex").style("left",(event.clientX-colwidth-offsetFont)).attr("width",colwidth+offsetFont)//on ne recrée pas, on change juste son left
    
    pui.select(".popupIndexcss").attr("x",colwidth).text(name)   ;
    
   
    var r=3.5;
    function createGhostCol(lastY){
       
        if(n>10){
            var NewN=7;
        } else {
            var NewN=n;   
        }
        if(lastY>=0){//in the limits of the minitable


            if(NewN==7){//on bouge les trois petits points
                d3.select("#etc").attr("transform","translate("+(colwidth/2-r*r+offsetFont)+","+0+")").style("opacity",1);
            }

            var header = d3.select("#h"+newXcol);
            var backColor = "lightgrey";
            var texte = header.select("text").text();
            
            pui.selectAll(".popupTextcell").filter(function(){
                return parseFloat(d3.select(this).attr("number"))==0;
            }).text(texte).style("opacity",1).attr("x",x+offsetFont);
            pui.selectAll(".cell").filter(function(){
                return parseFloat(d3.select(this).attr("number"))==0;
            }).style("opacity",1).style("fill",backColor).attr("width",colwidth);


            

            for(i=0;i<NewN;i++){
                var cell = d3.select("#r"+i).selectAll(".cell").filter(function(){
                    return (d3.select(this).attr("columnId"))==newXcol;
                });

                var cellState = cell.attr("state");
                if(cellState=="selected"){var backColor = selectedColor;}//un peu plus foncé
                if(cellState=="unselected"){var backColor = unselectedColor;}
                if(cellState=="excluded"){var backColor = excludedColor;}
                //rajouter le cas "invisible"?? a priori non
                var texte = cell.select("text").text();
                    
                pui.selectAll(".popupTextcell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==(i+1);
                }).text(texte).style("opacity",1).attr("x",x+offsetFont);
                pui.selectAll(".cell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==(i+1);
                }).style("opacity",1).style("fill",backColor).attr("width",colwidth);
                
            }
        } 
        if(lastY < 0){//plus haut ou plus bas
            if(NewN==7){//on bouge les trois petits points, mais en transparent
                d3.select("#etc").attr("transform","translate("+(colwidth/2-r*r+offsetFont)+","+0+")").style("opacity",0.5);
            }

            var header = d3.select("#h"+newXcol);
            var backColor = "lightgrey";
            var texte = header.select("text").text();
            
            pui.selectAll(".popupTextcell").filter(function(){
                return parseFloat(d3.select(this).attr("number"))==0;
            }).text(texte).style("opacity",0.5).attr("x",x+offsetFont);
            pui.selectAll(".cell").filter(function(){
                return parseFloat(d3.select(this).attr("number"))==0;
            }).style("opacity",0.5).style("fill",backColor).attr("width",colwidth);

            for(i=0;i<NewN;i++){
                var cell = d3.select("#r"+i).selectAll(".cell").filter(function(){
                    return (d3.select(this).attr("columnId"))==newXcol;
                });

                var cellState = cell.attr("state");
                if(cellState=="selected"){var backColor = "rgb(155, 201, 253)";}//un peu plus foncé
                if(cellState=="unselected"){var backColor = unselectedColor;}
                if(cellState=="excluded"){var backColor = excludedColor;}
                //rajouter le cas "invisible"?? a priori non
                var texte = cell.select("text").text();

                pui.selectAll(".popupTextcell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==(i+1);
                }).text(texte).style("opacity",0.5).attr("x",x+offsetFont);
                pui.selectAll(".cell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==(i+1);
                }).style("opacity",0.5).style("fill",backColor).attr("width",colwidth);
                //pui.selectAll("circle").style("opacity",0.5);
            }

        }
        
    }

    //quickShift_timer = setTimeout(() => {  createGhostRow(); }, 0);
    createGhostCol(lastY);
    
}


function quickshift_left_scroller(event) {
    //clearTimeout(quickShift_timer);
    var offsetFont=10;
    var rowheight=ghostRowHeight*popupRatio;

    newY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
    newYrow = pixelsToRowScale_minitable(newY-bonus)//window ??
    var lastX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
    
    //pop up index container
    var pui = d3.select(".popupIndex").style("top",event.clientY-rowheight/2-offsetFont)//on ne recrée pas, on change juste son top
    pui.select(".popupIndexcss").text(newYrow+1);
    
   
    function createGhostRow(lastX){

        if(p>6){
            var NewP=3;
        } else {
            var NewP=p;
        }
        if(lastX>=0){//sur la barre de scroll
          
            for(i=0;i<NewP;i++){
                var cell = d3.select("#r"+newYrow).selectAll(".cell").filter(function(){
                                return d3.select(this).attr("columnId")==i;
                            });

                var cellState = cell.attr("state");

                if(cellState=="selected"){var backColor = selectedColor;}
                if(cellState=="unselected"){var backColor = unselectedColor;}
                if(cellState=="excluded"){var backColor = excludedColor;}
                //rajouter le cas "invisible"?? a priori non
                var texte = cell.select("text").text();
            
                pui.selectAll(".popupTextcell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).text(texte).style("opacity",1);
                pui.selectAll(".cell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).style("opacity",1).style("fill",backColor);
                pui.selectAll("circle").style("opacity",1);
            } 
        }
        if(lastX<0){//a gauche de la barre de scroll
            for(i=0;i<NewP;i++){
                var cell = d3.select("#r"+newYrow).selectAll(".cell").filter(function(){
                                return d3.select(this).attr("columnId")==i;
                            });

                var cellState = cell.attr("state");

                if(cellState=="selected"){var backColor = selectedColor;}
                if(cellState=="unselected"){var backColor = unselectedColor;}
                if(cellState=="excluded"){var backColor = excludedColor;}
                //rajouter le cas "invisible"?? a priori non
                var texte = cell.select("text").text();

                pui.selectAll(".popupTextcell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).text(texte).style("opacity",0.5);
                pui.selectAll(".cell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).style("opacity",0.5).style("fill",backColor);
                pui.selectAll("circle").style("opacity",0.5);
            }

        }
       
    }

    //quickShift_timer = setTimeout(() => {  createGhostRow(); }, 0);
    createGhostRow(lastX);
    
}












function minitable_end(event){
    window.newX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
    window.newY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;

    if(newX>scroller_size && newY>scroller_size) { //CONTENU    
        
        minitable_hovering_end(event);
    }

    if(coming_from_scroller=="left"){
        if(newX<scroller_size && newX>=0){//QUICK SHIFT ON LEFT BAR
            quickshift_left_end(event);
        } else {//VOID
            d3.selectAll(".popupIndex").remove();//pui
        }
    }


    if(coming_from_scroller=="top"){
        if(newY<scroller_size && newY>=0){//QUICK SHIFT ON TOP BAR
            quickshift_top_end(event);
        } else {//VOID
            d3.selectAll(".popupIndex").remove();//pui
        }
    } 
    d3.select("#leftScroller").attr("class","scroller");
    d3.select("#topScroller").attr("class","scroller");    
      
    
}


function minitable_hovering_end(){
    minitable.selectAll("line").remove();
    
    mtHoveringRect.remove();//on ne le remove pas car on peut s'en reservir ?
    tHoveringRect.remove();
    d3.select("#traceContainer").remove();

    var endY = newY;
    var endYrow = pixelsToRow(pixelsToRowScale_minitable,endY-bonus);

    var endX = newX;
    var endXcol = pixelsToRow(pixelsToColumnScale_minitable,endX-bonus);//pixelsToRowc'est bon
    
    if(hovering=="vertical"){
        if(endYrow!=startYrow){
            
            if(endYrow<0){endYrow=0;};
            if(endYrow>n-1){endYrow=n-1;};
        
            if(endYrow>startYrow){//on est descendu dans la table
                var hovered = range(startYrow,endYrow);
            } else {//on est monté dans la table
                var hovered = range(endYrow,startYrow);                  
            }
        
        } else {
            var hovered = [startYrow];
        }


        var A = selectionLogic1D(minitable,hovered,startYrow,endYrow,"finger");//sur la minitable, c'est comme si le doigt était toujours posé
        
        //------------------MINI TABLE-------------------
        updateMiniTable(minitable,A);//tres bien fonctionné

        //------------------TABLE-------------------
        
        updateTableColumns(table,A);//?
        
        var test=Date.now()
        updateTableRows(table,A);//updates the state of every row and the vectors in the table attributes
        

    } else {//horizontal
        if(endXcol!=startXcol){//col pas encore def
            
            if(endXcol<0){endXcol=0;};
            if(endXcol>p-1){endXcol=p-1;};
        
            if(endXcol>startXcol){//on est allé a droite
                var hovered = range(startXcol,endXcol);
            } else {//on est allé à gauche
                var hovered = range(endXcol,startXcol);                  
            }
        
        } else {
            var hovered = [startXcol];
        }

       
        var A = selectionLogic1D(minitable,hovered,startXcol,endXcol,"finger");//sur la minitable, c'est comme si le doigt était toujours posé
    
        //------------------MINI TABLE-------------------
        updateMiniTable(minitable,A);
    
        //------------------TABLE-------------------
        updateTableRows(table,A);
        updateTableColumns(table,A);//updates the state of every row and the vectors in the table attributes
    }
    hovering=0;//reset


    d3.select("#label_first").remove();
    d3.selectAll(".popupIndex").remove();
}


function quickshift_top_end(){

    d3.selectAll(".popupIndex").remove();//pui
    if(table.attr("transform")==null){
        table.attr("transform","translate(0,0)")
    }
    var oldy = get_y_transform(table);
    var width_table=parseFloat(table.attr("width"));
    var height_table=parseFloat(table.attr("height"));
    var width_that_col = cumulatedColumnsWidths[newXcol+1] - cumulatedColumnsWidths[newXcol];

    if(cumulatedColumnsWidths[newXcol+1] == table_width){//on va à la toute dernière colonne
      
        shiftXtable=width_displayed-table_width//-cumulatedColumnsWidths[newXcol-2];
  
        extended_right_svg();

        setTimeout(() => { d3.select("#elementsContainer").append("img")
                                                        .attr("src","pictures/triangle_down.svg")
                                                        .attr("id","jumpingman")
                                                        .style("top",parseFloat(d3.select("#tableContainer").style("top"))-30+"px")
                                                        .style("left",parseFloat(d3.select("#tableContainer").style("left"))+x_margin+width_displayed+(-width_that_col/2-10)+"px")
                                                        .attr("height",30)
                                                        .attr("width",20)
                                                    }, 500);
    
    }else{
        shiftXtable=-cumulatedColumnsWidths[newXcol];
      
        extend_right_svg();
        
        setTimeout(() => { d3.select("#elementsContainer").append("img")
                                                        .attr("src","pictures/triangle_down.svg")
                                                        .attr("id","jumpingman")
                                                        .style("top",parseFloat(d3.select("#tableContainer").style("top"))-30+"px")
                                                        .style("left",parseFloat(d3.select("#tableContainer").style("left"))+x_margin+width_that_col/2-10+"px")
                                                        .attr("height",30)
                                                        .attr("width",20)
                                                    }, 500);
    }
    setTimeout(() => {d3.select("#jumpingman").remove(); }, 1200);

    table.transition().duration(500).attr("transform","translate("+shiftXtable+","+oldy+")");
    d3.select("#faketable1").transition().duration(500).attr("transform","translate("+(width_table+shiftXtable)+","+oldy+")");
    d3.select("#faketable2").transition().duration(500).attr("transform","translate("+shiftXtable+","+(height_table+oldy+50)+")");
    d3.select("#columnsHeaders").transition().duration(500).attr("transform","translate("+shiftXtable+",0)");
    d3.select("#Headers").transition().duration(500).attr("transform","translate("+shiftXtable+",0)");

    d3.selectAll(".sc_principal,.sc_secondary").each(function(){
        var oldx=Number(d3.select(this).attr("startx_qs"));
        d3.select(this).transition().duration(500).attr("x",oldx+shiftXtable);
    })
   
    
    d3.selectAll(".tab").each(function(){
        /*
        var oldx=Number(d3.select(this).attr("startx_qs"));
        d3.select(this).style("left",oldx+shiftXtable+"px")
        */
        var id=Number(d3.select(this).attr("columnId"))
        var rect = d3.selectAll(".columnCircle").filter(function(){
            return d3.select(this).attr("columnId")==id;
        })
        var x = Number(rect.attr("x"))
        var w = Number(rect.attr("width"))
        d3.select(this).style("left",(x+w/2-127/2+100+shiftXtable)+"px")
    })
    d3.selectAll(".tabLogo").each(function(){
        var id=Number(d3.select(this).attr("columnId"))
        var rect = d3.selectAll(".columnCircle").filter(function(){
            return d3.select(this).attr("columnId")==id;
        })
        var x = Number(rect.attr("x"))
        var w = Number(rect.attr("width"))
        d3.select(this).style("left",(x+w/2-10+100+shiftXtable)+"px")
    })
   

    
    
    d3.selectAll(".ink")
        .each(function(d,i){
            var oldx=Number(d3.select(this).attr("startx_qs"));
         
            d3.select(this).style("left",oldx+shiftXtable+"px")
            
            var left_ink=parseFloat(d3.select(this).style("left"))
            var right_ink=parseFloat(d3.select(this).attr("width"))+parseFloat(d3.select(this).style("left"))
            var top_ink=parseFloat(d3.select(this).style("top"))
            var bottom_ink=parseFloat(d3.select(this).attr("height"))+parseFloat(d3.select(this).style("top"))

            if(left_ink>inkClipPath_right || right_ink<inkClipPath_left || top_ink>inkClipPath_bottom || bottom_ink<inkClipPath_top){//si on est en DEHORS du cadre de la table

                if(d3.select(this).attr("state")=="visible"){
                //seulement si on est sorti par un bord
            
                    d3.select(this).attr("state","hidden")
                                    .attr("viewBox",inkClipPath_left+" "+inkClipPath_top+" "+inkClipPath_right+" "+inkClipPath_bottom);
                    
                }
            }  else {//si on est DANS le cadre de la table
                
                //seulement si on est entré par un bord
                if(d3.select(this).attr("state")=="hidden"){
                    
                    d3.select(this).attr("state","visible");
                    d3.select(this).node().removeAttribute("viewBox");
                    
                }
            }
        
        });
        
        
    d3.selectAll(".postitContainer")
    .each(function(d,i){
        var oldx=Number(d3.select(this).attr("startx_qs"));
        d3.select(this).style("left",oldx+shiftXtable+"px");
        
        var left_ink=parseFloat(d3.select(this).style("left"))
        var right_ink=parseFloat(d3.select(this).attr("width"))+left_ink
        var top_ink=parseFloat(d3.select(this).style("top"))
        var bottom_ink=parseFloat(d3.select(this).attr("height"))+top_ink

        if(left_ink>inkClipPath_right || right_ink<inkClipPath_left || top_ink>inkClipPath_bottom || bottom_ink<inkClipPath_top){

            if(d3.select(this).attr("state")=="visible"){
            //seulement si on est sorti par un bord
        
                d3.select(this).attr("state","hidden")
                                .attr("viewBox",inkClipPath_left+" "+inkClipPath_top+" "+inkClipPath_right+" "+inkClipPath_bottom);
                
            }
        }  else {
            
            //seulement si on est entré par un bord
            if(d3.select(this).attr("state")=="hidden"){
                
                d3.select(this).attr("state","visible");
                d3.select(this).node().removeAttribute("viewBox");
                
            }
        }
    
    });//boundaries !!.style("top",shiftYtable).style("left",shiftXtable)
    
    //si on lache en dehors de la left bar il ne se passe rien 
}


function quickshift_left_end(){

    d3.selectAll(".popupIndex").remove();//pui
    if(table.attr("transform")==null){
        table.attr("transform","translate(0,0)")
    }
    var oldx = get_x_transform(table);
    var width_table=parseFloat(table.attr("width"));
    var height_table=parseFloat(table.attr("height"));
    
    //if(-ghostRowHeight*newYrow -2 < -table_height+height_displayed){//on est allé trop loin, on cap le déplacement
    if(50*(newYrow+1)==table_height){ 
        shiftYtable=height_displayed-table_height-50//-y_margin;
        
        //remplacer remove par le extended_bottom
        extended_bottom_svg();

        setTimeout(() => { d3.select("#elementsContainer").append("img")
                                                        .attr("src","pictures/triangle_right.svg")
                                                        .attr("id","jumpingman")
                                                        .style("top",parseFloat(d3.select("#tableContainer").style("top"))+y_margin+height_displayed+(-25-10)+"px")
                                                        .style("left",parseFloat(d3.select("#tableContainer").style("left"))-10+"px")
                                                        .attr("height",20)
                                                        .attr("width",30)
                                                    }, 500);
  
    }else{
        shiftYtable=(-ghostRowHeight)*newYrow;
        
        //remettre le 
        extend_bottom_svg();

        setTimeout(() => { d3.select("#elementsContainer").append("img")
                                                        .attr("src","pictures/triangle_right.svg")
                                                        .attr("id","jumpingman")
                                                        .style("top",(parseFloat(d3.select("#tableContainer").style("top"))+parseFloat(ghostRowHeight)/2+y_margin-10+50)+"px")
                                                        .style("left",parseFloat(d3.select("#tableContainer").style("left"))-10+"px")
                                                        .attr("height",20)
                                                        .attr("width",30)
                                                    }, 500);
    }
    table.transition().duration(500).attr("transform","translate("+oldx+","+shiftYtable+")");
        d3.select("#faketable1").transition().duration(500).attr("transform","translate("+(width_table+oldx)+","+shiftYtable+")");
        d3.select("#faketable2").transition().duration(500).attr("transform","translate("+oldx+","+(height_table+shiftYtable+50)+")");
        d3.select("#rowsHeaders").transition().duration(500).attr("transform","translate(0,"+shiftYtable+")");

    d3.selectAll(".sc_principal,.sc_secondary").each(function(){
        var oldy=Number(d3.select(this).attr("starty_qs"));
        d3.select(this).transition().duration(500).attr("y",oldy+shiftYtable);
    })
    
    
    d3.selectAll(".ink")
        .each(function(d,i){
            var oldy=Number(d3.select(this).attr("starty_qs"));
            d3.select(this).style("top",oldy+shiftYtable+"px")
            
            var left_ink=parseFloat(d3.select(this).style("left"))
            var right_ink=parseFloat(d3.select(this).attr("width"))+parseFloat(d3.select(this).style("left"))
            var top_ink=parseFloat(d3.select(this).style("top"))
            var bottom_ink=parseFloat(d3.select(this).attr("height"))+parseFloat(d3.select(this).style("top"))

            if(left_ink>inkClipPath_right || right_ink<inkClipPath_left || top_ink>inkClipPath_bottom || bottom_ink<inkClipPath_top){//si on est en DEHORS du cadre de la table

                if(d3.select(this).attr("state")=="visible"){
                //seulement si on est sorti par un bord
            
                    d3.select(this).attr("state","hidden")
                                    .attr("viewBox",inkClipPath_left+" "+inkClipPath_top+" "+inkClipPath_right+" "+inkClipPath_bottom);
                    
                }
            }  else {//si on est DANS le cadre de la table
                
                //seulement si on est entré par un bord
                if(d3.select(this).attr("state")=="hidden"){
                    
                    d3.select(this).attr("state","visible");
                    d3.select(this).node().removeAttribute("viewBox");
                    
                }
            }
        
        });
        
        
    d3.selectAll(".postitContainer")
    .each(function(d,i){
        var oldy=Number(d3.select(this).attr("starty_qs"));
        d3.select(this).style("top",oldy+shiftYtable+"px");
        
        var left_ink=parseFloat(d3.select(this).style("left"))
        var right_ink=parseFloat(d3.select(this).attr("width"))+left_ink
        var top_ink=parseFloat(d3.select(this).style("top"))
        var bottom_ink=parseFloat(d3.select(this).attr("height"))+top_ink

        if(left_ink>inkClipPath_right || right_ink<inkClipPath_left || top_ink>inkClipPath_bottom || bottom_ink<inkClipPath_top){

            if(d3.select(this).attr("state")=="visible"){
            //seulement si on est sorti par un bord
        
                d3.select(this).attr("state","hidden")
                                .attr("viewBox",inkClipPath_left+" "+inkClipPath_top+" "+inkClipPath_right+" "+inkClipPath_bottom);
                
            }
        }  else {
            
            //seulement si on est entré par un bord
            if(d3.select(this).attr("state")=="hidden"){
                
                d3.select(this).attr("state","visible");
                d3.select(this).node().removeAttribute("viewBox");
                
            }
        }
    
    });//boundaries !!.style("top",shiftYtable).style("left",shiftXtable)
    
    
        
        
    setTimeout(() => {d3.select("#jumpingman").remove(); }, 1200);

    //si on lache en dehors de la left bar il ne se passe rien 
}






function display_label_minitable(event,side){
    //side : row or column
 
    if(side=="row"){
        var offsetGhostRow = 20;
        var offsetFont=10;
        var left = miniTableContainer.node().getBoundingClientRect().left;
        var top = miniTableContainer.node().getBoundingClientRect().top;
        var rowwidth=cumulatedColumnsWidths[3]*popupRatio;
        var rowheight=ghostRowHeight*popupRatio;
        var points=50;

        var pui = d3.select("#elementsContainer").append("svg").attr("id","label_first")
                                                .style("left",left-rowwidth-offsetGhostRow-points)
                                                .style("top",event.clientY-rowheight/2- offsetFont)
                                                .attr("width",rowwidth+offsetGhostRow+points)//plus grand que ce qu'il ne faut, mais pas grave
                                                .attr("height",rowheight+offsetFont+40)
                                                .style("position","absolute");

        var traceContainer = d3.select("#elementsContainer").append("svg").attr("id","traceContainer")
                                                .style("left",left-rowwidth-offsetGhostRow-points+2)
                                                .style("top",top)
                                                .attr("width",rowwidth+offsetGhostRow+points)//plus grand que ce qu'il ne faut, mais pas grave
                                                .attr("height",200)
                                                .style("position","absolute");
    
    //INDEX
    pui.append("text").attr("class","popupIndexcss_start").attr("x",0).attr("y",rowheight/2+offsetFont).text(startYrow).attr("text-anchor", "start");
    traceContainer.append("line").attr("class","minitableTrace").attr("x1",0).attr("y1",event.clientY-top).attr("x2",0).attr("y2",event.clientY-top)

    } else {
        var offsetGhostCol = 50;
        var offsetFont=10;//c'est le numéro des lignes à gauche de la colonne
        var top = miniTableContainer.node().getBoundingClientRect().top;

        var name = d3.selectAll(".columnlabel").filter(function(){
            return d3.select(this).attr("columnId")==startXcol;
        }).text();//toujours bon, columnlabel c'est dans les columnsheaders
        
        var colwidth = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
            return (d3.select(this).attr("columnId"))==startXcol;
        }).select("rect").attr("width"))*popupRatio;
        var colheight=parseFloat(ghostColHeight)*popupRatio;
    
        //CONTAINER
        var pui = d3.select("#elementsContainer").append("svg").attr("id","label_first")//tout comme le vrai pui, mais on ne l'appellera pas
                                                    .style("left",event.clientX-colwidth-offsetFont)//80
                                                    .style("top",top-2*offsetFont)
                                                    .attr("width",colwidth+offsetFont)
                                                    .attr("height",colheight+offsetGhostCol)
                                                    .style("position","absolute");
                                                    
        //LETTER
        pui.append("text").attr("class","popupIndexcss_start").attr("x",colwidth).attr("y",offsetFont).text(name).attr("text-anchor", "start");
        
    }
        
    
}