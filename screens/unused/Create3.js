import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native'


class CreateConfirm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            image: this.props.route.params.image,
            ticker: this.props.route.params.ticker,
            strike: this.props.route.params.strike,
            call_put: this.props.route.params.call_put,
            exp: this.props.route.params.exp,
            description: '',
            profit: '',
            percent_gain: '',
            gain_loss: ''
        }
    }


    render() {
        return (
            <ScrollView contentContainerStyle = {styles.scroller}>
                <View style={styles.view}>
                    <Text style = {styles.headerText}>get ranked</Text>



                    <Text style={styles.tradeText}> {this.state.ticker} ${this.state.strike} {this.state.call_put} expiring {this.state.exp}</Text>

                    <TextInput
                        style={styles.inputBox}
                        value={this.state.description}
                        onChangeText={description => this.setState({ description })}
                        placeholder='enter a caption'
                        autoCapitalize='none'
                    />

                    <TextInput
                        style={styles.inputBox}
                        value={this.state.profit}
                        onChangeText={value => this.setState({ profit: value })}
                        placeholder='how much profit on this trade?'
                        autoCapitalize='none'
                    />

                    <TextInput
                        style={styles.inputBox}
                        value={this.state.percent_gain}
                        keyboardType='numeric'
                        onChangeText={percent_gain => this.setState({ percent_gain })}
                        placeholder='percent gain on this trade'
                        autoCapitalize='none'
                    />

                    <TouchableOpacity   
                            onPress={() => this.props.navigation.navigate('CreateReview', 
                            {
                                image: this.state.image, 
                                ticker: this.state.ticker, 
                                strike: this.state.strike, 
                                call_put: this.state.call_put, 
                                exp: this.state.exp,
                                description: this.state.description,
                                profit: this.state.profit,
                                percent_gain: this.state.percent_gain,
                                gain_loss: this.state.gain_loss,

                            })} 
                            style={styles.nextButton}>
                                <Text style={styles.buttonText}>confirm</Text>
                    </TouchableOpacity>



                    <TouchableOpacity 
                            onPress={() => this.props.navigation.navigate('CreateInfo', this.state.image)}
                            style={styles.nextButton}>
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
        justifyContent: 'center'
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
        paddingBottom: 10,
        paddingTop: 10
    },
    twoPickers: {
        width: 200,
        height: 88,
    },
    twoPickerItems: {
    height: 88,
    },
})

export default CreateConfirm