// import Config from '../../../config'

const Get_Project_Team_Data = async project_id => {
  const resp = await fetch(`${process.env.API_URL}project-team/${project_id}`);
  return resp;
};

const Get_Contractor_Data = async project_id => {
  const getData = await fetch(
    `${process.env.API_URL}project-by-contractor/${project_id}`,
  );
  return getData;
};

const Get_user_role = async company_id => {
  const res = await fetch(`${process.env.API_URL}role/${company_id}`);
  const data = await res.json();
  return data;
};

const Get_user_name_by_role = async Id => {
  const res = await fetch(`${process.env.API_URL}role-by-users/${Id}`);
  const data = await res.json();
  return data;
};

const get_latest_steel_id = async company_id => {
  const res = await fetch(
    `${process.env.API_URL}steel-quantity-item/${company_id}`,
  );
  const data = await res.json();
  return data;
};

const Insert_project_team_data = async teamData => {
  try {
    const res = await fetch(`${process.env.API_URL}project-team`, {
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

const Insert_report_data = async (report_post_data, CONST_FIELD) => {
  try {
    const res = fetch(`${process.env.API_URL}report/${CONST_FIELD.QUANTITY}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(report_post_data),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const save_new_equipment_item = async data => {
  try {
    const res = fetch(`${process.env.API_URL}tools-machinery`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const insert_manpower_report = async (manpower_post_data, CONST_FIELD) => {
  try {
    const res = fetch(`${process.env.API_URL}report/${CONST_FIELD.MANPOWER}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(manpower_post_data),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const insert_stock_data = quality_post_data => {
  try {
    const res = fetch(`${process.env.API_URL}stock-entry/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(quality_post_data),
    });
    // const data = await res.json();
    return res;
  } catch (error) {
    console.log(error);
  }
};
const insert_TAndP_report = (resp_data, CONST_FIELD) => {
  try {
    const resp = fetch(`${process.env.API_URL}report/${CONST_FIELD.TANDP}/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(resp_data),
    });
    // const data = awaresp.json();
    return resp;
  } catch (error) {
    console.log(error);
  }
};

const insert_new_category = new_categ_post => {
  try {
    const res = fetch(`${process.env.API_URL}manpower-category/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(new_categ_post),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const insert_new_sub_category = new_subCateg_post => {
  try {
    const res = fetch(`${process.env.API_URL}manpower-sub-category/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(new_subCateg_post),
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const get_new_category = (company_id, project_id) => {
  try {
    const res = fetch(
      `${process.env.API_URL}manpower-category/${company_id}/${project_id}/`,
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};
const filter_new_category_by_cont_Id = (
  company_id,
  project_id,
  contractor_id,
) => {
  try {
    const res = fetch(
      `${process.env.API_URL}manpower-category/${company_id}/${project_id}/${contractor_id}/`,
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

const get_new_sub_category = Id => {
  try {
    const res = fetch(`${process.env.API_URL}manpower-sub-category/${Id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const get_stock_data = async () => {
  try {
    const res = fetch(`${process.env.API_URL}stock-entry/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const get_filter_voucher = async (company_id, curr_date,voucher_type) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}filter-voucher/${company_id}/${curr_date}/${voucher_type}`,
    );
    const data = await res.json();
    return data;
  } catch (error) {}
};

const get_manpower_report = async (project_id, user_id, curr_date) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}manpower-report/${project_id}/${user_id}/${curr_date}/`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
const get_equipment_report = async (project_id, user_id, curr_date) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}tools-machinery-report/${project_id}/${user_id}/${curr_date}/`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const edit_report_data = Id => {
  try {
    const res = fetch(`${process.env.API_URL}edit-quantity-report/${Id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};
const edit_manpower_report_data = (cont_id, curr_date) => {
  try {
    const res = fetch(
      `${process.env.API_URL}edit-manpower-report/${cont_id}/${curr_date}`,
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};
const edit_TAndP_report_data = id => {
  try {
    const res = fetch(
      `${process.env.API_URL}edit-tools-machinery-report/${id}`,
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

const delete_report_data = Id => {
  try {
    const res = fetch(`${process.env.API_URL}delete-quantity-report/${Id}`);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const delete_manpower_data = async Id => {
  try {
    const res = await fetch(`${process.env.API_URL}contractor/${Id}`, {
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

const delete_Qty_Record = async Id => {
  try {
    const res = await fetch(`${process.env.API_URL}/quantity-report/${Id}`, {
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

const Get_report_data = async (project_id, user_id, user_date) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}quantity-report/${project_id}/${user_id}/${user_date}/`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const get_quality_type = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}quality-type`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const check_quantity_item_exist = async (project_id, user_id, current_date) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}quantity-item-exist/${project_id}/${user_id}/${current_date}`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const update_quantity_data = async (Id, inputs) => {
  try {
    const res = await fetch(`${process.env.API_URL}quantity-report/${Id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
const update_manpower_report = async (manpower_report_id, inputs) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}manpower-report/${manpower_report_id}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const update_TAndP_report_data = async (id, equipmentField) => {
  try {
    const res = await fetch(
      `${process.env.API_URL}tools-machinery-report/${id}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipmentField),
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const get_stock_item_name = async () => {
  try {
    const res = await fetch(`${process.env.API_URL}item`);
    const data = await res.json();
    return data;
  } catch (error) {}
};
const get_equipment_item_name = async () => {
  try {
    const res = await fetch(
      `${process.env.API_URL}tools-machinery`,
    );
    const data = await res.json();
    return data;
  } catch (error) {}
};

const get_works_in_progress = async Id => {
  try {
    const res = await fetch(`${process.env.API_URL}user-assign-works/${Id}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
const get_completed_task = async user_Id => {
  try {
    const res = await fetch(
      `${process.env.API_URL}user-completed-works/${user_Id}`,
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export {
  Get_Project_Team_Data,
  Get_Contractor_Data,
  Get_user_role,
  Insert_report_data,
  Get_report_data,
  edit_report_data,
  delete_report_data,
  check_quantity_item_exist,
  update_quantity_data,
  get_quality_type,
  get_new_sub_category,
  get_stock_item_name,
  insert_stock_data,
  get_stock_data,
  insert_new_category,
  get_new_category,
  insert_new_sub_category,
  insert_manpower_report,
  get_manpower_report,
  delete_manpower_data,
  filter_new_category_by_cont_Id,
  get_works_in_progress,
  Get_user_name_by_role,
  Insert_project_team_data,
  edit_manpower_report_data,
  update_manpower_report,
  get_equipment_item_name,
  save_new_equipment_item,
  insert_TAndP_report,
  get_equipment_report,
  edit_TAndP_report_data,
  update_TAndP_report_data,
  get_completed_task,
  delete_Qty_Record,
  get_latest_steel_id,
  get_filter_voucher
};
