import organization from '../../fixtures/organizations/netapp2.json';
import * as aws from 'lib-test';

beforeEach(async () => {
    const env = Cypress.env();

    cy.clearLocalStorage();
    cy.clearCookies();

    cy.log('Removing cross account role and policies');
    const result = aws.teardownCrossAccountPermission(
        env.stratus_aws.account_id,
        `${organization.id}-cmi-assume-role`,
        'us-east-2',
        `${organization.id}-cmi-management`,
        env.stratus_aws.credentials
    );
    cy.log('Result:', JSON.stringify(await result));
    cy.wait(1000); // Wait for a second to give delete to propagate

    // Setup cross account permissions
    console.log(`${organization.id}-cmi-assume-role`, `${organization.id}-cmi-management`);
    const create_result = aws.setupCrossAccountPermission(
        `${organization.id}-cmi-assume-role`,
        'us-east-2',
        env.platform_aws.account_id,
        `${organization.id}-cmi-management`,
        env.stratus_aws.credentials,
        [{ Key: 'owner', Value: 'e2e_test'}]);
    cy.wait(1000); // Wait for a second to give create to propagate

});

it('should create-start and stop-delete aws integration with CUR/CE disabled', () => {
    const loadingWaitTime = 5000; // Waiting time for loading spinner to disappear. Not the best solution, but works for now
    const env = Cypress.env();
    cy.login(Cypress.env('auth_username'), Cypress.env('auth_password'))
        .then((resp) => {
            const {access_token, expires_in, id_token} = resp.body;
            const auth0State = {
                nonce: '',
                state: `H_YIpUOzLUhSYi7UhYpGBOfbATp4zGid`,
            };
            const callbackUrl = `${env.app_url}/auth#access_token=${access_token}&scope=openid%20profile&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;

            cy.visit(Cypress.env('app_url'));

            cy.visit(callbackUrl, {
                onBeforeLoad(win) {
                    win.localStorage[`com.auth0.auth.${auth0State.state}`] = JSON.stringify(auth0State);
                },
            });
            // cy.get('.spin > .message:contains("Logging into cascadeo.io")').should("not.be.visible");

            cy.url().should('equal', `${env.app_url}/integrations`);

            // Wait for all integrations to load
            cy.wait(loadingWaitTime);

            // Flaky. so I used wait instead.
            // cy.get('.spin > .message:contains("Loading")').should("not.be.visible");


            // -- CREATE INTEGRATION --
            cy.dataCy(`org-button-${organization.id}`)
                .click({force: true});

            // Make sure there is no other AWS integration before creating a new one
            cy.dataCy('status-aws').should('not.exist');

            cy.get('.service[href="/integrations/add/aws"]').should('be.visible').click();
            cy.url().should('equal', `${env.app_url}/integrations/add/aws`);

            cy.get('input[name="awsAccountId"]').should('be.visible').type(env.stratus_aws.account_id);
            cy.get('input[name="awsAccountName"]').should('be.visible').type(env.stratus_aws.account_name);
            cy.get('select[name="awsCURConfigStatus"]').should('be.visible').select('disabled');
            cy.get('input[name="s3_bucket"]').should('not.exist');
            cy.get('input[name="report_path_prefix"]').should('not.exist');
            cy.get('select[name="awsCEConfigStatus"]').should('be.visible').select('disabled');
            cy.get('input[name="ce_interval"]').should('not.exist');
            cy.get('input[name="ce_granularity"]').should('not.exist');

            cy.get('button[name="access"]').click();

            cy.get('button[name="deploy"]').click();
            cy.get('button[name="finish"]').click();

            // Wait for integrations to load
            cy.wait(loadingWaitTime);
            cy.dataCy('status-aws').its('length').should('eq', 1);

            // -- START INTEGRATION --
            // Wait 6 minutes before checking status
            cy.wait(360000);
            cy.dataCy('status-aws').click();
            cy.wait(loadingWaitTime); // That annoying loading spinner again :)
            cy.dataCy('status-aws').contains('CMI_INTEGRATION_UP');


            // -- STOP INTEGRATION --

            cy.wait(loadingWaitTime); // That annoying loading spinner again :)
            cy.dataCy('stop-button-aws').should('be.visible').click();

            // //Wait 5 minutes before checking status
            cy.wait(300000);
            cy.dataCy('status-aws').click();
            cy.wait(loadingWaitTime);
            cy.dataCy('status-aws').contains('CMI_INTEGRATION_DOWN');

            // -- DELETE INTEGRATION --
            cy.wait(loadingWaitTime);
            cy.dataCy('delete-button-aws').click();
            cy.dataCy('delete-button-confirm-aws').should('be.visible').click();
            cy.wait(loadingWaitTime);
            cy.dataCy('status-aws').should('not.exist');
    });
});

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});
