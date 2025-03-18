import { Colors } from "@/constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function LebronifyHeader() {

    return (
        <View style={[styles.header]}>
            <TouchableOpacity onPress={() => {
                
            }}>
                <Image
                    source={require('@/assets/images/lebronifylogo.png')}
                    style={styles.logo}
                />
            </TouchableOpacity>
            <View style={[styles.headermiddle]}>
                <Entypo name="magnifying-glass" size={24} color={Colors.light.text} />
                <TextInput style={[styles.textinput]} placeholder='What do you want to play?' placeholderTextColor="#766912" />
            </View>
            <View>
                <Text style={[styles.caption]}>For the king.</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

  header: {
    backgroundColor: "#000",
    padding: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headermiddle: {
    width: "25%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 32,
    padding: 16,
    gap: 16
  },
  textinput: {
    color: Colors.light.text,
    width: "100%",
    outlineStyle: "none"
  },
  logo: {
    height: 40,
    width: 40
  },
  caption: {
    color: Colors.light.text,
    fontWeight: "500"
  },
})