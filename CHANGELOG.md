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

# Changelog

All notable changes to this project will be documented in this file.

## [Release 1.3] - 2019-11-26

### Added

-  Added external validation by GO parser (#103)

### Changed

-  Shrink the header and add an accent color to it (#114)
-  Close button is now interactive (#106)

### Fixed

-  Long lines in `longDescription` now have a determined behaviour (#98)
-  Force break words for long lines (#105)
-  Phone number fields are treated as strings (#89)
-  Phone international format treated correctly (#93)
-  Validation changes a value (#82)
-  Insert feedback after upload when errors happen (#68)


## [Release 1.2] - 2019-07-08

### Added

-  New logic for iPA addition (https://github.com/italia/publiccode-editor/commit/dca0f80a53c8b0a29af81e3dd657ed3e7ec50afb) 
-  File extension validator (https://github.com/italia/publiccode-editor/commit/e205585d142d5395ef3d8f5f562c73ab3766b75f)

### Changed

-  Search results limited to keep browser performance (https://github.com/italia/publiccode-editor/commit/f6cf141d749591177773f31f40475fc555e312a0) 
-  All the fields have been  reorganized (https://github.com/italia/publiccode-editor/commit/234bbcde89613aa43f3ed9b9db6999adbb84b443) 

### Fixed

-  Click on accordion now collapses it (#60)


## [Release 1.1] - 2019-04-18

### Added

-  New component to handle AJAX interaction with remote contents.
-  Validation flow after uploading a publiccode.yml
-  DatePicker are now managed by a react-widgets component to ensure
   compatibility
-  Dropdown items for countries and languages provided by ISO 3166-1 alpha-2
   for countries and BCP47 for languages   
-  Dropdown item for codiceIPA to enable a quick and simple search 
-  Elasticsearch integration
-  Created dedicated CircleCI dev and prod profiles 

### Changed

-  Upgraded dependencies for performance issues and security audit
-  Mandatory boolean fields now have false flag enabled
-  Minor improvements


The format is based on `Keep a
Changelog <https://keepachangelog.com/en/1.0.0/>`__, and this project
adheres to `Semantic
Versioning <https://semver.org/spec/v2.0.0.html>`__.
