const COMMON_BRANDS = ["paypal","google","facebook","microsoft","apple","amazon","bank","netflix","instagram"];

function checkUrl(url){
  let reasons = [], score = 0, domain = '';
  try{ domain = new URL(url).hostname.toLowerCase(); }
  catch(e){ domain = url.toLowerCase().replace(/^https?:\/\//,'').split('/')[0]; }
  const isHttps = /^https:\/\//i.test(url);

  if(/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)){
    reasons.push("Uses a raw IP address instead of a domain name"); score += 3;
  }
  COMMON_BRANDS.forEach(b=>{
    if(domain.includes(b) && !domain.endsWith(b + '.com')){
      reasons.push(`Contains brand name "${b}" but isn't the official domain`); score += 3;
    }
  });
  if((domain.match(/-/g)||[]).length >= 2){
    reasons.push("Domain has multiple hyphens (common obfuscation trick)"); score += 1;
  }
  if((domain.match(/\./g)||[]).length >= 3){
    reasons.push("Domain has unusually many subdomains"); score += 1;
  }
  if(/\.(zip|xyz|top|club|work|gq|tk)$/i.test(domain)){
    reasons.push("Uses a top-level domain frequently abused for phishing"); score += 2;
  }
  if(!isHttps){
    reasons.push("Not using HTTPS (no secure connection)"); score += 1;
  }
  if(/(login|secure|verify|account|update)-?(login|secure|verify|account|update)?/i.test(domain) &&
     !COMMON_BRANDS.some(b=>domain.endsWith(b+'.com'))){
    reasons.push("Domain uses trust-signaling words like \"secure\" or \"verify\" outside a real brand domain"); score += 2;
  }
  const firstLabel = domain.split('.')[0];
  if(/[0-9]/.test(firstLabel) && COMMON_BRANDS.some(b=>domain.includes(b))){
    reasons.push("Domain mixes numbers into a brand-like name (e.g. \"paypa1\")"); score += 2;
  }
  return {score, reasons};
}

function verdict(score){
  if(score >= 5) return {label:'High risk', cls:'high'};
  if(score >= 2) return {label:'Medium risk', cls:'medium'};
  return {label:'Low risk', cls:'low'};
}

const flagIcon = (color) => `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="color:${color}"><path d="M5 3v18M5 4h11l-2.5 4L16 12H5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`;

function analyze(){
  const val = document.getElementById('input').value.trim();
  const resultsEl = document.getElementById('results');
  if(!val){
    resultsEl.innerHTML = `<div class="result-card"><div class="clean">Paste a link above, then hit "Analyze" to see what it finds.</div></div>`;
    return;
  }
  const result = checkUrl(val);
  const v = verdict(result.score);

  let html = `<div class="result-card">
    <div class="verdict-row">
      <span class="verdict-chip ${v.cls}">${v.label}</span>
      <span class="score-text">Risk score <b>${result.score}</b> · ${result.reasons.length} flag${result.reasons.length===1?'':'s'}</span>
    </div>`;

  if(result.reasons.length === 0){
    html += `<div class="clean">Nothing suspicious turned up here — but that's never a guarantee. Always double-check the sender and web address before entering any personal info.</div>`;
  } else {
    const color = v.cls === 'high' ? 'var(--coral)' : v.cls === 'medium' ? 'var(--gold)' : 'var(--safe)';
    html += `<ul class="flags">` + result.reasons.map(r =>
      `<li>${flagIcon(color)}<span>${r}</span></li>`
    ).join('') + `</ul>`;
  }
  html += `</div>`;
  resultsEl.innerHTML = html;
}

function loadExample(kind){
  document.getElementById('input').value = kind === 'safe'
    ? 'https://www.paypal.com/signin'
    : 'http://paypal-secure-login.verify-account.xyz';
  analyze();
}
