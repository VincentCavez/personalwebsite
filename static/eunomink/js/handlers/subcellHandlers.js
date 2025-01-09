
function subcellPicker(event){

    var textToSelect = null;//local
    var textPlane = d3.selectAll(".sc_principal,.sc_secondary");
//attention au text anchor middle
    textPlane.each(function(){
        
        var left_sc=Number(d3.select(this).attr("x"));
        var right_sc=left_sc+Number(d3.select(this).attr("width"));
        var top_sc=Number(d3.select(this).attr("y"));
        var bottom_sc=top_sc+Number(d3.select(this).attr("height"));
       
        if(event.clientX-tableContainer.node().getBoundingClientRect().left-50>left_sc && event.clientX-tableContainer.node().getBoundingClientRect().left-50<right_sc && event.clientY-tableContainer.node().getBoundingClientRect().top-30>top_sc && event.clientY-tableContainer.node().getBoundingClientRect().top-30<bottom_sc){
            textToSelect=d3.select(this);
        }
        
    })
    return textToSelect;
}

function subcellHandler(){
    
    deselect_table(table)
    var ink_svg = inkDrawing_to_SVG("blue");
    inkNature(ink_svg,"transient");

    var textToSelect=textPicker();
    var rowId = parseInt(textToSelect.attr("rowId"));
    var colId = parseInt(textToSelect.attr("columnId"));
    
    var boxWidth=1.5;

    var textWidth = textToSelect.node().getBoundingClientRect().right-textToSelect.node().getBoundingClientRect().left;
    var textHeight = textToSelect.node().getBoundingClientRect().bottom-textToSelect.node().getBoundingClientRect().top;
    var cellHeight = parseFloat(d3.select(".cell").select("rect").attr("height"));//constante

    var baseCell = get_x_transform( d3.select("#r"+rowId).selectAll(".cell").filter(function(){
                                                                                return parseFloat(d3.select(this).attr("columnId"))==colId;
                                                                            }));
    var textAnchor = parseFloat(textToSelect.attr("x"))+baseCell;

    
    
    var offsetX = get_x_transform(table);
    var offsetY = get_y_transform(table);

    var textLeft = x_margin+textAnchor - textWidth/2+offsetX;//car textAnchor c'est la coord du milieu
    var textBottom = y_margin+parseFloat(textToSelect.attr("y"))+rowId*cellHeight+offsetY;//tableContainer_top+

    var midX=d3.mean(inkVector.x)-textLeft-tableContainer_left;
    var midY=d3.mean(inkVector.y);

    
    var cumulatedAnchors=[0];
    for(i=0;i<textToSelect.text().length;i++){
        cumulatedAnchors.push(charactersToPixels.get(textToSelect.text()[i])+cumulatedAnchors[i]);
    }
    //cursor

    
    //attention, ici la ligne est verticale
    //------------------------------------------------------------//
    //                   Caret + edition bubble                   //
    //------------------------------------------------------------//
    if(inkClassifier()=="subcell_line"){//pos : indice du premier caractère après la séparation
        
    
        //initialisations
        var diff=Math.abs(cumulatedAnchors[0]-midX);
        var wantedX=cumulatedAnchors[0];
        var pos=0;
        //recherche du point le plus près de relative_ClientX
        for(i=1;i<cumulatedAnchors.length;i++){
            var newdiff=Math.abs(cumulatedAnchors[i]-midX);

            if(newdiff<diff){
                diff=Math.abs(cumulatedAnchors[i]-midX);
                wantedX=cumulatedAnchors[i];
                pos=i;
            }
        }
    
        d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
        
        objectOverText(textToSelect,cumulatedAnchors[pos],cumulatedAnchors[pos],"caret","none","principal",pos,pos)
        

    }

   
    //cursor area
    if(inkClassifier()=="subcell_circle"){//pos1 est l'indice du caractère de gauche, pos2 de droite
    

        var left_ink=d3.min(inkVector.x)-textLeft-tableContainer_left;
        var right_ink=d3.max(inkVector.x)-textLeft-tableContainer_left;
        

        //initialisations
        var diff=Math.abs(cumulatedAnchors[0]-left_ink);
        var estimated_left=cumulatedAnchors[0];
        var pos1=0;
        //recherche du point le plus près de relative_ClientX
        for(i=1;i<cumulatedAnchors.length;i++){
            var newdiff=Math.abs(cumulatedAnchors[i]-left_ink);

            if(newdiff<diff){
                diff=Math.abs(cumulatedAnchors[i]-left_ink);
                estimated_left=cumulatedAnchors[i];
                pos1=i;
            }
        }
        
        //initialisations
        var diff=Math.abs(cumulatedAnchors[0]-right_ink);
        var estimated_right=cumulatedAnchors[0];
        var pos2=0;
        //recherche du point le plus près de relative_ClientX
        for(i=1;i<cumulatedAnchors.length;i++){
            var newdiff=Math.abs(cumulatedAnchors[i]-right_ink);

            if(newdiff<diff){
                diff=Math.abs(cumulatedAnchors[i]-right_ink);
                estimated_right=cumulatedAnchors[i];
                pos2=i;
            }
        }
       
        
        d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
        //trois situations : selection totale, double selection, triple selection
        //one ink box
        if(pos1==0 && pos2==cumulatedAnchors.length-1){
     
            objectOverText(textToSelect,0,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","whole","principal",0,cumulatedAnchors.length-2)
            
        }
        //two ink boxes
        if((pos1==0 && pos2<cumulatedAnchors.length-1 && pos1!=pos2)||(pos1>0 && pos2==cumulatedAnchors.length-1 && pos1!=pos2)){//si on a fait de gauche à milieu ou de milieu à droite
            if(pos1==0){
                var wantedX=estimated_right;
                //LEFT
                objectOverText(textToSelect,0,wantedX,"highlight","left_seq","principal",0,pos2-1)
                                                
                //RIGHT
                objectOverText(textToSelect,wantedX,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",pos2,cumulatedAnchors.length-2)

            } else {
                var wantedX=estimated_left;
                //LEFT
                objectOverText(textToSelect,0,wantedX,"highlight","left_seq","secondary",0,pos1-1)
                                                
                //RIGHT
                objectOverText(textToSelect,wantedX,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","principal",pos1,cumulatedAnchors.length-2)
            }//on récupère le point du milieu

            
                                                     
        }
        //three ink boxes
        if(pos1!=0 && pos2!=cumulatedAnchors.length-1){//si on a fait une selection au milieu
             
            //LEFT
            objectOverText(textToSelect,0,estimated_left,"highlight","left_seq","secondary",0,pos1-1)

            //MIDDLE
            if(pos2-pos1==1){
                objectOverText(textToSelect,estimated_left,estimated_right,"highlight","middle_char","principal",pos1,pos2-1)
            } else {
                objectOverText(textToSelect,estimated_left,estimated_right,"highlight","middle_seq","principal",pos1,pos2-1)
            }
                                        
            //RIGHT
            objectOverText(textToSelect,estimated_right,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",pos2,cumulatedAnchors.length-2)                                              
                                      
        }
      
    }
}




function generalization(authentic_subcell,row_first=0,row_last=n){

    //-----------------------------------------------------------------------------------------------------------//
    //                                                                                                           //
    //                                GENERALISATION AU RESTE DE LA COLONNE                                      //
    //                                                                                                           //
    //-----------------------------------------------------------------------------------------------------------//
    
    
    var side = authentic_subcell.attr("side")
    var rowId = Number(authentic_subcell.attr("rowId"))
    var colId = Number(authentic_subcell.attr("columnId"))
    
    var pos1=Number(authentic_subcell.attr("pos1"))
    var pos2=Number(authentic_subcell.attr("pos2"))
    var textToSelect = d3.select("#r"+rowId).select("#c"+colId).select("text");
    
    var startPos=pos1;
    var endPos=pos2;
    
    
    d3.selectAll(".sc_principal").remove()
    d3.selectAll(".sc_secondary").remove()

    var selectedTexts=d3.selectAll("#c"+colId).selectAll(".textcell").filter(function(){
                                                                        var rd=parseInt(d3.select(this).attr("rowId"));
                                                                        return rd>=row_first && rd<=row_last;
                                                                        })
                   

    
    //----------------------------------------------LEFT, ONE OR SEVERAL CHARACTERS------------MIDDLE, ONE CHARACTER--------------------------------//
   
    if((side=="middle_char") || (side=="left_seq")){
        //si c'est un seul caractère, il faut juste s'assurer que ce n'est pas le dernier (right)
        //dans tous les cas, on ne veut pas toucher le dernier caractère.
        //on veut soit un seul caractère, soit plusieurs depuis la gauche (possiblement un seul caractère à gauche)
        if(side=="left_seq"){
            var selectionSide="left";
            var lastChar = textToSelect.text()[endPos];
            var nextChar = textToSelect.text()[endPos+1];
        }
      
        if(side=="middle_char"){
            var selectionSide="middle";
            var lastChar = textToSelect.text()[endPos-1];//ici previous
            var nextChar = textToSelect.text()[endPos];//ici le caractere sur lequel on est
            //bien pour tout puisqu'on veut la transition précédente, sauf pour special character (et position), auquel cas on veut que nextChar soit prioritaire
        }//si c'est un caractère tout seul, il peut être middle
        
        
        var numOfOccurence=0;

        //------------------ANALYSE DE CE QUI EST SELECTIONNE------------------//

        if(charactersToType.get(lastChar)=="special" || charactersToType.get(nextChar)=="special"){
            
            if(selectionSide=="left"){

                //on préfère que le dernier char soit spécial plutot que le suivant, donc si les deux le sont, le dernier l'écrase.
                if(charactersToType.get(lastChar)=="special"){ //si les deux sont des caractères spéciaux, on priorise le dernier char de la selection plutot que le suivant
                    var charOfInterest=lastChar;
                    var lastOrNext = "last";
                 
                    
                } else {//si ce n'est pas le dernier c'est forcément le suivant
                    var charOfInterest=nextChar;
                    var lastOrNext = "next";
                  
                    numOfOccurence=1;//on le fait partir de 1 car le compteur n'arrivera pas au caractère "suivant", il lui faut de l'avance
                
                }
            } else {//sauf si le caractere special est la seule selection, auquel cas on le priorise lui (next) et ensuite on regarde le précédent (last)
                
                //on préfère que le dernier char soit spécial plutot que le suivant, donc si les deux le sont, le dernier l'écrase.
                if(charactersToType.get(nextChar)=="special"){ //si les deux sont des caractères spéciaux, on priorise le dernier char de la selection plutot que le suivant
                    var charOfInterest=nextChar;
                    var lastOrNext = "next";
                    
                } else {//si ce n'est pas le dernier c'est forcément le suivant
                    var charOfInterest=lastChar;
                    var lastOrNext = "last";
                    
                }
            }

            
            for(i=0;i<=endPos;i++){//quelle est son occurence : est-ce la première instance de ce caractère ou non ?
                if(textToSelect.text()[i]==charOfInterest){
                    numOfOccurence+=1;
                }
            }
            var trans="special";
            
            
        } else {

            
            if(charactersToType.get(nextChar)=="lowercase" || charactersToType.get(nextChar)=="uppercase"){//alpha
                if(charactersToType.get(lastChar)=="numeric"){
                    var trans="numToAlpha";
                    for(i=0;i<=endPos;i++){//quelle est son occurence ?
                        if(charactersToType.get(textToSelect.text()[i])=="numeric"){
                            if(charactersToType.get(textToSelect.text()[i+1])=="lowercase" || charactersToType.get(textToSelect.text()[i+1])=="uppercase"){
                                numOfOccurence+=1;
                            }
                        }
                    }

                } else {
                    if(charactersToType.get(nextChar)=="uppercase"){
                        if(charactersToType.get(lastChar)=="lowercase"){
                            var trans="lowerToUpper";
                            for(i=0;i<=endPos;i++){//quelle est son occurence ?
                                if(charactersToType.get(textToSelect.text()[i])=="lowercase"){
                                    if(charactersToType.get(textToSelect.text()[i+1])=="uppercase"){
                                        numOfOccurence+=1;
                                    }
                                }
                            }
                        } else {
                            var trans="position";//upper to upper
                        }
                    } else {//next is lower
                        if(charactersToType.get(lastChar)=="uppercase"){
                            var trans="upperToLower";
                            for(i=0;i<=endPos;i++){//quelle est son occurence ?
                                if(charactersToType.get(textToSelect.text()[i])=="uppercase"){
                                    if(charactersToType.get(textToSelect.text()[i+1])=="lowercase"){
                                        numOfOccurence+=1;
                                    }
                                }
                            }
                        } else {
                            var trans="position";//lower to lower
                        }
                    }
                }
            } else {//next is numeric
                if(charactersToType.get(lastChar)=="lowercase" || charactersToType.get(lastChar)=="uppercase"){//alpha
                    var trans="alphaToNum";
                    for(i=0;i<=endPos;i++){//quelle est son occurence ?
                        if(charactersToType.get(textToSelect.text()[i])=="lowercase" || charactersToType.get(textToSelect.text()[i])=="uppercase"){
                            if(charactersToType.get(textToSelect.text()[i+1])=="numeric"){
                                numOfOccurence+=1;
                            }
                        }
                    }
                } else {
                    var trans="position";//num to num
                    
                }
            }
            
        }

       
        
        if(selectedTexts._groups.length>=1){//s'il y a au moins une AUTRE cellule sélectionnée que la subcell
            if(trans=="special"){
                selectedTexts.each(function(){
                    
                    var cumulatedAnchors=[0];
                    for(j=0;j<d3.select(this).text().length;j++){
                        cumulatedAnchors.push(charactersToPixels.get(d3.select(this).text()[j])+cumulatedAnchors[j]);
                    }
                    //savoir si c'est une bulle, deux ou trois
                    //plus tard, si on change qq chose au texte, il faudra appliquer les memes changements aux textcolumn, pour l'instant on ne fait que de la sélection
                    
                    var count=0;//a priori si on est dans le cas middle on est dans le cas last
                    if(lastOrNext=="last"){//on cherche le pixel du caractère après celui-là si c'est last
                        for(i=0;i<d3.select(this).text().length-1;i++){
                            if(d3.select(this).text()[i]==charOfInterest){
                                count+=1;
                                if(count==numOfOccurence){
                                    var coord=cumulatedAnchors[i+1];
                                    var coordPos=i+1;
                                    if(selectionSide=="middle"){
                                        var coord=cumulatedAnchors[i+2];
                                        var coordPos=i+2;
                                        var coordMiddle=cumulatedAnchors[i+1];
                                        var coordMiddlePos=i+1;
                                    }
                                }
                            }
                        }
                    }
                    if(lastOrNext=="next"){//et le pixel du caractère si c'est next
                        for(i=0;i<d3.select(this).text().length-1;i++){
                            if(d3.select(this).text()[i]==charOfInterest){
                                count+=1;
                                if(count==numOfOccurence){
                                    var coord=cumulatedAnchors[i];
                                    var coordPos=i;
                                    if(selectionSide=="middle"){
                                        var coord=cumulatedAnchors[i+1];
                                        var coordPos=i+1;
                                        var coordMiddle=cumulatedAnchors[i];
                                        var coordMiddlePos=i;
                                    }
                                }
                            }
                        }
                    }
                    if(selectionSide=="left"){//si c'est left la première pos est 0 et il faut trouver la deuxieme
                        //LEFT
                        objectOverText(d3.select(this),0,coord,"highlight","left_seq","principal",0,coordPos-1)           
                        //RIGHT
                        objectOverText(d3.select(this),coord,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",coordPos,cumulatedAnchors.length-2)
                    }
                    
                    if(selectionSide=="middle"){//si c'est middle (element unique) il faut trouver les deux positions
                        
                        //LEFT
                        objectOverText(d3.select(this),0,coordMiddle,"highlight","left_seq","secondary",0,coordMiddlePos-1)
                        //MIDDLE
                        objectOverText(d3.select(this),coordMiddle,coord,"highlight","middle_char","principal",coordMiddlePos,coordPos-1)
                        //RIGHT
                        objectOverText(d3.select(this),coord,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",coordPos,cumulatedAnchors.length-2)
                    }
                    
                })
            } else {
                selectedTexts.each(function(){
                    var cumulatedAnchors=[0];
                    for(j=0;j<d3.select(this).text().length;j++){
                        cumulatedAnchors.push(charactersToPixels.get(d3.select(this).text()[j])+cumulatedAnchors[j]);
                    }
                    //savoir si c'est une bulle, deux ou trois
                    //plus tard, si on change qq chose au texte, il faudra appliquer les memes changements aux textcolumn, pour l'instant on ne fait que de la sélection
                    
                    var count=0;
                    if(trans=="numToAlpha"){
                        for(i=0;i<d3.select(this).text().length-1;i++){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="numeric"){
                                
                                if(charactersToType.get(d3.select(this).text()[i+1])=="lowercase" || charactersToType.get(d3.select(this).text()[i+1])=="uppercase"){
                                    count+=1;
                                    
                                    if(count==numOfOccurence){
                                        var coord=cumulatedAnchors[i+1];
                                        var coordPos=i+1;
                                        if(selectionSide=="middle"){
                                            var coord=cumulatedAnchors[i+2];
                                            var coordPos=i+2;
                                            var coordMiddle=cumulatedAnchors[i+1];
                                            var coordMiddlePos=i+1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(trans=="alphaToNum"){
                        for(i=0;i<d3.select(this).text().length-1;i++){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="lowercase" || charactersToType.get(d3.select(this).text()[i])=="uppercase"){
                                if(charactersToType.get(d3.select(this).text()[i+1])=="numeric"){
                                    count+=1;
                                    if(count==numOfOccurence){
                                        var coord=cumulatedAnchors[i+1];
                                        var coordPos=i+1;
                                        if(selectionSide=="middle"){
                                            var coord=cumulatedAnchors[i+2];
                                            var coordPos=i+2;
                                            var coordMiddle=cumulatedAnchors[i+1];
                                            var coordMiddlePos=i+1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(trans=="lowerToUpper"){
                        for(i=0;i<d3.select(this).text().length-1;i++){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="lowercase"){
                                if(charactersToType.get(d3.select(this).text()[i+1])=="uppercase"){
                                    count+=1;
                                    if(count==numOfOccurence){
                                        var coord=cumulatedAnchors[i+1];
                                        var coordPos=i+1;
                                        if(selectionSide=="middle"){
                                            var coord=cumulatedAnchors[i+2];
                                            var coordPos=i+2;
                                            var coordMiddle=cumulatedAnchors[i+1];
                                            var coordMiddlePos=i+1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(trans=="upperToLower"){
                        for(i=0;i<d3.select(this).text().length-1;i++){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="uppercase"){
                                if(charactersToType.get(d3.select(this).text()[i+1])=="lowercase"){
                                    count+=1;
                                    if(count==numOfOccurence){
                                        var coord=cumulatedAnchors[i+1];
                                        var coordPos=i+1;
                                        if(selectionSide=="middle"){
                                            var coord=cumulatedAnchors[i+2];
                                            var coordPos=i+2;
                                            var coordMiddle=cumulatedAnchors[i+1];
                                            var coordMiddlePos=i+1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if(trans=="position"){
                        var coord=cumulatedAnchors[endPos+1];var coordPos=endPos+1;  var coordMiddle=cumulatedAnchors[endPos];var coordMiddlePos=endPos;
                    }
                    
                    
                    if(selectionSide=="left"){//si c'est left la première pos est 0 et il faut trouver la deuxieme  
                        //LEFT
                        objectOverText(d3.select(this),0,coord,"highlight","left_seq","principal",0,coordPos-1)                      
                        //RIGHT
                        objectOverText(d3.select(this),coord,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",coordPos,cumulatedAnchors.length-2)
                    }
                    
                    if(selectionSide=="middle"){//si c'est middle (element unique) il faut trouver les deux positions
                        //LEFT
                        objectOverText(d3.select(this),0,coordMiddle,"highlight","left_seq","secondary",0,coordMiddlePos-1)
                        //MIDDLE
                        objectOverText(d3.select(this),coordMiddle,coord,"highlight","middle_char","principal",coordMiddlePos,coordPos-1)
                        //RIGHT
                        objectOverText(d3.select(this),coord,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",coordPos,cumulatedAnchors.length-2)
                    }
                    
                })
            }


        }
        
    }//--------------------------------------------------------------------------------------------------------------------------//

















    //----------------------------------------------RIGHT, ONE OR SEVERAL CHARACTERS-----------------------------------------//
    //if(startPos!=0 && endPos==textToSelect.text().length-1){//on touche le bord droit et début exclu, sinon la sélection est totale
    if(side=="right_seq"){    
        var lastChar = textToSelect.text()[startPos];
        var nextChar = textToSelect.text()[startPos-1];//ATTENTION on part de la fin, donc nextChar est le premier char AVANT la sélection en partant de la droite
        var numOfOccurence=0;

        //------------------ANALYSE DE CE QUI EST SELECTIONNE------------------//

        if(charactersToType.get(lastChar)=="special" || charactersToType.get(nextChar)=="special"){

            if(charactersToType.get(lastChar)=="special"){ //si les deux sont des caractères spéciaux, on priorise le dernier char de la selection plutot que le suivant
                var charOfInterest=lastChar;
                var lastOrNext = "last";
                
            } else {
                var charOfInterest=nextChar;
                var lastOrNext = "next";
                
                numOfOccurence=1;//on le fait partir de 1 car le compteur n'arrivera pas au caractère "suivant", il lui faut de l'avance
            }
            
            
            
            for(i=textToSelect.text().length-1;i>=startPos;i--){//quelle est son occurence : est-ce la première instance de ce caractère ou non ?
                if(textToSelect.text()[i]==charOfInterest){
                    numOfOccurence+=1;
                }
            }
            var trans="special";
           
            
        } else {

            
            if(charactersToType.get(nextChar)=="lowercase" || charactersToType.get(nextChar)=="uppercase"){//alpha
                if(charactersToType.get(lastChar)=="numeric"){
                    var trans="numToAlpha";
                    for(i=textToSelect.text().length-1;i>=startPos;i--){//quelle est son occurence ?
                        if(charactersToType.get(textToSelect.text()[i])=="numeric"){
                            if(charactersToType.get(textToSelect.text()[i-1])=="lowercase" || charactersToType.get(textToSelect.text()[i-1])=="uppercase"){
                                numOfOccurence+=1;
                            }
                        }
                    }

                } else {
                    if(charactersToType.get(nextChar)=="uppercase"){
                        if(charactersToType.get(lastChar)=="lowercase"){
                            var trans="lowerToUpper";
                            for(i=textToSelect.text().length-1;i>=startPos;i--){//quelle est son occurence ?
                                if(charactersToType.get(textToSelect.text()[i])=="lowercase"){
                                    if(charactersToType.get(textToSelect.text()[i-1])=="uppercase"){
                                        numOfOccurence+=1;
                                    }
                                }
                            }
                        } else {
                            var trans="position";//upper to upper
                        }
                    } else {//next is lower
                        if(charactersToType.get(lastChar)=="uppercase"){
                            var trans="upperToLower";
                            for(i=textToSelect.text().length-1;i>=startPos;i--){//quelle est son occurence ?
                                if(charactersToType.get(textToSelect.text()[i])=="uppercase"){
                                    if(charactersToType.get(textToSelect.text()[i-1])=="lowercase"){
                                        numOfOccurence+=1;
                                    }
                                }
                            }
                        } else {
                            var trans="position";//lower to lower
                        }
                    }
                }
            } else {//next is numeric
                if(charactersToType.get(lastChar)=="lowercase" || charactersToType.get(lastChar)=="uppercase"){//alpha
                    var trans="alphaToNum";
                    for(i=textToSelect.text().length-1;i>=startPos;i--){//quelle est son occurence ?
                        if(charactersToType.get(textToSelect.text()[i])=="lowercase" || charactersToType.get(textToSelect.text()[i])=="uppercase"){
                            if(charactersToType.get(textToSelect.text()[i-1])=="numeric"){
                                numOfOccurence+=1;
                            }
                        }
                    }
                } else {
                    var trans="position";//num to num
                }
            }
            
        }
       
        
        
        //GENERALISATION
        
        
        if(selectedTexts._groups.length>=1){//s'il y a au moins une AUTRE cellule sélectionnée que la subcell
            if(trans=="special"){
                selectedTexts.each(function(){
                    var cumulatedAnchors=[0];
                    for(j=0;j<d3.select(this).text().length;j++){//a partir de la gauche quand meme
                        cumulatedAnchors.push(charactersToPixels.get(d3.select(this).text()[j])+cumulatedAnchors[j]);
                    }
                    //savoir si c'est une bulle, deux ou trois
                    //plus tard, si on change qq chose au texte, il faudra appliquer les memes changements aux textcolumn, pour l'instant on ne fait que de la sélection
                    
                    var count=0;
                  
                    if(lastOrNext=="last"){//on cherche le pixel du caractère après celui-là
                        for(i=d3.select(this).text().length-1;i>=0;i--){
                            
                            if(d3.select(this).text()[i]==charOfInterest){
                                count+=1;
                                
                                if(count==numOfOccurence){var coord=cumulatedAnchors[i];var coordPos=i;}
                            }
                        }
                    }
                    if(lastOrNext=="next"){
                        
                        for(i=d3.select(this).text().length-2;i>=0;i--){//-1 avant
                            if(d3.select(this).text()[i]==charOfInterest){
                                
                                count+=1;
                                if(count==numOfOccurence){var coord=cumulatedAnchors[i+1];var coordPos=i+1;}
                            }
                        }
                    }
                    
                    //LEFT
                    objectOverText(d3.select(this),0,coord,"highlight","left_seq","secondary",0,coordPos-1)//pb avec coord parfois
                    //RIGHT
                    objectOverText(d3.select(this),coord,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","principal",coordPos,cumulatedAnchors.length-2)//same
            
                })
            } else {
                selectedTexts.each(function(){
                    var cumulatedAnchors=[0];
                    for(j=0;j<d3.select(this).text().length;j++){
                        cumulatedAnchors.push(charactersToPixels.get(d3.select(this).text()[j])+cumulatedAnchors[j]);
                    }
                    //savoir si c'est une bulle, deux ou trois
                    //plus tard, si on change qq chose au texte, il faudra appliquer les memes changements aux textcolumn, pour l'instant on ne fait que de la sélection
                    
                    var count=0;
                    if(trans=="numToAlpha"){
                        for(i=d3.select(this).text().length-1;i>=0;i--){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="numeric"){
                                if(charactersToType.get(d3.select(this).text()[i-1])=="lowercase" || charactersToType.get(d3.select(this).text()[i-1])=="uppercase"){
                                    count+=1;
                                    if(count==numOfOccurence){var coord=cumulatedAnchors[i];var coordPos=i;}
                                }
                            }
                        }
                    }
                    if(trans=="alphaToNum"){
                        for(i=d3.select(this).text().length-1;i>=0;i--){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="lowercase" || charactersToType.get(d3.select(this).text()[i])=="uppercase"){
                                if(charactersToType.get(d3.select(this).text()[i-1])=="numeric"){
                                    count+=1;
                                    if(count==numOfOccurence){var coord=cumulatedAnchors[i];var coordPos=i;}
                                }
                            }
                        }
                    }
                    if(trans=="lowerToUpper"){
                        for(i=d3.select(this).text().length-1;i>=0;i--){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="lowercase"){
                                if(charactersToType.get(d3.select(this).text()[i-1])=="uppercase"){
                                    count+=1;
                                    if(count==numOfOccurence){var coord=cumulatedAnchors[i];var coordPos=i;}
                                }
                            }
                        }
                    }
                    if(trans=="upperToLower"){
                        for(i=d3.select(this).text().length-1;i>=0;i--){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="uppercase"){
                                if(charactersToType.get(d3.select(this).text()[i-1])=="lowercase"){
                                    count+=1;
                                    if(count==numOfOccurence){var coord=cumulatedAnchors[i];var coordPos=i;}
                                }
                            }
                        }
                    }
                    if(trans=="position"){
                        var coord=cumulatedAnchors[cumulatedAnchors.length-endPos+startPos-2];var coordPos=cumulatedAnchors.length-endPos+startPos-2;
                    
                    }
                    
                    //LEFT
                    objectOverText(d3.select(this),0,coord,"highlight","left_seq","secondary",0,coordPos-1)                             
                    //RIGHT
                    objectOverText(d3.select(this),coord,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","principal",coordPos,cumulatedAnchors.length-2)
                    
                })
            }


        }

    }//----------------------------------------------------------------------------------------------------------------------//


















    //----------------------------------------------MIDDLE, SEVERAL CHARACTERS-----------------------------------------//
    //if(startPos!=0 && endPos!=textToSelect.text().length-1 && selectionSide!="middle"){//on ne touche aucun des bords-> single char rentre dedans??
    if(side=="middle_seq"){        
        var offsetRight=textToSelect.text().length-endPos+1

        //on commence par identifier le bord droit (avec la technique de sequence RIGHT)
        var lastChar = textToSelect.text()[endPos+1];//si c'était en deux parties, le sequence right irait jusque startPos (et endPos serait le bout de la chaine) mais là c'est endPos qui nous intéresse
        var nextChar = textToSelect.text()[endPos];//ATTENTION on part de la fin, donc nextChar est le premier char AVANT la sélection en partant de la droite
        var numOfOccurence=0;

        //------------------ANALYSE DE CE QUI EST SELECTIONNE------------------//

        if(charactersToType.get(lastChar)=="special" || charactersToType.get(nextChar)=="special"){

            if(charactersToType.get(lastChar)=="special"){ //si les deux sont des caractères spéciaux, on priorise le dernier char de la selection plutot que le suivant
                var charOfInterest=lastChar;
                var lastOrNext = "last";
                
                
            } else {
                var charOfInterest=nextChar;
                var lastOrNext = "next";
                //???????????????????????????????????????????????
                numOfOccurence=1;//on le fait partir de 1 car le compteur n'arrivera pas au caractère "suivant", il lui faut de l'avance
            }
           
            
            for(i=textToSelect.text().length-1;i>=endPos+1;i--){//quelle est son occurence : est-ce la première instance de ce caractère ou non ?
                //pour sequence right c'etait bon car endPos etait la derniere pos, mais ici non
                if(textToSelect.text()[i]==charOfInterest){
                    numOfOccurence+=1;
                }
            }
            var trans="special";
            
            
        } else {

            
            if(charactersToType.get(nextChar)=="lowercase" || charactersToType.get(nextChar)=="uppercase"){//alpha
                if(charactersToType.get(lastChar)=="numeric"){
                    var trans="numToAlpha";
                    for(i=textToSelect.text().length-1;i>=endPos+1;i--){//quelle est son occurence ?
                        if(charactersToType.get(textToSelect.text()[i])=="numeric"){
                            if(charactersToType.get(textToSelect.text()[i-1])=="lowercase" || charactersToType.get(textToSelect.text()[i-1])=="uppercase"){
                                numOfOccurence+=1;
                            }
                        }
                    }

                } else {
                    if(charactersToType.get(nextChar)=="uppercase"){
                        if(charactersToType.get(lastChar)=="lowercase"){
                            var trans="lowerToUpper";
                            for(i=textToSelect.text().length-1;i>=endPos+1;i--){//quelle est son occurence ?
                                if(charactersToType.get(textToSelect.text()[i])=="lowercase"){
                                    if(charactersToType.get(textToSelect.text()[i-1])=="uppercase"){
                                        numOfOccurence+=1;
                                    }
                                }
                            }
                        } else {
                            var trans="position";//upper to upper
                        }
                    } else {//next is lower
                        if(charactersToType.get(lastChar)=="uppercase"){
                            var trans="upperToLower";
                            for(i=textToSelect.text().length-1;i>=endPos+1;i--){//quelle est son occurence ?
                                if(charactersToType.get(textToSelect.text()[i])=="uppercase"){
                                    if(charactersToType.get(textToSelect.text()[i-1])=="lowercase"){
                                        numOfOccurence+=1;
                                    }
                                }
                            }
                        } else {
                            var trans="position";//lower to lower
                        }
                    }
                }
            } else {//next is numeric
                if(charactersToType.get(lastChar)=="lowercase" || charactersToType.get(lastChar)=="uppercase"){//alpha
                    var trans="alphaToNum";
                    for(i=textToSelect.text().length-1;i>=endPos+1;i--){//quelle est son occurence ?
                        if(charactersToType.get(textToSelect.text()[i])=="lowercase" || charactersToType.get(textToSelect.text()[i])=="uppercase"){
                            if(charactersToType.get(textToSelect.text()[i-1])=="numeric"){
                                numOfOccurence+=1;
                            }
                        }
                    }
                } else {
                    var trans="position";//num to num
                }
            }
            
        }
        

        //on identifie maintenant le bord gauche (avec la technique de sequence LEFT)

        var lastCharR = textToSelect.text()[startPos-1];
        var nextCharR = textToSelect.text()[startPos];
        var numOfOccurenceR=0;

        //------------------ANALYSE DE CE QUI EST SELECTIONNE------------------//

        if(charactersToType.get(lastCharR)=="special" || charactersToType.get(nextCharR)=="special"){
            
            //on préfère que le dernier char soit spécial plutot que le suivant, donc si les deux le sont, le dernier l'écrase.
            if(charactersToType.get(lastCharR)=="special"){ //si les deux sont des caractères spéciaux, on priorise le dernier char de la selection plutot que le suivant
                var charOfInterestR=lastCharR;
                var lastOrNextR = "last";
                
              
            } else {//si ce n'est pas le dernier c'est forcément le suivant
                var charOfInterestR=nextCharR;
                var lastOrNextR = "next";
                numOfOccurenceR=1;//on le fait partir de 1 car le compteur n'arrivera pas au caractère "suivant", il lui faut de l'avance
             
            }
         
                
            
            for(i=0;i<=startPos-1;i++){//quelle est son occurence : est-ce la première instance de ce caractère ou non ?
                if(textToSelect.text()[i]==charOfInterestR){
                    numOfOccurenceR+=1;
                }
            }
            var transR="special";
            
            
        } else {

            
            if(charactersToType.get(nextCharR)=="lowercase" || charactersToType.get(nextCharR)=="uppercase"){//alpha
                if(charactersToType.get(lastCharR)=="numeric"){
                    var transR="numToAlpha";
                    for(i=0;i<=startPos-1;i++){//quelle est son occurence ?
                        if(charactersToType.get(textToSelect.text()[i])=="numeric"){
                            if(charactersToType.get(textToSelect.text()[i+1])=="lowercase" || charactersToType.get(textToSelect.text()[i+1])=="uppercase"){
                                numOfOccurenceR+=1;
                            }
                        }
                    }

                } else {
                    if(charactersToType.get(nextCharR)=="uppercase"){
                        if(charactersToType.get(lastCharR)=="lowercase"){
                            var transR="lowerToUpper";
                            for(i=0;i<=startPos-1;i++){//quelle est son occurence ?
                                if(charactersToType.get(textToSelect.text()[i])=="lowercase"){
                                    if(charactersToType.get(textToSelect.text()[i+1])=="uppercase"){
                                        numOfOccurenceR+=1;
                                    }
                                }
                            }
                        } else {
                            var transR="position";//upper to upper
                        }
                    } else {//next is lower
                        if(charactersToType.get(lastCharR)=="uppercase"){
                            var transR="upperToLower";
                            for(i=0;i<=startPos-1;i++){//quelle est son occurence ?
                                if(charactersToType.get(textToSelect.text()[i])=="uppercase"){
                                    if(charactersToType.get(textToSelect.text()[i+1])=="lowercase"){
                                        numOfOccurenceR+=1;
                                    }
                                }
                            }
                        } else {
                            var transR="position";//lower to lower
                        }
                    }
                }
            } else {//next is numeric
                if(charactersToType.get(lastCharR)=="lowercase" || charactersToType.get(lastCharR)=="uppercase"){//alpha
                    var transR="alphaToNum";
                    for(i=0;i<=startPos-1;i++){//quelle est son occurence ?
                        if(charactersToType.get(textToSelect.text()[i])=="lowercase" || charactersToType.get(textToSelect.text()[i])=="uppercase"){
                            if(charactersToType.get(textToSelect.text()[i+1])=="numeric"){
                                numOfOccurenceR+=1;
                            }
                        }
                    }
                } else {
                    var transR="position";//num to num
                    
                }
            }
            
        }

       
        
        //------------------GENERALISATION------------------//
       
        
        if(selectedTexts._groups.length>=1){//s'il y a au moins une AUTRE cellule sélectionnée que la subcell
            selectedTexts.each(function(){

                var cumulatedAnchors=[0];
                for(j=0;j<d3.select(this).text().length;j++){//a partir de la gauche quand meme
                    cumulatedAnchors.push(charactersToPixels.get(d3.select(this).text()[j])+cumulatedAnchors[j]);
                }

//GAUCHE
                if(transR=="special"){
                        
                    var count=0;//a priori si on est dans le cas middle on est dans le cas last
                    if(lastOrNextR=="last"){//on cherche le pixel du caractère après celui-là
                        for(i=0;i<d3.select(this).text().length-1;i++){//on peut se permettre de tout parcourir puisqu'on s'arrete lorsqu'on a le meme nb d'occurences
                            if(d3.select(this).text()[i]==charOfInterestR){
                                count+=1;
                                if(count==numOfOccurenceR){var coord=cumulatedAnchors[i+1];var coordPos=i+1;}
                            }
                        }
                    }
                    if(lastOrNextR=="next"){
                        for(i=0;i<d3.select(this).text().length-1;i++){
                            if(d3.select(this).text()[i]==charOfInterestR){
                                count+=1;
                                if(count==numOfOccurenceR){var coord=cumulatedAnchors[i];var coordPos=i+1;}
                            }
                        }
                    }
                    
                    
                } else {
                
                    
                    var count=0;
                    if(transR=="numToAlpha"){
                        for(i=0;i<d3.select(this).text().length-1;i++){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="numeric"){
                                if(charactersToType.get(d3.select(this).text()[i+1])=="lowercase" || charactersToType.get(d3.select(this).text()[i+1])=="uppercase"){
                                    count+=1;
                                    if(count==numOfOccurenceR){var coord=cumulatedAnchors[i+1];var coordPos=i+1;}
                                }
                            }
                        }
                    }
                    if(transR=="alphaToNum"){
                        for(i=0;i<d3.select(this).text().length-1;i++){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="lowercase" || charactersToType.get(d3.select(this).text()[i])=="uppercase"){
                                if(charactersToType.get(d3.select(this).text()[i+1])=="numeric"){
                                    count+=1;
                                    if(count==numOfOccurenceR){var coord=cumulatedAnchors[i+1];var coordPos=i+1;}
                                }
                            }
                        }
                    }
                    if(transR=="lowerToUpper"){
                        for(i=0;i<d3.select(this).text().length-1;i++){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="lowercase"){
                                if(charactersToType.get(d3.select(this).text()[i+1])=="uppercase"){
                                    count+=1;
                                    if(count==numOfOccurenceR){var coord=cumulatedAnchors[i+1];var coordPos=i+1;}
                                }
                            }
                        }
                    }
                    if(transR=="upperToLower"){
                        for(i=0;i<d3.select(this).text().length-1;i++){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="uppercase"){
                                if(charactersToType.get(d3.select(this).text()[i+1])=="lowercase"){
                                    count+=1;
                                    if(count==numOfOccurenceR){var coord=cumulatedAnchors[i+1];var coordPos=i+1;}
                                }
                            }
                        }
                    }
                    if(transR=="position"){
                        var coord=cumulatedAnchors[startPos];
                        var coordPos=startPos;
                    }




                }

//DROITE
                if(trans=="special"){//transition coté droit
                
                    var count=0;
                    
                    if(lastOrNext=="last"){//on cherche le pixel du caractère après celui-là
                        for(i=d3.select(this).text().length-1;i>=0;i--){
                            
                            if(d3.select(this).text()[i]==charOfInterest){
                                count+=1;
                                
                                if(count==numOfOccurence){var coord2=cumulatedAnchors[i];var coord2Pos=i}
                            }
                        }
                    }
                    if(lastOrNext=="next"){
                        
                        for(i=d3.select(this).text().length-2;i>=0;i--){//? pk -1?
                            if(d3.select(this).text()[i]==charOfInterest){
                                
                                count+=1;
                                if(count==numOfOccurence){var coord2=cumulatedAnchors[i+1];var coord2Pos=i+1;}//comme c'est next, on est allé trop loin, donc on veut la position juste à droite
                            }
                        }
                    }
                    
                    
                    
                } else {
                
                    var count=0;
                    if(trans=="numToAlpha"){
                        for(i=d3.select(this).text().length-1;i>=0;i--){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="numeric"){
                                if(charactersToType.get(d3.select(this).text()[i-1])=="lowercase" || charactersToType.get(d3.select(this).text()[i-1])=="uppercase"){
                                    count+=1;
                                    if(count==numOfOccurence){var coord2=cumulatedAnchors[i];var coord2Pos=i;}
                                }
                            }
                        }
                    }
                    if(trans=="alphaToNum"){
                        for(i=d3.select(this).text().length-1;i>=0;i--){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="lowercase" || charactersToType.get(d3.select(this).text()[i])=="uppercase"){
                                if(charactersToType.get(d3.select(this).text()[i-1])=="numeric"){
                                    count+=1;
                                    if(count==numOfOccurence){var coord2=cumulatedAnchors[i];var coord2Pos=i;}
                                }
                            }
                        }
                    }
                    if(trans=="lowerToUpper"){
                        for(i=d3.select(this).text().length-1;i>=0;i--){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="lowercase"){
                                if(charactersToType.get(d3.select(this).text()[i-1])=="uppercase"){
                                    count+=1;
                                    if(count==numOfOccurence){var coord2=cumulatedAnchors[i];var coord2Pos=i;}
                                }
                            }
                        }
                    }
                    if(trans=="upperToLower"){
                        for(i=d3.select(this).text().length-1;i>=0;i--){//quelle est son occurence ?
                            if(charactersToType.get(d3.select(this).text()[i])=="uppercase"){
                                if(charactersToType.get(d3.select(this).text()[i-1])=="lowercase"){
                                    count+=1;
                                    if(count==numOfOccurence){var coord2=cumulatedAnchors[i];var coord2Pos=i;}
                                }
                            }
                        }
                    }
                    if(trans=="position"){
                        
                        //var coord2=cumulatedAnchors[cumulatedAnchors.length-offsetRight+1];//doit etre le meme indice relatif au bout de la chaine a chaque fois, celui de l'exemple
                        var coord2=cumulatedAnchors[cumulatedAnchors.indexOf(coord)+endPos-startPos+1];
                        var coord2Pos=cumulatedAnchors.indexOf(coord)+endPos-startPos+1;
                    }
                    
                }


                if(coord<coord2){
                    //LEFT
                    objectOverText(d3.select(this),0,coord,"highlight","left_seq","secondary",0,coordPos-1)          
                    //MIDDLE
                    objectOverText(d3.select(this),coord,coord2,"highlight","middle_seq","principal",coordPos,coord2Pos-1)                          
                    //RIGHT
                    objectOverText(d3.select(this),coord2,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",coord2Pos,cumulatedAnchors.length-2)
                }
            
                
            })//fin du each selected texts
        }//fin du if au moins une autre cellule

    //fin du cas middle
    }//----------------------------------------------------------------------------------------------------------------//




    if(side=="whole"){
        selectedTexts.each(function(){
                    
            var cumulatedAnchors=[0];
            for(j=0;j<d3.select(this).text().length;j++){
                cumulatedAnchors.push(charactersToPixels.get(d3.select(this).text()[j])+cumulatedAnchors[j]);
            }
            
            var coord=cumulatedAnchors[cumulatedAnchors.length-1];
            
            objectOverText(d3.select(this),0,coord,"highlight","whole","principal",0,cumulatedAnchors.length-1)           
                
        })
    }
}//fin de la fonction generalization

    

function tap_on_subcell(){

    var subcell = subcellFound;
    
    //--------------------------------------------------------------------------------------------------//
    //                   Short click on a principal subcell, we open the edition bubble                 //
    //--------------------------------------------------------------------------------------------------//
    
        
    if(subcell.attr("class")=="sc_principal"){//edition

        
        
    } else {//secondary into principal
    //--------------------------------------------------------------------------------------------------//
    //                     Short click on a secondary subcell, it becomes principal                     //
    //--------------------------------------------------------------------------------------------------//
        d3.selectAll(".editionBubble").remove();
      
        var subcells_principal=d3.selectAll(".sc_principal");
        var subcells_secondary=d3.selectAll(".sc_secondary");

        var is_there_triplets=subcells_principal.filter(function(){
            return d3.select(this).attr("side")=="middle_seq" || d3.select(this).attr("side")=="middle_char"
        })
        if(is_there_triplets.empty()==true){
            subcells_principal.attr("class","sc_secondary")
            subcells_secondary.attr("class","sc_principal")
        } else {
            if(subcell.attr("side")=="right_seq"){//on fusionne les deux sub de gauche
                subcells_secondary.filter(function(){
                    return d3.select(this).attr("side")=="right_seq";
                }).attr("class","sc_principal")//le bon coté

                subcells_principal.each(function(){
                    var id=d3.select(this).attr("rowId");
                    var pos2=d3.select(this).attr("pos2");
                    var width=Number(d3.select(this).attr("width"));
                    var text=d3.select(this).attr("text");
                    var left_width=0;
                    var left_text="";
                    d3.selectAll("#sc"+id).filter(function(){
                        return d3.select(this).attr("side")=="left_seq";
                    }).each(function(){
                        left_width=Number(d3.select(this).attr("width"));
                        left_text=d3.select(this).attr("text")
                    }).attr("pos2",pos2).attr("width",left_width+width).attr("text",left_text+text)
                    d3.select(this).remove()
                })
                //a la fin tout ce qui etait a droite devient principal
            } else {//on fusionne les deux sub de droite
                subcells_secondary.filter(function(){
                    return d3.select(this).attr("side")=="left_seq";
                }).attr("class","sc_principal")//le bon coté

                subcells_principal.each(function(){
                    var id=d3.select(this).attr("rowId");
                    var pos1=d3.select(this).attr("pos1");
                    var width=Number(d3.select(this).attr("width"));
                    var text=d3.select(this).attr("text");
                    var x=d3.select(this).attr("x");
                    var right_width=0;
                    var right_text="";
                    d3.selectAll("#sc"+id).filter(function(){
                        return d3.select(this).attr("side")=="right_seq"
                    }).each(function(){
                        right_width=Number(d3.select(this).attr("width"));
                        right_text=d3.select(this).attr("text")
                    }).attr("pos1",pos1).attr("width",width+right_width).attr("text",text+right_text).attr("x",x)
                    d3.select(this).remove()
                })
            }
        }
       
        
        
    }
     
}
    
function double_tap_on_subcell(){

    var subcell = subcellFound;
 
    var colId = Number(subcell.attr("columnId"))
    d3.selectAll(".sc_secondary").remove();
    d3.selectAll(".sc_principal").remove();

    var otherTexts=d3.selectAll("#c"+colId)
                        .selectAll(".textcell")

    otherTexts.each(function(){

        var pos_vector=is_extract_in_array(subcell.attr("text"),d3.select(this).text())
        if(pos_vector.length>0){
            var cumulatedAnchors=[0];
            for(j=0;j<d3.select(this).text().length;j++){
                cumulatedAnchors.push(charactersToPixels.get(d3.select(this).text()[j])+cumulatedAnchors[j]);
            }
            for(i=0;i<pos_vector.length;i++){
                objectOverText(d3.select(this),cumulatedAnchors[pos_vector[i][0]],cumulatedAnchors[pos_vector[i][1]+1],"highlight","middle_seq","principal",pos_vector[i][0],pos_vector[i][1])
            }
        }
        
    })
    
}

function triple_tap_on_subcell(){

   
    var rowlist=getVector(table.attr("rowList"));
    var full_newselected=[];
    d3.selectAll(".sc_principal").each(function(){
        full_newselected.push(Number(d3.select(this).attr("rowId")))
    })//on récupère tous les rowids des subcells

    d3.selectAll(".sc_secondary").remove();//au cas où, mais normalement le double tap les a enlevé
    d3.selectAll(".sc_principal").remove();


    var newselected=[];
    for(i=0;i<full_newselected.length;i++){//on enlève les doublons, au cas où il y aurait plusieurs subcells principales par cells
        if(newselected.includes(full_newselected[i])==false){
            newselected.push(full_newselected[i])
        }
    }
    var newunselected = rowlist.filter(x => !newselected.includes(x));
    if(newselected.length==n){
        var newselected_columns = d3.range(0,p+1);
        var newunselected_columns = [];
    } else {
        var newselected_columns = [];
        var newunselected_columns = d3.range(0,p+1);
    }

    var A = {newselected,newunselected,newselected_columns,newunselected_columns};
    hovering="vertical";
    //------------------TABLE-------------------
    updateTableColumns(table,A);
    updateTableRows(table,A);
        
    //------------------MINI TABLE-------------------    
    updateMiniTable(minitable,A)
    hovering=0;
    

    
    
}

function edition_subcell(){

    var subcell = subcellFound;
    
    //--------------------------------------------------------------------------------------------------//
    //                   Short click on a principal subcell, we open the edition bubble                 //
    //--------------------------------------------------------------------------------------------------//
    
        
    if(subcell.attr("class")=="sc_principal"){//edition

        window.tap_on_subcell_timer = setTimeout(() => {   
            var cid=parseInt(subcell.attr("columnId"));
            var txt=textPicker();
            
            if(d3.select(".editionBubble").empty()==false){//on ferme la bulle
                d3.selectAll(".editionBubble").remove();
            } else {//on ouvre une bulle
                var textWidth = txt.node().getBoundingClientRect().right-txt.node().getBoundingClientRect().left;
                var rid=parseInt(txt.attr("rowId"));
                var currentCell =d3.select("#r"+rid).selectAll(".cell").filter(function(){//toutes les cellules de la bonne colonne et sélectionnées
                    return d3.select(this).attr("columnId")==cid;}
                    )
                var baseCell = get_x_transform(currentCell);
                var textAnchor = parseFloat(txt.attr("x"))+baseCell;
                var offsetX = get_x_transform(table);
                var textLeft = x_margin+textAnchor - textWidth/2+offsetX;//car textAnchor c'est la coord du milieu
                var bubble_width = Number(subcell.attr("x"))+Number(subcell.attr("width"))/2-textLeft;//largeur de la colonne
                editionBubble(txt,"subcell")
            }
        }, 250);
        
    } 
     
}


function is_extract_in_array(extract,array){
    var pos_vector=[];
    for(i=0;i<array.length;i++){//on scanne tout le grand vecteur
        if(extract[0]==array[i] && i+extract.length<=array.length){//si une lettre est identique (et qu'on ne sort pas du vecteur) -> on a peut etre un match
            var potential_match=[];
            for(j=0;j<extract.length;j++){//on scanne tout l'extrait
                if(extract[j]==array[i+j]){//si c'est toujours identique, on push
                   
                    potential_match.push(i+j)
                }
                if(potential_match.length==extract.length){//si on a l'extrait en entier, on save la premiere et derniere pos
                    var pos1=potential_match[0]
                    var pos2=potential_match[potential_match.length-1]
                    pos_vector.push([pos1,pos2])
                }
            }
        }
    }
    
    return pos_vector;
}

function moveSubcells(event){
    var subcell = subcellFound;
    var colId = Number(subcell.attr("columnId"))
    var rowId = Number(subcell.attr("rowId"))
    //var pos1 = Number(subcell.attr("pos1"))
    //var pos2 = Number(subcell.attr("pos2"))
    

     
    var authenticText = d3.select("#r"+rowId).select("#c"+colId).select(".textcell");//text d3 element
    var offsetX = get_x_transform(table);
    var baseCell = get_x_transform( d3.select("#r"+rowId).select("#c"+colId));
    var textAnchor = parseFloat(authenticText.attr("x"))+baseCell;
    var textWidth = authenticText.node().getBoundingClientRect().right-authenticText.node().getBoundingClientRect().left;
    var textLeft = x_margin+textAnchor - textWidth/2+offsetX;//car textAnchor c'est la coord du milieu

    
    var allTexts=d3.selectAll("#c"+colId)
                        .selectAll(".textcell")

    var endX_ink = inkVector.x[inkVector.x.length-1] - event.clientX-tableContainer.node().getBoundingClientRect().left - textLeft;
    var startX_ink = inkVector.x[0] - event.clientX-tableContainer.node().getBoundingClientRect().left - textLeft;
    
    if(endX_ink>=startX_ink){//déplacement à droite
        allTexts.each(function(){
          
            var thisRowId=Number(d3.select(this).attr("rowId"));
            if(d3.select("#sc"+thisRowId).empty()==false){//il y a des subcells sur ce texte  
                var principal_subcells=d3.selectAll("#sc"+thisRowId).filter(function(){
                    return d3.select(this).attr("class")=="sc_principal"//on prend la principale
                })
                var pos1=Number(principal_subcells.attr("pos1"));
                var pos2=Number(principal_subcells.attr("pos2"));

                var oldText = d3.select(this).text().split("");
                oldText.splice(pos1,pos2-pos1+1)
                var newText = oldText.join("").concat(principal_subcells.attr("text"));
                d3.select(this).text(newText);
            }
        })
        
    } else {//déplacement à gauche
        allTexts.each(function(){
          
            var thisRowId=Number(d3.select(this).attr("rowId"));
            if(d3.select("#sc"+thisRowId).empty()==false){//il y a des subcells sur ce texte  
                var principal_subcells=d3.selectAll("#sc"+thisRowId).filter(function(){
                    return d3.select(this).attr("class")=="sc_principal"//on prend la principale
                })
                var pos1=Number(principal_subcells.attr("pos1"));
                var pos2=Number(principal_subcells.attr("pos2"));

                var oldText = d3.select(this).text().split("");
                oldText.splice(pos1,pos2-pos1+1)
                var newText = principal_subcells.attr("text").concat(oldText.join(""));
                d3.select(this).text(newText);
            }
        })
    }
    d3.selectAll(".sc_secondary").remove();
    d3.selectAll(".sc_principal").remove();
}

function deleteSubcells(){
    var colId = Number(d3.select(".sc_principal").attr("columnId"))//on prend une subcell au hasard pour savoir dans quelle colonne elles sont
    d3.selectAll("#c"+colId)
        .selectAll(".textcell").each(function(){
            var thisRowId=Number(d3.select(this).attr("rowId"));
            var thisText=d3.select(this).text();

            if(d3.select("#sc"+thisRowId).empty()==false){//il y a des subcells sur ce texte
                
                var principal_subcells=d3.selectAll("#sc"+thisRowId).filter(function(){
                    return d3.select(this).attr("class")=="sc_principal"//on prend la principale
                })

                var newText="";
                var bad_ids=[];
                principal_subcells.each(function(){
                    var pos1=Number(d3.select(this).attr("pos1"));
                    var pos2=Number(d3.select(this).attr("pos2"));
                    bad_ids=bad_ids.concat(d3.range(pos1,pos2+1))
                })
                
                for(i=0;i<thisText.length;i++){
                    if(bad_ids.includes(i)==false){
                        newText=newText+thisText[i]
                    }
                }
                
                d3.select(this).text(newText)

            }
        })

    d3.selectAll(".sc_principal,.sc_secondary").remove();
    d3.selectAll(".tab").remove()
    d3.selectAll(".tabLogo").remove()
    createPlotTabs()
}

function toMin_or_toMaj(){
    if(inkVector.y[0]<inkVector.y[inkVector.y.length-1]){//to min

        d3.selectAll(".sc_principal").each(function(){
            var newextract=d3.select(this).attr("text").toLowerCase();
            var pos1=Number(d3.select(this).attr("pos1"));
            var pos2=Number(d3.select(this).attr("pos2"));
            var num=pos2-pos1+1;
            var rowId=Number(d3.select(this).attr("rowId"));
            var colId=Number(d3.select(this).attr("columnId"));
            d3.select(this).attr("text",newextract)
            var oldtext=d3.select("#r"+rowId).select("#c"+colId).select("text").text().split("")
            oldtext.splice(pos1,num,newextract)
            d3.select("#r"+rowId).select("#c"+colId).select("text").text(oldtext.join(""))

        })
    } else {//to maj
        
        d3.selectAll(".sc_principal").each(function(){
            var newextract=d3.select(this).attr("text").toUpperCase();
            var pos1=Number(d3.select(this).attr("pos1"));
            var pos2=Number(d3.select(this).attr("pos2"));
            var num=pos2-pos1+1;
            var rowId=Number(d3.select(this).attr("rowId"));
            var colId=Number(d3.select(this).attr("columnId"));
            d3.select(this).attr("text",newextract)
            var oldtext=d3.select("#r"+rowId).select("#c"+colId).select("text").text().split("")
            oldtext.splice(pos1,num,newextract)
            d3.select("#r"+rowId).select("#c"+colId).select("text").text(oldtext.join(""))

        })
    }
    d3.selectAll(".sc_principal,.sc_secondary").remove()
}

function replace_principalsubcells_with(newtext){
    d3.selectAll(".sc_principal").each(function(){
        
        var pos1=Number(d3.select(this).attr("pos1"));
        var pos2=Number(d3.select(this).attr("pos2"));
        var num=pos2-pos1+1;
        var rowId=Number(d3.select(this).attr("rowId"));
        var colId=Number(d3.select(this).attr("columnId"));
        d3.select(this).attr("text",newtext)
        var oldtext=d3.select("#r"+rowId).select("#c"+colId).select("text").text().split("")
        oldtext.splice(pos1,num,newtext)
        d3.select("#r"+rowId).select("#c"+colId).select("text").text(oldtext.join(""))

    })
}

function edit_principalsubcells_with(newtext){
    var idx=newtext.indexOf("▧");
    if(idx==0){
        var seq1="";
    } else {
        var seq1=newtext.slice(0,idx);
    }

    var idx2 = 0;
    for(var i=idx+1;i<newtext.length;i++){
        if(idx2==0 && newtext[i]!=" "){
            idx2=i
        }
    }
    var seq2=newtext.slice(idx2,newtext.length+1);
    
    
    d3.selectAll(".sc_principal").each(function(){
        
        var pos1=Number(d3.select(this).attr("pos1"));
        var pos2=Number(d3.select(this).attr("pos2"));
        var num=pos2-pos1+1;
        var rowId=Number(d3.select(this).attr("rowId"));
        var colId=Number(d3.select(this).attr("columnId"));
        
        
        var subcelltext=d3.select(this).attr("text")
        var currentNewText=seq1+subcelltext+seq2;
        d3.select(this).attr("text",currentNewText)

        var oldtext=d3.select("#r"+rowId).select("#c"+colId).select("text").text().split("")
        oldtext.splice(pos1,num,currentNewText)
        d3.select("#r"+rowId).select("#c"+colId).select("text").text(oldtext.join(""))

    })
}

function replace_caret_with(newtext){
    d3.select(".caret").each(function(){
        
        var pos=Number(d3.select(this).attr("pos"));
      
        var rowId=Number(d3.select(this).attr("rowId"));
        var colId=Number(d3.select(this).attr("columnId"));
      
        var oldtext=d3.select("#r"+rowId).select("#c"+colId).select("text").text().split("")
        oldtext.splice(pos,0,newtext)
        d3.select("#r"+rowId).select("#c"+colId).select("text").text(oldtext.join(""))

    })
}

function replace_headercaret_with(newtext){
    d3.select(".caret").each(function(){
        
        var pos=Number(d3.select(this).attr("pos"));
      
        var colId=Number(d3.select(this).attr("columnId"));
      
        var oldtext=d3.select("#h"+colId).select("text").text().split("")
        oldtext.splice(pos,0,newtext)
        d3.select("#h"+colId).select("text").text(oldtext.join(""))

    })
}


function subcellHeader(){
    
    deselect_table(table)
    var ink_svg = inkDrawing_to_SVG("blue");
    inkNature(ink_svg,"transient");

    var textToSelect=headerPicker();
    
    var colId = parseInt(textToSelect.attr("columnId"));
    
    var textWidth = textToSelect.node().getBoundingClientRect().right-textToSelect.node().getBoundingClientRect().left;

    var baseCell = get_x_transform( d3.selectAll(".headerCell").filter(function(){
                                                                                return parseFloat(d3.select(this).attr("columnId"))==colId;
                                                                            }));
    var textAnchor = parseFloat(textToSelect.attr("x"))+baseCell;

    
    var offsetX = get_x_transform(table);

    var textLeft = x_margin+textAnchor - textWidth/2+offsetX;//car textAnchor c'est la coord du milieu
    
    var midX=d3.mean(inkVector.x)-textLeft-tableContainer_left;
    
    
    var cumulatedAnchors=[0];
    for(i=0;i<textToSelect.text().length;i++){
        cumulatedAnchors.push(charactersToPixels.get(textToSelect.text()[i])+cumulatedAnchors[i]);
    }
    //cursor

    
    //attention, ici la ligne est verticale
    //------------------------------------------------------------//
    //                   Caret + edition bubble                   //
    //------------------------------------------------------------//
    if(inkClassifier()=="subcell_line"){//pos : indice du premier caractère après la séparation
        
    
        //initialisations
        var diff=Math.abs(cumulatedAnchors[0]-midX);
        var wantedX=cumulatedAnchors[0];
        var pos=0;
        //recherche du point le plus près de relative_ClientX
        for(i=1;i<cumulatedAnchors.length;i++){
            var newdiff=Math.abs(cumulatedAnchors[i]-midX);

            if(newdiff<diff){
                diff=Math.abs(cumulatedAnchors[i]-midX);
                wantedX=cumulatedAnchors[i];
                pos=i;
            }
        }
    
        d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
        
        objectOverHeader(textToSelect,cumulatedAnchors[pos],cumulatedAnchors[pos],"caret","none","principal",pos,pos)
        

    }

   
    //cursor area
    if(inkClassifier()=="subcell_circle"){//pos1 est l'indice du caractère de gauche, pos2 de droite
    

        var left_ink=d3.min(inkVector.x)-textLeft-tableContainer_left;
        var right_ink=d3.max(inkVector.x)-textLeft-tableContainer_left;
        

        //initialisations
        var diff=Math.abs(cumulatedAnchors[0]-left_ink);
        var estimated_left=cumulatedAnchors[0];
        var pos1=0;
        //recherche du point le plus près de relative_ClientX
        for(i=1;i<cumulatedAnchors.length;i++){
            var newdiff=Math.abs(cumulatedAnchors[i]-left_ink);

            if(newdiff<diff){
                diff=Math.abs(cumulatedAnchors[i]-left_ink);
                estimated_left=cumulatedAnchors[i];
                pos1=i;
            }
        }
        
        //initialisations
        var diff=Math.abs(cumulatedAnchors[0]-right_ink);
        var estimated_right=cumulatedAnchors[0];
        var pos2=0;
        //recherche du point le plus près de relative_ClientX
        for(i=1;i<cumulatedAnchors.length;i++){
            var newdiff=Math.abs(cumulatedAnchors[i]-right_ink);

            if(newdiff<diff){
                diff=Math.abs(cumulatedAnchors[i]-right_ink);
                estimated_right=cumulatedAnchors[i];
                pos2=i;
            }
        }
       
        
        d3.selectAll(".sc_principal,.sc_secondary,.caret").remove();
        //trois situations : selection totale, double selection, triple selection
        //one ink box
        if(pos1==0 && pos2==cumulatedAnchors.length-1){
     
            objectOverHeader(textToSelect,0,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","whole","principal",0,cumulatedAnchors.length-2)
            
        }
        //two ink boxes
        if((pos1==0 && pos2<cumulatedAnchors.length-1 && pos1!=pos2)||(pos1>0 && pos2==cumulatedAnchors.length-1 && pos1!=pos2)){//si on a fait de gauche à milieu ou de milieu à droite
            if(pos1==0){
                var wantedX=estimated_right;
                //LEFT
                objectOverHeader(textToSelect,0,wantedX,"highlight","left_seq","principal",0,pos2-1)
                                                
                //RIGHT
                objectOverHeader(textToSelect,wantedX,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",pos2,cumulatedAnchors.length-2)

            } else {
                var wantedX=estimated_left;
                //LEFT
                objectOverHeader(textToSelect,0,wantedX,"highlight","left_seq","secondary",0,pos1-1)
                                                
                //RIGHT
                objectOverHeader(textToSelect,wantedX,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","principal",pos1,cumulatedAnchors.length-2)
            }//on récupère le point du milieu

            
                                                     
        }
        //three ink boxes
        if(pos1!=0 && pos2!=cumulatedAnchors.length-1){//si on a fait une selection au milieu
             
            //LEFT
            objectOverHeader(textToSelect,0,estimated_left,"highlight","left_seq","secondary",0,pos1-1)

            //MIDDLE
            if(pos2-pos1==1){
                objectOverHeader(textToSelect,estimated_left,estimated_right,"highlight","middle_char","principal",pos1,pos2-1)
            } else {
                objectOverHeader(textToSelect,estimated_left,estimated_right,"highlight","middle_seq","principal",pos1,pos2-1)
            }
                                        
            //RIGHT
            objectOverHeader(textToSelect,estimated_right,cumulatedAnchors[cumulatedAnchors.length-1],"highlight","right_seq","secondary",pos2,cumulatedAnchors.length-2)                                              
                                      
        }
      
    }
}