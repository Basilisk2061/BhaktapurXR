import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { Euler, Quaternion } from "three";
import { worldConfig } from "../src/game/world/world-config.ts";
import { defaultSpawn } from "../src/game/world/spawn-config.ts";
import { scaleTestDimensions, testEnvironmentBoxes } from "../src/game/world/test-environment-config.ts";
import { DEFAULT_QUALITY_PRESET, renderingConfig } from "../src/lib/quality-config.ts";
import { modelPath } from "../src/lib/asset-paths.ts";

test("metre-based world and bounded rendering configuration", () => {
  assert.equal(worldConfig.unitsPerMetre, 1);
  assert.equal(worldConfig.upAxis, "Y");
  assert.deepEqual(worldConfig.gravity, [0, -9.81, 0]);
  assert.equal(worldConfig.physicsTimeStep, 1 / 60);
  assert.ok(worldConfig.camera.near > 0 && worldConfig.camera.far <= 100);
  assert.ok(["LOW", "MEDIUM", "HIGH"].includes(DEFAULT_QUALITY_PRESET));
  assert.ok(renderingConfig.dpr[0] >= 1 && renderingConfig.dpr[1] <= 2);
  assert.ok(renderingConfig.shadows.mapSize <= 2048);
  assert.equal(Math.log2(renderingConfig.shadows.mapSize) % 1, 0);
  assert.ok(renderingConfig.exposure > 0);
});

test("spawn transform is finite, within the ground, and foot-height based", () => {
  assert.equal(defaultSpawn.position.length, 3);
  assert.equal(defaultSpawn.rotation.length, 3);
  for (const value of [...defaultSpawn.position, ...defaultSpawn.rotation]) assert.ok(Number.isFinite(value));
  assert.ok(Math.abs(defaultSpawn.position[0]) < worldConfig.ground.size / 2);
  assert.ok(Math.abs(defaultSpawn.position[2]) < worldConfig.ground.size / 2);
  assert.ok(defaultSpawn.position[1] > worldConfig.ground.surfaceY && defaultSpawn.position[1] < 0.1);
});

test("fixtures have unique ids, positive dimensions and finite transforms", () => {
  assert.equal(new Set(testEnvironmentBoxes.map(box => box.id)).size, testEnvironmentBoxes.length);
  for (const box of testEnvironmentBoxes) {
    assert.ok(box.size.every(value => Number.isFinite(value) && value > 0), box.id);
    assert.ok(box.position.every(Number.isFinite), box.id);
    assert.ok((box.rotation ?? [0, 0, 0]).every(Number.isFinite), box.id);
  }
  assert.equal(testEnvironmentBoxes.filter(box => box.id.startsWith("stair-") && box.id !== "stair-landing").length, scaleTestDimensions.stairs.count);
});

test("local model paths support GLB/glTF and reject traversal or external URLs", () => {
  assert.equal(modelPath("architecture", "future-building.glb"), "/assets/models/architecture/future-building.glb");
  assert.equal(modelPath("environment", "terrain.gltf"), "/assets/models/environment/terrain.gltf");
  for (const invalid of ["../model.glb", "sub/model.glb", "https://example.com/model.glb", "model.obj", "", "model.glb?query=1"]) {
    assert.throws(() => modelPath("characters", invalid), /local/);
  }
});

test("diagnostics default off and cannot be enabled in production", async () => {
  const names = ["NODE_ENV", "NEXT_PUBLIC_DEBUG_PERFORMANCE", "NEXT_PUBLIC_DEBUG_PHYSICS", "NEXT_PUBLIC_DEBUG_WORLD", "NEXT_PUBLIC_DEBUG_SPAWN", "NEXT_PUBLIC_DEBUG_PLAYER", "NEXT_PUBLIC_DEBUG_WORLD_DATA", "NEXT_PUBLIC_WORLD_REFERENCE", "NEXT_PUBLIC_DEBUG_SPATIAL"];
  const previous = Object.fromEntries(names.map(name => [name, process.env[name]]));
  try {
    process.env.NODE_ENV = "development";
    for (const name of names.slice(1)) delete process.env[name];
    const defaults = await import("../src/lib/development-config.ts?defaults");
    assert.ok(Object.values(defaults.developmentConfig).every(value => value === false));
    for (const name of names.slice(1)) process.env[name] = "true";
    const development = await import("../src/lib/development-config.ts?enabled");
    assert.ok(Object.values(development.developmentConfig).every(value => value === true));
    process.env.NODE_ENV = "production";
    const production = await import("../src/lib/development-config.ts?production");
    assert.ok(Object.values(production.developmentConfig).every(value => value === false));
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
});

test("Rapier cuboids preserve doorway clearance, stairs, ramp and safe spawn", async () => {
  // Resolve the same engine used by R3F/Rapier, rather than install another copy.
  const require = createRequire(import.meta.url);
  const physicsRequire = createRequire(require.resolve("@react-three/rapier"));
  const RAPIER = physicsRequire("@dimforge/rapier3d-compat");
  await RAPIER.init();
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  try {
    const { size, thickness, surfaceY } = worldConfig.ground;
    world.createCollider(RAPIER.ColliderDesc.cuboid(size / 2, thickness / 2, size / 2).setTranslation(0, surfaceY - thickness / 2, 0));
    for (const box of testEnvironmentBoxes) {
      const rotation = new Quaternion().setFromEuler(new Euler(...(box.rotation ?? [0, 0, 0])));
      world.createCollider(RAPIER.ColliderDesc.cuboid(...box.size.map(value => value / 2)).setTranslation(...box.position).setRotation(rotation));
    }
    world.step();
    assert.equal(world.colliders.len(), testEnvironmentBoxes.length + 1);

    const heightAt = (x, z) => {
      const hit = world.castRay(new RAPIER.Ray({ x, y: 10, z }, { x: 0, y: -1, z: 0 }), 20, true);
      assert.ok(hit, `No supporting surface at ${x}, ${z}`);
      return 10 - hit.timeOfImpact;
    };
    const closeTo = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.002, `${actual} != ${expected}`);
    closeTo(heightAt(...[defaultSpawn.position[0], defaultSpawn.position[2]]), surfaceY);
    closeTo(heightAt(-5, 5), scaleTestDimensions.lowStep.height);
    for (let index = 0; index < scaleTestDimensions.stairs.count; index++) {
      closeTo(heightAt(-5, 1.5 - (index + 0.5) * scaleTestDimensions.stairs.tread), (index + 1) * scaleTestDimensions.stairs.rise);
    }
    closeTo(heightAt(3, 3), scaleTestDimensions.ramp.rise / 2);
    assert.ok(heightAt(3, 2) > heightAt(3, 4));
    closeTo(heightAt(6, -6), scaleTestDimensions.structure.floorHeight + scaleTestDimensions.structure.floorThickness);

    const doorwayHit = (y) => world.castRay(new RAPIER.Ray({ x: 0, y, z: -4 }, { x: 0, y: 0, z: -1 }), 4, true);
    assert.equal(doorwayHit(1), null, "Door opening must stay clear");
    assert.ok(doorwayHit(2.5), "Door lintel must collide");
    const overlaps = [];
    world.intersectionsWithShape(
      { x: defaultSpawn.position[0], y: defaultSpawn.position[1] + 0.9, z: defaultSpawn.position[2] },
      { x: 0, y: 0, z: 0, w: 1 },
      new RAPIER.Capsule(0.55, 0.3),
      collider => { overlaps.push(collider.handle); return true; },
    );
    assert.deepEqual(overlaps, [], "Spawn must have human-scale clearance");
  } finally {
    world.free();
  }
});
