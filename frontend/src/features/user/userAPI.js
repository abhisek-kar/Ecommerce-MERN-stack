import { API } from "../../services/API";

export function fetchLoggedInUserOrders() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/order/own");
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

export function fetchLoggedInUser() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/user/own");
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

export function updateUser(update) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.patch("/user/" + update.id, update);
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
