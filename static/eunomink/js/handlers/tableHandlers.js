
function tableContentMover_setup(event){
    console.log("TM setup")
    window.startX = event.clientX;
    window.startY = event.clientY;
    
    window.originX = get_x_transform(table);
    window.originY = get_y_transform(table);
   
   

    window.inkClipPath_left = parseFloat(tableContainer.style("left"))+x_margin;
    window.inkClipPath_right = tableContainer_left+parseFloat(tableContainer.attr("width"));
    window.inkClipPath_top = parseFloat(tableContainer.style("top"))+y_margin;
    window.inkClipPath_bottom = tableContainer_top+parseFloat(tableContainer.attr("height"));



    
    d3.selectAll(".sc_principal,.sc_secondary").each(function(){
       
        var oldx=Number(d3.select(this).attr("x"));
        d3.select(this).attr("startx",oldx)
        if(d3.select(this).attr("startx_qs")==null){
            d3.select(this).attr("startx_qs",oldx)
        }
    
        var oldy=Number(d3.select(this).attr("y"));
        d3.select(this).attr("starty",oldy);
        if(d3.select(this).attr("starty_qs")==null){
            d3.select(this).attr("starty_qs",oldy)
        }
        
    })

    d3.selectAll(".ink").each(function(){
        var oldx=parseFloat(d3.select(this).style("left"));
        d3.select(this).attr("startx",oldx);
        if(d3.select(this).attr("startx_qs")==null){
            d3.select(this).attr("startx_qs",oldx)
        }
        var oldy=parseFloat(d3.select(this).style("top"));
        d3.select(this).attr("starty",oldy);
        if(d3.select(this).attr("starty_qs")==null){
            d3.select(this).attr("starty_qs",oldy)
        }
    })

    d3.selectAll(".postitContainer,.miniPostitContainer").each(function(){
        var oldx=parseFloat(d3.select(this).style("left"));
        var oldy=parseFloat(d3.select(this).style("top"));
        d3.select(this).attr("startx",oldx).attr("starty",oldy);
        
        if(d3.select(this).attr("startx_qs")==null){
            d3.select(this).attr("startx_qs",oldx)
        }
        if(d3.select(this).attr("starty_qs")==null){
            d3.select(this).attr("starty_qs",oldy)
        }
    })


    d3.selectAll(".tab,.tabLogo").each(function(){
        var oldx=parseFloat(d3.select(this).style("left"));
        d3.select(this).attr("startx",oldx);
        if(d3.select(this).attr("startx_qs")==null){
            d3.select(this).attr("startx_qs",oldx)
        }
    })

}

function tableContentMover(event){
    console.log("TM move")
    if(event.pointerId==secondFinger){

        shiftXtable = originX + (event.clientX - startX);//origin change à chaque nouveau départ
        shiftYtable = originY + (event.clientY - startY);
        
        if(shiftXtable<=0){
            d3.select("#table").attr("transform","translate("+shiftXtable+","+get_y_transform(d3.select("#table"))+")");

            d3.select("#faketable1").attr("transform","translate("+(parseFloat(d3.select("#table").attr("width"))+shiftXtable)+","+get_y_transform(d3.select("#faketable1"))+")");
            d3.select("#faketable2").attr("transform","translate("+shiftXtable+","+(parseFloat(d3.select("#table").attr("height"))+get_y_transform(d3.select("#faketable2"))+50)+")");
      
            var oldy = Number(d3.select("#columnsHeaders").attr("transform").split(",")[1].split(")")[0]);
            d3.select("#columnsHeaders").attr("transform","translate("+shiftXtable+","+oldy+")");//boundaries !!
            d3.select("#Headers").attr("transform","translate("+shiftXtable+","+get_y_transform(d3.select("#Headers"))+")");//boundaries !!
        }
        if(shiftYtable<=0){
            d3.select("#table").attr("transform","translate("+get_x_transform(d3.select("#table"))+","+shiftYtable+")");

            d3.select("#faketable1").attr("transform","translate("+get_x_transform(d3.select("#faketable1"))+","+shiftYtable+")");
            d3.select("#faketable2").attr("transform","translate("+get_x_transform(d3.select("#faketable2"))+","+(parseFloat(d3.select("#table").attr("height"))+shiftYtable+50)+")");
    
            var oldx = Number(d3.select("#rowsHeaders").attr("transform").split(",")[0].split("(")[1]);
            d3.select("#rowsHeaders").attr("transform","translate("+oldx+","+shiftYtable+")");//boundaries !!

        }
        

        //if(d3.select(".cursor").empty()==false){d3.select(".cursor").style("left",cap0x(cursorXOrigin,event.clientX,startX)).style("top",cap0y(cursorYOrigin,event.clientY,startY));}
        //if(d3.select(".cursorArea").empty()==false){d3.select(".cursorArea").style("left",cap0x(cursorXAreaOrigin,event.clientX,startX)).style("top",cap0y(cursorYAreaOrigin,event.clientY,startY));}
        
        d3.selectAll(".tab").each(function(){
            var oldx=Number(d3.select(this).attr("startx"));
            if(shiftXtable<=0){d3.select(this).style("left",oldx+(event.clientX-startX)+"px")}
        })

        
        d3.selectAll(".tabLogo").each(function(){
            var oldx=Number(d3.select(this).attr("startx"));
            if(shiftXtable<=0){d3.select(this).style("left",oldx+(event.clientX-startX)+"px")}
        })

        d3.selectAll(".sc_principal,.sc_secondary").each(function(){
            var oldx=Number(d3.select(this).attr("startx"));
            var oldy=Number(d3.select(this).attr("starty"));
            if(shiftXtable<=0){d3.select(this).attr("x",oldx+(event.clientX-startX))}
            if(shiftYtable<=0){d3.select(this).attr("y",oldy+(event.clientY-startY))}
        })

        d3.selectAll(".ink")
            .each(function(d,i){
                var oldx=Number(d3.select(this).attr("startx"));
                var oldy=Number(d3.select(this).attr("starty"));
                if(shiftXtable<=0){d3.select(this).style("left",oldx+(event.clientX-startX)+"px")}
                if(shiftYtable<=0){d3.select(this).style("top",oldy+(event.clientY-startY)+"px")}
            

                var left_ink=parseFloat(d3.select(this).style("left"))
                var right_ink=parseFloat(d3.select(this).attr("width"))+parseFloat(d3.select(this).style("left"))
                var top_ink=parseFloat(d3.select(this).style("top"))
                var bottom_ink=parseFloat(d3.select(this).attr("height"))+parseFloat(d3.select(this).style("top"))

                var sameIdMini=d3.selectAll(".miniPostitContainer").filter(function(){
                    return Number(d3.select(this).attr("postitId"))==id;
                })
    
                if(sameIdMini.empty()==true){
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
                }
            
            });
            
            
        d3.selectAll(".postitContainer")
        .each(function(d,i){
            var id=Number(d3.select(this).attr("postitId"));
            var oldx=Number(d3.select(this).attr("startx"));
            var oldy=Number(d3.select(this).attr("starty"));
            if(shiftXtable<=0){d3.select(this).style("left",oldx+(event.clientX-startX)+"px")}
            if(shiftYtable<=0){d3.select(this).style("top",oldy+(event.clientY-startY)+"px")}
 
            var left_ink=parseFloat(d3.select(this).style("left"))
            var right_ink=parseFloat(d3.select(this).attr("width"))+left_ink
            var top_ink=parseFloat(d3.select(this).style("top"))
            var bottom_ink=parseFloat(d3.select(this).attr("height"))+top_ink

            var sameIdMini=d3.selectAll(".miniPostitContainer").filter(function(){
                return Number(d3.select(this).attr("postitId"))==id;
            })

            if(sameIdMini.empty()==true){

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
            }
        
        });//boundaries !!.style("top",shiftYtable).style("left",shiftXtable)

        d3.selectAll(".miniPostitContainer")
        .each(function(d,i){
            var id=Number(d3.select(this).attr("postitId"));
            var oldx=Number(d3.select(this).attr("startx"));
            var oldy=Number(d3.select(this).attr("starty"));
            if(shiftXtable<=0){d3.select(this).style("left",oldx+(event.clientX-startX)+"px")}
            if(shiftYtable<=0){d3.select(this).style("top",oldy+(event.clientY-startY)+"px")}
 
            var left_ink=parseFloat(d3.select(this).style("left"))
            var right_ink=parseFloat(d3.select(this).attr("width"))+left_ink
            var top_ink=parseFloat(d3.select(this).style("top"))
            var bottom_ink=parseFloat(d3.select(this).attr("height"))+top_ink

            if(left_ink>inkClipPath_right || right_ink<inkClipPath_left || top_ink>inkClipPath_bottom || bottom_ink<inkClipPath_top){

                if(d3.select(this).attr("state")=="visible"){
                //seulement si on est sorti par un bord
            
                    d3.select(this).attr("state","hidden")
                                    .attr("viewBox",inkClipPath_left+" "+inkClipPath_top+" "+inkClipPath_right+" "+inkClipPath_bottom);

                    d3.selectAll(".postitContainer").filter(function(){
                        return Number(d3.select(this).attr("postitId"))==id;
                    }).attr("state","hidden")
                    .attr("viewBox",inkClipPath_left+" "+inkClipPath_top+" "+inkClipPath_right+" "+inkClipPath_bottom);
                }
            }  else {
                //seulement si on est entré par un bord
                if(d3.select(this).attr("state")=="hidden"){
                    
                    d3.select(this).attr("state","visible");
                    d3.select(this).node().removeAttribute("viewBox"); 

                    d3.selectAll(".postitContainer").filter(function(){
                       
                        return Number(d3.select(this).attr("postitId"))==id;
                    }).attr("state","visible").attr("viewBox",null);
                    
                }
            }
        
        });//boundaries !!.style("top",shiftYtable).style("left",shiftXtable)
    }
}



