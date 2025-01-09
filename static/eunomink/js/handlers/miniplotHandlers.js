function miniplot_setup(event,startX){
    hovering="vertical";
    d3.selectAll(".sc_principal").remove();
    d3.selectAll(".sc_secondary").remove();
    d3.selectAll(".caret").remove();
    var id=startX;
    
    var thisPlotContainer=d3.selectAll(".plotContainer")
                            .filter(function(){
                                return d3.select(this).attr("columnId")==id;
                            });
   

    if(event.pointerType=="touch"){

        //----------------------------------OUVERTURE DE PLOT----------------------------------//
        if(thisPlotContainer.empty()==true){//il n'y a pas encore de plot ici, on le crée
                        
           
            
            
            if(typeGuesser()[id]==="quantitative"){
                createMiniBoxPlot(id);
            } else {
                createMiniBarChart(id);
            }
        
            window.miniplotsContainers = d3.selectAll(".plotContainer");

        //----------------------------------FERMETURE DE PLOT----------------------------------//
        } else {
            thisPlotContainer.style("opacity",1)
        }
        hovering=0;
    } else {
        window.clic_on_plot_start=Date.now();
        if(typeGuesser()[id]=="quantitative"){//BOXPLOT
            boxplot_setup(event,thisPlotContainer);
        } else {//BARCHART
            barchart_setup(event,thisPlotContainer);
        }
    }
}


function boxplot_setup(event,thisPlotContainer){
    var decalage_top=10;//15 c'est l'offset du plot par rapport a la tab et donc plotcontainer
    var padding=10;
    var height=127;
    window.direction="none";
    window.plotYstart = event.clientY - decalage_top;
    window.plotXstart = event.clientX - thisPlotContainer.node().getBoundingClientRect().left;
    window.newY = plotYstart;
    var plot = thisPlotContainer.select(".plot");
    var left_scrollbar=58.5;
    var right_scrollbar=left_scrollbar+10;

    if(plotYstart>decalage_top){
        //HOVERING
        d3.select("#movingLegend").remove()
        d3.select("#hoveringRectangle").remove()
        if(plotXstart<left_scrollbar || plotXstart>right_scrollbar){
            window.startBoxPlot="hovering";
           
            //MOVING LEGEND
            var pixelsToAxis = d3.scaleLinear()
                                .domain([0,height-2*padding])//pixels, 0 à 107
                                .range([Number(plot.attr("maxval")),Number(plot.attr("minval"))]);//row
            newYAxis=pixelsToAxis(plotYstart-padding);//0 pix = max value
            var axisList = getVector(plot.attr("values"))
            var diff=Math.abs(newYAxis-axisList[0])
            var idx=0;
            for(i=1;i<axisList.length;i++){
                var newdiff=Math.abs(newYAxis-axisList[i])
                if(newdiff<=diff){
                    diff=newdiff;
                    idx=i;
                }
            }

            if(plotXstart<left_scrollbar){//density plot
                if(plot.attr("side")=="box"){
                    plot.selectAll("path").attr("class","densityArea");//au cas où ça serait disabled a cause d'une precedente selection sur le boxplot
                    deselectThisMiniPlot(plot);
                }
                plot.attr("side","density");
                plot.selectAll("line").attr("class","disabled");
                
                window.plotHoveringRect = plot.append("rect").attr("id", "hoveringRectangle").attr("x",padding/2).attr("width",127/2-padding);
                window.plotHoveringtext = plot.append("text").attr("class","miniBoxplotLegend").text(axisList[idx]).attr("y",plotYstart).attr("x",10).attr("id","movingLegend")
            }
            if(plotXstart>right_scrollbar){//box plot
                if(plot.attr("side")=="density"){
                    plot.selectAll("line").attr("class","boxplotLine");//au cas où ça serait disabled a cause d'une precedente selection sur le densityplot
                    deselectThisMiniPlot(plot)
                }
                if(plotYstart<117){
                    plot.attr("side","box");
                    plot.select("path").attr("class","disabled");
                }
                
                window.plotHoveringRect = plot.append("rect").attr("id", "hoveringRectangle").attr("x",right_scrollbar).attr("width",127/2-padding);
                window.plotHoveringtext = plot.append("text").attr("class","miniBoxplotLegend").text(axisList[idx]).attr("y",plotYstart).attr("x",right_scrollbar).attr("id","movingLegend")
            }
        //SCROLLING
        } else {
            
            window.startBoxPlot="scrolling";

            
            //MOVING LEGEND
            var pixelsToAxis = d3.scaleLinear()
                                .domain([0,height-2*padding])//pixels, 0 à 107
                                .range([Number(plot.attr("maxval")),Number(plot.attr("minval"))]);//row
            newYAxis=pixelsToAxis(plotYstart-padding);//0 pix = max value
            var axisList = getVector(plot.attr("values"))
            var diff=Math.abs(newYAxis-axisList[0])
            var idx=0;
            for(i=1;i<axisList.length;i++){
                var newdiff=Math.abs(newYAxis-axisList[i])
                if(newdiff<=diff){
                    diff=newdiff;
                    idx=i;
                }
            }
            window.plotHoveringRect = plot.append("rect").attr("id", "hoveringRectangle").attr("x",5).attr("width",127-padding).attr("y",plotYstart).attr("height",1).style("fill","grey");
            window.plotHoveringtext = plot.append("text").attr("class","miniBoxplotLegend").text(axisList[idx]).attr("y",plotYstart-10).attr("x",left_scrollbar).attr("id","movingLegend")
           
        }
    }
}

