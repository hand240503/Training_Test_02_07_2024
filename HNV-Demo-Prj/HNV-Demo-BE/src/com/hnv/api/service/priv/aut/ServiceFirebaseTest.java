package com.hnv.api.service.priv.aut;

import java.io.FileInputStream;
import java.util.HashMap;
import java.util.Map;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;

public class ServiceFirebaseTest {
	public static void setCustomUserClaims(
			String uid,String idTok) throws Exception {
		// [START set_custom_user_claims]
		// Set admin privilege on the user corresponding to uid.
		Map<String, Object> claims = new HashMap<>();
		claims.put("admin", true);
		FirebaseAuth.getInstance().setCustomUserClaims(uid, claims);
		// The new custom claims will propagate to the user's ID token the
		// next time a new one is issued.
		// [END set_custom_user_claims]

		// [START verify_custom_claims]
		// Verify the ID token first.
		FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idTok);
		if (Boolean.TRUE.equals(decoded.getClaims().get("admin"))) {
			// Allow access to requested admin resource.
		}
		// [END verify_custom_claims]

		// [START read_custom_user_claims]
		// Lookup the user associated with the specified uid.
		UserRecord user = FirebaseAuth.getInstance().getUser(uid);
		System.out.println(user.getCustomClaims().get("admin"));
		// [END read_custom_user_claims]
	}

	public static void verifyIdTokenCheckRevoked(String idToken) {
		// [START verify_id_token_check_revoked]
		try {
			FileInputStream serviceAccount =
					new FileInputStream("/zenzobs-firebase.json");

			FirebaseOptions options = new FirebaseOptions.Builder()
					.setCredentials(GoogleCredentials.fromStream(serviceAccount))
					.build();

			FirebaseApp.initializeApp(options);
			boolean checkRevoked = true;
			FirebaseToken decodedToken = FirebaseAuth.getInstance()
					.verifyIdToken(idToken, checkRevoked);
			// Token is valid and not revoked.
			String uid = decodedToken.getUid();
			UserRecord user = FirebaseAuth.getInstance().getUser(uid);
			System.out.println(uid);
		} catch (Exception e) {
			e.printStackTrace();
		}
		// [END verify_id_token_check_revoked]
	}




	public static void main(String []a)throws Exception{
		/*{
	    	    "providerId": "google.com",
	    	    "signInMethod": "google.com",
	    	    "oauthIdToken": "",
	    	    "oauthAccessToken": 	""
	    	}*/
		//https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=accessToken
		//https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=

		String idToken			=   "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM2MGI5ZGUwODBmZmFmYmZjMTgzMzllY2Q0NGFjNzdmN2ZhNGU4ZDMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiVsWpIEhvw6BuZyBOZ3V5w6puIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVfS0tuUzRQTmxlbHpGNnoxcURuU0tGTTZlUkNfU2hMSHlZbUV0ZGZhbE5nPXM5Ni1jIiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL3plbnpvYnMiLCJhdWQiOiJ6ZW56b2JzIiwiYXV0aF90aW1lIjoxNjkzMzAwODgyLCJ1c2VyX2lkIjoiQXNsWTFKdzVLOGFiTEhxS1gxcmtISjN3dld2MiIsInN1YiI6IkFzbFkxSnc1SzhhYkxIcUtYMXJrSEozd3ZXdjIiLCJpYXQiOjE2OTMzMDA4ODYsImV4cCI6MTY5MzMwNDQ4NiwiZW1haWwiOiJobnZ1QHZrdS51ZG4udm4iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwMDA3MTI1NjY0MDkwODAxOTIxMyJdLCJlbWFpbCI6WyJobnZ1QHZrdS51ZG4udm4iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.ON92Jv5mYfrm6D_j9_spRZIvjkwO_MxBqyQDYXuC1p_V8036_Lwu5YPNPJFkjilZwJ7yTK3-c5JWw9neo6LobBsoM2YzcPPiOZgI_Fiap3IuIrMyTya48S7tLRH4_h0gnZwO669eM_Ttpp07RF4vQG7DVIiklzgf9GxOI5jPzLTvm_BdtZxy9Tugukc5a0B2ZvpLsvAIbiUjTCcXwA22ai4B-pKc8cIua6WK6b-mydzz5cK2tITi9k2Ze5M7y0KXHCcWEh65AxwzH6vbt_N_vvU4FuiVRotAvrHot0fn_t2m6zyuRl1fBq5RHqkAcmE3sVCoqmMpIFcJLXHeAD-_ZA";
		verifyIdTokenCheckRevoked (idToken);
	}

}
