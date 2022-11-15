import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from 'react-native';

const Apps = ({navigation}) => {
  const [formInputs, setFormInputs] = React.useState([
    {
      key: '',
      userId: '',
      userIdError: '',
      startAmount: '',
      startAmountError: '',
      endAmount: '',
      endAmountError: '',
    },
    // {key: "", userId: "", userIdError: "", startAmount: "", startAmountError: "", endAmount: "", endAmountError: ""},
  ]);

  //Add more inputs rows
  const handleAddMoreLine = () => {
    const _inputs = [...formInputs];
    _inputs.push({
      key: '',
      userId: '',
      userIdError: '',
      startAmount: '',
      startAmountError: '',
      endAmount: '',
      endAmountError: '',
    });
    setFormInputs(_inputs);
  };

 
  //Filter numeric value and remove all unnecessary characters
  function filterOnlyNumericValue(value) {
    return value.replace(/[^0-9]/g, '');
  }

  //Set userId Input Values
  const inputHandleUserId = (text, key) => {
    const _formNumberInputs = [...formInputs];
    _formNumberInputs[key].key = key;
    _formNumberInputs[key].userId = filterOnlyNumericValue(text);
    setFormInputs(_formNumberInputs);
  };

  //Validation userId Input Values
  const handleValidUserId = (text, key) => {
    const _userIdValid = [...formInputs];
    _userIdValid[key].key = key;
    if (key == 0 && (text == null || text == '')) {
      //Make first row field is required
      _userIdValid[key].userIdError = 'Required!';
    } else {
      _userIdValid[key].userId = filterOnlyNumericValue(text);
      _userIdValid[key].userIdError = '';
    }
    setFormInputs(_userIdValid);
  };

  //Set StartAmount Input Values
  const inputHandleStartAmount = (text, key) => {
    const _startAmountInputs = [...formInputs];
    _startAmountInputs[key].key = key;
    _startAmountInputs[key].startAmount = filterOnlyNumericValue(text);
    setFormInputs(_startAmountInputs);
  };

  //Validation StartAmount Input Values
  const handleValidStartAmount = (text, key) => {
    const _startAmountValid = [...formInputs];
    _startAmountValid[key].key = key;
    if (key == 0 && (text == null || text == '')) {
      //Make first row field is required
      _startAmountValid[key].startAmountError = 'Required!';
    } else {
      _startAmountValid[key].startAmount = filterOnlyNumericValue(text);
      _startAmountValid[key].startAmountError = '';
    }
    setFormInputs(_startAmountValid);
  };

  //Set EndAmount Input Values
  const inputHandleEndAmount = (text, key) => {
    const _endAmountInputs = [...formInputs];
    _endAmountInputs[key].key = key;
    _endAmountInputs[key].endAmount = filterOnlyNumericValue(text);
    setFormInputs(_endAmountInputs);
  };

  //Validation EndAmount Input Values
  const handleValidEndAmount = (text, key) => {
    const _endAmountValid = [...formInputs];
    _endAmountValid[key].key = key;
    if (key == 0 && (text == null || text == '')) {
      //Make first row field is required
      _endAmountValid[key].endAmountError = 'Required!';
    } else {
      _endAmountValid[key].endAmount = filterOnlyNumericValue(text);
      _endAmountValid[key].endAmountError = '';
    }
    setFormInputs(_endAmountValid);
  };

  //Function for validate form multiple inputs
  function validateFormMultipleFields() {
    let isValid = true;

    formInputs.map((input, key) => {
      handleValidUserId(input.userId, key);
      handleValidStartAmount(input.startAmount, key);
      handleValidEndAmount(input.endAmount, key);

      if (
        input.userIdError != '' ||
        input.startAmountError != '' ||
        input.endAmountError != ''
      ) {
        isValid = false;
        return;
      }
    });

    return isValid;
  }

  //Submit form date to your API end point
  const handlePressSubmitButton = () => {
    if (!validateFormMultipleFields()) {
      // console.log('Form data is not valid. And not ready to submit.');
      return;
    } else {
      //Form data going to submit on API
      // console.log('Form data is valid and ready to submit.');
      // console.log(formInputs);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.mainContainer}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 30,
              marginBottom: 30,
            }}>
            Multiple Input Fields with Add more
          </Text>
          <View style={styles.submitFormWrapper}>
            {formInputs.map((input, key) => (
              <View key={key + 1} style={styles.submitFormRow}>
                <View
                  style={[styles.submitFormCol, {alignItems: 'flex-start'}]}>
                  <TextInput
                    value={input.userId}
                    onChangeText={text => inputHandleUserId(text, key)}
                    onEndEditing={(e) => handleValidUserId(e.nativeEvent.text, key)}
                    keyboardType="numeric"
                    textAlign="center"
                    returnKeyType="next"
                    style={[
                      styles.formNumberInputStyle,
                      {
                        fontSize: 22,
                        borderColor:
                          input.userIdError != '' ? '#e74c3c' : '#dfdfdf',
                      },
                    ]}
                  />

                  {input.userIdError != '' ? (
                    <View style={styles.errorTextViewStyle}>
                      <Text style={styles.errorTextStyle}>
                        {input.userIdError}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.submitFormCol}>
                  <TextInput
                    value={input.startAmount}
                    onChangeText={text => inputHandleStartAmount(text, key)}
                    onEndEditing={e =>
                      handleValidStartAmount(e.nativeEvent.text, key)
                    }
                    keyboardType="numeric"
                    textAlign="center"
                    returnKeyType="next"
                    style={[
                      styles.formNumberInputStyle,
                      {
                        color: '#e74c3c',
                        borderColor:
                          input.startAmountError != '' ? '#e74c3c' : '#dfdfdf',
                      },
                    ]}
                  />

                  {input.startAmountError != '' ? (
                    <View style={styles.errorTextViewStyle}>
                      <Text style={styles.errorTextStyle}>
                        {input.startAmountError}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={[styles.submitFormCol, {alignItems: 'flex-end'}]}>
                  <TextInput
                    value={input.endAmount}
                    onChangeText={text => inputHandleEndAmount(text, key)}
                    onEndEditing={e =>
                      handleValidEndAmount(e.nativeEvent.text, key)
                    }
                    keyboardType="numeric"
                    textAlign="center"
                    returnKeyType="go"
                    style={[
                      styles.formNumberInputStyle,
                      {
                        color: '#098e09',
                        borderColor:
                          input.endAmountError != '' ? '#e74c3c' : '#dfdfdf',
                      },
                    ]}
                  />

                  {input.endAmountError != '' ? (
                    <View style={styles.errorTextViewStyle}>
                      <Text style={styles.errorTextStyle}>
                        {input.endAmountError}
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
          <View style={styles.submitFormButtons}>
            <View style={{width: '50%', paddingLeft: 0, paddingRight: 8}}>
              <Button
                title={'Add More Line'}
                type="clear"
                onPress={() => handleAddMoreLine()}
                buttonStyle={styles.buttonAddMoreStyle}
                titleStyle={styles.buttonAddMoreTitleStyle}
              />
            </View>
            <View style={{width: '50%', paddingLeft: 8, paddingRight: 0}}>
              <Button
                title={'Submit'}
                type="clear"
                raised={true}
                onPress={() => handlePressSubmitButton()}
                buttonStyle={styles.formSubmitButton}
                titleStyle={styles.formSubmitButtonText}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e7ebf1',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  submitFormWrapper: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
  },
  submitFormRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    marginBottom: 10,
  },
  submitFormCol: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    paddingRight: 2,
  },
  formNumberInputStyle: {
    width: '100%',
    maxWidth: 105,
    height: 42,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#cccccc',
  },
  errorTextViewStyle: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTextStyle: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: 11,
    color: '#ff0000',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    paddingLeft: 2,
    paddingRight: 2,
    alignSelf: 'center',
  },
  submitFormButtons: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 15,
    paddingLeft: 8,
    paddingRight: 8,
  },
  buttonAddMoreStyle: {
    width: '100%',
    height: 48,
    backgroundColor: '#e74c3c',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  buttonAddMoreTitleStyle: {
    fontFamily: 'Roboto-Medium',
    fontWeight: '500',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  formSubmitButton: {
    width: '100%',
    height: 48,
    backgroundColor: '#098e09',
    borderWidth: 1,
    borderColor: '#098e09',
  },
  formSubmitButtonText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default Apps;
