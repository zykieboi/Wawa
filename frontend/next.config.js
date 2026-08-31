const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
const configPath = path.join(__dirname, 'config.json');
if (!fs.existsSync(configPath)) {
    throw new Error('Configuration could not be found at location: ' + configPath);
}
const config = JSON.parse(fs.readFileSync(configPath).toString('utf-8'));
const publicRuntimeConfig = {
    ...(config.publicRuntimeConfig || {}),
    frontendVer: pkg.version,
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
    //analyzerMode: 'json', openAnalyzer: false,
});

module.exports = withBundleAnalyzer({
    reactStrictMode: true,
    outputFileTracingRoot: __dirname,
    turbopack: {
        root: __dirname,
    },
    async rewrites() {
        return [
            {
                source: '/apisite/:path*',
                destination: 'http://api-proxy:5200/apisite/:path*',
            },
            {
                source: '/v1/:path*',
                destination: 'http://api-proxy:5200/v1/:path*',
            },
            {
                source: '/users/inventory/list-json',
                destination: 'http://api-proxy:5200/users/inventory/list-json',
            },
            {
                source: '/user-sponsorship/:path*',
                destination: 'http://api-proxy:5200/user-sponsorship/:path*',
            },
            {
                source: '/Feeds/:path*',
                destination: 'http://api-proxy:5200/Feeds/:path*',
            },
        ];
    },
    env: {
        NEXT_PUBLIC_KORONE_PUBLIC_CONFIG: JSON.stringify(publicRuntimeConfig),
    },
    async redirects() {
        return [
            /*{
                source: '/catalog.aspx',
                destination: '/catalog',
                permanent: true,
            },*/
            /*
            {
              source: '/catalog/:id/:name',
              destination: '/redirect-item?id=:id',
              permanent: false,
            },
             */
            {
                source: '/My/Groups.aspx',
                has: [
                    {
                        type: 'query',
                        key: 'gid',
                        value: '(?<id>.*)',
                    },
                ],
                destination: '/groups/:id/--',
                permanent: true,
            },
            {
                source: '/internal/create-place',
                destination: '/places/create',
                permanent: true,
            },
            {
                source: '/support',
                destination: 'https://support.korone.one/',
                permanent: true,
            },
            // {
            //     source: '/donate/stripe',
            //     destination: 'https://buy.stripe.com/3cI6oI9dobzAeVlbLw2Ji04',
            //     permanent: false,
            // },
            // {
            //     source: '/donate/ko-fi',
            //     destination: 'https://ko-fi.com/oldroblox',
            //     permanent: false,
            // },
        ]
    }
})
