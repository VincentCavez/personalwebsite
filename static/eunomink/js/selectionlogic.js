                                //------------------------------------------------------------------------//
                                //                                                                        //
                                //                        ROWS TABLE + MINITABLE                          //
                                //                                                                        //
                                //------------------------------------------------------------------------//
function selectionLogic1D(parent,hovered,start,end,mode){//start, end : row id
    
    var corner =tableContainer.selectAll("#corner");

    if(hovering=="vertical"){


        var rowlist = getVector(parent.attr("rowList"));
        var collist = getVector(parent.attr("colList"));
        //columns because not handled by row selection logic UNLESS all rows are selected
        var newselected_columns=[];
        var newunselected_columns=collist;//on n'a pas à se soucier de colonnes exclues
        
            
        if(mode=="none"){//table
            
            //---------------ILE
            //ni le départ ni l'arrivée est dans la sélection précédente, et nous n'avons pas survolé une ancienne sélection : nouvelle sélection
            //que l'on sélectionne à côté ou par dessus
            var newselected = hovered;
            //supression des doublons au cas où on a sélectionné par dessus
            newselected = getUniqueValues(newselected);
            var newunselected = rowlist.filter(x => !newselected.includes(x));
           
 

            if(newselected.length==n){//si toutes les lignes sont sélectionnées, toutes les colonnes aussi
                var newselected_columns=collist;
                var newunselected_columns=[];
            }
            
        }
        if(mode=="finger"){//table avec un doigt appuyé, ou minitable

            var oldselected = getVector(parent.attr("selected"));
            var oldunselected = getVector(parent.attr("unselected"));
            
            if(oldselected.includes(start)){//si on part de l'intérieur
                
                if(oldselected.includes(end)){//et qu'on arrive à l'intérieur
                    var diff=hovered.filter(x => !oldselected.includes(x));//tout le unselected en-dessous du hovered 
                    
                    if(diff.length==0){//si l'on est resté à l'intérieur d'une sélection
        
                        //-------------MOISE
                        //dans le cas où les deux sont à l'intérieur, on fait une Moïse
                        //on creuse la sélection précédente
                        var newunselected = oldunselected.concat(hovered);
                        //on enlève les doublons, puisqu'il y a chevauchement
                        newunselected = getUniqueValues(newunselected);
                        newselected = rowlist.filter(x => !newunselected.includes(x));
                        
                    } else {
        
                        //-------------PONT
                        var newselected = oldselected.concat(hovered);
                        //supression des doublons au cas où on a sélectionné par dessus
                        newselected = getUniqueValues(newselected);
                        newunselected = rowlist.filter(x => !newselected.includes(x));
                        //on concatène, car on ne veut pas écraser la potentielle sélection précédente

                        if(newselected.length==n){//si toutes les lignes sont sélectionnées, toutes les colonnes aussi
                            var newselected_columns=collist;
                            var newunselected_columns=[];
                        }
                    }
                    
                } else {//si on arrive à l'extérieur
    
                    //--------------POUTINE
                    //sinon, on étend la sélection
                    var newselected = oldselected.concat(hovered);
                    //on enlève les doublons, puisqu'il y a chevauchement
                    
                    newselected = getUniqueValues(newselected);
                    newunselected = rowlist.filter(x => !newselected.includes(x));
                   
                    if(newselected.length==n){//si toutes les lignes sont sélectionnées, toutes les colonnes aussi-> sauf s'il y a des lignes exclues !!!!!!!
                        var newselected_columns=collist;
                        var newunselected_columns=[];
                    }
                    
                }
            } else {//si on part de l'extérieur
                if(oldselected.includes(end)){//et qu'on arrive à l'intérieur
        
                    //----------------LEMMINGS
                    //on creuse la sélection précédente
                    var newunselected = oldunselected.concat(hovered);
                    //on enlève les doublons, puisqu'il y a chevauchement
                    newunselected = getUniqueValues(newunselected);
                    newselected = rowlist.filter(x => !newunselected.includes(x));
                    
                    
                } else {//si on arrive à l'extérieur
        
                    var diff=hovered.filter(x => !oldunselected.includes(x));//tout le selected en-dessous du hovered 
                    
                    if(diff.length==0){//pas de selected en dessous du hovered
        
                        //---------------ILE
                        //ni le départ ni l'arrivée est dans la sélection précédente, et nous n'avons pas survolé une ancienne sélection : nouvelle sélection
                        //que l'on sélectionne à côté ou par dessus
                        var newselected = oldselected.concat(hovered);
                        //supression des doublons au cas où on a sélectionné par dessus
                        newselected = getUniqueValues(newselected);
                        newunselected = rowlist.filter(x => !newselected.includes(x));
                        //on concatène, car on ne veut pas écraser la potentielle sélection précédente

                        if(newselected.length==n){//si toutes les lignes sont sélectionnées, toutes les colonnes aussi
                            var newselected_columns=collist;
                            var newunselected_columns=[];
                        }
                        
                    } else {
        
                        //---------------SNOW STORM
                        //ni le départ ni l'arrivée est dans la sélection précédente, on a recouvert une ancienne sélection : déselection
                        //que l'on sélectionne à côté ou par dessus
                        var newunselected = oldunselected.concat(hovered);//on ajoute le survol aux précédentes non-sélections
                        //supression des doublons au cas où on a sélectionné par dessus
                        newunselected = getUniqueValues(newunselected);
                        newselected = rowlist.filter(x => !newunselected.includes(x));
                        //on concatène, car on ne veut pas écraser la potentielle sélection précédente
                        
    
                    }
                }
            
            
            }
            
            
            
        }//fin de finger mode
       
        if(newselected.length==n){
            corner.style("fill",selectedColor).attr("state","selected");
        } else {
            corner.style("fill",unselectedColor).attr("state","unselected");
        }

    }//fin de hovering vertical




    if(hovering=="horizontal"){

        
        var collist = getVector(parent.attr("colList"));
        var rowlist = getVector(parent.attr("rowList"));
        //rows because not handled by column selection logic UNLESS all columns are selected
        var newunselected=rowlist
        var newselected=[];

        if(mode=="none"){
           
            //---------------ILE
            //ni le départ ni l'arrivée est dans la sélection précédente, et nous n'avons pas survolé une ancienne sélection : nouvelle sélection
            //que l'on sélectionne à côté ou par dessus
        
            //supression des doublons au cas où on a sélectionné par dessus
            var newselected_columns = getUniqueValues(hovered);
            var newunselected_columns = collist.filter(x => !newselected_columns.includes(x));
            //on concatène, car on ne veut pas écraser la potentielle sélection précédente


            if(newselected_columns.length==p){//si toutes les colonnes sont sélectionnées, toutes les lignes (sélectionnables) aussi
                var newunselected=[];
                var newselected=rowlist;
            }
            
         
        }
        if(mode=="finger"){
            //start, end : row id
            //ça bug si le vecteur n'existe pas, il crée un vecteur [0].
            //les tests suivants servent à créer un vecteur [] au cas où il n'a rien attrapé.
            var oldselected_columns = getVector(parent.attr("selected_columns"));
            var oldunselected_columns = getVector(parent.attr("unselected_columns"));
            
            if(oldselected_columns.includes(start)){//si on part de l'intérieur
                
                if(oldselected_columns.includes(end)){//et qu'on arrive à l'intérieur
                    var diff=hovered.filter(x => !oldselected_columns.includes(x));//tout le unselected en-dessous du hovered 
                    
                    if(diff.length==0){//si l'on est resté à l'intérieur d'une sélection
    
                        //-------------MOISE
                        //dans le cas où les deux sont à l'intérieur, on fait une Moïse
                        //on creuse la sélection précédente
                        var newunselected_columns = oldunselected_columns.concat(hovered);
                        //on enlève les doublons, puisqu'il y a chevauchement
                        newunselected_columns = getUniqueValues(newunselected_columns);
                        newselected_columns = collist.filter(x => !newunselected_columns.includes(x));
                        
                    } else {
    
                        //-------------PONT
                        var newselected_columns = oldselected_columns.concat(hovered);
                        //supression des doublons au cas où on a sélectionné par dessus
                        newselected_columns = getUniqueValues(newselected_columns);
                        newunselected_columns = collist.filter(x => !newselected_columns.includes(x));
                        //on concatène, car on ne veut pas écraser la potentielle sélection précédente

                        if(newselected_columns.length==p){//si toutes les colonnes sont sélectionnées, toutes les lignes (sélectionnables) aussi
                            var newunselected=[];
                            var newselected=rowlist;
                        }
                        
                    }
                    
                } else {//si on arrive à l'extérieur
    
                    //--------------POUTINE
                    //sinon, on étend la sélection
                    var newselected_columns = oldselected_columns.concat(hovered);
                    //on enlève les doublons, puisqu'il y a chevauchement
                    
                    newselected_columns = getUniqueValues(newselected_columns);
                    newunselected_columns = collist.filter(x => !newselected_columns.includes(x));
                  
                    if(newselected_columns.length==p){//si toutes les colonnes sont sélectionnées, toutes les lignes (sélectionnables) aussi
                        var newunselected=[];
                        var newselected=rowlist;
                    }
                    
                }
            } else {//si on part de l'extérieur
                if(oldselected_columns.includes(end)){//et qu'on arrive à l'intérieur
    
                    //----------------LEMMINGS
                    //on creuse la sélection précédente
                    var newunselected_columns = oldunselected_columns.concat(hovered);
                    //on enlève les doublons, puisqu'il y a chevauchement
                    newunselected_columns = getUniqueValues(newunselected_columns);
                    newselected_columns = collist.filter(x => !newunselected_columns.includes(x));
                    
                } else {//si on arrive à l'extérieur
    
                    var diff=hovered.filter(x => !oldunselected_columns.includes(x));//tout le selected en-dessous du hovered 
                    
                    if(diff.length==0){//pas de selected en dessous du hovered
                        //---------------ILE
                        //ni le départ ni l'arrivée est dans la sélection précédente, et nous n'avons pas survolé une ancienne sélection : nouvelle sélection
                        //que l'on sélectionne à côté ou par dessus
                    
                        //supression des doublons au cas où on a sélectionné par dessus
                        var newselected_columns = getUniqueValues(oldselected_columns.concat(hovered));
                        var newunselected_columns = collist.filter(x => !newselected_columns.includes(x));
                        //on concatène, car on ne veut pas écraser la potentielle sélection précédente

                        if(newselected_columns.length==p){//si toutes les colonnes sont sélectionnées, toutes les lignes (sélectionnables) aussi
                            var newunselected=[];
                            var newselected=rowlist;
                        }

                    } else {

                    //---------------SNOW STORM
                    //ni le départ ni l'arrivée est dans la sélection précédente, on a recouvert une ancienne sélection : déselection
                    //que l'on sélectionne à côté ou par dessus
                    var newunselected_columns = oldunselected_columns.concat(hovered);//on ajoute le survol aux précédentes non-sélections
                    //supression des doublons au cas où on a sélectionné par dessus
                    newunselected_columns = getUniqueValues(newunselected_columns);
                    newselected_columns = collist.filter(x => !newunselected_columns.includes(x));
                    //on concatène, car on ne veut pas écraser la potentielle sélection précédente
                    
                    }
                    
                }
                
            }
            
        }

        
        if(newselected_columns.length==p){
            corner.style("fill",selectedColor).attr("state","selected");
        } else {
            corner.style("fill",unselectedColor).attr("state","unselected");
        }

    }

    return {newselected,newunselected,newselected_columns,newunselected_columns};//values ??
  
}
  
  
  
  
  
                                //------------------------------------------------------------------------//
                                //                                                                        //
                                //                      COLUMNS TABLE + MINITABLE                         //
                                //                                                                        //
                                //------------------------------------------------------------------------//
