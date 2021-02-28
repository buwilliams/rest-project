export default {
    ssr: false,
    target: 'static',
    head: {
        title: 'Social Media',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [
            {
                rel: 'stylesheet',
                type: 'text/css',
                href:
                    'https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic'
            },
            {
                rel: 'stylesheet',
                type: 'text/css',
                href:
                    'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css'
            },
            {
                rel: 'stylesheet',
                type: 'text/css',
                href:
                    'https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css'
            }
        ]
    },
    css: [],
    plugins: ['~/src/plugins/posthog.js'],
    components: false,
    buildModules: [],
    modules: [],
    build: {
        transpile: []
    },
    dir: {
        pages: 'src/pages',
    },
    server: {
        port: 3001,
        timing: false
    },
    buildDir: 'dist'
};