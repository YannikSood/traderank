import React, { Component} from 'react';
import { StyleSheet, Text, View, Container, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { InstantSearch, connectRefinementList, Index, Configure } from 'react-instantsearch-native';
import SearchBox from './searchBox';
import InfiniteHits from './infiniteHits';
import RefinementList from './refinementList';
import algoliasearch from 'algoliasearch/lite';
import Highlight from './highlight';
import * as Analytics from 'expo-firebase-analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const VirtualRefinementList = connectRefinementList(() => null);

//Need to put this in secret file and add that to .gitignore
const searchClient = algoliasearch(
    '5BS4R91W97', 
    '0207d80e22ad5ab4d65fe92fed7958d7'
  );

  /**
 * Get searchItem and make it be item.ticker or item.username via setInterval 500
 */
class Search extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            isLoading: false,
            userUID: '',
            searchState: {},
            refresh: false,
            navigation: this.props.navigation,
            searchItem: ''
        }
        Analytics.logEvent("Search_Clicked")
        Analytics.setCurrentScreen("SearchScreen")
    }
    componentDidMount(){
      this.readSearchItem();
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

  getSearchItem = async() => {
    try {
      const value = await AsyncStorage.getItem('searchItem');
      if (value !== null) {
        this.setState({searchItem: value});
      }
    } catch (e) {
      // error reading value
      console.log(`Error getting searchItem... ${e}`);
    }
  };

  readSearchItem = () => {
    const interval = setInterval(() => {
      this.getSearchItem();
    }, 10);
    return () => clearInterval(interval);
  }



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
                            indexName={this.state.searchItem == "username" ? "usernames" : "tickers"}
                            refresh={refresh}
                            searchState={searchState}
                            onSearchStateChange={this.onSearchStateChange}
                            root={this.root}
                    >
                     <SearchBox navigation={this.state.navigation} />
      
       
                     </InstantSearch> 
                                        
                </View>
            </View>
        )
        
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        backgroundColor: '#000000',
    },
    searchContainer: {
        backgroundColor: '#121212',
        position: 'absolute',
        top: 0,
        left: 0
    },
    bioText: {
        fontSize: 16,
        alignContent: 'center',
        padding: 20,
        color: '#000000'
    },
});

export default Search;