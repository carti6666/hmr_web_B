document.addEventListener("DOMContentLoaded", () => {
  const thumbnailContainers = document.querySelectorAll(".thumbnail-container");

  thumbnailContainers.forEach((container) => {
    const thumbnail = container.querySelector(".thumbnail");
    const originalImage = container.querySelector(".original-image");
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (isMobile) {
      thumbnail.addEventListener("click", (event) => {
        event.preventDefault(); // 필요에 따라 링크 이동 방지
        container.classList.toggle("active");
      });

      // 다른 영역 클릭 시 열린 이미지 닫기 (선택 사항)
      document.addEventListener("click", (event) => {
        if (!container.contains(event.target)) {
          container.classList.remove("active");
        }
      });
    }
  });
});
