

const BASEURL = "http://127.0.0.1:3000"

export async function GetLebronSongList() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    return await fetch(BASEURL + "/songs", requestOptions)
        .then((response) => response.json())
        .catch((error) => { error });

}
