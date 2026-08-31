const fallbackPublicRuntimeConfig = {
  backend: {
    baseUrl: '',
    apiFormat: '/apisite/{0}{1}',
    proxyEnabled: false,
    flags: {},
  },
};

const parsePublicRuntimeConfig = () => {
  const rawConfig = process.env.NEXT_PUBLIC_KORONE_PUBLIC_CONFIG;
  if (typeof rawConfig !== 'string' || rawConfig.length === 0) {
    return fallbackPublicRuntimeConfig;
  }

  try {
    const parsed = JSON.parse(rawConfig);
    if (!parsed.publicRuntimeConfig) return fallbackPublicRuntimeConfig;
    return parsed.publicRuntimeConfig;
  } catch (e) {
    console.warn('Failed to parse public runtime config', e);
    return fallbackPublicRuntimeConfig;
  }
};

export const publicRuntimeConfig = parsePublicRuntimeConfig();

export default {
  publicRuntimeConfig,
};
