// a
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
        // Remove all dynamic routes
        Object.keys(defaultPathMap).forEach(path => {
            if (path.includes('[') && path.includes(']')) {
                delete defaultPathMap[path];
            }
        });
        
        // Remove pages with getInitialProps that fail during export
        const excludePages = [
            '/Forum/ShowPost.aspx',
            '/User.aspx',
            '/develop',
            '/donate',
            '/download',
            '/Catalog.aspx',
            '/trades',
        ];
        excludePages.forEach(p => delete defaultPathMap[p]);
        
        return defaultPathMap;
    },
};
