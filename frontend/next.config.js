const pkg = require('./package.json');

let publicRuntimeConfig = {
    backend: {
        baseUrl: '',
        apiFormat: '/apisite/{0}{1}',
        proxyEnabled: false,
        flags: {}
    }
};

// Try to load config.json if it exists
try {
    const config = require('./config.json');
    publicRuntimeConfig = {
        ...(config.publicRuntimeConfig || {}),
        frontendVer: pkg.version,
    };
} catch (e) {
    // No config.json, use defaults
}

module.exports = {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
    reactStrictMode: true,
    publicRuntimeConfig: {
        backend: {
            baseUrl: '',
            apiFormat: '/apisite/{0}{1}',
            proxyEnabled: false,
            flags: {}
        }
    },
    env: {
        NEXT_PUBLIC_KORONE_PUBLIC_CONFIG: JSON.stringify({
            publicRuntimeConfig: {
                backend: {
                    baseUrl: '',
                    apiFormat: '/apisite/{0}{1}',
                    proxyEnabled: false,
                    flags: {}
                }
            }
        }),
    },
};
