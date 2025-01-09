




document.body.style.backgroundColor = "#fff7e1";

window.addEventListener('contextmenu', function (e) {
  e.preventDefault();
}, false);



var majAlphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
for(var j=0;j<26;j++){
  for(var i=0;i<26;i++){//on rallonge
    majAlphabet.push(majAlphabet[j]+majAlphabet[i])
  }
}


var ctx = {
  //dataset: "exoplanets-light"
}
//titanic
window.global_types=["qualitative","qualitative","qualitative","qualitative","qualitative","quantitative","qualitative","qualitative","qualitative","quantitative","qualitative","qualitative"];

function typeGuesser(){//current table

  if(columns_reordering==false){
    if(ctx.dataset != null) {
      nbCols = ctx.dataset == "exoplanets-light" ? 24 : 98;
      qualitativeCols = ctx.dataset == "exoplanets-light" ? [0,1,21] : [0,1,25,62,63,64,65,66,67,68,97];
      types = [];
      for(var i=0; i < nbCols; i++) {
        if(qualitativeCols.includes(i)) {
          types.push("qualitative");
        } else {
          types.push("quantitative");
        }
      }
      types.push("qualitative");//il manquait un type !!
     
      

    } else {
    
      var types = global_types;

    }
    
  } else {
   
      var types=[];
      d3.selectAll(".headerCell").each(function(){
        types.push(d3.select(this).attr("type"))
  
      })
     
  }
  
  return types;

  
}



var M=[];

var columnNames=[];

function init(){

  window.device = "wacom";
  
  
 
  d3.dsv(";","datasets/titanic_sorted.csv").then(function(data){

    var n = data.length;
    var p = data.columns.length;
    
    console.log("dataset dimensions : ",n,p)
    window.headers_names=data.columns;
    window.columns_reordering=false;
    window.columnNames = [];
    for(i=0;i<p;i++){
      columnNames.push(majAlphabet[i]);
    }
    M=[];
    
    for(i=0;i<n;i++){//lignes
        v=[];

        for(j=0;j<p;j++){//colonnes
            var a = data[i][data.columns[j]];
            if(a=="NA"){a="";}
            v.push(a);
        }
        M.push(v);
    }
    
    /*
    d3.select("#globalContainer").append("svg").style("left",-10+"px").style("top",-10+"px").style("position","absolute").attr("width",110).attr("height",30)
        .append("rect").attr("x",0).attr("y",0).attr("width",110).attr("height",30).style("fill","#fff7e1")

    d3.select("#globalContainer").append("svg").style("left",1785+"px").style("top",-10+"px").style("position","absolute").attr("width",150).attr("height",30)
        .append("rect").attr("x",0).attr("y",0).attr("width",150).attr("height",30).style("fill","#fff7e1")
*/
    d3.select("#globalContainer").append("svg").style("left",69+"px").style("top",79+"px").style("position","absolute").attr("width",32).attr("height",52)
        .append("rect").attr("x",0).attr("y",0).attr("width",32).attr("height",52).style("fill","#ffffff").style("stroke","rgb(90,61,43)").style("stroke-width",4)
    
    fontInit();
    
    createTable(M,columnNames);
    
    
    createPalette();
    createPlotTabs();
    createCanvas();//contient initListeners

    
  });

}