function tap_on_table_borders(event){

    //si on relève sur un ink, on fusionne en ajoutant le path au svg existant ? -> ensuite on regarde si on reconnait un geste ?
    //sinon, on regarde si c'était un clic ou pas
        //si oui, on regarde s'il y a un élément en-dessous -> ouverture de plot par exemple
        //si non, on enregistre puis on regarde s'il y a un élément en-dessous -> sélection par exemple
    
        var startX = event.clientX - table.node().getBoundingClientRect().left;//pas le début du tout, plutôt la fin
        var startY = event.clientY - table.node().getBoundingClientRect().top;
       
        
        //--------------------------------------------------------------//
        //                   Tap (on the column names)                  //
        //--------------------------------------------------------------//
        if(event.clientX-tableContainer.node().getBoundingClientRect().left>x_margin && event.clientY-tableContainer.node().getBoundingClientRect().top<=y_margin){
            //haut de la table, doigt sur des colonnes
            hovering="horizontal"
            
            //--------------------------------------------------------------//
            //               Short click (on the column names)              //
            //--------------------------------------------------------------//
            if(event_endTime-event_startTime<200){
                var startXcol = pixelsToColumnScale_table(startX);//on a besoin de savoir s'il y a une subcell dans CETTE colonne
                
                d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
                d3.selectAll(".editionBubble").remove();
    
                var hovered = [startXcol];
               
                if(singleFingerPressed==true){
                
                    var A = selectionLogic1D(table,hovered,startXcol,startXcol,"finger");
                }else{
                    var A = selectionLogic1D(table,hovered,startXcol,startXcol,"none");
                }
                //------------------TABLE-------------------
                updateTableColumns(table,A);
                //------------------MINI TABLE-------------------
                updateMiniTable(minitable,A)
                //}
            
    
            
            } 
            hovering=0;
        }
    
        //--------------------------------------------------------------//
        //                     Tap (on the row names)                   //
        //--------------------------------------------------------------//
        if(event.clientX-tableContainer.node().getBoundingClientRect().left<x_margin && event.clientY-tableContainer.node().getBoundingClientRect().top>y_margin){
            hovering="vertical"
            
            //--------------------------------------------------------------//
            //                 Short click (on the row names)               //
            //--------------------------------------------------------------//
            if(event_endTime-event_startTime<200){
                d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
                d3.selectAll(".editionBubble").remove();
                //var startYrow = pixelsToRow(pixelsToRowScale_table,startY);
                var startYrow = pixelsToRowScale_table(startY+50);
    
                var hovered = [startYrow];
               
                if(singleFingerPressed==true){
                    
                    var A = selectionLogic1D(table,hovered,startYrow,startYrow,"finger");
                }else{
                    var A = selectionLogic1D(table,hovered,startYrow,startYrow,"none");
                }
                //------------------TABLE-------------------
                updateTableRows(table,A);
                //------------------MINI TABLE-------------------
                updateMiniTable(minitable,A)
            
            }
            hovering=0;
            
        }
    
        
        
    }

function tap_on_table_content(event){

//si on relève sur un ink, on fusionne en ajoutant le path au svg existant ? -> ensuite on regarde si on reconnait un geste ?
//sinon, on regarde si c'était un clic ou pas
    //si oui, on regarde s'il y a un élément en-dessous -> ouverture de plot par exemple
    //si non, on enregistre puis on regarde s'il y a un élément en-dessous -> sélection par exemple

    var startX = event.clientX - table.node().getBoundingClientRect().left;//pas le début du tout, plutôt la fin
    var startY = event.clientY - table.node().getBoundingClientRect().top;
   

    //--------------------------------------------------------------//
    //                       Tap (on the cells)                     //
    //--------------------------------------------------------------//
    if(event.clientX-tableContainer.node().getBoundingClientRect().left>x_margin && event.clientY-tableContainer.node().getBoundingClientRect().top>y_margin){
        
        
        //--------------------------------------------------------------//
        //                   Short click (on the cells)                 //
        //--------------------------------------------------------------//
        if(event_endTime-event_startTime<200){

            d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
            d3.selectAll(".editionBubble").remove();
            //var startXcol = pixelsToColumn(pixelsToColumnScale_table,startX);
            var startXcol = pixelsToColumnScale_table(startX);
            var hoveredX = [startXcol];
            //var startYrow = pixelsToRow(pixelsToRowScale_table,startY);
            var startYrow = pixelsToRowScale_table(startY+50);
            var hoveredY = [startYrow];
            if(singleFingerPressed==false){
                //start et end pas encore utilisés
                var A = selectionLogic2D(table,hoveredX,hoveredY,startXcol,startXcol,"none");
            } else {
               
                var A = selectionLogic2D(table,hoveredX,hoveredY,startXcol,startXcol,"none");
                //singleFingerPressed=false;
                
            }
            hovering="values";
            //------------------TABLE-------------------
            updateTableValues(table,A);
                
            //------------------MINI TABLE-------------------    
            updateMiniTable(minitable,A)
            hovering=0;
            
        }
    }

    //--------------------------------------------------------------//
    //                       Tap (on the corner)                    //
    //--------------------------------------------------------------//
    if(event.clientX-tableContainer.node().getBoundingClientRect().left<=x_margin && event.clientY-tableContainer.node().getBoundingClientRect().top<=y_margin){
        //coin en haut à gauche, sélection de toute la table
        var corner =tableContainer.selectAll("#corner");
        cornerClick=true;


        if(corner.attr("state")=="unselected"){
            corner.style("fill",selectedColor).attr("state","selected");

            //-----------------ROWS-----------------
            var newselected=getVector(table.attr("unselected")).concat(getVector(table.attr("selected")));//+unselected
            var newunselected=[];
            //-----------------COLUMNS-----------------
            var newselected_columns=getVector(table.attr("unselected_columns")).concat(getVector(table.attr("selected_columns")));//+unselected
            var newunselected_columns=[];

            var A = {newselected,newunselected,newselected_columns,newunselected_columns};

            //------------------TABLE-------------------   
            updateTableRows(table,A);
            updateTableColumns(table,A);
        
            //------------------MINI TABLE-------------------   
            updateMiniTable(d3.selectAll("#miniTable"),A);

            d3.selectAll(".sc_principal,.sc_secondary").remove();

    

        } else {
            corner.style("fill",unselectedColor).attr("state","unselected");
            
            //-----------------ROWS-----------------
            var newselected=[];
            var newunselected=getVector(table.attr("selected"));
            //-----------------COLUMNS-----------------
            var newselected_columns=[];
            var newunselected_columns=getVector(table.attr("colList"));

            var A = {newselected,newunselected,newselected_columns,newunselected_columns};
        
            //------------------TABLE-------------------
            updateTableRows(table,A);
            updateTableColumns(table,A);
        
            //------------------MINI TABLE-------------------   
            updateMiniTable(d3.selectAll("#miniTable"),A);//il faut un cas particulier pour le corner où il n'y a pas de hovering horizontal ni vertical

        
        }
        cornerClick=false;
    }
    
}


function double_tap_on_table(event){
    
    //si on relève sur un ink, on fusionne en ajoutant le path au svg existant ? -> ensuite on regarde si on reconnait un geste ?
    //sinon, on regarde si c'était un clic ou pas
        //si oui, on regarde s'il y a un élément en-dessous -> ouverture de plot par exemple
        //si non, on enregistre puis on regarde s'il y a un élément en-dessous -> sélection par exemple
    
        var startX = event.clientX - table.node().getBoundingClientRect().left;
        var startY = event.clientY - table.node().getBoundingClientRect().top;
      
        //--------------------------------------------------------------//
        //                       Tap (on the cells)                     //
        //--------------------------------------------------------------//
        if(event.clientX-tableContainer.node().getBoundingClientRect().left>x_margin &&  event.clientY-tableContainer.node().getBoundingClientRect().top>y_margin){
            
            //--------------------------------------------------------------//
            //                   Short click (on the cells)                 //
            //--------------------------------------------------------------//
            if(event_endTime-event_startTime<200){
                //var startXcol = pixelsToColumn(pixelsToColumnScale_table,startX);
                var startXcol = pixelsToColumnScale_table(startX);
                var hoveredX = [startXcol];
    
                //var startYrow = pixelsToRow(pixelsToRowScale_table,startY);
                var startYrow = pixelsToRowScale_table(startY+50);
                var hoveredY = [startYrow];
                if(singleFingerPressed==false){
                    //start et end pas encore utilisés
                    var A = selectAllEqualValues(table,hoveredX,hoveredY,startXcol,startXcol,"none");
                } else {
                   
                    //var A = selectionLogic2D(table,hoveredX,hoveredY,startXcol,startXcol,"finger");
                }
                hovering="values";
                //------------------TABLE-------------------
                updateTableValues(table,A);
                    
                //------------------MINI TABLE-------------------    
                updateMiniTable(minitable,A)
                hovering=0;
            
            }
        }
       
}
    

