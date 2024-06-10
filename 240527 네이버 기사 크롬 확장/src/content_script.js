// POST 함수
async function postData(url = "", data = {}) {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return (await response.text()).replace(/"/g, "");
}


const DEFAULT_ELEMENT =`<div class="logo-box">
    <img src=${chrome.runtime.getURL("src/gemini_logo.png")}></img>
    <p>Gemini로 요약하기</p>
</div>
<div id="gemini-result">
</div>
`;


// 버튼 & 요약 화면으로 보여줄 공간
var ggt = document.createElement("div");
ggt.id = "ggt";
ggt.style.marginBottom = "20px";



// 기사 헤드라인에 GGT 삽입
function ActiveGGT() {
    var headline = document.getElementById("ct");
    headline.insertBefore(ggt, headline.children[0]);

    console.log("GGT 생성 완료");
}


// GGT를 버튼 모양으로 수정
function Change2Button() {
    ggt.className = "btn";
    ggt.innerHTML = DEFAULT_ELEMENT;
    ggt.addEventListener("click", StartSummary);
    console.log("GGT 버튼 변형 완료");
}


// 서버 통신 및 요약 시작
function StartSummary() {
    ggt.removeEventListener("click", StartSummary);
    ggt.style.cursor = "default";
    ggt.classList.add("expanded", "skeleton");
    ggt.querySelector("p").innerText = "Gemini로 요약하는 중...";
    ggt.querySelector("#gemini-result").innerHTML = `\
                        <div class="skeleton" style="width: 280px; height: 20px; margin-top: 20px; margin-bottom: 7px"></div>\
                        <div class="skeleton" style="width: 590px; height: 15px; margin-bottom: 5px"></div>\
                        <div class="skeleton" style="width: 530px; height: 15px; margin-bottom: 30px"></div>\
                        <div class="skeleton" style="width: 310px; height: 20px; margin-bottom: 7px"></div>\
                        <div class="skeleton" style="width: 440px; height: 15px; margin-bottom: 5px"></div>\
                        <div class="skeleton" style="width: 570px; height: 15px; margin-bottom: 16px"></div>\
    `;
    
    var title = document.querySelector('#title_area > span').innerText;
    var content = document.querySelector("article").innerText;

    postData("http://localhost:8000/summary", { title: title, content: content }).then((data) => {
        ggt.querySelector("p").innerText = "Gemini가 기사를 요약했어요";
        ggt.querySelector("#gemini-result").innerHTML = data;
        console.log(data);
    }).catch((error) => {
        ggt.querySelector("p").innerText = "Gemini 통신 오류 발생";
        ggt.querySelector("#gemini-result").innerHTML = "";
        console.error(error);
    })
}


// 첫 실행 함수
function main() {
    ActiveGGT();
    Change2Button();
} main();



