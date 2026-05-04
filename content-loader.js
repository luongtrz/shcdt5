(function () {
  const CONTENT_URL = 'uploads/index-texts.json';

  const getValueByPath = (source, path) => {
    if (!path) return undefined;
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source);
  };

  const warnMissing = (key) => {
    console.warn(`[content-loader] Missing i18n key: ${key}`);
  };

  const applyAttributeMappings = (element, mapping, texts) => {
    if (!mapping) return;

    mapping.split(';').map((part) => part.trim()).filter(Boolean).forEach((part) => {
      const splitIndex = part.indexOf(':');
      if (splitIndex === -1) return;

      const attrName = part.slice(0, splitIndex).trim();
      const key = part.slice(splitIndex + 1).trim();
      const translated = getValueByPath(texts, key);

      if (translated === undefined) {
        warnMissing(key);
        return;
      }

      if (attrName === 'textContent') {
        element.textContent = translated;
      } else {
        element.setAttribute(attrName, translated);
      }
    });
  };

  const applyTranslations = (texts) => {
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const titleMapping = titleElement.getAttribute('data-i18n-attr');
      if (titleMapping) {
        applyAttributeMappings(titleElement, titleMapping, texts);
      } else {
        const fallbackTitle = getValueByPath(texts, 'meta.title');
        if (fallbackTitle !== undefined) {
          document.title = fallbackTitle;
        }
      }
    }

    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const key = element.getAttribute('data-i18n');
      const translated = getValueByPath(texts, key);
      if (translated === undefined) {
        warnMissing(key);
        return;
      }
      element.textContent = translated;
    });

    document.querySelectorAll('[data-i18n-html]').forEach((element) => {
      const key = element.getAttribute('data-i18n-html');
      const translated = getValueByPath(texts, key);
      if (translated === undefined) {
        warnMissing(key);
        return;
      }
      element.innerHTML = translated;
    });

    document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
      applyAttributeMappings(element, element.getAttribute('data-i18n-attr'), texts);
    });
  };

  fetch(CONTENT_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((texts) => {
      applyTranslations(texts);
    })
    .catch((error) => {
      console.warn('[content-loader] Failed to load translation file. Using placeholders.', error);
    });
})();
