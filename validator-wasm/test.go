package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"

	"github.com/italia/publiccode-parser-go"
)

var yml = `# This repository adheres to the publiccode.yml standard by including this
# metadata file that makes public software easily discoverable.
# More info at https://github.com/italia/publiccode.yml

publiccodeYmlVersion: '0.2'
categories:
  - it-development
description:
  it:
    features:
      - Generazione di publiccode.yml
      - Modifica di publiccode.yml
      - Validazione di publiccode.yml
      - Importazione di publiccode.yml tramite URL
      - Possibilità di gestire diverse lingue
    genericName: Generatore di publiccode.yml
    longDescription: |
      publiccode editor è un'applicazione web per generare file
      Compilando il form, genera automaticamente un file YAML compatible con
      l'ultima versione dello standard publiccode. Questo file può essere copiato
      o scaricato localmente per essere poi inserito nel repository di destinazione.

      Può inoltre essere usato come validatore. È possible incollare o importare
      il documento importato e aiuterà a correggere eventuali errori.
    shortDescription: Un editor web per generare e validare file publiccode.yml.
developmentStatus: stable
it:
  countryExtensionVersion: '0.2'
  piattaforme:
    anpr: false
    cie: false
    pagopa: false
    spid: false
  riuso:
    codiceIPA: pcm
legal:
  license: AGPL-3.0-or-later
  authorsFile: AUTHORS.md
localisation:
  availableLanguages:
    - en
  localisationReady: false
maintenance:
  contacts:
    - name: Leonardo Favario
    - name: Alessandro Sebastiani
    - name: Fabio Bonelli
  type: community
name: publiccode editor
platforms:
  - web
releaseDate: '2020-08-20'
softwareType: standalone/web
url: ""
`

var yml2 = `{
	"url": "https://github.com/italia/publiccode-editor",
  "localisation": { 
    "localisationReady": false
  },
	"description": {
		"it": {
			"apiDocumentation": "README.md"
		},
	},
	"legal": {
		"authorsFile": "AUTHORS.md"
	},
  "publiccodeYmlVersion": "0.2"
}`

var yml3 = `{
  "description": {
    "it": {
      "localisedName": "",
      "genericName": "Generatore di publiccode.yml",
      "documentation": "",
      "apiDocumentation": "",
      "shortDescription": "Un editor web per generare e validare file publiccode.yml.",
      "longDescription": "publiccode editor è un'applicazione web per generare file\n[](https://github.com/italia/publiccode.yml) validi.\nCompilando il form, genera automaticamente un file YAML compatible con\nl'ultima versione dello standard publiccode. Questo file può essere copiato\no scaricato localmente per essere poi inserito nel repository di destinazione.\n\nPuò inoltre essere usato come validatore. È possible incollare o importare\nun file  esistente all'interno dell'editor. L'editor validerà\nil documento importato e aiuterà a correggere eventuali errori.\n",
      "features": [
        "Generazione di publiccode.yml",
        "Modifica di publiccode.yml",
        "Validazione di publiccode.yml",
        "Importazione di publiccode.yml tramite URL",
        "Possibilità di gestire diverse lingue"
      ],
      "screenshots": [
        "screenshot.png"
      ]
    }
  },
  "publiccodeYmlVersion": "0.2",
  "name": "publiccode editor",
  "applicationSuite": "",
  "url": "https://github.com/italia/publiccode-editor",
  "landingURL": "",
  "roadmap": "",
  "releaseDate": "2020-08-20",
  "isBasedOn": "",
  "softwareVersion": "1.4.3",
  "developmentStatus": "stable",
  "softwareType": "standalone/web",
  "platforms": [
    "web"
  ],
  "it": {
    "riuso": {
      "codiceIPA": "pcm"
    },
    "piattaforme": {
      "spid": false,
      "cie": false,
      "anpr": false,
      "pagopa": false
    },
    "conforme": {
      "lineeGuidaDesign": false,
      "modelloInteroperabilita": false,
      "misureMinimeSicurezza": false,
      "gdpr": false
    },
    "countryExtensionVersion": "0.2"
  },
  "legal": {
    "license": "AGPL-3.0-or-later",
    "mainCopyrightOwner": "",
    "repoOwner": "",
    "authorsFile": "AUTHORS.md"
  },
  "localisation": {
    "availableLanguages": [
      "en"
    ],
    "localisationReady": false
  },
  "logo": "",
  "monochromeLogo": "",
  "categories": [
    "it-development"
  ],
  "intendedAudience": {
    "scope": "",
    "countries": "",
    "unsupportedCountries": ""
  },
  "maintenance": {
    "type": "community",
    "contacts": [
      {
        "name": "Leonardo Favario",
        "email": "",
        "phone": "",
        "affiliation": ""
      },
      {
        "name": "Alessandro Sebastiani",
        "email": "",
        "phone": "",
        "affiliation": ""
      },
      {
        "name": "Fabio Bonelli",
        "email": "",
        "phone": "",
        "affiliation": ""
      }
    ]
  }
}`

