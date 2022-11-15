import {API_URL} from '@env';

const getUserLeaves = async company_id => {
  try {
    const res = await fetch(API_URL + 'leaves/' + company_id, {
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

const postUserLeaves = async (id, formData) => {
  try {
    const res = await fetch(API_URL + 'approve-leaves/' + id, {
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

export {getUserLeaves, postUserLeaves};