function barchart_setup(event,thisPlotContainer){
    window.direction="none";
    var decalage_top=10;//15 c'est l'offset du plot par rapport a la tab et donc plotcontainer
    window.plotYstart = event.clientY - decalage_top;
    window.plotXstart = event.clientX - thisPlotContainer.node().getBoundingClientRect().left;
    window.newY = plotYstart;
    var plot = thisPlotContainer.select(".plot");
    window.pixels_to_barplot=d3.scaleQuantize()//table, must be offseted
                                    .domain([10,117])//de 10 à 117,moyen en hard
                                    .range(getVector(plot.attr("barnums")));
    var thisBar = plot.selectAll("#bar").filter(function(){
        return Number(d3.select(this).attr("barId"))==pixels_to_barplot(plotYstart);
    })
    if(cumulatedColumnsWidths[Number(plot.attr("columnId"))+1]-cumulatedColumnsWidths[Number(plot.attr("columnId"))]==127){
        var barText=thisBar.attr("modality");
    } else {
        var cap = 12;
        if(d3.min([thisBar.attr("modality").length,cap])==cap){
            var barText=thisBar.attr("modality").slice(0,cap)+" ..."
        } else {
            var barText=thisBar.attr("modality")
        }
    }
    
    if(plotYstart>decalage_top){
    //HOVERING
        if(thisPlotContainer.select(".plot").selectAll(".scroller").empty()==true || plotXstart<112){
            window.startBarPlot="hovering";
            d3.select(".barAreaZoomed").remove()
            d3.select("#movingLegend").remove()
            window.plotHoveringRect = plot.append("rect").attr("id", "hoveringRectangle").attr("x",10-2);
            
            if(plot.select(".scroller").empty()==false){
                window.plotHoveringtext = plot.append("text").attr("class","miniBoxplotLegend").text(barText).attr("y",plotYstart-10).attr("x",10).attr("id","movingLegend")
                plotHoveringRect.attr("width",127-3*10+4);
            }else{
                plotHoveringRect.attr("width",127-2*10+4);
            }
        //SCROLLING
        } else {
            d3.select("#movingLegend").remove()
            window.startBarPlot="scrolling";
            if(d3.select("#hoveringRectangle").empty()==false){plotHoveringRect.remove();}
            window.barWidth=Number(plot.select("#bar").attr("width"));
            

            plot.append("rect").attr("x",10).attr("y",plotYstart-15).attr("width",Number(thisBar.attr("width"))+2).attr("height",20).attr("class","barAreaZoomed")
            plot.append("text").attr("class","miniBoxplotLegend").text(barText).attr("y",plotYstart).attr("x",10).attr("id","movingLegend")
            
        }
    }
}



function miniplot_move(event,thisPlotContainer){
    if(typeGuesser()[idPlot]=="quantitative"){//BOXPLOT
        boxplot_move(event,thisPlotContainer);
    } else {//BARCHART
        barchart_move(event,thisPlotContainer);
    }
}



function boxplot_move(event,thisPlotContainer){
    var decalage_top=10;//pas le padding, l'offset de la tab grossomodo
    window.newY = event.clientY - decalage_top;
    window.newX = event.clientX - thisPlotContainer.node().getBoundingClientRect().left;
    var plot=thisPlotContainer.select(".plot");
    var left_scrollbar=58.5;
    var right_scrollbar=left_scrollbar+10;
    var height=127;
    var padding=10;//a cause des legendes
    
    if(newY>10 && newY<117 ){//a l'intérieur du plot
       

        if(newX<left_scrollbar || newX>right_scrollbar){//HOVERING
            if(startBoxPlot=="scrolling"){
                boxplot_setup(event,thisPlotContainer)
            }
            
            if(newY>plotYstart){//on est parti vers le bas
                plotHoveringRect.attr("y",plotYstart).attr("height", newY-plotYstart);                       
            } else {//on change le start
                plotHoveringRect.attr("y",newY).attr("height", plotYstart-newY);                  
            }
            //MOVING LEGEND
            var pixelsToAxis = d3.scaleLinear()
                                .domain([0,height-2*padding])//pixels, 0 à 107
                                .range([Number(plot.attr("maxval")),Number(plot.attr("minval"))]);//row
            newYAxis=pixelsToAxis(newY-padding);//0 pix = max value
            var axisList = getVector(plot.attr("values"))
            var diff=Math.abs(newYAxis-axisList[0])
            var idx=0;
            for(i=1;i<axisList.length;i++){
                var newdiff=Math.abs(newYAxis-axisList[i])
                if(newdiff<=diff){
                    diff=newdiff;
                    idx=i;
                }
            }
            d3.select("#movingLegend").text(axisList[idx]).attr("y",newY)
            


        } else {
            if(startBoxPlot!="scrolling"){
                boxplot_setup(event,thisPlotContainer)
            }
           //MOVING LEGEND
           var pixelsToAxis = d3.scaleLinear()
                                .domain([0,height-2*padding])//pixels, 0 à 107
                                .range([Number(plot.attr("maxval")),Number(plot.attr("minval"))]);//row
            newYAxis=pixelsToAxis(newY-padding);//0 pix = max value
       
            var axisList = getVector(plot.attr("values"))
            var diff=Math.abs(newYAxis-axisList[0])
            var idx=0;
            for(i=1;i<axisList.length;i++){
                var newdiff=Math.abs(newYAxis-axisList[i])
                if(newdiff<=diff){
                    diff=newdiff;
                    idx=i;
                    }
                }
            d3.select("#movingLegend").text(axisList[idx]).attr("y",newY-10)
            plotHoveringRect.attr("y",newY)
            
        }
    }
    
    
}

