import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function loadMenu(menuContainer) {
  const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
  const querySnapshot = await getDocs(collection(db, "menus"));
  
  querySnapshot.forEach((doc) => {
    if (doc.id === today) {
      menuContainer.innerHTML = `<p>${doc.data().items}</p>`;
    }
  });
}