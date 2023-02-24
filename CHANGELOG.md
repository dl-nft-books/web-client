# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.0-rc.1]
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

[Unreleased]: https://gitlab.com/tokend/nft-books/web-client-nft-books/compare/v1.2.0...main
[1.2.0]: https://gitlab.com/tokend/nft-books/web-client-nft-books/compare/v1.1.0...v1.2.0
[1.1.0]: https://gitlab.com/tokend/nft-books/web-client-nft-books/compare/v1.0.0...v1.1.0
[1.0.0]: https://gitlab.com/tokend/nft-books/web-client-nft-books/tags/v1.0.0
