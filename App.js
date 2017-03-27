import React from 'react';
import * as firebase from 'firebase';
import ReactNative from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

const StatusBar = require('./components/StatusBar');
const ActionButton = require('./components/ActionButton');
const ListItem = require('./components/ListItem');
const styles = require('./style/styles.js')

const {
  AppRegistry,
  ListView,
  TouchableHighlight,
  AlertIOS,
} = ReactNative;

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAoSUmZdflu-giQM8SlkvM9KT0ap0jbXbA",
  authDomain: "flock-c2a26.firebaseapp.com",
  databaseURL: "https://flock-c2a26.firebaseio.com",
  storageBucket: "flock-c2a26.appspot.com",
};
// const firebaseApp = firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  constructor(props) {
      super(props);
      firebase.initializeApp(firebaseConfig)
      this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        })
      };
      this.itemsRef = this.getRef().child('items');
    }

    getRef() {
      return firebase.database().ref();
    }

    listenForItems(itemsRef) {
      itemsRef.on('value', (snap) => {

        // get children as an array
        var items = [];
        snap.forEach((child) => {
          items.push({
            title: child.val().title,
            _key: child.key
          });
        });

        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(items)
        });

      });
    }

    componentDidMount() {
      this.listenForItems(this.itemsRef);
    }

    render() {
      return (
        <View style={styles.container}>

          <StatusBar title="Grocery List" />

          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            enableEmptySections={true}
            style={styles.listview}/>

          <ActionButton onPress={this._addItem.bind(this)} title="Add" />

        </View>
      )
    }

    _addItem() {
      AlertIOS.prompt(
        'Add New Item',
        null,
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {
            text: 'Add',
            onPress: (text) => {
              this.itemsRef.push({ title: text })
            }
          },
        ],
        'plain-text'
      );
    }

    _renderItem(item) {

      const onPress = () => {
        AlertIOS.alert(
          'Complete',
          null,
          [
            {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
            {text: 'Cancel', onPress: (text) => console.log('Cancelled')}
          ]
        );
      };

      return (
        <ListItem item={item} onPress={onPress} />
      );
    }

  }

  AppRegistry.registerComponent("flock", () => App);
