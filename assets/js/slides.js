/* ==========================================================================
   Interactive Slide Components & Widgets Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMemePlayer();
  initPromptBuilder();
  initBeforeAfterSlider();
  initPresentationGenerator();
  initNoteSimulator();
  initWritingDoctor();
  initToolkitDirectory();
  initPromptChallenge();
  initScheduleGenerator();
  initHallucinationQuiz();
});

/* --------------------------------------------------------------------------
   SLIDE 2: Single-Frame Meme Video Player Logic
   -------------------------------------------------------------------------- */
function initMemePlayer() {
  const player = document.getElementById('single-frame-meme-player');
  const badge = document.getElementById('meme-now-playing-badge');
  const caption = document.getElementById('meme-caption-text');
  const clip1Btn = document.getElementById('jump-clip-1-btn');
  const clip2Btn = document.getElementById('jump-clip-2-btn');

  if (!player || !badge) return;

  function updateClipState() {
    const time = player.currentTime;
    if (time >= 9.4) {
      badge.textContent = '▶ Now Playing: Clip 2 (3 AM Exam Panic)';
      badge.style.color = 'var(--accent-cyan)';
      caption.innerHTML = '🔥 <strong>Clip 2:</strong> <em>POV: It\'s 3 AM before the exam and you\'re studying a subject you don\'t understand...</em>';
      clip1Btn?.classList.remove('active');
      clip2Btn?.classList.add('active');
    } else {
      badge.textContent = '▶ Now Playing: Clip 1 (8 AM Class)';
      badge.style.color = 'var(--accent-pink)';
      caption.innerHTML = '😂 <strong>Clip 1:</strong> <em>When 8 AM online lectures hit and the professor insists everyone turns their camera on...</em>';
      clip1Btn?.classList.add('active');
      clip2Btn?.classList.remove('active');
    }
  }

  player.addEventListener('timeupdate', updateClipState);

  clip1Btn?.addEventListener('click', () => {
    player.currentTime = 0;
    player.play();
    updateClipState();
  });

  clip2Btn?.addEventListener('click', () => {
    player.currentTime = 9.5;
    player.play();
    updateClipState();
  });
}

/* --------------------------------------------------------------------------
   SLIDE 5: Interactive Master Prompt Builder
   -------------------------------------------------------------------------- */
function initPromptBuilder() {
  const roleSel = document.getElementById('prompt-role');
  const taskInput = document.getElementById('prompt-task');
  const contextSel = document.getElementById('prompt-context');
  const formatSel = document.getElementById('prompt-format');
  const outputBox = document.getElementById('generated-prompt-output');
  const copyBtn = document.getElementById('copy-prompt-btn');

  if (!roleSel || !outputBox) return;

  function updatePrompt() {
    const role = roleSel.value;
    const task = taskInput.value || 'explain the key concepts of thermodynamics';
    const context = contextSel.value;
    const format = formatSel.value;

    const fullPrompt = `Act as an ${role}.\nTask: ${task}.\nContext: I am a university student with ${context}.\nOutput Format: Please provide ${format} with clear bullet points and real-world examples. Avoid overly dense jargon.`;

    outputBox.textContent = fullPrompt;
  }

  [roleSel, contextSel, formatSel].forEach(el => el?.addEventListener('change', updatePrompt));
  taskInput?.addEventListener('input', updatePrompt);

  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(outputBox.textContent);
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '✓ Copied!';
    copyBtn.style.background = 'var(--accent-emerald)';
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
      copyBtn.style.background = '';
    }, 2000);
  });

  updatePrompt();
}

/* --------------------------------------------------------------------------
   SLIDE 7: Presentation Generator & Before/After Slider
   -------------------------------------------------------------------------- */
