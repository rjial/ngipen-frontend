describe('Testing Event', () => {
  it('Mengakses salah satu event', () => {
    cy.visit(Cypress.env("BASE_URL"))
    cy.get("body > div.px-24.space-y-10 > div.space-y-3 > div.grid.grid-cols-4.gap-4").children().should("have.length.greaterThan", 0)
    cy.get("body > div.px-24.space-y-10 > div.space-y-3 > div.grid.grid-cols-4.gap-4").children(":nth-child(1)").click()
    cy.url().should("contain", "/event/")   
  })
})

Cypress.on("uncaught:exception", (err) => {
  // Cypress and React Hydrating the document don't get along
  // for some unknown reason. Hopefully, we figure out why eventually
  // so we can remove this.
  if (
    /hydrat/i.test(err.message) ||
    /Minified React error #418/.test(err.message) ||
    /Minified React error #423/.test(err.message)
  ) {
    return false;
  }
});