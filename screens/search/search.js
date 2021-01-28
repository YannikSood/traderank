import React from 'react'
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native'
import Firebase from '../../firebase'
import { SearchBar } from 'react-native-elements';


class Search extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            isLoading: false,
            userUID: ''
        }
    }

    //---------------------------------------------------------------
    updateSearch = (search) => {
        this.setState({ search });
        this.makeRequest()
    };

    makeRequest = async() => {
        // this.setState({isLoading: true})

        await Firebase.firestore()
        .collection('usernames')
        .doc(this.state.search.toLowerCase().trim()) 
        .get()
        .then((doc) => {
            if (doc.exists) {
                console.log('user exists')
                this.setState({isLoading: false})
            }
            else {
                console.log('user doesnt exist')
                this.setState({isLoading: false})
            }
        })
    }

    render() {

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
                    <SearchBar
                        containerStyle={{backgroundColor: '#121212'}}
                        placeholder="Find a user... coming soon"
                        onChangeText={this.updateSearch}
                        value={this.state.search}
                        platform="ios"
                        lightTheme = {true}
                        showLoading = {this.state.isLoading}
                    />
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
        backgroundColor: '#000000'
    },
    searchContainer: {
        backgroundColor: '#121212',
        position: 'absolute',
        top: 0
    },
    bioText: {
        fontSize: 16,
        alignContent: 'center',
        padding: 20,
        color: '#000000'
    },
})

export default Search;