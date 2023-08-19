// https://threejs.org/manual/#en/custom-buffergeometry
// https://threejs.org/manual/#en/rendertargets
// https://threejs.org/manual/#en/voxel-geometry
// https://threejs.org/manual/#en/fog

import * as THREE from 'three';
//import {OrbitControls} from 'three/addons/controls/OrbitControls.js'; TODO


//declarations for ease of use
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Y_AXIS = new THREE.Vector3(0, 1, 0);
const TARGET_HEIGHT = 720
const TARGET_WIDTH = 1280

// renderer and camera
const camera = new THREE.PerspectiveCamera(90, TARGET_WIDTH / TARGET_HEIGHT, 0.1, 1000);
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(TARGET_WIDTH, TARGET_HEIGHT);
renderer.setClearColor(0x280A8C, 1);
document.body.appendChild(renderer.domElement);

const box_geometry = new THREE.BoxGeometry(1, 1, 1);
const box_material = new THREE.MeshPhongMaterial({color: 'green'});

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
        const voxelOffset = voxelY * cellSize * cellSize + voxelZ * cellSize + voxelX;
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

// you could put all the code above into its own js file. 
// TODO: Research es_modules

const cellSize = 32;

const world = new VoxelWorld(cellSize);

for (let y = 0; y < cellSize; ++y){
    for (let z = 0; z < cellSize; ++z) {
        for (let x = 0; x < cellSize; ++x) {
            const height = ()
        }

    }
}



function animate(){
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
animate();

