describe('regex-taggers should work', function () {
  beforeEach(function () {
    cy.wait(100);
    cy.fixture('users').then((user) => {
      cy.login(user.username, user.password);
      cy.createTestProject().then(x => {
        assert.isNotNull(x.body.id, 'should have project id');
        cy.wrap(x.body.id).as('projectId');
        cy.intercept('GET', '**user**').as('getUser');
        cy.intercept('GET', '**get_fields**').as('getProjectIndices');
        cy.intercept('GET', '**/regex_taggers/**').as('getRegexTaggers');
        cy.intercept('POST', '**/regex_taggers/').as('postRegexTaggers');
        cy.intercept('POST', '**/regex_taggers/multitag_text/').as('postMultiTag');
        cy.intercept('POST', '**/tag_random_doc/').as('postTagRandomDoc');
        cy.intercept('POST', '**/tag_text/').as('postTagText');
        cy.intercept('POST', '**/apply_to_index/').as('postApplyToIndices');
        cy.intercept('POST', '**/duplicate/').as('postDuplicateTagger');
      });
    });
  });

  function initPage() {
    cy.visit('/regex-taggers');
    cy.wait('@getProjectIndices');
    cy.wait('@getRegexTaggers');
  }

  function tagRandomDoc() {
    cy.get('.cdk-column-actions:nth(1)').should('be.visible').click('left');
    cy.get('[data-cy=appRegexTaggerMenuTagRandomDoc]').should('be.visible').click();
    cy.get('[data-cy=appRegexTaggerTagRandomDocDialogfields]').click().then((fields => {
      cy.wrap(fields).should('have.class', 'mat-focused');
      cy.closeCurrentCdkOverlay();
      cy.matFormFieldShouldHaveError(fields, 'required');
      cy.wrap(fields).click();
      cy.get('.mat-option-text').contains('comment_content').should('be.visible').click();
      cy.closeCurrentCdkOverlay();
      cy.wrap(fields).find('mat-error').should('have.length', 0)
    }));
    cy.wrap([0, 0, 0, 0, 0]).each(y => { // hack to wait for task to complete
      cy.get('.mat-dialog-container [type="submit"]').should('be.visible').click();
      cy.wait('@postTagRandomDoc').then(resp => {
        cy.wrap(resp).its('response.statusCode').should('eq', 200);
        if (resp?.response?.body?.result) {
          cy.get('app-fact-chip').should('be.visible');
        } else {
          cy.get('[data-cy=appRegexTaggerTagRandomDocDialogIndices]').should('be.visible');
        }
      });
    })
    cy.get('[data-cy=appRegexTaggerTagRandomDocDialogClose]').click();

  }


  function tagText() {
    cy.get('.cdk-column-actions:nth(1)').should('be.visible').click('left');
    cy.get('[data-cy=appRegexTaggerMenuTagText]').should('be.visible').click();
    cy.get('[data-cy=appRegexTaggerTagTextDialogText] input:first()').should('be.visible').click()
      .clear().invoke('val', 'tere Ooot, misasi see võõrast aiast maasikate võtmine on, kui ta vargus pole???').trigger('change');
    cy.get('[data-cy=appRegexTaggerTagTextDialogText]').click().type(' ');

    cy.get('.mat-dialog-container [type="submit"]').should('be.visible').click();


    cy.wait('@postTagText').then(intercepted => {
      cy.wrap(intercepted).its('response.statusCode').should('eq', 200);
      if (intercepted?.response?.body?.result) {
        cy.get('app-fact-chip').should('be.visible');
      }
    })
    cy.get('[data-cy=appRegexTaggerTagTextDialogClose]').click();
  }

  function applyToIndices(){
    cy.get('.cdk-column-actions:nth(1)').click('left')
    cy.get('[data-cy=appRegexTaggerMenuApplyToIndices]').should('be.visible').click();
    cy.get('[data-cy=appRegexTaggerApplyDialogDesc]').then((desc => {
      cy.wrap(desc).should('have.class', 'mat-focused').type('b').find('input').clear();
      cy.matFormFieldShouldHaveError(desc, 'required');
      cy.wrap(desc).type('testApply');
    }));
    cy.get('[data-cy=appRegexTaggerApplyDialogFields]').click().then((fields => {
      cy.wrap(fields).should('have.class', 'mat-focused');
      cy.closeCurrentCdkOverlay();
      cy.matFormFieldShouldHaveError(fields, 'required');
      cy.wrap(fields).click();
      cy.get('.mat-option-text').contains(new RegExp(' comment_content ', '')).click();
      cy.closeCurrentCdkOverlay();
      cy.wrap(fields).find('mat-error').should('have.length', 0)
    }));
    cy.get('textarea').click().then(x=>{
      cy.fixture('sample_query').then(sampleDoc => {
        cy.wrap(x).invoke('val', JSON.stringify(sampleDoc)).trigger('change');
      });
    })
    cy.get('[data-cy=appRegexTaggerApplyDialogFactName]').click().then((fact => {
      cy.wrap(fact).should('have.class', 'mat-focused').type('b').find('input').clear();
      cy.matFormFieldShouldHaveError(fact, 'required');
      cy.wrap(fact).type('XXX');
    }));
    cy.get('[data-cy=appRegexTaggerApplyDialogSubmit]').should('be.visible').click();
    cy.wait('@postApplyToIndices').then(created=>{
      expect(created.response.statusCode).to.eq(201);
    });
    cy.wait('@getRegexTaggers');
  }

  it('should be able to create a new regex-tagger', function () {
    // create clustering
    initPage();
    cy.get('[data-cy=appRegexTaggerCreateBtn]').click();
    cy.get('[data-cy=appRegexTaggerCreateDialogDesc]').then((desc => {
      cy.wrap(desc).should('have.class', 'mat-focused').type('b').find('input').clear();
      cy.matFormFieldShouldHaveError(desc, 'required');
      cy.wrap(desc).type('test');
    }));
    cy.get('[data-cy=appRegexTaggerCreateDialogLexicon]').click().then((desc => {
      cy.wrap(desc).should('have.class', 'mat-focused').type('b').find('textarea').clear();
      cy.matFormFieldShouldHaveError(desc, 'required');
      cy.wrap(desc).type('a');
    }));

    cy.get('[data-cy=appRegexTaggerCreateDialogSubmit]').click();
    cy.wait('@postRegexTaggers').its('response.statusCode').should('eq', 201);
    cy.wait('@getRegexTaggers');
    cy.get('[data-cy=appRegexTaggerMultiTagBtn]').click();
    cy.wait('@getRegexTaggers');
    cy.get('[data-cy=appRegexTaggerMultiTagDialogText]').type('test');
    cy.get('[data-cy=appRegexTaggerMultiTagDialogSubmit]').click();
    cy.wait('@postMultiTag').its('response.statusCode').should('eq', 200);
    cy.get('[data-cy=appRegexTaggerMultiTagDialogClose]').click();

    tagRandomDoc();
    tagText();
    applyToIndices();

    cy.get('.cdk-column-actions:nth(1)').click('left');
    cy.get('[data-cy=appRegexTaggerMenuDuplicate]').click();
    cy.wait('@postDuplicateTagger').its('response.statusCode').should('eq', 200);
    cy.wait('@getRegexTaggers').its('response.body.count').should('eq', 2);

    cy.get('.cdk-column-actions:nth(1)').click('left');
    cy.get('[data-cy=appRegexTaggerMenuDelete]').click();
    cy.get('.mat-dialog-container [type="submit"]').should('be.visible').click();
    cy.get('.cdk-column-actions').should('have.length', 2);

  });
});
