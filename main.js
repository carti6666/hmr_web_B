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

document.addEventListener("DOMContentLoaded", () => {
  function timeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((past - now) / 1000);
    const diffInDays = Math.floor(diffInSeconds / (60 * 60 * 24));
    const absDiffInDays = Math.abs(diffInDays);

    if (diffInDays === 0) {
      return "today";
    } else if (diffInSeconds < 0) {
      return `${absDiffInDays} days ago`;
    } else {
      return `${diffInDays} days left`;
    }
  }

  function updateTimeElements() {
    const timeElements = document.querySelectorAll(".time");
    timeElements.forEach((element) => {
      const timestamp = element.dataset.timestamp;
      if (timestamp) {
        element.textContent = timeAgo(timestamp);
      }
    });
  }

  updateTimeElements();
  // 필요하다면 주기적으로 업데이트
  // setInterval(updateTimeElements, 60000); // 1분마다 업데이트
});

document.addEventListener('DOMContentLoaded', () => {
    const imageContainers = document.querySelectorAll('.image-container');
  
    imageContainers.forEach(container => {
      const thumbnail = container.querySelector('.release-thumbnail');
      const originalImage = container.querySelector('.release-original');
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
  
      if (isMobile) {
        thumbnail.addEventListener('click', (event) => {
          event.preventDefault(); // 필요에 따라 링크 이동 방지
          container.classList.toggle('active');
        });
  
        // 다른 영역 클릭 시 열린 이미지 닫기 (선택 사항)
        document.addEventListener('click', (event) => {
          if (!container.contains(event.target)) {
            container.classList.remove('active');
          }
        });
      }
    });
  });