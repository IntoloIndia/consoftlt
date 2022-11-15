import {API_URL} from '@env';

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

const postUnits = async unitdata => {
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

const unitDelete = async id => {
  // console.log('object', id);
  try {
    const res = await fetch(API_URL + 'unit/' + id, {
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

const updateUnit = async (unitid, updateunitdata) => {
  try {
    const res = await fetch(`${API_URL}unit/` + unitid, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateunitdata),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export {getUnits,postUnits,unitDelete,updateUnit};
