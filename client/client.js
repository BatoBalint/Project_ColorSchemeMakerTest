var sessionId;
var colorsDiv;
var baseColor = "#006bbb";
let rowsList = [];

document.addEventListener('DOMContentLoaded', () => {
  colorsDiv = document.getElementById('colorsDiv');
});

const writeToChat = (text) => {
  let chatUl = document.getElementById('chatUl');
  let chatDiv = document.getElementById('chatDiv')
  let message;

  if(text.substring(0, 4) == 'http') {
    message = document.createElement('a');

    message.innerHTML = text;
    message.href = text;
    message.target = '_blank';
    message.classList.add('list-group-item', 'bg-dark', 'text-danger');
  } else {
    message = document.createElement('li');

    message.innerHTML = text;
    message.classList.add('list-group-item', 'bg-dark', 'text-light');
  }



  chatUl.appendChild(message);
  chatDiv.scrollTo(0,chatDiv.scrollHeight);
}

const onFormSubmitted = (e) => {
  e.preventDefault();

  let input = document.getElementById('chatInput');
  let text = input.value;
  input.value = '';

  if (text.trim() != '') {
    let data = {"id": sessionId, "text": text};
    sock.emit('message', data);
  }
};



// #region rows

let rowsIndex = 0;

const addColorsRowBtn = () => {
  addColorsRow();
  let data = {'id': sessionId};
  sock.emit('addRow', data);
};

const addColorsRow = () => {
  rowsList.push(new ColorRow(rowsIndex))
  rowsList[rowsIndex].addToHTML();
  /*rowsList[rowsIndex] = new ColorRow(rowsIndex);
  rowsList[rowsIndex].addToHTML();*/
  rowsIndex++;
};

const removeColorsRowBtn = (index) => {
  removeColorsRow(index);
  let data = {'id': sessionId, 'rowId': index};
  sock.emit('removeRow', data);
};

const removeColorsRow = (index) => {
  let rowsDiv = document.getElementById('rowsDiv');
  rowsDiv.removeChild(rowsList[index].rowDiv);
  rowsList.splice(index, 1);
  rowsIndex--;
  for (i in rowsList) {
    rowsList[i].reindex(i);
  }
};

const receivedAddColorsRow = (data) => {
  if (data['id'] != sessionId) {
    addColorsRow();
  }
};

const receivedRemoveColorsRow = (data) => {
  if (data['id'] != sessionId) {
    removeColorsRow(data['rowId']);
  }
};

// #endregion

// #region colorpickers

const sendAddColorpicker = (index) => {
  let data = {'id': sessionId, 'rowId': index};
  sock.emit('addColorpicker', data);
};

const receivedAddColorpicker = (data) => {
  if (data['id'] != sessionId) {
    rowsList[data['rowId']].addInput(-1);
  }
}

const sendRemoveColorpicker = (index) => {
  let data = {'id': sessionId, 'rowId': index};
  sock.emit('removeColorpicker', data);
};

const receivedRemoveColorpicker = (data) => {
  if (data['id'] != sessionId) {
    rowsList[data['rowId']].removeInput(-1);
  }
};

// #endregion

function changeColor(data) {
  if (data['id'] != sessionId) {
    let elements = rowsDiv.children[[data['rowId']]];
    elements.children[parseInt(data['colorId']) + 1].value = data['color'];
  }
}

const checkColorList = (data) => {
  if (data['id'] != sessionId) {
    console.log(data);
    let sentRows = data['rowsList'];
    let diff = sentRows.length - rowsList.length;

    if (diff >= 0) {
      for (let i = 0; i < diff; i++) {
        addColorsRow();
      }
      for (let rows in rowsList) {
        console.log(sentRows[rows].easyInputList);
        console.log(rowsList[rows].easyInputList);
        console.log(sentRows[rows].easyInputList.length - rowsList[rows].easyInputList.length);
        let inputDiff = sentRows[rows].easyInputList.length - rowsList[rows].easyInputList.length;
        for (let i = 0; i < inputDiff; i++) {
          rowsList[rows].addInput(-1);
        }
        for (let i = 0; i < rowsList[rows].easyInputList.length; i++) {
          rowsList[rows].inputList[i].value = sentRows[rows].easyInputList[i];
          rowsList[rows].easyInputList[i] = sentRows[rows].easyInputList[i];
        }
      }
    }
  }
};

const convertList = () => {
  let list = [];
  for (let i in rowsList) {
    list[i + ''] = rowsList[i];
  }
  console.log(list);
  return list;
};



// #region communication with server

const sendInput = (e, index) => {
  let id = e.target.name;
  let color = e.target.value;
  let data = {'id': sessionId, 'rowId': index, 'colorId': id, 'color': color};
  sock.emit('colorChange', data);
};

const sock = io();

sock.on('id', (id) => {
  sessionId = id;
  sock.emit('clientRequestsColors');
});

sock.on('serverRequestsColors', () => {
  let data = {'id': sessionId, 'rowsList': rowsList};
  sock.emit('clientSendsColors', data);
});

sock.on('serverSendsColors', (data) => {
  checkColorList(data);
});

sock.on('message', (data) => {
  writeToChat(data['text']);
});

sock.on('colorChange', (data) => {
  changeColor(data);
});

sock.on('addColorpicker', (data) => {
  receivedAddColorpicker(data);
});

sock.on('removeColorpicker', (data) => {
  receivedRemoveColorpicker(data);
});

sock.on('addRow', (data) => {
  receivedAddColorsRow(data);
});

sock.on('removeRow', (data) => {
  receivedRemoveColorsRow(data);
});

document.getElementById('chatForm').addEventListener('submit', onFormSubmitted);

// #endregion
