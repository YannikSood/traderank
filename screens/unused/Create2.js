import React from 'react';
import { View, Picker, Text, StyleSheet, TextInput, Image, TouchableOpacity, ScrollView} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

class CreateInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            image: this.props.route.params,
            ticker: '',
            strike: '',
            call_put: 'Call',
            exp: moment(new Date()).format('MMM DD YYYY'),
            datePickerVisibility: false,
        }
    }

    handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date);
        
        let momentTime = moment(date).format('MMM DD YYYY')

        this.setState({
            exp: momentTime,
            datePickerVisibility: false
        })
        // console.log(this.state.momentTime)
    };

    render() {
        return (
            <ScrollView contentContainerStyle = {styles.scroller}>
                <View style={styles.view}>
                    <Text style = {styles.headerText}>get ranked</Text>


                    <Text style={styles.subheaderText}>add some details</Text>
                    
                    <TextInput
                        style={styles.inputBox}
                        value={this.state.ticker}
                        onChangeText={ticker => this.setState({ ticker })}
                        placeholder='stock ticker'
                        autoCapitalize='characters'
                    />

                    <TextInput
                        style={styles.inputBox}
                        value={this.state.strike}
                        keyboardType='numeric'
                        onChangeText={strike => this.setState({ strike })}
                        placeholder='strike price'
                        autoCapitalize='none'

                    />

                    <Picker
                        selectedValue={this.state.call_put}
                        onValueChange={value => this.setState({ call_put: value })}
                        style={styles.twoPickers} itemStyle={styles.twoPickerItems}
                    >
                            <Picker.Item label="call" value="Call" />
                            <Picker.Item label="put" value="Put" />
                    </Picker>

                    

                    <TouchableOpacity 
                        onPress={() => this.setState({
                            datePickerVisibility: true
                        })}
                        style={styles.button}>
                                <Text style={styles.buttonText}>expiration date</Text>
                    </TouchableOpacity>
                    

                    <DateTimePickerModal
                        isVisible={this.state.datePickerVisibility}

                        mode="date"

                        onConfirm={(date) => this.handleConfirm(date)}

                        onCancel={() => this.setState({
                            datePickerVisibility: false
                        })}
                    />

                    <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('CreateConfirm', 
                            {
                                image: this.state.image, 
                                ticker: this.state.ticker, 
                                strike: this.state.strike, 
                                call_put: this.state.call_put, 
                                exp: this.state.exp
                            })}

                            style={styles.nextButton}>
                                <Text style={styles.buttonText}>next</Text>
                    </TouchableOpacity>


                    <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('Create')}
                            style={styles.button}>
                                <Text style={styles.buttonText}>back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
        
    }
}

const styles = StyleSheet.create({
    scroller: {
        marginTop: 50,
        marginBottom: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    view: {
        alignItems: 'center',
    },
    thumbnail: {
        width: 300,
        height: 300,
        resizeMode: "contain"
    },
    
    inputBox: {
        width: '85%',
        margin: 10,
        padding: 15,
        fontSize: 16,
        borderColor: '#d3d3d3',
        borderBottomWidth: 1,
        textAlign: 'center'
    },
    nextButton: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#5233FF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    button: {
        marginTop: 30,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#5233FF',
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 5,
        width: 200
    },
    buttonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    headerText: {
        fontSize: 30,
        alignItems: 'center',
        fontWeight: 'bold',
        paddingBottom: 10
    },
    subheaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10
    },
    tradeText: {
        fontSize: 16,
        fontWeight: 'bold',
        alignContent: 'center',
        paddingBottom: 10
    },
    twoPickers: {
        width: 200,
        height: 88,
    },
    twoPickerItems: {
    height: 88,
    },
})

export default CreateInfo