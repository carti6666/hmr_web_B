// 필요한 전역 변수 선언. 실제 값은 DOMContentLoaded에서 할당됩니다.
let coverContainers;
let mainImage; // 갤러리 기능에 사용될 주 이미지 요소
let profileContainer; // 갤러리 기능에서 마우스leave 이벤트를 감지할 컨테이너
let originalSrc = ""; // 갤러리 이미지 원래 소스
let originalAlt = ""; // 갤러리 이미지 원래 alt 텍스트

// isMobile 함수 (예시: 화면 너비에 따라 모바일 여부 판단)
// 필요에 따라 더 정확한 모바일 감지 로직으로 교체할 수 있습니다.
function isMobile() {
  return window.innerWidth <= 768;
}

// --- 1. 커버 이미지 클릭/탭 상호작용 (아코디언 효과) ---
function initializeCoverImageInteraction() {
  if (!coverContainers || coverContainers.length === 0) {
    // console.warn("'.cover-container' 요소를 찾을 수 없습니다. 커버 이미지 상호작용이 비활성화됩니다.");
    return;
  }

  coverContainers.forEach((container) => {
    const thumbnail = container.querySelector(".thumbnail");
    if (!thumbnail) {
      // console.warn("'.thumbnail' 요소를 찾을 수 없습니다:", container);
      return;
    }

    if (isMobile()) {
      thumbnail.addEventListener("click", (event) => {
        event.preventDefault();
        const isActive = container.classList.contains("active");

        // 먼저 모든 컨테이너를 비활성화합니다.
        coverContainers.forEach((otherContainer) => {
          otherContainer.classList.remove("active");
        });

        // 현재 컨테이너가 이전에 활성 상태가 아니었다면 활성화합니다.
        if (!isActive) {
          container.classList.add("active");
        }
        // 만약 클릭된 컨테이너가 이미 활성 상태였다면, 위 로직에 의해 비활성화된 상태로 유지됩니다. (토글 효과)
        event.stopPropagation(); // document 클릭 리스너의 즉시 실행 방지
      });
    }
    // 참고: 데스크톱 환경에서는 CSS :hover를 사용하는 것이 일반적입니다.
    // 만약 데스크톱에서도 JavaScript로 hover 효과를 제어해야 한다면 여기에 로직을 추가할 수 있습니다.
  });

  // 모바일에서 컨테이너 외부를 클릭하면 모든 활성 컨테이너를 닫습니다.
  if (isMobile()) {
    document.addEventListener("click", (event) => {
      let clickedInsideAContainer = false;
      coverContainers.forEach((container) => {
        if (container.contains(event.target)) {
          clickedInsideAContainer = true;
        }
      });

      if (!clickedInsideAContainer) {
        coverContainers.forEach((container) => {
          container.classList.remove("active");
        });
      }
    });
  }
}

// --- 2. 갤러리 이미지 Hover/Click 전환 (프로필 이미지 등) ---
// 이 기능은 HTML에 'mainImage', '.profile-thumbnail', 'profileContainer' 요소가 정의되어 있을 때 작동합니다.
function swapImage(newSrc, newAlt) {
  if (mainImage) {
    mainImage.src = newSrc;
    mainImage.alt = newAlt;
  } else {
    // console.warn("'mainImage' 요소가 정의되지 않아 이미지를 변경할 수 없습니다.");
  }
}

function resetImage() {
  if (mainImage) {
    if (originalSrc || originalAlt) {
      // originalSrc 또는 originalAlt 중 하나라도 값이 있어야 복원 시도
      mainImage.src = originalSrc;
      mainImage.alt = originalAlt;
    } else {
      // console.warn("'originalSrc' 또는 'originalAlt'가 초기화되지 않았습니다. 이미지를 초기 상태로 복원할 수 없습니다.");
    }
  } else {
    // console.warn("'mainImage' 요소가 정의되지 않아 이미지를 초기 상태로 복원할 수 없습니다.");
  }
}

function initializeProfileImageInteraction() {
  const profileThumbnails = document.querySelectorAll(".profile-thumbnail");

  if (!profileThumbnails.length) {
    // console.log("'.profile-thumbnail' 요소를 찾을 수 없습니다. 갤러리 이미지 상호작용이 비활성화됩니다.");
    return;
  }
  if (!mainImage) {
    // console.log("'mainImage' 요소가 정의되지 않았습니다. 갤러리 이미지 상호작용이 비활성화됩니다.");
    return; // mainImage가 없으면 이 기능은 의미가 없습니다.
  }

  profileThumbnails.forEach((thumbnail) => {
    const imgElement = thumbnail.querySelector("img");
    if (!imgElement) {
      // console.warn("프로필 썸네일에 'img' 요소가 없습니다:", thumbnail);
      return;
    }

    // 견고성을 위해 'data-fullsrc' 와 'data-fullalt' 사용을 권장합니다.
    // 예: <img src="small.jpg" data-fullsrc="large.jpg" alt="작은 설명" data-fullalt="큰 설명">
    const newSrc =
      imgElement.dataset.fullsrc || imgElement.src.replace("-small", "");
    const newAlt =
      imgElement.dataset.fullalt || imgElement.alt.replace("-small", "");

    if (isMobile()) {
      thumbnail.addEventListener("click", (event) => {
        event.preventDefault(); // 썸네일이 <a> 태그일 경우 기본 동작 방지
        swapImage(newSrc, newAlt);
      });
    } else {
      thumbnail.addEventListener("mouseover", () => {
        swapImage(newSrc, newAlt);
      });
    }
  });

  // 데스크톱에서 profileContainer 영역을 벗어나면 원래 이미지로 복원
  if (profileContainer && !isMobile()) {
    profileContainer.addEventListener("mouseleave", resetImage);
  }
}

