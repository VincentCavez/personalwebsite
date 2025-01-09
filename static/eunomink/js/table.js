//var svgContainer=d3.selectAll("svg").attr("id","svgContainer");

function createTable(dataset,columnNames){

    //--------------------------------------------------------------------------------

    //-----------------------------GENERATION OF THE TABLE----------------------------

    //--------------------------------------------------------------------------------

    window.n = dataset.length;
    window.p = columnNames.length;

    var oneRowHeight = 50;

    window.cumulatedRowHeights=[];
    for(i=0;i<=n;i++){
        cumulatedRowHeights.push(i*oneRowHeight)
    }

    window.columnsWidths=[];
    window.cumulatedColumnsWidths=[0];
    for(i=0;i<p;i++){
        var title=headers_names[i]; //noms
       
        var pix1=title.length*10;
        var pix2=0;
        var padding=0;
       
        for(j=0;j<n;j++){
            if(dataset[j][i].length*10>pix2){
                pix2=dataset[j][i].length*9//10
            }
        }

        if(pix1>=127 || pix2>=127){//largeur minimale d'une colonne
            if(pix1>pix2){

                columnsWidths.push(pix1+padding);
                cumulatedColumnsWidths.push(cumulatedColumnsWidths[i]+pix1+padding);
            } else {

                columnsWidths.push(pix2+padding);
                cumulatedColumnsWidths.push(cumulatedColumnsWidths[i]+pix2+padding);
            }
        } else {
            columnsWidths.push(127);
            cumulatedColumnsWidths.push(cumulatedColumnsWidths[i]+127);
        }
    }

    window.TOTAL_VALUES = [];
    window.UNSELECTED_VALUES = [];
    for(i=0;i<n;i++){
      for(j=0;j<p;j++){
        TOTAL_VALUES.push(i+","+j);
        UNSELECTED_VALUES.push(i+","+j);
      }
    }

    window.SELECTED_VALUES = [];
    window.EXCLUDED_VALUES = [];

    window.selectedColor=  "hsl(213, 92%, 87%)" ;//rgb(129, 187, 253) en prenant en compte l'opacité de 0.25
    window.unselectedColor="rgb(255, 255, 255)";
    window.excludedColor="rgb(230, 230, 230)"  ;        //"rgb(162, 162, 162)";

    window.downTriangleColor="darkgray";

    window.x_margin = 50;//largeur de l'index
    window.y_margin = 30;//hauteur des noms de colonnes
    window.extend_margin = 15;
      //8000 et 80000 et ssv pour les lieux de tournage
    var offsetTable = {top: 50, right: 180, bottom: 130, left: 50}//table container, not table

    var width = cumulatedColumnsWidths[cumulatedColumnsWidths.length-1] //- offsetTable.left - offsetTable.right;//p*160 ?

    window.table_width = width;
    var height = n*50 //- offsetTable.top - offsetTable.bottom;
    window.table_height = height;

       
    window.width_displayed = window.screen.width - offsetTable.left - offsetTable.right - 25//25 pour ne pas avoir le scroller
    window.height_displayed = window.screen.height - offsetTable.top - offsetTable.bottom - 131


    var tableA = [],
        tableB = [];


    window.nodesRows = [];
    for (let i=0; i<n;i++){
        nodesRows.push({"name":(i+1).toString()});
    }

    window.nodesColumns = [];
    for (let i=0; i<p;i++){
        nodesColumns.push({"name":columnNames[i]});
    }


    var tableContainer = d3.select("#elementsContainer")
                .append("svg")
                .attr("id", "tableContainer")
                .style("left", offsetTable.left)
                .style("top", offsetTable.top)
                .attr("width",width_displayed+x_margin+extend_margin)//2* margin avant
                .attr("height",height_displayed+y_margin+extend_margin);

    var table = tableContainer.append("svg").attr("id","tableClippath").style("position","absolute").attr("width",width_displayed).attr("height",height_displayed).attr("y",y_margin).attr("x",x_margin)
                                .append("g")
                                .attr("id","table")
                                .attr("width",width)
                                .attr("height",height)
                                .attr("transform","translate(0,0)");


    var clippath = d3.select("#tableClippath");
    var testtime=Date.now()
    var fakerows=30;
    var fakecolumns=20;

    //spreadsheet on the right
    clippath.append("g").attr("id","faketable1")
                .attr("width",127*fakecolumns)//on rajoute p fausses colonnes
                .attr("height",height+50*n)//meme hauteur que la table
                .attr("transform","translate("+width+",0)")
            .append("rect").attr("class","background")
                .attr("x",0).attr("y",0)
                .attr("width",127*fakecolumns)//on rajoute p fausses colonnes
                .attr("height",height+50*n)

    var ft = d3.select("#faketable1");
    for(i=0;i<(n+fakerows);i++){
        for(j=0;j<fakecolumns;j++){
            ft.append("g").attr("transform","translate("+j*127+","+i*50+")").attr("id","r"+i).attr("class","cell")
            .append("rect").attr("width",127).attr("height",50).style("fill","white")
            //ft.append("g").attr("transf").append("rect").attr("id","r"+i).attr("x",j*127).attr("y",i*50).attr("width",127).attr("height",50).attr("class","cell").style("fill","white")
        }
    }
    //spreadsheet on the bottom
    clippath.append("g").attr("id","faketable2")
                .attr("width",parseFloat(d3.select("#table").attr("width")))//meme largeur que le dataset
                .attr("height",50*fakerows)//on rajoute n lignes
                .attr("transform","translate(0,"+(height+oneRowHeight)+")")//on decale a cause du header
            .append("rect").attr("class","background")
                .attr("x",0).attr("y",0)
                .attr("width",parseFloat(d3.select("#table").attr("width")))//on rajoute 100 fausses colonnes
                .attr("height",50*fakerows)

    var ft = d3.select("#faketable2");
    for(i=0;i<fakerows;i++){
        for(j=0;j<p;j++){
            ft.append("g").attr("transform","translate("+cumulatedColumnsWidths[j]+","+i*50+")").attr("id","c"+j).attr("class","cell")
            .append("rect").attr("width",cumulatedColumnsWidths[j+1]-cumulatedColumnsWidths[j]).attr("height",50).style("fill","white")
            //ft.append("rect").attr("id","c"+j).attr("x",cumulatedColumnsWidths[j]).attr("y",i*50).attr("width",cumulatedColumnsWidths[j+1]-cumulatedColumnsWidths[j]).attr("height",50).attr("class","cell").style("fill","white")
        }
    }


    var y = d3.scaleBand(),
        x = d3.scaleQuantize();


    nodesColumns.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        tableA[i] = d3.range(n).map(function(j) {
            return {x: i, y: j, z: 1 + (p * i) + j, value:dataset[j][i]}; });
            });

    nodesRows.forEach(function(node, i) {
        node.index = i;
        node.count = 0;
        tableB[i] = d3.range(p).map(function(j) {
            return {x: j, y: i, z: (n * j) + 1 + i, value:dataset[i][j]}; });
            });


    var ordersColumns = {
        name: d3.range(p)
        };

    var ordersRows = {
        name: d3.range(n)
        };


    //tableB : 150x6
    //tableA : 6x150
    //---------------


    x.domain(ordersColumns.name);   //useless maintenant ?
    y.domain(ordersRows.name);

  
    x.range(cumulatedColumnsWidths);//vecteur de 0 à width
    y.range([oneRowHeight, height+oneRowHeight]);


    table.append("rect")
        .attr("class", "background").attr("y",50)//offset du aux headers
        .attr("width", width)
        .attr("height", height);


    var off=30;
    tableContainer.append("rect")//intérieur
        .attr("id","corner")
        .attr("x", x_margin-off)
        .attr("y", 1)
        .attr("width",off)
        .attr("height",off)
        .attr("class", "background")
        .attr("state","unselected");

    //contour du corner
    tableContainer.append("rect")
        .attr("x", x_margin-off)
        .attr("y", 1)
        .attr("width",off)
        .attr("height",off)
        .attr("fill","none")
        .attr("stroke","rgb(90,61,43)")
        .attr("stroke-width",2);


    table.attr("rowList",d3.range(n))
        .attr("unselected",d3.range(n))
        .attr("selected",[]);

    table.attr("colList",d3.range(p))
        .attr("unselected_columns",d3.range(p))
        .attr("selected_columns",[]);

    //extend_margin
    var extend_bottom = tableContainer.append("svg").attr("id","extend_bottom").style("position","absolute").attr("x",x_margin).attr("y",y_margin+height_displayed);

    extend_bottom.append("rect").attr("class","extend_margin")
                    .attr("x",0)
                    .attr("y",0)
                    .attr("width",width_displayed)
                    .attr("height",extend_margin);

    var arrowdown = extend_bottom.append("g").attr("id","arrowdown").attr("transform","translate("+(width_displayed/2-15)+",0)");
    arrowdown.append("line").attr("x1",0).attr("x2",30).attr("y1",3).attr("y2",3).style("stroke",downTriangleColor)
    arrowdown.append("line").attr("x1",0).attr("x2",15).attr("y1",3).attr("y2",13).style("stroke",downTriangleColor)
    arrowdown.append("line").attr("x1",15).attr("x2",30).attr("y1",13).attr("y2",3).style("stroke",downTriangleColor)

    var extend_right = tableContainer.append("svg").attr("id","extend_right").style("position","absolute").attr("x",x_margin+width_displayed).attr("y",y_margin);

    extend_right.append("rect").attr("class","extend_margin")
                .attr("x",0)
                .attr("y",0)
                .attr("width",extend_margin)
                .attr("height",height_displayed);

    var arrowright = extend_right.append("g").attr("id","arrowright").attr("transform","translate(0,"+(height_displayed/2-15)+")");
    arrowright.append("line").attr("x1",3).attr("x2",3).attr("y1",0).attr("y2",30).style("stroke",downTriangleColor)
    arrowright.append("line").attr("x1",3).attr("x2",13).attr("y1",0).attr("y2",15).style("stroke",downTriangleColor)
    arrowright.append("line").attr("x2",3).attr("x1",13).attr("y1",15).attr("y2",30).style("stroke",downTriangleColor)

    //coin marron, expander
    tableContainer.append("rect").attr("id","expander")
                    .attr("x",(x_margin+width_displayed))
                    .attr("y",(y_margin+height_displayed))
                    .attr("width",extend_margin)
                    .attr("height",extend_margin)
                    .style("fill","rgb(90,61,43)");



    tableContainer.append("svg").style("position","absolute").attr("id","rowsHeadersContainer").attr("width",x_margin).attr("height",height_displayed).attr("y",(y_margin+50)).attr("x",0)
                    .append("g").attr("id","rowsHeaders").attr("transform","translate(0,0)");

    d3.select("#tableClippath").append("g").attr("id","Headers").attr("transform","translate(0,0)");

    for(i=0;i<p;i++){
        var hc = d3.select("#Headers").append("g").attr("id","h"+i).attr("class","headerCell").attr("type",typeGuesser()[i]);
        hc.attr("columnId",i).attr("rowId",-1).attr("transform","translate("+cumulatedColumnsWidths[i]+","+0+")")
        hc.append("rect").attr("width",(cumulatedColumnsWidths[i+1]-cumulatedColumnsWidths[i])).attr("height",oneRowHeight).style("fill","lightgrey").style("stroke","#a1a1a1").style("stroke-width",1)
        hc.append("text").attr("rowId",-1).text(headers_names[i]).attr("y",oneRowHeight-20).attr("class","textcell").attr("text-anchor","middle").attr("x",(cumulatedColumnsWidths[i+1]-cumulatedColumnsWidths[i])/2)
    }
    //matrice A 6 éléments, matrice B en a 150

    

    
    var row = table.selectAll(".row")
                    .data(tableB)
                    .enter()
                    .append("g")
                    .attr("id", function(d, i) {
                        return "r"+i;})
                    .attr("class", "row")
                    .attr("transform", function(d, i) {
                        return "translate(0," + y(i) + ")"; })
                    .attr("state","unselected")
                    .each(row,i);//i:les n lignes
    

    tableContainer.append("svg").style("position","absolute").attr("id","columnsHeadersContainer").attr("width",width_displayed+15).attr("height",y_margin).attr("y",0).attr("x",x_margin)
                    .append("g").attr("id","columnsHeaders").attr("transform","translate(0,0)");

                   
    for(i=0;i<p;i++){
    

        d3.select("#columnsHeaders")
                        .append("rect")//invisible cell behind the column label, to help the selection
                        .attr("class", "columnCircle")
                        .attr("x", function(d){
                            return cumulatedColumnsWidths[i];
                        })
                        .attr("y",1)
                        .attr("columnId", i)
                        .attr("state","unselected")
                        .attr("width", function(d){
                            return cumulatedColumnsWidths[i+1]-cumulatedColumnsWidths[i];
                        })//idem
                        .attr("height", y_margin);

        d3.select("#columnsHeaders").append("text")
                        .attr("class", "columnlabel")
                        .attr("x", function(d){
                            return cumulatedColumnsWidths[i]+columnsWidths[i]/2;
                        })
                        .attr("y", 20)
                        .attr("columnName", nodesColumns[i].name)
                        .attr("columnId", i)
                        .attr("text-anchor", "middle")
                        .text(nodesColumns[i].name);
            
    }
   


    //CELLROWS
    function row(row,i) {


        d3.select("#rowsHeaders")
            .append("rect")//invisible cell behind the row label, to help the selection
            .attr("class", "rowCircle")
            .attr("x", 20)
            .attr("y", y.bandwidth()*i) /// 2 -14)//pourquoi 14
            .attr("rowId", i)
            .attr("state","unselected")
            .attr("width", x_margin)//pourquoi 20
            .attr("height", y.bandwidth());
        

        d3.select("#rowsHeaders").append("text")
            .attr("class", "rowlabel")
            .attr("x", x_margin-5)
            .attr("y", y.bandwidth()/2+y.bandwidth()*i)//i lignes
            .attr("rowName", nodesRows[i].name)
            .attr("rowId", i)
            .attr("text-anchor", "end")
            .text(nodesRows[i].name);

     


        var cells = d3.select(this)
                        .selectAll(".cell")
                        .data(row.filter(function(d) {
                            return d.z;
                        }))//? ça sert à ouvrir le bon nombre de cells ?
                        .enter();

        var cell=cells.append("g")
                .attr("class", "cell")
                .attr("id", function(d, i) { return "c"+i; })
                .attr("columnId", function(d, i) { return i; })
                .attr("state","unselected")
                .attr("transform",function(d,j) {//?
                    return "translate("+cumulatedColumnsWidths[j]+",0)";
                    } );

        cell.append("rect")
                .style("fill",unselectedColor)
                .attr("width", function(d,i){
                    return columnsWidths[i];
                })
                .attr("height", y.bandwidth());


        cell.append("text")
            .attr("class","textcell")
            .attr("x", function(d,i) {
                return columnsWidths[i]/2;
                })
            .attr("y", function(d) {
                return y.bandwidth()/2+5;
                })
            .attr("text-anchor", "middle")
            .attr("rowId",i)
            .attr("columnId",function (d,i) {// on affiche le nom des colonnes ?
                return i;})
            .text(function (d,i) {// on affiche le nom des colonnes ?
                return d.value;
            });
            

    }






    window.DATASET = dataset;
    woodenFrame(tableContainer,x_margin-1,y_margin-1,width_displayed+12,height_displayed+12,2);
