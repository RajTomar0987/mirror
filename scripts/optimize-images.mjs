import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.resolve('public/images');

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let totalOriginal = 0;
  let totalOptimized = 0;
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await processDirectory(fullPath);
      totalOriginal += sub.totalOriginal;
      totalOptimized += sub.totalOptimized;
      results.push(...sub.results);
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      const stat = fs.statSync(fullPath);
      const originalSize = stat.size;
      totalOriginal += originalSize;

      const ext = path.extname(entry.name);
      const baseName = path.basename(entry.name, ext);
      const webpPath = path.join(dir, `${baseName}.webp`);

      // 1. Generate optimized WebP
      await sharp(fullPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(webpPath);

      const webpStat = fs.statSync(webpPath);

      // 2. Also optimize JPG in place to avoid heavy fallbacks
      const tempJpg = path.join(dir, `${baseName}-temp.jpg`);
      await sharp(fullPath)
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(tempJpg);

      fs.unlinkSync(fullPath);
      fs.renameSync(tempJpg, fullPath);

      const newJpgStat = fs.statSync(fullPath);
      totalOptimized += webpStat.size;

      results.push({
        file: path.relative('public', fullPath).replace(/\\/g, '/'),
        originalKB: (originalSize / 1024).toFixed(1),
        optimizedJpgKB: (newJpgStat.size / 1024).toFixed(1),
        webpKB: (webpStat.size / 1024).toFixed(1),
        reductionPercent: ((1 - webpStat.size / originalSize) * 100).toFixed(1) + '%',
      });
    }
  }

  return { totalOriginal, totalOptimized, results };
}

async function run() {
  console.log('Optimizing all images in public/images...');
  const { totalOriginal, totalOptimized, results } = await processDirectory(IMAGES_DIR);
  console.table(results);
  console.log(`\nOriginal Total Size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized WebP Total Size: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Space Saved: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
}

run().catch(console.error);
