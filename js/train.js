var intervalJSONreloadTrain = 60000; // inteval time for reload new external json data
var intervalCyclePageTrain = 5000; // interval time for change page/pagination

var trainUrl = "train_url.php?nocache=" + new Date().getTime();
// var trainUrl = "train.txt";

(function() {

	var arrTrainDestination = new Array();
	var arrDue = new Array();
	var arrPlatform = new Array();
	var noListTrain = 0;

	initTrain();
	var refreshTrain = setInterval(function(){
		initTrain();
	},intervalJSONreloadTrain)

	function initTrain() {
		loadTrainData();
	}


	function loadTrainData(){
		$.ajax({
			type: 'GET',
			dataType: 'json',
			cache: false,
			async: true,
			url: trainUrl,
			success: function(data){
				console.log('Train json reloaded..');
				// clear previous data
				arrTrainDestination = new Array();
				arrDue 				= new Array();
				arrPlatform 		= new Array();

				$.each(data, function(key, value) {

					if (key == "trainServices"){
						$.each(this, function(key, value) {

							//var filterVia = value.destination[0].via;
							arrTrainDestination.push(value.destination[0].locationName);
						   	arrDue.push(value.std);
						   	arrPlatform.push(value.platform);

						});
					}

				});
				displayTrainData();
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			  console.log('error train data . reloading');

  			  setTimeout(function(){
			  	// wait 1sec and try again
			  	loadTrainData();
			  },1000);

			}
		});
	}

	var maxPageTrain;
	var refreshDataTrain;

	function displayTrainData() {
		noListTrain = 0;
		maxListTrain = 6;
		var countTotalTrain = arrTrainDestination.length;
		maxPageTrain = countTotalTrain - maxListTrain;
		nextScheduleTrain();

		//train refresh data
		clearInterval(refreshDataTrain);
		 refreshDataTrain = setInterval(function(){
			console.log("Next page train data");
			nextScheduleTrain();
		}, intervalCyclePageTrain);
	}


	var arrrayTrainDestination2 = new Array();
	var arrayDue2 = new Array();
	var arrayPlatform2 = new Array();


	function nextScheduleTrain() {
		arrrayTrainDestination2 = new Array();
		arrayDue2 = new Array();
		arrayPlatform2 = new Array();


		for(i = noListTrain; i < (maxListTrain + noListTrain); i++) {
			arrrayTrainDestination2.push(arrTrainDestination[i]);
			arrayDue2.push(arrDue[i]);
			arrayPlatform2.push(arrPlatform[i]);
		}

		noListTrain++;
		if (noListTrain > maxPageTrain) {
			noListTrain = 0;
		}

		generateArrayTrain();
	}


	function generateArrayTrain() {
		for (i=0; i<maxListTrain; i++) {
			if(arrrayTrainDestination2[i] != undefined) {
				$(".train" + i).text( arrrayTrainDestination2[i]);
				$(".due" + i).text( arrayDue2[i]);
				$(".platform" + i).text( arrayPlatform2[i]);
				// console.log(arrayPlatform[i]);

			} else {
				$(".train" + i).text("");
				$(".due" + i).text("");
				$(".platform" + i).text("");

			}
		}
	}


})(); //end of scope function
