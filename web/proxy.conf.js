const PROXY_CONFIG = {
  "/rwdbuild": {
    "target": "https://testnet.heimdallr.drasil.io:4000",
    "secure": true,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/rwdbuild": ""
    },
    "onProxyRes": function(pr, req, res) {
      if (pr.headers['set-cookie']) {
        const cookies = pr.headers['set-cookie'].map(cookie =>
            cookie.replace(/;(\ )*secure/gi, '')
        );
        pr.headers['set-cookie'] = cookies;
      }
    }
  },
  "/rwdinfo": {
    "target": "https://testnet.vidar.drasil.io:4000",
    "secure": true,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/rwdinfo": ""
    },
    "onProxyRes": function(pr, req, res) {
      if (pr.headers['set-cookie']) {
        const cookies = pr.headers['set-cookie'].map(cookie =>
            cookie.replace(/;(\ )*secure/gi, '')
        );
        pr.headers['set-cookie'] = cookies;
      }
    }
  },
  "/token": {
    "target": "https://tokens.cardano.org",
    "secure": true,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/token": ""
    },
    "onProxyRes": function(pr, req, res) {
      if (pr.headers['set-cookie']) {
        const cookies = pr.headers['set-cookie'].map(cookie =>
            cookie.replace(/;(\ )*secure/gi, '')
        );
        pr.headers['set-cookie'] = cookies;
      }
    }
  },
  "/feedback": {
    "target": "https://docs.google.com/forms/d/e/1FAIpQLScmOpxNmtwY2RXLsEURNNcVv10zDer991KFYkbPHIPMkWK4oQ",
    "secure": true,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/feedback": ""
    },
    "onProxyRes": function(pr, req, res) {
      if (pr.headers['set-cookie']) {
        const cookies = pr.headers['set-cookie'].map(cookie =>
            cookie.replace(/;(\ )*secure/gi, '')
        );
        pr.headers['set-cookie'] = cookies;
      }
    }
  },

};

module.exports = PROXY_CONFIG;

