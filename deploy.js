const { exec } = require('child_process');

const deploy = (deployment, registry, image, cmd, hashFromBuild) => {
  const COMMAND_RETRIEVE_HASH = `docker images --digests ${registry}/${image} | head -n 2 | tail -n 1 | cut -f 18 -d ' '`;
  exec(COMMAND_RETRIEVE_HASH, (err, stdout) => {
    let hash = null;
    if (hashFromBuild) hash = hashFromBuild;
    else hash = stdout.slice(0, stdout.length - 1);
    let COMMAND_DEPLOY_IMAGE = `kubectl set image deployment/${deployment} ${deployment}=${registry}/${image}@${hash}`;
    if (cmd.namespace) COMMAND_DEPLOY_IMAGE += ` --namespace=${cmd.namespace}`;
    console.log(COMMAND_DEPLOY_IMAGE);
    const deployProcess = exec(COMMAND_DEPLOY_IMAGE);
    deployProcess.stdout.pipe(process.stdout);
    deployProcess.stderr.pipe(process.stderr);
  });
};


module.exports = deploy;
