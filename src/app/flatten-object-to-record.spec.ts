import flattenObjectToRecord from "./flatten-object-to-record";

describe('Flatten object to record', () => {
    it('should return a record given a object with a object-ish property', () => {
        //arrage
        const mockData = { en: { type: "error", message: "this is an error message" } };
        //act
        const actual = flattenObjectToRecord(mockData);
        //assert
        expect(actual).toBeDefined();
        expect(actual.en).toBeDefined()
        expect(actual.en.type).toBe(mockData.en.type)
        expect(actual.en.message).toBe(mockData.en.message)
    })

    it('should return a record given a object with a object-ish property - deep', () => {
        //arrage
        const mockData = { description: { en: { type: "error", message: "this is an error message" } } };
        //act
        const actual = flattenObjectToRecord(mockData);
        //assert
        expect(actual).toBeDefined();
        expect(actual['description.en']).toBeDefined();
        expect(actual['description.en'].type).toBe("error")
        expect(actual['description.en'].message).toBe("this is an error message")
    })
})