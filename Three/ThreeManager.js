import * as THREE from 'three'

import Sizes from './utils/Sizes'
import Time from './utils/Time'

import Camera from './Camera'
import Renderer from './Renderer'

export default class ThreeManager {
  static instance
  constructor(canvas) {
    if (ThreeManager.instance) {
      return ThreeManager.instance
    }
    ThreeManager.instance = this
    this.canvas = canvas
    this.scene = new THREE.Scene()
    this.time = new Time()
    this.sizes = new Sizes()
    this.camera = new Camera()
    this.renderer = new Renderer()
  }
}
