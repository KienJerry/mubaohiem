import Document, { Head, Html, Main, NextScript } from 'next/document'

import { AppConfig } from '@/utils/AppConfig'

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends Document {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <Html lang={AppConfig.locale}>
        <Head />
        <link
          rel="preload"
          href="/fonts/Fontspring-DEMO-biennale-medium"
          as="font"
          type="font/woff"
          crossOrigin=""
        />

        <link rel="shortcut icon" href="/logo.png" />

        <body className="min-h-screen bg-bg">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
