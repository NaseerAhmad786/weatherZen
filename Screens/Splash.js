import { StyleSheet, Text, View,ImageBackground,Image } from 'react-native'
import React from 'react'

const Splash = ({navigation}) => {
    React.useEffect(() => {
const navigate = async()=>{
    setTimeout(()=>{
        navigation.navigate("Home")
    },1000)
   
}

navigate()
    }, [])
    
  return (
    <ImageBackground    blurRadius={70} 
    source={require('../assets/images/bg.png')}  
    className="h-full w-full justify-center items-center"
    >
<Image source={require("../assets/icons/Logo.png")} className="h-32 w-32" />
    </ImageBackground>
  )
}

export default Splash

const styles = StyleSheet.create({})