function initPresentationGenerator() {
  const genBtn = document.getElementById('gen-slides-btn');
  const topicInput = document.getElementById('gen-topic-input');
  const styleSel = document.getElementById('gen-style-select');
  const deckPreview = document.getElementById('deck-preview-container');
  const statusBox = document.getElementById('gen-status-box');

  if (!genBtn || !deckPreview) return;

  let currentDeckSlide = 0;
  let generatedSlidesData = [];

  function buildSlides(topic, style) {
    const title = topic.trim() || 'Photovoltaic Energy Systems & Clean Grid';
    
    return [
      {
        tag: 'SLIDE 01 / 03 • KEYNOTE COVER',
        title: title,
        subtitle: 'A Comprehensive Overview for University Students',
        body: `<div style="background:rgba(255,255,255,0.08); padding:18px; border-radius:14px; border:1px solid rgba(255,255,255,0.15); margin-top:12px;">
                 <span style="color:var(--accent-emerald); font-weight:800; font-size:0.9rem;">✨ AI GENERATED VISUAL DECK</span>
                 <p style="font-size:0.9rem; color:var(--text-secondary); margin-top:4px;">Built from raw lecture notes in 12 seconds</p>
               </div>`
      },
      {
        tag: 'SLIDE 02 / 03 • KEY TAKEAWAYS',
        title: '3 Core Principles of ' + title.split(' ')[0],
        subtitle: 'Essential concepts to master for your upcoming exam',
        body: `<ul style="line-height:1.8; font-size:0.95rem; color:var(--text-secondary); text-align:left; padding-left:20px;">
                 <li><strong>1. Primary Mechanism:</strong> Converts inputs directly into structured output energy.</li>
                 <li><strong>2. System Efficiency:</strong> Boosts performance by 300% compared to traditional manual methods.</li>
                 <li><strong>3. Real Application:</strong> Used widely across modern industrial & academic sectors.</li>
               </ul>`
      },
      {
        tag: 'SLIDE 03 / 03 • CONCLUSION & ACTION PLAN',
        title: 'Final Summary & Next Steps',
        subtitle: 'How to apply this knowledge in your term project',
        body: `<div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:10px;">
                 <div style="background:rgba(0,242,254,0.1); padding:14px; border-radius:12px; border:1px solid rgba(0,242,254,0.3);">
                   <strong style="color:var(--accent-cyan); font-size:0.85rem;">ACTION 1</strong>
                   <p style="font-size:0.85rem; margin-top:4px;">Review core formulas & case studies</p>
                 </div>
                 <div style="background:rgba(127,0,255,0.1); padding:14px; border-radius:12px; border:1px solid rgba(127,0,255,0.3);">
                   <strong style="color:#c084fc; font-size:0.85rem;">ACTION 2</strong>
                   <p style="font-size:0.85rem; margin-top:4px;">Deliver 5-minute keynote presentation</p>
                 </div>
               </div>`
      }
    ];
  }

  function renderDeckSlide(idx) {
    if (!generatedSlidesData.length) return;
    const slide = generatedSlidesData[idx];
    const styleBg = styleSel?.value === 'neon' 
      ? 'linear-gradient(135deg, #090a0f 0%, #1e1b4b 100%)' 
      : 'linear-gradient(135deg, #0f172a 0%, #002b4d 100%)';

    deckPreview.innerHTML = `
      <div style="background:${styleBg}; border:1px solid var(--border-color); border-radius:16px; padding:24px; min-height:240px; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;">
        <div>
          <span style="font-size:0.75rem; font-weight:800; color:var(--accent-cyan); letter-spacing:0.1em; display:block; margin-bottom:8px;">${slide.tag}</span>
          <h3 style="font-size:1.4rem; color:#fff; margin-bottom:6px;">${slide.title}</h3>
          <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:12px;">${slide.subtitle}</p>
          ${slide.body}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
          <button class="nav-btn secondary" id="deck-prev-btn" style="padding:6px 14px; font-size:0.8rem;" ${idx === 0 ? 'disabled' : ''}>← Prev Slide</button>
          <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted);">SLIDE ${idx + 1} OF 3</span>
          <button class="nav-btn" id="deck-next-btn" style="padding:6px 14px; font-size:0.8rem;" ${idx === 2 ? 'disabled' : ''}>Next Slide →</button>
        </div>
      </div>
    `;

    document.getElementById('deck-prev-btn')?.addEventListener('click', () => {
      if (currentDeckSlide > 0) {
        currentDeckSlide--;
        renderDeckSlide(currentDeckSlide);
      }
    });

    document.getElementById('deck-next-btn')?.addEventListener('click', () => {
      if (currentDeckSlide < 2) {
        currentDeckSlide++;
        renderDeckSlide(currentDeckSlide);
      }
    });
  }

  genBtn.addEventListener('click', () => {
    statusBox.innerHTML = `<span style="color:var(--accent-cyan); font-weight:700;">⚡ AI is generating 3 slides... (Parsing topic, creating layouts, applying theme)</span>`;
    genBtn.disabled = true;

    setTimeout(() => {
      generatedSlidesData = buildSlides(topicInput.value, styleSel.value);
      currentDeckSlide = 0;
      renderDeckSlide(0);
      statusBox.innerHTML = `<span style="color:var(--accent-emerald); font-weight:700;">✓ 3-Slide AI Keynote Generated! Use buttons inside the preview deck to navigate slides.</span>`;
      genBtn.disabled = false;
    }, 1000);
  });

  // Default Initial Render
  generatedSlidesData = buildSlides(topicInput.value || 'Photovoltaic Energy Systems', 'dark');
  renderDeckSlide(0);
}

