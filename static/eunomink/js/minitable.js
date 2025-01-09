

function createMiniTable(x_up,y_up,min,max){

    var canvas = d3.select("#elementsContainer");
    var bonus=2;
    window.scroller_size=bonus+10;//taille du scroller rose
    
    var lmin = min;
    var lmax = max;
    var hmin = min;
    var hmax = max;
    var r=n/p;

    if(n>p){//r>1
        var h = hmax;
        if(lmax/r<lmin){//pas bon, granularité
            var l = lmin;
        } else {
            var l = lmax/r;
        }
    } else {
        var l = lmax;
        if(r*hmax<hmin){//pas bon, granularité
            var h = hmin;
        } else {
            var h = r*hmax;
        }
    }
    var step_row = h/n;
    var step_col = l/p;
    
    var miniTableContainer = canvas.append("svg").attr("id","miniTableContainer")
                                                    .style("left",x_up)
                                                    .style("top",y_up)
                                                    .attr("width", l+2*bonus+10)
                                                    .attr("height", h+2*bonus+10);

    var miniTable = miniTableContainer.append("g").attr("id","miniTable")
                                                    .attr("transform","translate("+(10+bonus)+","+(10+bonus)+")")                                  
                                                    .attr("width", l+10)
                                                    .attr("height", h+10)
                                                    .attr("step_row",step_row)
                                                    .attr("step_col",step_col);
                            
    miniTableContainer.append("rect").attr("class","scroller").attr("id","leftScroller")
                                        .attr("x",0).attr("y",10+bonus).attr("width",10).attr("height",h)        
    miniTableContainer.append("rect").attr("class","scroller").attr("id","topScroller")
                                        .attr("x",10+bonus).attr("y",0).attr("width",l).attr("height",10)                 
    
    miniTable.attr("rowList",d3.range(n));
    miniTable.attr("unselected",d3.range(n));
    miniTable.attr("selected",[]);

    miniTable.attr("colList",d3.range(p));
    miniTable.attr("unselected_columns",d3.range(p));
    miniTable.attr("selected_columns",[]);          
                                    

    miniTable.append("rect").attr("class", "background")
                            .attr("x",0)
                            .attr("y",0)
                            .attr("width", l)
                            .attr("height", h);
    
    
    woodenFrame(miniTableContainer,10,10,l,h,bonus);  

  
}




function updateMiniTable(minitable,newrows){//updates minitable ATTRIBUTES and PIXELS based on the new vectors
    var rtp = rowToPixelsScale;
    var ctp = colToPixelsScale;
    
    if(hovering=="vertical" || cornerClick==true){//choix arbitraire que le clic sur le coin créera des mini colonnes et non des mini lignes
           
        minitable.attr("selected",newrows.newselected);
        minitable.attr("unselected",newrows.newunselected);
    
        minitable.attr("selected_columns",newrows.newselected_columns);
        minitable.attr("unselected_columns", newrows.newunselected_columns);
        
        var newselectedpix=[];
        for(i=0;i<newrows.newselected.length;i++){
            newselectedpix.push(rtp(newrows.newselected[i]));
            }
        
        var newunselectedpix=[];
        for(i=0;i<newrows.newunselected.length;i++){
            newunselectedpix.push(rtp(newrows.newunselected[i]));
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








    if(hovering=="horizontal") {

        minitable.attr("selected_columns",newrows.newselected_columns);
        minitable.attr("unselected_columns",newrows.newunselected_columns);
    
        //var newexcluded = getVector(parent.attr("excluded"));
        minitable.attr("selected",[]);
        minitable.attr("unselected",newrows.newunselected);
        
        var newselectedpix=[];
        for(i=0;i<newrows.newselected_columns.length;i++){
        newselectedpix.push(ctp(newrows.newselected_columns[i]));
        }
        
        var newunselectedpix=[];//?
        for(i=0;i<newrows.newunselected_columns.length;i++){
        newunselectedpix.push(ctp(newrows.newunselected_columns[i]));
        }
    
      
    
        minitable.selectAll(".miniRow").remove();
        minitable.selectAll(".miniCol").remove();
        minitable.selectAll(".miniZone").remove();
        
        minitable.selectAll(".miniCol").data(newselectedpix)
                    .enter()
                    .append("rect").attr("class", "miniCol")
                    .attr("x",d => d)
                    .attr("y",0)
                    .attr("width", minitable.attr("step_col"))
                    .attr("height", minitable.attr("height"))
                    .attr("state","selected")
                    .style("fill",selectedColor);
        
        minitable.selectAll(".miniCol")
                    .filter(function(){
                    return d3.select(this).attr("state")=="unselected";
                    })
                    .data(newunselectedpix)
                    .enter()
                    .append("rect").attr("class", "miniCol")
                    .attr("x",d => d)
                    .attr("y",0)
                    .attr("width", minitable.attr("step_col"))
                    .attr("height", minitable.attr("height"))
                    .attr("state","unselected")
                    .style("fill",unselectedColor);
        
        
    }


    

    if(hovering=="values") {

        minitable.selectAll(".miniRow").remove();
        minitable.selectAll(".miniCol").remove();
        minitable.selectAll(".miniZone").remove();

         
        var width=5.714285714285715;//+1 car à la différence des minicols et minirows on crée un unique rect donc on a besoin de l'intervalle sup
        var height=1;
        
        for(i=0;i<newrows.newselected_values.length;i++){
            var x=ctp(getVector(newrows.newselected_values[i])[1]);
            var y=rtp(getVector(newrows.newselected_values[i])[0]);

            minitable.append("rect").attr("class", "miniZone")
                        .attr("x",x)
                        .attr("y",y)
                        .attr("width",width)
                        .attr("height", minitable.attr("step_row"))
                        .attr("state","selected")
                        .style("fill",selectedColor);
        }

    }
    
}

  