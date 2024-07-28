// test reference
// https://codepen.io/gpanag/pen/JjKLZJj


import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import * as ol from './ol'
import Map from 'ol/Map';
import View from 'ol/View';
// import OSM from 'ol/source';
import { OSM } from 'ol/source';
import { TileDebug } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

import Feature from 'ol/Feature';
import { Circle } from 'ol/geom';
import { Vector } from 'ol/source';

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);

var hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
var dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
hemiLight.position.set(0, 100, 0);
hemiLight.matrixAutoUpdate = false;
hemiLight.updateMatrix();


dirLight.position.set(3, 10, 1000);
dirLight.castShadow = true;

scene.add(hemiLight);
scene.add(dirLight);

var camera = new THREE.OrthographicCamera(
  -window.innerWidth / 4,
  window.innerWidth / 4,
  window.innerHeight / 4,
  -window.innerHeight / 4,
  1,
  1000
);

camera.position.set(0, 0, 100);

var controls = new OrbitControls(camera, renderer.domElement);

controls.enablePan = false;
controls.enableZoom = true;
controls.enableDamping = false;
controls.minZoom = 1
controls.maxZoom = 3
controls.target.set(0, 0, 0);
controls.update();

var globe = new THREE.Mesh(
  new THREE.SphereGeometry(90, 64, 64),
  new THREE.MeshPhongMaterial()
);

scene.add(globe);

var container = document.getElementById("container");
document.body.appendChild(renderer.domElement);


function animate() {
  requestAnimationFrame(() => {
    animate()
  });
  renderer.render(scene, camera);
}
animate();

var osm = new TileLayer({
  extent: [-180, -90, 180, 90],
  source: new OSM()
});

var view = new View({
  projection: "EPSG:4326",
  extent: [-180, -90, 180, 90],
  center: [0, 0],
  zoom: 2
});

// var map = new ol.Map({
//   layers: [
//     new ol.layer.Tile({
//       extent: [-180, -90, 180, 90],
//       source: new ol.source.OSM({
//         maxZoom: 2
//       })
//     }),
//     osm,
//     new ol.layer.Tile({
//       source: new ol.source.TileDebug()
//     })
//   ],
//   target: "map",
//   view: view
// });


var map = new Map({
	target: 'map',
	layers: [
		new TileLayer({
			extent: [-180, -90, 180, 90],
			source: new OSM({
				maxZoom: 2
			})
		}),
		osm,
		new TileLayer({
			source: new TileDebug()
		})
		// new TileLayer({
		// 	source: new XYZ({
		// 		url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
		// 	})
		// })
	],
	view: view
  });

map.on("rendercomplete", function () {
  var mapCanvas = document.createElement("canvas");
  var size = map.getSize();
  mapCanvas.width = size[0];
  mapCanvas.height = size[1];
  var mapContext = mapCanvas.getContext("2d");
  Array.prototype.forEach.call(
    document.querySelectorAll(".ol-layer canvas"),
    function (canvas) {
      if (canvas.width > 0) {
        var opacity = canvas.parentNode.style.opacity;
        mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
        var transform = canvas.style.transform;
  
        var matrix = transform
          .match(/^matrix\(([^\(]*)\)$/)[1]
          .split(",")
          .map(Number);

        CanvasRenderingContext2D.prototype.setTransform.apply(
          mapContext,
          matrix
        );
        mapContext.drawImage(canvas, 0, 0);
      }
    }
  );

  var texture = new THREE.CanvasTexture(mapCanvas);
  globe.material.map = texture;
  globe.material.needsUpdate = true;
});

var raycaster = new THREE.Raycaster();
var currentWidth = 1000;

controls.addEventListener("end", function (event) {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);

  let intersects = raycaster.intersectObject(globe);

  let x = -map.getCoordinateFromPixel([
    intersects[0].uv.x * currentWidth,
    (intersects[0].uv.y * currentWidth) / 2
  ])[1];
  let y = map.getCoordinateFromPixel([
    intersects[0].uv.x * currentWidth,
    (intersects[0].uv.y * currentWidth) / 2
  ])[0];

  var circle = new Feature({
    geometry: new Circle([y, x], 20)
  });

  console.log(Math.floor(camera.zoom))

  var circleSource = new Vector({
    features: [circle]
  });
  osm.setExtent(circleSource.getExtent());

  switch (Math.floor(camera.zoom)) {
    case 1:
      document.getElementById("map").style.width = "1000px";
      document.getElementById("map").style.height = "500px";
      if (currentWidth !== 1000) {
        map.updateSize();
        view.setResolution(0.36);
        currentWidth = 1000;
      }
      break;
    case 2:
      document.getElementById("map").style.width = "2000px";
      document.getElementById("map").style.height = "1000px";
      if (currentWidth !== 2000) {
        map.updateSize();
        view.setResolution(0.225);
        currentWidth = 2000;
      }
      break;
    case 3:
      document.getElementById("map").style.width = "4000px";
      document.getElementById("map").style.height = "2000px";
      if (currentWidth !== 4000) {
        map.updateSize();
        view.setResolution(0.18);
        currentWidth = 4000;
      }
      break;
    default:
      break;
  }
});