function initBeforeAfterSlider() {
  const container = document.getElementById('slider-container');
  const handle = document.getElementById('slider-handle');
  const afterContent = document.getElementById('slider-after');

  if (!container || !handle || !afterContent) return;

  let isDragging = false;

  function updateSlider(x) {
    const rect = container.getBoundingClientRect();
    let offsetX = x - rect.left;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > rect.width) offsetX = rect.width;

    const percent = (offsetX / rect.width) * 100;
    handle.style.left = `${percent}%`;
    afterContent.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
  }

  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (isDragging) updateSlider(e.clientX);
  });

  // Touch Support
  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches[0]) updateSlider(e.touches[0].clientX);
  });
}

/* --------------------------------------------------------------------------
   SLIDE 8: Interactive Note & PDF Simulator
   -------------------------------------------------------------------------- */
function initNoteSimulator() {
  const dropzone = document.getElementById('pdf-dropzone');
  const tabs = document.querySelectorAll('.tab-btn');
  const displayBox = document.getElementById('note-output-display');

  if (!displayBox) return;

  const contentMap = {
    summary: `
      <h4 style="color:var(--accent-cyan); margin-bottom:10px;">⚡ Instant 2-Minute Executive Summary</h4>
      <p style="margin-bottom:8px;"><strong>Core Concept:</strong> Photosynthesis converts light energy into chemical energy stored in glucose.</p>
      <ul style="padding-left:20px; color:var(--text-secondary);">
        <li>Light-Dependent Reactions occur in thylakoid membranes (creates ATP & NADPH).</li>
        <li>Calvin Cycle takes place in the stroma (fixes CO2 into sugar).</li>
        <li>Key Enzyme: RuBisCO is essential for carbon fixation.</li>
      </ul>
    `,
    flashcards: `
      <h4 style="color:var(--accent-purple); margin-bottom:10px;">🎴 Auto-Generated Flashcards (3/12)</h4>
      <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; border:1px solid var(--border-color); margin-bottom:10px;">
        <strong>Q: What is the primary output of Calvin Cycle?</strong><br>
        <span style="color:var(--accent-emerald);">A: G3P (Glyceraldehyde 3-phosphate) used to build glucose.</span>
      </div>
      <div style="background:rgba(255,255,255,0.05); padding:16px; border-radius:12px; border:1px solid var(--border-color);">
        <strong>Q: Where do light-dependent reactions occur?</strong><br>
        <span style="color:var(--accent-emerald);">A: Thylakoid membranes inside chloroplasts.</span>
      </div>
    `,
    mindmap: `
      <h4 style="color:var(--accent-amber); margin-bottom:10px;">🧠 Concept Mind Map Structure</h4>
      <div style="font-family:monospace; line-height:1.8; color:var(--accent-cyan);">
        [Photosynthesis]<br>
        ├── ☀️ Light Reactions (Thylakoids)<br>
        │   ├── Inputs: H2O + Light<br>
        │   └── Outputs: O2 + ATP + NADPH<br>
        └── 🧪 Calvin Cycle (Stroma)<br>
            ├── Inputs: CO2 + ATP + NADPH<br>
            └── Outputs: Glucose + ADP
      </div>
    `,
    quiz: `
      <h4 style="color:var(--accent-pink); margin-bottom:10px;">📝 Practice Exam Question</h4>
      <p style="margin-bottom:12px;">Which component acts as the primary electron donor in light-dependent reactions?</p>
      <div style="display:flex; flex-direction:column; gap:8px;">
        <button style="padding:10px; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid var(--border-color); color:var(--text-primary); text-align:left; cursor:pointer;" onclick="this.style.background='rgba(0,245,160,0.2)'; this.style.borderColor='var(--accent-emerald)';">A) Water (H2O)  ✓ Correct</button>
        <button style="padding:10px; border-radius:8px; background:rgba(255,255,255,0.05); border:1px solid var(--border-color); color:var(--text-primary); text-align:left; cursor:pointer;" onclick="this.style.background='rgba(244,63,94,0.2)'; this.style.borderColor='#f43f5e';">B) Carbon Dioxide (CO2)</button>
      </div>
    `
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.dataset.tab;
      displayBox.innerHTML = contentMap[mode] || contentMap.summary;
    });
  });

  dropzone?.addEventListener('click', () => {
    dropzone.innerHTML = `<span style="font-size:2rem;">📄</span><h4 style="color:var(--accent-emerald);">Biology_Lecture_12.pdf Analyzed!</h4><p style="font-size:0.8rem; color:var(--text-muted);">48 Pages processed in 1.4 seconds</p>`;
  });
}

