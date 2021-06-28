import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import Header from '../components/Header';
import { RFValue } from "react-native-responsive-fontsize";

export default class ExchangeScreen extends React.Component {
    constructor() {
        super();
        this.state ={
            userId: firebase.auth().currentUser.email,
            itemName: '',
            description: '',
            requestId: '',
            requestStatus: '',
            docId: '',
            isExchangeRequestActive: '',
            currencyCode: '',
            value: '',
            itemValue: ''

        }
    }

    createUniqueId() {
        return Math.random().toString(36).substring(7)
    }

    getExchangeRequest = () =>{
        var exchangeRequest = db.collection('exchange_requests')
        .where('username','==',this.state.userId)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().request_status !== "received"){
                    this.setState({
                        requestId: doc.data().request_id,
                        itemName: doc.data().item_name,
                        requestStatus: doc.data().request_status,
                        docId: doc.id,
                        value: doc.data().item_value
                    })
                }
            })
        })
    }

    getIsExchangeRequestActive() {
        db.collection('users')
        .where('email_id','==',this.state.userId)
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.setState({
                    isExchangeRequestActive: doc.data().isExchangeRequestActive,
                    userDocId: doc.id,
                    currencyCode: doc.data().currency_code
                })
            })
        })
    }

    componentDidMount() {
        this.getExchangeRequest();
        this.getIsExchangeRequestActive();
        this.getData()
    }

    updateRequestStatus=()=>{
        db.collection('exchange_requests').doc(this.state.docId)
        .update({
            request_status: 'received'
        })
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc) => {
            db.collection('users').doc(doc.id).update({
                isExchangeRequestActive: false
            })
            })
        })
    }

    sendNotification=()=>{
        db.collection('users').where('email_id','==',this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name = doc.data().first_name
                var lastName = doc.data().last_name
                db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc) => {
                        var exchangerId = doc.data().exchanger_id
                        var itemName = doc.data().item_name
                        db.collection('all_notifications').add({
                            "targeted_user_id" : exchangerId,
                            "message" : name + " " + lastName + " has received your " + itemName,
                            "notification_status" : "unread",
                            "item_name" : itemName
                        })
                    })
                })
            })
        })
    }

    addItem = async(itemName, description) =>{
        var userName = this.state.userId
        var randomRequestId = this.createUniqueId()

        db.collection("exchange_requests").add({
            username: userName,
            item_name: itemName,
            description: description,
            request_id: randomRequestId,
            request_status: 'requested',
            item_value: this.state.value,
            date: firebase.firestore.FieldValue.serverTimestamp()
        })

        await this.getExchangeRequest()

        db.collection('users').where('email_id', '==', userName).get()
        .then()
        .then(snapshot =>{
            snapshot.forEach((doc) =>{
                db.collection('users').doc(doc.id).update({
                    isExchangeRequestActive: true
                })
            })
        })

        this.setState({
            itemName: '',
            description: '',
            itemValue: ''
        })

        return Alert.alert(
            'Item ready to exchange',
            '',
            [
                {text: 'OK', onPress: () => {
                    this.props.navigation.navigate('HomeScreen')
                }}
            ]
        );
    }

    receivedItems = (itemName) =>{
        var userId = this.state.userId
        var requestId = this.state.requestId
        db.collection('received_item').add({
            "user_id": userId,
            "item_name":itemName,
            "request_id" : requestId,
            "request_status" : "received"
        })
    }

    getData() {
        fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
        .then(response =>{
            return response.json();
        })
        .then(responseData =>{
            var currencyCode = this.state.currencyCode
            var currency = responseData.rates.INR
            var value = 69/currency
            this.setState({
                itemValue: value
            })
            console.log(value)
        })
    }

    render() {
        if(this.state.isExchangeRequestActive === true) {
            return(
                <View style = {{flex:1, backgroundColor: '#FFE0B2'}}>
                    <Header title = "Requested Item" navigation = {this.props.navigation}/>
                    <View style={{borderWidth: 0.3, borderColor: '#5C5127', justifyContent: 'center', alignItems: 'center', padding: RFValue(20), margin: RFValue(20), backgroundColor: '#FFEDA6', marginTop: RFValue(100)}}>
                        <Text style = {{color: '#5C5127', fontSize: RFValue(20)}}>Item Name: {this.state.itemName}</Text>
                    </View>
                    <View style={{borderWidth: 0.3, borderColor: '#5C5127', justifyContent: 'center', alignItems: 'center', padding: RFValue(20), margin: RFValue(20), backgroundColor: '#FFEDA6', marginTop: RFValue(50)}}>
                        <Text style = {{color: '#5C5127', fontSize: RFValue(20)}}>Exchange Status: {this.state.requestStatus}</Text>
                    </View>
                    <View style={{borderWidth: 0.3, borderColor: '#5C5127', justifyContent: 'center', alignItems: 'center', padding: RFValue(20), margin: RFValue(20), backgroundColor: '#FFEDA6', marginTop: RFValue(50)}}>
                        <Text style = {{color: '#5C5127', fontSize: RFValue(20)}}>Item Value: {this.state.value}</Text>
                    </View>
                    <TouchableOpacity
                    style={{
                        width: RFValue(300),
                        height: RFValue(50),
                        marginTop: RFValue(50),
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
                        elevation: 16
                    }}
                    onPress={()=>{
                        this.sendNotification();
                        this.updateRequestStatus();
                        this.receivedItems(this.state.itemName)
                    }}>
                        <Text style = {{color: '#fff', fontWeight: '200', fontSize: RFValue(20)}}>I received the item</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return(
                <View style = {{
                    flex: 1
                }}>
                    <Header title = "Add Item" navigation = {this.props.navigation}/>
                    <KeyboardAvoidingView style = {styles.keyboard}>
                        <TextInput
                        style = {styles.addItem}
                        placeholder = "Enter Item Name"
                        onChangeText = {(text) =>{
                            this.setState({
                                itemName: text
                            })
                        }}
                        value = {this.state.itemName}/>
                        <TextInput
                        style = {[styles.addItem, {height: 300}]}
                        multiline
                        numberOfLines = {8}
                        placeholder = "Why do you want this item?"
                        onChangeText = {(text) =>{
                            this.setState({
                                description: text
                            })
                        }}
                        value = {this.state.description}/>
                        <TextInput
                        style={styles.addItem}
                        placeholder ={"Item Value"}
                        maxLength ={8}
                        onChangeText={(text)=>{
                          this.setState({
                            value: text
                          })
                        }}
                        value={this.state.value}
                      />
                        <TouchableOpacity
                        style = {styles.button}
                        onPress = {() =>{
                            this.addItem(this.state.itemName, this.state.description)
                        }}>
                            <Text style = {{color: '#fff', fontSize: RFValue(20)}}>Add Item</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    keyboard: {
      flex:1,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#FFE0B2'
    },
    addItem:{
      width:"75%",
      height:50,
      alignSelf:'center',
      borderColor:'#806F2D',
      borderRadius:10,
      borderWidth:1,
      marginTop:20,
      padding:10,
      backgroundColor: '#FFEDA6',
      fontSize: RFValue(20),
      color: '#806F2D'
    },
    button:{
      width:"75%",
      height:50,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:10,
      backgroundColor:"#DEAC35",
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 8,
      },
      shadowOpacity: 0.44,
      shadowRadius: 10.32,
      elevation: 16,
      marginTop:20
      }
    }
  )