function selectionLogic1DColumns(parent,hovered,start,end,mode){
    if(mode=="none"){
        
        var collist = parent.attr("colList").split(',').map(Number);
        
        //---------------ILE
        //ni le départ ni l'arrivée est dans la sélection précédente, et nous n'avons pas survolé une ancienne sélection : nouvelle sélection
        //que l'on sélectionne à côté ou par dessus
        var newselected = hovered;
        //supression des doublons au cas où on a sélectionné par dessus
        newselected = getUniqueValues(newselected);
        newunselected = collist.filter(x => !newselected.includes(x));
        //on concatène, car on ne veut pas écraser la potentielle sélection précédente

        
        return {newselected,newunselected};
    }
    if(mode=="finger"){
        //start, end : row id
        //ça bug si le vecteur n'existe pas, il crée un vecteur [0].
        //les tests suivants servent à créer un vecteur [] au cas où il n'a rien attrapé.
        var oldselected = parent.attr("selected_columns")
        if(oldselected.length!=0){
            oldselected=oldselected.split(',').map(Number);
        } else {
            oldselected=[];
        }
        var oldunselected = parent.attr("unselected_columns")
        if(oldunselected.length!=0){
            oldunselected=oldunselected.split(',').map(Number);
        } else {
            oldunselected=[];
        }
        
        
        var rowlist = parent.attr("colList").split(',').map(Number);
        
        if(oldselected.includes(start)){//si on part de l'intérieur
            
            if(oldselected.includes(end)){//et qu'on arrive à l'intérieur
                var diff=hovered.filter(x => !oldselected.includes(x));//tout le unselected en-dessous du hovered 
                
                if(diff.length==0){//si l'on est resté à l'intérieur d'une sélection

                    //-------------MOISE
                    //dans le cas où les deux sont à l'intérieur, on fait une Moïse
                    //on creuse la sélection précédente
                    var newunselected = oldunselected.concat(hovered);
                    //on enlève les doublons, puisqu'il y a chevauchement
                    newunselected = getUniqueValues(newunselected);
                    newselected = rowlist.filter(x => !newunselected.includes(x));
                    
                } else {

                    //-------------PONT
                    var newselected = oldselected.concat(hovered);
                    //supression des doublons au cas où on a sélectionné par dessus
                    newselected = getUniqueValues(newselected);
                    newunselected = rowlist.filter(x => !newselected.includes(x));
                    //on concatène, car on ne veut pas écraser la potentielle sélection précédente
                    
                }
                
            } else {//si on arrive à l'extérieur

                //--------------POUTINE
                //sinon, on étend la sélection
                var newselected = oldselected.concat(hovered);
                //on enlève les doublons, puisqu'il y a chevauchement
                
                newselected = getUniqueValues(newselected);
                newunselected = rowlist.filter(x => !newselected.includes(x));
                
         
                
            }
        } else {//si on part de l'extérieur
            if(oldselected.includes(end)){//et qu'on arrive à l'intérieur

                //----------------LEMMINGS
                //on creuse la sélection précédente
                var newunselected = oldunselected.concat(hovered);
                //on enlève les doublons, puisqu'il y a chevauchement
                newunselected = getUniqueValues(newunselected);
                newselected = rowlist.filter(x => !newunselected.includes(x));
                
                
            } else {//si on arrive à l'extérieur

            //pas d'ile

                //---------------SNOW STORM
                //ni le départ ni l'arrivée est dans la sélection précédente, on a recouvert une ancienne sélection : déselection
                //que l'on sélectionne à côté ou par dessus
                var newunselected = oldunselected.concat(hovered);//on ajoute le survol aux précédentes non-sélections
                //supression des doublons au cas où on a sélectionné par dessus
                newunselected = getUniqueValues(newunselected);
                newselected = rowlist.filter(x => !newunselected.includes(x));
                //on concatène, car on ne veut pas écraser la potentielle sélection précédente
                

                
            }
            
            
        }
        
        
        return {newselected,newunselected};
    }

}



                                //------------------------------------------------------------------------//
                                //                                                                        //
                                //                              VALUES TABLE                              //
                                //                                                                        //
                                //------------------------------------------------------------------------//
