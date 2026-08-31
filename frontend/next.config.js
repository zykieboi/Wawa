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
};
