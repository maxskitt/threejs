# threejs

In the development of the battlefield simulation, several features were left unimplemented due to time constraints and challenges encountered during the development process. Below is a summary of the remaining features and reflections on the architectural design of the simulation:

## Unimplemented Features

1. Unit Collider Radius
2. Unit Overlapping Prevention
3. Unit Attack Behavior
4. ECS Architecture Refinement
5. Ammo.js Integration

- Reason for Non-Implementation: Challenges in understanding and integrating Ammo.js within the project led to its exclusion.
- Reason for Reflection: During development, it became apparent that the entity structure should have included two main entities: Army and Warrior, instead of a single entity representing all units.
  As a result, issues related to the integration and usage of Ammo.js led to the impossibility of implementing the functionalities of unit collider radius, unit overlapping prevention, and unit attack behavior. As a result, issues related to the integration and usage of Ammo.js led to the impossibility of implementing the functionalities of unit collider radius, unit overlapping prevention, and unit attack behavior.
