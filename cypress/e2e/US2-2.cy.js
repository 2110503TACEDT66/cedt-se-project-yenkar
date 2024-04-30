describe('EPIC 2', () => {
describe('US2-2', () => {
    it('visited', () => {
      cy.visit('http://localhost:3000/sign-in')
      cy.get('#emailInput').as("email")
          .click()
          .type("mataroo@amail.com");
      cy.get('#passwordInput').as("password")
          .click()
          .type("r00NaMoon");
      cy.get('Button[type="submit"]').click();
      cy.wait(2000);
      cy.visit('http://localhost:3000/mystore');
      cy.wait(1700);
      cy.visit('http://localhost:3000/mystore/662e0d3d16f0e2d2f6d5b793');
      cy.get('Button[id="editBtn"]').click();
      cy.get('input[name="model"]').clear().type("รถขยะสีเขียวสุดเท่")
      cy.wait(1700);
      cy.get('input[name="brand"]').clear().type("CHY")
      cy.wait(1700);
      cy.get('input[name="price"]').clear().type("2245")
      cy.wait(1700);
      cy.get('input[name="doors"]').clear().type("6")
      cy.wait(1700);
      cy.get('input[name="seats"]').clear().type("3")
      cy.wait(1700);
      cy.get('Button[id="radio"]').click();
    cy.get('Button[type="submit"]').click();
    cy.get('#brandData').should("contain", "CHY")
    cy.get('#priceData').should("contain", "2245")
    cy.get('#licenseData').should("contain", "LE15")
    cy.get('#doorData').should("contain", "6")
    cy.get('#seatsData').should("contain", "3")
    cy.get('#transData').should("contain", "other")
    cy.get('#cargoData').should("contain", "-")
    cy.get('#radioData').should("contain", "Yes")
    cy.get('#airData').should("contain", "No")
    })

  })
})
