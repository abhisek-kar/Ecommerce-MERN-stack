import { API } from "../../services/API";

export function createOrder(order) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.post("/order/create-order", order);
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

export function updateOrder(order) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.patch("/order/" + order.id, order);
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

export function fetchAllOrders(sort, pagination) {
  let queryString = "";

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/order?" + queryString);
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