/* --------------------------------------------------------------------------
   SLIDE 10: Writing Doctor Simulator
   -------------------------------------------------------------------------- */
function initWritingDoctor() {
  const modes = document.querySelectorAll('.writing-mode-btn');
  const inputEl = document.getElementById('writing-input');
  const outputEl = document.getElementById('writing-output');

  if (!inputEl || !outputEl) return;

  const transformations = {
    polish: "I am writing to inquire if there might be an opportunity to discuss my recent essay assignment during your upcoming office hours.",
    simplify: "Can we talk about my essay during office hours?",
    expand: "I hope this email finds you well. I am reaching out to respectfully request a brief consultation during your scheduled office hours regarding feedback on my recently submitted essay."
  };

  modes.forEach(btn => {
    btn.addEventListener('click', () => {
      modes.forEach(m => m.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      outputEl.textContent = transformations[mode] || transformations.polish;
    });
  });
}

/* --------------------------------------------------------------------------
   SLIDE 13: Student Weekly Schedule Generator
   -------------------------------------------------------------------------- */
function initScheduleGenerator() {
  const genBtn = document.getElementById('generate-schedule-btn');
  const display = document.getElementById('schedule-result-box');

  if (!genBtn || !display) return;

  genBtn.addEventListener('click', () => {
    display.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap:10px; width:100%;">
        <div style="background:rgba(0,242,254,0.1); padding:12px; border-radius:10px; border:1px solid rgba(0,242,254,0.3);">
          <strong style="color:var(--accent-cyan); font-size:0.8rem;">MON & WED</strong>
          <p style="font-size:0.85rem; margin-top:4px;">09:00 - 11:00 Lectures<br>14:00 - 15:30 AI Flashcard Study</p>
        </div>
        <div style="background:rgba(127,0,255,0.1); padding:12px; border-radius:10px; border:1px solid rgba(127,0,255,0.3);">
          <strong style="color:#c084fc; font-size:0.8rem;">TUE & THU</strong>
          <p style="font-size:0.85rem; margin-top:4px;">10:00 - 12:00 Research (Perplexity)<br>16:00 - 17:30 Quiz Prep</p>
        </div>
        <div style="background:rgba(0,245,160,0.1); padding:12px; border-radius:10px; border:1px solid rgba(0,245,160,0.3);">
          <strong style="color:var(--accent-emerald); font-size:0.8rem;">FRI - SUN</strong>
          <p style="font-size:0.85rem; margin-top:4px;">Review Notes & Relax (0 Homework Stress!)</p>
        </div>
      </div>
    `;
  });
}

/* --------------------------------------------------------------------------
   SLIDE 15: Hallucination Detector Quiz
   -------------------------------------------------------------------------- */
function initHallucinationQuiz() {
  const quizBtns = document.querySelectorAll('.quiz-option-btn');

  quizBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.dataset.correct === 'true';
      if (isCorrect) {
        btn.style.background = 'rgba(0, 245, 160, 0.2)';
        btn.style.borderColor = 'var(--accent-emerald)';
        btn.innerHTML += ' ✓ Spot On! This citation is 100% fake (hallucinated).';
      } else {
        btn.style.background = 'rgba(244, 63, 94, 0.2)';
        btn.style.borderColor = '#f43f5e';
        btn.innerHTML += ' ❌ Real fact!';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   SLIDE 17: Top 10 Student AI Toolkit Directory
   -------------------------------------------------------------------------- */
const toolkitData = [
  { name: 'ChatGPT', tag: 'Writing & Coding', price: 'Free / $20', icon: '🤖', desc: 'The ultimate all-rounder for brainstorming, writing, and problem-solving.' },
  { name: 'NotebookLM', tag: 'Study & Notes', price: '100% Free', icon: '📚', desc: 'Google’s AI that reads your PDF lecture slides and creates audio podcasts & notes.' },
  { name: 'Perplexity', tag: 'Research', price: 'Free / Pro', icon: '🔍', desc: 'AI Search engine with real citations, academic papers, and zero ads.' },
  { name: 'Claude 3.5', tag: 'Long Writing', price: 'Free / $20', icon: '✍️', desc: 'Superior nuanced academic writing, essay polishing, and code analysis.' },
  { name: 'Gamma.app', tag: 'Presentations', price: 'Free Credits', icon: '📊', desc: 'Generates stunning visual slide decks from simple text outlines in 30 seconds.' },
  { name: 'Grammarly', tag: 'Proofreading', price: 'Free / Premium', icon: '📝', desc: 'Fixes grammar, tone, clarity, and formatting in your essays.' },
  { name: 'Consensus', tag: 'Scientific Research', price: 'Free', icon: '🔬', desc: 'Search 200M+ peer-reviewed scientific papers for instant evidence-backed answers.' },
  { name: 'Canva AI', tag: 'Visuals & Design', price: 'Free / Student', icon: '🎨', desc: 'AI image generator, magic eraser, and presentation designer for students.' },
  { name: 'CapCut AI', tag: 'Video & Audio', price: 'Free', icon: '🎬', desc: 'Auto-captions, AI voiceovers, and quick video edits for group presentations.' },
  { name: 'Notion AI', tag: 'Organization', price: 'Free / Add-on', icon: '🗓️', desc: 'Organizes assignment deadlines, study schedules, and project notes automatically.' }
];

function initToolkitDirectory() {
  const grid = document.getElementById('toolkit-grid');
  const searchInput = document.getElementById('toolkit-search');
  const filterBtns = document.querySelectorAll('.toolkit-filter-btn');

  if (!grid) return;

  function renderTools(filterTag = 'all', searchQuery = '') {
    grid.innerHTML = '';
    const filtered = toolkitData.filter(tool => {
      const matchesFilter = filterTag === 'all' || tool.tag.toLowerCase().includes(filterTag.toLowerCase());
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });

    filtered.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.padding = '18px';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span style="font-size:1.8rem;">${tool.icon}</span>
          <span class="price-tag">${tool.price}</span>
        </div>
        <h4 style="font-size:1.1rem; color:var(--text-primary); margin-bottom:4px;">${tool.name}</h4>
        <span style="font-size:0.75rem; color:var(--accent-cyan); font-weight:700;">${tool.tag}</span>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:8px;">${tool.desc}</p>
      `;
      grid.appendChild(card);
    });
  }

  searchInput?.addEventListener('input', (e) => renderTools('all', e.target.value));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTools(btn.dataset.filter, searchInput.value);
    });
  });

  renderTools();
}

