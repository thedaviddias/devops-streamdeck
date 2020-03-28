let websocket = null,
  uuid = null,
  actionInfo = {};

function connectElgatoStreamDeckSocket(
  inPort,
  inUUID,
  inRegisterEvent,
  inInfo,
  inActionInfo
) {
  uuid = inUUID;
  actionInfo = JSON.parse(inActionInfo); // cache the info

  if (actionInfo.payload && actionInfo.payload.settings) {
    Object.keys(actionInfo.payload.settings).forEach(
      key =>
        (document.getElementById(key).value = actionInfo.payload.settings[key])
    );
  }
  websocket = new WebSocket("ws://localhost:" + inPort);

  websocket.onopen = function() {
    const json = {
      event: inRegisterEvent,
      uuid: inUUID
    };
    websocket.send(JSON.stringify(json));
  };
}

function onValueChange(value, id) {
  actionInfo.payload.settings = {
    ...actionInfo.payload.settings,
    [id]: value
  };

  const json = {
    action: actionInfo.action,
    event: "setSettings",
    context: uuid,
    payload: actionInfo.payload.settings
  };

  websocket.send(JSON.stringify(json));
}

document.getElementById("github")?.addEventListener("click", () => {
  const json = {
    event: "openUrl",
    payload: {
      url: "https://github.com/SantiMA10/devops-streamdeck#how-it-works"
    }
  };

  websocket.send(JSON.stringify(json));
});

Array.from(document.getElementsByTagName("input")).forEach(input =>
  input.addEventListener("keyup", event => {
    if (!event.target) {
      return;
    }

    onValueChange(event.target.value, event.target.id);
  })
);

module.exports = connectElgatoStreamDeckSocket;
