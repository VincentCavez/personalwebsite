
function createMiniScatterPlot(evtTarget,Matrix){
    
    //var id = parseInt(evtTarget.getAttribute("columnId"));
    var id1 = 2;//id des colonnes en hard
    var id2 = 3;
    var name1 = d3.selectAll(".column").filter(function(){return d3.select(this).attr("columnId")==id1;}).selectAll(".columnlabel").attr("columnName");
    var name2 = d3.selectAll(".column").filter(function(){return d3.select(this).attr("columnId")==id2;}).selectAll(".columnlabel").attr("columnName");
    
    //var nrows = dataset.getRowCount();
    var nrows = Matrix.length;

    var width = 121.67*2;//120.625;
    var x_bottom = width/2*id1;
    var y_bottom = -25-width/2-25;//on surélève d'un miniplot univarié
    var padding=15;
    var r = 2;
    //var barPadding=5;
    
    var height = width;
    var font_coeff = 1.42;
    var offsetLegend = 2;


    var svg = d3.select("#tableContainer");
    var plot = svg.append("g").attr("id","plot").attr("x",x_bottom).attr("y",y_bottom);


    values1=[];
    for (let i=0; i<nrows;i++){
        //values.push(dataset.get(i,id));
        values1.push(Matrix[i][id1]);
    }
    values2=[];
    for (let i=0; i<nrows;i++){
        //values.push(dataset.get(i,id));
        values2.push(Matrix[i][id2]);
    }
 

    plot.append("rect")
    .attr("class", "background")
    .attr("x",x_bottom)
    .attr("y",y_bottom-height)
    .attr("width", width)
    .attr("height", height)

    //------------------------ AXIS ARROWS ------------------------//
    d3.selectAll("#svgContainer").append("defs").append("marker")
                                                .attr("id","arrowhead")
                                                .attr("markerWidth",5)
                                                .attr("markerHeight",3)
                                                .attr("refX",0)
                                                .attr("refY",1.5)
                                                .attr("orient","auto")
                                                .append("polygon")
                                                .attr("points","0 0, 5 1.5, 0 3")
                                                .attr("fill","darkblue");
    //x arrow
    plot.append("line")
        .attr("x1",x_bottom+padding)
        .attr("y1",y_bottom-padding)
        .attr("x2",x_bottom+width-padding)
        .attr("y2",y_bottom-padding)
        .attr("stroke","darkblue")
        .attr("stroke-width","2")
        .attr("marker-end","url(#arrowhead)");

    //y arrow
    plot.append("line")
        .attr("x1",x_bottom+padding)
        .attr("y1",y_bottom-padding)
        .attr("x2",x_bottom+padding)
        .attr("y2",y_bottom-height+padding)
        .attr("stroke","darkblue")
        .attr("stroke-width","2")
        .attr("marker-end","url(#arrowhead)");

    //-------------------------------------------------------------//



    //y scale
    var YScale = d3.scaleLinear()
                        .domain([min(values1),max(values1)])
                        .range([padding,height-padding]);

    var XScale = d3.scaleLinear()
                        .domain([min(values2),max(values2)])
                        .range([padding,width-padding]);
         

    for(let i=0;i<nrows;i++){      

        plot.append("circle")
            .attr("id","point")
            .attr("class","pointNotSelected")
            .attr("value",[values2[i],values1[i]])//x,y
            .attr("rowsVector",i)
            .attr("cx",x_bottom+XScale(values2[i]))
            .attr("cy",y_bottom-YScale(values1[i]))
            .attr("r",r);

    }
   
    var xAxisNameLength = textWidth(name2)*font_coeff;
    plot.append("text")
            .attr("x",x_bottom+(width-xAxisNameLength)/2)
            .attr("y",y_bottom+15)
            .attr("class","plotaxes")
            .text(name2);

    var yAxisNameLength = textWidth(name1)*font_coeff;
    plot.append("text")
            .attr("x",x_bottom-15)
            .attr("y",y_bottom-(width+yAxisNameLength)/2)
            .attr("class","plotaxesVertical")
            .text(name1);
    

    //frame
    woodenFrame(plot,x_bottom,y_bottom,width,height);

    
    //y min
    plot.append("text")
        .attr("class","miniBoxplotLegend")
        .attr("x",x_bottom+offsetLegend)
        .attr("y",y_bottom-padding)
        .text(min(values1));

    //y max
    plot.append("text")
    .attr("class","miniBoxplotLegend")
    .attr("x",x_bottom+offsetLegend)
    .attr("y",y_bottom-height+padding)
    .text(max(values1));

    //x min
    plot.append("text")
        .attr("class","miniBoxplotLegend")
        .attr("x",x_bottom+padding)
        .attr("y",y_bottom-offsetLegend)
        .text(min(values2));

    //x max
    plot.append("text")
    .attr("class","miniBoxplotLegend")
    .attr("x",x_bottom+width-padding)
    .attr("y",y_bottom-offsetLegend)
    .text(max(values2));

    /*
    var first=0;
    d3.selectAll("#bar")
        .on("mousedown",function(event,d){

            if(first===0){
                columnDeselection(id);
                first+=1;
                }

            //local redefinition, otherways it gets mixed up, keeping the last plot's values
            //var x_bottom = d3.select(this).node().parentNode.getAttribute("x");
            var y_bottom = d3.select(this).node().parentNode.getAttribute("y");
            
            d3.selectAll("#popupAxis").remove();
            plot.append("text").attr("class","miniBoxplotLegend").attr("id","popupAxis").attr("x",parseFloat(d3.select(this).attr("x"))).attr("y",y_bottom-yScale((parseFloat(d3.select(this).attr("value"))))).text(d3.select(this).attr("modality"));
            plot.append("text").attr("class","miniBoxplotLegend").attr("id","popupAxis").attr("x",parseFloat(d3.select(this).attr("x"))).attr("y",y_bottom-yScale((parseFloat(d3.select(this).attr("value"))))+10).text(d3.select(this).attr("value"));
            if(d3.select(this).attr("class")==="barNotClicked"){
                d3.select(this).attr("class","barClicked");
                var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                for(i=0;i<vect.length;i++){rowSelection(vect[i]);}
            } else {
                d3.select(this).attr("class","barNotClicked");
                var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                for(i=0;i<vect.length;i++){rowDeselection(vect[i]);}
            }
        }
        )
        .on("mouseup",function(event,d){

            d3.selectAll("#popupAxis").remove();

        });
    */
}
