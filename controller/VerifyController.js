import {API_URL} from '@env';

const verifySubmitWorks = async id => {
  try {
    const res = await fetch(API_URL + 'verify-submit-work/' + id, {
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

export {verifySubmitWorks};
