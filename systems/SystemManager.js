export class SystemManager {
  constructor() {
    this.systems = [];
  }

  addSystem(system) {
    this.systems.push(system);
  }

  update() {
    this.systems.forEach((system) => system.update());
  }
}
