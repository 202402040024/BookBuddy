import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
  it("returns 0 for empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("adds prices correctly", () => {
    const items = [{ price: 100 }, { price: 200 }, { price: 50 }];
    expect(calculateTotal(items)).toBe(350);
  });

  it("handles missing price values", () => {
    const items = [{ price: 100 }, {}, { price: 25 }];
    expect(calculateTotal(items)).toBe(125);
  });
});