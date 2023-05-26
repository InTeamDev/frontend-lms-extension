const checkExist = setInterval(() => {
  const videoElements = document.getElementsByClassName("video-js");
  if (videoElements.length > 0) {
    clearInterval(checkExist);
    main(videoElements[0]);
  }
}, 100);

const main = (videoElement) => {
  const plg = document.querySelector(".resourcecontent");
  const data = JSON.parse(videoElement.getAttribute("data-setup-lazy"));
  const videoSources = data.sources.filter((source) =>
    source.type.toLowerCase().includes("video")
  );
  if (videoSources.length > 0) {
    const src = videoSources[0].src;
    plg.appendChild(createTranslationBtn(src));
  }
};

const createTranslationBtn = (src) => {
  const btn = document.createElement("button");
  btn.innerHTML = "Перевод в текст";
  btn.classList.add("transBtn");
  btn.onclick = () => sendRequest(btn, src);
  return btn;
};

const createReturnBtn = (plg, btn) => {
  const returnBtn = document.createElement("button");
  returnBtn.innerHTML = "Вернуться к переводу";
  returnBtn.classList.add("returnBtn");
  returnBtn.onclick = () => {
    plg.removeChild(plg.querySelector(".transText"));
    btn.disabled = false;
    btn.innerHTML = "Перевод в текст";
    btn.classList.remove("tansDisable");
    plg.appendChild(btn);
    plg.removeChild(returnBtn);
  };
  return returnBtn;
};

const sendRequest = async (btn, src) => {
  const plg = document.querySelector(".resourcecontent");
  const recognizeUrl = "https://localhost:8000/api/v1/recognition/recognize";
  const data = { url: src, type: "youtube" };

  btn.disabled = true;
  btn.classList.add("tansDisable");
  btn.innerHTML = "Перевод...";

  try {
    const response = await fetch(recognizeUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const responseData = await response.json();
    const div = document.createElement("div");
    div.classList.add("transText");
    div.innerHTML = responseData.text;
    plg.appendChild(div);
    const returnBtn = createReturnBtn(plg, btn);
    plg.appendChild(returnBtn);
    btn.remove();
  } catch (error) {
    console.error(error);
    const div = document.createElement("div");
    div.classList.add("transText");
    div.innerHTML = "Не удалось получить данные 😞";
    plg.appendChild(div);
  } finally {
    btn.disabled = false;
  }
};
