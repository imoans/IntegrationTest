import { createStore, applyMiddleware, AnyAction } from "redux";
import { createSelector } from "reselect";
import ReduxThunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { navigateInUseCase } from "./navigation";

namespace State {
  export type State = {
    user: Partial<domains.User.User>;
    session: Partial<domains.Session.Session>;
    now: Date;
  };
  export const getInitialState = (now: Date): State => ({
    user: {},
    session: {},
    now
  });
}

type Actions =
  | ReturnType<typeof actionCreators.update>
  | ReturnType<typeof actionCreators.init>;

export namespace actionCreators {
  export const update = (payload: State.State) => {
    return { type: "update", payload };
  };
  export const updateUser = (payload: State.State["user"]) => {
    return { type: "update", payload: { user: payload } };
  };
  export const updateSession = (payload: State.State["session"]) => {
    return { type: "update", payload: { session: payload } };
  };
  export const updateNow = (payload: State.State["now"]) => {
    return { type: "update", payload: { now: payload } };
  };
  export const init = (payload: Date) => {
    return { type: "init", payload };
  };
}

namespace reducers {
  export const reducer = (
    state: State.State = State.getInitialState(new Date()),
    action: AnyAction
  ) => {
    switch (action.type) {
      case "update":
        return { ...state, ...action.payload };
      case "init":
        return { state: State.getInitialState(action.payload) };
      default:
        return state;
    }
  };
}

namespace domains {
  export namespace Session {
    export type Session = {
      sessionId: string;
    };

    export const login = () => {
      return { sessionId: "xxx" };
    };
  }

  export namespace User {
    export type User = {
      name: string;
      singedAt: string;
      loggedInAt: string;
    };
    export const getInitialUser = () => {
      return {};
    };
    export const signUp = (name: string, now: Date) => {
      return {
        name,
        singedAt: now.toISOString(),
        loggedInAt: now.toISOString()
      };
    };
    export const login = (now: Date) => {
      return { loggedInAt: now.toISOString() };
    };
  }
}

export namespace useCases {
  export const signUp = (
    name: string,
    now: Date
  ): ThunkAction<
    void,
    State.State,
    {},
    ReturnType<typeof actionCreators.updateUser>
  > => dispatch => {
    dispatch(actionCreators.updateUser(domains.User.signUp(name, now)));
  };
  export const login = (
    now: Date
  ): ThunkAction<
    ReturnType<typeof navigateInUseCase>,
    State.State,
    {},
    | ReturnType<typeof actionCreators.updateUser>
    | ReturnType<typeof actionCreators.updateSession>
  > => dispatch => {
    dispatch(actionCreators.updateSession(domains.Session.login()));
    dispatch(actionCreators.updateUser(domains.User.login(now)));
    return navigateInUseCase("login");
  };
}

export namespace selectors {
  const getSession = (state: State.State) => state.session;
  const getUser = (state: State.State) => state.user;

  const isLoggedIn = createSelector(
    getSession,
    ({ sessionId }) => sessionId != null
  );
  const getLoggedInAt = createSelector(
    [isLoggedIn, getUser],
    (isLoggedIn, { loggedInAt }) => {
      if (isLoggedIn === true) return loggedInAt;
      return null;
    }
  );

  export const getRouteNameAfterLoggedIn = createSelector(
    getLoggedInAt,
    loggedInAt => {
      if (loggedInAt == null) return "loggedOut";
      if (new Date(loggedInAt).getMonth() === 0)
        return "welcomeInNewYear" as const;
      return "welcome" as const;
    }
  );
}

export const store = createStore(
  reducers.reducer,
  applyMiddleware<ThunkDispatch<State.State, {}, Actions>>(ReduxThunk)
);
