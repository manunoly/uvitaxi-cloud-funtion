
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();

export const addAdminRole = functions.https.onCall(async (request, response) => {
    // check request is made by an admin
    // const respuesta = response.auth;
    // if (respuesta && respuesta.token.admin !== true) {
    //     return { error: 'Only admins can add other admins' }
    // }
    
    const userSnap = await db.doc('claims/DDcIA6OG8PTRQiKPFOynLYipKRm1').get();
    let claminP = {};
    if (userSnap.data()) {
        claminP = userSnap.data() as any;
    }
    return admin.auth().getUserByEmail(request.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid, claminP)
    }).then(() => {
        return {
            message: `Success! ${request.email} has been made an admin.`
        }
    }).catch(err => {
        return err;
    });
});


//createdClaims({admin:true})
export const createdClaims = functions.firestore
  .document('claims/{userId}')
  .onWrite(async (snapshot: any, context:any) => {
    const userSnap = await db.doc(`claims/${context.params.userId}`).get();
    const userData = await userSnap.data() as any || {};
    delete userData.updatedAt;
    return grantClaims(userData, context.params.userId)

  });

function grantClaims(claims: any, id?: any) {
    return admin.auth().setCustomUserClaims(id, claims);
}