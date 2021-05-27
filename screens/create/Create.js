import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import firebase from '../../firebase';

class Create extends React.Component {
  //Post ID
  //  |-USERID
  //      |-Post1
  //      |-Post2
  //      |-Post3
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    Analytics.setCurrentScreen('CreateScreen');
  }

    navigateToYolo = () => {
      const setThoughtCount = firebase.functions().httpsCallable('setThoughtCount');
      setThoughtCount()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    render() {
      return (
        <View style={styles.container}>
          {/* <Text style={styles.headerText}>get ranked</Text> */}

          {/* <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}> */}
          <View style={{ flexDirection: 'column' }}>
            <Text style={styles.subheaderText}>holding?</Text>

            <TouchableOpacity
              onPress={() => this.navigateToYolo()}
              style={styles.yoloButton}
            >

              <Text style={styles.buttonText}>post trade 🙏</Text>

            </TouchableOpacity>

            <Text style={styles.subheaderText}>sold!</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('GainScreenshot')}
              style={styles.gainButton}
            >
              <Text style={styles.buttonText}>post gains 🚀</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('LossScreenshot')}
              style={styles.lossButton}
            >
              <Text style={styles.buttonText}>post losses 🤡</Text>
            </TouchableOpacity>
          </View>

          {/* <View style = {{flexDirection: 'column', paddingRight: 25}}>
                        <Text style={styles.subheaderText}>memes [soon]</Text>

                        <TouchableOpacity
                            // onPress={() => this.props.navigation.navigate('YoloScreenshot')}
                            style={styles.memeButton}>

                                <Text style={styles.buttonText}>post meme 😂</Text>

                        </TouchableOpacity>

                        <Text style={styles.subheaderText}>research [soon]</Text>
                        <TouchableOpacity
                            // onPress={() => this.props.navigation.navigate('GainScreenshot')}
                            style={styles.researchButton}>
                                <Text style={styles.buttonText}>post dd 🧪</Text>
                        </TouchableOpacity>

                        {/* <Text style={styles.subheaderText}>ideas</Text>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('LossScreenshot')}
                            style={styles.lossButton}>
                                <Text style={styles.buttonText}>post losses 🤡</Text>
                        </TouchableOpacity> */}
          {/* </View> */}

          {/* </View> */}


        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  yoloButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5233FF',
    borderRadius: 5,
    width: 150,
  },
  gainButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#00cc00',
    borderRadius: 5,
    width: 150,
  },
  lossButton: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#cc0000',
    borderRadius: 5,
    width: 150,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  subheaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    alignContent: 'center',
    color: '#696969',
  },
  researchButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F77737',
    borderRadius: 5,
    width: 150,
  },
  memeButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#833AB4',
    borderRadius: 5,
    width: 150,
  },
});

export default Create;
