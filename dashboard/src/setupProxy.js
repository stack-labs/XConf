const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/admin/api/v1', { target: 'http://xconf.mogutou.xyz', changeOrigin: true }));
};
