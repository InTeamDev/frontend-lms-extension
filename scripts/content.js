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
    plg.appendChild(createTranslationDiv(src));
  }
};

const createTranslationDiv = (src) => {
  const div = document.createElement("div");
  div.classList.add("translation");
  div.appendChild(createTranslationBtn(src));
  return div;
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
    plg.removeChild(plg.querySelector(".transBtns"));
    if (plg.querySelector(".tags") != null) 
    {
      plg.removeChild(plg.querySelector(".tags"));
    }
    if (plg.querySelector(".tagsBtn") != null) 
    {
      plg.removeChild(plg.querySelector(".tagsBtn"));
    }
    btn.disabled = false;
    btn.innerHTML = "Перевод в текст";
    btn.classList.remove("tansDisable");
    plg.appendChild(btn);
    returnBtn.remove();
  };
  return returnBtn;
};

const createTagsBtn = () => {
  const tagsBtn = document.createElement("button");
  tagsBtn.innerHTML = "Список ключевых слов";
  tagsBtn.classList.add("tagsBtn");
  tagsBtn.onclick = () => sendTagsRequest(tagsBtn);
  return tagsBtn;
};

const createReturnTagsBtn = (plg) => {
  const btnDiv = document.querySelector(".transBtns");
  const returnBtn = document.createElement("button");
  returnBtn.innerHTML = "Скрыть ключевые слова";
  returnBtn.classList.add("returnBtn");
  returnBtn.onclick = () => {
    plg.removeChild(plg.querySelector(".tags"));
    returnBtn.remove();
    btnDiv.appendChild(createTagsBtn());    
  };
  return returnBtn;
}
const sendTagsRequest = async (btn) => {
  const plg = document.querySelector(".translation");
  const btns = document.querySelector(".transBtns");
  const divText = document.querySelector(".transText");
  const tags = document.querySelector(".tags");
  const tagsUrl = "https://localhost:8000/api/v1/recognition/tags";
  const data = { text: divText.innerHTML, video_id: "0" };

  btn.classList.add("tansDisable");
  btn.innerHTML = "Получение ключевых слов...";
  btn.disabled = true;

  if (tags != null) {
    tags.remove();
  }

  try {
    const response = await fetch(tagsUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    const responseData = await response.json();
    const div = document.createElement("div");
    div.classList.add("tags");
    div.innerHTML = responseData.tags.join(", ");
    plg.appendChild(div);
    btns.appendChild(createReturnTagsBtn(plg));
    btn.remove()
  } catch (error) {
    console.error(error);
    const div = document.createElement("div");
    div.classList.add("tags");
    div.innerHTML = "Не удалось получить данные 😞";
    plg.appendChild(div);
    btns.appendChild(createReturnTagsBtn(plg));
    btn.remove()
  }
};

const sendRequest = async (btn, src) => {
  const plg = document.querySelector(".translation");
  const transText = document.querySelector(".transText");
  const tranBtn = document.querySelector(".transBtn");
  const recognizeUrl = "https://localhost:8000/api/v1/recognition/recognize";
  const data = { url: src, type: "youtube" };

  btn.disabled = true;
  btn.classList.add("tansDisable");
  btn.innerHTML = "Перевод...";

  if (transText != null) {
    transText.remove();
  }

  try {
    const response = await fetch(recognizeUrl, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    const responseData = await response.json();
    const div = document.createElement("div");
    const btnDiv = document.createElement("div");
    btnDiv.classList.add("transBtns");
    div.classList.add("transText");
    div.innerHTML = responseData.text;

    btnDiv.appendChild(createReturnBtn(plg, btn));
    btnDiv.appendChild(createTagsBtn());
    plg.appendChild(btnDiv);
    btn.remove();

    plg.appendChild(div);
  } catch (error) {
    console.error(error);
    const div = document.createElement("div");
    div.classList.add("transText");
    div.innerHTML = "Не удалось получить данные 😞";
    plg.appendChild(div);
    tranBtn.innerHTML = "Перевод в текст";
    tranBtn.classList.remove("tansDisable");
  } finally {
    btn.disabled = false;
  }
};