function barchart_move(event,thisPlotContainer){
    var decalage_top=10;
    window.newY = event.clientY - decalage_top;
    window.newX = event.clientX - thisPlotContainer.node().getBoundingClientRect().left;
    
    var plot=thisPlotContainer.select(".plot");
    var thisBar = plot.selectAll("#bar").filter(function(){
        return Number(d3.select(this).attr("barId"))==pixels_to_barplot(newY);
    })
    if(cumulatedColumnsWidths[Number(plot.attr("columnId"))+1]-cumulatedColumnsWidths[Number(plot.attr("columnId"))]==127){
        var barText=thisBar.attr("modality");
    } else {
        var cap=12;
        if(d3.min([thisBar.attr("modality").length,cap])==cap){
            var barText=thisBar.attr("modality").slice(0,cap)+" ..."
        } else {
            var barText=thisBar.attr("modality")
        }
    }

    if(plotYstart>decalage_top){
        if(plot.selectAll(".scroller").empty()==true || newX<112){//HOVERING
            if(startBarPlot=="scrolling"){
                barchart_setup(event,thisPlotContainer)
            }
            

            if(newY>plotYstart){//on est parti vers le bas
                plotHoveringRect.attr("y",plotYstart).attr("height", newY-plotYstart);                       
            } else {//on change le start
                plotHoveringRect.attr("y",newY).attr("height", plotYstart-newY);                  
            }
            if(plot.selectAll(".scroller").empty()==false){
                d3.select("#movingLegend").text(barText).attr("y",newY)
            }
            
        } else {
            if(startBarPlot=="hovering"){
                barchart_setup(event,thisPlotContainer)
            }
            if(newY>plotYstart){var y = d3.min([127-10,newY]);} else {var y = d3.max([10,newY]);}
            
            
            d3.select(".barAreaZoomed").attr("y",y).attr("width",Number(thisBar.attr("width"))+2)
            d3.select("#movingLegend").text(barText).attr("y",y+15)
        }
    }
    
    
}




function miniplot_end(thisPlotContainer){
    window.clic_on_plot_time=Date.now()-clic_on_plot_start;
    if(clic_on_plot_time<150){//clic
        window.newX=plotXstart;
        window.newY=plotYstart;
    }
    if(typeGuesser()[idPlot]=="quantitative"){//BOXPLOT
        boxplot_end(thisPlotContainer);
    } else {//BARCHART
        barchart_end(thisPlotContainer);
    }
}



