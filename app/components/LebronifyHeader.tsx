import { Colors } from "@/constants/Colors";
import { socket } from "@/scripts/socket";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function LebronifyHeader({ songlist }) {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    const temp = songlist.filter(item =>
      item.title && item.title.toLowerCase().includes(query.toLowerCase())
    );
    console.log(results)
    setResults(temp)
  }, [query])

  return (
    <View style={[styles.header]}>
      <TouchableOpacity style={[{ display: Dimensions.get("screen").width < 800 ? "none" : "flex" }]} onPress={() => {

      }}>
        <Image
          source={require('@/assets/images/lebronifylogo.png')}
          style={styles.logo}
        />
      </TouchableOpacity>
      <View style={[styles.headermiddle]}>
        <Entypo name="magnifying-glass" size={24} color={Colors.light.text} />
        <TextInput style={[styles.textinput]} value={query} onChangeText={(text) => setQuery(text)} placeholder='What do you want to play?' placeholderTextColor="#766912" />
        <View style={[styles.searchbox, { display: query !== "" ? "flex" : "none" }]}>
          {
            results.map(song => {

              return (
                <View style={[styles.queryresult]}>
                  <Image
                    source={require('@/assets/images/lebroncover.jpg')}
                    style={styles.searchcover}
                  />
                  <Text style={[styles.searchtitle]}>{song.title}</Text>
                  <TouchableOpacity onPress={() => {
                    socket.emit("playsong", song.file);
                    setQuery("");
                  }} style={{ backgroundColor: Colors.light.secondary, borderRadius: 20, padding: 8, }}>
                    <Entypo name="controller-play" size={24} color={Colors.light.text} />
                  </TouchableOpacity>
                </View>
              )
            })
          }
        </View>
      </View>
      <View>
        <Text style={[styles.caption, { display: Dimensions.get("screen").width < 800 ? "none" : "flex" }]}>For the king.</Text>
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
    justifyContent: Dimensions.get("screen").width < 800 ? "center" : "space-between",
    alignItems: "center",
    zIndex: 5
  },
  headermiddle: {
    width: Dimensions.get("screen").width < 800 ? "75%" : "25%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
    borderRadius: 32,
    padding: 16,
    gap: 16,
    position: "relative"
  },
  searchbox: {
    position: "absolute",
    top: "100%",
    backgroundColor: "#222",
    width: "100%",
    padding: 8,
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
  queryresult: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  searchcover: {
    height: 50,
    width: 50,
  },
  searchtitle: {
    color: Colors.light.text
  }
})