import { isMinorThanLatest, toSemVerObject } from "./semver";

describe("semver test", () => {
  it("should run", () => {
    expect(true).toBe(true);
  });

  it("should return true if is minor than latest", () => {
    //arrange
    const versionsUnderTests = [
      toSemVerObject("0.1"),
      toSemVerObject("0.2"),
      toSemVerObject("0.2.1"),
      toSemVerObject("0.3.0"),
      toSemVerObject("0.4.0"),
      toSemVerObject("0.4.1"),
      toSemVerObject("0.5"),
    ];
    //act
    const [
      actual01,
      actual02,
      actual021,
      actual03,
      actual04,
      actual041,
      actual05,
    ] = versionsUnderTests.map((v) => isMinorThanLatest(v));

    //assert
    expect(actual01).toBeTruthy();
    expect(actual02).toBeTruthy();
    expect(actual021).toBeTruthy();
    expect(actual03).toBeTruthy();
    expect(actual04).toBeFalsy();
    expect(actual041).toBeFalsy();
    expect(actual041).toBeFalsy();
    expect(actual05).toBeFalsy();
  });
});
