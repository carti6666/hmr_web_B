document.addEventListener('DOMContentLoaded', () => {
  const coverContainers = document.querySelectorAll('.cover-container');
  const profileContainer = document.querySelector(".profile-container");
  const mainImageViewer = document.getElementById("profile-img-viewer");
  const mainImage = mainImageViewer ? mainImageViewer.querySelector("img") : null;
  const originalSrc = mainImage ? mainImage.src : '';
  const originalAlt = mainImage ? mainImage.alt : '';
  const textSwapContainer = document.querySelector('.text-swap-container');
  const englishText = document.querySelector('.english-text');
  const koreanText = document.querySelector('.korean-text');

  const isMobile = () => window.matchMedia('(max-width: 480px)').matches;

  // 이미지 Hover -> Click 전환
  coverContainers.forEach(container => {
      const thumbnail = container.querySelector('.thumbnail');

      if (isMobile()) {
          thumbnail.addEventListener('click', (event) => {
              event.preventDefault();
              container.classList.toggle('active');

              coverContainers.forEach(otherContainer => {
                  if (otherContainer !== container) {
                      otherContainer.classList.remove('active');
                  }
              });
              event.stopPropagation();
          });
      }
  });

  if (isMobile()) {
      document.addEventListener('click', (event) => {
          coverContainers.forEach(container => {
              if (!container.contains(event.target)) {
                  container.classList.remove('active');
              }
          });
      });
  }

  // 갤러리 이미지 Hover -> Click 전환
  const profileThumbnails = document.querySelectorAll('.profile-thumbnail');
  profileThumbnails.forEach(thumbnail => {
      const newSrc = thumbnail.querySelector('img').src.replace('-small', '');
      const newAlt = thumbnail.querySelector('img').alt.replace('-small', '');

      if (isMobile() && mainImage) {
          thumbnail.addEventListener('click', () => {
              swapImage(newSrc, newAlt);
          });
      } else {
          thumbnail.addEventListener('mouseover', () => {
              swapImage(newSrc, newAlt);
          });
          if (profileContainer) {
              profileContainer.addEventListener('mouseleave', resetImage);
          }
      }
  });

  function swapImage(newSrc, newAlt) {
      if (mainImage) {
          mainImage.src = newSrc;
          mainImage.alt = newAlt;
      }
  }

  function resetImage() {
      if (mainImage) {
          mainImage.src = originalSrc;
          mainImage.alt = originalAlt;
      }
  }

  // 텍스트 Swap Hover -> Click 전환
  if (textSwapContainer && englishText && koreanText) {
      if (isMobile()) {
          textSwapContainer.addEventListener('click', () => {
              textSwapContainer.style.minHeight = koreanText.offsetHeight + 'px';
              englishText.style.display = englishText.style.display === 'none' ? 'block' : 'none';
              koreanText.style.display = koreanText.style.display === 'none' ? 'block' : 'none';
          });
      } else {
          textSwapContainer.addEventListener('mouseenter', () => {
              textSwapContainer.style.minHeight = koreanText.offsetHeight + 'px';
              englishText.style.display = 'none';
              koreanText.style.display = 'block';
          });

          textSwapContainer.addEventListener('mouseleave', () => {
              textSwapContainer.style.minHeight = englishText.offsetHeight + 'px';
              englishText.style.display = 'block';
              koreanText.style.display = 'none';
          });
      }
  }

  // func-data-href (클릭 이벤트는 그대로 유지)
  document.querySelectorAll(".data-href, .data-href-outlink").forEach((element) => {
      element.style.cursor = "pointer";
      const hrefValue = element.getAttribute("href");

      if (hrefValue) {
          element.dataset.href = hrefValue;
          // href 속성을 제거하여 브라우저의 기본 동작을 막고, 스크립트로만 제어합니다.
          element.removeAttribute("href");

          element.addEventListener("click", (event) => {
              event.preventDefault();
              const urlToOpen = element.dataset.href;
              let openInNewTab = false;

              // .data-href-outlink 클래스가 있거나,
              // 또는 <span> 태그이면서 .data-href 클래스를 가진 경우 새 탭으로 엽니다.
              if (element.classList.contains("data-href-outlink") ||
                  (element.tagName === 'SPAN' && element.classList.contains('data-href'))) {
                  openInNewTab = true;
              }

              if (openInNewTab) {
                  window.open(urlToOpen, "_blank", "noopener,noreferrer");
              } else {
                  // 그 외 .data-href 요소는 현재 탭에서 엽니다.
                  window.location.href = urlToOpen;
              }
          });
      }
  });

  // 언더라인 (CSS로 처리되므로 JavaScript 변경 없음)
  const shadowElements = document.querySelectorAll(".shadow-underline-pseudo");
  shadowElements.forEach((element) => {
      element.dataset.text = element.textContent;
  });

  // numbering-padding-call (DOM 로드 후 실행되므로 유지)
  const aSpan = document.getElementById("span-numbering");
  const bSpan = document.getElementById("number-padding");

  if (aSpan && bSpan) {
      const aSpanWidth = aSpan.offsetWidth;
      bSpan.style.paddingLeft = `${aSpanWidth}px`;
  }

  // 시간 표시 (data-timestamp 기반)
  function formatRelativeTime(timestamp) {
      const now = new Date();
      const dateFromTimestamp = new Date(timestamp);

      // 날짜 비교를 위해 시간을 00:00:00으로 정규화
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const targetDate = new Date(dateFromTimestamp.getFullYear(), dateFromTimestamp.getMonth(), dateFromTimestamp.getDate());

      const diffInMilliseconds = targetDate.getTime() - today.getTime();
      // 일 단위 차이 계산 (반올림)
      const diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));

      if (diffInDays === 0) {
          return "today";
      }

      const absDiffDays = Math.abs(diffInDays);
      let count;
      let unit;

      if (absDiffDays < 7) {
          count = absDiffDays;
          unit = count === 1 ? "day" : "days";
      } else if (absDiffDays < 30) { // 약 4주
          count = Math.floor(absDiffDays / 7);
          unit = count === 1 ? "week" : "weeks";
      } else if (absDiffDays < 365) {
          count = Math.floor(absDiffDays / 30); // 한 달을 약 30일로 계산
          unit = count === 1 ? "month" : "months";
      } else {
          count = Math.floor(absDiffDays / 365);
          unit = count === 1 ? "year" : "years";
      }

      return diffInDays > 0 ? `${count} ${unit} left` : `${count} ${unit} ago`;
  }

  document.querySelectorAll('.time[data-timestamp]').forEach(timeElement => {
      const timestamp = timeElement.getAttribute('data-timestamp');
      if (timestamp) {
          timeElement.textContent = formatRelativeTime(timestamp);
      }
  });
});