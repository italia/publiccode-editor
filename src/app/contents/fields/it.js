import { elasticUrl } from "../constants";

const it = [
  {
    title: "countryExtensionVersion",
    label: "Country Ext. Version",
    type: "hidden",
    description:
      "Country Extension version",
    section: 6,
    required: false,
    widget: "string",
    value: "0.2",
    disabled: true,
    group: "it"
  },
  {
    section: 4,
    group: "it",
    title: "piattaforme",
    label: "Piattaforme",
    type: "object",
    properties: {
      spid: {
        title: "spid",
        label: "SPID",
        type: "boolean",
        description:
          "Se presente e impostato a yes, il software si interfaccia con SPID - il Sistema Pubblico di Identità Digitale."
      },
      cie: {
        title: "cie",
        label: "CIE",
        type: "boolean",
        description:
          "Se presente e impostato a yes, il software si interfaccia con la Carta di Identità Elettronica."
      },
      anpr: {
        title: "anpr",
        label: "ANPR",
        type: "boolean",
        description:
          "Se presente e impostato a yes, il software si interfaccia con PagoPA."
      },
      pagopa: {
        title: "pagopa",
        label: "pagoPA",
        type: "boolean",
        description:
          "Se presente e impostato a yes, il software si interfaccia con PagoPA."
      }
    }
  },
  {
    section: 4,
    group: "it",
    title: "conforme",
    label: "Conforme",
    type: "object",
    properties: {
      lineeGuidaDesign: {
        title: "lineeGuidaDesign",
        label: "Linee guida design",
        type: "boolean",
        description:
          "Se presente e impostato a yes, il software è conforme alle linee guida di design."
      },
      modelloInteroperabilita: {
        title: "modelloInteroperabilita",
        label: "Interoperabile",
        type: "boolean",
        description:
          "Se presente e impostato a yes, il software è conforme alle linee guida sull'interoperabilità.Riferimento normativo: Art. 73 del CAD."
      },
      misureMinimeSicurezza: {
        title: "misureMinimeSicurezza",
        label: "Misure minime sicurezza",
        type: "boolean",
        description:
          "Se presente e impostato a yes, il software è conforme alle Misure minime di sicurezza ICT per le Pubbliche amministrazioni."
      },
      gdpr: {
        title: "gdpr",
        label: "GDPR",
        type: "boolean",
        description:
          "Se presente e impostato a yes, il software rispetta il GDPR."
      }
    }
  },
  {
    section: 3,
    prepend: true, // Prepend this field at the top of its section
    group: "it",
    title: "riuso",
    label: "Riuso",
    showLabel: false,
    type: "object",
    cn: "block__item--full",
    properties: {
      codiceIPA: {
        title: "codiceIPA",
        label: "Codice iPA dell'ente (obbligatorio per Pubbliche Amministrazioni)",
        type: "string",
        widget: "rsearch",
        description:
          `Codice dell'ente all'interno dell'Indice delle Pubbliche Amministrazioni
          (codice iPA, https://indicepa.gov.it/).`,
        ajax: {
          url: elasticUrl,
          params: (value => {
            return {
              from: 0, size: 50,
              query: {
                bool: {
                  should: [{
                    match: { "ipa": value }
                  }, {
                    multi_match: {
                      query: value,
                      operator: 'and',
                      fields: [
                        'ipa',
                        'pec',
                        'description',
                        'type',
                        'cf'
                      ]
                    }
                  }
                  ]
                }
              }
            }
          })
        }
      }
    }
  }
];

export default it;
