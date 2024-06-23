import "leaflet.locatecontrol"
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"
import L from "leaflet"
import 'leaflet/dist/leaflet.css'

import { reder_el } from "../utils/helpers"
import { leaflet } from "../constants/leaflet"
import { crud } from "../constants/crud"
import { LeafletUI } from "../layout/leaflet_ui"

let point_marker
let position_marker
let popup

const popup_marker_content = (map, latlng) => {

    const popup_content = reder_el('span', ['text-center', 'popup-items'])
    const button = reder_el( 'button', ['btn', 'btn-add-house'], leaflet.save_point_map )

    button.addEventListener('click', ev => {
    
        const save_label = button.querySelector('.save-label')
        const loading_dots = reder_el('span', [], '...')
        loading_dots.style.letterSpacing = '-7px'
        loading_dots.style.textIndent = '-7px'
        
        button.classList.add('loading')
        save_label.append(loading_dots)

        crud.create_location( latlng ).then( res => {

            loading_dots.remove()
            save_label.textContent = 'Saved'
            button.classList.remove('loading')
            button.classList.add('loaded')
            position_marker.remove()

            L.marker(latlng, { icon: leaflet.saved_marker }).addTo(map)
        })
    }, false)

    popup_content.append(button)

    return popup_content
}

const set_marker = (map, latlng) => {

    position_marker ? position_marker.remove() : ''
    position_marker = L.marker(latlng, { icon: leaflet.marker }).addTo(map)

    point_marker ? point_marker.remove() : ''
    point_marker = L.marker( latlng, { icon: leaflet.point_marker }).addTo(map)
    
    popup = L.popup(latlng, {
        offset: { x: 0, y: -50 },
        closeOnClick: false,
        content: popup_marker_content(map, latlng),
    }).openOn(map)

    position_marker.on('click', ev => popup.openOn(map))
}

let location_accurency = []
const location_found = (e, map) => {

    if (location_accurency.filter((location) => location.lat === e.latlng.lat && location.lng === e.latlng.lng).length === 0) {

        set_marker(map, e.latlng)
        location_accurency.push({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
}


const map_controlls = (map) => {

    map.addControl(
        L.control.locate({
            locateOptions: {
                maxZoom: 10,
                enableHighAccuracy: true
            }
        })
    )

    map.on('locationfound', ev => location_found(ev, map));
}


const update_miniature_map = (e, miniature) => {
    
    const zoom = (
        (e.sourceTarget._animateToZoom || e.sourceTarget._zoom) - 3 > 0
            ? (e.sourceTarget._animateToZoom || e.sourceTarget._zoom) - 3
            : 0
    )

    miniature.flyTo(new L.LatLng(e.sourceTarget.getCenter().lat, e.sourceTarget.getCenter().lng), zoom)
}


const switch_maps = (layers) => {
    if (leaflet.selected == 'topografica') {
        layers.mini.setUrl(leaflet.topografica)
        layers.map.setUrl(leaflet.geografica)
        leaflet.selected = 'geografica'
    } else {
        layers.mini.setUrl(leaflet.geografica)
        layers.map.setUrl(leaflet.topografica)
        leaflet.selected = 'topografica'
    }
}


export const init_map = (init) => {

    const map = leaflet.stonemap(init)
    const miniature = leaflet.miniMap(init)

    const layers = leaflet.initLayers({
        map,
        miniature,
        topografica: leaflet.topografica,
        geografica: leaflet.geografica,
        roards: leaflet.roards
    })
    map_controlls(map)

    map.on('zoom', (e) => update_miniature_map(e, miniature))
    map.on('moveend', (e) => update_miniature_map(e, miniature))
    map.on('resize', (e) => update_miniature_map(e, miniature))

    miniature.on('click', ev => switch_maps(layers))

    let mouse_has_moved
    let timerId

    const add_marker_long_press = (e) => {

        timerId = setTimeout(() => {

            if ( ! mouse_has_moved ) {
                set_marker(map, e.latlng)
            }
        }, 800)

        mouse_has_moved = false
    }
    map.on('mousedown', e => add_marker_long_press(e))
    map.on('mousemove', () => mouse_has_moved = true)
    map.on('mouseup', () => clearTimeout(timerId))

    // contextmenu is mobile version of ( mousedown, mousemove, mouseup )
    if ( 'ontouchstart' in document.documentElement ) {
        map.on('contextmenu', (e) => set_marker(map, e.latlng))
    } else {
        map.addEventListener('contextmenu', e => e.preventDefault())
    }

    new LeafletUI(map)
}
