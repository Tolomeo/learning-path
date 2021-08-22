import '../src/shared/globals.scss'
import { AppProps } from 'next/app'

function CustomApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
export default CustomApp
