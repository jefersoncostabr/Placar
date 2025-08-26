// No lado do cliente
fetch('/logout')
  .then(() => {
    window.close();
  })
  .catch((error) => {
    console.error(error);
  });