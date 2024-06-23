import "leaflet.locatecontrol"
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"
import L from "leaflet"
import 'leaflet/dist/leaflet.css'

import house from '../../images/houses-svgrepo.svg'

import { leaflet } from "../constants/leaflet"
import { crud } from "../constants/crud"
import { reder_el } from "../utils/reder_el"

export class LeafletUX {

    position_marker = null
    point_marker = null
    popup = null
    location_accurency = []

    mouse_has_moved = null
    timerId = null

    constructor( initial_location ) {

        this.map = leaflet.bigMap(initial_location)
        this.miniature = leaflet.miniMap(initial_location)

        this.layers = leaflet.initLayers({
            map: this.map,
            miniature: this.miniature,
            topografica: leaflet.topografica,
            geografica: leaflet.geografica,
            roards: leaflet.roards
        })

        this.my_location_control()

        this.map.on('zoom', ev => this.update_miniature_map(ev))
        this.map.on('moveend', ev => this.update_miniature_map(ev))
        this.map.on('resize', ev => this.update_miniature_map(ev))

        this.miniature.on('click', ev => this.switch_maps())

        // Desktop Add Marker
        this.map.on('mousedown', ev => this.add_marker_long_press(ev))
        this.map.on('mousemove', () => this.mouse_has_moved = true)
        this.map.on('mouseup', () => clearTimeout(this.timerId))

        // Mobile Add Marker
        if ( 'ontouchstart' in document.documentElement ) {

            this.map.on('contextmenu', (e) => this.set_marker( e.latlng ))

        } else {

            // Disable right click on Desktop
            this.map.addEventListener('contextmenu', e => e.preventDefault())
        }

        this.init()
    }

    init() {

        const housed = document.querySelector('.housed')

        if( housed ) {

            leaflet.addController({
                map: this.map,
                icon: house,
                handler: ev => housed.parentNode.classList.toggle('show-houses')
            })

            const btns_edits = housed.querySelectorAll('.btn.edit')
            const btns_save = housed.querySelectorAll('.btn.save')
            const btns_delites = housed.querySelectorAll('.btn.delete')

            btns_edits.forEach( btn => btn.addEventListener( 'click', ev => this.edit_house( btn, btn.closest('.house') ) ) )
            btns_save.forEach( btn => btn.addEventListener( 'click', ev => this.save_house( btn, btn.closest('.house') ) ) )
            btns_delites.forEach( btn => btn.addEventListener( 'click', ev => this.delete_house( btn, btn.closest('.house') ) ) )
        }
    }

    deactivate_old_house_edit() {

        const lock_hover = document.querySelector('.info-container.lock_hover')

        if ( lock_hover ) {

            const title = lock_hover.querySelector('.title')
            const lat = lock_hover.querySelector('.lat span')
            const lng = lock_hover.querySelector('.lng span')
            const btn_save = document.querySelector('.btn.save:not(.d-none)')
            const btn_edit = document.querySelector('.btn.edit.d-none')

            title.removeAttribute('contenteditable', true)
            lat.removeAttribute('contenteditable', true)
            lng.removeAttribute('contenteditable', true)

            lock_hover.classList.remove('lock_hover')
            lock_hover.classList.remove('editable')
            btn_save.classList.add('d-none')
            btn_edit.classList.remove('d-none')
        }
    }

