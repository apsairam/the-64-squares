import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve('client/src/assets/fonts');
fs.mkdirSync(dir, { recursive: true });
const files = [
  ['inter-latin.woff2', 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2'],
  ['jetbrains-latin.woff2', 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yK0BNntkaToggR7BYZbNPxDcwg.woff2'],
  ['noto-symbols.woff2', 'https://fonts.gstatic.com/l/font?kit=I_uyMoGduATTei9eI8daxVHDyfisHr71ypbya5RteuGBganWVVWNIC3GnnlS7g&skey=5cf84917987cc637&v=v25'],
];
for (const [name, url] of files) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${name}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(dir, name), buffer);
  console.log(name, `${(buffer.length / 1024).toFixed(1)} KB`);
}
