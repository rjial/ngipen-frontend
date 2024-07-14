describe('Testing Tiket', () => {
  const email = Cypress.env("EMAIL_USERBIASA")
  const password = Cypress.env("PASS_USERBIASA")
  
  beforeEach(() => {
    cy.session(["auth"], () => {
      cy.visit(Cypress.env('BASE_URL'))
      cy.wait(3000)
      cy.visit(Cypress.env("BASE_URL") + "/login")
      cy.wait(3000)
      cy.get("input[name=email]").type(email, {force: true})
      cy.get("input[name=password]").type(`${password}{enter}`, {force: true})
      cy.wait(3000)
      cy.get("button").should("contain", "Rizal Abdul Basith")
      // const buttonUser = cy.get("body > div.px-24 > nav.flex.flex-row.w-full.justify-between.py-4 > div:nth-child(2) > div.flex.space-x-2.items-center > button > button")  
      // buttonUser.contains("Rizal Abdul Basith")
    })
  })
  it("Membuka halaman tiket", () => {
    cy.visit(Cypress.env('BASE_URL'))
    cy.wait(3000)
    const buttonUser = cy.get("body > div.px-24 > nav.flex.flex-row.w-full.justify-between.py-4 > div:nth-child(2) > div.flex.space-x-2.items-center > button > button")  
    buttonUser.contains("Rizal Abdul Basith")
    buttonUser.click()
    const dropdown = cy.get("body > div[data-radix-popper-content-wrapper] > div > a[href='/tiket']")
    dropdown.should("have.length", 1)
    dropdown.click()
    cy.url().should("contain", "/tiket")
    cy.get("body > div.px-24.space-y-4 > div > div", {timeout: 3000}).should("have.length", 1)
  })
  it('Melakukan pemesanan tiket', () => { 
    cy.visit(Cypress.env('BASE_URL'))
    cy.wait(3000)
    cy.get("body > div.px-24.space-y-10 > div.space-y-3 > div.grid.grid-cols-4.gap-4").children().should("have.length.greaterThan", 0)
    cy.get("body > div.px-24.space-y-10 > div.space-y-3 > div.grid.grid-cols-4.gap-4").children(":nth-child(1)").click()
    cy.url().should("contain", "/event/")
    const plusButton = cy.get("body > div.px-24.space-y-4 > div.flex.flex-row.justify-around.w-full > div > div.items-center.p-6.pt-0.flex.justify-between > div > svg.lucide.lucide-plus.bg-secondary.p-1.rounded-sm")
    plusButton.should("have.length", 1)
    plusButton.click()
    plusButton.click()
    const orderValue = cy.get("body > div.px-24.space-y-4 > div.flex.flex-row.justify-around.w-full > div:nth-child(1) > div.items-center.p-6.pt-0.flex.justify-between > div > span")
    orderValue.contains(2)
    const valueJenisTiket = cy.get("body > div.px-24.space-y-4 > div.flex.flex-row.justify-around.w-full > div:nth-child(1)")
    valueJenisTiket.should("have.length.gt", 0)
    const firstJenisTiket = valueJenisTiket.first()
    const firstJenisTiketFooter = firstJenisTiket.find("div.items-center.p-6.pt-0.flex.justify-between")
    firstJenisTiketFooter.should("be.visible")
    cy.wait(1000)
    const cardBuy = cy.get("body > div.px-24.space-y-4 > div.w-full > div.rounded-lg.border.bg-card.text-card-foreground.shadow-sm.flex.justify-between.p-6.items-center")
    // cy.log(cardBuy.contains())
    cardBuy.find("span.font-semibold.text-xl").should("be.visible")
    cy.get("body > div.px-24.space-y-4 > div.w-full > div.rounded-lg.border.bg-card.text-card-foreground.shadow-sm.flex.justify-between.p-6.items-center")
      .find("div.flex.space-x-3 > button")
      .contains("Beli")
      .should("be.visible")
      .click()
    // const beliButton = cardBuy.find("button").contains("Beli")
    // beliButton.should("be.visible")
    // beliButton.click()
    cy.wait(2000)
    cy.url().should("contain", "/checkout")
    // cy.get("div.px-24.space-y-4").should("be.visible")
    // cy.find("body > div.px-24.space-y-4 > div > div.col-span-8.space-y-4").should("have.length.greaterThan", 0)
    // cy.get("div.px-24.space-y-4 > div").should("be.visible")
    // cy.find("body > div.px-24.space-y-4 > div > div.col-span-2 > div > div.p-6.pt-0 > button").should("contain.value", "Beli Sekarang   ")
  })
  it("Membuka checkout & melakukan pembayaran", () => {
    cy.visit(Cypress.env('BASE_URL'))
    cy.wait(3000)   
    const buttonCheckout = cy.get("body > div.px-24 > nav.flex.flex-row.w-full.justify-between.py-4 > div:nth-child(2) > div.flex.space-x-2.items-center > div.relative > a") 
    buttonCheckout.should("be.visible")
    buttonCheckout.click()
    cy.url().should("contain", "/checkout")
    cy.get("div.px-24.space-y-4").should("be.visible")
    cy.get("div.px-24.space-y-4 > div > div.col-span-8.space-y-4").should("have.length.gt", 0)
    cy.get("div.px-24.space-y-4 > div > div.col-span-4 > div > div:nth-child(2) > button").should("be.visible")
    cy.get("div.px-24.space-y-4 > div > div.col-span-4 > div > div:nth-child(2) > button").should("contain", "Beli Sekarang")
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