var jsonString = "{\"description\":{\"it\":{\"localisedName\":\"\",\"genericName\":\"Generatore di publiccode.yml\",\"documentation\":\"\",\"apiDocumentation\":\"\",\"shortDescription\":\"Un editor web per generare e validare file publiccode.yml.\",\"longDescription\":\"publiccode editor è un'applicazione web per generare file\\n[`publiccode.yml`](https://github.com/italia/publiccode.yml) validi.\\nCompilando il form, genera automaticamente un file YAML compatible con\\nl'ultima versione dello standard publiccode. Questo file può essere copiato\\no scaricato localmente per essere poi inserito nel repository di destinazione.\\n\\nPuò inoltre essere usato come validatore. È possible incollare o importare\\nun file `publiccode.yml` esistente all'interno dell'editor. L'editor validerà\\nil documento importato e aiuterà a correggere eventuali errori.\\n\",\"features\":[\"Generazione di publiccode.yml\",\"Modifica di publiccode.yml\",\"Validazione di publiccode.yml\",\"Importazione di publiccode.yml tramite URL\",\"Possibilità di gestire diverse lingue\"],\"screenshots\":[\"screenshot.png\"]}},\"publiccodeYmlVersion\":\"0.2\",\"name\":\"publiccode editor\",\"applicationSuite\":\"\",\"url\":\"https://github.com/italia/publiccode-editor\",\"landingURL\":\"\",\"roadmap\":\"\",\"releaseDate\":\"2020-08-20\",\"isBasedOn\":\"\",\"softwareVersion\":\"1.4.3\",\"developmentStatus\":\"stable\",\"softwareType\":\"standalone/web\",\"platforms\":[\"web\"],\"it\":{\"riuso\":{\"codiceIPA\":\"pcm\"},\"piattaforme\":{\"spid\":false,\"cie\":false,\"anpr\":false,\"pagopa\":false},\"conforme\":{\"lineeGuidaDesign\":false,\"modelloInteroperabilita\":false,\"misureMinimeSicurezza\":false,\"gdpr\":false},\"countryExtensionVersion\":\"0.2\"},\"legal\":{\"license\":\"AGPL-3.0-or-later\",\"mainCopyrightOwner\":\"\",\"repoOwner\":\"\",\"authorsFile\":\"AUTHORS.md\"},\"localisation\":{\"availableLanguages\":[\"en\"],\"localisationReady\":false},\"logo\":\"\",\"monochromeLogo\":\"\",\"categories\":[\"it-development\"],\"intendedAudience\":{\"scope\":\"\",\"countries\":\"\",\"unsupportedCountries\":\"\"},\"maintenance\":{\"type\":\"community\",\"contacts\":[{\"name\":\"Leonardo Favario\"},{\"name\":\"Alessandro Sebastiani\"},{\"name\":\"Fabio Bonelli\"}]}}"

