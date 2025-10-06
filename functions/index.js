// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Fungsi ini akan dipanggil untuk memberikan peran admin ke seorang user
exports.addAdminRole = functions.https.onCall(async (data, context) => {
  // (Opsional tapi direkomendasikan) Cek apakah pemanggil fungsi ini adalah admin
  // Untuk admin pertama, Anda bisa comment bagian ini, deploy, jalankan, lalu uncomment lagi.
  if (context.auth.token.admin !== true) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Hanya admin yang bisa menambahkan admin baru.'
    );
  }

  const email = data.email;
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });
    return { message: `Sukses! ${email} telah dijadikan admin.` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});