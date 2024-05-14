import * as THREE from "three";
import { Component } from "./Component.js";

export class VelocityComponent extends Component {
  constructor(x = 0, y = 0, z = 0) {
    super();
    this.velocity = new THREE.Vector3(x, y, z);
  }
}
