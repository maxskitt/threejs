import * as THREE from "three";
import { Component } from "./Component";

export class TransformComponent extends Component {
  constructor() {
    super();
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Euler();
    this.scale = new THREE.Vector3(1, 1, 1);
  }
}
