#!/usr/bin/env node

import { download } from "./commands/download"

const { program } = require('commander')

// Command to initial download images
program
    .command('download')
    .description('Download Wallhaven images')
    .action(download)

program.parse()
