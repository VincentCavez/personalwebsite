


function quickshift_left_setup(event){
    window.left_activated=true;

    var left = miniTableContainer.node().getBoundingClientRect().left;
    
    var offsetGhostRow = 50;
    var offsetFont=25;
    var dec=50;
    var pui = d3.select("#elementsContainer").append("svg").attr("transform","scale(0.75,0.75)")
                                                .style("left",left-280)
                                                .style("top",event.clientY-70-offsetFont)
                                                .attr("width",table_width+dec+offsetGhostRow)//plus grand que ce qu'il ne faut, mais pas grave
                                                .attr("height",ghostRowHeight+offsetFont+40)
                                                .attr("class","popupIndex").style("position","absolute");
    
    pui.append("text").attr("class","popupIndexcss").attr("x",0).attr("y",ghostRowHeight/2+offsetFont+47).text(startYrow);
    

    var y = parseFloat(d3.select("#r1").select(".cell").select("text").attr("y"));//la demi hauteur
    
    var r=3.5;
    
    if(p>6){
        var NewP=3;
        var x = get_x_transform(d3.select("#r"+startYrow).selectAll(".cell")
                                                        .filter(function(){
                                                                    return d3.select(this).attr("columnId")==NewP;
                                                                    })
                                )+dec*1.3;
       
        pui.append("circle")
            .style("fill","gray")
            .attr("cx",x)
            .attr("cy",ghostRowHeight/2+offsetFont)
            .attr("r",r);
        pui.append("circle")
            .style("fill","gray")
            .attr("cx",x+r*r)
            .attr("cy",ghostRowHeight/2+offsetFont)
            .attr("r",r);
        pui.append("circle")
            .style("fill","gray")
            .attr("cx",x+2*r*r)
            .attr("cy",ghostRowHeight/2+offsetFont)
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

        
        var x_cell = parseFloat(cell.attr("transform").split(",")[0].split("(")[1]);
        var x_texte = x_cell+parseFloat(cell.select("text").attr("x"));
        var width_cell = parseFloat(cell.select("rect").attr("width"));
        var texte = cell.select("text").text();
        
        pui.append("rect")
            .attr("class","cell")
            .style("fill",backColor)
            .attr("x",x_cell+offsetGhostRow+50)
            .attr("y",offsetFont)
            .attr("number",i)
            .attr("width",width_cell)
            .attr("height",ghostRowHeight)
            .style("opacity",1);
           
        pui.append("text")
            .attr("class","textcell")
            .attr("text-anchor","middle")
            .attr("x",x_texte+offsetGhostRow+50)
            .attr("y",y+offsetFont)//dans le repère du ghost, qui est déjà aux bonnes coords
            .attr("number",i)
            .style("opacity",1)
            .text(texte);    
            
        pui.append("text").attr("class","popupIndexcss").attr("x",x_texte+offsetGhostRow+50).attr("y",offsetFont-10).text(columnNames[i]).attr("text-anchor","middle");
    }
    //var lastX=0;
}



