import { API } from "../../services/API";

export function fetchProductById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/product/" + id);
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

export function createProduct(product) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.post("/product/create-product", product);
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

export function updateProduct(update) {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.patch("/product/" + update.id, update);
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

export function fetchProductsByFilters(filter, sort, pagination, admin) {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}

  let queryString = "";
  for (let key in filter) {
    const categoryValues = filter[key];
    if (categoryValues.length) {
      queryString += `${key}=${categoryValues}&`;
    }
  }
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }
  if (admin) {
    queryString += `admin=true`;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/product?" + queryString);
      if (data.success) {
        //  resolve({ data: { products: data, totalItems: +totalItems } });
        resolve(data);
      } else {
        reject(data.message);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function fetchCategories() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/category");
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

export function fetchBrands() {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await API.get("/brand");
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
