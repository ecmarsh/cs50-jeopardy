export default function(page) {
  let title;
  switch (page) {
    case 1:
      title = 'Single';
      break;
    case 2:
      title = 'Double';
      break;
    case 3:
      title = 'Final';
      break;
    default:
      title = 'CS50';
  }

  return title + ' Jeopardy';
}
