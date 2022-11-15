import {API_URL} from '@env';

const getContractors = async company_id => {
  try {
    const res = await fetch(API_URL + 'contractor/' + company_id, {
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

const postContractors = async formData => {
  try {
    const res = await fetch(API_URL + 'contractor', {
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

const deleteContractors = async id => {
  try {
    const res = await fetch(API_URL + 'contractor/' + id, {
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

const updateContractors = async (formData, contractor_id) => {
  try {
    const res = await fetch(API_URL + 'contractor/' + contractor_id, {
      method: 'PUT',
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

export {getContractors, postContractors, deleteContractors, updateContractors};
