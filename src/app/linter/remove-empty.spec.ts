import PublicCode from '../contents/publiccode';
import { removeEmpty } from './remove-empty';

describe('removeEmpty', () => {
    describe('primitive types', () => {
        it('should return numbers unchanged', () => {
            expect(removeEmpty(42)).toBe(42);
            expect(removeEmpty(0)).toBe(0);
            expect(removeEmpty(-1)).toBe(-1);
        });

        it('should return booleans unchanged', () => {
            expect(removeEmpty(true)).toBe(true);
            expect(removeEmpty(false)).toBe(false);
        });

        it('should return null unchanged', () => {
            expect(removeEmpty(null)).toBe(null);
        });

        it('should return non-empty strings unchanged', () => {
            expect(removeEmpty('hello')).toBe('hello');
            expect(removeEmpty('test')).toBe('test');
        });
    });

    describe('simple objects', () => {
        it('should remove properties with empty strings', () => {
            const input = { name: 'John', empty: '', age: 30 };
            const result = removeEmpty(input);
            expect(result).toEqual({ name: 'John', age: 30 });
            expect(result).not.toHaveProperty('empty');
        });

        it('should remove undefined properties', () => {
            const input = { name: 'John', undefined: undefined, age: 30 };
            const result = removeEmpty(input);
            expect(result).toEqual({ name: 'John', age: 30 });
            expect(result).not.toHaveProperty('undefined');
        });

        it('should remove empty arrays', () => {
            const input = { name: 'John', items: [], age: 30 };
            const result = removeEmpty(input);
            expect(result).toEqual({ name: 'John', age: 30 });
            expect(result).not.toHaveProperty('items');
        });

        it('should remove empty objects', () => {
            const input = { name: 'John', data: {}, age: 30 };
            const result = removeEmpty(input);
            expect(result).toEqual({ name: 'John', age: 30 });
            expect(result).not.toHaveProperty('data');
        });

        it('should keep non-empty arrays', () => {
            const input = { name: 'John', items: [1, 2, 3], age: 30 };
            const result = removeEmpty(input);
            expect(result).toEqual({ name: 'John', items: [1, 2, 3], age: 30 });
        });

        it('should keep non-empty objects', () => {
            const input = { name: 'John', data: { key: 'value' }, age: 30 };
            const result = removeEmpty(input);
            expect(result).toEqual({ name: 'John', data: { key: 'value' }, age: 30 });
        });
    });

    describe('nested objects', () => {
        it('should handle nested objects with empty values', () => {
            const input = {
                user: {
                    name: 'John',
                    email: '',
                    profile: {
                        bio: '',
                        tags: []
                    }
                },
                settings: {
                    theme: 'dark'
                }
            };

            const result = removeEmpty(input);
            expect(result).toEqual({
                user: {
                    name: 'John'
                },
                settings: {
                    theme: 'dark'
                }
            });
        });

        it('should remove objects that become empty after cleaning', () => {
            const input = {
                user: {
                    empty1: '',
                    empty2: undefined,
                    empty3: []
                },
                valid: 'data'
            };

            const result = removeEmpty(input);
            expect(result).toEqual({ valid: 'data' });
            expect(result).not.toHaveProperty('user');
        });

        it('should handle deep nesting', () => {
            const input = {
                level1: {
                    level2: {
                        level3: {
                            value: '',
                            data: undefined
                        },
                        keep: 'this'
                    }
                }
            };

            const result = removeEmpty(input);
            expect(result).toEqual({
                level1: {
                    level2: {
                        keep: 'this'
                    }
                }
            });
        });
    });

    describe('arrays', () => {
        it('should clean objects inside arrays', () => {
            const input = {
                items: [
                    { name: 'Item1', empty: '' },
                    { name: 'Item2', data: 'valid' },
                    { empty1: '', empty2: undefined }
                ]
            };

            const result = removeEmpty(input);

            expect(result).toEqual({
                items: [
                    { name: 'Item1' },
                    { name: 'Item2', data: 'valid' },
                    undefined
                ]
            });
        });

        it('should keep arrays with valid elements', () => {
            const input = {
                numbers: [1, 2, 3],
                strings: ['a', 'b', 'c']
            };

            const result = removeEmpty(input);
            expect(result).toEqual({
                numbers: [1, 2, 3],
                strings: ['a', 'b', 'c']
            });
        });
    });

    describe('edge cases', () => {
        it('should handle completely empty objects', () => {
            const input = { empty1: '', empty2: undefined, empty3: [] };
            const result = removeEmpty(input);
            expect(result).toEqual({});
        });

        it('should handle empty input objects', () => {
            const input = {};
            const result = removeEmpty(input);
            expect(result).toEqual({});
        });

        it('should preserve properties with value 0', () => {
            const input = { count: 0, name: 'test', empty: '' };
            const result = removeEmpty(input);
            expect(result).toEqual({ count: 0, name: 'test' });
        });

        it('should preserve properties with value false', () => {
            const input = { active: false, name: 'test', empty: '' };
            const result = removeEmpty(input);
            expect(result).toEqual({ active: false, name: 'test' });
        });

        it('should preserve properties with value null', () => {
            const input = { data: null, name: 'test', empty: '' };
            const result = removeEmpty(input);
            expect(result).toEqual({ data: null, name: 'test' });
        });
    });

    describe('mutability', () => {
        it('should modify the original object (mutation)', () => {
            const input = { name: 'John', empty: '', age: 30 };
            const result = removeEmpty(input);

            // The function modifies the original object
            expect(result).toBe(input);
            expect(input).toEqual({ name: 'John', age: 30 });
        });
    });

    describe('TypeScript types', () => {
        it('should maintain input type', () => {
            interface User {
                name: string;
                email?: string;
                age: number;
            }

            const input: User = { name: 'John', email: '', age: 30 };
            const result: User = removeEmpty(input);

            expect(result).toEqual({ name: 'John', age: 30 });
        });
    });

    describe('real world cases - publiccode.yml object', () => {
        const publiccodeData = {
            "publiccodeYmlVersion": "0.2",
            "name": "Design Angular Kit",
            "url": "https://github.com/italia/design-angular-kit",
            "landingURL": "https://italia.github.io/design-angular-kit",
            "isBasedOn": [
                "Bootstrap Italia"
            ],
            "softwareVersion": "v20.0.0",
            "releaseDate": "2025-06-24",
            "platforms": [
                "web"
            ],
            "categories": [
                "website-builder"
            ],
            "roadmap": "https://github.com/italia/design-angular-kit/issues",
            "developmentStatus": "stable",
            "softwareType": "library",
            "description": {
                "it": {
                    "genericName": "Design Angular Kit",
                    "shortDescription": "La libreria Design Angular Kit è il modo più semplice e sicuro per costruire UI web moderne, inclusive e semplici da mantenere utilizzando Angular.",
                    "longDescription": "La libreria **Design Angular Kit** è il modo più semplice e sicuro per\ncostruire interfacce web **moderne**, **inclusive** e **semplici da\nmantenere** utilizzando il framework Angular.\n\nCompletamente **open-source**, costruita sulle fondamenta di \n[Bootstrap Italia 2.x](https://github.com/italia/bootstrap-italia \"Repository GitHub di Bootstrap Italia\") \ndi cui eredita tutte le funzionalità, componenti, griglie e classi di utilità.\n",
                    "documentation": "https://italia.github.io/design-angular-kit",
                    "features": [
                        "responsive",
                        "accessibility",
                        "inclusion",
                        "web development",
                        "PNRR",
                        "PNRR/Misura/1.4.1",
                        "PNRR/Beneficiari/Comuni",
                        "PNRR/Beneficiari/Scuole"
                    ]
                }
            },
            "legal": {
                "license": "BSD-3-Clause",
                "mainCopyrightOwner": "Presidenza del Consiglio dei Ministri",
                "authorsFile": "https://github.com/italia/design-angular-kit/blob/main/AUTHORS"
            },
            "maintenance": {
                "type": "community",
                "contacts": [
                    {
                        "name": "Designers Italia",
                        "email": "a@a.it",
                        "phone": "",
                        "affiliation": ""
                    },
                    {
                        "name": "valerio",
                        "email": "a@a.it",
                        "phone": "",
                        "affiliation": ""
                    }
                ]
            },
            "localisation": {
                "localisationReady": false,
                "availableLanguages": [
                    "it"
                ]
            },
            "it": {
                "countryExtensionVersion": "0.2",
                "conforme": {
                    "lineeGuidaDesign": false,
                    "modelloInteroperabilita": false,
                    "misureMinimeSicurezza": false,
                    "gdpr": false
                },
                "piattaforme": {
                    "spid": false,
                    "cie": false,
                    "anpr": false,
                    "pagopa": false
                },
                "riuso": {
                    "codiceIPA": "pcm"
                }
            }
        };

        it('should remove empty strings in contacts', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData));
            input.maintenance.contacts[0].phone = "";
            input.maintenance.contacts[0].affiliation = "";
            input.maintenance.contacts[1].phone = "";
            input.maintenance.contacts[1].affiliation = "";

            const result = removeEmpty(input);

            expect(result.maintenance.contacts[0]).not.toHaveProperty('phone');
            expect(result.maintenance.contacts[0]).not.toHaveProperty('affiliation');
            expect(result.maintenance.contacts[1]).not.toHaveProperty('phone');
            expect(result.maintenance.contacts[1]).not.toHaveProperty('affiliation');

            // Should maintain name and email
            expect(result.maintenance.contacts[0]).toHaveProperty('name', 'Designers Italia');
            expect(result.maintenance.contacts[0]).toHaveProperty('email', 'a@a.it');
        });

        it('should keep non-empty arrays like features', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData));
            const result = removeEmpty(input);

            expect(result.description.it.features).toEqual([
                "responsive",
                "accessibility",
                "inclusion",
                "web development",
                "PNRR",
                "PNRR/Misura/1.4.1",
                "PNRR/Beneficiari/Comuni",
                "PNRR/Beneficiari/Scuole"
            ]);
        });

        it('should keep false boolean values', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData));
            const result = removeEmpty(input);

            expect(result.localisation.localisationReady).toBe(false);
            expect(result.it.conforme.lineeGuidaDesign).toBe(false);
            expect(result.it.piattaforme.spid).toBe(false);
        });

        it('should remove properties that are undefined', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData)) as PublicCode;
            input.applicationSuite = undefined;
            input.description.it.localisedName = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input.maintenance as any).emptyMaintenance = undefined;

            const result = removeEmpty(input);

            expect(result).not.toHaveProperty('applicationSuite');
            expect(result.description.it).not.toHaveProperty('localisedName');
            expect(result.maintenance).not.toHaveProperty('emptyMaintenance');
        });

        it('should remove arrays that are empty', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData)) as PublicCode;
            input.usedBy = [];
            input.description.it.awards = [];
            input.localisation.availableLanguages = [];

            const result = removeEmpty(input);

            expect(result).not.toHaveProperty('emptyArray');
            expect(result.description.it).not.toHaveProperty('emptyFeatures');
            expect(result.legal).not.toHaveProperty('emptyLicenses');
        });

        it('should remove objects that has no property', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData)) as PublicCode;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input.legal as any) = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input.description.fr as any) = {};
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input as any).outOfStandardObject = {};

            const result = removeEmpty(input);

            expect(result).not.toHaveProperty('legal');
            expect(result.description).not.toHaveProperty('fr');
            expect(result).not.toHaveProperty('outOfStandardObject');
        });

        it('should handle contacts with all empty properties', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData));
            input.maintenance.contacts.push({
                name: "",
                email: "",
                phone: "",
                affiliation: ""
            });

            const result = removeEmpty(input);

            // should keep contact as undefined object
            expect(result.maintenance.contacts).toHaveLength(3);
            expect(result.maintenance.contacts[2]).toEqual(undefined);
        });

        it('should keep the entire structure with valid values', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData));
            const result = removeEmpty(input);

            // check wherte all the main properties still exist
            expect(result).toHaveProperty('publiccodeYmlVersion', '0.2');
            expect(result).toHaveProperty('name', 'Design Angular Kit');
            expect(result).toHaveProperty('description');
            expect(result.description).toHaveProperty('it');
            expect(result.description.it).toHaveProperty('genericName');
            expect(result).toHaveProperty('legal');
            expect(result.legal).toHaveProperty('license', 'BSD-3-Clause');
            expect(result).toHaveProperty('maintenance');
            expect(result.maintenance).toHaveProperty('type', 'community');
        });

        it('should handle deep changes in nested object', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData)) as PublicCode;

            // Add empty propierties at different nested levels
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input.description.it as any).emptyProp = "";
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input.it?.conforme as any).emptyConf = undefined;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input.it?.piattaforme as any).emptyPlatform = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (input.maintenance.contacts?.[0] as any).emptyContact = {};

            const result = removeEmpty(input);

            expect(result.description.it).not.toHaveProperty('emptyProp');
            expect(result.it?.conforme).not.toHaveProperty('emptyConf');
            expect(result.it?.piattaforme).not.toHaveProperty('emptyPlatform');
            expect(result.maintenance.contacts?.[0]).not.toHaveProperty('emptyContact');

            // Check that properites keep their validity
            expect(result.description.it).toHaveProperty('genericName');
            expect(result.it?.conforme).toHaveProperty('lineeGuidaDesign', false);
            expect(result.maintenance.contacts?.[0]).toHaveProperty('name');
        });

        it('should preserve array with valid values', () => {
            const input = JSON.parse(JSON.stringify(publiccodeData));
            const result = removeEmpty(input);

            expect(result.isBasedOn).toEqual(["Bootstrap Italia"]);
            expect(result.platforms).toEqual(["web"]);
            expect(result.categories).toEqual(["website-builder"]);
            expect(result.localisation.availableLanguages).toEqual(["it"]);
        });
    });
});