import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connectInfiniteHits } from 'react-instantsearch-native';
import Highlight from './highlight';

const styles = StyleSheet.create({
    separator: {
      borderBottomWidth: 1,
      borderColor: '#ddd',
    },
    item: {
      padding: 10,
      flexDirection: 'column',
    },
    titleText: {
      fontWeight: 'bold',
    },
  });

const InfiniteHits = ({ hits, hasMore, refineNext, navigation, index }) => (
  <FlatList
    data={hits}
    keyExtractor={item => item.objectID}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    onEndReached={() => hasMore && refineNext()}
    renderItem={({ item }) => (
      <View style={styles.item}>
        <Highlight key={index} attribute="username" hit={item} navigation={navigation} />
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
