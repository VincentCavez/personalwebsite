
    
    // BRUSH LOOP on the BOX PLOT
    var t=0;
    var first=0;
    
    d3.selectAll("#brushable")
        .on("mousedown",function(event,d){
            t+=1;

            //openMiniTable();

            //get the right plot
            var id = d3.select(this).node().parentNode.getAttribute("columnId");
            var plot = d3.selectAll(".plot").filter(function(){
                return d3.select(this).attr("columnId")==id;
            })

            var width = 127.14//121.67;//120.625;
            var x_bottom = width*id;
            var y_bottom = -25;//-100-10;

            if(first===0){
                columnDeselection(id);
                first+=1;
                }
            

            if(plot.attr("selStep")==0){//si ce plot particulier est encore vierge de sélection
                selStepCount+=1;//on augmente le compteur global
                plot.attr("selStep",selStepCount);//s'il n'est pas vierge de sélection, on ne change pas son selStep car on réajuste une sélection existante !!
                
                
                plot.append("text")
                    .attr("class","selStep")
                    .attr("x",middle-5)
                    .attr("y",-10)
                    .text(selStepCount);

                MiniTableAtNewPlot(); // et on fait comme si on venait d'ouvrir le plot !
            }
            //d3.select(this).attr("t",t);
            window.xstart=d3.select(this).attr("x");
            window.ystart=d3.select(this).attr("y");

            window.xlast=xstart;
            window.ylast=ystart;

            window.movement = false;
            window.whitesinced=false;

            window.oldvect=[];
            window.newvect=[];
            //local redefinition, otherways it gets mixed up, keeping the last plot's values
            
            var rightPadding = 25;

            var boxScale = d3.scaleLinear()
                        .domain([d3.select(this).node().parentNode.getAttribute("minval"),d3.select(this).node().parentNode.getAttribute("maxval")])
                        .range([-padding,-height+padding]);
            

            d3.selectAll("#popupAxis").remove();
            plot.append("text").attr("class","miniBoxplotLegend").attr("id","popupAxis").attr("x",middle-rightPadding).attr("y",boxScale(parseFloat(d3.select(this).attr("values")))).text(d3.select(this).attr("values"));
                
            var SS = d3.select(this).node().parentNode.getAttribute("selStep");

            if(d3.select(this).attr("class")==="notbrushed"){// départ blanc
                plot.selectAll("#brushable").on("mouseover", function(event,d){//ICI
                    movement=true;

                    d3.selectAll("#popupAxis").remove();
                    plot.append("text").attr("class","miniBoxplotLegend").attr("id","popupAxis").attr("x",middle-rightPadding).attr("y",boxScale(parseFloat(d3.select(this).attr("values")))).text(d3.select(this).attr("values"));
                
                    var x=d3.select(this).attr("x");
                    var y=d3.select(this).attr("y");

                    if(d3.select(this).attr("class")==="notbrushed"){//blanc
                        //devient vert et t actualisé
                        d3.select(this).attr("class","brushed").attr("t",t);
                        var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                        for(i=0;i<vect.length;i++){
                            rowSelection(vect[i]);
                            actualizeMiniTable(vect[i],true,SS);}

                        //pareil pour le précédent
                        var last = plot.selectAll("#brushable").filter(function(){return d3.select(this).attr("y")==ylast && d3.select(this).attr("x")==xlast;});
                        last.attr("class","brushed").attr("t",t);
                        var vect = last.attr("rowsVector").split(',').map(Number);
                        for(i=0;i<vect.length;i++){
                            rowSelection(vect[i]);
                            actualizeMiniTable(vect[i],true,SS);}
;

                        xlast=x;
                        ylast=y;
                    } 
                    else {//vert
                        if(d3.select(this).attr("t")<t){//si c'est une ancienne sélection
                            d3.select(this).attr("t",t);//on la laisse verte et on actualise son t
                        }
                        else {
                            d3.select(this).attr("class","notbrushed");
                            var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                            for(i=0;i<vect.length;i++){
                                rowDeselection(vect[i]);
                                actualizeMiniTable(vect[i],false,SS);}

                            var last = plot.selectAll("#brushable").filter(function(){return d3.select(this).attr("y")==ylast && d3.select(this).attr("x")==xlast;});
                            last.attr("class","notbrushed");
                            var vect = last.attr("rowsVector").split(',').map(Number);
                            for(i=0;i<vect.length;i++){
                                rowDeselection(vect[i]);
                                actualizeMiniTable(vect[i],false,SS);}


                            xlast=x;
                            ylast=y;

                        }
                    }

                })
                } 
            else {
                plot.selectAll("#brushable").on("mouseover", function(event,d){//départ vert //ET ICI
                    movement=true;
                    
                    d3.selectAll("#popupAxis").remove();
                    plot.append("text").attr("class","miniBoxplotLegend").attr("id","popupAxis").attr("x",middle-rightPadding).attr("y",boxScale(parseFloat(d3.select(this).attr("values")))).text(d3.select(this).attr("values"));
                        
                    var x=d3.select(this).attr("x");
                    var y=d3.select(this).attr("y");

                    if(d3.select(this).attr("class")==="notbrushed"){//blanc
                        whitesinced=true;

                        //devient vert et t actualisé
                        d3.select(this).attr("class","brushed").attr("t",t);
                        var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                        for(i=0;i<vect.length;i++){
                            rowSelection(vect[i]);
                            actualizeMiniTable(vect[i],true,SS);}

                        //pareil pour le précédent
                        var last = plot.selectAll("#brushable").filter(function(){return d3.select(this).attr("y")==ylast && d3.select(this).attr("x")==xlast;});
                        last.attr("class","brushed").attr("t",t);
                        var vect = last.attr("rowsVector").split(',').map(Number);
                        for(i=0;i<vect.length;i++){
                            rowSelection(vect[i]);
                            actualizeMiniTable(vect[i],true,SS);}


                        xlast=x;
                        ylast=y;
                    } 
                    else {//vert
                        if(d3.select(this).attr("t")<t){//si c'est une ancienne sélection
                            //if(whitesinced===true){
                                //on ne peut pas réduire une ancienne zone si on l'a agrandie avant
                                //d3.select(this).attr("t",t);//on la laisse verte et on actualise son t
                            //}
                            //else {//false
                        
                                d3.select(this).attr("class","notbrushed");
                                var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                                for(i=0;i<vect.length;i++){
                                    rowDeselection(vect[i]);
                                    actualizeMiniTable(vect[i],false,SS);}

                                var last = plot.selectAll("#brushable").filter(function(){return d3.select(this).attr("y")==ylast && d3.select(this).attr("x")==xlast;});
                                last.attr("class","notbrushed");
                                var vect = last.attr("rowsVector").split(',').map(Number);
                                for(i=0;i<vect.length;i++){
                                    rowDeselection(vect[i]);
                                    actualizeMiniTable(vect[i],false,SS);
                                }

                                

                                xlast=x;
                                ylast=y;
                            //}
                            
                        }
                        else {//c'est une récente sélection
                              
                            d3.select(this).attr("class","notbrushed");
                            var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                            for(i=0;i<vect.length;i++){
                                rowDeselection(vect[i]);
                                actualizeMiniTable(vect[i],false,SS);}

                            var last = plot.selectAll("#brushable").filter(function(){return d3.select(this).attr("y")==ylast && d3.select(this).attr("x")==xlast;});
                            last.attr("class","notbrushed");
                            var vect = last.attr("rowsVector").split(',').map(Number);
                            for(i=0;i<vect.length;i++){
                                rowDeselection(vect[i]);
                                actualizeMiniTable(vect[i],false,SS);}

                            xlast=x;
                            ylast=y;
                            
                            //si la nouvelle position est la première, on ne fait rien et on laisse vert

                        }
                    }
                })
                }
            }
        )
        .on("mouseup",function(event,d){
            var SS = d3.select(this).node().parentNode.getAttribute("selStep");
            
            d3.selectAll("#popupAxis").remove();
                
            if(movement===false){//si c'était un simple click
                if(d3.select(this).attr("class")==="notbrushed"){//blanc
                    d3.select(this).attr("class","brushed").attr("t",t);//devient vert et t actualisé
                    var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                    for(i=0;i<vect.length;i++){
                        rowSelection(vect[i]);
                        actualizeMiniTable(vect[i],true,SS);}


                } else {//vert
                    d3.select(this).attr("class","notbrushed");
                    var vect = d3.select(this).attr("rowsVector").split(',').map(Number);
                    for(i=0;i<vect.length;i++){
                        rowDeselection(vect[i]);
                        actualizeMiniTable(vect[i],false,SS);
                    }

                    
                }
            }

            //get the right plot (element)
            var id = d3.select(this).node().parentNode.getAttribute("columnId");
            var plot = d3.selectAll(".plot").filter(function(){
                return d3.select(this).attr("columnId")==id;
            })
            
            var rowSelected = [];

            if(plot.selectAll(".brushed").empty()==true){//si la sélection est vide
                plot.selectAll(".selStep").remove();//suppression du texte qui précise l'étape de sélection
                plot.attr("selStep",0);//il ne fait plus partie des étapes de sélection et donc son attribut est à 0
                selStepCount-=1;//on enlève une étape au compteur global

                plot.attr("rowSelection",rowSelected);//comme n'y a aucun brush, ce vecteur est vide

                var excluded = [];//rien n'est sélectionné donc rien n'est exclu
                plot.attr("excluded",excluded);

                //ça marche ça ?
                
                if(plot.attr("selStep")==selStepCount){//si c'est le dernier selStep
                    var virginPlotsIds = [];
                    var virginPlots = d3.selectAll(".plot")//on stock les plots sans sélection
                                    .filter(function(){                          
                                        return parseInt(d3.select(this).attr("selStep"))==0;
                                    })
                                    .each(function(){
                                        virginPlotsIds.push(d3.select(this).attr("columnId"));                                
                                    })
                                    //penser au cas où la sélection est vide, rowlist             
                    if(virginPlots.empty()==false){//s'ils existent bien... (s'ils n'existent pas on ne fait rien)     
                        virginPlots.remove();//on supprime tous les anciens plots sans sélection
                        for(let i=0;i<virginPlotsIds.length;i++){//on en crée des nouveaux à la même place
                            //var rowList= .attr("rowsVector").split(',').map(Number); 
                            var total = plot.attr("rowList").split(',').map(Number); 
                            var sels = [];    
                            createMiniBoxPlot(virginPlotsIds[i],Matrix,total,sels,0);   
                        }
                    }
                    
                
                } else {
                    //sinon on actualise le selStep+1
                    var nextOne = parseInt(plot.attr("selStep"))+1;//numéro de l'étape suivante
                    
                    var plotToChange = d3.selectAll(".plot")
                                            .filter(function(){
                                                return d3.select(this).attr("selStep")==nextOne;
                                            });
                    var idToChange=plotToChange.attr("columnId");
 
                    var total = plot.attr("rowList").split(',').map(Number);
                    //var sels = virginPlots.filter(function(){return d3.select(this).attr("columnId")==virginPlotsIds[i]}).attr("rowSelection").split(',').map(Number);             
                    var sels = plotToChange.attr("rowSelection").split(',').map(Number);
                    plotToChange.remove();
                    createMiniBoxPlot(idToChange,Matrix,total,sels,nextOne);
                }
                
            } else { //s'il y a une sélection
                
                plot.selectAll(".brushed").each(function(){
                    //ajout des lignes rowsvector par rowsvector
                    rowSelected = rowSelected.concat(d3.select(this).attr("rowsVector").split(',').map(Number));
                });
                rowSelected=getUniqueValues(rowSelected);

                plot.attr("rowSelection",rowSelected);//ce vecteur contient les lignes correpondant aux brush

                var total = plot.attr("rowList").split(',').map(Number);
                var excluded = total.filter(x => !rowSelected.includes(x));//ce vecteur est le complémentaire des sélections
                plot.attr("excluded",excluded);

                //ça marche ça ?
                
                if(plot.attr("selStep")==selStepCount){//si c'est le dernier selStep
                    var virginPlotsIds = [];
                    var virginPlots = d3.selectAll(".plot")//on stock les plots sans sélection
                                    .filter(function(){                          
                                        return parseInt(d3.select(this).attr("selStep"))==0;
                                    })
                                    .each(function(){
                                        virginPlotsIds.push(d3.select(this).attr("columnId"));                                
                                    })
                                    //penser au cas où la sélection est vide, rowlist             
                    if(virginPlots.empty()==false){//s'ils existent bien... (s'ils n'existent pas on ne fait rien)     
                        virginPlots.remove();//on supprime tous les anciens plots sans sélection
                        for(let i=0;i<virginPlotsIds.length;i++){//on en crée des nouveaux à la même place   
                            var sels = [];          
                            createMiniBoxPlot(virginPlotsIds[i],Matrix,rowSelected,sels,0);   
                        }
                    }
                    
                    
                } else {
                    //sinon on actualise le selStep+1
                    var nextOne = parseInt(plot.attr("selStep"))+1;//numéro de l'étape suivante
                    
                    var plotToChange = d3.selectAll(".plot")
                                            .filter(function(){
                                                return d3.select(this).attr("selStep")==nextOne;
                                            });
                    var idToChange=plotToChange.attr("columnId");
                    var sels = plotToChange.attr("rowSelection").split(',').map(Number);
                    plotToChange.remove();
                    createMiniBoxPlot(idToChange,Matrix,rowSelected,sels,nextOne);
                }

            }
            
            
            //closeMiniTable();
            //Reinitialization of the over function
            d3.selectAll("#brushable").on("mouseover", function(event,d){       
            });
           
        });
