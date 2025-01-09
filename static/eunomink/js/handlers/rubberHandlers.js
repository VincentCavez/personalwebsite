
function rubber_handler(event,type){
    
    if(type=="ink"){

        inkFound=inkPicker(event);
        if(inkFound!=null){inkFound.remove(); window.rubber_time=Date.now();}

    }
    if(type=="element"){
        
        elementFound=elementPicker(event);
        
        if(elementFound!=null){

            if(elementFound.attr("id")=="tableContainer"){

                deselectMiniPlots();
                var localShiftYtable=get_y_transform(d3.select("#table"))
                var localShiftXtable=get_x_transform(d3.select("#table"))
                var border_x = event.clientX-parseFloat(d3.select("#tableContainer").style("left"))-x_margin;
                var border_y = event.clientY-parseFloat(d3.select("#tableContainer").style("top"))-y_margin;
               
                
                
                if(border_x>0 && border_y>0){//we are erasing cells and not deleting rows or columns
                    var colId = pixelsToColumnScale_table(border_x-localShiftXtable);
                    var rowId = pixelsToRowScale_table(border_y-localShiftYtable);
                        
                    if(Date.now()-window.rubber_time<50 && (colId!=window.rubber_colId || rowId!=window.rubber_rowId)){
                        //evite les microbugs où les coordonnées changent en moins de 5 ms
                       
                    } else {
                       
                        window.rubber_colId=colId;
                        window.rubber_rowId=rowId;

                        d3.selectAll(".tab").remove()
                        d3.selectAll(".tabLogo").remove()
                        createPlotTabs()

                        cellBelow=d3.select("#r"+rowId)
                                    .selectAll(".cell").filter(function(){
                                        return d3.select(this).attr("columnId")==colId;
                                    });
                        
                        var cellBelowState=cellBelow.attr("state");
                        
                        
                        if(cellBelowState=="unselected"){//no selection

                            cellBelow.select("text").text("");
                           
                            window.rubber_time=Date.now();
                        } 
                        if(cellBelowState=="selected"){//selection

                            table.selectAll(".cell")
                                .filter(function() {
                                    return d3.select(this).attr("state")=="selected";})
                                .each(function(){
                                    d3.select(this).select("text").text("");});
                            window.rubber_time=Date.now();
                        }

                    }
                }
                if(border_x<0 && border_y>0){//deleting rows
                    var colId = pixelsToColumnScale_table(border_x);
                    var rowId = pixelsToRowScale_table(border_y-localShiftYtable);
                    
                    if(Date.now()-rubber_time>500){
                        if(getVector(table.attr("selected")).includes(rowId)){
                            var numberOfRowsToDelete = getVector(table.attr("selected")).length-1;
                            for(var i=0;i<=numberOfRowsToDelete;i++){
                                var rowToDelete=getVector(table.attr("selected"))[0]
            
                                delete_row(rowToDelete)
                            }
                           
                        } else {
                            delete_row(rowId)
                        }
                        
                        window.rubber_time=Date.now();
                    }
                    
                }
                if(border_x>0 && border_y<0){//deleting columns
                    var colId = pixelsToColumnScale_table(border_x-localShiftXtable);
                    var rowId = pixelsToRowScale_table(border_y);

                    if(Date.now()-rubber_time>500){
                        if(getVector(table.attr("selected_columns")).includes(colId)){
                            var numberOfColsToDelete = getVector(table.attr("selected_columns")).length-1;
                            for(var i=0;i<=numberOfColsToDelete;i++){
                                var colToDelete=getVector(table.attr("selected_columns"))[0]
            
                                delete_column(colToDelete)
                            }
                           
                        } else {
                            delete_column(colId)
                        }
                        
                        window.rubber_time=Date.now();
                    }
                    
                }
                    //rubber on excluded values does nothing
            }   
            
        }

        if(elementFound==null){

        }
    } 
    if(type=="postit"){
        elementFound=elementPicker(event);
       
        if(elementFound!=null && elementFound.attr("class")=="postitContainer"){
            var id = Number(elementFound.attr("postitId"))
            var linkedInks=d3.selectAll(".ink").filter(function(){
                return d3.select(this).attr("magnet")=="postitContainer";//parmi celles qui sont liée à un postit
            }).filter(function(){
                return d3.select(this).attr("postitId")==id;//on cherche celles sur ce postit
            })
            if(linkedInks.empty()==true){
                elementFound.remove();
            }
            
            window.rubber_time=Date.now();
        }
    }
    
    
}
