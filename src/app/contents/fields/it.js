import { elasticUrl } from "../constants";

const it = [
  {
    title: "countryExtensionVersion",
    type: "hidden",
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
    type: "object",
    properties: {
      spid: {
        title: "spid",
        type: "boolean",
      },
      cie: {
        title: "cie",
        type: "boolean",
      },
      anpr: {
        title: "anpr",
        type: "boolean",
      },
      pagopa: {
        title: "pagopa",
        type: "boolean",
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
        type: "boolean",
      },
      modelloInteroperabilita: {
        title: "modelloInteroperabilita",
        type: "boolean",
      },
      misureMinimeSicurezza: {
        title: "misureMinimeSicurezza",
        type: "boolean",
      },
      gdpr: {
        title: "gdpr",
        type: "boolean",
      }
    }
  },
  {
    section: 3,
    prepend: true, // Prepend this field at the top of its section
    group: "it",
    title: "riuso",
    showLabel: false,
    type: "object",
    cn: "block__item--full",
    properties: {
      codiceIPA: {
        title: "codiceIPA",
        type: "string",
        widget: "rsearch",
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
