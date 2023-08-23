import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import History from "./components/ActionsHistory"; 
import { useContext } from "react";

// Mock the useContext hook and the actions for the context
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

// Mock the actions returned by the context
const mockActions = {
  getHistory: jest.fn().mockResolvedValue([]), // You can customize this for your test
};

describe("History Component", () => {
  beforeEach(() => {
    // Reset the mock before each test
    jest.clearAllMocks();
    useContext.mockReturnValue({ actions: mockActions });
  });


  it("should render history items", async () => {
    const historyData = [
      // Sample history items for testing
      {
        date: "2023-08-23",
        user_id: "1",
        actuator_id: "2",
        board_id: "3",
        state: "True",
      },
    ];

    mockActions.getHistory.mockResolvedValue(historyData);

    const { getByText, findAllByText } = render(<History />);

    expect(getByText("Actions History")).toBeInTheDocument();

    // Wait for the history items to load
    const historyItems = await findAllByText(/User Id/);

    // Check if the history items are rendered
    expect(historyItems).toHaveLength(historyData.length);
  });
});
