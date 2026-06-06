/* ── LinuxQuest — Scenario Detail Page ──────────────────────────────── */

/* ── Nav ─────────────────────────────────────────────────────────────── */
function initNav() {
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
  });
  mobileMenu.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

/* ── Fetch ───────────────────────────────────────────────────────────── */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

async function loadScenario(id, trackId) {
  if (trackId) {
    try { return await fetchJSON(`scenarios/tracks/${trackId}/${id}.json`); } catch (_) {}
  }
  return fetchJSON(`scenarios/standalone/${id}.json`);
}

/* ── Helpers ─────────────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function diffClass(d) {
  const k = (d || 'beginner').toLowerCase();
  if (k === 'intermediate') return 'card-label-intermediate';
  if (k === 'advanced')     return 'card-label-advanced';
  return 'card-label-beginner';
}

/* ── Copy command ────────────────────────────────────────────────────── */
function copyCmd(btn, text) {
  const onSuccess = () => {
    const orig = btn.dataset.origText || btn.textContent;
    btn.dataset.origText = orig;
    btn.textContent = 'COPIED!';
    btn.classList.add('sp-copy-done');
    setTimeout(() => {
      btn.textContent = orig;
      btn.classList.remove('sp-copy-done');
      delete btn.dataset.origText;
    }, 1600);
  };

  const onFail = () => {
    const orig = btn.dataset.origText || btn.textContent;
    btn.dataset.origText = orig;
    btn.textContent = 'FAILED';
    setTimeout(() => {
      btn.textContent = orig;
      delete btn.dataset.origText;
    }, 1600);
  };

  /* Reliable fallback: off-screen textarea + execCommand */
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:2em;height:2em;padding:0;border:none;outline:none;background:transparent';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, 99999); /* iOS */
    try {
      document.execCommand('copy') ? onSuccess() : onFail();
    } catch (_) {
      onFail();
    }
    document.body.removeChild(ta);
  };

  if (!navigator.clipboard) { fallback(); return; }
  navigator.clipboard.writeText(text).then(onSuccess).catch(fallback);
}

/* ── Copy-button event delegation ────────────────────────────────────── */
function initCopyDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const text = btn.dataset.copy;
    if (text !== undefined) copyCmd(btn, text);
  });
}

/* ── Scroll entrance animations ──────────────────────────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('.animate');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  els.forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    observer.observe(el);
  });
}

/* ── Track progress bar ──────────────────────────────────────────────── */
function renderTrackProgress(scenarios, currentId) {
  const bar = document.getElementById('track-nav');
  bar.hidden = false;
  bar.innerHTML = '<div class="tp-bar">' +
    scenarios.map((id, i) => {
      const num  = String(i + 1).padStart(2, '0');
      const cur  = id === currentId;
      const done = !cur && localStorage.getItem(`completed:${id}`) === 'true';
      const cls  = cur ? 'tp-step tp-current' : done ? 'tp-step tp-done' : 'tp-step';
      return (i > 0 ? '<span class="tp-arrow">›</span>' : '') +
        `<span class="${cls}" title="${escHtml(id)}">${num}</span>`;
    }).join('') +
  '</div>';
}

/* ── Hints ───────────────────────────────────────────────────────────── */
function renderHints(hints) {
  const container = document.getElementById('sp-hints');
  if (!hints.length) {
    container.innerHTML = '<p class="sp-prose sp-muted">No hints for this scenario.</p>';
    return;
  }
  let revealed = 0;

  function paint() {
    const existing = container.querySelectorAll('.sp-hint-item').length;
    if (existing === 0) container.innerHTML = '';

    for (let i = existing; i < revealed; i++) {
      const div = document.createElement('div');
      div.className = 'sp-hint-item sp-hint-new';
      div.innerHTML =
        `<span class="sp-hint-num">HINT ${i + 1} OF ${hints.length}</span>` +
        `<p class="sp-hint-text">${escHtml(hints[i])}</p>`;
      container.appendChild(div);
      requestAnimationFrame(() => div.classList.add('sp-hint-visible'));
    }

    const oldBtn  = container.querySelector('.sp-hint-btn');
    const oldDone = container.querySelector('.sp-hint-done');
    if (oldBtn)  oldBtn.remove();
    if (oldDone) oldDone.remove();

    if (revealed < hints.length) {
      const btn = document.createElement('button');
      btn.className = 'sp-hint-btn';
      btn.innerHTML = `<span class="sp-hint-btn-icon">💡</span> REVEAL HINT ${revealed + 1} OF ${hints.length}`;
      btn.addEventListener('click', () => { revealed++; paint(); });
      container.appendChild(btn);
    } else {
      const done = document.createElement('p');
      done.className = 'sp-prose sp-muted sp-hint-done';
      done.textContent = 'All hints revealed.';
      container.appendChild(done);
    }
  }
  paint();
}

