#!/usr/bin/env node

// Simple React CLI
const argv = require('minimist')(process.argv.slice(2))
const cmd = argv._[0]
switch (cmd) {
    case 'g':
    case 'generate': 
        require('./lib/generators')(argv)
        break
    case 'new':
        require('./lib/new')(argv)
    default:
        break
}