import * as t from '../app/utils/transform';
import {
  getData
} from "../app/contents/data";

describe('unitary test transformation data', () => {
  test('boolean number test', () => {

    const vals = [1, '1.0.1', '1.0', 1.0, 1.00, '0.0.1', '0', 0.0, 0.00];
    expect.assertions(vals.length);
    return getData('it').then((res) => {
      vals.forEach(v => {
        expect(t.transform({ it: { name: v } }, 'it', res.elements))
          .toEqual({ name: v })
      });
    })
  })

  test('boolean test on text input', () => {
    const vals = [true, false, "true", 'false'];
    expect.assertions(vals.length);
    return getData('it').then((res) => {
      vals.forEach(v => {
        expect(t.transform({ it: { name: v } }, 'it', res.elements))
          .toEqual({ name: v })
      });
    })
  })

  test('boolean test on text input', () => {
    const vals = [true, false, "true", 'false'];
    expect.assertions(vals.length);
    return getData('it').then((res) => {
      vals.forEach(v => {
        expect(t.transform({ it: { localisation_localisationReady: v } }, 'it', res.elements))
          .toEqual(
            {
              localisation: {
                localisationReady: JSON.parse(v) //hack to cast boolean from string
              }
            }
          )
      });
    })
  })
})