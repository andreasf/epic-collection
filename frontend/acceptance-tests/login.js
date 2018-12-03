const TIMEOUT = 10000;

module.exports = {
    tags: ['login'],
    'User would like to see their username': function(client) {
        client
            .url('http://localhost:3000')
            .waitForElementVisible('#login-username', TIMEOUT)
            .setValue('#login-username', process.env.SPOTIFY_LOGIN)
            .setValue('#login-password', process.env.SPOTIFY_PASSWORD)
            .click('#login-button')
            .waitForElementVisible('.main-page', TIMEOUT)
            .assert.containsText('.main-page', 'Test User')
            .end();
    }
};
