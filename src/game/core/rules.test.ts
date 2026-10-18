import { describe, expect, it } from "vitest";
import { canAfford, experienceForNextLevel, levelFromExperience, rewardOnce, scorePullerAttempt } from "./rules";

describe("game progression", () => {
  it("uses a positive increasing XP threshold", () => {
    expect(experienceForNextLevel(1)).toBeGreaterThan(0);
    expect(experienceForNextLevel(5)).toBeGreaterThan(experienceForNextLevel(1));
  });
  it("levels up from accumulated XP", () => {
    expect(levelFromExperience(0)).toBe(1);
    expect(levelFromExperience(experienceForNextLevel(1))).toBe(2);
  });
});
describe("Puller scoring", () => {
  it("does not reward an uncaught or unsafe attempt", () => {
    expect(scorePullerAttempt("running", { caught: false, returned: true, distance: 10, airtime: 1, safeLanding: true })).toBe(0);
    expect(scorePullerAttempt("jumping", { caught: true, returned: true, distance: 10, airtime: 1, safeLanding: false })).toBe(0);
  });
  it("rewards a safe catch and return", () => {
    expect(scorePullerAttempt("running", { caught: true, returned: true, distance: 10, airtime: 1, safeLanding: true })).toBeGreaterThan(0);
  });
  it("clamps unrealistic distance and airtime", () => {
    expect(scorePullerAttempt("jumping", { caught: true, returned: false, distance: 10000, airtime: 100, safeLanding: true })).toBe(75);
  });
});
describe("economy helpers", () => {
  it("rejects unaffordable purchases", () => {
    expect(canAfford(20, 21)).toBe(false);
    expect(canAfford(20, 20)).toBe(true);
  });
  it("does not grant a reward twice", () => {
    expect(rewardOnce(false, 50)).toBe(50);
    expect(rewardOnce(true, 50)).toBe(0);
  });
});
