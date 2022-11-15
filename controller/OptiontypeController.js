import {API_URL} from '@env';

const postoptionitem = async optiondata  => {
  try {
    const res = await fetch(API_URL + 'checklist-option-type', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(optiondata),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getoptiontypeitem = async (accessTokenoptiontype) => {
    // console.log(accessTokenoptiontype)
    try {
      const res = await fetch(`${API_URL}checklist-option-type`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer '+accessTokenoptiontype ,
        },
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const updateOptionitems = async (id,optiondataupdate) => {
    // console.log("asdgASDGHJKAsd",id)
    try {
      const res = await fetch(`${API_URL}checklist-option-type/` + id, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(optiondataupdate),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const optionItemDelete = async id => {
    // console.log('object', id);
    try {
      const res = await fetch(API_URL + 'checklist-option-type/' + id, {
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
    postoptionitem,getoptiontypeitem,updateOptionitems,optionItemDelete
};
