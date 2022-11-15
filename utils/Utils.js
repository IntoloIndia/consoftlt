function isValidateText(value) {
  const re = true;
  return re;
}

function isValidateEmail(email) {
  const expression =
    /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  return expression.test(String(email).toLowerCase());
}

function isValidateMobile(mobile) {
  const expression = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (mobile.match(expression)) {
    return true;
  } else {
    return false;
  }
}

function isValidateNumber(number) {
  const expression = /[0-9]/;
  if (number.match(expression)) {
    return true;
  } else {
    return false;
  }
}

function validateText(value, setTextError) {
  if (value == '') {
    setTextError('');
  } else if (isValidateText(value)) {
    setTextError('');
  } else {
    setTextError('Invalid Input');
  }
}

function validateEmail(value, setEmailError) {
  if (value == '') {
    setEmailError('');
  } else if (isValidateEmail(value)) {
    setEmailError('');
  } else {
    setEmailError('Invalid Email');
  }
}

function validateMobile(value, setMobileError) {
  if (value == '') {
    setMobileError('');
  } else if (isValidateMobile(value)) {
    setMobileError('');
  } else {
    setMobileError('Invalid Mobile No.');
  }
}

function validateNumber(value, setNumberError) {
  if (value == '') {
    setNumberError('');
  } else if (isValidateNumber(value)) {
    setNumberError('');
  } else {
    setNumberError('Invalid Number');
  }
}
function validatePassword(value, setPasswordError) {
  if (value.length < 6) {
    setPasswordError('Password must be 6 characters');
  } else {
    setPasswordError('');
  }
}

const utils = {
  validateText,
  isValidateText,
  validateEmail,
  isValidateEmail,
  validateMobile,
  isValidateMobile,
  validateNumber,
  isValidateNumber,
  validatePassword,
};
export default utils;
