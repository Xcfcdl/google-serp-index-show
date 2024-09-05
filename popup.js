document.addEventListener('DOMContentLoaded', function() {
  // 替换所有带有 __MSG_ 前缀的文本
  document.body.innerHTML = document.body.innerHTML.replace(
    /__MSG_(\w+)__/g,
    function(match, v1) {
      return chrome.i18n.getMessage(v1);
    }
  );

  // 加载保存的设置
  chrome.storage.sync.get(['backgroundStyle', 'fontFamily', 'fontColor'], function(items) {
    document.getElementById('background-style').value = items.backgroundStyle || 'default';
    document.getElementById('font-family').value = items.fontFamily || 'Arial';
    document.getElementById('font-color').value = items.fontColor || '#ffffff';
  });

  // 保存设置
  document.getElementById('save-settings').addEventListener('click', function() {
    var backgroundStyle = document.getElementById('background-style').value;
    var fontFamily = document.getElementById('font-family').value;
    var fontColor = document.getElementById('font-color').value;

    chrome.storage.sync.set({
      backgroundStyle: backgroundStyle,
      fontFamily: fontFamily,
      fontColor: fontColor
    }, function() {
      // 通知内容脚本更新样式
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateStyle",
          style: {backgroundStyle, fontFamily, fontColor}
        });
      });
    });
  });
});