const conf = new (require('conf'))()
const ora = require('ora-classic');
const config = require('./config');
const { createSearchConfigurationPrompts, processSearchConfigurationPrompts} = require('./config');
const prompts = require('prompts');
const axios = require('axios');


async function download() {
    await checkUserConfiguration();
}

async function checkUserConfiguration() {
    const spinner = ora('Checking for user configuration...').start();
    const userConfiguration = conf.get('user-configuration');

    if (userConfiguration === undefined || !userConfiguration.hasOwnProperty('apiKey')) {
        spinner.fail('You currently don\'t have an API Key stored.');
        await config({});
        spinner.succeed(`Successfully created configuration`);
    } else {
        spinner.succeed(`Successfully found user configuration`);
    }

    spinner.start('Checking for user search configuration');
    const searchConfiguration = await checkUserSavedSearch();

    spinner.succeed('Successfully processed search configuration');

    await getDownloadList(userConfiguration, searchConfiguration);

}

async function checkUserSavedSearch() {
    const searchConfiguration = conf.get('user-search');
    if (searchConfiguration === undefined || !searchConfiguration.hasOwnProperty('query')) {
        const questions = await createSearchConfigurationPrompts();
        const response = await prompts(questions);
        const results = await processSearchConfigurationPrompts(response);

        const searchResponse = await prompts({
            type: 'confirm',
            name: 'search',
            message: 'Would you like to save this search configuration?'
        });

        if (searchResponse) {
            conf.set('user-search', {
                ...results
            });

            return conf.get('user-search');
        } else {
            return results;
        }
    } else {
        return conf.get('user-search');
    }
}

async function getDownloadList(userConfiguration, searchConfiguration) {
    const params = await setDownloadParameters(userConfiguration, searchConfiguration);
    const result = await axios.get(`https://wallhaven.cc/api/v1/search`, {
        params: params
    });

    console.log(result.data);
}

async function setDownloadParameters(userConfiguration, searchConfiguration) {
    let params = {};

    params.apikey = userConfiguration.apiKey;
    params.q = searchConfiguration.query;
    params.categories = searchConfiguration.category;
    params.purity = searchConfiguration.purity;
    params.sorting = searchConfiguration.sorting;
    params.order = searchConfiguration.order;

    if (searchConfiguration.sorting === 'toplist') {
        params.topRange = searchConfiguration.topRange;
    }

    if (searchConfiguration.ratio) {
        params.ratio = searchConfiguration.ratio;
    }

    if (searchConfiguration.resolution) {
        params.resolutions = searchConfiguration.resolution;
    }

    return params;
}


module.exports = download
