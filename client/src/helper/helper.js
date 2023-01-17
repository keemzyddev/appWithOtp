import axios from "axios";
import jwt_decode from "jwt-decode";

// axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_DOMAIN;

// make api request

// get username from token
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find Token");
  let decode = jwt_decode(token);
  return decode;
}

//authenticate user
export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist!" };
  }
}

//get user details
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return { data };
  } catch (error) {
    return { error: "Password doesn't match!" };
  }
}

//register User
export async function registerUser(credentials) {
  try {
    const {
      data: { msg },
      status,
    } = await axios.post(`/api/register`, credentials);

    if (status === 201) {
      let { username, email } = credentials;

      await axios.post("/api/registerMail", {
        username,
        userEmail: email,
        text: msg,
        subject: "User Registration",
      });
    }

    return Promise.resolve(msg);
  } catch (error) {
    return Promise.reject({ error });
  }
}

// login function
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      const { data } = await axios.post(`/api/login`, { username, password });

      return Promise.resolve({ data });
    }
  } catch (error) {
    return Promise.reject({ error: "Password doesn't match" });
  }
}

// update user profile function
export async function updateUser(response) {
  try {
    const bearer_token = `Bearer ${localStorage.getItem("token")}`;
    const data = await axios.put(`/api/updateUser`, response, {
      headers: {
        Authorization: bearer_token,
      },
    });

    return Promise.resolve({ data });
  } catch (error) {
    return Promise.reject({ error: "Couldn't update user" });
  }
}

// generate OTP
export async function generateOTP(username) {
  try {
    const {
      data: { OTP },
      status,
    } = await axios.get(`/api/generateOTP`, { params: { username } });

    //send mail with OTP
    if (status === 201) {
      let {
        data: { email },
      } = await getUser({ username });

      let text = `Your Password Recovery OTP is ${OTP}. Verify and recover your password`;

      await axios.post(`/api/registerMail`, {
        username,
        userEmail: email,
        text,
        subject: "Password recovery OTP",
      });
    }
    return OTP;
  } catch (error) {
    return { error };
  }
}

// verify OTP
export async function verifyOTP({ username, OTP }) {
  try {
    const { data, status } = await axios.get("/api/verifyOTP", {
      params: { username, OTP },
    });

    return { data, status };
  } catch (error) {
    return Promise.reject({ error });
  }
}

// reset password
export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put(`/api/resetPassword`, {
      username,
      password,
    });
    return Promise.resolve({ data, status });
  } catch (error) {
    return Promise.reject({ error });
  }
}