//1530
    createMiniTable(530,140,40,150);//à la création de la table on crée systématiquement sa minitable
    //1800,80
    initialize_global_variables();
  

}



function cellsUpdateOnRow(table,array,state){//colonne puis ligne !!
    
    var convertedArray=getVector(array);
    for(i=0;i<array.length;i++){//rows
        var y=convertedArray[i];
        var row=d3.select("#r"+y);
        var cells=row.selectAll(".cell")

        if(state=="selected"){
            /*
            cells.each(function(){
                d3.select(this).attr("state","selected");
                d3.select(this).select("rect").style("fill",selectedColor);
                d3.select(this).select("text").style("opacity",1);
            })
            */
            cells.attr("state","selected");
            cells.selectAll("rect").style("fill",selectedColor);
            cells.selectAll("text").style("opacity",1);
            
        }
        if(state=="unselected"){
            /*
            cells.each(function(){
                d3.select(this).attr("state","unselected");
                d3.select(this).select("rect").style("fill",unselectedColor).attr("state","unselected");
                d3.select(this).select("text").style("opacity",1).attr("state","unselected");
            })
            */
            cells.attr("state","unselected");
            cells.selectAll("rect").style("fill",unselectedColor).attr("state","unselected");
            cells.selectAll("text").style("opacity",1).attr("state","unselected");
        }
      
    }
}


