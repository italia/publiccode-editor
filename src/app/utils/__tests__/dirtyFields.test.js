import { dirtyValues } from "../transform";

test("dirtyValues with nested field and second array item modified", () => {
  const dirtyFields = {
    name: true,
    address: {
      street: true,
      phoneNumbers: [null, true],
    },
  };
  const allValues = {
    name: "Bill",
    friend: true,
    address: {
      street: "Main",
      phoneNumbers: ["unchanged", "new"],
    },
  };

  expect(dirtyValues(dirtyFields, allValues)).toEqual({
    name: "Bill",
    address: {
      street: "Main",
      phoneNumbers: ["unchanged", "new"],
    },
  });
});

test("dirtyValues with first array item modified must return the entire array", () => {
  const dirtyFields = {
    address: {
      country: {
        state: {
          city: true,
        },
      },
      phoneNumbers: [true],
    },
  };
  const allValues = {
    address: {
      country: {
        state: {
          city: "Sydney",
          neighborCity: "Melbs",
        },
      },
      phoneNumbers: ["changed", "but others follow"],
    },
  };

  expect(dirtyValues(dirtyFields, allValues)).toEqual({
    address: {
      country: {
        state: {
          city: "Sydney",
        },
      },
      phoneNumbers: ["changed"],
    },
  });
});

test("changed item in array of objects", () => {
  const dirtyFields = {
    friends: [true, true],
  };
  const allValues = {
    friends: [{ first: "Bill", last: "Maher" }, { first: "Dan", last: "DV" }],
  };
  expect(dirtyValues(dirtyFields, allValues)).toEqual({
    friends: [{ first: "Bill", last: "Maher" }, { first: "Dan", last: "DV" }],
  });
});
