import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  getDocFromServer,
  serverTimestamp,
  limit
} from 'firebase/firestore';
import { HistoryItem, QueryType } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Check if credentials are set
export const isFirebaseConfigured = !!(firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "");

let app: any = null;
export let db: any = null;
export let auth: any = null;
export let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.error("Firebase initialization failed dynamically:", err);
  }
}

// Standard handleFirestoreError defined by secure guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection function as required by skill constraints
export async function testConnection() {
  if (!isFirebaseConfigured || !db) return;
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

// Call connection test on import
testConnection();

// Save Query and AI response history
export async function saveHistoryItem(queryType: QueryType, prompt: string, response: string): Promise<HistoryItem> {
  const userId = auth?.currentUser?.uid || 'anonymous';
  const userEmail = auth?.currentUser?.email || 'Guest';

  const docData = {
    userId,
    userEmail,
    queryType,
    prompt,
    response,
    createdAt: new Date().toISOString() // Dynamic ISO String fallback
  };

  if (!isFirebaseConfigured || userId === 'anonymous' || !db) {
    // Sandbox backup to localStorage
    const mockItem: HistoryItem = {
      ...docData,
      id: "local_" + Date.now(),
      createdAt: new Date().toISOString()
    };
    const localHist = JSON.parse(localStorage.getItem('cricmind_history') || '[]');
    localHist.unshift(mockItem);
    localStorage.setItem('cricmind_history', JSON.stringify(localHist.slice(0, 50)));
    return mockItem;
  }

  const path = 'history';
  try {
    // Write using Firestore
    const docRef = await addDoc(collection(db, path), {
      ...docData,
      createdAt: serverTimestamp() // Set native Firestore Server Timestamp
    });
    return {
      id: docRef.id,
      ...docData,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    return handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Retrieve History
export async function getHistoryList(): Promise<HistoryItem[]> {
  const userId = auth?.currentUser?.uid;
  
  if (!isFirebaseConfigured || !userId || !db) {
    // Sandbox lookup in localStorage
    return JSON.parse(localStorage.getItem('cricmind_history') || '[]');
  }

  const path = 'history';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(25)
    );
    const querySnapshot = await getDocs(q);
    const history: HistoryItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      history.push({
        id: doc.id,
        userId: data.userId,
        userEmail: data.userEmail,
        queryType: data.queryType,
        prompt: data.prompt,
        response: data.response,
        createdAt: data.createdAt?.seconds 
          ? new Date(data.createdAt.seconds * 1000).toISOString()
          : data.createdAt || new Date().toISOString()
      });
    });
    return history;
  } catch (error) {
    return handleFirestoreError(error, OperationType.GET, path);
  }
}

// Authenticate helper with Google Login
export async function loginWithGoogle(): Promise<User | null> {
  if (!isFirebaseConfigured) {
    // Simulate generic login
    const mockUser = {
      uid: "mock_user_id_" + Math.floor(Math.random() * 1000),
      email: "guest@cricmind.ai",
      displayName: "Guest Star cricketer",
      photoURL: "https://api.dicebear.com/7.x/bottts/svg?seed=CricMind",
      emailVerified: true
    } as any;
    localStorage.setItem('cricmind_mock_user', JSON.stringify(mockUser));
    return mockUser;
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error("Google Auth popup failed: ", err);
    throw err;
  }
}

// Signout helper
export async function logoutUser() {
  localStorage.removeItem('cricmind_mock_user');
  if (!isFirebaseConfigured) return;
  await signOut(auth);
}

// Listen to auth changes
export function listenToAuth(callback: (user: User | null) => void) {
  if (!isFirebaseConfigured) {
    // Check localStorage mock
    const cached = localStorage.getItem('cricmind_mock_user');
    if (cached) {
      callback(JSON.parse(cached));
    } else {
      callback(null);
    }
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
