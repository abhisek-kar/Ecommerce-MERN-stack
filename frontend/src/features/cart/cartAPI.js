import { API } from "../../services/API";

export function addToCart(item) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.post("/cart", item);
      if (data.success) {
        resolve(data);
      } else reject(data.message);
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchItemsByUserId() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/cart");
      if (data.success) {
        resolve(data);
      } else reject(data.message);
    } catch (error) {
      reject(error);
    }
  });
}

export function updateCart(update) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.patch("/cart/" + update.id, {
        quantity: update.quantity,
      });
      if (data.success) {
        resolve(data);
      } else reject(data.message);
    } catch (error) {
      reject(error);
    }
  });
}

export function deleteItemFromCart(itemId) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.delete("/cart/" + itemId);
      if (data.success) {
        resolve(data);
      } else reject(data.message);
    } catch (error) {
      reject(error);
    }

    resolve({ data: { id: itemId } });
  });
}

export function resetCart() {
  // get all items of user's cart - and then delete each
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await fetchItemsByUserId();
      if (data.success) {
        for (let item of data) {
          await deleteItemFromCart(item?.id);
        }
        resolve(data);
      } else reject(data.message);
    } catch (error) {
      reject(error);
    }
  });
}
