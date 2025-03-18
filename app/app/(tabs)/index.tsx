import { ItemPreviewLong } from '@/components/ItemPreviewLong';
import { ItemPreviewSmall } from '@/components/ItemPreviewSmall';
import { Colors } from '@/constants/Colors';
import { Entypo } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';

import LebronifyHeader from '@/components/LebronifyHeader';
import LebronifyPlayer from '@/components/LebronifyPlayer';
import { GetLebronSongList } from '@/scripts/lebronjapi'

export default function HomeScreen() {

  const audioRef = useRef(new Audio());

  const [activeView, setActiveView] = useState(0);
  useEffect(() => {
    console.log(activeView);
  }, [activeView])

  const [songlist, setSonglist] = useState([]);
  useEffect(() => {
    GetLebronSongList().then(response => {
      console.log('response:', response);
      setSonglist(response ? response.songs : []);
    })
  }, [])

  return (
    <View
      style={[styles.root]}
    >

      <LebronifyHeader songlist={songlist} />


      <View style={[styles.content]}>

        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity onPress={() => setActiveView(0)} style={{ backgroundColor: activeView === 0 ? Colors.light.secondary : Colors.light.text, padding: 8, borderRadius: 8 }}>
            <Text style={{ color: activeView === 0 ? Colors.light.text : Colors.light.secondary }}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveView(1)} style={{ backgroundColor: activeView === 1 ? Colors.light.secondary : Colors.light.text, padding: 8, borderRadius: 8 }}>
            <Text style={{ color: activeView === 1 ? Colors.light.text : Colors.light.secondary }}>Songs</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => setActiveView(2)} style={{ backgroundColor: activeView === 2 ? Colors.light.secondary : Colors.light.text, padding: 8, borderRadius: 8 }}>
            <Text style={{ color: activeView === 2 ? Colors.light.text : Colors.light.secondary }}>Podcasts</Text>
          </TouchableOpacity> */}
        </View>

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          {
            songlist.map((item, idx) => {

              if (idx > 7) return;
              if (idx > 3 && Dimensions.get("screen").width < 800) return;

              return <ItemPreviewLong key={`header-${item.file}`} title={item.title} file={item.file} />
            })
          }
        </View>

        <Text style={[styles.subtitle]}>Recently Added</Text>
        <View style={{ display: "flex", flexDirection: "row", overflow: "scroll" }}>
          {
            songlist.map((item): any => {

              return <ItemPreviewSmall key={`added-${item.file}`} title={item.title} file={item.file} />
            })
          }
        </View>

        {/* <Text style={[styles.subtitle]}>Recently Played</Text>
        <View style={{ display: "flex", flexDirection: "row", overflow: "scroll" }}>
          {
            [0].map(item => {

              return <ItemPreviewSmall key={`recent-${item.file}`} />
            })
          }
        </View> */}

      </View>

      <LebronifyPlayer audioRef={audioRef} />

    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  root: {
    flex: 1,
    backgroundColor: "#000"
  },
  content: {
    backgroundColor: "#111",
    padding: 16,
    gap: 16,
    overflow: "scroll",
    flex: 1
  },
  subtitle: {
    fontWeight: "600",
    color: "white",
    fontSize: 20
  },
  player: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  playercurrent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  playercover: {
    height: 75,
    width: 75
  },
  playertitle: {
    color: "white",
    fontWeight: "500",
  },
  playerartist: {
    color: "white",
    fontWeight: "300",
    fontSize: 10
  },
  playercontroller: {
    justifyContent: "center",
    alignItems: "center"
  },
  playerbuttons: {
    width: 300,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  },
  playeraudio: {
    justifyContent: "center"

  },
});
