
const path = require('path');
const { transformFileSync } = require('@babel/core');
// const __dirname = new URL('.', import.meta.url).pathname;
// import path from 'path';
// import { transformFileSync } from '@babel/core';



const assertFileTransformResultEqual = (
  inputFilePathRelativeToFixturesDir,
  pluginOptions
) => {
  const actualFilePath = path.resolve(__dirname, inputFilePathRelativeToFixturesDir);

  const res = transformFileSync(actualFilePath, {
    babelrc: false,
    configFile: false,
    presets: ['@babel/preset-react'],
    plugins: [['../../src/babel/loader.js', pluginOptions]],
  });

  console.log(9999, res?.code);

  // assert.equal(
  //   res.code,
  //   fs.readFileSync(expectedFilePath, {
  //     encoding: 'utf-8',
  //   }),
  // );
};

assertFileTransformResultEqual('test.jsx', {
  trackProp: 'track-params'
});
