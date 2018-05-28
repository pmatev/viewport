import React, { Component } from 'react';
import * as THREE from 'three';

import OrbitControls from './lib/OrbitControls';

const radius = 100;
const theta = 0;

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
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    this.controls = new OrbitControls(camera);

    const scene = new THREE.Scene();
    this.scene = scene;
    scene.background = new THREE.Color(0xf0f0f0);

    const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(light);

    const gridHelper = new THREE.GridHelper(100, 100);
    scene.add(gridHelper);

    const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
    scene.add(object);

    document.addEventListener('mousemove', this.onDocumentMouseMove, false);

    this.animate();
  }

  onDocumentMouseMove = (event) => {
    event.preventDefault();
    this.mouse = this.mouse || new THREE.Vector2();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderScene();
    this.controls.update();
    // stats.update();
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    return (
      <div ref={ref => { this.root = ref; }} />
    );
  }
}

export default App;
