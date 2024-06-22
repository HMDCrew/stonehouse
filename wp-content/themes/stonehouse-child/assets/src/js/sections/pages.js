import { init_map } from "./leaflet"
import { sendHttpReq } from "../utils/api"

console.log(stonehouse_data)

new Promise(async (resolve) => {

    const response = await fetch('https://ip-geo-location.p.rapidapi.com/ip/check?format=json&language=en', {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '77bc1a30eamsha0c29e7a0814603p19ceffjsnd0ad03731219',
            'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com'
        }
    })

    resolve(response.json())

}).then(val => {

    init_map(
        val.location,
        (latlng) => new Promise((resolve) => {

            sendHttpReq({
                url: stonehouse_data.json_url + 'save-house',
                data: {
                    location: latlng
                },
                method: 'POST',
                headers: {
                    'X-WP-Nonce': stonehouse_data.nonce
                },
            }).then(res => {

                res = JSON.parse(res)

                resolve(res)
            })
        })
    )
})
