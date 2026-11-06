import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Validate connection to Firestore on initialization
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    // Attempt to read root test document or system config
    const testDoc = doc(db, 'system_settings', 'config');
    await getDocFromServer(testDoc).catch(() => {
      // It's normal if document does not exist yet
    });
    return true;
  } catch (error) {
    console.warn('Firestore server connection check:', error);
    return false;
  }
}

export default app;
