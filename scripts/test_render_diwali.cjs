const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');

// Register system Noto Devanagari fonts
try {
  GlobalFonts.registerFromPath('/usr/share/fonts/truetype/noto/NotoSerifDevanagari-Bold.ttf', 'NotoSerifDevanagari');
  GlobalFonts.registerFromPath('/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf', 'NotoSansDevanagari');
} catch (e) {
  console.log('Font registration notice:', e.message);
}

// Function to render Diwali card matching the browser implementation
async function renderDiwaliPoster({ senderName, recipientName, recipientMode }) {
  const width = 1024;
  const height = 1536;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const isSpecial = recipientMode === 'special' && Boolean(recipientName);
  const templatePath = isSpecial
    ? 'public/assets/diwali_ram_mandir_personalized.png'
    : 'public/assets/diwali_ram_mandir_universal.png';

  const baseImage = await loadImage(templatePath);
  ctx.drawImage(baseImage, 0, 0, width, height);

  const cx = 472; // Optical center of the cartouche and sunset opening

  // 1. SENDER NAME (Inside Upper Box, cy = 650)
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Responsive font sizing for sender name
  let sFontSize = 32;
  const fontFamilies = '"Rozha One", "Yatra One", "NotoSerifDevanagari", "Cinzel Decorative", "FreeSerif", serif';
  ctx.font = `700 ${sFontSize}px ${fontFamilies}`;
  let sWidth = ctx.measureText(senderName).width;
  while (sWidth > 220 && sFontSize > 16) {
    sFontSize -= 1.5;
    ctx.font = `700 ${sFontSize}px ${fontFamilies}`;
    sWidth = ctx.measureText(senderName).width;
  }

  // If text is still longer than 220px, expand inner plaque with gold trim
  if (sWidth > 220) {
    const expandW = sWidth + 24;
    ctx.save();
    ctx.fillStyle = '#1c0510';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(cx - expandW / 2, 624, expandW, 52, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Deep shadow for relief
  ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;

  // Rich 3D embossed gold gradient
  const sGrad = ctx.createLinearGradient(cx, 630, cx, 670);
  sGrad.addColorStop(0, '#FFFFFF');
  sGrad.addColorStop(0.25, '#FEF9C3');
  sGrad.addColorStop(0.65, '#FDE047');
  sGrad.addColorStop(1, '#D97706');

  ctx.fillStyle = sGrad;
  ctx.fillText(senderName, cx, 650);

  // Delicate highlight bevel stroke
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.lineWidth = 0.8;
  ctx.strokeText(senderName, cx, 650);
  ctx.restore();

  if (isSpecial && recipientName) {
    // 2. RECIPIENT NAME (Inside Lower Box, cy = 743)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let rFontSize = 29;
    ctx.font = `700 ${rFontSize}px ${fontFamilies}`;
    let rWidth = ctx.measureText(recipientName).width;
    while (rWidth > 200 && rFontSize > 15) {
      rFontSize -= 1.5;
      ctx.font = `700 ${rFontSize}px ${fontFamilies}`;
      rWidth = ctx.measureText(recipientName).width;
    }

    if (rWidth > 200) {
      const expandW = rWidth + 22;
      ctx.save();
      ctx.fillStyle = '#1c0510';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.roundRect(cx - expandW / 2, 717, expandW, 52, 6);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.shadowColor = 'rgba(0, 0, 0, 0.98)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    const rGrad = ctx.createLinearGradient(cx, 725, cx, 765);
    rGrad.addColorStop(0, '#FFFFFF');
    rGrad.addColorStop(0.25, '#FEF9C3');
    rGrad.addColorStop(0.65, '#FDE047');
    rGrad.addColorStop(1, '#D97706');

    ctx.fillStyle = rGrad;
    ctx.fillText(recipientName, cx, 743);

    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.strokeText(recipientName, cx, 743);
    ctx.restore();

    // 3. Personalized Hindi Greeting below cartouche
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFBEB';
    ctx.font = `700 28px ${fontFamilies}`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 2;

    ctx.fillText('आपको और आपके पूरे परिवार को', cx, 868);
    ctx.fillText('दीपावली की हार्दिक शुभकामनाएँ।', cx, 908);
    ctx.restore();

    // Golden lotus divider
    drawLotusDivider(ctx, cx, 946);

    // Festival quote
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF08A';
    ctx.font = `500 21px "NotoSerifDevanagari", "FreeSerif", serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.fillText('“दीपों की रोशनी से आपका जीवन', cx, 988);
    ctx.fillText('सुख, समृद्धि और खुशियों से हमेशा जगमगाए।”', cx, 1022);
    ctx.restore();

  } else {
    // Universal Mode:
    // Display greeting to all in cartouche curve
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FFFBEB';
    ctx.font = `600 20px "NotoSerifDevanagari", "FreeSerif", serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText('आप सभी एवं आपके परिवार को', cx, 735);
    ctx.restore();

    // Universal Hindi greeting
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFFBEB';
    ctx.font = `700 29px ${fontFamilies}`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 2;

    ctx.fillText('दीपावली की हार्दिक शुभकामनाएँ!', cx, 868);
    ctx.restore();

    // Golden lotus divider
    drawLotusDivider(ctx, cx, 915);

    // Festival quote
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF08A';
    ctx.font = `500 22px "NotoSerifDevanagari", "FreeSerif", serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
    ctx.shadowBlur = 10;
    ctx.fillText('“दीपों की रोशनी से आपका जीवन सुख, समृद्धि', cx, 960);
    ctx.fillText('और खुशियों से हमेशा जगमगाए।”', cx, 996);
    ctx.restore();
  }

  return canvas.toBuffer('image/png');
}

function drawLotusDivider(ctx, cx, cy) {
  ctx.save();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(cx - 130, cy);
  ctx.lineTo(cx - 24, cy);
  ctx.moveTo(cx + 24, cy);
  ctx.lineTo(cx + 130, cy);
  ctx.stroke();

  // Small lotus glyph / diamond
  ctx.fillStyle = '#FEF08A';
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🪷', cx, cy - 1);
  ctx.restore();
}

async function main() {
  // Test 1: Personalized mode (Nitin Kumar & Rahul)
  const buf1 = await renderDiwaliPoster({
    senderName: 'Nitin Kumar',
    recipientName: 'Rahul',
    recipientMode: 'special',
  });
  fs.writeFileSync('public/assets/test_output_personalized_nitin_rahul.png', buf1);
  console.log('Saved test_output_personalized_nitin_rahul.png');

  // Test 2: Universal mode (Nitin Kumar only)
  const buf2 = await renderDiwaliPoster({
    senderName: 'Nitin Kumar',
    recipientName: '',
    recipientMode: 'all',
  });
  fs.writeFileSync('public/assets/test_output_universal_nitin.png', buf2);
  console.log('Saved test_output_universal_nitin.png');

  // Test 3: Custom test (nmju & mnj)
  const buf3 = await renderDiwaliPoster({
    senderName: 'nmju',
    recipientName: 'mnj',
    recipientMode: 'special',
  });
  fs.writeFileSync('public/assets/test_output_custom_nmju_mnj.png', buf3);
  console.log('Saved test_output_custom_nmju_mnj.png');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