function selectionLogic2D(parent,hoveredX,hoveredY,start,end,mode){
//start, end = [x,y]

    if(mode=="none"){//nouvelle sélection

        var newselected=[];//on s'occupera des rows qui sont aussi dans excluded apres
        var newunselected=getVector(parent.attr("rowList"));//on s'occupera des elements qui sont aussi dans excluded apres

        var newselected_columns=[];
        var newunselected_columns=getVector(parent.attr("colList"));
        //les colonnes ne peuvent pas être excluded

        if(hoveredX.length==p){
            //parent.attr("selected")=hoveredY;
            newselected=hoveredY;//les rows sont entières donc exceptionnellement newselected n'est pas vide
            //parent.attr("unselected")=getVector(parent.attr("unselected")).filter(x => !hoveredY.includes(x));
            newunselected=newunselected.filter(x => !hoveredY.includes(x));//il faut aussi mettre à jour 
            //regulation des valeurs exclues
           
            }
        if(hoveredY.length==n){//pareil lorsque les colonnes sont entières
            //parent.attr("selected_columns")=hoveredX;
            newselected_columns=hoveredX;
            //parent.attr("unselected_columns")=getVector(parent.attr("unselected_columns")).filter(x => !hoveredX.includes(x));
            newunselected_columns=newunselected_columns.filter(x => !hoveredX.includes(x));
            //les colonnes ne peuvent pas etre exclues
            }
        
        var newselected_values=[];//on s'occupera des elements qui sont aussi dans excluded apres

        //d3.selectAll(".cellrow").attr("state","")
        for(i=0;i<hoveredY.length;i++){
            for(j=0;j<hoveredX.length;j++){   
                newselected_values.push(hoveredY[i]+","+hoveredX[j]);
            }
        }
        

        var newunselected_values=TOTAL_VALUES.filter(x => !newselected_values.includes(x));//on s'occupera des elements qui sont aussi dans excluded apres
       
        return {newselected,newunselected,newselected_columns,newunselected_columns,newselected_values,newunselected_values};



    } 
    if(mode=="finger"){
        
    }

}

