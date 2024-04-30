describe('US2-1_1', () => {
  // describe('US2-1', () => {
    beforeEach( () => {
      cy.visit(`http://localhost:3000/sign-in`)
      cy.get('#emailInput').as("email")
        .click()
        .type("present@gmail.com");
      cy.get('#passwordInput').as("password")
        .click()
        .type("123456789");
      cy.get('Button[type="submit"]').click();
      cy.wait(2000);
      cy.visit(`http://localhost:3000/mystore`);
    });

    it('1st Car Should be listed and visible (2.1.1 Valid)', () => {
      
      cy.wait(1500);
      // cy.get('#addCar').click();
      cy.visit(`http://localhost:3000/add`);
      cy.get('#model')
        .click()
        .type("civic")
      cy.get('#brand')
        .click()
        .type("honda");
      cy.get('#plate')
        .click()
        .type('ab-123');
      cy.get('#price')
        .click()
        .type('500');
      cy.get('#door')
        .click()
        .type('4');
      cy.get('#seat')
        .click()
        .type('4');
      cy.get('button').contains('Select your car transmission type').click();
      cy.get('input[placeholder="Search"]')
        .click()
        .type('auto')
        .type('{enter}');
      cy.get('button').contains('Select your car cargo size').click();
      cy.get('input[placeholder="Search"]')
        .click()
        .type('small')
        .type('{enter}');
      cy.get('#submit').click();
      cy.visit('http://localhost:3000/mystore');
      cy.get('h1').contains('honda').as('newCar');
      expect('@newCar').to.exist;

      cy.visit('http://localhost:3000/explore');
      expect('@newCar').to.exist;
    });

    it('2nd Car Should be listed and visible (2.1.1 Valid)', () => {
      
      cy.wait(1500);
      // cy.get('#addCar').click();
      cy.visit(`http://localhost:3000/add`);
      cy.get('#model')
        .click()
        .type("civic")
      cy.get('#brand')
        .click()
        .type("h");
      cy.get('#plate')
        .click()
        .type('ab-1234');
      cy.get('#price')
        .click()
        .type('500');
      cy.get('#door')
        .click()
        .type('4');
      cy.get('#seat')
        .click()
        .type('4');
      cy.get('button').contains('Select your car transmission type').click();
      cy.get('input[placeholder="Search"]')
        .click()
        .type('auto')
        .type('{enter}');
      cy.get('button').contains('Select your car cargo size').click();
      cy.get('input[placeholder="Search"]')
        .click()
        .type('small')
        .type('{enter}');
      cy.get('#submit').click();
      cy.visit('http://localhost:3000/mystore');
      cy.get('h1').contains('honda').as('newCar');
      expect('@newCar').to.exist;

      cy.visit('http://localhost:3000/explore');
      expect('@newCar').to.exist;
    });

    
    
  // })
  
})