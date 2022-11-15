import {API_URL} from '@env';

const getUserAttendance = async (company_id, year, month, user_id) => {
  try {
    const res = await fetch(
      API_URL +
        'attendance/' +
        company_id +
        '/' +
        year +
        '/' +
        month +
        '/' +
        user_id,
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

const getCheckUserPresent = async (company_id, user_id) => {
  // console.log("id1",company_id);
  // console.log("id2",user_id);
  try {
    const res = await fetch(
      API_URL + 'check-present/' + company_id + '/' + user_id,
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

const postUserAttendance = async formData => {
  try {
    const res = await fetch(API_URL + 'attendance', {
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

export {getUserAttendance, postUserAttendance, getCheckUserPresent};