// --- 3. 'data-href' 또는 'href' 속성을 가진 요소 클릭 시 링크 이동 ---
function initializeDataHrefLinks() {
  // 사용자의 HTML은 <span href="..." class="data-href"> 형태를 사용합니다.
  document
    .querySelectorAll(".data-href, .data-href-outlink")
    .forEach((element) => {
      const hrefValue = element.getAttribute("href"); // <span>의 href 속성 값

      if (hrefValue) {
        element.style.cursor = "pointer";

        element.addEventListener("click", (event) => {
          // event.preventDefault(); // span의 클릭에는 기본 동작이 없으므로 필수 아님
          if (element.classList.contains("data-href-outlink")) {
            window.open(hrefValue, "_blank");
          } else {
            window.location.href = hrefValue;
          }
        });

        // <span> 태그가 링크처럼 동작하도록 접근성 속성 추가
        if (element.tagName.toLowerCase() === "span") {
          element.setAttribute("role", "link");
          element.setAttribute("tabindex", "0"); // 키보드 포커스 가능하도록 설정
          // Enter 또는 Space 키로도 링크가 동작하도록 이벤트 리스너 추가
          element.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault(); // 스페이스바의 기본 스크롤 동작 방지
              element.click(); // 정의된 클릭 이벤트 핸들러 실행
            }
          });
        }
      } else {
        // console.warn("'.data-href' 또는 '.data-href-outlink' 클래스를 가졌지만 'href' 속성이 없는 요소를 발견했습니다:", element);
      }
    });
}

// --- 4. 'timeAgo' 시간 표시 기능 ---
const KOR_SECONDS_IN_MINUTE = 60;
const KOR_SECONDS_IN_HOUR = KOR_SECONDS_IN_MINUTE * 60;
const KOR_SECONDS_IN_DAY = KOR_SECONDS_IN_HOUR * 24;
const KOR_SECONDS_IN_MONTH_APPROX = KOR_SECONDS_IN_DAY * 30; // 월 평균 일수 근사치
const KOR_SECONDS_IN_YEAR_APPROX = KOR_SECONDS_IN_DAY * 365; // 연 평균 일수 근사치

function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (isNaN(diffInSeconds)) {
    return "유효하지 않은 날짜";
  }

  if (diffInSeconds < 0) {
    // 미래 시간 처리
    const futureDiff = Math.abs(diffInSeconds);
    if (futureDiff < KOR_SECONDS_IN_MINUTE) return `${futureDiff}초 후`;
    if (futureDiff < KOR_SECONDS_IN_HOUR)
      return `${Math.floor(futureDiff / KOR_SECONDS_IN_MINUTE)}분 후`;
    // 필요시 시간, 일 단위 미래 표시 추가
    return "미래";
  }

  if (diffInSeconds < 5) {
    // 매우 짧은 시간은 "방금 전"으로 표시
    return "방금 전";
  }
  if (diffInSeconds < KOR_SECONDS_IN_MINUTE) {
    return `${diffInSeconds}seconds ago`;
  }
  if (diffInSeconds < KOR_SECONDS_IN_HOUR) {
    const diffInMinutes = Math.floor(diffInSeconds / KOR_SECONDS_IN_MINUTE);
    return `${diffInMinutes}minutes ago`;
  }
  if (diffInSeconds < KOR_SECONDS_IN_DAY) {
    const diffInHours = Math.floor(diffInSeconds / KOR_SECONDS_IN_HOUR);
    return `${diffInHours}hours ago`;
  }
  if (diffInSeconds < KOR_SECONDS_IN_MONTH_APPROX) {
    const diffInDays = Math.floor(diffInSeconds / KOR_SECONDS_IN_DAY);
    return `${diffInDays}days ago`;
  }
  if (diffInSeconds < KOR_SECONDS_IN_YEAR_APPROX) {
    const diffInMonths = Math.floor(
      diffInSeconds / KOR_SECONDS_IN_MONTH_APPROX
    );
    return `${diffInMonths}months ago`;
  }
  const diffInYears = Math.floor(diffInSeconds / KOR_SECONDS_IN_YEAR_APPROX);
  return `${diffInYears}years ago`;
}

function updateAllTimeAgoElements() {
  const timeAgoElements = document.querySelectorAll(".time-ago");
  timeAgoElements.forEach((element) => {
    const timestamp = element.dataset.timestamp;
    if (timestamp) {
      element.textContent = timeAgo(timestamp);
    } else {
      // console.warn("'.time-ago' 요소에 'data-timestamp' 속성이 없습니다:", element);
    }
  });
}

