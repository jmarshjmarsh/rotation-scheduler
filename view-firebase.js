import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAez19-KDoChErj6XR5l0ofA-O6Q5x8jWY",
  authDomain: "vacation-scheduler-5eb8c.firebaseapp.com",
  projectId: "vacation-scheduler-5eb8c",
  storageBucket: "vacation-scheduler-5eb8c.firebasestorage.app",
  messagingSenderId: "155574236532",
  appId: "1:155574236532:web:4b3a27bf14bb857c046821"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const SCHEDULE_DOC = doc(db, 'schedules', 'shared');

function setLiveStatus(text, ok) {
  const el = document.getElementById('liveStatus');
  if (!el) return;
  el.textContent = text;
  el.className = 'live-status ' + (ok ? 'live-ok' : 'live-err');
}

onSnapshot(SCHEDULE_DOC, snap => {
  if (snap.exists()) {
    try {
      window.state = { ...window.state, ...JSON.parse(snap.data().state) };
      saveState();
      initAll();
      const t = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      setLiveStatus('● Live · updated ' + t, true);
    } catch(e) {
      console.warn('Failed to parse cloud state:', e);
      setLiveStatus('⚠ Parse error', false);
    }
  } else {
    setLiveStatus('⚠ No data found', false);
  }
}, err => {
  console.warn('Firestore listener error:', err);
  setLiveStatus('⚠ Connection lost', false);
});
