module.exports = {
    src_folders: [
        'acceptance-tests'
    ],
    output_folder: 'reports',
    page_objects_path: '',
    selenium: {
        start_process: true,
        server_path: './node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-3.141.5.jar',
        log_path: './logs',
        port: 9515,
        cli_args: {
            'webdriver.chrome.driver': './node_modules/chromedriver/lib/chromedriver/chromedriver'
        }
    },
    test_settings: {
        default: {
            launch_url: 'http://localhost',
            selenium_port: 9515,
            selenium_host: 'localhost',
            silent: true,
            globals: {
                waitForConditionTimeout: 5000
            },
            screenshots: {
                enabled: true,
                path: './screenshots',
                on_failure: true,
                on_error: false
            },
            desiredCapabilities: {
                browserName: 'chrome',
                marionette: true,
                chromeOptions: {
                    args: [
                        'incognito',
                        'disable-extensions'
                    ]
                }
            }
        }
    }
};
