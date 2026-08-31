module.exports = {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
    reactStrictMode: true,
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
    exportPathMap: async function (defaultPathMap) {
        Object.keys(defaultPathMap).forEach(path => {
            if (path.includes('[') && path.includes(']')) {
                delete defaultPathMap[path];
            }
        });
        return defaultPathMap;
    },
};
