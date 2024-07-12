
import init, { str_to_png } from './rust_wordsflow2.js';

async function run() {
    await init();
    document.getElementById("GeneBtn").addEventListener("click", async (event) => {
        const words = document.getElementById("words_input").value;
        if (words.length === 0) {
            window.alert("err:Wordsをセットしてください");
            return;
        }
        if (words.length > 20) {
            window.alert("err:20字以下でWordsをセットしてください");
            return;
        }
        await fetchFontAsUint8Array("./NotoSansJP-Regular.ttf")
            .then(uint8Array => {
                for (let i=0;i<words.length;i++)
                {
                    setTimeout(function() {
                        document.getElementById("mainImg").src = str_to_png(words[i],uint8Array);
                    }, i*1000);
                }
            });
    });
}
run();


const fetchFontAsUint8Array = async (fontPath) => {
    try {
        const response = await fetch(fontPath);
        const arrayBuffer = await response.arrayBuffer();
        return new Uint8Array(arrayBuffer);
    } catch (error) {
        console.error('fontfile_error:', error);
        return null;
    }
};
