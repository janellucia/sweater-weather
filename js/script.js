
 	var weatherWidget = {
 		weatherData : {},
 		apiKey: key, // reference to API key in separate file
 		init : function(){
 			var $searchForm  = $('form.search'),
 				$warningMsg  = $('div.warning'),
 				$searchField = $(".search-field");
			
 			$searchForm.on('click',function(){
 				$warningMsg.css('opacity', 1); // 'show' by adjusting opacity 
 			});

 			$searchForm.on('submit', function(e){
 				e.preventDefault();
 				var location = $searchField.val();
 				weatherWidget.getWeather(location);
 				$warningMsg.css('opacity', 0); // 'hide' by adjusting opacity
 			});

 		console.log(weatherWidget, "weatherData");
 		},


 		getWeather : function(location){
 			var weatherLocation = encodeURIComponent(location);

 			// Add the API key to endpoint URLs
			$.ajax('http://api.wunderground.com/api/' + weatherWidget.apiKey + '/conditions/q/'+ weatherLocation + '.json', {
			 	type : 'GET',
			 	dataType : 'jsonp', 
			 	success : function(currentData){
			 		console.log(currentData);
			 		weatherWidget.parseData(currentData);
			 		$.ajax('http://api.wunderground.com/api/' + weatherWidget.apiKey + '/forecast/q/'+ weatherLocation + '.json', {
			 			type : 'GET',
			 			dataType : 'jsonp',
			 			success : function(forecastData){
			 				weatherWidget.parseForecastData(forecastData);
			 				weatherWidget.updateDOM();
			 			}
			 		});
			 	}
			});
 		},



 		parseData : function(data){
	 		var factor = data.current_observation;
	 		weatherWidget.weatherData.city = factor.display_location.city;
	 		weatherWidget.weatherData.temperature_string = factor.temp_c;
	 		weatherWidget.weatherData.wind = factor.wind_kph;
	 		weatherWidget.weatherData.weather = factor.weather;
	 		weatherWidget.weatherData.image_url = factor.icon_url;
 		},

 		parseForecastData : function(data){
 			var forecast = data.forecast.simpleforecast.forecastday[1];
 			weatherWidget.weatherData.tomorrow = forecast.conditions; 			
 		},

 		updateDOM : function(){
 			// Define variables whose values are known and will remain constant...
			var conditions = weatherWidget.weatherData.weather,
				city = weatherWidget.weatherData.city,
				temp = weatherWidget.weatherData.temperature_string,
				wind = weatherWidget.weatherData.wind,
				tomorrow = weatherWidget.weatherData.tomorrow,
				// ...and declare some variables to be defined later (non-constants)
				suggestion, bgColor, color, image, weatherMood, tempFactor, windFactor;


			switch (conditions) {
				case "Snow":
					suggestion = ". You might want to dig out that thick and cozy sweater because baby, it's cold outside!";
					bgColor = "#355c7d";
					image = "snow";
					break;
				case "Rain" :
					suggestion = ", so don't forget to wear something waterproof!";
					bgColor = "#6c5b7b";
					image = "rain";
					break;
				case "Overcast":
					suggestion = ", so break out that oversized comfy sweater, you know, the one you stole from your dad.";
					bgColor = "#9099a2";
					image = "overcast";
					break;
				case "Mostly Cloudy":
					suggestion = ", sounds pretty iffy out there! Better bring an extra layer you might need it!";
					bgColor = "#c06c84";
					image = "cloudy";
					break;
				case "Clear":
					suggestion = ". Oh, yeah! Break out those seasonally questionable sunglasses, you're going to need them!";
					bgColor = "#f8b195";
					image = "clear";
					break;
				case "Drizzle":
					suggestion = ", so wear a hat or bring your umbrella!";
					bgColor = "#c06c84";
					image = "rain";
					break;
				case "Fog":
					suggestion = ". A misty day calls for a cozy oversized sweater!";
					bgColor = "#c06c84";
					image = "options/rb-two-jackets";
					break;
				default:
					suggestion = ": Hey, it's gonna be a good day!";
					bgColor = "#f8b195";
					image = "options/rb-sweater-family";
			}


			weatherMood = "It's " + conditions.toLowerCase() + " in " + city + suggestion;
			$('body').css({"background-color": bgColor, "color": color});
			$('img.sweater').attr("src", "images/" + image + ".png");

 			tempFactor = "The temp is " + temp + "\xB0C" + (
 				temp >  30 ? ", it's hot and you probably don't need a sweater." :
 				temp >  22 ? ", time to let the layers drop!" :
 				temp >  15 ? ", time to get creative with transportation!" :
 				temp >  10 ? ", try out a box jacket in strawberry, sky-blue or emerald." :
 				temp >   0 ? ", it's pretty cold out there and you will probably need a coat!" :
 				temp === 0 ? ", zero-degree weather doesn't have to suck, add an oversized jacket!" :
 				             " and cold weather doesn't have to suck, add an oversized coat! (and a ton of other cozy things)."
 			);

 			windFactor = "That wind factor is " + wind + "km/hour" + (
 				wind > 30 ? ", it's so windy today you might as well wear a blanket." :
 				wind > 10 ? ", it's sorta windy, try to repurpose your sweater as a scarf!" :
 				wind >  0 ? ", just enough wind to make you wanna add another layer!" :
 				            ", no wind today! Hell yeah!"
 			);

 			forecast = "Tomorrow's going to be " + tomorrow.toLowerCase() + ".";

 			$(".search").hide();
 			$(".weather_string").text(weatherMood);
 			$(".temp").text(tempFactor);
	 		$(".wind").text(windFactor);
	 		$(".forecast").text(forecast);

	 		$('.output').show();
	 		$('a.button').on('click',function(e){
	 			e.preventDefault;
	 			location.reload();
	 		});
 		}//end updateDOM
 	};//weather widget

$(document).ready(function(){	
  	weatherWidget.init();
});//end doc ready



