
# Lockup Streams

Lockup streams behave differently than regular staking streams.
Locked tokens cannot be withdrawn until the duration (period) has finished.

Different from regular staking, lockup streams allow different settings for the same token, those being:

periods (uint32): in seconds (e.g. 31536000 for a year)
multiplier (uint32): e.g. 1e6 is 1.0x, 3210000 is 3.21x

## Constants

You `cannot` retrieve settings from the stream contract, such as periods and multipliers.
For this you use a contract called `Lens`

### .env

A .env variable must contain both a Lens and a Stream contract, e.g. as follows

```md
REACT_APP_STAKING_CONTRACT_ASTRO_ETH=0x180385D7cA839609F9F075bc705F578b7AbD9F3d
REACT_APP_LENS_CONTRACT_ETH=0x339391cA3f2785eE11b109b25Beb7C392AaEB5a8
```

### LENS

Much of the info retrieved about current available pools are retrieved by what's called a Lens contract

a Lens contract has the following read methods:

### getPeriodsAndMultipliers

This will return an array of objects, containing a `period`, or a duration, in seconds in which the tokens will be locked, and a `multiplier`, which is the number that the user tokens will be multiplied by at the end of the `period`

There are parsers and formatteds for displaying these infomations to the user.

### getActiveLockIds

args:

`pool`: the address for the Staking contract
`account`: the users wallet address
`offset`: a query offset

This will return an array of 100 boolean values, which represent the IDs for which the user has active locks on

for example

```js
 [true,false,true,true]
```

This means that locks with IDs of `0`, `2`, and `3` are generating rewards for the user.

If a user reaches 100 locks, we need to provide an offset number.
For the time being, there is no need to worry about offset, as a user who has locked more than 100 times is
the edgest of cases.

This is also not being used for the front end, as we are iterating through a method disclosed below.

### getVestedLockIds

args:

`pool`: the address for the Staking contract
`account`: the users wallet address
`offset`: a query offset

Same as `getActiveLockIds`, whoever, this represents Ids in which the user may unlock tokens from.

Also not being used for the time being.

## Staking

### lock

args

`token`: the token address for which the user will lock their tokens, for the time being, we are providing
the primary `stakingToken` for the contract
`amount`: amount of tokens to be locked
`period`: the `period` which is retrieved by `getPeriodsAndMultipliers`

An allowance is necessary for this contract call.

### unlockTokens

args

`ids`: an array of ids

These Ids represent the position of the lock, as they are located in an array of locks.
These positions `should` come from `getVestedLockIds`, whoever, we are iterating through `locks` method.

### locks

args

`address`: user wallet address
`input`: lock id

The way we're displaying the users `locks` is iterating through indexes until we reach a point that
`locks` returns an empty object. Locks returns an array of objects containing the following props:

```js
  {
    amount: "amount of tokens that the user has locked",
    lockDate: "when the user has locked",
    unlockDate: "when the user may unlock tokens",
    multiplier: "self explanatory",
    withdrawnAt: "date for which the user has withdrawn these tokens",
  }
```

There are parsers for each of these props.

We are allowing users to unlock tokens where unlockDate > current date


### exit and getRewards

These work the same as a regular staking contract, except `exit` also unlocks users `locks`

### balances

given the user wallet address as an argument, this returns an object with the following properties:

```js
{
  balance,
  lockedWithBonus,
  nextLockIndex,
  userRewardPerTokenPaid,
  rewards,
}
```
