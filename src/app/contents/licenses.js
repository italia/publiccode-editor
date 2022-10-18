const licenses = [
  {
    text: "BSD Zero Clause License",
    value: "0BSD",
  },
  {
    text: "Attribution Assurance License",
    value: "AAL",
  },
  {
    text: "Amazon Digital Services License",
    value: "ADSL",
  },
  {
    text: "Academic Free License v1.1",
    value: "AFL-1.1",
  },
  {
    text: "Academic Free License v1.2",
    value: "AFL-1.2",
  },
  {
    text: "Academic Free License v2.0",
    value: "AFL-2.0",
  },
  {
    text: "Academic Free License v2.1",
    value: "AFL-2.1",
  },
  {
    text: "Academic Free License v3.0",
    value: "AFL-3.0",
  },
  {
    text: "Affero General Public License v1.0 only",
    value: "AGPL-1.0-only",
  },
  {
    text: "Affero General Public License v1.0 or later",
    value: "AGPL-1.0-or-later",
  },
  {
    text: "GNU Affero General Public License v3.0 only",
    value: "AGPL-3.0-only",
  },
  {
    text: "GNU Affero General Public License v3.0 or later",
    value: "AGPL-3.0-or-later",
  },
  {
    text: "AMD's plpa_map.c License",
    value: "AMDPLPA",
  },
  {
    text: "Apple MIT License",
    value: "AML",
  },
  {
    text: "Academy of Motion Picture Arts and Sciences BSD",
    value: "AMPAS",
  },
  {
    text: "ANTLR Software Rights Notice",
    value: "ANTLR-PD",
  },
  {
    text: "ANTLR Software Rights Notice with license fallback",
    value: "ANTLR-PD-fallback",
  },
  {
    text: "Adobe Postscript AFM License",
    value: "APAFML",
  },
  {
    text: "Adaptive Public License 1.0",
    value: "APL-1.0",
  },
  {
    text: "Apple Public Source License 1.0",
    value: "APSL-1.0",
  },
  {
    text: "Apple Public Source License 1.1",
    value: "APSL-1.1",
  },
  {
    text: "Apple Public Source License 1.2",
    value: "APSL-1.2",
  },
  {
    text: "Apple Public Source License 2.0",
    value: "APSL-2.0",
  },
  {
    text: "Abstyles License",
    value: "Abstyles",
  },
  {
    text: "Adobe Systems Incorporated Source Code License Agreement",
    value: "Adobe-2006",
  },
  {
    text: "Adobe Glyph List License",
    value: "Adobe-Glyph",
  },
  {
    text: "Afmparse License",
    value: "Afmparse",
  },
  {
    text: "Aladdin Free Public License",
    value: "Aladdin",
  },
  {
    text: "Apache License 1.0",
    value: "Apache-1.0",
  },
  {
    text: "Apache License 1.1",
    value: "Apache-1.1",
  },
  {
    text: "Apache License 2.0",
    value: "Apache-2.0",
  },
  {
    text: "App::s2p License",
    value: "App-s2p",
  },
  {
    text: "Arphic Public License",
    value: "Arphic-1999",
  },
  {
    text: "Artistic License 1.0",
    value: "Artistic-1.0",
  },
  {
    text: "Artistic License 1.0 (Perl)",
    value: "Artistic-1.0-Perl",
  },
  {
    text: "Artistic License 1.0 w/clause 8",
    value: "Artistic-1.0-cl8",
  },
  {
    text: "Artistic License 2.0",
    value: "Artistic-2.0",
  },
  {
    text: "BSD 1-Clause License",
    value: "BSD-1-Clause",
  },
  {
    text: "BSD 2-Clause \"Simplified\" License",
    value: "BSD-2-Clause",
  },
  {
    text: "BSD-2-Clause Plus Patent License",
    value: "BSD-2-Clause-Patent",
  },
  {
    text: "BSD 2-Clause with views sentence",
    value: "BSD-2-Clause-Views",
  },
  {
    text: "BSD 3-Clause \"New\" or \"Revised\" License",
    value: "BSD-3-Clause",
  },
  {
    text: "BSD with attribution",
    value: "BSD-3-Clause-Attribution",
  },
  {
    text: "BSD 3-Clause Clear License",
    value: "BSD-3-Clause-Clear",
  },
  {
    text: "Lawrence Berkeley National Labs BSD variant license",
    value: "BSD-3-Clause-LBNL",
  },
  {
    text: "BSD 3-Clause Modification",
    value: "BSD-3-Clause-Modification",
  },
  {
    text: "BSD 3-Clause No Military License",
    value: "BSD-3-Clause-No-Military-License",
  },
  {
    text: "BSD 3-Clause No Nuclear License",
    value: "BSD-3-Clause-No-Nuclear-License",
  },
  {
    text: "BSD 3-Clause No Nuclear License 2014",
    value: "BSD-3-Clause-No-Nuclear-License-2014",
  },
  {
    text: "BSD 3-Clause No Nuclear Warranty",
    value: "BSD-3-Clause-No-Nuclear-Warranty",
  },
  {
    text: "BSD 3-Clause Open MPI variant",
    value: "BSD-3-Clause-Open-MPI",
  },
  {
    text: "BSD 4-Clause \"Original\" or \"Old\" License",
    value: "BSD-4-Clause",
  },
  {
    text: "BSD 4 Clause Shortened",
    value: "BSD-4-Clause-Shortened",
  },
  {
    text: "BSD-4-Clause (University of California-Specific)",
    value: "BSD-4-Clause-UC",
  },
  {
    text: "BSD Protection License",
    value: "BSD-Protection",
  },
  {
    text: "BSD Source Code Attribution",
    value: "BSD-Source-Code",
  },
  {
    text: "Boost Software License 1.0",
    value: "BSL-1.0",
  },
  {
    text: "Business Source License 1.1",
    value: "BUSL-1.1",
  },
  {
    text: "Baekmuk License",
    value: "Baekmuk",
  },
  {
    text: "Bahyph License",
    value: "Bahyph",
  },
  {
    text: "Barr License",
    value: "Barr",
  },
  {
    text: "Beerware License",
    value: "Beerware",
  },
  {
    text: "BitTorrent Open Source License v1.0",
    value: "BitTorrent-1.0",
  },
  {
    text: "BitTorrent Open Source License v1.1",
    value: "BitTorrent-1.1",
  },
  {
    text: "Bitstream Vera Font License",
    value: "Bitstream-Vera",
  },
  {
    text: "Blue Oak Model License 1.0.0",
    value: "BlueOak-1.0.0",
  },
  {
    text: "Borceux license",
    value: "Borceux",
  },
  {
    text: "Computational Use of Data Agreement v1.0",
    value: "C-UDA-1.0",
  },
  {
    text: "Cryptographic Autonomy License 1.0",
    value: "CAL-1.0",
  },
  {
    text: "Cryptographic Autonomy License 1.0 (Combined Work Exception)",
    value: "CAL-1.0-Combined-Work-Exception",
  },
  {
    text: "Computer Associates Trusted Open Source License 1.1",
    value: "CATOSL-1.1",
  },
  {
    text: "Creative Commons Attribution 1.0 Generic",
    value: "CC-BY-1.0",
  },
  {
    text: "Creative Commons Attribution 2.0 Generic",
    value: "CC-BY-2.0",
  },
  {
    text: "Creative Commons Attribution 2.5 Generic",
    value: "CC-BY-2.5",
  },
  {
    text: "Creative Commons Attribution 2.5 Australia",
    value: "CC-BY-2.5-AU",
  },
  {
    text: "Creative Commons Attribution 3.0 Unported",
    value: "CC-BY-3.0",
  },
  {
    text: "Creative Commons Attribution 3.0 Austria",
    value: "CC-BY-3.0-AT",
  },
  {
    text: "Creative Commons Attribution 3.0 Germany",
    value: "CC-BY-3.0-DE",
  },
  {
    text: "Creative Commons Attribution 3.0 IGO",
    value: "CC-BY-3.0-IGO",
  },
  {
    text: "Creative Commons Attribution 3.0 Netherlands",
    value: "CC-BY-3.0-NL",
  },
  {
    text: "Creative Commons Attribution 3.0 United States",
    value: "CC-BY-3.0-US",
  },
  {
    text: "Creative Commons Attribution 4.0 International",
    value: "CC-BY-4.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial 1.0 Generic",
    value: "CC-BY-NC-1.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial 2.0 Generic",
    value: "CC-BY-NC-2.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial 2.5 Generic",
    value: "CC-BY-NC-2.5",
  },
  {
    text: "Creative Commons Attribution Non Commercial 3.0 Unported",
    value: "CC-BY-NC-3.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial 3.0 Germany",
    value: "CC-BY-NC-3.0-DE",
  },
  {
    text: "Creative Commons Attribution Non Commercial 4.0 International",
    value: "CC-BY-NC-4.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial No Derivatives 1.0 Generic",
    value: "CC-BY-NC-ND-1.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial No Derivatives 2.0 Generic",
    value: "CC-BY-NC-ND-2.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial No Derivatives 2.5 Generic",
    value: "CC-BY-NC-ND-2.5",
  },
  {
    text: "Creative Commons Attribution Non Commercial No Derivatives 3.0 Unported",
    value: "CC-BY-NC-ND-3.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial No Derivatives 3.0 Germany",
    value: "CC-BY-NC-ND-3.0-DE",
  },
  {
    text: "Creative Commons Attribution Non Commercial No Derivatives 3.0 IGO",
    value: "CC-BY-NC-ND-3.0-IGO",
  },
  {
    text: "Creative Commons Attribution Non Commercial No Derivatives 4.0 International",
    value: "CC-BY-NC-ND-4.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial Share Alike 1.0 Generic",
    value: "CC-BY-NC-SA-1.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial Share Alike 2.0 Generic",
    value: "CC-BY-NC-SA-2.0",
  },
  {
    text: "Creative Commons Attribution-NonCommercial-ShareAlike 2.0 France",
    value: "CC-BY-NC-SA-2.0-FR",
  },
  {
    text: "Creative Commons Attribution Non Commercial Share Alike 2.0 England and Wales",
    value: "CC-BY-NC-SA-2.0-UK",
  },
  {
    text: "Creative Commons Attribution Non Commercial Share Alike 2.5 Generic",
    value: "CC-BY-NC-SA-2.5",
  },
  {
    text: "Creative Commons Attribution Non Commercial Share Alike 3.0 Unported",
    value: "CC-BY-NC-SA-3.0",
  },
  {
    text: "Creative Commons Attribution Non Commercial Share Alike 3.0 Germany",
    value: "CC-BY-NC-SA-3.0-DE",
  },
  {
    text: "Creative Commons Attribution Non Commercial Share Alike 3.0 IGO",
    value: "CC-BY-NC-SA-3.0-IGO",
  },
  {
    text: "Creative Commons Attribution Non Commercial Share Alike 4.0 International",
    value: "CC-BY-NC-SA-4.0",
  },
  {
    text: "Creative Commons Attribution No Derivatives 1.0 Generic",
    value: "CC-BY-ND-1.0",
  },
  {
    text: "Creative Commons Attribution No Derivatives 2.0 Generic",
    value: "CC-BY-ND-2.0",
  },
  {
    text: "Creative Commons Attribution No Derivatives 2.5 Generic",
    value: "CC-BY-ND-2.5",
  },
  {
    text: "Creative Commons Attribution No Derivatives 3.0 Unported",
    value: "CC-BY-ND-3.0",
  },
  {
    text: "Creative Commons Attribution No Derivatives 3.0 Germany",
    value: "CC-BY-ND-3.0-DE",
  },
  {
    text: "Creative Commons Attribution No Derivatives 4.0 International",
    value: "CC-BY-ND-4.0",
  },
  {
    text: "Creative Commons Attribution Share Alike 1.0 Generic",
    value: "CC-BY-SA-1.0",
  },
  {
    text: "Creative Commons Attribution Share Alike 2.0 Generic",
    value: "CC-BY-SA-2.0",
  },
  {
    text: "Creative Commons Attribution Share Alike 2.0 England and Wales",
    value: "CC-BY-SA-2.0-UK",
  },
  {
    text: "Creative Commons Attribution Share Alike 2.1 Japan",
    value: "CC-BY-SA-2.1-JP",
  },
  {
    text: "Creative Commons Attribution Share Alike 2.5 Generic",
    value: "CC-BY-SA-2.5",
  },
  {
    text: "Creative Commons Attribution Share Alike 3.0 Unported",
    value: "CC-BY-SA-3.0",
  },
  {
    text: "Creative Commons Attribution Share Alike 3.0 Austria",
    value: "CC-BY-SA-3.0-AT",
  },
  {
    text: "Creative Commons Attribution Share Alike 3.0 Germany",
    value: "CC-BY-SA-3.0-DE",
  },
  {
    text: "Creative Commons Attribution Share Alike 4.0 International",
    value: "CC-BY-SA-4.0",
  },
  {
    text: "Creative Commons Public Domain Dedication and Certification",
    value: "CC-PDDC",
  },
  {
    text: "Creative Commons Zero v1.0 Universal",
    value: "CC0-1.0",
  },
  {
    text: "Common Development and Distribution License 1.0",
    value: "CDDL-1.0",
  },
  {
    text: "Common Development and Distribution License 1.1",
    value: "CDDL-1.1",
  },
  {
    text: "Common Documentation License 1.0",
    value: "CDL-1.0",
  },
  {
    text: "Community Data License Agreement Permissive 1.0",
    value: "CDLA-Permissive-1.0",
  },
  {
    text: "Community Data License Agreement Permissive 2.0",
    value: "CDLA-Permissive-2.0",
  },
  {
    text: "Community Data License Agreement Sharing 1.0",
    value: "CDLA-Sharing-1.0",
  },
  {
    text: "CeCILL Free Software License Agreement v1.0",
    value: "CECILL-1.0",
  },
  {
    text: "CeCILL Free Software License Agreement v1.1",
    value: "CECILL-1.1",
  },
  {
    text: "CeCILL Free Software License Agreement v2.0",
    value: "CECILL-2.0",
  },
  {
    text: "CeCILL Free Software License Agreement v2.1",
    value: "CECILL-2.1",
  },
  {
    text: "CeCILL-B Free Software License Agreement",
    value: "CECILL-B",
  },
  {
    text: "CeCILL-C Free Software License Agreement",
    value: "CECILL-C",
  },
  {
    text: "CERN Open Hardware Licence v1.1",
    value: "CERN-OHL-1.1",
  },
  {
    text: "CERN Open Hardware Licence v1.2",
    value: "CERN-OHL-1.2",
  },
  {
    text: "CERN Open Hardware Licence Version 2 - Permissive",
    value: "CERN-OHL-P-2.0",
  },
  {
    text: "CERN Open Hardware Licence Version 2 - Strongly Reciprocal",
    value: "CERN-OHL-S-2.0",
  },
  {
    text: "CERN Open Hardware Licence Version 2 - Weakly Reciprocal",
    value: "CERN-OHL-W-2.0",
  },
  {
    text: "CNRI Jython License",
    value: "CNRI-Jython",
  },
  {
    text: "CNRI Python License",
    value: "CNRI-Python",
  },
  {
    text: "CNRI Python Open Source GPL Compatible License Agreement",
    value: "CNRI-Python-GPL-Compatible",
  },
  {
    text: "Copyfree Open Innovation License",
    value: "COIL-1.0",
  },
  {
    text: "Common Public Attribution License 1.0",
    value: "CPAL-1.0",
  },
  {
    text: "Common Public License 1.0",
    value: "CPL-1.0",
  },
  {
    text: "Code Project Open License 1.02",
    value: "CPOL-1.02",
  },
  {
    text: "CUA Office Public License v1.0",
    value: "CUA-OPL-1.0",
  },
  {
    text: "Caldera License",
    value: "Caldera",
  },
  {
    text: "Clarified Artistic License",
    value: "ClArtistic",
  },
  {
    text: "Community Specification License 1.0",
    value: "Community-Spec-1.0",
  },
  {
    text: "Condor Public License v1.1",
    value: "Condor-1.1",
  },
  {
    text: "Crossword License",
    value: "Crossword",
  },
  {
    text: "CrystalStacker License",
    value: "CrystalStacker",
  },
  {
    text: "Cube License",
    value: "Cube",
  },
  {
    text: "Deutsche Freie Software Lizenz",
    value: "D-FSL-1.0",
  },
  {
    text: "Data licence Germany – attribution – version 2.0",
    value: "DL-DE-BY-2.0",
  },
  {
    text: "DOC License",
    value: "DOC",
  },
  {
    text: "Detection Rule License 1.0",
    value: "DRL-1.0",
  },
  {
    text: "DSDP License",
    value: "DSDP",
  },
  {
    text: "Dotseqn License",
    value: "Dotseqn",
  },
  {
    text: "Educational Community License v1.0",
    value: "ECL-1.0",
  },
  {
    text: "Educational Community License v2.0",
    value: "ECL-2.0",
  },
  {
    text: "Eiffel Forum License v1.0",
    value: "EFL-1.0",
  },
  {
    text: "Eiffel Forum License v2.0",
    value: "EFL-2.0",
  },
  {
    text: "EPICS Open License",
    value: "EPICS",
  },
  {
    text: "Eclipse Public License 1.0",
    value: "EPL-1.0",
  },
  {
    text: "Eclipse Public License 2.0",
    value: "EPL-2.0",
  },
  {
    text: "EU DataGrid Software License",
    value: "EUDatagrid",
  },
  {
    text: "European Union Public License 1.0",
    value: "EUPL-1.0",
  },
  {
    text: "European Union Public License 1.1",
    value: "EUPL-1.1",
  },
  {
    text: "European Union Public License 1.2",
    value: "EUPL-1.2",
  },
  {
    text: "Elastic License 2.0",
    value: "Elastic-2.0",
  },
  {
    text: "Entessa Public License v1.0",
    value: "Entessa",
  },
  {
    text: "Erlang Public License v1.1",
    value: "ErlPL-1.1",
  },
  {
    text: "Eurosym License",
    value: "Eurosym",
  },
  {
    text: "Fraunhofer FDK AAC Codec Library",
    value: "FDK-AAC",
  },
  {
    text: "FSF All Permissive License",
    value: "FSFAP",
  },
  {
    text: "FSF Unlimited License",
    value: "FSFUL",
  },
  {
    text: "FSF Unlimited License (with License Retention)",
    value: "FSFULLR",
  },
  {
    text: "Freetype Project License",
    value: "FTL",
  },
  {
    text: "Fair License",
    value: "Fair",
  },
  {
    text: "Frameworx Open License 1.0",
    value: "Frameworx-1.0",
  },
  {
    text: "FreeBSD Documentation License",
    value: "FreeBSD-DOC",
  },
  {
    text: "FreeImage Public License v1.0",
    value: "FreeImage",
  },
  {
    text: "GD License",
    value: "GD",
  },
  {
    text: "GNU Free Documentation License v1.1 only - invariants",
    value: "GFDL-1.1-invariants-only",
  },
  {
    text: "GNU Free Documentation License v1.1 or later - invariants",
    value: "GFDL-1.1-invariants-or-later",
  },
  {
    text: "GNU Free Documentation License v1.1 only - no invariants",
    value: "GFDL-1.1-no-invariants-only",
  },
  {
    text: "GNU Free Documentation License v1.1 or later - no invariants",
    value: "GFDL-1.1-no-invariants-or-later",
  },
  {
    text: "GNU Free Documentation License v1.1 only",
    value: "GFDL-1.1-only",
  },
  {
    text: "GNU Free Documentation License v1.1 or later",
    value: "GFDL-1.1-or-later",
  },
  {
    text: "GNU Free Documentation License v1.2 only - invariants",
    value: "GFDL-1.2-invariants-only",
  },
  {
    text: "GNU Free Documentation License v1.2 or later - invariants",
    value: "GFDL-1.2-invariants-or-later",
  },
  {
    text: "GNU Free Documentation License v1.2 only - no invariants",
    value: "GFDL-1.2-no-invariants-only",
  },
  {
    text: "GNU Free Documentation License v1.2 or later - no invariants",
    value: "GFDL-1.2-no-invariants-or-later",
  },
  {
    text: "GNU Free Documentation License v1.2 only",
    value: "GFDL-1.2-only",
  },
  {
    text: "GNU Free Documentation License v1.2 or later",
    value: "GFDL-1.2-or-later",
  },
  {
    text: "GNU Free Documentation License v1.3 only - invariants",
    value: "GFDL-1.3-invariants-only",
  },
  {
    text: "GNU Free Documentation License v1.3 or later - invariants",
    value: "GFDL-1.3-invariants-or-later",
  },
  {
    text: "GNU Free Documentation License v1.3 only - no invariants",
    value: "GFDL-1.3-no-invariants-only",
  },
  {
    text: "GNU Free Documentation License v1.3 or later - no invariants",
    value: "GFDL-1.3-no-invariants-or-later",
  },
  {
    text: "GNU Free Documentation License v1.3 only",
    value: "GFDL-1.3-only",
  },
  {
    text: "GNU Free Documentation License v1.3 or later",
    value: "GFDL-1.3-or-later",
  },
  {
    text: "GL2PS License",
    value: "GL2PS",
  },
  {
    text: "Good Luck With That Public License",
    value: "GLWTPL",
  },
  {
    text: "GNU General Public License v1.0 only",
    value: "GPL-1.0-only",
  },
  {
    text: "GNU General Public License v1.0 or later",
    value: "GPL-1.0-or-later",
  },
  {
    text: "GNU General Public License v2.0 only",
    value: "GPL-2.0-only",
  },
  {
    text: "GNU General Public License v2.0 or later",
    value: "GPL-2.0-or-later",
  },
  {
    text: "GNU General Public License v3.0 only",
    value: "GPL-3.0-only",
  },
  {
    text: "GNU General Public License v3.0 or later",
    value: "GPL-3.0-or-later",
  },
  {
    text: "Giftware License",
    value: "Giftware",
  },
  {
    text: "3dfx Glide License",
    value: "Glide",
  },
  {
    text: "Glulxe License",
    value: "Glulxe",
  },
  {
    text: "Historical Permission Notice and Disclaimer",
    value: "HPND",
  },
  {
    text: "Historical Permission Notice and Disclaimer - sell variant",
    value: "HPND-sell-variant",
  },
  {
    text: "HTML Tidy License",
    value: "HTMLTIDY",
  },
  {
    text: "Haskell Language Report License",
    value: "HaskellReport",
  },
  {
    text: "Hippocratic License 2.1",
    value: "Hippocratic-2.1",
  },
  {
    text: "IBM PowerPC Initialization and Boot Software",
    value: "IBM-pibs",
  },
  {
    text: "ICU License",
    value: "ICU",
  },
  {
    text: "Independent JPEG Group License",
    value: "IJG",
  },
  {
    text: "IPA Font License",
    value: "IPA",
  },
  {
    text: "IBM Public License v1.0",
    value: "IPL-1.0",
  },
  {
    text: "ISC License",
    value: "ISC",
  },
  {
    text: "ImageMagick License",
    value: "ImageMagick",
  },
  {
    text: "Imlib2 License",
    value: "Imlib2",
  },
  {
    text: "Info-ZIP License",
    value: "Info-ZIP",
  },
  {
    text: "Intel Open Source License",
    value: "Intel",
  },
  {
    text: "Intel ACPI Software License Agreement",
    value: "Intel-ACPI",
  },
  {
    text: "Interbase Public License v1.0",
    value: "Interbase-1.0",
  },
  {
    text: "Japan Network Information Center License",
    value: "JPNIC",
  },
  {
    text: "JSON License",
    value: "JSON",
  },
  {
    text: "Jam License",
    value: "Jam",
  },
  {
    text: "JasPer License",
    value: "JasPer-2.0",
  },
  {
    text: "Licence Art Libre 1.2",
    value: "LAL-1.2",
  },
  {
    text: "Licence Art Libre 1.3",
    value: "LAL-1.3",
  },
  {
    text: "GNU Library General Public License v2 only",
    value: "LGPL-2.0-only",
  },
  {
    text: "GNU Library General Public License v2 or later",
    value: "LGPL-2.0-or-later",
  },
  {
    text: "GNU Lesser General Public License v2.1 only",
    value: "LGPL-2.1-only",
  },
  {
    text: "GNU Lesser General Public License v2.1 or later",
    value: "LGPL-2.1-or-later",
  },
  {
    text: "GNU Lesser General Public License v3.0 only",
    value: "LGPL-3.0-only",
  },
  {
    text: "GNU Lesser General Public License v3.0 or later",
    value: "LGPL-3.0-or-later",
  },
  {
    text: "Lesser General Public License For Linguistic Resources",
    value: "LGPLLR",
  },
  {
    text: "Lucent Public License Version 1.0",
    value: "LPL-1.0",
  },
  {
    text: "Lucent Public License v1.02",
    value: "LPL-1.02",
  },
  {
    text: "LaTeX Project Public License v1.0",
    value: "LPPL-1.0",
  },
  {
    text: "LaTeX Project Public License v1.1",
    value: "LPPL-1.1",
  },
  {
    text: "LaTeX Project Public License v1.2",
    value: "LPPL-1.2",
  },
  {
    text: "LaTeX Project Public License v1.3a",
    value: "LPPL-1.3a",
  },
  {
    text: "LaTeX Project Public License v1.3c",
    value: "LPPL-1.3c",
  },
  {
    text: "LZMA SDK License (versions 9.11 to 9.20)",
    value: "LZMA-SDK-9.11-to-9.20",
  },
  {
    text: "LZMA SDK License (versions 9.22 and beyond)",
    value: "LZMA-SDK-9.22",
  },
  {
    text: "Latex2e License",
    value: "Latex2e",
  },
  {
    text: "Leptonica License",
    value: "Leptonica",
  },
  {
    text: "Licence Libre du Québec – Permissive version 1.1",
    value: "LiLiQ-P-1.1",
  },
  {
    text: "Licence Libre du Québec – Réciprocité version 1.1",
    value: "LiLiQ-R-1.1",
  },
  {
    text: "Licence Libre du Québec – Réciprocité forte version 1.1",
    value: "LiLiQ-Rplus-1.1",
  },
  {
    text: "libpng License",
    value: "Libpng",
  },
  {
    text: "Linux Kernel Variant of OpenIB.org license",
    value: "Linux-OpenIB",
  },
  {
    text: "Linux man-pages Copyleft",
    value: "Linux-man-pages-copyleft",
  },
  {
    text: "MIT License",
    value: "MIT",
  },
  {
    text: "MIT No Attribution",
    value: "MIT-0",
  },
  {
    text: "CMU License",
    value: "MIT-CMU",
  },
  {
    text: "MIT License Modern Variant",
    value: "MIT-Modern-Variant",
  },
  {
    text: "Enlightenment License (e16)",
    value: "MIT-advertising",
  },
  {
    text: "enna License",
    value: "MIT-enna",
  },
  {
    text: "feh License",
    value: "MIT-feh",
  },
  {
    text: "MIT Open Group variant",
    value: "MIT-open-group",
  },
  {
    text: "MIT +no-false-attribs license",
    value: "MITNFA",
  },
  {
    text: "Mozilla Public License 1.0",
    value: "MPL-1.0",
  },
  {
    text: "Mozilla Public License 1.1",
    value: "MPL-1.1",
  },
  {
    text: "Mozilla Public License 2.0",
    value: "MPL-2.0",
  },
  {
    text: "Mozilla Public License 2.0 (no copyleft exception)",
    value: "MPL-2.0-no-copyleft-exception",
  },
  {
    text: "Microsoft Limited Public License",
    value: "MS-LPL",
  },
  {
    text: "Microsoft Public License",
    value: "MS-PL",
  },
  {
    text: "Microsoft Reciprocal License",
    value: "MS-RL",
  },
  {
    text: "Matrix Template Library License",
    value: "MTLL",
  },
  {
    text: "MakeIndex License",
    value: "MakeIndex",
  },
  {
    text: "Minpack License",
    value: "Minpack",
  },
  {
    text: "The MirOS Licence",
    value: "MirOS",
  },
  {
    text: "Motosoto License",
    value: "Motosoto",
  },
  {
    text: "Mulan Permissive Software License, Version 1",
    value: "MulanPSL-1.0",
  },
  {
    text: "Mulan Permissive Software License, Version 2",
    value: "MulanPSL-2.0",
  },
  {
    text: "Multics License",
    value: "Multics",
  },
  {
    text: "Mup License",
    value: "Mup",
  },
  {
    text: "Nara Institute of Science and Technology License (2003)",
    value: "NAIST-2003",
  },
  {
    text: "NASA Open Source Agreement 1.3",
    value: "NASA-1.3",
  },
  {
    text: "Net Boolean Public License v1",
    value: "NBPL-1.0",
  },
  {
    text: "Non-Commercial Government Licence",
    value: "NCGL-UK-2.0",
  },
  {
    text: "University of Illinois/NCSA Open Source License",
    value: "NCSA",
  },
  {
    text: "Nethack General Public License",
    value: "NGPL",
  },
  {
    text: "NICTA Public Software License, Version 1.0",
    value: "NICTA-1.0",
  },
  {
    text: "NIST Public Domain Notice",
    value: "NIST-PD",
  },
  {
    text: "NIST Public Domain Notice with license fallback",
    value: "NIST-PD-fallback",
  },
  {
    text: "Norwegian Licence for Open Government Data (NLOD) 1.0",
    value: "NLOD-1.0",
  },
  {
    text: "Norwegian Licence for Open Government Data (NLOD) 2.0",
    value: "NLOD-2.0",
  },
  {
    text: "No Limit Public License",
    value: "NLPL",
  },
  {
    text: "Netizen Open Source License",
    value: "NOSL",
  },
  {
    text: "Netscape Public License v1.0",
    value: "NPL-1.0",
  },
  {
    text: "Netscape Public License v1.1",
    value: "NPL-1.1",
  },
  {
    text: "Non-Profit Open Software License 3.0",
    value: "NPOSL-3.0",
  },
  {
    text: "NRL License",
    value: "NRL",
  },
  {
    text: "NTP License",
    value: "NTP",
  },
  {
    text: "NTP No Attribution",
    value: "NTP-0",
  },
  {
    text: "Naumen Public License",
    value: "Naumen",
  },
  {
    text: "Net-SNMP License",
    value: "Net-SNMP",
  },
  {
    text: "NetCDF license",
    value: "NetCDF",
  },
  {
    text: "Newsletr License",
    value: "Newsletr",
  },
  {
    text: "Nokia Open Source License",
    value: "Nokia",
  },
  {
    text: "Noweb License",
    value: "Noweb",
  },
  {
    text: "Open Use of Data Agreement v1.0",
    value: "O-UDA-1.0",
  },
  {
    text: "Open CASCADE Technology Public License",
    value: "OCCT-PL",
  },
  {
    text: "OCLC Research Public License 2.0",
    value: "OCLC-2.0",
  },
  {
    text: "Open Data Commons Attribution License v1.0",
    value: "ODC-By-1.0",
  },
  {
    text: "Open Data Commons Open Database License v1.0",
    value: "ODbL-1.0",
  },
  {
    text: "SIL Open Font License 1.0",
    value: "OFL-1.0",
  },
  {
    text: "SIL Open Font License 1.0 with Reserved Font Name",
    value: "OFL-1.0-RFN",
  },
  {
    text: "SIL Open Font License 1.0 with no Reserved Font Name",
    value: "OFL-1.0-no-RFN",
  },
  {
    text: "SIL Open Font License 1.1",
    value: "OFL-1.1",
  },
  {
    text: "SIL Open Font License 1.1 with Reserved Font Name",
    value: "OFL-1.1-RFN",
  },
  {
    text: "SIL Open Font License 1.1 with no Reserved Font Name",
    value: "OFL-1.1-no-RFN",
  },
  {
    text: "OGC Software License, Version 1.0",
    value: "OGC-1.0",
  },
  {
    text: "Taiwan Open Government Data License, version 1.0",
    value: "OGDL-Taiwan-1.0",
  },
  {
    text: "Open Government Licence - Canada",
    value: "OGL-Canada-2.0",
  },
  {
    text: "Open Government Licence v1.0",
    value: "OGL-UK-1.0",
  },
  {
    text: "Open Government Licence v2.0",
    value: "OGL-UK-2.0",
  },
  {
    text: "Open Government Licence v3.0",
    value: "OGL-UK-3.0",
  },
  {
    text: "Open Group Test Suite License",
    value: "OGTSL",
  },
  {
    text: "Open LDAP Public License v1.1",
    value: "OLDAP-1.1",
  },
  {
    text: "Open LDAP Public License v1.2",
    value: "OLDAP-1.2",
  },
  {
    text: "Open LDAP Public License v1.3",
    value: "OLDAP-1.3",
  },
  {
    text: "Open LDAP Public License v1.4",
    value: "OLDAP-1.4",
  },
  {
    text: "Open LDAP Public License v2.0 (or possibly 2.0A and 2.0B)",
    value: "OLDAP-2.0",
  },
  {
    text: "Open LDAP Public License v2.0.1",
    value: "OLDAP-2.0.1",
  },
  {
    text: "Open LDAP Public License v2.1",
    value: "OLDAP-2.1",
  },
  {
    text: "Open LDAP Public License v2.2",
    value: "OLDAP-2.2",
  },
  {
    text: "Open LDAP Public License v2.2.1",
    value: "OLDAP-2.2.1",
  },
  {
    text: "Open LDAP Public License 2.2.2",
    value: "OLDAP-2.2.2",
  },
  {
    text: "Open LDAP Public License v2.3",
    value: "OLDAP-2.3",
  },
  {
    text: "Open LDAP Public License v2.4",
    value: "OLDAP-2.4",
  },
  {
    text: "Open LDAP Public License v2.5",
    value: "OLDAP-2.5",
  },
  {
    text: "Open LDAP Public License v2.6",
    value: "OLDAP-2.6",
  },
  {
    text: "Open LDAP Public License v2.7",
    value: "OLDAP-2.7",
  },
  {
    text: "Open LDAP Public License v2.8",
    value: "OLDAP-2.8",
  },
  {
    text: "Open Market License",
    value: "OML",
  },
  {
    text: "Open Public License v1.0",
    value: "OPL-1.0",
  },
  {
    text: "Open Publication License v1.0",
    value: "OPUBL-1.0",
  },
  {
    text: "OSET Public License version 2.1",
    value: "OSET-PL-2.1",
  },
  {
    text: "Open Software License 1.0",
    value: "OSL-1.0",
  },
  {
    text: "Open Software License 1.1",
    value: "OSL-1.1",
  },
  {
    text: "Open Software License 2.0",
    value: "OSL-2.0",
  },
  {
    text: "Open Software License 2.1",
    value: "OSL-2.1",
  },
  {
    text: "Open Software License 3.0",
    value: "OSL-3.0",
  },
  {
    text: "OpenSSL License",
    value: "OpenSSL",
  },
  {
    text: "Open Data Commons Public Domain Dedication & License 1.0",
    value: "PDDL-1.0",
  },
  {
    text: "PHP License v3.0",
    value: "PHP-3.0",
  },
  {
    text: "PHP License v3.01",
    value: "PHP-3.01",
  },
  {
    text: "Python Software Foundation License 2.0",
    value: "PSF-2.0",
  },
  {
    text: "The Parity Public License 6.0.0",
    value: "Parity-6.0.0",
  },
  {
    text: "The Parity Public License 7.0.0",
    value: "Parity-7.0.0",
  },
  {
    text: "Plexus Classworlds License",
    value: "Plexus",
  },
  {
    text: "PolyForm Noncommercial License 1.0.0",
    value: "PolyForm-Noncommercial-1.0.0",
  },
  {
    text: "PolyForm Small Business License 1.0.0",
    value: "PolyForm-Small-Business-1.0.0",
  },
  {
    text: "PostgreSQL License",
    value: "PostgreSQL",
  },
  {
    text: "Python License 2.0",
    value: "Python-2.0",
  },
  {
    text: "Python License 2.0.1",
    value: "Python-2.0.1",
  },
  {
    text: "Q Public License 1.0",
    value: "QPL-1.0",
  },
  {
    text: "Qhull License",
    value: "Qhull",
  },
  {
    text: "Red Hat eCos Public License v1.1",
    value: "RHeCos-1.1",
  },
  {
    text: "Reciprocal Public License 1.1",
    value: "RPL-1.1",
  },
  {
    text: "Reciprocal Public License 1.5",
    value: "RPL-1.5",
  },
  {
    text: "RealNetworks Public Source License v1.0",
    value: "RPSL-1.0",
  },
  {
    text: "RSA Message-Digest License",
    value: "RSA-MD",
  },
  {
    text: "Ricoh Source Code Public License",
    value: "RSCPL",
  },
  {
    text: "Rdisc License",
    value: "Rdisc",
  },
  {
    text: "Ruby License",
    value: "Ruby",
  },
  {
    text: "Sax Public Domain Notice",
    value: "SAX-PD",
  },
  {
    text: "SCEA Shared Source License",
    value: "SCEA",
  },
  {
    text: "SGI Free Software License B v1.0",
    value: "SGI-B-1.0",
  },
  {
    text: "SGI Free Software License B v1.1",
    value: "SGI-B-1.1",
  },
  {
    text: "SGI Free Software License B v2.0",
    value: "SGI-B-2.0",
  },
  {
    text: "Solderpad Hardware License v0.5",
    value: "SHL-0.5",
  },
  {
    text: "Solderpad Hardware License, Version 0.51",
    value: "SHL-0.51",
  },
  {
    text: "Sun Industry Standards Source License v1.1",
    value: "SISSL",
  },
  {
    text: "Sun Industry Standards Source License v1.2",
    value: "SISSL-1.2",
  },
  {
    text: "Standard ML of New Jersey License",
    value: "SMLNJ",
  },
  {
    text: "Secure Messaging Protocol Public License",
    value: "SMPPL",
  },
  {
    text: "SNIA Public License 1.1",
    value: "SNIA",
  },
  {
    text: "Sun Public License v1.0",
    value: "SPL-1.0",
  },
  {
    text: "SSH OpenSSH license",
    value: "SSH-OpenSSH",
  },
  {
    text: "SSH short notice",
    value: "SSH-short",
  },
  {
    text: "Server Side Public License, v 1",
    value: "SSPL-1.0",
  },
  {
    text: "Scheme Widget Library (SWL) Software License Agreement",
    value: "SWL",
  },
  {
    text: "Saxpath License",
    value: "Saxpath",
  },
  {
    text: "Scheme Language Report License",
    value: "SchemeReport",
  },
  {
    text: "Sendmail License",
    value: "Sendmail",
  },
  {
    text: "Sendmail License 8.23",
    value: "Sendmail-8.23",
  },
  {
    text: "Simple Public License 2.0",
    value: "SimPL-2.0",
  },
  {
    text: "Sleepycat License",
    value: "Sleepycat",
  },
  {
    text: "Spencer License 86",
    value: "Spencer-86",
  },
  {
    text: "Spencer License 94",
    value: "Spencer-94",
  },
  {
    text: "Spencer License 99",
    value: "Spencer-99",
  },
  {
    text: "SugarCRM Public License v1.1.3",
    value: "SugarCRM-1.1.3",
  },
  {
    text: "TAPR Open Hardware License v1.0",
    value: "TAPR-OHL-1.0",
  },
  {
    text: "TCL/TK License",
    value: "TCL",
  },
  {
    text: "TCP Wrappers License",
    value: "TCP-wrappers",
  },
  {
    text: "TMate Open Source License",
    value: "TMate",
  },
  {
    text: "TORQUE v2.5+ Software License v1.1",
    value: "TORQUE-1.1",
  },
  {
    text: "Trusster Open Source License",
    value: "TOSL",
  },
  {
    text: "Technische Universitaet Berlin License 1.0",
    value: "TU-Berlin-1.0",
  },
  {
    text: "Technische Universitaet Berlin License 2.0",
    value: "TU-Berlin-2.0",
  },
  {
    text: "Upstream Compatibility License v1.0",
    value: "UCL-1.0",
  },
  {
    text: "Universal Permissive License v1.0",
    value: "UPL-1.0",
  },
  {
    text: "Unicode License Agreement - Data Files and Software (2015)",
    value: "Unicode-DFS-2015",
  },
  {
    text: "Unicode License Agreement - Data Files and Software (2016)",
    value: "Unicode-DFS-2016",
  },
  {
    text: "Unicode Terms of Use",
    value: "Unicode-TOU",
  },
  {
    text: "The Unlicense",
    value: "Unlicense",
  },
  {
    text: "VOSTROM Public License for Open Source",
    value: "VOSTROM",
  },
  {
    text: "Vovida Software License v1.0",
    value: "VSL-1.0",
  },
  {
    text: "Vim License",
    value: "Vim",
  },
  {
    text: "W3C Software Notice and License (2002-12-31)",
    value: "W3C",
  },
  {
    text: "W3C Software Notice and License (1998-07-20)",
    value: "W3C-19980720",
  },
  {
    text: "W3C Software Notice and Document License (2015-05-13)",
    value: "W3C-20150513",
  },
  {
    text: "Do What The F*ck You Want To Public License",
    value: "WTFPL",
  },
  {
    text: "Sybase Open Watcom Public License 1.0",
    value: "Watcom-1.0",
  },
  {
    text: "Wsuipa License",
    value: "Wsuipa",
  },
  {
    text: "X11 License",
    value: "X11",
  },
  {
    text: "X11 License Distribution Modification Variant",
    value: "X11-distribute-modifications-variant",
  },
  {
    text: "XFree86 License 1.1",
    value: "XFree86-1.1",
  },
  {
    text: "XSkat License",
    value: "XSkat",
  },
  {
    text: "Xerox License",
    value: "Xerox",
  },
  {
    text: "X.Net License",
    value: "Xnet",
  },
  {
    text: "Yahoo! Public License v1.0",
    value: "YPL-1.0",
  },
  {
    text: "Yahoo! Public License v1.1",
    value: "YPL-1.1",
  },
  {
    text: "Zope Public License 1.1",
    value: "ZPL-1.1",
  },
  {
    text: "Zope Public License 2.0",
    value: "ZPL-2.0",
  },
  {
    text: "Zope Public License 2.1",
    value: "ZPL-2.1",
  },
  {
    text: "Zed License",
    value: "Zed",
  },
  {
    text: "Zend License v2.0",
    value: "Zend-2.0",
  },
  {
    text: "Zimbra Public License v1.3",
    value: "Zimbra-1.3",
  },
  {
    text: "Zimbra Public License v1.4",
    value: "Zimbra-1.4",
  },
  {
    text: "zlib License",
    value: "Zlib",
  },
  {
    text: "SQLite Blessing",
    value: "blessing",
  },
  {
    text: "bzip2 and libbzip2 License v1.0.6",
    value: "bzip2-1.0.6",
  },
  {
    text: "copyleft-next 0.3.0",
    value: "copyleft-next-0.3.0",
  },
  {
    text: "copyleft-next 0.3.1",
    value: "copyleft-next-0.3.1",
  },
  {
    text: "curl License",
    value: "curl",
  },
  {
    text: "diffmark license",
    value: "diffmark",
  },
  {
    text: "dvipdfm License",
    value: "dvipdfm",
  },
  {
    text: "eGenix.com Public License 1.1.0",
    value: "eGenix",
  },
  {
    text: "Etalab Open License 2.0",
    value: "etalab-2.0",
  },
  {
    text: "gSOAP Public License v1.3b",
    value: "gSOAP-1.3b",
  },
  {
    text: "gnuplot License",
    value: "gnuplot",
  },
  {
    text: "iMatix Standard Function Library Agreement",
    value: "iMatix",
  },
  {
    text: "PNG Reference Library version 2",
    value: "libpng-2.0",
  },
  {
    text: "libselinux public domain notice",
    value: "libselinux-1.0",
  },
  {
    text: "libtiff License",
    value: "libtiff",
  },
  {
    text: "mpi Permissive License",
    value: "mpi-permissive",
  },
  {
    text: "mpich2 License",
    value: "mpich2",
  },
  {
    text: "mplus Font License",
    value: "mplus",
  },
  {
    text: "psfrag License",
    value: "psfrag",
  },
  {
    text: "psutils License",
    value: "psutils",
  },
  {
    text: "xinetd License",
    value: "xinetd",
  },
  {
    text: "XPP License",
    value: "xpp",
  },
  {
    text: "zlib/libpng License with Acknowledgement",
    value: "zlib-acknowledgement",
  },
];

export default licenses;