function selectAllEqualValues(parent,hoveredX,hoveredY,start,end,mode){
    //start, end = [x,y]
    
    if(mode=="none"){//nouvelle sélection

        var newselected=[];//on s'occupera des rows qui sont aussi dans excluded apres
        var newunselected=getVector(parent.attr("rowList"));//on s'occupera des elements qui sont aussi dans excluded apres

        var newselected_columns=[];
        var newunselected_columns=getVector(parent.attr("colList"));
        //les colonnes ne peuvent pas être excluded

        if(hoveredX.length==p){
            //parent.attr("selected")=hoveredY;
            newselected=hoveredY;//les rows sont entières donc exceptionnellement newselected n'est pas vide
            //parent.attr("unselected")=getVector(parent.attr("unselected")).filter(x => !hoveredY.includes(x));
            newunselected=newunselected.filter(x => !hoveredY.includes(x));//il faut aussi mettre à jour 
           
            }
        if(hoveredY.length==n){//pareil lorsque les colonnes sont entières
            //parent.attr("selected_columns")=hoveredX;
            newselected_columns=hoveredX;
            //parent.attr("unselected_columns")=getVector(parent.attr("unselected_columns")).filter(x => !hoveredX.includes(x));
            newunselected_columns=newunselected_columns.filter(x => !hoveredX.includes(x));
            //les colonnes ne peuvent pas etre exclues
            }
        
        var newselected_values=[];//on s'occupera des elements qui sont aussi dans excluded apres

        var value = d3.select("#r"+hoveredY[0]).selectAll(".cell").filter(function(){
            return d3.select(this).attr("columnId")==hoveredX[0];
        }).select("text").text();
       
        
        d3.selectAll(".row").each(function(d,i){
            var thisValue = d3.select("#r"+i).selectAll(".cell").filter(function(){
                return d3.select(this).attr("columnId")==hoveredX[0];
            }).select("text").text();
            if(thisValue==value){
                newselected_values.push(i+","+hoveredX[0]);
            }
        })
       
        
        var newunselected_values=TOTAL_VALUES.filter(x => !newselected_values.includes(x));//on s'occupera des elements qui sont aussi dans excluded apres

        return {newselected,newunselected,newselected_columns,newunselected_columns,newselected_values,newunselected_values};



    } 
    if(mode=="finger"){
        
    }

}


