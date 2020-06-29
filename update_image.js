const { exec } = require('child_process');
const { deploy, deployWithTag } = require('./deploy');

const getLatestDigest = (text) => {
  const reg = /latest: digest: (sha256.*) size:/g;
  const [, digest] = reg.exec(text);
  return digest;
};

const updateImage = (registry, image, path, cmd) => new Promise(
  (resolve, reject) => {
    const dockerProcess = exec(`docker build -t ${image} ${path} &&`
      + `docker tag ${image} ${registry}/${image}:${cmd.tag || 'latest'} &&`
      + `docker push ${registry}/${image}:${cmd.tag || 'latest'}`,
    (err, stdout) => {
      if (err) reject(err);
      if (cmd.deploy) {
        const hash = getLatestDigest(stdout);
        if (cmd.tag) {
          deployWithTag(cmd.deploy, registry, image, cmd, cmd.tag);
        } else {
          deploy(cmd.deploy, registry, image, {}, hash);
        }
      }
      resolve();
    });
    dockerProcess.stdout.pipe(process.stdout);
    dockerProcess.stderr.pipe(process.stderr);
  },
);

module.exports = updateImage;
