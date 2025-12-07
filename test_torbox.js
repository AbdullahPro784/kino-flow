const KEY = "sb_secret_p0GR2L3A2UE_enL71Df13w_MCzog0XK";

async function test() {
    console.log("Testing with key:", KEY);
    try {
        const res = await fetch("https://api.torbox.app/v1/api/torrents/mylist", {
            headers: {
                "Authorization": `Bearer ${KEY}`
            }
        });

        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body:", text);
    } catch (e) {
        console.error("Link verification failed:", e);
    }
}

test();