function quickshift_left_scroller(event) {
    //clearTimeout(quickShift_timer);
    var offsetFont=25;
    newY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
    newYrow = pixelsToRowScale_minitable(newY-bonus)//window ??
    
    //pop up index container
    var pui = d3.select(".popupIndex").style("top",event.clientY-70-offsetFont)//on ne recrée pas, on change juste son top

    pui.select(".popupIndexcss").text(newYrow);
    var lastX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
   
    function createGhostRow(){

        if(p>6){
            var NewP=3;
        } else {
            var NewP=p;
        }
        if(lastX>=0 && lastX<=bonus){//sur la barre de scroll
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
            
                pui.selectAll(".textcell").filter(function(){
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

                pui.selectAll(".textcell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).text(texte).style("opacity",0.5);
                pui.selectAll(".cell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).style("opacity",0.5).style("fill",backColor);
                pui.selectAll("circle").style("opacity",0.5);
            }

        }
        if(lastX>bonus && lastX<=54){//au milieu
            
            d3.select(".popupIndex").remove();//pui

            window.startX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
            window.startY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
            window.startXcol = pixelsToRow(pixelsToColumnScale_minitable,startX-bonus);//bonus
            window.newX=startX;
            window.startYrow = pixelsToRow(pixelsToRowScale_minitable,startY-bonus);//bonus
            window.newY=startY;

            window.first_tap_minitable=false;//ce n'est pas comme si on initiait une sélection : on truque en imposant une selection de colonnes
            hovering="vertical";
            minitable_hovering_setup(event);
            
            context.pop();
            context.push("pen_on_minitable_content");//on affine le contexte
            
             
        }
    }

    //quickShift_timer = setTimeout(() => {  createGhostRow(); }, 0);
    createGhostRow();
    
    return [lastX,newYrow];
}


function quickshift_left_end([lastX,newYrow]){

    d3.select(".popupIndex").remove();//pui
    //console.log(startJumping)
    

    if(lastX>=0 && lastX<=54){//up sur la left bar
        
        var oldx = get_x_transform(table);
      

        if(-ghostRowHeight*newYrow -2 < -table_height+height_displayed){//on est allé trop loin, on cap le déplacement
           
            shiftYtable=height_displayed-table_height//-y_margin;

            table.transition().duration(500).attr("transform","translate("+oldx+","+shiftYtable+")");
            d3.select("#rowsHeaders").transition().duration(500).attr("transform","translate(0,"+shiftYtable+")");
            //remplacer remove par le extended_bottom
            extended_bottom_svg();
        //}else if(d3.select("#extend_bottom").empty()==true){
        }else{
            shiftYtable=(-ghostRowHeight)*newYrow;
            table.transition().duration(500).attr("transform","translate("+oldx+","+shiftYtable+")");
            d3.select("#rowsHeaders").transition().duration(500).attr("transform","translate(0,"+shiftYtable+")");
            //remettre le 
            extend_bottom_svg();
        }

       
    

    setTimeout(() => { d3.select("#elementsContainer").append("img")
                                                        .attr("src","pictures/triangle_right.svg")
                                                        .attr("id","jumpingman")
                                                        .style("top",parseFloat(d3.select("#tableContainer").style("top"))+parseFloat(ghostRowHeight)/2+y_margin-10+"px")
                                                        .style("left",parseFloat(d3.select("#tableContainer").style("left"))-10+"px")
                                                        .attr("height",20)
                                                        .attr("width",30)
                                                    }, 500);
        
        
    setTimeout(() => {d3.select("#jumpingman").remove(); }, 1200);
    
    }
    //si on lache en dehors de la left bar il ne se passe rien 
}




function quickshift_top_setup(event){
    window.top_activated=true;
    var name = d3.selectAll(".columnlabel").filter(function(){
        return d3.select(this).attr("columnId")==startXcol;
    }).text();//toujours bon, columnlabel c'est dans les columnsheaders
    
    
    var colwidth = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==startXcol;
    }).select("rect").attr("width"))

    var top = miniTableContainer.node().getBoundingClientRect().top;
   
    var offsetGhostCol = 50;
    var offsetFont=20;//c'est le numéro des lignes à gauche de la colonne
    var dec=50;
    var pui = d3.select("#elementsContainer").append("svg").attr("transform","scale(0.75,0.75)")
                                                .style("left",event.clientX-colwidth-offsetFont)//80
                                                .style("top",top-130)
                                                .attr("width",colwidth+offsetFont)
                                                .attr("height",parseFloat(ghostColHeight)+offsetGhostCol+dec)
                                                .attr("class","popupIndex").style("position","absolute");
    //nom de la colonne
    pui.append("text").attr("class","popupIndexcss").attr("x",colwidth/2+offsetFont).attr("y",20).text(name).attr("text-anchor", "middle");

   
    var x = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==startXcol;
    }).select("text").attr("x"))
    
    var r=3.5;
    
    if(n>10){
        var NewN=8;
        //on cherche le y de la 8eme ligne, il faut le récupérer dans le transform
        var y = get_y_transform(d3.select("#r"+NewN))+dec*1.3;//utilse seulement pour les trois points
        
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
    for(i=0;i<NewN;i++){
        
        var cell = d3.select("#r"+i).selectAll(".cell").filter(function(){
            return (d3.select(this).attr("columnId"))==startXcol;
        });

        var cellState = cell.attr("state");
        if(cellState=="selected"){var backColor = selectedColor;}
        if(cellState=="unselected"){var backColor = unselectedColor;}
        if(cellState=="excluded"){var backColor = excludedColor;}

        var y_cell = get_y_transform(d3.select("#r"+i));
        var y_texte = y_cell+parseFloat(cell.select("text").attr("y"));
        
        var height_cell = cell.select("rect").attr("height");
        var texte = cell.select("text").text();
        
        pui.append("rect")
            .attr("class","cell")
            .style("fill",backColor)
            .attr("x",offsetFont)
            .attr("y",y_cell+offsetGhostCol)
            .attr("number",i)
            .attr("width",colwidth)
            .attr("height",height_cell)
            .style("opacity",1)
            ;
        pui.append("text")
            .attr("class","textcell")
            .attr("text-anchor","middle")
            .attr("x",x+offsetFont)
            .attr("y",y_texte+offsetGhostCol)//dans le repère du ghost, qui est déjà aux bonnes coords
            .attr("number",i)
            .style("opacity",1)
            .text(texte); 
            
        //indices des lignes    
        pui.append("text").attr("class","popupIndexcss").attr("x",0).attr("y",y_texte+offsetGhostCol).text(i).attr("text-anchor","start");
    }
    
}



