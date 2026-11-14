const https = require('https');
const fs = require('fs');

const files = [
  '/sky/breeze-ambience.mp3',
  '/sky/birds-ambience.mp3',
  '/sky/night-ambience.mp3',
  '/sky/rain-ambience.mp3',
  '/sky/thunder-rumble.mp3',
  '/sky/fireworks/burst-01.mp3',
  '/sky/fireworks/burst-02.mp3',
  '/sky/fireworks/burst-03.mp3',
  '/sky/fireworks/burst-04.mp3',
  '/sky/fireworks/burst-05.mp3',
  '/sky/fireworks/burst-06.mp3'
];

async function checkAudioFiles() {
  for (const f of files) {
    await new Promise(resolve => {
      https.get('https://thoufik.space' + f, res => {
        console.log(f, 'Status:', res.statusCode, 'Content-Length:', res.headers['content-length']);
        resolve();
      }).on('error', err => {
        console.error(f, err.message);
        resolve();
      });
    });
  }
}

checkAudioFiles();