function triple_tap_on_table(event){

    //si on relève sur un ink, on fusionne en ajoutant le path au svg existant ? -> ensuite on regarde si on reconnait un geste ?
    //sinon, on regarde si c'était un clic ou pas
        //si oui, on regarde s'il y a un élément en-dessous -> ouverture de plot par exemple
        //si non, on enregistre puis on regarde s'il y a un élément en-dessous -> sélection par exemple

    var startX = event.clientX - table.node().getBoundingClientRect().left;
    var startY = event.clientY - table.node().getBoundingClientRect().top;
    
    //--------------------------------------------------------------//
    //                       Tap (on the cells)                     //
    //--------------------------------------------------------------//
    if(event.clientX-tableContainer.node().getBoundingClientRect().left>x_margin &&  event.clientY-tableContainer.node().getBoundingClientRect().top>y_margin){
        
        //--------------------------------------------------------------//
        //                   Short click (on the cells)                 //
        //--------------------------------------------------------------//
        if(event_endTime-event_startTime<200){
            //var startXcol = pixelsToColumn(pixelsToColumnScale_table,startX);
            var startXcol = pixelsToColumnScale_table(startX);
            var hoveredX = [startXcol];

            //var startYrow = pixelsToRow(pixelsToRowScale_table,startY);
            var startYrow = pixelsToRowScale_table(startY+50);
            var hoveredY = [startYrow];
            if(singleFingerPressed==false){
                //start et end pas encore utilisés
                var A = selectAllRowsWithEqualValues(table,hoveredX,hoveredY,startXcol,startXcol,"none");
            } else {
             
                //var A = selectionLogic2D(table,hoveredX,hoveredY,startXcol,startXcol,"finger");
            }
            hovering="vertical";
            //------------------TABLE-------------------
            updateTableColumns(table,A);
            updateTableRows(table,A);
                
            //------------------MINI TABLE-------------------    
            updateMiniTable(minitable,A)
            hovering=0;
        
        }
    }
    
}
        

//si on est là c'est qu'on a commencé sur la table
function trace_on_table(event){//c'est parce qu'on est resté un certain temps qu'on a déterminé que c'était une trace et non un tap
   
    //--------------------------------------------------------------//
    //                   TRANSIENT OR PERMANENT                     //
    //--------------------------------------------------------------//
    var lastGauche = event.clientX-tableContainer.node().getBoundingClientRect().left;//où on a stop le geste par rapport à la gauche
    var lastHaut = event.clientY-tableContainer.node().getBoundingClientRect().top;//où on a stop le geste par rapport au haut

    var ink_svg = inkDrawing_to_SVG("blue");
    var width_postit=Math.abs(d3.min(inkVector.x)-d3.max(inkVector.x));
    var height_postit=Math.abs(d3.min(inkVector.y)-d3.max(inkVector.y));
 
    inkReleaser(ink_svg);
    //dorénavant, toutes les traces sont transientes SAUF celles sur un post-it
    if(ink_svg.attr("magnet")=="postitContainer"){
        inkNature(ink_svg,"permanent");
    } else {
        inkNature(ink_svg,"transient");
    }

    //var normalizedCenter=[width_ink/2+left_ink-tableContainer_left,height_ink/2+top_ink-tableContainer_top];
    
    var startY=inkVector.y[0];//pas la peine de normaliser, car il faudrait normaliser le max et le min
    //on prend la moyenne plutot que le premier point car plus représentatif de la trajectoire globale
    var localShiftYtable=get_y_transform(d3.select("#table"))
    var localShiftXtable=get_x_transform(d3.select("#table"))
    if(startY<d3.max(inkVector.y)){//on est descendu
       
        var startY = top_ink - parseFloat(d3.select("#tableContainer").style("top"));
        var startYrow = pixelsToRow(pixelsToRowScale_table,startY-y_margin-localShiftYtable);
        var endY = top_ink+height_ink - parseFloat(d3.select("#tableContainer").style("top"));
        var endYrow = pixelsToRow(pixelsToRowScale_table,endY-y_margin-localShiftYtable);//pourquoi -30
    
    }
    if(startY>d3.min(inkVector.y)){//on est monté
       
        var startY = top_ink+height_ink - parseFloat(d3.select("#tableContainer").style("top"));
        var startYrow = pixelsToRow(pixelsToRowScale_table,startY-y_margin-localShiftYtable);
        var endY = top_ink - parseFloat(d3.select("#tableContainer").style("top"));
        var endYrow = pixelsToRow(pixelsToRowScale_table,endY-y_margin-localShiftYtable);
        
    }

    var startX=inkVector.x[0];//pas la peine de normaliser, car il faudrait normaliser le max et le min
    if(startX<d3.max(inkVector.x)){//on est allé à droite
       
        var startX = left_ink - parseFloat(d3.select("#tableContainer").style("left"));
        var startXcol = pixelsToColumn(pixelsToColumnScale_table,startX-x_margin-localShiftXtable);
        var endX = left_ink+width_ink - parseFloat(d3.select("#tableContainer").style("left"));
        var endXcol = pixelsToColumn(pixelsToColumnScale_table,endX-x_margin-localShiftXtable);//pourquoi -30
    
    }
    if(startX>d3.min(inkVector.x)){//on est allé à gauche
       
        var startX = left_ink+width_ink - parseFloat(d3.select("#tableContainer").style("left"));
        var startXcol = pixelsToColumn(pixelsToColumnScale_table,startX-x_margin-localShiftXtable);
        var endX = left_ink - parseFloat(d3.select("#tableContainer").style("left"));
        var endXcol = pixelsToColumn(pixelsToColumnScale_table,endX-x_margin-localShiftXtable);
        
    }

    

    var postit = elementPicker(event);//on cherche si on a fini l'encre sur un postit
    if(postit!= null && postit.attr("class")=="postitContainer"){//si oui, le postit hérite de l'inkId de cette encre
        ink_svg.attr("postitId",postit.attr("postitId"));//));
      
        return;
    }


    //--------------------------------------------------------------//
    //                    Trace on the row names                    //
    //--------------------------------------------------------------//
    if(lastGauche>=0 && startX>=0 && startX<=x_margin && lastGauche <= x_margin && inkClassifier()=="straight line"){
        d3.selectAll(".sc_principal").remove()
        d3.selectAll(".sc_secondary").remove()
        d3.selectAll(".caret").remove()
    
        
        hovering="vertical";
        if(endYrow!=startYrow){//définis 50 lignes plus haut
            
            if(endYrow<0){endYrow=0;};
            if(endYrow>n-1){endYrow=n-1;};
        
            if(endYrow>startYrow){//on est descendu dans la table
                var hovered = range(startYrow,endYrow);
                if(singleFingerPressed==false){
                    //start et end pas encore utilisés
                    var A = selectionLogic1D(table,hovered,startYrow,endYrow,"none");
                } else {
                    var A = selectionLogic1D(table,hovered,startYrow,endYrow,"finger");
                }
            } else {//on est monté dans la table
                var hovered = range(endYrow,startYrow);  
                if(singleFingerPressed==false){
                    //start et end pas encore utilisés
                    var A = selectionLogic1D(table,hovered,endYrow,startYrow,"none");
                } else {
                    var A = selectionLogic1D(table,hovered,endYrow,startYrow,"finger");
                }                
            }
            

            
        } else {//dans le cas où on aurait fait une mini trace et sélectionné une seule ligne
            var hovered = [startYrow];
            if(singleFingerPressed==false){
                //start et end pas encore utilisés
                var A = selectionLogic1D(table,hovered,startYrow,startYrow,"none");
            } else {
                var A = selectionLogic1D(table,hovered,startYrow,startYrow,"finger");
            }
        }
        
       
        

        //------------------TABLE-------------------
        updateTableColumns(table,A);
        updateTableRows(table,A);

        //------------------MINI TABLE-------------------
        updateMiniTable(minitable,A)
        hovering=0;

    }//fin des circles sur les rowsnames

    //--------------------------------------------------------------//
    //                    Trace on the col names                    //
    //--------------------------------------------------------------//
    
    if(lastHaut>=0 && lastHaut<=y_margin && startY<=y_margin && startY>=0 && inkClassifier()=="straight line"){
        
        d3.selectAll(".sc_principal").remove()
        d3.selectAll(".sc_secondary").remove()
        d3.selectAll(".caret").remove()
       
        
        hovering="horizontal";
        if(endXcol!=startXcol){
            
            if(endXcol<0){endXcol=0;};
            if(endXcol>p-1){endXcol=p-1;};
        
            if(endXcol>startXcol){//on est descendu dans la table
                var hovered = range(startXcol,endXcol);
                if(singleFingerPressed==false){
                    var A = selectionLogic1D(table,hovered,startXcol,endXcol,"none");
                } else {
                    var A = selectionLogic1D(table,hovered,startXcol,endXcol,"finger");
                }
            } else {//on est monté dans la table
                var hovered = range(endXcol,startXcol);   
                if(singleFingerPressed==false){
                    var A = selectionLogic1D(table,hovered,endXcol,startXcol,"none");
                } else {
                    var A = selectionLogic1D(table,hovered,endXcol,startXcol,"finger");
                }               
            }
            

            
        } else {
            var hovered = [startXcol];
            if(singleFingerPressed==false){
                var A = selectionLogic1D(table,hovered,startXcol,startXcol,"none");
            } else {
                var A = selectionLogic1D(table,hovered,startXcol,startXcol,"finger");
            }   
            
        }
        
      
        //------------------TABLE-------------------
        updateTableRows(table,A);
        updateTableColumns(table,A);

        //------------------MINI TABLE-------------------
        updateMiniTable(d3.selectAll("#miniTable"),A)
        hovering=0;
        
    }//fin des circles sur les colsnames

    //--------------------------------------------------------------//
    //                      Trace on the values                     //
    //--------------------------------------------------------------//
    if(startY>y_margin && startX>x_margin && lastGauche>x_margin && lastGauche< x_margin+width_displayed && lastHaut>y_margin && lastHaut<y_margin + height_displayed){//pour différencier du tri vers le bas
    
        var subcell_selected=false
        if(endXcol!=startXcol){
            
            if(endXcol<0){endXcol=0;};
            if(endXcol>p-1){endXcol=p-1;};
        
            if(endXcol>startXcol){//on est allé à droite
                var hoveredX = range(startXcol,endXcol);
            } else {//on est allé à gauche
                var hoveredX = range(endXcol,startXcol);                  
            }
        } else {
            var hoveredX = [startXcol];
            
        }
            
        if(endYrow!=startYrow){
        
            if(endYrow<0){endYrow=0;};
            if(endYrow>n-1){endYrow=n-1;};
        
            if(endYrow>startYrow){//on est descendu dans la table
                var hoveredY = range(startYrow,endYrow);
            } else {//on est monté dans la table
                var hoveredY = range(endYrow,startYrow);                  
            }
            
        } else {
            var hoveredY = [startYrow];
            
        }
        

        if(inkClassifier()=="rectangle" && width_postit>50 && height_postit>50){
            
            elementsContainer.append("svg").attr("postitId",postitId).attr("class","postitContainer").style("position","absolute").attr("state","visible")
                                .attr("width",Math.abs(d3.min(inkVector.x)-d3.max(inkVector.x)))
                                .attr("height",Math.abs(d3.min(inkVector.y)-d3.max(inkVector.y)))
                                .style("top",d3.min(inkVector.y))
                                .style("left",d3.min(inkVector.x))
                            .append("rect").attr("class","postit")
                                .attr("x",0).attr("y",0)
                                .attr("width",Math.abs(d3.min(inkVector.x)-d3.max(inkVector.x)))
                                .attr("height",Math.abs(d3.min(inkVector.y)-d3.max(inkVector.y)));

            postitId+=1;
        } 
        if(inkClassifier()=="straight line"){
            
            if(hoveredX.length==1){//si on est resté dans une seule colonne
                /*
                var authentic_subcell=d3.selectAll(".sc_principal").filter(function(){
                    return parseInt(d3.select(this).attr("columnId"))==startXcol && parseInt(d3.select(this).attr("rowId"))<=hoveredY[hoveredY.length-1] && parseInt(d3.select(this).attr("rowId"))>=hoveredY[0];
                })
                */
                var authentic_subcell=d3.selectAll(".sc_principal").filter(function(){
                    return parseInt(d3.select(this).attr("columnId"))==startXcol && parseInt(d3.select(this).attr("rowId"))==startYrow;//update car on a plein de subcell principales mtn
                })
                if(authentic_subcell.empty()==false){
                    generalization(authentic_subcell,hoveredY[0],hoveredY[hoveredY.length-1])//recuperer seulement la premiere ?
                } else {
                    hovering="values";
                    d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
                    //start and end are not used for the moment
                    var A = selectionLogic2D(table,hoveredX,hoveredY,startXcol,endXcol,"none");
                    
                    //------------------TABLE-------------------
                    updateTableValues(table,A);//update aussi les cols et rows
        
                    //------------------MINI TABLE-------------------
                    updateMiniTable(d3.selectAll("#miniTable"),A);
                    hovering=0;
                }

            } else {

                hovering="values";
                d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
                //start and end are not used for the moment
                var A = selectionLogic2D(table,hoveredX,hoveredY,startXcol,endXcol,"none");
                
                //------------------TABLE-------------------
                updateTableValues(table,A);//update aussi les cols et rows

                //------------------MINI TABLE-------------------
                updateMiniTable(d3.selectAll("#miniTable"),A);
                hovering=0;
            }
        }
        
    }//fin de la trace sur les valeurs

    //--------------------------------------------------------------------------//
    //                  Trace from the values to the col names                  //
    //--------------------------------------------------------------------------//
   
    if(startY>y_margin && startX>x_margin && lastGauche>x_margin && lastGauche< x_margin+width_displayed && lastHaut<y_margin && lastHaut>0){
       
        var authentic_subcell=d3.selectAll(".sc_principal").filter(function(){
            return parseInt(d3.select(this).attr("columnId"))==startXcol && parseInt(d3.select(this).attr("rowId"))==startYrow;//update car on a plein de subcell principales mtn
        })
   
        if(authentic_subcell.empty()==false){
            generalization(authentic_subcell,0,n)//recuperer seulement la premiere ?
        }
    }

}