function quickshift_top_scroller(event) {
    //clearTimeout(quickShift_timer);

    
    newX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
    newXcol = pixelsToColumnScale_minitable(newX-bonus)//window ??

    var colwidth = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==newXcol;
    }).select("rect").attr("width"))
    
    var x = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==newXcol;
    }).select("text").attr("x"))

    var offsetFont=20;//c'est le numéro des lignes à gauche de la colonne
    //pop up index container
    var pui = d3.select(".popupIndex").style("left",event.clientX-colwidth-offsetFont).attr("width",colwidth+offsetFont)//on ne recrée pas, on change juste son top

    var name = d3.selectAll(".columnlabel").filter(function(){
        return d3.select(this).attr("columnId")==newXcol;
    }).text();
    pui.select(".popupIndexcss").text(name).attr("text-anchor", "middle").attr("x",colwidth/2+offsetFont)   ;
    var lastY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
   
    var r=3.5;
    function createGhostCol(){
       
        if(n>10){
            var NewN=8;
        } else {
            var NewN=n;   
        }
        if(lastY>=0 && lastY<=bonus){//in the limits of the minitable


            if(NewN==8){//on bouge les trois petits points
                d3.select("#etc").attr("transform","translate("+(colwidth/2-r*r+offsetFont)+","+0+")").style("opacity",1);
            }
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
                    
                pui.selectAll(".textcell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).text(texte).style("opacity",1).attr("x",x+offsetFont);
                pui.selectAll(".cell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).style("opacity",1).style("fill",backColor).attr("width",colwidth);
                
            }
        } 
        if(lastY < 0){//plus haut ou plus bas
            if(NewN==8){//on bouge les trois petits points, mais en transparent
                d3.select("#etc").attr("transform","translate("+(colwidth/2-r*r+offsetFont)+","+0+")").style("opacity",0.5);
            }
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

                pui.selectAll(".textcell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).text(texte).style("opacity",0.5).attr("x",x+offsetFont);
                pui.selectAll(".cell").filter(function(){
                    return parseFloat(d3.select(this).attr("number"))==i;
                }).style("opacity",0.5).style("fill",backColor).attr("width",colwidth);
                //pui.selectAll("circle").style("opacity",0.5);
            }

        }
        if(lastY>bonus && lastY<=164){
            
            d3.select(".popupIndex").remove();//pui

            window.startX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
            window.startY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
            window.startXcol = pixelsToRow(pixelsToColumnScale_minitable,startX-bonus);//bonus
            window.newX=startX;
            window.startYrow = pixelsToRow(pixelsToRowScale_minitable,startY-bonus);//bonus
            window.newY=startY;

            window.first_tap_minitable=false;//ce n'est pas comme si on initiait une sélection : on truque en imposant une selection de colonnes
            hovering="horizontal";
            minitable_hovering_setup(event);
            
            context.pop();
            context.push("pen_on_minitable_content");//on affine le contexte
            
             
        }
    }

    //quickShift_timer = setTimeout(() => {  createGhostRow(); }, 0);
    createGhostCol();
    
    return [lastY,newXcol];
}