var yml3Base64 = "eyJkZXNjcmlwdGlvbiI6eyJpdCI6eyJsb2NhbGlzZWROYW1lIjoiIiwiZ2VuZXJpY05hbWUiOiJHZW5lcmF0b3JlIGRpIHB1YmxpY2NvZGUueW1sIiwiZG9jdW1lbnRhdGlvbiI6IiIsImFwaURvY3VtZW50YXRpb24iOiIiLCJzaG9ydERlc2NyaXB0aW9uIjoiVW4gZWRpdG9yIHdlYiBwZXIgZ2VuZXJhcmUgZSB2YWxpZGFyZSBmaWxlIHB1YmxpY2NvZGUueW1sLiIsImxvbmdEZXNjcmlwdGlvbiI6InB1YmxpY2NvZGUgZWRpdG9yIMOoIHVuJ2FwcGxpY2F6aW9uZSB3ZWIgcGVyIGdlbmVyYXJlIGZpbGVcbltgcHVibGljY29kZS55bWxgXShodHRwczovL2dpdGh1Yi5jb20vaXRhbGlhL3B1YmxpY2NvZGUueW1sKSB2YWxpZGkuXG5Db21waWxhbmRvIGlsIGZvcm0sIGdlbmVyYSBhdXRvbWF0aWNhbWVudGUgdW4gZmlsZSBZQU1MIGNvbXBhdGlibGUgY29uXG5sJ3VsdGltYSB2ZXJzaW9uZSBkZWxsbyBzdGFuZGFyZCBwdWJsaWNjb2RlLiBRdWVzdG8gZmlsZSBwdcOyIGVzc2VyZSBjb3BpYXRvXG5vIHNjYXJpY2F0byBsb2NhbG1lbnRlIHBlciBlc3NlcmUgcG9pIGluc2VyaXRvIG5lbCByZXBvc2l0b3J5IGRpIGRlc3RpbmF6aW9uZS5cblxuUHXDsiBpbm9sdHJlIGVzc2VyZSB1c2F0byBjb21lIHZhbGlkYXRvcmUuIMOIIHBvc3NpYmxlIGluY29sbGFyZSBvIGltcG9ydGFyZVxudW4gZmlsZSBgcHVibGljY29kZS55bWxgIGVzaXN0ZW50ZSBhbGwnaW50ZXJubyBkZWxsJ2VkaXRvci4gTCdlZGl0b3IgdmFsaWRlcsOgXG5pbCBkb2N1bWVudG8gaW1wb3J0YXRvIGUgYWl1dGVyw6AgYSBjb3JyZWdnZXJlIGV2ZW50dWFsaSBlcnJvcmkuXG4iLCJmZWF0dXJlcyI6WyJHZW5lcmF6aW9uZSBkaSBwdWJsaWNjb2RlLnltbCIsIk1vZGlmaWNhIGRpIHB1YmxpY2NvZGUueW1sIiwiVmFsaWRhemlvbmUgZGkgcHVibGljY29kZS55bWwiLCJJbXBvcnRhemlvbmUgZGkgcHVibGljY29kZS55bWwgdHJhbWl0ZSBVUkwiLCJQb3NzaWJpbGl0w6AgZGkgZ2VzdGlyZSBkaXZlcnNlIGxpbmd1ZSJdLCJzY3JlZW5zaG90cyI6WyJzY3JlZW5zaG90LnBuZyJdfX0sInB1YmxpY2NvZGVZbWxWZXJzaW9uIjoiMC4yIiwibmFtZSI6InB1YmxpY2NvZGUgZWRpdG9yIiwiYXBwbGljYXRpb25TdWl0ZSI6IiIsInVybCI6Imh0dHBzOi8vZ2l0aHViLmNvbS9pdGFsaWEvcHVibGljY29kZS1lZGl0b3IiLCJsYW5kaW5nVVJMIjoiIiwicm9hZG1hcCI6IiIsInJlbGVhc2VEYXRlIjoiMjAyMC0wOC0yMCIsImlzQmFzZWRPbiI6IiIsInNvZnR3YXJlVmVyc2lvbiI6IjEuNC4zIiwiZGV2ZWxvcG1lbnRTdGF0dXMiOiJzdGFibGUiLCJzb2Z0d2FyZVR5cGUiOiJzdGFuZGFsb25lL3dlYiIsInBsYXRmb3JtcyI6WyJ3ZWIiXSwiaXQiOnsicml1c28iOnsiY29kaWNlSVBBIjoicGNtIn0sInBpYXR0YWZvcm1lIjp7InNwaWQiOmZhbHNlLCJjaWUiOmZhbHNlLCJhbnByIjpmYWxzZSwicGFnb3BhIjpmYWxzZX0sImNvbmZvcm1lIjp7ImxpbmVlR3VpZGFEZXNpZ24iOmZhbHNlLCJtb2RlbGxvSW50ZXJvcGVyYWJpbGl0YSI6ZmFsc2UsIm1pc3VyZU1pbmltZVNpY3VyZXp6YSI6ZmFsc2UsImdkcHIiOmZhbHNlfSwiY291bnRyeUV4dGVuc2lvblZlcnNpb24iOiIwLjIifSwibGVnYWwiOnsibGljZW5zZSI6IkFHUEwtMy4wLW9yLWxhdGVyIiwibWFpbkNvcHlyaWdodE93bmVyIjoiIiwicmVwb093bmVyIjoiIiwiYXV0aG9yc0ZpbGUiOiJBVVRIT1JTLm1kIn0sImxvY2FsaXNhdGlvbiI6eyJhdmFpbGFibGVMYW5ndWFnZXMiOlsiZW4iXSwibG9jYWxpc2F0aW9uUmVhZHkiOmZhbHNlfSwibG9nbyI6IiIsIm1vbm9jaHJvbWVMb2dvIjoiIiwiY2F0ZWdvcmllcyI6WyJpdC1kZXZlbG9wbWVudCJdLCJpbnRlbmRlZEF1ZGllbmNlIjp7InNjb3BlIjoiIiwiY291bnRyaWVzIjoiIiwidW5zdXBwb3J0ZWRDb3VudHJpZXMiOiIifSwibWFpbnRlbmFuY2UiOnsidHlwZSI6ImNvbW11bml0eSIsImNvbnRhY3RzIjpbeyJuYW1lIjoiTGVvbmFyZG8gRmF2YXJpbyJ9LHsibmFtZSI6IkFsZXNzYW5kcm8gU2ViYXN0aWFuaSJ9LHsibmFtZSI6IkZhYmlvIEJvbmVsbGkifV19fQ=="

// Message type for data serialized
type Message struct {
	Status string      `json:"status"`
	Errors interface{} `json:"errors,omitempty"`
}

func testConversionAndMarshalling() {
	var payload = []byte(jsonString)
	fmt.Printf("payload %b", payload)

	sDec, err := base64.StdEncoding.DecodeString(string(yml3Base64))
	// var strToConvert = bytes.NewBuffer(payload).String()
	if err != nil {
		fmt.Printf("error on decoding %s", err)
	}

	fmt.Printf("%s", sDec)
}

func reportErrorr(err error) string {
	var message = Message{Status: "ko", Errors: err}
	out, jsonerr := json.Marshal(message)
	if jsonerr != nil {
		return jsonerr.Error()
	}
	return string(out)
}

func main() {
	// testConversionAndMarshalling()
	parser, err := publiccode.NewParser("")
	if err != nil {
		fmt.Println(reportErrorr(err))
		os.Exit(0)
	}
	parser.DisableNetwork = false
	err = parser.ParseBytes([]byte(jsonString))
	if err != nil {
		fmt.Println(reportErrorr(err))
		os.Exit(0)
	}
	var message = Message{Status: "ok", Errors: nil}
	out, _ := json.Marshal(message)
	fmt.Println(string(out))
}