/* ── Solution ────────────────────────────────────────────────────────── */
function renderSolution(text) {
  const container = document.getElementById('sp-solution');
  if (!text) {
    container.innerHTML = '<p class="sp-prose sp-muted">No solution provided.</p>';
    return;
  }

  /* Parse numbered steps: lines starting with "N." or "N)" */
  const rawLines = text.split('\n');
  const steps = [];
  let current = null;

  for (const line of rawLines) {
    const match = line.match(/^(\d+)[.)]\s+([\s\S]*)/);
    if (match) {
      if (current) steps.push(current);
      current = { num: match[1], lines: [match[2]] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) steps.push(current);

  if (steps.length === 0) {
    /* Fallback: no numbered steps found — render as single code block */
    const trimmed = text.trim();
    container.innerHTML =
      `<div class="sp-step-cmd">
        <code class="sp-step-code">${escHtml(trimmed)}</code>
        <button class="sp-copy-btn" data-copy="${escHtml(trimmed)}">COPY</button>
      </div>`;
    return;
  }

  container.innerHTML = steps.map(step => {
    const firstLine = step.lines[0] || '';

    /*
     * Determine if the first line is a description label:
     * it ends with ":" AND there are more non-empty lines after it.
     * Keep restLines with original indentation so multi-line blocks
     * can be displayed with their relative indentation intact.
     */
    const restLines    = step.lines.slice(1);
    const nonEmptyTrimmed = restLines.map(l => l.trim()).filter(Boolean);
    const hasLabel  = firstLine.trimEnd().endsWith(':') && nonEmptyTrimmed.length > 0;

    let labelHtml  = '';
    let sourceLines = [];   /* lines with original indentation */

    if (hasLabel) {
      labelHtml   = `<p class="sp-step-label">${escHtml(firstLine.trim())}</p>`;
      sourceLines = restLines;
    } else {
      sourceLines = [firstLine, ...restLines];
    }

    /* Compute the minimum leading-space count across non-empty, non-comment
       code lines so we can strip the common indent when displaying. */
    const codeOnlyLines = sourceLines.filter(l => l.trim() && !l.trim().startsWith('# '));
    const minIndent = codeOnlyLines.reduce((min, l) => {
      return Math.min(min, l.match(/^(\s*)/)[1].length);
    }, Infinity);
    const strip = isFinite(minIndent) ? minIndent : 0;

    /* Separate code lines from comment/explanation lines */
    const codeLines    = [];
    const commentLines = [];
    sourceLines.filter(l => l.trim()).forEach(l => {
      const trimmed = l.trim();
      if (trimmed.startsWith('# ')) {
        commentLines.push(trimmed.slice(2).trim());
      } else {
        codeLines.push(l.slice(strip));   /* strip common indent only */
      }
    });

    let cmdsHtml = '';

    if (codeLines.length > 1) {
      /* Multi-line code block — one single copy button for the whole thing */
      const codeBlock = codeLines.join('\n');
      cmdsHtml += `<div class="sp-step-cmd">
        <code class="sp-step-code">${escHtml(codeBlock)}</code>
        <button class="sp-copy-btn" data-copy="${escHtml(codeBlock)}">COPY</button>
      </div>`;
    } else if (codeLines.length === 1) {
      const cmd = codeLines[0].trim();
      /*
       * Split "Label:   command" on the first colon followed by 2+ spaces.
       * This separates display labels from the copyable command without
       * touching colons inside paths (/home/user/.ssh) or port maps (8080:8080).
       */
      const split = cmd.match(/^([^:]+):\s{2,}(.+)$/);
      const label = split ? split[1].trim() : null;
      const command = split ? split[2].trim() : cmd;
      const cmdLabelHtml = label
        ? `<span class="sp-step-cmd-label">${escHtml(label)}</span>`
        : '';
      cmdsHtml += `<div class="sp-step-cmd">
        ${cmdLabelHtml}
        <code class="sp-step-code">${escHtml(command)}</code>
        <button class="sp-copy-btn" data-copy="${escHtml(command)}">COPY</button>
      </div>`;
    }

    cmdsHtml += commentLines.map(exp =>
      `<p class="sp-step-explanation">${escHtml(exp)}</p>`
    ).join('');

    return `<div class="sp-step">
      <span class="sp-step-num">${escHtml(step.num)}</span>
      <div class="sp-step-content">
        ${labelHtml}
        <div class="sp-step-cmds">${cmdsHtml}</div>
      </div>
    </div>`;
  }).join('');
}

/* ── Solution toggle ─────────────────────────────────────────────────── */
function initSolutionToggle(solutionText) {
  const btn     = document.getElementById('sp-solution-toggle');
  const wrap    = document.getElementById('sp-solution');
  const copyAll = document.getElementById('sp-copy-all-btn');

  btn.addEventListener('click', () => {
    const showing = !wrap.hidden;
    if (showing) {
      wrap.classList.remove('sp-solution-open');
      setTimeout(() => { wrap.hidden = true; }, 300);
      btn.innerHTML = '<span class="sp-toggle-icon">▶</span> SHOW SOLUTION';
      btn.classList.remove('sp-toggle-active');
      if (copyAll) copyAll.hidden = true;
    } else {
      wrap.hidden = false;
      requestAnimationFrame(() => wrap.classList.add('sp-solution-open'));
      btn.innerHTML = '<span class="sp-toggle-icon sp-toggle-icon-open">▼</span> HIDE SOLUTION';
      btn.classList.add('sp-toggle-active');
      if (copyAll) copyAll.hidden = false;
    }
  });

  if (copyAll && solutionText) {
    copyAll.dataset.copy = solutionText;
  }
}

/* ── Mark complete ───────────────────────────────────────────────────── */
function updateCompleteBtn(id) {
  const btn  = document.getElementById('sp-complete-btn');
  const done = localStorage.getItem(`completed:${id}`) === 'true';
  btn.textContent = done ? '✓ COMPLETED' : 'MARK COMPLETE';
  btn.classList.toggle('sp-complete-done', done);
}

function showNextScenarioBtn(id, trackId, trackScenarios) {
  const wrap = document.getElementById('sp-next-wrap');
  if (!wrap) return;

  const idx  = trackScenarios.indexOf(id);
  const nextId = trackScenarios[idx + 1];
  if (!nextId) return;

  wrap.innerHTML = `
    <div>
      <p class="sp-next-label">TRACK — UP NEXT</p>
      <p class="sp-next-title">STEP ${idx + 2} OF ${trackScenarios.length}</p>
    </div>
    <a class="sp-next-btn"
       href="scenario.html?id=${encodeURIComponent(nextId)}&track=${encodeURIComponent(trackId)}">
      NEXT <span class="arrow">→</span>
    </a>`;
  wrap.className = 'sp-next-wrap';
  wrap.hidden = false;
}

function initCompleteBtn(id, trackId, trackScenarios) {
  document.getElementById('sp-complete-btn').addEventListener('click', () => {
    const done = localStorage.getItem(`completed:${id}`) === 'true';
    if (done) {
      localStorage.removeItem(`completed:${id}`);
      const wrap = document.getElementById('sp-next-wrap');
      if (wrap) wrap.hidden = true;
    } else {
      localStorage.setItem(`completed:${id}`, 'true');
      if (trackScenarios && trackId) showNextScenarioBtn(id, trackId, trackScenarios);
    }
    updateCompleteBtn(id);
    if (trackScenarios) renderTrackProgress(trackScenarios, id);
  });
}

/* ── Render ──────────────────────────────────────────────────────────── */
function renderScenario(scenario, trackId, trackScenarios) {
  document.title = `LinuxQuest — ${scenario.title || scenario.id}`;

  /* Header */
  document.getElementById('sp-title').textContent =
    (scenario.title || scenario.id).toUpperCase();

  const tags = Array.isArray(scenario.tags) && scenario.tags.length
    ? `<div class="sp-meta-tags">${scenario.tags.map(t => `<span class="tag">${escHtml(t.toUpperCase())}</span>`).join('')}</div>`
    : '';
  document.getElementById('sp-meta').innerHTML =
    `<span class="card-label ${diffClass(scenario.difficulty)}">${(scenario.difficulty || 'beginner').toUpperCase()}</span>${tags}`;

  /* Setup */
  const setup = scenario.setup || {};
  if (setup.description) {
    document.getElementById('sp-setup-desc').textContent = setup.description;
  }
  if (Array.isArray(setup.commands) && setup.commands.length) {
    document.getElementById('sp-setup-cmds').innerHTML = setup.commands.map(cmd =>
      `<div class="sp-cmd">
        <code class="sp-cmd-code">${escHtml(cmd)}</code>
        <button class="sp-copy-btn" data-copy="${escHtml(cmd)}">COPY</button>
      </div>`
    ).join('');
  }
  if (setup.note) {
    const el = document.getElementById('sp-setup-note');
    el.textContent = setup.note; el.hidden = false;
  }
  if (setup.verify) {
    const el = document.getElementById('sp-setup-verify');
    el.textContent = `Verify: ${setup.verify}`; el.hidden = false;
  }

  /* Problem */
  document.getElementById('sp-problem').textContent = scenario.problem || '';

  /* Commands */
  const cmds = scenario.commands || [];
  if (cmds.length) {
    document.getElementById('sp-commands').innerHTML =
      cmds.map(c => `<span class="tag">${escHtml(c)}</span>`).join('');
  } else {
    document.getElementById('sp-cmds-section').hidden = true;
  }

  /* Hints */
  renderHints(scenario.hints || []);

  /* Solution */
  renderSolution(scenario.solution || '');

  /* Complete state */
  updateCompleteBtn(scenario.id);

  /* Track nav */
  if (trackId && trackScenarios) {
    /* Show next button immediately if this scenario is already complete */
    if (localStorage.getItem(`completed:${scenario.id}`) === 'true') {
      showNextScenarioBtn(scenario.id, trackId, trackScenarios);
    }
    renderTrackProgress(trackScenarios, scenario.id);

    const resetBtn = document.getElementById('sp-reset-btn');
    resetBtn.hidden = false;
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all progress for this track?')) {
        trackScenarios.forEach(id => localStorage.removeItem(`completed:${id}`));
        updateCompleteBtn(scenario.id);
        renderTrackProgress(trackScenarios, scenario.id);
        const wrap = document.getElementById('sp-next-wrap');
        if (wrap) wrap.hidden = true;
      }
    });
  }

  document.getElementById('sp-body').hidden = false;
}

