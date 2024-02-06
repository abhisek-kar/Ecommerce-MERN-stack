import { API } from "./../../services/API";

export function createUser(userData) {
  return new Promise(async (resolve) => {
    const { data } = await API.post("/auth/register", userData);
    console.log(data);
    resolve(data);
  });
}

export function loginUser(loginInfo) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.post("/auth/login", loginInfo);
      if (data.success) {
        resolve(data);
      } else {
        reject(data.message);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function checkAuth() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/auth/check");
      if (data.success) {
        resolve(data);
      } else {
        reject(data.message);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function signOut(userId) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/auth/logout");
      if (data.success) {
        resolve(data);
      } else {
        reject(data.message);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
}

export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/auth/reset-password-request", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function resetPassword(data) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        resolve({ data });
      } else {
        const error = await response.text();
        reject(error);
      }
    } catch (error) {
      reject(error);
    }
  });
}
