export default {
    gridUrl: "local",
    baseUrl: 'http://localhost:5173',
    pageLoadTimeout: 0,
    httpTimeout: 60000,
    testTimeout: 90000,
    resetCursor: false,
    sets: {
        desktop: {
            files: [
                "testplane-tests/**/*.testplane.js"
            ],
            browsers: [
                "chrome",
            ]
        }
    },
    browsers: {
        chrome: {
            headless: false,
            desiredCapabilities: {
                browserName: "chrome"
            }
        },
    },
    plugins: {
        "html-reporter/testplane": {
            // https://github.com/gemini-testing/html-reporter
            enabled: true,
            path: "testplane-report",
            defaultView: "all",
            diffMode: "3-up-scaled"
        }
    }
};
