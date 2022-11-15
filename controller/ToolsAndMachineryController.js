import {API_URL} from '@env';

const getToolsAndMachinery = async () => {
  try {
    const res = await fetch(API_URL + 'tools-machinery', {
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

const postToolsAndMachinery = async formData => {
  try {
    const res = await fetch(API_URL + 'tools-machinery', {
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

const deleteToolsAndMachinery = async id => {
  try {
    const res = await fetch(API_URL + 'tools-machinery/' + id, {
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

const editToolsAndMachinery = async (formData, id) => {
  try {
    const res = await fetch(API_URL + 'tools-machinery/' + id, {
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
  getToolsAndMachinery,
  postToolsAndMachinery,
  deleteToolsAndMachinery,
  editToolsAndMachinery,
};
