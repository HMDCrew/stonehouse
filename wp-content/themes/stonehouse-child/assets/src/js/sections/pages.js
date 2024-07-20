// import { LeafletUX } from "../user_experience/leaflet_ux"

// new Promise( async (resolve) => {

//     const response = await fetch('https://ip-geo-location.p.rapidapi.com/ip/check?format=json&language=en', {
//         method: 'GET',
//         headers: {
//             'x-rapidapi-key': '77bc1a30eamsha0c29e7a0814603p19ceffjsnd0ad03731219',
//             'x-rapidapi-host': 'ip-geo-location.p.rapidapi.com'
//         }
//     })

//     resolve( response.json() )

// }).then( val => new LeafletUX( val.location ) )

// import * as THREE from 'three'
// import { MapControls } from 'three/examples/jsm/controls/MapControls.js';
// import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// // Scene and Camera
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
// camera.position.set(0, 100, 200);

// // Renderer
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// // Plane Geometry
// const planeGeometry = new THREE.PlaneGeometry(1000, 1000);

// // Custom Shader Material
// const uniforms = {
//     u_texture: { value: new THREE.TextureLoader().load('https://stonehouse.local/wp-content/uploads/2024/07/terrain.jpg') },
//     u_mapScale: { value: 10.0 },
// };

// const vertexShader = `
//       varying vec2 vUv;

//       void main() {
//         vUv = uv;
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       }
//     `;

// const fragmentShader = `
//       precision highp float;
//       uniform sampler2D u_texture;
//       uniform float u_mapScale;
//       varying vec2 vUv;

//       void main() {
//         vec2 uv = vUv * u_mapScale;
//         gl_FragColor = texture2D(u_texture, uv);
//       }
//     `;

// const material = new THREE.ShaderMaterial({
//     uniforms,
//     vertexShader,
//     fragmentShader,
// });

// // Plane Mesh
// const planeMesh = new THREE.Mesh(planeGeometry, material);
// planeMesh.rotation.x = -Math.PI / 2;
// scene.add(planeMesh);

// // Map Controller
// const mapControls = new MapControls(camera, renderer.domElement);

// // Animate
// function animate() {
//     requestAnimationFrame(animate);

//     mapControls.update();
//     renderer.render(scene, camera);
// }
// animate();

import { MAP_3D } from "../user_experience/threejs_infinite_plane"


new MAP_3D()