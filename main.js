import './style.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize the map when DOM is loaded
function initMap() {
  const map = L.map('campus-map').setView([51.505, -0.09], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.marker([35.51418979227663, 44.80524008876968])
    .addTo(map)
    .bindPopup('Main Building')
    .openPopup();
}

document.querySelector('#app').innerHTML = `
  <div>
    <h1>University App</h1>
    
    <!-- News Section -->
    <div class="news-section">
      <h2>News & Announcements</h2>
      <div id="newsList"></div>
    </div>
    
    <!-- Schedule Section -->
    <div class="schedule-section">
      <h2>Class Schedule</h2>
      <input type="text" id="className" placeholder="Class Name" />
      <input type="datetime-local" id="classTime" />
      <button id="addClassBtn">Add Class</button>
      <ul id="classList"></ul>
    </div>
    
    <!-- Campus Map Section -->
    <div class="map-section">
      <h2>Campus Map</h2>
      <div id="campus-map" style="height: 400px; width: 100%;"></div>
    </div>
  </div>
`;

// Load announcements from Firebase
async function loadAnnouncements() {
  const newsList = document.getElementById('newsList');
  const querySnapshot = await getDocs(collection(db, 'announcements'));
  
  newsList.innerHTML = querySnapshot.docs.map(doc => `
    <div class="announcement ${doc.data().priority}-priority">
      <h3>${doc.data().title}</h3>
      <small>Posted: ${new Date(doc.data().date).toLocaleDateString()}</small>
      <p>${doc.data().content}</p>
    </div>
  `).join('');
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadAnnouncements();
  document.getElementById('addClassBtn').addEventListener('click', addClass);
});

// Your existing Firebase functions
async function addClass() {
  const className = document.getElementById('className').value;
  const classTime = document.getElementById('classTime').value;

  if (!className || !classTime) return;

  await addDoc(collection(db, 'classes'), { className, classTime });
  document.getElementById('className').value = '';
  
  Notification.requestPermission().then(perm => {
    if (perm === 'granted') {
      new Notification(`Added: ${className}`, { 
        body: `Scheduled for ${new Date(classTime).toLocaleString()}`
      });
    }
  });
}

onSnapshot(collection(db, 'classes'), (snapshot) => {
  const classList = document.getElementById('classList');
  classList.innerHTML = snapshot.docs.map(doc => `
    <li>
      ${doc.data().className} - ${new Date(doc.data().classTime).toLocaleString()}
      <button onclick="deleteClass('${doc.id}')">Delete</button>
    </li>
  `).join('');
});

async function deleteClass(id) {
  await deleteDoc(doc(db, 'classes', id));
}