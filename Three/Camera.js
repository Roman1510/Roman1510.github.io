import * as THREE from 'three'
import ThreeManager from './ThreeManager'

export default class Camera {
  constructor() {
    this.threeManager = new ThreeManager()
    this.sizes = this.threeManager.sizes
    this.scene = this.threeManager.scene
    this.canvas = this.threeManager.canvas

    this.createPerspectiveCamera()
    this.createOrthographicCamera()
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.aspect,
      0.1,
      1000
    )
    this.scene.add(this.perspectiveCamera)
  }

  createOrthographicCamera() {
    this.frustrum = 5
    this.orthographicCamera = new THREE.OrthographicCamera(
      (-this.sizes.aspect * this.sizes.frustrum) / 2,
      this.sizes.aspect * this.sizes.frustrum,
      this.sizes.frustrum / 2,
      -this.sizes.frustrum / 2,
      -100,
      100
    )
    this.scene.add(this.orthographicCamera)
  }

  resize() {
    this.perspectiveCamera.aspect = this.sizes.aspect
    this.perspectiveCamera.updateProjectionMatrix()

    this.orthographicCamera.left =
      (-this.sizes.aspect * this.sizes.frustrum) / 2
    this.orthographicCamera.right = this.sizes.aspect * this.sizes.frustrum
    this.orthographicCamera.top = this.sizes.frustrum / 2
    this.orthographicCamera.bottom = -this.sizes.frustrum / 2
    this.orthographicCamera.updateProjectionMatrix()
  }

  update() {}
}
