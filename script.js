// Client-side auth and per-user iframe instances
const BASE_IFRAME = 'https://crosswordlabs.com/embed/temp1-11';

// Generate 50 dummy accounts: user1..user50 with passwords pass1..pass50
const DUMMY_USERS = Array.from({length:50}, (_,i)=>({
	username: `user${i+1}`,
	password: `pass${i+1}`
}));

function getUserKey(u){ return `puzzle_src_${u}`; }
function getSavedSrcForUser(u){ return localStorage.getItem(getUserKey(u)); }
function saveSrcForUser(u, src){ localStorage.setItem(getUserKey(u), src); }

document.addEventListener('DOMContentLoaded', ()=>{
	const frame = document.getElementById('puzzleFrame');
	const openBtn = document.getElementById('openBtn');
	const copyBtn = document.getElementById('copyBtn');
	const fsBtn = document.getElementById('fsBtn');
	const resetBtn = document.getElementById('resetBtn');
	const card = document.getElementById('puzzle-card');

	const userArea = document.getElementById('userArea');
	const loginOverlay = document.getElementById('loginOverlay');
	const loginForm = document.getElementById('loginForm');
	const usernameSelect = document.getElementById('username');
	const passwordInput = document.getElementById('password');
	const demoBtn = document.getElementById('demoBtn');

	// populate username select
	DUMMY_USERS.forEach(u=>{
		const opt = document.createElement('option'); opt.value = u.username; opt.textContent = u.username;
		usernameSelect.appendChild(opt);
	});

	// if a user is already in sessionStorage, restore
	const current = sessionStorage.getItem('currentUser');
	if(current){
		afterLogin(current);
	} else {
		showLogin();
	}

	// Demo quick login: fill first account
	demoBtn.addEventListener('click', ()=>{
		usernameSelect.value = DUMMY_USERS[0].username;
		passwordInput.value = DUMMY_USERS[0].password;
	});

	loginForm.addEventListener('submit', (e)=>{
		e.preventDefault();
		const user = usernameSelect.value;
		const pass = passwordInput.value;
		const found = DUMMY_USERS.find(u=>u.username===user && u.password===pass);
		if(found){
			sessionStorage.setItem('currentUser', user);
			showToast(`Signed in as ${user}`);
			afterLogin(user);
			loginOverlay.hidden = true;
		} else {
			showToast('Invalid credentials', true);
		}
	});

	function showLogin(){
		loginOverlay.hidden = false;
		passwordInput.value = '';
		usernameSelect.focus();
	}

	function afterLogin(username){
		renderUserArea(username);
		// set iframe src: use saved src if exists, otherwise create a new per-user URL
		const saved = getSavedSrcForUser(username);
		const src = saved || makeUserSrc(username);
		setIframeSrc(src);
		saveSrcForUser(username, src);
	}

	function makeUserSrc(username){
		// append query params to try to isolate instances per user
		const params = new URLSearchParams({player: username, t: Date.now()});
		return `${BASE_IFRAME}?${params.toString()}`;
	}

	function setIframeSrc(src){
		if(frame) frame.src = src;
	}

	function renderUserArea(username){
		userArea.innerHTML = '';
		const badge = document.createElement('div'); badge.className='user-badge'; badge.textContent = username;
		const logout = document.createElement('button'); logout.className='btn'; logout.textContent='Logout';
		logout.addEventListener('click', ()=>{
			sessionStorage.removeItem('currentUser');
			// leave saved src in localStorage so next time user returns their instance persists
			showLogin();
			// clear iframe
			setIframeSrc('');
		});
		userArea.appendChild(badge);
		userArea.appendChild(logout);
	}

	openBtn.addEventListener('click', ()=>{
		if(frame && frame.src){ window.open(frame.src, '_blank'); }
		else showToast('Please sign in first', true);
	});

	copyBtn.addEventListener('click', async ()=>{
		const url = frame?.src || window.location.href;
		if(navigator.clipboard && navigator.clipboard.writeText){
			try{ await navigator.clipboard.writeText(url); copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy link',1200);}catch(e){fallbackCopy(url)}
		} else { fallbackCopy(url) }
	});

	resetBtn.addEventListener('click', ()=>{
		const u = sessionStorage.getItem('currentUser');
		if(!u){ showToast('Not signed in', true); return; }
		const src = makeUserSrc(u);
		setIframeSrc(src);
		saveSrcForUser(u, src);
		showToast('Your puzzle instance has been reset');
	});

	function fallbackCopy(text){
		const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
		try{ document.execCommand('copy'); showToast('Link copied to clipboard'); }catch(e){ prompt('Copy this link', text); }
		ta.remove();
	}

	fsBtn.addEventListener('click', ()=>toggleFullscreen(card));

	// Toggle fullscreen for an element
	function toggleFullscreen(el){
		if(!el) return;
		if(document.fullscreenElement || document.webkitFullscreenElement){
			if(document.exitFullscreen) document.exitFullscreen();
			else if(document.webkitExitFullscreen) document.webkitExitFullscreen();
		} else {
			if(el.requestFullscreen) el.requestFullscreen();
			else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
		}
	}

	// Keyboard shortcut: F toggles fullscreen
	document.addEventListener('keydown', (e)=>{
		if(e.key === 'f' || e.key === 'F'){
			e.preventDefault(); toggleFullscreen(card);
		}
	});

	// small toast helper
	function showToast(msg, isError){
		// simple alert-like transient message
		const el = document.createElement('div'); el.textContent = msg; el.style.position='fixed'; el.style.right='18px'; el.style.bottom='18px'; el.style.padding='10px 14px'; el.style.background=isError? 'rgba(220,80,80,0.95)':'rgba(8,70,160,0.95)'; el.style.color='white'; el.style.borderRadius='8px'; el.style.zIndex='80'; document.body.appendChild(el);
		setTimeout(()=>el.remove(),1400);
	}

});


