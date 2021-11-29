const prompts = require('prompts');
const ora = require('ora-classic');
const conf = new (require('conf'))()

async function config(args) {
    await checkUserConfigurationValues(args);
    await checkUserSearchConfiguration(args);

}

async function checkUserConfigurationValues(options) {
    const questions = [];
    if (!options.apiKey) {
        questions.push({
            type: 'invisible',
            name: 'apiKey',
            message: 'Please enter your Wallhaven API Key?'
        });
    }

    if (!options.downloadDirectory) {
        questions.push({
            type: 'text',
            name: 'downloadDirectory',
            message: 'Please enter the download Directory?'
        });
    }

    if (!options.downloadLimit) {
        questions.push({
            type: 'text',
            name: 'downloadLimit',
            message: 'Please enter a download limitation?'
        });
    }

    const response = await prompts(questions);
    const spinner = ora('Storing API Key').start();
    conf.set('user-configuration', {
        ...response
    });

    spinner.succeed('Successfully stored API Key')
}

async function checkUserSearchConfiguration(options) {
    const spinner = ora('Checking for previous search configuration').start();
    const configuration = conf.get('user-search');
    if (configuration === undefined || !configuration.hasOwnProperty('query')) {
        spinner.fail('Search configuration does not exists');
        const searchResponse = await prompts({
            type: 'confirm',
            name: 'search',
            message: 'Would you like to create and save a search configuration?'
        });

        if (searchResponse.search === true) {
            await createUserSearchConfiguration();
        }
    } else {
        spinner.succeed('Search configuration found successfully');
        const searchResponse = await prompts({
            type: 'confirm',
            name: 'search',
            message: 'Would you like to change your saved search configuration?'
        });

        if (searchResponse.search === true) {
            await createUserSearchConfiguration();
        }
    }
}

export async function createUserSearchConfiguration() {
    const questions = await createSearchConfigurationPrompts();
    const response = await prompts(questions);
    const results = await processSearchConfigurationPrompts(response);
    const spinner = ora('Saving user search configuration...').start();

    conf.set('user-search', {
        ...results
    });

    spinner.succeed('Successfully updated user search configuration');
}

export async function createSearchConfigurationPrompts() {
    return [
        {
            type: 'text',
            name: 'query',
            message: 'Please enter your search query?'
        },
        {
            type: 'multiselect',
            name: 'category',
            message: 'Please select your search category?',
            choices: [
                {title: 'General', value: 'general'},
                {title: 'Anime', value: 'anime'},
                {title: 'People', value: 'people'}
            ],
            hint: '- Space to select. Return to submit'
        },
        {
            type: 'multiselect',
            name: 'purity',
            message: 'Please select your search purity?',
            choices: [
                {title: 'Safe for work', value: 'sfw'},
                {title: 'Sketchy', value: 'sketchy'},
                {title: 'Not safe for work', value: 'nsfw'}
            ],
            hint: '- Space to select. Return to submit'
        },
        {
            type: 'select',
            name: 'sorting',
            message: 'Please select your search\'s sort criteria?',
            choices: [
                {title: 'Date Added', value: 'date_added'},
                {title: 'Relevance', value: 'relevance'},
                {title: 'Randomly', value: 'random'},
                {title: 'Number of views', value: 'views'},
                {title: 'Favorites', value: 'favorites'},
                {title: 'Top List', value: 'toplist'}
            ]
        },
        {
            type: prev => prev === 'toplist' ? 'select' : null,
            name: 'topRange',
            message: 'Please select your search\'s toplist range?',
            choices: [
                {title: '1 Day ago', value: '1d'},
                {title: '3 Days ago', value: '3d'},
                {title: '1 Week ago', value: '1w'},
                {title: '1 Month ago', value: '1M'},
                {title: '3 Months ago', value: '3M'},
                {title: '6 Months ago', value: '6M'},
                {title: '1 Year ago', value: '1y'},
            ]
        },
        {
            type: 'select',
            name: 'order',
            message: 'Please select your search\'s order criteria?',
            choices: [
                {title: 'Descending', value: 'desc'},
                {title: 'Ascending', value: 'asc'},
            ]
        },
        {
            type: 'select',
            name: 'size',
            message: 'How would you like to determine the size of the wallpaper?',
            choices: [
                {title: 'Resolution', value: 'resolution'},
                {title: 'Ratio', value: 'ratio'},
            ]
        },
        {
            type: prev => prev === 'resolution' ? 'select' : null,
            name: 'resolution',
            message: 'Please select your search\'s resolution criteria?',
            choices: [
                {title: '1920x1080', value: '1920x1080'},
            ]
        },
        {
            type: prev => prev === 'ratio' ? 'select' : null,
            name: 'ratio',
            message: 'Please select your search\'s ratio criteria?',
            choices: [
                {title: '16x9', value: '16x9'},
                {title: '16x10', value: '16x10'},
            ]
        },
        {
            type: 'confirm',
            name: 'colorQuestion',
            message: 'Would you like to specify a colour for your search criteria?'
        },
        {
            type: prev => prev === true ? 'select' : null,
            name: 'colors',
            message: 'Please select your search\'s color criteria?',
            choices: [
                {title: '660000', value: '660000'},
                {title: '993399', value: '993399'},
            ]
        },
    ];
}

export async function processSearchConfigurationPrompts(response) {
    if (response.category) {
        const category = response.category;
        const generalResult = category.includes('general') ? 1 : 0;
        const animeResult = category.includes('anime') ? 1 : 0;
        const peopleResult = category.includes('people') ? 1 : 0;
        response.category = `${generalResult}${animeResult}${peopleResult}`
    }

    if (response.purity) {
        const purity = response.purity;
        const sfwResult = purity.includes('sfw') ? 1 : 0;
        const sketchyResult = purity.includes('sketchy') ? 1 : 0;
        const nsfwResult = purity.includes('nsfw') ? 1 : 0;
        response.purity = `${sfwResult}${sketchyResult}${nsfwResult}`
    }

    delete response.size
    delete response.colorQuestion;

    return response;
}

module.exports = config
