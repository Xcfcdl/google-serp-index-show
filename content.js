let startIndex = 0;
let currentStyle = {
  backgroundStyle: 'default',
  fontFamily: 'Arial',
  fontColor: '#ffffff'
};

function getStartIndex() {
  const url = new URL(window.location.href);
  const start = url.searchParams.get('start');
  return start ? parseInt(start) : 0;
}

function addRankNumbers() {
  startIndex = getStartIndex();
  const searchResults = document.querySelectorAll("#rso > div:not([jscontroller='Da4hkd']) > div:not(.cUnQKe)");
  searchResults.forEach((result, index) => {
    if (result.querySelector('.rank-number')) return; // 避免重复添加

    const rankNumber = document.createElement('div');
    rankNumber.className = 'rank-number';
    rankNumber.setAttribute('data-number', (startIndex + index + 1).toString().padStart(2, '0'));
    
    applyStyle(rankNumber);
    
    if (result.firstChild && result.firstChild.nodeType === Node.ELEMENT_NODE) {
      result.insertBefore(rankNumber, result.firstChild);
    } else {
      result.appendChild(rankNumber);
    }
  });
}

function applyStyle(element) {
  element.style.fontFamily = currentStyle.fontFamily;
  element.style.color = currentStyle.fontColor;
  if (currentStyle.backgroundStyle === 'circle') {
    element.classList.add('circle-background');
  } else {
    element.classList.remove('circle-background');
  }
}

function updateAllStyles() {
  const rankNumbers = document.querySelectorAll('.rank-number');
  rankNumbers.forEach(applyStyle);
}

// 在页面加载完成后执行
window.addEventListener('load', () => {
  chrome.storage.sync.get(['backgroundStyle', 'fontFamily', 'fontColor'], function(items) {
    currentStyle = {
      backgroundStyle: items.backgroundStyle || 'default',
      fontFamily: items.fontFamily || 'Arial',
      fontColor: items.fontColor || '#ffffff'
    };
    addRankNumbers();
  });
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateStyle") {
    currentStyle = request.style;
    updateAllStyles();
  }
});

// MutationObserver 和 URL 变化监听保持不变
// ...