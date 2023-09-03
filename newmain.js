// required readings
// https://threejs.org/manual/examples/voxel-geometry-culled-faces.html
// https://threejs.org/manual/#en/voxel-geometry
console.log("good morning!")

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

const scene = new THREE.Scene();

const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
renderer.setSize(TARGET_WIDTH, TARGET_HEIGHT);
renderer.setClearColor(0x280A8C, 1);
document.body.appendChild(renderer.domElement);

const box_geometry_fornow_ = new THREE.BoxGeometry(1, 1, 1);
const box_material_fornow_ = new THREE.MeshPhongMaterial({color: 'green'});



function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

animate();