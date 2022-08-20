import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Link from "next/link";
import styled from 'styled-components'
import { useRouter } from 'next/router';
import { QueryClient, QueryClientProvider } from 'react-query';

const Footer = styled.footer`
  width: 100%;
  background-color: #CECFF9;
  color: #151951;
  font-size: 20px;
  padding: 8px 24px 24px;
  position: absolute;
  bottom: 0;

  a {
    padding: 8px 24px;
    display: inline-block;
    min-width: 150px;
    text-align: center;

    &.selected {
      background: #babad4;
      border-radius: 10px;
    }
  }
`

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const queryClient = new QueryClient()

  return <>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
    <Footer>
      <Link
        href="/"
      >
        <a className={router.pathname === "/" ? "selected" : ""}>Guide</a>
      </Link>
      <Link
        href="/streaming"
      >
          <a className={router.pathname === "/streaming" ? "selected" : ""}>Streaming</a>
        </Link>
      <Link
        href="/watchlist"
      >
          <a className={router.pathname === "/watchlist" ? "selected" : ""}>Watchlist</a>
        </Link>
    </Footer>
  </>
}

export default MyApp
