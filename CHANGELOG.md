# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.10.0] - 2024-06-28

### Removed

- rUMB section on landing page.
- Astro Stream card.
- Redeem option from the top menu.
- FAQ option from the top menu.

### Changed

- Align font to match the one of the mainsite
- Included FAQs at the bottom of the main page.
- Added an FAQ for Astro Stream.

## [4.9.0] - 2023-07-03

### Added

- Reddem for rUMB2

### Changed

- Replaced `react-app-rewired` by `react-scripts`
- Updated import paths according to the base URL
- Update Astro Disclaimers regarding rUMB redeeming
- UMB and rUMB token images
- FAQ cards click behavior
- Update FAQ content
- Move staking to V3
- Switch wallet integration to Wagmi

### Removed

- Withdrawal portal logic and workflows
- Chinese translation
- Partner Rewards Programs

## [4.8.0] - 2023-02-14

### Changed

- Update Logos and icons to match Umbrella's new visual identity

## [4.7.0] - 2023-01-23

### Changed

- Disable token Lockup (Astro stream)

## [4.6.0] - 2022-10-31

### Changed

- Switch dev ETH networks to Goerli
- Update Unlock workflow to Claim Rewards before Unlocking locks

## [4.5.2] - 2022-10-19

### Fixed

- Withdraw tab locks list and selection no longer reset after data is reloaded

## [4.5.1] - 2022-09-16

### Fixed

- UI behaviour / localStorage handling after Locking/Unlocking tokens

## [4.5.0] - 2022-08-24

### Changed

- Wallet Connection workflow for Redeem pages

## [4.4.0] - 2022-08-18

### Changed

- Update APY calculation for LP streams

## [4.3.0] - 2022-05-19

### Changed

- Optimize redeem loading
- Clean redeem unused data

## [4.2.0] - 2022-05-17

### Added

- Redeem soft cap

## [4.1.6] - 2022-04-26

### Added

- Additional APY information

## [4.1.5] - 2022-04-21

### Fixed

- Target token to be redeemed in the future text

## [4.1.4] - 2022-04-19

### Fixed

- Reenable Polar stream

## [4.1.3] - 2022-03-23

### Fixed

- Past iteration warnings visibility

## [4.1.2] - 2022-03-23

### Fixed

- Web3 provider version

## [4.1.1] - 2022-03-21

### Fixed

- Annual rewards calculations

## [4.1.0] - 2022-03-21

### Removed

- Polar stream availability

## [4.0.3] - 2022-03-17

### Fixed

- Rewards displayed information

## [4.0.2] - 2022-03-16

### Removed

- Remove prohibited person warning

## [4.0.1] - 2022-03-16

### Fixed

- Fix lens addresses

## [4.0.0] - 2022-03-15

### Added

- Lockup support
- Redeeming from past iterations
- Restrictions to prohibited territories

## [3.11.0] - 2022-03-07

### Fixed

- Sushi Onsen terminology
- FAQ texts

## [3.10.0] - 2022-02-14

### Added

- Redeeming page improvements

## [3.9.7] - 2022-02-10

### Fixed

- Reenable redeeming

## [3.9.6] - 2022-02-09

### Fixed

- Pipeline

## [3.9.5] - 2022-02-09

### Fixed

- Temporarily disable redeeming

## [3.9.4] - 2022-02-09

### Fixed

- Reward token symbol fetching

## [3.9.3] - 2022-02-09

### Removed

- Litepaper link from footer

## [3.9.2] - 2022-02-09

### Fixed

- Hadley BSC daily available tokens

## [3.9.1] - 2022-02-07

### Fixed

- Deployment variables

## [3.9.0] - 2022-02-07

### Added

- Redeeming section
- Support for inactive streams

## [3.8.2] - 2022-01-26

### Fixed

## Added

## [3.8.1] - 2022-01-13

### Changed

- Enabled BSC Polar Stream
- Daily reward amounts were updated

## [3.8.0] - 2022-01-11

### Added

- BSC Staking STREAMS

### Fixed

- Mobile Streams and Rewards Cards styling

## [3.7.0] - 2021-11-29

### Added

- STREAMS APY info

### Changed

- Updated number locale on landing page

## [3.6.3] - 2021-11-17

### Added

- Links to company public files and to the token bridge

## [3.6.2] - 2021-11-12

### Changed

- PancakeSwap 20k Rewards Program was deprecated

## [3.6.1] - 2021-11-01

### Changed

- Hadley STREAM rewards amount

## [3.6.0] - 2021-10-27

### Added

- Confirmation Layer to Staking process

### Fixed

- Allowance verification flow

## [3.5.2] - 2021-10-26

### Added

- Update github action for prod

## [3.5.1] - 2021-10-13

### Fixed

- Litepaper URL

## [3.5.0] - 2021-10-04

### Removed

- Dicontinued programs - Unifarm and Sushiswap 20k

## [3.4.3] - 2021-08-25

### Changed

- Hadley STREAM rewards amount

## [3.4.2] - 2021-08-25

### Fixed

- CI variables

## [3.4.1] - 2021-08-24

### Fixed

- Network detection and error messages

## [3.4.0] - 2021-08-01

### Changed

- Update Hadley STREAM daily rewards amount

## [3.3.0] - 2021-07-23

### Changed

- Contract Addresses handling on Rewards Programs

## [3.2.0] - 2021-07-22

### Changed

- Improve FAQ

## [3.1.1] - 2021-07-14

### Fixed

