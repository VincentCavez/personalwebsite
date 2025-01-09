function createBoxPlot(evtTarget){
    
    var id = parseInt(evtTarget.getAttribute("columnId"));
    var name = evtTarget.getAttribute("columnName");
    var nrows = dataset.getRowCount();

    var x_bottom = 133.987*id;
    var y_bottom = 2000;//1600
    var width = 400;
    var y_jump = 60;
    var font_coeff = 1.42;

    var boxw=(width*2)/5;
    var linew=boxw/2;
    var offsetxbox=(width-boxw)/2;
    var offsetx=offsetxbox+boxw/4;

    var svg = d3.select("#svgContainer");
    var plot = svg.append("g").attr("id","plot").attr("x",x_bottom).attr("y",y_bottom);


    values=[]
    for (let i=0; i<nrows;i++){
        values.push(dataset.get(i,id));
    }
 
    //Sort values
    values.sort(function(a, b) {
        return a - b;
        });


    
    //Set minimum value
    var minval = min(values);
    //Set Quartile1
    var q1 = d3.quantile(values,0.25); 
    //Set Median
    var q2 = d3.quantile(values,0.5);
    //Set Quartile3
    var q3 = d3.quantile(values,0.75);
    //Set maximum value
    var maxval = max(values);
        
    var height = (maxval+1)*y_jump;

    plot.append("rect")
    .attr("class", "background")
    .attr("x",x_bottom)
    .attr("y",y_bottom-height)
    .attr("width", width)
    .attr("height", height)
    .style("fill","white");
    var dy = 0;
    
    
    for (let j = 0; j < maxval+1; j++) {
        
        plot.append("line")
            .attr("x1",x_bottom)
            .attr("y1",y_bottom-dy)
            .attr("x2",x_bottom+width)
            .attr("y2",y_bottom-dy)
            .attr("stroke","rgb(210,210,210)");
            
        plot.append("line")
            .attr("x1",x_bottom-10)
            .attr("y1",y_bottom-dy)
            .attr("x2",x_bottom)
            .attr("y2",y_bottom-dy)
            .attr("stroke","black");

        plot.append("text")
            .attr("x",x_bottom-25)
            .attr("y",y_bottom-dy)
            .attr("class","plotaxes")
            .text(j);
        dy += y_jump;
    }
    
    var dy=y_jump;
    

    


    plot.append("rect")
            .attr("x",x_bottom+offsetxbox)
            .attr("y",y_bottom-q3*dy)
            .attr("width",boxw)
            .attr("height",-q1*dy+q3*dy)
            //.style("fill","rgb("+ 255 +","+ 204 +","+ 0 +")");
            .style("fill","rgb(244,181,39)");
    
    //x,y,w,h
    
    plot.append("line")
            .attr("x1",x_bottom+offsetx)
            .attr("y1",y_bottom-minval*dy)
            .attr("x2",x_bottom+offsetx+linew)
            .attr("y2",y_bottom-minval*dy)
            .attr("stroke","black");
    
    plot.append("line")
            .attr("x1",x_bottom+offsetxbox)
            .attr("y1",y_bottom-q1*dy)
            .attr("x2",x_bottom+offsetxbox+boxw)
            .attr("y2",y_bottom-q1*dy)
            .attr("stroke","black");
    
    plot.append("line")
            .attr("x1",x_bottom+offsetxbox)
            .attr("y1",y_bottom-q2*dy)
            .attr("x2",x_bottom+offsetxbox+boxw)
            .attr("y2",y_bottom-q2*dy)
            .attr("stroke","black");
    
    plot.append("line")
            .attr("x1",x_bottom+offsetxbox)
            .attr("y1",y_bottom-q3*dy)
            .attr("x2",x_bottom+offsetxbox+boxw)
            .attr("y2",y_bottom-q3*dy)
            .attr("stroke","black");
    
    plot.append("line")
            .attr("x1",x_bottom+offsetx)
            .attr("y1",y_bottom-maxval*dy)
            .attr("x2",x_bottom+offsetx+linew)
            .attr("y2",y_bottom-maxval*dy)
            .attr("stroke","black");
    
    plot.append("line")
            .attr("x1",x_bottom+offsetx+linew/2)
            .attr("y1",y_bottom-minval*dy)
            .attr("x2",x_bottom+offsetx+linew/2)
            .attr("y2",y_bottom-q1*dy)
            .attr("stroke","black");
    
    plot.append("line")
            .attr("x1",x_bottom+offsetx+linew/2)
            .attr("y1",y_bottom-q3*dy)
            .attr("x2",x_bottom+offsetx+linew/2)
            .attr("y2",y_bottom-maxval*dy)
            .attr("stroke","black");
    
    
    var legendLength = textWidth('Grades from 0 to 9')*font_coeff;
    plot.append("text")
            .attr("x",x_bottom-40-legendLength)
            .attr("y",y_bottom-height/2)
            .attr("class","plottitle")
            .text('Grades from 0 to 9');

    var titleLength = textWidth("Boxplot of "+name)*font_coeff;
    plot.append("text")
            .attr("x",x_bottom+(width-titleLength)/2)
            .attr("y",y_bottom+y_jump/2)
            .attr("class","plottitle")
            .text("Boxplot of "+name);

}






















