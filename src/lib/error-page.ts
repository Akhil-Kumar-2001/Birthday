export function renderErrorPage(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Something went wrong</title>
<style>
  html, body { height: 100%; margin: 0; }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: radial-gradient(ellipse at top, #fdf0f4 0%, #fbe6ec 60%);
    font-family: system-ui, -apple-system, sans-serif;
    color: #6b3b4d;
    text-align: center;
    padding: 24px;
  }
  .card { max-width: 420px; }
  h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
  p { color: #9b6b7d; margin: 0 0 1.5rem; }
  a {
    display: inline-block;
    padding: 0.6rem 1.5rem;
    border-radius: 999px;
    background: #ec407a;
    color: #fff;
    text-decoration: none;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="card">
    <h1>This page didn't load</h1>
    <p>Something went wrong on our end. Please try refreshing or head back home.</p>
    <a href="/">Go home</a>
  </div>
</body>
</html>`;
}