//encore pertinent ?
function cellsUpdateOnColumn(table,array,state){//colonne puis ligne !!

    var convertedArray=getVector(array);

    if(state=="selected"){
        for(j=0;j<array.length;j++){//cols
            var x=convertedArray[j];
            d3.selectAll(".row").each(function(){
                var cell = d3.select(this).selectAll(".cell").filter(function(){
                    return d3.select(this).attr("columnId")==x;
                })
                cell.attr("state","selected");
                cell.select("rect").style("fill",selectedColor);
                cell.select("text").style("opacity",1);
            })
        }
    }
    if(state=="unselected"){
        for(j=0;j<array.length;j++){//cols
            var x=convertedArray[j];
            d3.selectAll(".row").each(function(){
                var cell = d3.select(this).selectAll(".cell").filter(function(){
                    return d3.select(this).attr("columnId")==x;
                })
                cell.attr("state","unselected");
                cell.select("rect").style("fill",unselectedColor);
                cell.select("text").style("opacity",1);
            })
        }
    }

}


function rowsUpdate(table,array,state){

    for(i=0;i<array.length;i++){
        table.select("#r"+array[i]).attr("state",state);
    }

    cellsUpdateOnRow(table,array,state);

}



function updateTableRows(table,newrows){//updates table ATTRIBUTES and ROWS based on vectors

    table.attr("selected",newrows.newselected);
    table.attr("unselected",newrows.newunselected);

    rowsUpdate(table,newrows.newselected,"selected");
    rowsUpdate(table,newrows.newunselected,"unselected");

    var corner = d3.select("#table").select("#corner");

    if(newrows.newunselected.length==0){//si rien n'est unselected, le corner est bleu
        corner.style("fill",selectedColor).style("opacity",0.5).attr("state","selected");
    } else {
        corner.style("fill",unselectedColor).attr("state","unselected");
    }

}

