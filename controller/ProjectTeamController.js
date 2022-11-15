import {API_URL} from '@env';

const getProjectTeam = async project_id => {
  try {
    const res = await fetch(API_URL + 'project-team/' + project_id, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

const saveProjectTeam = async teamData => {
  try {
    const res = await fetch(API_URL + 'project-team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

const updateProjectTeam = async (id, formData) => {
  try {
    const res = await fetch(API_URL + 'project-team/' + id, {
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

const deleteProjectTeam = async user_id => {
  try {
    const res = await fetch(API_URL + 'project-team/' + user_id, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

export {getProjectTeam, saveProjectTeam, deleteProjectTeam, updateProjectTeam};