function row_drag_setup(event){

    table.select(".background").style("opacity",0);
    for(i=0;i<p;i++){
        hide(startYrow_finger,i);
    }
    
    var frontrow_width=Number(table.attr("width"));
    var frontrow_height=Number(d3.select(".cell").select("rect").attr("height"));

    var frontrow = d3.select("#elementsContainer").append("svg")
                                                .style("left",event.clientX)
                                                .style("top",event.clientY-30)
                                                .attr("width",frontrow_width)
                                                .attr("height",frontrow_height)
                                                .attr("class","frontrow").style("position","absolute");
        

    //frontrow.append("text").attr("class","frontRowcss").attr("x",0).attr("y",25).text(startYrow_finger);
    var y = Number(d3.select(".cell").select("text").attr("y"))
    //var y = TEXTROWMATRIX[startYrow_finger][0].attr("y");//la demi hauteur
    for(i=0;i<p;i++){
        var currentCell = d3.select("#r"+startYrow_finger).selectAll(".cell").filter(function(){return Number(d3.select(this).attr("columnId"))==i})
        var cellState = currentCell.attr("state");
        
        if(cellState=="selected"){var backColor = selectedColor;}//"rgb(155, 201, 253)"
        if(cellState=="unselected"){var backColor = unselectedColor;}
        if(cellState=="excluded"){var backColor = excludedColor;}
        
        var x_cell = parseFloat(get_x_transform(currentCell))
        var x_texte = x_cell + parseFloat(currentCell.select("text").attr("x"));//?
        var width_cell = parseFloat(currentCell.select("rect").attr("width"));
        var texte = currentCell.select("text").text();
        
        frontrow.append("rect")
            .attr("class","cell")
            .style("fill",backColor)
            .attr("x",x_cell)
            .attr("y",0)
            .attr("number",i)
            .attr("width",width_cell)
            .attr("height",frontrow_height)
            .style("opacity",1)
            ;
        frontrow.append("text")
            .attr("class","textcell")
            .attr("text-anchor","middle")
            .attr("x",x_texte)
            .attr("y",y)//dans le repère du ghost, qui est déjà aux bonnes coords
            .attr("number",i)
            .style("opacity",1)
            .text(texte);                        
    }

}


function row_drag(event){
    var lastX = event.clientX - tableContainer.node().getBoundingClientRect().left;
    var frontrow=d3.select(".frontrow");
    var offset_height=Number(d3.select(".cell").select("rect").attr("height"))/2;
    //Mouvement de l'objet
    frontrow.style("left",event.clientX)
            .style("top",event.clientY-30)
    if(lastX>0 && lastX<tableContainer.attr("width")){//si on est en dehors, opacité réduite
        frontrow.style("opacity",1);
    } else {
        frontrow.style("opacity",0.5);
    }

    newY_finger = event.clientY - tableContainer.node().getBoundingClientRect().top;//y margin a prendre en compte non ?
    
    if(newY_finger>startY_finger){//descente
        newYrow_finger = pixelsToRow(pixelsToRowScale_table,newY_finger-y_margin-shiftYtable-offset_height);
    }
    if(newY_finger<startY_finger){//montee
        newYrow_finger = pixelsToRow(pixelsToRowScale_table,newY_finger-y_margin-shiftYtable+offset_height);
    }
    if(newY_finger==startY_finger){//egal
        newYrow_finger = pixelsToRow(pixelsToRowScale_table,newY_finger-y_margin-shiftYtable);
    }   
  
    return lastX;
}

function row_drag_end(lastX){
    var disappearingDelay=0;
    var appearingDelay=400;
    d3.select(".frontrow").transition().duration(disappearingDelay).style("opacity",0).remove();

    if(lastX>0 && lastX<tableContainer.attr("width")){//si on est en dehors, on ne fait rien

        var frontrow_height=Number(d3.select(".cell").select("rect").attr("height"));

        var ORDER_ROWS = range(0,n-1);//doit etre reset a chaque fois puisqu'on reset les rowid
        
        //Re-ordering the row ids
        if(startYrow_finger<newYrow_finger){
            
            for(i=startYrow_finger;i<newYrow_finger;i++){
                ORDER_ROWS[i]=i+1;
            }
            ORDER_ROWS[newYrow_finger]=startYrow_finger;
        }
        if(startYrow_finger>newYrow_finger){
            
            for(i=newYrow_finger+1;i<startYrow_finger+1;i++){
                ORDER_ROWS[i]=i-1;
            }
            ORDER_ROWS[newYrow_finger]=startYrow_finger;
        }
        
        

        //changing the positions of the rows according to their new order
        var newindex=0;
      
        for(i=0;i<n;i++){
            newindex=ORDER_ROWS.indexOf(i);
            
            d3.select("#r"+i).attr("transform","translate(0,"+(newindex*frontrow_height+50)+")").attr("rowId_new",newindex).selectAll("text").attr("rowId",newindex);

        }

        table.select(".background").transition().duration(disappearingDelay+appearingDelay).style("opacity",1);
        for(i=0;i<p;i++){
            //c'est la bonne row, mais elle pop a l'ancienne
            reveal(startYrow_finger,i,disappearingDelay,appearingDelay);//les rows sont encore dans l'ancienne position donc en accédant à l'ancien index on a la row cherchée avec le nouveau rowId
        }
        
        d3.selectAll(".row").each(function(){
            d3.select(this).attr("id","r"+d3.select(this).attr("rowId_new")).attr("rowId_new",null)
        })

    } else {//sinon, on fait juste réapparaître la ligne en place
       
        table.select(".background").transition().duration(disappearingDelay+appearingDelay).style("opacity",1);
        for(i=0;i<p;i++){
            //c'est la bonne row, mais elle pop a l'ancienne
            reveal(startYrow_finger,i,disappearingDelay,appearingDelay);//les rows sont encore dans l'ancienne position donc en accédant à l'ancien index on a la row cherchée avec le nouveau rowId
        }
    }

}











