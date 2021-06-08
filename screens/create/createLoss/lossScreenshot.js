import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

class LossScreenshot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
  }

    openImagePickerAsync = async() => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
      });

      try {
        if (pickerResult.cancelled === true) {
          this.setState({ image: null });
          return;
        }

        if (pickerResult !== null) {
          await this.setState({
            image: pickerResult,
          });
          this.props.navigation.navigate('LossTrade', this.state.image);
        } else {
          return;
        }
      } catch (error) {
        console.log(error);
      }
      if (pickerResult.cancelled === true) {
        this.setState({ image: null });
      }
    };


    render() {
      if (this.state.image !== null) {
        return (
          <View style={styles.container}>
            <Text style={styles.subheaderText}>everything look good?</Text>

            <Image
              source={{ uri: this.state.image.uri }}
              style={styles.thumbnail}
            />


            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('LossTrade', this.state.image)}
              style={styles.gainButton}
            >
              <Text style={styles.buttonText}>continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.openImagePickerAsync}
              style={styles.button}
            >
              <Text style={styles.buttonText}>pick another photo</Text>
            </TouchableOpacity>

          </View>
        );
      }

      return (
        <View style={styles.container}>

          <Text style={styles.headerText}>add a screenshot</Text>
          <Text style={styles.subheaderText}>make sure it includes the loss and % loss!</Text>

          <TouchableOpacity onPress={this.openImagePickerAsync} style={styles.button}>
            <Text style={styles.buttonText}>open gallery</Text>
          </TouchableOpacity>

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
  gainButton: {
    marginTop: 30,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#00cc00',
    borderRadius: 5,
    width: 200,
  },
  button: {
    marginTop: 30,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: '#0000cc',
    borderRadius: 5,
    width: 200,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    alignContent: 'center',
    paddingBottom: 10,
    color: '#FFFFFF',
  },
  subheaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignContent: 'center',
    paddingBottom: 10,
    color: '#696969',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: 'contain',

  },
});

export default LossScreenshot;
