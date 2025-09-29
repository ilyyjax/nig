// RAPBOT — lightweight front-end persona
(() => {
  const chat = document.getElementById('chat');
  const input = document.getElementById('input');
  const send = document.getElementById('send');

  // Bot persona data — swagger, hype, roast, but non-offensive
  const openings = [
    "Ayy, listen up —",
    "Yo, check it:",
    "Straight facts —",
    "No cap,",
    "Hear me out —",
    "Big flex energy:"
  ];

  const closers = [
    "Keep it 100.",
    "That's straight fire 🔥.",
    "Bet that.",
    "You already know.",
    "Run that back.",
    "Stay flexin'."
  ];

  const roasts = [
    "You soft like decaf, fam.",
    "Tryna play tough, but you got jokes.",
    "That move was light — come harder.",
    "You tryna be a legend, keep trying.",
    "All bark, no bite — that ain't it."
  ];

  const brags = [
    "I got racks of rhymes, pockets full of lines.",
    "Hustle steady, mind ready, pockets never petty.",
    "I stack bars like bricks — check the blueprint.",
    "Came from the basement, now I'm headline placement."
  ];

  function safeText(t){
    // normalize whitespace, prevent long spam
    return t.replace(/\s+/g,' ').trim().slice(0,800);
  }

  function appendMessage({who='bot', text='', meta=''}) {
    const el = document.createElement('div');
    el.className = `msg ${who === 'user' ? 'user' : 'bot'}`;
    el.innerHTML = (meta ? `<div class="meta">${meta}</div>` : '') + `<div class="text">${escapeHtml(text)}</div>`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
  }

  function escapeHtml(s){
    return (s||'').replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function pick(list){ return list[Math.floor(Math.random()*list.length)]; }

  function detectIntent(text){
    const t = text.toLowerCase();
    if(!t) return 'empty';
    if(/\b(hi|hello|yo|hey)\b/.test(t)) return 'greet';
    if(/\b(who are you|what are you)\b/.test(t)) return 'who';
    if(/\b(joke|roast|burn)\b/.test(t)) return 'roast';
    if(/\b(hype|flex|brag|bragging)\b/.test(t)) return 'brag';
    if(/\b(sing|rap|freestyle)\b/.test(t)) return 'freestyle';
    if(/\b(help|how|what can you)\b/.test(t)) return 'help';
    return 'respond';
  }

  function makeFreestyle(seed){
    // Create a short 1-2 line rhyme using the user's last word
    const words = seed.split(/\s+/).filter(Boolean);
    const last = words.length ? words[words.length-1].replace(/[^a-zA-Z]/g,'') : 'flow';
    const rhyme = last.slice(0,4) || 'flow';
    const lines = [
      `I run the block with the ${rhyme}, yeah I move it slow.`,
      `Count my wins, count my dough, lights up when I show.`,
      `From the curb to the throne, I made that road my own.`,
      `You said "${escapeHtml(seed)}" — now watch me set the tone.`
    ];
    return pick(lines) + " " + pick(closers);
  }

  function generateRapperReply(userText){
    const t = safeText(userText);
    const intent = detectIntent(t);

    if(intent === 'empty'){
      return pick(openings) + " Say somethin', don't leave me hangin'.";
    }
    if(intent === 'greet'){
      return `${pick(openings)} Yo, what's good? ${pick(closers)}`;
    }
    if(intent === 'who'){
      return `${pick(openings)} They call me RAPBOT — hype, roast, rhyme. I'm the plug for spicy comebacks. ${pick(closers)}`;
    }
    if(intent === 'roast'){
      return `${pick(openings)} ${pick(roasts)} ${pick(closers)}`;
    }
    if(intent === 'brag'){
      return `${pick(openings)} ${pick(brags)} ${pick(closers)}`;
    }
    if(intent === 'freestyle'){
      return makeFreestyle(t);
    }
    if(intent === 'help'){
      return `${pick(openings)} I'm your hype plug: ask for a roast, a freestyle, or say somethin' dumb and I’ll clown it.`;
    }

    // Generic responder: transform user text with swagger + short punch
    const trimmed = t.length > 120 ? (t.slice(0,120) + '...') : t;
    // stylize: uppercase some words, add emoji, short punch
    const punch = pick(["No cap.", "Facts.", "Real talk.", "On God."]);
    return `${pick(openings)} "${trimmed}" — ${punch} ${pick(closers)}`;
  }

  // Typing indicator
  function showTyping(delay = 800){
    const el = document.createElement('div');
    el.className = 'msg bot';
    el.innerHTML = `<div class="text typing"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>`;
    chat.appendChild(el);
    chat.scrollTop = chat.scrollHeight;
    return el;
  }

  // initial message
  appendMessage({who:'bot', text: "Ayy — I'm NiggaBot. Drop a line, ask for a roast, or tell me to freestyle."});

  function sendMessage(){
    const text = input.value;
    if(!text.trim()) return;
    const safe = safeText(text);
    appendMessage({who:'user', text:safe});
    input.value = '';
    input.focus();

    // show typing then reply
    const typingEl = showTyping();

    // fake 'thinking' time proportional to message length (but capped)
    const delay = Math.min(1600 + Math.max(0, safe.length * 8), 2200);

    setTimeout(() => {
      typingEl.remove();
      const reply = generateRapperReply(safe);
      appendMessage({who:'bot', text: reply});
    }, delay);
  }

  send.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' && !e.shiftKey) { sendMessage(); e.preventDefault(); }
  });

  // small UX: focus input on load
  window.addEventListener('load', () => { setTimeout(()=>input.focus(), 300); });

})();
