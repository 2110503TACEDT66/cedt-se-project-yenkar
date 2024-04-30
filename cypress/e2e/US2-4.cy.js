describe('View provider profile page', () => {
    it('loads', () => {
      cy.visit('http://localhost:3000/sign-in')
      cy.get('#emailInput').as("email")
          .click()
          .type("meboon@amail.com");
      cy.get('#passwordInput').as("password")
          .click()
          .type("12445678");
      cy.get('Button[type="submit"]').click();
      cy.wait(2000);
      cy.request('http://localhost:3000/explore').then((resq) => {
        expect(resq.status).to.equal(200);
      });
      cy.wait(1500);
      cy.visit('http://localhost:3000/explore');
      cy.get("div[class=' h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow ']").as('productCard');
      expect('@productCard').to.exist
    cy.get('img[alt=togglepic]').click()
    cy.contains('Auto Heaven').click()
    cy.contains('Huayra').should('exist')
    cy.contains('2021 Porsche 911 GT3').should('exist')
    cy.contains('Jesko Absolut').should('exist')
    })

})

describe('View Specific Car', () => {
    it('loads', () => {
      cy.visit('http://localhost:3000/sign-in')
      cy.get('#emailInput').as("email")
          .click()
          .type("meboon@amail.com");
      cy.get('#passwordInput').as("password")
          .click()
          .type("12445678");
      cy.get('Button[type="submit"]').click();
      cy.wait(2000);
      cy.request('http://localhost:3000/explore').then((resq) => {
        expect(resq.status).to.equal(200);
      });
      cy.wait(1500);
      cy.visit('http://localhost:3000/explore');
      cy.get("div[class=' h-[35rem] m-2 rounded-lg relative hover:scale-[102%] transition duration-200 ease-in-out active:scale-100 flex-grow ']").as('productCard');
      expect('@productCard').to.exist
    cy.get('img[alt=togglepic]').click()
    cy.contains('Auto Heaven').click()
    cy.wait(5000);
    cy.contains('Huayra').click()
    cy.wait(5000);
    cy.get('#model').contains('Huayra').should('exist');
    cy.get('#brand').contains('PAGANI').should('exist');
    cy.get('#price').contains('2000').should('exist');
    cy.get('#vrm').contains('WY23SID').should('exist');
    cy.get('#doors').contains('2').should('exist');
    cy.get('#seats').contains('2').should('exist');
    cy.get('#transmission').contains('auto').should('exist');
    cy.get('#cargo').contains('small').should('exist');
    cy.get('#radio').contains('Yes').should('exist');
    cy.get('#air').contains('Yes').should('exist');
    })

})



