import {API_URL} from '@env';

const getReport = async (project_id, date, user_id) => {
  try {
    const res = await fetch(
      API_URL + 'report/' + project_id + '/' + date + '/' + user_id,
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
    return error;
  }
};

const getManpower = async report_id => {
  try {
    const res = await fetch(
      API_URL + 'manpower-report-by-report-id/' + report_id,
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
    return error;
  }
};

const getQuantity = async report_id => {
  try {
    const res = await fetch(
      API_URL + 'quantity-report-by-report-id/' + report_id,
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
    return error;
  }
};

const getProjectAtGlance = async company_id => {
  try {
    const res = await fetch(API_URL + 'projects-at-glance/' + company_id, {
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

const postProjectReportPath = async formData => {
  try {
    const res = await fetch(API_URL + 'project-report-path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
};

const getProjectReportPath = async (company_id, project_id) => {
  try {
    const res = await fetch(
      API_URL + 'project-report-path/' + company_id + '/' + project_id,
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
    return error;
  }
};

const verifyReport = async (project_id, report_id, user_id) => {
  try {
    const res = await fetch(
      API_URL + 'verify-report/' + project_id + '/' + report_id + '/' + user_id,
      {
        method: 'put',
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

const finalVerifyReport = async (company_id, project_id, report_id) => {
  try {
    const res = await fetch(
      API_URL +
        'final-verify-report/' +
        company_id +
        '/' +
        project_id +
        '/' +
        report_id,
      {
        method: 'put',
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

const revertReport = async (project_id, report_id, user_id, formData) => {
  try {
    const res = await fetch(
      API_URL + 'revert-report/' + project_id + '/' + report_id + '/' + user_id,
      {
        method: 'PUT',
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
const finalRevertReport = async (
  company_id,
  project_id,
  report_id,
  formData,
) => {
  try {
    const res = await fetch(
      API_URL +
        'final-revert-report/' +
        company_id +
        '/' +
        project_id +
        '/' +
        report_id,
      {
        method: 'PUT',
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

const deleteReportPath = async id => {
  try {
    const res = await fetch(API_URL + 'project-report-path/' + id, {
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

export {
  getReport,
  getManpower,
  getQuantity,
  getProjectAtGlance,
  postProjectReportPath,
  getProjectReportPath,
  verifyReport,
  revertReport,
  finalVerifyReport,
  finalRevertReport,
  deleteReportPath,
};
