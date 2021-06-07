import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import Highlight from './highlight';
import MiscUserComponent from '../cells/FollowCellComps/userComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Get searchItem and make it be item.ticker or item.username via setInterval 500
 */
const styles = StyleSheet.create({
    // separator: {
    //   borderBottomWidth: 1,
    //   borderColor: '#ddd',
    //   // paddingBottom: 5,
    // },
    item: {
      paddingTop: 10,
      flexDirection: 'column',
    },
    titleText: {
      fontWeight: 'bold',
    },
  });




const InfiniteHits = ({ hits, hasMore, refineNext, navigation, index }) => {

  const [searchItem, setSearchItem] = useState("");
  getSearchItem = async() => {
    try {
      const value = await AsyncStorage.getItem('searchItem');
      if (value !== null) {
        setSearchItem(value);
        console.log(`searchItem from infiniteHits ${searchItem}`);
      }
    } catch (e) {
      // error reading value
      console.log(`Error getting searchItem... ${e}`);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      getSearchItem();
    }, 100);
    return () => clearInterval(interval);
  })
return (
  <FlatList
      data={hits} 
      keyExtractor={item => searchItem === "username"  ? item.username : item.ticker}
      key={index}
      // ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => hasMore && refineNext()}
      renderItem={({ item }) => (

      <View  style={{ flexDirection: 'row', justifyContent: 'left', alignItems: 'center', paddingLeft: 5, paddingBottom: 5 }}>
        {
          searchItem === "username" ?
          <MiscUserComponent uid = {item.uid} navigation = {navigation} />  :
          <TouchableOpacity
          onPress={() => navigation.navigate('SingleStockPosts', {
            ticker: item.ticker.substring(1, item.ticker.length),
          })
                    }
          style={{ backgroundColor: 'transparent',
            borderColor: '#696969',
            borderWidth: 1,
            borderRadius: 15,
            marginTop: 10,
            marginBottom: 12,
            marginLeft: 5,
            padding: 0 }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', alignContent: 'center', color: '#FFFFFF', paddingLeft: 10 }}>
            {item.ticker}
          </Text>
          </TouchableOpacity>

        }
      </View>
    )}
  />
);
};

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
};


export default connectInfiniteHits(InfiniteHits);