/* ── Keyboard Shortcuts ──────────────────────────────────────────────────────────── */
function initKeyboardShortcuts(trackId, trackScenarios, currentId) {
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;

    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
    if (e.repeat) return;

    const key = e.key.toLowerCase();

    if (key === 'h') {
      const btn = document.querySelector('.sp-hint-btn');
      if (btn) btn.click();
    }

    if (key === 's') {
      const btn = document.getElementById('sp-solution-toggle');
      if (btn) btn.click();
    }

    if (trackId && trackScenarios) {
      const idx = trackScenarios.indexOf(currentId);

      if (e.key === 'ArrowLeft' && idx > 0) {
        const prevId = trackScenarios[idx - 1];
        window.location.href =
          `scenario.html?id=${encodeURIComponent(prevId)}&track=${encodeURIComponent(trackId)}`;
      }

      if (e.key === 'ArrowRight' && idx < trackScenarios.length - 1) {
        const nextId = trackScenarios[idx + 1];
        window.location.href =
          `scenario.html?id=${encodeURIComponent(nextId)}&track=${encodeURIComponent(trackId)}`;
      }
    }
  });
}

/* ── Bootstrap ───────────────────────────────────────────────────────── */
async function init() {
  initNav();
  initCopyDelegation();

  const params  = new URLSearchParams(location.search);
  const id      = params.get('id');
  const trackId = params.get('track');

  if (!id) {
    document.getElementById('sp-loading').hidden = true;
    const err = document.getElementById('sp-error');
    err.textContent = 'NO SCENARIO ID PROVIDED.';
    err.hidden = false;
    return;
  }

  try {
    let trackScenarios = null;
    if (trackId) {
      try {
        const index = await fetchJSON('scenarios/index.json');
        const track = (index.tracks || []).find(t => t.id === trackId);
        if (track) trackScenarios = track.scenarios || null;
      } catch (_) {}
    }

    const scenario = await loadScenario(id, trackId);
    document.getElementById('sp-loading').hidden = true;
    renderScenario(scenario, trackId, trackScenarios);
    initKeyboardShortcuts(trackId, trackScenarios, scenario.id);
    initSolutionToggle(scenario.solution || '');
    initCompleteBtn(scenario.id, trackId, trackScenarios);
    initScrollAnimations();

  } catch (err) {
    document.getElementById('sp-loading').hidden = true;
    document.getElementById('sp-error').hidden = false;
    console.error('[LinuxQuest]', err);
  }
}

document.addEventListener('DOMContentLoaded', init);
