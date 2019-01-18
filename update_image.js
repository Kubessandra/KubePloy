const { exec } = require('child_process');
const deploy = require('./deploy');

const updateImage = (registry, image, path, cmd) => new Promise(
  (resolve, reject) => {
    const dockerProcess = exec(`docker build -t ${image} ${path} &&`
      + `docker tag ${image} ${registry}/${image} &&`
      + `docker push ${registry}/${image}`,
    (err) => {
      if (err) reject(err);
      if (cmd.deploy) {
        deploy(cmd.deploy, registry, image);
      }
      resolve();
    });
    dockerProcess.stdout.pipe(process.stdout);
    dockerProcess.stderr.pipe(process.stderr);
  },
);

module.exports = updateImage;