function boxplot_end(thisPlotContainer){

    var id = parseInt(thisPlotContainer.attr("columnId"));
    var left_scrollbar=58.5;
    var right_scrollbar=left_scrollbar+10;
    var plot = thisPlotContainer.select(".plot");
    var self_side=plot.attr("side");
    var height=127;
    var padding=10;//a cause des legendes
    var decalage_top=10;

    var pixelsToAxis = d3.scaleLinear()
                                .domain([0,height-2*padding])//pixels, 0 à 107
                                .range([Number(plot.attr("maxval")),Number(plot.attr("minval"))]);//row
            
    var endY = newY;
    
    startYAxis=pixelsToAxis(plotYstart-padding);//0 pix = max value
    endYAxis=pixelsToAxis(endY-padding);//117 pix = min value
    
    var axis_hovered = [];
    var axisList = getVector(plot.attr("values"));


    if(plotYstart>decalage_top){
        plotHoveringRect.remove();
        d3.select("#movingLegend").remove()

        
        
        if((newX<left_scrollbar || newX>right_scrollbar) || (plotYstart>117)){//HOVERING
               

            if(endYAxis!=startYAxis){//ce n'était pas un simple clic
                
                if(startYAxis>endYAxis){//on est descendu dans la table, car l'axe va de bas en haut
                    //il faut inverser les indices de start et end car on est allé dans le sens contraire de densityAxis
                    for(i=0;i<axisList.length;i++){
                        if(axisList[i]<=startYAxis){
                            var end_id = i;
                        }
                    }
                    for(i=axisList.length-1;i>=0;i--){
                        if(axisList[i]>=endYAxis){
                            var start_id = i;  
                        }
                    }
                    
                    axis_hovered=axisList.slice(start_id,end_id+1);

                } else {//on est monté dans la table
                    for(i=0;i<axisList.length;i++){
                        if(axisList[i]<=endYAxis){
                            var end_id = i;
                        }
                    }
                    for(i=axisList.length-1;i>=0;i--){
                        if(axisList[i]>=startYAxis){
                            var start_id = i;  
                        }
                    }
                    axis_hovered=axisList.slice(start_id,end_id+1);
                
                            
                }
                
            } else {//clic
               
                if(self_side=="none" || self_side==null || (plotYstart>117)){
                    self_side="density"//arbitraire
                }
               
                var diff=Math.abs(startYAxis-axisList[0])
                var idx=0;
                for(i=1;i<axisList.length;i++){
                    var newdiff=Math.abs(startYAxis-axisList[i])
                    
                    if(newdiff<=diff){
                        diff=newdiff;
                        idx=i;
                    }
                }
                axis_hovered=[axisList[idx]];
               
            }

            var diff_start=Math.abs(startYAxis-axisList[0])
            var diff_end=Math.abs(endYAxis-axisList[0])
            var idx_start=0;
            var idx_end=0;
            for(i=1;i<axisList.length;i++){
                var newdiff_start=Math.abs(startYAxis-axisList[i])
                var newdiff_end=Math.abs(endYAxis-axisList[i])
                if(newdiff_start<=diff_start){
                    diff_start=newdiff_start
                    idx_start=i;
                }
                if(newdiff_end<=diff_end){
                    diff_end=newdiff_end
                    idx_end=i;
                }
            }
            
                
            if(self_side=="density"){  
                var A=selectionLogicOnMiniDensityplot(plot,axis_hovered,axisList[idx_start],axisList[idx_end]);
            }
            if(self_side=="box"){
                var full_values = getVector(plot.attr("full_values"))
                //Set minimum value
                var minval = d3.min(full_values);
                //Set Quartile1
                var q1 = d3.quantile(full_values,0.25); 
                //Set Median
                var q2 = d3.quantile(full_values,0.5);
                //Set Quartile3
                var q3 = d3.quantile(full_values,0.75);
                //Set maximum value
                var maxval = d3.max(full_values);
                var quartiles = [[minval] ,
                        getUniqueValues(full_values.filter(x => x > minval && x < q1) ) ,
                        [q1] ,
                        getUniqueValues(full_values.filter(x => x > q1 && x < q2) ) ,
                        [q2] ,
                        getUniqueValues(full_values.filter(x => x > q2 && x < q3) ) ,
                        [q3] ,
                        getUniqueValues(full_values.filter(x => x > q3 && x < maxval) ) ,
                        [maxval] ] 
                    ;
                var A=selectionLogicOnMiniBoxplot(plot,quartiles,axisList[idx_start],axisList[idx_end]);
            }
            //ce qui ne va pas c'est cette fonction lors de l'update : elle inverse sel et unsel ?
        
            if(A.values_newselected.length==0){
                self_side=null;
            }

            
            var densityVectors = densityVectors_extractor(axisList,id);
            updateExtremasMiniBoxPlot(plot,A);
            updateMiniBoxPlot(plot,A,densityVectors,self_side);//on update mais seulement le brush, on ne régénère pas le plot

            updateTableFromMiniplots()
            updateMiniTableFromMiniplots()

            


        } else {//on voulait juste explorer, pas de side si pas de selection
            if(getVector(plot.attr("values_selected")).length==0){//AUCUNE VALEUR
                plot.selectAll("line").attr("class","boxplotLine");
                plot.selectAll("path").attr("class","densityArea");
                plot.attr("side","none")
            }
            

        }
    } else {
        
        if(newX>90){//NA
            if(plot.attr("select_NAs")=="false"){
                plot.attr("select_NAs","true")
            } else {
                plot.attr("select_NAs","false")
            }
          
            updateMiniPlotNAs(plot)

            updateTableFromMiniplots()
            updateMiniTableFromMiniplots()
        }
        if(newX>127/2-15 && newX<127/2+15){//NA
           
            self_side="density"//arbitraire



            var A=selectionLogicOnMiniDensityplot(plot,[axisList[axisList.length-1]],axisList[axisList.length-1],axisList[axisList.length-1]);

            var densityVectors = densityVectors_extractor(axisList,id);
            updateExtremasMiniBoxPlot(plot,A);
            updateMiniBoxPlot(plot,A,densityVectors,self_side);//on update mais seulement le brush, on ne régénère pas le plot

            updateTableFromMiniplots()
            updateMiniTableFromMiniplots()
            
        }
    }
        
    
}


