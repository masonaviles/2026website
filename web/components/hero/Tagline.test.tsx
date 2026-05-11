import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tagline } from "./Tagline";

describe("Tagline", () => {
  it("renders plain text", () => {
    render(<Tagline source="hello world" />);
    expect(screen.getByText(/hello world/)).toBeDefined();
  });

  it("renders **bold** tokens as <strong>", () => {
    const { container } = render(<Tagline source="hi **Apple** there" />);
    const strong = container.querySelector("strong");
    expect(strong?.textContent).toBe("Apple");
  });

  it("renders *mono* tokens as <em> with accent class", () => {
    const { container } = render(<Tagline source="hi *React* there" />);
    const em = container.querySelector("em");
    expect(em?.textContent).toBe("React");
    expect(em?.className).toContain("text-accent");
  });
});
