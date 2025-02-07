import isValidUrl from "./is-valid-url";

fdescribe("isValidUrl", () => {
    test("valid URLs", () => {
        expect(isValidUrl("https://example.com")).toBe(true);
        expect(isValidUrl("http://example.com")).toBe(true);
        expect(isValidUrl("https://www.example.com")).toBe(true);
        expect(isValidUrl("https://sub.domain.example.com")).toBe(true);
        expect(isValidUrl("https://example.com:8080")).toBe(true);
        expect(isValidUrl("https://example.com/path")).toBe(true);
        expect(isValidUrl("https://example.com?query=test")).toBe(true);
        expect(isValidUrl("https://example.com?query=test&x=1")).toBe(true);
        expect(isValidUrl("https://example.com#fragment")).toBe(true);
        expect(isValidUrl("https://example.com:3000/path?query=value#section")).toBe(true);
    });

    test("invalid URLs", () => {
        expect(isValidUrl("example")).toBe(false);
        expect(isValidUrl("example.com")).toBe(false);
        expect(isValidUrl("ftp://example.com")).toBe(false);
        expect(isValidUrl("://example.com")).toBe(false);
        expect(isValidUrl("http:/example.com")).toBe(false);
        expect(isValidUrl("http//example.com")).toBe(false);
        expect(isValidUrl("https//example.com")).toBe(false);
        expect(isValidUrl("")).toBe(false);
        expect(isValidUrl("https://")).toBe(false);
        expect(isValidUrl("https://.com")).toBe(false);
        expect(isValidUrl("http://com")).toBe(false);
    });

    test("edge cases", () => {
        expect(isValidUrl("http://localhost")).toBe(true);
        expect(isValidUrl("http://localhost:3000")).toBe(true);
        expect(isValidUrl("https://127.0.0.1")).toBe(true);
        expect(isValidUrl("https://127.0.0.1:8080")).toBe(true);
        expect(isValidUrl("https://[::1]")).toBe(true);
        expect(isValidUrl("https://user:pass@example.com")).toBe(true);
        expect(isValidUrl("https://example.com/path/to/page?query=string#fragment")).toBe(true);
        expect(isValidUrl("https://example.com/path?valid=true&data[]=123")).toBe(true);
    });
});