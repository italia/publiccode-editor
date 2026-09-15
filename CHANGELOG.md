# Changelog

All notable changes to this project will be documented in this file.

## [2.2.0](https://github.com/italia/publiccode-editor/compare/v2.1.1...v2.2.0) (2026-09-08)


### Added

* add AGENTS.md to provide guidance for AI coding agents ([#641](https://github.com/italia/publiccode-editor/issues/641)) ([7c7051c](https://github.com/italia/publiccode-editor/commit/7c7051cc9a16cd2990db2ba4f9281284d30931d7))
* added warning for no checking URLs([#579](https://github.com/italia/publiccode-editor/issues/579)) ([a73e741](https://github.com/italia/publiccode-editor/commit/a73e7419cd62bf10294362256354b3056bdbb1c4))
* gate fields and country-code case by declared publiccodeYmlVersion ([#642](https://github.com/italia/publiccode-editor/issues/642)) ([0e6322e](https://github.com/italia/publiccode-editor/commit/0e6322e2304c02d9d50d75d43c60071b9ef054b1))
* grouping form fields - partial release ([#571](https://github.com/italia/publiccode-editor/issues/571)) ([1c1cb86](https://github.com/italia/publiccode-editor/commit/1c1cb868cbed7b702b524668fcf66b498e42d291))
* new list UI features screenshots videos awards ([#513](https://github.com/italia/publiccode-editor/issues/513)) ([a1b8821](https://github.com/italia/publiccode-editor/commit/a1b882111b7cb885e03d8190a265841b4b181a56))
* PublicCode v0.5.0 Support ([#541](https://github.com/italia/publiccode-editor/issues/541)) ([4796597](https://github.com/italia/publiccode-editor/commit/4796597429e17d2c61ea68182f0f39089b32a247))
* support publiccode.yml v0.7.0 ([876c192](https://github.com/italia/publiccode-editor/commit/876c192e45c52e24d2962b24576d95f814ec55f1))


### Fixed

* **#524:** add date validation to contractors ([#528](https://github.com/italia/publiccode-editor/issues/528)) ([d09defa](https://github.com/italia/publiccode-editor/commit/d09defa7fc28469f89b4c0782cc358e3af80580b))
* **#540:** added missing field Roadmap ([#543](https://github.com/italia/publiccode-editor/issues/543)) ([b9b02c5](https://github.com/italia/publiccode-editor/commit/b9b02c5c56d36a392edf1a60873ed7683dfbb87f))
* **417:** file upload logic ([#580](https://github.com/italia/publiccode-editor/issues/580)) ([44be1d2](https://github.com/italia/publiccode-editor/commit/44be1d28c62ee4ccf36e163b9f7c1c4399452244))
* **512:** reset validation on import ([#514](https://github.com/italia/publiccode-editor/issues/514)) ([d63250a](https://github.com/italia/publiccode-editor/commit/d63250ab5b38c4def22098ff7ea290b769ca7028))
* add UI for section dependsOn ([#627](https://github.com/italia/publiccode-editor/issues/627)) ([babf2dd](https://github.com/italia/publiccode-editor/commit/babf2dd961f887c31d9f1cb86a911f00c2f4aa23))
* **devcontainer:** set a version for go feature in devcontainer ([#639](https://github.com/italia/publiccode-editor/issues/639)) ([5ea6dd0](https://github.com/italia/publiccode-editor/commit/5ea6dd0022c3d924cbf7792b6aa589e294b3e1ac))
* fix reset on EditorSelect ([#505](https://github.com/italia/publiccode-editor/issues/505)) ([e86cbce](https://github.com/italia/publiccode-editor/commit/e86cbcee3f5370b1cbb47f884d6ea995c5352ae5))
* fixed validation problem on maintenance ([#504](https://github.com/italia/publiccode-editor/issues/504)) ([d1c08f7](https://github.com/italia/publiccode-editor/commit/d1c08f7d401ef607ab84b0fc66eea3229c1639c1))
* removed placeholder from input form fields ([#507](https://github.com/italia/publiccode-editor/issues/507)) ([f839c0c](https://github.com/italia/publiccode-editor/commit/f839c0c4fb55ace54d71317e37f1397227aa66bd))
* resolve accessibility issues from FastPass audit ([#620](https://github.com/italia/publiccode-editor/issues/620)) ([7809c62](https://github.com/italia/publiccode-editor/commit/7809c623e66b128b3df9fc3a1608942f1cbfd174))
* show it.countryExtendedVersion only if it is imported and its value is wrong ([#529](https://github.com/italia/publiccode-editor/issues/529)) ([7e24eff](https://github.com/italia/publiccode-editor/commit/7e24eff91e2ff99d6d9e74042b1079eca98ba795))
* showing no funders message issue properly ([#573](https://github.com/italia/publiccode-editor/issues/573)) ([e27b58c](https://github.com/italia/publiccode-editor/commit/e27b58c081028697743eee9cacce770bbac07258))
* **ui:** added ui for intended audience ([#569](https://github.com/italia/publiccode-editor/issues/569)) ([6ae4c58](https://github.com/italia/publiccode-editor/commit/6ae4c5842bc96417c6da294e40587775c9538d85))
* **ui:** losing focus after input ([#545](https://github.com/italia/publiccode-editor/issues/545)) ([3a4f900](https://github.com/italia/publiccode-editor/commit/3a4f900cfa42443725dab75aa87ce42e0b0a8e45))
* **ui:** update unknown fields behavior ([#546](https://github.com/italia/publiccode-editor/issues/546)) ([1de92da](https://github.com/italia/publiccode-editor/commit/1de92da0267c2836bd703906092a606c6de62737))
* unrecoverable validation error ([#515](https://github.com/italia/publiccode-editor/issues/515)) ([8b3656e](https://github.com/italia/publiccode-editor/commit/8b3656e3a148b26f114f397dc43f3fb4c06d1563))
* **validation:** set uri mandatory and name optional ([#567](https://github.com/italia/publiccode-editor/issues/567)) ([bed93ba](https://github.com/italia/publiccode-editor/commit/bed93ba9ee0e1622a731332a70c9b656b31941d0))

## [2.1.1](https://github.com/italia/publiccode-editor/compare/v2.1.0...v2.1.1) (2025-07-23)

### Added

* fixed email validation error in Contacts and Contractors
* fixed Italy section fields
* fixed add label i18n
* fixed empty string serialization in yml
* fixed page reload on info icon clicl
* fixed import from self hosted gitlab
* fixed page reload on enter form submit
* fixed publiccodeYmlVersion field visibility

## [2.1.0](https://github.com/italia/publiccode-editor/compare/v2.0.4...v2.1.0) (2025-05-14)

### Added

* changed the look&feel, adopting a restyled UI (#397)
* removed md editor test
* removed md editor import
* added validation feedback (#400)
* fixed publiccodeYmlVersion field showing only for versions < 0.4.0 (#401)
* fixed contact list not updating after second publiccode.yml import (#402)
* adeded german localisation (#405)
* fixed default language to allow language detection (#411)
* added Dutch language support (#420)
* added i18n for labels on header bar (#428)

## [2.0.4](https://github.com/italia/publiccode-editor/compare/v2.0.3...v2.0.4) (2025-04-07)

### Added

* fixed file not supported issue

## [2.0.3](https://github.com/italia/publiccode-editor/compare/v2.0.2...v2.0.3) (2025-02-12)

### Added

* added property videos in description field
* added property awards in description field

## [2.0.2](https://github.com/italia/publiccode-editor/compare/v2.0.1...v2.0.2) (2025-01-24)

* fixed description form reset on language change
* added release version in console

## [2.0.1](https://github.com/italia/publiccode-editor/compare/v2.0...v2.0.1) (2025-01-16)

* fixed import from gitlab
* fixed releaseDate issue on import
* added validation feedback
* fixed focus on input click
* fixed validation issue in maintenance form fields
* fixed showing contracts or contractors in relation with maintenance type
* fixed download publiccode.yml file on safari
* added usedBy field added

## [2.0](https://github.com/italia/publiccode-editor/compare/v1.4.3...v2.0) (2024-12-09)

* Refactor migration from webpack to vite scaffold
* Replaced sass style with css
* Fixed import from url
* Fixed import from file
* Fixed form reset
* Added deprecated fileds support
* Added persistence while compiling form
* Added language selector and default language detector on start
* Added validator inside project as wasm
* Reviewd build wasm flow
* Added devcontainer development version
* Added docker-compose development version
* Added react-design-kit and used as inputs
* Fixed ci/cd flows

## [1.4.3](https://github.com/italia/publiccode-editor/compare/v1.4.2...v1.4.3) (2021-09-03)

* Merge pull request #211 from italia/dependabot/npm_and_yarn/handlebars-4.7.7 (04e7a71)
* Merge pull request #220 from italia/dependabot/npm_and_yarn/ws-5.2.3 (8e2a3b8)
* Merge pull request #223 from mfortini/add_check_version_action (505fe06)
* Update .github/workflows/publiccode-versioning.yml (e835760)
* Merge pull request #217 from italia/snyk-fix-5597f25ed65491658400deedd6d46fb8 (f532788)
* Merge pull request #222 from mfortini/update_version (001139f)
* Merge pull request #221 from mfortini/add_screenshot (78b2b79)
* Update software version in publiccode (f6dc5bf)
* Create publiccode-versioning.yml action (744cb39)
* Add screenshots to publiccode (75962f8)
* Add screenshot to README.md (24e56de)
* Add screenshot (6deb7f2)
* Bump ws from 5.2.2 to 5.2.3 (14e0751)
* Merge pull request #218 from italia/dependabot/npm_and_yarn/path-parse-1.0.7 (5863782)
* Bump path-parse from 1.0.6 to 1.0.7 (f7662cb)
* fix: Dockerfile to reduce vulnerabilities (ca68636)
* Bump handlebars from 4.7.6 to 4.7.7 (d1a87b4)
* Merge pull request #206 from italia/dependabot/npm_and_yarn/ssri-6.0.2 (12ec297)
* Bump ssri from 6.0.1 to 6.0.2 (144894c)
* Merge pull request #204 from italia/dependabot/npm_and_yarn/y18n-3.2.2 (c419af5)
* Merge pull request #203 from italia/dependabot/npm_and_yarn/yargs-parser-5.0.1 (36ee4ba)
* Bump y18n from 3.2.1 to 3.2.2 (49bb22c)
* Bump yargs-parser from 5.0.0 to 5.0.1 (51e3ede)
* Merge pull request #202 from italia/dependabot/npm_and_yarn/elliptic-6.5.4 (ba19fd4)
* Bump elliptic from 6.5.3 to 6.5.4 (bbf138a)
* Merge pull request #197 from italia/snyk-upgrade-8602227d95a642a64dd208053472d4f2 (0da8129)
* Merge pull request #195 from italia/snyk-fix-b0501de7ca371a31f2eef512a5b6d073 (d7a322e)
* fix: upgrade draft-js from 0.10.5 to 0.11.7 (d29a647)
* fix: package.json & yarn.lock to reduce vulnerabilities (b627ddb)
* Merge pull request #193 from bfabio/publiccode_authors (0203e4a)
* chore(publiccode): add authorsFile field (25fcaff)
* Merge pull request #190 from bfabio/publiccode_github_action (56fc689)
* chore: fix the publiccode validation workflow (0b09c26)
* Merge pull request #187 from bfabio/publiccode_github_action (ecc6d1d)
* chore(ci): validate publiccode.yml with GitHub Action (1f4f185)
* Merge pull request #159 from italia/fix/87 (81bfa9c)
* squashme: use publiccode-parser orb v0.0.3 (ca6bc31)
* squashme: fix & label (e55d181)
* subproperties are now highligthed when in error (6202f8f)
* Merge pull request #183 from bfabio/publiccodeyml (68873c8)
* chore: add publiccode.yml with CircleCI validation (3e9bc55)
* Merge pull request #186 from italia/dependabot/npm_and_yarn/dot-prop-4.2.1 (fdb95d9)
* Bump dot-prop from 4.2.0 to 4.2.1 (3272b15)
* Merge pull request #185 from italia/dependabot/npm_and_yarn/ini-1.3.7 (4f50c21)
* Bump ini from 1.3.5 to 1.3.7 (8e3c418)
* Merge pull request #180 from bfabio/yaml (fd62765)
* Merge pull request #179 from bfabio/ipa_code (5d5df32)
* Force the use literal blocks when dumping the YAML. (e774684)
* Move the codiceIPA field and reword its description. (9d02800)
* Merge pull request #178 from bfabio/debounce (3db0214)
* Debounce input fields to reduce input lag. (4a79607)
* Merge pull request #177 from italia/fix/remote-validation (a671eeb)
* fix: remote validation using same language, clean before validate again (350b810)
* Merge pull request #176 from italia/fix/remote-validation (836980e)
* fix: remote validation was not working correctly using url param and load by url (5b2e57b)
* Merge pull request #174 from italia/dependabot/npm_and_yarn/node-sass-4.13.1 (9b7f641)
* Merge pull request #166 from italia/dependabot/npm_and_yarn/elliptic-6.5.3 (3cdd30a)
* Bump node-sass from 4.12.0 to 4.13.1 (f8b2d73)
* Merge pull request #163 from italia/dependabot/npm_and_yarn/lodash-4.17.19 (cdf73a1)
* Merge pull request #175 from italia/dependabot/npm_and_yarn/http-proxy-1.18.1 (f3a3438)
* Bump http-proxy from 1.17.0 to 1.18.1 (473a7f2)
* Merge pull request #172 from bfabio/ci_skip (d3f575b)
* Merge pull request #170 from bfabio/crash (7108a04)
* Don't try to run CI when pushing to gh-pages. (34c1c78)
* Bump elliptic from 6.4.1 to 6.5.3 (e7f87bd)
* Bump lodash from 4.17.13 to 4.17.19 (a8485d0)
* Merge pull request #171 from bfabio/ghpages (37804bb)
* Deploy to the gh-pages branch. (597be6b)
* Fix undefined dereference. (da095bf)

## [1.3](https://github.com/italia/publiccode-editor/compare/v1.2...v1.3) (2019-11-26)

### Added

* Added external validation by GO parser (#103)

### Changed

* Shrink the header and add an accent color to it (#114)
* Close button is now interactive (#106)

### Fixed

* Long lines in `longDescription` now have a determined behaviour (#98)
* Force break words for long lines (#105)
* Phone number fields are treated as strings (#89)
* Phone international format treated correctly (#93)
* Validation changes a value (#82)
* Insert feedback after upload when errors happen (#68)

## [1.2](https://github.com/italia/publiccode-editor/compare/v1.1...v1.2) (2019-07-08)

### Added

* New logic for iPA addition (https://github.com/italia/publiccode-editor/commit/dca0f80a53c8b0a29af81e3dd657ed3e7ec50afb)
* File extension validator (https://github.com/italia/publiccode-editor/commit/e205585d142d5395ef3d8f5f562c73ab3766b75f)

### Changed

* Search results limited to keep browser performance (https://github.com/italia/publiccode-editor/commit/f6cf141d749591177773f31f40475fc555e312a0)
* All the fields have been reorganized (https://github.com/italia/publiccode-editor/commit/234bbcde89613aa43f3ed9b9db6999adbb84b443)

### Fixed

* Click on accordion now collapses it (#60)

## [1.1](https://github.com/italia/publiccode-editor/compare/v1.0...v1.1) (2019-04-18)

### Added

* New component to handle AJAX interaction with remote contents.
* Validation flow after uploading a publiccode.yml
* DatePicker are now managed by a react-widgets component to ensure
  compatibility
* Dropdown items for countries and languages provided by ISO 3166-1 alpha-2
  for countries and BCP47 for languages
* Dropdown item for codiceIPA to enable a quick and simple search
* Elasticsearch integration
* Created dedicated CircleCI dev and prod profiles

### Changed

* Upgraded dependencies for performance issues and security audit
* Mandatory boolean fields now have false flag enabled
* Minor improvements

The format is based on `Keep a
Changelog <https://keepachangelog.com/en/1.0.0/>`**, and this project
adheres to `Semantic
Versioning <https://semver.org/spec/v2.0.0.html>`**.
