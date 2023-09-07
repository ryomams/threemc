// required readings
// https://threejs.org/manual/examples/voxel-geometry-culled-faces.html
// https://threejs.org/manual/#en/voxel-geometry
console.log("good morning!")

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//basic camera and canvas render bullshit im gonna SCREAM
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

const scene = new THREE.Scene();

const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
renderer.setSize(TARGET_WIDTH, TARGET_HEIGHT);
renderer.setClearColor(0xaaffee, 1);
document.body.appendChild(renderer.domElement);

const camera = new THREE.OrthographicCamera(TARGET_WIDTH / -2, TARGET_WIDTH / 2, TARGET_HEIGHT /2, TARGET_HEIGHT / - 2, 1, 1000);


const box_geometry_fornow_ = new THREE.BoxGeometry(1, 1, 1);
const box_material_fornow_ = new THREE.MeshPhongMaterial({color: 'green'});

const cubes = new Uint8Array(512); // 8^3    // this should be 512B in size.
function generateWorld() {
	for(let x = 0; x < 8; ++ x){
		for(let y = 0; y < 8; ++ y){
			for(let z = 0; z < 8; ++ z){
				const blockid = x * 8 * 8 + y * 8 + z;
				cubes[blockid] = 1;
			}
		}
	}
}
generateWorld();
function renderCube(in_x, in_y, in_z) {
	const mesh = new THREE.Mesh(box_geometry_fornow_, box_material_fornow_);
	mesh.position.set(in_x, in_y , in_z);
	scene.add(mesh);
	console.log("gay sex!!");
}
function renderWorld() {
	for(let x = 0; x < 8; ++ x){
		for(let y = 0; y < 8; ++ y){
			for(let z = 0; z < 8; ++ z){
				renderCube(x, y, z);
			}
		}
	}
}
renderWorld();




function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();





function addLight( x, y, z ) {

	const color = 0xFFFFFF;
	const intensity = 3;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( x, y, z );
	scene.add( light );

}

addLight( - 1, 2, 4 );
addLight( 1, - 1, - 2 );