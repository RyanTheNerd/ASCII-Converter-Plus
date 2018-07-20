function submitArt() {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", '#', true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {//Call a function when the state changes.
      if(this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        let currentHost = new URL(document.URL).host;

        artURL = `${currentHost}/${xhr.responseText}`;
      }
  }
  xhr.send(artToJson()); 
}

function artToJson() {
  let art = {
    width: ascii.width,
    height: ascii.height,
    fontSize: fontSize,
    ibmMode: ibmMode,
    setIndex: setIndex,
    data: asciiArt
  }
  return JSON.stringify(art);
}
