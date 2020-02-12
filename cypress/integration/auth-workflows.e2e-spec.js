describe('register and login workflows', function () {
  beforeEach(function () {
    cy.visit('/');
    cy.fixture('users').as('usersJSON');
  });
  it('Should display a popup on navigation and be able to log in and logout', function () {
    cy.get('[data-cy=appSharedLoginDialogUsername]').type(this.usersJSON.username);
    cy.get('[data-cy=appSharedLoginDialogPassword]').type(this.usersJSON.password);
    cy.get('[data-cy=appSharedLoginDialogSubmit]').click();
    cy.get('[data-cy=appNavbarLoggedInUserMenu]').should('be.visible').click();
    cy.get('[data-cy=appNavbarlogOutMenuItem]').should('be.visible').click();
  });

  it('Should display error messages on failed logins', function () {
    cy.get('[data-cy=appSharedLoginDialogUsername]').type('23523');
    cy.get('[data-cy=appSharedLoginDialogPassword]').type('235235');
    cy.get('[data-cy=appSharedLoginDialogSubmit]').click();
    cy.get('[data-cy=appSharedLoginDialogLoginError]').should('be.visible');
  });

  it('Register should be working correctly (displaying errors etc)', function () {
    // we get login dialog popup when navigating so close it
    cy.get('[data-cy=appSharedLoginDialogClose]').should('be.visible').click();
    cy.get('[data-cy=appNavbarRegister]').should('be.visible').click();

    // username validators
    cy.get('[data-cy=appSharedRegisterDialogUsername]').then((username) => {
      cy.wrap(username).should('have.class', 'mat-focused');
      cy.get('[data-cy=appSharedRegisterDialogEmail]').click();// remove focus
      cy.wrap(username)
        .find('mat-error')
        .should('be.visible')
        .find('strong')
        .contains('required');
      cy.wrap(username).type('tesgtutser');
      cy.wrap(username).should('have.class', 'ng-valid');
    });
    // email validators
    cy.get('[data-cy=appSharedRegisterDialogEmail]').then((email) => {
      cy.wrap(email).type('test');
      cy.wrap(email)
        .find('mat-error')
        .should('be.visible')
        .find('strong')
        .contains('invalid');
      cy.wrap(email).type('@mail.com').should('have.class', 'ng-valid');
    });

    // password validators
    cy.get('[data-cy=appSharedRegisterDialogPassword1]').then((pw1) => {
      cy.wrap(pw1).click();
      cy.get('[data-cy=appSharedRegisterDialogEmail]').click();
      cy.wrap(pw1)
        .find('mat-error')
        .should('be.visible')
        .find('strong')
        .contains('required');
      cy.wrap(pw1).type('test')
        .find('mat-error')
        .should('be.visible')
        .find('strong')
        .contains('8'); //minlength 8
      cy.wrap(pw1).type('test').should('have.class', 'ng-valid');
    });

    cy.get('[data-cy=appSharedRegisterDialogPassword2]').then((pw2) => {
      cy.wrap(pw2).click().type('test');
      cy.wrap(pw2)
        .find('mat-error')
        .should('be.visible')
        .find('strong')
        .contains('match');
      cy.wrap(pw2).type('test').should('have.class', 'ng-valid');
    });
    // should display backend errors (too common etc)
    cy.get('[data-cy=appSharedRegisterDialogSubmit]').click();
    cy.get('[data-cy=appSharedRegisterDialogError').contains('common');
    cy.get('[data-cy=appSharedRegisterDialogPassword1]').type('35');
    cy.get('[data-cy=appSharedRegisterDialogPassword2]').type('35');
    cy.server();
    cy.route({
      method: 'POST',
      url: '**/rest-auth/registration/',
      response: {username: 'A user with that username already exists.'},
      status: 400
    });
    cy.get('[data-cy=appSharedRegisterDialogSubmit]').click();
    cy.get('[data-cy=appSharedRegisterDialogError]').contains('username');
    cy.server({enable: false});

    cy.get('[data-cy=appSharedRegisterDialogSubmit]').click();
    cy.get('[data-cy=appNavbarLoggedInUserMenu]').should('be.visible');// register successful, logged in
  })
});
