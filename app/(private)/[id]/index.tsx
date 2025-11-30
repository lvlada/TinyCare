import { View, Text, Button, Pressable } from "react-native";
import {useRouter, Link, useLocalSearchParams} from 'expo-router';


export default function ListPage() {
  const router = useRouter();
  const {id} = useLocalSearchParams();

  function handleGoBack() {
    router.back();
  }

  return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}> 
    <Text>List ID Page: {id} </Text>
    <Pressable onPress={handleGoBack}><Text>Go Back</Text></Pressable>
  </View>
}