function barchart_end(thisPlotContainer){
    d3.select(".barAreaZoomed").remove()
    d3.select("#movingLegend").remove()
    var plot = thisPlotContainer.select(".plot");
    var decalage_top=10;
    if(plotYstart>decalage_top){
        if(thisPlotContainer.select(".plot").selectAll(".scroller").empty()==true || newX<112){//HOVERING
                
            plotHoveringRect.remove();
            var startBar=pixels_to_barplot(plotYstart);
            var endBar=pixels_to_barplot(newY);
           
          
            var res = selectionLogicOnMiniBarChart(plot,startBar,endBar);
            
            
            updateMiniBarChart(plot,res.axis_newselected,res.axis_newunselected)

            updateTableFromMiniplots()
            updateMiniTableFromMiniplots()

            //---------------------------------------------------------------------------------------------//
            //----------------------------------------- INFERNO -------------------------------------------//
            //---------------------------------------------------------------------------------------------//
            /*
            var new_selected=[]
            d3.selectAll("#bar").filter(function(){
                return res.axis_newselected.includes(Number(d3.select(this).attr("barId")))
            }).each(function(){
                new_selected=new_selected.concat(getVector(d3.select(this).attr("rowsVector")));
            })
            */


        } else {//FIN DU SCROLLING
            
        }
    } else {
        
        if(newX>3/4*127){//NA
            if(plot.attr("select_NAs")=="false"){
                plot.attr("select_NAs","true")
            } else {
                plot.attr("select_NAs","false")
            }
          
            updateMiniPlotNAs(plot)

            updateTableFromMiniplots()
            updateMiniTableFromMiniplots()
        }
    }
        
    
}











function updateTableFromMiniplots(){
    var Intersection=[];
    d3.selectAll(".plot").filter(function(){
        return getVector(d3.select(this).attr("selected")).length>0
    }).each(function(){
        var tempVec=getVector(d3.select(this).attr("selected"));

        if(Intersection.length==0){
            Intersection=tempVec;
        } else {
            
            Intersection = Intersection.filter(x => tempVec.includes(x));
              
        }
    })
    
    if(Intersection.length>0){
        update_table(table,Intersection);
    } else {
        deselect_table(table);
    }
}


function updateMiniTableFromMiniplots(){
    var rtp = rowToPixelsScale;

    var table = d3.select("#table")
    var minitable = d3.select("#miniTable")

    var newselected=getVector(table.attr("selected"));
    var newunselected=getVector(table.attr("unselected"));
    var newselected_columns=getVector(table.attr("selected_columns"));
    var newunselected_columns=getVector(table.attr("unselected_columns"));

    minitable.attr("selected",newselected);
    minitable.attr("unselected",newunselected);

    minitable.attr("selected_columns",newselected_columns);
    minitable.attr("unselected_columns",newunselected_columns);
    
    var newselectedpix=[];
    for(i=0;i<newselected.length;i++){
        newselectedpix.push(rtp(newselected[i]));
        }
    
    var newunselectedpix=[];
    for(i=0;i<newunselected.length;i++){
        newunselectedpix.push(rtp(newunselected[i]));
        }

    

    minitable.selectAll(".miniRow").remove();
    minitable.selectAll(".miniCol").remove();
    minitable.selectAll(".miniZone").remove();
    
    minitable.selectAll(".miniRow").data(newselectedpix)
                .enter()
                .append("rect").attr("class", "miniRow")
                .attr("x",0)
                .attr("y",d => d)
                .attr("width", minitable.attr("width"))
                .attr("height", minitable.attr("step_row"))
                .attr("state","selected")
                .style("fill",selectedColor);
    
    minitable.selectAll(".miniRow")
                .filter(function(){
                return d3.select(this).attr("state")=="unselected";
                })
                .data(newunselectedpix)
                .enter()
                .append("rect").attr("class", "miniRow")
                .attr("x",0)
                .attr("y",d => d)
                .attr("width", minitable.attr("width"))
                .attr("height", minitable.attr("step_row"))
                .attr("state","unselected")
                .style("fill",unselectedColor);
    
}




