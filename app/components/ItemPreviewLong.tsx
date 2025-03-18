import { Colors } from "@/constants/Colors";
import { socket } from "@/scripts/socket";
import { Entypo } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LebronSong {
    title: string
    file: string
    cover: string
}
export function ItemPreviewLong({ title, file, cover }: LebronSong) {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <View style={[styles.root, { backgroundColor: isHovered ? "#555" : "#222" }]}
            onPointerEnter={() => {
                setIsHovered(true);
            }} onPointerLeave={() => {
                setIsHovered(false);
            }}
            >

            <Image
                source={require('@/assets/images/cover.png')}
                style={styles.previewcover}
            />
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={[styles.previewtitle]}>{title}</Text>
            </View>

            <TouchableOpacity onPress={() => {
                socket.emit("playsong", file);
            }} style={{ display: isHovered ? "flex" : "none", position: "absolute", right: 12, backgroundColor: Colors.light.secondary, borderRadius: 20, padding: 8 }}>
                <Entypo name="controller-play" size={24} color={Colors.light.text} />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        width: "24%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        transitionDuration: "0.5s",
    },
    text: {
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
    },
    previewcover: {
        height: 75,
        width: 75
    },
    previewtitle: {
        color: Colors.light.text,
        fontWeight: "500",
        fontSize: 20
    },
});
