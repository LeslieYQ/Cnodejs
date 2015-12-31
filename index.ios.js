/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

var API_URL = 'https://cnodejs.org/api/v1/topics';
var PAGE_SIZE = 25;
var PAGE_START = 0;
var PARAMS = 'page=' + PAGE_START + 'limit=' + PAGE_SIZE;
var REQUEST_URL = API_URL;

function dateTimeDiff(optionalValue) {
    var days = Math.floor((+new window.Date() - optionalValue) / 1000);
    if (days < 60) {
      return days + '秒前';
    } else if ((days = Math.floor(days / 60)) < 60) {
      return days + '分钟前';
    } else if ((days = Math.floor(days / 60)) < 60) {
      return days + '小时前';
    } else if ((days = Math.floor(days / 24)) < 30) {
      return days + '天前';
    } else if ((days = Math.floor(days / 30)) < 24) {
      return days + '月前';
    } else if (days = Math.floor(days / 12.2)) {
      return days + '年前';
    }
  }

var Obtain = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.data),
          loaded: true,
        });
      })
      .done();
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderTable}
        style={styles.listView}
      />
    );
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
      </View>
    );
  },

  renderTable: function(resource) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: resource.author.avatar_url}}
          style={styles.thumbnail}
        />
        <View style={styles.rightContainer}>
          <Text style={styles.title} numberOfLines={1}>{resource.title}</Text>
          <View style={styles.row}>
            <Tip typeData={[resource.top, resource.good, resource.tab]}/>
            <Text style={styles.count}>{resource.reply_count}/{resource.visit_count}</Text>
            <Date date= {resource.last_reply_at}/> 
          </View>
          
        </View>
      </View>
    );
  },
});

var Tip = React.createClass({
  render: function(){
    var type = this.props.typeData[0] ? 'top': (this.props.typeData[1] ? 'good' : this.props.typeData[2]);
    var text = '置顶';
    switch (type){
      case 'top': 
        text= '置顶';break;
      case 'good':
        text = '精华'; break;
      case 'ask':
        text = '问答'; break;
      case 'share':
        text = '分享'; break;
      case 'job':
        text = '招聘'; break;
      default: 
        text = '问答';
    }
    return (
        <View style={[styles.tips,styles[type]]}>
          <Text style={[styles.count,styles.tip]}>{text}</Text>
        </View>
      )
  }
});

var Date = React.createClass({
  render : function(){
    var dateTime = dateTimeDiff(new window.Date(this.props.date).getTime());
    return (
      <Text style={[styles.count,styles.dateTime]}>{dateTime}</Text>
      )
  }
})

var styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 60,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0'
  },
  rightContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  row: {
    flexDirection: 'row',
  },
  dateTime: {
    flex: 1,
    textAlign: 'right'
  },
  tips: {
    borderRadius: 2,
    marginRight: 5,
    padding: 2.5
  },
  tip:{
    color: 'white',
  },
  top: {
    backgroundColor: '#E74C3C'
  },
  good:{
    backgroundColor: '#E67E22'
  },
  share:{
    backgroundColor: '#1ABC9C'
  },
  job:{
    backgroundColor: '#9B59B6'
  },
  ask:{
    backgroundColor: '#3498DB'
  },
  title: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'left',
    lineHeight: 20,
  },
  count: {
    fontSize: 8,
  },
  thumbnail: {
    width: 40,
    height: 40,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('Obtain', () => Obtain);
