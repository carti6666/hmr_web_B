document.addEventListener('DOMContentLoaded', function() {
  const releaseDateSpan = document.getElementById('release-date');

  const targetDateString = releaseDateSpan.dataset.date;

  const targetDate = new Date(targetDateString);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let resultText = '';

  if (diffDays === 0) {
      resultText = 'Out Now';
  } else if (diffDays > 0) {
      resultText = `+${diffDays} days`;
  } else {
      resultText = `${diffDays} days`;
  }

  releaseDateSpan.textContent += ` ${resultText}`;
});

function setViewportHeightProperty() {
  // window.innerHeight는 주소 표시줄 등을 제외한 실제 보이는 뷰포트 높이입니다.
  let vh = window.innerHeight * 0.01;
  // 계산된 vh 값을 CSS 변수로 설정
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 초기 로드 시 설정
setViewportHeightProperty();

// 창 크기가 변경될 때마다 다시 설정 (특히 모바일에서 주소 표시줄 나타날 때)
window.addEventListener('resize', setViewportHeightProperty);
window.addEventListener('orientationchange', setViewportHeightProperty); // 화면 방향 변경 시