describe('have more than 1 cars', () => {
  it('passes', () => {
    cy.viewport(1300,900)
    cy.visit('http://localhost:3000/sign-in')
    cy.get('#emailInput').as("email")
        .click()
        .type("cypress1@gmail.com");
      cy.get('#passwordInput').as("password")
        .click()
        .type("12345678");
    cy.get('Button[type="submit"]').click();
    cy.wait(2000);
    cy.visit('http://localhost:3000/mystore')
    cy.get('.flex-grow') 
      .first() // Select the first CarProviderCard (you can adjust this based on your UI)
      .within(() => {
        // Get the text content of the element containing the model
        cy.get('h1.text-2xl.font-Poppins.font-bold#model').invoke('text').as('modelText');
      });
      cy.get('@modelText').then((modelText) => {
        cy.contains(modelText.trim()).click(); // Click on the car model text
      });
    cy.contains('Delete').click()
    cy.contains('This action cannot be undone. This will permanently delete your car from our servers.').should('exist')
    cy.get('div[role="dialog"]').contains('Delete').click();
    cy.contains('@modelText').should('not.exist')

  })
})

describe('have only 1 car', () => {
  it('passes', () => {
    cy.viewport(1300,900)
    cy.visit('http://localhost:3000/sign-in')
    cy.get('#emailInput').as("email")
        .click()
        .type("cypress1@gmail.com");
      cy.get('#passwordInput').as("password")
        .click()
        .type("12345678");
    cy.get('Button[type="submit"]').click();
    cy.wait(2000);
    cy.visit('http://localhost:3000/mystore')
    cy.get('.flex-grow') // Assuming this class identifies each CarProviderCard container
      .first() // Select the first CarProviderCard (you can adjust this based on your UI)
      .within(() => {
        // Get the text content of the element containing the model
        cy.get('h1.text-2xl.font-Poppins.font-bold#model').invoke('text').as('modelText');
      });
      cy.get('@modelText').then((modelText) => {
        cy.contains(modelText.trim()).click(); // Click on the car model text
      });
    cy.contains('Delete').click()
    cy.contains('This is your last car, If you proceed your profile will not show in the store.').should('exist')
    cy.get('div[role="dialog"]').contains('Delete').click();
    cy.contains('@modelText').should('not.exist')

  })
})