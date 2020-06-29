#!/usr/bin/env node

const program = require('commander');
const { deploy } = require('./deploy');
const updateImage = require('./update_image');
const cloudBuild = require('./cloudBuild');
const pjson = require('./package.json');

program
  .command('deploy <deployment> <registry> <image>')
  .description(
    'Deploy your image updated to the deployment in your cluster and update it',
  )
  .option('-n, --namespace <namespace>', 'Deploy on the namespace provided')
  .action(deploy);

program
  .command('update-image <registry> <image> <path>')
  .description(
    'Update and push your image to your registry',
  )
  .option('-t, --tag <tag>', 'tag for the image')
  .option('-d, --deploy <deployment>', 'Deploy the image to the deployment after the update')
  .action(updateImage);

program
  .command('cloud <registry> <image> <path>')
  .description(
    'Update and push your image to your registry using Cloud build from google cloud plateform',
  )
  .option('-t, --tag <tag>', 'tag for the image')
  .option('-d, --deploy <deployment>', 'Deploy the image to the deployment after the update')
  .action(cloudBuild);


const commandName = ['deploy', 'update-image', 'cloud'];
const args = process.argv.slice(2);
if (!args.length || !commandName.includes(args[0])) {
  console.log(`Kubeploy version: ${pjson.version}`);
  program.help();
}

program.parse(process.argv);
