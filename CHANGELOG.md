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
