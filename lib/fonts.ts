import localFont from 'next/font/local'

export const geistMono = localFont({
  src: [
    {
      path: '../public/fonts/GeistMono-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistMono-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
})
