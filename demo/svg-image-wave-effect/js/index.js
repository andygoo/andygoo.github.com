const filterFeImage = document.querySelector("#f feImage");
const xlink = "http://www.w3.org/1999/xlink";

let displacement = 0;
let speed = 0.2;

function setXlinkHref() {
  /*
  <svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width="300" height="300">
  <defs>
    <radialGradient id="rg" r=".9"> 
  */
  let xlinkHref =
    "data:image/svg+xml;utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='300' height='300'%3E%3Cdefs%3E%3CradialGradient id='rg' r='.9'%3E";
  /*
      <stop offset='0%' stop-color='#f00'></stop>
      <stop offset='10% 'stop-color='#000'></stop>
      <stop offset='20%' stop-color='#f00'></stop>
      <stop offset='30%' stop-color='#000'></stop>
      <stop offset='40%' stop-color='#f00'></stop>
      <stop offset='50%' stop-color='#000'></stop>
      <stop offset='60%' stop-color='#f00'></stop>
      <stop offset='70%' stop-color='#000'></stop>
      <stop offset='80% 'stop-color='#f00'></stop>
      <stop offset='90%' stop-color='#f00'></stop> 
      <stop offset='100%' stop-color='#f00'></stop>
*/
  for (var i = 0; i < 11; i++) {
    xlinkHref += `%3Cstop 
                offset='${(i - 2) * 10 + displacement}%25' 
                stop%2Dcolor='%23${i % 2 == 0 ? "f00" : "000"}'%3E%3C/stop%3E`;
  }

  /*
</radialGradient> 
<rect id="witness" width="300" height="300" fill="url(#rg)"></rect>*/

  xlinkHref +=
    "%3C/radialGradient%3E%3C/defs%3E%3Crect id='witness' width='300' height='300' fill='url(%23rg)'%3E%3C/rect%3E%3C/svg%3E";

  return xlinkHref;
}

function AnimateOffset() {
  let xlinkHref = setXlinkHref();
  filterFeImage.setAttributeNS(xlink, "href", xlinkHref);
  ripples.setAttributeNS(xlink, "href", xlinkHref);

  if (displacement <= 20) {
    displacement += speed;
  } else {
    displacement = 0;
  }

  window.requestAnimationFrame(AnimateOffset);
}

window.requestAnimationFrame(AnimateOffset);