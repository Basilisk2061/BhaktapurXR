import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { Euler, Quaternion } from "three";
import { playerConfig, bodySpawnPosition } from "../src/game/player/player-config.ts";
import { cameraRelativeDirection, approachVelocity, dampAngle, movementState, safeDelta } from "../src/game/player/movement.ts";
import { createCharacterController, stepCharacter } from "../src/game/player/character-physics.ts";
import { createPlayerRuntime } from "../src/game/player/player-runtime.ts";
import { defaultSpawn } from "../src/game/world/spawn-config.ts";
import { worldConfig } from "../src/game/world/world-config.ts";
import { testEnvironmentBoxes } from "../src/game/world/test-environment-config.ts";

const closeTo = (actual, expected, tolerance = 0.00001) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);

test("camera-relative input normalizes all diagonals and cancels opposing keys", () => {
  const direction = { x: 0, z: 0 };
  for (const yaw of [0, Math.PI / 2, -Math.PI / 2, Math.PI, 0.7]) {
    for (const [forward, right] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      cameraRelativeDirection(forward, right, yaw, direction);
      closeTo(Math.hypot(direction.x, direction.z), 1);
    }
  }
  cameraRelativeDirection(1, 0, -Math.PI / 2, direction);
  closeTo(direction.x, 1); closeTo(direction.z, 0);
  cameraRelativeDirection(1, 0, 0, direction);
  closeTo(direction.x, 0); closeTo(direction.z, -1);
  cameraRelativeDirection(0, 0, 0.7, direction);
  assert.deepEqual(direction, { x: 0, z: 0 });
});

test("velocity approaches walk/run targets without overshoot and stops promptly", () => {
  for (const rate of [30, 60, 120]) {
    const velocity = { x: 0, z: 0 };
    for (let frame = 0; frame < rate; frame++) approachVelocity(velocity, { x: 0, z: -1 }, playerConfig.walkSpeed, playerConfig.acceleration, 1 / rate);
    closeTo(Math.hypot(velocity.x, velocity.z), playerConfig.walkSpeed);
    for (let frame = 0; frame < rate; frame++) approachVelocity(velocity, { x: 0, z: -1 }, playerConfig.runSpeed, playerConfig.acceleration, 1 / rate);
    closeTo(Math.hypot(velocity.x, velocity.z), playerConfig.runSpeed);
    for (let frame = 0; frame < Math.ceil(rate * 0.3); frame++) approachVelocity(velocity, { x: 0, z: 0 }, playerConfig.runSpeed, playerConfig.deceleration, 1 / rate);
    closeTo(Math.hypot(velocity.x, velocity.z), 0);
  }
  closeTo(safeDelta(10, playerConfig.maxDelta), playerConfig.maxDelta);
  assert.equal(safeDelta(-1, playerConfig.maxDelta), 0);
  assert.equal(safeDelta(NaN, playerConfig.maxDelta), 0);
  assert.ok(dampAngle(Math.PI - 0.01, -Math.PI + 0.01, 10, 0.01) > Math.PI - 0.01, "Facing takes the short turn across the angle seam");
});

test("player configuration matches human scale and uses the existing foot-position spawn", () => {
  closeTo(2 * (playerConfig.capsuleHalfSegment + playerConfig.radius), playerConfig.height);
  assert.ok(playerConfig.height >= 1.7 && playerConfig.height <= 1.8);
  assert.ok(playerConfig.runSpeed > playerConfig.walkSpeed && playerConfig.runSpeed <= 5.5);
  assert.ok(playerConfig.physics.stepHeight > 0.18 && playerConfig.physics.stepHeight < 0.3);
  assert.ok(playerConfig.physics.maxSlope > 0 && playerConfig.physics.maxSlope < Math.PI / 2);
  assert.ok(playerConfig.camera.minPitch < playerConfig.camera.initialPitch && playerConfig.camera.initialPitch < playerConfig.camera.maxPitch);
  assert.ok(playerConfig.camera.collisionRadius > playerConfig.camera.near);
  const position = bodySpawnPosition(defaultSpawn);
  closeTo(position.y - playerConfig.height / 2, defaultSpawn.position[1]);
  assert.equal(position.x, defaultSpawn.position[0]); assert.equal(position.z, defaultSpawn.position[2]);
  const replacement = bodySpawnPosition({ position: [10, 2, -7], rotation: [0, 1, 0] });
  assert.deepEqual(replacement, { x: 10, y: 2 + playerConfig.height / 2, z: -7 });
});

