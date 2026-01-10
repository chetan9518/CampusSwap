import admin from "firebase-admin";
import serviceAccount from "../../admin.json";

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
      });
    } catch (error) {
      console.warn("⚠️  Firebase Admin not initialized - missing environment variables and admin.json");
      console.warn("Add FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY to your .env file");
    }


export default admin;