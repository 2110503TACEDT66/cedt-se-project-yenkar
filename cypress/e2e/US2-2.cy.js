describe('US2-2_1', () => {
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
      cy.wait(1700);
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
    cy.get('Button[type="submit"]').click();
    cy.wait(3000);
    cy.get('#modelData').should("contain", "รถขยะสีเขียวสุดเท่")
    cy.get('#brandData').should("contain", "CHY")
    cy.get('#priceData').should("contain", "2245")
    cy.get('#licenseData').should("contain", "LE15")
    cy.get('#doorData').should("contain", "6")
    cy.get('#seatsData').should("contain", "3")
    cy.get('#transData').should("contain", "other")
    cy.get('#cargoData').should("contain", "-")
    cy.get('#radioData').should("contain", "No")
    cy.get('#airData').should("contain", "No")
    })
})

describe('US2-2_2-model-invalid', () => {
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
    cy.wait(1700);
    cy.get('input[name="model"]').clear().type("J")
    cy.wait(1700);
    cy.get('input[name="brand"]').clear().type("Tesla")
    cy.wait(1700);
    cy.get('input[name="price"]').clear().type("5555")
    cy.wait(1700);
    cy.get('input[name="doors"]').clear().type("7")
    cy.wait(1700);
    cy.get('input[name="seats"]').clear().type("9")
    cy.wait(1700);
    cy.get('Button[id="radio"]').click();
  cy.get('Button[type="submit"]').click();
  cy.wait(3000);
  cy.get('#modelData').should("not.contain", "J")
  cy.get('#brandData').should("contain", "CHY")
  cy.get('#priceData').should("contain", "2245")
  cy.get('#licenseData').should("contain", "LE15")
  cy.get('#doorData').should("contain", "6")
  cy.get('#seatsData').should("contain", "3")
  cy.get('#transData').should("contain", "other")
  cy.get('#cargoData').should("contain", "-")
  cy.get('#radioData').should("contain", "No")
  cy.get('#airData').should("contain", "No")
  })
})

describe('US2-2_2-brand-invalid', () => {
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
    cy.wait(1700);
    cy.get('input[name="model"]').clear().type("รถขยะสีแดงสุดเฟี้ยว")
    cy.wait(1700);
    cy.get('input[name="brand"]').clear().type("T")
    cy.wait(1700);
    cy.get('input[name="price"]').clear().type("5555")
    cy.wait(1700);
    cy.get('input[name="doors"]').clear().type("7")
    cy.wait(1700);
    cy.get('input[name="seats"]').clear().type("9")
    cy.wait(1700);
    cy.get('Button[id="radio"]').click();
  cy.get('Button[type="submit"]').click();
  cy.wait(3000);
  cy.get('#modelData').should("contain", "รถขยะสีเขียวสุดเท่")
  cy.get('#brandData').should("not.contain", "T")
  cy.get('#priceData').should("contain", "2245")
  cy.get('#licenseData').should("contain", "LE15")
  cy.get('#doorData').should("contain", "6")
  cy.get('#seatsData').should("contain", "3")
  cy.get('#transData').should("contain", "other")
  cy.get('#cargoData').should("contain", "-")
  cy.get('#radioData').should("contain", "No")
  cy.get('#airData').should("contain", "No")
  })
})

describe('US2-2_2-price-invalid', () => {
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
    cy.wait(1700);
    cy.get('input[name="model"]').clear().type("รถขยะสีแดงสุดเฟี้ยว")
    cy.wait(1700);
    cy.get('input[name="brand"]').clear().type("Tesla")
    cy.wait(1700);
    cy.get('input[name="price"]').clear().type("0")
    cy.wait(1700);
    cy.get('input[name="doors"]').clear().type("7")
    cy.wait(1700);
    cy.get('input[name="seats"]').clear().type("9")
    cy.wait(1700);
    cy.get('Button[id="radio"]').click();
  cy.get('Button[type="submit"]').click();
  cy.wait(3000);
  cy.get('#modelData').should("contain", "รถขยะสีเขียวสุดเท่")
  cy.get('#brandData').should("contain", "CHY")
  cy.get('#priceData').should("not.contain", "0")
  cy.get('#licenseData').should("contain", "LE15")
  cy.get('#doorData').should("contain", "6")
  cy.get('#seatsData').should("contain", "3")
  cy.get('#transData').should("contain", "other")
  cy.get('#cargoData').should("contain", "-")
  cy.get('#radioData').should("contain", "No")
  cy.get('#airData').should("contain", "No")
  })
})

describe('US2-2_2-doors-invalid', () => {
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
    cy.wait(1700);
    cy.get('input[name="model"]').clear().type("รถขยะสีแดงสุดเฟี้ยว")
    cy.wait(1700);
    cy.get('input[name="brand"]').clear().type("Tesla")
    cy.wait(1700);
    cy.get('input[name="price"]').clear().type("5555")
    cy.wait(1700);
    cy.get('input[name="doors"]').clear().type("-5")
    cy.wait(1700);
    cy.get('input[name="seats"]').clear().type("9")
    cy.wait(1700);
    cy.get('Button[id="radio"]').click();
  cy.get('Button[type="submit"]').click();
  cy.wait(3000);
  cy.get('#modelData').should("contain", "รถขยะสีเขียวสุดเท่")
  cy.get('#brandData').should("contain", "CHY")
  cy.get('#priceData').should("contain", "2245")
  cy.get('#licenseData').should("contain", "LE15")
  cy.get('#doorData').should("not.contain", "-5")
  cy.get('#seatsData').should("contain", "3")
  cy.get('#transData').should("contain", "other")
  cy.get('#cargoData').should("contain", "-")
  cy.get('#radioData').should("contain", "No")
  cy.get('#airData').should("contain", "No")
  })
})

describe('US2-2_2-seats-invalid', () => {
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
    cy.wait(1700);
    cy.get('input[name="model"]').clear().type("รถขยะสีแดงสุดเฟี้ยว")
    cy.wait(1700);
    cy.get('input[name="brand"]').clear().type("Tesla")
    cy.wait(1700);
    cy.get('input[name="price"]').clear().type("5555")
    cy.wait(1700);
    cy.get('input[name="doors"]').clear().type("7")
    cy.wait(1700);
    cy.get('input[name="seats"]').clear().type("-666")
    cy.wait(1700);
    cy.get('Button[id="radio"]').click();
  cy.get('Button[type="submit"]').click();
  cy.wait(3000);
  cy.get('#modelData').should("contain", "รถขยะสีเขียวสุดเท่")
  cy.get('#brandData').should("contain", "CHY")
  cy.get('#priceData').should("contain", "2245")
  cy.get('#licenseData').should("contain", "LE15")
  cy.get('#doorData').should("contain", "6")
  cy.get('#seatsData').should("not.contain", "-666")
  cy.get('#transData').should("contain", "other")
  cy.get('#cargoData').should("contain", "-")
  cy.get('#radioData').should("contain", "No")
  cy.get('#airData').should("contain", "No")
  })
})