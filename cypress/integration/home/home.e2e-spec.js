describe('/health and project table tests', function () {
  beforeEach(function () {
    cy.fixture('users').then((user) => {
      cy.login(user.username, user.password);
      cy.server();
      cy.route('GET', 'health').as('health');
      cy.route('GET', 'user').as('user');
      cy.route('GET', 'users').as('getUsers');
      cy.route('GET', 'get_indices').as('getIndices');
      cy.visit('/');
      cy.wait('@user');
      cy.get('[data-cy=appNavbarLoggedInUserMenu]').should('be.visible');
    });

  });
  it('should check if /health endpoint stats are visible', function () {
    cy.wait('@health', {timeout: 30000});
    cy.get('[data-cy=appHomeHealth]').should('be.visible');
  });
  it('should be able to create a project', function () {
    cy.get('[data-cy=appProjectCreateProject]').should('be.visible').click();
    cy.wait('@getUsers');
    cy.wait('@getIndices');
    cy.get('[data-cy=appProjectCreateDialogTitle]').then((projTitle => {
      cy.wrap(projTitle).should('have.class', 'mat-focused').type('b').find('input').clear();
      cy.matFormFieldShouldHaveError(projTitle, 'required');
      cy.wrap(projTitle).type('testProject');
    }));
    cy.get('[data-cy=appProjectCreateDialogUsers]').click().then((projUsers => {
      cy.wrap(projUsers).should('have.class', 'mat-focused');
      // todo currently best way to close a mat select?
      cy.wait(500);
      cy.closeCurrentCdkOverlay();
      cy.matFormFieldShouldHaveError(projUsers, 'required');
      cy.wrap(projUsers).click();
      cy.fixture('users').then((user) => {
        cy.get('.mat-option-text').contains(user.username).should('be.visible').click();
      });
      cy.closeCurrentCdkOverlay();
      cy.wrap(projUsers).find('mat-error').should('have.length', 0);
    }));
    cy.get('[data-cy=appProjectCreateDialogIndices]').click().then((projIndices => {
      cy.wrap(projIndices).should('have.class', 'mat-focused');
      cy.get('input.mat-select-search-input:last').type('texta_test_index');
      cy.get('.mat-option-text:first').contains('texta_test_index').should('be.visible').click(); // todo texta test index
      cy.closeCurrentCdkOverlay();
    }));
    cy.route('GET', 'projects').as('getProjects');
    cy.route('DELETE', '**/projects/**').as('deleteProjects');
    cy.route('POST', 'projects').as('postProjects');
    cy.get('[data-cy=appProjectCreateDialogSubmit]').should('be.visible').click();
    cy.wait('@postProjects');
    cy.wait('@getProjects');
    cy.wait(100); // projectStore, update table
    cy.get('tbody > :nth-child(1) > .cdk-column-title').contains('testProject');
    cy.get(':nth-child(1) > .cdk-column-Modify > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click();
    cy.get(':nth-child(1) > .mat-focus-indicator.ng-star-inserted').should('be.visible').contains('Delete').click();
    cy.get('[data-cy=appConfirmDialogSubmit]').should('be.visible').click();
    cy.wait('@deleteProjects').then(x=>{
      cy.wait('@getProjects');
    });
  });
});
