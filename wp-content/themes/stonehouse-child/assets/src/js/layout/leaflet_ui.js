import house from '../../images/houses-svgrepo.svg'

import { leaflet } from "../constants/leaflet"
import { crud } from "../constants/crud"

export class LeafletUI {

    constructor(map) {

        const housed = document.querySelector('.housed')

        if( housed ) {

            leaflet.addController({
                map: map,
                icon: house,
                handler: ev => housed.parentNode.classList.toggle('show-houses')
            })

            const btns_edits = housed.querySelectorAll('.btn.edit')
            const btns_save = housed.querySelectorAll('.btn.save')
            const btns_delets = housed.querySelectorAll('.btn.delete')

            btns_edits.forEach( btn => btn.addEventListener( 'click', ev => this.edit_house( btn, btn.closest('.house') ) ) )
            btns_save.forEach( btn => btn.addEventListener( 'click', ev => this.save_house( btn, btn.closest('.house') ) ) )
            btns_delets.forEach( btn => btn.addEventListener( 'click', ev => this.delete_house( btn, btn.closest('.house') ) ) )
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
}