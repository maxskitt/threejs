import * as THREE from "three";
import { Component, Types, TagComponent } from "ecsy";

export class Object3D extends Component {}

Object3D.schema = {
  object: { type: Types.Ref },
};

export class Rotating extends Component {}

Rotating.schema = {
  enabled: { type: Types.Boolean },
  rotatingSpeed: { type: Types.Number },
  decreasingSpeed: { type: Types.Number, default: 0.001 },
};

export class UI extends TagComponent {}

export class Target extends Component {}
Target.schema = {
  entityId: { default: null, type: Types.Ref }, // Добавляем поле для хранения идентификатора сущности
  position: { default: new THREE.Vector3(), type: Types.Ref },
};

// Определение компонента для определения армии
export class ArmyId extends Component {}

// Определение схемы компонента
ArmyId.schema = {
  // armyID - идентификатор армии, представленный строкой
  armyID: { type: Types.String },
};

// Ваш компонент перемещения
export class Movement extends Component {}
Movement.schema = {
  speed: { default: 1, type: Types.Number }, // Скорость перемещения по умолчанию
  isStopped: { default: false, type: Types.Boolean }, // По умолчанию объект не остановлен
};

export class Collision extends Component {}
Collision.schema = {
  radius: { default: 1, type: Types.Number }, // Радиус коллизии
  collidedEntities: { default: [], type: Types.Array }, // Список сущностей, с которыми произошла коллизия
};
