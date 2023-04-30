describe("Calculation Test", () => {
  it("does a calculation", () => {
    const page = cy.visit("http://localhost:3000");
    page.get("input").first().type(1);
    page.get("select").last().select(0);
    page.get("button").click();
    page.get("[data-cy=result]", { timeout: 10000 }).should("be.visible");
  });
});
