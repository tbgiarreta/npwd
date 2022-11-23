const { build } = require('esbuild');
const copy = require('copy');
const path = require("path");
const deployFolder = path.resolve(require("../../config.json").deployFolder);

build({
  entryPoints: ['server/server.ts'],
  outfile: path.resolve(deployFolder, 'dist/server/server.js'),
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
  write: true,
  platform: 'node',
  target: 'es2020',
})
  .then(() => {
    console.log('Server built successfully');
  })
  .catch(() => process.exit(1));

build({
  entryPoints: ['client/client.ts'],
  outfile: path.resolve(deployFolder, 'dist/client/client.js'),
  bundle: true,
  loader: {
    '.ts': 'ts',
    '.js': 'js',
  },
  write: true,
  platform: 'browser',
  target: 'es2016',
})
  .then(() => {
    console.log('Client built successfully');
    copy('client/*.lua', path.resolve(deployFolder, 'dist/client'), {}, function (err, files) {
      if (err) throw err;

      console.log(files.length + ' lua files copied');
    });
  })
  .catch(() => process.exit(1));
