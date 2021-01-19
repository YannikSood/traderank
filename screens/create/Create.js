import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

class Create extends React.Component {

    //Post ID
    //  |-USERID
    //      |-Post1
    //      |-Post2
    //      |-Post3
    constructor(props) {
        super(props)
        this.state = {
            image: null
        }
    }

    

    
    render() {
        return (
            <View style={styles.container}>

                <Text style={styles.headerText}>get ranked</Text>

                <Text style={styles.subheaderText}>open postions [unrealized]</Text>

                <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('YoloScreenshot')}
                    style={styles.yoloButton}>

                        <Text style={styles.buttonText}>post yolo 🙏</Text>

                </TouchableOpacity>

                <Text style={styles.subheaderText}>closed postions [realized]</Text>
                <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('GainScreenshot')}
                    style={styles.gainButton}>
                        <Text style={styles.buttonText}>post gains 🚀</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('LossScreenshot')}
                    style={styles.lossButton}>
                        <Text style={styles.buttonText}>post losses 🤡</Text>
                </TouchableOpacity>

            </View>
        )
        
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000'
    },
    yoloButton: {
        marginTop: 20,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#5233FF',
        borderRadius: 5,
        width: 200
    },
    gainButton: {
        marginTop: 20,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#00cc00',
        borderRadius: 5,
        width: 200
    },
    lossButton: {
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 5,
        alignItems: 'center',
        backgroundColor: '#cc0000',
        borderRadius: 5,
        width: 200
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
        color: '#696969'
    },
})

export default Create