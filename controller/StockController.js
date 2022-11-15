import {API_URL} from '@env';

const getItem = async () => {
  try {
    const res = await fetch(API_URL + 'item', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getStockEntry = async () => {
  try {
    const res = await fetch(API_URL + 'stock-entry', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const postStockEntry = async formData => {
  try {
    const res = await fetch(API_URL + 'stock-entry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export {getItem, getStockEntry, postStockEntry};
