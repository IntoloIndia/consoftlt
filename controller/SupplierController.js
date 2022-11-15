import {API_URL} from '@env';

const getSuppliers = async company_id => {
  try {
    const res = await fetch(API_URL + 'supplier/' + company_id, {
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

const postSuppliers = async formData => {
  try {
    const res = await fetch(API_URL + 'supplier', {
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

const deleteSuppliers = async id => {
  try {
    const res = await fetch(API_URL + 'supplier/' + id, {
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

export {getSuppliers, postSuppliers, deleteSuppliers};
