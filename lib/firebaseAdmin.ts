import { initializeApp, cert, getApps, ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import serviceAccount from './serviceAccountKey.json'

function createAdminApp() {
  if (!getApps().length) {
    return initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
    })
  }
  return getApps()[0]
}

const adminApp = createAdminApp()
export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)


