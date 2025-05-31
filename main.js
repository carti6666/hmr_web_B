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