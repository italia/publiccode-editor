import { isYamlFile } from "./yaml-upload";

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
    })
})