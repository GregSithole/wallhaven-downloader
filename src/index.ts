#!/usr/bin/env node

import { download } from "./commands/download"

const { program } = require('commander')

// Command to initial download images
program
    .command('download')
    .description('Download Wallhaven images')
    .action(download)

// Command to initial configure the required details for the tool
program
    .command('config')
    .description('Configure the Wallhaven tool')
    .action(download)

program.parse()
