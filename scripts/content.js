document.body.onload = this.main

function main() {
    const videoElements = document.getElementsByClassName("video-js");
    const plg = document.getElementsByClassName("resourcecontent")[0]
    let src = '';
    if (videoElements.length != 0) {
        let data = JSON.parse(videoElements[0].getAttribute("data-setup-lazy"));
        for (var i = 0; i < data.sources.length; i++) {
            if (data.sources[i].type.toLowerCase().includes('video')) {
                src = data.sources[i].src
                break;
            }
        };
        plg.appendChild(createTranslationBtn(src));
    }
}

function createTranslationBtn(src) {
    let btn = document.createElement("button");
    btn.innerHTML = "Перевод в текст";
    btn.classList.add('transBtn');
    btn.onclick = (e) => {
        sendRequest(btn,src)
    }
    return btn;
}

async function sendRequest(btn,src) {
    const plg = document.getElementsByClassName("resourcecontent")[0]

    // const xhr = new XMLHttpRequest()
    // xhr.open("POST", "http://207.154.200.17:8000/api/v1/recognition/recognize")
    // xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

    // const body = JSON.stringify({
    //     url: src,
    //     type: "youtube"
    // });

    // xhr.onload = () => {
    //     if (xhr.readyState == 4 && xhr.status == 201) {
    //         console.log(JSON.parse(xhr.responseText));
    //     } else {
    //         console.log(`Error: ${xhr.status}`);
    //     }
    // };

    // xhr.send(body);

    btn.disabled = true;
    btn.classList.add('tansDisable');
    btn.innerHTML = "Перевод..."

    let text = await new Promise((res,rej) => {
        setTimeout(() => {
            res("sfesfsefsefsefsefsef");
        }, 5000)
    })

    btn.disabled = false;
    btn.remove();
    let div = document.createElement('div')
    div.classList.add('transText');
    div.innerHTML = text;
    plg.appendChild(div)
}