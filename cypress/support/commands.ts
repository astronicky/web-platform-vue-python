// tslint:disable-next-line:no-namespace
declare namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
      login(username: string, password: string): Chainable<Cypress.Response<any>>;
    }
  }

Cypress.Commands.add('login', (username, password) => {
    Cypress.log({
      name: 'loginViaAuth0',
    });

    const options = {
      method: 'POST',
      url: Cypress.env('auth_url'),
      body: {
        grant_type: 'password',
        username,
        password,
        audience: Cypress.env('auth_audience'),
        // Note: for some reason, if scope value does not leading whitespace auth0 will return all scopes
        // including custom ones like read:integration, etc
        scope: Cypress.env('auth_scope'),
        client_id: Cypress.env('auth_client_id'),
        client_secret: Cypress.env('auth_client_secret'),
      },
      failOnStatusCode: false,
    };
    return cy.request(options);
});



Cypress.Commands.add('dataCy', (value) => {
    return cy.get(`[data-cy=${value}]`);
});