test("movement diagnostics distinguish grounded idle/walk/run from falling", () => {
  assert.equal(movementState(true, 0, false, playerConfig.movementThreshold), "IDLE");
  assert.equal(movementState(true, 0, true, playerConfig.movementThreshold), "IDLE");
  assert.equal(movementState(true, 2.3, false, playerConfig.movementThreshold), "WALK");
  assert.equal(movementState(true, 5, true, playerConfig.movementThreshold), "RUN");
  assert.equal(movementState(false, 0, false, playerConfig.movementThreshold), "FALL");
});

const require = createRequire(import.meta.url);
const physicsRequire = createRequire(require.resolve("@react-three/rapier"));
const RAPIER = physicsRequire("@dimforge/rapier3d-compat");
await RAPIER.init();

function createTestPlayer(footPosition) {
  const world = new RAPIER.World({ x: 0, y: worldConfig.gravity[1], z: 0 });
  const { size, thickness, surfaceY } = worldConfig.ground;
  world.createCollider(RAPIER.ColliderDesc.cuboid(size / 2, thickness / 2, size / 2).setTranslation(0, surfaceY - thickness / 2, 0));
  for (const box of testEnvironmentBoxes) {
    const rotation = new Quaternion().setFromEuler(new Euler(...(box.rotation ?? [0, 0, 0])));
    world.createCollider(RAPIER.ColliderDesc.cuboid(...box.size.map(value => value / 2)).setTranslation(...box.position).setRotation(rotation));
  }
  const position = bodySpawnPosition({ position: footPosition, rotation: [0, 0, 0] });
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(position.x, position.y, position.z));
  const collider = world.createCollider(RAPIER.ColliderDesc.capsule(playerConfig.capsuleHalfSegment, playerConfig.radius), body);
  const controller = createCharacterController(world, playerConfig);
  const runtime = createPlayerRuntime();
  world.timestep = worldConfig.physicsTimeStep;
  world.step();
  const step = (x = 0, z = 0) => {
    runtime.velocity.x = x; runtime.velocity.z = z;
    stepCharacter(body, collider, controller, runtime, worldConfig.physicsTimeStep, playerConfig, worldConfig.gravity[1], RAPIER.QueryFilterFlags.EXCLUDE_SENSORS);
    world.step();
    return body.translation();
  };
  return { world, body, collider, controller, runtime, step, free: () => world.free() };
}

test("capsule settles without hovering/sinking and blocks walls at run speed", () => {
  const player = createTestPlayer([-7, 0.05, -3]);
  try {
    for (let frame = 0; frame < 60; frame++) player.step();
    closeTo(player.body.translation().y - playerConfig.height / 2, playerConfig.physics.contactOffset, 0.003);
    assert.equal(player.runtime.grounded, true);
    for (let frame = 0; frame < 120; frame++) player.step(-playerConfig.runSpeed, 0);
    assert.ok(player.body.translation().x > -8.58, "Capsule cannot cross the wall");
    assert.ok(player.body.translation().x < -8.5, "Capsule reaches the wall");
    assert.equal(player.runtime.grounded, true);
  } finally { player.free(); }
});

test("controller traverses the low step and all five stairs without jumping", () => {
  for (const [start, frames, expectedHeight] of [[[-5, 0.05, 6.5], 90, 0.15], [[-5, 0.05, 2.5], 110, 0.9]]) {
    const player = createTestPlayer(start);
    try {
      let highestFoot = 0;
      for (let frame = 0; frame < frames; frame++) highestFoot = Math.max(highestFoot, player.step(0, -playerConfig.walkSpeed).y - playerConfig.height / 2);
      assert.ok(highestFoot >= expectedHeight, `Must ascend to ${expectedHeight} m, reached ${highestFoot}`);
      assert.ok(player.body.translation().z < start[2] - 2, "Steps do not block travel");
    } finally { player.free(); }
  }
});

