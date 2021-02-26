import React, { Component} from 'react';
import { StyleSheet, Text, View, Container, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { InstantSearch, connectRefinementList } from 'react-instantsearch-native';
import SearchBox from './searchBox';
import InfiniteHits from './infiniteHits';
import RefinementList from './refinementList';
import algoliasearch from 'algoliasearch/lite';
import Highlight from './highlight';

const VirtualRefinementList = connectRefinementList(() => null);

//Need to put this in secret file and add that to .gitignore
const searchClient = algoliasearch(
    '5BS4R91W97', 
    '1dd2a5427b3daed5059c1dc62bdd2197'
  );

class Search extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            isLoading: false,
            userUID: '',
            searchState: {},
            refresh: false,
            navigation: this.props.navigation
        }
    }
    root = {
        Root: View,
        props: {
          style: {
            flex: 1,
          },
        },
      };

      onSearchStateChange = searchState =>
    this.setState({
      searchState,
    });

  onCacheClear = () => {
    this.setState(
      previousState => ({
        refresh: true,
        searchState: {
          ...previousState.searchState,
          page: 1,
        },
      }),
      () => {
        this.setState({
          refresh: false,
        });
      }
    );
  };



    render() {

        const { refresh, searchState } = this.state;

        if (this.state.isLoading) {
            return(
                <View style={styles.container}>
                  <ActivityIndicator size="large" color="#9E9E9E"/>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style = {styles.searchContainer}>
                    <InstantSearch
                            searchClient={searchClient} 
                            indexName="usernames"
                            refresh={refresh}
                            searchState={searchState}
                            onSearchStateChange={this.onSearchStateChange}
                            root={this.root}
                    >
                         {/* <VirtualRefinementList attribute="username" /> */}
                    <SearchBox />
                        {/* <RefinementList attribute="username" limit={5} /> */}

                        <InfiniteHits navigation={this.state.navigation} />

                        {/* <Highlight key={index} attribute="username" hit={item} navigation={navigation} /> */}
                     </InstantSearch> 
                                        
                </View>
            </View>
        )
        
    }
}


const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#000000'
    },
    searchContainer: {
        backgroundColor: '#121212',
        // position: 'absolute',
        top: 0
    },
    bioText: {
        fontSize: 16,
        alignContent: 'center',
        padding: 20,
        color: '#000000'
    },
});

export default Search;