//miniboxplot
function updateMiniBoxPlot(miniboxplot,newaxis,densityVectors,side){//updates miniboxplot ATTRIBUTES and PIXELS based on the new vectors
    
    miniboxplot.attr("values_selected",newaxis.values_newselected);
    miniboxplot.attr("values_unselected",newaxis.values_newunselected);
    var total = getVector(miniboxplot.attr("values"));
    var padding = 10;
    var width = parseFloat(miniboxplot.attr("width"));
    var height=width;
    var values_selected = newaxis.values_newselected.sort(d3.ascending);
    
    var axisToPixels = d3.scaleLinear()
                            .domain([Number(miniboxplot.attr("maxval")),Number(miniboxplot.attr("minval"))])//row
                            .range([0,height-2*padding])//pixels, 0 à 107
                            
    var ytobe=null;
    var htobe=null;
    var uniqueValue=false;
    
    miniboxplot.selectAll(".miniRect").remove();

    var NAs_rows=getVector(miniboxplot.attr("NAs_rows"))
    if(miniboxplot.attr("select_NAs")=="false"){//s'il n'y a pas de NAs ou si on ne veut pas les sélectionner
        var selectedrows=[];
        var unselectedrows=NAs_rows;
    } else {
        var selectedrows=NAs_rows;
        var unselectedrows=[];
    }
    
  
    if(values_selected.length>1){
        if(values_selected.length!=total.length){//dans unselected -> ne fonctionne que s'il y a une valeur unselected, donc pas quand on selectionne TOUT
            //if(selected.includes(total[total.length-1])==false){//si les sélections sont a la fin de la liste ça ne marcherait pas

                if(values_selected.length==2 && d3.min(values_selected)==d3.min(total) && d3.max(values_selected)==d3.max(total)){//cas particulier ou on veut juste le min et le max
                    var y = padding+axisToPixels(d3.min(values_selected));
                                    
                    miniboxplot.append("rect").attr("class", "miniRect")
                                .attr("x",padding/2)
                                .attr("y",y)
                                .attr("width", width/2-padding)
                                .attr("height", 3)
                                .attr("state","selected")
                                .style("fill",selectedColor)
                                .style("opacity",0.5);

                    var y = padding+axisToPixels(d3.max(values_selected));
                        
                    miniboxplot.append("rect").attr("class", "miniRect")
                                .attr("x",padding/2)
                                .attr("y",y)
                                .attr("width", width/2-padding)
                                .attr("height", 3)
                                .attr("state","selected")
                                .style("fill",selectedColor)
                                .style("opacity",0.5);
                } else {
                    
                    if(d3.min(values_selected)==d3.min(total)){//on traite le premier rectangle séparément, puis on gère le reste
                        //si la valeur après le min est unselected, on duplique cette valeur
                        //values_selected=values_selected.unshift(values_selected[0])
                        //total=total.unshift(total[0])//nope
                        
                    }

                        
                    
                        for(i=0;i<total.length;i++){
                            
                            if(values_selected.includes(total[i])){//dans selected
                                uniqueValue=true;
                                selectedrows=selectedrows.concat(densityVectors[i][1]);
                                
                                if(ytobe==null){//nouveau depart
                                    ytobe=total[i];
                                
                                } else {
                                    htobe=total[i];
                                    uniqueValue=false
                                
                                }
                                
                                //derniere valeur
                                if(ytobe==total[total.length-1]){//rect artificiel
                                    if(side=="density"){
                                        var y = padding+axisToPixels(ytobe);
                                        
                                        miniboxplot.append("rect").attr("class", "miniRect")
                                                    .attr("x",padding/2)
                                                    .attr("y",y)
                                                    .attr("width", width/2-padding)
                                                    .attr("height", 3)
                                                    .attr("state","selected")
                                                    .style("fill",selectedColor)
                                                    .style("opacity",0.5);
                                    }
                                    if(side=="box"){
                                        var y = padding+axisToPixels(ytobe);
                                        
                                        miniboxplot.append("rect").attr("class", "miniRect")
                                                    .attr("x",68.5)
                                                    .attr("y",y)
                                                    .attr("width", width/2-padding)
                                                    .attr("height", 3)
                                                    .attr("state","selected")
                                                    .style("fill",selectedColor)
                                                    .style("opacity",0.5);
                                    }
                                    ytobe=null;
                                } 
                                    
                                
                                if(htobe==total[total.length-1]){//il n'y aura pas de valeur unselected après
                                    
                                    if(ytobe<htobe){
                                        var y = padding+axisToPixels(htobe);
                                        var h = axisToPixels(ytobe) - axisToPixels(htobe)
                                    
                                    } 
                                    if(side=="density"){
                                        miniboxplot.append("rect").attr("class", "miniRect")
                                                    .attr("x",padding/2)
                                                    .attr("y",y)
                                                    .attr("width", width/2-padding)
                                                    .attr("height", h)
                                                    .attr("state","selected")
                                                    .style("fill",selectedColor)
                                                    .style("opacity",0.5);
                                    }
                                    if(side=="box"){
                                        miniboxplot.append("rect").attr("class", "miniRect")
                                                    .attr("x",68.5)
                                                    .attr("y",y)
                                                    .attr("width", width/2-padding)
                                                    .attr("height", h)
                                                    .attr("state","selected")
                                                    .style("fill",selectedColor)
                                                    .style("opacity",0.5);
                                    }
                                    ytobe=null;
                                    htobe=null;
                                }
                                
                                
                            } else {
                                
                                unselectedrows=unselectedrows.concat(densityVectors[i][1]);
                                //on tombe dans unselected avec un ytobe et un htobe ? on plot le rect
                                
                                    
                                
                                if(ytobe!=null && htobe!=null){
                                    //plot
                                    
                                    if(ytobe<htobe){
                                        var y = padding+axisToPixels(htobe);
                                        var h = axisToPixels(ytobe) - axisToPixels(htobe)
                                    
                                    } 
                                    if(side=="density"){
                                        miniboxplot.append("rect").attr("class", "miniRect")
                                                    .attr("x",padding/2)
                                                    .attr("y",y)
                                                    .attr("width", width/2-padding)
                                                    .attr("height", h)
                                                    .attr("state","selected")
                                                    .style("fill",selectedColor)
                                                    .style("opacity",0.5);
                                    }
                                    if(side=="box"){
                                        miniboxplot.append("rect").attr("class", "miniRect")
                                                    .attr("x",68.5)//right_scrollbar
                                                    .attr("y",y)
                                                    .attr("width", width/2-padding)
                                                    .attr("height", h)
                                                    .attr("state","selected")
                                                    .style("fill",selectedColor)
                                                    .style("opacity",0.5);
                                    }
                                    ytobe=null;
                                    htobe=null;
                                } else {
                                    if(ytobe!=null){//il faut quand meme une base

                                        
                                        if(side=="density"){
                                            var y = padding+axisToPixels(ytobe);
                                            
                                            miniboxplot.append("rect").attr("class", "miniRect")
                                                        .attr("x",padding/2)
                                                        .attr("y",y)
                                                        .attr("width", width/2-padding)
                                                        .attr("height", 3)
                                                        .attr("state","selected")
                                                        .style("fill",selectedColor)
                                                        .style("opacity",0.5);
                                        }
                                        if(side=="box"){
                                            var y = padding+axisToPixels(ytobe);
                                            
                                            miniboxplot.append("rect").attr("class", "miniRect")
                                                        .attr("x",68.5)
                                                        .attr("y",y)
                                                        .attr("width", width/2-padding)
                                                        .attr("height", 3)
                                                        .attr("state","selected")
                                                        .style("fill",selectedColor)
                                                        .style("opacity",0.5);
                                        }
                                    ytobe=null;
                                    htobe=null;
                                    }
                                }
                            }
                        }
                    
                }
         

        
        }else {
            for(i=0;i<total.length;i++){
                selectedrows=selectedrows.concat(densityVectors[i][1]);//toutes les rows correspondant a des values, et non celles correspondant aux NAs (pour le moment)
                //unselectedrows reste vide
            }
            
            if(side=="density"){
                miniboxplot.append("rect").attr("class", "miniRect")
                            .attr("x",padding/2)
                            .attr("y",padding)
                            .attr("width", width/2-padding)
                            .attr("height", height-2*padding)
                            .attr("state","selected")
                            .style("fill",selectedColor)
                            .style("opacity",0.5);
            }
            if(side=="box"){
                miniboxplot.append("rect").attr("class", "miniRect")
                            .attr("x",68.5)
                            .attr("y",padding)
                            .attr("width", width/2-padding)
                            .attr("height", height-2*padding)
                            .attr("state","selected")
                            .style("fill",selectedColor)
                            .style("opacity",0.5);
            }
        }
    }
    if(values_selected.length==1){//UNE SEULE VALEUR
        
        for(i=0;i<total.length;i++){
            if(values_selected.includes(total[i])){
                selectedrows=selectedrows.concat(densityVectors[i][1]);
            } else {
                unselectedrows=unselectedrows.concat(densityVectors[i][1]);
            }
        }
        if(side=="density"){
            var y = padding+axisToPixels(values_selected[0]);
            
            miniboxplot.append("rect").attr("class", "miniRect")
                        .attr("x",padding/2)
                        .attr("y",y)
                        .attr("width", width/2-padding)
                        .attr("height", 3)
                        .attr("state","selected")
                        .style("fill",selectedColor)
                        .style("opacity",0.5);
        }
        if(side=="box"){
            var y = padding+axisToPixels(values_selected[0]);
            
            miniboxplot.append("rect").attr("class", "miniRect")
                        .attr("x",68.5)
                        .attr("y",y)
                        .attr("width", width/2-padding)
                        .attr("height", 3)
                        .attr("state","selected")
                        .style("fill",selectedColor)
                        .style("opacity",0.5);
        }
    }
    if(values_selected.length==0){//AUCUNE VALEUR
        for(i=0;i<total.length;i++){
            unselectedrows=unselectedrows.concat(densityVectors[i][1]);//toutes les rows correspondant a des values, et non celles correspondant aux NAs (pour le moment)
            
            //selectedrows reste vide
        }
        miniboxplot.selectAll("line").attr("class","boxplotLine");
        miniboxplot.selectAll("path").attr("class","densityArea");
        miniboxplot.attr("side","none")
    }
    miniboxplot.attr("selected",selectedrows);
    miniboxplot.attr("unselected",unselectedrows);
    
  
                //suppression des rect qui bug
    miniboxplot.selectAll(".miniRect").filter(function(){
                                        return isNaN(d3.select(this).attr("y"));
                                      }).remove();
 
    
  
}
  


