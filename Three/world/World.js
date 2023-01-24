import * as THREE from 'three'
import ThreeManager from '../ThreeManager'

export default class World {
  constructor() {
    this.threeManager = new ThreeManager()
    this.sizes = this.threeManager.sizes
    this.scene = this.threeManager.scene
    this.canvas = this.threeManager.canvas
    this.camera = this.threeManager.camera
  }

  resize() {}
  update() {}
}
