import { Lexend, Work_Sans } from 'next/font/google';

export const lexend: ReturnType<typeof Lexend> = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

export const workSans: ReturnType<typeof Work_Sans> = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-work-sans',
});
