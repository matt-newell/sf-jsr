exports.config = {
  bundles: [
    { components: ['st-jsr', 'demo-fetch'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
