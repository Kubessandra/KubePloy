const { execSync } = require('child_process');
const { deployWithTag } = require('./deploy');

const cloudBuild = (registry, image, path, cmd) => {
  execSync(
    `gcloud builds submit ${path} -t ${registry}/${image}:${cmd.tag}`,
    {
      stdio: 'inherit',
      stderr: 'inherit',
    },
  );
  deployWithTag(cmd.deploy, registry, image, cmd, cmd.tag);
};

module.exports = cloudBuild;
