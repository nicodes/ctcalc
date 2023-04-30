const timeout = 10000;

describe("Calculation Test", () => {
  it("does a calculation", () => {
    // wait for astro hydration
    cy.intercept("/_astro/**").as("astro");
    const page = cy.visit("http://localhost:3000");
    cy.wait("@astro");

    page.get("input").type(1);
    page.get("select").last().select(0);
    page.get("button").click();

    page.get("[data-cy=result]", { timeout }).contains("4.039520645285086");
  });
});
