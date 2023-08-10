# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

[Unreleased]
#### Removed
- Old local json api client

#### Changed
- Web3Store refactored
- Interaction with providers moved on [@distributedlab/w3p](https://distributed-lab.github.io/web-kit/modules/_distributedlab_w3p.html#distributedlabw3p)
- Work with api moved on [@distributeslab/jac](https://distributed-lab.github.io/web-kit/modules/_distributedlab_jac.html)

## [1.5.0] - 2023-08-07
#### Added
- [Rarimo checkout](https://rarimo.github.io/js-sdk/modules/_rarimo_nft_checkout.html) option while buying NFT

#### Changed
- When chain is invalid - we using fallback provider. It provides
abillity to show books no matter on what chain user is now

#### Fixed
- Purchase form refactored
- StepsForm now works with dynamic amount of steps

## [1.4.0] - 2023-05-12
#### Added
- New contracts logic:
    - Now info about book is gathering partly from contracts and partly from backend
    - All NFT`s are being fetched directly from contract
- NFT banner image editor
- Default configurable RPC provider for displaying books from 1 default chain if user doesn't have provider
- Composable useContractPagination for contract-based pagination
- Sepolia network for stage tests

#### Removed
- Search feature
- Signature from buy NFT form. We are no longer adding signature directly to PDF, this purpose now is on image editor

#### Changed
- Promocode now can be different length and can be 100%
- On unsupported browsers will be shown corresponding message
- Redesign of all pages
- Main buy NFT form now is 2 steps form (first step: all payment info, second step: editing your banner)
- Network switcher now works as a filter by chains
- Voucher buy doesn't require to have native currency to obtain book
- Refactor some composables
- All 'generator' routes now 'core' routes


#### Fixed
- Bug with provider detection in Brave Browser

## [1.3.1] - 2023-03-01
#### Fixed
- ERC-20 spend bug

## [1.3.0-rc.1] - 2023-02-28
#### Added
- Search on bookshelf page
- Nft for nft exchange
- useBook and useGenerator composable
- fallback provider for metamask

#### Changed
- Typography refactored
- All components refactored to script setup style
- All components refactored to 'template -> script -> style' pattern
- Clean up and refactoring old code base
- Purchase form is devided into different components to increase code readability
- Refactored composable folder structure

#### Fixed
- Bug with showing filter and search together
- Touch devices bug on FAQ page

#### Removed
- useContext hook
- Useless types

## [1.2.0] - 2023-02-06
#### Added
- Network switcher component in bookshelf
- Network switcher component in header
- User drop-down menu
- useContext hook instead of calling useI18n every time and specifying scope
- Promocodes logic
- Vouchers logic
- FAQ page
- Technical work page

#### Changed
- Contract updated to the newest version
- Metamask redirects you to the page where you clicked connect button

## [1.1.0] - 2022-12-26
#### Added
- Network switcher component(doing nothing for now)

#### Changed
- About page redesign
- Footer links
- Mobile version redirects to metamask browser or to the page of its app
- Connecting to metamask logic moved to useMetaMaskConnect hook
- Main page redesign
- Book page redesign
- Switcher disabled for a while
- My nfts page color
- OG image

#### Fixed
- Footer on My-NFTs page

#### Removed
- Metamask disconnect feature
- Unused login form

#### Fixed
- Too large book title now displays correct on all pages
- Mobile adaptive problems
- Z-index at book list

## [1.0.0] - 2022-11-30
#### Added
- Bookself page
- My nfts page

#### Changed
- Rebranding

#### Under the hood changes
- merged from https://gitlab.com/distributed_lab/frontend/vue-template

[Unreleased]: https://github.com/dl-nft-books/web-client/compare/v1.5.0...main
[1.5.0]: https://github.com/dl-nft-books/web-client/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/dl-nft-books/web-client/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/dl-nft-books/web-client/compare/v1.3.0-rc.1...v1.3.1
[1.3.0-rc.1]: https://github.com/dl-nft-books/web-client/compare/v1.2.0...v1.3.0-rc.1
[1.2.0]: https://github.com/dl-nft-books/web-client/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/dl-nft-books/web-client/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/dl-nft-books/web-client/tree/v1.0.0
