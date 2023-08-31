import { module as Module } from 'modujs'
import gsap from 'gsap'
import * as THREE from 'three';
import { gltfLoader, textureLoader } from '../utils/3d'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CUSTOM_EVENT } from '../config';

export default class extends Module {
    constructor(m) {
        super(m)

        // Selectors & data parse
        this.canvas = this.el;
        this.src = this.getData('src');

        // Listen for resize
        this.resize(); // Call a first time before init to get a base sizing
        this.resize = this.resize.bind(this);
        window.addEventListener(CUSTOM_EVENT.RESIZE_END, this.resize);
    }

    init() {
        this.initRenderer();
        this.initScene();
        this.initTimeline();
        this.loadModel();

        // Call a second time after init to impact THREE js objects
        this.resize();

        // Start the render loop
        this.render();
    }

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        })

        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    initScene() {
        // ==========================================================================
        // BASIS
        // ==========================================================================
        this.scene = new THREE.Scene();

        // Wrapper
        this.wrapper = new THREE.Group();
        this.wrapper.position.set(0,0,0);
        this.scene.add(this.wrapper)

        // const pointLight = new THREE.PointLight(0x0000ff, 4000)
        // pointLight.position.set( 20, 20, 20 );
        // pointLight.castShadow = true; // default false
        // this.scene.add(pointLight)

        // const axesHelper = new THREE.AxesHelper( 1 );
        // this.scene.add( axesHelper );

        // ==========================================================================
        // CAMERA
        // ==========================================================================

        // Base camera
        this.camera = new THREE.PerspectiveCamera(30, this.sizes.width / this.sizes.height, 0.01,100)
        this.camera.position.set(15,15,15)
        this.scene.add(this.camera)

        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas)
        this.controls.enableDamping = true
        this.controls.enableZoom = false
    }

    initTimeline() {
        if(!this.camera) return

        // Create the timeline
        this.tl = gsap.timeline({})

        // Move the camera from origin to target
        this.tl.fromTo(
            this.camera.position,
            {
                x: 15,
                y: 25,
                z: 15
            }, {
                x: 15,
                y: -5,
                z: 15,
                ease: 'linear'
            }
        );
        // Because we're using OrbitControls, the camera will keep targeting the center of the scene.
        // We could get rid of the OrbitControls and manually call camera.lookAt() in the render loop instead

        // Usual tl calls
        this.tl.progress(0);
        this.tl.pause()
    }

    loadModel() {
        // Store in a promise to give acces to the preloader
        window.model3dLoadPromise = new Promise(resolve => {
            gltfLoader.load(this.src, gltf => {

                // Use envmap instead of ambient light to get nice realistic reflections
                const envMap = textureLoader.load( '/assets/3d/envmap.jpg' );
                envMap.mapping = THREE.EquirectangularReflectionMapping;
                envMap.colorSpace = THREE.SRGBColorSpace;

                // Apply the environment map to the materials
                gltf.scene.traverse((node) => {
                    if (node.isMesh) {
                        node.material.envMap = envMap;
                        node.material.envMapIntensity = 2; // Adjust the intensity if needed
                    }
                });

                // Add the GLTF to our scene wrapper!
                this.wrapper.add(gltf.scene)

                resolve();
            },
            // called while loading is progressing
            xhr => {
                // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            error => {
                console.error(error)
                resolve();
            })
        });
    }

    resize() {
        // Get canvas dimensions
        this.BCR = this.el.getBoundingClientRect()

        // Store them
        this.sizes = {
            width: this.BCR.width,
            height: this.BCR.height
        }

        // Udpate the renderer accordingly
        this.renderer?.setSize?.(this.sizes.width, this.sizes.height);
        this.renderer?.setPixelRatio?.(Math.min(window.devicePixelRatio, 2))

        // Update the camera as well
        if(this.camera) {
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
        }
    }

    render() {
        // Auto rotate our wrapper
        this.wrapper.rotation.y += (.01 + Math.abs((window.locomotiveScrollData?.velocity ?? 0) * 0.005)) * (window.locomotiveScrollData?.direction ?? 1);

        // Update controls
        this.controls.update()

        // Render
        this.renderer.render(this.scene, this.camera)

        // Call tick again on the next frame
        this.raf = window.requestAnimationFrame(this.render.bind(this))
    }

    onScrollProgress(progress) {
        this.tl?.progress?.(progress)
    }

    destroy() {
        this.tl?.kill?.();
        window.removeEventListener(CUSTOM_EVENT.RESIZE_END, this.resize);
        window.cancelAnimationFrame(this.raf)
        this.scene = this.renderer = null
    }
}
