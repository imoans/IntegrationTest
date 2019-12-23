import { store, useCases, selectors, actionCreators } from "../Redux/index";
import assert from "assert";

describe("loggedIn", () => {
  const { getRouteNameAfterLoggedIn } = selectors;
  const { login } = useCases;

  beforeEach(() => {
    store.dispatch(actionCreators.init());
  });

  it("returns loggedOut when user has not logged in", () => {
    const routeName = getRouteNameAfterLoggedIn(store.getState());
    assert.equal(routeName, "loggedOut");
  });

  it("returns welcomeInNewYear when user logs in in January", () => {
    const routeName = store.dispatch(login(new Date(2019, 0, 1)));
    assert.equal(routeName, "loggedIn");

    const routeNameAfterLoggedIn = getRouteNameAfterLoggedIn(store.getState());
    assert.equal(routeNameAfterLoggedIn, "welcomeInNewYear");
  });

  it("returns welcome when user logs in in from February to December", () => {
    const routeName = store.dispatch(login(new Date(2019, 1, 1)));
    assert.equal(routeName, "loggedIn");

    const routeNameAfterLoggedIn = getRouteNameAfterLoggedIn(store.getState());
    assert.equal(routeNameAfterLoggedIn, "welcome");
  });
});