function fontInit(){
  //var bla = d3.select("#elementsContainer");

  window.charactersToPixels = new Map();
  window.charactersToType = new Map();
  var alphabet="ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽabcàçdèeéfghijklmnopqrsštuvwxyzžĂÂÊÔƠƯăáâêôóơúưíñ1234567890‘?’“!”(%)[#]{@}/&\\<-+÷×=>®©$€£¥¢:;,.* \"";
  for(i=0;i<alphabet.length;i++){
    //var it=bla.append("text").text(alphabet[i]).attr("class","textcell").style("opacity",1);
    //charactersToPixels.set(alphabet[i],(it.node().getBoundingClientRect().right-it.node().getBoundingClientRect().left))
    if(i<=30){
      charactersToType.set(alphabet[i],"uppercase")
    }
    if(i>30 && i<=62){
      charactersToType.set(alphabet[i],"lowercase")
    }
    if(i>62 && i<=68){
      charactersToType.set(alphabet[i],"uppercase")
    }
    if(i>68 && i<=79){
      charactersToType.set(alphabet[i],"lowercase")
    }
    if(i>79 && i<=89){
      charactersToType.set(alphabet[i],"numeric")
    }
    if(i>89){
      charactersToType.set(alphabet[i],"special")
    }

  }
  //corrections
  
  charactersToPixels.set("A",9.71);//0
  charactersToPixels.set("B",9.77);
  charactersToPixels.set("C",9.8);
  charactersToPixels.set("Č",9.8);
  charactersToPixels.set("Ć",9.8);
  charactersToPixels.set("D",10.79);
  charactersToPixels.set("Đ",10.79);
  charactersToPixels.set("E",8.52);
  charactersToPixels.set("F",8.36);
  charactersToPixels.set("G",10.43);
  charactersToPixels.set("H",10.8);
  charactersToPixels.set("I",3.75);
  charactersToPixels.set("J",8.59);
  charactersToPixels.set("K",10.13);
  charactersToPixels.set("L",7.98);
  charactersToPixels.set("M",12.41);
  charactersToPixels.set("N",10.92);
  charactersToPixels.set("O",11.49);
  charactersToPixels.set("P",8.95);
  charactersToPixels.set("Q",11.63);
  charactersToPixels.set("R",10.05);
  charactersToPixels.set("S",8.44);
  charactersToPixels.set("Š",8.44);
  charactersToPixels.set("T",9.06);
  charactersToPixels.set("U",10.7);
  charactersToPixels.set("V",9.98);
  charactersToPixels.set("W",14.49);
  charactersToPixels.set("X",9.09);
  charactersToPixels.set("Y",8.39);
  charactersToPixels.set("Z",9.66);
  charactersToPixels.set("Ž",9.66);//30

  charactersToPixels.set("a",9.09);
  charactersToPixels.set("b",9.09);
  charactersToPixels.set("c",7.77);
  charactersToPixels.set("à",9.09);
  charactersToPixels.set("ç",7.77);
  charactersToPixels.set("d",9.09);
  charactersToPixels.set("è",8.48);
  charactersToPixels.set("e",8.48);
  charactersToPixels.set("é",8.48);
  charactersToPixels.set("f",5.41);
  charactersToPixels.set("g",9.37);
  charactersToPixels.set("h",8.52);
  charactersToPixels.set("i",3.21);
  charactersToPixels.set("j",4.05);
  charactersToPixels.set("k",7.95);
  charactersToPixels.set("l",3.45);
  charactersToPixels.set("m",13.69);
  charactersToPixels.set("n",8.67);
  charactersToPixels.set("o",9.06);
  charactersToPixels.set("p",9.09);
  charactersToPixels.set("q",9.09);
  charactersToPixels.set("r",5.78);
  charactersToPixels.set("s",7.04);
  charactersToPixels.set("š",7.04);
  charactersToPixels.set("t",5.09);
  charactersToPixels.set("u",8.54);
  charactersToPixels.set("v",7.94);
  charactersToPixels.set("w",11.28);
  charactersToPixels.set("x",7.27);
  charactersToPixels.set("y",8.52);
  charactersToPixels.set("z",7.19);
  charactersToPixels.set("ž",7.19);//62

  charactersToPixels.set("Ă",9.71);
  charactersToPixels.set("Â",9.71);
  charactersToPixels.set("Ê",8.52);
  charactersToPixels.set("Ô",11.49);
  charactersToPixels.set("Ơ",11.49);
  charactersToPixels.set("Ư",10.7);//68

  charactersToPixels.set("ă",9.24);
  charactersToPixels.set("á",9.24);
  charactersToPixels.set("â",9.09);
  charactersToPixels.set("ê",8.48);
  charactersToPixels.set("ô",9.06);
  charactersToPixels.set("ó",9.06);
  charactersToPixels.set("ơ",9.06);
  charactersToPixels.set("ư",8.54);
  charactersToPixels.set("í",3.21);
  charactersToPixels.set("ñ",8.67);
  charactersToPixels.set("ú",8.54);//79
  

  charactersToPixels.set("1",5.55);
  charactersToPixels.set("2",8.31);
  charactersToPixels.set("3",7.87);
  charactersToPixels.set("4",8.03);
  charactersToPixels.set("5",8.18);
  charactersToPixels.set("6",8.07);
  charactersToPixels.set("7",7.7);
  charactersToPixels.set("8",8.1);
  charactersToPixels.set("9",8.38);
  charactersToPixels.set("0",8.93);

  charactersToPixels.set("‘",3.21);
  charactersToPixels.set("?",7.28);
  charactersToPixels.set("’",2.91);
  charactersToPixels.set("“",5.24);
  charactersToPixels.set("\"",5.24);
  charactersToPixels.set("!",2.78);
  charactersToPixels.set("”",5.24);
  charactersToPixels.set("(",5.62);
  charactersToPixels.set("%",11.64);
  charactersToPixels.set(")",5.62);
  charactersToPixels.set("[",5.96);
  charactersToPixels.set("#",9.81);
  charactersToPixels.set("]",5.96);
  charactersToPixels.set("{",6.41);
  charactersToPixels.set("@",14.59);
  charactersToPixels.set("}",6.41);
  charactersToPixels.set("/",7.84);
  charactersToPixels.set("&",10.19);
  charactersToPixels.set("\\",7.85);
  charactersToPixels.set("<",7.85);
  charactersToPixels.set("-",5.85);
  charactersToPixels.set("+",8.44);
  charactersToPixels.set("÷",8.45);
  charactersToPixels.set("×",6.95);
  charactersToPixels.set("=",7.79);
  charactersToPixels.set(">",7.95);
  charactersToPixels.set("®",8.02);
  charactersToPixels.set("©",11.93);
  charactersToPixels.set("$",8.44);
  charactersToPixels.set("€",10.07);
  charactersToPixels.set("£",9.21);
  charactersToPixels.set("¥",8.39);
  charactersToPixels.set("¢",7.71);
  charactersToPixels.set(":",2.81);
  charactersToPixels.set(";",2.99);
  charactersToPixels.set(",",2.91);
  charactersToPixels.set(".",2.72);
  charactersToPixels.set("*",4.64);

  charactersToPixels.set(" ",4);//?


}
