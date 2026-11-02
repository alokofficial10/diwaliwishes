const sharp = require('sharp');
const fs = require('fs');

async function buildTemplates() {
  const srcPath = 'public/assets/aistudio/image_25aaf2bd.png';
  if (!fs.existsSync(srcPath)) {
    console.error('Source reference image not found at', srcPath);
    process.exit(1);
  }

  const { width, height } = await sharp(srcPath).metadata();
  console.log(`Loaded reference image: ${width}x${height}`);

  // 1. Personalized Template
  const personalizedSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="boxVelvet" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#320919"/>
          <stop offset="50%" stop-color="#220411"/>
          <stop offset="100%" stop-color="#120208"/>
        </radialGradient>
        <radialGradient id="textOpaqueScrim" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#110309" stop-opacity="1.0"/>
          <stop offset="68%" stop-color="#13030b" stop-opacity="0.99"/>
          <stop offset="88%" stop-color="#16040d" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#120208" stop-opacity="0.0"/>
        </radialGradient>
      </defs>

      <!-- Clear interior of Sender Nameplate -->
      <rect x="350" y="623" width="244" height="54" rx="7" fill="url(#boxVelvet)" />

      <!-- Clear interior of Recipient Nameplate -->
      <rect x="362" y="716" width="220" height="54" rx="7" fill="url(#boxVelvet)" />

      <!-- Solid dark wash completely removing static Hindi text without ghosting (y=805..1140) -->
      <ellipse cx="472" cy="965" rx="335" ry="180" fill="url(#textOpaqueScrim)" />
    </svg>
  `);

  await sharp(srcPath)
    .composite([{ input: personalizedSvg, blend: 'over' }])
    .toFile('public/assets/diwali_ram_mandir_personalized.png');

  console.log('Created public/assets/diwali_ram_mandir_personalized.png');

  // 2. Universal Template
  const universalSvg = Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="boxVelvetU" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#320919"/>
          <stop offset="50%" stop-color="#220411"/>
          <stop offset="100%" stop-color="#120208"/>
        </radialGradient>
        <radialGradient id="cartoucheFillU" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#240513"/>
          <stop offset="70%" stop-color="#18040d"/>
          <stop offset="100%" stop-color="#100207"/>
        </radialGradient>
        <radialGradient id="textOpaqueScrimU" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stop-color="#110309" stop-opacity="1.0"/>
          <stop offset="68%" stop-color="#13030b" stop-opacity="0.99"/>
          <stop offset="88%" stop-color="#16040d" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#120208" stop-opacity="0.0"/>
        </radialGradient>
      </defs>

      <!-- Clear interior of Sender Nameplate -->
      <rect x="350" y="623" width="244" height="54" rx="7" fill="url(#boxVelvetU)" />

      <!-- Seal off bottom half of cartouche cleanly covering through y=802 -->
      <path d="M 238 682 C 238 792, 348 804, 472 804 C 596 804, 706 792, 706 682 Z" fill="url(#cartoucheFillU)" />
      
      <!-- Outer gold border curve -->
      <path d="M 238 682 C 238 792, 348 804, 472 804 C 596 804, 706 792, 706 682" fill="none" stroke="#F59E0B" stroke-width="2.6" />
      <path d="M 242 682 C 242 788, 350 800, 472 800 C 594 800, 702 788, 702 682" fill="none" stroke="#FEF08A" stroke-width="1.2" stroke-opacity="0.75" />

      <!-- Golden lotus bottom finial -->
      <path d="M 460 804 Q 472 818 484 804 Q 472 809 460 804 Z" fill="#F59E0B" stroke="#FEF08A" stroke-width="1" />
      <circle cx="472" cy="818" r="2.8" fill="#FEF08A" />

      <!-- Solid dark wash over static Hindi text area -->
      <ellipse cx="472" cy="970" rx="335" ry="175" fill="url(#textOpaqueScrimU)" />
    </svg>
  `);

  await sharp(srcPath)
    .composite([{ input: universalSvg, blend: 'over' }])
    .toFile('public/assets/diwali_ram_mandir_universal.png');

  console.log('Created public/assets/diwali_ram_mandir_universal.png');

  // Copy to src/assets/images as well for Vite bundling
  fs.copyFileSync('public/assets/diwali_ram_mandir_personalized.png', 'src/assets/images/diwali_ram_mandir_personalized.png');
  fs.copyFileSync('public/assets/diwali_ram_mandir_universal.png', 'src/assets/images/diwali_ram_mandir_universal.png');
  console.log('Synchronized templates to src/assets/images/');
}

buildTemplates().catch(err => {
  console.error('Error building templates:', err);
  process.exit(1);
});