function selectAllRowsWithEqualValues(parent,hoveredX,hoveredY,start,end,mode){
    //start, end = [x,y]
    
    if(mode=="none"){//nouvelle sélection
        var rowlist=getVector(parent.attr("rowList"));
        var newselected=[];//on s'occupera des rows qui sont aussi dans excluded apres
        var newunselected=rowlist;//on s'occupera des elements qui sont aussi dans excluded apres

        var newselected_columns=[];
        var newunselected_columns=getVector(parent.attr("colList"));
    

        var value = d3.select("#r"+hoveredY[0]).selectAll(".cell").filter(function(){
            return d3.select(this).attr("columnId")==hoveredX[0];
        }).select("text").text();
        
        
        d3.selectAll(".row").each(function(d,i){
            var thisValue = d3.select("#r"+i).selectAll(".cell").filter(function(){
                return d3.select(this).attr("columnId")==hoveredX[0];
            }).select("text").text();
            if(thisValue==value){
                newselected.push(i);
            }
        })

        
        var newunselected = rowlist.filter(x => !newselected.includes(x));


        return {newselected,newunselected,newselected_columns,newunselected_columns};

    } 
    if(mode=="finger"){
        
    }

}





                                //------------------------------------------------------------------------//
                                //                                                                        //
                                //                               MINIPLOTS                                //
                                //                                                                        //
                                //------------------------------------------------------------------------//
