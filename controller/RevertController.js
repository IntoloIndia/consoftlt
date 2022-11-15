import {API_URL} from '@env';

const revertAssignWorks = async (work_id, formData) => {
  try {
    const res = await fetch(
      `${API_URL}change-work-completion-time/` + `${work_id}`,
      {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const revertSubmitWork = async (work_id, formData) => {
  try {
    const res = await fetch(`${API_URL}revert-submit-work/` + `${work_id}`, {
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

export {revertSubmitWork, revertAssignWorks};
