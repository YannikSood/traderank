import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Image, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

class GainTradeNumbers extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            image: this.props.route.params.image,
            ticker: this.props.route.params.ticker,
            security: this.props.route.params.security,
            profit_loss: '',
            percent_gain_loss: '',
            modalOpen: false
        }
    }

    openImageModal = () => {
        this.setState({modalOpen: true})
    }

    closeImageModal = () => {
        this.setState({modalOpen: false})
    }

    checkAndNext = () => {
        if (this.state.profit_loss.length != 0 && this.state.percent_gain_loss.length != 0) {
            this.props.navigation.navigate('GainTradeConfirm', 
                {
                    image: this.state.image, 
                    ticker: this.state.ticker, 
                    security: this.state.security,
                    profit_loss: this.state.profit_loss.trim().replace(/[^0-9]/g, ''),
                    percent_gain_loss: this.state.percent_gain_loss.trim().replace(/[^0-9]/g, ''),
                })
        }
        else {
            Alert.alert(
                'please fill out all the fields',
                'one or more of the numbers is blank',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
              );
        }
    }

    render() {
        return (

            <KeyboardAvoidingView 
                style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }} 
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

                            <TouchableOpacity   
                                onPress={() => this.openImageModal()} >
                                    <View style={styles.thumbnailContainer}>
                                        <Image
                                            source={{ uri: this.state.image.uri }}
                                            style={styles.thumbnail}
                                        />
                                    </View>
                            </TouchableOpacity>

                        <View style={{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>

                            <Text style={styles.labelText}>how much did you profit? </Text>

                            <View style={{flexDirection: 'row', justifyContent: 'center' }}>

                                    <Text style={styles.inputBoxText}>$</Text>
                                    <TextInput
                                        style={styles.inputBox}
                                        value={this.state.profit_loss.trim().replace(/[^0-9]/g, '')}
                                        onChangeText={profit_loss => this.setState({ profit_loss })}
                                        placeholder='420'
                                        placeholderTextColor="#696969" 
                                        keyboardType='numeric'
                                    />

                            </View>

                            <Text style = {{color: '#696969', fontSize: 12, paddingBottom: 15}}>💡Should be in your image</Text>
                            
                        </View>

                        <View style={{flexDirection: 'column', justifyContent: 'left', alignItems: 'center' }}>

                            <Text style={styles.labelText}>what was your % gain?</Text>

                            <View style={{flexDirection: 'row', justifyContent: 'center' }}>

                                    <Text style={styles.inputBoxText}>%</Text>

                                    <TextInput
                                        style={styles.inputBox}
                                        value={this.state.percent_gain_loss.trim().replace(/[^0-9]/g, '')}
                                        onChangeText={percent_gain_loss => this.setState({ percent_gain_loss })}
                                        placeholder='69'
                                        placeholderTextColor="#696969" 
                                        keyboardType='numeric'
                                    />
                            </View>

                            <Text style = {{color: '#696969', fontSize: 12, paddingBottom: 15}}>💡Should be in your image</Text>
                            
                        </View>
                        

                        <TouchableOpacity  
                            onPress={() => this.checkAndNext()}
                            style={styles.gainButton}>
                                    <Text style={styles.buttonText}>review</Text>
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
        borderRadius: 5,
        width: 140

    },
    cancelButton: {
        // marginTop: 30,
        // marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#cc0000',
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
        paddingBottom: 10,
        color: '#FFFFFF'
    },
    subheaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10,
        color: '#FFFFFF'
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
        margin: 20
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

export default GainTradeNumbers