function column_drag_setup(event){
    table.select(".background").style("opacity",0);
    d3.select("#h"+startXcol_finger).style("opacity",0)
    for(i=0;i<n;i++){
        hide(i,startXcol_finger);
    }
    
    var frontcolumn_height=Number(table.attr("height"));
    var frontcolumn_width=Number(d3.selectAll(".cell").filter(function(){return Number(d3.select(this).attr("columnId"))==startXcol_finger}).select("rect").attr("width"));

    var frontcolumn = d3.select("#elementsContainer").append("svg")
                                                .style("left",event.clientX-frontcolumn_width/2)
                                                .style("top",event.clientY)
                                                .attr("width",frontcolumn_width)
                                                .attr("height",frontcolumn_height)
                                                .attr("class","frontcolumn").style("position","absolute");
        
    var x = Number(d3.selectAll(".textcell").filter(function(){
                                        return Number(d3.select(this).attr("columnId"))==startXcol_finger
                                    }).attr("x"));//la demi largeur

    var width_cell = cumulatedColumnsWidths[startXcol_finger+1]-cumulatedColumnsWidths[startXcol_finger];
    //HEADER
    frontcolumn.append("rect")
            .attr("class","cell")
            .style("fill","lightgrey")
            .attr("x",0)
            .attr("y",0)
            .attr("width",width_cell)
            .attr("height",frontcolumn_height)
            .style("opacity",1)
    frontcolumn.append("text")
            .attr("class","textcell")
            .attr("text-anchor","middle")
            .attr("x",x)
            .attr("y",30)//dans le repère du ghost, qui est déjà aux bonnes coords
            .style("opacity",1)
            .text(headers_names[startXcol_finger]);  

    for(i=0;i<n;i++){
        var currentCell = d3.select("#r"+i).selectAll(".cell").filter(function(){return Number(d3.select(this).attr("columnId"))==startXcol_finger})
       
        var cellState = currentCell.attr("state");
        if(cellState=="selected"){var backColor = selectedColor;}
        if(cellState=="unselected"){var backColor = unselectedColor;}
        if(cellState=="excluded"){var backColor = excludedColor;}

        
        var y_cell = parseFloat(get_y_transform(d3.select("#r"+i)))
        var y_texte = y_cell + parseFloat(currentCell.select("text").attr("y"));
        
        
        var texte = currentCell.select("text").text();
        
        frontcolumn.append("rect")
            .attr("class","cell")
            .style("fill",backColor)
            .attr("x",0)
            .attr("y",y_cell)
            .attr("number",i)
            .attr("width",width_cell)
            .attr("height",frontcolumn_height)
            .style("opacity",1)
            ;
        frontcolumn.append("text")
            .attr("class","textcell")
            .attr("text-anchor","middle")
            .attr("x",x)
            .attr("y",y_texte)//dans le repère du ghost, qui est déjà aux bonnes coords
            .attr("number",i)
            .style("opacity",1)
            .text(texte);                        
    }

}


function column_drag(event){
    var lastY = event.clientY - tableContainer.node().getBoundingClientRect().top;
    var frontcolumn=d3.select(".frontcolumn");
    var offset_width=Number(d3.selectAll(".cell").filter(function(){return Number(d3.select(this).attr("columnId"))==startXcol_finger}).select("rect").attr("width"));
    //Mouvement de l'objet
    frontcolumn.style("left",event.clientX-offset_width/2)
            .style("top",event.clientY)
    if(lastY>0 && lastY<tableContainer.attr("height")){//si on est en dehors, opacité réduite
        frontcolumn.style("opacity",1);
    } else {
        frontcolumn.style("opacity",0.5);
    }
    newX_finger = event.clientX - tableContainer.node().getBoundingClientRect().left;//y margin a prendre en compte non ?
   
    if(newX_finger>startX_finger){//droite
        newXcol_finger = pixelsToRow(pixelsToColumnScale_table,newX_finger-x_margin-shiftXtable-50);//50 est un workaround
    }
    if(newX_finger<startX_finger){//gauche
        newXcol_finger = pixelsToRow(pixelsToColumnScale_table,newX_finger-x_margin-shiftXtable+50);
    }
    if(newX_finger==startX_finger){//egal
        newXcol_finger = pixelsToRow(pixelsToColumnScale_table,newX_finger-x_margin-shiftXtable);
    }

    return lastY;
}

function column_drag_end(lastY){

    var disappearingDelay=0;
    var appearingDelay=400;
    window.columns_reordering=true;
    d3.select(".frontcolumn").transition().duration(disappearingDelay).style("opacity",0).remove();

    if(lastY>0 && lastY<tableContainer.attr("height")){
        var frontcolumn_width=Number(d3.select(".cell").select("rect").attr("width"));

        window.ORDER_COLUMNS = range(0,p-1);//doit etre reset a chaque fois puisqu'on reset les rowid
       
        //Re-ordering the row ids
        if(startXcol_finger<newXcol_finger){
            
            for(i=startXcol_finger;i<newXcol_finger;i++){
                ORDER_COLUMNS[i]=i+1;
            }
            ORDER_COLUMNS[newXcol_finger]=startXcol_finger;
        }
        if(startXcol_finger>newXcol_finger){
            
            for(i=newXcol_finger+1;i<startXcol_finger+1;i++){//3 4 5 (5>2) 2>3 3>4 4>5
                ORDER_COLUMNS[i]=i-1;//2 en 3eme pos, 4eme et 5eme pos, 
            }
            ORDER_COLUMNS[newXcol_finger]=startXcol_finger;//5 en 2eme pos
        }
        
        

        //changing the positions of the rows according to their new order
        var newindex=0;
        var newindexvec=[];
        var newTypesOrder=range(0,p-1);
        var newNamesOrder=range(0,p-1);
        var newColumnsWidths=range(0,p-1);
        var columns_widths=[];
        
        for(i=0;i<p;i++){
            newindex=ORDER_COLUMNS.indexOf(i);
            newindexvec.push(newindex);
            newNamesOrder[newindex]=headers_names[i];
            newTypesOrder[newindex]=global_types[i];
            
            var columns_coordinates = Number(d3.select("#r0").selectAll(".cell").filter(function(){
                    return Number(d3.select(this).attr("columnId"))==i;
                }).select("rect").attr("width"))
                
            columns_widths.push(columns_coordinates)
            
        }
        window.headers_names=newNamesOrder;
        window.global_types=newTypesOrder;
        for(i=0;i<p;i++){
            newindex=ORDER_COLUMNS.indexOf(i);
            newColumnsWidths[newindex]=columns_widths[i];
        }
        window.columnsWidths=[...newColumnsWidths];
        
        var newColumnsWidths_cumulated=newColumnsWidths;
        
        for(i=1;i<p;i++){
            newColumnsWidths_cumulated[i]=newColumnsWidths[i]+newColumnsWidths_cumulated[i-1];
        }
        newColumnsWidths_cumulated.unshift(0)
        window.cumulatedColumnsWidths=newColumnsWidths_cumulated;
        
      
        d3.selectAll(".row").each(function(){
                                            d3.select(this).selectAll(".cell").each(function(){
                                                                                        var old_index = Number(d3.select(this).attr("columnId"));
                                                                                        var newindex=ORDER_COLUMNS.indexOf(old_index);
                                                                                        d3.select(this).attr("columnId",newindex).attr("id","c"+newindex)
                                                                                                        .attr("transform","translate("+newColumnsWidths_cumulated[newindex]+",0)");//faux
                                                                                        d3.select(this).select("text").attr("columnId",newindex);
                                                                                    })
                                        })
        d3.selectAll(".columnlabel").each(function(d,index){
                                            var old_index = Number(d3.select(this).attr("columnId"));
                                            var w = Number(d3.select("#r0").selectAll(".cell").filter(function(){
                                                return Number(d3.select(this).attr("columnId"))==old_index;
                                            }).select("rect").attr("width"))
                                
                                            d3.select(this).attr("columnName",columnNames[index]).text(columnNames[index]).attr("x",newColumnsWidths_cumulated[old_index]+w/2);
                                        })
        d3.selectAll(".columnCircle").each(function(d,index){
                                            var old_index = Number(d3.select(this).attr("columnId"));
                                            var currentcell = d3.select("#r0").selectAll(".cell").filter(function(){
                                                return Number(d3.select(this).attr("columnId"))==old_index;
                                            })
                                            var x = get_x_transform( currentcell )
                                            var w = Number(currentcell.select("rect").attr("width"))
                                
                                            d3.select(this).attr("x",x).attr("width",w);
                                        })
        d3.selectAll(".headerCell").each(function(d,index){
                                            var old_index = Number(d3.select(this).attr("columnId"));
                                            var currentcell = d3.select("#r0").selectAll(".cell").filter(function(){
                                                return Number(d3.select(this).attr("columnId"))==old_index;
                                            })
                                            var x = get_x_transform( currentcell )
                                            var w = Number(currentcell.select("rect").attr("width"))
                                
                                            d3.select(this).attr("transform","translate("+x+",0)").style("opacity",1);
                                            d3.select(this).select("rect").attr("width",w);
                                            d3.select(this).select("text").text(headers_names[old_index]).attr("x",w/2).attr("text-anchor","middle")
                                        })
        d3.selectAll(".tab").each(function(d,index){
                                            var old_index = Number(d3.select(this).attr("columnId"));
                                            var currentcell = d3.select("#r0").selectAll(".cell").filter(function(){
                                                return Number(d3.select(this).attr("columnId"))==old_index;
                                            })
                                            
                                            var w = Number(currentcell.select("rect").attr("width"))
                                            d3.select(this).style("left",100+shiftXtable+(cumulatedColumnsWidths[index]+ w/2-127/2)+"px");
                                        })
        d3.selectAll(".headerCell").each(function(){
            d3.select(this).attr("old_type",d3.select(this).attr("type"))
        })
        d3.selectAll(".headerCell").each(function(d,i){
            d3.select(this).attr("type",d3.select("#h"+ORDER_COLUMNS[i]).attr("old_type"))
        })
        
        d3.selectAll(".tabLogo").remove();
        var side=127;
        var languette=(window.screen.width-25)/81;//la meme languette que pour la palette
        var elementContainer=d3.select("#elementsContainer");
        var leftTableContainer=parseFloat(d3.select("#tableContainer").style("left"))
        for(j=0;j<p;j++){
            var anchor = (cumulatedColumnsWidths[j+1]-cumulatedColumnsWidths[j])/2-127/2;
            if(typeGuesser()[j]=="quantitative"){var src="pictures/ruler.svg";} else {var src="pictures/categories.svg";}
            
            elementContainer.append("img")
                    .attr("src",src)
                    .attr("id","tabLogo"+j).attr("class","tabLogo").attr("columnId",j)
                    .style("top",-languette/2+5+"px")
                    .style("left",shiftXtable+leftTableContainer+x_margin+cumulatedColumnsWidths[j]+anchor+side/2-20+"px")
                    .attr("height",20)
                    .attr("width",40)
                    .style("position","absolute")
        }


        table.select(".background").transition().duration(disappearingDelay+appearingDelay).style("opacity",1);
        for(i=0;i<n;i++){
            
            //c'est la bonne row, mais elle pop a l'ancienne
            reveal(i,ORDER_COLUMNS.indexOf(startXcol_finger),disappearingDelay,appearingDelay);//les rows sont encore dans l'ancienne position donc en accédant à l'ancien index on a la row cherchée avec le nouveau rowId
        }
        
        //au cas où il y avait des colonnes selectionnées
        var newselectedcols=[];
        var newunselectedcols=[];
        d3.select("#r0").selectAll(".cell").each(function(){
            var id=Number(d3.select(this).attr("columnId"));
            if(d3.select(this).attr("state")=="selected"){
                newselectedcols.push(id);
            } else {
                newunselectedcols.push(id);
            }
        })
        d3.select("#table").attr("selected_columns",newselectedcols).attr("unselected_columns",newunselectedcols);
       
    } else {
       
        table.select(".background").transition().duration(disappearingDelay+appearingDelay).style("opacity",1);
        d3.selectAll(".headerCell").filter(function(){
            return Number(d3.select(this).attr("columnId"))==startXcol_finger;
        }).style("opacity",1)
        for(i=0;i<n;i++){
            //c'est la bonne row, mais elle pop a l'ancienne
            reveal(i,startXcol_finger,disappearingDelay,appearingDelay);//les rows sont encore dans l'ancienne position donc en accédant à l'ancien index on a la row cherchée avec le nouveau rowId
        }
    }
}