function quickshift_top_end([lastY,newXcol]){

    d3.select(".popupIndex").remove();//pui
    
    if(lastY>=0 && lastY<=164){//up sur la minitable
        
        /*
        if (table.attr("transform")==undefined){
            oldy=0;
            table.attr("transform","translate(0,0)");
        } else {
            */
            var oldy = get_y_transform(table);
        //}
           
        if(cumulatedColumnsWidths[newXcol] +2 > table_width-width_displayed){//on est allé trop loin, on cap le déplacement
            
            shiftXtable=width_displayed-table_width-cumulatedColumnsWidths[1]-40;
            table.transition().duration(500).attr("transform","translate("+shiftXtable+","+oldy+")");
            d3.select("#columnsHeaders").transition().duration(500).attr("transform","translate("+shiftXtable+",0)");
            
            extended_right_svg();
       
        }else{
            shiftXtable=-cumulatedColumnsWidths[newXcol];
            table.transition().duration(500).attr("transform","translate("+shiftXtable+","+oldy+")");
            d3.select("#columnsHeaders").transition().duration(500).attr("transform","translate("+shiftXtable+",0)");
            
            extend_right_svg();
        }

        setTimeout(() => { d3.select("#elementsContainer").append("img")
                                                            .attr("src","pictures/triangle_down.svg")
                                                            .attr("id","jumpingman")
                                                            .style("top",parseFloat(d3.select("#tableContainer").style("top"))-30+"px")
                                                            .style("left",parseFloat(d3.select("#tableContainer").style("left"))+x_margin+parseFloat(ghostColWidth)/2-10+"px")
                                                            .attr("height",30)
                                                            .attr("width",20)
                                                        }, 500);
        
        
        
        
        setTimeout(() => {d3.select("#jumpingman").remove(); }, 1200);
    }
    
    //si on lache en dehors de la left bar il ne se passe rien 
}



function minitable_hovering_setup(event){
    plots_closing();
    var size=2;
    newX = event.clientX - miniTableContainer.node().getBoundingClientRect().left - bonus;
    newY = event.clientY - miniTableContainer.node().getBoundingClientRect().top - bonus;
    //plus mark at the starting point
    minitable.append("line").attr("x1",newX).attr("x2",newX).attr("y1",newY-size).attr("y2",newY+size).style("stroke","navy");
    minitable.append("line").attr("x1",newX-size).attr("x2",newX+size).attr("y1",newY).attr("y2",newY).style("stroke","navy");

    window.tHoveringRect = table.append("rect").attr("id", "hoveringRectangle");
    window.mtHoveringRect = minitable.append("rect").attr("id", "hoveringRectangle");
    
    window.timer_minitable=Date.now();
    window.inside_perimeter=true;
    window.reset_label=true;

    quickshift_left_setup(event);//de base on va faire pop up en row
   
}