function colsUpdate(table,array,state){

    cellsUpdateOnColumn(table,array,state);

}


function updateTableColumns(table,newcols){//updates table ATTRIBUTES and COLUMNS based on vectors

    table.attr("selected_columns",newcols.newselected_columns);
    table.attr("unselected_columns",newcols.newunselected_columns);

    colsUpdate(table,newcols.newselected_columns,"selected");
    colsUpdate(table,newcols.newunselected_columns,"unselected");

    var corner = d3.select("#table").select("#corner");

    if(newcols.newunselected_columns.length==0){//si rien n'est unselected, le corner est bleu
        corner.style("fill",selectedColor).style("opacity",0.5).attr("state","selected");
    } else {
        corner.style("fill",unselectedColor).attr("state","unselected");
    }

}

function cellsUpdate(table,array,state){

    if(state=="selected"){
        for(i=0;i<array.length;i++){
            var y=getVector(array[i])[0];//rows
            var x=getVector(array[i])[1];//cols

            var row=d3.select("#r"+y);
            var cell=row.selectAll(".cell").filter(function(){
                return d3.select(this).attr("columnId")==x;
            });
            cell.attr("state","selected");
            cell.select("rect").style("fill",selectedColor);
            cell.select("text").style("opacity",1);
        }
    }
    if(state=="unselected"){
        for(i=0;i<array.length;i++){
            var y=getVector(array[i])[0];//rows
            var x=getVector(array[i])[1];//cols

            var row=d3.select("#r"+y);
            var cell=row.selectAll(".cell").filter(function(){
                return d3.select(this).attr("columnId")==x;
            });
            cell.attr("state","unselected");
            cell.select("rect").style("fill",unselectedColor);
            cell.select("text").style("opacity",1);
        }
    }
   
}



