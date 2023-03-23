package main

import (
	"encoding/json"
	"fmt"
	"os"

	publiccode "github.com/italia/publiccode-parser-go"
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

// Message type for data serialized
type Message struct {
	Status string      `json:"status"`
	Errors interface{} `json:"errors,omitempty"`
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
	parser, err := publiccode.NewParser("")
	if err != nil {
		fmt.Println(reportErrorr(err))
		os.Exit(0)
	}
	parser.DisableNetwork = false
	err = parser.ParseBytes([]byte(yml2))
	if err != nil {
		fmt.Println(reportErrorr(err))
		os.Exit(0)
	}
	var message = Message{Status: "ok", Errors: nil}
	out, _ := json.Marshal(message)
	fmt.Println(string(out))
}
