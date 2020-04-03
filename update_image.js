const { exec } = require('child_process');
const { deploy } = require('./deploy');

const getLatestDigest = (text) => {
  const reg = /latest: digest: (sha256.*) size:/g;
  const [, digest] = reg.exec(text);
  return digest;
};

const updateImage = (registry, image, path, cmd) => new Promise(
  (resolve, reject) => {
    const dockerProcess = exec(`docker build -t ${image} ${path} &&`
      + `docker tag ${image} ${registry}/${image} &&`
      + `docker push ${registry}/${image}`,
    (err, stdout) => {
      if (err) reject(err);
      if (cmd.deploy) {
        const hash = getLatestDigest(stdout);
        deploy(cmd.deploy, registry, image, {}, hash);
      }
      resolve();
    });
    dockerProcess.stdout.pipe(process.stdout);
    dockerProcess.stderr.pipe(process.stderr);
  },
);

module.exports = updateImage;
