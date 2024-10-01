import { STAGE, DEV, PROD } from "utils/constants";

export const V2 = {
  [DEV]: {
    eth: {
      stakingContract: "0xc94A585C1bC804C03A864Ee766Dd1B432f73f9A8",
      mainToken: "0x97e8922eac4fa07e958667E3e7AEa7a7fe3eC9f6",
      rewardToken: "0x75A2640374bEd1ee374F1339ec7DC65f898851d6",
    },
    allowedNetwork: 5,
    ratio: "1:1",
  },
  [PROD]: {
    eth: {
      stakingContract: "0x5A2697C772d6062Eb2005e84547Ec4a36cCb3B52",
      mainToken: "0x6fC13EACE26590B80cCCAB1ba5d51890577D83B2",
      rewardToken: "0xAe9aCa5d20F5b139931935378C4489308394ca2C",
    },
    allowedNetwork: 1,
    ratio: "1:1",
  },
}[STAGE];
