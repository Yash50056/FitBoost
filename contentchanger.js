var currentContentContentchanger = 'New';

function showContentContentchanger(contentName) {
  if (currentContentContentchanger === contentName) {
    return;
  }

  var contents = document.querySelectorAll('.content-contentchanger');

  contents.forEach(function (content) {
    content.classList.remove('active-contentchanger', 'left-contentchanger', 'right-contentchanger');
  });

  if (contentName === 'New') {
    contents[0].classList.add('active-contentchanger');
    contents[1].classList.add('left-contentchanger');
    contents[2].classList.add('right-contentchanger');
    contents[3].classList.add('right-contentchanger');
  } else if (contentName === 'Joined') {
    contents[1].classList.add('active-contentchanger');
    contents[0].classList.add('left-contentchanger');
    contents[2].classList.add('right-contentchanger');
    contents[3].classList.add('right-contentchanger');
  } else if (contentName === 'Completed') {
    contents[2].classList.add('active-contentchanger');
    contents[0].classList.add('left-contentchanger');
    contents[1].classList.add('right-contentchanger');
    contents[3].classList.add('right-contentchanger');
  } else if (contentName === 'Features') {
    contents[3].classList.add('active-contentchanger');
    contents[0].classList.add('left-contentchanger');
    contents[1].classList.add('right-contentchanger');
    contents[2].classList.add('right-contentchanger');
  }

  currentContentContentchanger = contentName;
}