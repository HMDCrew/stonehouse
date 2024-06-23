import { init_map } from "./leaflet"

new Promise( async (resolve) => {

    const response = await fetch('https://ip-geo-location.p.rapidapi.com/ip/check?format=json&language=en', {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '77bc1a30eamsha0c29e7a0814603p19ceffjsnd0ad03731219',
            'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com'
        }
    })

    resolve( response.json() )

}).then( val => init_map( val.location ) )
