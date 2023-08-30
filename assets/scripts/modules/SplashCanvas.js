import { module as Module } from 'modujs'
import gsap from 'gsap'
import * as THREE from 'three';
import { gltfLoader, textureLoader } from '../utils/3d'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CUSTOM_EVENT } from '../config';

export default class extends Module {
    constructor(m) {
        super(m)

        this.canvas = this.el;
        this.src = this.getData('src');

        this.resize();
        this.resize = this.resize.bind(this);
        window.addEventListener(CUSTOM_EVENT.RESIZE_END, this.resize);
    }

    init() {
        this.initRenderer();
        this.initScene();
        this.initTimeline();
        this.loadModel();

        this.resize();

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

        this.clock = new THREE.Clock()
        this.previousTime = 0
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

        // Get rid of old timeline & reset everything
        const progress = this.tl?.progress?.() ?? 0;
        this.tl?.kill?.();

        this.tl = gsap.timeline({})

        this.tl.fromTo(this.camera.position, {
            x: 15,
            y: 25,
            z: 15
        }, {
            x: 15,
            y: -5,
            z: 15,
            ease: 'linear'
        });

        this.tl.progress(progress);
        this.tl.pause()
    }

    loadModel() {
        window.model3dLoadPromise = new Promise(resolve => {
            gltfLoader.load(this.src, gltf => {
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

                this.wrapper.add(gltf.scene)

                resolve();
            }, // called while loading is progressing
            xhr => {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            // called when loading has errors
            error => {
                console.error(error)
                resolve();
            })
        });
    }

    resize() {
        this.BCR = this.el.getBoundingClientRect()

        this.sizes = {
            width: this.BCR.width,
            height: this.BCR.height
        }

        this.renderer?.setSize?.(this.sizes.width, this.sizes.height);
        this.renderer?.setPixelRatio?.(Math.min(window.devicePixelRatio, 2))

        if(this.camera) {
            // Update camera
            this.camera.aspect = this.sizes.width / this.sizes.height
            this.camera.updateProjectionMatrix()
        }

        this.initTimeline();
    }

    render() {
        const elapsedTime = this.clock.getElapsedTime()
        this.deltaTime = elapsedTime - this.previousTime
        this.previousTime = elapsedTime

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
        window.removeEventListener(CUSTOM_EVENT.RESIZE_END, this.resize);
        window.cancelAnimationFrame(this.raf)
        this.scene = this.renderer = null
    }
}
