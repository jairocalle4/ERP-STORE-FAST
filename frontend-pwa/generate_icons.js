const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImagePath = path.join(__dirname, 'public', 'store-icon.png');
const publicDir = path.join(__dirname, 'public');
const appDir = path.join(__dirname, 'app');

async function generateIcons() {
    try {
        console.log('Generating favicon-16x16.png...');
        await sharp(inputImagePath).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));

        console.log('Generating favicon-32x32.png...');
        await sharp(inputImagePath).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));

        console.log('Generating apple-touch-icon.png...');
        await sharp(inputImagePath).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));

        console.log('Generating icon-192x192.png...');
        await sharp(inputImagePath).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192x192.png'));

        console.log('Generating icon-512x512.png...');
        await sharp(inputImagePath).resize(512, 512).png().toFile(path.join(publicDir, 'icon-512x512.png'));

        // Update favicon.ico (using 32x32 size as typical fallback)
        console.log('Updating favicon.ico...');
        const buf = await sharp(inputImagePath).resize(32, 32).png().toBuffer();
        // A simple approach is just saving the png data as .ico (browsers support it well)
        // Or just save it as favicon.ico in both places
        fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buf);
        fs.writeFileSync(path.join(appDir, 'favicon.ico'), buf);

        console.log('Removing old Vercel/Next templates (if any)...');
        const oldFiles = ['globe.svg', 'file.svg', 'window.svg', 'next.svg', 'vercel.svg'];
        oldFiles.forEach(file => {
            const p = path.join(publicDir, file);
            if (fs.existsSync(p)) fs.unlinkSync(p);
        });

        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
}

generateIcons();
