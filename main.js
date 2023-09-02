// Three.js - Voxel Geometry - Culled Faces
// from https://threejs.org/manual/examples/voxel-geometry-culled-faces.html


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


function main() {

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );


	const cellSize = 8;


	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( - cellSize * .3, cellSize * .8, - cellSize * .3 );

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( cellSize / 2, cellSize / 3, cellSize / 2 );
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'lightblue' );

	function addLight( x, y, z ) {

		const color = 0xFFFFFF;
		const intensity = 3;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( x, y, z );
		scene.add( light );

	}

	addLight( - 1, 2, 4 );
	addLight( 1, - 1, - 2 );

	
	const cell = new Uint8Array( cellSize * cellSize * cellSize );
	for ( let x = 0; x < cellSize; ++ x ) {
		for ( let y = 0; y < cellSize; ++ y ) {
			for ( let z = 0; z < cellSize; ++ z ) {
				const blockid = x * cellSize * cellSize +
                    y * cellSize +
                    z;
				cell[ blockid ] = 1;
        		console.log(blockid + ", " + x + ", " + y + ", " + z);
			}
		}
	}

	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshPhongMaterial({color: 'green'});

	for ( let x = 0; x < cellSize; ++ x ) {
		for ( let y = 0; y < cellSize; ++ y ) {
			for ( let z = 0; z < cellSize; ++ z ) {
				//const blockid = x * cellSize * cellSize + y * cellSize +z;
				//const block = cell[blockid];
				const mesh = new THREE.Mesh(geometry, material);
				mesh.position.set(x, y , z);
				scene.add(mesh);
			}
		}
	}


//TODO: get rid of this shit
	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	let renderRequested = false;

	function render() {

		renderRequested = undefined;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		controls.update();
		renderer.render( scene, camera );

	}

	render();

	function requestRenderIfNotRequested() {

		if ( ! renderRequested ) {

			renderRequested = true;
			requestAnimationFrame( render );

		}

	}

	controls.addEventListener( 'change', requestRenderIfNotRequested );
	window.addEventListener( 'resize', requestRenderIfNotRequested );

}

main();
