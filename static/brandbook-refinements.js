(() => {
  const valueMap = document.querySelector('.value-map');

  if (valueMap) {
    const keys = ['know', 'tech', 'science', 'zeit', 'design', 'care'];
    const terms = [...valueMap.querySelectorAll('[data-value-term]')];
    const nodes = [...valueMap.querySelectorAll('[data-value-node]')];
    const controls = [...terms, ...nodes];
    const labels = new Map(nodes.map((node) => [node.dataset.valueNode, node.querySelector('strong')?.innerText.trim().replace(/\s+/g, ' ')]));
    const hint = document.createElement('p');
    hint.className = 'value-map-hint';
    hint.id = 'value-map-hint';
    hint.textContent = 'Pasa el cursor, toca o enfoca un elemento para ver su relación.';
    valueMap.querySelector('.value-map-top')?.after(hint);

    let hovered = '';
    let focused = '';
    let pinned = '';

    const render = () => {
      const active = hovered || focused || pinned;
      if (active) valueMap.dataset.activeValue = active;
      else delete valueMap.dataset.activeValue;

      controls.forEach((control) => {
        const key = control.dataset.valueTerm || control.dataset.valueNode;
        control.classList.toggle('is-active', Boolean(active) && key === active);
        control.setAttribute('aria-pressed', String(Boolean(pinned) && key === pinned));
      });
    };

    controls.forEach((control) => {
      const key = control.dataset.valueTerm || control.dataset.valueNode;
      const label = control.matches('[data-value-term]')
        ? `${control.textContent.trim()}, relacionado con ${labels.get(key) || ''}`
        : `${labels.get(key) || control.textContent.trim()}, relacionado con ${terms.find((term) => term.dataset.valueTerm === key)?.textContent.trim() || ''}`;

      control.setAttribute('role', 'button');
      control.setAttribute('tabindex', '0');
      control.setAttribute('aria-label', label);
      control.setAttribute('aria-describedby', hint.id);
      control.setAttribute('aria-pressed', 'false');
      control.addEventListener('mouseenter', () => {
        hovered = key;
        render();
      });
      control.addEventListener('mouseleave', (event) => {
        if (!valueMap.contains(event.relatedTarget)) {
          hovered = '';
          render();
        }
      });
      control.addEventListener('focus', () => {
        focused = key;
        render();
      });
      control.addEventListener('blur', () => {
        focused = '';
        render();
      });
      control.addEventListener('click', () => {
        pinned = pinned === key ? '' : key;
        render();
      });
      control.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          pinned = pinned === key ? '' : key;
          render();
        } else if (event.key === 'Escape') {
          pinned = '';
          focused = '';
          hovered = '';
          render();
          control.blur();
        }
      });
    });

    valueMap.addEventListener('pointerleave', () => {
      hovered = '';
      render();
    });
    valueMap.addEventListener('focusout', (event) => {
      if (!valueMap.contains(event.relatedTarget)) {
        focused = '';
        render();
      }
    });

    const svg = valueMap.querySelector('.value-connectors');
    if (svg && 'MutationObserver' in window) {
      const syncConnectorDots = () => {
        const drawn = [...svg.querySelectorAll('path[data-connection]')];
        const dots = [...svg.querySelectorAll('circle')];
        drawn.forEach((path, index) => {
          if (dots[index]) dots[index].dataset.connection = path.dataset.connection;
        });
      };
      new MutationObserver(syncConnectorDots).observe(svg, { childList: true });
      syncConnectorDots();
    }

    render();
  }

  const universePage = document.querySelector('#page-universo');
  const materialScenes = universePage?.querySelector('.material-scenes');
  if (materialScenes && !universePage.querySelector('.kerai-material-reference')) {
    const reference = document.createElement('section');
    reference.className = 'kerai-material-reference';
    reference.setAttribute('aria-labelledby', 'kerai-material-reference-title');

    const heading = document.createElement('div');
    heading.className = 'kerai-material-reference-heading';
    const title = document.createElement('h4');
    title.id = 'kerai-material-reference-title';
    title.textContent = 'Materia real';
    const source = document.createElement('a');
    source.href = 'https://kerai.es/acabados/';
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    source.textContent = 'Ver acabados en kerai.es ↗';
    heading.append(title, source);

    const materials = [
      {
        name: 'Cobre natural',
        note: 'Pátina viva',
        alt: 'Acabado real de cobre natural de KERAI',
        src: 'https://kerai.es/wp-content/uploads/2026/03/cobre-natural.jpg',
      },
      {
        name: 'Bronce',
        note: 'Heritage Bronze',
        alt: 'Acabado real de bronce de KERAI',
        src: 'https://kerai.es/wp-content/uploads/2026/03/bronce.jpg',
      },
      {
        name: 'Aluminio natural',
        note: 'Living Alu',
        alt: 'Acabado real de aluminio natural de KERAI',
        src: 'https://kerai.es/wp-content/uploads/2026/03/aluminio-natural.jpg',
      },
    ];
    const grid = document.createElement('div');
    grid.className = 'kerai-material-grid';
    grid.setAttribute('role', 'list');

    materials.forEach((material) => {
      const card = document.createElement('figure');
      card.className = 'kerai-material-card';
      card.setAttribute('role', 'listitem');
      const image = document.createElement('img');
      image.src = material.src;
      image.alt = material.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.referrerPolicy = 'no-referrer';
      const caption = document.createElement('figcaption');
      const name = document.createElement('span');
      name.textContent = material.name;
      const note = document.createElement('small');
      note.textContent = material.note;
      caption.append(name, note);
      card.append(image, caption);
      grid.append(card);
    });

    reference.append(heading, grid);
    materialScenes.after(reference);
  }
})();
