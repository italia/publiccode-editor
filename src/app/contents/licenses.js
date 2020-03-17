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
    text: "GNU Affero General Public License v3.0 only",
    value: "AGPL-3.0-only",
  },
  {
    text: "GNU Affero General Public License v3.0 or later",
    value: "AGPL-3.0-or-later",
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
    text: "Apache License 1.1",
    value: "Apache-1.1",
  },
  {
    text: "Apache License 2.0",
    value: "Apache-2.0",
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
    text: "BSD 2-Clause \"Simplified\" License",
    value: "BSD-2-Clause",
  },
  {
    text: "BSD-2-Clause Plus Patent License",
    value: "BSD-2-Clause-Patent",
  },
  {
    text: "BSD 3-Clause \"New\" or \"Revised\" License",
    value: "BSD-3-Clause",
  },
  {
    text: "Boost Software License 1.0",
    value: "BSL-1.0",
  },
  {
    text: "Computer Associates Trusted Open Source License 1.1",
    value: "CATOSL-1.1",
  },
  {
    text: "Common Development and Distribution License 1.0",
    value: "CDDL-1.0",
  },
  {
    text: "CeCILL Free Software License Agreement v2.1",
    value: "CECILL-2.1",
  },
  {
    text: "CNRI Python License",
    value: "CNRI-Python",
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
    text: "CUA Office Public License v1.0",
    value: "CUA-OPL-1.0",
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
    text: "European Union Public License 1.1",
    value: "EUPL-1.1",
  },
  {
    text: "European Union Public License 1.2",
    value: "EUPL-1.2",
  },
  {
    text: "Entessa Public License v1.0",
    value: "Entessa",
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
    text: "Historical Permission Notice and Disclaimer",
    value: "HPND",
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
    text: "Intel Open Source License",
    value: "Intel",
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
    text: "Lucent Public License Version 1.0",
    value: "LPL-1.0",
  },
  {
    text: "Lucent Public License v1.02",
    value: "LPL-1.02",
  },
  {
    text: "LaTeX Project Public License v1.3c",
    value: "LPPL-1.3c",
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
    text: "MIT License",
    value: "MIT",
  },
  {
    text: "MIT No Attribution",
    value: "MIT-0",
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
    text: "Microsoft Public License",
    value: "MS-PL",
  },
  {
    text: "Microsoft Reciprocal License",
    value: "MS-RL",
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
    text: "Multics License",
    value: "Multics",
  },
  {
    text: "NASA Open Source Agreement 1.3",
    value: "NASA-1.3",
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
    text: "Non-Profit Open Software License 3.0",
    value: "NPOSL-3.0",
  },
  {
    text: "NTP License",
    value: "NTP",
  },
  {
    text: "Naumen Public License",
    value: "Naumen",
  },
  {
    text: "Nokia Open Source License",
    value: "Nokia",
  },
  {
    text: "OCLC Research Public License 2.0",
    value: "OCLC-2.0",
  },
  {
    text: "SIL Open Font License 1.1",
    value: "OFL-1.1",
  },
  {
    text: "Open Group Test Suite License",
    value: "OGTSL",
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
    text: "PHP License v3.0",
    value: "PHP-3.0",
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
    text: "Q Public License 1.0",
    value: "QPL-1.0",
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
    text: "Ricoh Source Code Public License",
    value: "RSCPL",
  },
  {
    text: "Sun Industry Standards Source License v1.1",
    value: "SISSL",
  },
  {
    text: "Sun Public License v1.0",
    value: "SPL-1.0",
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
    text: "Universal Permissive License v1.0",
    value: "UPL-1.0",
  },
  {
    text: "Vovida Software License v1.0",
    value: "VSL-1.0",
  },
  {
    text: "W3C Software Notice and License (2002-12-31)",
    value: "W3C",
  },
  {
    text: "Sybase Open Watcom Public License 1.0",
    value: "Watcom-1.0",
  },
  {
    text: "X.Net License",
    value: "Xnet",
  },
  {
    text: "Zope Public License 2.0",
    value: "ZPL-2.0",
  },
  {
    text: "zlib License",
    value: "Zlib",
  },
];

export default licenses;
