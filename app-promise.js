//329d1642ac213420b7f40d7ebffc7a2e


const yargs = require('yargs');
const axios = require('axios');


// users arguments 
const argv = yargs
    .option({
    address:
    {
        alias : 'a',
        describe : 'Address of the location',
        demand : true,
        string:true,
        default : 'Kelana Jaya'
    }
    })
    .help()
    .alias('help','h')
    .argv;

    console.log(argv);

   
    let encodedAddress = encodeURIComponent(argv.address);
    let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

    //get latitude and longitute
    
    axios.get(geocodeUrl)
    .then
    (
        
        response =>
        {
            if(response.data.status === "ZERO_RESULTS"){
                throw new Error("Please check the address");
            }
        let latitude = encodeURIComponent(JSON.stringify(response.data.results[0].geometry.location.lat,undefined,2));
           
        let longitude = encodeURIComponent(JSON.stringify(response.data.results[0].geometry.location.lng,undefined,2));
      
        let weatherUrl = `https://api.darksky.net/forecast/329d1642ac213420b7f40d7ebffc7a2e/${latitude},${longitude}`;
            console.log(response.data.results[0].formatted_address);

            return axios.get(weatherUrl).then(response =>{
                // temperature
                console.log(response.data.currently);
                let temperature = response.data.currently.temperature;
                let apparentTemperature = response.data.currently.apparentTemperature;
                
                console.log(`It is ${temperature} but it feels like ${apparentTemperature}`);

                let summary = {
                    humidity: response.data.currently.humidity,
                    Windspeed : response.data.currently.windSpeed,
                    temperature : response.data.currently.temperature,
                    apparentTemperature : response.data.currently.apparentTemperature
                };

                console.log(`So here are the important information : ${JSON.stringify(summary,undefined,2)}`);
            });
        }
    )
    .catch(error => {
        if(error.code === "ECONNREFUSED"){
                console.log(`Unable to connect to Google API server`);
        } else{
                console.log(error.message);
        }
    });
  