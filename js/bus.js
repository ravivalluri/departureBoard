var intervalJSONreloadBus = 60000; // inteval time for reload new external json data
var intervalCyclePageBus = 3000; // interval time for change page/pagination

var busUrl = "bus_url.php?nocache=" + new Date().getTime();
var busUrl2 = "bus_url2.php?nocache=" + new Date().getTime();

// var busUrl = "bus.txt";
// var busUrl2 = "bus2.txt";

$(document).ready(function() {

	var arrDestination = new Array();
	var arrRouteName = new Array();
	var arrEstimateTime = new Array();
	var noList = 0;

	var arrDestination51599 = new Array();
	var arrDestination48710 = new Array(); 
	var arrDestinationCombined = new Array();


	init();
	var referesh  = setInterval(function() {
		init();
	}, intervalJSONreloadBus);


	function init(){
		loadFirstData();
	}


	function loadFirstData(){
		$.ajax({
			type: 'GET',
			dataType: 'json',
			cache: false,
			url: busUrl,
			success: function(data){
				// clear previous data
				arrDestination51599 = new Array();
							
				$.each(data, function(key, value) {
					$.each(this, function(key, value) {
						if (value["scheduledTime"]){
					   		// console.log(value.destination);
					   		var busArray = [value.destination, value.routeName , value.estimatedWait, returnTime(value.estimatedWait)];
					   		arrDestination51599.push(busArray);
					   		// arrDestination51599.push(value.destination);
						}
					});
				});
				loadSecondData();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			  console.log('error first bus data.. reloading..');

			  setTimeout(function(){
			  	// wait 1sec and try again
			  	loadFirstData();
			  },1000);
			}
		});

	}

	function loadSecondData(){
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: busUrl2,
				success: function(arg) {
					// clear previous data
					arrDestination48710 = new Array(); 

					$.each(arg, function(key, value) {
						if (key == "arrivals") {
							$.each(this, function(key, value) {
					   			var busArray = [value.destination, value.routeName , value.estimatedWait, returnTime(value.estimatedWait)];
					   			arrDestination48710.push(busArray);
							});
						}
					});

					console.log('Bus json data reloaded..');
					combineBothData();
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				  console.log('error second bus data.. reloading..');

				  setTimeout(function(){
			  		// wait 1sec and try again
				  	loadFirstData();
				  },1000);
				}
			});
	}

	var refreshData;

	function combineBothData(){
		// clear previous data
		arrDestinationCombined = new Array();

		//arrDestination51599 loop
		for(i=0; i<arrDestination51599.length; i++){
			arrDestinationCombined.push(arrDestination51599[i]);
		}

		//arrDestination48710 loop
		for(ii=0; ii<arrDestination48710.length; ii++){
			arrDestinationCombined.push(arrDestination48710[ii]);
		}

		// sort array by departing time
		console.log(arrDestinationCombined);
		arrDestinationCombined = arrDestinationCombined.sort(Comparator);

		maxList = 6;
		noList = 0;
		countTotalDestination = arrDestinationCombined.length;
		maxPageDestination = countTotalDestination - maxList;
		nextSchedule();

		clearInterval(refreshData);
		refreshData = setInterval(nextSchedule, intervalCyclePageBus);
	}

	var countTotalDestination, maxPageDestination;
	var arrayToShow = new Array();
	var arrayToRoute = new Array();
	var arrayToTime = new Array();

	function nextSchedule() {
		arrayToShow = new Array();
		arrayToRoute = new Array();
		arrayToTime = new Array();

		for(i = noList; i < (maxList + noList); i++) {
			if (arrDestinationCombined[i] != undefined) {
				arrayToShow.push(arrDestinationCombined[i][0]);
				arrayToRoute.push(arrDestinationCombined[i][1]);
				arrayToTime.push(arrDestinationCombined[i][2]);
			}
		}

		noList++;
		if (noList > maxPageDestination) {
			noList = 0;	
		}

		generateArray();

		console.log("Next page bus data");
	}

	function generateArray() {
		for (i=0; i<maxList; i++) {
			if(arrayToShow[i] != undefined) {
				$(".txt" + i).text( arrayToShow[i]);
				$(".route" + i).text( arrayToRoute[i]);
				$(".time" + i).text( arrayToTime[i]);
				// console.log(arrayToTime[i]);
			} else {
				$(".txt" + i).text("");
				$(".route" + i).text("");
				$(".time" + i).text("");

			}
		}
	}

		

});



function returnTime(time){
	// need the time value for sorting
	var _time;
	if (time.toLowerCase().indexOf('min') > -1) {
	    // console.log('is minute');
	    _time = time.split(' ')[0];
	}else{
	    // console.log('is due');
	    _time = 99;
	}	
	return Number(_time);
}


// sort array by departing time
function Comparator(a,b){
	// 3 is array value for time
	if (a[3] < b[3]) return -1;
	if (a[3] > b[3]) return 1;
	return 0;
}