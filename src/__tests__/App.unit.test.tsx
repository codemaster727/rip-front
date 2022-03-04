import { renderRoute, screen } from "../testUtils";

describe("<App/>", () => {
  it("should render component", () => {
    renderRoute("/");
    expect(screen.getByText("Connect your wallet to stake RIP")).toBeInTheDocument();
  });
});
