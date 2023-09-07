// required readings
// https://threejs.org/manual/examples/voxel-geometry-culled-faces.html
// https://threejs.org/manual/#en/voxel-geometry
console.log("good morning!")

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
  }

//basic camera and canvas render bullshit im gonna SCREAM
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

const scene = new THREE.Scene();

const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
renderer.setSize(TARGET_WIDTH, TARGET_HEIGHT);
renderer.setClearColor(0xaaffee, 1);

const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.set( - 8 * .3, 8 * .8, - 8 * .3 );

const controls = new OrbitControls( camera, canvas );
controls.target.set( 8 / 2, 8 / 3, 8 / 2 );
controls.update();

const box_geometry_fornow_ = new THREE.BoxGeometry(1, 1, 1);
const box_material_fornow_1 = new THREE.MeshPhongMaterial({color: 'green'});
const box_material_fornow_2 = new THREE.MeshPhongMaterial({color: 'red'});
const box_material_fornow_3 = new THREE.MeshPhongMaterial({color: 'blue'});

const cubes = new Uint8Array(512); // 8^3    // this should be 512B in size.
function generateWorld() {
	for(let x = 0; x < 8; ++ x){
		for(let y = 0; y < 8; ++ y){
			for(let z = 0; z < 8; ++ z){
				const blockid = x * 8 * 8 + y * 8 + z;
				switch (getRandomInt(3)) {
					case (0):
						cubes[blockid] = 1;
						break;
					case (1):
						cubes[blockid] = 2;
						break;
					case (2):
						cubes[blockid] = 3;
						break;
				}
			}
		}
	}
}

generateWorld();
function renderCube(in_x, in_y, in_z, in_material) {
	const mesh = new THREE.Mesh(box_geometry_fornow_, in_material);
	mesh.position.set(in_x, in_y , in_z);
	scene.add(mesh);
	console.log("gay sex!!");
}

function renderWorld() {
	for(let x = 0; x < 8; ++ x){
		for(let y = 0; y < 8; ++ y){
			for(let z = 0; z < 8; ++ z){
				const blockid = x * 8 * 8 + y * 8 + z;
				switch (cubes[blockid]) {
					case (1):
						renderCube(x, y, z, box_material_fornow_1);
						break;
					case (2):
						renderCube(x, y, z, box_material_fornow_2);
						break;
					case (3):
						renderCube(x, y, z, box_material_fornow_3);
						break;
				}
			}
		}
	}
}
renderWorld();
function selectCube(id){
	
}
function setCube(id, value){

}




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