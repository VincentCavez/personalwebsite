

function createMiniBarChart(id){
   
    var selfRowList=d3.range(n);
    
    var width = 127;
    var height = width;
    var padding=10;
    var offsetLegend = padding-8;
    var scroller_width = 10;
    var offsetTop = 15;

    var plotContainer = d3.selectAll(".tab").filter(function(){
                                                        return d3.select(this).attr("columnId")==id;
                                                    }).append("svg").attr("class","plotContainer")//si le plotcontainer n'existait pas on le crée
                                                    .style("left", 0)
                                                    .style("top",0)
                                                    .attr("width",width)
                                                    .attr("height",height+40)
                                                    .attr("columnId",id)
   

    var plot = plotContainer.append("g").attr("class","plot")
                                .attr("transform","translate("+0+","+offsetTop+")")
                                .attr("width",width)
                                .attr("height",height)
                                .attr("columnId",id)
                                .attr("plot_type","minibarchart")
                              
    plot.attr("selected",[]).attr("unselected",selfRowList);                            

    values=[];
    NAs_rows=[];
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
    plot.attr("NAs_rows",NAs_rows)
 
    const map = values.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
    var MO = [...map.entries()]; // modalities and occurencies
    var MV = [...map.values()];//modalities values
    var MN = [...map.keys()];//modalities names
   
    
    var barNum = MO.length;

    var totalBarWidth = (width-2*padding)/barNum;
    var barPadding = totalBarWidth/8;
    var barWidth = totalBarWidth-barPadding;

    
    plot.attr("barnums",d3.range(barNum)).attr("barnums_unselected",d3.range(barNum)).attr("barnums_selected",[]);

    if(barNum<=6){

        //y scale
        var yScale = d3.scaleLinear()
                            .domain([0,d3.max(MV)])
                            .range([padding,width-padding]);
            

        for(let i=0;i<MO.length;i++){

            var rowsVector=[];
            d3.selectAll(".textcell").each(function(){
                if(d3.select(this).attr("columnId")==id && d3.select(this).text()==MN[i]){
                    rowsVector.push(d3.select(this).attr("rowId"));
                }
            })
           
            plot.append("rect")
                .attr("id","bar")
                .attr("class","barArea").attr("state","unselected").attr("current","false").attr("barId",i)
                .attr("modality",MN[i])
                .attr("value",MV[i])
                .attr("rowsVector",rowsVector)
                .attr("y",padding+i*(barWidth+barPadding))
                .attr("x",padding)
                .attr("height",barWidth)
                .attr("width",yScale(MV[i])-padding);

            plot.append("text")
                .attr("class","miniBoxplotLegend")
                .text(MN[i])
                .attr("y",padding+i*(barWidth+barPadding)+barWidth/2+4)
                .attr("x",padding)
                

        }
        
        
        //Lower and upper bound legend text
        plot.append("text")
            .attr("class","miniBoxplotLegend")
            .attr("x",offsetLegend)
            .attr("y",padding)//6, la semi taille de la police
            .text(0);
        
        plot.append("text")
            .attr("class","miniBoxplotLegend").attr("text-anchor","end")
            .attr("x",yScale(d3.max(MV))+padding-2)
            .attr("y",padding)
            .text(d3.max(MV));

        
    } else {
        //y scale
        var yScale = d3.scaleLinear()
                        .domain([0,d3.max(MV)])
                        .range([padding,width-padding-scroller_width]);


        for(let i=0;i<MO.length;i++){

            var rowsVector=[];
            d3.selectAll(".textcell").each(function(){
            if(d3.select(this).attr("columnId")==id && d3.select(this).text()==MN[i]){
            rowsVector.push(d3.select(this).attr("rowId"));
            }
           
        })


        plot.append("rect")
            .attr("id","bar")
            .attr("class","barArea").attr("state","unselected").attr("current","false").attr("barId",i)
            .attr("modality",MN[i])
            .attr("value",MV[i])
            .attr("rowsVector",rowsVector)
            .attr("y",padding+i*(barWidth+barPadding))
            .attr("x",padding)
            .attr("height",barWidth)
            .attr("width",yScale(MV[i])-padding);

        }


        //Lower and upper bound legend text
        plot.append("text")
        .attr("class","miniBoxplotLegend")
        .attr("x",offsetLegend)
        .attr("y",padding)//6, la semi taille de la police
        .text(0);

        plot.append("text")
        .attr("class","miniBoxplotLegend").attr("text-anchor","end")
        .attr("x",yScale(d3.max(MV))+padding-2)
        .attr("y",padding)
        .text(d3.max(MV));

    

        //--------------//
        //   SCROLLER   //
        //--------------//
        plot.append("rect")
        .attr("class","scroller")
        .attr("x",width-padding/2-scroller_width)
        .attr("y",padding)
        .attr("width",scroller_width)
        .attr("height",width-2*padding-barPadding)

    }

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

    plot.attr("select_NAs","false")
    
}

    





