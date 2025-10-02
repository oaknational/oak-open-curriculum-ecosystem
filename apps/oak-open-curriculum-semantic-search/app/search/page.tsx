import { redirect } from 'next/navigation';

/**
 * `/search` is retained for legacy navigation but now redirects to the landing page.
 */
export default function SearchRedirect(): never {
  redirect('/');
}
