import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export function setupScheduleListeners(domElements) {
  return onSnapshot(collection(db, 'classes'), (snapshot) => {
    domElements.classList.innerHTML = snapshot.docs.map(doc => `
      <li>
        ${doc.data().className} - ${new Date(doc.data().classTime).toLocaleString()}
        <button data-id="${doc.id}" class="delete-class">Delete</button>
      </li>
    `).join('');
  });
}

export async function addClass(className, classTime) {
  if (!className || !classTime) throw new Error('Missing fields');
  return addDoc(collection(db, 'classes'), { className, classTime });
}

export async function deleteClass(id) {
  return deleteDoc(doc(db, 'classes', id));
}