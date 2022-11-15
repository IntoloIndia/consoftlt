import {API_URL} from '@env';

const getSubmitWorks = async company_id => {
  try {
    const res = await fetch(`${API_URL}submit-works/` + `${company_id}`, {
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

const getVerifyAndRevertWorks = async company_id => {
  try {
    const res = await fetch(API_URL + 'verify-revert-works/' + company_id, {
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

const getAssignWorks = async company_id => {
  try {
    const res = await fetch(API_URL + 'assign-works/' + company_id, {
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

const deleteAssignWorks = async work_id => {
  try {
    const res = await fetch(`${API_URL}sub-assign-work/` + `${work_id}`, {
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

const postAssignWork = async formData => {
  try {
    const res = await fetch(API_URL + 'assign-works', {
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

export {
  getSubmitWorks,
  getVerifyAndRevertWorks,
  getAssignWorks,
  deleteAssignWorks,
  postAssignWork,
};
