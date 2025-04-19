import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const Chat = () => {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,     paddingHorizontal: 24,}}>
    <View>
      <Text>Chat</Text>
    </View>
    </SafeAreaView>
  )
}

export default Chat
