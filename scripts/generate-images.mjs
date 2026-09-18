import fs from 'node:fs/promises';
import sharp from 'sharp';

const logo = 'public/future_minds_logo.jpg';
await fs.mkdir('public/og', { recursive: true });
await sharp(logo).resize(96, 96).webp({ quality: 90 }).toFile('public/future_minds_logo-96.webp');
await sharp(logo).resize(48, 48).png().toFile('public/favicon-48.png');
await sharp(logo).resize(180, 180).png().toFile('public/apple-touch-icon.png');
const brand = await sharp(logo).resize(310, 310).png().toBuffer();
const title = await sharp({ text: { text: '<span foreground="#10233f"><b>FUTURE MINDS</b></span>', font: 'sans 55', rgba: true } }).png().toBuffer();
const details = await sharp({ text: { text: '<span foreground="#1769ff">Robotics | AI | Coding</span>\n\n<span foreground="#40516c">Grades 1-10\nAnanth Nagar, Electronic City\nBengaluru</span>', font: 'sans 30', rgba: true, spacing: 14 } }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f7faff' } })
  .composite([{ input: brand, left: 55, top: 160 }, { input: title, left: 410, top: 145 }, { input: details, left: 410, top: 245 }])
  .jpeg({ quality: 90, mozjpeg: true }).toFile('public/og/future-minds-1200x630.jpg');
console.log('Generated optimized logo, favicons and 1200x630 sharing image.');