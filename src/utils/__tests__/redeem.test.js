import { REDEEM_DAILY_CAP } from "utils/constants";
import { BigNumber } from "ethers";
import {
  addTxToRedeemStoredData,
  computeRedeemStoredDataTxsQueue,
  defaultRedeemStoredData,
  loadRedeemStoredData,
  validateRedeemStoredData,
} from "../redeem";

describe("utils/redeem", () => {
  describe("defaultRedeemStoredData()", () => {
    it("should return the default data based on current time and current redeem cap", () => {
      const mockDateObject = new Date("2022", "0", "3", "5").valueOf();
      const spy = jest
        .spyOn(global.Date, "now")
        .mockImplementation(() => mockDateObject);

      expect(defaultRedeemStoredData()).toStrictEqual({
        availableQuota: REDEEM_DAILY_CAP,
        timestamp: mockDateObject,
        txsQueue: [],
      });

      spy.mockRestore();
    });
  });

  describe("validateRedeemStoredData()", () => {
    beforeAll(() => {
      const mockDateObject = new Date("2022", "0", "3", "5").valueOf();
      jest.spyOn(global.Date, "now").mockImplementation(() => mockDateObject);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should return false if the provided data is outdated", () => {
      const outdatedData = {
        availableQuota: REDEEM_DAILY_CAP,
        timestamp: new Date("2022", "0", "1", "2").valueOf(),
        txsQueue: [{ hash: "0x1a2b3c4d5e", amount: "1" }],
      };

      expect(validateRedeemStoredData(outdatedData)).toStrictEqual(false);
    });

    it("should return false if the availableQuota from the provided data is bigger than the daily cap", () => {
      const invalidData = {
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).add("1").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [{ hash: "0x1a2b3c4d5e", amount: "1" }],
      };
      expect(validateRedeemStoredData(invalidData)).toStrictEqual(false);
    });

    it("should return true if the provided data is valid", () => {
      const validData = {
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).sub("1").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [{ hash: "0x1a2b3c4d5e", amount: "1" }],
      };
      expect(validateRedeemStoredData(validData)).toStrictEqual(true);
    });
  });

  describe("setRedeemStoredData()", () => {});

  describe("addTxToRedeemStoredData()", () => {
    it("should call the passed callback with the object containing the new transaction details", () => {
      const storedData = {
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).sub("1").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [{ hash: "0x1a2b3c4d5e", amount: "1" }],
      };

      const txData = {
        hash: "0x6f7g8h9i0j",
        amount: "2",
      };

      const callback = jest.fn();

      addTxToRedeemStoredData(storedData, txData, callback);

      expect(callback).toHaveBeenCalledWith({
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).sub("1").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [
          { hash: "0x1a2b3c4d5e", amount: "1" },
          {
            hash: "0x6f7g8h9i0j",
            amount: "2",
          },
        ],
      });
    });
  });

  describe("computeRedeemStoredDataTxsQueue()", () => {
    it("should call the passed callback with the object not containing the removed transaction details", () => {
      const storedData = {
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).sub("1").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [
          { hash: "0x1a2b3c4d5e", amount: "1" },
          {
            hash: "0x6f7g8h9i0j",
            amount: "2",
          },
        ],
      };

      const callback = jest.fn();

      computeRedeemStoredDataTxsQueue(storedData, callback);

      expect(callback).toHaveBeenCalledWith({
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).sub("4").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [],
      });
    });
  });

  describe("loadRedeemStoredData()", () => {
    beforeAll(() => {
      const mockDateObject = new Date("2022", "0", "3", "5").valueOf();
      jest.spyOn(global.Date, "now").mockImplementation(() => mockDateObject);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call the passed callback with default data when stored data is invalid", () => {
      const invalidData = {
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).add("1").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [{ hash: "0x1a2b3c4d5e", amount: "1" }],
      };

      const callback = jest.fn();

      loadRedeemStoredData(invalidData, callback);

      expect(callback).toHaveBeenCalledWith({
        availableQuota: REDEEM_DAILY_CAP,
        timestamp: new Date("2022", "0", "3", "5").valueOf(),
        txsQueue: [],
      });
    });

    it("should call the passed callback with updated data when stored data is valid and there are txs on queue", () => {
      const validData = {
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).sub("1").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [
          { hash: "0x1a2b3c4d5e", amount: "1" },
          { hash: "0x6f7g8h9i0j", amount: "2" },
        ],
      };

      const callback = jest.fn();

      loadRedeemStoredData(validData, callback);

      expect(callback).toHaveBeenCalledWith({
        availableQuota: BigNumber.from(REDEEM_DAILY_CAP).sub("4").toString(),
        timestamp: new Date("2022", "0", "3", "2").valueOf(),
        txsQueue: [],
      });
    });
  });
});
