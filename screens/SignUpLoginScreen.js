import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, KeyboardAvoidingView, Alert, Modal, TouchableOpacity, TextInput } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from "react-native-responsive-fontsize";
import {Input} from 'react-native-elements';

export default class WelcomeScreen extends Component {
  constructor(){
    super();
    this.state={
      emailId:'',
      password:'',
      firstName:'',
      lastName:'',
      address:'',
      contact:'',
      confirmPassword:'',
      isModalVisible:'false',
      currencyCode: ''
    }
  }

  userSignUp = (emailId, password,confirmPassword) =>{
   if(password !== confirmPassword){
       return Alert.alert("Password doesn't match.\nPlease check your password.")
   }else{
     firebase.auth().createUserWithEmailAndPassword(emailId, password)
     .then(()=>{
       db.collection('users').add({
         first_name:this.state.firstName,
         last_name:this.state.lastName,
         contact:this.state.contact,
         email_id:this.state.emailId,
         address:this.state.address,
         isExchangeRequestActive: false,
         currencyCode: this.state.currencyCode
       })
       return  Alert.alert(
            'User added successfully',
            '',
            [
              {text: 'OK', onPress: () => this.setState({
                "isModalVisible" : false
              })
              }
            ]
        );
     })
     .catch((error)=> {
       // Handle Errors here.
       var errorCode = error.code;
       var errorMessage = error.message;
       return Alert.alert(errorMessage)
     });
   }
 }

userLogin = (emailId, password)=>{
   firebase.auth().signInWithEmailAndPassword(emailId, password)
   .then(()=>{
    this.props.navigation.navigate('HomeScreen')
    })
   .catch((error)=> {
     var errorCode = error.code;
     var errorMessage = error.message;
     return Alert.alert(errorMessage)
   })
 }

showModal = () =>{
  return(
    <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.isModalVisible}
      >
    <View style={styles.modalContainer}>
      <ScrollView style={{width:'100%'}}>
        <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
          <Text
            style={styles.modalTitle}
            >Registration</Text>
          <Input
            containerStyle = {styles.loginBox}
            inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
            inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
            placeholderTextColor = {'#F69400'}
            placeholder ={"First Name"}
            maxLength ={10}
            onChangeText={(text)=>{
              this.setState({
                firstName: text
              })
            }}
          />
          <Input
            containerStyle = {styles.loginBox}
            inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
            inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
            placeholderTextColor = {'#F69400'}
            placeholder ={"Last Name"}
            maxLength ={15}
            onChangeText={(text)=>{
              this.setState({
                lastName: text
              })
            }}
          />
          <Input
            containerStyle = {styles.loginBox}
            inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
            inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
            placeholderTextColor = {'#F69400'}
            placeholder ={"Contact"}
            maxLength ={10}
            keyboardType={'numeric'}
            onChangeText={(text)=>{
              this.setState({
                contact: text
              })
            }}
          />
          <Input
            containerStyle = {styles.loginBox}
            inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
            inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
            placeholderTextColor = {'#F69400'}
            placeholder ={"Address"}
            multiline = {true}
            onChangeText={(text)=>{
              this.setState({
                address: text
              })
            }}
          />
          <Input
            containerStyle = {styles.loginBox}
            inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
            inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
            placeholderTextColor = {'#F69400'}
            placeholder ={"Email"}
            keyboardType ={'email-address'}
            onChangeText={(text)=>{
              this.setState({
                emailId: text
              })
            }}
          /><Input
          containerStyle = {styles.loginBox}
          inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
          inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
          placeholderTextColor = {'#F69400'}
            placeholder ={"Password"}
            secureTextEntry = {true}
            onChangeText={(text)=>{
              this.setState({
                password: text
              })
            }}
          /><Input
          containerStyle = {styles.loginBox}
          inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
          inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
          placeholderTextColor = {'#F69400'}
            placeholder ={"Confirm Password"}
            secureTextEntry = {true}
            onChangeText={(text)=>{
              this.setState({
                confirmPassword: text
              })
            }}
          /><Input
          containerStyle = {styles.loginBox}
          inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
          inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
          placeholderTextColor = {'#F69400'}
          placeholder = {"Your country's currency code"}
          maxLength = {8}
          onChangeText={(text)=>{
            this.setState({
              currencyCode: text
            })
          }}/>
          <View style={styles.modalBackButton}>
            <TouchableOpacity
              style={[styles.button,{marginBottom:RFValue(20), marginTop:RFValue(20)}]}
              onPress={()=>
                this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)
              }
            >
            <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalBackButton}>
            <TouchableOpacity
              style={styles.button}
              onPress={()=>this.setState({
                  "isModalVisible":false
                })}>
            <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  </Modal>
)
}
  render(){
    return(
      <View style={styles.container}>
        <View style={{justifyContent: 'center',alignItems: 'center'}}>

        </View>
          {
            this.showModal()
          }
        <View style={{justifyContent:'center', alignItems:'center'}}>
        <Image source = {require('../assets/sharing.jpg')} style = {{width: 250, height: 150}}/>
          <Text style={styles.title}>Barter System App</Text>
          <Text style={styles.subtitle}>A Trading Method</Text>
        </View>
        <View>
            <Input
            containerStyle = {styles.loginBox}
            inputContainerStyle = {{borderBottomWidth: 1.5, borderColor : '#F69400'}}
            inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
            labelStyle = {{color: '#DEAC35'}}
            label = 'Your email address'
            placeholder = "email@address.com"
            placeholderTextColor = {'#F69400'}
            leftIcon = {{ type: 'font-awesome', name: 'envelope', color: '#F69400' }}
            keyboardType = 'email-address'
            onChangeText = {(text)=>{
              this.setState({
                emailId: text
              })
            }}
          />
          <Input
          containerStyle={styles.loginBox}
          inputContainerStyle={{borderBottomWidth: 1.5, borderColor : '#F69400'}}
          inputStyle = {{color: '#DEAC35', fontSize: RFValue(20)}}
          secureTextEntry = {true}
          label = 'Password'
          labelStyle = {{color: '#DEAC35'}}
          placeholder="Password"
          placeholderTextColor = {'#F69400'}
          leftIcon={{ type: 'font-awesome', name: 'lock', color: '#F69400' }}
          onChangeText={(text)=>{
            this.setState({
              password: text
            })
          }}
        />
        <TouchableOpacity
           style={[styles.button,{marginBottom:RFValue(20), marginTop:RFValue(50)}]}
           onPress = {()=>{
             this.userLogin(this.state.emailId, this.state.password)
           }}
           >
           <Text style={styles.buttonText}>Login</Text>
         </TouchableOpacity>

         <TouchableOpacity
          style={styles.button}
          onPress={()=>this.setState({
              isModalVisible:true
            })
            }
           >
           <Text style={styles.buttonText}>Sign Up</Text>
         </TouchableOpacity>
      </View>
    </View>
    )
  }
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#FFE0B2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    fontSize:RFValue(50),
    fontWeight:'300',
    marginTop:RFValue(25),
    color : '#F69400'
  },
  subtitle: {
    fontSize:RFValue(20),
    color : '#DEAC35'
  },
  loginBox:{
    width: 300,
    height: 40,
    fontSize: RFValue(20),
    margin:RFValue(15)
  },
  button:{
    width:300,
    height:50,
    justifyContent:'center',
    alignItems:'center',
    alignSelf: 'center',
    borderRadius:25,
    backgroundColor:"#DEAC35",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.30,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText:{
    color:'#ffff',
    fontWeight:'200',
    fontSize:RFValue(20)
  },
  buttonContainer:{
    flex: 1,
    alignItems: 'center'
  },
  KeyboardAvoidingView:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitle:{
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: RFValue(30),
    color: '#F69400',
    margin: RFValue(30)
  },
  modalContainer:{
    flex: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ffff",
    marginRight: RFValue(30),
    marginLeft: RFValue(30),
    marginTop: RFValue(80),
    marginBottom: RFValue(80)
  }
})