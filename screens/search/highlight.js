import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { connectHighlight } from 'react-instantsearch-native';
import MiscUserComponent from '../cells/FollowCellComps/userComponent';
const Highlight = ({ attribute, hit, highlight, navigation }) => {
  const highlights = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });
  return (
    <Text>
      {highlights.map(({ value, isHighlighted }, index) => {
        const style = {
          backgroundColor: isHighlighted ? '#696969' : 'transparent',
          color: '#FFFFFF'
        };

        return (
        <View>
  <MiscUserComponent key={index} uid = {hit.uid} navigation = {navigation} />  
        </View>
        );
      })}
    </Text>
  );
};

Highlight.propTypes = {
  attribute: PropTypes.string.isRequired,
  hit: PropTypes.object.isRequired,
  highlight: PropTypes.func.isRequired,
};

export default connectHighlight(Highlight);