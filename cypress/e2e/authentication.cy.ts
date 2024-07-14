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

describe('Melakukan autentikasi', () => {
  const name = "Random #" + Math.random() * 1000
  const email = "random." + Math.random() * 1000 + "@random.com"
  const password = "random" + Math.random() * 1000
  it('Melakukan register', () => {
    cy.visit(Cypress.env("BASE_URL") + "/register")
    cy.wait(3000)
    cy.get("input[name=name]").type(name, {force: true})
    cy.get("input[name=email]").type(email, {force: true})
    cy.get("input[name=password]").type(password, {force: true})
    cy.get("input[name=hp]").type("000000000000", {force: true})
    cy.get("input[name=address]").type(`lorem ipsum{enter}`, {force: true})
    cy.url().should("include", "/login")
  })
  it('Melakukan login', () => {
    cy.visit(Cypress.env("BASE_URL") + "/login")
    cy.wait(3000)
    cy.get("input[name=email]").type(email, {force: true})
    cy.get("input[name=password]").type(`${password}{enter}`, {force: true})
    cy.wait(3000)
    cy.get("button").should("contain", name)
  })
})