    edit_house( btn, house_item ) {

        this.deactivate_old_house_edit()

        const info = house_item.querySelector('.info-container')
        const btn_save = house_item.querySelector('.btn.save')
        const title = info.querySelector('.title')
        const lat = info.querySelector('.lat span')
        const lng = info.querySelector('.lng span')

        if ( ! info.classList.contains('lock_hover') ) {

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
        btn.classList.toggle('d-none')
        btn_save.classList.toggle('d-none')
    }

    save_house( btn, house_item ) {

        const house_id = house_item.getAttribute('house-id')
        const title = house_item.querySelector('.title')
        const lat = house_item.querySelector('.lat')
        const lng = house_item.querySelector('.lng')

        crud.update_location({
            house_id,
            title: title.textContent,
            lat: lat.getAttribute('lat'),
            lng: lng.getAttribute('lng')
        }).then(res => {

            res = JSON.parse(res)

            if ( res.status === 'success' ) {
                this.deactivate_old_house_edit()
            }
        })
    }

    delete_house( btn, house_item ) {

        const house_id = house_item.getAttribute('house-id')

        crud.delete_location({house_id}).then(res => {

            res = JSON.parse(res)

            if ( res.status === 'success' ) {
                house_item.remove()
            }
        })
    }


    handle_create_location( btn, latlng ) {

        const save_label = btn.querySelector('.save-label')
        const loading_dots = reder_el('span', [], '...')
        loading_dots.style.letterSpacing = '-7px'
        loading_dots.style.textIndent = '-7px'
            
        btn.classList.add('loading')
        save_label.append(loading_dots)

        crud.create_location( latlng ).then( res => {

            loading_dots.remove()
            save_label.textContent = 'Saved'
            btn.classList.remove('loading')
            btn.classList.add('loaded')
            this.position_marker && this.position_marker.remove()

            L.marker(latlng, { icon: leaflet.saved_marker }).addTo(this.map)
        })
    }

    build_popup_marker( latlng ) {

        const button = reder_el( 'button', ['btn', 'btn-add-house'], leaflet.save_point_map )
        button.addEventListener('click', ev => this.handle_create_location( button, latlng ), false)

        const popup_content = reder_el('span', ['text-center', 'popup-items'])
        popup_content.append(button)

        return popup_content
    }

    set_marker( latlng ) {

        if( this.position_marker ) {
            this.position_marker.remove()
            this.point_marker.remove()
        }

        this.position_marker = L.marker(latlng, { icon: leaflet.marker }).addTo(this.map)
        this.point_marker = L.marker( latlng, { icon: leaflet.point_marker }).addTo(this.map)

        this.popup = L.popup(latlng, {
            offset: { x: 0, y: -50 },
            closeOnClick: false,
            content: this.build_popup_marker(latlng),
        }).openOn(this.map)

        this.position_marker.on('click', ev => this.popup.openOn(this.map))
    }


    my_location_found( e ) {

        if (this.location_accurency.filter((location) => location.lat === e.latlng.lat && location.lng === e.latlng.lng).length === 0) {
    
            set_marker( e.latlng )
            this.location_accurency.push({ lat: e.latlng.lat, lng: e.latlng.lng })
        }
    }

    my_location_control() {

        this.map.addControl(
            L.control.locate({
                locateOptions: { maxZoom: 10, enableHighAccuracy: true }
            })
        )
    
        this.map.on('locationfound', ev => this.my_location_found(ev))
    }


    update_miniature_map( e ) {
    
        const zoom = (
            (e.sourceTarget._animateToZoom || e.sourceTarget._zoom) - 3 > 0
                ? (e.sourceTarget._animateToZoom || e.sourceTarget._zoom) - 3
                : 0
        )
    
        this.miniature.flyTo(new L.LatLng(e.sourceTarget.getCenter().lat, e.sourceTarget.getCenter().lng), zoom)
    }

    switch_maps() {

        if (leaflet.selected == 'topografica') {

            this.layers.mini.setUrl(leaflet.topografica)
            this.layers.map.setUrl(leaflet.geografica)
            leaflet.selected = 'geografica'

        } else {

            this.layers.mini.setUrl(leaflet.geografica)
            this.layers.map.setUrl(leaflet.topografica)
            leaflet.selected = 'topografica'
        }
    }


    add_marker_long_press( e ) {

        this.timerId = setTimeout(() => {

            if ( ! this.mouse_has_moved ) {
                this.set_marker( e.latlng )
            }
        }, 800)

        this.mouse_has_moved = false
    }
}