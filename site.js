// Only needed for the small-screen sidebar. Page contents are plain HTML.
const menuButton = document.querySelector('.menu-button');
const scrim = document.querySelector('.scrim');
function closeMenu() {
  document.body.classList.remove('menu-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}
menuButton?.addEventListener('click', () => {
  const open = document.body.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});
scrim?.addEventListener('click', closeMenu);
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

// PERSONAL ISO: screenshot-gallery navigation. Edit slides in iso-personal.html;
// you do not need to change this script when replacing placeholders with images.
const personalGallery = document.querySelector('.screenshot-gallery');
if (personalGallery) {
  const slides = [...personalGallery.querySelectorAll('.gallery-slide')];
  const tabs = [...personalGallery.querySelectorAll('.gallery-tab')];
  const counter = personalGallery.querySelector('.gallery-counter');
  let current = 0;
  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.hidden = !active;
      slide.classList.toggle('is-active', active);
    });
    tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === current);
      tab.setAttribute('aria-pressed', String(i === current));
    });
    counter.textContent = `${String(current + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  }
  personalGallery.querySelector('.gallery-prev')?.addEventListener('click', () => showSlide(current - 1));
  personalGallery.querySelector('.gallery-next')?.addEventListener('click', () => showSlide(current + 1));
  tabs.forEach((tab, i) => tab.addEventListener('click', () => showSlide(i)));
}


// V17: On-page BAT/TXT viewer. Works offline (no fetch/server required).
// Add a new row with data-code-preview="YOUR_ID" and matching hidden <textarea id="YOUR_ID">.
const buildDialog = document.getElementById('build-code-dialog');
if (buildDialog) {
  const title = buildDialog.querySelector('[data-code-title]');
  const viewer = buildDialog.querySelector('[data-code-text]');
  const copyButton = buildDialog.querySelector('[data-code-copy]');
  const copyResult = buildDialog.querySelector('[data-code-copy-result]');
  let openingButton = null;

  document.querySelectorAll('[data-code-preview]').forEach(button => {
    button.addEventListener('click', () => {
      const source = document.getElementById(button.dataset.codePreview);
      if (!source) return;
      openingButton = button;
      title.textContent = button.dataset.codeTitle || 'View file';
      viewer.value = source.value;
      copyResult.textContent = '';
      buildDialog.showModal();
      viewer.focus();
    });
  });

  buildDialog.querySelector('[data-code-close]').addEventListener('click', () => buildDialog.close());
  // Click the dark backdrop (outside the content) to dismiss.
  buildDialog.addEventListener('click', event => { if (event.target === buildDialog) buildDialog.close(); });
  buildDialog.addEventListener('close', () => openingButton?.focus());

  copyButton.addEventListener('click', async () => {
    // file:// pages may not allow navigator.clipboard; keep a selection fallback.
    viewer.focus();
    viewer.select();
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(viewer.value);
        copied = true;
      }
    } catch (_) { /* retry using selection */ }
    if (!copied) {
      try { copied = document.execCommand('copy'); } catch (_) { /* leave selected */ }
    }
    copyResult.textContent = copied ? 'Copied!' : 'Selected — press Ctrl+C to copy.';
  });
}


/* V24 — In-page links only on DETAIL pages (not Home, ISOS, BUILDS).
   To add a link yourself, put a unique id and data-sidebar-title="Short Label"
   on a section/article inside main .content of that detail page.
   Links appear below that page's active sidebar entry automatically. */
const currentFileName = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
const landingPagesWithoutSectionLinks = new Set(['index.html', 'iso.html', 'builds.html']);
const activePageLink = document.querySelector('.sidebar [aria-current="page"]');
const pageSections = [...document.querySelectorAll('main .content [data-sidebar-title][id]')];
if (!landingPagesWithoutSectionLinks.has(currentFileName) && activePageLink && pageSections.length) {
  const sectionNav = document.createElement('nav');
  sectionNav.className = 'nav-section-list';
  sectionNav.setAttribute('aria-label', 'On this page');

  pageSections.forEach(section => {
    const link = document.createElement('a');
    link.className = 'nav-section-link';
    link.href = '#' + encodeURIComponent(section.id);
    link.textContent = section.dataset.sidebarTitle;

    // Subsections are indented under their main section.
    const parent = section.parentElement?.closest('[data-sidebar-title]');
    if (parent) link.classList.add('is-subsection');

    link.addEventListener('click', () => {
      sectionNav.querySelectorAll('a').forEach(a => a.classList.remove('is-current'));
      link.classList.add('is-current');
      closeMenu();
    });
    sectionNav.appendChild(link);
  });

  // The anchor stays directly beneath the active page link, never elsewhere.
  activePageLink.insertAdjacentElement('afterend', sectionNav);
  const updateSectionLink = () => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    sectionNav.querySelectorAll('a').forEach(a => {
      const current = !!hash && decodeURIComponent(a.hash.slice(1)) === hash;
      a.classList.toggle('is-current', current);
      if (current) a.setAttribute('aria-current','location');
      else a.removeAttribute('aria-current');
    });
  };
  window.addEventListener('hashchange', updateSectionLink);
  updateSectionLink();
}
