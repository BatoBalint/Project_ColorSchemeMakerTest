class ColorRow {
  colorPickerId = 0;
  baseColor = "#006bbb";
  inputList = [];
  easyInputList = [];
  constructor(index) {
    this.index = index;
    this.parentDiv = document.getElementById('rowsDiv');

    this.rowDiv = document.createElement('div');
    this.rowDiv.classList.add('row', 'p-3', 'mb-5', 'border', 'rounded', 'overflow-auto', 'colorRow');
    this.rowDiv.id = 'colorsDiv' + this.index;

    let deleteDiv = document.createElement('div');
    deleteDiv.classList.add('mb-2');

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-danger', 'fs-6', 'pb-0', 'pt-0', 'px-2');
    deleteBtn.addEventListener('click', () => { removeColorsRowBtn(this.index); });
    deleteBtn.innerHTML = 'X';



    let plusBtnDiv = document.createElement('div');
    plusBtnDiv.classList.add('colorInput', 'p-2');

    let plusBtn = document.createElement('button');
    plusBtn.classList.add('btn', 'btn-secondary', 'w-100', 'h-100', 'fs-1', 'pt-0');
    plusBtn.name = `${index}`;
    plusBtn.innerHTML = '+';

    plusBtn.addEventListener('click', (e) => { this.addInput(this.index); });



    let minusBtnDiv = document.createElement('div');
    minusBtnDiv.classList.add('colorInput', 'p-2');

    let minusBtn = document.createElement('button');
    minusBtn.classList.add('btn', 'btn-secondary', 'w-100', 'h-100', 'fs-1', 'pt-0');
    minusBtn.name = `${index}`;
    minusBtn.innerHTML = '-';

    minusBtn.addEventListener('click', (e) => { this.removeInput(this.index); });



    plusBtnDiv.appendChild(plusBtn);
    minusBtnDiv.appendChild(minusBtn);
    deleteDiv.appendChild(deleteBtn);

    this.rowDiv.appendChild(deleteDiv);
    this.rowDiv.appendChild(minusBtnDiv);
    this.rowDiv.appendChild(plusBtnDiv);
  }

  addInput(index) {
    let input = document.createElement('input');
    input.type = 'color';
    input.value = baseColor;
    input.name = this.colorPickerId;
    input.classList.add('colorInput');
    input.addEventListener('input', (e) => {
      this.easyInputList[input.name] = e.target.value;
      sendInput(e, this.index);
    });
    this.inputList.push(input);
    this.easyInputList.push(this.baseColor);
    this.rowDiv.children[this.rowDiv.childElementCount - 2].insertAdjacentElement("beforebegin", input);
    this.colorPickerId++;
    if (index != -1) {
      sendAddColorpicker(this.index);
    }
  }

  removeInput(index) {
    if (this.colorPickerId > 0) {
      let id = this.colorPickerId;
      this.inputList.pop();
      this.easyInputList.pop();
      this.rowDiv.removeChild(this.rowDiv.children[id]);
      this.colorPickerId--;
    }
    if (index != -1) {
      sendRemoveColorpicker(this.index);
    }
  }

  addToHTML() {
    this.parentDiv.children[this.parentDiv.childElementCount - 1].insertAdjacentElement("beforebegin", this.rowDiv);
  }

  reindex(index) {
    this.index = index;
  }
}
