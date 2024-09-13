import { LeafletUX } from "../user_experience/leaflet_ux"

new Promise( async (resolve) => {

    const response = await fetch('https://ip-geo-location.p.rapidapi.com/ip/check?format=json&language=en', {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.IP_LOCATION,
            'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com'
        }
    })

    resolve( response.json() )

}).then( val => new LeafletUX( val.location ) )
