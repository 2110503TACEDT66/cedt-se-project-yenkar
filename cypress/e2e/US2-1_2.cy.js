describe("US2-1_2 (Invalid Input)", () => {
    // before( () => {
        
    //   });

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
        cy.wait(1500);
        cy.visit(`http://localhost:3000/add`);
        cy.wait(1500);
      });
    
    
      it('Should be not listed (All Blank Input)', () => {
        cy.get('#submit').click();

        cy.get('p').contains('Your model must be at least 2 characters long').should('exist');

        cy.get('p').contains('Your brand must be at least 2 characters long').should('exist');

        cy.get('p').contains('Expected number, received nan').should('exist');
    
        // cy.get('div').contains('Failed to create reservation').as('reserveFailed');
        // expect('@reserveFailed').to.exist();
    
        cy.visit('http://localhost:3000/mystore');
        cy.wait(1500);
        cy.get('h1').contains('honda').should('not.exist');
        

        cy.visit('http://localhost:3000/explore');
        cy.get('h1').contains('honda').should('not.exist');
      });

    it('Should be not listed (Price Not valid)', () => {
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
          .type('-1');
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

        cy.get('p').contains('Number must be greater than 0').as('invalidPrice');
        expect('@invalidPrice').to.exist;
    
        // cy.get('div').contains('Failed to create reservation').as('reserveFailed');
        // expect('@reserveFailed').to.exist();
    
        // cy.visit('http://localhost:3000/mystore');
        // cy.wait(1500);
        // cy.get('h1').contains('honda').should('not.exist');
        

        // cy.visit('http://localhost:3000/explore');
        // cy.get('h1').contains('honda').should('not.exist');
      });

      it('Should be not listed (Door Not valid)', () => {
        cy.wait(1500);
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
          .type('-1');
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

        cy.get('p').contains('Number must be greater than 0').as('invalidDoor');
        expect('@invalidDoor').to.exist;
    
        cy.visit('http://localhost:3000/mystore');
        cy.wait(1500);
        cy.get('h1').contains('honda').should('not.exist');
        

        cy.visit('http://localhost:3000/explore');
        cy.get('h1').contains('honda').should('not.exist');
      })

      it('Should be not listed (Seat Not valid)', () => {
        cy.wait(1500);
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
          .type('-1');
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

        cy.get('p').contains('Number must be greater than 0').as('invalidSeat');
        expect('@invalidSeat').to.exist;
    
        cy.visit('http://localhost:3000/mystore');
        cy.wait(1500);
        cy.get('h1').contains('honda').should('not.exist');
        

        cy.visit('http://localhost:3000/explore');
        cy.get('h1').contains('honda').should('not.exist');
      })
});
