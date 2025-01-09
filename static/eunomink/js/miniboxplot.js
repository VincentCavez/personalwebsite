


function createMiniBoxPlot(id){//selected c'est pour sauvegarder la sélection eventuelle lors d'un rafraîchissement 
    
    var selfRowList=d3.range(n);

    var scroller_width = 10;
    var width=127;
    var padding=10;
    var middle = width/2;
    var height = width;
    var boxw=25;//middle-padding;
    var linew=boxw/2;
    var offsetxbox=middle;
    var offsetx=middle;

    
    var plotContainer = d3.selectAll(".tab").filter(function(){
            return d3.select(this).attr("columnId")==id;
        }).append("svg").attr("class","plotContainer")//si le plotcontainer n'existait pas on le crée
        //.style("left", 0)//x_up)
        //.style("top",0)//y_up-20)
        .attr("width",width)
        .attr("height",height+40)
        .attr("columnId",id)

   
    var plot = plotContainer.append("g").attr("class","plot")
                                .attr("transform","translate("+0+","+15+")")//en réalité c'est 9 d'offset de la tab + 6 d'offset d'elementcontainer ?
                                .attr("width",width)
                                .attr("height",height)
                                .attr("columnId",id)
                                .attr("plot_type","miniboxplot")
                              
   
    plot.attr("selected",[]).attr("unselected",selfRowList);



    values=[];
    NAs_rows=[]
    for (const el of selfRowList){
        
        var thistext = d3.select("#r"+el).selectAll(".cell").filter(function(){
            return d3.select(this).attr("columnId")==id
        }).select("text").text();
        
        if(thistext!=""){
            values.push(thistext);
        } else {
            NAs_rows.push(el)
        }
        
        
    }
    values = values.map(Number);
    
    
    //Sort values
    values.sort(function(a, b) {
        return a - b;
        });
   
    plot.attr("full_values",values)
   
    plot.attr("NAs_rows",NAs_rows)
    
    
    //Set minimum value
    var minval = d3.min(values);
    //Set Quartile1
    var q1 = d3.quantile(values,0.25); 
    //Set Median
    var q2 = d3.quantile(values,0.5);
    //Set Quartile3
    var q3 = d3.quantile(values,0.75);
    //Set maximum value
    var maxval = d3.max(values);
    

    plot.append("rect")
        .attr("class", "listener")
        .attr("x",0)
        .attr("y",0)
        .attr("width", width)
        .attr("height", height);

    plot.attr("minval",minval)
        .attr("maxval",maxval);
   
    
    
    //y scale for the boxplot, x scale for the density plot (originally)
    var boxScale = d3.scaleLinear()
                        .domain([minval,maxval])
                        .range([height-padding,padding]);
                     

    //box x,y: upper coordinates
    plot.append("rect")
            .attr("x",offsetxbox)
            .attr("y",boxScale(q3))
            .attr("width",boxw)
            .attr("height",boxScale(q1)-boxScale(q3))
            //.style("fill","rgb(244,181,39)");
            .style("opacity","0");
    

    //min
    plot.append("line").attr("x1",offsetx+scroller_width/2).attr("y1",boxScale(minval)).attr("x2",offsetx+linew+scroller_width/2).attr("y2",boxScale(minval)).attr("class","boxplotLine");
    //q1
    if(values.includes(q1)){
        plot.append("line").attr("x1",offsetxbox+scroller_width/2).attr("y1",boxScale(q1)).attr("x2",offsetxbox+boxw+scroller_width/2).attr("y2",boxScale(q1)).attr("class","boxplotLine").style("stroke-width","2px")
    } else {
        plot.append("line").attr("x1",offsetxbox+scroller_width/2).attr("y1",boxScale(q1)).attr("x2",offsetxbox+boxw+scroller_width/2).attr("y2",boxScale(q1)).attr("class","boxplotLine").style("stroke-width","1px")
    }
   
    //median
    if(values.includes(q2)){
        plot.append("line").attr("x1",offsetxbox+scroller_width/2).attr("y1",boxScale(q2)).attr("x2",offsetxbox+boxw+scroller_width/2).attr("y2",boxScale(q2)).attr("class","boxplotLine").style("stroke-width","2px");
    } else {
        plot.append("line").attr("x1",offsetxbox+scroller_width/2).attr("y1",boxScale(q2)).attr("x2",offsetxbox+boxw+scroller_width/2).attr("y2",boxScale(q2)).attr("class","boxplotLine").style("stroke-width","1px");
    }
    
    //q3
    if(values.includes(q3)){
        plot.append("line").attr("x1",offsetxbox+scroller_width/2).attr("y1",boxScale(q3)).attr("x2",offsetxbox+boxw+scroller_width/2).attr("y2",boxScale(q3)).attr("class","boxplotLine").style("stroke-width","2px");
    } else {
        plot.append("line").attr("x1",offsetxbox+scroller_width/2).attr("y1",boxScale(q3)).attr("x2",offsetxbox+boxw+scroller_width/2).attr("y2",boxScale(q3)).attr("class","boxplotLine").style("stroke-width","1px");
    }
    
    //max
    plot.append("line").attr("x1",offsetx+scroller_width/2).attr("y1",boxScale(maxval)).attr("x2",offsetx+linew+scroller_width/2).attr("y2",boxScale(maxval)).attr("class","boxplotLine");

    //scroller
    plot.append("rect").attr("class","scroller").attr("x",offsetx-scroller_width/2).attr("y",boxScale(maxval)).attr("width",scroller_width).attr("height",boxScale(minval)-boxScale(maxval))

    //base
    plot.append("line").attr("x1",offsetx+scroller_width/2).attr("y1",boxScale(maxval)).attr("x2",offsetx+scroller_width/2).attr("y2",boxScale(minval)).attr("class","boxplotLine");
                    
    //box side contour
    plot.append("line").attr("x1",offsetx+boxw+scroller_width/2).attr("y1",boxScale(q3)).attr("x2",offsetx+boxw+scroller_width/2).attr("y2",boxScale(q1)).attr("class","boxplotLine");
    
    
  

    //--------------------------------------------------------------------------------

    //--------------------------GENERATION OF THE DENSITY PLOT------------------------

    //--------------------------------------------------------------------------------

    var densityScale = d3.scaleLinear()//scale for the horizontal length of the bars
                        .domain([0,1])
                        .range([0,-middle+padding]);
                        
    

    // Compute kernel density estimation
    const kde = kernelDensityEstimator(kernelEpanechnikov(3), boxScale.ticks(50));
    const density =  kde( values.map(function(d){  return d; }) );

    
    var densityValues = density.map(function(value,index) { return value[1]; });
    var axisList = density.map(function(value,index) { return value[0]; });//axisList est redéterminée à chaque fois à partir de selfrowlist, c'est normal
    var maxDensity = d3.max(densityValues);

   

    var coef=(padding-middle)/densityScale(maxDensity);//borne pour éviter que le density plot dépasse
    
    // Plot the area of the density plot
    plot.append("path")
        .attr("class", "densityArea")
        .attr("transform", `translate(${middle},${0}),rotate(-90)`)
        .datum(density)
        .attr("opacity", "1")
        .attr("stroke", "#000")
        .attr("stroke-width", 0.8)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.area()
            .x(function(d) { return -boxScale(d[0]); })
            .y1(function(d) { return coef*densityScale(d[1])-scroller_width/2; })
            .y0(densityScale(0)-scroller_width/2)
        );
    
    //--------------------------------------------------------------------------------

    //------------------------------------PLOT TEXT-----------------------------------

    //--------------------------------------------------------------------------------

    var coefnumber=7;
    //Lower and upper bound legend text
    //var minLegendLength = 10//textWidth("'"+minval+"'")*font_coeff;
    plot.append("rect").attr("id","minlabel")
            .attr("x",middle-minval.toString().length*coefnumber/2).attr("width",minval.toString().length*coefnumber).style("fill","white").style("stroke","black")
            .attr("y",boxScale(minval)+2).attr("height",12)
    plot.append("text")
        .attr("class","miniBoxplotLegend").attr("text-anchor", "middle")
        .attr("x",middle)
        .attr("y",boxScale(minval)+12)//6, la semi taille de la police
        .text(minval);
       
    
    //var maxLegendLength = 10//textWidth("'"+maxval+"'")*font_coeff;
    plot.append("rect").attr("id","maxlabel")
            .attr("x",middle-maxval.toString().length*coefnumber/2).attr("width",maxval.toString().length*coefnumber).style("fill","white").style("stroke","black")
            .attr("y",boxScale(maxval)-16).attr("height",12)
    plot.append("text")
        .attr("class","miniBoxplotLegend").attr("text-anchor", "middle")
        .attr("x",middle)
        .attr("y",boxScale(maxval)-6)
        .text(maxval);
       

    if(NAs_rows.length!=0){
        plot.append("rect").attr("id","NAlabel")
            .attr("x",90).attr("width",32).style("fill","white")
            .attr("y",-11).attr("height",12)
        plot.append("text")
            .attr("class","miniBoxplotLegend").attr("text-anchor", "middle").style("font-family",'Quicksand-Semibold')
            .attr("x",5/6*width)
            .attr("y",-1)
            .text("NAs");
        
    }

    plot.append("text").attr("id","columnTitle").attr("text-anchor", "start").style("font-family",'Quicksand-Regular').style("font-size","10px")
                        .attr("x",0).attr("y",-6).text(d3.select("#h"+id).select("text").text())

    var unique_values=[];
    
    for(i=0;i<values.length;i++){
        if(unique_values.includes(values[i])==false){
            unique_values.push(values[i])
        }
    }
    

    plot.attr("values",unique_values)
    plot.attr("values_selected",[])//a revoir, en cas d'actu ? !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    plot.attr("values_unselected",unique_values)

    plot.attr("select_NAs","false")
   
}









Number.prototype.decim=function(){return this.toString().replace(/\d*\./,'').length}

function tableTest(a,b,c){
var sum = a.length+b.length+c.length;

}

