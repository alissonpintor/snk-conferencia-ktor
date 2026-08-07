import * as Sentry from "@sentry/sveltekit";
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { TREINA_URL, PROD_URL } from '$env/static/private';
import type { Usuario } from '$lib/types/usuario';

const handleAuth: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get("SessionID");
    const usuarioCookie = event.cookies.get("Usuario");
    const serverCookie = event.cookies.get("servidor");

    // Set server locals if cookie exists
    if (serverCookie) {
        event.locals.sankhyaServer = serverCookie === 'producao' ? PROD_URL : TREINA_URL;
    } else {
        event.locals.sankhyaServer = null;
    }

    // Set user locals if cookies exist
    if (sessionId && usuarioCookie) {
        event.locals.sankhyaSessionId = sessionId;
        try {
            event.locals.usuario = JSON.parse(usuarioCookie) as Usuario;
        } catch {
            event.locals.usuario = null;
        }
    } else {
        event.locals.sankhyaSessionId = null;
        event.locals.usuario = null;
    }

    const { pathname } = event.url;

    // Define login route explicitly
    const isLoginRoute = pathname === '/login';
    // Allow assets and other specific paths if necessary (usually handled by isRemoteRequest check in old code but SvelteKit handles static assets separately)

    // If authenticated:
    if (event.locals.sankhyaSessionId) {
        // Prevent access to login page if already logged in
        if (isLoginRoute || pathname === '/') {
            throw redirect(303, '/expedicao');
        }
    } else {
        // If NOT authenticated:
        // Redirect any protected route to login
        if (!isLoginRoute) {
            throw redirect(303, '/login');
        }
    }

    return await resolve(event);
};

export const handle: Handle = sequence(
    Sentry.initCloudflareSentryHandle({
        dsn: 'https://726d923e3d8147915df3a91def63975e@o101001.ingest.us.sentry.io/4510275391717376',
        sendDefaultPii: true,
        tracesSampleRate: 1.0,
        enableLogs: true,
    }),
    Sentry.sentryHandle(),
    handleAuth
);

export const handleError = Sentry.handleErrorWithSentry();