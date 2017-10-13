import React, { Component } from 'react';
import { NetInfo, View, Text } from 'react-native-web';

/*
let's convert this from using setState -> saving to the Apollo cache via a mutation
we don't want to render anything from this component..
other components will query the cache if they need to use the data

what I'd like to do:

const NETWORK_STATUS_UPDATE = gql`
mutation updateNetworkStatus($isConnected: Boolean!) {
  updateNetworkStatus(isConnected: $isConnected) {
    isConnected
  }
}
`

right now, we can wrap the component in withApollo(networkStatus)
to update, it looks like we can do something like this in 1.0?:

const { client } = this.props
client.writeQuery({
  query: NETWORK_STATUS_UPDATE,
  variables: { isConnected },
  data: { isConnected }
})

when we query this data from another component, readQuery always reads from the cache
so we don't have to explicitly set fetch policies

questions:
- is the API different for 2.0? it looks like we have customResolver now, how do we integrate?
- where is this documented? we should make this explicit on the cache docs
*/

export default class NetworkStatus extends Component {
  state = {
    isConnected: true,
  };

  async componentDidMount() {
    const isConnected = await NetInfo.isConnected.getConnectionInfo();
    this.setState(() => ({ isConnected }));

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange,
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange');
  }

  handleConnectivityChange = isConnected => {
    this.setState(() => ({ isConnected }));
  };

  render() {
    return (
      <View>
        <Text>{`Online: ${this.state.isConnected}`}</Text>
      </View>
    );
  }
}
