const { program } = require('commander');
const download = require('./commands/download');
const config = require('./commands/config');

program
    .command('config')
    .description('Setup configuration for Wallhaven Downloader')
    .action(config)

program
    .command('download')
    .description('Download Wallpapers from Wallhaven')
    .action(download)

export function cli(args) {
    program.parse();
}
