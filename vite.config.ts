import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';

function ffmpegTranscodePlugin(): Plugin {
  const handler = async (req: any, res: any) => {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.end('Method Not Allowed');
      return;
    }

    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', async () => {
      const inputBuffer = Buffer.concat(chunks);
      const tmpDir = os.tmpdir();
      const id = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const inputPath = path.join(tmpDir, `input_${id}.webm`);
      const outputPath = path.join(tmpDir, `output_${id}.mp4`);

      try {
        await fs.promises.writeFile(inputPath, inputBuffer);

        await new Promise<void>((resolve, reject) => {
          const ff = spawn('ffmpeg', [
            '-y',
            '-i',
            inputPath,
            '-c:v',
            'libx264',
            '-preset',
            'veryfast',
            '-pix_fmt',
            'yuv420p',
            '-c:a',
            'aac',
            '-b:a',
            '128k',
            '-movflags',
            '+faststart',
            outputPath,
          ]);

          ff.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`FFmpeg exited with code ${code}`));
          });
          ff.on('error', reject);
        });

        const outputData = await fs.promises.readFile(outputPath);
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Length', outputData.length);
        res.end(outputData);
      } catch (err: any) {
        console.error('Transcode error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err?.message || 'Transcode failed' }));
      } finally {
        fs.promises.unlink(inputPath).catch(() => {});
        fs.promises.unlink(outputPath).catch(() => {});
      }
    });
  };

  return {
    name: 'ffmpeg-transcode-plugin',
    configureServer(server) {
      server.middlewares.use('/api/transcode-mp4', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/transcode-mp4', handler);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ffmpegTranscodePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

