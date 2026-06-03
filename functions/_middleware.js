// Pages Function middleware — runs on every request before static asset serving.
// Default: pass-through (no-op). Customize as needed.
//
// Common pattern: apex → www redirect.
//   if (new URL(context.request.url).hostname === 'example.com') {
//     const u = new URL(context.request.url);
//     u.hostname = 'www.example.com';
//     return Response.redirect(u.toString(), 301);
//   }

export async function onRequest(context) {
  return context.next();
}
