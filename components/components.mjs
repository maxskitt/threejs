import * as THREE from "three";
import { Component, Types } from "ecsy";

export class UID extends Component {}

UID.schema = {
  uid: { type: Types.String },
};

export class Object3D extends Component {}

Object3D.schema = {
  object: { type: Types.Ref },
};

export class Target extends Component {}
Target.schema = {
  uuid: { type: Types.String, default: null },
  position: { type: Types.Ref },
  distance: { type: Types.Number },
  active: { type: Types.Boolean, default: false },
};

export class TargetInstance extends Component {}
TargetInstance.schema = {
  targetUUID: { type: Types.String, default: null },
  targetID: { type: Types.Array, default: [] },
};

export class Allegiance extends Component {}

Allegiance.schema = {
  team: { type: Types.String },
};

export class Movement extends Component {}
Movement.schema = {
  speed: { default: 1, type: Types.Number },
  targetPosition: { default: null, type: Types.Ref },
  isStopped: { default: false, type: Types.Boolean },
};

export class Collider extends Component {}
Collider.schema = {
  width: { default: 0, type: Types.Number },
  height: { default: 0, type: Types.Number },
  radius: { default: 0.5, type: Types.Number },
};

export class Health extends Component {}
Health.schema = {
  hp: { default: 10, type: Types.Number },
  maxHp: { default: 10, type: Types.Number }, // Maximum hit points
  isAlive: { default: true, type: Types.Boolean }, // Indicates if the entity is alive
};

export class Attack extends Component {}
Attack.schema = {
  range: { default: 1, type: Types.Number },
  damage: { default: 1, type: Types.Number },
  cooldown: { default: 1, type: Types.Number },
  lastAttackTime: { default: 0, type: Types.Number }, // Время последней атаки, по умолчанию 0
};
