const USER_PRIVILEGES = {
  AD_1: 'admin-1',
  AD_2: 'admin-2',
  AD_3: 'admin-3',
  OTHER_USER: 'other team',
};

const INTERNAL_SERVER_ERROR="Internal server error";

const STATUS = {
  ST_200: '200',
};


const VOUCHER_TYPE = [

  {label: 'Purchase Request', value: '1'},
  {label: 'Received', value: '2'},
  {label: 'Purchased Return', value: '3'},
  {label: 'Received Return', value: '4'},
];

const CHECK_VOUCHER_TYPE = {
  PURCHASED_VOUCHER: 'Purchase Request',
  RECEIVED_VOUCHER: 'Received',
  PURCHASED_RETURN_VOUCHER: 'Purchased Return',
  RECEIVED_RETURN_VOUCHER: 'Received Return',

};

export default {USER_PRIVILEGES, STATUS,INTERNAL_SERVER_ERROR,VOUCHER_TYPE,CHECK_VOUCHER_TYPE};
