const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
for (const [name, url] of [
  ['inter', 'https://fonts.googleapis.com/css2?family=Inter:wght@100..500&display=swap'],
  ['jetbrains', 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300..400&display=swap'],
  ['noto', 'https://fonts.googleapis.com/css2?family=Noto+Sans+Symbols+2&text=%E2%99%9A%E2%99%9B%E2%99%9C%E2%99%9D%E2%99%9E%E2%99%9F&display=swap'],
]) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const css = await res.text();
  console.log('===== ' + name + ' ' + res.status + ' =====');
  console.log(css);
}
