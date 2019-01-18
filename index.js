#!/usr/local/bin/node

const program = require('commander');
const deploy = require('./deploy');
const updateImage = require('./update_image');

program
  .command('deploy <deployment> <registry> <image>')
  .description(
    'Deploy your image updated to the deployment in your cluster and update it',
  )
  .action(deploy);

program
  .command('update-image <registry> <image> <path>')
  .description(
    'Update and push your image to your registry',
  )
  .option('-d, --deploy <deployment>', 'Deploy the image to the deployment after the update')
  .action(updateImage);


if (!process.argv.slice(2).length) {
  program.help();
}

program.parse(process.argv);
