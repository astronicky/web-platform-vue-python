beforeEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

it('should not accept invalid credentials', () => {
  cy.login('non-existent-user', 'wrong passsord')
    .then((resp) => {
      const {access_token, expires_in, id_token} = resp.body;
      expect(resp.status).to.equal(403);
      cy.visit(`${Cypress.env('app_url')}/integrations`);
      cy.url().should('equal', `${Cypress.env('app_url')}/login`);
    });
});

it('should successfully log into our app', () => {
  cy.login(Cypress.env('auth_username'), Cypress.env('auth_password'))
    .then((resp) => {
      const {access_token, expires_in, id_token} = resp.body;
      const auth0State = {
        nonce: '',
        state: `H_YIpUOzLUhSYi7UhYpGBOfbATp4zGid`,
      };
      const callbackUrl = `${Cypress.env('app_url')}/auth#access_token=${access_token}&scope=openid%20profile&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
      console.log(auth0State);
      cy.visit(callbackUrl, {
        onBeforeLoad(win) {
          win.localStorage[`com.auth0.auth.${auth0State.state}`] = JSON.stringify(auth0State);
        },
      });
      // Default page
      cy.url().should('equal', `${Cypress.env('app_url')}/integrations`);
    });
});
