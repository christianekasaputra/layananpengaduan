var admin = require("firebase-admin");
var serviceAccount = {
privateKey: "2ieQ0qrcrEYPVvHHTYR2GXH2RSWdCAvWGjcpI5bd",
projectId: "pegaduan-395e6",
clientEmail: "firebase-adminsdk-h3b8j@pegaduan-395e6.iam.gserviceaccount.com"
};

var admfb = admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
databaseURL: "https://pegaduan-395e6.firebaseio.com"
});