import { Colors } from "@/constants/Colors";
import { socket } from "@/scripts/socket";
import { concatenateArrayBuffers, formatSongTime } from "@/scripts/utils";
import { Entypo } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


interface LebronifyPlayer {
    audioRef: React.MutableRefObject<HTMLAudioElement>
}

export default function LebronifyPlayer() {

    const audioRef = useRef(new Audio());

    const [volume, setVolume] = useState(1);
    const [runtime, setRuntime] = useState(-1);
    const [duration, setDuration] = useState(0);
    const [sliderTime, setSliderTime] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [musicinfo, setMusicInfo] = useState<any>(null);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume])

    useEffect(() => {
        if (playing) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [playing])

    useEffect(() => {
        if (musicinfo) setPlaying(true);
    }, [musicinfo])

    useEffect(() => {

        const interval = setInterval(() => {

            const runtime = audioRef.current.currentTime;
            const duration = audioRef.current.duration;

            setRuntime(runtime);
            setDuration(duration);
            setSliderTime(runtime / duration);

            if (runtime === duration) setPlaying(false)

        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);


    useEffect(() => {
        socket.on("musicinfo", (data) => {
            setMusicInfo(data);
        })
    }, [])

    useEffect(() => {

        let receivedChunks: ArrayBuffer[] = [];
        socket.on("musicdata", (data) => {

            if (receivedChunks.length !== data.totalChunks) receivedChunks[data.index] = data.data;

            if (receivedChunks.filter(Boolean).length === data.totalChunks) {
                const music = concatenateArrayBuffers(receivedChunks)

                const bufferData = new Uint8Array(music);
                const blob = new Blob([bufferData], { type: "audio/wav" });
                const objectURL = URL.createObjectURL(blob);
                audioRef.current.src = objectURL;
                audioRef.current.play();
                receivedChunks = [];
            }
        });
    }, [])


    return (

        <View style={[styles.player, { flexDirection: Dimensions.get("screen").width < 800 ? "column" : "row" }]}>
            <View style={[styles.playercurrent]}>
                <Image
                    source={require('@/assets/images/lebroncover.jpg')}
                    style={[styles.playercover, {
                        height: Dimensions.get("screen").width < 800 ? 50 : 75,
                        width: Dimensions.get("screen").width < 800 ? 50 : 75

                    }]}
                />
                <View>
                    <Text style={[styles.playertitle]}>{musicinfo ? musicinfo.title : "LeBronify"}</Text>
                    <Text style={[styles.playerartist]}>Lebron James</Text>
                </View>
            </View>
            <View style={[styles.playercontroller]}>
                <View style={[styles.playerbuttons]}>

                    <TouchableOpacity onPress={() => {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play();
                        setPlaying(true);
                    }} style={{ padding: 8 }}>
                        <Entypo name="controller-jump-to-start" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        setPlaying(prev => !prev);
                    }} style={{ backgroundColor: "#333", borderRadius: 20, padding: 8 }}>
                        {
                            playing ? (
                                <Entypo name="controller-paus" size={24} color={Colors.light.text} />
                            ) : (
                                <Entypo name="controller-play" size={24} color={Colors.light.secondary} />
                            )
                        }

                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 8 }}>
                        <Entypo name="controller-next" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <Text style={{ color: "white" }}>{formatSongTime(runtime)}</Text>
                    <Slider
                        style={{ width: 250 }}
                        value={sliderTime}
                        minimumValue={0}
                        maximumValue={1}
                        minimumTrackTintColor={Colors.light.secondary}
                        maximumTrackTintColor="#333"
                        thumbTintColor={Colors.light.text}
                        onValueChange={(val) => {
                            const timestamp = audioRef.current.duration * val;
                            audioRef.current.currentTime = timestamp;
                            audioRef.current.play();
                            setPlaying(true);
                        }}
                    />
                    <Text style={{ color: "white" }}>{formatSongTime(duration)}</Text>
                </View>
            </View>
            <View style={[styles.playeraudio, { display: Dimensions.get("screen").width < 800 ? "none" : "flex" }]}>
                <Entypo name="beamed-note" size={24} color="white" />
                <Slider
                    style={{ width: 150 }}
                    value={1}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor={Colors.light.secondary}
                    maximumTrackTintColor="#333"
                    thumbTintColor={Colors.light.text}
                    onValueChange={(val) => setVolume(val)}
                />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    player: {
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
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
        alignItems: "center",
        gap: 8,
        width: "50%"
    },
    playerbuttons: {
        width: 300,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
    },
    playeraudio: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
});
