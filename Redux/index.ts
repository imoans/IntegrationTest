import { createStore, applyMiddleware, AnyAction } from "redux";
import { createSelector } from "reselect";
import ReduxThunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import { navigateInUseCase } from "./navigation";

type State = { sessionId?: string; loggedInAt?: string };
type Actions =
  | ReturnType<typeof actionCreators.update>
  | ReturnType<typeof actionCreators.init>;

export namespace actionCreators {
  export const update = (payload: State) => {
    return { type: "update", payload };
  };
  export const init = () => {
    return { type: "init" };
  };
}

namespace reducers {
  const initialState = {};

  export const reducer = (state: State = initialState, action: AnyAction) => {
    switch (action.type) {
      case "update":
        return { ...state, ...action.payload };
      case "init":
        return { state: initialState };
      default:
        return state;
    }
  };
}

export namespace useCases {
  export const login = (
    now: Date
  ): ThunkAction<
    ReturnType<typeof navigateInUseCase>,
    State,
    {},
    Actions
  > => dispatch => {
    dispatch(
      actionCreators.update({
        sessionId: "xxx",
        loggedInAt: now.toISOString()
      })
    );
    return navigateInUseCase("login");
  };
}

export namespace selectors {
  const isLoggedIn = createSelector(
    (state: State) => state.sessionId,
    sessionId => sessionId != null
  );
  const getLoggedInAt = createSelector(
    [isLoggedIn, (state: State) => state.loggedInAt],
    (isLoggedIn, loggedInAt) => {
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
  applyMiddleware<ThunkDispatch<State, {}, Actions>>(ReduxThunk)
);
