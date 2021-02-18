import React from 'react';
import { View, Picker, Text, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

class LossTrade extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            image: this.props.route.params,
            ticker: '',
            security: 'options',
            modalOpen: false,

        }
    }

    checkAndNext = () => {
        if (this.state.ticker.length != 0) {
            this.props.navigation.navigate('LossTradeNumbers', 
                {
                    image: this.state.image, 
                    ticker: this.state.ticker.trim().replace(/[^A-Za-z]/ig, ''), 
                    security: this.state.security
                })
        }
        else {
            Alert.alert(
                'please enter a valid ticker',
                'tickers can be up to 5 characters long',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
              );
        }
    }

    openImageModal = () => {
        this.setState({modalOpen: true})
    }

    closeImageModal = () => {
        this.setState({modalOpen: false})
    }


    render() {
        return (

            <KeyboardAvoidingView 
                style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }} 
                behavior="padding" enabled   
                keyboardVerticalOffset={200}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View
                            style={styles.container}>

                            <Modal
                                isVisible={this.state.modalOpen}
                                animationIn='fadeIn'
                                onSwipeComplete={() => this.closeImageModal()}
                                swipeDirection="down"
                            >
                                    
                                <View  style={{flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center'}}>

                                    <Image
                                        source={{ uri: this.state.image.uri }}
                                        style={styles.fullScreenImage}
                                    />
                                    
                                </View>
                            </Modal>

                            {/* <TouchableOpacity   
                                onPress={() => this.openImageModal()} >
                                    <View style={styles.thumbnailContainer}>
                                        <Image
                                            source={{ uri: this.state.image.uri }}
                                            style={styles.thumbnail}
                                        />
                                    </View>
                            </TouchableOpacity> */}

                            <View style={{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>

                                <Text style={styles.labelText}>💡what did you trade?</Text>

                                <View style={{flexDirection: 'row', justifyContent: 'center' }}>

                                    <Picker
                                        selectedValue={this.state.security}
                                        onValueChange={value => this.setState({ security: value })}
                                        style={styles.twoPickers} itemStyle={styles.twoPickerItems}
                                        >
                                        <Picker.Item label="stocks" value="stocks" />
                                        <Picker.Item label="spacs" value="spacs" />
                                        <Picker.Item label="options" value="options" />
                                        <Picker.Item label="cryptos" value="cryptos" />
                                    </Picker>


                                </View>
                            
                            </View>

                            <View style={{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>

                                <Text style={styles.labelText}>💡type the ticker</Text>
                            <View style={{flexDirection: 'row', justifyContent: 'center' }}>

                                    <Text style={styles.inputBoxText}>$</Text>
                                    <TextInput
                                        style={styles.inputBox}
                                        value={this.state.ticker.trim().replace(/[^A-Za-z]/ig, '')}
                                        onChangeText={ticker => this.setState({ ticker })}
                                        placeholder='TSLA'
                                        placeholderTextColor="#696969" 
                                        autoCapitalize='characters'
                                        autoCorrect={false}
                                        maxLength={5}
                                    />


                                </View>
                                
                            </View>
                            

                            <TouchableOpacity  
                                onPress={() => this.checkAndNext()}
                                style={styles.gainButton}>
                                        <Text style={styles.buttonText}>next</Text>
                            </TouchableOpacity>


                        </View>
                    </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
        
    }
}

const styles = StyleSheet.create({
    scroller: {
        // flex: 1,
        // marginBottom: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        paddingBottom: 100
    },
    gainButton: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#00cc00',
        borderRadius: 5,
        width: 140
    },
    button: {
        // marginBottom: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#0000cc',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 140

    },
    cancelButton: {
        // marginTop: 30,
        // marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#cc0000',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 140
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingBottom: 10
    },
    subheaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10
    },
    thumbnailContainer: {
        // flex: 1, 
        // justifyContent: 'flex-start', 
        paddingBottom: 10,
        // paddingRight: 25,
        // backgroundColor: '#121212',
        // position: "absolute",
        // top: 0
    },
    thumbnail: {
        width:  Dimensions.get('window').width - 50,
        height: 300,
        borderRadius: 15
    },
    labelText: {
        fontSize: 16,
        color: '#FFFFFF'
    },
    inputBoxText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        paddingTop: 15,
        color: '#FFFFFF'
    },
    inputBox: {
        width: '50%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center',
        color: '#FFFFFF'
    },
    twoPickers: {
        width: 150,
        height: 88,
        margin: 20,
        color: '#FFFFFF'
    },
    twoPickerItems: {
        height: 88,
        color: '#FFFFFF'
    },
    fullScreenImage: {
        width:  Dimensions.get('window').width,
        height: Dimensions.get('window').height ,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: "contain",
    },
})

export default LossTrade