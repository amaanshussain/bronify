

const BASEURL = "https://lebronify.develoop.app"

export async function GetLebronSongList() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    return await fetch(BASEURL + "/songs", requestOptions)
        .then((response) => response.json())
        .catch((error) => { error });

}
