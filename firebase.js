import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";

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

window.cloudSave = async function() {
  const btn = document.getElementById('cloudSaveBtn');
  btn.textContent = 'Saving...';
  btn.disabled = true;
  try {
    await setDoc(SCHEDULE_DOC, { state: JSON.stringify(window.state) });
    btn.textContent = 'Saved!';
    setTimeout(() => { btn.textContent = 'Save'; btn.disabled = false; }, 2000);
  } catch(e) {
    console.error('Cloud save failed:', e);
    btn.textContent = 'Save failed';
    setTimeout(() => { btn.textContent = 'Save'; btn.disabled = false; }, 3000);
  }
};

// Auto-load from cloud on startup, then re-render
(async () => {
  try {
    const snap = await getDoc(SCHEDULE_DOC);
    if (snap.exists()) {
      window.state = { ...window.state, ...JSON.parse(snap.data().state) };
      saveState();
      initAll();
    }
  } catch(e) {
    console.warn('Could not load from cloud, using local data:', e);
  }
})();
