import SuperTokens from 'supertokens-auth-react';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';
import Session from 'supertokens-auth-react/recipe/session';

export function initSuperTokens() {
  if (typeof window === 'undefined') return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const isLocal = siteUrl.includes('localhost');

  SuperTokens.init({
    appInfo: {
      appName: 'Nouveau Souffle',
      apiDomain: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      websiteDomain: siteUrl,
      apiBasePath: '/api/auth',
      websiteBasePath: '/auth',
    },
    recipeList: [
      EmailPassword.init(),
      Session.init({
        ...(isLocal ? {} : { sessionTokenFrontendDomain: '.ns.thearchit3ct.xyz' }),
      }),
    ],
  });
}
