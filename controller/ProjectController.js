import {API_URL} from '@env';

const getProjects = async company_id => {
  try {
    const res = await fetch(API_URL + 'projects/' + `${company_id}`, {
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

const saveProject = async projectData => {
  try {
    const res = await fetch(API_URL + 'projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

const updateProject = async (project_id, projectData) => {
  try {
    const res = await fetch(API_URL + 'projects/' + project_id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

const deleteProject = async project_id => {
  try {
    const res = await fetch(API_URL + 'projects/' + project_id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    return result;
  } catch (error) {
    return error;
  }
};

const getProjectType = async category_id => {
  try {
    const res = await fetch(
      API_URL + 'project-type-by-category/' + category_id,
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

const getProjectCategory = async company_id => {
  try {
    const res = await fetch(API_URL + 'project-category/' + company_id, {
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

export {
  saveProject,
  getProjects,
  updateProject,
  deleteProject,
  getProjectType,
  getProjectCategory,
};
