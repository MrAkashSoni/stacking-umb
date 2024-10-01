import { isLessThanOrEqual, subtractFrom } from "../BigNumber";

describe("utils/BigNumber", () => {
  describe("isLessThanOrEqual()", () => {
    it("should return false when number is greater than the reference", () => {
      expect(isLessThanOrEqual("250", "240")).toStrictEqual(false);
    });
    it("should return true when number is equal the reference", () => {
      expect(isLessThanOrEqual("240", "240")).toStrictEqual(true);
    });
    it("should return true when number is less than the reference", () => {
      expect(isLessThanOrEqual("230", "240")).toStrictEqual(true);
    });
  });
  describe("subtractFrom()", () => {
    it("should return the result number as string when subtracting the subtrahend from the minuend", () => {
      expect(subtractFrom("250", "25")).toStrictEqual("225");
    });
  });
});
