describe('searching and search related activities should be working correctly', function () {
  beforeEach(function () {
    cy.fixture('users').then((user) => {
      cy.server();
      cy.login(user.username, user.password);
      cy.createTestProject().then(x => {
        assert.isNotNull(x.body.id, 'should have project id');
        cy.createTestSavedSearch(x.body.id);
      });
      cy.route('GET', '**user**').as('getUser');
      cy.route('GET', '**projects**').as('projects');
      cy.route('GET', '**get_fields**').as('getProjectFields');
      cy.route('POST', 'search_by_query').as('searcherQuery');
      cy.visit('/');
      cy.wait('@getUser');
      cy.get('[data-cy=appNavbarLoggedInUserMenu]').should('be.visible');
      cy.get('[data-cy=appNavbarSearcher]').click();

      cy.wait('@getProjectFields');
      cy.get('[data-cy=appNavbarProjectSelect]').click();
      cy.get('mat-option').contains('integration_test_project').click();
    });

  });
  it('should display search results in a table', function () {
    cy.get('[data-cy=appSearcherBuildSearchSubmit]').click();
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('.mat-paginator-navigation-next').click();
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('.mat-paginator-navigation-last').click();
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('.mat-paginator-navigation-first').click();
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('[data-cy=appSearcherTableColumnSelect]').should('be.visible').click();
    cy.get('[data-cy=matOptionSelectAll]').should('be.visible').click();
    cy.get('mat-option').contains('comment_content').click();
    cy.closeCurrentCdkOverlay();
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('mat-paginator .mat-paginator-page-size .mat-form-field').should('be.visible').click();
    cy.get('mat-option').contains('20').click();
    cy.wait('@searcherQuery');
    cy.get('.cdk-column-comment_content').should('have.length', 21);
    cy.get('.cdk-column-comment_content:first()').click();
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('.cdk-column-comment_content:first()').click();
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    // todo test appSearcherSidebarSavedSearches
  });
  it('should work when building various queries with simple and advanced search', function () {
    cy.get('app-simple-search input').click().type('tere');
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('[data-cy=appSearcherSidebarBuildSearchRadio] mat-radio-button:not(:first())').should('be.visible').click();
    cy.get('app-advanced-search > .mat-form-field ').click();
    cy.get('mat-option').contains('@timestamp').scrollIntoView().click();
    cy.closeCurrentCdkOverlay();
    cy.get('[data-cy=appSearcherSideBarBuildSearchDateConstraint] mat-form-field:first()')
      .should('be.visible')
      .click()
      .type('1/3/2016');
    cy.get('[data-cy=appSearcherSideBarBuildSearchDateConstraint] mat-form-field:not(:first())')
      .should('be.visible')
      .click()
      .type('3/24/2020');
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    // todo test appSearcherSideBarBuildSearchCloseConstraint
  });
  it('saved search should be working', function () {
    cy.get('[data-cy=appSearcherSidebarSavedSearches] .cdk-column-name:nth(1)').should('be.visible').click('left');
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('[data-cy=appSearcherSideBarBuildSearchTextConstraint] textarea').should('be.visible')
      .click()
      .clear()
      .type('tere');
    cy.wait('@searcherQuery');
    cy.get(':nth-child(1) > .cdk-column-comment_content > .ng-star-inserted').should('be.visible');
    cy.get('[data-cy=appSearcherSidebarSaveSearchButton]').should('be.visible').click();
    cy.get('mat-dialog-container input').click().type('delete_me');
    cy.route('GET', '**/searches').as('saveSearch');
    cy.get('[type="submit"]').click();
    cy.wait('@saveSearch');
    cy.get('[data-cy=appSearcherSidebarSavedSearches] .cdk-column-name').contains('delete_me').should('be.visible');
    cy.get('[data-cy=appSearcherSideBarBuildSearchCloseConstraint]').click();
    cy.wait('@searcherQuery');
    cy.get('[data-cy=appSearcherSidebarSavedSearches] .cdk-column-select:not(:first,:nth(1))').each(($el, index, $list) => {
      cy.wrap($el).click('left');
    });
    cy.get('[data-cy=appSearcherSidebarDeleteSavedSearches]').should('be.visible').click();
    cy.get('mat-dialog-container [type="submit"]').click();
    cy.get('[data-cy=appSearcherSidebarSavedSearches] .cdk-column-name').should('have.length', 2);
    // todo test appSearcherSideBarBuildSearchCloseConstraint
  });

});
