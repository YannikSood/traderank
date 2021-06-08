import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Dimensions, Text } from 'react-native';
import PropTypes from 'prop-types';
import InfiniteHits from './infiniteHits';
import { connectSearchBox} from 'react-instantsearch-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Set searchItem in async storage to either 'username' or 'ticker'
 */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000000'
  },
  input: {
    height: 48,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    width:  Dimensions.get('window').width-20,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  blank: {
    backgroundColor: '#000000'
  }
});

const SearchBox = ({ currentRefinement, refine, navigation }) => {    

  const storeSearchItem = async(value) => {
    try {
      await AsyncStorage.setItem('searchItem', value);
    } catch (e) {
      // saving error
      console.log(`Error store searchItem... ${e}`);
    }
  };


  let input = currentRefinement;
  if(input.length > 0 && input.charAt(0) === '$'){
    storeSearchItem("ticker");
  } else{
    storeSearchItem("username");
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={value => refine(value)}
        value={currentRefinement}
        placeholder="Search for people 'riahlexis' or tickers '$AMC'"
      />
         { currentRefinement.length > 0 && 
           <InfiniteHits navigation={navigation} />
         }
    </View>
  )
};

SearchBox.propTypes = {
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectSearchBox(SearchBox);
