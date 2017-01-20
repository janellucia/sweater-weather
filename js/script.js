
 	var weatherWidget = {
 		weatherData : {},
 		init : function(){
 			$('form.search').on('click',function(){
 				$('div.warning').show();
 				$('div.sweater-pic').show();
 			});

 			$('form.search').on('submit', function(e){
 				e.preventDefault();
 				var location = $(this).find(".search-field").val();
 				weatherWidget.getWeather(location);
 				$('div.warning').hide();
 			});

 		console.log(weatherWidget, "weatherData");
 		},


 		getWeather : function(location){
 			var weatherLocation = encodeURIComponent(location);

			$.ajax('http://api.wunderground.com/api/97b15225e4e42e58/conditions/q/'+ weatherLocation + '.json', {
			 	type : 'GET',
			 	dataType : 'jsonp', 
			 	success : function(currentData){
			 		weatherWidget.parseData(currentData);
			 		$.ajax('http://api.wunderground.com/api/97b15225e4e42e58/forecast/q/'+ weatherLocation + '.json', {
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
 			var conditions = "It's " + weatherWidget.weatherData.weather + " in " + weatherWidget.weatherData.city;
			var temp = "The temp is " + weatherWidget.weatherData.temperature_string + " C";
			var wind = "That wind factor " + weatherWidget.weatherData.wind + "km/hour";
			var forecast = "Tomorrow's going to be " + weatherWidget.weatherData.tomorrow;

			//types of weather moods (conditions)
			if(weatherWidget.weatherData.weather.search("Snow") !== -1){
				conditions = conditions + " You might want to dig out that thick and cozy sweater because baby, it's cold outside!";
				$('body').css({"background-color":"#355c7d", "color": "#f4f4f4"});
				$('img.sweater').attr("src", "images/snow.png");
			}else if(weatherWidget.weatherData.weather.search("Rain") !== -1){
				conditions = conditions + " So don't forget to wear something waterproof!"
				$('body').css({"background-color":"#6c5b7b", "color": "#f4f4f4"});
				$('img.sweater').attr("src", "images/rain.png");
			}else if(weatherWidget.weatherData.weather.search("Overcast") !== -1){
				conditions = conditions + " So break out that oversized comfy sweater, you know the one you stole from your dad"
				$('body').css({"background-color":"#9099a2", "color": "#f4f4f4"});
				$('img.sweater').attr("src", "images/overcast.png");
			}else if(weatherWidget.weatherData.weather.search("Mostly Cloudy") !== -1){
				conditions = conditions + " It's pretty iffy out there! Bring an extra layer you might need it!"
				$('body').css({"background-color":"#c06c84", "color": "#f4f4f4"});
				$('img.sweater').attr("src", "images/cloudy.png");
			}else if(weatherWidget.weatherData.weather.search("Clear") !== -1){
				conditions = conditions + " Oh, yeah! Break out those seasonally questionable sunglasses, you're going to need them!"
				$('body').css({"background-color":"#f8b195", "color": "#355c7d"});
				$('img.sweater').attr("src", "images/clear.png");
			}else if(weatherWidget.weatherData.weather.search("Drizzle") !== -1){
				conditions = conditions + ", so wear a hat or bring your umbrella!"
				$('body').css({"background-color":"#c06c84", "color": "#f4f4f4"});
				$('img.sweater').attr("src", "images/rain.png");
			}else if(weatherWidget.weatherData.weather.search("Fog") !== -1){
				conditions = conditions + " a romantic and mysterious day calls for a cozy oversized sweater!"
				$('body').css({"background-color":"#c06c84", "color": "#f4f4f4"});
				$('img.sweater').attr("src", "images/rb-two-jackets.png");
			}else {
				conditions = conditions + ": hey, it's gonna be a good day!"	
				$('body').css({"background-color":"#f8b195", "color": "#355c7d"});
				$('img.sweater').attr("src", "images/rb-sweater-family.png");
			}


			//temp factor
			if(weatherWidget.weatherData.temperature_string === 0){
 				temp = temp + ", zero-degree weather doesn't have to suck, add an oversized jacket!"
 			}else if(weatherWidget.weatherData.temperature_string > 0){
 				temp = temp + ", it's pretty cold out there and you will probably need a coat!"
 			}else if(weatherWidget.weatherData.temperature_string > 10){
 				temp = temp + ", try out a box jacket in strawberry, sky-blue or emerald"
 			}else if(weatherWidget.weatherData.temperature_string > 15){
 				temp = temp + ", time to get creative with transportation!"
 			}else if(weatherWidget.weatherData.temperature_string > 22){
 				temp = temp + ", time to let the layers drop!"
 			}else if(weatherWidget.weatherData.temperature_string > 30){
 				temp = temp + ", it's hot and you probably don't need a sweater"
 			}else {temp = temp + " and cold weather doesn't have to suck, add an oversized coat! (and a ton of other cozy things)"
 			}

 			//wind factor
 			if(weatherWidget.weatherData.wind > 30){
 				wind = wind + ", it's so windy today you might as well wear a blanket"
 			}else if (weatherWidget.weatherData.wind === 0){
 				wind = wind + ", no wind today! Hell yeah!"
 			}else if (weatherWidget.weatherData.wind < 10){
 				wind = wind + ", just enough wind to make you wanna add another layer!"
 			}else if (weatherWidget.weatherData.wind < 30){
 				wind = wind + ", it's sorta windy, try to repurpose your sweater as a scarf!"
 			}else {
 				wind = wind + ", just enough wind to make you wanna add another layer!"
 			}


 			$(".search").hide();
 			$(".weather_string").text(conditions);
 			$(".temp").text(temp);
	 		$(".wind").text(wind);
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



