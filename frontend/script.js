
//Loader animation code
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  const loaderLogo = document.querySelector(".loader p");
  
  //loader without delay
  //loader.classList.add("loader-hidden");
  setTimeout(() => { loader.classList.add("loader-hidden"); console.log("loading...")}, 1000) ;


  setTimeout(() => loaderLogo.classList.add("loader-hidden"), 1000);
  
  loader.addEventListener("transitionend", () => {
    document.body.removeChild(loader);
  });
});

