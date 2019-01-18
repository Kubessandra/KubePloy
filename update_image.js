const { exec } = require('child_process');

const updateImage = (registry, image, path) => {
  const dockerProcess = exec(`docker build -t ${image} ${path} &&`
    + `docker tag ${image} ${registry}/${image} &&`
    + `docker push ${registry}/${image}`);
  dockerProcess.stdout.pipe(process.stdout);
  dockerProcess.stderr.pipe(process.stderr);
};

module.exports = updateImage;
