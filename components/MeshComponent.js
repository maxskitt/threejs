import * as THREE from "three";
import { Component } from "./Component";

export class MeshComponent extends Component {
  constructor(geometry, material) {
    super();
    this.mesh = new THREE.Mesh(geometry, material);
  }
}
