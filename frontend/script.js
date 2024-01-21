//Loader animation code
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");

  //loader without delay
  //loader.classList.add("loader-hidden");
  setTimeout(() => { loader.classList.add("loader-hidden"); console.log("loading...")}, 1000) ;

  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});