module.exports = function (argv) {
    const type = argv._[1]
    switch (type) {
        case 'route':
            require('./route')(argv)
            break
        case 'comp':
        case 'component':
            require('./component')(argv)
            break
        default:
            break
    }
}
