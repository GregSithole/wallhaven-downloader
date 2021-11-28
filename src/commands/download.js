const conf = new (require('conf'))()
const ora = require('ora-classic');
const config = require('./config');


async function download() {
    const spinner = ora('Beginning to Download...').start();
    const configuration = conf.get('user-configuration');

    if (configuration === undefined || !configuration.hasOwnProperty('apiKey')) {
        spinner.fail('You currently don\'t have an API Key stored.');
        await config({});
    }
}

module.exports = download
