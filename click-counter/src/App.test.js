import Enzyme, { shallow } from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import App from "./App";

// set up enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });

/*
 * Factory function to create a shallowWrapper for the app component.
 * @function setup
 * @returns {ShallowWrapper}
 */
const setup = () => shallow(<App />);

const findByTestAttr = (wrapper, val) => wrapper.find(`[data-test='${val}']`);

test("renders without error", () => {
  const wrapper = setup();
  const appComponent = findByTestAttr(wrapper, "component-app");
  expect(appComponent.length).toBe(1);
});

test("renders counter display", () => {
  const wrapper = setup();
  const counterDisplay = findByTestAttr(wrapper, "counter-display");
  expect(counterDisplay.length).toBe(1);
});

test("counter display starts at 0", () => {
  const wrapper = setup();
  const count = findByTestAttr(wrapper, "count").text();
  expect(count).toBe("0");
});

describe("Increment Counter", () => {
  test("renders increment button", () => {
    const wrapper = setup();
    const button = findByTestAttr(wrapper, "increment-button");
    expect(button.length).toBe(1);
  });

  test("clicking button increments counter display", () => {
    const wrapper = setup();

    // find the button
    const button = findByTestAttr(wrapper, "increment-button");

    // click the button
    button.simulate("click");

    // find the display, and test that the number has been incremented
    const count = findByTestAttr(wrapper, "count").text();
    expect(count).toBe("1");
  });
});

describe("Decrement Counter", () => {
  test("renders decrement button", () => {
    const wrapper = setup();
    const button = findByTestAttr(wrapper, "decrement-button");
    expect(button.length).toBe(1);
  });

  test("Clicking decrement button decrements counter display when state is greater than 0", () => {
    const wrapper = setup();

    // click the increment button so that the counter is greater than 0
    const incButton = findByTestAttr(wrapper, "increment-button");
    incButton.simulate("click");

    // find decrement button and click
    const decButton = findByTestAttr(wrapper, "decrement-button");
    decButton.simulate("click");

    // find display and test value
    const count = findByTestAttr(wrapper, "count").text();
    expect(count).toBe("0");
  });
});

describe("error when counter goes below 0", () => {
  test("error does not show when not needed", () => {
    const wrapper = setup();
    const errorDiv = findByTestAttr(wrapper, "error-message");

    const errorHasHiddenClass = errorDiv.hasClass("hidden");
    expect(errorHasHiddenClass).toBe(true);
  });

  describe("counter is 0 and decrement button is clicked", () => {
    // using a describe here so that we can use a "beforeEach" for shared setup

    // scoping wrapper to the describe, so it can be used in beforeEach and the tests
    let wrapper;
    beforeEach(() => {
      // no need to set the counter value here; default value of 0 is good
      wrapper = setup();

      // find button and click
      const button = findByTestAttr(wrapper, "decrement-button");
      button.simulate("click");
    });

    test("error shows", () => {
      // check the class of the error message
      const errorDiv = findByTestAttr(wrapper, "error-message");
      const errorHasHiddenClass = errorDiv.hasClass("hidden");
      expect(errorHasHiddenClass).toBe(false);
    });

    test("counter still displays 0", () => {
      const count = findByTestAttr(wrapper, "count").text();
      expect(count).toBe("0");
    });

    test("clicking increment clears the error", () => {
      // find and click the increment button
      const incButton = findByTestAttr(wrapper, "increment-button");
      incButton.simulate("click");

      // check the class of the error message
      const errorDiv = findByTestAttr(wrapper, "error-message");
      const errorHasHiddenClass = errorDiv.hasClass("hidden");
      expect(errorHasHiddenClass).toBe(true);
    });
  });
});
