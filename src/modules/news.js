import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function loadAnnouncements(newsContainer) {
  const querySnapshot = await getDocs(collection(db, 'announcements'));
  
  newsContainer.innerHTML = querySnapshot.docs.map(doc => `
    <div class="announcement ${doc.data().priority}-priority">
      <h3>${doc.data().title}</h3>
      <small>Posted: ${new Date(doc.data().date).toLocaleDateString()}</small>
      <p>${doc.data().content}</p>
    </div>
  `).join('');
}