function selectionLogicOnMiniDensityplot(parent,hovered,start,end){
    //start, end : row id
    //pour les boxplots, donc il n'y a que du selected et unselected
  
    var oldselected = getVector(parent.attr("values_selected"));//axis, not row
    
    var oldunselected = getVector(parent.attr("values_unselected"))//attention, dans les values unselected il y a des NAs
   
    var rowlist = getVector(parent.attr("values"));
  
    if(oldselected.includes(start)){//si on part de l'intérieur
        
        if(oldselected.includes(end)){//et qu'on arrive à l'intérieur
            var diff=hovered.filter(x => !oldselected.includes(x));//tout le unselected en-dessous du hovered 
            
            if(diff.length==0){//si l'on est resté à l'intérieur d'une sélection
                
                //-------------MOISE
                //dans le cas où les deux sont à l'intérieur, on fait une Moïse
                //on creuse la sélection précédente
                var newunselected = oldunselected.concat(hovered);
                //on enlève les doublons, puisqu'il y a chevauchement
                newunselected = getUniqueValues(newunselected);
                newselected = rowlist.filter(x => !newunselected.includes(x));
                
            } else {
  
                //-------------PONT
                var newselected = oldselected.concat(hovered);
                //supression des doublons au cas où on a sélectionné par dessus
                newselected = getUniqueValues(newselected);
                newunselected = rowlist.filter(x => !newselected.includes(x));
                //on concatène, car on ne veut pas écraser la potentielle sélection précédente
                
            }
            
        } else {//si on arrive à l'extérieur
  
            //--------------POUTINE
            //sinon, on étend la sélection
            var newselected = oldselected.concat(hovered);
            //on enlève les doublons, puisqu'il y a chevauchement
            
            newselected = getUniqueValues(newselected);
            newunselected = rowlist.filter(x => !newselected.includes(x));
            
            //EXCLUDED a venir : il faudra virer du hover ce qui est présent dans excluded
            //unselected, c'est rowlist - selected - excluded
            
        }
    } else {//si on part de l'extérieur
        if(oldselected.includes(end)){//et qu'on arrive à l'intérieur
  
            //----------------LEMMINGS
            //on creuse la sélection précédente
            var newunselected = oldunselected.concat(hovered);
            //on enlève les doublons, puisqu'il y a chevauchement
            newunselected = getUniqueValues(newunselected);
            newselected = rowlist.filter(x => !newunselected.includes(x));
            
            
        } else {//si on arrive à l'extérieur
  
          var diff=hovered.filter(x => !oldunselected.includes(x));//tout le selected en-dessous du hovered 
            
            if(diff.length==0){//pas de selected en dessous du hovered
              
              //---------------ILE
              //ni le départ ni l'arrivée est dans la sélection précédente, et nous n'avons pas survolé une ancienne sélection : nouvelle sélection
              //que l'on sélectionne à côté ou par dessus
              var newselected = oldselected.concat(hovered);
              //supression des doublons au cas où on a sélectionné par dessus
              newselected = getUniqueValues(newselected);
              newunselected = rowlist.filter(x => !newselected.includes(x));
              //on concatène, car on ne veut pas écraser la potentielle sélection précédente
              
            } else {
              
              //---------------SNOW STORM
              //ni le départ ni l'arrivée est dans la sélection précédente, on a recouvert une ancienne sélection : déselection
              //que l'on sélectionne à côté ou par dessus
              var newunselected = oldunselected.concat(hovered);
              //supression des doublons au cas où on a sélectionné par dessus
              newunselected = getUniqueValues(newunselected);
              newselected = rowlist.filter(x => !newunselected.includes(x));
              //on concatène, car on ne veut pas écraser la potentielle sélection précédente
              
  
  
            }
        }
        
        
    }
    //adaptateur
   
    var values_newselected = newselected;
    var values_newunselected = newunselected;
    
    
  
    return {values_newselected,values_newunselected};
  
  
  
  
  }
  

