import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {HeaderBar} from '../../../Components';
import {FONTS, SIZES, COLORS, icons, images} from '../../../constants';
import {getStockEntry} from '../../../controller/StockController';
import {useSelector} from 'react-redux';

const ManageStock = () => {
  const companyDetail = useSelector(state => state.company);
  const company_id = companyDetail._id;

  const [stockData, setStockData] = React.useState([]);

  const fetchStock = async () => {
    const res = await getStockEntry(company_id);
    // setStockData(res.data);
    const data = res.data.map((ele, i) => setStockData(ele.stockData));
  };

  React.useEffect(() => {
    fetchStock();
  }, []);

  const renderStock = () => {
    const renderItem = ({item, index}) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            ...FONTS.h4,
            flex: 0.4,
            color: COLORS.darkGray,
            textAlign: 'left',
          }}>
          {index + 1}.
        </Text>
        <Text
          style={{
            flex: 2,
            ...FONTS.h3,
            color: COLORS.darkGray,
            textAlign: 'left',
            textTransform: 'capitalize',
          }}>
          {item.item_name}
        </Text>

        <Text
          style={{
            ...FONTS.h3,
            flex: 1.2,
            color: COLORS.darkGray,
            textAlign: 'left',
          }}>
          {item.qty}
        </Text>
        <Text
          style={{
            ...FONTS.h3,
            flex: 1.2,
            color: COLORS.darkGray,
            textAlign: 'left',
          }}>
          {item.stock_date}
        </Text>
      </View>
    );

    return (
      <FlatList
        contentContainerStyle={{marginHorizontal: SIZES.radius}}
        data={stockData}
        keyExtractor={item => `${item._id}`}
        renderItem={renderItem}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => {
          return (
            <View
              style={{
                marginVertical: 3,
              }}></View>
          );
        }}
        ListHeaderComponent={
          <View style={{marginBottom: 3}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 0.4,
                  color: COLORS.darkGray,
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                Sn.
              </Text>
              <Text
                style={{
                  flex: 2,
                  ...FONTS.h3,
                  color: COLORS.darkGray,
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                Item name
              </Text>

              <Text
                style={{
                  ...FONTS.h3,
                  flex: 1.2,
                  color: COLORS.darkGray,
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                Qty
              </Text>
              <Text
                style={{
                  ...FONTS.h3,
                  flex: 1.2,
                  color: COLORS.darkGray,
                  textAlign: 'left',
                  fontWeight: 'bold',
                }}>
                Date
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: COLORS.gray,
                marginVertical: 5,
              }}></View>
          </View>
        }
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <HeaderBar title="Manage Stock" />
      {renderStock()}
    </View>
  );
};

export default ManageStock;
