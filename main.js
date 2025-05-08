document.addEventListener("DOMContentLoaded", () => {
  const dataHrefElements = document.querySelectorAll("[data-href]");

  dataHrefElements.forEach((element) => {
    const hrefValue = element.getAttribute("href");

    if (hrefValue) {
      element.style.cursor = "pointer"; // 클릭 가능한 커서 표시

      element.addEventListener("click", (event) => {
        event.preventDefault(); // 기본 링크 이동 방지
        window.open(hrefValue, "_blank"); // 새 창으로 URL 열기
      });

      // 기존 href 속성 제거 (선택 사항, data-href로 관리)
      element.removeAttribute("href");
    }
  });
});
