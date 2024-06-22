import "leaflet.locatecontrol"
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"
import L from "leaflet"
import 'leaflet/dist/leaflet.css'

import { reder_el, simulate_click } from "../utils/helpers"
import house from '../../images/houses-svgrepo.svg'
import { leaflet } from "../constants/leaflet"

let point_marker
let position_marker
let popup

const add_layers = (map, miniature) => {

    const big_map = L.tileLayer(leaflet.topografica, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a> | Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        subdomains: 'abcd',
        maxZoom: 18
    }).addTo(map)


    L.tileLayer(leaflet.roards, {
        subdomains: 'abcd',
        maxZoom: 18
    }).addTo(map)

    return {
        map: big_map,
        mini: L.tileLayer(leaflet.geografica).addTo(miniature),
    }
}

const popup_marker_content = (map, save_location, latlng) => {

    const popup_content = reder_el('span', ['text-center', 'popup-items'])
    const button = reder_el( 'button', ['btn', 'btn-add-house'], leaflet.save_point_map )

    button.addEventListener('click', ev => {
    
        const save_label = button.querySelector('.save-label')
        const loading_dots = reder_el('span', [], '...')
        loading_dots.style.letterSpacing = '-7px'
        loading_dots.style.textIndent = '-7px'
        
        button.classList.add('loading')
        save_label.append(loading_dots)

        new Promise( ( resolve ) => resolve( save_location( latlng ) ) ).then(
            () => {
                loading_dots.remove()
                save_label.textContent = 'Saved'
                button.classList.remove('loading')
                button.classList.add('loaded')
                position_marker.remove()

                L.marker(latlng, { icon: leaflet.saved_marker }).addTo(map)
            }
        )
    }, false)

    popup_content.append(button)

    return popup_content
}

const set_marker = (map, latlng, popup_event) => {

    position_marker ? position_marker.remove() : ''
    position_marker = L.marker(latlng, { icon: leaflet.marker }).addTo(map)

    point_marker ? point_marker.remove() : ''
    point_marker = L.marker( latlng, { icon: leaflet.point_marker }).addTo(map)
    
    popup = L.popup(latlng, {
        offset: { x: 0, y: -50 },
        closeOnClick: false,
        content: popup_marker_content(map, popup_event, latlng),
    }).openOn(map)

    position_marker.on('click', ev => popup.openOn(map))
}

let location_accurency = []
const location_found = (e, map, save_location) => {

    if (location_accurency.filter((location) => location.lat === e.latlng.lat && location.lng === e.latlng.lng).length === 0) {

        set_marker(map, e.latlng, save_location)
        location_accurency.push({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
}


const map_controlls = (map, save_location) => {

    map.addControl(
        L.control.locate({
            locateOptions: {
                maxZoom: 10,
                enableHighAccuracy: true
            }
        })
    )

    map.on('locationfound', ev => location_found(ev, map, save_location));
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


export const init_map = (init, save_location) => {

    const map = leaflet.stonemap(init)
    const miniature = leaflet.miniMap(init)

    const layers = leaflet.initLayers({
        map,
        miniature,
        topografica: leaflet.topografica,
        geografica: leaflet.geografica,
        roards: leaflet.roards
    })
    map_controlls(map, save_location)

    map.on('zoom', (e) => update_miniature_map(e, miniature))
    map.on('moveend', (e) => update_miniature_map(e, miniature))
    map.on('resize', (e) => update_miniature_map(e, miniature))

    miniature.on('click', ev => switch_maps(layers))

    let mouse_has_moved
    let timerId

    const add_marker_long_press = (e) => {

        timerId = setTimeout(() => {

            if (!mouse_has_moved) {
                set_marker(map, e.latlng, save_location)
            }
        }, 800)

        mouse_has_moved = false
    }
    map.on('mousedown', e => add_marker_long_press(e))
    map.on('mousemove', () => mouse_has_moved = true)
    map.on('mouseup', () => clearTimeout(timerId))

    // contextmenu is mobile version of ( mousedown, mousemove, mouseup )
    if ( 'ontouchstart' in document.documentElement ) {
        map.on('contextmenu', (e) => set_marker(map, e.latlng, save_location))
    } else {
        map.addEventListener('contextmenu', e => e.preventDefault())
    }


    // Saved hauses
    const housed = document.querySelector('.housed')

    if ( housed ) {
        leaflet.addController({
            map: map,
            icon: house,
            handler: ( ev ) => housed.parentNode.classList.toggle('show-houses')
        })

        const btns_edits = housed.querySelectorAll('.btn.edit')
        const btns_delets = housed.querySelectorAll('.btn.delete')


        const deactivate_old_house_edit = () => {

            const lock_hover = document.querySelector('.info-container.lock_hover')

            if ( lock_hover ) {

                const title = lock_hover.querySelector('.title')
                const lat = lock_hover.querySelector('.lat span')
                const lng = lock_hover.querySelector('.lng span')

                title.removeAttribute('contenteditable', true)
                lat.removeAttribute('contenteditable', true)
                lng.removeAttribute('contenteditable', true)

                lock_hover.classList.remove('lock_hover')
                lock_hover.classList.remove('editable')
            }
        }

        const edit_house = ( house_item ) => {
            
            deactivate_old_house_edit()

            const info = house_item.querySelector('.info-container')
            const title = info.querySelector('.title')
            const lat = info.querySelector('.lat span')
            const lng = info.querySelector('.lng span')


            if ( !info.classList.contains('lock_hover') ) {
                title.setAttribute('contenteditable', true)
                lat.setAttribute('contenteditable', true)
                lng.setAttribute('contenteditable', true)
                title.focus()
            } else {
                title.removeAttribute('contenteditable', true)
                lat.removeAttribute('contenteditable', true)
                lng.removeAttribute('contenteditable', true)
            }


            info.classList.toggle('lock_hover')
            info.classList.toggle('editable')
        }

        const delete_house = ( house_item ) => {

        }

        btns_edits.forEach( btn => btn.addEventListener( 'click', ev => edit_house( btn.closest('.house') ) ) )
        btns_delets.forEach( btn => btn.addEventListener( 'click', ev => delete_house( btn.closest('.house') ) ) )
    }
}
