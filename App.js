import React, { useState, } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';





const App = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [imageData, setImageData] = useState([])
  const [imageGellery, setImageGellery] = useState("");

  const [condition, setCondition] = useState(true)

  const [enabled, setEnabled] = useState(false)


  const openGellery = () => {
    ImagePicker.openPicker({
      cropping: true,
      freeStyleCropEnabled: true,
      mediaType: 'photo',
    }).then((image) => {
      
      setImageGellery(image.path)
      setImageData(image)

    })
      .catch((e) => alert(e.message))
  }




  const saveData = async () => {

    let item = imageData
    console.log(item)

    if (name == '' || email == '' || imageGellery == '') {
      alert('Please Fill All Fields Correctly')
    }

    else {

      let path = item.path.split('/')

      let Filename = path[path.length - 1]
      let Uri = item.path
      let Type = item.mime

      const data = new FormData()
      data.append('DCIM', {
        uri: Uri,
        type: Type,
        name: Filename
      })
      data.append('name', name)
      data.append('email', email)


      await fetch("https://cloudinary-vercel-server.vercel.app/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data"
        },
        body: data,
      })
        .then(res => res.json())
        .then((data) => {
          console.log(data)
          setImageGellery(data.picture);
          Alert.alert(
            "Profile",
            "Your Data Saved Successfully",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              { text: "OK", onPress: () =>  setCondition(false) }
            ]
          );
        })

    }

    setImageData([]);
  }

  const resetData = () => {
    alert("Data Reset S ")
    setName('')
    setEmail('')
    setCondition(true);
    setImageGellery("")

  }



  // let defaultImage = 'https://www.pngkey.com/png/detail/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png'
  // let defaultImage = "https://www.kindpng.com/picc/m/163-1636340_user-avatar-icon-avatar-transparent-user-icon-png.png"
  let defaultImage = "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"


  return (
    <KeyboardAvoidingView style={styles.Container} behavior='position' enabled={enabled} >

      <View style={styles.SubContainer}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />

        <View style={styles.ChooseImage}>
          <Image
            source={{ uri: imageGellery || defaultImage }}
            style={{ width: 170, height: 170, borderRadius: 85 }}
          />
        </View>

        <TouchableOpacity style={styles.Camera} disabled={!condition} onPress={() => openGellery()} >
          <Icons name="camera" color={'#fff'} size={30} />
        </TouchableOpacity>

        <Text style={styles.inputText} >Name</Text>
        <TextInput style={styles.inputField} autoCorrect={false} editable={condition} value={name} onChangeText={(text) => setName(text)} onFocus={() => setEnabled(true)} />

        <Text style={styles.inputText} >Email</Text>
        <TextInput style={styles.inputField} autoCorrect={false} editable={condition} value={email} onChangeText={(text) => setEmail(text)} onFocus={() => setEnabled(true)} />

        <View style={{flexDirection: 'row',  width: '76%', justifyContent: 'space-around' }}>
          <TouchableOpacity style={styles.SaveBtnView} disabled={!condition} onPress={() => saveData()} >
            <Text style={styles.SaveBtnTxt} >Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ResetBtnView} onPress={() => resetData()} >
            <Text style={styles.ResetBtnTxt} >Reset</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "violet",
  },
  SubContainer: {
    alignItems: "center",
  },
  ChooseImage: {
    width: 170,
    height: 170,
    backgroundColor: "#fff",
    borderRadius: 85,
    marginTop: '20%',
    justifyContent: "center",
    alignItems: "center",
  },
  Camera: {
    width: 45,
    height: 45,
    backgroundColor: "lightgrey",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22.5,
    marginTop: "-6%",
    left: 40
  },
  inputText: {
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginTop: 18,
    marginLeft: 45,
    marginBottom: 2
  },
  inputField: {
    width: 280,
    height: 45,
    borderRadius: 6,
    fontSize: 18,
    paddingLeft: 11,
    backgroundColor: '#eee',
    elevation: 10,
  },




  SaveBtnView: {
    backgroundColor: '#25be35',
    width: 120,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginTop: '20%',
    elevation: 10,
  },
  SaveBtnTxt: {
    fontWeight: '500',
    fontSize: 18,
    color: '#fff'
  },



  ResetBtnView: {
    backgroundColor: '#f52c1d',
    width: 120,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    marginTop: '20%',
    elevation: 10,
  },
  ResetBtnTxt: {
    fontWeight: '500',
    fontSize: 18,
    color: '#fff'
  }


});

export default App;
