const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  // Create icons directory if it doesn't exist
  const iconsDir = path.join(process.cwd(), "public", "icons");
  try {
    await fs.mkdir(iconsDir, { recursive: true });
  } catch (err) {
    console.log("Icons directory already exists");
  }

  // Generate PWA icons
  for (const size of sizes) {
    await sharp("public/dw-logo.png")
      .resize(size, size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`Generated ${size}x${size} icon`);
  }

  // Generate Apple Touch Icon (180x180)
  await sharp("public/dw-logo.png")
    .resize(180, 180, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toFile(path.join(iconsDir, "apple-touch-icon.png"));
  console.log("Generated apple-touch-icon.png");

  console.log("All icons generated successfully!");
}

generateIcons().catch(console.error);
