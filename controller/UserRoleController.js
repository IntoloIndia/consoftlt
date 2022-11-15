import {API_URL} from '@env';

const getUserRole = async company_id => {
  try {
    const res = await fetch(API_URL + 'role/' + company_id, {
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

const roleByUser = async (company_id, role_id) => {
  try {
    const res = await fetch(
      API_URL + 'role-by-users/' + company_id + '/' + role_id,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

const getUsers = async company_id => {
  try {
    const res = await fetch(API_URL + 'users/' + company_id, {
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

const getSingleUser = async user_id => {
  try {
    const res = await fetch(API_URL + 'user/' + user_id, {
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

const postUserRole = async formData => {
  try {
    const res = await fetch(API_URL + 'role', {
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

const updateUserRole = async (id, formData) => {
  try {
    const res = await fetch(API_URL + 'update-role/' + id, {
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

const getPrivileges = async () => {
  try {
    const res = await fetch(API_URL + 'privilege', {
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

const getUserByPrivileges = async (company_id, privilege_id) => {
  try {
    const res = await fetch(
      API_URL + 'privilege-by-users/' + company_id + '/' + privilege_id,
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

export {
  getUserRole,
  roleByUser,
  getUsers,
  postUserRole,
  getPrivileges,
  getSingleUser,
  getUserByPrivileges,
  updateUserRole,
};
