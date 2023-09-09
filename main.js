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
const green_material_fornow_ = new THREE.MeshPhongMaterial({color: 'green'});
const red_material_fornow_ = new THREE.MeshPhongMaterial({color: 'red'});
const blue_material_fornow_ = new THREE.MeshPhongMaterial({color: 'blue'});
const yellow_material_fornow_ = new THREE.MeshPhongMaterial({color: 'yellow'});

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

//modularizing threejs cuz this shit gets annoying and also im gonna be using mostly the same geometries for now
function render_cube(in_x = 0, in_y = 0, in_z = 0, in_material = yellow_material_fornow_, in_geometry = box_geometry_fornow_) {
	const mesh = new THREE.Mesh(in_geometry, in_material);
	mesh.position.set(in_x, in_y , in_z);
	return scene.add(mesh).id;
}
/*function render_sphere() {
	const mesh = new THREE.SphereGeometry(1, 6, 6);
}*/
function add_light( x, y, z ) {

	const color = 0xFFDDDD;
	const intensity = 3;
	const light = new THREE.DirectionalLight( color, intensity );
	light.position.set( x, y, z );
	scene.add( light );

}
add_light( - 1, 2, 4 );
add_light( 1, - 1, - 2 );

function renderWorld() {
	for(let x = 0; x < 8; ++ x){
		for(let y = 0; y < 8; ++ y){
			for(let z = 0; z < 8; ++ z){
				const blockid = x * 8 * 8 + y * 8 + z;
				switch (cubes[blockid]) {
					case (1):
						render_cube(x, y, z, green_material_fornow_);
						break;
					case (2):
						render_cube(x, y, z, red_material_fornow_);
						break;
					case (3):
						render_cube(x, y, z, blue_material_fornow_);
						break;
				}
			}
		}
	}
}
renderWorld();

// data for selecting blocks
let block_selector = {
	blockid: 0,
	blockattrib: 0
};
function render_block_selector(){
	let cubey = render_cube(); //we're just gonna go for a cube for now....   TODO: fix this shit
	console.log(cubey);
	
}
render_block_selector();
// lot of issues with this current implementation:
/*		1) does not treat individual blocks with a "blockid"
		2) 

*/

function select_cube(in_blockid){

	
}

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent, 
//keyboard events
window.addEventListener(
	"keydown",
	(event) => {
		console.log(event.code + " Pressed!");
	},
	true,
  );
window.addEventListener(
	"keyup",
	(event) => {
		console.log(event.code + " Unpressed!");
	},
	true,
  );  


function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();




