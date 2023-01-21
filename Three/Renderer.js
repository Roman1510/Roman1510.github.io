import * as THREE from 'three'
import ThreeManager from './Three'

export default class Renderer {
  constructor() {
    this.threeManager = new ThreeManager()
    this.sizes = this.threeManager.sizes
    this.scene = this.threeManager.scene
    this.canvas = this.threeManager.canvas
    this.camera = this.threeManager.camera

    this.setRenderer()
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.toneMapping = THREE.CineonToneMapping
    this.renderer.toneMappingExposure = 1.75
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(this.sizes.pixelRatio)
  }
  resize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(this.sizes.pixelRatio)
  }
  update() {
    this.renderer.render(this.scene, this.camera.perspectiveCamera)
  }
}
