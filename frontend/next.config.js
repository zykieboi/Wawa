const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
const configPath = path.join(__dirname, 'config.json');
let publicRuntimeConfig = {
    backend: {
        baseUrl: '',
        apiFormat: '/apisite/{0}{1}',
        proxyEnabled: false,
        flags: {}
    }
};

if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath).toString('utf-8'));
    publicRuntimeConfig = {
        ...(config.publicRuntimeConfig || {}),
        frontendVer: pkg.version,
    };
}

module.exports = {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_KORONE_PUBLIC_CONFIG: JSON.stringify(publicRuntimeConfig),
    },
};
