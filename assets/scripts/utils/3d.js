import * as THREE from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

// Prepare loaders
const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/v1/decoders/"
);
gltfLoader.setDRACOLoader(dracoLoader);

const textureLoader = new THREE.TextureLoader();

export { gltfLoader, dracoLoader, textureLoader };
