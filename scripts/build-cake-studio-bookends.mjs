import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const source = join(root, 'public', 'worlds', 'assets', 'cake-studio', 'keyframes');
const clips = join(root, 'public', 'worlds', 'cake-studio', 'clips');
const output = join(root, 'public', 'worlds', 'cake-studio', 'bookends');
mkdirSync(output, { recursive: true });

const anchor = join(source, 'CST-KF00-style-anchor.png');
const introEndpoint = join(output, 'cake-studio-intro-endpoint.png');
const outroEndpoint = join(output, 'cake-studio-outro-endpoint.png');

const runFfmpeg = (args, label) => {
  const run = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'warning', '-y', ...args], { stdio: 'inherit' });
  if (run.status !== 0) throw new Error(`ffmpeg failed for ${label} (${run.status})`);
};

const extractEndpoint = (clip, frame, target) => {
  runFfmpeg([
    '-i', clip,
    '-vf', `select=eq(n\\,${frame})`,
    '-frames:v', '1',
    '-fps_mode', 'passthrough',
    '-update', '1',
    target,
  ], target);
  console.log(`EXTRACTED ${target}`);
};

// Use the actual decoded web endpoints, not their earlier source keyframe.
// The WAN encodes carry small generation/delogo differences that become a
// visible flash if the bookends are joined to the prettier source PNG.
extractEndpoint(join(clips, 'CST-001.mp4'), 0, introEndpoint);
extractEndpoint(join(clips, 'CST-050.mp4'), 149, outroEndpoint);

const encode = (name, first, second, filter) => {
  const target = join(output, name);
  const args = [
    '-loop', '1', '-framerate', '30', '-t', '6', '-i', first,
    '-loop', '1', '-framerate', '30', '-t', '6', '-i', second,
    '-filter_complex', filter,
    '-map', '[out]', '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-level', '4.0',
    '-g', '15', '-keyint_min', '15', '-sc_threshold', '0',
    '-movflags', '+faststart', '-r', '30', '-frames:v', '180',
    target,
  ];
  runFfmpeg(args, name);
  console.log(`BUILT ${target}`);
};

const common = 'scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1';

encode(
  'cake-studio-intro.mp4',
  anchor,
  introEndpoint,
  `[0:v]${common},zoompan=z='1+0.045*on/179':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,fade=t=in:st=0:d=0.65,settb=AVTB,setpts=PTS-STARTPTS[a];` +
  `[1:v]${common},zoompan=z='1':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,settb=AVTB,setpts=PTS-STARTPTS[b];` +
  `[a][b]xfade=transition=fade:duration=1.15:offset=4.25,trim=duration=6,setpts=PTS-STARTPTS,format=yuv420p[out]`,
);

encode(
  'cake-studio-outro.mp4',
  outroEndpoint,
  anchor,
  `[0:v]${common},zoompan=z='1':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,settb=AVTB,setpts=PTS-STARTPTS[a];` +
  `[1:v]${common},zoompan=z='1+0.055*on/179':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30,settb=AVTB,setpts=PTS-STARTPTS[b];` +
  `[a][b]xfade=transition=fade:duration=1.15:offset=0.65,trim=duration=6,setpts=PTS-STARTPTS,format=yuv420p[out]`,
);
