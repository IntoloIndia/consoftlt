import {API_URL} from '@env';

const submitItem = async dataitem => {
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
const saveUnitname = async unitdata => {
  try {
    const res = await fetch(API_URL + 'unit', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(unitdata),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getUnits = async () => {
  try {
    const res = await fetch(`${API_URL}unit`, {
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
    const res = await fetch(`${API_URL}item`, {
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

const updateItems = async (itemid, updateItemdata) => {
  try {
    const res = await fetch(`${API_URL}item/` + itemid, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateItemdata),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const deleteitems = async id => {
  // console.log('object', id);
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

export {submitItem, getUnits, saveUnitname, getItems, updateItems, deleteitems};
