export const printIframe = (id) => {
  const iframe = document.hasOwnProperty('frames') ? document.frames[id] : document.getElementById(id);
  const iframeWindow = iframe.contentWindow || iframe;

  iframe.focus();
  iframeWindow.print();

  return false;
};