import { screen } from "src/testUtils";

describe("Swap", () => {
  it("should render", async () => {
    // renderWithProvider(<Swap />, { preloadedState: { user: { isExchangeChartDisplayed: false } } });
    expect(
      screen.getByRole("heading", {
        name: /swap/i,
      }),
    ).toBeInTheDocument();
  });
});
