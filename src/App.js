import React, { Component } from 'react';
import * as THREE from 'three';

import OrbitControls from './lib/OrbitControls';
import TransformControls from './lib/TransformControls';

const defaultMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
const outlineMaterial = new THREE.MeshToonMaterial({ color: Math.random() * 0xffffff });

class App extends Component {
  constructor(props) {
    super(props);

    this.mouse = new THREE.Vector2();
  }

  componentDidMount() {
    if (!this.root) return;

    const renderer = new THREE.WebGLRenderer();
    this.renderer = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    this.root.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    this.camera = camera;
    camera.position.set(75, 75, 75);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    const light = new THREE.HemisphereLight(0xffffbb, 0x000000, 1);
    light.castShadow = true;
    light.position.set(1, 0.9, 0);
    scene.add(light);

    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    const object = new THREE.Mesh(geometry, defaultMaterial);
    scene.add(object);
    this.object = object;

    this.orbitControl = new OrbitControls(camera);
    this.transformControl = new TransformControls(camera, this.root);
    this.transformControl.addEventListener('change', this.animate);

    this.transformControl.attach(object);

    scene.add(this.transformControl);

    document.addEventListener('mousemove', this.onMouseMove, false);
    this.registerKeyboardEvents();
    this.animate();
  }

  registerKeyboardEvents = () => {
    window.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 81: // Q
          this.transformControl.setSpace(this.transformControl.space === 'local' ? 'world' : 'local');
          break;
        case 17: // Ctrl
          this.transformControl.setTranslationSnap(100);
          this.transformControl.setRotationSnap(THREE.Math.degToRad(15));
          break;
        case 87: // W
          this.transformControl.setMode('translate');
          break;
        case 69: // E
          this.transformControl.setMode('rotate');
          break;
        case 82: // R
          this.transformControl.setMode('scale');
          break;
        case 187:
        case 107: // +, =, num+
          this.transformControl.setSize(this.transformControl.size + 0.1);
          break;
        case 189:
        case 109: // -, _, num-
          this.transformControl.setSize(Math.max(this.transformControl.size - 0.1, 0.1));
          break;
        default:
          break;
      }
    });
    window.addEventListener('keyup', (event) => {
      switch (event.keyCode) {
        case 17: // Ctrl
          this.transformControl.setTranslationSnap(null);
          this.transformControl.setRotationSnap(null);
          break;
        default:
          break;
      }
    });
  }

  onMouseMove = (event) => {
    event.preventDefault();
    this.mouse = this.mouse || new THREE.Vector2();
    this.mouse.x = (event.clientX / window.innerWidth) * 2;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(this.mouse, this.camera);
    [this.intersects] = raycaster.intersectObjects([this.object]);
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderScene();
    this.orbitControl.update();
    this.transformControl.update();
    // stats.update();
  }

  renderScene = () => {
    if (this.intersects && this.intersects.object === this.object) {
      this.object.material = defaultMaterial;
    } else if (this.object) {
      this.object.material = outlineMaterial;
    }

    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div ref={ref => { this.root = ref; }} />
    );
  }
}

export default App;