function selectionLogicOnMiniBoxplot(parent,quartiles,start,end){
//start, end : row id
//pour les boxplots, donc il n'y a que du selected et unselected

    var oldselected = getVector(parent.attr("values_selected"));//axis, not row

    var oldunselected = getVector(parent.attr("values_unselected"));

    var rowlist = getVector(parent.attr("values"));

    if(end<start){//cas inverse
        var axisMin=end;
        var axisMax=start;
    } else {
        var axisMin=start;
        var axisMax=end;
    }
    
    var plainquartiles=[]//on retrouve les valeurs a partir de quartiles
    for(i=0;i<quartiles.length;i++){
        plainquartiles=plainquartiles.concat(quartiles[i]);
    }
   
    var min=0;
    var max=0;
    for(i=0;i<plainquartiles.length;i++){
        if(plainquartiles[i]<=axisMax){
            max=plainquartiles[i];//on récupère la première valeur avant le axismax, ce qui nous permettra d'avoir le groupe de départ et d'arrivée
        }
    }
    for(i=plainquartiles.length-1;i>=0;i--){
        if(plainquartiles[i]>=axisMin){
            min=plainquartiles[i];
        }
    }


    for(i=0;i<quartiles.length;i++){//on récupère les indices des groupes d'où on est parti et arrivé
        if(quartiles[i].includes(min)){
            var idxMin = i;//ne peut pas etre 0 ?
        }
        if(quartiles[i].includes(max)){
            var idxMax = i;//ne peut pas etre 8 ?
        }
    }


    var brush=[];
    for(i=idxMin;i<=idxMax;i++){
        brush = brush.concat(quartiles[i]);//on crée un vecteur hovered, qui contient plus grossièrement les groupes de départ et d'arrivée
    }//normalement si c'est le même indic ça ne le fait qu'une fois, donc pas besoin de getuniquevalues ?





    var hovered = rowlist.filter(x => (x >= d3.min(brush) && x <= d3.max(brush))) ;
                    

    if(oldselected.includes(start)){//si on part de l'intérieur

        
        if(oldselected.includes(end)){//et qu'on arrive à l'intérieur
        var diff=hovered.filter(x => !oldselected.includes(x));//tout le unselected en-dessous du hovered 
        
            if(diff.length==0){//si l'on est resté à l'intérieur d'une sélection
                
                //-------------MOISE
                //dans le cas où les deux sont à l'intérieur, on fait une Moïse
                //on creuse la sélection précédente
                var newunselected = oldunselected.concat(hovered);
                //on enlève les doublons, puisqu'il y a chevauchement
                newunselected = getUniqueValues(newunselected);
                newselected = rowlist.filter(x => !newunselected.includes(x));
                
            } else {

                //-------------PONT
                var newselected = oldselected.concat(hovered);
                //supression des doublons au cas où on a sélectionné par dessus
                newselected = getUniqueValues(newselected);
                newunselected = rowlist.filter(x => !newselected.includes(x));
                //on concatène, car on ne veut pas écraser la potentielle sélection précédente
                
            }
            
        } else {//si on arrive à l'extérieur

            //--------------POUTINE
            //sinon, on étend la sélection
            var newselected = oldselected.concat(hovered);
            //on enlève les doublons, puisqu'il y a chevauchement
            
            newselected = getUniqueValues(newselected);
            newunselected = rowlist.filter(x => !newselected.includes(x));
            
            //EXCLUDED a venir : il faudra virer du hover ce qui est présent dans excluded
            //unselected, c'est rowlist - selected - excluded
            
        }
    } else {//si on part de l'extérieur
        if(oldselected.includes(end)){//et qu'on arrive à l'intérieur

            //----------------LEMMINGS
            //on creuse la sélection précédente
            var newunselected = oldunselected.concat(hovered);
            //on enlève les doublons, puisqu'il y a chevauchement
            newunselected = getUniqueValues(newunselected);
            newselected = rowlist.filter(x => !newunselected.includes(x));
            
            
        } else {//si on arrive à l'extérieur

        var diff=hovered.filter(x => !oldunselected.includes(x));//tout le selected en-dessous du hovered 
            
            if(diff.length==0){//pas de selected en dessous du hovered
                
                //---------------ILE
                //ni le départ ni l'arrivée est dans la sélection précédente, et nous n'avons pas survolé une ancienne sélection : nouvelle sélection
                //que l'on sélectionne à côté ou par dessus
                var newselected = oldselected.concat(hovered);
                //supression des doublons au cas où on a sélectionné par dessus
                newselected = getUniqueValues(newselected);
                newunselected = rowlist.filter(x => !newselected.includes(x));
                //on concatène, car on ne veut pas écraser la potentielle sélection précédente
                
            } else {
                
                //---------------SNOW STORM
                //ni le départ ni l'arrivée est dans la sélection précédente, on a recouvert une ancienne sélection : déselection
                //que l'on sélectionne à côté ou par dessus
                var newunselected = oldunselected.concat(hovered);
                //supression des doublons au cas où on a sélectionné par dessus
                newunselected = getUniqueValues(newunselected);
                newselected = rowlist.filter(x => !newunselected.includes(x));
                //on concatène, car on ne veut pas écraser la potentielle sélection précédente
            


            }
        }
        
        
    }
    //adaptateur
    var values_newselected = newselected;
    var values_newunselected = newunselected;
   
    return {values_newselected,values_newunselected};




}
          
  