test("ramp climbs/descends and has no idle slope drift", () => {
  const player = createTestPlayer([3, 0.05, 6]);
  try {
    for (let frame = 0; frame < 145; frame++) player.step(0, -playerConfig.walkSpeed);
    assert.ok(player.body.translation().y - playerConfig.height / 2 > 0.98);
    for (let frame = 0; frame < 75; frame++) player.step(0, playerConfig.walkSpeed);
    const before = player.body.translation();
    for (let frame = 0; frame < 120; frame++) player.step();
    const after = player.body.translation();
    closeTo(after.x, before.x, 0.005); closeTo(after.z, before.z, 0.005); closeTo(after.y, before.y, 0.005);
    assert.equal(player.runtime.grounded, true);
    for (let frame = 0; frame < 100; frame++) player.step(0, playerConfig.walkSpeed);
    const feet = player.body.translation().y - playerConfig.height / 2;
    assert.ok(feet >= 0 && feet <= playerConfig.physics.contactOffset + 0.005, "Ramp descent lands above the ground within the controller skin");
  } finally { player.free(); }
});

test("doorway remains passable but tall obstacles block the capsule", () => {
  const door = createTestPlayer([0, 0.05, -4]);
  try {
    for (let frame = 0; frame < 100; frame++) door.step(0, -playerConfig.walkSpeed);
    assert.ok(door.body.translation().z < -7, "Fits through the human-scale doorway");
  } finally { door.free(); }
  const obstacle = createTestPlayer([7, 0.05, 2.4]);
  try {
    for (let frame = 0; frame < 90; frame++) obstacle.step(0, -playerConfig.runSpeed);
    assert.ok(obstacle.body.translation().z > 1.8, "Tall obstacle cannot be climbed or crossed");
    assert.ok(obstacle.body.translation().y - playerConfig.height / 2 < 0.03);
  } finally { obstacle.free(); }
});

test("leaving the upper floor falls under gravity and recovers grounded state", () => {
  const player = createTestPlayer([6, 2.95, -6]);
  try {
    for (let frame = 0; frame < 40; frame++) player.step();
    assert.equal(player.runtime.grounded, true);
    let fell = false;
    for (let frame = 0; frame < 180; frame++) {
      player.step(0, playerConfig.walkSpeed);
      if (!player.runtime.grounded && player.runtime.velocity.y < -1) fell = true;
    }
    assert.equal(fell, true);
    assert.equal(player.runtime.grounded, true);
    closeTo(player.body.translation().y - playerConfig.height / 2, playerConfig.physics.contactOffset, 0.003);
  } finally { player.free(); }
});

test("camera sphere sweep excludes the player and detects a wall before crossing it", () => {
  const player = createTestPlayer([0, 0.05, -4]);
  try {
    const sphere = new RAPIER.Ball(playerConfig.camera.collisionRadius);
    const origin = { x: 0, y: 2.5, z: -4 };
    const hit = player.world.castShape(origin, { x: 0, y: 0, z: 0, w: 1 }, { x: 0, y: 0, z: -1 }, sphere, 0, playerConfig.camera.distance, true, RAPIER.QueryFilterFlags.EXCLUDE_SENSORS, undefined, undefined, player.body);
    assert.ok(hit && hit.time_of_impact < 2, "Camera retracts before doorway header");
    const clear = player.world.castShape({ x: 0, y: 1.5, z: -4 }, { x: 0, y: 0, z: 0, w: 1 }, { x: 0, y: 0, z: 1 }, sphere, 0, playerConfig.camera.distance, true, RAPIER.QueryFilterFlags.EXCLUDE_SENSORS, undefined, undefined, player.body);
    assert.equal(clear, null, "Player capsule does not obstruct its own camera");
  } finally { player.free(); }
});
