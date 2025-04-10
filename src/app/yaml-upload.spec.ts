import { hasYamlFileExtension, isYamlFile } from "./yaml-upload";

describe('yaml upload helper functions tests', () => {

    describe('isYamlFile function tests', () => {

        const testFactory = (type: string, assertCondition: boolean, filename = 'publiccode.yml') => {
            //arrange
            const file = new File([""], filename, { type });
            //act
            const actual = isYamlFile(file);
            //assert
            expect(actual).toBe(assertCondition)
        }

        it('should return true if mime type is application/yaml (Chrome)', () => {
            testFactory('application/yaml', true);
        })

        it('should return true if mime type is application/x-yaml (Firefox)', () => {
            testFactory('application/x-yaml', true);
        })

        it('should return true if mime type is text/yaml', () => {
            testFactory('text/yaml', true);
        })

        it('should return false if mime type is application/json', () => {
            testFactory('application/json', false);
        })

        it('should return true if mime type is empty and file is on Windows with .yml extension', () => {
            jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Windows');
            testFactory('', true, 'publiccode.yml');
        })

        it('should return true if mime type is empty and file is on Windows with .yaml extension', () => {
            jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Windows');
            testFactory('', true, 'publiccode.yaml');
        })

        it('should return false if mime type is empty and file is on Windows with a non-YAML extension', () => {
            jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Windows');
            testFactory('', false, 'publiccode.json');
        })
    })

    describe('hasYamlFileExtension function tests', () => {
        const testFactory = (value?: string, assertCondition = true) => {
            //arrange
            //act
            const actual = hasYamlFileExtension(value);
            //assert
            expect(actual).toBe(assertCondition)
        }

        it('should return true if filename has .yml extension', () => {
            testFactory('publiccode.yml');
        })

        it('should return true if filename has .yaml extension', () => {
            testFactory('publiccode.yaml');
        })

        it('should return false if filename has .bkp extension', () => {
            testFactory('publiccode.yaml.bkp', false);
        })

        it('should return false if filename is undefined', () => {
            testFactory(undefined, false);
        })
    })
})