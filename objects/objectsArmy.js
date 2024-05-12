import * as THREE from "three";

function ObjectsArmy(pos, quat) {

}


function createMaterial( color ) {

  color = color || createRandomColor();
  return new THREE.MeshPhongMaterial( { color: color } );

}


function createRandomColor() {

  return Math.floor( Math.random() * ( 1 << 24 ) );

}

function createObject( mass, halfExtents, pos, quat, material ) {

  const object = new THREE.Mesh( new THREE.BoxGeometry( halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2 ), material );
  object.position.copy( pos );
  object.quaternion.copy( quat );
  // convexBreaker.prepareBreakableObject( object, mass, new THREE.Vector3(), new THREE.Vector3(), true );
  // createDebrisFromBreakableObject( object );

}




export default ObjectsArmy;
