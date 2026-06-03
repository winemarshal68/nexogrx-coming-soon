// Pages Function middleware — runs on every request before static asset serving.
// Canonical host is the apex (nexogrx.es); send www → apex with a 301.
// The .pages.dev subdomain is left reachable for previews/verification.

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === 'www.nexogrx.es') {
    url.hostname = 'nexogrx.es';
    return Response.redirect(url.toString(), 301);
  }
  return context.next();
}