function minitable_hovering(event){
    var del=200;
    newX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
    newY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
        

    newYrow = pixelsToRowScale_minitable(newY-bonus)
    newXcol = pixelsToColumnScale_minitable(newX-bonus)
    var colwidth = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==newXcol;
    }).select("rect").attr("width"));
    var x = parseFloat(d3.select("#r0").selectAll(".cell").filter(function(){
        return (d3.select(this).attr("columnId"))==newXcol;
    }).select("text").attr("x"));
    var name = d3.selectAll(".columnlabel").filter(function(){
        return d3.select(this).attr("columnId")==newXcol;
    }).text();
    

    if(p>6){var NewP=3;} else {var NewP=p;}
    if(n>10){var NewN=8;} else {var NewN=n;}
    
    if(newY>bonus && newX>bonus){
        
        if(Math.sqrt(Math.pow(newX-startX,2)+Math.pow(newY-startY,2))<10){//si on est dans le perimetre
            
            if(inside_perimeter==false){
                timer_minitable=Date.now();//on note le moment d'arrivée dans le périmètre
                inside_perimeter=true;
               
            }
            if(Date.now()-timer_minitable>1000){//on a dépassé une seconde
               
                //VERTICAL
                if(Math.abs(newX-startX)<Math.abs(newY-startY)){
                    if(top_activated==true){
                        d3.select(".popupIndex").remove();
                        quickshift_left_setup(event);
                        window.top_activated=false;
                    }
                    if(Date.now()-timer_minitable<1020){
                        display_label_minitable(event,"row","first")
                        
                        //window.reset_label=false;
                    }
                    
                    var offsetFont=25;
                    var pui = d3.select(".popupIndex").style("top",event.clientY-70-offsetFont)//on ne recrée pas, on change juste son top
                    pui.select(".popupIndexcss").text(newYrow);
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

                        pui.selectAll(".textcell").filter(function(){
                            return parseFloat(d3.select(this).attr("number"))==i;
                        }).text(texte).style("opacity",1);
                        pui.selectAll(".cell").filter(function(){
                            return parseFloat(d3.select(this).attr("number"))==i;
                        }).style("opacity",1).style("fill",backColor);
                        pui.selectAll("circle").style("opacity",1);
                    }
                    if(newY>startY){//on est parti vers le bas
                        var ty=cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                        var th=cumulatedRowHeights[row_mtPixels_row(newY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                        mtHoveringRect.transition().duration(del).attr("y",startY-bonus).attr("height", newY-startY).attr("x",0).attr("width",minitable_background_width);
                        tHoveringRect.transition().duration(del).attr("y",ty).attr("height",th).attr("x",0).attr("width",table_width);
                    } else {//on est parti vers le haut
                        var ty=cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                        var th=cumulatedRowHeights[row_mtPixels_row(startY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                        mtHoveringRect.transition().duration(del).attr("y",newY-bonus).attr("height", startY-newY).attr("x",0).attr("width",minitable_background_width);
                        tHoveringRect.transition().duration(del).attr("y",ty).attr("height", th).attr("x",0).attr("width",table_width);
                    }
                    hovering = "vertical";
                    
                } else {
                    //HORIZONTAL

                    if(Date.now()-timer_minitable<1020){
                        //display_label_minitable(event,"row","first")
                       
                        //window.reset_label=false;
                    }
                    if(left_activated==true){
                        d3.select(".popupIndex").remove();
                        quickshift_top_setup(event);
                        window.left_activated=false;
                    }
                    var top = miniTableContainer.node().getBoundingClientRect().top;
                    var offsetGhostCol = 50;
                    var offsetFont=20;//c'est le numéro des lignes à gauche de la colonne
                    var dec=50;
                    var pui = d3.select(".popupIndex").style("left",event.clientX-colwidth-offsetFont).attr("width",colwidth+offsetFont).attr("height",parseFloat(ghostColHeight)+offsetGhostCol+dec)
                    //nom de la colonne
                    pui.select(".popupIndexcss").text(name).attr("text-anchor", "middle").attr("x",colwidth/2+offsetFont)   ;
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
                            
                        pui.selectAll(".textcell").filter(function(){
                            return parseFloat(d3.select(this).attr("number"))==i;
                        }).text(texte).style("opacity",1).attr("x",x+offsetFont);
                        pui.selectAll(".cell").filter(function(){
                            return parseFloat(d3.select(this).attr("number"))==i;
                        }).style("opacity",1).style("fill",backColor).attr("width",colwidth);
                        
                    }
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
            } else {//ça fait moins d'une seconde
                if(hovering=="vertical" || (first_tap_minitable==true && (Math.abs(newX-startX)<Math.abs(newY-startY) ) ) ){
                    //VERTICAL
                    if(reset_label==true){
                        
                        display_label_minitable(event,"row","first")
                        
                       
                        window.reset_label=false;
                    } else {
                        //display_label_minitable(event,"row","moving")
                    }
                    if(top_activated==true){
                        d3.select(".popupIndex").remove();
                        quickshift_left_setup(event);
                        window.top_activated=false;
                    }
                    var offsetFont=25;
                    var pui = d3.select(".popupIndex").style("top",event.clientY-70-offsetFont)//on ne recrée pas, on change juste son top
                    pui.select(".popupIndexcss").text(newYrow);
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

                        pui.selectAll(".textcell").filter(function(){
                            return parseFloat(d3.select(this).attr("number"))==i;
                        }).text(texte).style("opacity",1);
                        pui.selectAll(".cell").filter(function(){
                            return parseFloat(d3.select(this).attr("number"))==i;
                        }).style("opacity",1).style("fill",backColor);
                        pui.selectAll("circle").style("opacity",1);
                    }
                    if(newY>startY){//on est parti vers le bas
                        var ty=cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                        var th=cumulatedRowHeights[row_mtPixels_row(newY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                        mtHoveringRect.attr("y",startY-bonus).attr("height", newY-startY).attr("x",0).attr("width",minitable_background_width);
                        tHoveringRect.attr("y",ty).attr("height",th).attr("x",0).attr("width",table_width);
                    } else {//on est parti vers le haut
                        var ty=cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                        var th=cumulatedRowHeights[row_mtPixels_row(startY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                        mtHoveringRect.attr("y",newY-bonus).attr("height", startY-newY).attr("x",0).attr("width",minitable_background_width);
                        tHoveringRect.attr("y",ty).attr("height", th).attr("x",0).attr("width",table_width);
                    }
                    hovering = "vertical";
                    first_tap_minitable=false;
                }
                //HORIZONTAL
                if(hovering=="horizontal" || (first_tap_minitable==true && (Math.abs(newX-startX)>=Math.abs(newY-startY) ) ) ){
                    if(left_activated==true){
                        d3.select(".popupIndex").remove();
                        quickshift_top_setup(event);
                        window.left_activated=false;
                    }
                    var top = miniTableContainer.node().getBoundingClientRect().top;
                    var offsetGhostCol = 50;
                    var offsetFont=20;//c'est le numéro des lignes à gauche de la colonne
                    var dec=50;
                    var pui = d3.select(".popupIndex").style("left",event.clientX-colwidth-offsetFont).attr("width",colwidth+offsetFont).attr("height",parseFloat(ghostColHeight)+offsetGhostCol+dec)
                    //nom de la colonne
                    pui.select(".popupIndexcss").text(name).attr("text-anchor", "middle").attr("x",colwidth/2+offsetFont)   ;
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
                            
                        pui.selectAll(".textcell").filter(function(){
                            return parseFloat(d3.select(this).attr("number"))==i;
                        }).text(texte).style("opacity",1).attr("x",x+offsetFont);
                        pui.selectAll(".cell").filter(function(){
                            return parseFloat(d3.select(this).attr("number"))==i;
                        }).style("opacity",1).style("fill",backColor).attr("width",colwidth);
                        
                    }
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
                    hovering = "horizontal";
                    first_tap_minitable=false;
                }
            }
        } else {
            //on sort du perimetre
            //VERTICAL
            if(hovering=="vertical"){
                if(top_activated==true){
                    d3.select(".popupIndex").remove();
                    quickshift_left_setup(event);
                    window.top_activated=false;
                }
                var offsetFont=25;
                var pui = d3.select(".popupIndex").style("top",event.clientY-70-offsetFont)//on ne recrée pas, on change juste son top
                pui.select(".popupIndexcss").text(newYrow);
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

                    pui.selectAll(".textcell").filter(function(){
                        return parseFloat(d3.select(this).attr("number"))==i;
                    }).text(texte).style("opacity",1);
                    pui.selectAll(".cell").filter(function(){
                        return parseFloat(d3.select(this).attr("number"))==i;
                    }).style("opacity",1).style("fill",backColor);
                    pui.selectAll("circle").style("opacity",1);
                }
                if(newY>startY){//on est parti vers le bas
                    var ty=cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                    var th=cumulatedRowHeights[row_mtPixels_row(newY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(startY-bonus)]
                    mtHoveringRect.attr("y",startY-bonus).attr("height", newY-startY).attr("x",0).attr("width",minitable_background_width);
                    tHoveringRect.attr("y",ty).attr("height",th).attr("x",0).attr("width",table_width);
                } else {//on est parti vers le haut
                    var ty=cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                    var th=cumulatedRowHeights[row_mtPixels_row(startY-bonus)+1]-cumulatedRowHeights[row_mtPixels_row(newY-bonus)]
                    mtHoveringRect.attr("y",newY-bonus).attr("height", startY-newY).attr("x",0).attr("width",minitable_background_width);
                    tHoveringRect.attr("y",ty).attr("height", th).attr("x",0).attr("width",table_width);
                }
            } else {
                //HORIZONTAL
                
                
                if(left_activated==true){
                    d3.select(".popupIndex").remove();
                    quickshift_top_setup(event);
                    window.left_activated=false;
                }
                var top = miniTableContainer.node().getBoundingClientRect().top;
                var offsetGhostCol = 50;
                var offsetFont=20;//c'est le numéro des lignes à gauche de la colonne
                var dec=50;
                var pui = d3.select(".popupIndex").style("left",event.clientX-colwidth-offsetFont).attr("width",colwidth+offsetFont).attr("height",parseFloat(ghostColHeight)+offsetGhostCol+dec)
                //nom de la colonne
                pui.select(".popupIndexcss").text(name).attr("text-anchor", "middle").attr("x",colwidth/2+offsetFont)   ;
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
                        
                    pui.selectAll(".textcell").filter(function(){
                        return parseFloat(d3.select(this).attr("number"))==i;
                    }).text(texte).style("opacity",1).attr("x",x+offsetFont);
                    pui.selectAll(".cell").filter(function(){
                        return parseFloat(d3.select(this).attr("number"))==i;
                    }).style("opacity",1).style("fill",backColor).attr("width",colwidth);
                    
                }
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
    //barre du haut
    if(newY>=0 && newY<=bonus && newX>=bonus && newX<=54){//pas besoin de voir le cas <0, c'est dans top scroller
        //on ajoute bonus car newY est décalé pour partir de 0
        window.startX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
        window.startY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
        window.startXcol = pixelsToRow(pixelsToColumnScale_minitable,startX-bonus);//bonus
        window.newX=startX;
        window.startYrow = pixelsToRow(pixelsToRowScale_minitable,startY-bonus);//bonus
        window.newY=startY;

        minitable.selectAll("line").remove();
        mtHoveringRect.remove();//on ne le remove pas car on peut s'en reservir
        tHoveringRect.remove();

        quickshift_top_setup(event);

        context.pop();
        context.push("pen_on_minitable_quickshift_top");//on affine le contexte                          
    }
    //barre de gauche
    if(newY>=bonus && newY<=164 && newX>=0 && newX<=bonus){//pas besoin de voir le cas <0, c'est dans left scroller
        //on ajoute bonus car newY est décalé pour partir de 0
        window.startX = event.clientX - miniTableContainer.node().getBoundingClientRect().left;
        window.startY = event.clientY - miniTableContainer.node().getBoundingClientRect().top;
        window.startXcol = pixelsToRow(pixelsToColumnScale_minitable,startX-bonus);//bonus
        window.newX=startX;
        window.startYrow = pixelsToRow(pixelsToRowScale_minitable,startY-bonus);//bonus
        window.newY=startY;

        minitable.selectAll("line").remove();
        mtHoveringRect.remove();//on ne le remove pas car on peut s'en reservir
        tHoveringRect.remove();
        d3.select("#label_first").remove();
        d3.select("#label_moving").remove();
        d3.select(".popupIndex").remove();
        quickshift_left_setup(event);

        context.pop();
        context.push("pen_on_minitable_quickshift_left");//on affine le contexte                          
    }

}

function minitable_hovering_end(){
    minitable.selectAll("line").remove();
    
    mtHoveringRect.remove();//on ne le remove pas car on peut s'en reservir ?
    tHoveringRect.remove();

    //window.tHoveringRect = table.append("rect").attr("id", "hoveringRectangle");
    //window.mtHoveringRect = minitable.append("rect").attr("id", "hoveringRectangle");

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
    d3.select("#label_moving").remove();
    d3.select(".popupIndex").remove();
}




function display_label_minitable(event,side,role){
    //side : row or column
    //index : integer for position
    //role : first or moving
    var left = miniTableContainer.node().getBoundingClientRect().left;
    var offsetGhostRow = 50;
    var offsetFont=25;
    var dec=50;

    if(side=="row"){
        if(role=="first"){
            var left = miniTableContainer.node().getBoundingClientRect().left;
    
    
            var pui = d3.select("#elementsContainer").append("svg").attr("id","label_first").attr("transform","scale(0.75,0.75)")
                                                .style("left",left-280)
                                                .style("top",event.clientY-70-offsetFont)
                                                .attr("width",table_width+dec+offsetGhostRow)//plus grand que ce qu'il ne faut, mais pas grave
                                                .attr("height",ghostRowHeight+offsetFont+40)
                                                .attr("class","popupIndex").style("position","absolute");
    
            pui.append("text").attr("class","popupIndexcss").attr("x",0).attr("y",ghostRowHeight/2+offsetFont+47).text(startYrow);//start ?
    
        }
        if(role=="moving"){
            var newYrow = pixelsToRow(pixelsToRowScale_minitable,newY-bonus);
            if(d3.select("#label_moving").empty()==false){
                d3.select("#label_moving").remove();//on supprime le précédent
            }
            var pui = d3.select("#elementsContainer").append("svg").attr("id","label_moving")
                                                .style("left",left-30)
                                                .style("top",event.clientY-40-offsetFont)
                                                .attr("width",table_width+dec+offsetGhostRow)//plus grand que ce qu'il ne faut, mais pas grave
                                                .attr("height",ghostRowHeight+offsetFont)
                                                .attr("class","popupIndex").style("position","absolute");
    
            pui.append("text").attr("class","popupIndexcss").attr("x",0).attr("y",ghostRowHeight/2+offsetFont+7).text(newYrow).attr("transform","scale(0.75,0.75)");
    
        }
    }
}
