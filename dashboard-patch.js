const btn = document.createElement('button');
btn.id = 'chaosBtn';
btn.innerHTML = '💥 INJECT CHAOS (30s)';
btn.onclick = injectChaos;
btn.style.cssText = 'background:#ff4444;color:white;padding:12px 24px;border:none;border-radius:8px;font-weight:bold;cursor:pointer;margin:20px auto;display:block;';
document.querySelector('#metrics-grid').after(btn);

const status = document.createElement('div');
status.id = 'chaosStatus';
status.style.cssText = 'text-align:center;font-size:18px;margin:10px;opacity:0;transition:opacity 0.3s;';
btn.after(status);

async function injectChaos() {
  btn.disabled = true;
  btn.innerHTML = 'CHAOS ACTIVE...';
  status.style.opacity = '1';
  status.innerHTML = '🛑 FAULT INJECTED - Recovering in 30s';
  status.style.color = '#ff4444';
  await fetch('/chaos/inject', {method:'POST'});
  setTimeout(()=>location.reload(), 35000);
}
