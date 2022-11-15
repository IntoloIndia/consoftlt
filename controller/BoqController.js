import {API_URL} from '@env';

const postBoqNewAddItem = async formData => {
  try {
    const res = await fetch(API_URL + 'quantity-report-item', {
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

const getBoqItemsList = async company_id => {
  try {
    const res = await fetch(API_URL + 'quantity-report-item/' + company_id, {
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

const postBOQItem = async formData => {
  try {
    const res = await fetch(API_URL + 'manage-boq', {
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

const getBOQItems = async (company_id, project_id) => {
  try {
    const res = await fetch(
      API_URL + 'manage-boq/' + company_id + '/' + project_id,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateBoqItem = async (id, formData) => {
  try {
    const res = await fetch(API_URL + 'update-manage-boq/' + id, {
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

export {
  postBoqNewAddItem,
  getBoqItemsList,
  postBOQItem,
  getBOQItems,
  updateBoqItem,
};
