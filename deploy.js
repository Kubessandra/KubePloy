const { exec } = require('child_process');

const deploy = (deployment, registry, image) => {
  const COMMAND_RETRIEVE_HASH = `docker images --digests ${registry}/${image} | head -n 2 | tail -n 1 | cut -f 18 -d ' '`;
  exec(COMMAND_RETRIEVE_HASH, (err, stdout) => {
    const hash = stdout;
    console.log(`kubectl set image deployment/${deployment} ${deployment}=${registry}/${image}@${hash}`);
    const COMMAND_DEPLOY_IMAGE = `kubectl set image deployment/${deployment} ${deployment}=${registry}/${image}@${hash}`;
    const deployProcess = exec(COMMAND_DEPLOY_IMAGE);
    deployProcess.stdout.pipe(process.stdout);
    deployProcess.stderr.pipe(process.stderr);
  });
};


module.exports = deploy;
