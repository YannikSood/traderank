import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import Highlight from './highlight';
import MiscUserComponent from '../cells/FollowCellComps/userComponent';

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

const InfiniteHits = ({ hits, hasMore, refineNext, navigation, index }) => (
  <FlatList
      data={hits}
      keyExtractor={item => item.uid}
      // ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => hasMore && refineNext()}
      renderItem={({ item }) => (

      <View>
        <MiscUserComponent uid = {item.uid} navigation = {navigation} />  
      </View>
    )}
  />
);

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
};


export default connectInfiniteHits(InfiniteHits);
