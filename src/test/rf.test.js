import React from 'react'
import renderer from 'react-test-renderer'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import editorForm from '../app/components/editorForm'
import Index from '../app/components/editor'
import { APP_FORM } from "../app/contents/constants";
import { reduxForm } from 'redux-form'
import {
  getData
} from "../app/contents/data";
import { O_APPEND } from 'constants';

jest.mock('react-dom')

const spy = jest.fn()
const initialStateValues = {
  /* initial state values that your form component expects */
}
const Decorated = reduxForm({
  form: APP_FORM, onSubmit: { spy }
})(editorForm)

// before running each test
beforeEach(() => {
  // define `append` as a mocked fn
  const append = jest.fn();
  // set test `Headers`
  global.Headers = () => ({
    append: append,
  });
});
// beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect))
// afterAll(() => React.useEffect.mockRestore())

it('editorForm renders correctly', () => {
  expect.assertions(1);
  return getData('it').then((res) => {
    //CHECK REQUIRED FIELDS

    const formFieldValues = {
      data: res.blocks
    }

    const store = createStore((state) => state, initialStateValues)
    const tree = renderer.create(
      <Provider store={store}>
        <Decorated
          {...formFieldValues}
        />
      </Provider>
    ).toJSON()
    // tree.update()
    console.log(tree)
    // expect(true).toBeTruthy()
    expect(tree).toMatchSnapshot()

  });

})