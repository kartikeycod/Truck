// const admin = require("firebase-admin");
// const path = require("path");

// // Firebase project (fuel-verification-efff2) ki key ka path
// const serviceAccount = require("./firebase-key.json");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });
// }

// const db = admin.firestore();
// module.exports = db;
const admin = require("firebase-admin");

// Firebase service account
const serviceAccount =require("./service-account.json");

// const serviceAccount = require("./firebase-key.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ✅ export BOTH db and admin
module.exports = { db, admin };                                                                       