function hide(row,col){
        var currentCell = d3.select("#r"+row).selectAll(".cell").filter(function(){
                                                                            return Number(d3.select(this).attr("columnId"))==col;
                                                                        })                                     
        currentCell.select("rect").style("opacity",0);
        currentCell.select("text").style("opacity",0);
       
}

function reveal(row,col,disappearingDelay,appearingDelay){
    var currentCell = d3.select("#r"+row).selectAll(".cell").filter(function(){
        return Number(d3.select(this).attr("columnId"))==col;
    })          
    currentCell.select("rect").transition().delay(disappearingDelay).duration(appearingDelay).style("opacity",1);
    currentCell.select("text").transition().delay(disappearingDelay).duration(appearingDelay).style("opacity",1);
    
}









function row_sort(colId,direction){
    d3.selectAll(".sc_principal,.sc_secondary,.caret").remove()
    var frontrow_height=Number(d3.select(".cell").select("rect").attr("height"));
    //on extrait le vec des valeurs
    //on trie selon la direction
    var raw_values = [];
    for(var i=0;i<n;i++){
        raw_values.push(d3.select("#r"+i).selectAll(".cell").filter(function(){
            return d3.select(this).attr("columnId")==colId
        }).select("text").text());
    }
    raw_values=num_to_num_and_str_to_str(raw_values);
    raw_values_copy=[...raw_values];
    
    
   
    var new_indexes=[]
    //Re-ordering the row ids
    if(direction=="downward"){//CROISSANT
        var sorted_values=raw_values_copy.sort(d3.ascending)
    } else {//DECROISSANT
        var sorted_values=raw_values_copy.sort(d3.descending)
    }
    for(var i=0;i<n;i++){
        var new_idx=raw_values.indexOf(sorted_values[i]);
        raw_values[new_idx]="Empty";
        new_indexes.push(new_idx);
    }
    for(var i=0;i<n;i++){
        var sorted_idx=new_indexes.indexOf(i);
        
        d3.select("#r"+i).attr("transform","translate(0,"+(50+sorted_idx*frontrow_height)+")").attr("rowId_new",sorted_idx).selectAll("text").attr("rowId",sorted_idx);

    }
    var newselected=[];
    var newunselected=[];
    d3.selectAll(".row").each(function(d,i){
        var new_tkt=Number(d3.select(this).attr("rowId_new"));
        d3.select(this).attr("id","r"+new_tkt).attr("rowId_new",null)
        if(d3.select(this).attr("state")=="selected"){
            newselected.push(new_tkt);
        } else {
            newunselected.push(new_tkt);
        }
    })
    var newrows={newselected,newunselected};
  
    hovering="vertical"
    updateMiniTable(minitable,newrows)
    hovering=0;

    d3.selectAll(".tab").remove()
    d3.selectAll(".tabLogo").remove()
    createPlotTabs()
    

}



function deselect_table(parent){
  
    var rowlist = getVector(parent.attr("rowList"));
        //rows because not handled by column selection logic UNLESS all columns are selected
    var newunselected=rowlist;
    var newselected=[];

    
    var collist = getVector(parent.attr("colList"));
        
    var newunselected_columns=collist;
    var newselected_columns=[];


    var A = {newselected,newunselected,newselected_columns,newunselected_columns}
    hovering="horizontal";//arbitraire
    //------------------MINI TABLE-------------------
    updateMiniTable(minitable,A);//tres bien fonctionné

    //------------------TABLE-------------------
    updateTableColumns(table,A);//
    updateTableRows(table,A);//updates the state of every row and the vectors in the table attributes

     //------------------CORNER-------------------
    d3.select("#corner").style("fill",unselectedColor).attr("state","unselected");
    hovering=0;

    d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
    d3.selectAll(".editionBubble").remove();
}


function update_table(parent,newselected){
  
    var rowlist = getVector(parent.attr("rowList"));
        //rows because not handled by column selection logic UNLESS all columns are selected
    var newunselected=rowlist.filter(x => !newselected.includes(x));
  
    var collist = getVector(parent.attr("colList"));
    if(newselected.length==n){
        var newselected_columns=collist;
        var newunselected_columns=[];
        d3.select("#corner").style("fill",selectedColor).attr("state","selected");
    } else {
        var newselected_columns=[];
        var newunselected_columns=collist;
        d3.select("#corner").style("fill",unselectedColor).attr("state","unselected");
    }
    
    

    var A = {newselected,newunselected,newselected_columns,newunselected_columns}
    hovering="horizontal";//arbitraire
    //------------------MINI TABLE-------------------
    updateMiniTable(minitable,A);//tres bien fonctionné

    //------------------TABLE-------------------
    updateTableColumns(table,A);//
    updateTableRows(table,A);//updates the state of every row and the vectors in the table attributes
   
    hovering=0;

}