/* --------------------------------------------------------------------------
   SLIDE 18: Real-World Prompt Comparison Arena
   -------------------------------------------------------------------------- */
const showdownScenarios = {
  economics: {
    title: '🍕 Macroeconomics: Inflation Concept',
    lazyPrompt: 'Explain inflation to me',
    lazyResult: `Inflation is a quantitative measure of the rate at which the average price level of a basket of selected goods and services in an economy increases over a period of time. Derived via Consumer Price Index (CPI) and GDP deflator formulas. High monetary velocity coupled with demand-pull vectors can trigger hyperinflationary spiraling...`,
    lazyGrade: 'D- (Boring Wikipedia Jargon)',
    masterPrompt: 'Act as an Economics Professor. Explain inflation to a university student using a cafeteria pizza analogy, 3 simple bullet points, and 2 quiz questions.',
    masterResult: `
      <div style="margin-bottom:10px;"><strong style="color:var(--accent-amber);">🍕 Cafeteria Pizza Analogy:</strong><br>Imagine 10 hungry students in line, but only 5 slices of pizza left. Everyone starts bidding more money per slice, so the price jumps from $2 to $5!</div>
      <div style="margin-bottom:10px;"><strong style="color:var(--accent-cyan);">📌 3 Key Concept Bullets:</strong>
        <ul style="padding-left:18px; margin-top:4px;">
          <li>1. <strong>Demand Spikes:</strong> Too much money chasing too few goods.</li>
          <li>2. <strong>Money Loses Value:</strong> $10 buys less today than last year.</li>
          <li>3. <strong>Central Banks Act:</strong> Raising interest rates to cool spending.</li>
        </ul>
      </div>
      <div><strong style="color:var(--accent-emerald);">📝 Quiz Check:</strong> Q1: What happens to purchasing power during inflation? (Ans: Drops)</div>
    `,
    masterGrade: '🏆 S-Tier (100% Exam Ready)'
  },
  email: {
    title: '📧 Email Professor: Extension Request',
    lazyPrompt: 'Write an email to my prof asking for more time on assignment',
    lazyResult: `Dear Professor, I am writing to ask if I can get an extension on the assignment due tomorrow because I have been very busy with other classes and couldn't finish it on time. Thanks.`,
    lazyGrade: 'D- (Unprofessional & Demanding)',
    masterPrompt: 'Act as an academic advisor. Write a polite 3-sentence email to Prof Smith requesting a 48-hour extension on my Chemistry lab report due to illness, offering to share current completed draft notes.',
    masterResult: `
      Dear Professor Smith,<br><br>
      I hope this email finds you well. Due to a sudden medical illness, I am respectfully writing to request a 48-hour extension on tomorrow's Organic Chemistry lab report.<br><br>
      I have attached my completed draft notes for your preliminary review and would be immensely grateful for your consideration.<br><br>
      Best regards,<br>
      [Student Name]
    `,
    masterGrade: '🏆 S-Tier (100% Respectful & Effective)'
  },
  physics: {
    title: '🧪 Physics: Thermodynamics Quiz Prep',
    lazyPrompt: 'What is the second law of thermodynamics',
    lazyResult: `The second law of thermodynamics states that the total entropy of an isolated system can never decrease over time, and is constant if and only if all processes are reversible. Isolated systems spontaneously evolve towards thermodynamic equilibrium, the state of maximum entropy...`,
    lazyGrade: 'D- (Dense Physics Jargon)',
    masterPrompt: 'Act as a physics tutor. Explain the Second Law of Thermodynamics to a non-science major using a messy bedroom analogy and 2 bullet points for my quiz.',
    masterResult: `
      <div style="margin-bottom:10px;"><strong style="color:var(--accent-pink);">🧹 Messy Bedroom Analogy:</strong><br>Your room naturally gets messy over time without effort (high entropy), but it NEVER cleans itself automatically! Energy is required to create order.</div>
      <div><strong style="color:var(--accent-cyan);">📌 2 Quiz Takeaways:</strong>
        <ul style="padding-left:18px; margin-top:4px;">
          <li>1. <strong>Entropy = Disorder:</strong> Everything naturally moves towards randomness.</li>
          <li>2. <strong>One-Way Heat Flow:</strong> Heat moves from hot objects to cold objects, never in reverse.</li>
        </ul>
      </div>
    `,
    masterGrade: '🏆 S-Tier (Quiz Buster)'
  }
};

function initPromptChallenge() {
  const tabs = document.querySelectorAll('.showdown-tab-btn');
  const lazyPromptEl = document.getElementById('showdown-lazy-prompt');
  const lazyResultEl = document.getElementById('showdown-lazy-result');
  const lazyGradeEl = document.getElementById('showdown-lazy-grade');

  const masterPromptEl = document.getElementById('showdown-master-prompt');
  const masterResultEl = document.getElementById('showdown-master-result');
  const masterGradeEl = document.getElementById('showdown-master-grade');

  if (!lazyPromptEl || !masterPromptEl) return;

  function loadScenario(key) {
    const s = showdownScenarios[key] || showdownScenarios.economics;
    
    lazyPromptEl.textContent = `"${s.lazyPrompt}"`;
    lazyResultEl.textContent = s.lazyResult;
    lazyGradeEl.textContent = s.lazyGrade;

    masterPromptEl.textContent = `"${s.masterPrompt}"`;
    masterResultEl.innerHTML = s.masterResult;
    masterGradeEl.textContent = s.masterGrade;
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      loadScenario(tab.dataset.scenario);
    });
  });

  loadScenario('economics');
}
