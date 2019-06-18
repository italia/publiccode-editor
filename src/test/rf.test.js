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
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('react-dom')

const spy = jest.fn()
const initialStateValues = {
  /* initial state values that your form component expects */
}
const EditorForm = reduxForm({
  form: APP_FORM, onSubmit: { spy }
})(editorForm)

// before running each test
beforeEach(() => {
  configure({ adapter: new Adapter() });
  // define `append` as a mocked fn
  const append = jest.fn();
  // set test `Headers`
  global.Headers = () => ({
    append: append,
  });
});
// beforeAll(() => jest.spyOn(React, 'useEffect').mockImplementation(React.useLayoutEffect))
// afterAll(() => React.useEffect.mockRestore())

it('editorForm renders correctly', async () => {
  expect.assertions(1);
  const res = await getData('it');
  //CHECK REQUIRED FIELDS
  const formFieldValues = {
    data: res.blocks,
    onSubmit: spy
  };
  const store = createStore((state) => state, initialStateValues);
  // const tree = renderer.create(
  // <Provider store={store}>
  //   <EditorForm {...formFieldValues} />
  // </Provider>
  // ).toJSON();

  const wrapper = mount(
    <Provider store={store}>
      <EditorForm {...formFieldValues} />
    </Provider>);



  // console.log(wrapper.html());

  wrapper.simulate('submit');

console.log(spy);
  expect(spy).toBeCalledWith({
    email: 'test@test.com',
    password: '000000',
  });
})