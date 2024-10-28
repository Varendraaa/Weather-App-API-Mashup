//API Call - WeatherAPI
const WeatherAPIKey = 'f236bd6c0331428cbea30535231312';

//Function to get weather data by taking the city input from the search bar
function checkWeather(city){
    const weather = `https://api.weatherapi.com/v1/forecast.json?key=${WeatherAPIKey}&q=${city}&days=5`;

    fetch(weather)
    .then((resp) => resp.json())
    .then(function(data){
        
        //Weather Main Data
            let city = data.location.name;
            let region = data.location.region;
            let country = data.location.country;
            let time = new Date(data.location.localtime).toLocaleDateString('en-US', {weekday: 'long',year: 'numeric',month: 'long',day: 'numeric'});
            let condition_main = data.current.condition.text;
            let weatherIMG ='https:' + data.current.condition.icon.replace('/64x64/','/128x128/');            
            
            let temp = data.current.temp_c;
            let feels_like = data.current.feelslike_c;
            let pressure = data.current.pressure_mb;
            let humidity = data.current.humidity;
            let wind = data.current.wind_kph;
            let wind_dir = data.current.wind_dir;
            let gust = data.current.gust_kph;
            let UVindex = data.current.uv;


        //Weather DOM Manipulation - JQUERY
            $('#current-location').html(city);
            $('#location-code').html(region);
            $('#time-main').html(time);
            $('#temp-main').html(temp + ' °C');
            $('#condition-main').html(condition_main);
            $('#img-main').attr('src',weatherIMG);

            $('#feels_like-main').html('Feels like: '+ feels_like +' °C');
            $('#pressure-main').html(pressure + 'mb');
            $('#humidity-main').html(humidity + '%');
            $('#wind-main').html(wind + 'km/h ' + wind_dir);
            $('#uv-main').html(UVindex);
            $('#gust-main').html(gust + 'km/h');



        //Weather Forecast Data
        const forecastdays = data.forecast.forecastday;        

        //Creating Weather Forecast Objects
        const forecastRowHTML = '<div class="row" id="forecastItem"></div>';

        //Clear existing items
       $('#forecastItem').empty();
       $('#forecast').append(forecastRowHTML);
        
       //Iterate through API's forecast array   
        forecastdays.forEach(forecastday =>
        {
            let date = new Date(forecastday.date).toLocaleDateString('en-US',{weekday: 'long' });
            let maxTemp = forecastday.day.maxtemp_c;
            let minTemp = forecastday.day.mintemp_c;
            let forecast_condition = forecastday.day.condition.text;
            let forecast_img = 'https:' + forecastday.day.condition.icon;                      

            //Create Card Section
            const forecastCard = `  <div class="col-md mt-3">
                                    <div class="card h-100 px-2 py-3  align-items-center">
                                        <h4>${date}</h4>
                                        <img src="${forecast_img}" alt="Weather Icon" width="64" height="64">
                                        <h6>High: ${maxTemp} °C</h6>
                                        <h6>Low: ${minTemp} °C</h6>
                                        <p>${forecast_condition}</p>                                        
                                    </div>
                                    </div>            `;

            //Add card to the section
            $('#forecastItem').append(forecastCard);
        })

    })
    .catch((error) => console.log(error));
}

//Ticketmaster API
const TicketmasterAPIKey = '1ACPwGWA63QYsxGKkwzK0Tq9RF1RHGtK';

//Function to select best image from TicketMaster's API
function filterImages(images, ratio, width) {
    return images.filter(image => {
        return (
            image.ratio === ratio &&
            image.width === width
        );
    });
}

//Function to get event information by taking the input from the searchbar
function checkEvents(city){
    const eventURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TicketmasterAPIKey}&city=${city}`;

    fetch(eventURL)
    .then((resp) => resp.json())
    .then(function(data){       

        //Main Event Information
        let shows = data._embedded.events;

        const rowHtml = '<div class="row" id="eventRow"></div>';
        // Clear existing event cards
        $('#eventRow').empty();
        
        $('#events').append(rowHtml);

        //Iterate through each event. Pick the highest quality Image
        shows.forEach(show => {
            const filteredImages = filterImages(show.images, "16_9", 1024);          

            const bestImage = filteredImages.length > 0 ? filteredImages[0] : null;
            const eventImg = bestImage ? bestImage : 'default-image-url';
            const eventName = show.name;
            const venueName = show._embedded.venues[0].name;
            const eventdate = new Date(show.dates.start.dateTime).toDateString();            
            const eventURL = show.url;
                       
            //create a new card
            const cardHtml = `  <div class="col-md-3 mb-2 pb-2">
                                    <div class="card h-100">
                                        <img class="card-img-top" src="${eventImg.url}">
                                    <div class="card-body text-center">
                                        <a href="${eventURL}" target="_blank" class="btn btn-primary">Get Tickets!</a>
                                        <h4 class="card-title mt-3">${eventName}</h4>
                                        <p class="card-text" id="event-location">${venueName}</p>
                                        <p class="card-text">${eventdate}</p>                                        
                                        
                                    </div>
                                    </div>
                                 </div>               
            `;
             
            // Append the new column to the row and add the new card
            $('#eventRow').append(cardHtml);

            
        }); 
        
    })
    .catch(function(error){
        console.log(error);
    });
       
}


//MAIN CODE
$(document).ready(function(){
    //set default city
    let defaultCity = 'Dundee';

    //load initial weather
    checkWeather(defaultCity);
    checkEvents(defaultCity);

    //Event Listener for the Enter Key
    $('#search').on('keypress', function(event){
        if (event.keyCode ==13){
            event.preventDefault();
        const inputval = $(this).val();

        checkWeather(inputval);
        checkEvents(inputval);

        }
    })

    // Event Listener for the Search Button
    $('#search-button').on('click', function(event) {
    event.preventDefault();
    const inputVal = $('#search').val();

    checkWeather(inputVal);
    checkEvents(inputVal);
});

})