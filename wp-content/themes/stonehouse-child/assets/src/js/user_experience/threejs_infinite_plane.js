import * as THREE from 'three'
import { MapControls } from 'three/examples/jsm/controls/MapControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

export class MAP_3D {
    constructor() {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer()

        // lighting
        this.light = new THREE.DirectionalLight(0xffffff, 1)

        // Create grid helper
        this.gridHelper = new THREE.GridHelper(100, 100)
        this.controls = new MapControls(this.camera, this.renderer.domElement)
        this.loader = new FontLoader()

        // infinite plane settings
        this.planeSize = 2
        this.numPlanes = 10; // Number of planes per row/column
        this.planes = []

        this.loader.load(
            new URL('three/examples/fonts/helvetiker_regular.typeface.json', import.meta.url),
            (font) => {
                // console.log(font)
                this.init(font)
                this.animate()
            },
            (xhr) => {
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded')
            },
            (err) => {
                console.log('An error happened')
            }
        )
    }

    init(font) {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        // Set camera position
        this.camera.position.y = 5
        // this.camera.far = 2000
        // this.camera.updateProjectionMatrix()

        this.light.position.set(1, 1, 1).normalize()
        this.scene.add(this.light)
        this.scene.add(this.gridHelper)

        // infinite plane
        for (let x = -this.numPlanes / 2; x < this.numPlanes / 2; x++) {
            for (let z = -this.numPlanes / 2; z < this.numPlanes / 2; z++) {
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(this.planeSize, this.planeSize),
                    new THREE.MeshBasicMaterial({
                        color: ((x % 2 === 0 && z % 2 === 0) || (x % 2 !== 0 && z % 2 !== 0)) ? 0xffffff : 0x000000,
                        side: THREE.DoubleSide,
                    })
                )

                const geometry = new TextGeometry(`(${x}, ${z})`, {
                    font: font,
                    size: 0.4,
                    depth: 0,
                    curveSegments: 12,
                    bevelEnabled: false,
                })
                const txt_mat = new THREE.MeshPhongMaterial({ color: 0xffffff })
                const txt_mesh = new THREE.Mesh(geometry, txt_mat)

                geometry.computeBoundingBox()
                const bbox = geometry.boundingBox
                const textWidth = bbox.max.x - bbox.min.x

                txt_mesh.position.set(-textWidth / 2, 0, 0.1)
                plane.add(txt_mesh)

                plane.rotation.x = -Math.PI / 2
                plane.position.set(x * this.planeSize, 0, z * this.planeSize)

                this.scene.add(plane)
                this.planes.push(plane)
            }
        }

        // Set initial control settings
        this.controls.enableDamping = true
        this.controls.dampingFactor = 0.25
        this.controls.screenSpacePanning = false

        // limit zoom levels
        this.controls.minDistance = 1;
        this.controls.maxDistance = 50;
//        this.controls.maxPolarAngle = Math.PI / 2

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        })

        // LatLng {lat: 45.46113525167, lng: 9.2018222808838}
        // LatLng {lat: 45.457039677391, lng: 9.2112421989441}


        // Geometry and material for the box
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Red color
        const box1 = new THREE.Mesh(geometry, material);
        const box2 = new THREE.Mesh(geometry, material);
        
        const [ box1_x, box1_y ] = this.repositionPoint([9.2018222808838, 45.46113525167], [9.2018222808838, 45.46113525167])
        const [ box2_x, box2_y ] = this.repositionPoint([9.2112421989441, 45.457039677391], [9.2018222808838, 45.46113525167])
        box1.position.set(box1_x, 0, box1_y,)
        box2.position.set(box2_x, 0, box2_y,)

        // console.log(box1_x, box1_y)
        // console.log(box2_x, box2_y)
        
        // Add the box to the scene
        this.scene.add(box1);
        this.scene.add(box2);
    }

    // Animation loop
    animate() {
        requestAnimationFrame(() => this.animate())
        this.renderer.render(this.scene, this.camera)

        // Update planes position for infinite effect
        this.updatePlanes()

        // var zoom = this.controls.target.distanceTo( this.controls.object.position )
        // console.log(zoom)

        this.controls.update()
    }

    // Update planes position for infinite effect
    updatePlanes() {
        const halfSize = (this.numPlanes * this.planeSize) / 2
    
        this.planes.forEach((plane) => {
            const dx = this.camera.position.x - plane.position.x
            const dz = this.camera.position.z - plane.position.z

            if (Math.abs(dx) > halfSize) {
                plane.position.x += Math.sign(dx) * this.numPlanes * this.planeSize
            }
    
            if (Math.abs(dz) > halfSize) {
                plane.position.z += Math.sign(dz) * this.numPlanes * this.planeSize
            }
        })
    }

    /**
     * Rotate lat/lon to reposition the home point onto 0,0.
     * @param {array} latLong - [long, lat]
     * @param {array} home - [long, lat] of the point which will end up at [0, 0]
     * @return [x, y] Cartesian-ish coordinates in meters.
     */
    repositionPoint(latLon, home) {
        const R = 6371 * 1000;   // Earth radius in m
        const circ = 2 * Math.PI * R;  // Circumference
        const phi = 90 - latLon[1];
        const theta = latLon[0] - home[0];
        const thetaPrime = home[1] / 180 * Math.PI;
        const x = R * Math.sin(theta / 180 * Math.PI) * Math.sin(phi / 180 * Math.PI);
        const y = R * Math.cos(phi / 180 * Math.PI); 
        const z = R * Math.sin(phi / 180 * Math.PI) * Math.cos(theta / 180 * Math.PI);
        const abs = Math.sqrt(z**2 + y**2);
        const arg = Math.atan(y / z) - thetaPrime;

        return [x, Math.sin(arg) * abs];
    }
}
