// ref: https://test-api.sumsub.com/idensic/static/idensic.js
import config from 'config';

const sumsub = config.get('sumsub');
const defaultIframeOptions = {
  adaptIframeHeight: true,
};

const idensic = {
  name: 'Idensic',
  init(container, config, onMessage, predefinedBaseUrl, options) {
    this.baseurl = predefinedBaseUrl || this.getBaseUrl();
    this.iframe = this.validateSelector(container);
    this.config = this.validateConfig(config);

    const iframeOptions = options || {};
    if (!this.options) {
      this.options = {};
    }
    this.options.adaptIframeHeight =
      iframeOptions.adaptIframeHeight || defaultIframeOptions.adaptIframeHeight;

    if (this.iframe && this.config) {
      this.onMessage = onMessage;
      this.iframe.src = `${this.getSrc()}?_=${Math.floor(Math.random() * 100000000)}`;
    }
  },
  getBaseUrl() {
    return `${sumsub.scheme}://${sumsub.host}:${sumsub.port}/idensic`;
  },
  validateSelector(container) {
    if (!container) {
      return false;
    }

    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.setAttribute('frameborder', 0);

    container.appendChild(iframe);

    return iframe;
  },
  validateConfig(config) {
    const requiredFields = ['accessToken'];

    if (!config.applicantId) {
      requiredFields.push('requiredDocuments');
    }

    const notProvidedFields = [];
    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!config[requiredFields[i]]) {
        notProvidedFields.push(requiredFields[i]);
      }
    }

    if (notProvidedFields.length) {
      return false;
    }

    if (config.userId) {
      delete config.userId;
    }

    return config;
  },

  getSrc() {
    return `${this.baseurl}/index.html`;
  },
};

window.addEventListener('message', (e) => {
  if (!idensic.config || !idensic.options) {
    return;
  }

  const data = e.message || e.data;
  if (!data.method || data.method.indexOf('idCheck') === -1) {
    return;
  }

  if (!idensic.iframe.contentWindow) {
    return;
  }

  // send init config when iframe is ready
  if (data.method === 'idCheck.onReady') {
    idensic.config.method = 'idCheck.init';
    idensic.iframe.contentWindow.postMessage(idensic.config, '*');
  }

  // adapt Iframe Height
  if (idensic.options.adaptIframeHeight && data.method === 'idCheck.onResize') {
    idensic.iframe.style.height = `${data.height}px`;
  }

  // call user onMessage function if it set
  if (typeof idensic.onMessage === 'function') {
    const method = data.method;
    delete data.method;
    idensic.onMessage(method, data);
  }
});

export default idensic;