// --- DOMContentLoaded: 페이지 로드 완료 후 스크립트 실행 ---
document.addEventListener("DOMContentLoaded", () => {
  // 전역 변수로 사용될 DOM 요소들 초기화
  // HTML 구조에 맞게 실제 ID나 클래스로 수정해야 합니다.
  coverContainers = document.querySelectorAll(".cover-container");

  // 갤러리 기능에 필요한 요소들 (HTML에 해당 요소가 없다면 null로 유지됨)
  // 예시: mainImage = document.getElementById('main-display-image');
  // 예시: profileContainer = document.querySelector('.artist-profile-section');

  // mainImage가 실제로 페이지에 존재하고 초기 이미지를 가지고 있을 때 originalSrc/Alt 초기화
  if (mainImage && mainImage.src) {
    // mainImage가 존재하고 src 속성이 있을 때만
    originalSrc = mainImage.src;
    originalAlt = mainImage.alt;
  } else if (mainImage) {
    // mainImage는 있지만 src가 없을 경우
    // console.log("'mainImage'는 존재하지만 'src' 속성이 없어 originalSrc/Alt를 초기화할 수 없습니다.");
  } else {
    // console.log("'mainImage'를 찾을 수 없어 originalSrc/Alt를 초기화할 수 없습니다. 갤러리 이미지 초기화 기능이 제한될 수 있습니다.");
  }

  // 각 기능 초기화 함수 호출
  initializeCoverImageInteraction();
  initializeProfileImageInteraction(); // mainImage, profileContainer 등이 정의된 후 호출되어야 의미가 있음
  initializeDataHrefLinks();

  // 'timeAgo' 업데이트 실행 및 주기적 업데이트 설정
  updateAllTimeAgoElements();
  setInterval(updateAllTimeAgoElements, 60000); // 1분(60000ms)마다 업데이트
});


document.addEventListener('DOMContentLoaded', () => {
  const mainImage = document.getElementById('main-image');
  const thumbnails = document.querySelectorAll('.profile-thumbnail');
  let activeThumbnail = thumbnails[0]; // 초기 활성 썸네일

  function swapImage(newSrc, altText) {
    mainImage.src = newSrc;
    mainImage.alt = altText;
  }

  function resetImage() {
    if (activeThumbnail && activeThumbnail.querySelector('img')) {
      mainImage.src = activeThumbnail.querySelector('img').src;
      mainImage.alt = activeThumbnail.querySelector('img').alt.replace('-small', '');
    }
  }

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('mouseover', () => {
      if (activeThumbnail) {
        activeThumbnail.classList.remove('active');
      }
      thumbnail.classList.add('active');
      activeThumbnail = thumbnail;
      const img = thumbnail.querySelector('img');
      if (img) {
        swapImage(img.src.replace('-small', ''), img.alt.replace('-small', ''));
      }
    });

    // 모바일 클릭 이벤트 처리 (호버 효과 대체)
    thumbnail.addEventListener('click', () => {
      if (window.innerWidth <= 480) {
        if (activeThumbnail) {
          activeThumbnail.classList.remove('active');
        }
        thumbnail.classList.add('active');
        activeThumbnail = thumbnail;
        const img = thumbnail.querySelector('img');
        if (img) {
          swapImage(img.src.replace('-small', ''), img.alt.replace('-small', ''));
        }
      }
    });
  });

  // 초기 이미지 설정
  if (thumbnails.length > 0 && mainImage) {
    thumbnails[0].classList.add('active');
    const initialImageSrc = thumbnails[0].querySelector('img').src.replace('-small', '');
    const initialImageAlt = thumbnails[0].querySelector('img').alt.replace('-small', '');
    swapImage(initialImageSrc, initialImageAlt);
  }

  // onmouseleave 이벤트 핸들러 (초기 이미지로 리셋)
  const profileContainer = document.querySelector('.profile-container');
  if (profileContainer) {
    profileContainer.addEventListener('mouseleave', resetImage);
  }
});

function swapImage(newSrc, altText) {
  const mainImage = document.getElementById('main-image');
  if (mainImage) {
    mainImage.src = newSrc;
    mainImage.alt = altText;
  }
}

function resetImage() {
  const mainImage = document.getElementById('main-image');
  const activeThumbnail = document.querySelector('.profile-thumbnail.active');
  if (mainImage && activeThumbnail && activeThumbnail.querySelector('img')) {
    mainImage.src = activeThumbnail.querySelector('img').src.replace('-small', '');
    mainImage.alt = activeThumbnail.querySelector('img').alt.replace('-small', '');
  } else if (mainImage && document.querySelector('.profile-thumbnail:first-child img')) {
    mainImage.src = document.querySelector('.profile-thumbnail:first-child img').src.replace('-small', '');
    mainImage.alt = document.querySelector('.profile-thumbnail:first-child img').alt.replace('-small', '');
  }
}