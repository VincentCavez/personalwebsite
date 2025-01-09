

function initListeners(){
 
    var canvasHtml = d3.select("canvas").node();
    window.touchList=[];

    window.singleFingerPressed=false;

    window.pointerupTimer=null;
    window.pointerleaveDate=0;
    window.event_startTime = 0;
    window.event_endTime = 0;
    window.INTERDICTION=false;
    window.pointList=[];
    window.context=[];
    window.off=8;
    window.shiftXtable=0;
    window.shiftYtable=0;
    window.cornerClick=false;
    

    
    window.ink_timer=null;
    window.inkId=0;
    window.newInkStartTime=0;
    window.inkWaitingTimer=null;
    window.inkWaitingDelay=0;//500

    window.postitId=0;

    var inkFound=null;
    var inkMover_setup_parameters=null;
    var elementFound=null;
    var elementMover_setup_parameters=null;
    var lastXrowdrag = null;
    var lastYcoldrag = null;

    window.ink_stroke_width=1;//2

    if(device=="ipad"){
        window.u=0;
        window.drawEndTimer=0;
    }
    
    window.lockedFinger=-1;
    window.secondFinger=-1;

    window.penTapCount=0;
    window.lastTimePenWasUp=Date.now();

    window.touchTapCount=0;
    window.lastTimeTouchWasUp=Date.now();
  
    window.rubberType=null;
    window.rubber_colId=null;
    window.rubber_rowId=null;//dernieres col et row effacées
    window.rubber_time=Date.now();
    window.move_ink_timer=null;
    window.move_postit_timer=null;
    window.c=0;
    window.touchdownDate=0;

    window.copiedText=null;

    canvasHtml.onpointerdown = function(event){
        event.preventDefault();
        
        
        
        if(event.pointerType!="mouse"){
            window.hovering=0;
                        
            event_startTime = Date.now();
        
            //--------------------------------------------------------------//
            //                            TOUCH                             //
            //--------------------------------------------------------------//
            if(event.pointerType =="touch"){
                
                
                
                if(touchList.length<=2 && c==0){//safety : if the touchlist is too long, it's a bug so clear it
                    window.touchList.push(event);
                } else {
                    window.touchList=[event];//permet aussi de poser touch_on_cells lorsqu'INTERDICTION est à true à cause du over du pen ?
                }
                //console.log("touchlist ",touchList)
       
                if(touchList.length==1){
                    lockedFinger=event.pointerId;
                
                    //--------------------------------------------------------------//
                    //                    Search for the palette                    //
                    //--------------------------------------------------------------//
                    var paletteFound=palettePicker(event);
                
                    if(paletteFound!=null){
                        paletteHandler(event);
                        
                        context.push("simple_touch_on_palette");
                    }
                    if(paletteFound==null){
                        //--------------------------------------------------------------//
                        //                  Search on the Ink plane                     //
                        //--------------------------------------------------------------//
                        inkFound=inkPicker(event);

                        if(inkFound!=null){
                            //window.move_ink_timer = setTimeout(() => {  
                                context.push("simple_touch_on_ink");
                                inkMover_setup_parameters=inkMover_setup(event,inkFound);
                            //}, 50);
                        }
                        
                        if(inkFound==null){
                            
                            
                            //--------------------------------------------------------------//
                            //                Search on the Element plane                   //
                            //--------------------------------------------------------------//
                            elementFound=elementPicker(event);
                            
                            if(elementFound!=null && elementFound.attr("id")!="paletteContainer"){// && singleFingerPressed==false){ why ?
                                
                                if(context.length==0){
                                    context.push("simple_touch_on_element");//si c'est la table, simple touch on element mais il ne se passe rien
                                }
                                
                                if(elementFound.attr("id")!="tableContainer"){//minitable
                                    if(elementFound.attr("class")=="tab"){
                                        tabsHandler(event)
                                        context.pop();
                                        context.push("simple_touch_on_tab")
                                
                                    } else {
                                        
                                        elementMover_setup_parameters=elementMover_setup(event,elementFound);
                                        
                                    }
                                }
                                

                                if(elementFound.attr("id")=="tableContainer"){

                                    window.startX_finger = event.clientX - elementFound.node().getBoundingClientRect().left;
                                    window.startY_finger = event.clientY - elementFound.node().getBoundingClientRect().top;

                                    window.newX_finger=null;
                                    window.newY_finger=null;
                                    
                                    //finger on the rows
                                    
                                    if(startX_finger<x_margin && startY_finger>y_margin && INTERDICTION==false && c==0){//comme c'est vraiment la premiere fois
            
                                        context.pop();
                                        context.push("row_drag");//on affine le contexte

                                        window.startYrow_finger = pixelsToRow(pixelsToRowScale_table,startY_finger-y_margin-shiftYtable);//shiftYtable au cas où le contenu n'est pas en place
                                        
                                        row_drag_setup(event);

                                        window.newYrow_finger=null;
                                    
                                    }
                                    //finger on the columns
                                    if(startX_finger>x_margin && startY_finger<y_margin && INTERDICTION==false && c==0){
                                        
                                        context.pop();
                                        context.push("column_drag");//on affine le contexte

                                        window.startXcol_finger = pixelsToColumnScale_table(startX_finger-x_margin-shiftXtable);

                                        column_drag_setup(event);

                                        window.newXcol_finger=null;
                                        
                                    }
                                    
                                    //finger on the content
                                    if(startX_finger>x_margin && startY_finger>y_margin){//single finger on content, holding a selection
                                        
                                        if(c==1){
                                            context.pop();
                                            context.push(savedown)
                                        } else {
                                            context.pop();
                                            context.push("touch_on_cells");//on affine le contexte
                                            window.startYrow_finger = pixelsToRowScale_table(startY_finger-y_margin-shiftYtable);//shiftYtable au cas où le contenu n'est pas en place
                                            window.startXcol_finger = pixelsToColumnScale_table(startX_finger-x_margin-shiftXtable);


                                            cell_drag_setup(event)


                                            if(getVector(table.attr("selected_columns")).includes(startXcol_finger) || getVector(table.attr("selected")).includes(startYrow_finger)){
                                                window.singleFingerPressed=true;
                                            }
                                        }
                                        
                                    }

                                }
                            }
                            
                            if(elementFound==null){
                                
                                context.push("simple_touch_on_nothing");
                            }
                        }
                    }
            
                }//fin du simple touch
                //}, 50);

                if(touchList.length==2){// && timers[timers.length-1]-timers[timers.length-2]<=50){
                   
                    //--------------------------------------------------------------//
                    //                Search on the Element plane                   //
                    //--------------------------------------------------------------//
                    
                    elementFound=elementPicker(event);

                    if(elementFound!=null){
                        if(elementFound.attr("class")=="postitContainer"){
                            /*
                            if(move_ink_timer!=null){
                                clearTimeout(move_ink_timer);
                            }
                            if(move_postit_timer!=null){
                                clearTimeout(move_postit_timer);
                            }
                            */
                            context.pop()
                            context.push("double_touch_on_postit");
                            minimize_postit(elementFound)
                            
                        } 
                        

                        if(elementFound.attr("id")=="tableContainer"){
                        //--------------------------------------------------------------//
                        //                             TABLE                            //
                        //--------------------------------------------------------------//
                            tableContainer_left = parseFloat(tableContainer.style("left"));
                            tableContainer_top = parseFloat(tableContainer.style("top"));

                            window.x_first_finger=touchList[0].clientX-tableContainer_left;
                            window.y_first_finger=touchList[0].clientY-tableContainer_top;
                            window.colId_first_finger = pixelsToColumnScale_table(x_first_finger-x_margin-shiftXtable);
                            window.rowId_first_finger = pixelsToRowScale_table(y_first_finger-y_margin-shiftYtable);
                            window.x_second_finger=touchList[1].clientX-tableContainer_left;
                            window.y_second_finger=touchList[1].clientY-tableContainer_top;
                            window.colId_second_finger = pixelsToColumnScale_table(x_second_finger-x_margin-shiftXtable);
                            window.rowId_second_finger = pixelsToRowScale_table(y_second_finger-y_margin-shiftYtable);
                           
                            var selcol=getVector(d3.select("#table").attr("selected_columns"));
                            
                            if(colId_first_finger!=colId_second_finger && selcol.includes(colId_first_finger) && selcol.includes(colId_second_finger)){
                                
                                context.push("merge");
                            } else {
                                var potentialSubcell = d3.selectAll(".sc_principal,.sc_secondary").filter(function(){
                                    return d3.select(this).attr("columnId")==colId_first_finger && d3.select(this).attr("rowId")==rowId_first_finger && d3.select(this).attr("rowId")==rowId_second_finger;
                                })

                                if(colId_first_finger==colId_second_finger && potentialSubcell._groups[0].length>=2){//
                                    
                                    context.push("split");
                                    
                                } else {
                                
                                    var values_selected = d3.selectAll("#c"+colId_first_finger).filter(function(){
                                        return d3.select(this).attr("state")=="selected";
                                    })
                                    if(colId_first_finger==colId_second_finger && Math.abs(y_first_finger-y_second_finger)>100 && values_selected.empty()==false && global_types[colId_first_finger]=="quantitative"){
                                        
                                        context.push("mean_of_values")
                                    } else {
                                        if(d3.select(".frontcolumn").empty()==false){
                                            window.newXcol_finger=startXcol_finger;
                                            column_drag_end(lastYcoldrag);
                                        }
                                        if(d3.select(".frontrow").empty()==false){
                                            window.newYrow_finger=startYrow_finger;
                                            row_drag_end(lastXrowdrag);
                                        }
                                        context.pop()
                                        context.push("double_touch_on_table");
                                    
                                        event = touchList[1];//dernier en date, second doigt donc, pas la peine ?
                                        window.secondFinger = event.pointerId;
                                    
                                        tableContentMover_setup(event);
                                    }

                                    
                                }
                            }
                            
                        } else {
                            
                            //context.push("double_touch_on_element");
                        }
                    }
                    if(elementFound==null){
                        context.push("double_touch_on_nothing");
                    }
                    
                }//fin du double touch

            }//fin du touch

            
            

            //--------------------------------------------------------------//
            //                             PEN                              //
            //--------------------------------------------------------------//
            if(event.pointerType =="pen" && event.button!=5){// && event.pressure !=0){//} && touchList.length==0){//ce n'est pas la gomme, et aucun doigt n'est posé
                window.event_startTime_pen=Date.now();
                clearTimeout(pointerupTimer)
                //--------------------------------------------------------------//
                //                    Search for the palette                    //
                //--------------------------------------------------------------//
                var paletteFound=palettePicker(event);
            
                if(paletteFound!=null){
                    paletteHandler(event);
                    
                    context.push("simple_touch_on_palette");//exception
                } else {//on n'a pas clické sur la palette

                    
                    //--------------------------------------------------------------//
                    //                Search on the Element plane                   //
                    //--------------------------------------------------------------//
                    elementFound=elementPicker(event);
                    
                    //--------------------------------------------------------------//
                    //                            POSTIT                            //
                    //--------------------------------------------------------------//
                    if(elementFound!=null && elementFound.attr("class")=="postitContainer"){//le post-it passe en priorité puisque les inks n'ont pas d'action dessus, donc mode annotation ou pas c'est pareil
                        context.push("pen_on_postit");
                        window.postitStart=elementFound;
                        draw();

                    } else {//pas un post it

                        if(palette_state=="opened"){
                            context.push("annotation");
                            
                            draw();
                        }
                        if(palette_state=="closed"){
                            
                            window.subcellFound=subcellPicker(event);
                            if(subcellFound!=null){

                                context.push("pen_on_subcell");
                                draw();

                            } else {

                                if(elementFound!=null){//elementpicker choisira toujours la minitable plutot que la table, car dans le dom la minitable vient après la table
                                    
                                    //--------------------------------------------------------------//
                                    //                             TABLE                            //
                                    //--------------------------------------------------------------//
                                    if(elementFound.attr("id")=="tableContainer"){
                                        
                                        
                                        if((event.clientX-tableContainer.node().getBoundingClientRect().left>x_margin && event.clientY-tableContainer.node().getBoundingClientRect().top>y_margin) || (event.clientX-tableContainer.node().getBoundingClientRect().left<=x_margin && event.clientY-tableContainer.node().getBoundingClientRect().top<=y_margin)){
                                            context.push("pen_on_table_content");
                                        } else {
                                            context.push("pen_on_table_borders");
                                        }
                                        
                                        draw();
                                    
                                    }
                                    //--------------------------------------------------------------//
                                    //                           MINITABLE                          //
                                    //--------------------------------------------------------------//
                                    
                                    if(elementFound.attr("id")=="miniTableContainer"){
                                        
                                        context.push("pen_on_minitable")
                                        window.coming_from_scroller="no";
                                        minitable_setup(event);
                                    }//fin de la minitable
                                    

                                    //--------------------------------------------------------------//
                                    //                           MINIPLOT                           //
                                    //--------------------------------------------------------------//
                                    
                                    
                                    if(elementFound.attr("class")=="tab"){
                                        context.push("pen_on_miniplot");
                                        var offset_table=-get_x_transform(d3.select("#table"))
                                        var x = event.clientX-tableContainer.node().getBoundingClientRect().left-x_margin+offset_table
                                        window.idPlot = pixelsToColumnScale_table(x)
                                        window.currentPlot=d3.selectAll(".plotContainer")
                                                                    .filter(function(){
                                                                        return d3.select(this).attr("columnId")==idPlot;
                                                                    });
                                        miniplot_setup(event,idPlot);//handles the pointerup internally

                                    }
                                    
                                    
                                }//fin de elementfound

                                if(elementFound==null){
                                    
                                    //--------------------------------------------------------------//
                                    //                       ON THE BACKGROUND                      //
                                    //--------------------------------------------------------------//
                                    context.push("pen_on_nothing");
                                    draw();//dans pointerdown et non pointermove, c'est normal !!
                                    
            
                                }
                            }



                        }//fin de palette closed (pas une annotation)
                    }//fin de on n'a pas clické sur un postit
                }//fin de on n'a pas cliqué sur la palette
            }//fin de on n'a pas trouvé de post it
            

            
            
        


            

            //--------------------------------------------------------------//
            //                            RUBBER                            //
            //--------------------------------------------------------------//
            if(event.button == 5){
                if(d3.selectAll(".sc_principal").empty()==false){
                    context.push("rubber_on_subcell")
                } else {

                    context.push("rubber");

                    inkFound=inkPicker(event);

                    if(inkFound!=null){

                        rubberType="ink";
                    
                    } else {

                        elementFound=elementPicker(event);
                        
                        if(elementFound!=null){
                            
                            if(elementFound.attr("class")=="postitContainer"){
                                rubberType="postit";
                            } else {
                                rubberType="element";
                            }
                    
                        }
                    }
                  
                    rubber_handler(event,rubberType);
                }
                
            }
        }
          
    }

















    
    canvasHtml.onpointermove = function(event){
        event.preventDefault();
        
        if(event.pointerType!="mouse" && event.pressure != 0){
       

            //--------------------------------------------------------------//
            //                            TOUCH                             //
            //--------------------------------------------------------------//
            if(context[context.length-1]=="simple_touch_on_ink"){//  && lockedFinger==event.pointerId){
                
                inkMover(event,inkMover_setup_parameters);//à détailler
            }
        
            if(context[context.length-1]=="simple_touch_on_element" && touchList.length==1 && event.pointerType=="touch"){//  && lockedFinger==event.pointerId){//permet de break si on pose un deuxieme doigt
                if(elementFound.attr("id")!="tableContainer"){//minitable, on ne veut plus bouger la table
                    elementMover(event,elementMover_setup_parameters);
                }
                window.c=0;
            }
            if(context[context.length-1]=="touch_on_cells"){
                window.newX_finger = event.clientX - elementFound.node().getBoundingClientRect().left;
                window.newY_finger = event.clientY - elementFound.node().getBoundingClientRect().top;

                cell_drag_move(event)
            }
            
            if(context[context.length-1]=="double_touch_on_table"){
                
                    tableContentMover(event); 
            }
            if(context[context.length-1]=="merge"){
                for(i=0;i<touchList.length;i++){
                    if(event.pointerId==touchList[i].pointerId){
                        window.touchList[i]=event;
                    }
                }
                
            }

            if(context[context.length-1]=="row_drag" && event.pointerType=="touch" && INTERDICTION==false){
                
                lastXrowdrag = row_drag(event);
                window.c=0;
            }

            if(context[context.length-1]=="column_drag" && event.pointerType=="touch" && INTERDICTION==false){

                lastYcoldrag = column_drag(event);
                window.c=0;
            }
            /*
            if(context[context.length-1]=="touch_on_expander" && event.pointerType=="touch"){
                //changeTableClippath(event);
            }
            */
            //--------------------------------------------------------------//
            //                             PEN                              //
            //--------------------------------------------------------------//
            
            

            if(context[context.length-1]=="pen_on_minitable"){
                
                minitable_move(event);
            }

            if(context[context.length-1]=="pen_on_miniplot"){
                
                miniplot_move(event,currentPlot);
            }
            /*
            if(context[context.length-1]=="pen_on_nothing"){
                inkFound=inkPicker(event);

                if(inkFound!=null){
                    //inknature doit etre defini avant qu'on appelle inkhandler??
                    context.pop();
                    context.push("pen_on_ink");
                    
                }
            }
            */

            
        }
        if(context[context.length-1]=="rubber"){
            //--------------------------------------------------------------//
            //                            RUBBER                            //
            //--------------------------------------------------------------//

            if(rubberType!=null){
                rubber_handler(event,rubberType);
            } else {
                inkFound=inkPicker(event);

                if(inkFound!=null){
    
                    rubberType="ink";
                } else {
    
                    elementFound=elementPicker(event);
                    
                    if(elementFound!=null){
                        
                        rubberType="element";
                    }
                }
            }
            
            rubber_handler(event,rubberType);
        }

    }















    //canvasHtml.onpointermove=null;


    canvasHtml.onpointerup = function(event){
        //event.preventDefault();
        pointerupTimer = setTimeout(() => {  
            
            if(event.pointerType!="mouse"){
                //console.log("contexte avant up ",context)
            
                //--------------------------------------------------------------//
                //                            TOUCH                             //
                //--------------------------------------------------------------//
                if(context[context.length-1]=="simple_touch_on_ink" && lockedFinger==event.pointerId){
                   
                    inkFound=inkReleaser(inkFound);
                    touchList=[];
                    context.pop();
                }

                if(context[context.length-1]=="simple_touch_on_palette" || context[context.length-1]=="simple_touch_on_tab"){
                    touchList=[];
                    context.pop()
                }
                
                if(context[context.length-1]=="simple_touch_on_element" && event.pointerType=="touch"){
                
                    //singleFingerPressed=false;
                    if(elementFound.attr("class")=="miniPostitContainer" && Date.now()-event_startTime<200){
                        expand_postit(elementFound);
                    }
                    elementFound=elementReleaser(elementFound);//inks
                    context=[];
                    touchList=[];
                }
                

                if(context[context.length-1]=="touch_on_cells"){
                    window.shiftXtable=get_x_transform(d3.select("#table"));
                    window.shiftYtable=get_y_transform(d3.select("#table"));
                    
                    window.newX_finger = event.clientX - elementFound.node().getBoundingClientRect().left;
                    window.startXcol_finger = pixelsToColumnScale_table(startX_finger-x_margin-shiftXtable);
                    window.endXcol_finger = pixelsToColumnScale_table(newX_finger-x_margin-shiftXtable);

                    window.newY_finger = event.clientY - elementFound.node().getBoundingClientRect().top;
                    
                    window.endYrow_finger = pixelsToRowScale_table(newY_finger-y_margin-shiftYtable);

                    cell_drag_end()
                    
                    if(startXcol_finger==endXcol_finger){//si on est resté dans la meme colonne
                        if((newY_finger-startY_finger>100) || (newY_finger-startY_finger<-100)){//on a bougé de 100
                            if(newY_finger-startY_finger>100){//si on a swipe suffisamment vers le bas
                                //row_sort(startXcol_finger,"downward")
                            }
                            if(newY_finger-startY_finger<-100){//si on a swipe suffisamment vers le haut
                                //row_sort(startXcol_finger,"upward")
                            }
                        } else {
                            if(Date.now()-event_startTime<190){//short tap
                                //conditions
                                
                                if(Date.now()-lastTimeTouchWasUp<200){//il y a eu un tap récent
                                    touchTapCount+=1;
                                } else {//ça fait longtemps, c'est un nouveau tap seul
                                    touchTapCount=1;//on réinitialise
                                }
                
                
                                if(touchTapCount==2){
                                    copy();
                                }
                                
                                lastTimeTouchWasUp=Date.now();
                            }
                            if(Date.now()-event_startTime>800 && copiedText!=null){//dwell
                                
                                paste();
                            }
                        }
                    }
                    
                    touchList=[];
                    
                    elementFound=elementReleaser(elementFound);//inks
                    context.pop();
                           
                }

                if(context[context.length-1]=="row_drag" && event.pointerType=="touch" && INTERDICTION==false){

                    touchList=[];
                    row_drag_end(lastXrowdrag);
                    context.pop();
                    window.c=0;
                }

                if(context[context.length-1]=="column_drag" && event.pointerType=="touch" && INTERDICTION==false){
                   
                    touchList=[];
                    column_drag_end(lastYcoldrag);
                    context.pop();
                    window.c=0;
                }
                

                if(context[context.length-1]=="simple_touch_on_nothing"){
                    singleFingerPressed=false;
                    window.copiedText=null;
                    touchList=[];
                    context.pop();
                }
                
                if(context[context.length-1]=="double_touch_on_table"){
                    
                    if(shiftYtable  < -table_height+height_displayed){//EXTREMITE bottom 
                        extended_bottom_svg();
                    } else {//au-dessus du bottom
                        extend_bottom_svg();
                    }
                   
                    if(shiftXtable  < -table_width+width_displayed){//table_width){//EXTREMITE right
                        extended_right_svg();
                    } else {
                        extend_right_svg();
                    }
                    //touchList.pop();//pop le dernier event permettrait de revenir au doigt simple ?
                    touchList=[];
                    context.pop();
                    //singleFingerPressed=false;
                
                }
                if(context[context.length-1]=="merge"){
                    merge_columns()
                    singleFingerPressed=false;
                    touchList=[];
                    context.pop();
                }

                if(context[context.length-1]=="split"){
                    split_column(colId_first_finger)
                    singleFingerPressed=false;
                    touchList=[];
                    context.pop();
                }

                if(context[context.length-1]=="mean_of_values"){
                    //mean_of_values(colId_first_finger)
                    singleFingerPressed=false;
                    touchList=[];
                    context.pop();
                }


                if(context[context.length-1]=="double_touch_on_nothing"){
                    singleFingerPressed=false;
                    touchList=[];//?
                    context.pop();
                }
                if(context[context.length-1]=="double_touch_on_postit"){
                    singleFingerPressed=false;
                    touchList=[];//?
                    context.pop();
                }

                //--------------------------------------------------------------//
                //                             PEN                              //
                //--------------------------------------------------------------//
                var seuil=190;
                if(context[context.length-1]=="pen_on_ink"){
                    
                    event_endTime = Date.now();//le startTime est tout au début, au pointerdown
               
                    draw_end();
                    
                    //si on a assez bougé pour que ce ne soit pas considéré comme un point, on enregistre comme une nouvelle ink
                    if(event_endTime-event_startTime>seuil){
                        /*
                        if(inkClassifier()=="scratch"){//si c'est un scratch, on n'enregistre pas et on supprime l'ink en dessous
                            
                            inkFound.remove();
                            
                        } else {//sinon on enregistre
                            */
                            if(palette_state=="closed"){
                                var ink_svg = inkDrawing_to_SVG("blue");//est-ce qu'il chope bien l'ink qu'on vient de tracer et pas celle en dessous ?
                            } else {
                                var ink_svg = inkDrawing_to_SVG(stylus_color);
                            }
                            
                            inkNature(ink_svg,"permanent");
                        //}
                        
                        
                    }
                    
                    context.pop();
                    
                }
                if(context[context.length-1]=="pen_on_subcell"){
                    draw_end();
                   
                    deselectMiniPlots();
                    singleFingerPressed=false;
                    
                    event_endTime = Date.now();//le startTime est tout au début, au pointerdown
                    //--------------------------------------------------------------//
                    //                      Tap (on the subcell)                    //
                    //--------------------------------------------------------------//
                    
                    if(event_endTime-event_startTime<seuil){//endTime-startTime<100
                        //conditions
                        
                        if(Date.now()-lastTimePenWasUp<250){//il y a eu un tap récent
                            penTapCount+=1;
                        } else {//ça fait longtemps, c'est un nouveau tap seul
                            penTapCount=1;//on réinitialise
                        }

                        
                        if(penTapCount==1){
                           
                            tap_on_subcell();
                        }
                        
                        if(penTapCount==2){
                            clearTimeout(window.tap_on_subcell_timer);
                            double_tap_on_subcell();//on fait nécessairement le simple tap AVANT celui-là qui vient en plus
                            
                        }
                        if(penTapCount==3){
                            triple_tap_on_subcell();
                           
                        }
                        
                        context.pop();

                        lastTimePenWasUp=Date.now();


                    //--------------------------------------------------------------//
                    //                   Trace (FROM the subcell)                   //
                    //--------------------------------------------------------------//
                    } else {
                        if(event_endTime-event_startTime<600){
                            edition_subcell();
                           
                        } else {
                         
                            if(inkClassifier()=="subcell_line" || inkClassifier()=="subcell_circle"){
                                if(inkClassifier()=="subcell_line"){
                                    //min maj 
                                    toMin_or_toMaj()
                                } else {
                                    moveSubcells(event)
                                }
                                
                            } else {    
                                
                                trace_on_table(event);//pour l'instant c'est la meme fonction que table mais on divisera pour la lisibilité
                            }
                            
                        }
                        context.pop();
                    }
                }
                if(context[context.length-1]=="pen_on_table_content"){
                    
                    draw_end();
                  
                    deselectMiniPlots();
                    
                    event_endTime = Date.now();//le startTime est tout au début, au pointerdown
                    window.dataset = DATASET;//??
        
                    //--------------------------------------------------------------//
                    //                       Tap (on the table)                     //
                    //--------------------------------------------------------------//
                    
                    if(event_endTime-event_startTime<seuil){//endTime-startTime<100
                        //conditions
                        
                        if(Date.now()-lastTimePenWasUp<200){//il y a eu un tap récent
                            penTapCount+=1;
                        } else {//ça fait longtemps, c'est un nouveau tap seul
                            penTapCount=1;//on réinitialise
                        }
        
        
                        if(penTapCount==1){
                            tap_on_table_content(event);
                          
                        }
                        if(penTapCount==2){
                            double_tap_on_table(event);//on fait nécessairement le simple tap AVANT celui-là qui vient en plus
                            
                        }
                        if(penTapCount==3){
                            triple_tap_on_table(event);
                           
                        }
                        
                        context.pop();
        
        
                        lastTimePenWasUp=Date.now();
        
        
                    //--------------------------------------------------------------//
                    //                     Trace (on the table)                     //
                    //--------------------------------------------------------------//
                    } else {
                        if(event.clientY-tableContainer_top-y_margin<=50){//headers
                            if((inkClassifier()=="subcell_line" || inkClassifier()=="subcell_circle")){
                                subcellHeader();
                                
                                context.pop();
                            } else {
                                
                                context.pop();
                            }
                        } else {//cells
                            if((inkClassifier()=="subcell_line" || inkClassifier()=="subcell_circle")){
                                subcellHandler();
                                context.pop();
                            } else {          
                                trace_on_table(event);
                                context.pop();
                            }
                        }
                        
                    }
                }
                if(context[context.length-1]=="pen_on_table_borders"){
                          
                    draw_end();
                  
                    deselectMiniPlots();
                    
                    event_endTime = Date.now();//le startTime est tout au début, au pointerdown
                  
                    
                    //--------------------------------------------------------------//
                    //                       Tap (on the table)                     //
                    //--------------------------------------------------------------//
                    if(event_endTime-event_startTime_pen<seuil){//endTime-startTime<100
                        //conditions
                        
                        penTapCount=1;//?
                   
                        tap_on_table_borders(event);
                            
                    //--------------------------------------------------------------//
                    //                     Trace (on the table)                     //
                    //--------------------------------------------------------------//
                    } else {
                                
                        trace_on_table(event);//a changer ?
                            
                    }
                    context.pop();
                        
        
                }
            
            

                if(context[context.length-1]=="pen_on_postit"){//depuis le postit vers la table
                    
                    draw_end();
                    
                        if(palette_state=="closed"){ 
                            var ink_svg = inkDrawing_to_SVG("blue");//est-ce qu'il chope bien l'ink qu'on vient de tracer et pas celle en dessous ?
                        } else {
                            var ink_svg = inkDrawing_to_SVG(stylus_color);
                        }
                        inkNature(ink_svg,"permanent");//ici on définit les id

                        var is_it_a_table = elementPicker(event);//on cherche si on a fini l'encre sur un postit ou sur la table, auquel cas l'encre serait un LIEN
                       
                        if(is_it_a_table.attr("id")=="tableContainer"){//
                            
                            ink_svg.attr("magnet","tableContainer").attr("postitId",postitStart.attr("postitId"));//
                           
                        }
                        if(is_it_a_table.attr("class")=="postitContainer"){//on a écrit sur le postit

                            ink_svg.attr("postitId",is_it_a_table.attr("postitId")).attr("magnet","postitContainer");//premièrement l'encre hérite du postitId
                           
                        }
                    
                    context.pop();
                }
                if(context[context.length-1]=="annotation"){
                    
                    draw_end();
                   
                        var ink_svg = inkDrawing_to_SVG(stylus_color);
                        inkNature(ink_svg,"permanent");//ici on définit les id
                        event_endTime = Date.now();//le startTime est tout au début, au pointerdown
                    
                    
                    context.pop();
                }


                if(context[context.length-1]=="pen_on_minitable"){
                    
                    minitable_end(event);
                    context.pop();
                    touchList=[]
                    window.INTERDICTION=false;
                }

                if(context[context.length-1]=="pen_on_miniplot"){
                
                    miniplot_end(currentPlot);
                    context.pop();
                }

                if(context[context.length-1]=="pen_on_nothing"){

                    draw_end();
                    
                    event_endTime = Date.now();//le startTime est tout au début, au pointerdow
              
                    
                    window.singleFingerPressed=false;
                    touchList=[];
                   
                        
                    if(event_endTime-event_startTime<200){//endTime-startTime<100
                        deselect_table(table);  
                        deselectMiniPlots();  
                        d3.selectAll(".frontrow,.frontcolumn").remove();//mauvaise idée
                        
                    }else {
                        /*
                        if(inkClassifier()=="rectangle"){//postit ???????????
                                    
                            
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
                                                            
                        } else {
                            */
                            if(palette_state=="closed"){ 
                                var ink_svg = inkDrawing_to_SVG("blue");//est-ce qu'il chope bien l'ink qu'on vient de tracer et pas celle en dessous ?
                                inkNature(ink_svg,"transient");//ici on définit les id
                            } else {
                                var ink_svg = inkDrawing_to_SVG(stylus_color);
                                inkNature(ink_svg,"permanent");//ici on définit les id
                            }
                            
                        //}
                       
                       
                    }
                    context.pop();
                    
                }

                if(context[context.length-1]=="rubber"){
                    rubberType=null;
                    //rubber_time=null;
                    rubber_colId=null;
                    rubber_rowId=null;
                    context.pop();
                }
                if(context[context.length-1]=="rubber_on_subcell"){
                    deleteSubcells()
                    context.pop();
                }

            
            
            }//fin de 
            //setTimeout(() => {  console.log("contexte après up ",context)}, 0);//18ms minimum

           
        }, 50);//18ms minimum

        
    
    }







    canvasHtml.onpointerover = function(event){
        
        event.preventDefault();
        if(event.pointerType=="pen" && (context[0]=="row_drag" || context[0]=="column_drag")){
            window.INTERDICTION=true;
            window.lockedFinger=-1;
            window.c=1;
            if(context.length>0){
                window.savedown=context[0];
            }
         
        }
    }

    canvasHtml.onpointerenter = function(event){
        event.preventDefault();
    }
    
    
    canvasHtml.onpointerout = function(event){
        event.preventDefault();
        if(event.pointerType=="pen"){
            window.INTERDICTION=false;
        }
    }
   
    canvasHtml.onpointerleave = function(event){
        event.preventDefault();
        
    }


}//fin de la fonction initListeners