function changeTableClippath(event){
    var newWidth=event.clientX-tableContainer_left;
    var newHeight=event.clientY-tableContainer_top;


    
    
    if(d3.select("#extended_bottom").empty()==false && d3.select("#extended_right").empty()==true){//on est arrivés en bas
        
        d3.select("#tableContainer").attr("width",newWidth);
        d3.select("#columnsHeadersContainer").attr("width",newWidth);
        d3.select("#tableClippath").attr("width",newWidth-65);

        d3.select("#extended_bottom").select("rect").attr("width",newWidth-65);
        d3.select(".bluebutton").attr("cx",(newWidth-x_margin-15)/2);

        d3.select("#expander").attr("x",newWidth-15);
        d3.select("#extend_right").attr("x",newWidth-15);
        
    }
    if(d3.select("#extended_right").empty()==false && d3.select("#extended_bottom").empty()==true){//on est arrivés à droite

        d3.select("#tableContainer").attr("height",newHeight);
        d3.select("#rowsHeadersContainer").attr("height",newHeight);
        d3.select("#tableClippath").attr("height",newHeight-45);

        d3.select("#extended_right").select("rect").attr("height",newHeight-45);
        d3.select(".bluebutton").attr("cy",(newHeight-y_margin-15)/2);

        d3.select("#expander").attr("y",newHeight-15);
        d3.select("#extend_bottom").attr("y",newHeight-15);
        
    }
    if(d3.select("#extended_bottom").empty()==true && d3.select("#extended_right").empty()==true){

        d3.select("#tableContainer").attr("width",newWidth);
        d3.select("#tableContainer").attr("height",newHeight);
    
        d3.select("#columnsHeadersContainer").attr("width",newWidth);
        d3.select("#rowsHeadersContainer").attr("height",newHeight);
    
        d3.select("#tableClippath").attr("width",newWidth-65);
        d3.select("#tableClippath").attr("height",newHeight-45);

        d3.select("#expander").attr("x",newWidth-15).attr("y",newHeight-15);
        d3.select("#extend_bottom").attr("y",newHeight-15).select("rect").attr("width",newWidth-65);
        d3.select("#extend_right").attr("x",newWidth-15).select("rect").attr("height",newHeight-45);
        d3.select("#arrowdown").attr("transform","translate("+((newWidth-x_margin)/2-15)+",0)");
        d3.select("#arrowright").attr("transform","translate(0,"+((newHeight-y_margin)/2-15)+")");
    }
    

    
}



function delete_row(id){
    var row_height = get_y_transform(d3.select("#r0"));
    
    d3.select("#r"+id).remove();

    d3.select("#rowsHeaders").selectAll("rect").filter(function(){
        return d3.select(this).attr("rowId")==n-1
    }).remove()
    d3.select("#rowsHeaders").selectAll("text").filter(function(){
        return d3.select(this).attr("rowId")==n-1
    }).remove()
    
    for(var i=id+1;i<n;i++){
   
        var y = get_y_transform(d3.select("#r"+i));
        d3.select("#r"+i).attr("transform","translate(0,"+(y-row_height)+")").attr("id","r"+(i-1))
    }

    
    var oldrowlist=getVector(d3.select("#table").attr("rowList"));
    oldrowlist.pop()
    d3.select("#table").attr("rowList",oldrowlist)

    var newselected=[];
    var newunselected=[];
    d3.selectAll(".row").each(function(){
        var string = d3.select(this).attr("id")
        var rowId = Number(string.slice(1))//on enlève "r"
        if(d3.select(this).attr("state")=="selected"){
            newselected.push(rowId);
        } else {
            newunselected.push(rowId);
        }
        d3.select(this).selectAll("text").attr("rowId",rowId)
    })
    d3.select("#table").attr("selected",newselected)
    d3.select("#table").attr("unselected",newunselected)
    
    

    window.n=n-1;

    d3.selectAll(".tab").remove()
    d3.selectAll(".tabLogo").remove()
    createPlotTabs()

    //var oldHeight = Number(d3.select("#table").attr("height"));
    d3.select("#table").attr("height",oldrowlist.length*row_height).select(".background").attr("height",oldrowlist.length*row_height)

    var oldx = get_x_transform(d3.select("#faketable2"));
    var oldy = get_y_transform(d3.select("#faketable2"));
    d3.select("#faketable2").attr("transform","translate("+oldx+","+(oldy-row_height)+")")


    var x = parseFloat(d3.select("#miniTableContainer").style("left"));
    var y = parseFloat(d3.select("#miniTableContainer").style("top"));
    d3.select("#miniTableContainer").remove();
    createMiniTable(x,y,40,150);
    initialize_global_variables();

}


function delete_column(id){
    //var row_height = get_y_transform(d3.select("#r0"));
   
    d3.selectAll("#c"+id).remove();

    d3.select("#h"+id).remove()
    
    d3.select("#columnsHeaders").selectAll("rect").filter(function(){
        return d3.select(this).attr("columnId")==p-1
    }).remove()
    d3.select("#columnsHeaders").selectAll("text").filter(function(){
        return d3.select(this).attr("columnId")==p-1
    }).remove()
   
    for(var i=id+1;i<p;i++){
        window.columnsWidths[i-1]=Number(d3.selectAll("#c"+i).select("rect").attr("width"))
        var col = d3.selectAll("#c"+i)
        col.each(function(){
            d3.select(this).attr("id","c"+(i-1)).attr("columnId",(i-1))
            d3.select(this).select("text").attr("columnId",(i-1))
        })
       
        d3.selectAll("#h"+i).attr("id","h"+(i-1)).attr("columnId",(i-1))
        
    }
    window.columnsWidths.pop()
 
    window.cumulatedColumnsWidths=[0];
    for(i=0;i<p-1;i++){
        window.cumulatedColumnsWidths.push(cumulatedColumnsWidths[i]+columnsWidths[i])
        d3.selectAll("#c"+i).each(function(){
            var oldy = get_y_transform(d3.select(this))
            d3.select(this).attr("transform","translate("+cumulatedColumnsWidths[i]+","+oldy+")")
            d3.select(this).select("rect").attr("width",columnsWidths[i]);
            d3.select(this).select("text").attr("x",columnsWidths[i]/2);
        })
        d3.select("#h"+i).each(function(){
            var oldy = get_y_transform(d3.select(this))
            d3.select(this).attr("transform","translate("+cumulatedColumnsWidths[i]+","+oldy+")")
            d3.select(this).select("rect").attr("width",columnsWidths[i])
            d3.select(this).select("text").attr("width",columnsWidths[i]/2)
        })
        d3.selectAll(".columnCircle").filter(function(){
            return d3.select(this).attr("columnId")==i
        }).attr("width",columnsWidths[i]).attr("x",cumulatedColumnsWidths[i])
        
        d3.selectAll(".columnlabel").filter(function(){
            return d3.select(this).attr("columnId")==i
        }).attr("x",cumulatedColumnsWidths[i]+columnsWidths[i]/2)
    }
    
    var oldcollist=getVector(d3.select("#table").attr("colList"));
    var index=oldcollist.indexOf(id);
    if (index > -1){oldcollist.pop()}
    d3.select("#table").attr("colList",oldcollist)

    var newselected=[];
    var newunselected=[];
    d3.select("#r0").selectAll(".cell").each(function(){
        var colId=Number(d3.select(this).attr("columnId"));
        if(d3.select(this).attr("state")=="selected"){
            newselected.push(colId)
        } else {
            newunselected.push(colId)
        }
    })
    d3.select("#table").attr("selected_columns",newselected).attr("unselected_columns",newunselected)


    d3.selectAll(".tab").remove()
    d3.selectAll(".tabLogo").remove()
    window.p=p-1;
 
    window.global_types.splice(id, 1)
    window.headers_names.splice(id, 1)
    
    createPlotTabs()
    
    
    d3.select("#table").attr("width",cumulatedColumnsWidths[cumulatedColumnsWidths.length-1]).select(".background").attr("width",cumulatedColumnsWidths[cumulatedColumnsWidths.length-1])
    d3.select("#faketable2").attr("width",cumulatedColumnsWidths[cumulatedColumnsWidths.length-1]).select(".background").attr("width",cumulatedColumnsWidths[cumulatedColumnsWidths.length-1])
    var localShiftXtable=get_x_transform(d3.select("#table"))
    var oldy = get_y_transform(d3.select("#faketable1"));
    d3.select("#faketable1").attr("transform","translate("+(cumulatedColumnsWidths[cumulatedColumnsWidths.length-1]+localShiftXtable)+","+oldy+")")

    

    var x = parseFloat(d3.select("#miniTableContainer").style("left"));
    var y = parseFloat(d3.select("#miniTableContainer").style("top"));
    d3.select("#miniTableContainer").remove();
    createMiniTable(x,y,40,150);
    initialize_global_variables();

    

}

function reset_subcells_startingpoints(){
    
    d3.selectAll(".sc_principal,.sc_secondary").each(function(){
        var oldx=Number(d3.select(this).attr("x"));
        var oldy=Number(d3.select(this).attr("y"));
        d3.select(this).attr("startx",oldx).attr("starty",oldy);
    })
}

function merge_columns(){
    var columnIds=getVector(d3.select("#table").attr("selected_columns"))
    var textContents=[];
    for(var i=0;i<n;i++){
        var newText="";
        for(const id of columnIds){
            newText = newText.concat(d3.select("#r"+i).select("#c"+id).select("text").text())
        }
        textContents.push(newText);
    }
    
    var newColId = d3.min(columnIds);
    var index = columnIds.indexOf(newColId);
    if (index > -1){columnIds.splice(index,1)}
    
    //suppression des colonnes sauf la première de la sélection
    for(var idx=0;idx<columnIds.length;idx++){
        delete_column(columnIds[idx]-idx)//dans delete_column on update les attributs de la table
    }

    var pix2=127;
    //changement des textes et recherche de la nouvelle width
    d3.selectAll(".textcell").filter(function(){
        return d3.select(this).attr("columnId")==newColId
    }).each(function(d,i){
        d3.select(this).text(textContents[i])
        if(textContents[i].length*10>pix2){
            pix2=textContents[i].length*10;
        }
    })

    //translations
    window.global_types[newColId]="qualitative";
    resize_columns(newColId,pix2)
    
}


