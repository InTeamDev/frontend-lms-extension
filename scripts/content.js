document.body.onload = this.main;

function main() {
  const videoElements = document.getElementsByClassName("video-js");
  const plg = document.getElementsByClassName("resourcecontent")[0];
  let src = "";
  if (videoElements.length != 0) {
    let data = JSON.parse(videoElements[0].getAttribute("data-setup-lazy"));
    for (var i = 0; i < data.sources.length; i++) {
      if (data.sources[i].type.toLowerCase().includes("video")) {
        src = data.sources[i].src;
        break;
      }
    }
    plg.appendChild(createTranslationBtn(src));
  }
}

function createTranslationBtn(src) {
  let btn = document.createElement("button");
  btn.innerHTML = "Перевод в текст";
  btn.classList.add("transBtn");
  btn.onclick = (e) => {
    sendRequest(btn, src);
  };
  return btn;
}

async function sendRequest(btn, src) {
  const plg = document.getElementsByClassName("resourcecontent")[0];
  const recognizeUrl = "https://localhost:8000/api/v1/recognition/recognize";

  let data = {
    url: src,
    type: "youtube",
  };

  btn.disabled = true;
  btn.classList.add("tansDisable");
  btn.innerHTML = "Перевод...";

  let text = "Не удалось получить данные 😞";

  fetch(recognizeUrl, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      text = data.text;
      console.log(data);
      console.log(text);
      let div = document.createElement("div");
      div.classList.add("transText");
      div.innerHTML = text;
      plg.appendChild(div);
    })
    .catch((error) => console.error(error));

  btn.disabled = false;
  btn.remove();
}
