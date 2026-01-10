const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'src-tauri', 'icons');

// Create ICO header and directory
function createIco(buffers, sizes) {
    // ICO header: 6 bytes
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);      // Reserved
    header.writeUInt16LE(1, 2);      // Type (1 = ICO)
    header.writeUInt16LE(buffers.length, 4); // Number of images

    // ICO directory entries: 16 bytes each
    const dirs = [];
    let offset = 6 + (16 * buffers.length);

    for (let i = 0; i < buffers.length; i++) {
        const size = sizes[i];
        const dir = Buffer.alloc(16);
        dir.writeUInt8(size === 256 ? 0 : size, 0);  // Width (0 = 256)
        dir.writeUInt8(size === 256 ? 0 : size, 1);  // Height (0 = 256)
        dir.writeUInt8(0, 2);         // Color palette
        dir.writeUInt8(0, 3);         // Reserved
        dir.writeUInt16LE(1, 4);      // Color planes
        dir.writeUInt16LE(32, 6);     // Bits per pixel
        dir.writeUInt32LE(buffers[i].length, 8);  // Size of image data
        dir.writeUInt32LE(offset, 12);             // Offset to image data
        dirs.push(dir);
        offset += buffers[i].length;
    }

    return Buffer.concat([header, ...dirs, ...buffers]);
}

async function createIcon() {
    const svg = `
    <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00D9FF;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="256" height="256" rx="40" fill="white"/>
        <g transform="translate(30, 40)">
            <rect x="0" y="110" width="30" height="70" rx="5" fill="url(#grad)"/>
            <rect x="45" y="80" width="30" height="100" rx="5" fill="url(#grad)"/>
            <rect x="90" y="50" width="30" height="130" rx="5" fill="url(#grad)"/>
            <rect x="135" y="20" width="30" height="160" rx="5" fill="url(#grad)"/>
        </g>
    </svg>`;

    const sizes = [16, 32, 48, 256];
    const pngBuffers = [];

    for (const size of sizes) {
        const buffer = await sharp(Buffer.from(svg))
            .resize(size, size)
            .png()
            .toBuffer();

        pngBuffers.push(buffer);

        // Save individual files
        if (size === 32) {
            fs.writeFileSync(path.join(iconsDir, '32x32.png'), buffer);
            console.log('Created 32x32.png');
        } else if (size === 256) {
            fs.writeFileSync(path.join(iconsDir, '128x128@2x.png'), buffer);
            console.log('Created 128x128@2x.png');

            // Also create 128x128
            const buffer128 = await sharp(Buffer.from(svg)).resize(128, 128).png().toBuffer();
            fs.writeFileSync(path.join(iconsDir, '128x128.png'), buffer128);
            console.log('Created 128x128.png');
        }
    }

    // Create ICO
    const icoBuffer = createIco(pngBuffers, sizes);
    fs.writeFileSync(path.join(iconsDir, 'icon.ico'), icoBuffer);
    console.log('Created icon.ico');

    console.log('\nAll icons created successfully!');
}

createIcon().catch(console.error);
