// https://threejs.org/manual/#en/custom-buffergeometry
// https://threejs.org/manual/#en/rendertargets
// https://threejs.org/manual/#en/voxel-geometry
// https://threejs.org/manual/#en/fog

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';


//declarations for ease of use
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const TARGET_HEIGHT = 720
const TARGET_WIDTH = 1280


class VoxelWorld {
    constructor(cellSize){
        this.cellSize = cellSize;
        this.cell = new Uint8Array(cellSize ** 3);
    }
    getCellForVoxel(x,y,z) {
        const {cellSize} = this;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const cellZ = Math.floor(z / cellSize);
        if(cellX !== 0 || cellY !== 0 || cellZ !== 0){
            return null;
        }
        return this.cell;
    }
    computeVoxelOffset(x, y, z) {
        const {cellSize, cellSliceSize} = this;
        const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
        const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
        const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
        return voxelY * cellSliceSize + voxelZ * cellSize + voxelX;

    }
    setVoxel(x,y,z,v){
        let cell = this.getCellForVoxel(x, y, z);
        if(!cell){
            return;
        }
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        cell[voxelOffset] = v;
    }
    getVoxel(x,y,z) {
        const cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            return 0;
        }
        const {cellSize} = this;
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        return cell[voxelOffset];
    }
    generateGeometryDataForCell(cellX, cellY, cellZ){
        const {cellSize} = this;
        const positions = [];
        const normals = [];
        const indices = [];
        const startX = cellX * cellSize;
        const startY = cellY * cellSize;
        const startZ = cellZ * cellSize;

        for (let y = 0; y < cellSize; ++y) {
            const voxelY = startY + y;
            for (let z = 0; z < cellSize; ++z) {
                const voxelZ = startZ + z;
                for (let x = 0; x <cellSize; ++x) {
                    const voxelX = startX + x;
                    const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
                    if (voxel) {
                        for (const {dir, corners} of VoxelWorld.faces) {
                            const neighbor = this.getVoxel(
                                voxelX + dir[0],
                                voxelY + dir[1],
                                voxelZ + dir[2]
                            );
                            if (!neighbor) {
                                // this voxel has no neighbor in this direction so we need a face here.
                                const ndx = positions.length / 3;
                                for (const pos of corners) {
                                    positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                                    normals.push(...dir);
                                }
                                indices.push(
                                    ndx, ndx + 1, ndx + 2,
                                    ndx + 2, ndx + 1, ndx + 3,
                                );
                            }
                        }
                    }
                }
            }
        }
            return {
                positions,
                normals,
                indices,
            };
    }
}

VoxelWorld.faces = [
    { // left
        dir: [ -1,  0,  0, ],
        corners: [
            [0,1,0],
            [0,0,0],
            [0,1,1],
            [0,0,1],
        ],
    },
    { // right
        dir: [  1,  0,  0, ],
        corners: [
            [1,1,1],
            [1,0,1],
            [1,1,0],
            [1,0,0],
        ],
    },
    { // bottom
        dir: [  0, -1,  0, ],
        corners: [
            [1,0,1],
            [0,0,1],
            [1,0,0],
            [0,0,0],
        ],
    },
    { // top
        dir: [  0,  1,  0, ],
        corners: [
            [0,1,1],
            [1,1,1],
            [0,1,0],
            [1,1,0],
        ],
    },
    { // back
        dir: [  0,  0, -1, ],
        corners: [
            [1,0,0],
            [0,0,0],
            [1,1,0],
            [0,1,0],
        ],
    },
    { // front
        dir: [  0,  0,  1, ],
        corners: [
            [0,0,1],
            [1,0,1],
            [0,1,1],
            [1,1,1],
        ],
    }
];

const canvas = document.querySelector( '#c' );

const cellSize = 32;

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

const world = new VoxelWorld(cellSize);

for (let y = 0; y < cellSize; ++y){
    for (let z = 0; z < cellSize; ++z) {
        for (let x = 0; x < cellSize; ++x) {
            const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z/cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
            if (y < height) {
                world.setVoxel*(x, y, z, 1);
            }
        }

    }
}

const {positions, normals, indices} = world.generateGeometryDataForCell(0,0,0);
const geometry = new THREE.BufferGeometry();
const material = new THREE.MeshLambertMaterial({color: 'red'});
const positionNumComponents = 3;
const normalNumComponents = 3;
geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
geometry.setIndex(indices);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(TARGET_WIDTH, TARGET_HEIGHT);
renderer.setClearColor(0xb8fcda, 1);
document.body.appendChild(renderer.domElement);



function animate(){
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();

