import axios from 'axios';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import { parseCookies, destroyCookie } from 'nookies';
import Layout from '../components/Layout';
import 'tailwindcss/tailwind.css';
import '../public/nprogress.css';
import '../public/slick-theme.css';
import 'react-toastify/dist/ReactToastify.css';
import baseURL from '../utils/baseURL';
import { redirectUser } from '../utils/auth';
import * as gtag from '../lib/gtag';
import '../public/animatedbackground.css';

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    if (pageProps.title) {
      document.title = pageProps.title;
    } else {
      document.title = 'Elit Nexum';
    }
  }, [pageProps.title]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
      />
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Layout {...pageProps}>
            <ToastContainer />
            <Component {...pageProps} />
          </Layout>
          <ReactQueryDevtools />
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};

  const protectedRoutes =
    ctx.pathname === '/feed' ||
    ctx.pathname === '/notifications' ||
    ctx.pathname === '/posts/new' ||
    ctx.pathname === '/posts/edit/[id]' ||
    ctx.pathname === '/messages' ||
    ctx.pathname === '/settings';

  const availableForEveryone =
    ctx.pathname === '/home' ||
    ctx.pathname === '/posts/[id]' ||
    ctx.pathname === '/posts/tag/[tag]' ||
    ctx.pathname === '/[username]' ||
    ctx.pathname === '/search';

  // Se o usuário não estiver logado
  if (!token) {
    destroyCookie(ctx, 'token');
    // Redireciona para a tela de login caso o usuário tente acessar alguma rota autenticada
    protectedRoutes && redirectUser(ctx, '/');
  } else {
    try {
      const res = await axios.get(`${baseURL}/api/auth`, {
        headers: { Authorization: token },
      });
      const { user } = res.data;
      if (user && !availableForEveryone) {
        !protectedRoutes && redirectUser(ctx, '/home');
      }
      pageProps.user = user;
    } catch (err) {
      destroyCookie(ctx, 'token');
      redirectUser(ctx, '/');
    }
  }

  return { pageProps };
};

export default MyApp;