import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home (Phase 0 placeholder)", () => {
  it("renders the foundation headline", () => {
    render(<Home />);
    expect(screen.getByText(/Foundation is live/i)).toBeDefined();
  });
});
