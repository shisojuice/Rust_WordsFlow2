
import init, { str_to_png } from './rust_wordsflow2.js';

async function run() {
    await init();
    document.getElementById("GeneBtn").addEventListener("click", async (event) => {
        const words = document.getElementById("words_input").value;
        if (words.length === 0) {
            window.alert("err:Wordsをセットしてください");
            return;
        }
        if (words.length > 50) {
            window.alert("err:50字以下でWordsをセットしてください");
            return;
        }
        document.getElementById("GeneBtn").disabled = true;
        await fetchFontAsUint8Array("./NotoSansJP-Regular.ttf")
            .then(uint8Array => {
                for (let i=0;i<words.length;i++)
                {
                    setTimeout(function() {
                        document.getElementById("mainImg").src = str_to_png(words[i],uint8Array);
                        if(i === words.length -1)
                        {
                            document.getElementById("GeneBtn").disabled =false;
                        }
                    }, i*500);
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
