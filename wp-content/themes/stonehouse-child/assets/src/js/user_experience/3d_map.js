import * as THREE from 'three'
import { MapControls } from 'three/addons/controls/MapControls.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class MAP3D {

    camera;
    controls;
    scene;
    renderer;
    clock;
    mesh;
    mouse;
    tileLoader = new THREE.TextureLoader();

    L;
    map;
    layer;

	container = document.getElementById( 'map3D' )
    worldWidth = 256
    worldDepth = 256
    worldHalfWidth = this.worldWidth / 2
    worldHalfDepth = this.worldDepth / 2

    constructor(L, map, layer) {

        this.L = L;
        this.map = map;
        this.layer = layer;

        // this.scene = new THREE.Scene();
        // this.renderer = new THREE.WebGLRenderer({ antialias: true });
        // this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        // this.controls = new MapControls(this.camera, this.renderer.domElement);
        // this.dirLight1 = new THREE.DirectionalLight(0xffffff, 3);
        // this.ambientLight = new THREE.AmbientLight(0x555555);

		this.clock = new THREE.Clock()
		this.mouse = new THREE.Vector2()
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 )
        this.camera.position.set(0, 850, 500)
        
        this.renderer = new THREE.WebGLRenderer() 
		this.renderer.setClearColor( 0x333333 )
		this.renderer.setPixelRatio( window.devicePixelRatio )
		this.renderer.setSize( window.innerWidth-4, window.innerHeight-4 )
        
		this.controls = new OrbitControls(this.camera, this.renderer.domElement)
		this.controls.panSpeed = 100
		this.controls.update()
        
        this.container.innerHTML = ""
        this.container.appendChild( this.renderer.domElement )

		this.ambientLight = new THREE.AmbientLight(0xbbbbbb)
		this.scene.add(this.ambientLight)

        window.addEventListener( 'resize', ev => this.windowResize(), false )

        //this.init_map();
        this.createTerrain( window.innerWidth, window.innerHeight )

        this.animate()
    }


    windowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize( window.innerWidth-4, window.innerHeight-4 )
    }


    createTerrain( width, height ) {
        if( this.mesh ) {
            this.scene.remove(this.mesh);
            // this.scene.remove(this.helperTerrainGrid1);
            // this.scene.remove(this.helperTerrainGrid2);
        }

        const extent = this.map.getBounds()

        var extentString = extent._southWest.lng + "," 
            + extent._southWest.lat + "," 
            + extent._northEast.lng + "," 
            + extent._northEast.lat;

        // https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}

        const imageUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?"
            + "bbox="+ extentString+"&bboxSR=4326&layers=&layerDefs=&size=" + window.innerWidth +"%2C" + window.innerHeight 
            + "&imageSR=&format=jpg&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=image";

        const texture = this.tileLoader.load(imageUrl)
        const geometry = new THREE.PlaneGeometry(width, height, this.worldWidth - 1, this.worldDepth - 1)
        //geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) )
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.x = -Math.PI / 2;

        this.scene.add(mesh)
        this.createHelperGrids(width, height)
    }

    createHelperGrids( width, height ) {
        var geometry1 = new THREE.PlaneGeometry( width, height, this.worldWidth - 1, this.worldDepth - 1 )
        var geometry2 = new THREE.PlaneGeometry( width, height, this.worldWidth - 1, this.worldDepth - 1 )
        // geometry1.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) )
        // geometry2.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) )

        for ( var j = 0; j < geometry2.attributes.position.array.length; j +=3 ) {
            geometry1.attributes.position.array[ j+1 ] = geometry1.attributes.position.array[ j+1 ] - 2;
            geometry2.attributes.position.array[ j+1 ] = geometry2.attributes.position.array[ j+1 ]- 200;
        }

        const helperTerrainGrid1 = new THREE.Mesh(
            geometry1, 
            new THREE.MeshBasicMaterial({ 
                color: 0x888888, //0x888888, 
                wireframe: true, 
                transparent: true,
                opacity: 0.1 
            })
        )
        helperTerrainGrid1.rotation.x = -Math.PI / 2;
        this.scene.add( helperTerrainGrid1 )

        const helperTerrainGrid2 = new THREE.Mesh(
            geometry2, 
                new THREE.MeshBasicMaterial({ 
                    color: 0x8888FF, //0x888888, 
                    wireframe: true, 
                    transparent: true,
                    opacity: 0.1 
                })
        ); 
        helperTerrainGrid2.rotation.x = -Math.PI / 2;
        this.scene.add( helperTerrainGrid2 )
    }

    animate() {
        requestAnimationFrame( () => this.animate() )
        this.controls.update( this.clock.getDelta() )
        this.renderer.render( this.scene, this.camera )
    }

    /*
    init_map() {

        this.scene.background = new THREE.Color(0xcccccc);
        this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.camera.position.set(0, 0, 500); // Posizione iniziale della camera

        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.controls.screenSpacePanning = false;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.dirLight1.position.set(1, 1, 1);
        this.scene.add(this.dirLight1);
        this.scene.add(this.ambientLight);

        this.layer.on('tileload', e => this.tileloadThreeUpdates(e));

        this.renderer.setAnimationLoop(() => this.animate());

        window.addEventListener('resize', ev => this.onWindowResize());
    }

    onWindowResize() {

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    latLngToPixel(latLng, zoom) {
        const point = this.map.project(latLng, zoom);
        return {
            x: point.x,
            y: -point.y
        };
    }

    tileloadThreeUpdates(e) {

        const tile = e.tile;
        const texture = this.tileLoader.load(tile.getAttribute('src'));
        const geometry = new THREE.PlaneGeometry(tile.width, tile.height);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);

        // Dimensioni della piastrella
        const tileSize = 256; // Supponendo che ogni piastrella sia 256x256 pixel

        // Coordinate della piastrella in termini di posizione nella griglia
        const tileX = e.coords.x * tileSize;
        const tileY = e.coords.y * tileSize;

        // Posizionamento della piastrella
        mesh.position.set(tileX, -tileY, 0); // Assicurarsi che il piano sia orizzontale
        mesh.rotation.x = -Math.PI / 2;

        this.camera.position.set(tileX, -tileY, 10)

        this.scene.add(mesh);
    }
    */
}
