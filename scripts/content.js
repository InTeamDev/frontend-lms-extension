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
    btn.disabled = false;
    btn.innerHTML = "Перевод в текст";
    btn.classList.remove("tansDisable");
    plg.appendChild(btn);
    plg.removeChild(returnBtn);
  };
  return returnBtn;
};

const createTagsBtn = () => {
  const tagsBtn = document.createElement("button");
  tagsBtn.innerHTML = "Список ключевых слов";
  tagsBtn.classList.add("tagsBtn");
  tagsBtn.onclick = () => sendTagsRequest();
  return tagsBtn;
};
const sendTagsRequest = async () => {
  const plg = document.querySelector(".translation");
  const divText = document.querySelector(".transText");
  const tagsUrl = "https://localhost:8000/api/v1/recognition/tags";
  const data = { text: divText.innerHTML, video_id: "0" };

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
  } catch (error) {
    console.error(error);
    const div = document.createElement("div");
    div.classList.add("tags");
    div.innerHTML = "Не удалось получить данные 😞";
    plg.appendChild(div);
  }
};

const sendRequest = async (btn, src) => {
  const plg = document.querySelector(".translation");
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
  } finally {
    btn.disabled = false;
  }
};
