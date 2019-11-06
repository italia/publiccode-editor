import React from 'react'
import { Provider } from 'react-redux'
import editorForm from '../app/components/editorForm'
import { APP_FORM } from "../app/contents/constants";
import { reduxForm } from 'redux-form'
import {
  getData
} from "../app/contents/data";
import { shallow, mount, render, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import store from '../app/store'

const spy = jest.fn();

// jest.mock('react-dom');

const initialStateValues = {
  /* initial state values that your form component expects */
}
const EditorForm = reduxForm({
  form: APP_FORM, submit: { spy }
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
  // expect.assertions(0);
  const res = await getData('it');
  //CHECK REQUIRED FIELDS
  const props = {
    data: res.blocks,
    onSubmit: spy
  };
  // const store = createStore((state) => state, initialStateValues);
  
  // const wrapper = renderer.create(
  // <Provider store={store}>
  //   <EditorForm {...props} />
  // </Provider>
  // );

  // const wrapper = shallow(
  //   <Provider store={store}>
  //     <EditorForm {...props} />
  //   </Provider>);

  const wrapper = mount(
    <Provider store={store}>
      <EditorForm {...props} />
    </Provider>);

  const inputs = wrapper.find('input');
  expect(inputs.length).toBe(54);
})
