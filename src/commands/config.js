const prompts = require('prompts');
const ora = require('ora-classic');
const conf = new (require('conf'))()

async function config(args) {
    await checkConfigurationValues(args)
}

async function checkConfigurationValues(options) {
    const questions = [];
    if (!options.apiKey) {
        questions.push({
            type: 'text',
            name: 'apiKey',
            message: 'Please enter your Wallhaven API Key:'
        });
    }

    const response = await prompts(questions);
    const spinner = ora('Storing API Key').start();
    conf.set('user-configuration', {
        apiKey: response.apiKey
    });

    spinner.succeed('Successfully stored API Key')
}

module.exports = config
