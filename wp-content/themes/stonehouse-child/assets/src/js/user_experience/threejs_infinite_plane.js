import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export class MAP_3D {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();

        // lighting
        this.light = new THREE.DirectionalLight(0xffffff, 1);

        // Create grid helper
        this.gridHelper = new THREE.GridHelper(100, 100);
        this.controls = new MapControls(this.camera, this.renderer.domElement);
        this.loader = new FontLoader();

        // infinite plane settings
        this.planeSize = 2;
        this.numPlanes = 10; // Number of planes per row/column
        this.planes = [];

        this.loader.load(
            new URL('three/examples/fonts/helvetiker_regular.typeface.json', import.meta.url),
            (font) => {
                console.log(font);
                this.init(font);
                this.animate();
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (err) => {
                console.log('An error happened');
            }
        );
    }

    init(font) {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Set camera position
        this.camera.position.y = 5;
        // this.camera.far = 2000;
        // this.camera.updateProjectionMatrix();

        this.light.position.set(1, 1, 1).normalize();
        this.scene.add(this.light);
        this.scene.add(this.gridHelper);

        // infinite plane
        for (let x = -this.numPlanes / 2; x < this.numPlanes / 2; x++) {
            for (let z = -this.numPlanes / 2; z < this.numPlanes / 2; z++) {
                const plane = new THREE.Mesh(
                    new THREE.PlaneGeometry(this.planeSize, this.planeSize),
                    new THREE.MeshBasicMaterial({
                        color: ((x % 2 === 0 && z % 2 === 0) || (x % 2 !== 0 && z % 2 !== 0)) ? 0xffffff : 0x000000,
                        side: THREE.DoubleSide,
                    })
                );

                const geometry = new TextGeometry(`(${x}, ${z})`, {
                    font: font,
                    size: 0.4,
                    height: 0,
                    curveSegments: 12,
                    bevelEnabled: false,
                });
                const txt_mat = new THREE.MeshPhongMaterial({ color: 0xffffff });
                const txt_mesh = new THREE.Mesh(geometry, txt_mat);

                geometry.computeBoundingBox();
                const bbox = geometry.boundingBox;
                const textWidth = bbox.max.x - bbox.min.x;

                txt_mesh.position.set(-textWidth / 2, 0, 0.1);
                plane.add(txt_mesh);

                plane.rotation.x = -Math.PI / 2;
                plane.position.set(x * this.planeSize, 0, z * this.planeSize);

                this.scene.add(plane);
                this.planes.push(plane);
            }
        }

        // Set initial control settings
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
//        this.controls.maxPolarAngle = Math.PI / 2;

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Animation loop
    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);

        // Update planes position for infinite effect
        this.updatePlanes();

        this.controls.update();
    }

    // Update planes position for infinite effect
    updatePlanes() {
        const halfSize = (this.numPlanes * this.planeSize) / 2;
    
        this.planes.forEach((plane) => {
            const dx = this.camera.position.x - plane.position.x;
            const dz = this.camera.position.z - plane.position.z;

            if (Math.abs(dx) > halfSize) {
                plane.position.x += Math.sign(dx) * this.numPlanes * this.planeSize;
            }
    
            if (Math.abs(dz) > halfSize) {
                plane.position.z += Math.sign(dz) * this.numPlanes * this.planeSize;
            }
        });
    }
}
