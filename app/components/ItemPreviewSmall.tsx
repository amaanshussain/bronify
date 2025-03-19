import { Colors } from "@/constants/Colors";
import { socket } from "@/scripts/socket";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LebronSong {
    title: string
    file: string
    cover: string
}
export function ItemPreviewSmall({ title, file, cover }: LebronSong) {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <View style={[styles.root, { backgroundColor: isHovered ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0)" }]}
            onPointerEnter={() => {
                setIsHovered(true);
            }} onPointerLeave={() => {
                setIsHovered(false);
            }}>
            <View>

                <Image
                    source={require('@/assets/images/lebroncover.jpg')}
                    style={styles.previewcover}
                />
                <TouchableOpacity onPress={() => {
                    socket.emit("playsong", file);
                }} style={{ display: isHovered || Dimensions.get("screen").width < 800 ? "flex" : "none", position: "absolute", right: 12, bottom: 12, backgroundColor: Colors.light.secondary, borderRadius: 20, padding: 8 }}>
                    <Entypo name="controller-play" size={24} color={Colors.light.text} />
                </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 8, width: 125 }}>
                <Text style={[styles.previewtitle]} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        display: "flex",
        alignItems: "center",
        padding: 8,
        gap: 8,
        cursor: "pointer",
        transitionDuration: "0.5s",
    },
    previewcover: {
        height: 125,
        width: 125
    },
    previewtitle: {
        color: Colors.light.text,
        fontWeight: "300",
        fontSize: 15,
        textAlign: "left",
        width: "100%"
    },
});