function updateMiniBarChart(plot,axis_newselected,axis_newunselected){
    plot.attr("barnums_selected",axis_newselected).attr("barnums_unselected",axis_newunselected)

    var NAs_rows=getVector(plot.attr("NAs_rows"))
    if(plot.attr("select_NAs")=="false"){//s'il n'y a pas de NAs ou si on ne veut pas les sélectionner
        var selectedrows=[];
        var unselectedrows=NAs_rows;
    } else {
        var selectedrows=NAs_rows;
        var unselectedrows=[];
    }
   

    plot.selectAll("#bar").each(function(){
        if(axis_newselected.includes( Number(d3.select(this).attr("barId")))){
            d3.select(this).attr("state","selected").attr("class","barAreaSelected")
            selectedrows=selectedrows.concat(getVector(d3.select(this).attr("rowsVector")))
        } else {
            d3.select(this).attr("state","unselected").attr("class","barArea")
            unselectedrows=unselectedrows.concat(getVector(d3.select(this).attr("rowsVector")))
        }
    })
    
    plot.attr("selected",selectedrows);
    plot.attr("unselected",unselectedrows);
    

}





function updateMiniPlotNAs(plot){
    var selectedrows=getVector(plot.attr("selected"));
    var unselectedrows=getVector(plot.attr("unselected"));
    var NAs_rows=getVector(plot.attr("NAs_rows"));

    if(plot.attr("select_NAs")=="false"){//on veut enlever les NAs des selections et les ajouter aux deselections
        plot.attr("selected",selectedrows.filter(x => !NAs_rows.includes(x)));
        plot.attr("unselected",unselectedrows.concat(NAs_rows));
        plot.select("#NAlabel").style("fill","white");
    } else {//l'inverse
        plot.attr("selected",selectedrows.concat(NAs_rows));
        plot.attr("unselected",unselectedrows.filter(x => !NAs_rows.includes(x)));
        plot.select("#NAlabel").style("fill",selectedColor);
    }

}


