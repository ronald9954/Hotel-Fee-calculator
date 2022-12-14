var adultbft_perday = null;
var childbft_perday = null;
var member_discount_perday = null;
var specialnoteText="";
var data=[];
var row_title=[];
var column_title=[];
function displayword(){
console.log(document.getElementById("selectRoom").value);

}

function handleFiles(files) {

	
	// Check for the various File API support.
	if (window.FileReader) {
		// FileReader are supported.
		getAsText(files[0]);
	} else {
		alert('FileReader are not supported in this browser.');
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
	// Read file into memory as UTF-8      
	reader.readAsText(fileToRead, "UTF-16 BE");
}

function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);             
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
	console.log(lines);
	drawOutput(lines);
}

//if your csv file contains the column names as the first line
function processDataAsObj(csv){
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
	
    //first line of csv
    var keys = allTextLines.shift().split(',');
	
    while (allTextLines.length) {
        var arr = allTextLines.shift().split(',');
        var obj = {};
        for(var i = 0; i < keys.length; i++){
            obj[keys[i]] = arr[i];
	}
        lines.push(obj);
    }
	console.log(lines);
		
	drawOutputAsObj(lines);
	
}

function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}

function calculate_price(){
	
	//read the "abcdefg"
	var rankstr= document.getElementById("ranksum").value;
	rankstr=rankstr.toUpperCase();
	//separate them to individual ranks
	var inde_rank=[];
	for(var i= 0; i<rankstr.length ; i++){
		inde_rank[i] = rankstr[i];
	}
	console.log(inde_rank);
	var showstr= "宿泊料金: " +'"'+document.getElementById("selectRoom").value+'"'+"  " 
	+ inde_rank.length+" 泊" ; 
	document.getElementById("calculate").innerHTML=showstr;
	//"<br />"
	showstr="";

	var sum_of_room_price=0;

	for (var i= 0 ; i<inde_rank.length; i++){
	var datax=row_title.indexOf(inde_rank[i]);
	var datay = column_title.indexOf(document.getElementById("selectRoom").value);
	 showstr = showstr +(i+1)+ ": ランク "+ inde_rank[i] + "---- ￥" + data[datay][datax]+"<br />";
	 sum_of_room_price= sum_of_room_price+parseInt(data[datay][datax],10);
	
	}

	

	var totaldays= i;
	showstr= showstr+"<br>"+"宿泊料金 = ￥" + sum_of_room_price +"<br />"+"<br />"; 
	var total_price = sum_of_room_price

	datay = column_title.indexOf("AdultBFT");
	adultbft_perday = parseInt(data[datay][1],10);

	datay = column_title.indexOf("ChildBFT");
	childbft_perday = parseInt(data[datay][1],10);
	
	

	datay = column_title.indexOf("MemberDiscount");
	member_discount_perday = Math.abs(parseInt(data[datay][1],10));

	var adultbft_value = document.getElementById("adultbft").value;
	var childbft_value = document.getElementById("childbft").value;
	
	if(adultbft_value !==""  || childbft_value !== ""  ){
		console.log("Calculating breakfast")

	
		var adult_day = parseInt(adultbft_value,10);
		var child_day = parseInt(childbft_value,10);

		if(adultbft_value !==""){
		showstr = showstr+ "大人朝食 x "+adult_day +  " 名 x "  +totaldays+" 泊 =￥" 
		+ adultbft_perday + " x " + adult_day +" x "    + totaldays + " = ￥" 
		+ adult_day*adultbft_perday*totaldays +"<br>";   
		total_price = total_price+  adult_day*adultbft_perday*totaldays;        
		}
		if(childbft_value !==""){
			showstr = showstr+ "子供朝食 x "+child_day +  " 名 x "  +totaldays+" 泊 =￥" 
			+ childbft_perday + " x " + child_day +" x "    + totaldays + " = ￥" 
			+ child_day*childbft_perday*totaldays +"<br>"; 
			total_price = total_price+child_day*childbft_perday*totaldays;            
		}




	}

	var memdis_cb = document.getElementById("memdis");

	var discount_value = -1 *  Math.abs(totaldays*member_discount_perday) ; 

	if (memdis_cb.checked == true){
		console.log("calculating membership")
		showstr = showstr  + "メンバー割引 x "+totaldays+ " 泊 = ￥-" 
		+member_discount_perday + " x " + totaldays + " = ￥"
		
		+ discount_value +  "<br>";
		total_price = total_price+discount_value;
	}

	showstr= showstr +"<br>"+"合計金額 = ￥" +total_price;

	document.getElementById("steps").style.visibility = "visible"; 
	document.getElementById("steps").innerHTML=showstr;	
}

function drawOutput(lines){
	data=lines;
	row_title=[];
	column_title=[];
	row_title=data[0];
	for (var i = 0; i<lines.length; i++){
		column_title[i] = data[i][0];
	}
	



	var select = document.getElementById("selectRoom"); 
	var options = [];
	options = column_title;

	select.value=null;
	select.textContent=null;
	
	for(var i=0 ; i< options.length; i++){
		if((options[i] != "AdultBFT") & (options[i] != "ChildBFT") &(options[i] != "MemberDiscount") &(options[i] != "SpecialNote")  ){
			
    	var opt = options[i];
    	var el = document.createElement("option");
    	el.textContent = opt;
		el.value = opt;
		select.appendChild(el);
		}
	}



/*
	for(var i = 0; i < options.length; i++) {
		

		
	}​
*/


	//Clear previous data
	document.getElementById("output").innerHTML = "";
	var table = document.createElement("table");
	for (var i = 0; i < lines.length; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < lines[i].length; j++) {
			var firstNameCell = row.insertCell(-1);
			firstNameCell.appendChild(document.createTextNode(lines[i][j]));
		}
	}
	document.getElementById("output").appendChild(table);


	//leung
	datay = column_title.indexOf("SpecialNote");
	specialnoteText = data[datay][1];
	document.getElementById("specialnote").innerHTML = specialnoteText ; 
}



//draw the table, if first line contains heading
function drawOutputAsObj(lines){
	//Clear previous data
	document.getElementById("output").innerHTML = "";
	var table = document.createElement("table");
	
	//for the table headings
	var tableHeader = table.insertRow(-1);
 	Object.keys(lines[0]).forEach(function(key){
 		var el = document.createElement("TH");
		el.innerHTML = key;		
		tableHeader.appendChild(el);
	});	
	
	//the data
	for (var i = 0; i < lines.length; i++) {
		var row = table.insertRow(-1);
		Object.keys(lines[0]).forEach(function(key){
			var data = row.insertCell(-1);
			data.appendChild(document.createTextNode(lines[i][key]));
		});
	}
	document.getElementById("output").appendChild(table);
}