function createBarchart(evtTarget){
    
    
    var id = parseInt(evtTarget.getAttribute("columnId"));
    var name = evtTarget.getAttribute("columnName");
    var nrows = dataset.getRowCount();

    var x_bottom = 133.987*id;
    var y_bottom = 1300;//1600
    var x_jump= 45 ;
    var y_jump = 50;
    var width = x_jump*nrows;
    var font_coeff = 1.42;
    

    var svg = d3.select("#svgContainer");
    var plot = svg.append("g").attr("id","plot").attr("x",x_bottom).attr("y",y_bottom);

    values=[]
    for (let i=0; i<nrows;i++){
        values.push(dataset.get(i,id));
    }
 
    //Set maximum value
    var maxval = max(values);
    var height = (maxval+1)*y_jump;
    
    
    plot.append("rect")
    .attr("class", "background")
    .attr("x",x_bottom)
    .attr("y",y_bottom-height)
    .attr("width", width)
    .attr("height", height)
    .style("fill","white");

    //grid and y-ticks
    var dy=0;
    for (let j=0; j<ceil(maxval)+1;j++){

        plot.append("line")
            .attr("x1",x_bottom)
            .attr("y1",y_bottom-dy)
            .attr("x2",x_bottom+x_jump*nrows)
            .attr("y2",y_bottom-dy)
            .attr("stroke","rgb(210,210,210)");

        plot.append("line")
            .attr("x1",x_bottom-10)
            .attr("y1",y_bottom-dy)
            .attr("x2",x_bottom)
            .attr("y2",y_bottom-dy)
            .attr("stroke","black");

        plot.append("text")
            .attr("x",x_bottom-25)
            .attr("y",y_bottom-dy)
            .attr("class","plotaxes")
            .text(j);

        dy += y_jump;
    }

    var dy = y_jump;

    //text label on x-axis and bars
    var dx = 0;
    for (let i = 0; i < nrows; i++) {

        plot.append("text")
            .attr("x",x_bottom+dx)
            .attr("y",y_bottom+15)
            .attr("class","plotaxes")
            .text(dataset.get(i,0));

        plot.append("rect")
            .attr("x",x_bottom+dx)
            .attr("y",y_bottom-y_jump*values[i])
            .attr("width",x_jump-5)
            .attr("height",y_jump*values[i])
            .style("fill","rgb("+(250-values[i]*20)+","+ (250-values[i]*10)+","+ 220+")");

        dx += x_jump;
            
    }
    var legendLength = textWidth('Mean of grades from 0 to 9')*font_coeff;
    plot.append("text")
            .attr("x",x_bottom-40-legendLength)
            .attr("y",y_bottom-height/2)
            .attr("class","plottitle")
            .text('Mean of grades from 0 to 9');
            
    
    var titleLength = textWidth("Activities it is acceptable doing in/on/at a "+name)*font_coeff;
    plot.append("text")
            .attr("x",x_bottom+(width-titleLength)/2)
            .attr("y",y_bottom+y_jump)
            .attr("class","plottitle")
            .text("Activities it is acceptable doing in/on/at a "+name);
  
}