const routeNameByUseCase = {
  login: "loggedIn" as const
};

export const navigateInUseCase = (
  useCaseName: keyof typeof routeNameByUseCase
) => {
  return routeNameByUseCase[useCaseName];
};
