class GridController {
  constructor({lightActiveTime = 3000, levelActiveTime = 10000, scoreBoundary = 1, levels = 2 } = {}) {
    Object.assign(this, {
      lightActiveTime,
      levelActiveTime,
      scoreBoundary,
      levels,
      score: 0,
      randomCell: 0,
      gridSize: 3,
      currentGlowTimeout: 0,
      currentLevel: 0,
    });
  }

  formGrid(rows = 3, cols = 3) {
    if(this.currentLevel > this.levels){
      alert('You won!');
      return false;
    }
    const totalCells = rows * cols;
    this.randomCell = this.selectRandomCell(0, totalCells);
    document.getElementById('fk-grid-wrapper__container').innerHTML = this.getTemplate(totalCells, this.randomCell);
    clearTimeout(this.currentGlowTimeout);
    this.currentGlowTimeout = setTimeout(() => this.handleGlowTimer(), this.lightActiveTime);
  }

  getTemplate(totalCells = 9, randomCell = 0) {
    const _getCellTemplate = (index = 0, className = '') => `<div data-cell="data-cell-${index}" class="${className} ${index === randomCell ? 'glow' : ''}">${className}</div>`;
    return Array(totalCells).fill('').reduce( (acc, currEle, index) => acc + _getCellTemplate(index, 'fk-grid-cell'), '');
  }

  selectRandomCell(minimum = 0, maximum = 0) {
    const min = Math.ceil(minimum);
    const max = Math.floor(maximum);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  checkCell(event = {}) {
    event.preventDefault();
    event.stopPropagation();
    const className = event.target.getAttribute('class');
    if( className && className.indexOf('glow') > -1 ) {
      this.incrementScore();
      this.formGrid(this.gridSize,this.gridSize);
    } else {
      this.decrementScore();
      this.formGrid(this.gridSize,this.gridSize);
    }
  }

  incrementScore() {
    this.score = this.score + 1;
  }

  decrementScore() {
    this.score = this.score - 1;
  }

  handleGlowTimer() {
    this.formGrid(this.gridSize,this.gridSize);
  }

  handleLevelTimer() {
    if(this.score < this.scoreBoundary){
      alert('stop playing bitch, GAME OVER!');
    } else {
      alert('Moving to next level');
      this.currentLevel = this.currentLevel + 1;
      this.gridSize = this.gridSize + 1;
      document.documentElement.style.setProperty("--gridSize", this.gridSize);
      this.formGrid(this.gridSize,this.gridSize);
      setTimeout(() => this.handleLevelTimer(), this.levelActiveTime);
    }
  }

}


(() => {
  console.log('Initializing game sequence');
  const gridController = new GridController();
  gridController.formGrid();
  const containerEventListener = document.getElementById('fk-grid-wrapper__container');
  containerEventListener.addEventListener('click', event => {
    gridController.checkCell(event);
  });
  setTimeout(() => gridController.handleLevelTimer(), gridController.levelActiveTime);
})();