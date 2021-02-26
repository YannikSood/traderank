import React from 'react';
import { StyleSheet, View, TextInput, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { connectSearchBox } from 'react-instantsearch-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000000'
  },
  input: {
    height: 48,
    padding: 12,
    fontSize: 16,
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
});

const SearchBox = ({ currentRefinement, refine }) => {    
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={value => refine(value)}
        value={currentRefinement}
        placeholder="Search for people..."
      />
    </View>
  )
};

SearchBox.propTypes = {
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectSearchBox(SearchBox);