function split_column(id){

    var firstCol=[];
    var secondCol=[];
    var thirdCol=[];
    var isThereAThirdColumn=false;
    for(var j=0;j<n;j++){
        var subcells = d3.selectAll("#sc"+j);
        var oldText = d3.select("#r"+j).select("#c"+id).select("text").text();
        firstCol.push(oldText);
        secondCol.push("");
        thirdCol.push("");
        subcells.each(function(d,i){
            
            if(i==0){firstCol[j]=d3.select(this).attr("text");}
            if(i==1){secondCol[j]=d3.select(this).attr("text");}
            if(i==2){thirdCol[j]=d3.select(this).attr("text");isThereAThirdColumn=true;}
        })
    }
    d3.selectAll(".sc_principal,.sc_secondary").remove()

    update_column(id,firstCol);
    window.p=p+1;
    create_column_after(id,secondCol);
    
    if(isThereAThirdColumn==true){
        window.p=p+1;
        create_column_after(id+1,thirdCol);
    }
    
}




function resize_columns(newColId,pix2){
    window.columnsWidths[newColId]=pix2;
    window.cumulatedColumnsWidths=[0];
    for(i=0;i<p;i++){//doit etre le nouveau p
        window.cumulatedColumnsWidths.push(cumulatedColumnsWidths[i]+columnsWidths[i])
        d3.selectAll("#c"+i).each(function(){
            var oldy = get_y_transform(d3.select(this))
            d3.select(this).attr("transform","translate("+cumulatedColumnsWidths[i]+","+oldy+")");
            d3.select(this).select("rect").attr("width",columnsWidths[i]);
            d3.select(this).select("text").attr("x",columnsWidths[i]/2);
        })
        d3.select("#h"+i).each(function(){
            var oldy = get_y_transform(d3.select(this))
            d3.select(this).attr("transform","translate("+cumulatedColumnsWidths[i]+","+oldy+")")
            d3.select(this).select("rect").attr("width",columnsWidths[i])
            d3.select(this).select("text").attr("x",columnsWidths[i]/2)
        })
        d3.selectAll(".columnCircle").filter(function(){
            return d3.select(this).attr("columnId")==i
        }).attr("width",columnsWidths[i]).attr("x",cumulatedColumnsWidths[i])
        
        d3.selectAll(".columnlabel").filter(function(){
            return d3.select(this).attr("columnId")==i
        }).attr("x",cumulatedColumnsWidths[i]+columnsWidths[i]/2)
    }

    d3.selectAll(".tab").remove()
    d3.selectAll(".tabLogo").remove()
 
    
    createPlotTabs()
    
    d3.select("#table").attr("width",cumulatedColumnsWidths[cumulatedColumnsWidths.length-1]).select(".background").attr("width",cumulatedColumnsWidths[cumulatedColumnsWidths.length-1])
    d3.select("#faketable2").attr("width",cumulatedColumnsWidths[cumulatedColumnsWidths.length-1]).select(".background").attr("width",cumulatedColumnsWidths[cumulatedColumnsWidths.length-1])
    var localShiftXtable=get_x_transform(d3.select("#table"))
    var oldy = get_y_transform(d3.select("#faketable1"));
    d3.select("#faketable1").attr("transform","translate("+(cumulatedColumnsWidths[cumulatedColumnsWidths.length-1]+localShiftXtable)+","+oldy+")")


    var x = parseFloat(d3.select("#miniTableContainer").style("left"));
    var y = parseFloat(d3.select("#miniTableContainer").style("top"));
    d3.select("#miniTableContainer").remove();
    createMiniTable(x,y,40,150);
    initialize_global_variables();
}





function update_column(id,content){
    var new_width=find_widest_string(content);
    
    for(var i=0;i<n;i++){
        d3.select("#r"+i).select("#c"+id).select("text").text(content[i])
    }
    window.global_types[id]="qualitative";//de base
    resize_columns(id,new_width)

}

function create_column_after(id,content){
    var new_width=find_widest_string(content);
    
    window.columnsWidths.splice(id+1,0,new_width).join()
    window.headers_names.splice(id+1,0,"").join()
    //on decale les ids
    window.global_types.splice(id+1,0,"qualitative")//la nouvelle colonne est quali et décale les autres
    for(var i=(p-1);i>=(id+1);i--){
        
        var col = d3.selectAll("#c"+i)
        col.each(function(){
            d3.select(this).attr("id","c"+(i+1)).attr("columnId",(i+1))
            d3.select(this).select("text").attr("columnId",(i+1))
        })
    
        d3.selectAll("#h"+i).attr("id","h"+(i+1)).attr("columnId",(i+1))

        d3.selectAll(".columnCircle").filter(function(){
            return d3.select(this).attr("columnId")==i
        }).attr("columnId",(i+1))

        d3.selectAll(".columnlabel").filter(function(){
            return d3.select(this).attr("columnId")==i
        }).attr("columnId",(i+1)).text(majAlphabet[i+1]).attr("columnName", majAlphabet[i+1]);
        
    }

    //on crée une nouvelle col avec le bon id
    var oldcollist=getVector(d3.select("#table").attr("colList"));
    d3.select("#table").attr("colList",oldcollist.concat(oldcollist.length)).attr("unselected_columns",oldcollist.concat(oldcollist.length))

    var hc = d3.select("#Headers").append("g").attr("id","h"+(id+1)).attr("class","headerCell").attr("type","qualitative");//quali de base
    hc.attr("columnId",id+1).attr("transform","translate(0,0)")
    hc.append("rect").attr("width",1).attr("height",50).style("fill","lightgrey").style("stroke","#a1a1a1").style("stroke-width",1)
    hc.append("text").text("").attr("y",50-20).attr("class","textcell").attr("text-anchor","middle").attr("x",0)
    
    d3.select("#columnsHeaders")
        .append("rect")//invisible cell behind the column label, to help the selection
        .attr("class", "columnCircle")
        .attr("x", 0)
        .attr("y",1)
        .attr("columnId", id+1)
        .attr("state","unselected")
        .attr("width", 1)
        .attr("height", y_margin);

    d3.select("#columnsHeaders").append("text")
        .attr("class", "columnlabel")
        .attr("x", 0)
        .attr("y", 20)
        .attr("columnName", majAlphabet[id+1])
        .attr("columnId", id+1)
        .attr("text-anchor", "middle")
        .text(majAlphabet[id+1]);
    
    var last=columnsWidths.length-1;
    
    d3.selectAll(".columnlabel").filter(function(){
        return Number(d3.select(this).attr("columnId"))==last;
    }).text(majAlphabet[last])

    for(var i=0;i<n;i++){//génération de n cellules vides
        var row = d3.select("#r"+i);
        var cell=row.append("g")
                .attr("class", "cell")
                .attr("id","c"+(id+1))
                .attr("columnId", id+1)
                .attr("state","unselected")
                .attr("transform","translate(0,0)");

        cell.append("rect")
                .style("fill",unselectedColor)
                .attr("width", 1)
                .attr("height", 50);


        cell.append("text")
            .attr("class","textcell")
            .attr("x", 0)
            .attr("y",50/2+5)
            .attr("text-anchor", "middle")
            .attr("rowId",i)
            .attr("columnId",id+1)
            .text("");

    }


    //update, qui contient resize
    update_column(id+1,content)

    
}

function find_widest_string(content){
    var pix2=127;
    for(var i=0;i<content.length;i++){
        if(content[i].length*10>pix2){
            pix2=content[i].length*10;
        }
    }
    return pix2;
}

function create_empty_column(id){
    var vec=[];
    for(var i=0;i<n;i++){
        vec.push("")
    }
    create_column_after(id,vec)
}




function mean_of_values(colId){
    var vec=[]
    var texts = d3.selectAll("#c"+colId).filter(function(){
                                                    return d3.select(this).attr("state")=="selected";
                                                }).selectAll("text");

    texts.each(function(){
        vec.push(d3.select(this).text())
    })
    vec=num_to_num_and_str_to_str(vec);
    var mean = d3.mean(vec);

    texts.text(mean);
}





function copy(){
    
    var rowId = endYrow_finger;
    var colId = endXcol_finger;

    var subcell = d3.selectAll("#sc"+rowId).filter(function(){
        return d3.select(this).attr("class")=="sc_principal";
    })

    if(subcell.empty()==false){
        var previousColor = subcell.style("fill");
        
        subcell.transition().duration(100).style("fill","hsla(32, 100%, 50%, 0.4)");
        subcell.transition().delay(100).duration(100).style("fill","hsla(230, 100%, 50%, 0.3)");
        window.copiedText=subcell.attr("text");
    } else {
        var cell = d3.select("#r"+rowId).select("#c"+colId);
        var previousColor = cell.select("rect").style("fill");
        cell.select("rect").transition().duration(100).style("fill","hsla(23, 100%, 70%, 1) ");
        cell.select("rect").transition().delay(100).duration(100).style("fill",previousColor);
        window.copiedText=cell.select("text").text();
    }
    
}

function paste(){
    var rowId = endYrow_finger;
    var colId = endXcol_finger;

    var subcell = d3.selectAll("#sc"+rowId).filter(function(){
        return d3.select(this).attr("class")=="sc_principal";
    }).filter(function(){
        return d3.select(this).attr("columnId")==colId;
    })

    if(subcell.empty()==false){
        replace_principalsubcells_with(copiedText)//on colle sur toutes les subcells principales
    } else {
        var cell = d3.select("#r"+rowId).select("#c"+colId);
       
        if(cell.attr("state")=="selected"){//on colle sur toutes les cellules sélectionnées
            d3.selectAll(".cell")
                    .filter(function() {
                        return d3.select(this).attr("state")=="selected";
                    })
                    .each(function(){
                        d3.select(this).select("text").text(copiedText);
                    });
        } else {//on colle juste sur cette cellule
            cell.select("text").text(copiedText)
        }

    }
    d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
    d3.selectAll(".tab,.tabLogo").remove()
    createPlotTabs()
    
}