function updateExtremasMiniBoxPlot(plot,A){
    var values_selected = A.values_newselected;
   
    var values = getVector(plot.attr("values"))

    if(values_selected.includes(d3.min(values))){
        plot.select("#minlabel").style("fill",selectedColor)
    } else {
        plot.select("#minlabel").style("fill","white")
    }

    if(values_selected.includes(d3.max(values))){
        plot.select("#maxlabel").style("fill",selectedColor)
    } else {
        plot.select("#maxlabel").style("fill","white")
    }
}


function deselectMiniPlots(){

    d3.selectAll(".plot").each(function(){
        var oldselected=getVector(d3.select(this).attr("selected"));
        var oldunselected=getVector(d3.select(this).attr("unselected"));
        d3.select(this).attr("selected",[])
        d3.select(this).attr("unselected",oldselected.concat(oldunselected))

        if(d3.select(this).attr("plot_type")=="miniboxplot"){
            var values_selected=getVector(d3.select(this).attr("values_selected"));
            var values_unselected=getVector(d3.select(this).attr("values_unselected"));
            d3.select(this).attr("values_selected",[])
            d3.select(this).attr("values_unselected",values_selected.concat(values_unselected))
            d3.select(this).attr("side","none");
            d3.select(this).selectAll(".miniRect").remove();
            d3.select(this).selectAll("line").attr("class","boxplotLine");
            d3.select(this).selectAll("path").attr("class","densityArea");
        }
        if(d3.select(this).attr("plot_type")=="minibarchart"){
            var barnums_selected=getVector(d3.select(this).attr("barnums_selected"));
            var barnums_unselected=getVector(d3.select(this).attr("barnums_unselected"));
            d3.select(this).attr("barnums_selected",[])
            d3.select(this).attr("barnums_unselected",barnums_selected.concat(barnums_unselected));
            d3.select(this).selectAll("#bar").each(function(){
                d3.select(this).attr("state","unselected").attr("class","barArea")   
            })
        }
        d3.select(this).attr("select_NAs","false");
        d3.select(this).select("#NAlabel").style("fill","white");
        
    })

    
}


function deselectThisMiniPlot(plot){
    
    var oldselected=getVector(plot.attr("selected"));
    var oldunselected=getVector(plot.attr("unselected"));
    plot.attr("selected",[])
    plot.attr("unselected",oldselected.concat(oldunselected))

    var values_selected=getVector(plot.attr("values_selected"));
    var values_unselected=getVector(plot.attr("values_unselected"));
    plot.attr("values_selected",[])
    plot.attr("values_unselected",values_selected.concat(values_unselected))
    plot.attr("side","none");
    plot.selectAll(".miniRect").remove();
    plot.selectAll("line").attr("class","boxplotLine");
    plot.selectAll("path").attr("class","densityArea");
    
}