function updateTableValues(table,newdata){//updates table ATTRIBUTES and ROWS based on vectors
//selectionne lignes et colonnes si toutes les valeurs sont selectionnees ?
    table.attr("selected",newdata.newselected);
    table.attr("unselected",newdata.newunselected);

    table.attr("selected_columns",newdata.newselected_columns);
    table.attr("unselected_columns",newdata.newunselected_columns);

    cellsUpdate(table,newdata.newselected_values,"selected");
    cellsUpdate(table,newdata.newunselected_values,"unselected");

    //dans le cas unique où toutes les valeurs sont sélectionnées, alors cad que toutes les lignes et colonnes sont sélectionnées, donc le corner l'est aussi
    //mais on verra plus tard
/*
    var corner = d3.select("#table").select("#corner");

    if(newcols.newunselected.length==0){//si rien n'est unselected, le corner est bleu
        corner.style("fill",selectedColor).style("opacity",0.5).attr("state","selected");
    } else {
        corner.style("fill",unselectedColor).attr("state","unselected");
    }
    */
}

function actualizedtable(){
    var n = M.length;
    var p = columnNames.length;
    M=[];
    for(i=0;i<n;i++){//lignes
        v=[];
        var thisRow=d3.selectAll(".row").filter(function() {
            return d3.select(this).attr("rowId") == i; // filter by single attribute
            })
        for(j=0;j<p;j++){//colonnes
            var a= thisRow.selectAll(".textrow").filter(function() {
                return d3.select(this).attr("columnId") == j;})
                .text();
            v.push(a);
        }
        M.push(v);
    }
    return M;
}




/*
//later, for nominal bar charts

if(d3.selectAll("#bar").empty()===false){//deselection of bars
    d3.selectAll("#bar")
        .filter(function(){
            return d3.select(this).attr("row")==id;//toutes les barres (une par colonne) qui correspondent à la ligne n°id
            })
        .each(function(){
            d3.select(this)
            .style("fill","rgb(117,200,174)")
            .attr("selected",true);
            });
}


//old, for boxplots but causes problems because the bins do not contain the same lines between several plots
if(d3.selectAll("#brushable").empty()===false){//deselection of bars
        d3.selectAll("#brushable")
            .filter(function(){
                var vect = d3.select(this).attr("rowsVector").split(',').map(Number);;
                if (id in vect){
                    return d3.select(this);
                }
                })
            .each(function(){
                d3.select(this).attr("class","brushed");
                });
    }
    */
