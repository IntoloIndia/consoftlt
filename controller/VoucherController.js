import {API_URL} from '@env';

const getPendingVoucher = async (company_id, date, voucher_type) => {
  try {
    const res = await fetch(
      API_URL + 'voucher/' + company_id + '/' + date + '/' + voucher_type,
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

const getVerifiedVoucher = async (company_id, date) => {
  try {
    const res = await fetch(
      API_URL + 'verified-voucher/' + company_id + '/' + date,
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

const getRevertedVoucher = async (company_id, date) => {
  try {
    const res = await fetch(
      API_URL + 'reverted-voucher/' + company_id + '/' + date,
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

const verifyVoucher = async id => {
  try {
    const res = await fetch(API_URL + 'verify-voucher/' + id, {
      method: 'put',
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

const revertVoucher = async id => {
  try {
    const res = await fetch(API_URL + 'revert-voucher/' + id, {
      method: 'put',
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
  getPendingVoucher,
  getVerifiedVoucher,
  getRevertedVoucher,
  verifyVoucher,
  revertVoucher,
};
