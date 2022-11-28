import {API_URL} from '@env';

const postItem = async dataitem => {
  try {
    const res = await fetch(API_URL + 'item', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataitem),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

//   unit save api
const postUnit = async formData => {
  try {
    const res = await fetch(API_URL + 'unit', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUnits = async () => {
  try {
    const res = await fetch(API_URL + 'unit', {
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

const getItems = async () => {
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

const updateItems = async (itemId, formData) => {
  try {
    const res = await fetch(API_URL + 'item/' + itemId, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteItems = async id => {
  try {
    const res = await fetch(API_URL + 'item/' + id, {
      method: 'delete',
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

export {postItem, getUnits, getItems, updateItems, deleteItems, postUnit};