function selectionLogicOnMiniBarChart(parent,start,end){
    //start, end : row id
    //pour les boxplots, donc il n'y a que du selected et unselected
    if(start<end){var hovered=range(start,end)}
    if(start>end){var hovered=range(end,start)}
    if(start==end){var hovered=[start]}//ok i guess

    var oldselected = getVector(parent.attr("barnums_selected"));//axis, not row
    
    var oldunselected = getVector(parent.attr("barnums_unselected"));
  
    var rowlist = getVector(parent.attr("barnums"));
  
    if(oldselected.includes(start)){//si on part de l'intérieur
        
        if(oldselected.includes(end)){//et qu'on arrive à l'intérieur
            var diff=hovered.filter(x => !oldselected.includes(x));//tout le unselected en-dessous du hovered 
            
            if(diff.length==0){//si l'on est resté à l'intérieur d'une sélection
                
                //-------------MOISE
                //dans le cas où les deux sont à l'intérieur, on fait une Moïse
                //on creuse la sélection précédente
                var newunselected = oldunselected.concat(hovered);
                //on enlève les doublons, puisqu'il y a chevauchement
                newunselected = getUniqueValues(newunselected);
                newselected = rowlist.filter(x => !newunselected.includes(x));
                
            } else {
  
                //-------------PONT
                var newselected = oldselected.concat(hovered);
                //supression des doublons au cas où on a sélectionné par dessus
                newselected = getUniqueValues(newselected);
                newunselected = rowlist.filter(x => !newselected.includes(x));
                //on concatène, car on ne veut pas écraser la potentielle sélection précédente
                
            }
            
        } else {//si on arrive à l'extérieur
  
            //--------------POUTINE
            //sinon, on étend la sélection
            var newselected = oldselected.concat(hovered);
            //on enlève les doublons, puisqu'il y a chevauchement
            
            newselected = getUniqueValues(newselected);
            newunselected = rowlist.filter(x => !newselected.includes(x));
            
            //EXCLUDED a venir : il faudra virer du hover ce qui est présent dans excluded
            //unselected, c'est rowlist - selected - excluded
            
        }
    } else {//si on part de l'extérieur
        if(oldselected.includes(end)){//et qu'on arrive à l'intérieur
  
            //----------------LEMMINGS
            //on creuse la sélection précédente
            var newunselected = oldunselected.concat(hovered);
            //on enlève les doublons, puisqu'il y a chevauchement
            newunselected = getUniqueValues(newunselected);
            newselected = rowlist.filter(x => !newunselected.includes(x));
            
            
        } else {//si on arrive à l'extérieur
  
          var diff=hovered.filter(x => !oldunselected.includes(x));//tout le selected en-dessous du hovered 
            
            if(diff.length==0){//pas de selected en dessous du hovered
              
              //---------------ILE
              //ni le départ ni l'arrivée est dans la sélection précédente, et nous n'avons pas survolé une ancienne sélection : nouvelle sélection
              //que l'on sélectionne à côté ou par dessus
              var newselected = oldselected.concat(hovered);
              //supression des doublons au cas où on a sélectionné par dessus
              newselected = getUniqueValues(newselected);
              newunselected = rowlist.filter(x => !newselected.includes(x));
              //on concatène, car on ne veut pas écraser la potentielle sélection précédente
              
            } else {
              
              //---------------SNOW STORM
              //ni le départ ni l'arrivée est dans la sélection précédente, on a recouvert une ancienne sélection : déselection
              //que l'on sélectionne à côté ou par dessus
              var newunselected = oldunselected.concat(hovered);
              //supression des doublons au cas où on a sélectionné par dessus
              newunselected = getUniqueValues(newunselected);
              newselected = rowlist.filter(x => !newunselected.includes(x));
              //on concatène, car on ne veut pas écraser la potentielle sélection précédente
              
  
  
            }
        }
        
        
    }
    //adaptateur
    var axis_newselected = newselected;
    var axis_newunselected = newunselected;
  
    return {axis_newselected,axis_newunselected};
  
  
  
  
  }
  //?
function totalSelectionOnMiniPlotFromCorner(miniboxplot,newaxis,newselected,ptd,side){//updates miniboxplot ATTRIBUTES and PIXELS based on the new vectors
  
    miniboxplot.attr("axis_selected",newaxis.axis_newselected);
    miniboxplot.attr("axis_unselected",newaxis.axis_newunselected);
    
    ///-------------STEP------------
    if(miniboxplot.attr("axisList").split(",").map(Number).length>1){
        var axislist = miniboxplot.attr("axisList").split(",").map(Number);
        var step = DensityAxisToPixels(ptd,axislist[0])-DensityAxisToPixels(ptd,axislist[1]);//l'écart élémentaire entre deux ticks en pixels
      
    } else {
        console.log("oof")
    }
    
  
    var newselectedpix=[];
   
    for(i=0;i<newaxis.axis_newselected.length;i++){
        newselectedpix.push(DensityAxisToPixels(ptd,newaxis.axis_newselected[i]));
        
    }
  
    //newselected=newselected.split(",").map(Number);
  
  
    var padding = parseFloat(miniboxplot.attr("padding"));
    var width = parseFloat(miniboxplot.attr("width"));
  
    miniboxplot.selectAll(".miniRect").remove();
  
    if(side=="density"){
        miniboxplot.selectAll(".miniRect").data(newselectedpix)
                    .enter()
                    .append("rect").attr("class", "miniRect")
                    .attr("x",padding/2)
                    .attr("y",d => padding+d)
                    .attr("width", width/2-padding/2)
                    .attr("height", step)
                    .attr("state","selected")
                    .style("fill",selectedColor)
                    .style("opacity",0.5);
    }
    if(side=="box"){
        miniboxplot.selectAll(".miniRect").data(newselectedpix)
                    .enter()
                    .append("rect").attr("class", "miniRect")
                    .attr("x",width/2)
                    .attr("y",d => padding+d)
                    .attr("width", width/2-padding/2)
                    .attr("height", step)
                    .attr("state","selected")
                    .style("fill",selectedColor)
                    .style("opacity",0.5);
    }
  
    
  
                //suppression des rect qui bug
    miniboxplot.selectAll(".miniRect").filter(function(){
                                        return d3.select(this).attr("y")==NaN;
                                      }).remove();
  
    var rowlist = miniboxplot.attr("rowList").split(",").map(Number);
  
    var newunselected = rowlist.filter(x => !newselected.includes(x));
  
    miniboxplot.attr("selected",newselected);
    miniboxplot.attr("unselected",newunselected);
  
  
  
}








