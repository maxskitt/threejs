import { Component } from "./Component.js";

export class HPComponent extends Component {
  constructor(maxHP) {
    super();
    this.maxHP = maxHP;
    this.currentHP = maxHP;
  }
}
