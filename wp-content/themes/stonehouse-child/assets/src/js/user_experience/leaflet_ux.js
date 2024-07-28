import "leaflet.locatecontrol"
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"
import L from "leaflet"
import 'leaflet/dist/leaflet.css'

import "leaflet.markercluster/dist/leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"

import "leaflet-routing-machine/dist/leaflet-routing-machine.min.js"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"

import house from '../../images/houses-svgrepo.svg'
import walking from '../../images/walking.svg'
import cycling from '../../images/cycling.svg'
import car from '../../images/car.svg'

import { MAP3D } from "./3d_map"
import { leaflet } from "../constants/leaflet"
import { crud } from "../constants/crud"
import { reder_el } from "../utils/reder_el"
import { createElementFromHTML } from "../utils/dom_from_string"


export class LeafletUX {

    position_marker = null
    my_position_marker = null
    router_controller = null
    point_marker = null
    popup = null
    location_accurency = []

    mouse_has_moved = null
    timerId = null

    editing_my_coordiate = false

    constructor( initial_location ) {

        this.map = leaflet.bigMap(initial_location)
        this.miniature = leaflet.miniMap(initial_location)
        this.details = document.querySelector('.details')

        this.layers = leaflet.initLayers({
            map: this.map,
            miniature: this.miniature,
            topografica: leaflet.topografica,
            geografica: leaflet.geografica,
            roards: leaflet.roards
        })

        this.markers = new L.MarkerClusterGroup()

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

            this.map.on('contextmenu', e => this.set_marker( e.latlng ))

        } else {

            // Disable right click on Desktop
            this.map.addEventListener('contextmenu', ev => ev.originalEvent.preventDefault())
        }

        this.init()