- Landing page carousel scroll wheel event consistency

## [3.1.0] - 2021-07-07

## Added

- Additional reward programs

## Changed

- Updated Makefile to push to S3 bucket instead of Docker
- Improved descriptions on Landing Page and Partner Rewards Programs naming

### Fixed

- Impove network detection reliability

## [3.0.3] - 2021-07-07

### Fixed

- Updated Node version on S3 Workflow
- Added `yarn.lock` to docker builds

## [3.0.2] - 2021-07-07

### Fixed

- Node and sass versions

## [3.0.1] - 2021-07-05

## Changed

- Deployment now pushes to an S3 Bucket

## [3.0.0] - 2021-06-15

## Added

- Multi-wallet integration

## Changed

- Update Makefile for new dev env
- remove lp-prod workflow

## [2.1.6] - 2021-06-14

### Changed

- Increase number of nginx workers per CPU

## [2.1.5] - 2021-06-09

### Fixed

- Fix allowance verification not being called properly

## [2.1.4] - 2021-06-09

### Fixed

- Allow github workflows to be re-executed
- Remove unnecessary Workflows

## [2.1.3] - 2021-06-09

### Fixed

- Stream pages rendering out of view
- Console error on FAQ

## [2.1.2] - 2021-06-09

### Fixed

- Allowed amount verification consistency

## [2.1.1] - 2021-05-10

### Added

- Update Makefile

## [2.1.0] - 2021-05-04

### Changed

- Balance updates are now based on a new block listener

## [2.0.1] - 2021-05-03

### Added

- Add new Production git workflow

## [2.0.0] - 2021-05-01

### Added

- Enable NewRelic Browser
- Rewards to landing page
- Rewards Programs pages

### Changed

- Redesign
- Landing page design and behaviors
- Redesign tip
- Staking/withdraw redesigns
- Redesign recent transactions
- Redesign header
- Redesign footer
- Redesign FAQ
- Rework Daily Yield formulas

## [1.6.0] - 2021-04-12

### Added

- Chinese FAQ translation

## [1.5.1] - 2021-04-05

### Fixed

- Add Liquidity guide steps order

## [1.5.0] - 2021-04-01

### Changed

- Make it so balances clear when unmounting staking pages
- Landing page visual improvements

## [1.4.5] - 2021-03-29

### Added

- Contact us support card

### Removed

- Uniswap links from staking pages

## [1.4.4] - 2021-03-29

### Changed

- Landing page texts and CTAs

## [1.4.3] - 2021-03-29

### Removed

- Landing page texts

## [1.4.2] - 2021-03-29

### Fixed

- Hadley stream available tokens

## [1.4.1] - 2021-03-29

### Fixed

- Version component

## [1.4.0] - 2021-03-29

### Added

- LP staking

### Changed

- Reworked How To Stake page

## [1.3.2] - 2021-03-24

### Fixed

- Unavailable Wallet and Deeplinking flow

## [1.3.1] - 2021-03-24

### Fixed

- Connect Button not working when no wallets are connected previously

## [1.3.0] - 2021-03-23

### Changed

- Ethereum provider flow is now based on `@metamask/detect-provider`
- Metamask Provider requests and listeners were updated to follow recommended patterns. Deprecated methods were removed
- Trust contract checkbox is now disabled if user has trusted in the past

## [1.2.4] - 2021-03-23

### Fixed

- Add missing .env variables to Dockerfile

## [1.2.3] - 2021-03-22

### Fixed

- totalSupply links should point to #readContract section

## [1.2.2] - 2021-03-22

### Changed

- Changed `FAQ` section to `HOW TO STAKE`
- UMB and LP Staking texts rework

## [1.2.1] - 2021-03-22

### Fixed

- Updated FAQ references to LP Staking

## [1.2.0] - 2021-03-22

### Added

- LP Staking Flow

## [1.1.3] - 2021-03-20

### Changed

- Update hardcoded total daily rewards after LP Staking inclusion on contract-side

## [1.1.2] - 2021-03-16

### Fixed

- Update cache settings using nginx.conf

## [1.1.1] - 2021-03-14

### Fixed

- Stake button being disabled incorrectly

## [1.1.0] - 2021-03-14

### Changed

- Rework numbers precision
- Rework wallet and contracts addresses buttons
- Minor UI adjustments

### Removed

- Remove staking timer
- Remove UX contest banner

## [1.0.1] - 2021-03-09

### Fixed

- Fix Input unit parsing when the number decimal part length goes over 18

## [1.0.0] - 2021-02-23

### Added

- Initial version - repository migration
- Loading states to each transaction
- Transaction history
- Mobile optimization
- UX contest banner
- Wrong network handling
- Staking tutorial
- MetaMask Deeplinking when it isn't detected
- CI/CD

### Changed

- Code refactor for readability
- Completely drop INFURA
- Buttons are now disabled based on user balances, staked amount and rewards
- User balances, staked amount and rewards now automatically update every 5 seconds
- Rework ethereum instance (injected by MetaMask) listeners
- Removed multiple rewards variables to avoid confusion

### Fixed

- UI issues with Safari and Firefox on web and mobile
- Error handling when MetaMask isn't detected
- Fetching wallet address after refresh when account is already connected
- Remove `useInfura` as it couldn't handle de volume of requests. Contracts data are now fetched using only regular web3 Providers.
- Quick Fix for low `gasLimit` on MetaMask transactions. It is now hardcoded but we should take a second look on this.
