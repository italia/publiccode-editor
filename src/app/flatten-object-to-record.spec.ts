import flattenObjectToRecord from "./flatten-object-to-record";

describe('Flatten object to record', () => {
    it('should return a record given a object with a primitive property', () => {
        //arrage
        const mockData = { type: "value" };
        //act
        const actual = flattenObjectToRecord(mockData);
        //assert
        expect(actual).toBeDefined();
        expect(actual['type']).toBe(mockData.type)
    })
    it('should return a record given a object with a object-ish property', () => {
        //arrage
        const mockData = { type: { value: "value" } };
        //act
        const actual = flattenObjectToRecord(mockData);
        //assert
        expect(actual).toBeDefined();
        expect(actual['type.value']).toBe(mockData.type.value)
    })

    it('should return a record given a object with a object-ish property - deep', () => {
        //arrage
        const mockData = {
            type: {
                value: "value", bar: {
                    foo: 'barfoo'
                }
            }
        };
        //act
        const actual = flattenObjectToRecord(mockData);
        //assert
        expect(actual).toBeDefined();
        expect(actual['type.value']).toBe(mockData.type.value)
        expect(actual['type.bar.foo']).toBe(mockData.type.bar.foo)
    })
})