        // new MAP3D(L, this.map, this.layers.map);
    }

    build_routeing_path( latlng, profile ) {

        this.map.locate({ setView: false })

        const my_position_loaded = (state) => {

            if( this.my_position_marker ) {
            
                // console.log(latlng, this.my_position_marker)

                this.router_controller && this.router_controller.remove()

                this.router_controller = L.Routing.control({
                    router: L.Routing.mapbox(
                        process.env.ROUTING_MAPBOX,
                        {
                            profile: profile,
                            // polylinePrecision: 6
                        }
                    ),
                    routeWhileDragging: false,
                    routeDragInterval: 5000,

                    draggableWaypoints: false,
                    
                    addWaypoints: false,
                    extendToWaypoints: true,
                    missingRouteTolerance: 10,
                    
                    lineOptions: {
                        addWaypoints: false
                    },
                    createMarker: function() { return null; },

                    waypoints: [
                        this.my_position_marker,
                        latlng
                    ]
                }).on('routeselected',(e) => {

                    const bounds = this.my_position_marker.toBounds( 500 )
                    this.map.flyTo(this.my_position_marker).flyToBounds(bounds)

                }).addTo(this.map)

                clearInterval(state)
            }

        }
        const interval_state = setInterval( () => my_position_loaded( interval_state ), 100 )
    }


    build_router_popup_marker(latlng) {

        const btn_walking = reder_el( 'button', ['btn', 'btn-routing', 'btn-walking'], `<img src="${walking}" />` )
        const btn_cycling = reder_el( 'button', ['btn', 'btn-routing', 'btn-cycling'], `<img src="${cycling}" />` )
        const btn_car = reder_el( 'button', ['btn', 'btn-routing', 'btn-car'], `<img src="${car}" />` )

        btn_walking.addEventListener('click', ev => this.build_routeing_path( latlng, 'mapbox/walking' ), false)
        btn_cycling.addEventListener('click', ev => this.build_routeing_path( latlng, 'mapbox/cycling' ), false)
        btn_car.addEventListener('click', ev => this.build_routeing_path( latlng, 'mapbox/driving-traffic' ), false)

        const popup_content = reder_el('span', ['text-center', 'routing-items'])
        popup_content.append(btn_walking)
        popup_content.append(btn_cycling)
        popup_content.append(btn_car)

        return popup_content
    }

    init() {

        if( this.details ) {

            leaflet.addController({
                map: this.map,
                icon: house,
                handler: ev => {
                    this.details.parentNode.classList.toggle('show-houses')
                    this.map.invalidateSize()
                }
            })

            const info_containers = this.details.querySelectorAll('.info-container')
            const btns_edits = this.details.querySelectorAll('.btn.edit')
            const btns_save = this.details.querySelectorAll('.btn.save')
            const btns_delites = this.details.querySelectorAll('.btn.delete')

            info_containers.forEach( item => {
                item.addEventListener( 'mouseover', ev => !this.editing_my_coordiate && this.focus_marker( item ) )
                item.addEventListener( 'click', ev => this.focus_marker( item ) )
            })

            btns_edits.forEach( btn => btn.addEventListener( 'click', ev => this.edit_house( btn, btn.closest('.house') ) ) )
            btns_save.forEach( btn => btn.addEventListener( 'click', ev => this.save_house( btn, btn.closest('.house') ) ) )
            btns_delites.forEach( btn => btn.addEventListener( 'click', ev => this.delete_house( btn, btn.closest('.house') ) ) )
        }

        // Add existing Markers on map
        if ( stonehouse_data.locations.length ) {

            stonehouse_data.locations.forEach( post => {

                const latlng = new L.LatLng(post.location.lat, post.location.lng)

                const marker = L.marker(latlng, { icon: leaflet.marker_success }).on('click', ev => {
                    this.set_popup( latlng, this.build_router_popup_marker(latlng) )
                    console.log(latlng)
                })
                this.markers.addLayer( marker )
            })
        }

        this.map.addLayer(this.markers)
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

        this.editing_my_coordiate = true
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
            house_id: parseInt( house_id ),
            title: title.textContent,
            lat: lat.getAttribute('lat'),
            lng: lng.getAttribute('lng')
        }).then(res => {

            this.editing_my_coordiate = false
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

                const lat = house_item.querySelector('.lat').getAttribute('lat')
                const lng = house_item.querySelector('.lng').getAttribute('lng')

                this.markers.getLayers().forEach(marker => {

                    if (
                        parseFloat(lat) === marker._latlng.lat &&
                        parseFloat(lng) === marker._latlng.lng
                    ) {
                        this.markers.removeLayer(marker);
                    }
                })

                house_item.remove()
            }
        })
    }

    focus_marker( item ) {

        const lat = item.querySelector('.lat').getAttribute('lat')
        const lng = item.querySelector('.lng').getAttribute('lng')

        const latLon = new L.LatLng(parseFloat(lat), parseFloat(lng))
        const bounds = latLon.toBounds( 500 )

        this.map.flyTo(latLon).flyToBounds(bounds)

        if ( this.editing_my_coordiate ) {
            const house = item.closest('.house')
            this.edit_house( house.querySelector('.btn.edit'), house )
        }
    }

    build_house_item( house_id, title, lat, lng ) {
        return createElementFromHTML(
            `<div class="house" house-id="${house_id}">
                <div class="info-container d-flex align-center">
                    <svg fill="#000000" width="20px" height="100%" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M23.505 0c0.271 0 0.549 0.107 0.757 0.316 0.417 0.417 0.417 1.098 0 1.515l-14.258 14.264 14.050 14.050c0.417 0.417 0.417 1.098 0 1.515s-1.098 0.417-1.515 0l-14.807-14.807c-0.417-0.417-0.417-1.098 0-1.515l15.015-15.022c0.208-0.208 0.486-0.316 0.757-0.316z"></path></svg>
                    <div class="info">
                        <div class="title">${title}</div>
                        <div class="location">
                            <div class="lat" lat="${lat}">lat: <span>${lat}</span></div>
                            <div class="lng" lng="${lng}">lng: <span>${lng}</span></div>
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <div class="btn edit">
                        <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                    <div class="btn save d-none">
                        <svg width="15px" height="15px" class="save-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-152.000000, -515.000000)" fill="#000000"><path d="M171,525 C171.552,525 172,524.553 172,524 L172,520 C172,519.447 171.552,519 171,519 C170.448,519 170,519.447 170,520 L170,524 C170,524.553 170.448,525 171,525 L171,525 Z M182,543 C182,544.104 181.104,545 180,545 L156,545 C154.896,545 154,544.104 154,543 L154,519 C154,517.896 154.896,517 156,517 L158,517 L158,527 C158,528.104 158.896,529 160,529 L176,529 C177.104,529 178,528.104 178,527 L178,517 L180,517 C181.104,517 182,517.896 182,519 L182,543 L182,543 Z M160,517 L176,517 L176,526 C176,526.553 175.552,527 175,527 L161,527 C160.448,527 160,526.553 160,526 L160,517 L160,517 Z M180,515 L156,515 C153.791,515 152,516.791 152,519 L152,543 C152,545.209 153.791,547 156,547 L180,547 C182.209,547 184,545.209 184,543 L184,519 C184,516.791 182.209,515 180,515 L180,515 Z" id="save-floppy" sketch:type="MSShapeGroup"></path></g></svg>
                    </div>
                    <div class="btn delete">
                        <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </div>
                </div>
            </div>`
        )
    }

    handle_create_location( btn, latlng ) {

        const save_label = btn.querySelector('.save-label')
        const loading_dots = reder_el('span', [], '...')
        loading_dots.style.letterSpacing = '-7px'
        loading_dots.style.textIndent = '-7px'
            
        btn.classList.add('loading')
        save_label.append(loading_dots)

        crud.create_location( latlng ).then( res => {

            res = JSON.parse(res)

            if ( res.status === 'success' ) {

                loading_dots.remove()
                save_label.textContent = 'Saved'
                btn.classList.remove('loading')
                btn.classList.add('loaded')

                this.position_marker.remove()
                const marker = L.marker(latlng, { icon: leaflet.marker_success }).on('click', ev => this.set_popup( latlng, this.build_router_popup_marker(latlng) ))
                this.markers.addLayer( marker )

                const new_item = this.build_house_item(res.message.id, res.message.title, res.message.location.lat, res.message.location.lng)

                const info_container = new_item.querySelector('.info-container')
                const btn_edit = new_item.querySelector('.btn.edit')
                const btn_save = new_item.querySelector('.btn.save')
                const btn_delite = new_item.querySelector('.btn.delete')

                info_container.addEventListener( 'mouseover', ev => !this.editing_my_coordiate && this.focus_marker( info_container ) )
                info_container.addEventListener( 'click', ev => this.focus_marker( info_container ) )
                btn_edit.addEventListener( 'click', ev => this.edit_house( btn_edit, btn_edit.closest('.house') ) )
                btn_save.addEventListener( 'click', ev => this.save_house( btn_save, btn_save.closest('.house') ) )
                btn_delite.addEventListener( 'click', ev => this.delete_house( btn_delite, btn_delite.closest('.house') ) )

                this.details.prepend(new_item)
            } else {

                save_label.textContent = 'Error'
                btn.classList.remove('loading')
                btn.classList.add('error')

                this.position_marker.remove()
                /* const marker = */ L.marker(latlng, { icon: leaflet.marker_error }).addTo(this.map)
                // this.markers.addLayer( marker )
            }
        })
    }

    build_save_popup_marker( latlng ) {

        const button = reder_el( 'button', ['btn', 'btn-add-house'], leaflet.save_point_map )
        button.addEventListener('click', ev => this.handle_create_location( button, latlng ), false)

        const popup_content = reder_el('span', ['text-center', 'popup-items'])
        popup_content.append(button)

        return popup_content
    }

    set_popup( latlng, content, on_remove = null ) {

        this.popup = L.popup(latlng, {
            offset: { x: 0, y: -50 },
            closeOnClick: false,
            content: content,
        }).openOn(this.map).on('remove', ev => {
            on_remove && on_remove(ev)
        })
    }

    set_marker( latlng ) {

        this.position_marker && this.position_marker.remove()
        this.point_marker && this.point_marker.remove()

        this.set_popup(
            latlng,
            this.build_save_popup_marker(latlng),
            () => {

                this.position_marker && this.position_marker.remove()
                this.point_marker && this.point_marker.remove()
            }
        )

        this.position_marker = L.marker(latlng, { icon: leaflet.marker }).addTo(this.map)
        this.point_marker = L.marker( latlng, { icon: leaflet.point_marker }).addTo(this.map)
    }


    my_location_found( e ) {

        // fix provider location found (bug iliad milano and france location bug)
        if (this.location_accurency.filter((location) => location.lat === e.latlng.lat && location.lng === e.latlng.lng).length === 0) {

            this.my_position_marker = e.latlng

            L.marker( e.latlng, { icon: leaflet.point_marker }).addTo(this.map)
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